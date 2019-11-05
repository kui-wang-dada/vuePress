module.exports = {
  base: "/blog/",
  title: "哒哒的博客",
  description: "哒哒练习写文章做记录的地方",
  head: [["link", { rel: "icon", href: "/img/logo.png" }]],
  themeConfig: {
    nav: [
      {
        text: "JS基础",
        items: [
          { text: "JS之面向对象程序设计和继承", link: "/JS/object" },
          { text: "手写代码系列", link: "/JS/write" },
          { text: "JS基础知识总结", link: "/JS/base" },
          { text: "JS深浅拷贝", link: "/JS/copy" },
          { text: "JS设计模式", link: "/JS/design" },
          { text: "JS之this指向", link: "/JS/this" },
          { text: "JS条件语句", link: "/JS/ifelse" },
          { text: "JS之代码简洁之道", link: "/JS/simple" }
        ]
      },

      {
        text: "框架+App",
        items: [
          { text: "vue基础知识", link: "/app/vue" },
          { text: "vuex基础", link: "/app/vuex" },
          { text: "cordova基础", link: "/app/cordova" },
          { text: "vue+cordova思考", link: "/app/vueCordova" },
          { text: "ReactNative技术栈总结", link: "/app/RNSummary" },
          { text: "ReactNative知识点记录", link: "/app/RNRecord" },
          { text: "flutter学习笔记", link: "/app/flutter_1" },
          { text: "小程序多端框架研究", link: "/app/uniapp" }
        ]
      },

      {
        text: "后端",
        items: [
          { text: "koa2+sequelize初探", link: "/Node/koa2" },
          { text: "全栈工程思考", link: "/Node/fullStack" }
        ]
      },
      {
        text: "浏览器",
        items: [
          { text: "http协议总结", link: "/web/http" },
          { text: "浏览器的执行顺序和结构", link: "/web/web_1" }
        ]
      },
      {
        text: "构建",
        items: [
          { text: "webpack学习", link: "/goujian/webpack" },
          { text: "从零搭建一个脚手架", link: "/goujian/cli" },
          { text: "docker学习笔记", link: "/goujian/docker" }
        ]
      },
      {
        text: "计算机基础",
        items: [{ text: "计算机基础", link: "/base/computer" }]
      }
    ],
    sidebar: "auto",
    sidebarDepth: 2,
    lastUpdated: "Last Updated"
  },
  configureWebpack: {
    resolve: {
      alias: {}
    }
  }
};
