import { getSession } from "next-auth/react"
import { URL, URLSearchParams } from 'url'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (session) {
    let url = new URL('http://localhost:8000/customers/')
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

// const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// export default function handler(req, res) {
//     if (req.method === 'POST') {
//         // Process a POST request
//     } else {
//         // Handle any other HTTP method
//         res.status(200).json(rows)
//     }
// };