FROM nginx:latest

# Set the current working directory inside the image
WORKDIR /app

COPY ./dist/mb-amc /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]