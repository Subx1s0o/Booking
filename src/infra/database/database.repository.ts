import { PrismaService } from '@/shared/services/prisma.service'
import { PrismaModels } from 'types/prisma-models.type'

export class DatabaseRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createOne<T>(modelName: PrismaModels, data: T): Promise<T> {
        return await this.prisma[modelName].create({ data: data })
    }

    async getMany<T>(
        modelName: PrismaModels,
        filter?: Partial<T>,
    ): Promise<T[]> {
        const result = await this.prisma[modelName].findMany({
            where: filter,
        })

        return result
    }

    async getOne<T>(
        modelName: PrismaModels,
        filter: Partial<T>,
    ): Promise<T | null> {
        const result = await this.prisma[modelName].findUnique({
            where: filter,
        })

        return result
    }

    async deleteOne<T>(
        modelName: PrismaModels,
        filter: Partial<T>,
    ): Promise<T> {
        const result = await this.prisma[modelName].delete({ where: filter })

        return result
    }

    async updateOne<T>(
        modelName: PrismaModels,
        filter: Partial<T>,
        data: Partial<T>,
    ): Promise<T> {
        return await this.prisma[modelName].update({
            where: filter,
            data: data,
        })
    }
}
