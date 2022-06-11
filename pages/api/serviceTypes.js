import { getSession } from "next-auth/react"
import { URL, URLSearchParams } from 'url'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (session) {
    let url = new URL('http://localhost:8000/service_types/')
    url.search = new URLSearchParams(req.query).toString();
    const response = await fetch(url, {
      // assign the token as bearer token on your request headers
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      }
    })
    const customers = await response.json();

    res.status(response.status).json(customers)
  } else {
    res.status(401)
  }

  res.end()

}