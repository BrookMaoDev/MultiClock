# MultiClock - Multiplayer Game Timer

MultiClock is perfect for preventing multiplayer games from lasting too long, whether they're played online or in person. I decided to build this project after a game of 4-player chess with friends lasted over 3 hours!

## Usage Instructions

Coming soon!

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Node, Express, Socket.IO
- **Database**: MongoDB
- **HTTPS Encryption**: NGINX, Let's Encrypt
- **Deployment**: Amazon EC2, Docker, GitHub Actions

## How to Build

Follow these steps to build and run MultiClock locally:

1. Clone the repository using the following command:

   ```bash
   git clone https://github.com/BrookMaoDev/MultiClock.git
   ```

2. Install Docker Desktop from [here](https://www.docker.com/products/docker-desktop/).

3. Open a terminal in the repository directory and run the following command to build and start the containers:

   ```bash
   docker-compose -f "docker-compose.yml" up -d --build
   ```

4. Open your web browser and go to [http://localhost](http://localhost) to access MultiClock.
