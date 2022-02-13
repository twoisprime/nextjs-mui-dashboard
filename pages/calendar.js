import React from 'react'
import dynamic from 'next/dynamic'

import Container from "@mui/material/Container";

const DynamicComponentWithNoSSR = dynamic(
  () => import('@components/Calendar'),
  { ssr: false }
)

const Calendar = () => {
  return (
    <DynamicComponentWithNoSSR />
  );
};

export default Calendar;