
// 用这个可以支持 ECMA2015 的 generator
require("babel-polyfill");

// 加载css
require("../css/common.css");
require("../css/mybootstrap.less");
// require("bootstrap/less/bootstrap.less");

// 加载js
require("expose?$!expose?jQuery!jquery");
require('bootstrap');
require('jquery-validation');

// 扩展jquery validation
import validationExtension from './common/validator_extension.js';
validationExtension();


import Vue from 'vue';
import VueRouter from 'vue-router';
import RouteConfig from './routeConfig';
import Menu from './Menu';

Vue.config.debug = true; // debug模式

Vue.use(VueRouter);

var router = new VueRouter({
	hashbang: false,
	linkActiveClass: 'active'
});

RouteConfig(router);

router.start(Menu, "#main");
