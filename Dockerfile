# -------- Stage 1: Build --------
FROM node:18-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# -------- Stage 2: Run --------
FROM node:18-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

ENV NODE_ENV=production

USER app

EXPOSE 3000

CMD ["pnpm", "start"]
