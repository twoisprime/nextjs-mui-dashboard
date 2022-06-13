import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'

// const fetcher = (url, params) => fetch(`${url}?${params}`).then(res => res.json())

const fetcher = async (url, params) => {
  const res = await fetch(`${url}?${params}`)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    // error.info = await res.json()
    error.status = res.status
    throw error
  }

  return res.json()
}

export default function useService(serviceID) {
  const valid = serviceID ? true : false

  const { data, error } = useSWRImmutable(valid ? ['/api/service', new URLSearchParams({
    'serviceID': serviceID
  }).toString()] : null, fetcher)

  return {
    service: data,
    isLoading: !error && !data,
    isError: error ? true : false,
    isAuthorized: error && error.status === 401 ? false : true
  }
}