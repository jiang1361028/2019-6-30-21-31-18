import axios from '@/api/common.js'
// 分配校色
export const getAllRoleLlist = () => {
  return axios({
    url: 'roles'
  })
}
// 删除展开角色权限
export const delRightByRoleId = (roleId, rightId) => {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
// 为角色分配权限
export const grantRightForRole = (roleId, rids) => {
  return axios({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: { rids }
  })
}
