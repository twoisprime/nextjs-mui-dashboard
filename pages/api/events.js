import { getSession } from "next-auth/react"
import { URL, URLSearchParams } from 'url'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (session) {
    let url = new URL('http://localhost:8000/eventsCalendar/')
    url.search = new URLSearchParams(req.query).toString();
    const response = await fetch(url, {
      // assign the token as bearer token on your request headers
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      }
    })
    const events = await response.json();

    res.status(200).json(events)
  } else {
    res.status(401)
  }

}