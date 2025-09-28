import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ArticleStatus } from 'src/common/enums';

export class ArticleRdo {
    @ApiProperty({
        description: 'Идентификатор статьи',
        example: '226fc894-140f-47a0-9067-bf738120dc3f',
    })
    @Expose()
    id: string;

    @ApiProperty({
        description: 'Название статьи',
        example: 'Статья о важном'
    })
    @Expose()
    name: string;

    @ApiProperty({
        description: 'Описание статьи',
        example: 'Длинное описание статьи'
    })
    @Expose()
    description: string | null;

    @ApiProperty({
        description: 'Статус статьи',
        example: ArticleStatus.Published,
    })
    @Expose()
    status: ArticleStatus;

    @ApiProperty({
        description: 'Дата и время публикации статьи',
        example: '2025-09-27T21:00:00.000Z'
    })
    @Expose()
    publishedAt: Date | null;

    @ApiProperty({
        description: 'Идентификатор автора статьи',
        example: '16fec02b-670e-46a7-9d6c-55d2e18bb0a3'
    })
    @Expose()
    authorId: string;

    @ApiProperty({
        description: 'Дата и время последнего обновления статьи',
        example: '2025-09-27T21:45:00.000Z'
    })
    @Expose()
    updatedAt: Date;
}