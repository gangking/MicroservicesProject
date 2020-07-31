 <template>
</template>
<script>
import { BASE_PHOTO_UPLOAD } from "@/api/baseUrl";
export default {
  data() {
    return {
      userId: ""
    };
  },
  mounted() {
    this.changetoUrl();
  },
  methods: {
    changetoUrl() {
      var tempwindow=window.open('_blank'); // 先打开页面
      tempwindow.location=BASE_PHOTO_UPLOAD +"/#/files/imageCollect?userId=" +this.$store.getters.userId; // 后更改页面地址
      this.$router.back(-1);
    }
  }
};
</script>