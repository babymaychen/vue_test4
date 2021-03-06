import Vue from 'vue';

// 自定义jquery动画效果
Vue.transition('fade', {
  css: false,
  enter: function (el, done) {
    // 元素已被插入 DOM
    // 在动画结束后调用 done
    $(el)
      .css('opacity', 0)
      .animate({ opacity: 1 }, 500, done)
  },
  enterCancelled: function (el) {
    $(el).stop()
  },
  leave: function (el, done) {
    // 与 enter 相同
    $(el).animate({ opacity: 0 }, 500, done)
  },
  leaveCancelled: function (el) {
    $(el).stop()
  }
})

// 自定义filter 
Vue.filter("bookfilter", function(data, query){
  var filteredData = $(data).filter((_, item) => {
    if(new RegExp(query).test(item.name)){
      return true;
    }
    return item.authors.some((author) => {
      return new RegExp(query).test(author.name);
    })
  }).get();
  return filteredData;
});

export default null;