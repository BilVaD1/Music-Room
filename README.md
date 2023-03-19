# Music Room
Music Room is a web application that allows users to create a room and play music from **Spotify**. Other users who have access to the room can vote to skip songs, pause or start the music, and view the song queue.

## Features
* Create a room and invite other users to join
* Play music from Spotify and view the current song queue
* Vote to skip songs or pause/start the music
## Requirements
* Docker
* Spotify Premium account (for host user only)

## Installation
1. Clone the repository to your local machine
2. Create a `.env` file in the root directory with the following variables
```
CLIENT_ID=<your_spotify_client_id>
CLIENT_SECRET=<your_spotify_client_secret>
REDIRECT_URI=http://localhost:8000/spotify/redirect
```
Replace `<your_spotify_client_id>` and `<your_spotify_client_secret>` with your Spotify API credentials. You can get these by registering your application at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

3. Build the Docker image:
```docker-compose build```
4. Start the containers:
```docker-compose up```
5. Access the application at [http://localhost:8000](http://localhost:8000)

If you want to connect to your room from other devices of your network, find the local IP of the machine where the docker was launched and proceed to this IP from a different device, also add the port(8000) to your address.
