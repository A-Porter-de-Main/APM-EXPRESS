FROM node:21.5.0-alpine AS build
# ARG PORT
# ARG JWT_SECRET
# ARG JWT_EXPIRES_IN
# ARG ADMIN_EMAIL
# ARG ADMIN_PASSWORD
# ARG DATABASE_URL

# ENV PORT=$PORT
# ENV JWT_SECRET=$JWT_SECRET
# ENV JWT_EXPIRES_IN=$JWT_EXPIRES_IN
# ENV ADMIN_EMAIL=$ADMIN_EMAIL
# ENV ADMIN_PASSWORD=$ADMIN_PASSWORD
# ENV DATABASE_URL=$DATABASE_URL

# RUN echo "DATABASE_URL=$DATABASE_URL"


COPY . /app/

WORKDIR /app


EXPOSE 80 84

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
CMD ["npm", "run", "start"]
