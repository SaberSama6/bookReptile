// default config
module.exports = {
  workers: 1,
  port: 8360,
  cookie: {
    domain: '', 
    path: '/',
    maxAge: 3600 * 5, // 5分钟
    signed: true,
    keys: ['signature key'] // 当 signed 为 true 时，使用 keygrip 库加密时的密钥
  }
};
