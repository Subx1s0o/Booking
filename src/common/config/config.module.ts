import { Global, Module } from '@nestjs/common'
import { ConfigModule as CM } from '@nestjs/config'
import { ConfigService } from './config.service'

@Global()
@Module({
    imports: [
        CM.forRoot({
            isGlobal: true,
        }),
    ],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}
