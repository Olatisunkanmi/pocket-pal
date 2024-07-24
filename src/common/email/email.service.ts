import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CONSTANT, MAIL } from '../constants';
import { AppUtilities } from 'src/app.utilities';
import { ConfigService } from '@nestjs/config';
import AppLogger from '../logger/logger.config';

export interface dispatchMailOpts {
  email: string;
  username: string;
  subject: string;
  content: string;
}

export interface ResetMailOpts {
  email: string;
  username: string;
  resetToken: string;
}

@Injectable()
export class EmailService {
  private basePath: string;

  constructor(
    private mailerService: MailerService,
    private readonly cfg: ConfigService,
    private readonly logger: AppLogger,
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
  private async dispatchMail(options: dispatchMailOpts) {
    await this.mailerService.sendMail({
      to: options.email,
      from: `${MAIL.waitListFrom} <${MAIL.noreply}>`,
      subject: options.subject,
      html: options.content,
    });
  }

  public async sendPasswordResetMail(resetMailOpts: ResetMailOpts) {
    try {
      const resetUrl = `${this.cfg.get('app')}/resetPassword?token=${
        resetMailOpts.resetToken
      }`;

      const htmlTemplate = this.prepMailContent('resetPassword.html');

      const htmlContent = htmlTemplate
        .replace('{{name}}', resetMailOpts.username)
        .replace('{{resetUrl}}', resetUrl);

      const opts = {
        subject: MAIL.resetPassword,
        content: htmlContent,
        ...resetMailOpts,
      };

      await this.dispatchMail(opts);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException({ status: 403, error: CONSTANT.OOPs });
    }
  }
}
