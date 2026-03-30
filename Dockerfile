FROM node:20-alpine AS base
WORKDIR /app

# Server build stage
FROM base AS server-build
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Client build stage
FROM base AS client-build
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy server
COPY --from=server-build /app/dist ./dist
COPY --from=server-build /app/package*.json ./
COPY --from=server-build /app/node_modules ./node_modules
COPY --from=server-build /app/src/models ./src/models

# Copy client build
COPY --from=client-build /app/dist ./public

# Install serve to serve static files
RUN npm install -g serve

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'node dist/index.js &' >> /app/start.sh && \
    echo 'serve -s /app/public -l 3000 &' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 5000 3000

CMD ["/app/start.sh"]
