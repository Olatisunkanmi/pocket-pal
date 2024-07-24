import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MAIL } from '../constants';
import { AppUtilities } from 'src/app.utilities';
import { ConfigService } from '@nestjs/config';

export interface WaitlistOpts {
  email: string;
  username: string;
  subject: string;
  content: string;
}

@Injectable()
export class EmailService {
  private basePath: string;

  constructor(
    private mailerService: MailerService,
    private readonly cfg: ConfigService,
  ) {
    this.basePath = this.cfg.get('appRoot');
  }

  /**
   * Prep Html content
   */
  private prepMailContent(filePath: string) {
    return AppUtilities.readFile(`${this.basePath}/templates/${filePath}`);
  }

  /**
   * Dispatch Mail to Email Address
   */
  private async dispatchMail(options: WaitlistOpts) {
    await this.mailerService.sendMail({
      to: options.email,
      from: `${MAIL.waitListFrom} <${MAIL.noreply}>`,
      subject: options.subject,
      html: options.content,
    });
  }
}
