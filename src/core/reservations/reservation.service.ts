import { PrismaService } from '@/shared/services/prisma.service'
import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { CreateReservationDto } from './dto/create'

@Injectable()
export class ReservationService {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        businessId: string,
        clientId: string,
        data: CreateReservationDto,
    ) {
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

        const occupiedTime = await this.prisma.occupiedTime.findFirst({
            where: {
                reservation: {
                    businessUserId: businessId,
                },
                date: new Date(data.date),
                time: data.time,
            },
        })

        if (occupiedTime) {
            throw new ConflictException('This time slot is already occupied.')
        }

        const reservation = await this.prisma.reservations.create({
            data: {
                clientUserId: clientId,
                businessUserId: businessId,
                openedAt: new Date(),
                status: 'opened',
            },
        })

        const timeslot = await this.prisma.occupiedTime.create({
            data: {
                reservation: {
                    connect: { id: reservation.id },
                },
                date: new Date(data.date),
                time: data.time,
                createdAt: new Date(),
            },
        })

        return {
            ...reservation,
            date: timeslot.date,
            time: timeslot.time,
            clientUser: {
                firstName: client.firstName,
                secondName: client.secondName,
                email: client.email,
                phone: client.phone,
            },
            businessUser: {
                firstName: business.firstName,
                secondName: business.secondName,
                address: business.address,
                business: business.business,
            },
        }
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
                        business: true,
                        email: true,
                        phone: true,
                        address: true,
                    },
                },
                OccupiedTime: {
                    select: {
                        date: true,
                        time: true,
                    },
                },
            },
            skip: (pageNumber - 1) * limitNumber,
            take: limitNumber,
        })

        const cleanedResult = result.map((reservation) => {
            const { OccupiedTime, ...cleanedReservation } = reservation
            return {
                ...cleanedReservation,
                date: OccupiedTime?.date,
                time: OccupiedTime?.time,
            }
        })

        return {
            data: cleanedResult,
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
                        email: true,
                        business: true,
                    },
                },
                OccupiedTime: {
                    select: {
                        date: true,
                        time: true,
                    },
                },
            },
        })

        if (!reservation) {
            throw new NotFoundException('Reservation was not found')
        }

        const { OccupiedTime, ...cleanedReservation } = reservation

        const result = {
            ...cleanedReservation,
            date: OccupiedTime?.date,
            time: OccupiedTime?.time,
        }

        return result
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
            include: { OccupiedTime: true },
        })

        if (!existingReservation) {
            throw new NotFoundException('Reservation was not found')
        }

        if (existingReservation.OccupiedTime) {
            await this.prisma.occupiedTime.delete({
                where: { reservationId: existingReservation.id },
            })
        }

        return await this.prisma.reservations.delete({
            where: { id },
        })
    }

    async updateReservationTime(
        reservationId: string,
        data: CreateReservationDto,
    ) {
        const reservation = await this.prisma.reservations.findUnique({
            where: { id: reservationId },
        })

        if (!reservation) {
            throw new NotFoundException('Reservation was not found')
        }

        const existingOccupiedTime = await this.prisma.occupiedTime.findFirst({
            where: {
                reservation: {
                    businessUserId: reservation.businessUserId,
                },
                date: new Date(data.date),
                time: data.time,
            },
        })

        if (existingOccupiedTime) {
            throw new ConflictException('This time slot is already occupied.')
        }

        const updatedOccupiedTime = await this.prisma.occupiedTime.update({
            where: {
                reservationId: reservationId,
            },
            data: {
                date: new Date(data.date),
                time: data.time,
            },
        })

        return {
            reservationId: reservation.id,
            date: updatedOccupiedTime.date,
            time: updatedOccupiedTime.time,
        }
    }
}
