import JForm from "@/business/platform/form/utils/JForm"; // 自定义脚本
let watchArray = [];
const JFormMixins = {
  data() {
    return {
      is_mounted: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initScript();
      this.is_mounted = true;
    });
  },
  watch: {
    formDefData() {
      if (this.is_mounted) {
        this.initScript();
      }
    }
  },

  methods: {
    initScript() {
      this.unWatch();
      JForm.cleanEvents();
      this.loadScript();
      JForm.onLoad && JForm.onLoad(this, this.form());
      // 当数据表格定义发生变化的清空Jform
    },
    form() {
      return this.$refs["dynamic"];
    },
    unWatch() {
      watchArray.forEach((v, i) => {
        if (v) {
          v();
        }
      });
      watchArray = [];
    },
    loadScript() {
      const { attrs = {} } = this.formDefData;
      const { script = null } = attrs;
      if (script) {
        console.log(script);
        return new Function(script)();
      }
    },
    onFormDataChange(field, method) {
      watchArray.push(
        this.$watch(`models.${field}`, nval => {
          //  console.log('onformDataChange:', nval)
          this.$emit("value-change-method", field, nval, method);
        })
      );
    }
  }
};

export { JFormMixins };
