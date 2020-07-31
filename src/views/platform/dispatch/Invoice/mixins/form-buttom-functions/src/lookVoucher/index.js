export default {
    methods: {
        createVoucher(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "invoice-accounting-voucher",
                componentType: 'invoice-accounting-voucher',
                key: 'invoice-accounting-voucher',
                closable: true,
            };
            return item;
        },
        lookVoucher(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "invoice-accounting-lookVoucher",
                componentType: 'invoice-looker-voucher',
                key: 'invoice-accounting-lookVoucher',
                closable: true,
            };
            item.openComponentType = 'native'
            return item;

        },

        lookSapVoucher(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "invoice-multi-form-contract-lookSapVoucher",
                componentType: 'invoice-tab-frame',
                key: 'invoice-multi-form-contract-lookSapVoucher',
                closable: true,
            };
            item.value = 'https://163.177.112.28:44301/sap/bc/gui/sap/its/webgui/?~transaction=ZACCDOC&sap-client=800&sap-language=ZH&sap-user=p0017088&sap-password=asdf1234';
            return item;
        },

        travelBooking(item) {
            const { buttonName } = item;
            item.tabItems = {
                label: buttonName,
                name: "invoice-multi-form-contract-travelBooking",
                componentType: 'invoice-tab-frame',
                key: 'invoice-multi-form-contract-travelBooking',
                closable: true,
            };
            item.value = 'https://ct.ctrip.com/hotel-online/home/?reslang=';
            return item;
        }

    },
}