import * as operator from './operator'
import fecha from '@/utils/fecha'
export const formatAmount = function (value, index) {
    var reg = /\d{1,3}(?=(\d{3})+\.)/g
    return (parseFloat(value).toFixed(index) + '').replace(reg, '$&,')
}

export const indexMethod = function (index) {
    return (index + 1) * 10
}

export const dateTimeFormat = function (dvalue, format) {
    try {
        return fecha.format(dvalue, format)
    } catch (e) {
        return '';
    }

}


export const dynamicConditionItem = function (row, list = []) {
    const findItem = list.find(([field, operation, value]) => {


        // console.log('[field, operation, value]', field, operation, row[field], value)
        return operator[operation] ? operator[operation](row[field], value) : false
    })

    return findItem ? findItem.pop() : list[list.length - 1].pop()
}
