import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '@src/ProTip';
import Link from '@src/Link';
import LocaleSwitcher from '@components/LocaleSwitcher';
import Layout from '@components/dashboard/Dashboard';
import { sessionRoute, sessionOptions } from '@lib/session'
import { withIronSessionSsr } from 'iron-session/next';

export const getServerSideProps = withIronSessionSsr(sessionRoute, sessionOptions)

export default function Index({ user }) {
  console.log(user)
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          User: { user.id }
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <LocaleSwitcher></LocaleSwitcher>
        <ProTip />
      </Box>
    </Container>
  );
}

Index.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}