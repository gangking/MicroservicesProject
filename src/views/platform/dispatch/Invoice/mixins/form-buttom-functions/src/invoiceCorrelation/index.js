export default (item) => {
    const { buttonName } = item;
    console.log('申请关联',item)
    item.tabItems = {
        label: buttonName,
        name: "invoice-invoice-import",
        componentType: 'invoice-invoice-import',
        key: 'invoice-invoice-import'
    };
    return item;
}