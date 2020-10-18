#stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build 

#stage 2
FROM nginx:1.16.0-alpine
COPY --from=node /app/dist/self-serve-app /usr/share/nginx/html
CMD ["nginx","-g","daemon off;"]