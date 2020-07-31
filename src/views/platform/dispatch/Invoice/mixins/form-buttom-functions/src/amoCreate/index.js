import request from '@/utils/request'
import { COMP_URL } from '@/api/baseUrl'
export default {
  methods: {
    // 生成台账
    amoCreate(item) {
      if (this.docNumber) {
        return request({
          url:
            COMP_URL + `/scene/v3/outstandingaccount/create?docNumber=${this.docNumber}`,
          method: "get"
        })
          .then(res => {
            if (res.state == 200) {
              this.$message.success("新增成功!");
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(error => {
            this.$message.error(error.message);
          });
      }
      return false;
    },

  },
}