export default function (item) {
    const { buttonName } = item;

    this.tagsClear(item); //情况tags
    item.tabItems = {
        label: buttonName,
        name: "open-multil-business-type",
        componentType: 'invoice-business-type',
        key: 'open-multil-business-type',
    };
    return item;
}