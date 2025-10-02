import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  MaxLength,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: '名稱必須是字串' })
  @IsNotEmpty({ message: '名稱不能為空' })
  @MaxLength(100, { message: '名稱長度不能超過100個字符' })
  name!: string;

  @IsNumber({}, { message: '價格必須是數字' })
  @Min(0, { message: '價格不能小於0' })
  price!: number;

  @IsString({ message: '描述必須是字串' })
  @IsOptional()
  @MaxLength(500, { message: '描述長度不能超過500個字符' })
  description?: string;

  @IsNumber({}, { message: '庫存必須是數字' })
  @Min(0, { message: '庫存不能小於0' })
  stock!: number;

  @IsString({ message: '圖片網址必須是字串' })
  @IsOptional()
  @IsUrl({}, { message: '圖片網址格式不正確' })
  image?: string;
}
