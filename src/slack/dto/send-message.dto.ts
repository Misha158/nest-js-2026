import { IsString, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString({ message: 'Сообщение должно быть строкой' })
  @MinLength(1, { message: 'Сообщение не может быть пустым' })
  text: string;
}


