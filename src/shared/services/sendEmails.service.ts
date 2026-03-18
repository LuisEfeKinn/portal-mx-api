import { Injectable } from '@nestjs/common'
import { sanitizeHtmlPlaceholders } from '../utils/html-cleaner.util'
import { MailsService } from './mails.service'

@Injectable()
export class SendEmailsService {
  constructor(private readonly mailService: MailsService) {}

  async sendEmails(
    sendEmails: { email: string; body: string }[],
    subject: string,
  ) {
    const emails = sendEmails.map(async (sendEmail) => {
      const cleanedBody = sanitizeHtmlPlaceholders(sendEmail.body)
      await this.mailService.sendEmail({
        to: sendEmail.email,
        subject,
        body: cleanedBody,
      })
    })

    await Promise.all(emails)
  }
}
