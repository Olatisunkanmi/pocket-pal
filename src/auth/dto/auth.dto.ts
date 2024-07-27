import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { PaginationSearchOptionsDto } from 'src/common/database/pagination/pagination-search-options.dto';

export class UserLoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UserSignUpDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;
}

export class QueryUsersDto extends PaginationSearchOptionsDto {
  @IsOptional()
  wallet: string;
}
