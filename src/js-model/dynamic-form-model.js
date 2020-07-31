import Model from 'js-model'

export default new Model({
    data: {
        type: String,
        default: '{}'
    },
    formData: {
        type: Object,
        default: {}

    },
    permissions: {
        type: String,
        default: '{}'
    },
    formParams: {
        type: Object,
        default: {}
    },
    readonly: false,
    headFlag: 'Y',
    message: null,
    propertyButtonList: [
        {
            type: Object
        }
    ],
    tableName: '',
    initialization: true
})
