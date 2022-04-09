import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Layout from '@components/dashboard/Dashboard';

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