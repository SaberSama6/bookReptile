
import Util from "./util";
module.exports = class extends think.Controller {
    constructor(ctx) {
        super(ctx); // 调用父级的 constructor 方法，并把 ctx 传递进去
        // 其他额外的操作 
        this.user = this.model('user'); // controller 里实例化模型
    }
    async idAction() {
        let data = await this.user.getUserByname('测试人员');
        return this.success(data);
    }

    //注册账户
    async addAction() {
        let where = this.post(); //获取post请求的参数。
        if (think.isEmpty(where)) {     //判断是否拿到参数。
           
        } else {
            where.phone = Number(where.phone);
            let phoneWhere = { phone: where.phone }
            if (!(/^1[34578]\d{9}$/.test(where.phone))) {
                return this.fail('手机号格式错误');
            }
            if (!where.email || !(where.email.match(/^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/))) {
                return this.fail('邮箱未填写，或者格式错误');
            }

            let phoneData = await this.user.getUserByfield(phoneWhere);
            if (!think.isEmpty(phoneData)) {
                return this.fail('此手机号已经被注册，请换个手机号注册！');
            }
            let account = await this.user.getUserByfield({ name: where.name });
            if (!think.isEmpty(account)) {
                return this.fail('此账户已被注册，请换个账号');
            }
            let emailData = await this.user.getUserByfield({ email: where.email });
            if (!think.isEmpty(emailData)) {
                return this.fail('此邮箱已被注册，请换个邮箱');
            }
            //调用发送邮件插件
            let emailSendSuccess =await Util.sendEail(where.email);
            if (emailSendSuccess) {
                // where.password = Util.getSha1(where.password);
                // await this.user.addUser(where)
                return this.success("注册成功");
            }else{
                return this.fail("注册失败");
            }  
        }
    }

    //登录账户
    async loginAction() {
        let where = this.post();
        where.password = Util.getSha1(where.password);
        let userInfo = await this.user.getUserByfield(where);
        if (!think.isEmpty(userInfo)) {
            await this.session('userinfo',userInfo);  //登录成功后设置session。不同ip，不同浏览器登录会生成不同的session。
            return this.success("登录成功");
        } else {
            return this.fail("账户或者密码错误");
        }
    }

    //检测是否登录
    async isLoginAction() {
        const data = await this.session('userinfo');
        if (!think.isEmpty(data)) {
            //在登录状态。
            think.logger.info("在登录中");
            return this.success("已登录")
        } else {
            //不在登录状态
            think.logger.warn("不在登录状态");
            return this.fail({ errno: 2, errmsg: '未登录' });
        }
    }

    //注销登录
    async loginOutAction() {
        await this.session(null);
    }
};