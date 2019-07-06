<template>
    <div class="right">
        <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 数据框 -->
    <el-table :data="rightList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级" width="100">
        <template slot-scope="scope">{{scope.row.level | levelFormat}}</template>
      </el-table-column>
    </el-table>
    </div>
</template>
<script>
import { getAllRightList } from '@/api/right_api.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  filters: {
    levelFormat: (level) => {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  },
  mounted () {
    getAllRightList('list')
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.rightList = res.data.data
        }
      })
  }

}
</script>
<style lang="less" scoped>

</style>
