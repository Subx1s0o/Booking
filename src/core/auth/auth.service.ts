import { DatabaseRepository } from '@/infra/database/database.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
    constructor(private readonly databaseRepository: DatabaseRepository) {}

    async login() {}

    async register() {}
}
