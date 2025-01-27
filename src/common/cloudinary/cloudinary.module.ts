import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { CloudinaryService } from './cloudinary.service'
import { ConfigService } from '../config/config.service'
import { v2 as cloudinary } from 'cloudinary'

@Module({
    imports: [ConfigModule],
    providers: [
        CloudinaryService,
        {
            provide: 'Cloudinary',
            useFactory: (configService: ConfigService) => {
                cloudinary.config({
                    cloud_name: configService.get(
                        'CLOUDINARY_CLOUD_NAME',
                    ) as string,
                    api_key: configService.get('CLOUDINARY_API_KEY') as string,
                    api_secret: configService.get(
                        'CLOUDINARY_SECRET',
                    ) as string,
                })
                return cloudinary
            },
            inject: [ConfigService],
        },
    ],
    exports: [CloudinaryService],
})
export class CloudinaryModule {}
