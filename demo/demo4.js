define('F.core/support',[],function()
{
	var support = {};
	/*\
	 * support
	 * test for browser support of certain technologies, most code is adapted from other places.
	 * including
	 * - [http://davidwalsh.name/vendor-prefix](http://davidwalsh.name/vendor-prefix)
	 * - [https://gist.github.com/3626934](https://gist.github.com/3626934)
	 * - [https://gist.github.com/1579671](https://gist.github.com/3626934)
	 * [example](../sample/support.html)
	 # <iframe src="../sample/support.html" width="800" height="200"></iframe>
	\*/
	/*\
	 * support.browser
	 - (number) browser name
	 [ property ]
	\*/
	/*\
	 * support.browser_name
	 - (number) browser name
	 [ property ]
	\*/
	/*\
	 * support.browser_version
	 - (number) browser version string
	 [ property ]
	\*/
	/*\
	 * support.mobile
	 - (string) mobile device name, undefined if not on a mobile device
	 [ property ]
	\*/
	/*\
	 * support.prefix
	 - (string) browser prefix
	 [ property ]
	\*/
	/*\
	 * support.prefix_dom
	 - (string) browser prefix for DOM
	 [ property ]
	\*/
	/*\
	 * support.prefix_css
	 - (string) browser prefix for css
	 [ property ]
	\*/
	/*\
	 * support.prefix_js
	 - (string) browser prefix for js
	 [ property ]
	\*/
	/*\
	 * support.css2dtransform
	 - (string) if supported, style property name with correct prefix
	 [ property ]
	 * you can do something like
	 | if( support.css2dtransform)
	 |		element.style[support.css2dtransform]= 'translate('+P.x+'px,'+P.y+'px) ';
	\*/
	/*\
	 * support.css3dtransform
	 - (string) if supported, style property name with correct prefix
	 [ property ]
	 | if( support.css3dtransform)
	 | 	this.el.style[support.css3dtransform]= 'translate3d('+P.x+'px,'+P.y+'px, 0px) ';
	\*/
	/*\
	 * support.localStorage
	 - (object) similar functionality as `window.localStorage`
	 * if `window.localStorage` is not supported, will create a shim that emulates `window.localStorage` using cookie. the methods `clear`, `getItem`, `key`, `removeItem`, `setItem` and property `length` are available, but the dot or array notation does not work. for example, the following does **not** work
	 | window.localStorage.someProperty = 2;
	 | window.localStorage['someProperty'] = 2;
	 * instead, use the following:
	 | support.localStorage.setItem('someProperty', 2);
	 * Ideally, all HTML5 browsers should support localStorage. The only problem is localStorage does not work in IE10 in protected mode for offline files.
	 [ property ]
	\*/
	/*\
	 * support.sessionStorage
	 - (object) similar functionality as `window.sessionStorage`
	 [ property ]
	\*/

	//test for browser and device
	(function(){		
		var N= navigator.appName, ua= navigator.userAgent, tem;
		var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
		if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
		M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
		support.browser = M[0];
		support.browser_name = M[0];
		support.browser_version = M[1];
		var mobile = /iPad|iPod|iPhone|Android|webOS|IEMobile/i.exec(navigator.userAgent.toLowerCase());
		support.mobile= mobile?mobile[0]:undefined;
		//[--adapted from http://davidwalsh.name/vendor-prefix
		var styles = window.getComputedStyle(document.documentElement, ''),
			pre = (Array.prototype.slice
				.call(styles)
				.join('') 
				.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
				)[1],
			dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
		support.prefix = dom;
		support.prefix_dom = dom;
		support.prefix_css = '-'+pre+'-';
		support.prefix_js = pre[0].toUpperCase() + pre.substr(1);
		//--]
	}());

	//test for css 2d transform support
	//[--adapted from https://gist.github.com/3626934
	(function(){

		var el = document.createElement('p'), t, has3d;
		var transforms = {
			'WebkitTransform':'-webkit-transform',
			'OTransform':'-o-transform',
			'MSTransform':'-ms-transform',
			'MozTransform':'-moz-transform',
			'transform':'transform'
		};

		/* Add it to the body to get the computed style.*/
		document.getElementsByTagName('body')[0].appendChild(el);

		for(t in transforms)
		{
			if( el.style[t] !== undefined )
			{
				var str;
				str = 'matrix(1, 0, 0, 1, 0, 0)';
				el.style[t] = str;
				if( str===window.getComputedStyle(el).getPropertyValue( transforms[t] ))
					support.css2dtransform= t;

				str = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1)'
				el.style[t] = str;
				//if( str===window.getComputedStyle(el).getPropertyValue( transforms[t] ))
				if( window.getComputedStyle(el).getPropertyValue( transforms[t] ).indexOf('matrix3d')===0)
					support.css3dtransform= t;
			}
		}

		el.parentNode.removeChild(el);
	}());
	//--] end

	/// because IE9/10 has no localstorage on local file
	// Storage polyfill by Remy Sharp
	// [--
	// https://github.com/inexorabletash/polyfill/blob/master/storage.js
	// https://gist.github.com/350433
	// Tweaks by Joshua Bell (inexorabletash@gmail.com)
	if (!window.localStorage || !window.sessionStorage) (function() {

		var Storage = function(type) {
			function createCookie(name, value, days) {
				var date, expires;

				if (days) {
					date = new Date();
					date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
					expires = "; expires=" + date.toGMTString();
				} else {
					expires = "";
				}
				document.cookie = name + "=" + value + expires + "; path=/";
			}

			function readCookie(name) {
				var nameEQ = name + "=",
					ca = document.cookie.split(';'),
					i, c;

				for (i = 0; i < ca.length; i++) {
					c = ca[i];
					while (c.charAt(0) == ' ') {
						c = c.substring(1, c.length);
					}

					if (c.indexOf(nameEQ) == 0) {
						return c.substring(nameEQ.length, c.length);
					}
				}
				return null;
			}

			function setData(data) {
				data = JSON.stringify(data);
				if (type == 'session') {
					window.name = data;
				} else {
					createCookie('localStorage', data, 365);
				}
			}

			function clearData() {
				if (type == 'session') {
					window.name = '';
				} else {
					createCookie('localStorage', '', 365);
				}
			}

			function getData() {
				var data = type == 'session' ? window.name : readCookie('localStorage');
				return data ? JSON.parse(data) : {};
			}


			// initialise if there's already data
			var data = getData();

			function numKeys() {
				var n = 0;
				for (var k in data) {
					if (data.hasOwnProperty(k)) {
						n += 1;
					}
				}
				return n;
			}

			return {
				clear: function() {
					data = {};
					clearData();
					this.length = numKeys();
				},
				getItem: function(key) {
					key = encodeURIComponent(key);
					return data[key] === undefined ? null : data[key];
				},
				key: function(i) {
					// not perfect, but works
					var ctr = 0;
					for (var k in data) {
						if (ctr == i) return decodeURIComponent(k);
						else ctr++;
					}
					return null;
				},
				removeItem: function(key) {
					key = encodeURIComponent(key);
					delete data[key];
					setData(data);
					this.length = numKeys();
				},
				setItem: function(key, value) {
					key = encodeURIComponent(key);
					data[key] = String(value);
					setData(data);
					this.length = numKeys();
				},
				length: 0
			};
		};

		if (!window.localStorage) support.localStorage = new Storage('local');
		if (!window.sessionStorage) support.sessionStorage = new Storage('session');

	}());
	else
	{
		support.localStorage = window.localStorage;
		support.sessionStorage = window.sessionStorage;
	}
	//--]

	/// because IE9 has no classList
	//classList shim by eligrey
	/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
	if("document" in self&&!("classList" in document.createElement("_")&&"classList" in document.createElementNS("http://www.w3.org/2000/svg","svg"))){(function(j){if(!("Element" in j)){return}var a="classList",f="prototype",m=j.Element[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.getAttribute("class")),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.setAttribute("class",this.toString())}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(){var s=arguments,r=0,p=s.length,q,o=false;do{q=s[r]+"";if(g(this,q)===-1){this.push(q);o=true}}while(++r<p);if(o){this._updateClassName()}};e.remove=function(){var t=arguments,s=0,p=t.length,r,o=false;do{r=t[s]+"";var q=g(this,r);if(q!==-1){this.splice(q,1);o=true}}while(++s<p);if(o){this._updateClassName()}};e.toggle=function(p,q){p+="";var o=this.contains(p),r=o?q!==true&&"remove":q!==false&&"add";if(r){this[r](p)}return !o};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))};

	return support;
});

/*\
 * util.js
 * utilities for F.LF
\*/

define('LF/util',[],function(){

if (typeof console==='undefined')
{	//polyfill for IE, this is just for precaution
	// we should not use console.log in production anyway unless for fatal error
    console={};
    console.log = function(){}
}

var util={};

util.select_from=function(from,where,option)
{
	var res=[];
	for( var i in from)
	{
		var O=from[i];
		var match=true;
		if( typeof where==='function')
		{
			if( !where(O))
				match=false;
		}
		else
			for( var j in where)
			{
				if( O[j]!==where[j])
					match=false;
			}
		if( match)
			res.push(O);
	}
	if( res.length===0)
		return ;
	else if( res.length===1)
		return res[0];
	else
		return res;
}

util.lookup=function(A,x)
{
	for( var i in A)
	{
		if( x<=i)
			return A[i];
	}
}

util.lookup_abs=function(A,x)
{
	if( x<0) x=-x;
	for( var i in A)
	{
		if( x<=i)
			return A[i];
	}
}

util.shallow_copy=function(A)
{
	var B={};
	for( var i in A)
		B[i] = A[i];
	return B;
}

util.div=function(classname)
{
	if( !util.container)
	{
		util.container = document.getElementsByClassName('LFcontainer')[0];
		if( !util.container) return null;
	}
	if( !classname) return util.container;
	return util.container.getElementsByClassName(classname)[0];
}

util.filename=function(file)
{
	if( file.lastIndexOf('/')!==-1)
		file = file.slice(file.lastIndexOf('/')+1);
	if( file.lastIndexOf('.js')!==-1)
		file = file.slice(0,file.lastIndexOf('.js'));
	return file;
}

/**
The resourcemap specified by F.core allows putting a js function as a condition checker.
This is considered insecure in F.LF. thus F.LF only allows simple predefined condition checking.
*/
util.setup_resourcemap=function(package,Fsprite)
{
	var has_resmap=false;
	if( package.resourcemap)
	if( typeof package.resourcemap.condition==='string')
	{
		var cond = package.resourcemap.condition.split(' ');
		if( cond[0]==='location' && cond[1]==='contain' &&
			cond[2] && cond[3]==='at' && cond[4])
		{
			cond[4]=parseInt(cond[4]);
			package.resourcemap.condition = function()
			{
				return window.location.href.indexOf(cond[2])===cond[4];
			}
		}
		else if( cond[0]==='location' && cond[1]==='contain' && cond[2])
		{
			package.resourcemap.condition = function()
			{
				return window.location.href.indexOf(cond[2])!==-1;
			}
		}

		if( typeof package.resourcemap.condition==='function')
		{
			var resmap = [
				package.resourcemap, //package-defined resourcemap
				{	//default resourcemap
					get: function(res)
					{
						return package.location+res;
					}
				}
			];
			Fsprite.masterconfig_set('resourcemap',resmap);
			has_resmap=true;
		}
	}
	if( !has_resmap)
		Fsprite.masterconfig_set('baseUrl',package.location);
}

//return the parameters passed by location
util.location_parameters=function()
{
	var param = window.location.href.split('/').pop(),
		query = {};
	if( param.indexOf('?')!==-1)
	{
		var param = param.split('?').pop().split('&');
		for( var i=0; i<param.length; i++)
		{
			pp = param[i].split('=');
			if( pp.length===1)
				query[pp[0]] = 1;
			if( pp.length===2)
				query[pp[0]] = pp[1];
		}
	}
	return query;
}

return util;
});

/*\
 * global.js
 * 
 * global constants of a game
 * 
 * note to data changers: tweak entries in this file very carefully. do not add or delete entries.
\*/
define('LF/global',['LF/util'],function(util)
{

var G={};

G.application={};
var GA = G.application;
GA.window={};
GA.window.width=794;
GA.window.height=550;
GA.viewer={};
GA.viewer.height=400;
GA.camera={};
GA.camera.speed_factor=1/18;

/*\
 * global.combo_list
 [ property ]
 * list of combos
 | { name:'DvA', seq:['def','down','att']} //example
\*/
G.combo_list = [
	{ name:'D<A', seq:['def','left','att'], clear_on_combo:false},
	{ name:'D>A', seq:['def','right','att'], clear_on_combo:false},
	{ name:'DvA', seq:['def','down','att']},
	{ name:'D^A', seq:['def','up','att']},
	{ name:'DvJ', seq:['def','down','jump']},
	{ name:'D^J', seq:['def','up','jump']},
	{ name:'D<J', seq:['def','left','jump']},
	{ name:'D>J', seq:['def','right','jump']},
	{ name:'D<AJ', seq:['def','left','att','jump']},
	{ name:'D>AJ', seq:['def','right','att','jump']},
	{ name:'DJA', seq:['def','jump','att']}
];
G.combo_tag =
{	//look up from combo name to tag name
	'def':'hit_d',
	'jump':'hit_j',
	'att':'hit_a',
	'D>A':'hit_Fa',
	'D<A':'hit_Fa',
	'DvA':'hit_Da',
	'D^A':'hit_Ua',
	'DvJ':'hit_Dj',
	'D^J':'hit_Uj',
	'D>J':'hit_Fj',
	'D<J':'hit_Fj',
	'D<AJ':'hit_Fj',
	'D>AJ':'hit_Fj',
	'DJA':'hit_ja'
};
G.combo_priority =
{	//larger number is higher priority
	'up':0,'down':0,'left':0,'right':0,'def':0,'jump':0,'att':0,'run':0,
	'D>A':1, 'D<A':1, 'DvA':1, 'D^A':1,
	'DvJ':1, 'D^J':1, 'D>J':1, 'D<J':1, 'D<AJ':1, 'D>AJ':1, 'DJA':1
};

G.lazyload = function(O) //return true to delay loading of data files
{
	if( !this.character_list)
		this.character_list={};
	if( O.type==='character')
	{
		var file = util.filename(O.file);
		this.character_list[file] = true;
		return true; //delay loading of all character files
	}
	else if( O.type)
	{
		var file = util.filename(O.file);
		if( file.lastIndexOf('_')!==-1)
			file = file.slice(0,file.lastIndexOf('_'));
		/** delay loading of all character prefixed files. consider,
			{id: 1, type:'character', file:'data/deep.js'},
			{id:203, type:'specialattack', file:'data/deep_ball.js'}
			as `deep.js` is of type character, any files matching `deep_*` will also be lazy loaded
		*/
		if( this.character_list[file])
			return true;
	}
	return false;
};

G.gameplay={};
var GC = G.gameplay;

/*\
 * global.gameplay.default
 [ property ]
 * What are the defaults?
 * 
 * default means `otherwise specified`. all defaults get overridden, and (mostly) you can set the specific property in data files. so it might not be meaningful to change default values.
 * if any of them cannot be overridden, please move them out of default.
\*/
GC.default={};
GC.default.health={};
GC.default.health.hp_full=500;
GC.default.health.mp_full=500;
GC.default.health.mp_start=200; //it cannot be overriden

GC.default.itr={};
GC.default.itr.zwidth= 12; //default itr zwidth
GC.default.itr.hit_stop= 3; //default stall when hit somebody
GC.default.itr.throw_injury= 10;

GC.default.cpoint={};
GC.default.cpoint.hurtable= 0; //default cpoint hurtable
GC.default.cpoint.cover= 0; //default cpoint cover
GC.default.cpoint.vaction= 135; //default frame being thrown

GC.default.wpoint={};
GC.default.wpoint.cover= 0;

GC.default.effect={};
GC.default.effect.num= 0; //default effect num

GC.default.fall={};
GC.default.fall.value= 20; //default fall
GC.default.fall.dvy= -6.9; //default dvy when falling

GC.default.weapon={};
GC.default.weapon.vrest= 9; //default weapon vrest

GC.default.character={};
GC.default.character.arest= 7; //default character arest

GC.default.machanics={};
GC.default.machanics.mass= 1; //default mass; weight = mass * gravity

/*\
 * global.gameplay
 [ property ]
 * gameplay constants
 * 
 * these are defined constants over the game, tweak them carefully otherwise it might introduce bugs
\*/

GC.recover={};
GC.recover.fall= -0.45; //fall recover constant
GC.recover.bdefend= -0.5; //bdefend recover constant

GC.effect={};
GC.effect.num_to_id= 300; //convert effect num to id
GC.effect.duration= 3; //default effect lasting duration

GC.character={};
GC.character.bounceup={}; //bounce up during fall
GC.character.bounceup.limit={};
GC.character.bounceup.limit.xy= 13.4; //defined speed threshold to bounce up again
GC.character.bounceup.limit.y= 11; //y threshold; will bounce if any one of xy,y is overed
GC.character.bounceup.y= 4.25; //defined bounce up speed
GC.character.bounceup.absorb= //how much dvx to absorb when bounce up
{
	9:1,
	14:4,
	20:10,
	40:20
}

GC.defend={};
GC.defend.injury={};
GC.defend.injury.factor= 0.1; //defined defend injury factor
GC.defend.break_limit= 40; //defined defend break
GC.defend.absorb= //how much dvx to absorb when defence is broken
{	//look up table
	5:0,
	15:5
}

GC.fall={};
GC.fall.KO= 60; //defined KO
GC.fall.wait180= //the wait of 180 depends on effect.dvy
{	//lookup
	//dvy:wait
	7:1,
	9:2,
	11:3,
	13:4,
	15:5,
	17:6
}

GC.friction={};
GC.friction.fell=    //defined friction at the moment of fell onto ground
{	//a lookup table
	//speed:friction
	2:0,
	3:1,
	5:2,
	6:4, //smaller or equal to 6, value is 4
	9:5,
	13:7,
	25:9 //guess entry
}

GC.min_speed= 1; //defined minimum speed

GC.gravity= 1.7; //defined gravity

GC.weapon={};
GC.weapon.bounceup={}; //when a weapon falls onto ground
GC.weapon.bounceup.limit= 8; //defined limit to bounce up again
GC.weapon.bounceup.speed={};
GC.weapon.bounceup.speed.y= -3.7; //defined bounce up speed
GC.weapon.bounceup.speed.x= 3;
GC.weapon.bounceup.speed.z= 1.5;
GC.weapon.soft_bounceup={}; //when heavy weapon being hit by character punch
GC.weapon.soft_bounceup.speed={};
GC.weapon.soft_bounceup.speed.y= -2;

GC.weapon.hit={}; //when a weapon hit others
GC.weapon.hit.vx= -3; //absolute speed
GC.weapon.hit.vy= 0;

//GC.weapon.gain.factor.x= 1.1; //when a weapon is being hit at rest
//GC.weapon.gain.factor.y= 1.8;

GC.weapon.reverse={}; //when a weapon is being hit while travelling in air
GC.weapon.reverse.factor={};
GC.weapon.reverse.factor.vx= -0.4;
GC.weapon.reverse.factor.vy= -2;
GC.weapon.reverse.factor.vz= -0.4;

GC.unspecified= -842150451; //0xCDCDCDCD, one kind of HEX label

return G;
});

/*\
 * util
 * javascript utilities
\*/
define('F.core/util',[],function(){

var F={

// javascript-----------------

/**	inject a .js file
	deprecated in favour of the use of head.js, now requirejs
*/
/* js: function (filename)
{
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.src = filename;
	script.type = 'text/javascript';
	head.appendChild(script);
}, */

/*\
 * util.css
 * attach a stylesheet to page
 [ method ]
 - filename (string)
\*/
css: function (filename)
{
	var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('link');
	link.href = filename;
	link.rel = 'stylesheet';
	link.type = 'text/css';
	head.appendChild(link);
},

/*\
 * util.make_array
 [ method ]
 - target (any)
 * if target is:
 - (array) returns target as is.
 - (object) returns object encapsulated in an array.
 - (falsy) (null, undefined or zero), returns an empty array.
\*/
make_array: function (target)
{
	if( target)
	{
		if( target instanceof Array)
			return target;
		else
			return [target];
	}
	else
		return [];
},

//data structure------------

/*\
 * util.search_array
 [ method ]
 - arr (array) target to be searched
 - fc_criteria (function) return true when an accepted element is passed in
 - [fc_replace] (function) to return a replacement value when original value is passed in
 - [search_all] (boolean) if true, will search through entire array before returning the list of indices, otherwise, will return immediately at the first accepted element
 = (number) index of the found element if `search_all` if false
 = (array) of (number) if `search_all` is true
\*/
search_array: function (arr, fc_criteria, fc_replace, search_all)
{
	var found_list=new Array();
	//for ( var i=0; i<arr.length; i++)
	for ( var i in arr)
	{
		if ( fc_criteria(arr[i],i))
		{
			if ( fc_replace) {
				arr[i] = fc_replace(arr[i]);
			}
			if ( !search_all) {
				return i;
			} else {
				found_list.push(i);
			}
		}
	}
	if ( search_all) {
		return found_list;
	} else {
		return -1;
	}
},
arr_search: function (A,B,C,D)
{
	return F.search_array(A,B,C,D);
},

/*\
 * util.push_unique
 * push only if not existed in array
 [ method ]
 - array (array)
 - element (object)
 = (boolean) true if added
\*/
push_unique: function ( array, element)
{
	var res = F.arr_search( array, function(E){return E==element} );
	if (res == -1)
	{
		array.push(element);
		return true;
	}
},

/*\
 * util.extend_object
 * extend obj1 with all members of obj2
 [ method ]
 - obj1, obj2 (object)
 = (object) a modified obj1
\*/
extend_object: function (obj1, obj2)
{
	for (var p in obj2)
	{
		if ( typeof obj2[p]==='object' )
		{
			obj1[p] = arguments.callee((obj1[p]?obj1[p]:(obj2[p] instanceof Array?[]:{})), obj2[p]);
		} else
		{
			obj1[p] = obj2[p];
		}
	}
	return obj1;
},

/*\
 * util.to_text
 * convert an object into JSON text
 * 
 * most of the time you should use built-in `JSON.stringify` instead
 [ method ]
 - obj (object)
 - name (string) the object's name
 - [sep] (string) separator, default as `\n`
 - [pretext] (string) used in recursion only, set it to null
 - [filter] (function) a filter `function(p,P)` passing in name p and object P, return 1 to hide the attribute, OR return a string to be shown
 - [TTL] (number) time-to-live to prevent infinite looping
|	var obj={};
|	obj.a={};
|	obj.a.x=1;
|	obj.a.y=1;
|	obj.b='hello';
|	obj.c=12;
|	console.log(util.to_text(obj,'obj'));
|	//outputs:
|	obj:
|	{
|		a:
|		{
|			'x': 1,
|			'y': 1
|		},
|		'b': 'hello',
|		'c': 12
|	}
\*/
to_text: function (
	obj2, name,
	sep,
	pretext,
	filter,
	TTL
)
{
	if( TTL===0) return '';
	if( !TTL) TTL=30;
	if( !sep) sep='\n';
	if( !pretext) pretext='';

	var str = pretext+ name +':'+sep;
	str+= pretext+ '{';
	var cc=0;
	for (var p in obj2)
	{
		var fil = filter && filter(p,obj2[p]);
		if( fil==1)
		{
			//do nothing
		}
		else if( typeof fil=='string')
		{
			str += (cc?',':'')+sep+pretext+'\t'+"'"+p+"'"+': '+fil;
		}
		else
		{
			if( obj2[p].constructor==Object )
			{
				str += (cc?',':'')+sep+arguments.callee(obj2[p],p,sep,pretext+'\t',filter,TTL-1);
			} else
			{
				str += (cc?',':'')+sep+pretext+'\t'+"'"+p+"'"+': ';
				if( typeof obj2[p]=='string')
					str += "'";
				str += obj2[p];
				if( typeof obj2[p]=='string')
					str += "'";
			}
		}
		cc=1;
	}
	str+= sep+pretext+ '}';
	return str;
},

/*\
 * util.extract_array
 [ method ]
 * extract properties from an array of objects
|	//say we have
|	[ {x:x1,y:y1}, {x:x2,y:y2}, {x:x3,y:y3},,,]
|	//we want to extract it into
|	{
|	  x:
|		[ x1, x2, x3,,, ],
|	  y:
|		[ y1, y2, y3,,, ]
|	}
 - array (array)
 - prop (string) property name
 * or
 - prop (array) array of property name
 = (array) extracted array
\*/
extract_array: function(array, prop)
{
	var out={};
	prop = F.make_array(prop);

	for( var j in prop)
		out[prop[j]] = [];

	for( var i=0; i<array.length; i++)
	{
		for( var k=0; k<prop.length; k++)
		{
			var P=prop[k];
			out[P].push(array[i][P]);
		}
	}
	return out;
},

/** proposed method
group an array of objects using a key
group_elements( [{name:'alice',gender:'F'},{name:'bob',gender:'M'},{name:'cathy',gender:'F'}], 'gender')
returns
{
	'F':[{name:'alice',gender:'F'},{name:'cathy',gender:'F'}],
	'M':[{name:'bob',gender:'M'}]
}
*/
group_elements: function(arr,key)
{
	var group={};
	for( var i=0; i<arr.length; i++)
	{
		if( arr[i][key])
		{
			var gp=arr[i][key];
			if( !group[gp])
				group[gp]=[];
			group[gp].push(arr[i]);
		}
	}
	return group;
},

/** proposed method*/
for_each: function(arr,callback)
{
	if( arr instanceof Array)
	{
		for( var i=0; i<arr.length; i++)
			callback(arr[i],i);
	}
	else if( arr)
	{
		for( var I in arr)
			callback(arr[I]);
	}
},

/** proposed method*/
call_each: function(arr,method /*,arg*/)
{
	var arg = Array.prototype.slice.call(arguments,2);
	if( arr instanceof Array)
	{
		for( var i=0; i<arr.length; i++)
			if( typeof arr[i][method]==='function')
				arr[i][method].apply(null, arg);
	}
	else if( arr)
	{
		for( var i in arr)
			if( typeof arr[i][method]==='function')
				arr[i][method].apply(null, arg);
	}
}

};

return F;
});

/*\
 * loader.js
 * 
 * loader is a requirejs plugin that loads content packages
\*/

define('LF/loader',['LF/global','F.core/util'],function(global,Futil){

	return {
		load: function (name, require, load, config)
		{
			var path='';
			var content={};
			var manifest={};

			if( config.isBuild)
			{
				load();
				return ;
			}
			if( document.getElementById('flf-config'))
			{
				var fconfig = document.getElementById('flf-config').innerHTML;
				fconfig = JSON.parse(fconfig);
				if( fconfig.package)
					load_package(fconfig.package);
				else
				{
					load();
					return ;
				}
			}

			function load_package(pack)
			{
				path=normalize_path(pack);
				content.location = normalize_path(config.baseUrl)+path;
				require( [filepath('manifest')], function(mani)
				{
					manifest=mani;
					var manifest_schema=
					{
						"data":"string",
						"resourcemap":"string!optional"
					}
					if( !validate(manifest_schema,manifest))
					{
						console.log('loader: error: manifest.js of '+path+' is not correct.');
					}
					require( [filepath(manifest.data)], load_data);
					load_something('resourcemap');
				});
			}
			function normalize_path(ppp)
			{	//normalize a file path section
				if( !ppp)
					return '';
				ppp=ppp.replace(/\\/g,'/');
				if( ppp.charAt(ppp.length-1)!=='/')
					ppp+='/';
				if( ppp.charAt(0)==='/')
					ppp=ppp.slice(1);
				return ppp;
			}
			function filepath(ppp)
			{
				if( !ppp)
					return '';
				if( ppp.lastIndexOf('.js')===ppp.length-3)
					ppp = ppp.slice(0,ppp.length-3);
				var suf = path.indexOf('http')===0?'.js':'';
				return path+ppp+suf;
			}
			function load_data(datalist)
			{
				function allow_load(OO)
				{
					if( typeof global.lazyload==='function')
					{
						if( !global.lazyload(OO))
							return true;
					}
					else
						return true;
				}

				var datafile_depend=[];

				for( var i in datalist)
				{
					if( datalist[i] instanceof Array)
					{
						for( var j=0; j<datalist[i].length; j++)
							if( datalist[i][j].file)
							if( allow_load(datalist[i][j]))
								datafile_depend.push(filepath(datalist[i][j].file));
					}
					else if( typeof datalist[i]==='object')
					{
						if( datalist[i].file)
						if( allow_load(datalist[i]))
							datafile_depend.push(filepath(datalist[i].file));
					}
				}

				require( datafile_depend, function()
				{
					var gamedata=Futil.extend_object({},datalist);
					var param = 0;

					for( var i in datalist)
					{
						if( datalist[i] instanceof Array)
						{
							for( var j=0; j<datalist[i].length; j++)
								if( datalist[i][j].file)
								{
									if( allow_load(datalist[i][j]))
									{
										gamedata[i][j].data = arguments[param];
										param++;
									}
									else
									{
										gamedata[i][j].data = 'lazy';
									}
								}
						}
						else if( typeof datalist[i]==='object')
						{
							if( datalist[i].file)
							{
								if( allow_load(datalist[i]))
								{
									gamedata[i].data = arguments[param];
									param++;
								}
								else
								{
									gamedata[i].data = 'lazy';
								}
							}
						}
					}

					content.data=gamedata;
					module_lazyload();
					load_ready();
				});
			}
			function load_something(thing)
			{
				require( [filepath(manifest[thing])], function(it){
					content[thing] = it;
					load_ready();
				});
			}
			function load_ready()
			{
				var content_schema=
				{
					data:'object',
					resourcemap:'object!optional',
					location:'string'
				}
				if( validate(content_schema,content))
					load(content); //make the require loader return
			}
			function module_lazyload()
			{	//embed the lazyload module
				if( typeof global.lazyload==='function')
				{
					content.data.object.load=function(ID,ready)
					{
						var objects=content.data.object;
						var load_list=[];
						var res_list=[];
						for( var i=0; i<ID.length; i++)
						{
							var O; //search for the object
							for( var j=0; j<objects.length; j++)
								if( objects[j].id===ID[i])
								{
									O=objects[j];
									break;
								}
							if( O && O.file && O.data==='lazy')
							{
								load_list.push(O);
								res_list .push(filepath(O.file));
							}
						}
						requirejs(res_list,function()
						{
							for( var i=0; i<arguments.length; i++)
								load_list[i].data = arguments[i];
							ready();
						});
					}
				}
			}

			/** a simple JSON schema validator*/
			function validate(schema,object)
			{
				var good=false;
				if( object)
				{
					good=true;
					for( var I in schema)
					{
						var sss = schema[I].split('!'),
							type = sss[0],
							option = sss[1] || '';
						if( typeof object[I]===type) {
							//good
						}
						else if (typeof object[I]==='undefined' && 
									option && option==='optional') {
							//still good
						}
						else {
							good=false;
							break;
						}
					}
				}
				return good;
			}
		},
		normalize: function (name, normalize)
		{
			return name;
		}
	}
});

/*\
 * F.core
 * network: p2p networking via webrtc with peer.js
\*/

(function (window) {

if( typeof define !=='undefined')
	define('F.core/network',[],define_module);
else
	window.Fcore_network = define_module();

function define_module()
{
	var timer_callback,
		target_interval,
		next_frame,
		lasttime = new Date().getTime(),
		buffer = {};

	function set_interval(a,b)
	{
		if( !timer_callback)
		{
			timer_callback = a;
			target_interval = b;
			if( target_interval>=30)
				target_interval-=1; //make it slightly faster
			return setInterval(frame,target_interval*0.5);
		}
		else
			console.log('network: error: only one timer can be active at a time. please `clearInterval` before setting a new one.');
	}
	function clear_interval(a)
	{
		clearInterval(a);
		timer_callback = null;
	}
	function frame() //timer frame
	{
		if( timer_callback)
		if( buffer.time!==undefined && buffer.time!==null)
		{
			var newtime = new Date().getTime(),
				diff = newtime-lasttime;
			if( diff > target_interval-5) //too slow
			{
				var result = timer_callback(buffer.time,buffer.data,next_frame);
				lasttime = newtime;
				buffer.time=null;
				buffer.data=null;
				if( result)
					next_frame(result);
			}
		}
	}
	
	function setup_peer(host,active,id1,id2,key)
	{
		if( !id1 || !id2)
		{
			console.log('network: no id.');
			return false;
		}
		var once_open_only = false,
			time = 0,
			connected = {},
			peer = new Peer(id1, {host:host,debug:3,key:key||'flf'}),
			conn; //connection
		
		function dataframe(time,data)
		{
			buffer.time = time;
			buffer.data = data;
			frame();
		}
		
		next_frame=function(data)
		{
			conn.send(JSON.stringify({t:time,d:data}));
			if( !active)
				time++;
		}
		
		peer.on('open', function(id) {
			if( !once_open_only)
			{
				once_open_only = true;
				if( active)
					active_connect();
				if( !active)
					passive_connect();
			}
		});
		
		function active_connect()
		{
			//initiate a connection
			var num_tried=0,success=false;
			setTimeout(keep_trying, 2000);
			function keep_trying()
			{
				if( success) return;
				conn = peer.connect(id2);
				var cid;
				conn.on('close', function(){
					console.log('connection closed');
				});
				conn.on('error', function(e){
					console.log('error:',e);
				});
				conn.on('open', function(){
					success = true;
					conn.send(JSON.stringify({m:'hi',id:id1})); //handshake
				});
				conn.on('data', function(data){
					data = JSON.parse(data);
					if( data.m==='hi')
					{
						if( data.id===id2 && !connected[data.id]) //verify id
						{
							//conn.send(JSON.stringify({t:time})); //process starts
							connected[data.id] = true;
							cid = data.id;
							dataframe(time,data.d);
						}
						else
						{
							console.log('unknown peer');
							conn.close();
						}
					}
					else if( cid)
					{
						if( data.t!==time)
							console.log('out of sync',data.t,time);
						else
						{
							if( active)
								time++;
							dataframe(time,data.d);
						}
					}
				});
				num_tried++;
				if( num_tried<10)
					setTimeout(keep_trying, 5000);
				else
					console.log('failed to connect to peer.');
			}
		}
		
		function passive_connect()
		{
			//received a connection
			peer.on('connection', function(connect) {
				conn = connect;
				var cid;
				conn.on('close', function(){
					console.log('connection closed');
				});
				conn.on('error', function(e){
					console.log('error:',e);
				});
				conn.on('data', function(data){
					data = JSON.parse(data);
					if( data.m==='hi')
					{
						if( data.id===id2 && !connected[data.id]) //verify id
						{
							conn.send(JSON.stringify({m:'hi',id:id1})); //handshake
							connected[data.id] = true;
							cid = data.id;
						}
						else
						{
							console.log('unknown peer');
							conn.close();
						}
					}
					else if( cid)
					{
						if( data.t!==time)
							console.log('out of sync');
						else
						{
							dataframe(time,data.d);
						}
					}
				});
			});
		}
	}
	
	return {
		setup_peer:setup_peer,
		setInterval:set_interval,
		clearInterval:clear_interval
	}
}

}(window));
/*\
 * network: p2p networking via webrtc with peer.js
 * wrapping functionality of F.core/network, enabling a (nearly) transparent interface
\*/

define('LF/network',['LF/util','F.core/network','LFrelease/third_party/peer'],function(util,Fnetwork)
{
	var param = util.location_parameters();
	
	//local[i] in peer A will be mapped to remote[i] in peer B
	var local = [],
		remote = [];
	
	function set_interval(callback,int)
	{
		Fnetwork.setInterval(function(time,data,send)
		{
			if( data && data.control)
				for (var i=0; i<remote.length; i++)
					remote[i].supply(data.control[i]);
			var control=[];
			for (var i=0; i<local.length; i++)
				control[i] = local[i].pre_fetch();
			send({
				control:control
			});
			callback();
			for (var i=0; i<local.length; i++)
				local[i].swap_buffer();
		},int);
	}
	
	function ncon(role,control)
	{
		this.state={};
		this.child=[];
		this.buf=[];
		this.pre_buf=[];
		this.sync=true;
		this.role=role;
		if( role==='local' || role==='dual')
		{
			local.push(this);
			this.control = control;
			this.type = control.type;
			if( control.config)
				this.config = control.config;
			control.child.push(this);
			control.sync=true;
			for( var i in control.state)
				this.state[i] = 0;
		}
		if( role==='remote' || role==='dual')
		{
			remote.push(this);
			for( var i in this.state)
				this.state[i] = 0;
		}
	}
	ncon.prototype.clear_states=function()
	{
		var role=this.role;
		if( role==='local' || role==='dual')
		{
			this.control.clear_states();
		}
		if( role==='remote')
		{
			for( var i in this.state)
				this.state[i] = 0;
		}
	}
	ncon.prototype.flush=function()
	{
	}
	ncon.prototype.pre_fetch=function()
	{
		//here we pre-fetch a controller and put the key sequence into a buffer
		//  the buffer will then be sent off to a remote peer
		//locally, the buffer will be fetched at the next frame
		if( this.role==='local' || this.role==='dual')
		{
			this.control.fetch();
			return this.pre_buf;
		}
	}
	ncon.prototype.swap_buffer=function()
	{
		if( this.role==='local' || this.role==='dual')
		{
			var hold = this.pre_buf;
			this.pre_buf = this.buf;
			this.buf = hold;
		}
	}
	ncon.prototype.supply=function(buf)
	{
		//received a key sequence buffer from remote peer
		if( this.role==='remote' || this.role==='dual')
		{
			if( buf && buf.length)
				this.buf = this.buf.concat(buf);
		}
	}
	ncon.prototype.fetch=function()
	{
		for( var i=0; i<this.buf.length; i++)
		{
			var I=this.buf[i], K=I[0], D=I[1];
			for( var j=0; j<this.child.length; j++)
				this.child[j].key(K,D);
			this.state[K]=D;
		}
		this.buf.length=0;
	}
	ncon.prototype.key=function(K,down)
	{
		this.pre_buf.push([K,down]);
	}
	
	var key, host = 'http://localhost:8080';
	if( location.origin==='http://tyt2y3.github.io')
		host = 'http://flf-lodge.herokuapp.com';
	if( param.host==='peerjs')
	{
		host = 'http://0.peerjs.com';
		key = 'skrweclntxi27qfr';
	}
	
	if( param.pvp && param.id1 && param.id2)
	{
		Fnetwork.setup_peer(host,
				param.pvp==='active',
				param.id1,
				param.id2,
				key
		);
		return {
			controller:ncon,
			setInterval:set_interval,
			clearInterval:Fnetwork.clearInterval
		}
	}
	else
	{
		return {
			setInterval:function(a,b){return setInterval(a,b);},
			clearInterval:function(a){return clearInterval(a);}
		}
	}
});
define('F.core/controller',[],function()
{

function keydown(e)
{
	return master_controller.key(e,1);
}

function keyup(e)
{
	return master_controller.key(e,0);
}

//block F1 key in IE
if( 'onhelp' in window)
{
	window.onhelp = function(){
		return false;
	}
}

var master_controller = (function()
{
	if (document.addEventListener){
		document.addEventListener("keydown", keydown, true);
		document.addEventListener("keyup", keyup, true);
	} else if (document.attachEvent){
		document.attachEvent("keydown", keydown);
		document.attachEvent("keyup", keyup);
	}

	var mas = new Object();
	mas.child = [];
	mas.key = function(e,down)
	{
		if (!e) e = window.event;
		for (var I in this.child)
		{
			if ( this.child[I].key(e.keyCode,down))
				break;//if one controller catches a key, the next controller will never receive an event
		}
		//the follow section blocks some browser-native key events, including ctrl+f and F1~F12
		e.cancelBubble = true;
		if( e.returnValue)
			e.returnValue = false;
		if( e.stopPropagation)
		{
			e.stopPropagation();
			e.preventDefault();
		}
		return false;
	}
	return mas;
}());

/*\
 * controller
 * keyboard controller
 * - controllers for multiple players on the same keyboard
 * - maintains a table of key states
 * - generate key events for child controllers
 * - buffered mode: buffer inputs and fetch only once a loop
 * - never drops keys
 * see [http://project--f.blogspot.hk/2012/11/keyboard-controller.html](http://project--f.blogspot.hk/2012/11/keyboard-controller.html) for technical explaination
 [ class ]
 - config (object)
|	var con_config=
|	{
|		up:'h',down:'n',left:'b',right:'m',def:'v',jump:'f',att:'d'
|		//,'control name':'control key',,,
|	}
|	var con = new controller(con_config);
\*/
function controller (config)
{
	/*\
	 * controller.state
	 [ property ]
	 - (object)
	 * table of key states
	 * 
	 * note that keys are indexed by their names, i.e. `up`,`down` rather than `w`,`s`
	 | con.state.down //check if the `down` key is pressed down
	\*/
	this.state={};
	/*\
	 * controller.config
	 [ property ]
	 - (object)
	 * note that controller still keeps a reference to the config object
	\*/
	this.config=config;
	/*\
	 * controller.keycode
	 [ property ]
	 - (object)
	 * the keycode for each key
	\*/
	this.keycode={};
	/*\
	 * controller.child
	 [ property ]
	 * child systems that has the method `key(name,down)`
	 *
	 * push a child into this array to listen to key events
	 *
	 * see @combodec.key
	\*/
	this.child=new Array();
	/*\
	 * controller.sync
	 * controllers can work in 2 modes, sync and async
	 [ property ]
	 * if `sync===false`, a key up-down event will be dispatched to all child **immediately**.
	 * 
	 * if `sync===true`, a key up-down event will be buffered, and must be `fetch` manually.
	 * there are very good reasons to architect your game in synchronous mode
	 * - time-determinism; see [http://project--f.blogspot.hk/2013/04/time-model-and-determinism.html](http://project--f.blogspot.hk/2013/04/time-model-and-determinism.html)
	 * - never drop keys; see [http://project--f.blogspot.hk/2012/11/keyboard-controller.html](http://project--f.blogspot.hk/2012/11/keyboard-controller.html)
	\*/
	this.sync=false;
	/*\
	 * controller.buf
	 [ property ]
	 - (array)
	 * the array of keyname of buffered key input
	\*/
	this.buf=new Array();

	//[--constructor
	master_controller.child.push(this);
	this.clear_states();
	for(var I in this.config)
	{
		this.keycode[I] = controller.keyname_to_keycode(this.config[I]);
	}
	//--]

	/*\
	 * controller.zppendix
	 * on the other hand, there can be other controllers with compatible definition and behavior,
	 * (e.g. touch controller, AI controller, network player controller, record playback controller)
	 * - has the properties `state`, `config`, `child`, `sync`
	 * - behavior: call the `key` method of every member of `child` when keys arrive
	 * - has the method `clear_states`, `fetch` and `flush`
	 * - behavior: if `sync` is true, the controller should buffer key inputs,
	 * and only dispatch to child when `fetch` is called,
	 * and flush the buffer when `flush` is called
	\*/
}

/*\
 * controller.type
 [ property ]
 - (string)
 * value=`keyboard`
\*/
controller.prototype.type = 'keyboard';

/*\
 * controller.key
 [ method ]
 * supply events to controller
 * 
 * master controller will do this automatically
 - e (object) keycode
 - down (boolean)
\*/
controller.prototype.key=function(e,down) //interface to master_controller
{
	var caught=0;
	for(var I in this.config)
	{
		if ( this.keycode[I]==e)
		{
			if( this.sync===false)
			{
				if( this.child)
					for(var J in this.child)
						this.child[J].key(I,down);
				this.state[I]=down;
			}
			else
			{
				this.buf.push([I,down]);
			}
			caught=1;
			break;
		}
	}
	return caught;
}

/*\
 * controller.clear_states
 * clear the key state table
 [ method ]
\*/
controller.prototype.clear_states=function()
{
	for(var I in this.config)
		this.state[I]=0;
}
/*\
 * controller.fetch
 * fetch for inputs received since the last fetch, will flush buffer afterwards
 [ method ]
\*/
controller.prototype.fetch=function()
{
	for( var i=0; i<this.buf.length; i++)
	{
		var I=this.buf[i][0];
		var down=this.buf[i][1];
		if( this.child)
			for(var j=0; j<this.child.length; j++)
				this.child[j].key(I,down);
		this.state[I]=down;
	}
	this.buf.length=0;
}
/*\
 * controller.flush
 * flush the buffer manually
 [ method ]
\*/
controller.prototype.flush=function()
{
	this.buf=[];
}

/*\
 * controller.keyname_to_keycode
 * convert keyname to keycode
 [ method ]
 - keyname (string) 
 = (number) keycode 
 * note that some keycode is not the same across all browsers, 
 * for details consult [http://www.quirksmode.org/js/keys.html](http://www.quirksmode.org/js/keys.html)
\*/
controller.keyname_to_keycode=
controller.prototype.keyname_to_keycode=
function(A)
{
	if( typeof A==='number')
		return A;
	var code;
	if( A.length==1)
	{
		var a=A.charCodeAt(0);
		if ( (a>='a'.charCodeAt(0) && a<='z'.charCodeAt(0)) || (a>='A'.charCodeAt(0) && a<='Z'.charCodeAt(0)) )
		{
			A=A.toUpperCase();
			code=A.charCodeAt(0);
		}
		else if (a>='0'.charCodeAt(0) && a<='9'.charCodeAt(0))
		{
			code=A.charCodeAt(0);
		}
		else
		{	//different browsers on different platforms are different for symbols
			switch(A)
			{
				case '`': code=192; break;
				case '-': code=189; break;
				case '=': code=187; break;
				case '[': code=219; break;
				case ']': code=221; break;
				case '\\': code=220; break;
				case ';': code=186; break;
				case "'": code=222; break;
				case ',': code=188; break;
				case '.': code=190; break;
				case '/': code=191; break;
				case ' ': code=32; break;
			}
		}
	}
	else
	{
		switch(A)
		{
			case 'ctrl': code=17; break;
			case 'up': code=38; break; //arrow keys
			case 'down': code=40; break;
			case 'left': code=37; break;
			case 'right': code=39; break;
			case 'space': code=32; break;
			case 'esc': code=27; break;
		}
	}
	if( A.length==2)
	{
		if( A.charAt(0)==='F')
		{
			code=111+parseInt(A.slice(1));
		}
	}
	return code;
}

/*\
 * controller.keycode_to_keyname
 * convert keycode back to keyname
 [ method ]
 - keycode (number) 
 = (string) keyname
\*/
controller.keycode_to_keyname=
controller.prototype.keycode_to_keyname=
function(code)
{
	if( (code>='A'.charCodeAt(0) && code<='Z'.charCodeAt(0)) ||
	    (code>='0'.charCodeAt(0) && code<='9'.charCodeAt(0)) )
	{
		return String.fromCharCode(code).toLowerCase();
	}
	else if( code>=112 && code<=123)
	{
		return 'F'+(code-111);
	}
	else
	{
		var nam = code;
		switch(code)
		{
			case 38: nam='up'; break;
			case 40: nam='down'; break;
			case 37: nam='left'; break;
			case 39: nam='right'; break;
			case 32: nam='space'; break;
			case 27: nam='esc'; break;
		}
		return nam;
	}
}

return controller;

// http://unixpapa.com/js/key.html
});

/*\
 * css
 * css is a requirejs plugin that loads a css file and inject it into a page.
 * 
 * note that this loader will return immediately,
 * regardless of whether the browser had finished parsing the stylesheet.
 *
 * this css loader is implemented for file optimization and depedency managment
| requirejs(['css!style.css','css!more.css'],function(css1,css2){
|	console.log(css1+','+css2); //true if successfully loaded
| });
\*/

define('F.core/css',{
	load: function (name, require, load, config) {
		function inject(filename)
		{
			var head = document.getElementsByTagName('head')[0];
			var link = document.createElement('link');
			link.href = filename;
			link.rel = 'stylesheet';
			link.type = 'text/css';
			head.appendChild(link);
		}
		inject(requirejs.toUrl(name));
		load(true);
	},
	pluginBuilder: './css-build'
});

define('F.core/css-embed', function()
{
	function embed_css(content)
	{
		var head = document.getElementsByTagName('head')[0],
		style = document.createElement('style'),
		rules = document.createTextNode(content);
		style.type = 'text/css';
		if(style.styleSheet)
			style.styleSheet.cssText = rules.nodeValue;
		else style.appendChild(rules);
			head.appendChild(style);
	}
	return embed_css;
});

define('F.core/css!F.core/style.css', ['F.core/css-embed'], 
function(embed)
{
	embed(
	'.F_sprite { position:absolute; overflow:hidden; width:10px; height:10px; } .F_sprite_group { position:absolute; } .F_sprite_inline { overflow:hidden; width:10px; height:10px; } .F_sprite_img { position:absolute; } /* .canvas { position:relative; width:800px; height:300px; border:1px solid #000; } .page { position: absolute; left: 0px; top: 0px; border: 1px solid #000; z-index: 10000; }*/'
	);
	return true;
});

/*\
 * resourcemap
 * 
 * a resourcemap allows mapping from a canonical resource name (shorter and understandable) to the actual url (long and ugly)
\*/
define('F.core/resourcemap',['F.core/util'],function(Futil){

	/*\
	 * resourcemap
	 [ class ]
	 - map (object)
	 * or
	 - map (array) of maps
	 * schema
	 * 
	 * {
	 - condition (function) return true to enable this map. this is only evaluated once in constructor. you can force re-evaluate by calling `update_condition`. if this property is undefined, it is assumed to be __true__.
	 - resource (object) of name-url pairs. this is optional if a `get()` method is specified.
	 - get (function) given the resource name, return the url. this is optional if a `resource` object is specified.
	 * }
	 * 
	 * example
	 | map =
	 | {
	 |	condition: function()
	 |	{
	 |		if( window.location.href.indexOf('http://')===0)
	 |			return true;
	 |	},
	 |	resource:
	 |	{
	 |		'squirrel.png':'http://imagehost.com/FtvJG6rAG2mdB8aHrEa8qXj8GtbYRpqrQs9F8X8.png'
	 |	},
	 |	get: function(res)
	 |	{
	 |		var url='http://imagehost.com/'+res;
	 |		return url;
	 |	}
	 | }
	\*/
	function mapper(map)
	{
		this.map = Futil.make_array(map);
		for( var i=0; i<this.map.length; i++)
			this.map[i] = new submap(this.map[i]);
	}
	/*\
	 * resourcemap.update_condition
	 [ method ]
	 * update the mapping condition. takes effect in subsequent `get` calls.
	 * the mapping function will be disabled if neither `map.resource` nor `map.get` if defined
	\*/
	mapper.prototype.update_condition=function()
	{
		Futil.call_each(this.map,'update_condition');
	}
	/*\
	 * resourcemap.get
	 [ method ]
	 - res (string) resource name
	 = (string) resource url
	 * 
	 * if there are multiple maps, it will go through them one by one in array order,
	 * and returns the result of the first enabled map. if there is no enabled map,
	 * or all maps return null, return `res` as is.
	 * 
	 * for each enabled map, `get()` will first look into `map.resource` for a match,
	 * and fall back to `map.get()` otherwise. if none of them gives truthy result, return null.
	\*/
	mapper.prototype.get=function(res)
	{
		var url;
		for( var i=0; i<this.map.length; i++)
		{
			url = this.map[i].get(res);
			if( url)
				break;
		}
		return url || res;
	}

	/** individual map instances
	 */
	function submap(map)
	{
		this.map = map;
		this.update_condition();
	}
	submap.prototype.update_condition=function()
	{
		if( this.map.condition)
			this.enable = this.map.condition() || false;
		else
			this.enable = true;
		if( typeof this.map.resource !== 'object' &&
			typeof this.map.get      !== 'function')
			this.enable = false;
	}
	submap.prototype.get=function(res)
	{
		if( this.enable)
		{
			if( this.map.resource && this.map.resource[res])
				return this.map.resource[res];
			else
			{
				var url = this.map.get && this.map.get(res);
				if( url) return url;
			}
		}
		return null;
	}
	//
	return mapper;
});

/*\
 * sprite
 * features:
 * - display and control sprites on page using `<div>` and `<img>` tag
 * - multiple images for one sprite
 * - **not** using canvas for sprite animations
 * - support style left/top and CSS 2d/3d transform, depending on browser support
\*/
define('F.core/sprite',['F.core/css!F.core/style.css','F.core/support','F.core/resourcemap','module'],
function(css,support,resourcemap,module)
{

var sp_count = 0; //sprite count
var sp_masterconfig = module.config() || {};

/*\
 * sprite
 [ class ]
 - config (object)
 * {
 - canvas (object) `div` DOM node to create and append sprites to; __or__
 - div    (object) `div` DOM node, if specified, will use this `div` as sprite instead of creating a new one
 * must have `canvas` or `div` property. properties below are optional
 - wh     (object) width and height; __or__
 - wh     (string) 'fit' fit to image size
 - img    (object) image list
 - { name (string) image path }; __or__
 - img    (string) if you have only one image. in this case the image will be named '0'
 - type   (string) `'group'`: create as sprite group
 * }
 * 
 * config is one time only and will be dumped, without keeping a reference, after constructor returns. that means it is okay to reuse config objects, in loops or other contexts.
|	var sp_config=
|	{
|		canvas: canvas,    // create and append a div to this node
|		wh: {x:100,y:100}, // width and height
|		wh: 'fit',         // OR fit to image size
|		img: 'test_sprite.png' // image path
|	}
|	var sp1 = new sprite(sp_config);
 * 
 * more on `config.div` option. if it is specified, will `adopt` this `div` instead of creating a new one. and if that `div` contains `img` elements, will also adopt them if they have a `name` attribute. frankly speaking, `<div><img name="0" src="sprite.png"/></div>` is equivalent to `img: { '0':'sprite.png' }` in a `config` object.
\*/
function sprite (config)
{
	this.ID=sp_count;
	sp_count++;

	/*\
	 * sprite.el
	 [ property ]
	 * the `div` element
	\*/
	var classname = 'F_sprite';
	if( config.type==='group')
		classname = 'F_sprite_group';
	else if( config.div)
		classname = 'F_sprite_inline';
	if( config.div)
	{
		this.el = config.div;
		this.el.classList.add(classname);
		if( window.getComputedStyle(this.el).getPropertyValue('position')==='static')
			this.el.style.position='relative';
	}
	else
	{
		this.el = document.createElement('div');
		this.el.className = classname;
		if( config.canvas)
			config.canvas.appendChild(this.el);
	}

	/*\
	 * sprite.img
	 [ property ]
	 * the img list
	\*/
	this.img={};
	/*\
	 * sprite.cur_img
	 [ property ]
	 * name of current image
	\*/
	this.cur_img=null;

	if( config.wh==='fit')
		this.fit_to_img=true;
	else if( typeof config.wh==='object')
		this.set_wh(config.wh);
	if( config.img)
	{	//add the images in config list
		if( typeof config.img==='object')
			for ( var I in config.img)
				this.add_img(config.img[I], I);
		else
			this.add_img(config.img, '0');
	}
	if( config.div && config.type!=='group')
	{	//adopt images in `div`
		var img = config.div.getElementsByTagName('img');
		for( var i=0; i<img.length; i++)
		{
			var Name=img[i].getAttribute('name');
			if( Name)
				this.adopt_img(img[i]);
		}
	}

	if( (support.css3dtransform && !sp_masterconfig.disable_css3dtransform) ||
		(support.css2dtransform && !sp_masterconfig.disable_css2dtransform))
	{
		if( !config.div)
		{
			this.el.style.left=0+'px';
			this.el.style.top=0+'px';
		}
		this.x=0; this.y=0;
	}
}

/*\
 * sprite.masterconfig
 [ method ]
 * set or get masterconfig. this is entirely optional
 o static method
 - config (object) if set
 - no parameter (undefined) if get
 = config (object) if get
 * the schema is:
 * {
 - baseUrl (string) base url prepended to all image paths; __or__
 - resourcemap (object) a @resourcemap definition
 * }
 * choose only one of `baseUrl` or `resourcemap`, they are two schemes of resource url resolution. `baseUrl` simply prepend a string before every url, while `resourcemap` is a general solution. if set, this option will take effect on the next `add_img` or `sprite` creation.
 * 
 * because css transform support is built into prototype of `sprite` during module definition, `disable_css2dtransform` can only be set using requirejs.config __before any__ module loading
 * 
 * example:
|	requirejs.config(
|	{
|		baseUrl: "../", //be sure to put all requirejs config in one place
|
|		config:
|		{
|			'F.core/sprite':
|			{
|				baseUrl: '../sprites/',
|				disable_css2dtransform: false, //null by default
|				disable_css3dtransform: false  //null by default
|			}
|		}
|	});
\*/
sprite.masterconfig=
sprite.prototype.masterconfig=
function(c)
{
	if( c)
	{
		sp_masterconfig=c;
		sprite.masterconfig_update();
	}
	else
		return sp_masterconfig;
}

/*\
 * sprite.masterconfig_set
 [ method ]
 o static method
 * sets a key-value pair to masterconfig
 - key (string)
 - value (any)
\*/
sprite.masterconfig_set=
sprite.prototype.masterconfig_set=
function(key,value)
{
	if( key && value)
	{
		sp_masterconfig[key] = value;
		sprite.masterconfig_update();
	}
}

/**undocumented private*/
sprite.masterconfig_update=function()
{
	if( sp_masterconfig.resourcemap)
		if( !(sp_masterconfig.resourcemap instanceof resourcemap))
			sp_masterconfig.resourcemap = new resourcemap(sp_masterconfig.resourcemap);
}

/**undocumented private
 * sprite.resolve_resource
 [ method ]
 o static method
 - res (string)
 = (string)
*/
sprite.resolve_resource=function(res)
{
	if( sp_masterconfig.resourcemap)
		return sp_masterconfig.resourcemap.get(res);
	if( sp_masterconfig.baseUrl)
		return sp_masterconfig.baseUrl + res;
	return res;
}

sprite.preload_image=function(imgpath)
{
	var img = new Image();
	img.src = sprite.resolve_resource(imgpath);
}

/*\
 * sprite.set_wh
 [ method ]
 * set width and height
 - P (object) `{x,y}`
\*/
/*\
 * sprite.set_w_h
 [ method ]
 * set width and height
 - w (number)
 - h (number)
\*/
/*\
 * sprite.set_w
 [ method ]
 * set width
 - w (number)
\*/
/*\
 * sprite.set_h
 [ method ]
 * set height
 - h (number)
\*/
sprite.prototype.set_wh=function(P)
{
	this.el.style.width=P.x+'px';
	this.el.style.height=P.y+'px';
}
sprite.prototype.set_w_h=function(w,h)
{
	this.el.style.width=w+'px';
	this.el.style.height=h+'px';
}
sprite.prototype.set_w=function(w)
{
	this.el.style.width=w+'px';
}
sprite.prototype.set_h=function(h)
{
	this.el.style.height=h+'px';
}

/*\
 * sprite.set_xy
 [ method ]
 * set x and y
 - P (object) `{x,y}`
\*/
/*\
 * sprite.set_x_y
 [ method ]
 * set x and y
 - x (number)
 - y (number)
 * will use css3dtransform, css2dtransform and csslefttop automatically, depending on browser support
\*/
if( support.css3dtransform && !sp_masterconfig.disable_css3dtransform)
{
	sprite.prototype.set_xy=function(P)
	{
		this.x=P.x; this.y=P.y;
		this.el.style[support.css3dtransform]= 'translate3d('+P.x+'px,'+P.y+'px, 0px) '+(this.mirrored?'scaleX(-1) ':'');
	}
	sprite.prototype.set_x_y=function(x,y)
	{
		this.x=x; this.y=y;
		this.el.style[support.css3dtransform]= 'translate3d('+x+'px,'+y+'px, 0px) '+(this.mirrored?'scaleX(-1) ':'');
	}
	sprite.prototype.mirror=function(m)
	{
		this.mirrored=m;
		this.set_x_y(this.x,this.y);
	}
}
else if( support.css2dtransform && !sp_masterconfig.disable_css2dtransform)
{
	sprite.prototype.set_xy=function(P)
	{
		this.x=P.x; this.y=P.y;
		this.el.style[support.css2dtransform]= 'translate('+P.x+'px,'+P.y+'px) '+(this.mirrored?'scaleX(-1) ':'');
	}
	sprite.prototype.set_x_y=function(x,y)
	{
		this.x=x; this.y=y;
		this.el.style[support.css2dtransform]= 'translate('+x+'px,'+y+'px) '+(this.mirrored?'scaleX(-1) ':'');
	}
	sprite.prototype.mirror=function(m)
	{
		this.mirrored=m;
		this.set_x_y(this.x,this.y);
	}
}
else
{
	sprite.prototype.set_xy=function(P)
	{
		this.el.style.left=P.x+'px';
		this.el.style.top=P.y+'px';
	}
	sprite.prototype.set_x_y=function(x,y)
	{
		this.el.style.left=x+'px';
		this.el.style.top=y+'px';
	}
	sprite.prototype.mirror=function(m)
	{
		//not supported
	}
}
/*\
 * sprite.set_z
 [ method ]
 * set z index
 - z (number) larger index will show on top
\*/
sprite.prototype.set_z=function(z)
{
	this.el.style.zIndex=Math.round(z);
}
/*\
 * sprite.add_img
 [ method ]
 * add new image
 - imgpath (string)
 - name (string)
 = (object) newly created `img` element
 * note that adding images can and should better be done in constructor `config`
\*/
sprite.prototype.add_img=function(imgpath,Name)
{
	var This=this;
	var im = document.createElement('img');
	im.setAttribute('class','F_sprite_img');
	im.addEventListener('load', onload, true);
	function onload()
	{
		if( !this.naturalWidth) this.naturalWidth=this.width;
		if( !this.naturalHeight) this.naturalHeight=this.height;
		if( This.fit_to_img)
			This.set_w_h(this.naturalWidth,this.naturalHeight);
		im.removeEventListener('load', onload, true);
	}
	im.src = sprite.resolve_resource(imgpath);
	this.el.appendChild(im);

	this.img[Name]=im;
	this.switch_img(Name);
	return im;
}
/**undocumented private
 * sprite.adopt_img
 * adopt an `img` element that already exists
 [ method ]
 - im (object) `img` element
*/
sprite.prototype.adopt_img=function(im)
{
	var Name=im.getAttribute('name');
	im.classList.add('F_sprite_img');
	if( !im.naturalWidth) im.naturalWidth=im.width;
	if( !im.naturalHeight) im.naturalHeight=im.height;
	if( !im.naturalWidth && !im.naturalHeight)
		im.addEventListener('load', onload, true);
	function onload()
	{
		if( !this.naturalWidth) this.naturalWidth=this.width;
		if( !this.naturalHeight) this.naturalHeight=this.height;
		im.removeEventListener('load', onload, true);
	}
	this.img[Name]=im;
	this.switch_img(Name);
}
/*\
 * sprite.switch_img
 [ method ]
 - name (string) the key you specified in key-value-pair object `config.img`
\*/
sprite.prototype.switch_img=function(name)
{
	var left,top; //store the left, top of the current displayed image
	for ( var I in this.img)
	{
		if( this.img[I].style.display=='')
		{
			left=this.img[I].style.left;
			top =this.img[I].style.top;
			break;
		}
	}
	for ( var I in this.img)
	{
		if( I==name)
		{
			this.img[I].style.left=left;
			this.img[I].style.top=top;
			this.img[I].style.display='';
		}
		else
		{
			this.img[I].style.display='none';
		}
	}
	this.cur_img=name;
}
/*\
 * sprite.set_img_xy
 * set the position of the image, note that coordinates should be negative to show something
 [ method ]
 - P (object) `{x,y}`
\*/
/*\
 * sprite.set_img_x_y
 [ method ]
 - x (number)
 - y (number)
\*/
if( support.css3dtransform && !sp_masterconfig.disable_css3dtransform)
{
	sprite.prototype.set_img_xy=function(P)
	{
		this.x=P.x; this.y=P.y;
		this.img[this.cur_img].style[support.css3dtransform]= 'translate3d('+P.x+'px,'+P.y+'px, 0px) ';
	}
	sprite.prototype.set_img_x_y=function(x,y)
	{
		this.x=x; this.y=y;
		this.img[this.cur_img].style[support.css3dtransform]= 'translate3d('+x+'px,'+y+'px, 0px) ';
	}
}
else if( support.css2dtransform && !sp_masterconfig.disable_css2dtransform)
{
	sprite.prototype.set_img_xy=function(P)
	{
		this.x=P.x; this.y=P.y;
		this.img[this.cur_img].style[support.css2dtransform]= 'translate('+P.x+'px,'+P.y+'px) ';
	}
	sprite.prototype.set_img_x_y=function(x,y)
	{
		this.x=x; this.y=y;
		this.img[this.cur_img].style[support.css2dtransform]= 'translate('+x+'px,'+y+'px) ';
	}
}
else
{
	sprite.prototype.set_img_xy=function(P)
	{
		this.img[this.cur_img].style.left= P.x+'px';
		this.img[this.cur_img].style.top= P.y+'px';
	}
	sprite.prototype.set_img_x_y=function(x,y)
	{
		this.img[this.cur_img].style.left= x+'px';
		this.img[this.cur_img].style.top= y+'px';
	}
}

sprite.prototype.draw_to_canvas=function(canvas)
{
	var img = this.img[this.cur_img];
	canvas.drawImage(img, -parseInt(img.style.left), -parseInt(img.style.top), //src
						parseInt(this.el.style.width), parseInt(this.el.style.height),
						parseInt(this.el.style.left), parseInt(this.el.style.top), //dest
						parseInt(this.el.style.width), parseInt(this.el.style.height)
						);
}

/*\
 * sprite.remove
 * remove from scene graph
 [ method ]
 * the remove/attach pair means a 'strong removal'.
 * under current implementation, it means remove from DOM
\*/
sprite.prototype.remove=function()
{
	if( !this.removed && this.el.parentNode)
	{
		this.removed = this.el.parentNode;
		this.el.parentNode.removeChild(this.el);
	}
}
/*\
 * sprite.attach
 * if previously removed, attach back to scene graph
 [ method ]
 * an antagonist pair with @sprite.remove
\*/
sprite.prototype.attach=function()
{
	if( this.removed)
	{
		this.removed.appendChild(this.el);
		this.removed = null;
	}
}
/*\
 * sprite.hide
 * temporary being hidden in rendering
 [ method ]
 * the hide/show pair is conceptually 'weaker' than remove/attach pair
\*/
sprite.prototype.hide=function()
{
	this.el.style.display='none';
}
/*\
 * sprite.show
 * an antagonist pair with @sprite.hide
 [ method ]
\*/
sprite.prototype.show=function()
{
	this.el.style.display='';
}

return sprite;

});

define('F.core/animator',[],function()
{

/*\
 * animator
 [ class ]
 * - animate sprites
 * - support multiple animation sequence on the same image
 - config (object)
| {
|		x:0,y:0,     //top left margin of the frames
|		w:100, h:100,//width, height of a frame
|		gx:4,gy:4,   //define a gx*gy grid of frames
|		tar:         //target @sprite
|		ani:         //[optional] animation sequence:
|			null,    //if undefined, loop through top left to lower right, row by row
|			[0,1,2,1,0],//use custom animation sequence
|		borderright: 1, //[optionals] trim the right edge pixels away
|		borderbottom: 1,
|		borderleft: 1,
|		bordertop: 1
| }
 * multiple animators reference to the same config, so dont play with it in runtime
 *
 * [example](../sample/sprite.html)
 # <iframe src="../sample/sprite.html" width="400" height="250"></iframe>
 # <img src="../sample/test_sprite.png" width="300">
\*/
function animator (config)
{
	this.config=config;
	this.target=config.tar;
	/*\
	 * animator.I
	 * current frame
	 [ property ]
	 * if `config.ani` exists, `I` is the index to this array. otherwise it is the frame number
	\*/
	this.I=0;
	/*\
	 * animator.horimirror
	 [ property ]
	 - (boolean) true: mirrored, false: normal
	 * usually a sprite character is drawn to face right and mirrored to face left. hmirror mode works with sprites that is flipped horizontally __as a whole image__.
	\*/
	this.horimirror=false; //horizontal mirror
	if( !config.borderright)  config.borderright=0;
	if( !config.borderbottom) config.borderbottom=0;
	if( !config.borderleft)  config.borderleft=0;
	if( !config.bordertop)   config.bordertop=0;
}
/*\
 * animator.next_frame
 * turn to the next frame
 [ method ]
 * if `config.ani` exists, will go to the next frame of animation sequence
 *
 * otherwise, loop through top left to lower right, row by row
 = (number) the frame just shown
 * remarks: if you want to check whether the animation is __ended__, test it against 0. when `animator.I` equals 'max frame index', the last frame is _just_ being shown. when `animator.I` equals 0, the last frame had finished the whole duration of a frame and is _just_ ended.
\*/
animator.prototype.next_frame=function()
{
	var c=this.config;
	this.I++;
	if (!c.ani)
	{
		if ( this.I==c.gx*c.gy)
		{
			this.I=0; //repeat sequence
		}
		this.show_frame(this.I);
	}
	else
	{
		var fi=c.ani[this.I];
		if ( this.I>=c.ani.length || this.I<0)
		{
			this.I=0; fi=c.ani[0]; //repeat sequence
		}
		this.show_frame(fi);
	}
	return this.I;
}
/*\
 * animator.seek
 * seek to a particular index on animation sequence
 [ method ]
 - I (number) sequence index
\*/
animator.prototype.seek=function(I)
{
	var c=this.config;
	if( c.ani)
	if( I>=0 && I<c.ani.length)
	{
		this.I=I;
		var fi=c.ani[this.I];
		this.show_frame(fi);
	}
}
/*\
 * animator.rewind
 [ method ]
 * return to the first frame of animation sequence
\*/
animator.prototype.rewind=function()
{
	this.I=-1;
	this.next_frame();
}
/*\
 * animator.set_frame
 [ method ]
 * set to a particular frame
 - i (number) frame number on image
 * the top-left frame is 0
\*/
animator.prototype.set_frame=function(i)
{
	this.I=i;
	this.show_frame(i);
}
animator.prototype.show_frame=function(i)
{
	var c=this.config;
	var left,top;
	left= -((i%c.gx)*c.w+c.x+c.borderleft);
	top = -((Math.floor(i/c.gx))*c.h+c.y+c.bordertop);
	if( this.horimirror)
		left= -this.target.img[this.target.cur_img].naturalWidth-left+c.w-c.borderleft-c.borderright;
	this.target.set_w_h(
		c.w-c.borderleft-c.borderright,
		c.h-c.bordertop-c.borderbottom
	);
	this.target.set_img_x_y(left,top);
	//may also need to set_x_y to compensate the border
}
animator.prototype.get_at=function(i) //get the content of the graph at frame i
{	//by default at the current frame
	if( !i) i=this.I;
	var c=this.config;
	return c.graph[(i%c.gx)][(Math.floor(i/c.gx))];
}

/*\
 * animator.set
 [ method ]
 * a helper function to constructor a set of animators
 *
 * animator set is a method. do **not** `var ani = new animator_set(..)`
 - set_config (object)
 - [base] (string)
 *
| set_config=
| {
|	'base': //default parameters, must be specified as base when calling animator_set
|	{
|		x:0,y:0,     //top left margin of the frames
|		w:L, h:L,    //width, height of a frame
|		gx:4,gy:1,   //define a gx*gy grid of frames
|		tar:null,    //target sprite
|	},
|
|	'standing':
|	{	//change only values you want to
|		x:0,y:0,     //top left margin of the frames
|		gx:4,gy:1    //define a gx*gy grid of frames
|	} //,,,
| }
| var set = animator.set(set_config,'base')
 = (object) animator set
\*/
animator.set=function(set_config, base)
{
	if(!set_config)
		return null;
	var A=new Object();

	for( var I in set_config)
	{
		if( base) if( I==base)
			continue;

		if( base) if( set_config[base])
		{
			for( var J in set_config[base])
				set_config[I][J] = set_config[base][J];
		}

		A[I]=new animator(set_config[I]);
	}
	return A;
}

return animator;

});

/*\
 * sprite
 * 
 * sprite-animator for LF2
\*/
define('LF/sprite',['F.core/sprite','F.core/animator'], function (Fsprite, Fanimator)
{

/*\
 * sprite
 [ class ]
 - bmp (object) data structure as defined in data files
 - parent (DOM node) where to append the new sprite
\*/
function sprite (bmp, parent)
{
	/*\
	 * sprite.num_of_images
	 [ property ]
	\*/
	var num_of_images = this.num_of_images = bmp.file.length;
	/*\
	 * sprite.w
	 [ property ]
	 * width
	\*/
	/*\
	 * sprite.h
	 [ property ]
	 * height
	\*/
	var w = this.w = bmp.file[0].w+1;
	var h = this.h = bmp.file[0].h+1;
	/*\
	 * sprite.ani
	 [ property ]
	 - Fanimator (object)
	\*/
	var ani = this.ani = [];
	/*\
	 * sprite.dir
	 [ property ]
	 * `'left'` or `'right'`
	\*/
	this.dir = 'right';
	/*\
	 * sprite.cur_img
	 [ property ]
	 * current image index
	\*/
	this.cur_img = 0;

	var sp_con=
	{
		canvas: parent,
		wh: {x:w,y:h},
		img:{}
	}
	/*\
	 * sprite.sp
	 [ property ]
	 - Fsprite (object)
	\*/
	var sp = this.sp = new Fsprite(sp_con);

	for( var i=0; i<bmp.file.length; i++)
	{
		var imgpath='';
		for( var j in bmp.file[i])
		{
			if( typeof bmp.file[i][j] === 'string' &&
			    j.indexOf('file')===0 )
				imgpath = bmp.file[i][j];
		}
		if( imgpath==='')
			console.log( 'cannot find img path in data:\n'+JSON.stringify(bmp.file[i]) );
		sp.add_img( imgpath, i);

		var ani_con=
		{
			x:0,  y:0,   //top left margin of the frames
			w:bmp.file[i].w+1, h:bmp.file[i].h+1,    //width, height of a frame
			gx:bmp.file[i].row, gy:bmp.file[i].col,//define a gx*gy grid of frames
			tar:sp,     //target sprite
			borderleft: 0,
			bordertop: 0,
			borderright: 1,
			borderbottom: 1
		};
		ani.length++;
		ani[i] = new Fanimator(ani_con);
	}
}

/*\
 * sprite.destroy
 [ method ]
 * clear memory so that itself and the DOM nodes can be garbage collected
\*/
sprite.prototype.destroy = function()
{
	this.sp.remove();
	this.sp=null;
	this.ani.length=0;
}

/*\
 * sprite.show_pic
 [ method ]
 - I (number) picture index to show
\*/
sprite.prototype.show_pic = function(I)
{
	var slot=0;
	for( var k=0; k<this.ani.length; k++)
	{
		var i = I - this.ani[k].config.gx * this.ani[k].config.gy;
		if( i >= 0)
		{
			I = i;
			slot++;
		}
		else
			break;
	}
	if( slot >= this.ani.length)
	{
		slot = this.ani.length-1;
		I=999;
	}
	this.cur_img = slot;
	this.sp.switch_img(this.cur_img);
	this.ani[this.cur_img].set_frame(I);
	this.w = this.ani[this.cur_img].config.w;
	this.h = this.ani[this.cur_img].config.h;
}
/*\
 * sprite.switch_lr
 [ method ]
 * switch sprite direction
 - dir (string) `'left'` or `'right'`
\*/
sprite.prototype.switch_lr = function(dir) //switch to `dir`
{
	if( dir!==this.dir)
	{
		this.dir=dir;
		this.sp.mirror(dir==='left');
	}
}
/*\
 * sprite.set_xy
 [ method ]
 - x (number)
 - y (number)
\*/
sprite.prototype.set_x_y = function(x,y)
{
	this.sp.set_x_y(x,y);
}
/*\
 * sprite.set_z
 [ method ]
 - Z (number)
\*/
sprite.prototype.set_z = function(Z)
{
	this.sp.set_z(Z);
}
/*\
 * sprite.show
 [ method ]
\*/
sprite.prototype.show = function()
{
	this.sp.show();
}
/*\
 * sprite.hide
 [ method ]
\*/
sprite.prototype.hide = function()
{
	this.sp.hide();
}

return sprite;
});

/*\
 * mechanics
 * 
 * mechanical properties that all living objects should have
 * performance:
 *	- objects are being created on every call of `body`
\*/

define('LF/mechanics',['LF/global'],
function(Global){

var GC=Global.gameplay;

/*\
 * mech
 [ class ]
 * mech is a state-less helper class that processes most of the mechanics of living objects
\*/
function mech(parent)
{
	var spec=parent.match.spec;
	if( spec[parent.id] && spec[parent.id].mass!==undefined && spec[parent.id].mass!==null)
		this.mass=spec[parent.id].mass;
	else
		this.mass=Global.gameplay.default.machanics.mass;

	this.ps;
	this.sp=parent.sp;
	this.frame=parent.frame;
	this.parent=parent;
	this.vol_body={0:{},1:{},2:{},3:{},4:{},5:{},length:0,empty_data:{},max:6};
	this.bg=parent.bg;
	this.sha=parent.shadow;
}

//return the array of volume of the current frame, that volume can be bdy,itr or other
mech.prototype.body= function(obj,filter,offset)
{
	var ps=this.ps;
	var sp=this.sp;
	var off=offset;
	if(!obj)
		obj=this.frame.D.bdy;
	//if parent object is in `super` effect, returns no body volume
	if( obj===this.frame.D.bdy && this.parent.effect.super)
		return this.body_empty();
	//if meets certain criteria (as in most cases), will use optimized version
	if( obj===this.frame.D.bdy && !filter && (!(obj instanceof Array) || obj.length<=this.vol_body.max))
		return this.body_body(offset);

	if( obj instanceof Array)
	{ //many bdy
		if( !filter && obj.length === 2)
		{ //unroll the loop
			return ([this.volume(obj[0],off),
				this.volume(obj[1],off)
			]);
		}
		else if( !filter && obj.length === 3)
		{ //unroll the loop
			return ([this.volume(obj[0],off),
				this.volume(obj[1],off),
				this.volume(obj[2],off)
			]);
		}
		else
		{
			var B=[];
			for( var i in obj)
			{
				if( !filter || filter(obj[i]))
					B.push( this.volume(obj[i],off) );
			}
			return B;
		}
	}
	else
	{ //1 bdy only
		if( !filter || filter(obj))
			return [this.volume(obj,off)];
		else
			return [];
	}
}

//returns a pseudo array with zero element
mech.prototype.body_empty= function()
{
	this.vol_body.length = 0;
	return this.vol_body;
}

//a slightly optimized version, creating less new objects
mech.prototype.body_body= function(V)
{
	var O=this.frame.D.bdy;
	var ps=this.ps;
	var sp=this.sp;

	if( !O)
	{	//no bdy
		var B=this.vol_body[0];
		if(V)
		{
			B.x=V.x;
			B.y=V.y;
			B.z=V.z;
		}
		else
		{
			B.x=ps.sx;
			B.y=ps.sy;
			B.z=ps.sz;
		}
		B.vx=0;
		B.vy=0;
		B.w=0;
		B.h=0;
		B.zwidth=0;
		B.data=this.vol_body.empty_data;
		this.vol_body.length=1;
	}
	else if( O instanceof Array)
	{	//many bdy
		for( var i=0; i<O.length; i++)
		{
			var B=this.vol_body[i];
			var vx=O[i].x;
			if( ps.dir==='left')
				vx=sp.w-O[i].x-O[i].w;
			if(V)
			{
				B.x=ps.sx+V.x;
				B.y=ps.sy+V.y;
				B.z=ps.sz+V.z;
			}
			else
			{
				B.x=ps.sx;
				B.y=ps.sy;
				B.z=ps.sz;
			}
			B.vx=vx;
			B.vy=O[i].y;
			B.w=O[i].w;
			B.h=O[i].h;
			B.zwidth=O[i].zwidth? O[i].zwidth : GC.default.itr.zwidth;
			B.data=O[i];
		}
		this.vol_body.length=O.length;
	}
	else
	{	//1 bdy only
		var B=this.vol_body[0];
		var vx=O.x;
		if( ps.dir==='left')
			vx=sp.w-O.x-O.w;
		if(V)
		{
			B.x=ps.sx+V.x;
			B.y=ps.sy+V.y;
			B.z=ps.sz+V.z;
		}
		else
		{
			B.x=ps.sx;
			B.y=ps.sy;
			B.z=ps.sz;
		}
		B.vx=vx;
		B.vy=O.y;
		B.w=O.w;
		B.h=O.h;
		B.zwidth=O.zwidth? O.zwidth : GC.default.itr.zwidth;
		B.data=O;
		this.vol_body.length=1;
	}
	return this.vol_body;
}

/** make a `volume` that is compatible with `scene` query
	param O volume in data
	param V offset
 */
mech.prototype.volume= function(O,V)
{
	var ps=this.ps;
	var sp=this.sp;

	if( !O)
	{
		if( !V)
			return {
				x:ps.sx, y:ps.sy, z:ps.sz,
				vx:0, vy:0, w:0, h:0, zwidth:0,
				data: {}
			}
		else
			return {
				x:V.x, y:V.y, z:V.z,
				vx:0, vy:0, w:0, h:0, zwidth:0,
				data: {}
			}
	}

	var vx=O.x;
	if( ps.dir==='left')
		vx=sp.w-O.x-O.w;

	if( !V)
		return {
			x:ps.sx, y:ps.sy, z:ps.sz,
			vx: vx,
			vy: O.y,
			w : O.w,
			h : O.h,
			zwidth: O.zwidth? O.zwidth : GC.default.itr.zwidth,
			data: O
		}
	else
		return {
			x:ps.sx+V.x, y:ps.sy+V.y, z:ps.sz+V.z,
			vx: vx,
			vy: O.y,
			w : O.w,
			h : O.h,
			zwidth: O.zwidth? O.zwidth : GC.default.itr.zwidth,
			data: O
		}
}

mech.prototype.make_point= function(a,prefix)
{
	var ps=this.ps;
	var sp=this.sp;

	if( a && !prefix)
	{
		if( ps.dir==='right')
			return {x:ps.sx+a.x, y:ps.sy+a.y, z:ps.sz+a.y};
		else
			return {x:ps.sx+sp.w-a.x, y:ps.sy+a.y, z:ps.sz+a.y};
	}
	else if( a && prefix)
	{
		if( ps.dir==='right')
			return {x:ps.sx+a[prefix+'x'], y:ps.sy+a[prefix+'y'], z:ps.sz+a[prefix+'y']};
		else
			return {x:ps.sx+sp.w-a[prefix+'x'], y:ps.sy+a[prefix+'y'], z:ps.sz+a[prefix+'y']};
	}
	else
	{
		console.log('mechanics: make point failed');
		return {x:ps.sx, y:ps.sy, z:ps.sz};
	}
}

//move myself *along xz* to coincide point a with point b such that point b is a point of myself
mech.prototype.coincideXZ= function(a,b)
{
	var ps=this.ps;
	var sp=this.sp;
	var fD=this.frame.D;

	var vx=a.x-b.x;
	var vz=a.z-b.z;
	ps.x+=vx;
	ps.z+=vz;
	ps.sx = ps.dir==='right'? (ps.x-fD.centerx):(ps.x+fD.centerx-sp.w);
}

//move myself *along xy* to coincide point a with point b such that point b is a point of myself
mech.prototype.coincideXY= function(a,b)
{
	var ps=this.ps;
	var sp=this.sp;
	var fD=this.frame.D;

	var vx=a.x-b.x;
	var vy=a.y-b.y;
	ps.x+=vx;
	ps.y+=vy;
	ps.sx = ps.dir==='right'? (ps.x-fD.centerx):(ps.x+fD.centerx-sp.w);
	ps.sy = ps.y - fD.centery;
}

mech.prototype.create_metric= function()
{
	this.ps = {
		sx:0,sy:0,sz:0, //sprite origin, read-only
		x:0, y:0, z:0, //feet position as in centerx,centery
		vx:0,vy:0,vz:0, //velocity
		zz:0,  //z order deviation
		dir:'right',  //direction
		fric:1 //factor of friction
	}
	return this.ps;
}

mech.prototype.reset= function()
{
	var ps=this.ps;
	ps.sx=0; ps.sy=0; ps.sz=0;
	ps.x=0; ps.y=0; ps.z=0;
	ps.vx=0; ps.vy=0; ps.vz=0;
	ps.zz=0;
	ps.dir='right';
	ps.fric=1;
}

//place the feet position of the object at x,y,z
mech.prototype.set_pos= function(x,y,z)
{
	var ps=this.ps;
	var sp=this.sp;
	var fD=this.frame.D;

	ps.x=x; ps.y=y; ps.z=z;
	if( ps.z < this.bg.zboundary[0]) //z bounding
		ps.z = this.bg.zboundary[0];
	if( ps.z > this.bg.zboundary[1])
		ps.z = this.bg.zboundary[1];

	ps.sx = ps.dir==='right'? (ps.x-fD.centerx):(ps.x+fD.centerx-sp.w);
	ps.sy = y - fD.centery;
	ps.sz = z;
}

mech.prototype.dynamics= function()
{
	var ps=this.ps;
	var sp=this.sp;
	var fD=this.frame.D;
	var GC=Global.gameplay;

	if( !this.blocking_xz()) //blocked by obstacle
	{
		ps.x += ps.vx;
		ps.z += ps.vz;
	}
	if( this.floor_xbound)
	{
		if( ps.x<0)
			ps.x=0;
		if( ps.x>this.bg.width)
			ps.x=this.bg.width;
	}
	if( ps.z < this.bg.zboundary[0]) //z bounding
		ps.z = this.bg.zboundary[0];
	if( ps.z > this.bg.zboundary[1])
		ps.z = this.bg.zboundary[1];

	ps.y += ps.vy;

	ps.sx = ps.dir==='right'? (ps.x-fD.centerx):(ps.x+fD.centerx-sp.w);
	ps.sy = ps.y - fD.centery;
	ps.sz = ps.z;

	if( ps.y>0)
	{	//never below the ground
		ps.y=0;
		ps.sy = ps.y - fD.centery;
	}

	sp.set_x_y(Math.floor(ps.sx), Math.floor(ps.sy+ps.sz)); //projection onto screen
	sp.set_z(Math.floor(ps.sz+ps.zz)); //z ordering
	if( this.sha)
	{
		this.sha.set_x_y(Math.floor(ps.x-this.bg.shadow.x), Math.floor(ps.z-this.bg.shadow.y));
		this.sha.set_z(Math.floor(ps.sz-1));
	}

	if( ps.y===0) //only when on the ground
	{
		//simple friction
		if( ps.vx) ps.vx += (ps.vx>0?-1:1)*ps.fric;
		if( ps.vz) ps.vz += (ps.vz>0?-1:1)*ps.fric;
		if( ps.vx!==0 && ps.vx>-GC.min_speed && ps.vx<GC.min_speed) ps.vx=0; //defined minimum speed
		if( ps.vz!==0 && ps.vz>-GC.min_speed && ps.vz<GC.min_speed) ps.vz=0;
	}

	if( ps.y<0)
		ps.vy+= this.mass * GC.gravity;
}

mech.prototype.unit_friction=function()
{
	var ps=this.ps;
	if( ps.y===0) //only when on the ground
	{
		if( ps.vx) ps.vx += (ps.vx>0?-1:1);
		if( ps.vz) ps.vz += (ps.vz>0?-1:1);
	}
}

mech.prototype.linear_friction=function(x,z)
{
	var ps=this.ps;
	if( x && ps.vx) ps.vx += ps.vx>0 ? -x:x;
	if( z && ps.vz) ps.vz += ps.vz>0 ? -z:z;
}

//return true if there is a blocking itr:kind:14 ahead
mech.prototype.blocking_xz=function()
{
	var offset = {
		x: this.ps.vx,
		y: 0,
		z: this.ps.vz
	}

	var body = this.body(null,null,offset);
	for( var i=0; i<body.length; i++)
	{
		body[i].zwidth=0;
		var result = this.parent.scene.query( body[i], this.parent, {tag:'itr:14'});
		if( result.length > 0)
			return true;
	}
}

mech.prototype.project= function()
{
	var ps=this.ps;
	var sp=this.sp;
	sp.set_x_y(ps.sx, ps.sy+ps.sz); //projection onto screen
	sp.set_z(ps.sz+ps.zz);  //z ordering
}

mech.prototype.speed=function()
{
	var ps=this.ps;
	return Math.sqrt(ps.vx*ps.vx + ps.vy*ps.vy);
}

return mech;
});

/*\
 * AI.js
 * support AI scripting
\*/

define('LF/AI',['F.core/util'],
function(Futil)
{
	function AIin(self)
	{
		this.self = self;
	}
	AIin.prototype.facing=function()
	{
		var $=this.self;
		return $.ps.dir==='left';
	}
	AIin.prototype.type=function()
	{
		var $=this.self;
		switch ($.type)
		{
			case 'character':     return 0;
			case 'lightweapon':   return 1;
			case 'heavyweapon':   return 2;
			case 'specialattack': return 3;
			case 'baseball':      return 4;
			case 'criminal':      return 5;
			case 'drink':         return 6;
		}
	}
	AIin.prototype.weapon_type=function()
	{
		var $=this.self;
		if( $.hold.obj)
			switch ($.hold.obj.type)
			{
				case 'lightweapon':
					if( $.proper($.hold.obj.id,'stand_throw'))
						return 101;
					else
						return 1;
				break;
				case 'heavyweapon':
					return 2;
				break;
				case 'character':
					//I am being held
					return -1*$.AI.type();
				break;
			}
		return 0;
	}
	AIin.prototype.weapon_held=function()
	{
		var $=this.self;
		if( $.hold.obj)
			return $.hold.obj.uid;
		return -1;
	}
	AIin.prototype.weapon_holder=function()
	{
		var $=this.self;
		if( $.hold.obj)
		switch ($.AI.type())
		{
			case 1: case 2: case 4: case 6:
			return $.hold.obj.uid;
		}
	}
	AIin.prototype.clone=function()
	{
		return -1;
	}
	AIin.prototype.blink=function()
	{
		var $=this.self;
		if( $.effect.blink)
			return Math.round($.effect.timeout/2);
		return 0;
	}
	AIin.prototype.shake=function()
	{
		var $=this.self;
		if( $.effect.oscillate)
			return $.effect.timeout * ($.effect.dvx||$.effect.dvy?1:-1);
		return 0;
	}
	AIin.prototype.ctimer=function()
	{
		var $=this.self;
		if( $.catching && $.state()===9)
			return $.statemem.counter*6;
		return 0;
	}
	AIin.prototype.seqcheck=function(qe)
	{
		var $=this.self;
		if( $.combodec)
		{
			var seq = $.combodec.seq;
			if( seq.length<1 || qe.length<1) return 0;
			var k1 = seq[seq.length-1];
			if( k1===qe[0]) return 1;
			if( seq.length<2 || qe.length<2) return 0;
			var k2 = seq[seq.length-2];
			if( k2===qe[0] && k1===[1]) return 2;
			if( seq.length<3 || qe.length<3) return 0;
			var k3 = seq[seq.length-3];
			if( k3===qe[0] && k2===qe[1] && k1===qe[2]) return 3;
		}
		return 0;
	}
	AIin.prototype.rand=function(i)
	{
		var $=this.self;
		return Math.floor($.match.random()*i);
	}
	AIin.prototype.frame=function(N)
	{
		var $=this.self;
		var tags={'bdy':'make_array','itr':'make_array','wpoint':'object'};
		var O={};
		if( $.data.frame[N])
		for( var I in $.data.frame[N])
		{
			if( typeof $.data.frame[N][I]==='object')
			{
				if( tags[I]==='make_array')
				{
					var arr = Futil.make_array($.data.frame[N][I]);
					O[I+'_count'] = arr.length;
					O[I+'s'] = arr;
				}
				else if( tags[I]==='object')
				{
					O[I] = $.data.frame[N][I];
				}
			}
			else
				O[I] = $.data.frame[N][I];
		}
		else
		{
			for( var t in tags)
				if( tags[t]==='make_array')
					O[t+'_count'] = 0;
		}
		return O;
	}
	AIin.prototype.frame1=function(N)
	{
		return 0;
	}

	function AIcon()
	{
		this.state={};
		this.child=new Array();
		this.sync=true;
		this.buf=new Array();
	}
	AIcon.prototype.key=function(key,down)
	{
		if( this.sync)
		{
			this.buf.push([key,down]);
		}
		else
		{
			if( this.child)
				for(var J in this.child)
					this.child[J].key(key,down);
			this.state[I]=down;
		}
	}
	AIcon.prototype.keypress=function(key,x,y)
	{
		if( (x===undefined && y===undefined) ||
			(x===1 && y===0))
		{
			if( this.state[key])
				this.key(key,0);
			this.key(key,1);
			this.key(key,0);
		}
		else if(x===1 && y===1)
		{
			if( !this.state[key])
				this.key(key,1);
		}
		else if(x===0 && y===0)
		{
			if( this.state[key])
				this.key(key,0);
		}
	}
	AIcon.prototype.keyseq=function(seq)
	{
		for( var i=0; i<seq.length; i++)
			this.keypress(seq[i]);
	}
	AIcon.prototype.clear_states=function()
	{
		for(var I in this.state)
			this.state[I]=0;
	}
	AIcon.prototype.fetch=function()
	{
		for( var i=0; i<this.buf.length; i++)
		{
			var I=this.buf[i][0];
			var down=this.buf[i][1];
			if( this.child)
				for(var j=0; j<this.child.length; j++)
					this.child[j].key(I,down);
			this.state[I]=down;
		}
		this.buf.length=0;
	}
	AIcon.prototype.flush=function()
	{
		this.buf.length=0;
	}
	AIcon.prototype.type = 'AIcontroller';

	return {
		interface:AIin,
		controller:AIcon
	};
});

/*\
 * livingobject
 * 
 * a base class for all living objects
\*/
define('LF/livingobject',['LF/global','LF/sprite','LF/mechanics','LF/AI','LF/util','F.core/sprite','F.core/util'],
function ( Global, Sprite, Mech, AI, util, Fsprite, Futil)
{
	var GC=Global.gameplay;

	/*\
	 * livingobject
	 [ class ]
	 | config=
	 | {
	 | match,
	 | controller, (characters only)
	 | team
	 | }
	\*/
	function livingobject(config,data,thisID)
	{
		if( !config)
			return;

		var $=this;

		//identity
		$.name=data.bmp.name;
		$.uid=-1; //unique id, set by scene
		$.id=thisID; //character id, specify tactical behavior. accept values from 0~99
		$.data=data;
		$.team=config.team;
		$.statemem = {}; //state memory, will be cleared on every state transition

		//handles
		$.match=config.match;
		$.scene=$.match.scene;
		$.visualeffect=$.match.visualeffect;
		$.bg=$.match.background;

		//states
		$.sp = new Sprite(data.bmp, $.match.stage);
		if( !$.proper('no_shadow'))
		{
			var sp_sha=
			{
				canvas: $.match.stage,
				wh: 'fit',
				img: $.bg.shadow.img
			}
			$.shadow = new Fsprite(sp_sha);
		}
		$.health=
		{
			hp: 100,
			mp: 100
		};
		$.frame=
		{
			PN: 0, //previous frame number
			N: 0, //current frame number
			D: data.frame[0], //current frame's data object
			ani: //animation sequence
			{
				i:0, up:true
			}
		};
		$.mech = new Mech($);
		$.AI = new AI.interface($);
		$.ps = $.mech.create_metric(); //position, velocity, and other physical properties
		$.trans = new frame_transistor($);
		$.itr=
		{
			arest: 0, //attack rest - time until the attacker can do a single hit again
			vrest:[], //victim rest - time until a character can be hit again
		};
		$.effect=
		{
			num: -99, //effect number
			dvx: 0, dvy: 0,
			stuck: false, //when an object is said to be 'stuck', there is not state and frame update
			oscillate: 0, //if oscillate is non-zero, will oscillate for amplitude equals value of oscillate
			blink: false, //blink: hide 2 TU, show 2 TU ,,, until effect vanishs
			super: false, //when an object is in state 'super', it does not return body volume, such that it cannot be hit
			timein: 0, //time to take effect
			timeout: 0 //time to lose effect
		};
		$.catching= 0; //state 9: the object being caught by me now
					//OR state 10: the object catching me now
		$.allow_switch_dir=true; //direction switcher
	}
	livingobject.prototype.type='livingobject';
	//livingobject.prototype.states = null; //the collection of states forming a state machine
	//livingobject.prototype.states_switch_dir = null; //whether to allow switch dir in each state

	livingobject.prototype.destroy = function()
	{
		this.sp.destroy();
		this.shadow.remove();
	}

	livingobject.prototype.log = function(mes)
	{
		this.match.log(mes);
	}

	//setup for a match
	livingobject.prototype.setup = function()
	{
		var $=this;
		$.state_update('setup');
	}

	//update done at every frame
	livingobject.prototype.frame_update = function()
	{
		var $=this;
		//show frame
		$.sp.show_pic($.frame.D.pic);

		$.ps.fric=1; //reset friction

		if( !$.state_update('frame_force'))
			$.frame_force();

		//wait for next frame
		$.trans.set_wait($.frame.D.wait,99);
		$.trans.set_next($.frame.D.next,99);

		//state generic then specific update
		$.state_update('frame');
	}

	livingobject.prototype.frame_force = function()
	{
		var $=this;
		if( $.frame.D.dvx)
		{
			var avx = $.ps.vx>0?$.ps.vx:-$.ps.vx;
			if( $.ps.y<0 || avx < $.frame.D.dvx) //accelerate..
				$.ps.vx = $.dirh() * $.frame.D.dvx; //..is okay
			//decelerate must be gradual
			if( $.frame.D.dvx<0)
				$.ps.vx = $.ps.vx - $.dirh();
		}
		if( $.frame.D.dvz) $.ps.vz = $.dirv() * $.frame.D.dvz;
		if( $.frame.D.dvy) $.ps.vy += $.frame.D.dvy;
	}

	//update done at every TU (30fps)
	livingobject.prototype.TU_update = function()
	{
		var $=this;

		if( !$.state_update('TU_force'))
			$.frame_force();

		//effect
		if( $.effect.timein<0)
		{
			if( $.effect.oscillate)
			{
				if( $.effect.oi===1)
					$.effect.oi=-1;
				else
					$.effect.oi=1;
				$.sp.set_x_y($.ps.sx + $.effect.oscillate*$.effect.oi, $.ps.sy+$.ps.sz);
			}
			else if( $.effect.blink)
			{
				if( $.effect.bi===undefined)
					$.effect.bi = 0;
				switch ($.effect.bi%4)
				{
					case 0: case 1:
						$.sp.hide();
					break;
					case 2: case 3:
						$.sp.show();
					break;
				}
				$.effect.bi++;
			}
			if( $.effect.timeout===0)
			{
				$.effect.num = -99;
				if( $.effect.stuck)
				{
					$.effect.stuck = false;
				}
				if( $.effect.oscillate)
				{
					$.effect.oscillate = 0;
					$.sp.set_x_y($.ps.sx, $.ps.sy+$.ps.sz);
				}
				if( $.effect.blink)
				{
					$.effect.blink = false;
					$.effect.bi = undefined;
					$.sp.show();
				}
				if( $.effect.super)
				{
					$.effect.super = false;
				}
			}
			else if( $.effect.timeout===-1)
			{
				if( $.effect.dvx) $.ps.vx = $.effect.dvx;
				if( $.effect.dvy) $.ps.vy = $.effect.dvy;
				$.effect.dvx=0;
				$.effect.dvy=0;
			}
			$.effect.timeout--;
		}

		if( $.effect.timein<0 && $.effect.stuck)
			; //stuck
		else
			$.state_update('TU');

		for( var I in $.itr.vrest)
		{	//watch out that itr.vrest might grow very big
			if( $.itr.vrest[I] > 0)
				$.itr.vrest[I]--;
		}
		if( $.itr.arest > 0)
			$.itr.arest--;
	}

	livingobject.prototype.state_update=function(event)
	{
		var $=this;
		var tar1=$.states['generic'];
		if( tar1) var res1=tar1.apply($,arguments);
		//
		var tar2=$.states[$.frame.D.state];
		if( tar2) var res2=tar2.apply($,arguments);
		//
		return res1 || res2;
	}

	livingobject.prototype.TU=function()
	{
		var $=this;
		//state
		$.TU_update();
		//combo detector
		if( $.con)
			$.combodec.frame();
	}

	livingobject.prototype.transit=function()
	{
		var $=this;
		//fetch inputs
		if( $.con)
		{
			//$.con.fetch(); //match is responsible for fetching
			$.combo_update();
		}
		//frame transition
		if( $.effect.timein<0 && $.effect.stuck)
			; //stuck!
		else
			$.trans.trans();
		$.effect.timein--;
		if( $.effect.timein<0 && $.effect.stuck)
			; //stuck!
		else
			$.state_update('transit');
	}

	livingobject.prototype.set_pos=function(x,y,z)
	{
		this.mech.set_pos(x,y,z);
	}

	//return the body volume for collision detection
	//  all other volumes e.g. itr should start with prefix vol_
	livingobject.prototype.vol_body=function() 
	{
		return this.mech.body();
	}

	livingobject.prototype.state=function()
	{
		return this.frame.D.state;
	}

	livingobject.prototype.effect_id=function(num)
	{
		return num+GC.effect.num_to_id;
	}

	livingobject.prototype.effect_create=function(num,duration,dvx,dvy)
	{
		var $=this;
		if( num >= $.effect.num)
		{
			var efid= num+GC.effect.num_to_id;
			if( $.proper(efid,'oscillate'))
				$.effect.oscillate=$.proper(efid,'oscillate');
			if( $.proper(efid,'cant_move'))
				$.effect.stuck=true;
			if( dvx!==undefined)
				$.effect.dvx = dvx;
			if( dvy!==undefined)
				$.effect.dvy = dvy;
			if( $.effect.num>=0)
			{	//only allow extension of effect
				if( 0 < $.effect.timein)
					$.effect.timein=0;
				if( duration > $.effect.timeout)
					$.effect.timeout=duration;
			}
			else
			{
				$.effect.timein=0;
				$.effect.timeout=duration;
			}
			$.effect.num = num;
		}
	}

	livingobject.prototype.effect_stuck=function(timein,timeout)
	{
		var $=this;
		if( !$.effect.stuck || $.effect.num<=-1)
		{
			$.effect.num=-1; //magic number
			$.effect.stuck=true;
			$.effect.timein=timein;
			$.effect.timeout=timeout;
		}
	}

	livingobject.prototype.visualeffect_create=function(num, rect, righttip, variant)
	{
		var $=this;
		var efid= num+GC.effect.num_to_id;
		var pos=
		{
			x: rect.x+ rect.vx+ (righttip?rect.w:0),
			y: rect.y+ rect.vy+ rect.h/2,
			z: rect.z>$.ps.z ? rect.z:$.ps.z
		}
		$.visualeffect.create(pos,efid,variant);
	}

	//animate back and forth between frame a and b
	livingobject.prototype.frame_ani_oscillate=function(a,b)
	{
		var $=this;
		var $f=$.frame;
		if( $f.ani.i<a || $f.ani.i>b)
		{
			$f.ani.up=true;
			$f.ani.i=a+1;
		}
		if( $f.ani.i<b && $f.ani.up)
			$.trans.set_next($f.ani.i++);
		else if( $f.ani.i>a && !$f.ani.up)
			$.trans.set_next($f.ani.i--);
		if( $f.ani.i==b) $f.ani.up=false;
		if( $f.ani.i==a) $f.ani.up=true;
	}

	livingobject.prototype.frame_ani_sequence=function(a,b)
	{
		var $=this;
		var $f=$.frame;
		if( $f.ani.i<a || $f.ani.i>b)
		{
			$f.ani.i=a+1;
		}
		trans.set_next($f.ani.i++);
		if( $f.ani.i > b)
			$f.ani.i=a;
	}

	livingobject.prototype.itr_arest_test=function()
	{
		var $=this;
		return !$.itr.arest;
	}
	livingobject.prototype.itr_arest_update=function(ITR)
	{
		var $=this;
		if( ITR && ITR.arest)
			$.itr.arest = ITR.arest;
		else
			$.itr.arest = GC.default.character.arest;
	}
	livingobject.prototype.itr_vrest_test=function(uid)
	{
		var $=this;
		return !$.itr.vrest[uid];
	}
	livingobject.prototype.itr_vrest_update=function(attacker_uid,ITR)
	{
		var $=this;
		if( ITR && ITR.vrest)
			$.itr.vrest[attacker_uid] = ITR.vrest;
	}

	livingobject.prototype.switch_dir = function(e)
	{
		var $=this;
		if( $.ps.dir==='left' && e==='right')
		{
			$.ps.dir='right';
			$.sp.switch_lr('right');
		}
		else if( $.ps.dir==='right' && e==='left')
		{
			$.ps.dir='left';
			$.sp.switch_lr('left');
		}
	}

	livingobject.prototype.dirh = function()
	{
		var $=this;
		return ($.ps.dir==='left'?-1:1);
	}

	livingobject.prototype.dirv = function()
	{
		var $=this;
		var d=0;
		if( $.con)
		{
			if( $.con.state.up)   d-=1;
			if( $.con.state.down) d+=1;
		}
		return d;
	}

	livingobject.prototype.proper = function(id,prop)
	{
		var $=this;
		if( arguments.length===1)
		{
			prop=id;
			id=$.id;
		}
		if( $.match.spec[id])
			return $.match.spec[id][prop];
		return undefined;
	}

	function frame_transistor($)
	{
		/*DC*/
		var wait=1; //when wait decreases to zero, a frame transition happens
		var next=999; //next frame
		var lock=0;
		var lockout=1; //when lockout equals 0, the lock will be reset automatically
		//frame transitions are caused differently: going to the next frame, a combo is pressed, being hit, or being burnt
		//  and they can all happen *at the same TU*, to determine which frame to go to,
		//  each cause is given an authority which is used to resolve frame transition conflicts.
		//  lock=0 means unlocked
		//  common authority values:
		//0-9: natural
		//     0: natural
		// 10: move,defend,jump,punch,catching,caught
		// 11: special moves
		// 15: environmental interactions
		// 2x: interactions
		//    20: being punch
		//    25: hit by special attack
		// 3x: strong interactions
		//    30: in effect type 0
		//    35: fire, ice, blast

		this.frame=function(F,au)
		{
			this.set_next(F,au);
			this.set_wait(0,au);
		}

		this.set_wait=function(value,au,out)
		{
			if(!au) au=0; //authority
			if( au===99) au=lock; //au=99 means always has just enough authority
			if(!out) out=1; //lock timeout
			if( au >= lock)
			{
				lock=au;
				lockout=out;
				if( out===99) //out=99 means lock until frame transition
					lockout=wait;
				wait=value;
				if( wait<0) wait=0;
			}
		}

		this.inc_wait=function(inc,au,out) //increase wait by inc amount
		{
			if(!au) au=0;
			if( au===99) au=lock;
			if(!out) out=1;
			if( au >= lock)
			{
				lock=au;
				lockout=out;
				if( out===99)
					lockout=wait;
				wait+=inc;
				if( wait<0) wait=0;
			}
		}

		this.next=function()
		{
			return next;
		}
		this.wait=function()
		{
			return wait;
		}

		this.set_next=function(value,au,out)
		{
			if(!au) au=0;
			if( au===99) au=lock;
			if(!out) out=1;
			if( au >= lock)
			{
				lock=au;
				lockout=out;
				if( out===99)
					lockout=wait;
				next=value;
			}
		}

		this.reset_lock=function(au)
		{
			if(!au) au=0;
			if( au===99) au=lock;
			if( au >= lock)
			{
				lock=0;
			}
		}

		this.next_frame_D=function()
		{
			var anext = next;
			if( anext===999)
				anext=0;
			return $.data.frame[anext];
		}

		this.trans=function()
		{
			var oldlock=lock;
			lockout--;
			if( lockout===0)
				lock=0; //reset transition lock

			if( wait===0)
			{
				if( next===0)
				{
					//do nothing
				}
				else
				{
					if( next===1000)
					{
						$.match.destroy_object($);
						return;
					}

					if( next===999)
						next=0;
					$.frame.PN=$.frame.N;
					$.frame.N=next;
					$.state_update('frame_exit');

					//state transition
					var is_trans = $.frame.D.state !== $.data.frame[next].state;
					if( is_trans)
						$.state_update('state_exit');

					$.frame.D=$.data.frame[next];

					if( is_trans)
					{
						$.statemem = {};
						var old_switch_dir=$.allow_switch_dir;
						if( $.states_switch_dir && $.states_switch_dir[$.frame.D.state] !== undefined)
							$.allow_switch_dir=$.states_switch_dir[$.frame.D.state];
						else
							$.allow_switch_dir=false;

						$.state_update('state_entry');

						if( $.allow_switch_dir && !old_switch_dir)
						{
							if( $.con)
							{
								if($.con.state.left) $.switch_dir('left');
								if($.con.state.right) $.switch_dir('right');
							}
						}
					}

					$.frame_update();

					if( oldlock===10 || oldlock===11) //combo triggered action
						if( wait>0)
							wait-=1;
				}
			}
			else
				wait--;
		}
	} // frame_transistor

	return livingobject;
});

/*\
 * combo detector
 * - listen key events and detect combo from a controller
 * - maintains a clean sequence of pressed keys and fire events when combo is detected
 * - LF2, KOF style combos
 * - eliminating auto-repeated keys
\*/

define('F.core/combodec',[], function(){

/*\
 * combodec
 [ class ]
 - controller (object) a reference to @controller
 - config (object)
 - combo (array) combo definition
|	var con_config=
|	{
|		up:'h',down:'n',left:'b',right:'m',def:'v',jump:'f',att:'d'
|		//,'control name':'control key',,,
|	}
|	var con = new controller(con_config);
|	var dec_config=
|	{
|		timeout: 30,  //[optional] time before clearing the sequence buffer in terms of frames
|		comboout: 15, //[optional] the max time interval between keys to make a combo,
|			//an interrupt is inserted when comboout expires
|		clear_on_combo: true, //[optional] if true, will clear the sequence buffer when a combo occur
|		callback: dec_callback, //callback function when combo detected
|		rp: {up:1,down:1,left:2,right:2,def:3,jump:1,att:5}
|			//[optional] max repeat count of each key, unlimited if not stated
|	};
|	var combo = [
|	{
|		name: 'blast',	//combo name
|		seq:  ['def','right','att'], //array of key sequence
|		maxtime: 10 //[optional] the max allowed time difference between the first and last key input
|		clear_on_combo: false, //[optional] override generic config
|	} //,,,
|	];
|	var dec = new combodec ( con, dec_config, combo);
|	function dec_callback(combo)
|	{
|		alert(combo);
|	}
 * [example](../sample/combo.html)
 # <iframe src="../sample/combo.html" width="800" height="500"></iframe>
\*/
function combodec (controller, config, combo)
{
	/*\
	 * combodec.time
	 - (number) current time
	 [ property ]
	\*/
	this.time=1;
	/*\
	 * combodec.timeout
	 - (number) when to clear the sequence buffer
	 [ property ]
	\*/
	this.timeout=0;
	/*\
	 * combodec.comboout
	 - (number) when to interrupt the current combo
	 [ property ]
	\*/
	this.comboout=0;
	/*\
	 * combodec.con
	 - (object) parent controller
	 [ property ]
	\*/
	this.con=controller;
	/*\
	 * combodec.seq
	 - (array) the key input sequence. note that combodec logs key names rather than key stroke,
	 * i.e. `up`,`down` rather than `w`,`s`
	 - (object) each is `{k:key,t:time}`
	 * 
	 * will be cleared regularly as defined by `config.timeout` or `config.clear_on_combo`
	 [ property ]
	\*/
	this.seq=new Array();
	/*\
	 * combodec.config
	 - (object)
	 [ property ]
	\*/
	this.config=config;
	/*\
	 * combodec.combo
	 - (array) combo list
	 [ property ]
	\*/
	this.combo=combo;
	this.con.child.push(this);
}

/*\
 * combodec.key
 * supply keys to combodec
 [ method ]
 - k (string) key name
 - down (boolean)
 * note that it receives key name, i.e. `up`,`down` rather than `w`,`s`
\*/
combodec.prototype.key=function(K, down)
{
	if(!down)
		return;

	var seq=this.seq;

	var push=true;
	if( this.config.rp)
	{	//detect repeated keys
		for (var i=seq.length-1, cc=1; i>=0 && seq[i]==K; i--,cc++)
			if( cc>=this.config.rp[K])
				push=false;
	}

	//eliminate repeated key strokes by browser; discard keys that are already pressed down
	if( this.con.state[K])
		push=false;
	//  remarks: opera linux has a strange behavior that repeating keys **do** fire keyup events

	if( this.config.timeout)
		this.timeout=this.time+this.config.timeout;
	if( this.config.comboout)
		this.comboout=this.time+this.config.comboout;

	if( push)
		seq.push({k:K,t:this.time});

	if ( this.combo && push)
	{	//detect combo
		var C = this.combo;
		for (var i in C)
		{
			var detected=true;
			var j=seq.length-C[i].seq.length;
			if( j<0) detected=false;
			else for (var k=0; j<seq.length; j++,k++)
			{
				if( C[i].seq[k] !== seq[j].k ||
					(C[i].maxtime && seq[seq.length-1].t-seq[j].t>C[i].maxtime))
				{
					detected=false;
					break;
				}
			}
			if( detected)
			{
				this.config.callback(C[i]);
				if( C[i].clear_on_combo || (C[i].clear_on_combo!==false && this.config.clear_on_combo))
					this.clear_seq();
			}
		}
	}
}

/*\
 * combodec.clear_seq
 * clear the key sequence
 [ method ]
 * normally you would not need to call this manually
\*/
combodec.prototype.clear_seq=function()
{
	this.seq.length=0;
	this.timeout=this.time-1;
	this.comboout=this.time-1;
}

/*\
 * combodec.frame
 * a tick of time
 [ method ]
\*/
combodec.prototype.frame=function()
{
	if( this.time===this.timeout)
		this.clear_seq();
	if( this.time===this.comboout)
		this.seq.push({k:'_',t:this.time});
	this.time++;
}

return combodec;
});

/**	a LF2 character
 */

define('LF/character',['LF/livingobject','LF/global','F.core/combodec','F.core/util','LF/util'],
function(livingobject, Global, Fcombodec, Futil, util)
{
	var GC=Global.gameplay;

	var states=
	{
		'generic':function(event,K)
		{	var $=this;
			switch (event) {
			case 'frame':
				$.opoint();
			break;
			case 'TU':
				if( $.state_update('post_interaction'))
					; //do nothing
				else
					$.post_interaction();

				var ps=$.ps;
				if( ps.y===0 && ps.vy>0) //fell onto ground
				{
					var result = $.state_update('fell_onto_ground');
					if( result)
						$.trans.frame(result, 15);
					else
					{
						//console.log(ps.vx, util.lookup_abs(GC.friction.fell,ps.vx));
						ps.vy=0; //set to zero
						$.mech.linear_friction(
							util.lookup_abs(GC.friction.fell,ps.vx),
							util.lookup_abs(GC.friction.fell,ps.vz)
						);
					}
				}
				else if( ps.y+ps.vy>=0 && ps.vy>0) //predict falling onto the ground
				{
					var result = $.state_update('fall_onto_ground');
					if( result)
						$.trans.frame(result, 15);
					else
					{
						if( $.frame.N===212) //jumping
							$.trans.frame(215, 15); //crouch
						else
							$.trans.frame(219, 15); //crouch2
					}
				}

				//health reduce
				if( $.frame.D.mp)
				{
					if( $.data.frame[$.frame.PN].next===$.frame.N)
					{	//if this frame is transited by next of previous frame
						if( $.frame.D.mp<0)
						{
							$.health.mp += $.frame.D.mp;
							if( $.health.mp<0)
							{
								$.health.mp = 0;
								$.trans.frame($.frame.D.hit_d);
							}
						}
					}
					else
					{
						var dmp = $.frame.D.mp%1000,
							dhp = Math.floor($.frame.D.mp/1000)*10;
						$.health.mp -= dmp;
						$.health.hp -= dhp;
					}
				}
				//health recover
				//http://lf2.wikia.com/wiki/Health_and_mana
				if( $.match.time.t%12===0)
				if( $.health.hp < $.health.hp_bound)
				{
					$.health.hp++;
				}
				if( $.match.time.t%3===0)
				if( $.health.mp < $.health.mp_full)
				{
					$.health.mp+= 1+Math.floor((500-($.health.hp<500?$.health.hp:500))/100);
				}
				//recovery
				if( $.health.fall>0) $.health.fall += GC.recover.fall;
				if( $.health.bdefend>0) $.health.bdefend += GC.recover.bdefend;
				//combo buffer
				$.combo_buffer.timeout--;
				if( $.combo_buffer.timeout===0)
				{
					switch ($.combo_buffer.combo)
					{
						case 'def': case 'jump': case 'jump-att': case 'att': case 'run':
							$.combo_buffer.combo = null;
						break;
						//other combo is not cleared
					}
				}
			break;
			case 'transit':
				//dynamics: position, friction, gravity
				$.mech.dynamics(); //any further change in position will not be updated on screen until next TU
				$.wpoint(); //my holding weapon following my change
			break;
			case 'combo':
				switch(K)
				{
				case 'left': case 'right':
				case 'run':
				break;
				default:
					//here is where D>A, D>J... etc handled
					var tag = Global.combo_tag[K];
					if( tag && $.frame.D[tag])
					{
						if( !$.id_update('generic_combo',K,tag))
						{
							$.trans.frame($.frame.D[tag], 11);
							return 1;
						}
					}
				}
			break;
			case 'post_combo': //after state specific processing
				$.pre_interaction();
			break;
			case 'state_exit':
				switch ($.combo_buffer.combo)
				{
					case 'att': case 'run':
						//cannot transfer across states
						$.combo_buffer.combo = null;
					break;
					case 'jump-att': //jump-attack becomes attack across state transition
						$.combo_buffer.combo = 'att';
					break;
				}
			break;
		}},

		//state specific processing to different events

		'0':function(event,K) //standing
		{	var $=this;
			switch (event) {

			case 'frame':
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
					$.trans.frame(12);
			break;

			case 'combo':
				switch(K)
				{
				case 'left': case 'right': case 'up': case 'down':
				case 'jump': case null:
					var dx = $.con.state.left !== $.con.state.right,
						dz = $.con.state.up   !== $.con.state.down;
					if( dx || dz)
					{
						//apply movement
						if( $.hold.obj && $.hold.obj.type==='heavyweapon')
						{
							if( dx) $.ps.vx=$.dirh()*($.data.bmp.heavy_walking_speed);
							$.ps.vz=$.dirv()*($.data.bmp.heavy_walking_speedz);
						}
						else
						{
							if( K!=='jump') //walk
								$.trans.frame(5); //TODO: select randomly from 5,6,7,8
							if( dx) $.ps.vx=$.dirh()*($.data.bmp.walking_speed);
							$.ps.vz=$.dirv()*($.data.bmp.walking_speedz);
						}
					}
				break;
				}
				switch(K)
				{
				case 'run':
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
						$.trans.frame(16, 10);
					else
						$.trans.frame(9, 10);
				return 1;
				case 'def':
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
						return 1;
					$.trans.frame(110, 10);
				return 1;
				case 'jump':
				case 'jump-att':
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
					{
						if( !$.proper('heavy_weapon_jump'))
							return 1;
						else
						{
							$.trans.frame($.proper('heavy_weapon_jump'), 10);
							return 1;
						}
					}
					$.trans.frame(210, 10);
				return 1;
				case 'att':
					if( $.hold.obj)
					{
						var dx = $.con.state.left !== $.con.state.right;
						if( $.hold.obj.type==='heavyweapon')
						{
							$.trans.frame(50, 10); //throw heavy weapon
							return 1;
						}
						else if( $.proper($.hold.obj.id,'just_throw'))
						{
							$.trans.frame(45, 10); //throw light weapon
							return 1;
						}
						else if ( dx && $.proper($.hold.obj.id,'stand_throw'))
						{
							$.trans.frame(45, 10); //throw weapon
							return 1;
						}
						else if( $.proper($.hold.obj.id,'attackable')) //light weapon attack
						{
							$.trans.frame($.match.random()<0.5? 20:25, 10);
							return 1;
						}
					}
					//
					var vol=$.mech.volume(Futil.make_array($.data.frame[72].itr)[0]); //super punch, frame 72
					var hit= $.scene.query(vol, $, {tag:'itr:6', not_team:$.team});
					for( var t in hit)
					{	//if someone is in my hitting scoope who has itr kind:6
						$.trans.frame(70, 10); //I 'll use super punch!
						return 1;
					}
					//
					$.trans.frame($.match.random()<0.5? 60:65, 10);
				return 1;
				}
			break;
		}},

		'1':function(event,K) //walking
		{	var $=this;

			var dx=0,dz=0;
			if($.con.state.left)  dx-=1;
			if($.con.state.right) dx+=1;
			if($.con.state.up)    dz-=1;
			if($.con.state.down)  dz+=1;
			switch (event) {

			case 'frame':
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
				{
					if( dx || dz)
						$.frame_ani_oscillate(12,15);
					else
						$.trans.set_next($.frame.N);
				}
				else
				{
					$.frame_ani_oscillate(5,8);
				}
				$.trans.set_wait($.data.bmp.walking_frame_rate-1);
			break;

			case 'TU':
				//apply movement
				var xfactor = 1-($.dirv()?1:0)*(2/7); //reduce x speed if moving diagonally
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
				{
					if( dx) $.ps.vx=xfactor*$.dirh()*($.data.bmp.heavy_walking_speed);
					$.ps.vz=$.dirv()*($.data.bmp.heavy_walking_speedz);
				}
				else
				{
					if( dx) $.ps.vx=xfactor*$.dirh()*($.data.bmp.walking_speed);
					$.ps.vz=$.dirv()*($.data.bmp.walking_speedz);
					if( !dx && !dz && !$.statemem.transed)
					{
						$.statemem.transed=true;
						$.trans.set_next(999); //go back to standing
						$.trans.set_wait(1,1,2);
					}
				}
			break;

			case 'state_entry':
				$.trans.set_wait(0);
			break;

			case 'combo':
				if( dx!==0 && dx!==$.dirh())
					$.switch_dir($.ps.dir==='right'?'left':'right'); //toogle dir
				if( !dx && !dz && !$.statemem.released)
				{
					$.statemem.released=true;
					$.mech.unit_friction();
				}
				//walking same as standing, except null combo
				if( K) return $.states['0'].call($,event,K);
			break;
		}},

		'2':function(event,K) //running, heavy_obj_run
		{	var $=this;
			switch (event) {

			case 'frame':
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
					$.frame_ani_oscillate(16,18);
				else
					$.frame_ani_oscillate(9,11);
				$.trans.set_wait($.data.bmp.running_frame_rate);
			//no break here

			case 'TU':
				//to maintain the velocity against friction
				var xfactor = 1-($.dirv()?1:0)*(1/7); //reduce x speed if moving diagonally
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
				{
					$.ps.vx= xfactor * $.dirh() * $.data.bmp.heavy_running_speed;
					$.ps.vz= $.dirv() * $.data.bmp.heavy_running_speedz;
				}
				else
				{
					$.ps.vx= xfactor * $.dirh() * $.data.bmp.running_speed;
					$.ps.vz= $.dirv() * $.data.bmp.running_speedz;
				}
			break;

			case 'combo':
				switch(K)
				{
				case 'left': case 'right':
					if(K!=$.ps.dir)
					{
						if( $.hold.obj && $.hold.obj.type==='heavyweapon')
							$.trans.frame(19, 10);
						else
							$.trans.frame(218, 10);
						return 1;
					}
				break;

				case 'def':
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
						return 1;
					$.trans.frame(102, 10);
				return 1;

				case 'jump':
				case 'jump-att':
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
					{
						if( !$.proper('heavy_weapon_dash'))
							return 1;
						else
						{
							$.trans.frame($.proper('heavy_weapon_dash'), 10);
							return 1;
						}
					}
					$.trans.frame(213, 10);
					if( K==='jump-att')
						return 0; //keep the combo
				return 1;

				case 'att':
					if( $.hold.obj)
					{
						if( $.hold.obj.type==='heavyweapon')
						{
							$.trans.frame(50, 10); //throw heavy weapon
							return 1;
						}
						else
						{
							var dx = $.con.state.left !== $.con.state.right;
							if( dx && $.proper($.hold.obj.id,'run_throw'))
							{
								$.trans.frame(45, 10); //throw light weapon
								return 1;
							}
							else if( $.proper($.hold.obj.id,'attackable'))
							{
								$.trans.frame(35, 10); //light weapon attack
								return 1;
							}
						}
					}
					$.trans.frame(85, 10);
				return 1;
				}
			break;
		}},

		'3':function(event,K) //punch, jump_attack, run_attack, ...
		{	var $=this;
			switch (event) {
			case 'frame':
				if( $.frame.D.next===999 && $.ps.y<0)
					$.trans.set_next(212); //back to jump

				$.id_update('state3_frame');
			break;
			case 'hit_stop':
			return $.id_update('state3_hit_stop');
			case 'frame_force':
			return $.id_update('state3_frame_force');
		}},

		'4':function(event,K) //jump
		{	var $=this;
			switch (event) {

			case 'frame':
				$.statemem.frameTU=true;
				if( $.frame.PN===80 || $.frame.PN===81) //after jump attack
					$.statemem.attlock=2;
			break;

			case 'TU':
				if( $.statemem.frameTU)
				{	$.statemem.frameTU=false;
					if( $.frame.N===212 && $.frame.PN===211)
					{	//start jumping
						var dx=0;
						if($.con.state.left)  dx-=1;
						if($.con.state.right) dx+=1;
						$.ps.vx= dx * ($.data.bmp.jump_distance-1);
						$.ps.vz= $.dirv() * ($.data.bmp.jump_distancez-1);
						$.ps.vy= $.data.bmp.jump_height; //upward force
					}
				}
				if( $.statemem.attlock)
					$.statemem.attlock--;
			break;

			case 'combo':
				if( (K==='att' || $.con.state.att) && !$.statemem.attlock)
				{
					// a transition to jump_attack can only happen after entering frame 212
					if( $.frame.N===212)
					{
						if( $.hold.obj)
						{
							var dx = $.con.state.left !== $.con.state.right;
							if( dx && $.proper($.hold.obj.id,'jump_throw'))
								$.trans.frame(52, 10); //sky light weapon throw
							else if( $.proper($.hold.obj.id,'attackable'))
								$.trans.frame(30, 10); //light weapon attack
						}
						else
							$.trans.frame(80, 10); //jump attack
						if( K==='att')
							return 1; //key consumed
					}
				}
			break;
		}},

		'5':function(event,K) //dash
		{	var $=this;
			switch (event) {
			case 'state_entry':
				$.ps.vx= $.dirh() * ($.data.bmp.dash_distance-1) * ($.frame.N===213?1:-1);
				$.ps.vz= $.dirv() * ($.data.bmp.dash_distancez-1);
				$.ps.vy= $.data.bmp.dash_height;
			break;

			case 'combo':
				if( K==='att' || $.con.state.att)
				{
					if( $.proper('dash_backattack') || //back attack
						$.dirh()===($.ps.vx>0?1:-1)) //if not turning back
					{
						if( $.hold.obj && $.proper($.hold.obj.id,'attackable')) //light weapon attack
							$.trans.frame(40, 10);
						else
							$.trans.frame(90, 10);
						$.allow_switch_dir=false;
						if( K==='att')
							return 1;
					}
				}
				if( K==='left' || K==='right')
				{
					if( K!=$.ps.dir)
					{
						if( $.dirh()==($.ps.vx>0?1:-1))
						{	//turn back
							if( $.frame.N===213) $.trans.frame(214, 0);
							if( $.frame.N===216) $.trans.frame(217, 0);
							$.switch_dir(K);
						}
						else
						{	//turn to front
							if( $.frame.N===214) $.trans.frame(213, 0);
							if( $.frame.N===217) $.trans.frame(216, 0);
							$.switch_dir(K);
						}
						return 1;
					}
				}
			break;
		}},

		'6':function(event,K) //rowing
		{	var $=this;
			switch (event) {
			case 'TU':
				if( $.frame.N===100 || $.frame.N===108)
				{
					$.ps.vy = 0;
				}
			break;
			
			case 'frame':
				if( $.frame.N===100 || $.frame.N===108)
				{
					$.trans.set_wait(1);
				}
			break;
			
			case 'fall_onto_ground':
				if( $.frame.N===101 || $.frame.N===109)
					return 215;
			break;
		}},

		'7':function(event,K) //defending
		{	var $=this;
			switch (event) {
			case 'frame':
				if( $.frame.N===111)
					$.trans.inc_wait(4);
			break;
		}},

		'8':function(event,K) //broken defend
		{	var $=this;
			switch (event) {
			case 'frame_force':
			case 'TU_force':
				//nasty fix: to compensate that frame_force is applied with respecting to facing direction
				if( $.frame.D.dvx)
				{
					if( ($.ps.vx>0?1:-1) !== $.dirh())
					{
						var avx = $.ps.vx>0?$.ps.vx:-$.ps.vx;
						var dirx = 2*($.ps.vx>0?1:-1);
						if( $.ps.y<0 || avx < $.frame.D.dvx)
							$.ps.vx = dirx * $.frame.D.dvx;
						if( $.frame.D.dvx<0)
							$.ps.vx = $.ps.vx - dirx;
					}
				}
			break;
		}},

		'9':function(event,K) //catching, throw lying man
		{	var $=this;
			switch (event) {
			case 'state_entry':
				$.statemem.stateTU=true;
				$.statemem.counter=43;
				$.statemem.attacks=0;
			break;

			case 'state_exit':
				$.catching=null;
				$.ps.zz=0;
			break;

			case 'frame':
				switch ($.frame.N)
				{
					case 123: //a successful attack
					$.statemem.attacks++;
					$.statemem.counter+=3;
					$.trans.inc_wait(1);
					break;
					case 233: case 234:
					$.trans.inc_wait(-1);
					break;
				}
				if( $.frame.N===234)
					return;
				$.catching.caught_b(
						$.mech.make_point($.frame.D.cpoint),
						$.frame.D.cpoint,
						$.ps.dir
					);
			break;

			case 'TU':
			if( $.caught_cpointkind()===1 &&
				$.catching.caught_cpointkind()===2 )
			{	//really catching you
				if( $.statemem.stateTU)
				{	$.statemem.stateTU=false;
					/**the immediate `TU` after `state`. the reason for this is a synchronization issue,
						i.e. it must be waited until both catcher and catchee transited to the second frame
						and it is not known at the point of `frame` event, due to different scheduling.
					 */

					//injury
					if( $.frame.D.cpoint.injury)
					{
						$.catching.hit( $.frame.D.cpoint, $, {x:$.ps.x,y:$.ps.y,z:$.ps.z}, null);
						$.trans.inc_wait(1, 10, 99); //lock until frame transition
					}
					//cover
					var cover = GC.default.cpoint.cover;
					if( $.frame.D.cpoint.cover!==undefined) cover=$.frame.D.cpoint.cover;
					if( cover===0 || cover===10 )
						$.ps.zz=1;
					else
						$.ps.zz=-1;

					if( $.frame.D.cpoint.dircontrol===1)
					{
						if($.con.state.left) $.switch_dir('left');
						if($.con.state.right) $.switch_dir('right');
					}
				}
			}
			break; //TU
			
			case 'post_combo':
				$.statemem.counter--;
				if( $.statemem.counter<=0)
				if( !($.frame.N===122 && $.statemem.attacks===4)) //let it finish the 5th punch
				if( $.frame.N===121 || $.frame.N===122)
				{
					$.catching.caught_release();
					$.trans.frame(999,15);
				}
			break;

			case 'combo':
			switch(K)
			{
				case 'att':
					if( $.frame.N===121)
					{
						var dx = $.con.state.left !== $.con.state.right;
						var dy = $.con.state.up   !== $.con.state.down;
						if( (dx || dy) && $.frame.D.cpoint.taction)
						{
							var tac = $.frame.D.cpoint.taction;
							if( tac<0)
							{	//turn myself around
								$.switch_dir($.ps.dir==='right'?'left':'right'); //toogle dir
								$.trans.frame(-tac, 10);
							}
							else
							{
								$.trans.frame(tac, 10);
							}
							var nextframe=$.data.frame[$.trans.next()];
							$.catching.caught_throw( nextframe.cpoint, $.dirv());
							$.statemem.counter+=10;
						}
						else if($.frame.D.cpoint.aaction)
							$.trans.frame($.frame.D.cpoint.aaction, 10);
						else
							$.trans.frame(122, 10);
					}
				return 1; //always return true so that `att` is not re-fired next frame
				case 'jump':
				case 'jump-att':
					if( $.frame.N===121)
					if($.frame.D.cpoint.jaction)
					{
						$.trans.frame($.frame.D.cpoint.jaction, 10);
						return 1;
					}
				break;
			}
			break;
		}},

		'10':function(event,K) //being caught
		{	var $=this;
			switch (event) {

			case 'state_exit':
				$.catching=null;
				$.caught_b_holdpoint=null;
				$.caught_b_cpoint=null;
				$.caught_b_adir=null;
				$.caught_throwz=null;
			break;

			case 'frame':
				$.statemem.frameTU=true;
				$.trans.set_wait(99, 10, 99); //lock until frame transition
			break;

			case 'TU':
				if( $.frame.N===135) //to be lifted against gravity
				{
					$.ps.vy=0;
				}
				
				if( $.caught_cpointkind()===2 &&
				$.catching && $.catching.caught_cpointkind()===1 )
				{	//really being caught
					if( $.statemem.frameTU)
					{	$.statemem.frameTU=false; //the immediate `TU` after `frame`

						var holdpoint=$.caught_b_holdpoint;
						var cpoint=$.caught_b_cpoint;
						var adir=$.caught_b_adir;

						if( cpoint.vaction)
							$.trans.frame(cpoint.vaction, 20);

						if( cpoint.throwvz !== GC.unspecified)
						{	//I am being thrown!
							var dvx=cpoint.throwvx, dvy=cpoint.throwvy, dvz=cpoint.throwvz;
							if( dvx !==0) $.ps.vx = (adir==='right'?1:-1)* dvx;
							if( dvy !==0) $.ps.vy = dvy;
							if( dvz !==0) $.ps.vz = dvz * $.caught_throwz;

							//impulse
							$.mech.set_pos(
								$.ps.x + $.ps.vx*2.5,
								$.ps.y + $.ps.vy*2,
								$.ps.z + $.ps.vz );
						}
						else
						{
							if( cpoint.dircontrol===undefined)
							{
								if( cpoint.cover && cpoint.cover>=10)
									$.switch_dir(adir); //follow dir of catcher
								else //default cpoint cover
									$.switch_dir(adir==='left'?'right':'left'); //face the catcher

								$.mech.coincideXZ(holdpoint,$.mech.make_point($.frame.D.cpoint));
							}
							else
							{
								$.mech.coincideXY(holdpoint,$.mech.make_point($.frame.D.cpoint));
							}
						}
					}
				}
				else
				{
					if( $.catching)
						$.trans.frame(212, 10);
				}
			break;
		}},

		'11':function(event,K) //injured
		{	var $=this;
			switch (event) {
			case 'state_entry':
				$.trans.inc_wait(0, 20); //set lock only
			break;
			case 'frame':
				switch($.frame.N)
				{
					case 221: case 223: case 225:
						$.trans.set_next(999);
					break;
					case 220: case 222: case 224: case 226:
						//$.trans.inc_wait(0, 20, 99); //lock until frame transition
					break;
				}
			break;
		}},

		'12':function(event,K) //falling
		{	var $=this;
			switch (event) {
			case 'frame':
				if( $.effect.dvy <= 0)
				switch ($.frame.N)
				{
					case 180:
						$.trans.set_next(181);
						$.trans.set_wait(util.lookup_abs(GC.fall.wait180,$.effect.dvy));
						break;
					case 181:
						//console.log('y:'+$.ps.y+', vy:'+$.ps.vy+', vx:'+$.ps.vx);
						$.trans.set_next(182);
						var vy = $.ps.vy>0?$.ps.vy:-$.ps.vy;
							 if( 0<=vy && vy<=4)
							$.trans.set_wait(2);
						else if( 4<vy && vy<7)
							$.trans.set_wait(3);
						else if( 7<=vy)
							$.trans.set_wait(4);
						break;
					case 182:
						$.trans.set_next(183);
						break;
					//
					case 186:
						$.trans.set_next(187);
						break;
					case 187:
						$.trans.set_next(188);
						break;
					case 188:
						$.trans.set_next(189);
						break;
				}
				else
				switch ($.frame.N)
				{
					case 180:
						$.trans.set_next(185);
						$.trans.set_wait(1);
						break;
					case 186:
						$.trans.set_next(191);
						break;
				}
			break;

			case 'fell_onto_ground':
			case 'fall_onto_ground':
				if( $.caught_throwinjury>0)
				{
					$.injury(-$.caught_throwinjury);
					$.caught_throwinjury = null;
				}
				var ps=$.ps;
				//console.log('speed:'+$.mech.speed()+', vx:'+ps.vx+', vy:'+ps.vy);
				if( $.mech.speed() > GC.character.bounceup.limit.xy ||
					ps.vy > GC.character.bounceup.limit.y)
				{
					$.mech.linear_friction(
						util.lookup_abs(GC.character.bounceup.absorb,ps.vx),
						util.lookup_abs(GC.character.bounceup.absorb,ps.vz)
					);
					ps.vy = -GC.character.bounceup.y;
					if( 180 <= $.frame.N && $.frame.N <= 185)
						return 185;
					if( 186 <= $.frame.N && $.frame.N <= 191)
						return 191;
				}
				else
				{
					if( 180 <= $.frame.N && $.frame.N <= 185)
						return 230; //next frame
					if( 186 <= $.frame.N && $.frame.N <= 191)
						return 231;
				}
			break;
			
			case 'combo':
				if( $.frame.N===182 ||
					$.frame.N===188)
				{
					if( K==='jump')
					{
						if( $.frame.N===182)
							$.trans.frame(100);
						else
							$.trans.frame(108);
						if( $.ps.vx)
							$.ps.vx = 5*($.ps.vx>0?1:-1); //magic number
						if( $.ps.vz)
							$.ps.vz = 2*($.ps.vz>0?1:-1); //magic number
						return 1;
					}
				}
			return 1; //always return true so that `jump` is not re-fired next frame
		}},

		'14':function(event,K) //lying
		{	var $=this;
			switch (event) {
			case 'state_entry':
				$.health.fall=0;
				$.health.bdefend=0;
			break;
			case 'state_exit':
				$.effect.timein=0;
				$.effect.timeout=30;
				$.effect.blink=true;
				$.effect.super=true;
			break;
		}},

		'15':function(event,K) //stop_running, crouch, crouch2, dash_attack, light_weapon_thw, heavy_weapon_thw, heavy_stop_run, sky_lgt_wp_thw
		{	var $=this;
			switch (event) {

			case 'frame':
				switch( $.frame.N)
				{
				case 19: //heavy_stop_run
					if( $.hold.obj && $.hold.obj.type==='heavyweapon')
						$.trans.set_next(12);
				break;
				case 215:
					$.trans.inc_wait(-1);
				break;
				case 219: //crouch
					if( !$.id_update('state15_crouch'))
					switch( $.frame.PN) //previous frame number
					{
					case 105: //after rowing
						$.mech.unit_friction();
					break;
					case 216: //after dash
					case 90: case 91: case 92: //dash attack
						$.trans.inc_wait(-1);
					break;
					}
				break;
				case 54: //sky_lgt_wp_thw
					if( $.frame.D.next===999 && $.ps.y<0)
						$.trans.set_next(212); //back to jump
				break;
				}
			break;

			case 'combo':
				if( $.frame.N===215) //only after jumping
				{
					if( K==='def')
					{
						$.trans.frame(102, 10);
						return 1;
					}
					if( K==='jump')
					{
						var dx=0;
						if($.con.state.left)  dx-=1;
						if($.con.state.right) dx+=1;
						if( dx)
						{
							$.trans.frame(213, 10);
							$.switch_dir(dx===1?'right':'left');
						}
						else if( $.ps.vx===0)
						{
							$.trans.inc_wait(2, 10, 99); //lock until frame transition
							$.trans.set_next(210, 10);
						}
						else if( ($.ps.vx>0?1:-1)===$.dirh())
						{
							$.trans.frame(213, 10);
						}
						else
						{
							$.trans.frame(214, 10);
						}
						return 1;
					}
				}
			break;
		}},

		'16':function(event,K) //injured 2 (dance of pain)
		{	var $=this;
			switch (event) {
		}},

		'301':function(event,K) //deep specific
		{	var $=this;
			switch (event) {
			case 'frame_force':
				if( $.frame.N!==290)
					return 1; //disable pre update of force
			break;
			case 'TU':
				$.ps.vz=$.dirv()*($.data.bmp.walking_speedz);
			break;
			case 'hit_stop':
				$.effect_stuck(1,2); //not stuck immediately but next frame (timein=1)
				$.trans.inc_wait(1);
			return 1;
		}},

		'x':function(event,K)
		{	var $=this;
			switch (event) {
		}}
	};

	var idupdates = //nasty fix (es)
	{
		'default':function()
		{
		},
		'1': function(event,K,tag) //deep
		{
			var $=this;
			switch (event)
			{
			case 'state3_frame':
				switch ($.frame.N)
				{
				case 267:
					$.ps.vy+=1;
				return 1;
				}
			break;
			case 'state15_crouch':
				if( $.frame.PN>=267 && $.frame.PN<=272)
					$.trans.inc_wait(-1);
			break;
			case 'generic_combo':
				if( tag==='hit_Fj')
				{
					if( K==='D>J' || K==='D>AJ')
						$.switch_dir('right');
					else
						$.switch_dir('left');
				}
			break;
			}
		},
		'11': function(event) //davis
		{
			var $=this;
			switch (event)
			{
			case 'state3_hit_stop':
				switch ($.frame.N)
				{
					//to fix many_punch
					case 271: case 276: case 280:
						$.effect_stuck(1,2); //not stuck immediately but next frame (timein=1)
						$.trans.inc_wait(1);
					return 1;
					case 273:
						$.effect_stuck(0,2);
					return 1;
				}
			break;
			case 'state3_frame_force':
				switch ($.frame.N)
				{
					//to fix many_punch
					case 275: case 278: case 279:
						return 1; //disable pre update of force
				}
			break;
			}
		}
	};

	var states_switch_dir= //whether to allow switch dir in each state
	{
		'0': true,
		'1': true,
		'2': false,
		'3': false,
		'4': true,
		'5': false,
		'6': false,
		'7': true,
		'8': false,
		'9': false,
		'10':false,
		'11':false,
		'12':false,
		'13':true,
		'14':false,
		'15':false,
		'16':false
	};

	//inherit livingobject
	function character(config,data,thisID)
	{
		/*(function ()
		{	//a small benchmark for make_array efficiency,
			//for deep and davis,
			//>>time to make_array of 1105 frames:15; x=33720
			//>>time to make_array of 1070 frames:15; x=29960
			var sta=new Date();
			var ccc=0;
			var x=0;
			var tags={'itr':'itr','bdy':'bdy'};
			for( var m=0; m<5; m++)
			for( var j in data.frame)
			{
				ccc++;
				for( var l in tags)
				{
					var obj = Futil.make_array(data.frame[j][l]);
					for( var k=0; k<obj.length; k++)
						x+=obj[k].x;
				}
			}
			var fin=new Date();
			console.log('time to make_array of '+ccc+' frames of '+data.bmp.name+':'+(fin-sta)+'; x='+x);
		}());*/

		var $=this;
		// chain constructor
		livingobject.call(this,config,data,thisID);
		if( typeof idupdates[$.id]==='function')
			$.id_update=idupdates[$.id];
		else
			$.id_update=idupdates['default'];
		$.mech.floor_xbound = true;
		$.con = config.controller;
		$.combo_buffer=
		{
			combo:null,
			timeout:0
		};
		if( $.con)
		{
			function combo_event(kobj)
			{
				var K=kobj.name;
				switch (K)
				{
					case 'left': case 'right':
						if( $.allow_switch_dir)
							$.switch_dir(K);
				}
				$.combo_buffer.combo = K;
				$.combo_buffer.timeout = 10;
			}
			var dec_con = //combo detector
			{
				clear_on_combo: true,
				callback: combo_event //callback function when combo detected
			}
			var combo_list = [
				{ name:'left',	seq:['left'],	clear_on_combo:false},
				{ name:'right',	seq:['right'],	clear_on_combo:false},
				{ name:'up',	seq:['up'],		clear_on_combo:false},
				{ name:'down',	seq:['down'],	clear_on_combo:false},
				{ name:'def',	seq:['def'],	clear_on_combo:false},
				{ name:'jump',	seq:['jump'],	clear_on_combo:false},
				{ name:'att',	seq:['att'],	clear_on_combo:false},
				{ name:'run',	seq:['right','right'],	maxtime:9},
				{ name:'run',	seq:['left','left'],	maxtime:9},
				{ name:'jump-att',seq:['jump','att'],	maxtime:0, clear_on_combo:false}
				//plus those defined in Global.combo_list
			];
			$.combodec = new Fcombodec($.con, dec_con, combo_list.concat(Global.combo_list));
		}
		$.hold=
		{
			obj: null, //holding weapon
		};
		$.health.bdefend=0;
		$.health.fall=0;
		$.health.hp=$.health.hp_full=$.health.hp_bound= $.proper('hp') || GC.default.health.hp_full;
		$.health.mp_full= GC.default.health.mp_full;
		$.health.mp= GC.default.health.mp_start;
		$.trans.frame=function(next,au)
		{
			if( next===0 || next===999)
			{
				this.set_next(next,au);
				this.set_wait(0,au);
				return;
			}
			var nextF = $.data.frame[next];
			if( !nextF) return;
			//check if mp is enough
			var dmp=0;
			if( nextF.mp>0)
				dmp=nextF.mp%1000;
			if( $.health.mp-dmp>=0)
			{
				this.set_next(next,au);
				this.set_wait(0,au);
			}
		}
		$.setup();
	}
	character.prototype = new livingobject();
	character.prototype.constructor = character;
	character.prototype.type = 'character';
	character.prototype.states = states;
	character.prototype.states_switch_dir = states_switch_dir;
	
	character.prototype.destroy = function()
	{
		var $=this;
		livingobject.prototype.destroy.call(this);
		//(handled by manager.js) remove combo listener to controller
	}
	
	//to emit a combo event
	character.prototype.combo_update = function()
	{		
		/**	different from `state_update`, current state receive the combo event first,
			and only if it returned falsy result, the combo event is passed to the generic state.
			if the combo event is not consumed, it is stored in state memory,
			resulting in 1 combo event being emited every frame until it is being handled or
			overridden by a new combo event.
			a combo event is emitted even when there is no combo, in such case `K=null`
		 */
		var $=this;
		var K = $.combo_buffer.combo;
		if(!K) K=null;

		var tar1=$.states[$.frame.D.state];
		if( tar1) var res1=tar1.call($,'combo',K);
		var tar2=$.states['generic'];
		if(!res1)
		if( tar2) var res2=tar2.call($,'combo',K);
		if( tar1) tar1.call($,'post_combo');
		if( tar2) tar2.call($,'post_combo');
		if( res1 || res2 || //do not store if returned true
			K==='left' || K==='right' || K==='up' || K==='down') //dir combos are not persistent
			$.combo_buffer.combo = null;
	}

	/** @protocol caller hits callee
		@param ITR the itr object in data
		@param att reference of attacker
		@param attps position of attacker
		@param rect the hit rectangle where visual effects should appear
	 */
	character.prototype.hit=function(ITR, att, attps, rect)
	{
		var $=this;
		if( $.itr.vrest[att.uid])
			return false;

		var accepthit=false;
		var ef_dvx=0, ef_dvy=0, dhp=0;
		if( $.state()===10) //being caught
		{
			if( $.catching.caught_cpointhurtable())
			{
				accepthit=true;
				fall();
			}
			if( $.catching.caught_cpointhurtable()===0 && $.catching!==att)
			{	//I am unhurtable as defined by catcher,
				//and I am hit by attacker other than catcher
			}
			else
			{
				accepthit=true;
				dhp -= Math.abs(ITR.injury);
				if( ITR.injury>0)
				{
					$.effect_create(0, GC.effect.duration);
					var tar;
					if( ITR.vaction)
						tar=ITR.vaction;
					else
						tar=(attps.x > $.ps.x)===($.ps.dir==='right') ? $.frame.D.cpoint.fronthurtact : $.frame.D.cpoint.backhurtact;
					$.trans.frame(tar, 20);
				}
			}
		}
		else if( $.state()===14)
		{
			//lying
		}
		else
		{
			//kind 0 ITR
			accepthit=true;
			var compen = $.ps.y===0? 1:0; //magic compensation
			ef_dvx = ITR.dvx ? att.dirh()*(ITR.dvx-compen):0;
			ef_dvy = ITR.dvy ? ITR.dvy:0;
			var effectnum = ITR.effect!==undefined?ITR.effect:GC.default.effect.num;

			if( $.state()===7 &&
			    (attps.x > $.ps.x)===($.ps.dir==='right')) //attacked in front
			{
				if( ITR.injury)	dhp -= GC.defend.injury.factor * ITR.injury;
				if( ITR.bdefend) $.health.bdefend += ITR.bdefend;
				if( $.health.bdefend > GC.defend.break_limit)
				{	//broken defence
					$.trans.frame(112, 20);
				}
				else
				{	//an effective defence
					$.trans.frame(111, 20);
				}
				if( ef_dvx) ef_dvx += (ef_dvx>0?-1:1) * util.lookup_abs(GC.defend.absorb,ef_dvx);
				ef_dvy = 0;
			}
			else
			{
				if( $.hold.obj && $.hold.obj.type==='heavyweapon')
					$.drop_weapon(0,0);
				if( ITR.injury)	dhp -= ITR.injury; //injury
				$.health.bdefend = 45; //lose defend ability immediately
				fall();
			}

			//effect
			var vanish = GC.effect.duration-1;
			switch( $.trans.next())
			{
				case 111: vanish=3; break;
				case 112: vanish=4; break;
			}
			$.effect_create( effectnum, vanish, ef_dvx, ef_dvy);
			$.visualeffect_create( effectnum, rect, (attps.x < $.ps.x), ($.health.fall>0?1:2));
		}
		function fall()
		{
			if( ITR.fall!==undefined)
				$.health.fall += ITR.fall;
			else
				$.health.fall += GC.default.fall.value;
			var fall=$.health.fall;
			if ($.ps.y<0 || $.ps.vy<0)
				falldown();
			else if ( 0<fall && fall<=20)
				$.trans.frame(220, 20);
			else if (20<fall && fall<=30)
				$.trans.frame(222, 20);
			else if (30<fall && fall<=40)
				$.trans.frame(224, 20);
			else if (40<fall && fall<=60)
				$.trans.frame(226, 20);
			else if (GC.fall.KO<fall)
				falldown();
		}
		function falldown()
		{
			if( ITR.dvy===undefined) ef_dvy = GC.default.fall.dvy;
			$.health.fall=0;
			$.ps.vy=0;
			var front = (attps.x > $.ps.x)===($.ps.dir==='right'); //attacked in front
				 if( front && ITR.dvx < 0 && ITR.bdefend>=60)
				$.trans.frame(186, 20);
			else if( front)
				$.trans.frame(180, 20);
			else if(!front)
				$.trans.frame(186, 20);

			if( $.proper( $.effect_id(effectnum),'drop_weapon'))
				$.drop_weapon(ef_dvx, ef_dvy);
		}

		if( dhp<0)
			$.injury(dhp);
		if( accepthit)
		{
			if( ITR && ITR.vrest)
				$.itr.vrest[att.uid] = ITR.vrest;
		}
		return accepthit;
	}
	character.prototype.injury=function(dhp)
	{
		this.health.hp+=dhp;
		this.health.hp_bound+=Math.ceil(dhp*1/3);
	}

	//pre interaction is based on `itr` of next frame
	character.prototype.pre_interaction=function()
	{
		var $=this;
		var ITR_LIST=Futil.make_array($.trans.next_frame_D().itr);

		for( var i in ITR_LIST)
		{
			var ITR=ITR_LIST[i]; //the itr tag in data
			//first check for what I have got into intersect with
			var vol=$.mech.volume(ITR);
			vol.zwidth = 0;
			var hit= $.scene.query(vol, $, {tag:'body'});

			switch (ITR.kind)
			{
			case 1: //catch
			case 3: //super catch
				for( var t in hit)
				{
					if( hit[t].team !== $.team) //only catch other teams
					if( hit[t].type==='character') //only catch characters
					if( (ITR.kind===1 && hit[t].state()===16) //you are in dance of pain
					 || (ITR.kind===3)) //super catch
					if( !$.itr.arest)
					{
						var dir = hit[t].caught_a(ITR,$,{x:$.ps.x,y:$.ps.y,z:$.ps.z});
						if( dir)
						{
							$.itr_arest_update(ITR);
							if( dir==='front')
								$.trans.frame(ITR.catchingact[0], 10);
							else
								$.trans.frame(ITR.catchingact[1], 10);
							$.catching=hit[t];
							break;
						}
					}
				}
			break;

			case 7: //pick weapon easy
				if( !$.con.state.att)
					break; //only if att key is down
			case 2: //pick weapon
				if( !$.hold.obj)
				for( var t in hit)
				{
					if(!(ITR.kind===7 && hit[t].type==='heavyweapon')) //kind 7 cannot pick up heavy weapon
					if( hit[t].type==='lightweapon' || hit[t].type==='heavyweapon')
					if( hit[t].pick($))
					{
						$.itr_arest_update(ITR);
						if( ITR.kind===2)
						{
							if( hit[t].type==='lightweapon')
								$.trans.frame(115, 10);
							else if( hit[t].type==='heavyweapon')
								$.trans.frame(116, 10);
						}
						$.hold.obj = hit[t];
						break;
					}
				}
			break;
			}
		}
	}

	//post interaction is based on `itr` of current frame
	character.prototype.post_interaction=function()
	{
		var $=this;
		var ITR_LIST=Futil.make_array($.frame.D.itr);

		//TODO
		/*某葉: 基本上會以先填入的itr為優先， 但在範圍重複、同effect的情況下的2組itr，
			攻擊時，會隨機指定其中一個itr的效果。
			（在範圍有部份重複或是完全重複的部份才有隨機效果。）*/

		for( var i in ITR_LIST)
		{
			var ITR=ITR_LIST[i]; //the itr tag in data
			//first check for what I have got into intersect with
			var vol=$.mech.volume(ITR);
			vol.zwidth = 0;
			var hit= $.scene.query(vol, $, {tag:'body'});

			switch (ITR.kind)
			{
			case 0: //normal attack
				for( var t in hit)
				{
					if( !(hit[t].type==='character' && hit[t].team===$.team)) //cannot attack characters of same team
					if( !(hit[t].type!=='character' && hit[t].team===$.team && hit[t].ps.dir===$.ps.dir)) //can only attack objects of same team if head on collide
					if( ITR.effect===undefined || ITR.effect===0 || ITR.effect===1 ||
						(ITR.effect===4 && hit[t].type==='specialattack' && hit[t].state()===3000))
					if( !$.itr.arest)
					if( hit[t].hit(ITR,$,{x:$.ps.x,y:$.ps.y,z:$.ps.z},vol))
					{	//hit you!
						$.itr_arest_update(ITR);
						//$.log('hit:'+ITR.fall);
						//stalls
						if( $.state_update('hit_stop'))
							; //do nothing
						else
							switch ($.frame.N)
							{
								case 86: case 87:
									$.effect_stuck(0,2);
									$.trans.inc_wait(1);
									break;
								case 91:
									$.effect_stuck(0,2);
									$.trans.inc_wait(1);
									break;
								default:
									$.effect_stuck(0,GC.default.itr.hit_stop);
							}

						//attack one enemy only
						if( ITR.arest) break;
					}
				}
			break;
			}
		}
	}

	character.prototype.wpoint=function()
	{
		var $=this;
		if( $.hold.obj)
		if( $.frame.D.wpoint)
		{
			if( $.frame.D.wpoint.kind===1)
			{
				var act = $.hold.obj.act($, $.frame.D.wpoint, $.mech.make_point($.frame.D.wpoint));
				if( act.thrown)
				{
					$.hold.obj=null;
				}
				if( act.hit!==null && act.hit!==undefined)
				{
					$.itr_arest_update(act);
					//stalls
					$.trans.inc_wait(GC.default.itr.hit_stop, 10);
				}
			}
			else if( $.frame.D.wpoint.kind===3)
			{
				$.drop_weapon();
			}
		}
	}

	character.prototype.opoint=function()
	{
		var $=this;
		if( $.frame.D.opoint)
		{
			$.match.create_object($.frame.D.opoint, $);
		}
	}

	character.prototype.drop_weapon=function(dvx,dvy)
	{
		var $=this;
		if( $.hold.obj)
		{
			$.hold.obj.drop(dvx,dvy);
			$.hold.obj=null;
		}
	}

	character.prototype.vol_itr=function(kind)
	{
		var $=this;
		if( $.frame.D.itr)
			return $.mech.body(
				$.frame.D.itr, //make volume from itr
				function (obj) //filter
				{
					return obj.kind==kind; //use type conversion comparison
				}
			);
		else
			return [];
	}

	/** inter-living objects protocol: catch & throw
		for details see http://f-lf2.blogspot.hk/2013/01/inter-living-object-interactions.html
	 */
	character.prototype.caught_a=function(ITR, att, attps)
	{	//this is called when the catcher has an ITR with kind: 1
		var $=this;
		if( $.state()===16) //I am in dance of pain
		{
			if( (attps.x > $.ps.x)===($.ps.dir==='right'))
				$.trans.frame(ITR.caughtact[0], 20);
			else
				$.trans.frame(ITR.caughtact[1], 20);
			$.health.fall=0;
			$.catching=att;
			$.drop_weapon();
			return (attps.x > $.ps.x)===($.ps.dir==='right') ? 'front':'back';
		}
	}
	character.prototype.caught_b=function(holdpoint,cpoint,adir)
	{	//this is called when the catcher has a cpoint with kind: 1
		var $=this;
		$.caught_b_holdpoint=holdpoint;
		$.caught_b_cpoint=cpoint;
		$.caught_b_adir=adir;
		//store this info and process it at TU
	}
	character.prototype.caught_cpointkind=function()
	{
		var $=this;
		return $.frame.D.cpoint ? $.frame.D.cpoint.kind:0;
	}
	character.prototype.caught_cpointhurtable=function()
	{
		var $=this;
		if( $.frame.D.cpoint && $.frame.D.cpoint.hurtable!==undefined)
			return $.frame.D.cpoint.hurtable;
		else
			return GC.default.cpoint.hurtable;
	}
	character.prototype.caught_throw=function(cpoint,throwz)
	{	//I am being thrown
		var $=this;
		if( cpoint.vaction!==undefined)
			$.trans.frame(cpoint.vaction, 20);
		else
			$.trans.frame(GC.default.cpoint.vaction, 20);
		$.caught_throwinjury=cpoint.throwinjury;
		if( $.caught_throwinjury===GC.unspecified)
			$.caught_throwinjury = GC.default.itr.throw_injury;
		$.caught_throwz=throwz;
	}
	character.prototype.caught_release=function()
	{
		var $=this;
		$.catching=0;
		$.trans.frame(181,20);
		$.effect.dvx=3; //magic number
		$.effect.dvy=-3;
		$.effect.timein=-1;
		$.effect.timeout=0;
	}

	return character;
});

/*\
 * weapon
 * 
 * generalization over light and heavy weapons
\*/

define('LF/weapon',['LF/livingobject','LF/global','F.core/util'],
function(livingobject, Global, Futil)
{
var GC=Global.gameplay;

/*\
 * weapon
 [ class ]
 * note that this is a template class
 | var lightweapon = weapon('lightweapon');
 | var heavyweapon = weapon('heavyweapon');
\*/
function weapon(type)
{
	var states=
	{
		'generic':function(event,K)
		{	var $=this;
			switch (event) {

			case 'TU':

				$.interaction();

				switch( $.state())
				{
					case 1001:
					case 2001:
						//I am passive! so I dont need to care states of myself
					break;

					default:
						//dynamics: position, friction, gravity
						$.mech.dynamics();
					break;
				}

				var ps=$.ps;
				if( ps.y===0 && ps.vy>0) //fell onto ground
				{
					if( this.mech.speed() > GC.weapon.bounceup.limit)
					{	//bounceup
						if( $.light)
						{
							ps.vy = 0;
							$.trans.frame(70);
						}
						if( $.heavy)
							ps.vy = GC.weapon.bounceup.speed.y;
						if( ps.vx) ps.vx = (ps.vx>0?1:-1)*GC.weapon.bounceup.speed.x;
						if( ps.vz) ps.vz = (ps.vz>0?1:-1)*GC.weapon.bounceup.speed.z;
					}
					else
					{
						$.team=0;
						ps.vy=0; //set to zero
						if( $.light)
							$.trans.frame(70); //just_on_ground
						if( $.heavy)
							$.trans.frame(21); //just_on_ground
						$.health.hp -= $.data.bmp.weapon_drop_hurt;
					}
					ps.zz=0;
				}
			break;
		}},

		'1004':function(event,K) //light
		{	var $=this;
			switch (event) {

			case 'frame':
				if( $.frame.N===64) //on ground
					$.team=0; //loses team
			break;
		}},

		'2000':function(event,K) //heavy
		{	var $=this;
			switch (event) {

			case 'frame':
				if( $.frame.N === 21) //just_on_ground
					$.trans.set_next(20);
			break;
		}},

		'2004':function(event,K) //heavy
		{	var $=this;
			switch (event) {

			case 'frame':
				if( $.frame.N === 20) //on_ground
					$.team=0;
			break;
		}}
	};

	//inherit livingobject
	function typeweapon(config,data,thisID)
	{
		var $=this;
		// chain constructor
		livingobject.call(this,config,data,thisID);
		for( var i=0; i<$.sp.ani.length; i++)
		{	//fix border issue
			$.sp.ani[i].config.borderleft=1;
			$.sp.ani[i].config.bordertop=0;
			$.sp.ani[i].config.borderright=2;
			$.sp.ani[i].config.borderbottom=2;
		}
		$.hold=
		{
			obj: null //character who hold me
		};
		$.setup();
	}
	typeweapon.prototype = new livingobject();
	typeweapon.prototype.constructor = typeweapon;
	typeweapon.prototype.light = type==='lightweapon';
	typeweapon.prototype.heavy = type==='heavyweapon';
	typeweapon.prototype.type = type;
	typeweapon.prototype.states = states;

	typeweapon.prototype.interaction=function()
	{
		var $=this;
		var ITR=Futil.make_array($.frame.D.itr);

		if( $.team!==0)
		if(($.heavy) ||
		   ($.light && $.state()===1002))
		for( var j in ITR)
		{	//for each itr tag
			if( ITR[j].kind===0) //kind 0
			{
				var vol=$.mech.volume(ITR[j]);
				vol.zwidth = 0;
				var hit= $.scene.query(vol, $, {tag:'body', not_team:$.team});
				for( var k in hit)
				{	//for each being hit
					var itr_rest;
					if( ITR[j].arest!==undefined || ITR[j].vrest!==undefined)
						itr_rest=ITR[j];
					else
						itr_rest=GC.default.weapon;
					//if( itr_rest.arest) itr_rest.arest+=20; //what is this line for?
					//
					/*console.log('I='+$.uid+', he='+hit[k].uid+
						', arest='+itr_rest.arest+
						', vrest='+itr_rest.vrest+
						', itr.arest='+$.itr.arest+
						', itr.vrest='+$.itr.vrest[hit[k].uid]);*/
					if( !$.itr.arest)
					if( hit[k].hit(ITR[j],$,{x:$.ps.x,y:$.ps.y,z:$.ps.z},vol))
					{	//hit you!
						//console.log('hit'+'$.state='+$.state());
						var ps=$.ps;
						var vx=(ps.vx===0?0:(ps.vx>0?1:-1));
						if( $.light)
						{
							ps.vx = vx * GC.weapon.hit.vx;
							ps.vy = GC.weapon.hit.vy;
						}
						$.itr_arest_update(ITR);
						//create an effect
						var timeout;
						if( $.light) timeout=2;
						if( $.heavy) timeout=4;
						$.effect.dvx=0;
						$.effect.dvy=0;
						$.effect_stuck(0,timeout);
					}
				}
			}
			//kind 5 is handled in `act()`
		}
	}

	/** @protocol caller hits callee
		@param ITR the itr object in data
		@param att reference of attacker
		@param attps position of attacker
		@param rect the hit rectangle where visual effects should appear
	 */
	typeweapon.prototype.hit=function(ITR, att, attps, rect)
	{
		var $=this;
		if( $.hold.obj)
			return false;
		if( $.itr.vrest[att.uid])
			return false;

		var accept=false;
		if( $.light)
		{
			if( $.state()===1002) //throwing
			{
				accept=true;
				if( (att.dirh()>0)!==($.ps.vx>0)) //head-on collision
					$.ps.vx *= GC.weapon.reverse.factor.vx;
				$.ps.vy *= GC.weapon.reverse.factor.vy;
				$.ps.vz *= GC.weapon.reverse.factor.vz;
				$.team = att.team; //change to the attacker's team
			}
			else if( $.state()===1004) //on_ground
			{
				//var asp = att.mech.speed();
				//$.ps.vx= asp* GC.weapon.gain.factor.x * (att.ps.vx>0?1:-1);
				//$.ps.vy= asp* GC.weapon.gain.factor.y;
				if( att.type==='lightweapon' || att.type==='heavyweapon')
				{
					accept=true;
					$.ps.vx= (att.ps.vx?(att.ps.vx>0?1:-1):0)*GC.weapon.bounceup.speed.x;
					$.ps.vz= (att.ps.vz?(att.ps.vz>0?1:-1):0)*GC.weapon.bounceup.speed.z;
				}
			}
		}

		var fall= ITR.fall!==undefined? ITR.fall: GC.default.fall.value;
		if( $.heavy)
		{
			if( $.state()===2004) //on_ground
			{
				accept=true;
				if( fall<30)
					$.effect_create(0, GC.effect.duration);
				else if( fall<GC.fall.KO)
					$.ps.vy= GC.weapon.soft_bounceup.speed.y;
				else
				{
					$.ps.vy= GC.weapon.bounceup.speed.y;
					if( att.ps.vx) $.ps.vx= (att.ps.vx>0?1:-1)*GC.weapon.bounceup.speed.x;
					if( att.ps.vz) $.ps.vz= (att.ps.vz>0?1:-1)*GC.weapon.bounceup.speed.z;
					$.trans.frame(999);
				}
			}
			else if( $.state()===2000) //in_the_sky
			{
				if( fall>=GC.fall.KO)
				{
					accept=true;
					if( (att.dirh()>0)!==($.ps.vx>0)) //head-on collision
						$.ps.vx *= GC.weapon.reverse.factor.vx;
					$.ps.vy *= GC.weapon.reverse.factor.vy;
					$.ps.vz *= GC.weapon.reverse.factor.vz;
					$.team = att.team; //change to the attacker's team
				}
			}
		}
		if( accept)
		{
			$.visualeffect_create( 0, rect, (attps.x < $.ps.x), (fall<GC.fall.KO?1:2));
			if( ITR && ITR.vrest)
				$.itr.vrest[att.uid] = ITR.vrest;
		}
		return accept;
	}

	/** @protocol being held in a character's hand
		@param att holder's reference
		@param wpoint data
		@param holdpoint data
	 */
	typeweapon.prototype.act=function(att,wpoint,holdpoint)
	{
		var $=this;
		var fD = $.frame.D;
		var result={};

		if( $.data.frame[wpoint.weaponact]) //if that frame exists
		{
			$.trans.frame(wpoint.weaponact);
			$.trans.trans(); //update immediately
		}

		if( fD.wpoint && fD.wpoint.kind===2)
		{
			if( wpoint.dvx) $.ps.vx = att.dirh() * wpoint.dvx;
			if( wpoint.dvz) $.ps.vz = att.dirv() * wpoint.dvz;
			if( wpoint.dvy) $.ps.vy = wpoint.dvy;
			if( $.ps.vx || $.ps.vy || $.ps.vz)
			{	//gaining velocity; flying away
				var imx,imy; //impulse
				if( $.light)
				{
					imx=58; imy=-15;
				}
				if( $.heavy)
				{
					imx=48; imy=-40;
				}
				$.mech.set_pos(
					att.ps.x + att.dirh() * imx,
					att.ps.y + imy,
					att.ps.z + $.ps.vz );
				$.ps.zz=1;
				if( $.light)
					$.trans.frame(40);
				if( $.heavy)
					$.trans.frame(999);
				$.trans.trans(); //update immediately
				$.hold.obj=null;
				result.thrown=true;
			}

			if( !result.thrown)
			{
				var wpoint_cover = wpoint.cover!==undefined?wpoint.cover:GC.default.wpoint.cover;
				if( wpoint_cover===1)
					$.ps.zz = -1;
				else
					$.ps.zz = 0;

				$.switch_dir(att.ps.dir);
				$.ps.sz = $.ps.z = att.ps.z;
				$.mech.coincideXY(holdpoint,$.mech.make_point(fD.wpoint));
				$.mech.project();
			}

			if( $.light) //attackable
			{
				if( wpoint.attacking)
				{
					var ITR=Futil.make_array(fD.itr);

					for( var j in ITR)
					{	//for each itr tag
						if( ITR[j].kind===5) //kind 5 only
						{
							var vol=$.mech.volume(ITR[j]);
							vol.zwidth = 0;
							var hit= $.scene.query(vol, [$,att], {tag:'body', not_team:$.team});
							for( var k in hit)
							{	//for each being hit
								if( !att.itr.arest)
								{	//if rest allows
									var citr;
									if( $.data.weapon_strength_list &&
										$.data.weapon_strength_list[wpoint.attacking])
										citr = $.data.weapon_strength_list[wpoint.attacking];
									else
										citr = ITR[j];

									if( hit[k].hit(citr,att,{x:att.ps.x,y:att.ps.y,z:att.ps.z},vol))
									{	//hit you!
										if( citr.vrest)
											result.vrest = citr.vrest;
										if( citr.arest)
											result.arest = citr.arest;
										result.hit = hit[k].uid;
									}
								}
							}
						}
					}
				}
			}
		}
		if( result.thrown)
			$.shadow.show();
		return result;
	}

	typeweapon.prototype.drop=function(dvx,dvy)
	{
		var $=this;
		$.team=0;
		$.hold.obj=null;
		if( dvx) $.ps.vx=dvx * 0.5; //magic number
		if( dvy) $.ps.vy=dvy * 0.2;
		$.ps.zz=0;
		$.trans.frame(999);
		$.shadow.show();
	}

	typeweapon.prototype.pick=function(att)
	{
		var $=this;
		if( !$.hold.obj)
		{
			$.hold.obj=att;
			$.team=att.team;
			$.shadow.hide();
			return true;
		}
		return false;
	}

	typeweapon.prototype.itr_rest_update=function(obj,uid,ITR) //override livingobject.itr_rest_update
	{
		var $=this;
		var newrest;
		if( ITR.arest)
			newrest = ITR.arest;
		else if( ITR.vrest)
			newrest = ITR.vrest;
		else
			newrest = GC.default.weapon.vrest;
		if( obj.type==='heavyweapon' || obj.type==='lightweapon')
			newrest *= 2; //double the rest time for weapon-weapon hit
		$.itr.vrest[uid] = newrest;
	}

	typeweapon.prototype.vol_itr=function(kind)
	{
		function match_kind(obj)
		{
			return obj.kind==kind; //use type conversion comparison
		}
		var $=this;
		if( $.frame.D.itr)
			return $.mech.body(
				$.frame.D.itr, //make volume from itr
				match_kind //select only matched kind
			);
		else
			return $.mech.body_empty();
	}

	return typeweapon;

} //outer class weapon
return weapon;
});

/*\
 * special attack
\*/

define('LF/specialattack',['LF/livingobject','LF/global','F.core/util'],
function(livingobject, Global, Futil)
{
var GC=Global.gameplay;

	/*\
	 * specialattack
	 [ class ]
	\*/
	var states=
	{
		'generic':function(event,K)
		{	var $=this;
			switch (event) {

			case 'TU':
				$.interaction();
				$.mech.dynamics();
				//	<YinYin> hit_a is the amount of hp that will be taken from a type 3 object they start with 500hp like characters it can only be reset with F7 or negative hits - once the hp reaches 0 the type 3 object will go to frame noted in hit_d - also kind 9 itrs (john shield) deplete hp instantly.
				if( $.frame.D.hit_a)
				{
					$.health.hp -= $.frame.D.hit_a;
					if( $.health.hp<=0)
						$.trans.frame($.frame.D.hit_d);
				}
			break;

			case 'frame':
				if( $.frame.D.opoint)
					$.match.create_object($.frame.D.opoint, $);
			break;

			case 'frame_force':
			case 'TU_force':
				if( $.frame.D.hit_j)
				{
					var dvz = $.frame.D.hit_j - 50;
					$.ps.vz = dvz;
				}
			break;
		}},

		/*	State 300X - Ball States
			descriptions taken from
			http://lf-empire.de/lf2-empire/data-changing/reference-pages/182-states?showall=&start=29
		*/
		/*	<zort> chasing ball seeks for 72 frames, not counting just after (quantify?) it's launched or deflected. Internally, LF2 keeps a variable keeping track of how long the ball has left to seek, which starts at 500 and decreases by 7 every frame until it reaches 0. while seeking, its maximum x speed is 14, and its x acceleration is 0.7; it can climb or descend, by 1 px/frame; and its maximum z speed is 2.2, with z acceleration .4. when out of seeking juice, its speed is 17. the -7 in the chasing algorithm comes from hit_a: 7.
		*/
		/*	<zort> you know that when you shoot a ball between john shields it eventually goes out the bottom? that's because when a projectile is spawned it's .3 pixels or whatever below its creator and whenever it bounces off a shield it respawns.
		*/

		//	State 3000 - Ball Flying is the standard state for attacks.  If the ball hits other attacks with this state, it'll go to the hitting frame (10). If it is hit by another ball or a character, it'll go to the the hit frame (20) or rebounding frame (30).
		'3000':function(event, ITR, att, attps, rect)
		{	var $=this;
			switch (event) {
			case 'hit_others':
				$.trans.frame(10);
			break;
			case 'hit': //hit by others
				if( att.type==='specialattack')
				{
					$.ps.vx = 0;
					$.trans.frame(20);
					return true;
				}
				else if( att.type==='character')
				{
					$.ps.vx = 0;
					$.team = att.team;
					$.trans.frame(30); //rebound
					$.trans.trans(); $.TU_update(); $.trans.trans(); $.TU_update(); //transit and update immediately
					return true;
				}
			break;
		}},

		//	State 3001 - Ball Flying / Hitting is used in the hitting frames, but you can also use this state directly in the flying frames.  If the ball hits a character while it has state 3001, then it won't go to the hitting frame (20).  It's the same for states 3002 through 3004. 
		'3001':function(event,K)
		{	var $=this;
			switch (event) {
		}},

		'x':function(event,K)
		{	var $=this;
			switch (event) {
		}}
	};

	//inherit livingobject
	function specialattack(config,data,thisID)
	{
		var $=this;
		// chain constructor
		livingobject.call($,config,data,thisID);
		// constructor
		$.team = config.team;
		$.match = config.match;
		$.health.hp = $.proper('hp') || GC.default.health.hp_full;
		$.mech.mass = 0;
		$.setup();
	}
	specialattack.prototype = new livingobject();
	specialattack.prototype.constructor = specialattack;
	specialattack.prototype.states = states;
	specialattack.prototype.type = 'specialattack';

	specialattack.prototype.init = function(pos,z,parent_dir,opoint)
	{
		var $=this;
		$.mech.set_pos(0,0,z);
		$.mech.coincideXY(pos,$.mech.make_point($.frame.D,'center'));
		var dir;
		var face = opoint.facing;
		if( face>=20)
			face = face%10;
		if( face===0)
			dir=parent_dir;
		else if( face===1)
			dir=(parent_dir==='right'?'left':'right');
		else if( 2<=face && face<=10)
			dir='right';
		else if(11<=face && face<=19) //adapted standard
			dir='left';
		$.switch_dir(dir);

		$.trans.frame(opoint.action===0?999:opoint.action);
		$.trans.trans();

		$.ps.vx = $.dirh() * opoint.dvx;
		$.ps.vy = opoint.dvy;
	}

	specialattack.prototype.interaction=function()
	{
		var $=this;
		var ITR=Futil.make_array($.frame.D.itr);

		if( $.team!==0)
		for( var j in ITR)
		{	//for each itr tag
			if( ITR[j].kind===0) //kind 0
			{
				var vol=$.mech.volume(ITR[j]);
				vol.zwidth = 0;
				var hit= $.scene.query(vol, $, {tag:'body'});
				for( var k in hit)
				{	//for each being hit
					if( !(hit[k].type==='character' && hit[k].team===$.team)) //cannot attack characters of same team
					if( !(hit[k].type!=='character' && hit[k].team===$.team && hit[k].ps.dir===$.ps.dir)) //can only attack objects of same team if head on collide
					if( !$.itr.arest)
					if( hit[k].hit(ITR[j],$,{x:$.ps.x,y:$.ps.y,z:$.ps.z},vol))
					{	//hit you!
						$.itr_arest_update(ITR);
						$.state_update('hit_others');
						$.ps.vx = 0;
						if( ITR[j].arest) break; //attack one enemy only
					}
				}
			}
		}
	}

	specialattack.prototype.hit=function(ITR, att, attps, rect)
	{
		var $=this;
		if( $.itr.vrest[att.uid])
			return false;

		if( ITR && ITR.vrest)
			$.itr.vrest[att.uid] = ITR.vrest;
		return $.state_update('hit', ITR, att, attps, rect);
	}

	return specialattack;
});

/*\
 * effect_pool
 * an effects pool manages a pool of effect instances using a circular array.
 * - each `effect` instance have the same life time, starting by `born` and end upon `die`.
 * - effect that born earlier should always die earlier
 * - when the pool is full, it can optionally expands
 * 
 * this is particularly useful in creating game effects.
 * say, you have an explosion visual effect that would be created 30 times per second
 * , that frequent object constructions create an overhead.
 * 
 * - effect class should have methods `born` and `die`
 * - each effect instance will be injected a `parent` property
 *  which is a reference to the containing effects pool,
 *  so that an instance can die spontaneously
\*/

define('F.core/effects-pool',[],function()
{
/*\
 * effect_pool
 [ class ]
 - config (object)
 * {
 -  init_size (number)
 -  batch_size (number)
 -  max_size (number)
 -  construct (function) should return newly created instances of effect
 * }
 | var ef_config=
 | {
 | 	init_size: 5,
 | 	batch_size: 5,
 | 	max_size: 100,
 | 	construct: function()
 | 	{
 | 		return new box_effect(1);
 | 	}
 | };
 | var effects = new Effects_pool(ef_config);
 * [example](../sample/effects-pool.html)
 # <iframe src="../sample/effects-pool.html" width="800" height="100"></iframe>
\*/
function efpool(config)
{
	this.pool=[]; //let it be a circular pool
	this.S=0; //start pivot
	this.E=0; //end pivot
	this.full=false;
	this.config=config;
	this.livecount=0;

	if( config.new_arg)
	{
		if( config.new_arg instanceof Array)
			this.new_arg = config.new_arg;
		else
			this.new_arg = [config.new_arg];
	}
	else
		this.new_arg = [];

	for( var i=0; i<config.init_size; i++)
	{
		this.pool[i] = config.construct();
		this.pool[i].parent = this;
	}
}

/*\
 * effect_pool.create
 [ method ]
 * activate an effect by calling `born`
 - arg (any) args will be passed through to `born`
 = (boolean) false if not okay
 = (object) reference to the new born effect if okay
 > Details
 * if the pool is full (all instances of effects are active) and __after__ expanding
 * the size is still smaller than or equal to `config.max_size`,
 * will expand the pool by size `config.batch_size`
 * 
 * if the pool is full and not allowed to expand, return false immediately
\*/
efpool.prototype.create=function(/*arg*/) //arguments will be passed through
{
	if( this.full)
	{
		if( this.pool.length + this.config.batch_size <= this.config.max_size)
		{	//expand the pool
			//console.log('expanding the pool');
			var args=[ this.E, 0];
			for( var i=0; i<this.config.batch_size; i++)
			{
				args[i+2] = this.config.construct();
				args[i+2].parent = this;
			}
			this.pool.splice.apply( this.pool, args);
			if( this.S!==0)
				this.S += this.config.batch_size;
			this.full=false;
		}
		else
			return false;
	}

	if( this.E < this.pool.length)
		this.E++;
	else
		this.E=1;

	if( this.E === this.S || (this.S===0 && this.E===this.pool.length))
	{
		//console.log('effects pool full');
		this.full=true;
	}

	if( this.pool[this.E-1].born)
		this.pool[this.E-1].born.apply ( this.pool[this.E-1], arguments);

	this.livecount++;
	return this.pool[this.E-1];
}

/*\
 * effect_pool.die
 [ method ]
 * deactivate the oldest effect instance by calling `die`
 - arg (any) args will be passed through to `die`
 = (object) a reference to the instance that died
 = (undefined) if there is actually no active effect
\*/
efpool.prototype.die=function(/*arg*/) //arguments will be passed through
{
	if( this.livecount > 0)
	{
		var oldS=this.S;
		if( this.pool[this.S].die)
			this.pool[this.S].die.apply ( this.pool[this.S], arguments);

		if( this.S < this.pool.length-1)
			this.S++;
		else
			this.S=0;

		this.full = false;
		this.livecount--;
		return this.pool[oldS];
	}
	else
		console.log('die too much!');
}

/*\
 * effect_pool.for_each
 [ method ]
 * iterate through all active instances, in the order of oldest to youngest
 - fun (function) iterator function, if return value is 'break', will break the loop
| efpool.for_each(function(e)
| {
|		e.hi();
| })
\*/
efpool.prototype.for_each=function(fun)
{
	if( this.livecount===0)
	{
		//completely empty
	}
	else if( this.S < this.E)
	{
		//  _ _S_ _E_
		// |_|_|*|*|_|
		for ( var i=this.S; i<this.E; i++)
			if( fun( this.pool[i])==='break')
				break;
	}
	else
	{
		//  _ _E_ _S_
		// |*|*|_|_|*|
		for ( var j=this.S; j<this.pool.length; j++)
			if( fun( this.pool[j])==='break')
				return ;
		for ( var i=0; i<this.E; i++)
			if( fun( this.pool[i])==='break')
				return ;
	}
}

/*\
 * effect_pool.call_each
 [ method ]
 * call a method of each active instance, in the order of oldest to youngest
 - fun_name (string) method name
 - arg (any) extra args will be passed through
\*/
efpool.prototype.call_each=function(fun_name /*, arg*/)
{
	if( this.pool[0][fun_name])
	{
		var arg= Array.prototype.slice.call(arguments,1);
		this.for_each(function(ef)
		{
			ef[fun_name].apply(ef, arg);
		});
	}
}

return efpool;
});

/*\
 * effect
 * 
 * handle visual effects
 * like blood, fire, etc
\*/

define('LF/effects',['LF/global','LF/sprite','F.core/effects-pool'],
function ( Global, Sprite, Feffects_pool)
{

/*\
 * effect_set
 [ class ]
 * effect_set is the set for all kinds of effects
 * this is a big manager. there is only 1 instance of effect_set in a match.
 - config (object)
 - DATA (array) of data (object)
 - ID (array) of ID (number)
\*/
function effect_set(config,DATA,ID) //DATA and ID are arrays
{
	this.efs={};
	for( var i=0; i<DATA.length; i++)
	{
		var ef_config=
		{
			init_size: 5,
			batch_size: 5,
			max_size: 30,
			construct: function()
			{
				return new effect(config,DATA[i],ID[i]);
			}
		}
		var efpool = this.efs[ID[i]] = new Feffects_pool(ef_config);
	}
}

effect_set.prototype.destroy=function()
{
	for( var i in this.efs)
		this.efs[i].destroy();
}

/*\
 * effect_set.create
 [ method ]
 - param (object) `{x,y,z}` position to create the effect
 - id (number) id of the desired effect
 - subnum (number) specify the variant of an effect
\*/
effect_set.prototype.create=function(param,id,subnum)
{
	if( !subnum) subnum=0;
	if( this.efs[id])
		this.efs[id].create(param,subnum);
}

effect_set.prototype.TU=function()
{
	for( var i in this.efs)
		this.efs[i].TU();
}

effect_set.prototype.transit=function()
{
}

/** extends Feffects_pool with custom method
 note: this have side effect, affecting Feffects_pool globally
 */
Feffects_pool.prototype.TU=function()
{
	this.for_each(function(E){
		E.TU();
	});
}
Feffects_pool.prototype.destroy=function()
{
	//destroy all, no matter active or not
	for( var i=0; i<this.pool.length; i++)
	{
		this.pool[i].destroy();
	}
}

/*\
 * effect_unit
 [ class ]
 * individual effect
 * 
 * they are like other living objects but much simplier.
 * they are short-lived, `born` as triggered by `effects-pool` and `die` spontaneously
\*/
function effect(config,data,id)
{
	this.dat=data;
	this.type=data.effect_list;
	this.id=id;
	this.sp = new Sprite(this.dat.bmp, config.stage);
	this.sp.hide();
	this.frame;
	this.frameD;
	this.wait=-1;
	this.next;
}

effect.prototype.destroy=function()
{
	this.sp.destroy();
}

effect.prototype.TU=function()
{
	this.sp.show_pic(this.frameD.pic);
	this.wait=this.frameD.wait;
	this.next=this.frameD.next;

	if( this.wait===0)
	{
		if( this.next===999)
			this.next=0;
		else if( this.next===1000)
		{
			this.sp.hide();
			this.parent.die();
			return ;
		}

		this.frame=this.next;
		this.frameD=this.dat.frame[this.frame];
	}
	else
		this.wait--;
}

effect.prototype.transit=function()
{
}

effect.prototype.set_pos=function(x,y,z)
{
}

effect.prototype.born=function(P,N)
{
	var sf;
	if( this.type[N] && this.type[N].frame)
		sf = this.type[N].frame;
	else
		sf = 0;
	this.frame=sf;
	this.frameD=this.dat.frame[this.frame];

	var x=P.x - this.frameD.centerx;
	var y=P.y - this.frameD.centery;
	var z=P.z;
	this.sp.set_x_y(x, y+z);
	this.sp.set_z(z+1);
	this.sp.show_pic(this.frameD.pic);
	this.sp.show();
}

return effect_set;
});

/*\
 * factory.js
 * 
 * object factories
 * in data.js, you define a set of data files, they are actually like product designs.
 * in here factories.js, you define the factories used to manufacture each type of object, living or dead.
 * this abstraction is to allow addition of new object types.
\*/

define('LF/factories',['LF/character','LF/weapon','LF/specialattack','LF/effects'],
function(character,weapon,specialattack,effects)
{
	/** to manufacture an object a factory receives a config, `id` and `data`
	*/
	return {
		character: character,
		lightweapon: weapon('lightweapon'),
		heavyweapon: weapon('heavyweapon'),
		specialattack: specialattack,
		//baseball: baseball,
		//miscell: miscell,
		//drinks: drinks,
		effects: effects
	}
});

/*\
 * math
 * math related functions
\*/

define('F.core/math',[],function(){

math={
/**
math helper functions-----
*/
/*\
 * math.inbetween
 [ method ]
 - x, L, R (number)
 = (boolean) true if x is in between L and R
\*/
inbetween: function (x,L,R)
{
	var l,r;
	if ( L<=R)
	{	l=L;
		r=R;
	}
	else
	{	l=R;
		r=L;
	}
	return x>=l && x<=r;
},
/*\
 * math.round_d2
 [ method ]
 - I (number)
 = (number) round to decimal 2
\*/
round_d2: function (I)
{
	return Math.round(I*100)/100;
},
/*\
 * math.negligible
 [ method ]
 - M (number)
 = (boolean) true if M is very very small, with absolute value smaller than ~0.00000001
\*/
negligible: function (M)
{
	return -0.00000001 < M && M < 0.00000001;
},

/**
curves--------------------
*/

/*\
 * math.bezier2
 [ method ]
 - A, C, B (object) points in `{x,y}`
 * here `C` means the control point
 - steps (number)
 = (object) array of points on curve
\*/
bezier2: function (A,C,B,steps)
{
	var curve = new Array();
	for( var i=0; i<steps; i++)
	{
		curve.push(math.bezier2_step(A,C,B, i,steps));
	}
	curve.push(B);
	return curve;
},
bezier2_step: function (A,C,B, i,steps)
{
	var P={x:0,y:0};
	P.x = getstep(getstep(A.x, C.x, i, steps), getstep(C.x, B.x, i, steps), i, steps);
	P.y = getstep(getstep(A.y, C.y, i, steps), getstep(C.y, B.y, i, steps), i, steps);
	return P;

	function getstep(x1, x2, stepcount, numofsteps)
	{
		return ((numofsteps - stepcount) * x1 + stepcount * x2) / numofsteps;
	}
},

/**
2d vector math--------------
*/
/*\
 * math.add
 [ method ]
 * A+B
 - A, B (object) points in `{x,y}`
 = (object) point in `{x,y}`
\*/
add: function (A,B)
{
	return {x:A.x+B.x, y:A.y+B.y};
},
/*\
 * math.sub
 * A-B
 [ method ]
 - A, B (object) points in `{x,y}`
 = (object) point in `{x,y}`
\*/
sub: function (A,B)
{
	return {x:A.x-B.x, y:A.y-B.y};
},
/*\
 * math.scale
 * A*t
 [ method ]
 - A (object) point
 - t (number)
 = (object) point
\*/
sca: function (A,t)
{
	return {x:A.x*t, y:A.y*t};
},
/*\
 * math.length
 * |A|
 [ method ]
 - A (object) point
 = (number) length
\*/
length: function (A)
{
	return Math.sqrt( A.x*A.x + A.y*A.y );
},
/*\
 * math.distance
 * |AB|
 [ method ]
 - A, B (object) points in `{x,y}`
 = (number) length
\*/
distance: function (p1,p2)
{
	return Math.sqrt( (p2.x-p1.x)*(p2.x-p1.x) + (p2.y-p1.y)*(p2.y-p1.y) );
},
/*\
 * math.negative
 * -A
 [ method ]
 - A (object) point
 = (object) point
\*/
negative: function (A)
{
	return {x:-A.x, y:-A.y};
},
/*\
 * math.normalize
 * A/|A|
 [ method ]
 - A (object) point
 = (object) point
\*/
normalize: function (A)
{
	return math.sca(A, 1/math.length(A));
},
/*\
 * math.perpen
 * perpendicular; anti-clockwise 90 degrees, assume origin in lower left
 [ method ]
 - A (object) point
\*/
perpen: function (A)
{
	return {x:-A.y, y:A.x};
},
/*\
 * math.signed_area
 [ method ]
 - A, B, C (object) points
 = (number) signed area
 * the sign indicate clockwise/anti-clockwise points order
\*/
signed_area: function (p1,p2,p3)
{
	var D = (p2.x-p1.x)*(p3.y-p1.y)-(p3.x-p1.x)*(p2.y-p1.y);
	return D;
},
/*\
 * math.intersect
 * line-line intersection
 [ method ]
 - P1 (object) point on line 1
 - P2 (object) point on line 1
 - P3 (object) point on line 2
 - P4 (object) point on line 2
 = (object) return the intersection point of P1-P2 with P3-P4
 * reference: [http://paulbourke.net/geometry/lineline2d/](http://paulbourke.net/geometry/lineline2d/)
\*/
intersect: function ( P1,P2,P3,P4)
{
	var mua,mub;
	var denom,numera,numerb;

	denom  = (P4.y-P3.y) * (P2.x-P1.x) - (P4.x-P3.x) * (P2.y-P1.y);
	numera = (P4.x-P3.x) * (P1.y-P3.y) - (P4.y-P3.y) * (P1.x-P3.x);
	numerb = (P2.x-P1.x) * (P1.y-P3.y) - (P2.y-P1.y) * (P1.x-P3.x);

	if ( negligible(numera) && negligible(numerb) && negligible(denom)) {
		//meaning the lines coincide
		return { x: (P1.x + P2.x) * 0.5,
			y:  (P1.y + P2.y) * 0.5 };
	}

	if ( negligible(denom)) {
		//meaning lines are parallel
		return { x:0, y:0};
	}

	mua = numera / denom;
	mub = numerb / denom;

	return { x: P1.x + mua * (P2.x - P1.x),
		y:  P1.y + mua * (P2.y - P1.y) };
}

};
return math;
});

/*\
 * collision
 * collision detection function set
 * 
 * all functions return `true` if intersect
 * 
 * [example](../sample/collision.html)
\*/

define('F.core/collision',['F.core/math'], function(Fm)
{

return {

/*\
 * collision.rect
 * rectangle-rectangle intersect test
 [ method ]
 - rect1 (object)
 - rect2 (object) in form of `{left,top,right,bottom}`
\*/
rect: function (rect1,rect2)
{
	if(rect1.bottom < rect2.top)	return false;
	if(rect1.top > rect2.bottom)	return false;
	if(rect1.right < rect2.left)	return false;
	if(rect1.left > rect2.right)	return false;

	return true;
},

//produces less garbage
rect_flat: function (rect1_left,rect1_top,rect1_right,rect1_bottom,
					 rect2_left,rect2_top,rect2_right,rect2_bottom)
{
	if(rect1_bottom < rect2_top)	return false;
	if(rect1_top > rect2_bottom)	return false;
	if(rect1_right < rect2_left)	return false;
	if(rect1_left > rect2_right)	return false;

	return true;
},

normalize_rect: function (rect)
{
	if( rect.left > rect.right && rect.top > rect.bottom)
		return {left:rect.right, right:rect.left,
			top:rect.bottom, bottom:rect.top}
	else if( rect.left > rect.right)
		return {left:rect.right, right:rect.left,
			top:rect.top, bottom:rect.bottom}
	else if( rect.top > rect.bottom)
		return {left:rect.left, right:rect.right,
			top:rect.bottom, bottom:rect.top}
	else
		return rect;
},

/*\
 * collision.tri
 * triangle-triangle intersect test
 [ method ]
 - A,B (array) array of points in form `{x,y}`
\*/
tri: function (A,B)
{
	/*I assume this a fast enough implementation
	  it performs a max. of 18 cross products when the triangles do not intersect.
	    if they do, there may be fewer calculations
	*/
	var aa=Fm.signed_area;
	var I=[];
	//line line intersect tests
	var tested=0;
	I.push( aa(A[0],A[1],B[0])>0, aa(A[0],A[1],B[1])>0,
		aa(A[0],B[0],B[1])>0, aa(A[1],B[0],B[1])>0
	);if(test())return true;
	I.push(         I[1]        , aa(A[0],A[1],B[2])>0,
		aa(A[0],B[1],B[2])>0, aa(A[1],B[1],B[2])>0
	);if(test())return true;
	I.push(         I[0]        ,         I[5]        ,
		aa(A[0],B[0],B[2])>0, aa(A[1],B[0],B[2])>0
	);if(test())return true;
	I.push( aa(A[1],A[2],B[0])>0, aa(A[1],A[2],B[1])>0,
			I[3]        , aa(A[2],B[0],B[1])>0
	);if(test())return true;
	I.push(         I[13]       , aa(A[1],A[2],B[2])>0,
			I[7]        , aa(A[2],B[1],B[2])>0
	);if(test())return true;
	I.push(         I[12]       ,         I[17]       ,
			I[11]       , aa(A[2],B[0],B[2])>0
	);if(test())return true;
	I.push( aa(A[0],A[2],B[0])>0, aa(A[0],A[2],B[1])>0,
			I[2]        ,         I[15]
	);if(test())return true;
	I.push(         I[25]       , aa(A[0],A[2],B[2])>0,
			I[6]        ,         I[19]
	);if(test())return true;
	I.push(         I[24]       ,         I[29]       ,
			I[10]       ,         I[23]
	);if(test())return true;

	function test()
	{
		var i=tested; tested+=4;
		return (I[i]!=I[i+1] && I[i+2]!=I[i+3]);
	}

	//point inside triangle test
	var AinB=[ I[2]==I[6]&&I[6]==!I[10],   //true if A[0] is inside triangle B
		   I[3]==I[7]&&I[7]==!I[11],   //  A[1]
		   I[15]==I[19]&&I[19]==!I[23]]//  A[2]

	var BinA=[ I[0]==I[12]&&I[12]==!I[24], //true if B[0] is inside triangle A
		   I[1]==I[13]&&I[13]==!I[25], //  B[1]
		   I[9]==I[21]&&I[21]==!I[33]];//  B[2]

	if (AinB[0] && AinB[1] && AinB[2])  return true;
	if (BinA[0] && BinA[1] && BinA[2])  return true;

	return false;
	//another possible implementation http://jgt.akpeters.com/papers/Moller97/tritri.html
},

/*\
 * collision.circle
 * circle-circle intersect test
 [ method ]
 - A,B (object) in form `{center,radius}`
 * where center is in form `{x,y}`, radius is a `number`
\*/
circle: function (A,B)
{
	return (Fm.distance(A.center,B.center) <= A.radius+B.radius);
},

/*\
 * collision.line
 * line-line intersect test, true if line AB intersects CD
 [ method ]
 - A,B,C,D (object) in form `{x,y}`
\*/
line: function (A,B,C,D)
{
	var res = (Fm.signed_area(A,B,C)>0 != Fm.signed_area(A,B,D)>0) &&
		  (Fm.signed_area(C,D,A)>0 != Fm.signed_area(C,D,B)>0);
	return res;
},

/*\
 * collision.point_in_rect
 * point in rectangle test
 [ method ]
 - P (object) in form `{x,y}`
 - R (object) in form `{left,top,right,bottom}`
\*/
point_in_rect: function (P,R)
{
	return (Fm.inbetween(P.x,R.left,R.right) && Fm.inbetween(P.y,R.top,R.bottom));
}

}});

/*\
 * scene
 * 
 * scene in F.LF; keeps a list a characters and items
 | vol= //the volume format
 | {
 | 	x, y, z, //the reference point
 | 	vx, vy, w, h, //the volume defined with reference to (x,y,z)
 | 	zwidth	//zwidth spans into the +ve and -ve direction
 | }
\*/

define('LF/scene',['F.core/util','F.core/collision'], function (Futil,Fcollision)
{

function scene (config)
{
	this.live = {}; //list of living objects
	this.uid = 0;
}

scene.prototype.add = function(C)
{
	this.uid++;
	C.uid = this.uid;
	this.live[C.uid]=C;
	return C.uid;
}

scene.prototype.remove = function(C)
{
	var uid = C.uid;
	delete this.live[C.uid];
	C.uid=-1;
	return uid;
}

/*\
 * scene.query
 [ method ]
 - exclude (object) or (array of objects)
 - where (object) what to intersect with
 * examples, can mixin the following properties
 | {tag:'body'} intersect with body
 | {tag:'itr:2'} intersect with itr kind:2
 | {type:'character'} with character only
 | {not_team:1} exclude team
 | {filter:function}
 = (array) all the objects whose volume intersect with the specified volume
\*/
scene.prototype.query = function(volume, exclude, where)
{
	var result=[];
	var tag=where.tag;
	if(!tag) tag='body';
	var tagvalue=0;
	var tag_split=tag.split(':');
	tag = tag_split[0];
	tagvalue = tag_split[1];

	for ( var i in this.live)
	{
		var excluded=false;
		if( exclude instanceof Array)
		{
			for( var ex=0; ex<exclude.length; ex++)
			{
				if( this.live[i] === exclude[ex])
				{
					excluded=true;
					break;
				}
			}
		}
		else if( exclude)
		{
			if( this.live[i] === exclude)
				excluded=true;
		}
		if( excluded)
			continue;

		if( where.not_team && this.live[i].team === where.not_team)
			continue;

		if( where.type && this.live[i].type !== where.type)
			continue;

		if( where.filter && !where.filter(this.live[i]))
			continue;

		if( this.live[i]['vol_'+tag])
		{
			var vol = this.live[i]['vol_'+tag](tagvalue);
			for( var j=0; j<vol.length; j++)
			{
				if( this.intersect( volume, vol[j]))
				{
					result.push( this.live[i] );
					break;
				}
			}
		}
	}
	return result;
}

//return true if volume A and B intersect
scene.prototype.intersect = function(A,B)
{
	//less garbage version
	var A_left=A.x+A.vx, A_top=A.y+A.vy, A_right=A.x+A.vx+A.w, A_bottom=A.y+A.vy+A.h;
	var B_left=B.x+B.vx, B_top=B.y+B.vy, B_right=B.x+B.vx+B.w, B_bottom=B.y+B.vy+B.h;

	return ( Fcollision.rect_flat(
			A_left, A_top, A_right, A_bottom,
			B_left, B_top, B_right, B_bottom) &&
		Fcollision.rect_flat(
			A.z-A.zwidth, 0, A.z+A.zwidth, 1,
			B.z-B.zwidth, 0, B.z+B.zwidth, 1)
		);
}
scene.prototype.intersect_old = function(A,B)
{
	var AV={ left:A.x+A.vx, top:A.y+A.vy, right:A.x+A.vx+A.w, bottom:A.y+A.vy+A.h };
	var BV={ left:B.x+B.vx, top:B.y+B.vy, right:B.x+B.vx+B.w, bottom:B.y+B.vy+B.h };

	return ( Fcollision.rect( AV, BV ) && Fcollision.rect(
	{ left:A.z-A.zwidth, top:0, right:A.z+A.zwidth, bottom:1 },
	{ left:B.z-B.zwidth, top:0, right:B.z+B.zwidth, bottom:1 }
	));
}

//return the distance between object A and B, as measured at center points
scene.prototype.distance=function(A,B)
{
	var dx= (A.x+A.centerx) - (B.x+B.centerx);
	var dy= A.y - B.y;
	var dz= (A.z+A.centery) - (B.z+B.centery);

	return Math.sqrt(dx*dx+dy*dy+dz*dz);
}

return scene;
});

define('LF/background',['F.core/util','F.core/sprite','F.core/support','LF/global'],function(Futil,Fsprite,Fsupport,global)
{
	var GA = global.application;

	var global_timer, global_timer_children=[];
	function standalone(child)
	{
		global_timer_children.push(child);
		if( !global_timer)
			global_timer = setInterval(function()
			{
				for( var i=0; i<global_timer_children.length; i++)
				{
					global_timer_children[i].TU();
				}
			}, 1000/30); //30 fps
	}

	/* config=
	{
		layers:, //DOM node, layers holder, append bg layers here
		floor:,  //DOM node, livingobjects holder, scroll this to move camera
		scrollbar:,
		camerachase:{character:} //camera only chase these characters
		standalone:,	//no match, background viewer only
	}*/
	function background(config,data,id)
	{
		var $=this;
		if( !config)
		{	//create an empty background
			$.id = -1;
			$.name = 'empty background';
			$.width = 1500;
			$.zboundary = [0,300];
			$.height=$.zboundary[1]-$.zboundary[0];
			$.shadow={x:0,y:0,img:''}
			return;
		}
		$.layers=[];
		$.timed_layers=[];
		$.timer=0;
		$.floor = config.floor;
		$.data = data;
		$.name = data.name.replace(/_/g,' ');
		$.id = id;

		$.zboundary=data.zboundary;
		$.width=data.width;
		$.height=$.zboundary[1]-$.zboundary[0];
		$.shadow={
			x:0,y:0, //offset x,y
			img:data.shadow
		};
		if( Fsupport.css3dtransform)
			$.dropframe = 0;
		else
			$.dropframe = 1;
		(function(){
			var sp = new Fsprite({img:data.shadow});
			sp.img[0].addEventListener('load', onload, true);
			function onload()
			{
				$.shadow.x = (this.naturalWidth||this.width)/2;
				$.shadow.y = (this.naturalHeight||this.height)/2;
				sp.img[0].removeEventListener('load', onload, true);
			}
		}());

		if( $.floor)
			$.floor.style.width=$.width+'px';

		if( config.scrollbar)
		{
			var sc = document.createElement('div');
			$.scrollbar=sc;
			sc.className = 'backgroundScroll';
			var child = document.createElement('div');
			child.style.width=$.width+'px';
			child.className = 'backgroundScrollChild';
			sc.appendChild(child);
			config.layers.parentNode.appendChild(sc);
			sc.onscroll=function()
			{
				if( $.camera_locked)
				{
					$.camerax=sc.scrollLeft;
					$.scroll(sc.scrollLeft);
				}
			}
			sc.onmousedown=function()
			{
				$.camera_locked=true;
			}
			sc.onmouseup=function()
			{
				$.camera_locked=false;
			}
			if(!('__proto__' in {}))
			{	//IE 9,10 quirk
				sc.onmousemove=function()
				{
					$.camera_locked=false;
				}
			}
		}

		if( config.camerachase)
		{
			$.char = config.camerachase.character;
			$.camerax = $.width/2;
			$.cami = 0;
		}
		else
			$.camera_locked = true;

		//create layers
		if( $.floor)
		$.layers.push({
			sp: new Fsprite({div:$.floor,type:'group'}),
			ratio:1
		});
		var LAY = Futil.group_elements(data.layer,'width');
		for( var i in LAY)
		{
			var lay=
			{
				sp: new Fsprite({canvas:config.layers,type:'group'}),
				ratio: (parseInt(i)-GA.window.width)/($.width-GA.window.width)
			};
			lay.sp.set_z(-1000+parseInt(i));
			$.layers.push(lay);
			for( var j=0; j<LAY[i].length; j++)
			{
				var dlay = LAY[i][j]; //layer data
				var sp_config;
				if( dlay.rect)
				{
					//if `rect` is defined, `pic` will only be a dummy
					sp_config=
					{
						canvas: lay.sp.el,
						wh: {x:dlay.width, y:dlay.height}
					}
				}
				else if( dlay.pic)	
				{
					sp_config=
					{
						canvas: lay.sp.el,
						wh: 'fit',
						img: dlay.pic
					}
				}
				var sp;
				if( !dlay.loop)
				{
					sp = new Fsprite(sp_config);
					sp.set_x_y( dlay.x, correct_y(dlay));
					if( dlay.rect)
						sp.el.style.background=color_conversion(dlay.rect);
				}
				else
				{
					sp = new Fsprite({canvas:lay.sp.el,type:'group'}); //holder
					sp_config.canvas = sp.el;
					sp.set_x_y(0,0);
					for( var xx=dlay.x; xx<dlay.width; xx += dlay.loop)
					{
						var spi = new Fsprite(sp_config);
						spi.set_x_y( xx, dlay.y);
						if( dlay.rect)
							spi.el.style.background=color_conversion(dlay.rect);
					}
				}
				if( dlay.cc)
					$.timed_layers.push({
						sp:sp,
						cc:dlay.cc,
						c1:dlay.c1,
						c2:dlay.c2
					});
			}
		}

		if( config.standalone)
		{
			standalone(this);
			$.carousel = {
				type: config.standalone.carousel,
				dir: 1,
				speed: 1
			};
			$.camera_locked = false;
		}

		//a very strange bug for the scene 'HK Coliseum' must be solved by hard coding
		function correct_y(dlay)
		{
			if( data.name==='HK Coliseum')
			{
				if( dlay.pic.indexOf('back1')===-1)
					return dlay.y-8;
				else
					return dlay.y;
			}
			else
				return dlay.y;
		}
	}

	function color_conversion(rect)
	{
		if( typeof rect==='string')
			return rect; //extended standard: CSS color format allowed
		else if( typeof rect==='number')
		{
			var lookup, computed;
			switch (rect)
			{
				case 4706: lookup='rgb(16,79,16)'; break; //lion forest
				case 40179: lookup='rgb(159,163,159)'; break; //HK Coliseum
				case 29582: lookup='rgb(119,119,119)'; break;
				case 37773: lookup='rgb(151,119,111)'; break;
				case 33580: lookup='rgb(135,107,103)'; break;
				case 25356: lookup='rgb(103,103,103)'; break;
				case 21096: lookup='rgb(90,78,75)'; break; //Stanley Prison
				case 37770: lookup='rgb(154,110,90)'; break; //The Great Wall
				case 16835: lookup='rgb(66,56,24)'; break; //Queen's Island
				case 34816: lookup='rgb(143,7,7)'; break; //Forbidden Tower
			}
			var r = (rect>>11<<3),
				g = (rect>>6&31)<<3,
				b = ((rect&31)<<3);
			computed = 'rgb('+
				(r+(r>64||r===0?7:0))+','+
				(g+(g>64||g===0?7:0)+((rect>>5&1)&&g>80?4:0))+','+
				(b+(b>64||b===0?7:0))+
				')';
			if( lookup && computed!==lookup)
				console.log('computed:'+computed,'correct:'+lookup);
			if( lookup)
				return lookup;
			else
				return computed;
		}
	}

	background.prototype.destroy=function()
	{
		var $=this;
		if( $.name==='empty background')
			return;
		if ( $.layers)
		for( var i=1; i<$.layers.length; i++) //starts from 1, because layers[0] is floor
			$.layers[i].sp.remove();
		if ( $.timed_layers)
		for( var i=0; i<$.timed_layers.length; i++)
			$.timed_layers[i].sp.remove();
		if( $.scrollbar)
			$.scrollbar.parentNode.removeChild($.scrollbar);
	}

	//return true if the moving object is leaving the scene
	background.prototype.leaving=function(ps)
	{
		var $=this;
		var nx=ps.x+ps.vx,
			ny=ps.y+ps.vy;
		return (nx<0 || nx>$.width || ny<-600 || ny>100);
	}

	//get an absolute position using a ratio, e.g. get_pos(0.5,0.5) is exactly the mid point
	background.prototype.get_pos=function(rx,rz)
	{
		var $=this;
		return { x:$.width*rx, y:0, z:$.zboundary[0]+$.height*rz};
	}

	background.prototype.scroll=function(X)
	{
		var $=this;
		for( var i=0; i<$.layers.length; i++)
			$.layers[i].sp.set_x_y(-(X*$.layers[i].ratio),0);
	}

	var screenW=GA.window.width,
		halfW  =GA.window.width/2;
	background.prototype.TU=function()
	{
		var $=this;
		//camera movement
		if( !$.camera_locked)
		{
			if( !$.carousel)
			{	//camera chase
				if( $.cami++%($.dropframe+1)!==0)
					return;
				/// algorithm by Azriel
				/// http://www.lf-empire.de/forum/archive/index.php/thread-4597.html
				var avgX=0,
					facing=0,
					numPlayers=0;
				for( var i in $.char)
				{
					avgX+= $.char[i].ps.x;
					facing+= $.char[i].dirh();
					numPlayers++;
				}
				if( numPlayers>0)
					avgX/=numPlayers;
				//var xLimit= (facing*screenW)/(numPlayers*6) - (halfW + avgX);
				//  his original equation has one error, it should be 24 regardless of number of players
				var xLimit= (facing*screenW/24)+(avgX-halfW);
				if( xLimit < 0) xLimit=0;
				if( xLimit > $.width-screenW) xLimit = $.width-screenW;
				var spdX = (xLimit - $.camerax) * GA.camera.speed_factor * ($.dropframe+1);
				if( spdX!==0)
				{
					if( -0.05<spdX && spdX<0.05)
						$.camerax = xLimit;
					else
						$.camerax = $.camerax + spdX;
					$.scroll($.camerax);
					if( $.scrollbar)
						$.scrollbar.scrollLeft = Math.round($.camerax);
				}
			}
			else if( $.carousel.type==='linear')
			{
				var lastscroll = $.scrollbar.scrollLeft;
				$.scrollbar.scrollLeft += $.width/200*$.carousel.speed*$.carousel.dir;
				if( lastscroll === $.scrollbar.scrollLeft)
					$.carousel.dir *= -1;
				$.scroll($.scrollbar.scrollLeft);
			}
		}
		//layers animation
		for( var i=0; i<$.timed_layers.length; i++)
		{
			var lay = $.timed_layers[i];
			var frame = $.timer%lay.cc;
			if( frame>=lay.c1 && frame<=lay.c2)
				lay.sp.show();
			else
				lay.sp.hide();
		}
		$.timer++;
	}

	return background;
});

/** jsgamesoup
	A Free Software framework for making games using Javascript and open web technologies. Runs on Firefox (Gecko), Safari/Chrome (WebKit), Internet Explorer 6+, and Android + iOS browsers.
	Homepage, documentation, demos, at http://jsgamesoup.net/
*/
/**
        @class A fast, deterministic, seedable random number generator.
        @description Unlike the native random number generator built into most browsers, this one is deterministic, and so it will produce the same sequence of outputs each time it is given the same seed. It is based on George Marsaglia's MWC algorithm from the v8 Javascript engine.
*/

define('LF/third_party/random',[],function()
{
function SeedableRandom() {
        /**
                Get the next random number between 0 and 1 in the current sequence.
        */
        this.next = function next() {
                // Random number generator using George Marsaglia's MWC algorithm.
                // Got this from the v8 js engine

                // don't let them get stuck
                if (this.x == 0) this.x == -1;
                if (this.y == 0) this.y == -1;

                // Mix the bits.
                this.x = this.nextX();
                this.y = this.nextY();
                return ((this.x << 16) + (this.y & 0xFFFF)) / 0xFFFFFFFF + 0.5;
        }

        this.nextX = function() {
                return 36969 * (this.x & 0xFFFF) + (this.x >> 16);
        }

        this.nextY = function() {
                return 18273 * (this.y & 0xFFFF) + (this.y >> 16);
        }

        /**
                Get the next random integer in the current sequence.
                @param a The lower bound of integers (inclusive).
                @param gs The upper bound of integers (exclusive).
        */
        this.nextInt = function nextInt(a, b) {
                if (!b) {
                        a = 0;
                        b = 0xFFFFFFFF;
                }
                // fetch an integer between a and b inclusive
                return Math.floor(this.next() * (b - a)) + a;
        }

        /**
                Seed the random number generator. The same seed will always yield the same sequence. Seed with the current time if you want it to vary each time.
                @param x The seed.
        */
        this.seed = function(x) {
                this.x = x * 3253;
                this.y = this.nextX();
        }

        /**
                Seed the random number generator with a two dimensional seed.
                @param x First seed.
                @param y Second seed.
        */
        this.seed2d = function seed(x, y) {
                this.x = x * 2549 + y * 3571;
                this.y = y * 2549 + x * 3571;
        }

        /**
                Seed the random number generator with a three dimensional seed.
                @param x First seed.
                @param y Second seed.
                @param z Third seed.
        */
        this.seed3d = function seed(x, y, z) {
                this.x = x * 2549 + y * 3571 + z * 3253;
                this.y = x * 3253 + y * 2549 + z * 3571;
        }

        /**
				Seed by the current time, returning the seed
        */
        this.seed_bytime = function()
        {
			var val = (new Date()).getTime();
			this.seed(val);
			return val;
		}
}
return SeedableRandom;
});

/*\
 * match
 * a match hosts a game.
 * a match is a generalization above game modes (e.g. VSmode, stagemode, battlemode)
\*/

define('LF/match',['F.core/util','F.core/controller','F.core/sprite',
'LF/network','LF/factories','LF/scene','LF/background','LF/AI','LF/third_party/random','LF/util',
'LF/global'],
function(Futil,Fcontroller,Fsprite,
network,factory,Scene,Background,AI,Random,util,
Global)
{
	var GA=Global.application;
	/*\
	 * match
	 [ class ]
	 |	config =
	 |	{
	 |  manager,//the game manager
	 |	stage,  //the XZ plane to place all living objects
	 |	state,  //the state machine handling various events in a match
	 |	config, //default config for each object type
	 |	package	//the content package
	 |	}
	\*/
	function match(config)
	{
		var $=this;
		$.manager = config.manager;
		$.stage = config.stage;
		$.state = config.state;
		$.data = config.package.data;
		$.spec = $.data.properties.data;
		$.grouped_object = Futil.group_elements($.data.object,'type');
		$.config = config.config;
		if( !$.config)
			$.config = {};
		$.time;
	}

	match.prototype.create=function(setting)
	{
		/** setting={
			player:
			[
				{
					controller: control1,
					id: 30,
					team: 1
				},
				{
					controller: control2,
					id: 1,
					team: 2
				}
			],
			control: 'debug',
			set:
			{
				weapon: true
			},
			background: {id:1}
		} */
		var $=this;
		var data_ids=[];
		for( var i=0; i<setting.player.length; i++)
		{
			//(lazy) now load all characters and associated data files
			data_ids.push($.data.object[setting.player[i].datanum].id);
			data_ids = data_ids.concat(Futil.extract_array($.data.object[setting.player[i].datanum].pack,'id').id);
		}
		if( !setting.set) setting.set={};

		$.randomseed = $.new_randomseed();
		$.create_scenegraph();
		$.create_effects($.config.effects);
		$.control = $.create_controller(setting.control);
		$.create_background(setting.background);
		$.panel=[]; for( var i=0; i<8; i++) $.panel[i]={};
		$.pause_mess = setting.pause_mess;
		if( $.pause_mess)
			$.pause_mess.hide();
		$.tasks = []; //pending tasks
		$.AIscript = [];

		this.data.object.load(data_ids,function()
		{
			if( setting.player)
				$.create_characters(setting.player);
			if( setting.set.weapon)
				$.drop_weapons(setting.set.weapon);
			$.create_timer();
		});
	}

	match.prototype.destroy=function()
	{
		var $=this;
		$.time.paused=true; //pause execution
		network.clearInterval($.time.timer);

		//destroy all objects
		$.for_all('destroy');
		$.background.destroy();
		for( var i=0; i<$.panel.length; i++)
		{
			if( $.panel[i].hp)
			{
				$.panel[i].hp.remove();
				$.panel[i].hp_bound.remove();
				$.panel[i].mp.remove();
				$.panel[i].mp_bound.remove();
				$.panel[i].spic.remove();
			}
		}

		//clear the window DOM
		var divs = ['background','floor'];
		for (var i in divs)
		{
			var e = util.div(divs[i]);
			if( e)
			while (e.lastChild)
				e.removeChild(e.lastChild);
		}
	}

	match.prototype.log=function(mes)
	{
		console.log(this.time.t+': '+mes);
	}

	match.prototype.create_object=function(opoint, parent)
	{
		var $=this;
		$.tasks.push({
			task: 'create_object',
			opoint: opoint,
			team: parent.team,
			pos: parent.mech.make_point(opoint),
			z: parent.ps.z,
			dir: parent.ps.dir
		});
	}

	match.prototype.destroy_object=function(obj)
	{
		var $=this;
		$.tasks.push({
			task: 'destroy_object',
			obj: obj
		});
	}

	//all methods below are considered private

	match.prototype.create_scenegraph=function()
	{
		var $=this;
		$.scene = new Scene();
		for( var objecttype in factory)
			$[objecttype] = {};
	}

	match.prototype.create_timer=function()
	{
		var $=this;
		$.time =
		{
			t:0,
			paused: false,
			timer: null,
			$fps: util.div('fps')
		};
		if( !$.time.$fps) $.calculate_fps = function(){};
		$.time.timer = network.setInterval( function(){$.frame();}, 1000/30);
	}

	match.prototype.frame=function()
	{
		var $=this;

		if( $.control)
			$.control.fetch();
		for( var i in $.character)
			$.character[i].con.fetch();

		if( !$.time.paused)
		{
			$.TU_trans();
			$.calculate_fps();
		}
		else
		{
			if( $.time.$fps)
				$.time.$fps.value='paused';
		}
		if( $.time.t===0)
			$.match_event('start');
		$.time.t++;
	}

	match.prototype.TU_trans=function()
	{
		var $=this;
		$.emit_event('transit');
		$.process_tasks();
		$.emit_event('TU');
		$.background.TU();
		if( $.panel)
			$.show_hp();
		//AI script runs at a lower framerate, and is still very reactive
		if( $.time.t%3===0)
			for( var i=0; i<$.AIscript.length; i++)
				$.AIscript[i].TU();
	}

	match.prototype.match_event=function(E)
	{
		var $=this;
		if( $.state && $.state.event) $.state.event.call(this, E);
	}

	match.prototype.emit_event=function(E)
	{
		var $=this;
		if( $.state && $.state.event) $.state.event.call(this, E);
		$.for_all(E);
	}

	match.prototype.for_all=function(oper)
	{
		var $=this;
		for( var objecttype in factory)
			for( var i in $[objecttype])
				$[objecttype][i][oper]();
	}

	match.prototype.process_tasks=function()
	{
		var $=this;
		for( var i=0; i<$.tasks.length; i++)
			$.process_task($.tasks[i]);
		$.tasks.length=0;
	}
	match.prototype.process_task=function(T)
	{
		var $=this;
		switch (T.task)
		{
		case 'create_object':
			if( T.opoint.kind===1)
			{
				if( T.opoint.oid)
				{
					var OBJ = util.select_from($.data.object,{id:T.opoint.oid});
					var config =
					{
						match: $,
						team: T.team
					};
					var obj = new factory[OBJ.type](config, OBJ.data, T.opoint.oid);
					obj.init(T.pos, T.z, T.dir, T.opoint);
					var uid = $.scene.add(obj);
					$[obj.type][uid] = obj;
				}
			}
		break;
		case 'destroy_object':
			var obj = T.obj;
			obj.destroy();
			var uid = $.scene.remove(obj);
			delete $[obj.type][uid];
		break;
		}
	}

	match.prototype.calculate_fps=function()
	{
		var $=this;
		var mul = 10;
		if( $.time.t%mul===0)
		{
			var ot=$.time.time;
			$.time.time = new Date().getTime();
			var diff = $.time.time-ot;
			$.time.$fps.value = Math.round(1000/diff*mul)+'fps';
		}
	}

	match.prototype.create_characters=function(players)
	{
		var $=this;
		var pos=[
			$.background.get_pos(0.55,0.5),
			$.background.get_pos(0.45,0.5),
			$.background.get_pos(0.40,0.5),
			$.background.get_pos(0.60,0.5)
		];
		var char_config =
		{
			match: $,
			controller: null,
			team: 0
		};
		for( var i=0; i<players.length; i++)
		{
			var player = players[i];
			var pdata = $.data.object[player.datanum].data;
			preload_pack_images($.data.object[player.datanum]);
			var controller = setup_controller(player);
			//create character
			var char = new factory.character(char_config, pdata, player.id);
			if( controller.type==='AIcontroller')
			{
				$.AIscript.push(new player.controller(char,$,controller));
			}
			//positioning
			char.set_pos( pos[i].x, pos[i].y, pos[i].z); //TODO: random player placements
			var uid = $.scene.add(char);
			$.character[uid] = char;
			//pane
			if( $.panel)
			{
				create_pane(i);
			}
		}
		function preload_pack_images(char)
		{
			for( var j=0; j<char.pack.length; j++)
			{
				var obj = char.pack[j].data;
				if( obj.bmp && obj.bmp.file)
				{
					for( var k=0; k<obj.bmp.file.length; k++)
					{
						var file = obj.bmp.file[k];
						for( var m in file)
						{
							if( typeof file[m]==='string' && m.indexOf('file')===0)
							{
								Fsprite.preload_image(file[m]);
							}
						}
					}
				}
			}
		}
		function setup_controller(player)
		{
			var controller;
			switch (player.controller.type)
			{
				case 'AIscript':
					controller = new AI.controller();
				break;
				default:
					controller = player.controller;
			}
			char_config.controller = controller;
			char_config.team = player.team;
			controller.sync = true;
			return controller;
		}
		function create_pane(i)
		{
			var spic = new Fsprite({
				canvas: util.div('panel'),
				img: pdata.bmp.small,
				wh: 'fit'
			});
			var X = $.data.UI.data.panel.pane_width*(i%4),
				Y = $.data.UI.data.panel.pane_height*Math.floor(i/4);
			spic.set_x_y( X+$.data.UI.data.panel.x, Y+$.data.UI.data.panel.y);
			$.panel[i].uid = uid;
			$.panel[i].spic = spic;
			$.panel[i].hp_bound = new Fsprite({canvas: util.div('panel')});
			$.panel[i].hp_bound.set_x_y( X+$.data.UI.data.panel.hpx, Y+$.data.UI.data.panel.hpy);
			$.panel[i].hp_bound.set_w_h( $.data.UI.data.panel.hpw, $.data.UI.data.panel.hph);
			$.panel[i].hp_bound.el.style.background = $.data.UI.data.panel.hp_dark;
			$.panel[i].hp = new Fsprite({canvas: util.div('panel')});
			$.panel[i].hp.set_x_y( X+$.data.UI.data.panel.hpx, Y+$.data.UI.data.panel.hpy);
			$.panel[i].hp.set_w_h( $.data.UI.data.panel.hpw, $.data.UI.data.panel.hph);
			$.panel[i].hp.el.style.background = $.data.UI.data.panel.hp_bright;
			$.panel[i].mp_bound = new Fsprite({canvas: util.div('panel')});
			$.panel[i].mp_bound.set_x_y( X+$.data.UI.data.panel.mpx, Y+$.data.UI.data.panel.mpy);
			$.panel[i].mp_bound.set_w_h( $.data.UI.data.panel.mpw, $.data.UI.data.panel.mph);
			$.panel[i].mp_bound.el.style.background = $.data.UI.data.panel.mp_dark;
			$.panel[i].mp = new Fsprite({canvas: util.div('panel')});
			$.panel[i].mp.set_x_y( X+$.data.UI.data.panel.mpx, Y+$.data.UI.data.panel.mpy);
			$.panel[i].mp.set_w_h( $.data.UI.data.panel.mpw, $.data.UI.data.panel.mph);
			$.panel[i].mp.el.style.background = $.data.UI.data.panel.mp_bright;
		}
	}

	match.prototype.show_hp=function()
	{
		var $=this;
		for( var i=0; i<$.panel.length; i++)
		{
			if( $.panel[i].uid!==undefined)
			{
				var ch = $.character[$.panel[i].uid],
					hp = Math.floor(ch.health.hp/ch.health.hp_full*$.data.UI.data.panel.hpw);
					hp_bound = Math.floor(ch.health.hp_bound/ch.health.hp_full*$.data.UI.data.panel.hpw);
				if( hp<0) hp=0;
				if( hp_bound<0) hp_bound=0;
				$.panel[i].hp.set_w(hp);
				$.panel[i].hp_bound.set_w(hp_bound);
				$.panel[i].mp.set_w(Math.floor(ch.health.mp/ch.health.mp_full*$.data.UI.data.panel.mpw));
			}
		}
	}

	match.prototype.create_effects=function(config)
	{
		var $=this;
		var effects_config = config ? config :
		{	//default effects config
			init_size: 20
		};
		effects_config.match = $;
		effects_config.stage = $.stage;

		var param = Futil.extract_array( $.grouped_object.effects, ['data','id']);
		$.effects[0] = new factory.effects ( effects_config, param.data, param.id);
		$.visualeffect = $.effects[0];
	}

	match.prototype.drop_weapons=function(setup)
	{
		var $=this;
		var A=$.background.get_pos(0.35,0.5),
			B=$.background.get_pos(0.70,0.5),
			C=$.background.get_pos(0.50,0.8);
		A.y=B.y=C.y=-800;
		$.create_weapon( 100, A);
		$.create_weapon( 101, B);
		$.create_weapon( 150, C);
	}

	match.prototype.create_weapon=function(id,pos)
	{
		var $=this;
		var weapon= id<150 ? 'lightweapon':'heavyweapon';
		var wea_config=
		{
			match: $
		};
		var object = util.select_from($.grouped_object[weapon],{id:id});
		var wea = new factory[weapon]( wea_config, object.data, object.id);
		wea.set_pos(pos.x,pos.y,pos.z);
		var uid = $.scene.add(wea);
		$[weapon][uid] = wea;
	}

	match.prototype.create_background=function(bg)
	{
		var $=this;
		if( bg)
		{
			var bgdata = util.select_from($.data.background,{id:bg.id}).data;
			$.background = new Background({
				layers:util.div('background'),
				floor:util.div('floor'),
				scrollbar:true,
				camerachase:{character:$.character}
			},bgdata,bg.id);
		}
		else
			$.background = new Background(null); //create an empty background
	}

	match.prototype.F7=function()
	{
		var $=this;
		for( var i in $.character)
		{
			var ch = $.character[i];
			ch.health.hp=ch.health.hp_full=ch.health.hp_bound= ch.proper('hp') || Global.gameplay.default.health.hp_full;
			ch.health.mp=ch.health.mp_full;
		}
	}

	match.prototype.new_randomseed=function()
	{
		var rand = new Random();
		rand.seed_bytime();
		return rand;
	}

	match.prototype.random=function()
	{
		return this.randomseed.next();
	}

	match.prototype.create_controller=function(funcon)
	{
		var $=this;
		function show_pause()
		{
			if( !$) return;
			if( $.time.paused)
				$.pause_mess.show();
		}
		if( funcon)
		{
			funcon.sync=true;
			funcon.child.push ({
				key: function(I,down)
				{
					var opaused = $.time.paused; //original pause state
					if( down)
					{
						switch (I)
						{
							case 'F1':
								if( !$.time.paused)
									$.time.paused=true;
								else
									$.time.paused=false;
							break;

							case 'F2':
								if( $.time.paused)
									$.TU_trans();
								else
									$.time.paused=true;
							break;
							
							case 'F4':
								$.destroy();
								$.manager.match_end();
							break;

							case 'F7':
								$.F7();
							break;
						}
						if( $.time.paused)
						{
							$.pause_mess.hide();
							setTimeout(show_pause,4); //so that the 'pause' message blinks
						}
						else
						{
							$.pause_mess.hide();
						}
						if( opaused !== $.time.paused)
						{	//state change
							if( $.time.paused)
							{
								if( funcon.paused)
									funcon.paused(true);
							}
							else
							{
								if( funcon.paused)
									funcon.paused(false);
							}
						}
					}
				}
			});
			return funcon;
		}
	}

	return match;
});

//a key changer utility for LF2

define('LF/keychanger',['F.core/controller'], function (Fcontroller)
{

function keychanger (append_at, controls)
{
	var brbr=create_at(append_at, 'br'),
		table=create_at(append_at, 'table'),
		row=[],
		change_active=false;
	
	table.style.display='inline-block';
	for( var i=0; i<9; i++)
		row[i]=create_at(table, 'tr');
	
	for( var i=0; i<controls.length; i++)
		new Control(controls[i], i);
	
	function Control(con, num)
	{
		var This=this;
		var head = add_cell(row[0],'player '+(num+1));
		head.colSpan='2';
		var type = add_cell(row[1],'');
		type.colSpan='2';
		if( con.role==='remote')
			type.innerHTML = 'network';
		else
			type.innerHTML = con.type;
		
		/*this.switch_type=function(to_type)
		{
			if( manager.locked)
				return;
			if( !to_type)
			{	//toggle
				for( var i=0; i<controls.length; i++)
				{
					if( controls[i]===This)
						continue;
					if( controls[i].type.innerHTML==='touch')
						return;
				}
				type.innerHTML = type.innerHTML==='keyboard'?'touch':'keyboard';
			}
			else
			{	//switch to type
				if( to_type!==type.innerHTML)
					type.innerHTML = to_type;
				else //same type, return
					return;
			}
			if( type.innerHTML==='keyboard')
				this.control = con;
			else if( type.innerHTML==='touch')
				this.control = touch;
			for( var i=2; i<9; i++)
				row[i].children[2*num-1].style.visibility=(type.innerHTML==='keyboard'?'visible':'hidden');
		}*/

		var i=2;
		if( con.type==='keyboard')
			for( var I in con.config)
				add_pair(row[i++],I);
		else
			for( var i=2; i<9; i++)
				empty_pair(row[i]);

		function add_pair(R,name)
		{
			add_cell(R,name);
			var cell=add_cell(R, con.config[name]);
			cell.style.cursor='pointer';
			var target;
			cell.onclick=function()
			{
				if( !change_active)
				{
					change_active=true;
					target=this;
					target.style.backgroundColor= '#FAA';
					document.addEventListener('keydown', keydown, true);
				}
			}
			function keydown(e)
			{
				if (!e) e = window.event;
				var value=e.keyCode;
				cell.innerHTML=Fcontroller.keycode_to_keyname(value);
				con.config[name]=Fcontroller.keycode_to_keyname(value);
				con.keycode[name]=value;
				target.style.backgroundColor= '#EEE';
				change_active=false;
				document.removeEventListener('keydown', keydown, true);
			}
		}
		function empty_pair(R)
		{
			add_cell(R,'');
			add_cell(R,'');
		}
	}

	function create_at(parent, tag, id)
	{
		var E = document.createElement(tag);
		parent.appendChild(E);
		if( id)
			E.id = id;
		return E;
	}

	function add_cell(row, content)
	{
		var td = create_at(row, 'td')
		td.innerHTML= content;
		return td;
	}
}

return keychanger;
});

/*\
 * touchcontroller
 * 
 * touch controller for LF2
\*/
define('LF/touchcontroller',['LF/util'],function(util)
{
	var controllers=[];
	var touches=[], eventtype;
	var locked=false;
	function touch_fun(event)
	{
		eventtype = event.type;
		touches = event.touches;
		for( var i in controllers)
			if( !controllers[i].sync)
				controllers[i].fetch();
		if( locked)
			event.preventDefault();
	}
	setTimeout(function()
	{
		locked=true;
	},6000);
	document.addEventListener('touchstart', touch_fun, false);
	document.addEventListener('touchmove', touch_fun, false);
	document.addEventListener('touchenter', touch_fun, false);
	document.addEventListener('touchend', touch_fun, false);
	document.addEventListener('touchleave', touch_fun, false);
	document.addEventListener('touchcancel', touch_fun, false);
	window.addEventListener('resize', function()
	{
		for( var i=0; i<controllers.length; i++)
			controllers[i].resize();
	}, false);

	function TC(config)
	{
		var $=this;
		$.config=config;
		if( $.config.layout==='gamepad')
		{
			$.state={ up:0,down:0,left:0,right:0,def:0,jump:0,att:0 };
			$.button={
				up:{label:'&uarr;'},down:{label:'&darr;'},left:{label:'&larr;'},right:{label:'&rarr;'},
				def:{label:'D'},jump:{label:'J'},att:{label:'A'}
			};
		}
		else if( $.config.layout==='functionkey')
		{
			$.state={ F1:0,F2:0,F4:0,F7:0};
			$.button={
				F1:{label:'F1'},F2:{label:'F2'},F4:{label:'F4'},F7:{label:'F7'}
			};
		}
		$.child=[];
		$.sync=true;
		$.pause_state=false;
		controllers.push(this);
		for( var key in $.button)
		{
			var el = document.createElement('div');
			document.getElementsByClassName('LFtouchControlHolder')[0].appendChild(el);
			el.className = 'touchControllerButton';
			el.innerHTML = '<span>'+$.button[key].label+'</span>';
			$.button[key].el = el;
		}
		$.resize();
	}
	TC.prototype.type = 'touch';
	TC.prototype.resize=function()
	{
		var $=this;
		var w = window.innerWidth,
			h = window.innerHeight;
		if( $.config.layout==='gamepad')
		{
			var sizeA = 0.20,
				sizeB = 0.20,
				padL = 0.1,
				padR = 0.2,
				offy = 0,
				R = 0.75;
			if( h>w)
			{
				offy = h/2;
				h = w/16*9*1.5;
			}
			sizeA = sizeA*h;
			sizeB = sizeB*h;
			var Bup = $.button['up'],
				Bdown = $.button['down'],
				Bleft = $.button['left'],
				Bright= $.button['right'],
				Bdef = $.button['def'],
				Bjump = $.button['jump'],
				Batt = $.button['att'];
			Bup.left = sizeA*padL;
			Bup.top = h/2-sizeA+offy;
			Bup.right = Bup.left+sizeA*2;
			Bup.bottom = Bup.top+sizeA*R;
			Bdown.left = sizeA*padL;
			Bdown.top = h/2+sizeA*(1-R)+offy;
			Bdown.right = Bdown.left+sizeA*2;
			Bdown.bottom = Bdown.top+sizeA*R;
			Bleft.left = sizeA*padL;
			Bleft.top = h/2-sizeA+offy;
			Bleft.right = Bleft.left+sizeA*R;
			Bleft.bottom = Bleft.top+sizeA*2;
			Bright.left = sizeA*(2-R+padL);
			Bright.top = h/2-sizeA+offy;
			Bright.right = Bright.left+sizeA*R;
			Bright.bottom = Bright.top+sizeA*2;
			Bdef.left = w-sizeB*(1.5+padR);
			Bdef.top = h/2+offy;
			Bdef.right = Bdef.left+sizeB;
			Bdef.bottom = Bdef.top+sizeB;
			Bjump.left = w-sizeB*(2+padR);
			Bjump.top = h/2-sizeB+offy;
			Bjump.right = Bjump.left+sizeB;
			Bjump.bottom = Bjump.top+sizeB;
			Batt.left = w-sizeB*(1+padR);
			Batt.top = h/2-sizeB+offy;
			Batt.right = Batt.left+sizeB;
			Batt.bottom = Batt.top+sizeB;
			set_xy_wh(Bup);
			set_xy_wh(Bdown);
			set_xy_wh(Bleft);
			set_xy_wh(Bright);
			set_xy_wh(Bdef);
			set_xy_wh(Bjump);
			set_xy_wh(Batt);
		}
		else if( $.config.layout==='functionkey')
		{
			$.paused($.pause_state);
		}
	}
	TC.prototype.paused=function(pause)
	{
		var $=this;
		var w = window.innerWidth,
			h = window.innerHeight;
		this.pause_state=pause;
		if( $.config.layout==='functionkey')
		{
			var size = 0.08*(h<w?h:w),
				offy = 0,
				offx = 0;
			if( h>w)
			{
				offy = h/3.5;
				offx = -w/4;
			}
			if( pause)
			{
				//expand the collection
				var F1 = $.button['F1'],
					F2 = $.button['F2'],
					F4 = $.button['F4'],
					F7 = $.button['F7'];
				F1.left = w/3-size/2+offx;
				F1.right = w/3+size/2+offx;
				F1.top = h/4.5-size/2+offy;
				F1.bottom = h/4.5+size/2+offy;
				//
				F2.left = F1.left+size*1.5;
				F2.right = F1.right+size*1.5;
				F4.left = F1.left+size*1.5*3;
				F4.right = F1.right+size*1.5*3;
				F7.left = F1.left+size*1.5*6;
				F7.right = F1.right+size*1.5*6;
				for( var i in {F1:0,F2:0,F4:0,F7:0})
				{
					$.button[i].top = F1.top;
					$.button[i].bottom = F1.bottom;
					show($.button[i]);
					set_xy_wh($.button[i]);
					$.button[i].disabled=30; //disable for 30 frames
				}
			}
			else
			{
				var F1 = $.button['F1'];
				F1.left = w/2-size/2;
				F1.right = w/2+size/2;
				F1.top = h/4.5-size/2+offy;
				F1.bottom = h/4.5+size/2+offy;
				set_xy_wh(F1);
				show(F1);
				F1.disabled=false;
				for( var i in {F2:0,F4:0,F7:0})
				{
					for( var j in {left:0,top:0,right:0,bottom:0})
						$.button[i][j] = F1[j];	
					set_xy_wh($.button[i]);
					hide($.button[i]);
					$.button[i].disabled=true;
				}
			}
		}
	}
	TC.prototype.hide=function()
	{
		var $=this;
		for( var i in $.button)
		{
			hide($.button[i]);
			$.button[i].disabled=true;
		}
	}
	TC.prototype.show=function()
	{
		var $=this;
		for( var i in $.button)
		{
			show($.button[i]);
			$.button[i].disabled=false;
		}
	}
	TC.prototype.restart=function()
	{
		var $=this;
		if( $.config.layout==='functionkey')
		{
			this.paused(false);
		}
	}
	function set_xy_wh(B)
	{
		B.el.style.left = B.left+'px';
		B.el.style.top = B.top+'px';
		B.el.style.width = (B.right-B.left)+'px';
		B.el.style.height = (B.bottom-B.top)+'px';
	}
	function show(B)
	{
		B.el.style.visibility='visible';
	}
	function hide(B)
	{
		B.el.style.visibility='hidden';
	}
	function inbetween(x,L,R)
	{
		var l,r;
		if ( L<=R)
		{	l=L;
			r=R;
		}
		else
		{	l=R;
			r=L;
		}
		return x>=l && x<=r;
	}
	function point_in_rect(Px,Py,R)
	{
		return (inbetween(Px,R.left,R.right) && inbetween(Py,R.top,R.bottom));
	}
	TC.prototype.clear_states=function()
	{
		for(var I in this.state)
			this.state[I]=0;
	}
	TC.prototype.fetch=function()
	{
		var $=this;
		for( var key in $.button)
		{
			if( $.button[key].disabled)
			{
				if( typeof $.button[key].disabled==='number')
					$.button[key].disabled--;
				continue;
			}
			var down=false;
			for (var i=0; i<touches.length; i++)
			{
				var T=touches[i];
				if( point_in_rect(T.clientX,T.clientY,$.button[key]))
				{
					down=true;
					break;
				}
			}
			if ((down && !$.state[key]) || (!down && $.state[key]))
			{
				for( var i=0; i<$.child.length; i++)
					$.child[i].key(key,down);
				$.state[key]=down;
			}
		}
	}
	TC.prototype.flush=function()
	{
	}

	return TC;
});
define('LF/manager',['LF/network','LF/match','LF/util','LF/keychanger','LF/touchcontroller',
'F.core/util','F.core/sprite','F.core/animator','F.core/controller','F.core/support'],
function(network,Match,util,Keychanger,Touchcontroller,
Futil,Fsprite,Fanimator,Fcontroller,Fsupport)
{

function Manager(package)
{
	//organize package
	for( var i=0; i<package.data.object.length; i++)
	{
		if( package.data.object[i].type==='character')
		{
			//if `deep.js` is of type character, select all files matching `deep_*`
			var name = util.filename(package.data.object[i].file);
			var objects = util.select_from(package.data.object,function(O){
				if( !O.file) return false;
				var file = util.filename(O.file);
				if( file===name) return false;
				if( file.lastIndexOf('_')!==-1)
					file = file.slice(0,file.lastIndexOf('_'));
				return file===name;
			});
			objects = Futil.make_array(objects);
			package.data.object[i].pack = objects; //each character has a specialattack pack
		}
	}
	
	var sel = package.data.UI.data.character_selection;
	var control0, control1, functionkey_control;
	var t = 0,
		step = 0,
		setting_computer = -1,
		char_list,
		img_list,
		AI_list,
		player,
		pause_mess,
		timer;
	
	this.create=function()
	{
		var param = util.location_parameters();
		
		// save settings
		var control_con0 =
		{
			up:'u',down:'m',left:'h',right:'k',def:',',jump:'i',att:'j'
		};
		var control_con1 =
		{
			up:'w',down:'x',left:'a',right:'d',def:'z',jump:'q',att:'s'
		};
		var functionkey_config =
		{
			'F1':'F1','F2':'F2','F3':'F3','F4':'F4','F5':'F5','F6':'F6','F7':'F7','F8':'F8','F9':'F9','F10':'F10'
		};
		if( Fsupport.localStorage)
		{
			window.addEventListener('beforeunload',function(){
				var obj =
				{
					controller:
					[
						control0.config, control1.config
					]
				};
				Fsupport.localStorage.setItem('F.LF/settings',JSON.stringify(obj));
			},false);

			if( Fsupport.localStorage.getItem('F.LF/settings'))
			{
				var obj = JSON.parse(Fsupport.localStorage.getItem('F.LF/settings'));
				if( obj.controller[0])
					control_con0 = obj.controller[0];
				if( obj.controller[1])
					control_con1 = obj.controller[1];
			}
		}

		//
		// F.LF setup
		//

		//setup resource map
		util.setup_resourcemap(package,Fsprite);
		
		//touch support
		var support_touch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
		if( support_touch) hide(util.div('windowCaptionButtonBar'));
		
		//controllers
		if( param.pvp)
		{
			if( param.pvp==='active')
			{
				control0 = new network.controller('local',new_controller(control_con0));
				control1 = new network.controller('remote',control_con1);
				functionkey_control = new network.controller('dual',new_functionkey_control());
			}
			else
			{
				control0 = new network.controller('remote',control_con0);
				control1 = new network.controller('local',new_controller(control_con1));
				functionkey_control = new network.controller('dual',new_functionkey_control());
			}
		}
		else
		{
			control0 = new_controller(control_con0);
			control1 = new Fcontroller(control_con1);
			functionkey_control = new_functionkey_control();
		}
		control0.sync=true;
		control1.sync=true;
		function new_controller(config)
		{
			if( !support_touch)
				return new Fcontroller(config);
			else
				return new Touchcontroller({layout:'gamepad'});
		}
		function new_functionkey_control()
		{
			if( !support_touch)
				return new Fcontroller(functionkey_config);
			else
				return new Touchcontroller({layout:'functionkey'});
		}

		//key changer
		Keychanger(util.div('keychanger'), [control0, control1]);

		//prepare
		char_list = util.select_from(package.data.object,{type:'character'});
		img_list = Futil.extract_array(char_list,'pic').pic;
		img_list.waiting = sel.waiting.pic;
		AI_list = package.data.AI;

		//
		// UI stuff
		//

		//create UI for character selection
		var bg = new Fsprite({
			canvas: util.div('characterSelection'),
			img: package.data.UI.data.character_selection.pic,
			wh: 'fit'
		});
		player = [];
		for( var i=0; i<2; i++)
		{
			//sprite & animator
			var sp = new Fsprite({
				canvas: util.div('characterSelection'),
				img: img_list,
				wh: {x:sel.waiting.w,y:sel.waiting.h}
			});
			sp.set_x_y(sel.posx[i],sel.posy[i-i%4]);
			var ani_config=
			{
				x:0, y:0,          //top left margin of the frames
				w:sel.waiting.w, h:sel.waiting.h,//width, height of a frame
				gx:2,gy:1,         //define a gx*gy grid of frames
				tar:sp             //target F_sprite
			}
			var ani = new Fanimator(ani_config);
			//text boxes
			var textbox = [];
			for( var j=0; j<3; j++)
			{
				var tbc=
				{
					canvas: util.div('characterSelection'),
					wh: {x:sel.text.box_width,y:sel.text.box_height}
				};
				var box = new Fsprite(tbc);
				box.set_x_y(sel.posx[i],sel.posy[i-i%4+j+1]);
				box.el.classList.add('characterSelectionTextBox');
				textbox.push(box.el);
			}
			//
			player.push({
				waiting:ani,
				textbox:textbox,
				box:sp,
				selected:i+1,
				selected_AI:0,
				step:0,
				name:i+1,
				team:i+1,
				type:''
			});
			this.show_step(i);
		}
		//create UI for gameplay
		if( util.div('pauseMessage'))
		{
			pause_mess = new Fsprite({
				div: util.div('pauseMessage'),
				img: package.data.UI.data.pause,
				wh: 'fit'
			});
			pause_mess.hide();
		}
		if( util.div('panel'))
		{
			var panel=[];
			for( var i=0; i<8; i++)
			{
				var pane = new Fsprite({
					canvas: util.div('panel'),
					img: package.data.UI.data.panel.pic,
					wh: 'fit'
				});
				pane.set_x_y(package.data.UI.data.panel.pane_width*(i%4), package.data.UI.data.panel.pane_height*Math.floor(i/4));
				panel.push(pane);
			}
		}
		//
		this.match_end();
		this.start_match();
	}
	this.frame=function()
	{
		for( var i in player)
		{
			switch (player[i].step)
			{
				case 0:
					if( step===0)
						player[i].waiting.next_frame();
					player[i].textbox[0].style.color = sel.text.color[t%2];
				break;
				case 1:
					player[i].textbox[1].style.color = sel.text.color[t%2];
				break;
				case 2:
					player[i].textbox[2].style.color = sel.text.color[t%2];
				break;
			}
		}
		control0.fetch();
		control1.fetch();
		t++;
	}
	this.key=function(i,key)
	{
		if( key==='att')
		{
			if( step===0)
			{
				player[i].type='human';
				player[i].step++;
			}
			else if( step===1)
			{
				if( player[i].type!=='human')
					return;
				i = setting_computer;
				player[i].step++;
			}

			var finished=true;
			for( var k=0; k<player.length; k++)
				finished = finished && (player[k].step===0||player[k].step===3);
			if( finished && step===0)
			{
				if( player[0].step===3 && player[1].step===3)
				{
					this.start_match();
				}
				else
				{
					setting_computer = (player[0].step===3?1:0);
					i = setting_computer;
					player[i].step = 0;
					player[i].type = 'computer';
					step++;
				}
			}
			else if( finished && step===1)
			{
				if( player[0].step===3 && player[1].step===3)
				{
					this.start_match();
				}
			}
		}
		if( key==='jump')
		{
			if( step===1)
			{
				if( player[i].type!=='human')
					return;
				i = setting_computer;
				if( player[i].step>0)
					player[i].step--;
			}
			if( step===0)
			{
				if( player[i].step>0)
					player[i].step--;
			}
		}
		if( key==='right')
		{
			if( step===1)
			{
				if( player[i].type!=='human')
					return;
				i = setting_computer;
			}
			if( player[i].step===1)
			{
				player[i].selected++;
				if( player[i].selected>=char_list.length)
					player[i].selected = 0;
			}
			if( player[i].step===0 && player[i].type==='computer')
			{
				player[i].selected_AI++;
				if( player[i].selected_AI>=AI_list.length)
					player[i].selected_AI = 0;
			}
		}
		if( key==='left')
		{
			if( step===1)
			{
				if( player[i].type!=='human')
					return;
				i = setting_computer;
			}
			if( player[i].step===1)
			{
				player[i].selected--;
				if( player[i].selected<0)
					player[i].selected = char_list.length-1;
			}
			if( player[i].step===0 && player[i].type==='computer')
			{
				player[i].selected_AI--;
				if( player[i].selected_AI<0)
					player[i].selected_AI = AI_list.length-1;
			}
		}
		this.show_step(i);
	}
	this.show_step=function(i)
	{
		if( step===0)
		{
			switch (player[i].step)
			{
				case 0:
					player[i].textbox[0].innerHTML = 'Join?';
					player[i].textbox[1].innerHTML = '';
					player[i].textbox[2].innerHTML = '';
					player[i].box.switch_img('waiting');
				break;
				case 1:
					player[i].textbox[0].style.color = sel.text.color[2];
					player[i].textbox[0].innerHTML = player[i].name;
					player[i].textbox[1].innerHTML = char_list[player[i].selected].name;
					player[i].textbox[2].innerHTML = '';
					player[i].waiting.rewind();
					player[i].box.switch_img(player[i].selected);
				break;
				case 2:
					player[i].textbox[1].style.color = sel.text.color[2];
					player[i].textbox[2].innerHTML = 'Team '+player[i].team;
				break;
				case 3:
					player[i].textbox[2].style.color = sel.text.color[2];
				break;
			}
		}
		else if( step===1)
		{
			i = setting_computer;
			switch (player[i].step)
			{
				case 0:
					player[i].name = AI_list[player[i].selected_AI].name;
					player[i].textbox[0].innerHTML = player[i].name;
					player[i].textbox[1].innerHTML = char_list[player[i].selected].name;
					player[i].textbox[2].innerHTML = '';
					player[i].waiting.rewind();
					player[i].box.switch_img(player[i].selected);
				break;
				case 1:
					player[i].textbox[0].style.color = sel.text.color[2];
					player[i].textbox[1].innerHTML = char_list[player[i].selected].name;
					player[i].textbox[2].innerHTML = '';
					player[i].box.switch_img(player[i].selected);
				break;
				case 2:
					player[i].textbox[1].style.color = sel.text.color[2];
					player[i].textbox[2].innerHTML = 'Team '+player[i].team;
				break;
				case 3:
					player[i].textbox[2].style.color = sel.text.color[2];
				break;
			}
		}
	}
	this.match_end=function(event)
	{
		show(util.div('characterSelection'));
		hide(util.div('gameplay'));
		if( functionkey_control.type==='touch')
			functionkey_control.hide();

		//create timer
		var This=this;
		step = 0;
		timer = network.setInterval(function(){This.frame();},1000/12);
		//create controller listener
		control0.child=[{
			key:function(K,D){if(D)This.key(0,K);}
		}];
		control1.child=[{
			key:function(K,D){if(D)This.key(1,K);}
		}];
		functionkey_control.child=[];
		//reset
		step = 0;
		for( var i=0; i<player.length; i++)
		{
			player[i].step = 0;
			player[i].type = 'human';
			player[i].name = i+1;
			player[i].team = i+1;
			this.show_step(i);
		}
	}
	this.start_match=function()
	{
		hide(util.div('characterSelection'));
		show(util.div('gameplay'));
		if( functionkey_control.restart)
			functionkey_control.restart();

		network.clearInterval(timer);

		control0.child=[];
		control1.child=[];
		functionkey_control.child=[];
		control0.clear_states();
		control1.clear_states();

		var match = new Match
		({
			manager: this,
			stage: util.div('floor'),
			state: null,
			config: null,
			package: package
		});

		match.create
		({
			player:
			[
				{
					controller: player[0].type==='human'?control0:AI_list[player[0].selected_AI].data,
					datanum: player[0].selected,
					team: player[0].team
				},
				{
					controller: player[1].type==='human'?control1:AI_list[player[1].selected_AI].data,
					datanum: player[1].selected,
					team: player[1].team
				}
			],
			control: functionkey_control,
			set:
			{
				weapon: true
			},
			background: {id:1},
			pause_mess: pause_mess
		});
	}
	//constructor
	this.create();
}

//util
function show(div)
{
	div.style.display='';
}
function hide(div)
{
	div.style.display='none';
}
function show_hide(div)
{
	div.style.display= div.style.display===''?'none':'';
}

return Manager;
});
define('F.core/css!LF/application.css', ['F.core/css-embed'], 
function(embed)
{
	embed(
	'.LFroot {  -webkit-user-select: none;  -khtml-user-select: none;  -moz-user-select: none;  -ms-user-select: none;  user-select: none;  overflow: hidden;  position:absolute;  left:0px; top:0px;  width:100%; height:100%; } .LFcontainer {  position:absolute;  left:0px; top:0px;  font-family:Arial,sans;  font-size:18px; } .window {  position:relative;  width:794px;  height:550px;  border:5px solid #676767; } .window > div {  position:absolute;  left:0; top:0;  right:0; bottom:0; } .bgviewer .window {  height:400px; } .wideWindow .window {  height:422px;  border-left:none;  border-right:none; } .windowCaption {  position:relative;  top:0px;  width:804px; height:30px;  background:#676767;  z-index:100; } .windowCaptionTitle {  font-family:"Segoe UI",Arial,sans;  font-size:20px;  color:#FFF;  width:90%;  text-align:center;  padding:2px 0px 5px 50px;  text-shadow:0px 0px 5px #AAA; } .windowCaptionButtonBar {  position:absolute;  top:0px; right:0px;  height:100%;  -webkit-user-select: none;  -khtml-user-select: none;  -moz-user-select: none;  -ms-user-select: none;  user-select: none; } .windowCaptionButtonBar > * {  background:#1878ca;  /* blue:#1878ca, red:#c74f4f; */  float:right;  width:auto; height:85%;  padding:0 10px 0 10px;  margin-right:10px;  text-align:center;  text-decoration:none;  font-size:10px;  color:#FFF;  cursor:pointer; } .windowCaptionButtonBar > *:hover {  background:#248ce5; } .unisym {  font-family: Arial Unicode MS, FreeSerif, serif;  font-size: 18px; } .ProjectFbutton {  background:#7c547c; } .ProjectFbutton:hover {  background:#9d6e9d; } .gameplay {  z-index:1; } .panel {  position:absolute;  background:#000;  left:0; top:0;  width:100%; height:128px;  z-index:2; } .wideWindow .panel {  opacity:0.7;  background:#555; } .background {  position:absolute;  left:0; top:0;  width:100%; height:550px;  z-index:-1;  overflow:hidden; } .maximized .background {  overflow:visible; } .bgviewer .background, .wideWindow .background {  top:-128px; } .floorHolder {  position:absolute;  left:0; top:0;  width:100%; height:550px;  overflow:hidden;  z-index:1; } .maximized .floorHolder {  overflow:visible; } .bgviewer .floorHolder, .wideWindow .floorHolder {  top:-128px; } .floor {  position:absolute;  left:0; top:0;  width:1000px;  height:100%; } .topStatus {  position:absolute;  left:0; top:106px;  width:100%; height:22px;  line-height:22px;  z-index:3; } .bottomStatus {  position:absolute;  bottom:0px;  width:100%; height:22px;  line-height:22px;  background:#000;  text-align:right; } .fps {  float:left;  border:none;  background:none;  width:50px;  color:#FFF;  padding:0 5px 0 5px; } .footnote {  font-family:"MS PMincho",monospace;  font-size:12px;  text-shadow: 0px -1px 2px #666, 1px 0px 2px #666, 0px 2px 2px #666, -2px 0px 2px #666;  letter-spacing:2px;  color:#FFF; } .backgroundScroll {  position:absolute;  width:100%;  top:550px;  overflow-x:scroll;  overflow-y:hidden; } .maximized .backgroundScroll {  display:none; } .wideWindow .backgroundScroll {  top:422px; } .backgroundScrollChild {  position:absolute;  left:0; top:0;  height:1px; } .bgviewer .backgroundScroll {  top:400px;  z-index:10; } .windowMessageHolder {  position:absolute;  left:0; top:0;  width:100%; height:100%; } .windowMessageHolder div {  position:absolute;  left:0; top:0;  right:0; bottom:0;  margin:auto; } .errorMessage {  color:#F00;  height:20%;  text-align:center; } .touchControllerButton {  position:absolute;  border:2px solid rgba(170, 255, 255, 0.5);  display:table;  color:#FFF;  font-size:20px;  opacity:0.5;     transition:left 0.5s; } .touchControllerButton > span {  display:table-cell;  vertical-align:middle;  text-align:center; } .projectFmessage {  display:none; } .characterSelection {  z-index:2; } .settings {  z-index:3; } .keychanger {  position:absolute;  right:0;  font-size:12px;  text-align:center;  padding:10px;  background:#FFF; } .keychanger td {  border: 1px solid #AAA;  background: #EEE;  font-family: monospace;  width: 40px;  text-align: center; } .characterSelectionTextBox {  font-family:Helvetica,sans-serif;  font-weight:bold;  font-size:13px;  color:#FFF;  text-align:center;     transition:color 0.1s; }'
	);
	return true;
});

(function (){
	if( document.getElementById('flf-config'))
	{
		var config = document.getElementById('flf-config').innerHTML;
		config = JSON.parse(config);
		if( config.location)
			requirejs.config(
			{
				baseUrl: config.location,
				paths:
				{
				},
				config:
				{
				}
			});
	}
}());

requirejs(['F.core/support',
'LF/loader!packages','LF/manager',
'LF/util','LF/global','F.core/css!LF/application.css'],
function(Fsupport,
package,Manager,
util,global){

	if (typeof console === 'undefined'){
		console={};
		console.log = function(){
			return;
		}
	}

	console.log(util.div('projectFmessage').innerHTML);

	//feature check
	if( !Fsupport.css2dtransform && !Fsupport.css3dtransform)
	{
		var mess = util.div('errorMessage');
		mess.innerHTML=
			'Sorry, your browser does not support CSS transform.<br>'+
			'Please update to a latest HTML5 browser.';
		return;
	}

	//analytics
	if( window.location.href.indexOf('http')===0)
	{
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','http://www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-37320960-5', 'tyt2y3.github.io');
		ga('send', 'pageview');
	}

	//
	// UI window
	//
	var UI_state=
	{
		maximized:false,
		wide:false
	};
	function resizer(ratio)
	{
		if( UI_state.maximized)
		{
			if( window.innerWidth/window.innerHeight > 15/9)
			{
				if( !UI_state.wide)
				{
					UI_state.wide=true;
					util.div().classList.add('wideWindow');
					//double arrow symbol '&#8622;&#8596;'
				}
			}
			else
			{
				if( UI_state.wide)
				{
					UI_state.wide=false;
					util.div().classList.remove('wideWindow');
				}
			}
			
			if( typeof ratio!=='number')
			{
				var ratioh = window.innerHeight/parseInt(window.getComputedStyle(util.container,null).getPropertyValue('height')),
					ratiow = window.innerWidth/parseInt(window.getComputedStyle(util.container,null).getPropertyValue('width'));
				ratio = ratioh<ratiow? ratioh:ratiow;
				ratio = Math.floor(ratio*100)/100;
			}
			var canx = window.innerWidth/2-parseInt(window.getComputedStyle(util.container,null).getPropertyValue('width'))/2*ratio;
			if( ratio===1) canx=0;
			if( Fsupport.css3dtransform)
			{
				util.container.style[Fsupport.css3dtransform+'Origin']= '0 0';
				util.container.style[Fsupport.css3dtransform]=
					'translate3d('+canx+'px,0,0) '+
					'scale3d('+ratio+','+ratio+',1.0) ';
			}
			if( Fsupport.css2dtransform)
			{
				util.container.style[Fsupport.css2dtransform+'Origin']= '0 0';
				util.container.style[Fsupport.css2dtransform]=
					'translate('+canx+'px,0) '+
					'scale('+ratio+','+ratio+') ';
			}
		}
	}
	function onresize()
	{
		if( window.innerWidth<global.application.window.width ||
			window.innerHeight<global.application.window.height )
		{
			if( !UI_state.maximized)
			{
				util.div('maximizeButton').onclick();
			}
		}
		resizer();
	}
	util.div('maximizeButton').onclick=function()
	{
		if( Fsupport.css2dtransform)
		{
			if( !UI_state.maximized)
			{
				UI_state.maximized=true;
				this.firstChild.innerHTML='&#9724;';
				util.div().classList.add('maximized');
				document.body.style.background='#888';
				resizer();
			}
			else
			{
				this.firstChild.innerHTML='&#9723;';
				util.div().classList.remove('maximized');
				document.body.style.background='';
				resizer(1);
				UI_state.maximized=false;
				if( UI_state.wide)
				{
					UI_state.wide=false;
					util.div().classList.remove('wideWindow');
				}
			}
		}
	}
	window.addEventListener('resize', onresize, false);
	onresize();
	
	hide(util.div('settings'));
	util.div('settingsButton').onclick=function()
	{
		show_hide(util.div('settings'));
	}
	
	//process parameters
	var param = util.location_parameters();
	if( param)
	{
		if( param.embed)
			util.div('maximizeButton').onclick=function()
			{
				var link=document.createElement('a');
				link.href = 'demo4.html?max';
				link.target='_blank';
				link.style.display='none';
				var body = document.getElementsByTagName('body')[0];
				body.appendChild(link);
				link.click();
			}
		if( param.max)
			util.div('maximizeButton').onclick();
	}

	requirejs(['./buildinfo.js'],function(buildinfo){
		util.div('footnote').innerHTML+=
			(buildinfo.timestamp==='unbuilt'?'unbuilt demo':'built on: '+buildinfo.timestamp);
	});

	//util
	function show(div)
	{
		div.style.display='';
	}
	function hide(div)
	{
		div.style.display='none';
	}
	function show_hide(div)
	{
		div.style.display= div.style.display===''?'none':'';
	}

	var manager = new Manager(package);

});

define("LF/demo/demo4", function(){});
