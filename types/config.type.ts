export type ConfigType = Record<
    | 'DATABASE_URL'
    | 'PORT'
    | 'JWT_SECRET'
    | 'CLOUDINARY_CLOUD_NAME'
    | 'CLOUDINARY_API_KEY'
    | 'CLOUDINARY_SECRET',
    string | number
>
