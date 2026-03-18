import { Injectable } from '@nestjs/common'
import { UploadFileService } from '../services/uploadFile.service'

@Injectable()
export class UploadFileUseCase {
  constructor(private readonly uploadFileService: UploadFileService) {}

  async uploadFile(file: Express.Multer.File) {
    const fileData = await this.uploadFileService.uploadFile(file)

    return {
      url: fileData.Location,
      fileName: fileData.Key,
    }
  }

  async deleteFile(url: string) {
    await this.uploadFileService.deleteFile(url)
  }
}
