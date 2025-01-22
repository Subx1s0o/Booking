import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'
import { ConfigType } from 'types'

@Injectable()
export class ConfigService {
    constructor(private readonly nestConfigService: NestConfigService) {}

    get<T extends keyof ConfigType>(key: T): ConfigType[T] {
        const value = this.nestConfigService.get<T>(key)
        return value as ConfigType[T]
    }
}
