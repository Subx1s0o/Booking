import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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
    @ApiProperty({
        description: 'First name of the user',
        example: 'John',
    })
    @IsString()
    @IsNotEmpty()
    firstName: string

    @ApiProperty({
        description: 'Second name of the user',
        example: 'Doe',
    })
    @IsString()
    @IsNotEmpty()
    secondName: string

    @ApiProperty({
        description: 'User email',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({
        description: 'User password',
        example: 'SecurePassword123!',
    })
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiPropertyOptional({
        description: 'Phone number of the user',
        example: 380501234567,
    })
    @IsNumber()
    @IsOptional()
    phone?: number

    @ApiProperty({
        description: 'User Role',
        enum: Object.values(Roles),
        example: Roles.CLIENT,
    })
    @Transform(({ value }) => value.trim())
    @IsIn(Object.values(Roles))
    role: RolesType

    @ApiPropertyOptional({
        description: 'Address of the user',
        example: '123 Main St, Kyiv, Ukraine',
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string

    @ApiPropertyOptional({
        description: 'Job title of the user',
        example: 'Software Engineer',
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    job?: string
}
