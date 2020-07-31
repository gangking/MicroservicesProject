export default {
    data() {
        return {
            dynamicOpenInDailogType: false,
            dynamicOpenInDailog: false,
            dynamicOpenInDailogTitle: "",
            dailogdynamicRefName: "dailogdynamic",
            dailogdynamicRefNameItemVal: {},
        }
    },
    methods: {
        openInDailog(item) {
            const { tabItems: { componentType }, buttonName } = item;
            this.dynamicOpenInDailogType = componentType;
            this.dynamicOpenInDailogTitle = buttonName;
            this.dailogdynamicRefNameItemVal = item;
        },

        onDynamicOpen(event) {
            this.$nextTick(() => {
                let vm = this.$refs[this.dailogdynamicRefName], onActivated = 'onActivated';
                vm[onActivated] && vm[onActivated].call(vm)
            })
        },
        onDynamicbeforeClose() {
            let vm = this.$refs[this.dailogdynamicRefName], onActivated = 'beforeLeave';
            vm[onActivated] && vm[onActivated].call(vm)
        }

    }
}