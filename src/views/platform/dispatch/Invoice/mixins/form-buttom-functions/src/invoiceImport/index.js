export default (item) => {
    const { buttonName } = item;
    console.log('发票导入',item)
    item.tabItems = {
        label: buttonName,
        name: "invoice-invoice-import",
        componentType: 'invoice-invoice-import',
        key: 'invoice-invoice-import'
    };
    return item;
}