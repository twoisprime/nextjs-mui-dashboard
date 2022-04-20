import useSWR from 'swr';

const fetcher = (url, params) => fetch(`${url}?${params}`).then(res => res.json())

export default function useEvents(user, params) {
  const {start, end} = params
  const valid = (user && start && end) ? true : false

  const { data, error } = useSWR(valid ? ['/api/events', new URLSearchParams({
    'user_id': user.id,
    'start': start,
    'end': end
  }).toString()] : null, fetcher)

  return {
    events: data,
    isLoading: !error && !data,
    isError: error
  }
}