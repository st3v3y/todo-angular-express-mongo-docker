FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY /dist/todoapp/ .
VOLUME /usr/share/nginx/html
EXPOSE 80

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]