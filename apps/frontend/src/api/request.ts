import { RequestUtils } from '@daehui/shared'

export const requestUtils = new RequestUtils({
  axiosConfig: {
    baseURL: import.meta.env.VITE_API_BASE_URL,
  },
})
