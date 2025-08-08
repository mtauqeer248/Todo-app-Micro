FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install && npm run build && npm prune --production

EXPOSE 3001
CMD ["npm", "start"]
