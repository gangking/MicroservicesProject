<template>
  <div class="tree" ref="main">
    <el-table
      :data="treeData"
      style="width: 100%;"
      row-key="id"
      border
      default-expand-all
      class="treeTable"
      :height="height"
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="material" label="价格构成" width="180"></el-table-column>
      <el-table-column label="数量">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.menge" type="number" maxlength="20" />
        </template>
      </el-table-column>
      <el-table-column label="本次报价">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.currentPrice" type="number" maxlength="20" />
        </template>
      </el-table-column>
      <el-table-column label="历史参考">
        <template slot-scope="scope">
          <el-input v-model.number="scope.row.historyPrice" type="number" maxlength="20" />
        </template>
      </el-table-column>
      <el-table-column label="说明">
        <template slot-scope="scope">
          <el-input v-model="scope.row.description" placeholder="请输入说明"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      height: "200",
      treeData: [
        {
          id: 1,
          material: "后桥总成",
          menge: "",
          currentPrice: "2419",
          historyPrice: "2392",
          description: "",
          children: [
            {
              id: 11,
              material: "桥壳总成",
              menge: "1",
              currentPrice: "34",
              historyPrice: "34",
              description: "",
              children: [
                {
                  id: 111,
                  material: "半壳体",
                  menge: "2",
                  currentPrice: "22",
                  historyPrice: "22",
                  description: ""
                },
                {
                  id: 112,
                  material: "螺母",
                  menge: "8",
                  currentPrice: "12",
                  historyPrice: "12",
                  description: ""
                }
              ]
            },
            {
              material: "主减总成",
              menge: "1",
              currentPrice: "1716",
              historyPrice: "1701",
              description: "",
              id: 12,
              children: [
                {
                  id: 121,
                  material: "差速器壳总成",
                  menge: "1",
                  currentPrice: "1672",
                  historyPrice: "1659",
                  description: ""
                },
                {
                  id: 122,
                  material: "差速器配套件",
                  menge: "1",
                  currentPrice: "34",
                  historyPrice: "32",
                  description: ""
                },
                {
                  id: 123,
                  material: "垫圈10821",
                  menge: "1",
                  currentPrice: "4",
                  historyPrice: "4",
                  description: ""
                },
                {
                  id: 124,
                  material: "垫圈07024",
                  menge: "2",
                  currentPrice: "6",
                  historyPrice: "6",
                  description: ""
                }
              ]
            },
            {
              id: 22,
              material: "制动器总成",
              menge: "1",
              currentPrice: "259.23",
              historyPrice: "259.23",
              description: "外购"
            },
            {
              id: 23,
              material: "轮毂总成",
              menge: "1",
              currentPrice: "78.36",
              historyPrice: "70.84",
              description: "代工"
            },
            {
              id: 24,
              material: "生产耗材",
              menge: "1",
              currentPrice: "134",
              historyPrice: "130",
              description: ""
            },
            {
              id: 25,
              material: "管理分摊",
              menge: "1",
              currentPrice: "185.41",
              historyPrice: "184.93",
              description: ""
            },
            {
              id: 26,
              material: "包装垫架",
              menge: "1",
              currentPrice: "12",
              historyPrice: "12",
              description: ""
            }
          ]
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    setTimeout(() => {
     // console.log(this.$refs.main.clientHeight, "this.$refs.main.clientHeight");
      this.height = this.$refs.main.clientHeight;
    }, 100);
  },
  watch: {},
  methods: {},
  components: {}
};
</script>

<style scoped lang="scss">
.tree {
  height: 100%;
  width: 100%;
  .treeTable {
    // height: 100%;
  }
}
</style>
