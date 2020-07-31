import fecha from "@/utils/fecha";
import Utils from "@/utils/util";
/**
 * 时间格式化
 *
 */
export function dateFormat(dateObj, format = fecha.masks.default, origFormat) {
  if (Utils.isEmpty(dateObj)) {
    return "";
  }
  try {
    if (typeof dateObj === "number") {
      dateObj = new Date(dateObj);
    }
    if (
      Object.prototype.toString.call(dateObj) !== "[object Date]" ||
      isNaN(dateObj.getTime())
    ) {
      // 2次转换默认
      dateObj = fecha.parse(dateObj, origFormat || format);
    }

    return fecha.format(dateObj, format);
  } catch (error) {
    console.info(error);
    return dateObj;
  }
}

/**
 * 相对时间字符串
 * @param {String|Number} time 时间格式字符串，或者时间
 * @param {String} format 格式化字符串
 * @param {String} locale 国际化语言
 * @returns {String} 相对时间字符串
 */
export function formatTime(time, format, locale) {
  return fecha.getRelativeTime(time, format, locale);
}

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  return time + label;
}

// 发票类型过滤器
export function incoiceType(val) {
  var label = val;
  switch(val) {
    case '10':
      label = '增值税专用发票'
      break;
  }
  return label;
}

/**
 * duration
 * @param {*} time
 */
export function duration(time) {
  const between = Number(time);
  if (between < 1000) {
    return pluralize(~~(between / 1000), "秒");
  } else if (between < 3600 * 1000) {
    return pluralize(~~(between / (60 * 1000)), "分钟");
  } else if (between < 86400 * 1000) {
    return pluralize(~~(between / (60 * 60 * 1000)), "小时");
  } else {
    return pluralize(~~(between / (60 * 60 * 24 * 1000)), "天");
  }
}
/**
 * 状态值过滤器
 * AGREE("agree","同意"),
OPPOSE("oppose","反对"),
ABANDON("abandon","弃权"),
ADD_SIGN("addSign","补签"),
REJECT("reject","驳回"),
REJECT_TO_START("rejectToStart", "驳回到发起人"),
REJECT_TO_PREVIOUS("rejectToPrevious","驳回上一步"),
SHFIT("shfit", "转办"),
REVOKE("revoke", "撤销"),
SUSPEND("suspend","挂起"),
RECOVER("recover","恢复"),
 * @param {*} status
 */
export function statusValFilter(status) {
  var val = "";
  switch (status) {
    case "agree":
      val = "同意";
      break;
    case "oppose":
      val = "反对";
      break;
    case "abandon":
      val = "弃权";
      break;
    case "addSign":
      val = "补签";
      break;
    case "reject":
      val = "驳回";
      break;
    case "rejectToStart":
      val = "驳回到发起人";
      break;
    case "rejectToPrevious":
      val = "驳回上一步";
      break;
    case "shfit":
      val = "转办";
      break;
    case "revoke":
      val = "撤销";
      break;
    case "suspend":
      val = "挂起";
      break;
    case "recover":
      val = "恢复";
      break;
  }
  return val;
}

/**
 * 附件容量数字 格式化
 * @param {*} num
 * @param {*} digits
 */
export function numberFormatter(num, digits = 2) {
  const si = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "G" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "k" }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value + 0.1)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
      );
    }
  }
  return num.toString();
}

/**
 * html 格式转文本
 * @param {*} val
 */
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * 正则去掉所有的html标记
 * @param {*} val
 */
export function removeHtmlTag(val) {
  if (Utils.isEmpty(val)) {
    return val;
  }
  return val.replace(/<[^>]+>/g, "");
}
/**
 * 千分位过滤
 * @param {*} num
 */
export function toThousandslsFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

/**
 * 消息类型过滤转换（2333）
 * @param {*} type
 */
export function msgTypeTrans(type) {
  var icon = "";
  switch (type) {
    case "E":
      icon = "uniE201";
      break;
    case "X":
      icon = "uniE1AE";
      break;
    case "W":
      icon = "uniE202";
      break;
    case "S":
      icon = "uniE1AC";
      break;
    case "I":
      icon = "uniE203";
      break;
  }
  return icon;
}

/**
 * 选项过滤
 * @param {*} val  值
 * @param {*} options 选项值
 * @param {*} labelKey  选项的展示值key
 * @param {*} valueKey  选项的值key
 */
export function optionsFilter(
  val,
  options = [],
  labelKey = "label",
  valueKey = "value",
  defaultValue = ""
) {
  let opt;
  if (Array.isArray(options)) {
    opt = options.find(x => x[valueKey] === val);
  }
  return opt ? opt[labelKey] : val || defaultValue;
}

/**
 * 多选选项过滤
 * @param {*} val  值
 * @param {*} options 选项值
 * @param {*} labelKey  选项的展示值key
 * @param {*} valueKey  选项的值key
 */
export function optionsCheckboxFilter(
  val,
  options = [],
  labelKey = "label",
  valueKey = "value",
  defaultValue = ""
) {
  if (Utils.isEmpty(val)) {
    return [];
  }
  const valAry = val.split(",");
  const optMap = [];
  options.forEach(x => {
    optMap[valueKey] = x[labelKey];
  });

  const optVal = [];
  valAry.forEach(v => {
    if (optMap[v]) {
      optVal.push(optMap[v]);
    }
  });
  return optVal;
}
