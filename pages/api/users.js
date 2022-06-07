import { getSession } from "next-auth/react"
import { URL, URLSearchParams } from 'url'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (session) {
    let url = new URL('http://localhost:8000/users/')
    url.search = new URLSearchParams(req.query).toString();
    const response = await fetch(url, {
      // assign the token as bearer token on your request headers
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      }
    })
    const users = await response.json();

    res.status(response.status).json(users)
  } else {
    res.status(401)
  }

  res.end()

}