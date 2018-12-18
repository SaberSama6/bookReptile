let crypto = require('crypto'); //加密器插件

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
    }
}