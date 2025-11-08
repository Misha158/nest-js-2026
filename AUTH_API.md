# API Аутентификации

## Endpoints

### 1. Регистрация
**POST** `/auth/register`

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Имя пользователя"
}
```

**Ответ (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1234567890_abc123",
    "email": "user@example.com",
    "name": "Имя пользователя",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### 2. Вход
**POST** `/auth/login`

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Ответ (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1234567890_abc123",
    "email": "user@example.com",
    "name": "Имя пользователя",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### 3. Получение профиля (защищенный роут)
**GET** `/auth/profile`

**Заголовки:**
```
Authorization: Bearer <access_token>
```

**Ответ (200):**
```json
{
  "id": "user_1234567890_abc123",
  "email": "user@example.com",
  "name": "Имя пользователя",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

## Валидация

- Email должен быть валидным email адресом
- Пароль должен содержать минимум 6 символов
- Имя должно содержать минимум 2 символа

## Ошибки

- **400 Bad Request** - ошибки валидации
- **401 Unauthorized** - неверный email или пароль
- **409 Conflict** - пользователь с таким email уже существует

## Примечания

- Данные хранятся в памяти (in-memory), поэтому при перезапуске сервера все пользователи будут удалены
- JWT токен действителен 24 часа
- Для production рекомендуется установить переменную окружения `JWT_SECRET`


