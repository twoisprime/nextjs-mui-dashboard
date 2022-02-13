import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const DynamicComponentWithNoSSR = dynamic(
  () => import('@components/Calendar'),
  { ssr: false }
)

const Calendar = () => {
  const router = useRouter();
  const { locale } = router;
  return (
    <DynamicComponentWithNoSSR locale={locale} />
  );
};

export default Calendar;