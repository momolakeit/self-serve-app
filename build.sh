docker system prune -a -f;
docker build  --build-arg environement=dev --tag momothebest/front_end_repo  .;
docker push momothebest/front_end_repo;