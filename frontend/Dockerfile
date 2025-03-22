FROM node:21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG BUILD_MODE
RUN npm run build
FROM nginx:alpine
RUN chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx
RUN chown -R nginx:0 /usr/share/nginx/html && \
    chmod -R g+r+rwX /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]