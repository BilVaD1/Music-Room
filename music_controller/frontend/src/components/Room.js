import React, { useState, useEffect, useCallback  } from 'react'
import { useParams } from 'react-router-dom';
import { Button, Grid, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";

import MusicPlayer from './MusicPlayer';
import defaultMusic from '../../static/images/default.png'


const Room = ({ leaveRoomCallback }) => {
    const { roomCode } = useParams();
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState({});
    const navigate = useNavigate();

    // const roomCode = props.match.params.roomCode;
    MusicPlayer.defaultProps = {
        title: 'Start music on your Spotify',
        artist: 'Default',
        image_url: defaultMusic,
        is_playing: false,
        time: 0,
        duration: 0,
        votes: 0,
        votes_require: 0
    }

    const getRoomDetails = useCallback(() => {
        fetch("/api/get-room" + "?code=" + roomCode)
          .then((response) => response.json())
          .then((data) => {
            setVotesToSkip(data.votes_to_skip);
            setGuestCanPause(data.guest_can_pause);
            setIsHost(data.is_host);
          });
    }, [roomCode]);

    const authenticateSpotify = useCallback(() => {
        if (isHost) {
            console.log('authenticateSpotify')
            fetch("/spotify/is-authenticated")
            .then((response) => response.json())
            .then((data) => {
                setSpotifyAuthenticated(data.status)
                console.log(data.status); // here was a problem
                if (!data.status) {
                fetch("/spotify/get-auth-url")
                    .then((response) => response.json())
                    .then((data) => {
                        window.location.replace(data.url);
                    });
                }
            });
        }
    }, [isHost])

    useEffect(() => {
        getRoomDetails();
    }, [getRoomDetails]);

    useEffect(() => {
        if (!isHost) {
            return
        } else if (isHost) {
            authenticateSpotify();
        }
    }, [isHost]);

    // Make a request each 1 seconds on server to update the data of currents song
    useEffect(() => {
        const intervalId = setInterval(() => {
            getCurrentSong();
          }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    function leaveButtonPressed() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {
          leaveRoomCallback();
          navigate("/");
        });
    }

    function getCurrentSong() {
        fetch("/spotify/current-song")
            .then((response) => {
                if (!response.ok) {
                    return {};
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                setSong(data)
                // console.log(song);
            });
    }

    function updateShowSettings(value) {
        setShowSettings(value)
    }

    if (showSettings) {
        return (
            <Settings 
            votesToSkip={votesToSkip} 
            guestCanPause={guestCanPause} 
            roomCode={roomCode} 
            getRoomDetails={getRoomDetails} 
            updateShowSettings={updateShowSettings} />
        );
      }

    return (
        <Grid container spacing={1}>
            <div className='code'>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {roomCode}
                    </Typography>
                </Grid>
            </div>
            <MusicPlayer
                title={song.title}
                artist={song.artist}
                image_url={song.image_url}
                is_playing={song.is_playing}
                time={song.time}
                duration={song.duration}
                votes={song.votes}
                votes_require={song.votes_require}
            />
            {isHost ? <SettingsButton updateShowSettings={updateShowSettings}/> : null}
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={leaveButtonPressed}
                >
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    )
}

export default Room


const Settings = ({ votesToSkip, guestCanPause, roomCode, getRoomDetails, updateShowSettings }) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage
                    update={true}
                    votesToSkip={votesToSkip}
                    guestCanPause={guestCanPause}
                    roomCode={roomCode}
                    updateCallback={getRoomDetails}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => updateShowSettings(false)}
                >
                    Close
                </Button>
            </Grid>
        </Grid>
    )
}

const SettingsButton = ({ updateShowSettings }) => {
    return (
        <Grid item xs={12} align="center">
            <Button
                variant="contained"
                color="primary"
                onClick={() => updateShowSettings(true)}
            >
                Settings
            </Button>
        </Grid>
    )
}