#!/bin/sh
echo "Lancement entrypoint"

# if [ $NODE_ENV == "development" ]
# then
#     echo "On est en Dev"
#     npm install
# fi

echo "Installation"
npm ci

echo "Build"
npm run build

echo "Prisma generate"
npx prisma generate

echo "Prisma migrate"
npx prisma migrate deploy

echo "Prisma seed"
npx prisma db seed


echo "Run"
exec "$@" 