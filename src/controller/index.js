const Base = require('./base.js');
import rp from 'request-promise';
import cheerio from 'cheerio';
import books from './book';
var myTime;
module.exports = class extends Base {
  constructor(ctx) {
    super(ctx); // 调用父级的 constructor 方法，并把 ctx 传递进去
    // 其他额外的操作 
    const isCli = ctx.isCli;
    if (isCli) { 
      this.crawlBook();
    } else {
      this.fail('该接口只支持在命令行调用~~~');
    }
  }
  
  indexAction() {
      this.bookModel = this.model('book');
      this.chapterModel = this.model('chapter');
      this.crawlBook();
  }

  sleep(time) {
    return new Promise(resolve => {
      myTime= setTimeout(resolve, time);
      return myTime;
    })
  }
  async crawlBook(isCheck) {
    for (let key in books) {
      var { id, name, url } = books[key];
      let bookRes = await this.bookModel.findBook(id);
      if (!think.isEmpty(bookRes)) {
        console.log(name + ' [此书已经入库，不再入库]...');
      } else {
        await this.bookModel.addBook(books[key]);      
      }
      console.log("爬取章节目录开始----------");
        let options = {
          uri: url,
          resolveWithFullResponse:true,
          simple:false
        };
        console.log(1);
        var $ = await rp(options).then(
          data => {
            // console.log(data);
            console.log("爬取章节目录成功----------");
            console.log(data.statusCode);
            return cheerio.load(data.body)
          }
        ).catch(
          err => {
            console.log(err)
            console.log("小说章节获取失败");
            this.crawlBook();
          }
        );
        var $chapters = $('.mulu').eq(1).find("ul li a"); // 所有章节的dom节点
        var chapterArr = []; // 存储章节信息

        //循环遍历章节
        $chapters.each((i, el) => {
          let $chapter = $(el);
          let name = $chapter.attr('title');
          let index = i + 1;
          let url = "https://www.81xzw.com" + $chapter.attr('href');
          chapterArr.push({
            bookId: id,
            sork_key:index,
            name,
            url
          });
        })
        for (let i = 0; i < chapterArr.length; i++) {
          let chapter = chapterArr[i];
          var res = await this.chapterModel.findChapter(chapter.name);
          if (!think.isEmpty(res)) {
            console.log(name + ' [章节已存在，忽略...]');
            continue;
          }
          console.log("爬虫等待时间");
          await this.sleep(5000);  //休息5秒，再次访问。
          clearTimeout(myTime);
          await this.crawlChapter(chapter);
        }
        // await this.crawlChapter(chapterArr[2]);
      }
  }

  async crawlChapter({bookId, sork_key,name, url},content="") {
    console.log("开始抓取小说内容" + name + "---------------------");
    let options = {
      uri: url,
      resolveWithFullResponse:true,
      simple:false
    };
    rp(options).then(
      data => {
        console.log("爬取章节目录成功----------");
        console.log(data.statusCode);
        this.disposeContent(cheerio.load(data.body), { bookId, sork_key,name, url }, content);
      }
    ).catch(
      err => {
        console.log(err);
        console.log("小说内容获取失败");
        this.crawlBook();
      }
    );
  }

  //处理内容部分函数
  async disposeContent(body,{bookId, sork_key,name, url},oldContent) {
    body("#content .anti-transform").remove();  //清洗没必要的文字结构。
    body("#content .to_nextpage").remove();
    let a = /一秒记住【八一新中文小说网 www.81xzw.com】，为您提供精彩小说阅读。/g;  //清洗多余文字。
    let b = /-->>/g;
    let content = body("#content").text();
    let newContent=content.replace(a,"").replace(b,""); //得到需要的文本内容.
    let $next = body('.pereview').eq(1).find("a").eq(2); //判断是否存在下一页的情况
    if ($next.text() == "下一页") {
      //查询当前章节下一页的内容做拼接，没有下一页则输出最终结果。
      url = "https://www.81xzw.com" + $next.attr("href");
      this.crawlChapter({ bookId, sork_key,name, url }, newContent+oldContent);
    } else {
      let ultimatelyContent = oldContent + newContent;
      //入库章节和内容
      await this.chapterModel.addChapter({ book_id: bookId, chapterName: name,sork_key, content: ultimatelyContent });
      console.log(name+"抓取完成----开始抓取下一章节");
    }
  }
};
