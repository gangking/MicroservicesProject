export default {
    data() {
        return {
            nativeType: false,
            nativeParams: {},
        }
    },
    methods: {
        openNative(item) {
            this.nativeType = false;
            this.$nextTick(() => {

                const { tabItems: { componentType } } = item;
                this.nativeType = componentType;
                this.nativeParams = item;
            })
        },


    },
}