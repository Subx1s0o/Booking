import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import * as cloudinary from 'cloudinary'

@Injectable()
export class CloudinaryService {
    private readonly cloudinary: typeof cloudinary.v2

    constructor(private readonly config: ConfigService) {
        this.cloudinary = cloudinary.v2
        this.cloudinary.config({
            cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME') as string,
            api_key: this.config.get('CLOUDINARY_API_KEY') as string,
            api_secret: this.config.get('CLOUDINARY_SECRET') as string,
        })
    }

    async uploadImage(fileBuffer: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            this.cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: 'auto',
                        transformation: {
                            quality: 'auto',
                            fetch_format: 'avif',
                        },
                    },
                    (error, result) => {
                        if (error) {
                            return reject(
                                new InternalServerErrorException(
                                    'Error uploading to Cloudinary',
                                ),
                            )
                        }
                        resolve(result?.secure_url || '')
                    },
                )
                .end(fileBuffer)
        })
    }
}
