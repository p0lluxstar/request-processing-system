# request-processing-system

## Используемый стек
- Node.js
- TypeScript
- Express
- SQLite
- Prisma

## Необходимые программы

- [Git](https://git-scm.com/downloads) - загрузите и установите Git.
- [Node.js](https://nodejs.org/en/download/) - загрузите и установите Node.js и менеджер пакетов npm.

## Установка
1. Создайте локальную копию репозитория по указанному URL на GitHub.
```
git clone https://github.com/p0lluxstar/request-processing-system.git
```
2. Перейдите в каталог с именем backend.
```
cd request-processing-system/backend
```
3. Установите все зависимости проекта, указанные в файле package.json
```
npm install
```
4. Создайте базу данных и сгенерируете миграционный файл с именем init-db.
```
npx prisma migrate dev --name init-db
```

## Запуск приложения

```
npm run dev
```

После запуска приложения на порту 3000 станет доступен веб-сервер.

## Доступны следующие ендпоинты:

1. Создать обращение.
```
POST /requests
```
Тело запроса.
```json
{
  "subject": "Тема обращения",
  "message": "Текст сообщения"
}
```
2. Взять обращение в работу.
```
PUTCH /requests/:id/start
```
3. Завершить обработку обращения.
```
PUTCH /requests/:id/complete
```
Тело запроса.
```json
{
  "solutionText": "Текст решения"
}
```
4. Отмена обращения.
```
PUTCH /requests/:id/cancel
```
Тело запроса.
```json
{
  "cancelText": "Текст отмены"
}
```
5. Получить список обращений с возможность фильтрации.

По конкретной дате.
```
GET /requests?date=2025-04-09
```
По диапазону дат.
```
GET /requests?startDate=2025-04-01&endDate=2025-04-09
```

6. Отменит все обращения, которые находятся в статусе "в работе"
```
PUTCH /requests/cancel-all
```
Тело запроса.
```json
{
  "cancelText": "Текст отмены"
}
```