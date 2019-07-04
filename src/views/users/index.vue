<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜素区 -->
    <div style="margin: 15px 0;">
      <el-input
        v-model="query"
        placeholder="请输入内容"
        class="input-with-select"
        style="width:300px;margin-right:15px"
        @keyup.enter.native="search"
      >
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" @click="addDialogFormVisible = true">添加用户</el-button>
    </div>
    <!--表格区 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="150" ></el-table-column>
      <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态" width="100">
        <template slot-scope="scope">
          <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :label-width="'80px'" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, addUser } from '@/api/user_api.js'
export default {
  data () {
    return {
      addDialogFormVisible: false,
      // 添加用户新数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      total: 0,
      // 用户搜索关键字
      query: '',
      // 当前页码
      pagenum: 1,
      // 每页显示的记录数
      pagesize: 1,
      value2: true,
      userList: [],
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写email', trigger: 'blur', pattern: /\w+[@]\w+[.]\w{2,3}/ }
        ],
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { pattern: /^1[345678]\d{9}$/, message: '请填写正确的手机号(11位数字)', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 添加新用户
    addUser () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm)
            .then(res => {
              if (res.data.meta.status === 201) {
                this.addDialogFormVisible = false
                this.$refs.addForm.resetFields()
                this.init()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    // 搜索
    search () {
      this.pagenum = 1
      this.init()
    },
    // 切换页面下拉列表触发
    handleSizeChange (val) {
      this.pagesize = val
      this.init()
    },
    // 切换当前页面
    handleCurrentChange (val) {
      this.pagenum = val
      this.init()
    },
    // 获取用户数据
    init () {
      getUserList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
        .then(res => {
          console.log(res)
          this.userList = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
