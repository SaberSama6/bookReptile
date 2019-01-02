module.exports = class extends think.Model {
    get tableName() {
        return 'book';
    }
    //增加书籍
    addBook(book) {
        return this.add(book);
    }
    //查询书籍是否入库
    findBook(id) {
        return this.where(id).find();
    }
    //修改书籍完整性
    ChangeBookFull(id) {
        return this.where({id}).update({isFull: 1})
    }
     //查询所有书籍列表
     findAllBook() {
        return this.order("id Asc").page(1,10).countSelect();
    }
}