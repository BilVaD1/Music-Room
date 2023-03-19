import React, { useState, useEffect } from 'react'
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio, Collapse, Alert } from "@mui/material";
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const CreateRoomPage = (props) => {

  const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
  const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    
  }, []);

  function handleVotesChange(e) {
    setVotesToSkip(e.target.value)
  }

  function handleGuestCanPauseChange(e) {
    setGuestCanPause(e.target.value === "true")
  }

  function handleRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => navigate('/room/' + data.code)); // Redirect to the page after clicking button
  }

  function handleUpdateButtonPressed() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: props.roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        setSuccessMsg('Room updated successfully!')
      } else {
        setErrorMsg('Error updating room...')
      }
      props.updateCallback();
    });
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse
          in={errorMsg != "" || successMsg != ""}
        >
          {successMsg != "" ? (
            <Alert
              severity="success"
              onClose={() => {
                setErrorMsg('');
              }}
            >
              {successMsg}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMsg('');
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {props.update ? "Update Room" : "Create a Room"}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <span align="center">Guest Control of Playback State</span>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={props.guestCanPause?.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <span align="center">Votes Required To Skip Song</span>
          </FormHelperText>
        </FormControl>
      </Grid>
      {props.update
        ? <UpdateButtons handleUpdateButtonPressed={handleUpdateButtonPressed}/>
        : <CreateButtons handleRoomButtonPressed={handleRoomButtonPressed}/>}
    </Grid>
  )
}

export default CreateRoomPage


const CreateButtons = ({ handleRoomButtonPressed }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={handleRoomButtonPressed}
        >
          Create A Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  )
}

const UpdateButtons = ({ handleUpdateButtonPressed }) => {
  return (
    <Grid item xs={12} align="center">
      <Button
        color="primary"
        variant="contained"
        onClick={handleUpdateButtonPressed}
      >
        Update Room
      </Button>
    </Grid>
  )
}