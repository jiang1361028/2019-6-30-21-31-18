import axios from '@/api/common.js'
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
