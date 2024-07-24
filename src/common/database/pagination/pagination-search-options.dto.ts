import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDto } from './pagination.dto';

export class PaginationSearchOptionsDto extends PaginationOptionsDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  term?: string;
}
