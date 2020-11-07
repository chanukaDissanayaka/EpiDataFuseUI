import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import withRouter from 'react-router-dom';
import { useHistory } from "react-router-dom";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import fire from '../firebase/firebase';

class SignIn extends React.Component {
  state = {
    email: "",
    password:""
  }
handleChange=(e)=>{
  if(e.target.id==="email"){
    let email = e.target.value
    this.setState({email},()=>{
      console.log(this.state.email)
    })
  } else {
    let password = e.target.value
    this.setState({password},()=>{
      console.log(this.state.password)
    })
  }
}

signIn=()=>{
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
}

handleSubmit = (e) => {
  e.preventDefault()
}
  render(){
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="paper">
        <Avatar className="avatar">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className="form" onChange={this.handleChange} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="submit"
            onClick = {this.signIn}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          EpiDataFuse
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      </Box>
    </Container>
  );
  }
}
export default SignIn;
