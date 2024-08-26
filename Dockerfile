FROM node:21.5.0-alpine AS build

COPY . /app/

WORKDIR /app

EXPOSE 80

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
CMD ["npm", "run", "start"]


