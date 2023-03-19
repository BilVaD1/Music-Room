# Music Room
Music Room is a web application that allows users to create a room and play music from Spotify. Other users who have access to the room can vote to skip songs, pause or start the music, and view the song queue.

## Features
* Create a room and invite other users to join
* Play music from Spotify and view the current song queue
* Vote to skip songs or pause/start the music
* View the list of users in the room
## Requirements
* Docker
* Spotify Premium account (for host user only)

## Installation
1. Clone the repository to your local machine
2. Build the Docker images:
```docker-compose build```
3. Start the containers:
```docker-compose up```
4. Access the application at [http://localhost:8000](http://localhost:8000)
