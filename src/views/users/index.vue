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
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
          @change="changeUserState(scope.row.id,scope.row.mg_state)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-share" @click="showGrandDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" >
            <el-button type="primary" icon="el-icon-delete" @click="deluserbyid(scope.row.id)"></el-button>
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
          <el-input v-model="addForm.password" auto-complete="off" type='password'></el-input>
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
        <el-button type="primary" @click="addUserr">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="grantdialogFormVisible">
      <el-form :model="grantForm" :label-width="'120px'">
        <el-form-item label="用户名">
          <el-input v-model="grantForm.username" auto-complete="off" disabled="" style='width:100px'></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="grantForm.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='grantRoleSubmit'>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编制用户对话框 -->
     <el-dialog title="编辑用户" :visible.sync="editdialogFormVisible">
      <el-form :model="editForm" :label-width="'120px'" :rules='rules' ref='editForm'>
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" auto-complete="off" disabled="" style='width:100px'></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop='mobile'>
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='editUserSubmit'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, addUser, updateUserState, delUser, grantUserRole, editUser } from '@/api/user_api.js'
import { getAllRoleLlist } from '@/api/role_api.js'
export default {
  data () {
    return {
      // 编辑对话框
      editdialogFormVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''

      },
      // 分配角色弹框
      grantdialogFormVisible: false,
      roleList: [],
      grantForm: {
        username: '',
        id: '',
        rid: ''
      },
      // 添加用户弹窗
      addDialogFormVisible: false,
      // 添加用户新数据
      addForm: {
        username: '',
        password: '',
        email: 'maozige@maozi.com',
        mobile: '13512345789'
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
    getAllRoleLlist()
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
  },
  methods: {
    // 显示编辑显示框
    showEditDialog (row) {
      console.log(row)
      this.editdialogFormVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    editUserSubmit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editUser(this.editForm)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                this.editdialogFormVisible = false
                this.init()
              }
            })
        } else {
          this.$message({
            type: 'error',
            message: '编辑格式错误'
          })
        }
      })
    },
    // 显示分配角色框显示
    showGrandDialog (row) {
      console.log(row)
      this.grantdialogFormVisible = true
      this.grantForm.username = row.username
      this.grantForm.id = row.id
      // 防御型编程
      this.grantForm.rid = row.rid
    },
    // 分配用户角色
    grantRoleSubmit () {
      if (!this.grantForm.id) {
        this.$message({
          type: 'warning',
          message: '请先选择角色'
        })
        return false
      }
      grantUserRole(this.grantForm.id, this.grantForm.rid)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg

            })
            this.grantdialogFormVisible = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除单个用户
    deluserbyid (id) {
      this.$confirm('此操作将永久删除该用户，是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      // 单击确定执行.then
        .then(() => {
          // 执行后台删除
          delUser(id)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                // 判断本次删除之后，当前页还有没有数据，如果有数据，就保持页码为当前页，否则就到上一页
                this.pagenum = Math.ceil(this.total - 1 / this.pagesize) < this.pagenum ? --this.pagenum : this.pagenum
                this.init()
              }
            })
            .catch(err1 => {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        // 点击取消执行.catch
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改用户状态
    changeUserState (id, type) {
      updateUserState(id, type)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加新用户
    addUserr () {
      this.$refs.addForm.validate(valid => {
        console.log(valid)
        if (valid) {
          // console.log(this.addForm)
          addUser(this.addForm)
            .then(res => {
              console.log(res)
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
