module.exports = class extends think.Model {
    get tableName() {
        return 'chapterContent';
    }
    //增加章节与内容
    addChapter(chapter) {
        return this.add(chapter);
    }
    //查询章节
    findChapter(name) {
        return this.where({ chapterName:name }).find();
    }
    //查询所有章节列表
    findAllChapter() {
        return this.where({ book_id: 1 }).order("sork_key Asc").page(1,10).countSelect();
    }
}