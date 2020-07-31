function upload(arr, flag) {
  var newArr = arr || [];
  for (var i = 0; i < newArr.length; i++) {
    newArr[i].index = i;
    // newArr[i].descDisabled = false;
    // if (!flag) {
    //   newArr[i].SerialNum = i == 0 ? (i + 1) : (i + 1) * 20;
    // }
  }
  return newArr;
}


export {
  upload
}
