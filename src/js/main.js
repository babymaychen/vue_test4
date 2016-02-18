
// 用这个可以支持 ECMA2015 的 generator
require("babel-polyfill");

// 加载css
require("../css/all.less");

// 加载js
require("expose?$!expose?jQuery!jquery");
require('bootstrap');
require('jquery-validation');

// 扩展jquery validation
import validationExtension from './common/validator_extension.js';
validationExtension();

// bootstrap模板和其他的组件用模板
var templates = require("./pages/template.html");
$(templates).appendTo(document.body);


import Vue from 'vue';
import VueRouter from 'vue-router';
import RouteConfig from './routeConfig';
import Layout from './Layout';

Vue.config.debug = true; // debug模式

Vue.use(VueRouter);

var router = new VueRouter({
	hashbang: false,
	linkActiveClass: 'active'
});

RouteConfig(router);

router.start(Layout, "#main");
