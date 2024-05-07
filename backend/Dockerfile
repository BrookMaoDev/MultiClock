# Specifying base image
FROM node:latest

# Set working directory within container
WORKDIR /app

# Copies package.json and package-lock.json into /app
COPY package*.json ./

# Installs dependencies listed in package.json
RUN npm install

# Copy remaining files over. We do this separately after installing dependencies
# so that we don't have to install dependencies all over again after making changes to source code.
COPY . .

# Expose ports to allow external access
EXPOSE 3000 3001

# Run start command to start the application
CMD [ "npm", "start" ]
