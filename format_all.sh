#!/bin/bash

# Format all typical files
prettier . --write

# Ensure docker-compose.prod.yml is included
prettier --ignore-path .prettierignore "**/docker-compose.prod.yml" --write
