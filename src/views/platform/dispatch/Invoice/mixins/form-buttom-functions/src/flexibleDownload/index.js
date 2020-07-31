export default (item) => {
    const { buttonName } = item;
    console.log('点击灵活下载1111')
    item.tabItems = {
        label: buttonName,
        name: "invoice-flexible-download",
        componentType: 'invoice-flexible-download',
        key: 'invoice-flexible-download',
    };
    return item;
}