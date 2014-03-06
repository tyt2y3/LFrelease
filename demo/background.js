
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

define('F.core/css!LF/application.css', ['F.core/css-embed'], 
function(embed)
{
	embed(
	'.LFroot {  -webkit-user-select: none;  -khtml-user-select: none;  -moz-user-select: none;  -ms-user-select: none;  user-select: none;  overflow: hidden;  position:absolute;  left:0px; top:0px;  width:100%; height:100%; } .LFcontainer {  position:absolute;  left:0px; top:0px;  font-family:Arial,sans;  font-size:18px; } .window {  position:relative;  width:794px;  height:550px;  border:5px solid #676767; } .bgviewer .window {  height:400px; } .wideWindow .window {  height:422px;  border-left:none;  border-right:none; } .windowCaption {  position:relative;  top:0px;  width:804px; height:30px;  background:#676767;  z-index:100; } .windowCaptionTitle {  font-family:"Segoe UI",Arial,sans;  font-size:20px;  color:#FFF;  width:90%;  text-align:center;  padding:2px 0px 5px 50px;  text-shadow:0px 0px 5px #AAA; } .windowCaptionButtonBar {  position:absolute;  top:0px; right:0px;  height:100%;  -webkit-user-select: none;  -khtml-user-select: none;  -moz-user-select: none;  -ms-user-select: none;  user-select: none; } .windowCaptionButtonBar > * {  background:#1878ca;  /* blue:#1878ca, red:#c74f4f; */  float:right;  width:auto; height:85%;  padding:0 10px 0 10px;  margin-right:10px;  text-align:center;  text-decoration:none;  font-size:12px;  color:#FFF;  cursor:pointer; } .windowCaptionButtonBar > *:hover {  background:#248ce5; } .ProjectFbutton {  background:#7c547c; } .ProjectFbutton:hover {  background:#9d6e9d; } .keychanger {  position:absolute;  right:0px;  top:30px;  border:1px solid #AAA;  font-size:12px;  padding:10px; } .panel {  position:absolute;  background:#000;  left:0; top:0;  width:100%; height:128px;  z-index:2; } .wideWindow .panel {  opacity:0.7;  background:#555; } .background {  position:absolute;  left:0; top:0;  width:100%; height:550px;  z-index:-1;  overflow:hidden; } .maximized .background {  overflow:visible; } .bgviewer .background, .wideWindow .background {  top:-128px; } .floorHolder {  position:absolute;  left:0; top:0;  width:100%; height:550px;  overflow:hidden;  z-index:1; } .maximized .floorHolder {  overflow:visible; } .bgviewer .floorHolder, .wideWindow .floorHolder {  top:-128px; } .floor {  position:absolute;  left:0; top:0;  width:1000px;  height:100%; } .topStatus {  position:absolute;  left:0; top:106px;  width:100%; height:22px;  line-height:22px;  z-index:3; } .bottomStatus {  position:absolute;  bottom:0px;  width:100%; height:22px;  line-height:22px;  background:#000;  text-align:right; } .fps {  float:left;  border:none;  background:none;  width:50px;  color:#FFF;  padding:0 5px 0 5px; } .footnote {  font-family:"MS PMincho",monospace;  font-size:12px;  text-shadow: 0px -1px 2px #666, 1px 0px 2px #666, 0px 2px 2px #666, -2px 0px 2px #666;  letter-spacing:2px;  color:#FFF; } .backgroundScroll {  position:absolute;  width:100%;  top:550px;  overflow-x:scroll;  overflow-y:hidden; } .maximized .backgroundScroll {  display:none; } .wideWindow .backgroundScroll {  top:422px; } .backgroundScrollChild {  position:absolute;  left:0; top:0;  height:1px; } .bgviewer .backgroundScroll {  top:400px;  z-index:10; } .windowMessageHolder {  position:absolute;  left:0; top:0;  width:100%; height:100%; } .windowMessageHolder div {  position:absolute;  left:0; top:0;  right:0; bottom:0;  margin:auto; } .errorMessage {  color:#F00;  height:20%;  text-align:center; } .touchControllerButton {  position:absolute;  border:2px solid rgba(170, 255, 255, 0.5);  display:table;  color:#FFF;  font-size:20px;  opacity:0.5;     transition:left 0.5s; } .touchControllerButton > span {  display:table-cell;  vertical-align:middle;  text-align:center; } .projectFmessage {  display:none; } .characterSelection {  position:absolute;  left:0; top:0;  width:100%; height:100%;  z-index:10; } .characterSelectionTextBox {  font-family:Helvetica,sans;  font-weight:bold;  font-size:13px;  color:#FFF;  text-align:center;     transition:color 0.1s; }'
	);
	return true;
});

//component test of background.js
requirejs.config({
	baseUrl: '../../',
	config:
	{
		'F.core/sprite':
		{
			baseUrl: '../../LFrelease/LF2_19/'
		}
	}
});

requirejs(['LF/background',
'F.core/css!LF/application.css',
'LFrelease/LF2_19/bg/hkc/bg',
'LFrelease/LF2_19/bg/lf/bg',
'LFrelease/LF2_19/bg/sp/bg',
'LFrelease/LF2_19/bg/gw/bg',
'LFrelease/LF2_19/bg/qi/bg',
'LFrelease/LF2_19/bg/ft/bg',
'LFrelease/LF2_19/bg/cuhk/bg',
'LFrelease/LF2_19/bg/thv/bg',
'LFrelease/LF2_19/bg/template/bg'
],function(background,css_loaded)
{
	for( var i=2; i<arguments.length; i++)
	{
		var LFwindow = document.getElementById('template').cloneNode(true);
		LFwindow.id='bg'+(i-1);
		document.body.appendChild(LFwindow);
		new background({
			layers: LFwindow.getElementsByClassName('background')[0],
			scrollbar: true,
			standalone: { carousel: 'linear'}
		},arguments[i],1);
	}
});
define("LF/demo/background", function(){});
