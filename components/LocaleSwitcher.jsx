// https://gist.github.com/kachar/ee23a13dffa493179e835f3482f3b470
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, ButtonGroup } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/es'


export default function LocaleSwitcher() {
  const { t, lang } = useTranslation('common')
  const router = useRouter()
  const { pathname, asPath, query } = router
  
  const changeLang = useCallback(
    // Same route different language
    // (locale) => () => router.push(router.route, undefined, { locale }), 
    // change just the locale and maintain all other route information including href's query
    (nextLocale) => () => {
      dayjs.locale(nextLocale)
      router.push({ pathname, query }, asPath, { locale: nextLocale })
    },
    [],
  )
  
  return (
    <Box textAlign="center">
      <ButtonGroup
        disableRipple
        variant="outlined"
        color="primary"
        aria-label="text primary button group">
        <Button onClick={changeLang('es-ES')}>{t('ES')}</Button>
        <Button onClick={changeLang('en-US')}>{t('EN')}</Button>
      </ButtonGroup>
    </Box>
  )
}