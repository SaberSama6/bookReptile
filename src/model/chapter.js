module.exports = class extends think.Model {
    //增加章节与内容
    addChapter(chapter) {
        return this.table("chapterContent").add(chapter);
    }
    //查询章节
    findChapter(name) {
        return this.table("chapterContent").where({ chapterName:name }).find();
    }
}