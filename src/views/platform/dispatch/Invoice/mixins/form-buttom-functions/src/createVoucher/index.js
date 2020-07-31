export default (item) => {
  // 凭证
  const { buttonName } = item;
  item.tabItems = {
    label: buttonName,
    name: "invoice-voucher-create",
    componentType: 'invoice-voucher-create',
    key: 'invoice-voucher-create',
    closable: true
  };
  item.openComponentType = "native"
  return item;
}