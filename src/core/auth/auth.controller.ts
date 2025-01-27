import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
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
import { FileInterceptor } from '@nestjs/platform-express'

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
    @ApiOperation({ summary: 'User registration with optional photo' })
    @ApiCreatedResponse({
        description: 'The user has been successfully registered',
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data',
    })
    @ApiConflictResponse({
        description: 'User already exists',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    @UseInterceptors(FileInterceptor('photo'))
    async register(
        @Body() data: RegisterDto,
        @UploadedFile() file: File & { buffer: Buffer },
    ) {
        return await this.authService.register(data, file)
    }
}
