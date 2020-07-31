export default (item) => {
    const { buttonName } = item;
    console.log('余额查看',item)
    item.tabItems = {
        label: buttonName,
        name: "invoice-balance-view",
        componentType: 'invoice-balance-view',
        key: 'invoice-balance-view',
    };
    return item;
}