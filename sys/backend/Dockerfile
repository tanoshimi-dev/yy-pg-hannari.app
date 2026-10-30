FROM node:24.22.2-alpine

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node sys/backend/package*.json ./
RUN npm ci

COPY --chown=node:node sys/backend/prisma ./prisma
RUN npx prisma generate

COPY --chown=node:node sys/backend/ .
COPY --chown=node:node doc/contents ./doc/contents

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate dev --name init --skip-generate 2>/dev/null || npx prisma migrate deploy && npx prisma db seed && npm run start:dev"]
