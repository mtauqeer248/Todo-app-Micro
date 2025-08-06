FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Show files BEFORE build
RUN echo "==== BEFORE BUILD ====" && ls -R

RUN npm run build

# Show files AFTER build
RUN echo "==== AFTER BUILD ====" && ls -R

RUN npm prune --production

EXPOSE 3001

CMD ["npm", "start"]
