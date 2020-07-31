import { paymentSelect, getZbanknSk } from "@/api/platform/tis/tis";

export default {
    methods: {
        /* 根据公司代码，获取付款账户 */
        paymentFocus(index, row) {
            paymentSelect({
                bukrs: row.bukrs
            }).then(res => {
                console.log(res);
                let copyArr = res.data.map(item => {
                    return {
                        label: item,
                        name: item,
                        bsiDesc: item
                    };
                });
                console.log(copyArr);
                this.$set(this.tableData[index], "paymentFrom", []);
                copyArr.forEach(item => {
                    this.tableData[index].paymentFrom.push(item);
                });
            });
        },

        /* 根据公司代码，客商代码，客商性质 来获取收款银行账号 */
        zbanknSkFocus(index, row) {
            // console.log(this.tableData);
            // console.log(index);
            // console.log("当前行的第一列name值，发送请求", this.tableData[index].bukrs);
            // console.log("bukrs", this.tableData[index].bukrs);
            getZbanknSk({
                bukrs: row.bukrs,
                zjyfdm: row.zjyfdm,
                zjyfxz: row.zjyfxz,

            }).then(res => {
                console.log(res);
                let copyArr = res.data.map(item => {
                    return {
                        bank: item['BANK_'],
                        zyhzh: item['ZYHZH_'],
                        bkont: item['BKONT_'],
                        koinh: item['KOINH_'],
                        bankl: item['BANKL_'],
                    };
                });
                console.log(copyArr);
                this.$set(this.tableData[index], "zbanknSkFrom", []);
                copyArr.forEach(item => {
                    this.tableData[index].zbanknSkFrom.push(item);
                });
            });
        },
        /*  收款银行账号 选择*/
        zbanknSkSelect(val, index, row) {
            let currentIndex = this.tableData[index].zbanknSkFrom.findIndex(item => {
                return item.zyhzh == val;
            });
            if (currentIndex != -1) {
                //收款开户行名称
                this.$set(
                    this.tableData[index],
                    "zbankaSk",
                    this.tableData[index].zbanknSkFrom[currentIndex].bank
                );

                // 收款账户名称
                this.$set(
                    this.tableData[index],
                    "zkoinhSk",
                    this.tableData[index].zbanknSkFrom[currentIndex].koinh
                );

                // 对公对私标识
                this.$set(
                    this.tableData[index],
                    "zdgds",
                    this.tableData[index].zbanknSkFrom[currentIndex].bkont
                );
                // 收款联行号
                this.$set(
                    this.tableData[index],
                    "zbanklSk",
                    this.tableData[index].zbanknSkFrom[currentIndex].bankl
                );

            }
        },
        /*  业务场景选择*/
        // businesChangeId(val, index, row) {
        //     let currentIndex = this.tableData[index].bingFrom.findIndex(item => {
        //         return item.name == val;
        //     });
        //     if (currentIndex != -1) {
        //         this.$set(
        //             this.tableData[index],
        //             "configDescribe",
        //             this.tableData[index].bingFrom[currentIndex].configDescribe
        //         );
        //     }
        // },


    }


}