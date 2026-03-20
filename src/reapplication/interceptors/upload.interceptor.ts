import { BadRequestException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const ReapplicationUploadInterceptor = FileInterceptor('file', {
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new BadRequestException(
          'Solo se permiten PDF, imágenes o documentos Word',
        ),
        false,
      )
    }
    cb(null, true)
  },
})
