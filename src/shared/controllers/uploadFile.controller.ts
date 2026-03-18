import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { DeleteFileDto } from '../dtos/file.dto'
import { UploadFileUseCase } from '../useCase/uploadFile.useCase'
@Controller('upload-file')
@ApiTags('file')
export class UploadFileController {
  constructor(private readonly uploadFileUseCase: UploadFileUseCase) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const response = await this.uploadFileUseCase.uploadFile(file)

    return {
      message: 'File uploaded successfully',
      codeStatus: HttpStatus.OK,
      data: response,
    }
  }

  @Post('/delete')
  async deleteFile(@Body() deleteFileDto: DeleteFileDto) {
    await this.uploadFileUseCase.deleteFile(deleteFileDto.url)

    return {
      message: 'File deleted successfully',
      codeStatus: HttpStatus.OK,
    }
  }
}
