# syntax=docker/dockerfile:1.7

# --- deps stage: install only production-relevant deps for caching ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- build stage: produce Next.js standalone output ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Strip `local_backend: true` from Sveltia config (only needed in local dev).
RUN sh scripts/strip-local-backend.sh

RUN npm run build

# --- runtime stage: minimal image with standalone server ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Standalone server + static assets + public files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Runtime content read via fs at request time (lib/content/{team,faq,legal}.ts,
# next-intl messages). Not traced by the standalone build, so copy explicitly.
COPY --from=builder --chown=nextjs:nodejs /app/data ./data
COPY --from=builder --chown=nextjs:nodejs /app/messages ./messages

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
