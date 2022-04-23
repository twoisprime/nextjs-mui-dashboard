import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Layout from '@components/dashboard/Dashboard';
import { useSession, getSession } from "next-auth/react";

export default function About() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <Button variant="contained" component={Link} noLinkStyle href="/">
          Go to the main page
        </Button>
        <ProTip />
      </Box>
    </Container>
  );
}

About.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: `/${context.locale}/login`,
        permanent: false,
      },
    }
  }

  await new Promise((resolve) => {
    setTimeout(resolve, 5000)
  })

  return {
    props: { session }
  }
}