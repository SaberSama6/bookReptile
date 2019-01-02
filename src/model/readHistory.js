module.exports = class extends think.Model {
    get tableName() {
        return 'readHistory';
    }
    //增加或者跟新阅读历史。
    updateReadHistory(data,where) {
        return this.thenUpdate(data,where);
    }
}