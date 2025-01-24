import { PrismaService } from '@/shared/services/prisma.service'
import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
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

        const totalCount = await this.prisma.reservations.count({
            where: {
                OR: [{ clientUserId: userId }, { businessUserId: userId }],
            },
        })

        const result = await this.prisma.reservations.findMany({
            where: {
                OR: [{ clientUserId: userId }, { businessUserId: userId }],
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
                        job: true,
                        email: true,
                        phone: true,
                        address: true,
                    },
                },
            },
            skip: (pageNumber - 1) * limitNumber,
            take: limitNumber,
        })

        return {
            data: result,
            total: result.length,
            page: pageNumber,
            totalPages: Math.ceil(totalCount / limitNumber),
        }
    }

    async findOne(reservationId: string) {
        const reservation = await this.prisma.reservations.findFirst({
            where: { id: reservationId },
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

        if (!reservation) {
            throw new NotFoundException('Reservation was not found')
        }

        return reservation
    }

    async updateOne({ id, data }) {
        const existingReservation = await this.prisma.reservations.findUnique({
            where: { id },
        })

        if (!existingReservation) {
            throw new NotFoundException('Reservation was not found')
        }

        return await this.prisma.reservations.update({
            where: { id },
            data,
        })
    }

    async delete(id: string) {
        const existingReservation = await this.prisma.reservations.findUnique({
            where: { id },
        })

        if (!existingReservation) {
            throw new NotFoundException('Reservation was not found')
        }

        return await this.prisma.reservations.delete({
            where: { id },
        })
    }
}
