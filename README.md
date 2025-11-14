<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

# NestJS + Prisma Backend Project

โปรเจคนี้เป็น **NestJS + TypeScript backend** สำหรับระบบลา/วันหยุด โดยใช้ **Prisma + MySQL** สำหรับ database

---

## 1️⃣ ตั้งค่า environment



1. ติดตั้ง dependency

npm install

2. สร้างไฟล์ `.env` ที่ root project:

```env
DATABASE_URL="mysql://root:example@127.0.0.1:3306/mydb"
PORT=3000

3. Start the database

docker-compose up -d

4. Run database migrations



npx prisma migrate dev

4. รันโปรเจค

# development mode
npm run start:dev

# production mode
npm run start:prod
