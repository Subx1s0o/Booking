import { PrismaService } from '@/shared/services/prisma.service'
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
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
        try {
            return await this.prisma.user.update({
                omit: { password: true },
                where: { id },
                data,
            })
        } catch {
            throw new NotFoundException('The user wasnt found to update')
        }
    }

    async deleteUser(id: string) {
        try {
            return await this.prisma.user.delete({
                omit: { password: true },
                where: { id },
            })
        } catch {
            throw new NotFoundException('The user wasnt found to delete')
        }
    }
}
