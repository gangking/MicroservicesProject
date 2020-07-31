export default {
    methods: {
        showExceptions(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "open-multil-process-showExceptions",
                componentType: 'invoice-show-exceptions',
                key: 'open-multil-process-showExceptionst',
                closable: true,
            };
            return item;
        }
    },
}