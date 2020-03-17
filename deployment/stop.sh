BASE_SITE=d01920.com

#development
export NODE_ENV=development
export PORT=8001
export UI_PORT=4200
export DBPORT=27017
export VIRTUAL_HOST=${NODE_ENV}.${BASE_SITE}
docker-compose -p ${VIRTUAL_HOST} down

#production
export NODE_ENV=production
export PORT=8003
export UI_PORT=4201
export DBPORT=27018
export VIRTUAL_HOST=${BASE_SITE}
docker-compose -p ${VIRTUAL_HOST} down