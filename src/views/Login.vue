<template>
    <div class="login">
        <div class="container">
        <img src="../assets/avatar.jpg" alt="" class="avatar">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="myicon myicon-user"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            prefix-icon="myicon myicon-key"
            placeholder="请输入密码"
            clearable
            @keyup.enter.native='loginsubmit'
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="loginsubmit">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
    </div>
</template>
<script>
import { login } from "@/api/user_api.js";
export default {
     data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        // 每个名字对应着一个规则
        username: [
          // required：必须的
          // message：不满足规则时的提示信息
          // trigger：什么时候触发：blur指失去焦点时触发
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码必须在6~16位之间', trigger: 'blur' }
        ]
      }
    }
  },
   methods: {
    loginsubmit () {
      // 再次实现用户数据的验证
      //   可以调用当前表单的validate函数，当验证完毕的时候，会调用这个函数中的回调函数,它有一个valid的参数
      // 这个参数就是用来标记当前验证是否通过，如果为true,则通过，否则不通过
      this.$refs.loginForm.validate(valid => {
        if (valid) {
        //   调用接口方法实现用户登陆
          login(this.loginForm)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 200) {
                //   将token数据存储到本地
                localStorage.setItem('heima_manager_token', res.data.data.token)
                //   跳转
                this.$router.push({ name: 'Home' })
              } else {
                this.$message({
                  type: 'warning',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
        //   this.$message.error('数据输入错误，请重新输入')
          this.$message({
            type: 'error',
            message: '数据输入错误，请重新输入'
          })
          //   一定要return false,否则不能真正的阻止
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
    .login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>


