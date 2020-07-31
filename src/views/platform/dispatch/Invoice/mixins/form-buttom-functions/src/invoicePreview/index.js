// export default (item) => {
//     const { buttonName } = item;
//     console.log('发票预览',item)
//     item.tabItems = {
//         label: buttonName,
//         name: "invoice-invoice-preview",
//         componentType: 'invoice-invoice-preview',
//         key: 'invoice-invoice-preview'
//     };
//     return item;
// }

import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("ibps/compositeMultiline");
export default {
  methods: {
    ...mapActions(["multilineSaveFormData", "setInvoiceInfo"]),
    invoicePreview(item) {
      const { buttonName } = item;
      var info = {
        invoiceImgUrl: item.args[1].formData.URLFILE,
        invoiceNumer: item.args[0].INVOICE_CODE
      }
      this.setInvoiceInfo(info);
      console.log("发票预览", info, item.args);

      item.tabItems = {
        label: buttonName,
        name: "invoice-invoice-preview",
        componentType: "invoice-invoice-preview",
        key: "invoice-invoice-preview"
      };
      return item;
    }
  }
};
