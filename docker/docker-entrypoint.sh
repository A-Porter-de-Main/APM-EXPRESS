#!/bin/sh
echo "Lancement entrypoint"

if [ $ENV == "preproduction" ]
then
    echo "On est en pré production"
fi

# echo "Installation"
# npm ci

# echo "Build"
# npm run build

echo "Prisma generate"
npx prisma generate

echo "Prisma migrate"
npx prisma migrate deploy

echo "Prisma seed"
npx prisma db seed


echo "Run"
exec "$@" 