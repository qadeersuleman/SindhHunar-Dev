# ==============================================================
# SindhHunar Web (Next.js) - Production Multi-Stage Dockerfile
# ==============================================================

# --- Stage 1: Base Image ---
# Hum lightweight Alpine Linux par Node 22 (Active LTS) use kar rahe hain
FROM node:22-alpine AS base

# --- Stage 2: Dependencies (Deps) ---
# Is stage ka maqsad sirf package-lock.json se dependencies download karna hai
FROM base AS deps
# Alpine ke liye zaroori C library
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Package files copy karke clean install (npm ci) chalate hain
COPY package.json package-lock.json* ./
RUN npm ci

# --- Stage 3: Builder ---
# Yahan TypeScript compile hogi aur Next.js production build tayyar hogi
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js telemetry disable karte hain taake build tez ho
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js build run karte hain (output: 'standalone' bundle create hoga)
RUN npm run build

# --- Stage 4: Production Runner ---
# Yeh final stage hai jo server par chalegi (size sirf ~150MB hoga!)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Security Best Practice: Container ko root user ke tor par nahi chalana chahiye
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Sirf zaroori compiled files copy karte hain (kachra piche chhor kar)
COPY --from=builder /app/public ./public

# Standalone build aur static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Port define karte hain
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Server start command (npm start ke bajaye lightweight standalone node server)
CMD ["node", "server.js"]
