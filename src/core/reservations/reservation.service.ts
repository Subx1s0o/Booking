import { PrismaService } from '@/shared/services/prisma.service'
import {
    BadRequestException,
    ConflictException,
    Injectable,
} from '@nestjs/common'

@Injectable()
export class ReservationService {
    constructor(private readonly prisma: PrismaService) {}

    async create(businessId: string, clientId: string) {
        const client = await this.prisma.user.findUnique({
            where: { id: clientId, role: 'client' },
        })

        const business = await this.prisma.user.findUnique({
            where: { id: businessId, role: 'business' },
        })

        if (!client || !business) {
            throw new BadRequestException("Client or business doesn't exist")
        }

        const existingReservation = await this.prisma.reservations.findFirst({
            where: {
                clientUserId: clientId,
                businessUserId: businessId,
            },
        })

        if (existingReservation) {
            throw new ConflictException(
                'A reservation between this client and business already exists.',
            )
        }

        return await this.prisma.reservations.create({
            data: {
                clientUser: { connect: { id: clientId } },
                businessUser: { connect: { id: businessId } },
                status: 'opened',
                openedAt: new Date(),
            },
            include: {
                clientUser: {
                    select: {
                        firstName: true,
                        secondName: true,
                        email: true,
                        phone: true,
                    },
                },
                businessUser: {
                    select: {
                        firstName: true,
                        secondName: true,
                        address: true,
                        job: true,
                    },
                },
            },
        })
    }

    async findAll(userId: string, page?: string, limit?: string) {
        const pageNumber = page ? Number(page) : 1
        const limitNumber = limit ? Number(limit) : 10

        if (isNaN(pageNumber) || isNaN(limitNumber)) {
            throw new BadRequestException(
                'Page and limit must be valid numbers',
            )
        }
        return await this.prisma.reservations.findMany({
            where: {
                OR: [{ clientUserId: userId }, { businessUserId: userId }],
            },
            include: {
                clientUser: {
                    select: {
                        firstName: true,
                        secondName: true,
                    },
                },
                businessUser: {
                    select: {
                        firstName: true,
                        secondName: true,
                        job: true,
                    },
                },
            },
            skip: (pageNumber - 1) * limitNumber,
            take: limitNumber,
        })
    }

    async findOne(reservationId: string) {
        return await this.prisma.reservations.findFirst({
            where: {
                id: reservationId,
            },
            include: {
                clientUser: {
                    select: {
                        firstName: true,
                        secondName: true,
                        email: true,
                        phone: true,
                    },
                },
                businessUser: {
                    select: {
                        firstName: true,
                        secondName: true,
                        address: true,
                        job: true,
                    },
                },
            },
        })
    }

    async updateOne({ id, data }) {
        return await this.prisma.reservations.update({
            where: { id },
            data,
        })
    }

    async delete(id: string) {
        return await this.prisma.reservations.delete({ where: { id } })
    }
}
