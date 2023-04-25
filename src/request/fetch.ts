import { Message, Upload } from '@arco-design/web-vue'
import { useLoadingStore } from '@/stores/loading'

const loading = useLoadingStore()

interface IParams {
  [Key: string]: any
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

const Fetch = (path: string, requestOptions?: RequestInit | undefined | any, Initiate = true) => {
  Initiate && loading.changeLoading()
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
    .finally(() => Initiate && loading.changeLoading())
}

export default {
  get: (path: string, Initiate: boolean = true) => {
    const requestOptions = {
      headers,
      method: 'GET',
      mode: 'cors' as RequestMode,
      redirect: 'manual' as RequestRedirect
    }
    return Fetch(path, requestOptions, Initiate)
  },
  post: (path: string, params: IParams, Initiate: boolean = true) => {
    const requestOptions = {
      headers,
      method: 'POST',
      body: initFetch(params),
      mode: 'cors' as RequestMode,
      redirect: 'manual' as RequestRedirect
    }
    return Fetch(path, requestOptions, Initiate)
  },
  put: (path: string, params: IParams | null = null) => {
    const requestOptions = {
      headers,
      method: 'PUT',
      mode: 'cors' as RequestMode,
      redirect: 'manual' as RequestRedirect
    }
    params && Object.assign(requestOptions, { body: initFetch(params) })
    return Fetch(path, requestOptions)
  },
  delete: (path: string, params: IParams | null = null) => {
    const requestOptions = {
      headers,
      method: 'DELETE',
      mode: 'cors' as RequestMode,
      redirect: 'manual' as RequestRedirect
    }
    params && Object.assign(requestOptions, { body: initFetch(params) })
    return Fetch(path, requestOptions)
  },
  Upload: (path: string, params: IParams, Initiate: boolean) => {
    const requestOptions = {
      method: 'POST',
      body: params,
      mode: 'cors' as RequestMode,
      redirect: 'manual' as RequestRedirect
    }
    return Fetch(path, requestOptions, Initiate)
  }
}
