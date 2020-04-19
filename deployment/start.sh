BASE_SITE=ec2-184-72-144-64.compute-1.amazonaws.com

#development
#export NODE_ENV=development
#export PORT=8001
#export DBPORT=27017
#export VIRTUAL_HOST=${NODE_ENV}.${BASE_SITE}
#docker-compose -p ${VIRTUAL_HOST} up -d --build

#production
export NODE_ENV=production
export PORT=8003
export DBPORT=27018
export VIRTUAL_HOST=${BASE_SITE}
docker-compose -p ${VIRTUAL_HOST} up -d --build