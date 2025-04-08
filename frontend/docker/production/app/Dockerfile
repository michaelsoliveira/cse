FROM node:22-alpine AS base

# Etapa de dependências
FROM base AS deps
WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm

# Copia os arquivos de dependência
COPY package.json pnpm-lock.yaml ./

# Instala as dependências com pnpm
RUN pnpm install --frozen-lockfile --network-concurrency=1

# Etapa de build
FROM base AS builder
WORKDIR /app

# Instala o pnpm aqui também, para garantir que estará disponível
RUN npm install -g pnpm

# Copia dependências e código
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY . .

# Build do app
RUN pnpm build

# Imagem final de produção
FROM base AS runner
WORKDIR /app

ENV NEXT_SHARP_PATH=/tmp/node_modules/sharp
ENV ENVIRONMENT production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static/

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV PATH=/app/node_modules/.bin:$PATH

CMD ["node", "server.js"]
