export default (item) => {
    const { buttonName } = item;
    console.log('点击明细导出')
    item.tabItems = {
        label: buttonName,
        name: "invoice-detail-derivation",
        componentType: 'invoice-detail-derivation',
        key: 'invoice-detail-derivation',
    };
    return item;
}