import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, ValidateIf, IsEnum, IsNotEmpty } from 'class-validator';
import { ArticleStatus } from 'src/common/enums';

export class CreateArticleDto {
    @ApiProperty({
        description: 'Название создаваемой статьи',
        example: 'Важная статья №1'
    })
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({
        description: 'Описание статьи. Допускается пустое значение при создании черновика',
        example: 'Длинное описание интересной статьи'
    })
    @ValidateIf((value: CreateArticleDto) => value.status === ArticleStatus.Published)
    @IsString()
    @IsNotEmpty()
    description?: string;

    @ApiProperty({
        description: 'Статус создаваемой статьи Опубликовано/Черновик',
        example: ArticleStatus.Published,
        enum: ArticleStatus,
    })
    @IsEnum(ArticleStatus)
    status: ArticleStatus;
}