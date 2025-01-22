import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() data: LoginDto) {
        return await this.authService.login(data)
    }

    @Post('register')
    async register(@Body() data: RegisterDto) {
        return await this.authService.register(data)
    }
}
