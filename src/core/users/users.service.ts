import { DatabaseRepository } from '@/infra/database/database.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
    constructor(private readonly databaseRepository: DatabaseRepository) {}
    async getAllUsers() {
        return await this.databaseRepository.getMany('User')
    }

    async getUserById(id: string) {
        return await this.databaseRepository.getOne('User', { id })
    }

    async updateUser(id: string, data) {
        return await this.databaseRepository.updateOne('User', { id }, data)
    }

    async deleteUser(id: string) {
        return await this.databaseRepository.deleteOne('User', { id })
    }
}
