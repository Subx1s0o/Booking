import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()
        const authorizationHeader = request.headers.authorization

        if (!authorizationHeader) {
            throw new UnauthorizedException('Authorization header is required')
        }

        const [type, token] = authorizationHeader.split(' ')
        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid token format')
        }

        try {
            const user = this.jwtService.verify(token)
            if (!user) {
                throw new UnauthorizedException('Invalid token')
            }

            request.user = user
            return true
        } catch {
            throw new UnauthorizedException('Invalid or expired token')
        }
    }
}
