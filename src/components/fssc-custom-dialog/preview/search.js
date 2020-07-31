export default {
    methods: {
        /* 根据值来源选择id  获取参数 */
        loadParameter() {
            if (!this.model) return;
            // console.log(this.model, 'model8888');
            //  this.$set(this.parameters, "dataTemplateId", this.model.search_url);


            // console.log(this.model.data_chain, 'this.model.data_condition')
            // if (this.model.data_chain.length > 0) {
            //     const parame = this.getParameters(this.model.data_chain);
            //     if (parame.length > 0) {
            //         parame.forEach((i, index) => {
            //             this.parameters.parameters.push({
            //                 key: "Q^" + i.name + "^SL",
            //                 value: i.value
            //             });
            //         });
            //     }
            // }
            this.model.data_condition.forEach(item => {
                this.listConfig.searchForm.forms.push({
                    prop: "Q^" + item.name + "^SL",
                    label: item.label,
                    disabled: (item.select || item.fix_value) ? true : false,
                })
            })
            this.model.data_chain.forEach(item => {
                this.listConfig.columns.push({
                    prop: item.name,
                    label: item.label
                })

            })
            //  console.log(this.listConfig, 'listConfig9999')
            // 添加字段，固定值 弹出框不需要
            // this.getFixvalue();
            // // 获取表单默认值
            // this.getFormChian();
            // // console.log(this.parameters);
            // // 获取参数完成
            this.isParameter = true;

            //  this.loadCustom();
            this.getKey()
            // });
        },

        /* 获取联动条件查询参数 */
        getParameters(data) {
            const list = data.map(item => {
                if (item.select) {
                    return {
                        selectKey: item["select"],
                        name: item["name"]
                    }
                }
            });
            return list.filter(item => item);
        },

        // 转换值
        exchangeChain(data) {
            const chainObj = {};
            this.model.data_chain.forEach(item => {
                if (item["select"]) {
                    chainObj[item["name"]] = item["select"];
                }

            });
            return chainObj;

            // console.log(this.remote,'remote')
        },




    }
}