FROM node:20-alpine

WORKDIR /app

COPY sys/backend/package*.json ./
RUN npm ci

COPY sys/backend/prisma ./prisma
RUN npx prisma generate

COPY sys/backend/ .
COPY doc/contents ./doc/contents

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate dev --name init --skip-generate 2>/dev/null || npx prisma migrate deploy && npx prisma db seed && npm run start:dev"]
