import { CloudinaryService } from '@/common/cloudinary/cloudinary.service'
import { PrismaService } from '@/shared/services/prisma.service'
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { User } from '@prisma/client'

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async getAllUsers(filter?: Partial<User>, page?: string, limit?: string) {
        const pageNumber = page ? Number(page) : 1
        const limitNumber = limit ? Number(limit) : 10

        if (isNaN(pageNumber) || isNaN(limitNumber)) {
            throw new BadRequestException(
                'Page and limit must be valid numbers',
            )
        }

        const totalCount = await this.prisma.user.count({
            where: filter,
        })

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
            totalPages: Math.ceil(totalCount / limitNumber),
        }
    }

    async getUserById(id: string) {
        try {
            return await this.prisma.user.findUnique({
                omit: { password: true },
                where: { id },
            })
        } catch {
            throw new NotFoundException('The user wasnt found')
        }
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

    async updateUserPhoto(
        userId: string,
        file: File & { buffer: Buffer },
    ): Promise<Omit<User, 'password'>> {
        try {
            const photoUrl = await this.cloudinaryService.uploadImage(
                file.buffer,
            )

            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            })
            if (!user) {
                throw new NotFoundException('User not found')
            }

            const newUser = await this.prisma.user.update({
                omit: { password: true },
                where: { id: userId },
                data: { photo: photoUrl },
            })

            return newUser
        } catch {
            throw new InternalServerErrorException('Error updating user photo')
        }
    }

    async getAllReservationOccupiedTime(businessId: string) {
        return await this.prisma.occupiedTime.findMany({
            where: {
                reservation: {
                    businessUserId: businessId,
                },
            },
        })
    }
}
