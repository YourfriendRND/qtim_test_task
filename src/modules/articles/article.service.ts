import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Article } from './entities/article.entity';
import { ArticleFilterQueryDto, CreateArticleDto, UpdateArticleDto } from './dto';
import { IArticle, IUserSession } from 'src/common/types';
import { ArticleStatus } from 'src/common/enums';
import { CacheService } from '../cache/cache.service';
import redisConfig from 'src/config/redis.config';
import { ConfigType } from '@nestjs/config';

const MAX_LIMIT = 250;

@Injectable()
export class ArticleService {
    private readonly logger = new Logger(ArticleService.name);

    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
        private readonly cacheService: CacheService,
        @Inject(redisConfig.KEY)
        private readonly config: ConfigType<typeof redisConfig>
    ) {}

    private findMyArticle(id: string, userId: string): Promise<IArticle> {
       return this.articleRepository.findOne({
            where: {
                id,
                author: {
                    id: userId,
                }
            },
        });
    }

    private generateFindCacheKey(queryDto: ArticleFilterQueryDto, user?: IUserSession | null): string {
        const {
            page,
            limit,
            status,
            authorId = null,
            publishedFrom = null,
            publishedTo = null,
            query = '',
        } = queryDto;

        const userId = user?.id || 'anonymous';

        const keyParts = [
            ArticleService.name,
            this.find.name,
            userId,
            `page:${page}`,
            `limit:${limit}`,
            `status:${status}`,
            authorId ? `author:${authorId}` : 'author:all',
            publishedFrom ? `from:${publishedFrom}` : 'from:none',
            publishedTo ? `to:${publishedTo}` : 'to:none',
            query ? `q:${query.toLowerCase().trim().replace(/\s+/g, '_')}` : 'q:none'
        ];

        return keyParts.join(':');
    }

    private generateFindByIdCacheKey(id: string, user?: IUserSession | null): string {
        const userId = user?.id || 'anonymous';
        return `${ArticleService.name}:${this.findById.name}:${userId}:${id}`;
    }

    async find(
        queryDto: ArticleFilterQueryDto, 
        user?: IUserSession | null
    ): Promise<[IArticle[], number]> {
        const {
            page,
            limit,
            status,
            authorId = null,
            publishedFrom = null,
            publishedTo = null,
            query = '',
        } = queryDto;

        const cacheKey = this.generateFindCacheKey(queryDto, user);

        const cached = await this.cacheService.findRecord<[IArticle[], number]>(cacheKey);
        if (cached) {
            this.logger.debug(`Cache hit for key: ${cacheKey}`);
            return cached;
        }

        const take = Math.min(limit, MAX_LIMIT);
        const skip = Math.max(page - 1, 0) * take;

        const articleQueryBuilder = this.articleRepository.createQueryBuilder('article')
        .where('article.status = :status', { status })
        .skip(skip)
        .take(take)

        
        if (status === ArticleStatus.Draft) {        
            if (!user?.id) {
                return [[], 0];
            } else {
                articleQueryBuilder.andWhere('article.author = :userId', { userId: user.id })
                .orderBy('article.createdAt', 'DESC');
            }
        } else {
            articleQueryBuilder.orderBy('article.publishedAt', 'DESC');;

            if (authorId) {
                articleQueryBuilder.andWhere('article.authorId = :authorId', { authorId });
            }
        }

        if (publishedFrom || publishedTo) {
            let from = publishedFrom;
            let to = publishedTo;

            if (publishedFrom && publishedTo && publishedFrom > publishedTo) {
                from = publishedTo;
                to = publishedTo;
                
                this.logger.warn(`Filter by published datetime, from > to, so it will have same value`);
            }
            
            if (from && to) {
                articleQueryBuilder.andWhere('article.publishedAt BETWEEN :from AND :to', {
                    from,
                    to
                });
            } else if (from) {
                articleQueryBuilder.andWhere('article.publishedAt >= :from', { from });
            } else if (to) {
                articleQueryBuilder.andWhere('article.publishedAt >= :to', { to });
            }
        }

        if (query) {
            articleQueryBuilder.andWhere('article.name ILIKE :query OR article.description ILIKE :query', {
                query: `%${query.toLowerCase().trim()}%`
            })
        }

        const result = await articleQueryBuilder.getManyAndCount();
        
        await this.cacheService.insertRecord(cacheKey, result, this.config.ttl);

        return result;

    }

    async findById(id: string, user?: IUserSession | null): Promise<IArticle> {
        const cacheKey = this.generateFindByIdCacheKey(id, user);
        const cached = await this.cacheService.findRecord<IArticle>(cacheKey);
        
        if (cached) {
            console.log(cacheKey)
            this.logger.debug(`Cache hit for key: ${cacheKey}`);
            return cached;
        }
        
        const article = await this.articleRepository.findOne({
            where: {
                id,
            },
            relations: {
                author: true,
            },
        });

        if (!article) {
            throw new NotFoundException(`Article with id: ${id} not found`);
        }

        if (article.status === ArticleStatus.Draft && article.author.id !== user?.id) {
            throw new NotFoundException(`Article with id: ${id} not found`);
        }

        await this.cacheService.insertRecord(cacheKey, article, this.config.ttl);
        
        return article;
    }

    async create(dto: CreateArticleDto, user: IUserSession): Promise<IArticle> {
        return this.articleRepository.save({
            ...dto,
            publishedAt: dto.status === ArticleStatus.Published ? new Date() : null,
            author: {
                id: user.id,
            }
        });
    }

    async update(id: string, dto: UpdateArticleDto, user: IUserSession): Promise<IArticle> {
        const article = await this.findMyArticle(id, user.id);

        if (!article) {
            throw new NotFoundException(`Article with id: ${id} not found`); 
        }

        const updatedArticle = this.articleRepository.merge(article, dto);

        if (dto.status === ArticleStatus.Draft) {
            updatedArticle.publishedAt = null;
        } else {
            updatedArticle.publishedAt = new Date();
        }

        return this.articleRepository.save(updatedArticle);
    }

    async delete(id: string, user: IUserSession): Promise<string> {
        const article = await this.findMyArticle(id, user.id);

        if (!article) {
            throw new NotFoundException(`Article with id: ${id} not found`); 
        }

        await this.articleRepository.remove(article);

        return id;
    }
}
