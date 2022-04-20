import { getSession } from "next-auth/react"
import { URL, URLSearchParams } from 'url'

export default async function handler(req, res) {
  const session = await getSession({ req })
  console.log(req.url)
  console.log(req.query)

  if (session) {
    let url = new URL('http://localhost:8000/events/')
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url, {
      // assign the token as bearer token on your request headers
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      }
    })
    const event = await response.json();

    console.log(event)
    res.status(200).json(events)
  } else {
    res.status(401)
  }

}