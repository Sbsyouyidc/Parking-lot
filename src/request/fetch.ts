import { Message, Upload } from '@arco-design/web-vue'
import { useCounterStore } from '@/stores/loading'
const loading = useCounterStore()

interface IParams {
  [Key: string]: string
}
const headers = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json'
})

const initFetch = (params: IParams) => {
  const urlencoded = new URLSearchParams()
  for (const iterator in params) {
    urlencoded.append(iterator, params[iterator])
  }
  return urlencoded
}

const Fetch = (path: string, requestOptions?: RequestInit | undefined) => {
  loading.changeLoading()
  return fetch(path, requestOptions)
    .then((response) => {
      const { status } = response
      if (status !== 200) {
        return Promise.reject(`错误码${status}`)
      }
      return response.json()
    })
    .catch((error) => {
      Message.error({
        content: error
      })
    })
    .finally(() => loading.changeLoading())
}
export default {
  get: (path: string) => {
    const requestOptions = {
      headers,
      method: 'GET',
      mode: 'cors' as RequestMode,
      redirect: 'manual' as RequestRedirect
    }
    return Fetch(path, requestOptions)
  },
  post: (path: string, params: IParams) => {
    const requestOptions = {
      headers,
      method: 'POST',
      body: initFetch(params),
      mode: 'cors' as RequestMode,
      redirect: 'manual' as RequestRedirect
    }
    return Fetch(path, requestOptions)
  },
  put: (path: string, params: IParams) => {
    const requestOptions = {
      headers,
      method: 'PUT',
      body: initFetch(params),
      mode: 'cors' as RequestMode,
      redirect: 'manual' as RequestRedirect
    }

    return Fetch(path, requestOptions)
  },
  delete: (path: string) => {
    const requestOptions = {
      headers,
      method: 'DELETE',
      mode: 'cors' as RequestMode,
      redirect: 'manual' as RequestRedirect
    }

    return Fetch(path, requestOptions)
  },

}
