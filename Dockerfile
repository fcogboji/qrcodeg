# Multi-stage image: Node deps, Prisma generate, Next build, then run migrations at boot.
FROM node:20-bookworm-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/prisma ./prisma

USER node

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
