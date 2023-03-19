import React, { useEffect } from 'react'
import Grid from "@mui/material/Grid";
import { ButtonGroup, Typography, Button } from "@mui/material";
import { Link } from 'react-router-dom'

import { useNavigate } from "react-router-dom";

const Home = ({ roomCode }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (roomCode){
            navigate(`/room/${roomCode}`);
        }
    },[roomCode]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} align="center">
            <Typography variant="h3" compact="h3">
                House Party
            </Typography>
            </Grid>
            <Grid item xs={12} align="center">
            <ButtonGroup disableElevation variant="contained" color="primary">
                <Button color="primary" to="/join" component={Link}>
                Join a Room
                </Button>
                <Button color="secondary" to="/create" component={Link}>
                Create a Room
                </Button>
            </ButtonGroup>
            </Grid>
        </Grid>
    )
}

export default Home