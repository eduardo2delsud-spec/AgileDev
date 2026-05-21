FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

COPY . .

RUN mkdir -p /app/data

EXPOSE 4098

CMD ["npx", "tsx", "src/index.ts"]
