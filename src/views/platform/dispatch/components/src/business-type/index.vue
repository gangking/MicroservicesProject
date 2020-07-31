<template>
  <div v-loading="loading">
    <div v-if="activeName == 'BusinessType'">
      <div class="searchType">
        <label>业务类型：</label>
        <el-input v-model="searchValue" placeholder="请输入内容" />
      </div>
      <div class="content">
        <div class="contentItem">
          <div class="title">
            <i class="el-icon-time" />
            <span>最近使用业务类型</span>
          </div>
          <ul class="typeList">
            <li v-for="(item, index) in thishistoryBusinessList" :key="index" style="list-style-type:none" @click="OnBusinessType(item)">
              {{ item.bcDescribe }}
            </li>
          </ul>
        </div>

        <div class="contentItem">
          <div class="title titleLine">
            <i class="el-icon-success" />
            <span>可用业务类型</span>
          </div>
          <div class="typeCatalog">
            <el-row :gutter="20">
              <el-col v-for="(item, key, index) in businessDataList" :key="index" :span="12">
                <div class="grid-content bg-purple">
                  <div class="catalog">
                    {{ key }}
                  </div>
                  <div v-for="(val, k) in item" :key="k" class="typeName" @click="OnBusinessType(val)">
                    {{ val.showName }}
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import LocalStorageCache from 'localstorage-cache';
import ComponentProps from '../../../Invoice/mixins/components-props';
const { mapActions, mapState, mapGetters } = createNamespacedHelpers('ibps/compositeMultiline');
import _ from 'lodash';
export default {
  name: 'business-type',
  mixins: [ComponentProps],

  data() {
    return {
      activeName: 'BusinessType',
      searchValue: '',
      historyBusinessList: [],
      getbusinessData: {},
      loading: false,
      cacheBusinessList: {},
      debouncedGetAnswer: null,
      storageCache: new LocalStorageCache(2 * 1024, 'LRU')
    };
  },
  inject: ['multiline'],
  computed: {
    businessDataList: {
      get() {
        var list = this.getbusinessData;
        return list;
      },
      set(newValue) {
        this.getbusinessData = newValue;
      }
    },
    thishistoryBusinessList() {
      return this.historyBusinessList;
    },

    businessEventId() {
      return this.stepVal.btKey;
    },

    cacheBusinessEventId() {
      return this.stepVal.id + this.stepVal.bsId + this.bsiCode;
    }
  },
  watch: {
    businessData(val) {
      console.log('businessData的值', val);
      this.getbusinessData = val;
    },
    searchValue(val) {
      this.debouncedGetAnswer && this.debouncedGetAnswer(val);
    }
  },
  created() {
    const { storageCache, businessEventId = null, cacheBusinessEventId = null } = this;
    console.log('初始化business...');
    if (cacheBusinessEventId) {
      // storageCache.deleteCache(businessEventId);
      const list = storageCache.getCache(cacheBusinessEventId) || [];
      this.historyBusinessList = list;
    }
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 300);
    this.payable.loading = true;

    this.getBusinessTypeList({ businessEventId }).then(data => {
      this.payable.loading = false;
      this.cacheBusinessList = this.getbusinessData = data;
      this.multiline.setBusinessType(data);
    });
  },
  methods: {
    ...mapActions(['getBusinessTypeList']),

    setLocalItem(item) {
      const { storageCache, businessEventId = null, cacheBusinessEventId = null } = this;

      if (cacheBusinessEventId) {
        const list = storageCache.getCache(cacheBusinessEventId) || [];
        const newArray = list.filter(val => {
          return val.id !== item.id;
        });
        newArray.unshift(item);

        storageCache.setCache(cacheBusinessEventId, newArray);
        //this.$set(this, 'historyBusinessList', newArray);
        this.historyBusinessList = Object.freeze(newArray);
        /*  this.historyBusinessList = Object.freeze(newArray);
        console.log(
          'businessEventId-----',
          businessEventId,
          this.stepVal,
          this.historyBusinessList
        ); */
      }
    },

    OnBusinessType(val) {
      this.setLocalItem(val);
      this.payable.onActionEvent(
        'selectBusinessType',
        { btype: val, dataId: '', buttonName: val.showName },
        this
      );
    },

    getAnswer(searchVlue) {
      if (searchVlue && this.cacheBusinessList) {
        const reg = new RegExp(searchVlue, 'i');
        this.getbusinessData = _.transform(
          this.cacheBusinessList,
          (result, value, key) => {
            if (value) {
              const tmpList = value.filter(({ showName }) => {
                return showName.search(reg) > -1;
              });
              if (tmpList.length > 0) {
                result[key] = tmpList;
              }
            }
          },
          {}
        );
      } else {
        this.businessDataList = this.cacheBusinessList;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.searchType {
  display: flex;
  height: 45px;
  line-height: 45px;
  border-bottom: 1.5px solid #49b8ff;
  padding-left: 10px;
  label {
    font-size: 12px;
  }
  /deep/ .el-input {
    width: 120px;
  }
}

.content {
  text-align: left;
  .contentItem {
    // margin-bottom: 20px;
    .title {
      padding: 10px 0 5px 10px;
      i {
        margin-right: 10px;
        background: #67c23a;
        color: white;
        border-radius: 100%;
      }
      span {
        color: #e6a445;
        font-size: 13px;
      }
    }
    .titleLine {
      border-bottom: 1px solid #ccc;
      i {
        color: #67c23a;
        background: white;
      }
    }

    .typeList {
      margin: 0;
      margin-top: 5px;
      overflow: hidden;
      li {
        font-size: 12px;
        // font-weight: bold;
        padding-left: 10px;
        line-height: 30px;
        float: left;
        cursor: pointer;
      }
    }
    .typeCatalog {
      padding: 0 10px;
      .bg-purple {
        .catalog {
          padding-top: 10px;
          padding-bottom: 5px;
          // border-bottom: 2px solid #ccc;
          // font-size: 14px;
          font-size: 12px;
          color: #409eff;
          font-weight: bold;
          /deep/ .el-checkbox__label {
            font-weight: bold;
            font-size: 13px;
          }
          /deep/ .el-checkbox {
            cursor: default;
          }
          /deep/ .el-checkbox__input {
            cursor: default;
          }
        }
        .typeName {
          //   font-weight: bold;
          margin: 10px 0 0 13px;
          cursor: pointer;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
