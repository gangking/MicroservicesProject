/**
 * 头像地址帮助类
 */
import { getImage, getPhoto } from '@/api/platform/file/avatarupload'
import utils from './util'

export function getFile(photo) {
  if (utils.isEmpty(photo)) {return ''}
  else{
    return getPhoto(photo)
  }
  // if (photo.indexOf('getImage')) {
  //   return getPhoto(photo)
  // } else {
  //   // 兼容旧版本格式，如：/platform/file/attachment/getFileById.htm?fileId=489034166378168320
  //   return getImage(photo.split('=')[1])
  // }
}
