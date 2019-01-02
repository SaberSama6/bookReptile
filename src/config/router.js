module.exports = [
    ['/book/crawling', 'index/index'],
    ['/book/findAllChapter', 'index/findallchapter'],
    ['/book/getBookList', 'index/getBookList'],
    ['/book/getChapterDetail', 'index/getChapterDetail'],
    ['/user/add', 'user/add'],
    ['/user/id', 'user/id'],  //第一参数匹配路由，第二参数匹配controller中的action。
    ['/user/login', 'user/login'],
    ['/user/isLogin', 'user/isLogin'],
    ['/user/loginOut', 'user/loginOut']
];
