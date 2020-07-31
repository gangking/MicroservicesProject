export default (item) => {
  const { buttonName } = item;
  item.tabItems = {
    label: buttonName,
    name: "invoice-audit-history",
    componentType: 'invoice-audit-history',
    key: 'invoice-audit-history',
    closable: true,
  };
  return item;
}