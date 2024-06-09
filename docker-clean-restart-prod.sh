#!/bin/bash

# Define the Docker Compose file
COMPOSE_FILE="docker-compose.prod.yml"

# Stop and remove all containers, networks, images, and volumes defined in the Docker Compose file
echo "Stopping and removing containers, networks, images, and volumes defined in $COMPOSE_FILE..."
docker-compose -f $COMPOSE_FILE down --volumes --rmi all

# Remove all remaining containers
echo "Removing all remaining containers..."
docker rm -f $(docker ps -a -q)

# Remove all Docker volumes
echo "Removing all Docker volumes..."
docker volume rm $(docker volume ls -q)

# Start the Docker Compose services
echo "Starting services defined in $COMPOSE_FILE..."
docker-compose -f $COMPOSE_FILE up -d

echo "Docker Compose clean restart completed."
