import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto'
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiOkResponse({
        description: 'The user has been successfully logged in',
    })
    @ApiBadRequestResponse({
        description: 'User email or password is invalid',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    async login(@Body() data: LoginDto) {
        return await this.authService.login(data)
    }

    @Post('register')
    @ApiOperation({ summary: 'User registration' })
    @ApiCreatedResponse({
        description: 'The user has been successfully registered in',
    })
    @ApiBadRequestResponse({
        description: 'User email or password is invalid',
    })
    @ApiConflictResponse({
        description: 'The user already exists',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    async register(@Body() data: RegisterDto) {
        return await this.authService.register(data)
    }
}
