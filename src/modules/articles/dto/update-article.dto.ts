import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { ValidateIf, IsString, IsNotEmpty } from 'class-validator';

import { CreateArticleDto } from './create-article.dto';
import { ArticleStatus } from 'src/common/enums';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
    @ApiProperty({
        description: 'Описание статьи. Допускается пустое значение при создании черновика',
        example: 'Длинное описание интересной статьи'
    })
    @ValidateIf((value: UpdateArticleDto) => value.status === ArticleStatus.Published)
    @IsString()
    @IsNotEmpty()
    description?: string;
}
