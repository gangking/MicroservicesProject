<template>
  <div class="codemirrorBox">
    <div class="codemirror">
      <div class="meng"
           v-if="!isEditable"
           title="禁止编辑"></div>
      <textarea ref="formula"
                class="cm-s-default"
                style="height:150px;" />
      </div>
    <div class="inputTxtBox">
        <el-button title="点击切换常量类型" size="mini"  type="primary" plain @click="inputPointer">{{isTxtNumConst?'文本常量':'数字常量'}}</el-button>
        <el-input v-model="inputTxt" :placeholder="isTxtNumConst?'请输入文本常量':'请输入数字常量'"
        @keyup.13.native="defineInput(inputTxt)"></el-input>
     </div>
</div>
  
</template>

<script>
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/theme/eclipse.css'
const CodeMirror = window.CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/addon/hint/show-hint')
require('./codemirror/addon/hint/formula-hint')
require('./codemirror/mode/formula/formula-mode')
export default {
  name: 'code-codemirror',
  props: {
    codeType: {
      type: String,
      default: ''
    },
    fromVariable: {
      tyepe: Object,
      default () {
        return {}
      }
    },
    fromFunc: {
      type: Object,
      default () {
        return {}
      }
    },
    thisValue: null,
    isEditable: {
      type: Boolean,
      default: false
    },
    isStepListNull: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      txtStyle: false,
      inputTxt: '',
      form: {
        message: '',
        formula: []
      },
      isTxtNumConst: false, // 默认数字常量
    }
  },
  watch: {
    isStepListNull (val) {
      // 当步骤表为空时，清空编辑框
      // console.log('当步骤表为空', val)
      this.editor.setValue('');
      this.form.formula = []
    },
    // 是否可编辑
    isEditable (val) {
      // console.log('是否可编辑', val)
      if (val) {
        this.editor.setOption("readOnly", false);
      } else {
        this.editor.setOption("readOnly", 'nocursor');
      }

    },
    // 查看详情（点击步骤表监听）
    thisValue (val) {
      this.selectInfo(val);
    },
    // 操作：点击变量
    fromVariable (val) {
      // console.log('操作：点击变量', val)
      if (JSON.stringify(val) == '{}') {
        return
      }
      var flag = localStorage.getItem('codeEdit')
      if (flag != 'variable') {
        return
      } else {
        localStorage.removeItem('codeEdit')
      }
      if (!this.isEditable) {
        return
      }
      //   debugger
      var start = this.editor.getCursor()
      var end = this.editor.getCursor()
      var txt = this.editor.getValue()
      var index = parseInt(end.ch);
      var len = parseInt(txt.length);
      this.insertField(val)
    },
    // 操作：点击逻辑符号
    fromFunc (val) {
      // console.log('操作：点击逻辑符号', val)
      if (JSON.stringify(val) == '{}') {
        return
      }
      var flag = localStorage.getItem('codeEdit')
      if (flag != 'func') {
        return
      } else {
        localStorage.removeItem('codeEdit')
      }
      if (!this.isEditable) {
        return
      }

      var start = this.editor.getCursor()
      var end = this.editor.getCursor()
      var txt = this.editor.getValue()
      var index = parseInt(end.ch);
      var len = parseInt(txt.length);
      this.clickFunctionNode(val);
    },
    // 更新最新保存规则
    'form.formula': {
      deep: true,
      handler: function (newVal, oldVal) {
        if (this.codeType == '先决条件') {
          this.$emit('getSetCode', newVal);
        } else if (this.codeType == '有效性检查') {
          this.$emit('getSetEffectiveCode', newVal);
        } else if (this.codeType == '替代检查') {
          this.$emit('getSetEffectiveCode', newVal);
        }
      }
    }
  },
  created () {
    localStorage.removeItem('codeEdit')
    // 初始化代码编辑器
    this.$nextTick(() => {
      this.initCodeMirror()
    })
  },
  methods: {
    // 根据编辑器内容来设置数组
    setCodeBoxSetList (val, flag, inputVal) {
      var list = val.split('​');
      // 去除空的数组项
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (!item) {
          list.splice(i, 1);
          i = i - 1;
        }
      }
      switch (flag) {
        case 'delete':
          for (var j = 0; j < this.form.formula.length; j++) {
            var item = this.form.formula[j];
            // 比较每一项
            if (item.tableName && item.name == list[j]) {
              // 比较对象
            } else if (item.type && item.name == list[j]) {
              // 比较逻辑符号
            } else if (item == list[j]) {
              // 比较常量
            } else {
              // delete item;
              this.form.formula.splice(j, 1);
            }
          }
          break;
        case 'add':
          // console.log('增加的元素1', inputVal);
          if ((list.length - this.form.formula.length) > 1) {
            this.$message.error('无效操作');
            this.selectInfo(this.form.formula);
          } else {
            for (var j = 0; j < list.length; j++) {
              var item = list[j];
              var item2 = this.form.formula[j];
              if (item2) {
                // 比较每一项
                if (item2.tableName && item2.name == item) {
                  // 比较对象
                } else if (item2.type && item2.name == item) {
                  // 比较逻辑符号
                } else if (item == item2) {
                  // 比较常量
                } else {
                  // console.log('开始插入',j)
                  this.form.formula.splice(j, 0, inputVal);
                }
              } else {
                // 直接末尾追加即可
                this.form.formula.push(inputVal);
              }
            }
          }
          break;
      }
      // console.log('编辑器内容及内容长度', list, this.form.formula);
    },
    // 操作：手动输入
    inputPointer () {
      this.isTxtNumConst = this.isTxtNumConst ? false : true;
    },
    defineInput (txt) {
      this.$nextTick(() => {
        this.enterClick(txt);
        setTimeout(() => {
          this.inputTxt = '';
        }, 10)

      })
    },
    // 查看详情
    selectInfo (val) {
      // 判断是否在编辑规则
      var flag = localStorage.getItem('codeEdit')
      if (flag == 'variable' || flag == 'func') {
        return
      }

      // 清空之前的数据
      this.editor.setValue('');
      this.form.formula = []

      // console.log('查看详情（点击步骤表监听）', val)

      var data = val;
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        this.form.formula.push(item);
        if (item.tableName != undefined) {
          this.insertField(item, '详情')
        } else if (item.type == 'btn') {
          this.clickFunctionNode(item, '详情');
        } else {
          this.insertFieldHand(item, '详情')
        }
      }
    },
    enterClick (info) {
      // console.log('常量信息', info)
      switch (this.isTxtNumConst) {
        case false:
          // 只能输入数字
          var re1 = /^[.0-9]+$/;
          this.checkConstValue(info, re1, '只能输入数字');
          break;
        case true:
          // 只能输入中英文数字及(|:_)特殊字符
          var re1 = /^[|@:_\0-9a-zA-Z\u4e00-\u9fa5]+$/;
          this.checkConstValue(info, re1, '只能输入中英文数字及"|:_"特殊字符');
          break;
      }
    },
    checkConstValue (info, rel, tip) {
      if (info) {
        // 根据正则来进行对应提示
        if (rel.test(info)) {
          var item = info;
          // 判断是否为数字
          if (!this.isTxtNumConst) {
            item = info;
          } else {
            item = '"' + info + '"';
          }
          //   判断是否允许编辑
          if (!this.isEditable) {
            return
          }
          // 更新规则
          // this.form.formula.push(item);
          // 编辑器显示
          this.insertFieldHand(item)
        } else {
          this.$message.error(tip);
        }
      } else {
        this.$message.error('请输入常量值');
      }
    },
    // 输入逻辑符号
    clickFunctionNode (val, b) {
      var start = this.editor.getCursor()
      this.editor.replaceSelection('​' + val.name + '​')
      var end = this.editor.getCursor()
      this.editor.markText(start, end, {
        className: 'cm-field-logic'
      })
      if (b != '详情') {
        this.editor.focus()
      }
      this.setCodeBoxSetList(this.editor.getValue(), 'add', val);
    },
    // 手动输入处理方法
    insertFieldHand: function (name, b) {
      var start = this.editor.getCursor()
      this.editor.replaceSelection('​' + name + '​')
      var end = this.editor.getCursor()
      this._markFieldValue(start, end, name)
      if (b != '详情') {
        this.editor.focus()
      }
      this.setCodeBoxSetList(this.editor.getValue(), 'add', name);
    },
    // 变量节点处理方法
    insertField: function (info, b) {
      // console.log('获取点击的节点', info)
      var start = this.editor.getCursor()
      this.editor.replaceSelection('​' + info.name + '​')
      var end = this.editor.getCursor()
      this._markFieldName(start, end, info.key, info.tableName)
      if (b != '详情') {
        this.editor.focus()
      }
      this.setCodeBoxSetList(this.editor.getValue(), 'add', info);
    },
    // 手动输入值处理
    _markFieldValue (start, end, key) {
      this.editor.markText(start, end, {
        className: 'cm-field-value',
        attributes: {
          'data-field': key
        }
      })
    },
    // 变量节点值处理Name
    _markFieldName (start, end, key, title) {
      this.editor.markText(start, end, {
        className: 'cm-field-name',
        attributes: {
          'data-field': key,
          'title': title
        },

      })
    },
    // 初始化编辑器
    initCodeMirror () {
      var _this = this;
      this.editor = CodeMirror.fromTextArea(this.$refs.formula, {
        line: true,
        autoCloseTags: true,
        height: 150,
        readOnly: 'nocursor',
        lineWrapping: true,
        mode: 'formula', // 选择对应代码编辑器的语言
        specialChars: /[\u0000-\u001f\u007f\u00ad\u200c-\u200f\u2028\u2029\ufeff]/,
        theme: 'eclipse',
        extraKeys: {
          Backspace: function (cm) {
            var token = cm.getTokenAt(cm.getCursor())
            if (token.type === 'field') { // 删除字段 ||  "keyword" == token.type
              var line = cm.getCursor().line
              cm.setSelection(new CodeMirror.Pos(line, token.start), new CodeMirror.Pos(line, token.end))
              cm.replaceSelection('', null, '+delete')
            } else {
              cm.execCommand('delCharBefore')
            }
          }
        }
      })
      this.editor.setSize('100%', '150px')
      this.editor.on('cursorActivity', function (editor, b) {
        CodeMirror.showHint(editor, CodeMirror.formulaHint, {
          completeSingle: false
        })
      })

      // 监听键盘事件
      this.editor.on('keydown', function (editor, b) {
        if (b.keyCode == 8) {
          var start = editor.getCursor()
          var end = editor.getCursor()
          var val = editor.getValue()
          editor.setOption("readOnly", false);
          setTimeout(() => {
            _this.setCodeBoxSetList(editor.getValue(), 'delete');
          }, 10)
        } else {
          editor.setOption("readOnly", true);
        }
      })

      this.form.message = ''
      if (this.verify && this.data) {
        this.setValue(this.data.formula)
        this.form.message = this.data.msg
      } else {
        this.setValue(this.data)
      }
    },
    setValue (val) {
      if (!val) {
        return
      }
      var _this = this
      var c = []
      var d = []

      var valAry = val.split('\n')
      forEach(valAry, (b, a) => {
        var e = ''
        var f = b.split(/(\$[0-9a-zA-Z\._]+#[0-9A-Fa-f]*)/g)

        forEach(f, (c) => {
          if (/^\$(_widget_|_formula_|ext)/.test(c)) {
            var label = startsWith(c, '$ext') ? '扩展字段' : _this.getBoLabel(c)
            var g = c.replace('$', '').split('#')

            var field = g[0]
            var entry = g[1]
            var from = CodeMirror.Pos(a, e.length)
            e += '​' + label + '​'
            var to = CodeMirror.Pos(a, e.length)
            d.push({
              from: from,
              to: to,
              field: field,
              entry: entry
            })
          } else {
            e += c
          }
        })

        c.push(e)
      })
      this.editor.setValue(c.join('\n'))
      forEach(d, (c) => {
        c.entry ? _this._markFieldName(c.from, c.to, c.field, c.entry) : _this._markFieldValue(c.from, c.to, c.field)
      })
    },
    getValue: function () {
      function hasClass (element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1
      }
      var formula = []
      var show = []
      var lineContent = this.editor.display.lineDiv.getElementsByClassName('CodeMirror-line')
      for (let i = 0; i < lineContent.length; i++) {
        var f = []
        var l = []
        const content = lineContent[i]
        const children = content.children[0].children
        for (let j = 0; j < children.length; j++) {
          const span = children[j]
          var field = span.getAttribute('data-field')
          var entry = span.getAttribute('data-entry')
          if (hasClass(span, 'cm-field-name')) {
            f.push('$' + field + '#' + entry)
          } else if (hasClass(span, 'cm-field-value')) {
            f.push('$' + field + '#')
          } else {
            if (hasClass(span, 'cm-deprecate')) {
              continue
            }
            f.push(span.textContent || span.innerText)
          }
          l.push(span.textContent || span.innerText)
        }
        var g = f.join('').replace(/\u200b/g, '').replace(/\u00a0/g, ' ')
        formula.push(g)
        var t = l.join('').replace(/\u200b/g, '').replace(/\u00a0/g, ' ')
        show.push(t)
      }
      return {
        formula: formula.join('\n'),
        show: show.join('\n')
      }
    },
    getBoLabel (key) {
      for (let i = 0; i < this.boData.length; i++) {
        const bo = this.boData[i]
        if (('$_widget_' + bo.tableName + this.TABLE_SEPARATOR + bo.key + '#') === key) {
          return bo.name
        }
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
.codemirrorBox {
  position: relative;
  height: 100%;
  .inputTxtBox {
    position: absolute;
    width: 100%;
    height: 40px;
    line-height: 30px;
    border-radius: 4px;
    left: 0px;
    bottom: 0px;
    transition: all 0.2s linear;
    padding: 5px;
    box-sizing: border-box;
    /deep/ .el-button {
      padding: 8px !important;
      position: relative;
      bottom: 0.5px;
    }

    /deep/ .el-input {
      width: calc(100% - 100px);
    }
  }
  .codemirror {
    position: relative;
    height: calc(100% - 40px);
    overflow-y: auto;
    .meng {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 100;
      background: rgba(0, 0, 0, 0.05);
      left: 0;
      top: 0;
    }
    .CodeMirror {
      height: 100% !important;
    }

    .cm-tab {
      display: inline-block;
      text-decoration: inherit;
    }

    .CodeMirror-ruler {
      border-left: 1px solid #ccc;
      position: absolute;
    }

    .cm-header {
      color: #00f;
    }

    .cm-quote {
      color: #090;
    }

    .cm-negative {
      color: #d44;
    }

    .cm-positive {
      color: #292;
    }

    .cm-header,
    .cm-strong {
      font-weight: 700;
    }

    .cm-em {
      font-style: italic;
    }

    .cm-link {
      text-decoration: underline;
    }

    .cm-strikethrough {
      text-decoration: line-through;
    }

    .cm-keyword {
      color: #781287;
    }

    .cm-atom {
      color: #219;
    }

    .cm-number {
      color: #164;
    }

    .cm-def {
      color: #00f;
    }

    .cm-variable-2 {
      color: #05a;
    }

    .cm-variable-3 {
      color: #085;
    }

    .cm-comment {
      color: #a50;
    }

    .cm-string {
      color: #a11;
    }

    .cm-string-2 {
      color: #f50;
    }

    .cm-meta {
      color: #555;
    }

    .cm-qualifier {
      color: #555;
    }

    .cm-builtin {
      color: #333;
    }

    .cm-bracket {
      color: #997;
    }

    .cm-tag {
      color: #170;
    }

    .cm-attribute {
      color: #00c;
    }

    .cm-hr {
      color: #999;
    }

    .cm-link {
      color: #00c;
    }

    .cm-field {
      display: inline-block;
      border-radius: 2px;
      // padding: 0 5px;
      margin: 1px 1px;
      color: red;
      font-size: 14px;
      font-weight: bold;
    }

    .cm-field.cm-field-name,
    .cm-field.cm-field-value,
    .cm-field.cm-field-logic {
      cursor: pointer;
      margin: 0 2px;
      padding: 0 2px;
      // border: 1px solid #ccc;
      border-radius: 4px;
    }

    .cm-field.cm-field-name {
      background: #ebf5ff;
      color: #008dcd;
    }

    .cm-field.cm-field-value {
      color: black;
    }
    .cm-field.cm-field-logic {
    }

    .cm-error {
      color: red;
    }

    .cm-invalidchar {
      color: red;
    }
    /deep/ .el-button--mini {
      position: relative;
      bottom: 1px;
    }
    /deep/ .el-input {
      width: 260px;
    }
    /deep/ .el-input__inner {
      width: 100%;
      // border: 0;
      height: 30px;
      line-height: 32px;
    }
  }
}
</style>