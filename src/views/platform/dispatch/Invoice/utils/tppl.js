import * as format from './format'
export const tppl = function(tpl, data, context) {
    var fn = function(d) {
        var i; var k = []; var v = []
        for (i in d) {
            k.push(i)
            v.push(d[i])
        }
        return (new Function(k, fn.$)).apply(context, v)
    }
    if (!fn.$) {
        var tpls = tpl.split('[:')
        fn.$ = "var $=''"
        for (var t = 0; t < tpls.length; t++) {
            var p = tpls[t].split(':]')
            if (t != 0) {
                fn.$ += p[0].charAt(0) == '='
                    ? '+(' + p[0].substr(1) + ')'
                    : ';' + p[0].replace(/\r\n/g, '') + '$=$'
            }
            // 支持 <pre> 和 [::] 包裹的 js 代码
            fn.$ += "+'" + p[p.length - 1].replace(/\'/g, "\\'").replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n') + "'"
        }
        fn.$ += ';return $;'
        // console.log('格式化后的', fn.$)
    }
    return data ? fn(data) : fn
}

export const renderTppl = function(tpl, data) {
    return tppl(tpl, data, format)
}
