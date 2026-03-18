import { ApiProperty } from '@nestjs/swagger'

export class DeleteFileDto {
  @ApiProperty({
    type: 'string',
    example: 'https://bucket.s3.amazonaws.com/file.jpg',
    nullable: false,
  })
  url: string
}
