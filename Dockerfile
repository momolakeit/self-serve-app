FROM node:latest as node
ARG environement

ENV environement $environement
WORKDIR /app
COPY . .
RUN npm install
RUN node_modules/.bin/ng build --configuration=${environement}

#stage 2
FROM nginx:1.16.0-alpine
COPY --from=node /app/dist/self-serve-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/self-serve-app /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx","-g","daemon off;"]