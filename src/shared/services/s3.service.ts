import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'

@Injectable()
export class S3Service {
  private readonly client: S3Client

  constructor() {
    const config: S3ClientConfig = {
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    }
    this.client = new S3Client(config)
  }

  getS3Instance(): S3Client {
    return this.client
  }
}
