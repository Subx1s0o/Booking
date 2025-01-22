import { PrismaService } from '@/shared/services/prisma.service'
import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllUsers(filter?: Partial<User>) {
        return await this.prisma.user.findMany({
            where: filter,
        })
    }

    async getUserById(id: string) {
        return await this.prisma.user.findUnique({ where: { id } })
    }

    async updateUser(id: string, data) {
        return await this.prisma.user.update({
            where: { id },
            data,
        })
    }

    async deleteUser(id: string) {
        return await this.prisma.user.delete({ where: { id } })
    }
}
