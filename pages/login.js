import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import useTranslation from 'next-translate/useTranslation'
import { signIn, getSession } from "next-auth/react"
import { useRouter } from 'next/router'
// import Image from 'next/image'
// import logo from "../public/logo.png"


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Login() {
  const { t, lang } = useTranslation('common')
  const router = useRouter()

  const [loading, setLoading] = React.useState(false);
  // snackar alerts
  const [open, setOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!loading) {
      setLoading(true);
    }

    if (open) {
      setOpen(false);
    }

    const data = new FormData(event.currentTarget);
    // redirect: false returns a Promise
    signIn("credentials", { username: data.get('email'), password: data.get('password'), redirect: false }).then(
      function(value) {
        const {error, status, ok, url} = value
        // console.log(value);
        if (ok) {
          router.push('/')
        } else {
          setOpen(true)
          setLoading(false)
        }
      },
      function(error) {
        setLoading(false);
        // console.log(error);
      }
    )
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
    <Container maxWidth="sm">
      <Box
        sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        }}
      >
          {/* <Image src={logo} /> */}
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
          </Avatar>
          {/* <Typography component="h1" variant="h5">
          Sign in
          </Typography> */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t("Email")}
              name="email"
              autoComplete="email"
              autoFocus
          />
          <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t("Password")}
              type="password"
              id="password"
              autoComplete="current-password"
          />
          {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
          /> */}
          <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
          >
              {t("Log In")}
          </Button>
          {loading && (
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center', 
              m: 1
            }}>
              <CircularProgress
                size={36}
                color='primary'
              />
            </Box>
          )}
          {/* <Grid container>
              <Grid item xs>
              <Link href="#" variant="body2">
                  Forgot password?
              </Link>
              </Grid>
              <Grid item>
              <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
              </Link>
              </Grid>
          </Grid> */}
          </Box>
      </Box>
    </Container>
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="error">
        {t("Problem Login")}
      </Alert>
    </Snackbar>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: `/${context.locale}`,
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}