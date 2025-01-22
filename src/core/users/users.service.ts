import { PrismaService } from '@/shared/services/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllUsers(filter?: Partial<User>, page?: string, limit?: string) {
        const pageNumber = page ? Number(page) : 1
        const limitNumber = limit ? Number(limit) : 10

        if (isNaN(pageNumber) || isNaN(limitNumber)) {
            throw new BadRequestException(
                'Page and limit must be valid numbers',
            )
        }

        const data = await this.prisma.user.findMany({
            where: filter,
            omit: { password: true },
            skip: (pageNumber - 1) * limitNumber,
            take: limitNumber,
        })

        return {
            data,
            count: data.length,
            page: pageNumber,
            totalPages: Math.ceil(data.length / limitNumber),
        }
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
