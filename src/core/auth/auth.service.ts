import {
    BadRequestException,
    ConflictException,
    Injectable,
} from '@nestjs/common'

import { LoginDto, RegisterDto } from './dto'
import { PrismaService } from '@/shared/services/prisma.service'
import * as bcrypt from 'bcrypt'
import { Prisma, User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) {}

    async login(data: LoginDto) {
        const existingUser = await this.checkUser({
            email: data.email,
        })

        if (!existingUser) {
            throw new BadRequestException('User email or password is invalid')
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            existingUser.password,
        )

        if (!isPasswordValid) {
            throw new BadRequestException('User email or password is invalid')
        }

        const sessionToken = this.generateSessionToken({
            id: existingUser.id,
            role: existingUser.role,
        })

        const { password: _, ...user } = existingUser

        return {
            user,
            sessionToken,
        }
    }

    async register(data: RegisterDto) {
        const existingUser = await this.checkUser({
            email: data.email,
        })
        if (existingUser) {
            throw new ConflictException('User already exists')
        }

        const hashPassword = await bcrypt.hash(data.password, 10)

        const user = await this.prisma.user.create({
            omit: { password: true },
            data: { ...data, password: hashPassword },
        })

        const sessionToken = this.generateSessionToken({
            id: user.id,
            role: user.role,
        })

        return {
            user,
            sessionToken,
        }
    }

    private async checkUser(
        data: Prisma.UserWhereUniqueInput,
    ): Promise<User | false> {
        const existingUser = await this.prisma.user.findUnique({
            where: data,
        })

        if (!existingUser) {
            return false
        }

        return existingUser
    }

    private generateSessionToken(data: Partial<User>): string {
        return this.jwt.sign(data)
    }
}
