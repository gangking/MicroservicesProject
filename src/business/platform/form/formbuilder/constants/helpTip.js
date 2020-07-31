/**
 * 提示说明
 */
export default {
  // =====================表单属性=====================
  formVerify: {
    title: '关于表单提交校验',
    content: '表单提交时候对一系列条件进行有效性校验。'
  },
  formRule: {
    title: '关于表单规则',
    content: '您可以为某个字段(文本框、单项选择、下拉框等)设定一些规则：</br>在填写者填写或选择某选项后，触发显示（隐藏、必填、非必填、置空等）位于该字段之后的其他字段。'
  },
  formScript: {
    title: '关于表单脚本',
    content: '表单脚本可以扩展自定义的脚本。满足表单不能实现的功能。'
  },
  formSubmit: {
    title: '关于表单提交后端验证校验',
    content: `提交设置是表单提交动作限制。</br>
    开启后端验证：表单后端的验证就会进行验证，避免绕过前端验证，出现无效数据。</br>
    开启提交冲突提示：开启冲突提示避免重复提交表单，后端采用乐观锁进行处理。`
  },
  // =====================对话框=====================
  customDialog: {
    title: '关于对话框',
    content: `选择对话框的数据库来源,绑定到当前搜索框</br>`
  },
  // =====================远程搜索=====================
  remoteSelect: {
    title: '关于值来源选择',
    content: `选择搜索的数据库来源,绑定到当前搜索框</br>`
  },
  remoteLinkage: {
    title: '关于联动数据',
    content: `设置关联数据，主要是字段的展示与否和是否绑定到当前表单</br>`
  },
  remoteCondition: {
    title: '关于关联条件',
    content: `设置关联条件，主要是字段绑定到表单上的联动条件</br>`
  },
  isAuto: {
    title: '关于自动带出',
    content: `设置自动带出，默认表单随机取得有权限的一个值</br>`
  },
  isUpdate: {
    title: '关于主动更新',
    content: `设置主动更新，主动更新联动值</br>`
  },
  clearFields: {
    title: '关于清空字段',
    content: `选择字段名，关联的该值清空</br>`
  },
  // =====================字段=====================
  label: {
    title: '关于字段标题',
    content: '此属性用于告诉填写者应该在该字段中输入什么样的内容。通常是一两个简短的词语，也可以是一个问题。'
  },
  name: {
    title: '关于对象属性',
    content: '此属性用于绑定业务对象属性,用于提交数据绑定对象名称。'
  },
  key: {
    title: '关于对象key',
    content: '此属性用于绑定业务对象属性Key,标识是否权限属性。'
  },
  datefmt: {
    title: '关于日期格式',
    content: `此属性用于指定该字段填写的日期格式</br>
    有默认格式，也可以自定义格式.</br>
    格式参考如下：</br>
    格式代码 | 说明	|	返回值例子</br>
    yyyy&nbsp;&nbsp;四位数字的年份	eg：2014或2000</br>
    yy &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;两位数字的年份	eg：14 或 98</br>
    MM &nbsp;&nbsp;&nbsp;&nbsp;月份,有前导零	01到12</br>
    M &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月份,没有前导零	1到12</br>
    dd &nbsp;&nbsp;&nbsp;&nbsp;天数,有前导零	01到31</br>
    d	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;天数,没有前导零	1到31</br>
    HH &nbsp;&nbsp;&nbsp;&nbsp;小时,24小时制，有前导零	00到23</br>
    H &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小时,24小时制，无前导零	0到23</br>
    mm &nbsp;&nbsp;&nbsp;&nbsp;分钟,有前导零	00到59</br>
    m &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分钟,没有前导零	0到59</br>
    ss &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;秒,有前导零	01到59</br>
    s &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;秒,没有前导零	1到59`
  },
  defaultValue: {
    title: '关于默认值',
    content: '设置后，此值将作为默认值显示在该字段的初始化值。<br>如果不需要设置默认值，请将此处留空。<br>默认值类型支持固定值、动态脚本、数据联动、公式计算等。'
  },
  units: {
    title: '关于单位',
    content: '此属性用于指定对该字段单位描述，比如货币：元，万元，百分比：%等。'
  },
  placeholder: {
    title: '关于提示文字',
    content: '此属性用于指定对该字段进行文字提示，在文本内部进行提示，一般是“请输入”、”请选择”等，不超过200个字符。'
  },
  desc: {
    title: '关于描述信息',
    content: '此属性用于指定对该字段进行一些附加说明，一般用来指导填写者输入。'
  },
  // =====================校验=====================
  required: {
    title: '关于必填校验',
    content: '勾选后，该字段将将不允许为空，在字段名称前会有红色的星号（<span class="read">*</span>）标出。</br>如果填写者在提交表单时必填字段没有输入，系统将会给出相关错误提示，表单将无法提交。</br>该属性常用于需要强制填写者必须输入的字段。'
  },
  minLength: {
    title: '关于最少填写字符',
    content: '系统会限制填写者填写此字段的最少字符。'
  },
  maxLength: {
    title: '关于最多填写字符',
    content: '系统会限制填写者填写此字段的最多字符。'
  },
  min: {
    title: '关于最小值',
    content: '系统会限制填写者填写此字段的最小值。'
  },
  max: {
    title: '关于最大值',
    content: '系统会限制填写者填写此字段的最大值。'
  },
  minItem: {
    title: '关于最少项',
    content: '系统会限制填写者勾选此字段最少允许的选择项。。'
  },
  maxItem: {
    title: '关于最多项',
    content: '系统会限制填写者勾选此字段最多允许的选择项。'
  },
  integer: {
    title: '关于整数',
    content: '勾选后，系统会限制填写者填写此字段为整数值。</br>注意:这个小数位是冲突的，如果俩个都勾选，以小数位为准。'
  },
  decimal: {
    title: '关于小数位',
    content: '输入小数位，系统会限定位数后将对数值有效性进行校验，超出位数将提示。'
  },
  startDate: {
    title: '关于起始日期',
    content: `系统会限制填写者填写此字段的当天起始日期范围（包含该日期）。
              </br>该功能不做有效性验证，请自行保证：特定日期，填写跟日期格式一致的日期；其他类型填写数字`
  },
  endDate: {
    title: '关于结束日期',
    content: `系统会限制填写者填写此字段的截至日期范围（包含该日期）。</br>
              该功能不做有效性验证，请自行保证：特定日期，填写跟日期格式一致的日期，其他类型填写数字`
  },
  dataFormat: {
    title: '关于数据格式',
    content: '系统会限制填写者填写此字段的指定的格式，也可以自定义正则表达式。'
  },
  // =====================个性参数属性=====================
  multiple: {
    title: '关于多选',
    content: '此属性用于限制填写可以选择多个值，还是只能选中一个值。'
  },
  datasource: {
    title: '关于选项数据',
    content: `此属性用于设置选项数据是来源自定义选项，还是值来源。`
  },
  // =====================个性参数属性-数据字典=====================
  selectMode: {
    title: '关于选值模式',
    content: '此属性用于限制填写者只能选择叶子节点还是任意节点。'
  },
  displayMode: {
    title: '关于显示模式',
    content: '此属性用于展示数据的时候是完整路径还是只展示选择的节点名称。'
  },
  split: {
    title: '关于分隔符',
    content: `此属性用于展示数据显示完整路径的分隔符，默认为'/'。`
  },
  // =====================个性参数属性-附件上传=====================
  fileQuantity: {
    title: '关于最大上传文件数量',
    content: `此属性用于限制填写者最大上传文件数量。`
  },
  fileSize: {
    title: '关于单个文件大小',
    content: `此属性用于限制填写者单个文件大小，单位为M。</br>
          可根据需要收集的文件类型做选择，例如1张照片大约3MB，1首3分钟mp3音频大约5MB。`
  },
  fileType: {
    title: '关于文件上传类型',
    content: ` 此属性用于限制填写者文件上传类型.</br>
            文档类：txt、pdf、doc、docx、xls、xlsx、ppt、pptx、wps、htm、html、rtf、hlp。</br>
            图片类：jpg、jpeg、png、gif、bmp、psd、tif。</br>
            视频类：mkv、mp4、avi、swf、wmv、rmvb、mov、mpg。</br>
            音频类：mp3、flac、ape、wma、wav、aac、m4a、au、ram、mmf、aif。</br>
            压缩包：rar、zip、7z、gz、arj、z。</br>
            如以上格式限制不满足需求，建议选择[自定义]文件上传类型。</br>
            [自定义]的文件扩展名，多个请用逗号隔开，如: txt, pdf, mp3等。</br>`
  },
  fileStore: {
    title: '关于存储数据格式',
    content: ` 此属性用于附件存储数据格式。</br>
            【仅存ID】：数据存储只存储id，但展示是name；</br>
            【JSON格式】：数据存储json格式,如[{id:'xxxx',fileName:'abc.doc'}]；</br>
            【路径】：数据存储是文件的路径。`
  },
  // =====================个性参数属性-图片上传=====================
  imageTypeVal: {
    title: '关于图片上传格式',
    content: ` 此属性用于图片上传格式。</br>
            【类型】：jpg、jpeg、png、bmp。</br>`
  },
  imageSizeVal: {
    title: '关于图片大小',
    content: ` 此属性用于限制图片大小。</br>
            【单位】：M </br>`
  },
  imageWidthAndHeightVal: {
    title: '关于图片宽高尺寸',
    content: ` 此属性用于设置图片宽和高。</br>
            【单位】：px </br>`
  },
  imageLimitVal: {
    title: '关于图片数量限制',
    content: ` 此属性用于限制图片最大上传数量。 </br>`
  },
  imageUploadTypeVal: {
    title: '关于图片上传方式',
    content: ` 此属性用于规定图片上传方式。</br>
            【类型】：默认直接上传方式、ibps附件上传方式。</br>`
  },
  // =====================个性参数属性-地址=====================
  addressTop: {
    title: '关于最大区域',
    content: ` 此属性用于设置地址选择最大区域。`
  },
  addressLevel: {
    title: '关于最小区域',
    content: ` 此属性用于设置地址选择最小区域。`
  },
  addressTopval: {
    title: '关于最大区域值',
    content: ` 此属性用于设置地址选择最大区域上一个范围的值。`
  },
  // =====================个性参数属性-链接=====================
  hyperlinkText: {
    title: '关于文本',
    content: '设置后，此值将作为默认值显示在该字段的初始化值。</br> 默认值类型支持固定值、动态脚本'
  },
  hyperlinkScriptType: {
    title: '关于脚本类型',
    content: '点击事件的脚本类型，后触发的动作。'
  },

  // =====================字段权限=====================
  hide: {
    title: '关于隐藏',
    content: '勾选后，该字段将隐藏，但如果动态赋值，可以对该字段进行赋值。'
  },
  read: {
    title: '关于只读',
    content: '勾选后该字段将只读，如果不勾选则该字段默认是可写的。'
  },
  // =====================布局=====================
  rows: {
    title: '关于行数',
    content: '多行文本框展示的行数。'
  },
  autosize: {
    title: '关于自适应内容',
    content: '通过设置[自适应内容] 属性可以使得文本域的高度能够根据文本内容自动进行调整，并且 [自适应内容]  还可以设定为一个对象，指定最小行数和最大行数。'
  },
  height: {
    title: '关于高度',
    content: '系统会根据设置的高度,进行设置，默认高度是150px。'
  },
  gridsToOccupy: {
    title: '关于宽度占比',
    content: '可以定义该字段在填写页面占用的页面宽度为多少。系统采用栅格布局24 分栏。'
  },
  index: {
    title: '关于序号',
    content: '可以定义显示列表的序号。'
  },
  tableMode: {
    title: '关于子表编辑模式',
    content: '子表编辑模式,表内编辑模版。'
  }

}
