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
import { green } from '@mui/material/colors';
import useTranslation from 'next-translate/useTranslation'
import { signIn, getSession } from "next-auth/react"
import { useRouter } from 'next/router'


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Login() {
  const { t, lang } = useTranslation('common')
  const router = useRouter()
  const {error} = router.query

  const [loading, setLoading] = React.useState(false);
  // const [errorMsg, setErrorMsg] = useState('')
  const initOpen = error !== undefined
  // snackar alerts
  const [open, setOpen] = useState(initOpen);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!loading) {
      setLoading(true);
    }

    const data = new FormData(event.currentTarget);
    signIn("credentials", { username: data.get('email'), password: data.get('password') })
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
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}