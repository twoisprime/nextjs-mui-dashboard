import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Layout from '@components/dashboard/Dashboard';
import { sessionRoute, sessionOptions } from '@lib/session'
import { withIronSessionSsr } from 'iron-session/next';


export const getServerSideProps = withIronSessionSsr(sessionRoute, sessionOptions)

const DynamicComponentWithNoSSR = dynamic(
  () => import('@components/Calendar'),
  { ssr: false }
)

export default function Calendar() {
  const router = useRouter();
  const { locale } = router;
  return (
    <DynamicComponentWithNoSSR locale={locale} />
  );
};

Calendar.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}