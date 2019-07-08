import axios from '@/api/common.js'
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
// 获取左侧菜单栏
export const getLeftMenuList = () => {
  return axios({
    url: 'menus'
  })
}
