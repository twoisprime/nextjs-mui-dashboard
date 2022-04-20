import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '@src/ProTip';
import Link from '@src/Link';
import LocaleSwitcher from '@components/LocaleSwitcher';
import Layout from '@components/dashboard/Dashboard';
import { useSession, getSession } from "next-auth/react";
import useUser from '@lib/useUser';

export default function Index() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      console.log("not authenticated!")
    },
  });

  // if (status === "loading") {
  //   console.log("not authenticated!")
  // }

  const { user, isLoading, isError } = useUser()

  let email = null;

  if (isLoading) email = 'loading...';
  if (isError) email = 'error'
  if (user) email = user.email;


  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          User: { email }
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

  return {
    props: { session }
  }
}