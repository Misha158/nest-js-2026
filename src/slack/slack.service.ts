import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class SlackService {
  private readonly webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL || '';
    
    if (!this.webhookUrl) {
      console.warn('SLACK_WEBHOOK_URL не установлен в переменных окружения');
    }
  }

  async sendMessage(sendMessageDto: SendMessageDto): Promise<{ success: boolean; message: string }> {
    if (!this.webhookUrl) {
      throw new HttpException(
        'Slack webhook URL не настроен',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sendMessageDto.text }),
      });

      if (!response.ok) {
        throw new HttpException(
          `Ошибка при отправке сообщения в Slack: ${response.statusText}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      return {
        success: true,
        message: 'Сообщение успешно отправлено в Slack',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Ошибка при отправке сообщения в Slack: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}


