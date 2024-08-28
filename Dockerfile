FROM node:21.5.0-alpine AS build
ARG PORT_BACKEND
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG ADMIN_EMAIL
ARG ADMIN_PASSWORD
ARG TEST_EMAIL
ARG TEST_PASSWORD
ARG DATABASE_URL
ARG ENV


ENV PORT_BACKEND=$PORT_BACKEND
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_EXPIRES_IN=$JWT_EXPIRES_IN
ENV ADMIN_EMAIL=$ADMIN_EMAIL
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD
ENV TEST_EMAIL=$TEST_EMAIL
ENV TEST_PASSWORD=$TEST_PASSWORD
ENV DATABASE_URL=$DATABASE_URL
ENV ENV=$ENV

# RUN echo "DATABASE_URL=$DATABASE_URL"

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build


EXPOSE 80 84

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["docker-entrypoint"]
CMD ["npm", "run", "start"]