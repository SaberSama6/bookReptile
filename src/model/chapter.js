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
    //获取章节详情
    getChapterDetail(where) {
        return this.where(where).find();
    }
    //查询所有章节列表
    findAllChapter(where) {
        where.currentPage = where.currentPage || 1;
        where.pageSize = where.pageSize || 10;
        return this.where({ book_id: where.id }).order("sork_key Asc").page(where.currentPage,where.pageSize).countSelect();
    }
}