import React, { useEffect } from 'react'
import { SkipNext, Pause, PlayArrow } from "@mui/icons-material";
import {Grid, IconButton, Typography, LinearProgress, Card} from "@mui/material";

const MusicPlayer = ({ title, image_url, artist, is_playing, time, duration, votes, votes_require }) => {

    const songProgress = (time / duration) * 100;

    useEffect(() => {
        console.log(`This is ${title}`)
    }, [title]);

    function pauseSong() {
        console.log('pause')
        const requestOption = {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
        }
        fetch('/spotify/pause', requestOption);
    }

    function playSong() {
        console.log('play')
        const requestOption = {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
        }
        fetch('/spotify/play', requestOption);
    }

    function skipSong() {
        console.log('skip')
        const requestOption = {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        }
        fetch('/spotify/skip', requestOption);
    }

    const handleSongButtonClick = () => {
        if (is_playing) {
          pauseSong()
        } else {
          playSong()
        }
      }

    return (
        <Card>
            <Grid container alignItems="center">
            <Grid item align="center" xs={4}>
                <img src={image_url} height="100%" width="100%" />
            </Grid>
            <Grid item align="center" xs={8}>
                <Typography component="h5" variant="h5">
                {title}
                </Typography>
                <Typography color="textSecondary" variant="subtitle1">
                {artist}
                </Typography>
                <div>
                <IconButton onClick={handleSongButtonClick}>
                    {is_playing ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton onClick={skipSong}>
                    <SkipNext /> {votes} /{" "} 
                    {votes_require}
                </IconButton>
                </div>
            </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
        </Card>
    )
}

export default MusicPlayer