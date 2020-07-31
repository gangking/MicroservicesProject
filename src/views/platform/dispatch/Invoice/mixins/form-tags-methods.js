import _, { reject } from 'lodash';
import util from '@/utils/util';
export default {
    data() {
        return {
            tags: [],
            currentTag: "",
            isTabsContainer: true,
            manageTagsParams: {},
            tabContainerName: "tabContainer"
        }
    },

    watch: {
        currentTag(val) {
            console.log("选中val", val)
        }
    },

    methods: {
        /**
         * tab切换执行离开之前的事件
         * @param {*} activeName 
         * @param {*} oldActiveName 
         */
        beforeTabsLeave() {
            let [activeName, oldActiveName] = util.flatten(arguments)
            //  console.log("当前要离开的页签:", oldActiveName);

            const tmpContent = this.getTabRefPane(oldActiveName);
            if (tmpContent) {

                return tmpContent ? (tmpContent.beforeLeave ? tmpContent.beforeLeave() : true) : true;
            }
            return true;

        },

        currentVm() {
            return this.getTabRefPane(this.currentTag);
        },


        getTabRefPane(index = 0) {
            const tab = this.$refs[this.tabContainerName];
            //console.log("tab,,,,,", tab)
            if (tab && tab.panes) {
                const panes = tab.panes;
                // console.log('tabContainer', tab, panes, index)
                const tabItem = panes.find(item => {
                    return item.name == index;
                });
                if (tabItem && tabItem.$children.length > 0) {
                    return tabItem.$children[0].$children[0];
                }
            }

        },

        TagshandleClick(tabvalue) {

            if (tabvalue != this.currentTag) {

                this.currentTag = tabvalue;
                const tmpContent = this.currentVm();
                tmpContent && tmpContent.refresh && tmpContent.refresh();
            }

        },



        addTag(itemParams) {
            if (_.isArray(itemParams)) {

                itemParams.forEach((val) => {
                    this.addTag(val);
                })
                if (itemParams.length > 0) {
                    let [first] = itemParams;
                    this.currentTag = this.getTagsItem(first).key;
                }
                return;
            }

            let item = this.getTagsItem(itemParams);
            //console.log("进来的是数组数据。。。。", item, this.hasTag(item))
            let { key } = item;
            if (!this.hasTag(item)) {
                this.tags.push(item);
                this.manageTagsParams[key] = itemParams;
            }
            // console.log("currentTag", key)
            this.currentTag = key
        },

        getTagsItem(item) {
            const { tabItems } = item;
            return tabItems;
        },

        hasTag(item) {
            let { key } = item;
            return this.tags.findIndex((it) => {
                return it.key == key
            }) !== -1
        },

        removeTag(key) {
            //console.log("要删除的页签", item)
            this.tags = this.tags.filter((val) => {
                if (key == val.key) {
                    this.manageTagsParams[key] = null;
                }
                return key != val.key;
            });
            this.currentTag = this.tags[this.tags.length - 1].key;
        },

        getvmByindex(index = 0) {
            let item = this.tags[index];
            // console.log(",,,,...", item)
            return item && this.getTabRefPane(item.key)
        },

        firstVm() {
            return this.getvmByindex(0)
        },

        tagsClear() {
            this.tags = [];
            this.manageTagsParams = {};
        }
    },
}