import axios from '@/api/common.js'
// 分配校色
export const getAllRoleLlist = () => {
  return axios({
    url: 'roles'
  })
}
