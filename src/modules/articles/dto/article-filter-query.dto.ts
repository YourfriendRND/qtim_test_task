import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

import { ArticleStatus } from 'src/common/enums';

export class ArticleFilterQueryDto {
    @ApiPropertyOptional({
        description: 'Номер выгружаемой страницы',
        example: 3,
        default: 1,
    })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => value && !isNaN(Number(value)) ? Number(value) : undefined)
    page?: number = 1;
    
    @ApiPropertyOptional({
        description: 'Количество выгружаемых элементов на странице',
        example: 25,
        default: 10,
    })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => value && !isNaN(Number(value)) ? Number(value) : undefined)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Статус выгружаемых статей',
        enum: ArticleStatus,
        default: ArticleStatus.Published,
    })
    @IsOptional()
    @IsEnum(ArticleStatus)
    status?: ArticleStatus = ArticleStatus.Published;

    @ApiPropertyOptional({
        description: 'Фильтр по id автора статьи',
        example: '0345f164-4260-4f07-ab77-68b3d07aabaa'
    })
    @IsOptional()
    @IsUUID('all')
    authorId?: string;

    @ApiPropertyOptional({
        description: 'Фильтр по дате и времени публикации, дата и время начала фильтра',
        example: '2025-09-27T12:00:00.000',
    })
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : undefined, { toClassOnly: true })
    publishedFrom?: Date;

    @ApiPropertyOptional({
        description: 'Фильтр по дате и времени публикации, дата и время конца фильтра',
        example: '2025-09-29T10:00:00.000',
    })
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => value ? new Date(value) : undefined, { toClassOnly: true })
    publishedTo?: Date;

    @ApiPropertyOptional({
        description: 'Поиск статьи по заголовку или описанию',
        example: 'важная статья'
    })
    @IsOptional()
    @IsString()
    query?: string;
}