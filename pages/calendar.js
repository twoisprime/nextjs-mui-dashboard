import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Layout from '@components/dashboard/Dashboard';
import { useSession, getSession } from "next-auth/react";

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

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}