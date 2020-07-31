// export default (item) => {
//     const { buttonName } = item;
//     console.log('发票预览',item)
//     item.tabItems = {
//         label: buttonName,
//         name: "invoice-contract-preview-two",
//         componentType: 'invoice-contract-preview-two',
//         key: 'invoice-contract-preview-two'
//     };
//     return item;
// }

import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("ibps/compositeMultiline");
export default {
  methods: {
    ...mapActions(["multilineSaveFormData", "setInvoiceInfo"]),
    contractPreviewTwo(item) {
      
      console.log("render合同预览1", item);
      const { buttonName } = item;
      var info = {
        invoiceImgUrl: item.args[1].formData.URLFILE,
        invoiceNumer: item.args[0].INVOICE_CODE
      }
      this.setInvoiceInfo(info);
      console.log("render合同预览2", info, item.args);

      item.tabItems = {
        label: buttonName,
        name: "invoice-contract-preview-two",
        componentType: "invoice-contract-preview-two",
        key: "invoice-contract-preview-two"
      };
      return item;
    }
  }
};
