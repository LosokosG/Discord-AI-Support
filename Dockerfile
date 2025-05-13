# Stage 1: Builder
# Use the Node.js version specified in .nvmrc
FROM node:22.14.0-alpine AS builder

LABEL maintainer="AI Support Bot"
LABEL description="Builder stage for AI Support Bot"

WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json* ./

# Install all dependencies, including devDependencies for building
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Astro application
RUN npm run build


# Stage 2: Production
# Use the same Node.js alpine base for a slim image
FROM node:22.14.0-alpine AS production

LABEL maintainer="AI Support Bot"
LABEL description="Production image for AI Support Bot (Astro + Discord)"

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package.json and lock file for installing only production dependencies
COPY package.json package-lock.json* ./

# Create directory and set correct permissions first
RUN mkdir -p node_modules && chown -R node:node /app

# Install only production dependencies
# --ignore-scripts can speed up installs but might break packages relying on postinstall
RUN npm install --omit=dev --ignore-scripts

# Copy built Astro app from builder stage
COPY --from=builder /app/dist ./dist

# Copy Discord bot source code
COPY --from=builder /app/src/discord-bot ./src/discord-bot

# Install pm2 globally to manage application processes
RUN npm install pm2 -g

# Switch to non-root user after all operations requiring root are done
USER node

# Copy pm2 ecosystem configuration file
COPY --chown=node:node ecosystem.config.cjs ./ecosystem.config.cjs

# Expose the port the Astro app will run on (default 3000, configurable by PORT env var)
EXPOSE ${PORT:-3000}

# Default command to start pm2
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"] 