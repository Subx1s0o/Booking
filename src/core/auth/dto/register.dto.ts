import { Roles } from '@/shared/constans/roles'
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    secondName: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    phone?: number

    @IsEnum(Roles)
    role: Roles
}
