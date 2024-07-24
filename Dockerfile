# Development
FROM node:18-alpine AS development

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --frozen-lockfile --production=false
COPY . .

RUN chown -R node:node /usr/src/app
USER node

# Build
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .
COPY --from=development /usr/src/app/node_modules ./node_modules

RUN npm run schema.generate
RUN npm run build

ENV NODE_ENV production
RUN npm install --frozen-lockfile --production

RUN chown -R node:node /usr/src/app
USER node

# Production
FROM node:18-alpine AS production

WORKDIR /usr/src/app

COPY package.json ./
COPY prisma/ ./prisma
COPY docker-entrypoint.js ./docker-entrypoint.mjs
RUN chown -R node:node /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

COPY --from=build /usr/src/app/templates ./templates


RUN chmod +x docker-entrypoint.mjs
USER node

# Entrypoint prepares the database and starts the server
ENTRYPOINT [ "/usr/src/app/docker-entrypoint.mjs" ]
CMD [ "node", "dist/src/main.js" ]