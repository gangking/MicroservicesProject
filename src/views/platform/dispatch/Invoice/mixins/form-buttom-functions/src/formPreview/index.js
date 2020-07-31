export default function (item) {
    const { buttonName } = item;
    item.tabItems = {
        label: buttonName,
        name: "invoice-form-preview",
        componentType: 'invoice-form-preview',
        key: 'invoice-form-preview',
        closable: true,
    };
    //item.openComponentType = "DAILOG"
    //item.openComponentType = "native"
    return item;
}