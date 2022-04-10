// import { Octokit } from 'octokit'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@lib/session'
// import { NextApiRequest, NextApiResponse } from 'next'
// const octokit = new Octokit()
import fetchJson, { FetchError } from '@lib/fetchJson'
import FormData from 'form-data'

export default withIronSessionApiRoute(loginRoute, sessionOptions)

async function loginRoute(req, res) {
  const { email, password } = await req.body

  let formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);

  try {
    const userData =  await fetchJson('http://localhost:8000/authentication', {
      method: 'POST',
      body: formData
    })

    const user = { isLoggedIn: true, id: userData.id }
    req.session.user = user
    await req.session.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error).message })
  }
}
