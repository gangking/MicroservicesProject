<template>
  <li class="tree-item-li">
    <div v-if="isEnd"
         :class="nodes.cengji==0?'line2 line2one':'line2'"></div>
    <div v-if="isEnd && isActive"
         class="line"></div>
    <i :class="isActive?'el-icon-minus':'el-icon-plus'"
       v-if="isEnd"
       @click="activeItem"></i>
    <span class="tree-item-label"
          @click="clickItem(nodes)">{{nodes.name}}</span>
    <ul v-if="isEnd"
        v-show="isActive"
        class="tree-item-ul">
      <my-tree v-for="(item, index) in nodes.nodes"
               :key="index"
               :nodes="item"
               @getclickchildren="clickchildren">
      </my-tree>
    </ul>
    <span class="status"
          v-if="!isEnd"
          @click="clickItem(nodes)">
      <span>
        <i :class="'icon-'+nodes.className2"
           :style="'color:'+nodes.color2+';margin: 0 5px;'"></i>
      </span>
      <!-- 只要有消息都提示出来 -->
      <el-tooltip popper-class="tooltips" v-if="nodes.postMessage != ''"  :content="nodes.postMessage?nodes.postMessage:'无'"  placement="right">
        <span>
          <i :class="'icon-'+nodes.className" :style="'background:'+nodes.color+';color: white;width: 20px; height: 20px;line-height: 19px;border-radius: 100%;'"></i>
        </span>
      </el-tooltip>
      <span v-else>
          <i :class="'icon-'+nodes.className" :style="'background:'+nodes.color+';color: white;width: 20px; height: 20px;line-height: 19px;border-radius: 100%;'"></i>
        </span>
    </span>

  </li>
</template>

<script>
export default {
  name: 'my-tree',
  props: ['nodes'],
  watch: {
    nodes (val) {
    }
  },
  data () {
    return {
      isActive: true,
      thisStyle: {},
    }
  },
  computed: {
    isEnd () {
      var status = this.nodes.nodes && this.nodes.nodes.length;
      if (this.nodes.nodes && this.nodes.nodes.length) {
        for (var i = 0; i < this.nodes.nodes.length; i++) {
          var item = this.nodes.nodes[i];
          console.log('节点数据', item)
          // sap
          if (item.postStatus) {
            var style1 = this.setStyle(item.postStatus);
            item.color = style1.color;
            item.className = style1.className;
            console.log('节点样式1', style1)
          }
          // 凭证模拟
          if (item.simStatus) {
            var style2 = this.setStyle(item.simStatus);
            item.color2 = style2.color;
            item.className2 = style2.className;
            console.log('节点样式2', style2)
          }
        }

      }

      return status;
    }
  },
  methods: {
    // 设置节点图标及颜色
    setStyle (status) {
      var style = {}
      switch (status) {
        case '00':
          // 未模拟
          style.color = '#ccc';
          style.className = 'uniE252';
          break;
        case '01':
          // 模拟报错
          style.color = '#E78C07';
          style.className = 'uniE1AE';
          break;
        case '02':
          // 模拟成功
          style.color = '#2B7D2B';
          style.className = 'uniE1AB';
          break;
        case '04':
          // 已冲销
          style.color = '#BB0000';
          style.className = 'uniE1AC';
          break;
        case '10':
          // 未生成
          style.color = '#ccc;';
          style.className = 'uniE252';
          break;
        case '11':
          // 生成报错
          style.color = '#E78C07';
          style.className = 'uniE1AE';
          break;
        case '12':
          // 生成成功
          style.color = '#2B7D2B';
          style.className = 'uniE1AB';
          break;
        case '14':
          // 已冲销
          style.color = '#BB0000';
          style.className = 'uniE1AC';
          break;
      }
      return style;
    },
    // 点击展开当前节点
    activeItem () {
      this.isActive = this.isActive ? false : true;
    },
    // 点击节点
    clickItem (info) {
      // console.log('获取树形点击节点值3',info)
      this.$emit('getclickchildren', info)
    },
    clickchildren (info) {
      // this.$message('这是一条消息提示2');
      this.$emit('getclickchildren', info)
    }
  }
}

</script>

<style lang="scss" scoped>
ul {
  list-style: none;
}
.tree-item-li {
  position: relative;
  .tree-item-label {
    cursor: pointer;
  }
  .status {
    span {
      i {
        position: relative;
        z-index: 10;
        background: white;
        display: inline-block;
        width: 12px;
        height: 12px;
        text-align: center;
        line-height: 12px;
        transform: scale(0.8, 0.8);
        font-size: 16px;
        color: #ccc;
        border: 0;
      }
      &:last-child {
        display: inline-block;
        width: 18px;
        height: 18px;
        border-radius: 100%;
        text-align: center;
        line-height: 18px;
        > i {
          background: none;
          margin: 0 auto;
          position: relative;
          right: 1px;
          top: 1px;
        }
      }
    }
  }
  > i {
    position: relative;
    z-index: 10;
    background: white;
    display: inline-block;
    width: 12px;
    height: 12px;
    text-align: center;
    line-height: 12px;
    transform: scale(0.8, 0.8);
    font-size: 12px;
    color: #ccc;
    border: 1px solid #ccc;
  }
  .line {
    position: absolute;
    left: 7px;
    top: 12px;
    border-left: 1px dashed #d8d8d8;
    height: 100%;
    z-index: 9;
  }
  .line2 {
    position: absolute;
    left: 7px;
    top: 12px;
    border-left: 1px dashed #d8d8d8;
    height: 100%;
    z-index: 9;
    display: none;
  }
  .tree-item-ul {
    li {
      margin: 10px 0;
      min-width: 80px;
      &:first-child {
        /deep/ .line {
          display: block !important;
        }
        /deep/ .line2 {
          display: block !important;
        }
      }
      &:last-child {
        /deep/ .line {
          display: none !important;
        }
        /deep/ .line2 {
          display: none !important;
        }
      }
    }
  }
}
</style>
