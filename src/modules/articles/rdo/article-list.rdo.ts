import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { ArticleRdo } from './article.rdo';

export class ArticleListRdo {
    @ApiProperty({
        description: 'Список статей',
    })
    @Expose()
    @Type(() => ArticleRdo)
    data: ArticleRdo[];

    @ApiProperty({
        description: 'Счетчик статей в текущем фильтре',
        example: 45
    })
    @Expose()
    count: number;
}