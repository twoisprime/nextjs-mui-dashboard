import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from '@components/dashboard/Chart';
import Deposits from '@components/dashboard/Deposits';
import Orders from '@components/dashboard/Orders';
import Layout from '@components/dashboard/Dashboard';
import { sessionRoute, sessionOptions } from '@lib/session'
import { withIronSessionSsr } from 'iron-session/next';


export const getServerSideProps = withIronSessionSsr(sessionRoute, sessionOptions)

export default function Examples() {
  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Chart />
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Deposits />
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Orders />
        </Paper>
      </Grid>
    </Grid>
  );
}

Examples.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}