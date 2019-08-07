module.exports = {
  base: "/blog/",
  title: "哒哒的博客",
  description: "哒哒练习写文章做记录的地方",
  head: [["link", { rel: "icon", href: "/img/logo.png" }]],
  themeConfig: {
    nav: [
      {
        text: "JavaScript",
        items: [
          { text: "JS之面向对象程序设计和继承", link: "/JS/object" },
          { text: "JS基础知识总结", link: "/JS/base" },
          { text: "JS深浅拷贝", link: "/JS/copy" },
          { text: "JS设计模式", link: "/JS/design" },
          { text: "JS之this指向", link: "/JS/this" },
          { text: "JS条件语句", link: "/JS/ifelse" },
          { text: "JS之代码简洁之道", link: "/JS/simple" }
        ]
      },
      {
        text: "ReactNative",
        items: [
          { text: "ReactNative技术栈总结", link: "/ReactNative/summary" },
          { text: "ReactNative知识点记录", link: "/ReactNative/record" }
        ]
      },
      {
        text: "Vue",
        items: [
          { text: "vue基础知识", link: "/Vue/base" },
          { text: "vuex基础", link: "/Vue/vuex" }
        ]
      },
      {
        text: "混合开发",
        items: [
          { text: "cordova基础", link: "/hybird/cordova" },
          { text: "vue+cordova思考", link: "/hybird/vueCordova" },
          { text: "小程序多端框架研究", link: "/hybird/uniapp" }
        ]
      },
      {
        text: "Node",
        items: [
          { text: "koa2+sequelize初探", link: "/Node/koa2" },
          { text: "全栈工程思考", link: "/Node/fullStack" }
        ]
      },
      {
        text: "网络",
        items: [{ text: "http协议总结", link: "/http/base" }]
      },
      {
        text: "构建",
        items: [
          { text: "webpack学习", link: "/goujian/webpack" },
          { text: "从零搭建一个脚手架", link: "/goujian/cli" }
        ]
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
