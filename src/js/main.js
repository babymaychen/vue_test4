require("../css/common.css");
// require('bootstrap/dist/css/bootstrap.css');
// require('bootstrap/dist/css/bootstrap-theme.css');
require("bootstrap/less/bootstrap.less");
require("bootstrap/less/theme.less");

require("expose?$!expose?jQuery!jquery");
require('bootstrap');

import Vue from 'vue';
import VueRouter from 'vue-router';
import RouteConfig from './routeConfig';
import Menu from './Menu';

Vue.config.debug = true;

Vue.use(VueRouter);

var router = new VueRouter({
	hashbang: false,
	linkActiveClass: 'active'
});

RouteConfig(router);

router.start(Menu, "#main");
