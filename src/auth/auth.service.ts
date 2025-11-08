import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  // In-memory хранилище пользователей (временное решение до подключения БД)
  private users: Map<string, User> = new Map();

  constructor(private jwtService: JwtService) {}

  async register(registerDto: RegisterDto): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    const { email, password, name } = registerDto;

    // Проверка на существующего пользователя
    const existingUser = Array.from(this.users.values()).find(
      (user) => user.email === email,
    );

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const userId = this.generateUserId();
    const newUser: User = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    };

    // Сохранение пользователя в памяти
    this.users.set(userId, newUser);

    // Генерация JWT токена
    const payload = { sub: userId, email: newUser.email };
    const access_token = await this.jwtService.signAsync(payload);

    // Возврат данных без пароля
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    const { email, password } = loginDto;

    // Поиск пользователя по email
    const user = Array.from(this.users.values()).find(
      (u) => u.email === email,
    );

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Генерация JWT токена
    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    // Возврат данных без пароля
    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}


