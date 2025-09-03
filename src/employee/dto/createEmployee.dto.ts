import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToBoolean } from 'src/common/decorator/transformer';

class ImageDto {
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  image_public_id: string;
}

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @ToBoolean()
  show_email: boolean;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsBoolean()
  @ToBoolean()
  show_phone: boolean;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @ValidateNested()
  @Type(() => ImageDto)
  @IsOptional()
  image?: ImageDto;
}
