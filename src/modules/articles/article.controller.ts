import { 
    ApiBody, 
    ApiCreatedResponse, 
    ApiForbiddenResponse, 
    ApiNotFoundResponse, 
    ApiOkResponse, 
    ApiOperation, 
    ApiParam, 
    ApiQuery 
} from '@nestjs/swagger';
import { 
    Controller, 
    Delete, 
    Get, 
    Param, 
    ParseUUIDPipe, 
    Patch, 
    Post, 
    Query, 
    Body, 
    HttpCode, 
    HttpStatus 
} from '@nestjs/common';

import { JWTGuard, UserRequest } from 'src/common/decorators';
import { CommonRdo, IUserSession } from 'src/common/types';
import { ArticleFilterQueryDto, CreateArticleDto, UpdateArticleDto } from './dto';
import { ArticleListRdo, ArticleRdo } from './rdo';
import { ArticleService } from './article.service';
import { JwtStrategies } from 'src/common/enums';
import { fillResponseDto } from 'src/common/utils';

@Controller('/articles')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService
    ) {}

    @ApiOperation({
        summary: 'Получение списка статей по фильтру. Получение списка только собственных черновиков'
    })
    @ApiQuery({
        name: 'Параметры фильтров и пагинации',
        type: ArticleFilterQueryDto
    })
    @ApiOkResponse({
        description: 'Список статей',
        type: ArticleListRdo
    })
    @JWTGuard(JwtStrategies.OptionalAccess)
    @Get()
    async findAll(
        @Query() filterQueryDto: ArticleFilterQueryDto,
        @UserRequest() user: IUserSession
    ): Promise<ArticleListRdo> {
        const [data, count] = await this.articleService.find(filterQueryDto, user);
        
        return fillResponseDto(ArticleListRdo, { data, count });
    }

    @ApiOperation({
        summary: 'Получение конкретной статьи по id (если черновик то, только свой)'
    })
    @ApiParam({
        name: 'id',
        example: 'f5149bdb-e605-4742-a8b5-2c99037bc76c',
        description: 'Идентификатор статьи',
    })
    @ApiOkResponse({
        description: 'Данные найденной статьи',
        type: ArticleRdo,
    })
    @ApiNotFoundResponse({
        description: 'Статья по идентификатору не найдена',
        example: 'Article with id: f5149bdb-e605-4742-a8b5-2c99037bc76c not found'
    })
    @JWTGuard(JwtStrategies.OptionalAccess)
    @Get('/:id')
    async findById(
        @Param('id', ParseUUIDPipe) id: string,
        @UserRequest() user: IUserSession | null
    ): Promise<ArticleRdo> {
        const article = await this.articleService.findById(id, user);

        return fillResponseDto(ArticleRdo, article);
    }

    @ApiOperation({
        summary: 'Создание статьи'
    })
    @ApiBody({
        description: 'Набор данных для создания статьи',
        type: CreateArticleDto
    })
    @ApiCreatedResponse({
        description: 'Новая статья успешно добавлена',
        type: ArticleRdo,
    })
    @JWTGuard()
    @Post()
    async create(
        @UserRequest() user: IUserSession,
        @Body() dto: CreateArticleDto,
    ): Promise<ArticleRdo> {
        const article = await this.articleService.create(dto, user);

        return fillResponseDto(ArticleRdo, article);
    }

    @ApiOperation({
        summary: 'Обновление статьи'
    })
    @ApiParam({
        name: 'id',
        example: 'f5149bdb-e605-4742-a8b5-2c99037bc76c',
        description: 'Идентификатор обновляемой статьи',
    })
    @ApiBody({
        description: 'Набор обновляемых данных',
        type: UpdateArticleDto
    })
    @ApiOkResponse({
        description: 'Статья успешно обновлена',
        type: ArticleRdo,
    })
    @ApiForbiddenResponse({
        description: 'Запрещено обновлять статью другого пользователя',
        example: 'Forbidden. You cannot update other author article'
    })
    @ApiNotFoundResponse({
        description: 'Статья по идентификатору не найдена',
        example: 'Article with id: f5149bdb-e605-4742-a8b5-2c99037bc76c not found'
    })
    @JWTGuard()
    @Patch('/:id')
    async update(
        @UserRequest() user: IUserSession,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateArticleDto
    ): Promise<ArticleRdo> {
        const updatedArticle = await this.articleService.update(id, dto, user);

        return fillResponseDto(ArticleRdo, updatedArticle);
    }

    @ApiOperation({
        summary: 'Удаление статьи'
    })
    @ApiParam({
        name: 'id',
        example: 'f5149bdb-e605-4742-a8b5-2c99037bc76c',
        description: 'Идентификатор удаляемой статьи',
    })
    @ApiOkResponse({
        description: 'Статья была успешно удалена',
        type: CommonRdo,
    })
    @ApiForbiddenResponse({
        description: 'Запрещено удалять статью другого пользователя',
        example: 'Forbidden. You cannot delete other author article'
    })
    @ApiNotFoundResponse({
        description: 'Статья по идентификатору не найдена',
        example: 'Article with id: f5149bdb-e605-4742-a8b5-2c99037bc76c not found'
    })
    @JWTGuard()
    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    async delete(
        @UserRequest() user: IUserSession,
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<CommonRdo> {
        const deletedId = await this.articleService.delete(id, user);

        return fillResponseDto(CommonRdo, {
            message: `Article with id: ${deletedId} has been deleted`,
        })
    }
}