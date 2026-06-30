import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsDate,
  MinDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHackathonDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date(), { message: 'startsAt must be a future date' })
  startsAt: Date;

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date(), { message: 'endsAt must be a future date' })
  endsAt: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
