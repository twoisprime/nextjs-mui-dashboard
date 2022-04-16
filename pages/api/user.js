import { getSession } from "next-auth/react"


export default async function handler(req, res) {
  const session = await getSession({ req })
  if (session) {
    // Signed in
    // console.log(session)
    const response = await fetch("http://localhost:8000/user_info/", {
      // assign the token as bearer token on your request headers
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      }
    })
    const user = await response.json();

    // console.log(user)
    res.status(200).json(user)
  } else {
    // Not Signed in
    res.status(401)
  }


//   const user = fetch("http://localhost:8000/users/me/", {
//     // assign the token as bearer token on your request headers
//     headers: {
//       Authorization: `Bearer ${data?.accessToken}`
//     }
//   })

// //   const user = fetch("http://localhost:8000/users/me/", {
// //     method: 'GET',
// //     headers: new Headers({
// //         'accept': 'application/json',
// //         'Authorization': 'Bearer undefined'
// //       })
// //   })

//   // Get data from your database
//   res.status(200).json(user)
}