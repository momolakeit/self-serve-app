FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build 

#stage 2
FROM nginx:1.16.0-alpine
COPY --from=node /app/dist/self-serve-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/self-serve-app /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx","-g","daemon off;"]