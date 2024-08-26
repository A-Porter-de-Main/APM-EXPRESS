FROM node:21.5.0-alpine AS build

COPY . /app/

WORKDIR /app

RUN npm install

RUN npm run build

# //ajouter le prisma ici ou dans entrypoint

EXPOSE 80

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
CMD ["npm", "run", "start"]



# FROM node:21.5.0-alpine AS node

# WORKDIR /app

# COPY --from=build /app/package.json /app/
# COPY --from=build /app/node_modules /app/node_modules/
# COPY --from=build /app /app
# # COPY --from=build /app /app

# EXPOSE 80

# COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
# RUN chmod +x /usr/local/bin/docker-entrypoint

# ENTRYPOINT ["docker-entrypoint"]
# CMD ["npm", "run", "start"]
