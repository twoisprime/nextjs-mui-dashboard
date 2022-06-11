import { getSession } from "next-auth/react"
import { URL, URLSearchParams } from 'url'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (session) {
    if (req.method === 'POST') {
        let url = new URL('http://localhost:8000/servicesExtra/')
        url.search = new URLSearchParams(req.query).toString();

        const response = await fetch(url, {
            method: 'POST',
            // assign the token as bearer token on your request headers
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify(req.body),
        })
        const service = await response.json();

        res.status(response.status).json(service)
    } else {
        res.status(405)  // method not allowed
    }

  } else {
    res.status(401)
  }

  res.end()

}