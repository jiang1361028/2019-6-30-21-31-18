<template>
  <div class="role">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain>添加角色</el-button>
    <el-table :data="roleList" border style="width: 100%">
        <!-- 展开栏 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="first in scope.row.children" :key="first.id" style='margin-bottom:10px;border-bottom:1px #ccc dashed'>
            <el-col :span="4">
              <el-tag closable type="success" @close="delRight(scope.row,first.id)">{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
                <el-row v-for='second in first.children' :key='second.id' style='margin-bottom:6px'>
                    <el-col :span='4'>
                        <el-tag closable type="warning" @close="delRight(scope.row,second.id)">{{second.authName}}</el-tag>
                    </el-col>
                    <el-col :span='20'>
                        <el-tag closable type="info" v-for='third in second.children' :key='third.id' style='margin-right:4px;margin-bottom:6px' @close="delRight(scope.row,third.id)">{{third.authName}}</el-tag>
                    </el-col>
                </el-row>
            </el-col>
          </el-row>
          <el-row>
              <el-col :span='24' v-show='scope.row.children.length === 0'> 没有任何的权限，请先去分配</el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 数据栏 -->
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作" >
          <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" ></el-button>
          </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
            <el-button type="primary" icon="el-icon-more" @click="showGrantDialog(scope.row)" ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" >
            <el-button type="primary" icon="el-icon-delete" ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加权限对话框 -->
     <el-dialog title="授权角色" :visible.sync="grantdialogFormVisible">
      <el-tree
         ref='mytree'
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='grantRightSubmit'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRoleLlist, delRightByRoleId, grantRightForRole } from '@/api/role_api.js'
import { getAllRightList } from '@/api/right_api.js'
export default {
  data () {
    return {
      roleId: '',
      rightList: [],
      checkedArr: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      grantdialogFormVisible: false,
      // 数据
      roleList: []
    }
  },

  methods: {
    //   给用户添加权限
    grantRightSubmit () {
      // 把对象字符串转换成数组去重
      let arr = this.$refs.mytree.getCheckedNodes()
      let temp = []
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      let str = temp.join(',')
      let arr2 = str.split(',')
      let finalArr = [...new Set(arr2)]
      grantRightForRole(this.roleId, finalArr.join(','))
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.grantdialogFormVisible = false
            this.init()
          }
        })
    },
    // 展示角色对话框
    showGrantDialog (row) {
      this.grantdialogFormVisible = true
      this.roleId = row.id
      getAllRightList('tree')
        .then(res => {
          this.rightList = res.data.data
        })
      this.checkedArr.length = 0
      row.children.forEach((first, index) => {
        if (first.children && first.children.length > 0) {
          // 遍历二级权限
          first.children.forEach(second => {
            if (second.children && second.children.length > 0) {
              // 遍历三级权限
              second.children.forEach(third => {
                this.checkedArr.push(third.id)
              })
            }
          })
        }
      })
    },

    //   删除权限操作
    delRight (row, rightId) {
      delRightByRoleId(row.id, rightId)
        .then(res => {
        //   console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            // 重置当前当前展开行
            row.children = res.data.data
          }
        })
    },
    //   数据渲染
    init () {
      getAllRoleLlist()
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.roleList = res.data.data
          }
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
