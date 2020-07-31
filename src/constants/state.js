// 编码表
export default {
    SUCCESS: 200, // 成功
    WARNING: 2, // 警告，需自己处理异常
    UNSUPORT: 501, // 功能未实现或者功能未开启
    REQUIRE_CAPTCHA: 6020104, // 未启动验证码
    ILLEGAL_TOKEN: 6020201, // 无效的token
    OTHER_CLIENTS: 6020102, // 其它客户端登录
    TOKEN_EXPIRED: 6020203, // token 过期
    TOKEN_REFRESH_EXPIRED: 6020303,
    SERVICE_CODE: 500,
    PARAMS_ERROR: 400
}
