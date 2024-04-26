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

# Build Tailwind CSS output file inside the container
RUN npx tailwindcss -i ./public/input.css -o ./public/output.css

# Expose port 3000 to allow external access
EXPOSE 3000

# Run start command to start the application
CMD [ "npm", "start" ]
