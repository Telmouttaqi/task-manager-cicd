FROM node:24-bookworm-slim
LABEL org.opencontainers.image.source="https://github.com/Telmouttaqi/task-manager-cicd"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY server.js ./

ENV NODE_ENV=production

USER node

EXPOSE 3000

CMD ["node", "server.js"]