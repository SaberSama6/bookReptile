module.exports = class extends think.Model {
    //增加书籍
    addBook(book) {
        return this.table("book").add(book);
    }
    //查询书籍是否入库
    findBook(id) {
        return this.table("book").where(id).find();
    }
}