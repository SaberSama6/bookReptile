const crypto = require('crypto'); //加密器插件
const nodemailer = require('nodemailer'); //邮件发送模块
export default {
    //加密器
    /**
     * @sha1加密模块 (加密固定,不可逆)
     * @param str string 要加密的字符串
     * @retrun string 加密后的字符串
    **/
    getSha1 :(str)=> {
        var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
        sha1.update(str);
        let res = sha1.digest("hex");  //加密后的值d
        return res;
    },

    sendEail: (url) => {
        let transporter = nodemailer.createTransport({
            service: 'qq',
            auth: {
                user: '530577510@qq.com',//qq邮箱账号
                pass: 'bfhnyqjpdcegbhch'//qq邮箱密码
            }
        });
        var mailOptions = {
            from: '530577510@qq.com', // 发送方地址
            to:url, // 
            subject: '测试邮件', // Subject line
            text: 'Nodejs之邮件发送', // plaintext body
            html:"<h2>测试邮件发送</h2>"
        };
        //邮件发送，返回Promise，方便做后续操作。
        return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions, function(error, info){
                if(!error){
                    resolve(true);
                }else{
                    reject(false);
                }
            });
        });
    }
}