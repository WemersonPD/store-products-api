aws ecr get-login-password --region REGIAO | docker login --password-stdin --username AWS URL_DO_PROJETO_NA_AMAZON
docker pull URL_DA_IMAGEM_NA_AMAZON
docker-compose -f api-dev.docker-compose.yml down
docker-compose -f api-dev.docker-compose.yml up -d
docker image prune -f