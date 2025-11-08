import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SlackService } from './slack.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.slackService.sendMessage(sendMessageDto);
  }
}

