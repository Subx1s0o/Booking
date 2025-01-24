import { Roles } from '@/shared/constans/roles'
import { Transform } from 'class-transformer'
import {
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator'

import { RolesType } from 'types/Roles'

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

    @Transform(({ value }) => value.trim())
    @IsIn(Object.values(Roles))
    role: RolesType

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    job?: string
}
