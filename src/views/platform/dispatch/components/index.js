
const component_prefix = 'invoice'
const files = require.context('./src', true, /index\.vue$/, 'lazy');
const components_list = files.keys().map(element => {
    let m = files(element), paths = element.split('/'), componentName = `${component_prefix}-${paths[paths.length - 2]}`;
    //console.log("sfsdfjslfsjfls", m)
    return {
        componentName, m: resolve => {
            m.then((val) => {
                console.log("下载.....", val)
                resolve(val)
            })
        }
    }
});
console.log("动态注册组件有", components_list)
const install = (vue) => {
    components_list.forEach(({ componentName, m }) => {
        vue.component(componentName, m)
    })
}
export default {
    install
}
