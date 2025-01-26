import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsNumber,
    IsOptional,
} from 'class-validator'

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    firstName?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    secondName?: string

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    email?: string

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    phone?: number

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    address?: string

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    business?: string
}
