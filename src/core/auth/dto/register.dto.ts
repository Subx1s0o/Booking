import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class RegisteerDto {
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
    phone: number
}
