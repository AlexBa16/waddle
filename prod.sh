echo "1. Pull latest code"
git pull origin main

echo "2. Rebuild images"
docker compose -f compose.yaml -f compose.prod.yaml build --pull

echo "3. Apply DB migrations before swapping traffic to new code"
docker compose -f compose.yaml -f compose.prod.yaml run --rm php bin/console doctrine:migrations:migrate --no-interaction

echo "4. Recreate containers with the new images"
docker compose --env-file .env.local -f compose.yaml -f compose.prod.yaml up -d --remove-orphans

echo "5. Regenerate JWT-Keypair"
docker exec waddle-app php bin/console lexik:jwt:generate-keypair --overwrite

echo "6. Warm/clear cache"
docker compose -f compose.yaml -f compose.prod.yaml exec php bin/console cache:clear --env=prod --no-debug

echo "7. Sanity check"
docker compose -f compose.yaml -f compose.prod.yaml exec php bin/console debug:router --env=prod | head
