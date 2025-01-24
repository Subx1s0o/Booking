import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
    @ApiProperty({
        description: 'User Email',
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
}
