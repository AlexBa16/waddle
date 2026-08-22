echo "1. Pull latest code"
git pull origin main

echo "2. Rebuild images"
docker compose -f compose.yaml -f compose.prod.yaml build --pull

echo "3. Recreate containers with the new images"
docker compose --env-file .env.local -f compose.yaml -f compose.prod.yaml up -d --remove-orphans

echo "4. Warm/clear cache"
docker compose -f compose.yaml -f compose.prod.yaml exec php bin/console cache:clear --env=prod --no-debug

echo "5. Sanity check"
docker compose -f compose.yaml -f compose.prod.yaml exec php bin/console debug:router --env=prod
