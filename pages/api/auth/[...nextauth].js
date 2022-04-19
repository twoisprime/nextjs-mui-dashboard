import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import FormData from 'form-data'
import { signOut } from "next-auth/react"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        let formData = new FormData();
        formData.append("username", credentials.username);
        formData.append("password", credentials.password);

        const res = await fetch("http://localhost:8000/authentication", {
          method: 'POST',
          body: formData
        })
        // const res = await fetch("/your/endpoint", {
        //   method: 'POST',
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" }
        // })
        const user = await res.json()
 
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // the user object is what returned from the Credentials login, it has `accessToken` from the server `/login` endpoint
      // assign the accessToken to the `token` object, so it will be available on the `session` callback
      if (user) {
        token.accessToken = user.access_token
        token.accessTokenExpires = Date.now() + parseInt(user.access_token_expires) * 1000  // milliseconds
      }

      // TODO
      // Return previous token if the access token has not expired yet
      // if (Date.now() < token.accessTokenExpires) {
      //   return token
      // }

      // Access token has expired, try to update it
      // return refreshAccessToken(token)

      return token
    },

    async session({ session, token }) {
      // the token object is what returned from the `jwt` callback, it has the `accessToken` that we assigned before
      // Assign the accessToken to the `session` object, so it will be available on our app through `useSession` hooks
      if (token) {
        session.accessToken = token.accessToken
      }
      // check if access token expired
      if (token && Date.now() > token.accessTokenExpires) {
        return {}  // no session -> require login
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout',
    error: '/login', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }
})

// TODO
/**
 * https://next-auth.js.org/tutorials/refresh-token-rotation
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
//  async function refreshAccessToken(token) {
//   try {
//     const url =
//       "https://oauth2.googleapis.com/token?" +
//       new URLSearchParams({
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET,
//         grant_type: "refresh_token",
//         refresh_token: token.refreshToken,
//       })

//     const response = await fetch(url, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       method: "POST",
//     })

//     const refreshedTokens = await response.json()

//     if (!response.ok) {
//       throw refreshedTokens
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.access_token,
//       accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
//     }
//   } catch (error) {
//     console.log(error)

//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     }
//   }
// }