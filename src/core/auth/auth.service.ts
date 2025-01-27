import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'

import { LoginDto, RegisterDto } from './dto'
import { PrismaService } from '@/shared/services/prisma.service'
import * as bcrypt from 'bcrypt'
import { Prisma, User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { CloudinaryService } from '@/common/cloudinary/cloudinary.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly cloudinaryService: CloudinaryService,
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...user } = existingUser

        return {
            user,
            sessionToken,
        }
    }

    async register(data: RegisterDto, file?: File & { buffer: Buffer }) {
        const existingUser = await this.checkUser({
            email: data.email,
        })

        if (existingUser) {
            throw new ConflictException('User already exists')
        }

        const hashPassword = await bcrypt.hash(data.password, 10)

        let photoUrl: string | null = null

        if (file) {
            try {
                photoUrl = await this.cloudinaryService.uploadImage(file.buffer)
                console.log(photoUrl || undefined)
            } catch (e) {
                console.log(e)
                throw new InternalServerErrorException(
                    'Error uploading image to Cloudinary',
                )
            }
        }

        const user = await this.prisma.user.create({
            omit: { password: true },
            data: {
                ...data,
                password: hashPassword,
                photo: photoUrl,
            },
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
