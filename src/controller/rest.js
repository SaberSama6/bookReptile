const assert = require('assert');

module.exports = class extends think.Controller {
  static get _REST() {
    return true;
  }

  constructor(ctx) {
    super(ctx);

  }
 async __before() {
    //检查是否登录，未登录阻止运行。
    let isLogin=await this.isLogin()
    if(!isLogin) {
        return this.fail({ errno: 2, errmsg: '未登录' }); // 这里 return false，那么 xxxAction 和 __after 不再执行
    }
 }
 async isLogin() {
    const data = await this.session('userinfo');
    if (!think.isEmpty(data)) {
        //在登录状态。
        return true;
    } else {
        //不在登录状态
        return false;
    }
}
 

  __call() {}
};