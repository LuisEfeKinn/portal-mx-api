/** biome-ignore-all lint/style/useNamingConvention: <AWS requires PascalCase keys> */
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import { join } from 'path'
import { S3Service } from './s3.service'

@Injectable()
export class UploadFileService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(file: Express.Multer.File) {
    const { originalname, mimetype, buffer } = file
    //test
    const sanitizedFileName = originalname
      .replace(/\s+/g, '-')
      .replace(/[^\w.-]/g, '')

    const finalName = `${Date.now()}-${sanitizedFileName}`

    return await this.s3_upload(
      buffer,
      process.env.AWS_BUCKET_NAME,
      finalName,
      mimetype,
    )
  }

  async s3_upload(
    fileBuffer: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    try {
      const parallelUploads3 = new Upload({
        client: this.s3Service.getS3Instance(),
        params: {
          Bucket: bucket,
          Key: name,
          Body: fileBuffer,
          ACL: 'public-read',
          ContentType: mimetype,
          ContentDisposition: 'inline',
        },
      })

      return await parallelUploads3.done()
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteFile(url: string) {
    const key = decodeURIComponent(this.getKeyFromUrlS3(url)).replace(
      /\+/g,
      ' ',
    )

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    }

    try {
      const command = new DeleteObjectCommand(params)
      return await this.s3Service.getS3Instance().send(command)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  private getKeyFromUrlS3(urlString: string): string {
    return urlString.replace(
      'https://myawstestbuckethm.s3.us-east-2.amazonaws.com/',
      '',
    )
  }

  async uploadToLocal(
    file: Express.Multer.File,
    folderPath?: string,
  ): Promise<string> {
    try {
      const { originalname, buffer } = file

      const fileExt = originalname.split('.').pop()

      const baseName = originalname
        .substring(0, originalname.lastIndexOf('.'))
        .replace(/\s+/g, '-')
        .replace(/[^\w.-]/g, '')

      const uniqueId = randomUUID()
      const timestamp = Date.now()
      const finalName = `${uniqueId}-${timestamp}-${baseName}.${fileExt}`

      const safeFolder = (folderPath ?? 'uploads')
        .replace(/^[./\\]+/, '')
        .replace(/^public[\\/]/, '')
        .replace(/\\/g, '/')

      const publicRoot = join(process.cwd(), 'public')
      const targetDir = join(publicRoot, safeFolder)
      await fs.mkdir(targetDir, { recursive: true })

      const fullPath = join(targetDir, finalName)
      await fs.writeFile(fullPath, buffer)

      return `/${safeFolder}/${finalName}`
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
