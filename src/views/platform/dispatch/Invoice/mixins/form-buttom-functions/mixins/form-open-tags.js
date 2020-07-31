export default {
    methods: {
        getTabsContainer($emitVM) {
            do {
                if ($emitVM.isTabsContainer) {
                    break;
                }
                $emitVM = $emitVM.$parent;
            } while ($emitVM)

            return $emitVM;
        },

        addTag(item) {
            const { target: $emitVM } = item;
            this.getTabsContainer($emitVM).addTag(item)
        },

        tagsClear(item) {
            const { target: $emitVM } = item;
            //   console.log('this.getTabsContainer($emitVM)', $emitVM, this.getTabsContainer($emitVM))
            this.getTabsContainer($emitVM).tagsClear()
        }
    },
}