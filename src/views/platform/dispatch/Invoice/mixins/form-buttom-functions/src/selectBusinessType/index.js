export default function (item) {
    const { buttonName } = item;
    this.tagsClear(item); //情况tags
    return new Promise((resolve, reject) => {
        this.$nextTick(() => {
            item.tabItems = {
                label: buttonName,
                name: "open-multilineDynamicForm",
                componentType: 'multilineDynamicForm',
                key: 'open-multilineDynamicForm',
            };
            resolve(item);
        })
    })



}