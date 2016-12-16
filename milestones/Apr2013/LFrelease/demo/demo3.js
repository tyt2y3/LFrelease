define("F.core/controller", [], function() {
	function e(e) {
		return n.key(e, 1)
	}

	function t(e) {
		return n.key(e, 0)
	}

	function r(e) {
		this.state = {}, this.config = e, this.keycode = {}, this.child = new Array, this.sync = !1, this.buf = new Array,
			n.child.push(this), this.clear_states();
		for (var t in this.config) this.keycode[t] = r.keyname_to_keycode(this.config[t])
	}
	var n = function() {
		document.addEventListener ? (document.addEventListener("keydown", e, !0), document.addEventListener("keyup", t, !0)) :
			document.attachEvent && (document.attachEvent("keydown", e), document.attachEvent("keyup", t));
		var n = new Object;
		return n.child = [], n.key = function(e, t) {
			e || (e = window.event);
			for (var n in this.child)
				if (this.child[n].key(e.keyCode, t)) break
		}, n
	}();
	return r.prototype.key = function(e, t) {
		var n = 0;
		for (var r in this.config)
			if (this.keycode[r] == e) {
				if (this.sync === !1) {
					if (this.child)
						for (var i in this.child) this.child[i].key(r, t);
					this.state[r] = t
				} else this.buf.push([r, t]);
				n = 1;
				break
			}
		return n
	}, r.prototype.clear_states = function() {
		for (var e in this.config) this.state[e] = 0
	}, r.prototype.fetch = function() {
		for (var e in this.buf) {
			var t = this.buf[e][0],
				n = this.buf[e][1];
			if (this.child)
				for (var r in this.child) this.child[r].key(t, n);
			this.state[t] = n
		}
		this.buf = []
	}, r.prototype.flush = function() {
		this.buf = []
	}, r.keyname_to_keycode = r.prototype.keyname_to_keycode = function(e) {
		var t;
		if (e.length == 1) {
			var n = e.charCodeAt(0);
			if (n >= "a".charCodeAt(0) && n <= "z".charCodeAt(0) || n >= "A".charCodeAt(0) && n <= "Z".charCodeAt(0)) e = e.toUpperCase(),
				t = e.charCodeAt(0);
			else if (n >= "0".charCodeAt(0) && n <= "9".charCodeAt(0)) t = e.charCodeAt(0);
			else switch (e) {
				case "`":
					t = 192;
					break;
				case "-":
					t = 189;
					break;
				case "=":
					t = 187;
					break;
				case "[":
					t = 219;
					break;
				case "]":
					t = 221;
					break;
				case "\\":
					t = 220;
					break;
				case ";":
					t = 186;
					break;
				case "'":
					t = 222;
					break;
				case ",":
					t = 188;
					break;
				case ".":
					t = 190;
					break;
				case "/":
					t = 191;
					break;
				case " ":
					t = 32
			}
		} else switch (e) {
			case "ctrl":
				t = 17;
				break;
			case "up":
				t = 38;
				break;
			case "down":
				t = 40;
				break;
			case "left":
				t = 37;
				break;
			case "right":
				t = 39;
				break;
			case "space":
				t = 32
		}
		return t
	}, r.keycode_to_keyname = r.prototype.keycode_to_keyname = function(e) {
		if (e >= "A".charCodeAt(0) && e <= "Z".charCodeAt(0) || e >= "0".charCodeAt(0) && e <= "9".charCodeAt(0)) return String
			.fromCharCode(e).toLowerCase();
		var t = e;
		switch (e) {
			case 38:
				t = "up";
				break;
			case 40:
				t = "down";
				break;
			case 37:
				t = "left";
				break;
			case 39:
				t = "right";
				break;
			case 32:
				t = "space"
		}
		return t
	}, r
}), define("F.core/css", {
	load: function(e, t, n, r) {
		function i(e) {
			var t = document.getElementsByTagName("head")[0],
				n = document.createElement("link");
			n.href = e, n.rel = "stylesheet", n.type = "text/css", t.appendChild(n)
		}
		i(requirejs.toUrl(e)), n(!0)
	},
	pluginBuilder: "./css-build"
}), define("F.core/css-embed", function() {
	function e(e) {
		var t = document.getElementsByTagName("head")[0],
			n = document.createElement("style"),
			r = document.createTextNode(e);
		n.type = "text/css", n.styleSheet ? n.styleSheet.cssText = r.nodeValue : n.appendChild(r), t.appendChild(n)
	}
	return e
}), define("F.core/css!F.core/style.css", ["F.core/css-embed"], function(e) {
	return e(
		".F_sprite { position:absolute; overflow:hidden; width:10px; height:10px; } .F_sprite_inline { overflow:hidden; width:10px; height:10px; } .F_sprite_img { position:absolute; } .canvas { position:relative; width:800px; /*height:577px;*/ height:300px; border:1px solid #000; } .page { position: absolute; left: 0px; top: 0px; border: 1px solid #000; z-index: 10000; } "
	), !0
}), define("F.core/support", [], function() {
	var e = {};
	return function() {
			var t = navigator.userAgent.toLowerCase(),
				n = /(webkit)[ \/]([\w.]+)/.exec(t) || /(o)pera(?:.*version)?[ \/]([\w.]+)/.exec(t) || /(ms)ie ([\w.]+)/.exec(t) ||
				/(moz)illa(?:.*? rv:([\w.]+))?/.exec(t) || [],
				r = /iPad|iPod|iPhone|Android|webOS|IEMobile/i.exec(t);
			e.mobile = r ? r[0] : undefined, e.prefix = n[1] || n[0], e.prefix === "moz" && (e.prefix = "Moz"), e.prefix ===
				"o" && (e.prefix = "O"), n[2] && (e.version = +n[2].split(".")[0])
		}(),
		function() {
			e.css2dtransform = undefined, e.css3dtransform = undefined;
			var t = document.createElement("p"),
				n, r, i = {
					WebkitTransform: "-webkit-transform",
					OTransform: "-o-transform",
					MSTransform: "-ms-transform",
					MozTransform: "-moz-transform",
					transform: "transform"
				};
			document.getElementsByTagName("body")[0].appendChild(t);
			for (n in i)
				if (t.style[n] !== undefined) {
					var s;
					s = "matrix(1, 0, 0, 1, 0, 0)", t.style[n] = s, s === window.getComputedStyle(t).getPropertyValue(i[n]) && (e.css2dtransform =
						n), s = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)", t.style[n] = s, s === window.getComputedStyle(
						t).getPropertyValue(i[n]) && (e.css3dtransform = n)
				}
			t.parentNode.removeChild(t)
		}(),
		function() {
			var e = 0,
				t = ["ms", "moz", "webkit", "o"];
			for (var n = 0; n < t.length && !window.requestAnimationFrame; ++n) window.requestAnimationFrame = window[t[n] +
				"RequestAnimationFrame"], window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] +
				"CancelRequestAnimationFrame"];
			window.requestAnimationFrame || (window.requestAnimationFrame = function(t, n) {
				var r = (new Date).getTime(),
					i = Math.max(0, 16 - (r - e)),
					s = window.setTimeout(function() {
						t(r + i)
					}, i);
				return e = r + i, s
			}), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
				clearTimeout(e)
			})
		}(), e
}), define("F.core/sprite", ["F.core/css!F.core/style.css", "F.core/support", "module"], function(e, t, n) {
	function s(e) {
		this.ID = r, r++, e.div ? (this.el = e.div, this.el.className ? this.el.className += " F_sprite_inline" : this.el.className =
			"F_sprite_inline", window.getComputedStyle(this.el).getPropertyValue("position") === "static" && (this.el.style.position =
				"relative")) : (this.el = document.createElement("div"), this.el.className = "F_sprite", e.canvas.appendChild(
			this.el)), this.img = {}, this.cur_img = null, this.set_wh(e.wh);
		if (e.img)
			if (typeof e.img == "object")
				for (var n in e.img) this.add_img(e.img[n], n);
			else this.add_img(e.img, "0");
		if (e.div) {
			var i = e.div.getElementsByTagName("img");
			for (var s = 0; s < i.length; s++) {
				var o = i[s].getAttribute("name");
				o && this.adopt_img(i[s])
			}
		}
		t.css2dtransform && !e.div && (this.el.style.left = "0px", this.el.style.top = "0px")
	}
	var r = 0,
		i = n.config() || {};
	return s.masterconfig = s.prototype.masterconfig = function(e) {
		if (!e) return i;
		i = e
	}, s.masterconfig_set = s.prototype.masterconfig_set = function(e, t) {
		e && t && (i[e] = t)
	}, s.prototype.set_wh = function(e) {
		this.el.style.width = e.x + "px", this.el.style.height = e.y + "px"
	}, t.css2dtransform && !i.disable_css2dtransform ? s.prototype.set_xy = function(e) {
		this.el.style[t.css2dtransform] = "translate(" + e.x + "px," + e.y + "px) "
	} : s.prototype.set_xy = function(e) {
		this.el.style.left = e.x + "px", this.el.style.top = e.y + "px"
	}, s.prototype.set_z = function(e) {
		this.el.style.zIndex = Math.round(e)
	}, s.prototype.add_img = function(e, t) {
		var n = "";
		i.baseUrl && (n = i.baseUrl);
		var r = document.createElement("img");
		return r.setAttribute("class", "F_sprite_img"), r.onload = function() {
			this.naturalWidth || (this.naturalWidth = this.width), this.naturalHeight || (this.naturalHeight = this.height),
				this.onload = null
		}, r.src = n + e, this.el.appendChild(r), this.img[t] = r, this.switch_img(t), r
	}, s.prototype.adopt_img = function(e) {
		var t = e.getAttribute("name");
		e.hasAttribute("class") ? e.setAttribute("class", e.getAttribute("class") + " F_sprite_img") : e.setAttribute(
				"class", "F_sprite_img"), e.naturalWidth || (e.naturalWidth = e.width), e.naturalHeight || (e.naturalHeight = e.height), !
			e.naturalWidth && !e.naturalHeight && (e.onload = function() {
				this.naturalWidth || (this.naturalWidth = this.width), this.naturalHeight || (this.naturalHeight = this.height),
					this.onload = null
			}), this.img[t] = e, this.switch_img(t)
	}, s.prototype.switch_img = function(e) {
		var t, n;
		for (var r in this.img)
			if (this.img[r].style.display == "") {
				t = this.img[r].style.left, n = this.img[r].style.top;
				break
			}
		for (var r in this.img) r == e ? (this.img[r].style.left = t, this.img[r].style.top = n, this.img[r].style.display =
			"") : this.img[r].style.display = "none";
		this.cur_img = e
	}, s.prototype.set_img_xy = function(e) {
		this.img[this.cur_img].style.left = e.x + "px", this.img[this.cur_img].style.top = e.y + "px"
	}, s.prototype.remove = function() {
		this.el.parentNode.removeChild(this.el), this.removed = !0
	}, s.prototype.attach = function() {
		this.removed && config.canvas.appendChild(this.el)
	}, s.prototype.hide = function() {
		this.el.style.display = "none"
	}, s.prototype.show = function() {
		this.el.style.display = ""
	}, s
}), define("LF/packages", {
	"LF2 1.451": {
		path: "LFrelease/LF2_19"
	}
}), define("LF/loader", ["LF/packages"], function(e) {
	return {
		load: function(t, n, r, i) {
			function l(e) {
				s = c(e.path), o.location = c(i.baseUrl) + s, n([s + "manifest"], function(e) {
					n([s + e.data], h), n([s + e.specification], function(e) {
						o.specification = e, p()
					})
				})
			}

			function c(e) {
				return e === "" ? e : (e = e.replace(/\\/g, "/"), e.charAt(e.length - 1) !== "/" && (e += "/"), e.charAt(0) ===
					"/" && (e = e.slice(1)), e)
			}

			function h(e) {
				var t = [];
				for (var r = 0; r < e.object.length; r++) t.push(s + e.object[r].file);
				n(t, function() {
					var t = {};
					for (var n in e) n === "object" ? t[n] = [] : t[n] = e[n];
					for (var n = 0; n < e.object.length; n++) {
						var r = e.object[n],
							i = {
								id: r.id,
								type: r.type,
								data: arguments[n]
							};
						t.object.push(i)
					}
					o.data = t, p()
				})
			}

			function p() {
				o && o.data && o.specification && r(o)
			}
			var s = "",
				o = {};
			if (i.isBuild) {
				r();
				return
			}
			var u, a = 0;
			for (var f in e) a === 0 && (u = f), a++;
			a === 1 && l(e[u])
		},
		normalize: function(e, t) {
			return e
		}
	}
}), define("F.core/util", [], function() {
	var e = {
		css: function(e) {
			var t = document.getElementsByTagName("head")[0],
				n = document.createElement("link");
			n.href = e, n.rel = "stylesheet", n.type = "text/css", t.appendChild(n)
		},
		double_delegate: function(e, t) {
			return function() {
				e && e.apply(this, Array.prototype.slice.call(arguments)), t && t.apply(this, Array.prototype.slice.call(
					arguments))
			}
		},
		make_array: function(e) {
			return e ? e instanceof Array ? e : [e] : []
		},
		search_array: function(e, t, n, r) {
			var i = new Array;
			for (var s in e)
				if (t(e[s], s)) {
					n && (e[s] = n(e[s]));
					if (!r) return s;
					i.push(s)
				}
			return r ? i : -1
		},
		arr_search: function(t, n, r, i) {
			return e.search_array(t, n, r, i)
		},
		push_unique: function(t, n) {
			var r = e.arr_search(t, function(e) {
				return e == n
			});
			if (r == -1) return t.push(n), !0
		},
		extend_object: function(e, t) {
			for (var n in t) typeof t[n] == "object" ? e[n] = arguments.callee(e[n] ? e[n] : {}, t[n]) : e[n] = t[n];
			return e
		},
		to_text: function(e, t, n, r, i, s) {
			if (s === 0) return "";
			s || (s = 30), n || (n = "\n"), r || (r = "");
			var o = r + t + ":" + n;
			o += r + "{";
			var u = 0;
			for (var a in e) {
				var f = i && i(a, e[a]);
				f != 1 && (typeof f == "string" ? o += (u ? "," : "") + n + r + "	" + "'" + a + "'" + ": " + f : e[a].constructor ==
					Object ? o += (u ? "," : "") + n + arguments.callee(e[a], a, n, r + "	", i, s - 1) : (o += (u ? "," : "") + n +
						r + "	" + "'" + a + "'" + ": ", typeof e[a] == "string" && (o += "'"), o += e[a], typeof e[a] == "string" &&
						(o += "'"))), u = 1
			}
			return o += n + r + "}", o
		},
		extract_array: function(t, n) {
			var r = {};
			n = e.make_array(n);
			for (var i in n) r[n[i]] = [];
			for (var s = 0; s < t.length; s++)
				for (var o = 0; o < n.length; o++) {
					var u = n[o];
					r[u].push(t[s][u])
				}
			return r
		},
		group_elements: function(e, t) {
			var n = {};
			for (var r = 0; r < e.length; r++) {
				var i = e[r][t];
				n[i] || (n[i] = []), n[i].push(e[r])
			}
			return n
		}
	};
	return e
}), define("LF/global", [], function() {
	var e = {};
	e.combo_list = [{
		name: "left",
		seq: ["left"]
	}, {
		name: "right",
		seq: ["right"]
	}, {
		name: "def",
		seq: ["def"]
	}, {
		name: "jump",
		seq: ["jump"]
	}, {
		name: "att",
		seq: ["att"]
	}, {
		name: "run",
		seq: ["right", "right"]
	}, {
		name: "run",
		seq: ["left", "left"]
	}, {
		name: "DvA",
		seq: ["def", "down", "att"]
	}, {
		name: "D<A",
		seq: ["def", "left", "att"]
	}, {
		name: "D>A",
		seq: ["def", "right", "att"]
	}, {
		name: "D^A",
		seq: ["def", "up", "att"]
	}, {
		name: "DvJ",
		seq: ["def", "down", "jump"]
	}, {
		name: "D<J",
		seq: ["def", "left", "jump"]
	}, {
		name: "D>J",
		seq: ["def", "right", "jump"]
	}, {
		name: "D^J",
		seq: ["def", "up", "jump"]
	}, {
		name: "DJA",
		seq: ["def", "jump", "att"]
	}], e.detector_config = {
		timeout: 30,
		comboout: 8,
		no_repeat_key: !0
	}, e.gameplay = {};
	var t = e.gameplay;
	return t.default = {}, t.default.itr = {}, t.default.itr.zwidth = 12, t.default.cpoint = {}, t.default.cpoint.hurtable =
		0, t.default.cpoint.cover = 0, t.default.cpoint.vaction = 135, t.default.wpoint = {}, t.default.wpoint.cover = 0, t
		.default.effect = {}, t.default.effect.num = 0, t.default.fall = {}, t.default.fall.value = 20, t.default.fall.dvy = -
		6.9, t.default.weapon = {}, t.default.weapon.vrest = 9, t.default.character = {}, t.default.character.arest = 7, t.default
		.machanics = {}, t.default.machanics.mass = 1, t.itr = {}, t.itr.hit_stall = 3, t.recover = {}, t.recover.fall = -1,
		t.recover.bdefend = -0.5, t.effect = {}, t.effect.num_to_id = 300, t.effect.duration = 3, t.character = {}, t.character
		.bounceup = {}, t.character.bounceup.limit = {}, t.character.bounceup.limit.xy = 14.2, t.character.bounceup.limit.y =
		11, t.character.bounceup.factor = {}, t.character.bounceup.factor.x = .6, t.character.bounceup.factor.y = -0.4, t.character
		.bounceup.factor.z = .6, t.defend = {}, t.defend.injury = {}, t.defend.injury.factor = .1, t.defend.break = 40, t.fall = {},
		t.fall.KO = 60, t.friction = {}, t.friction.factor = {}, t.friction.factor.degree1 = .26, t.friction.factor.degree2 =
		.02, t.friction.fell = {}, t.friction.fell.factor = .76, t.min_speed = 1, t.gravity = 1.7, t.weapon = {}, t.weapon.bounceup = {},
		t.weapon.bounceup.limit = 12.25, t.weapon.bounceup.speed = {}, t.weapon.bounceup.speed.x = 3, t.weapon.bounceup.speed
		.y = -3.7, t.weapon.bounceup.speed.z = 2, t.weapon.soft_bounceup = {}, t.weapon.soft_bounceup.speed = {}, t.weapon.soft_bounceup
		.speed.y = -2, t.weapon.hit = {}, t.weapon.hit.vx = -3, t.weapon.hit.vy = 0, t.weapon.gain = {}, t.weapon.gain.factor = {},
		t.weapon.gain.factor.x = 1.1, t.weapon.gain.factor.y = 1.4, t.weapon.reverse = {}, t.weapon.reverse.factor = {}, t.weapon
		.reverse.factor.vx = -0.4, t.weapon.reverse.factor.vy = -2, t.weapon.reverse.factor.vz = -0.4, t.unspecified = -
		842150451, e
}), define("F.core/animator", [], function() {
	function e(e) {
		this.config = e, this.target = e.tar, this.I = 0, this.horimirror = !1, e.borderright || (e.borderright = 0), e.borderbottom ||
			(e.borderbottom = 0), e.borderleft || (e.borderleft = 0), e.bordertop || (e.bordertop = 0)
	}
	return e.prototype.next_frame = function() {
		var e = this.config;
		this.I++;
		if (!e.ani) this.I == e.gx * e.gy && (this.I = 0), this.show_frame(this.I);
		else {
			var t = e.ani[this.I];
			if (this.I >= e.ani.length || this.I < 0) this.I = 0, t = e.ani[0];
			this.show_frame(t)
		}
		return this.I
	}, e.prototype.seek = function(e) {
		var t = this.config;
		if (t.ani && e >= 0 && e < t.ani.length) {
			this.I = e;
			var n = t.ani[this.I];
			this.show_frame(n)
		}
	}, e.prototype.rewind = function() {
		this.I = -1, this.next_frame()
	}, e.prototype.set_frame = function(e) {
		this.I = e, this.show_frame(e)
	}, e.prototype.hmirror = function(e) {
		this.horimirror = e
	}, e.prototype.show_frame = function(e) {
		var t = this.config,
			n, r;
		n = -(e % t.gx * t.w + t.x + t.borderleft), r = -(Math.floor(e / t.gx) * t.h + t.y + t.bordertop), this.horimirror &&
			(n = -this.target.img[this.target.cur_img].naturalWidth - n + t.w - t.borderleft - t.borderright), this.target.set_wh({
				x: t.w - t.borderleft - t.borderright,
				y: t.h - t.bordertop - t.borderbottom
			}), this.target.set_img_xy({
				x: n,
				y: r
			})
	}, e.prototype.get_at = function(e) {
		e || (e = this.I);
		var t = this.config;
		return t.graph[e % t.gx][Math.floor(e / t.gx)]
	}, e.set = function(t, n) {
		if (!t) return null;
		var r = new Object;
		for (var i in t) {
			if (n && i == n) continue;
			if (n && t[n])
				for (var s in t[n]) t[i][s] = t[n][s];
			r[i] = new e(t[i])
		}
		return r
	}, e
}), define("LF/sprite", ["F.core/sprite", "F.core/animator"], function(e, t) {
	function n(n, r) {
		var i = this.num_of_images = n.file.length,
			s = this.w = n.file[0].w + 1,
			o = this.h = n.file[0].h + 1,
			u = this.ani = {
				length: 0
			};
		this.dir = "right", this.cur_img = 0;
		var a = {
				canvas: r,
				wh: {
					x: s,
					y: o
				},
				img: {}
			},
			f = this.sp = new e(a);
		for (var l = 0; l < n.file.length; l++) {
			var c = "";
			for (var h in n.file[l]) typeof n.file[l][h] == "string" && h.indexOf("file") === 0 && (c = n.file[l][h]);
			c === "" && console.log("cannot find img path in data:\n" + JSON.stringify(n.file[l])), f.add_img(c, l + "r");
			if (n.file[l].mirror) n.file[l].mirror !== "none" && f.add_img(n.file[l].mirror, l + "l");
			else {
				var p = c.lastIndexOf(".");
				f.add_img(c.slice(0, p) + "_mirror" + c.slice(p), l + "l")
			}
			var d = {
				x: 0,
				y: 0,
				w: n.file[l].w + 1,
				h: n.file[l].h + 1,
				gx: n.file[l].row,
				gy: n.file[l].col,
				tar: f,
				borderright: 1,
				borderbottom: 1
			};
			u.length++, u[l] = new t(d)
		}
	}
	return n.prototype.show_pic = function(e) {
		var t = 0;
		for (var n = 0; n < this.ani.length; n++) {
			var r = e - this.ani[n].config.gx * this.ani[n].config.gy;
			if (!(r >= 0)) break;
			e = r, t++
		}
		this.cur_img = t, this.sp.switch_img(this.cur_img + (this.dir === "right" ? "r" : "l")), this.ani[this.cur_img].hmirror(
				this.dir === "left"), this.ani[this.cur_img].set_frame(e), this.w = this.ani[this.cur_img].config.w, this.h =
			this.ani[this.cur_img].config.h
	}, n.prototype.switch_lr = function(e) {
		var t = this.ani[this.cur_img].I;
		this.dir = e, this.sp.switch_img(this.cur_img + (this.dir === "right" ? "r" : "l")), this.ani[this.cur_img].hmirror(
			this.dir === "left"), this.ani[this.cur_img].set_frame(t)
	}, n.prototype.set_xy = function(e) {
		this.sp.set_xy(e)
	}, n.prototype.set_z = function(e) {
		this.sp.set_z(e)
	}, n.prototype.show = function() {
		this.sp.show()
	}, n.prototype.hide = function() {
		this.sp.hide()
	}, n
}), define("LF/mechanics", ["LF/global"], function(e) {
	function n(t) {
		var n = t.spec;
		n[t.id] && n[t.id].mass ? this.mass = n[t.id].mass : this.mass = e.gameplay.default.machanics.mass, this.ps, this.sp =
			t.sp, this.frame = t.frame, this.parent = t
	}
	var t = e.gameplay;
	return n.prototype.body = function(e, t, n) {
		var r = this.ps,
			i = this.sp,
			s = n;
		e || (e = this.frame.D.bdy);
		if (e instanceof Array) {
			if (!t && e.length === 2) return [this.volume(e[0], s), this.volume(e[1], s)];
			if (!t && e.length === 3) return [this.volume(e[0], s), this.volume(e[1], s), this.volume(e[2], s)];
			var o = [];
			for (var u in e)(!t || t(e[u])) && o.push(this.volume(e[u], s));
			return o
		}
		return !t || t(e) ? [this.volume(e, s)] : []
	}, n.prototype.volume = function(e, n) {
		var r = this.ps,
			i = this.sp;
		if (!e) return n ? {
			x: n.x,
			y: n.y,
			z: n.z,
			vx: 0,
			vy: 0,
			w: 0,
			h: 0,
			zwidth: 0,
			data: {}
		} : {
			x: r.sx,
			y: r.sy,
			z: r.sz,
			vx: 0,
			vy: 0,
			w: 0,
			h: 0,
			zwidth: 0,
			data: {}
		};
		var s = e.x;
		return r.dir === "left" && (s = i.w - e.x - e.w), n ? {
			x: r.sx + n.x,
			y: r.sy + n.y,
			z: r.sz + n.z,
			vx: s,
			vy: e.y,
			w: e.w,
			h: e.h,
			zwidth: e.zwidth ? e.zwidth : t.default.itr.zwidth,
			data: e
		} : {
			x: r.sx,
			y: r.sy,
			z: r.sz,
			vx: s,
			vy: e.y,
			w: e.w,
			h: e.h,
			zwidth: e.zwidth ? e.zwidth : t.default.itr.zwidth,
			data: e
		}
	}, n.prototype.make_point = function(e) {
		var t = this.ps,
			n = this.sp;
		return e ? t.dir === "right" ? {
			x: t.sx + e.x,
			y: t.sy + e.y,
			z: t.sz + e.y
		} : {
			x: t.sx + n.w - e.x,
			y: t.sy + e.y,
			z: t.sz + e.y
		} : (alert("make point failed"), {
			x: t.sx,
			y: t.sy,
			z: t.sz
		})
	}, n.prototype.coincideXZ = function(e, t) {
		var n = this.ps,
			r = this.sp,
			i = this.frame.D,
			s = e.x - t.x,
			o = e.z - t.z;
		n.x += s, n.z += o, n.sx = n.dir === "right" ? n.x - i.centerx : n.x + i.centerx - r.w
	}, n.prototype.coincideXY = function(e, t) {
		var n = this.ps,
			r = this.sp,
			i = this.frame.D,
			s = e.x - t.x,
			o = e.y - t.y;
		n.x += s, n.y += o, n.sx = n.dir === "right" ? n.x - i.centerx : n.x + i.centerx - r.w, n.sy = n.y - i.centery
	}, n.prototype.create_metric = function() {
		return this.ps = {
			sx: 0,
			sy: 0,
			sz: 0,
			x: 0,
			y: 0,
			z: 0,
			vx: 0,
			vy: 0,
			vz: 0,
			zz: 0,
			dir: "right"
		}, this.ps
	}, n.prototype.reset = function() {
		ps.x = 0, ps.y = 0, ps.z = 0, ps.sx = 0, ps.sy = 0, ps.sz = 0, ps.vx = 0, ps.vy = 0, ps.vz = 0, ps.zz = 0, ps.dir =
			"right"
	}, n.prototype.set_pos = function(e, t, n) {
		var r = this.ps,
			i = this.sp,
			s = this.frame.D;
		r.x = e, r.y = t, r.z = n, r.sx = r.dir === "right" ? r.x - s.centerx : r.x + s.centerx - i.w, r.sy = t - s.centery,
			r.sz = n
	}, n.prototype.dynamics = function() {
		var t = this.ps,
			n = this.sp,
			r = this.frame.D,
			i = this.frame.mobility,
			s = e.gameplay;
		this.blocking_xz() || (t.x += t.vx * i, t.z += t.vz * i), t.y += t.vy * i, t.sx = t.dir === "right" ? t.x - r.centerx :
			t.x + r.centerx - n.w, t.sy = t.y - r.centery, t.sz = t.z, t.y > 0 && (t.y = 0, t.sy = t.y - r.centery), n.set_xy({
				x: t.sx,
				y: t.sy + t.sz
			}), n.set_z(t.sz + t.zz), t.y === 0 && (t.vx -= s.friction.factor.degree1 * t.vx + s.friction.factor.degree2 * t.vx *
				t.vx * (t.vx >= 0 ? 1 : -1), t.vz -= s.friction.factor.degree1 * t.vz + s.friction.factor.degree2 * t.vz * t.vz *
				(t.vz >= 0 ? 1 : -1), t.vx !== 0 && t.vx > -s.min_speed && t.vx < s.min_speed && (t.vx = 0), t.vz !== 0 && t.vz >
				-s.min_speed && t.vz < s.min_speed && (t.vz = 0)), t.y < 0 && (t.vy += this.mass * s.gravity)
	}, n.prototype.blocking_xz = function() {
		var e = {
				x: this.ps.vx * this.frame.mobility,
				y: 0,
				z: this.ps.vz * this.frame.mobility
			},
			t = this.body(null, null, e);
		for (var n in t) {
			t[n].zwidth = 0;
			var r = this.parent.scene.query(t[n], this.parent, {
				tag: "itr:14"
			});
			if (r.length > 0) return !0
		}
	}, n.prototype.project = function() {
		var e = this.ps,
			t = this.sp;
		t.set_xy({
			x: e.sx,
			y: e.sy + e.sz
		}), t.set_z(e.sz + e.zz)
	}, n.prototype.speed = function() {
		var e = this.ps;
		return Math.sqrt(e.vx * e.vx + e.vy * e.vy)
	}, n
}), define("F.core/combodec", [], function() {
	function e(e, t, n) {
		this.time = 1, this.timeout = 0, this.comboout = 0, this.con = e, this.seq = new Array, this.config = t, this.combo =
			n, this.con.child.push(this)
	}
	return e.prototype.key = function(e, t) {
		if (!t) return;
		var n = this.seq,
			r = !0;
		if (this.config.rp)
			for (var i = n.length - 1, s = 1; i >= 0 && n[i] == e; i--, s++) s >= this.config.rp[e] && (r = !1);
		this.con.state[e] && (r = !1), this.timeout = this.time + this.config.timeout, this.comboout = this.time + this.config
			.comboout, r && n.push(e);
		if (this.combo && r) {
			var o = this.combo;
			for (var i in o) {
				var u = !0;
				for (var a = n.length - o[i].seq.length, f = 0; a < n.length; a++, f++)
					if (o[i].seq[f] !== n[a]) {
						u = !1;
						break
					}
				u && (this.config.callback(o[i]), o[i].interrupt && this.seq.push("_"))
			}
		}
	}, e.prototype.clear_seq = function() {
		this.seq.length = 0
	}, e.prototype.frame = function() {
		this.time === this.timeout && this.clear_seq(), this.time === this.comboout && this.seq.push("_"), this.time++
	}, e
}), define("LF/livingobject", ["LF/global", "LF/sprite", "LF/mechanics", "F.core/combodec"], function(e, t, n, r) {
	function s(i, s, u) {
		if (!i) return;
		var a = this;
		a.type = "livingobject", a.name = s.bmp.name, a.uid = -1, a.id = u, a.data = s, a.spec = i.spec, a.team = i.team, a
			.states = null, a.states_switch_dir = null, a.match = i.match, a.scene = i.scene, a.visualeffect = i.effects, a.sp =
			new t(s.bmp, i.stage), a.health = {
				hp: 100,
				mp: 100,
				bdefend: 0,
				fall: 0
			}, a.frame = {
				PN: 0,
				N: 0,
				D: s.frame[0],
				mobility: 1,
				ani: {
					i: 0,
					up: !0
				}
			}, a.mech = new n(a), a.ps = a.mech.create_metric(), a.trans = new o(a), a.itr = {
				vrest: [],
				lasthit: -100
			}, a.effect = {
				i: 0,
				dvx: 0,
				dvy: 0,
				oscillate: 0,
				stuck: !1,
				timeout: 0
			}, a.catching = 0, a.hold = {
				obj: null,
				id: 0
			}, a.switch_dir = !0, a.con = i.controller;
		if (a.con) {
			function f(e) {
				var t = e.name,
					n = a.states[a.frame.D.state];
				n && n.call(a, "combo", t), (t === "left" || t === "right") && a.switch_dir && a.switch_dir_fun(t)
			}
			var l = {
				timeout: e.detector_config.timeout,
				comboout: e.detector_config.comboout,
				no_repeat_key: e.detector_config.no_repeat_key,
				callback: f
			};
			a.combodec = new r(a.con, l, e.combo_list)
		}
	}

	function o(e) {
		var t = 1,
			n = 999,
			r = 0,
			i = 1;
		this.frame = function(e, t) {
			this.set_next(e, t), this.set_wait(0, t)
		}, this.set_wait = function(e, n, s) {
			n || (n = 0), n === 99 && (n = r), s || (s = 1), n >= r && (r = n, i = s, s === 99 && (i = t), t = e, t < 0 && (t =
				0))
		}, this.inc_wait = function(e, n, s) {
			n || (n = 0), n === 99 && (n = r), s || (s = 1), n >= r && (r = n, i = s, s === 99 && (i = t), t += e, t < 0 && (
				t = 0))
		}, this.set_next = function(e, s, o) {
			s || (s = 0), s === 99 && (s = r), o || (o = 1), s >= r && (r = s, i = o, o === 99 && (i = t), n = e)
		}, this.next = function() {
			return n
		}, this.reset_lock = function(e) {
			e || (e = 0), e === 99 && (e = r), e >= r && (r = 0)
		}, this.trans = function() {
			var s = r;
			i--, i === 0 && (r = 0);
			if (t === 0) {
				if (n !== 0) {
					n === 999 && (n = 0), e.frame.PN = e.frame.N, e.frame.N = n, e.state_update("frame_exit");
					var o = e.frame.D.state !== e.data.frame[n].state;
					o && e.state_update("state_exit"), e.frame.D = e.data.frame[n];
					if (o) {
						var u = e.switch_dir;
						e.states_switch_dir && e.states_switch_dir[e.frame.D.state] !== undefined ? e.switch_dir = e.states_switch_dir[
							e.frame.D.state] : e.switch_dir = !1, e.state_update("state_entry"), e.switch_dir && !u && e.con && (e.con.state
							.left && e.switch_dir_fun("left"), e.con.state.right && e.switch_dir_fun("right"))
					}
					e.frame_update(), s === 10 && t > 0 && (t -= 1)
				}
			} else t--
		}
	}
	var i = e.gameplay;
	return s.prototype.setup = function() {
		var e = this;
		e.state_update("setup"), e.scene.add(e)
	}, s.prototype.frame_update = function() {
		var e = this;
		e.sp.show_pic(e.frame.D.pic), e.frame.mobility = 1, e.ps.vx += e.dirh() * e.frame.D.dvx, e.frame.D.dvz && (e.ps.vz +=
			e.dirv() * e.frame.D.dvz), e.ps.vy += e.frame.D.dvy, e.trans.set_wait(e.frame.D.wait, 99), e.trans.set_next(e.frame
			.D.next, 99), e.state_update("frame")
	}, s.prototype.TU_update = function() {
		var e = this;
		e.effect.stuck || e.state_update("TU"), e.effect.oscillate && (e.effect.i === 1 ? e.effect.i = -1 : e.effect.i = 1,
			e.sp.set_xy({
				x: e.ps.sx + e.effect.oscillate * e.effect.i,
				y: e.ps.sy + e.ps.sz
			})), e.effect.timeout === 0 ? (e.effect.oscillate = 0, e.effect.stuck = !1, e.sp.set_xy({
			x: e.ps.sx,
			y: e.ps.sy + e.ps.sz
		})) : e.effect.timeout === -1 && (e.ps.vx = e.effect.dvx, e.ps.vy = e.effect.dvy, e.effect.dvx = 0, e.effect.dvy =
			0), e.effect.timeout--, e.itr.lasthit--, e.itr.lasthit < -3 && (e.health.fall > 0 && e.health.fall < 10 && (e.health
			.fall = 0), e.health.fall > 0 && (e.health.fall += i.recover.fall), e.health.bdefend > 0 && (e.health.bdefend +=
			i.recover.bdefend));
		for (var t in e.itr.vrest) e.itr.vrest[t] > 0 && e.itr.vrest[t]--;
		e.itr.arest > 0 && e.itr.arest--
	}, s.prototype.state_update = function(e) {
		var t = this,
			n = t.states.generic;
		if (n) var r = n.call(t, e);
		var i = t.states[t.frame.D.state];
		if (i) var s = i.call(t, e);
		return r || s
	}, s.prototype.TU = function() {
		var e = this;
		e.con && e.con.fetch(), e.TU_update(), e.con && e.combodec.frame()
	}, s.prototype.transit = function() {
		this.effect.stuck || this.trans.trans()
	}, s.prototype.set_pos = function(e, t, n) {
		this.mech.set_pos(e, t, n)
	}, s.prototype.vol_body = function() {
		return this.mech.body()
	}, s.prototype.cur_state = function() {
		return this.frame.D.state
	}, s.prototype.effect_id = function(e) {
		return e + i.effect.num_to_id
	}, s.prototype.effect_create = function(e, t) {
		var n = this;
		if (e !== null && e !== undefined) {
			var r = e + i.effect.num_to_id;
			n.proper(r, "oscillate") && (n.effect.oscillate = n.proper(r, "oscillate")), n.proper(r, "cant_move") && (n.frame
				.mobility = 0)
		}
		n.effect.timeout = t
	}, s.prototype.visualeffect_create = function(e, t, n, r) {
		var s = this,
			o = e + i.effect.num_to_id,
			u = {
				x: t.x + t.vx + (n ? t.w : 0),
				y: t.y + t.vy + t.h / 2,
				z: t.z > s.ps.z ? t.z : s.ps.z
			};
		s.visualeffect.create(u, o, r)
	}, s.prototype.frame_ani_oscillate = function(e, t) {
		var n = this,
			r = n.frame;
		if (r.ani.i < e || r.ani.i > t) r.ani.up = !0, r.ani.i = e + 1;
		r.ani.i < t && r.ani.up ? n.trans.set_next(r.ani.i++) : r.ani.i > e && !r.ani.up && n.trans.set_next(r.ani.i--), r
			.ani.i == t && (r.ani.up = !1), r.ani.i == e && (r.ani.up = !0)
	}, s.prototype.frame_ani_sequence = function(e, t) {
		var n = this,
			r = n.frame;
		if (r.ani.i < e || r.ani.i > t) r.ani.i = e + 1;
		trans.set_next(r.ani.i++), r.ani.i > t && (r.ani.i = e)
	}, s.prototype.itr_rest_update = function(e, t) {
		var n = this,
			r;
		t.arest ? r = t.arest : t.vrest ? r = t.vrest : r = i.default.character.arest, n.itr.vrest[e] = r
	}, s.prototype.itr_rest_test = function(e, t) {
		var n = this;
		if (!n.itr.vrest[e]) return !0
	}, s.prototype.switch_dir_fun = function(e) {
		var t = this;
		t.ps.dir === "left" && e === "right" ? (t.ps.dir = "right", t.sp.switch_lr("right")) : t.ps.dir === "right" && e ===
			"left" && (t.ps.dir = "left", t.sp.switch_lr("left"))
	}, s.prototype.dirh = function() {
		var e = this;
		return e.ps.dir === "left" ? -1 : 1
	}, s.prototype.dirv = function() {
		var e = this,
			t = 0;
		return e.con && (e.con.state.up && (t -= 1), e.con.state.down && (t += 1)), t
	}, s.prototype.proper = function(e, t) {
		var n = this;
		return arguments.length === 1 && (t = e, e = n.id), n.spec[e] ? n.spec[e][t] : null
	}, s
}), define("LF/character", ["LF/livingobject", "LF/global", "F.core/util"], function(e, t, n) {
	function o(t, n, r) {
		var o = this;
		e.call(this, t, n, r), o.type = "character", o.states = i, o.states_switch_dir = s, o.setup()
	}
	var r = t.gameplay,
		i = {
			generic: function(e, t) {
				var n = this;
				switch (e) {
					case "TU":
						n.interaction(), n.mech.dynamics(), n.wpoint.call(n);
						var i = n.ps;
						if (i.y === 0 && i.vy > 0) {
							var s = n.state_update("fell_onto_ground");
							s ? n.trans.frame(s, 15) : (i.vy = 0, i.vx *= r.friction.fell.factor, i.vz *= r.friction.fell.factor)
						} else if (i.y + i.vy >= 0 && i.vy > 0) {
							var s = n.state_update("fall_onto_ground");
							if (s) n.trans.frame(s, 15);
							else switch (n.frame.N) {
								case 212:
									n.trans.frame(215, 15);
									break;
								default:
									n.trans.frame(219, 15)
							}
						}
				}
			},
			0: function(e, t) {
				var r = this;
				switch (e) {
					case "TU":
						var i = r.con.state.left !== r.con.state.right,
							s = r.con.state.up !== r.con.state.down;
						(i || s) && r.trans.frame(5);
						break;
					case "frame":
						r.hold.obj && r.hold.obj.type === "heavyweapon" && r.trans.frame(12);
						break;
					case "combo":
						switch (t) {
							case "run":
								r.hold.obj && r.hold.obj.type === "heavyweapon" ? r.trans.frame(16, 10) : r.trans.frame(9, 10);
								break;
							case "def":
								if (r.hold.obj && r.hold.obj.type === "heavyweapon") return;
								r.trans.frame(110, 10);
								break;
							case "jump":
								if (r.hold.obj && r.hold.obj.type === "heavyweapon") {
									if (!r.proper("heavy_weapon_jump")) return;
									r.trans.frame(r.proper("heavy_weapon_jump"), 10);
									return
								}
								r.trans.frame(210, 10);
								break;
							case "att":
								if (r.hold.obj) {
									var i = r.con.state.left !== r.con.state.right;
									if (r.hold.obj.type === "heavyweapon") {
										r.trans.frame(50, 10);
										return
									}
									if (r.proper(r.hold.id, "just_throw")) {
										r.trans.frame(45, 10);
										return
									}
									if (i && r.proper(r.hold.id, "stand_throw")) {
										r.trans.frame(45, 10);
										return
									}
									if (r.proper(r.hold.id, "attackable")) {
										r.trans.frame(r.match.random() < .5 ? 20 : 25, 10);
										return
									}
								}
								var o = r.mech.volume(n.make_array(r.data.frame[72].itr)[0]),
									u = r.scene.query(o, r, {
										tag: "itr:6",
										not_team: r.team
									});
								for (var a in u) {
									var f = u[a].vol_itr(6)[0].data;
									if (r.itr_rest_test(u[a].uid, f)) {
										r.trans.frame(70, 10), r.itr_rest_update(u[a].uid, f);
										return
									}
								}
								r.trans.frame(r.match.random() < .5 ? 60 : 65, 10)
						}
				}
			},
			1: function(e, t) {
				var n = this;
				switch (e) {
					case "TU":
						var r = n.con.state.left !== n.con.state.right;
						n.hold.obj && n.hold.obj.type === "heavyweapon" ? (r && (n.ps.vx = n.dirh() * n.data.bmp.heavy_walking_speed),
							n.ps.vz = n.dirv() * n.data.bmp.heavy_walking_speedz) : (r && (n.ps.vx = n.dirh() * n.data.bmp.walking_speed),
							n.ps.vz = n.dirv() * n.data.bmp.walking_speedz);
						break;
					case "frame":
						var r = n.con.state.left !== n.con.state.right,
							i = n.con.state.up !== n.con.state.down;
						n.hold.obj && n.hold.obj.type === "heavyweapon" ? r || i ? n.frame_ani_oscillate(12, 15) : n.trans.set_next(n.frame
							.N) : (n.frame_ani_oscillate(5, 8), !r && !i && n.trans.frame(999)), n.trans.set_wait(n.data.bmp.walking_frame_rate -
							1);
						break;
					case "state_entry":
						n.trans.set_wait(0);
						break;
					case "combo":
						n.states[0].call(n, e, t)
				}
			},
			2: function(e, t) {
				var n = this;
				switch (e) {
					case "TU":
						n.hold.obj && n.hold.obj.type === "heavyweapon" ? (n.ps.vx = n.dirh() * n.data.bmp.heavy_running_speed, n.ps.vz =
							n.dirv() * n.data.bmp.heavy_running_speedz) : (n.ps.vx = n.dirh() * n.data.bmp.running_speed, n.ps.vz = n.dirv() *
							n.data.bmp.running_speedz);
						break;
					case "frame":
						n.hold.obj && n.hold.obj.type === "heavyweapon" ? n.frame_ani_oscillate(16, 18) : n.frame_ani_oscillate(9, 11),
							n.trans.set_wait(n.data.bmp.running_frame_rate);
						break;
					case "combo":
						switch (t) {
							case "left":
							case "right":
								t != n.ps.dir && (n.hold.obj && n.hold.obj.type === "heavyweapon" ? n.trans.frame(19, 10) : n.trans.frame(
									218, 10));
								break;
							case "def":
								if (n.hold.obj && n.hold.obj.type === "heavyweapon") return;
								n.trans.frame(102, 10);
								break;
							case "jump":
								if (n.hold.obj && n.hold.obj.type === "heavyweapon") {
									if (!n.proper("heavy_weapon_dash")) return;
									n.trans.frame(n.proper("heavy_weapon_dash"), 10);
									return
								}
								n.trans.frame(213, 10);
								break;
							case "att":
								if (n.hold.obj) {
									if (n.hold.obj.type === "heavyweapon") {
										n.trans.frame(50, 10);
										return
									}
									var r = n.con.state.left !== n.con.state.right;
									if (r && n.proper(n.hold.id, "run_throw")) {
										n.trans.frame(45, 10);
										return
									}
									if (n.proper(n.hold.id, "attackable")) {
										n.trans.frame(35, 10);
										return
									}
								}
								n.trans.frame(85, 10)
						}
				}
			},
			3: function(e, t) {
				var n = this;
				switch (e) {
					case "frame":
						n.frame.D.next === 999 && n.ps.y < 0 && n.trans.set_next(212)
				}
			},
			4: function(e, t) {
				var n = this;
				switch (e) {
					case "state_entry":
						n.frame.N === 210 && (n.state4 = {});
						break;
					case "frame":
						if (n.frame.N === 212 && n.frame.PN === 211) {
							var r = n.con.state.left !== n.con.state.right;
							n.ps.vx = r * n.data.bmp.jump_distance, n.ps.vz = n.dirv() * n.data.bmp.jump_distancez, n.ps.vy = n.data.bmp.jump_height
						}
						break;
					case "TU":
						if (n.frame.N === 212 && n.state4.pending_attack) {
							if (n.hold.obj) {
								var r = n.con.state.left !== n.con.state.right;
								r && n.proper(n.hold.id, "jump_throw") ? n.trans.frame(52, 10) : n.proper(n.hold.id, "attackable") && n.trans
									.frame(30, 10)
							} else n.trans.frame(80, 10);
							n.state4.pending_attack = !1
						}
						break;
					case "combo":
						t === "att" && (n.state4.pending_attack = !0)
				}
			},
			5: function(e, t) {
				var n = this;
				switch (e) {
					case "state_entry":
						n.ps.vx = n.dirh() * n.data.bmp.dash_distance, n.ps.vz = n.dirv() * n.data.bmp.dash_distancez, n.ps.vy = n.data
							.bmp.dash_height;
						break;
					case "combo":
						t === "att" && (n.proper("dash_backattack") || n.dirh() === (n.ps.vx > 0 ? 1 : -1)) && (n.hold.obj && n.proper(
							n.hold.id, "attackable") ? n.trans.frame(40, 10) : n.trans.frame(90, 10), n.switch_dir = !1), (t === "left" ||
							t === "right") && t != n.ps.dir && (n.dirh() == (n.ps.vx > 0 ? 1 : -1) ? (n.frame.N === 213 && n.trans.frame(
							214, 0), n.frame.N === 216 && n.trans.frame(217, 0)) : (n.frame.N === 214 && n.trans.frame(213, 0), n.frame
							.N === 217 && n.trans.frame(216, 0)))
				}
			},
			6: function(e, t) {
				var n = this;
				switch (e) {}
			},
			7: function(e, t) {
				var n = this;
				switch (e) {
					case "frame":
						n.frame.mobility = .6, n.frame.N === 111 && n.trans.inc_wait(4)
				}
			},
			8: function(e, t) {
				var n = this;
				switch (e) {
					case "frame":
						n.frame.mobility = .3, n.frame.N === 112 && n.trans.inc_wait(4)
				}
			},
			9: function(e, t) {
				var n = this;
				switch (e) {
					case "state_exit":
						n.catching = 0, n.ps.zz = 0;
						break;
					case "frame":
						n.state9 = {}, n.state9.frameTU = !0, n.catching.caught_b(n.mech.make_point(n.frame.D.cpoint), n.frame.D.cpoint,
							n.ps.dir);
						break;
					case "TU":
						if (n.caught_cpointkind() === 1 && n.catching.caught_cpointkind() === 2) {
							if (n.state9.frameTU) {
								n.state9.frameTU = !1, n.frame.D.cpoint.injury && (n.catching.hit(n.frame.D.cpoint, n, {
									x: n.ps.x,
									y: n.ps.y,
									z: n.ps.z
								}, null), n.trans.inc_wait(1, 10, 99));
								var i = r.default.cpoint.cover;
								n.frame.D.cpoint.cover !== undefined && (i = n.frame.D.cpoint.cover), i === 0 || i === 10 ? n.ps.zz = 1 : n.ps
									.zz = -1, n.frame.D.cpoint.dircontrol === 1 && (n.con.state.left && n.switch_dir_fun("left"), n.con.state.right &&
										n.switch_dir_fun("right"))
							}
						} else n.trans.frame(999, 10);
						break;
					case "combo":
						if (n.frame.N === 121) switch (t) {
							case "att":
								var s = n.con.state.left !== n.con.state.right;
								if (s && n.frame.D.cpoint.taction) {
									var o = n.frame.D.cpoint.taction;
									o < 0 ? (n.switch_dir_fun(n.ps.dir === "right" ? "left" : "right"), n.trans.frame(-o, 10)) : n.trans.frame(
										o, 10);
									var u = n.data.frame[n.trans.next()];
									n.catching.caught_throw(u.cpoint, n.dirv())
								} else n.frame.D.cpoint.aaction ? n.trans.frame(n.frame.D.cpoint.aaction, 10) : n.trans.frame(122, 10);
								break;
							case "jump":
								n.frame.D.cpoint.jaction && n.trans.frame(n.frame.D.cpoint.jaction, 10)
						}
				}
			},
			10: function(e, t) {
				var n = this;
				switch (e) {
					case "state_exit":
						n.catching = 0;
						break;
					case "frame":
						n.state10 = {}, n.state10.frameTU = !0, n.trans.set_wait(99, 10, 99), n.frame.mobility = 0;
						break;
					case "TU":
						if (n.caught_cpointkind() === 2 && n.catching.caught_cpointkind() === 1) {
							if (n.state10.frameTU) {
								n.state10.frameTU = !1;
								var i = n.caught_b_holdpoint,
									s = n.caught_b_cpoint,
									o = n.caught_b_adir;
								s.vaction && n.trans.frame(s.vaction, 20);
								if (s.throwvz !== r.unspecified) {
									var u = s.throwvx,
										a = s.throwvy,
										f = s.throwvz;
									u !== 0 && (n.ps.vx = (o === "right" ? 1 : -1) * u), a !== 0 && (n.ps.vy = a), f !== 0 && (n.ps.vz = f * n.caught_throwz),
										n.mech.set_pos(n.ps.x + n.ps.vx * 2.5, n.ps.y + n.ps.vy * 2, n.ps.z + n.ps.vz)
								} else s.dircontrol === undefined ? (s.cover && s.cover >= 10 ? n.switch_dir_fun(o) : n.switch_dir_fun(o ===
									"left" ? "right" : "left"), n.mech.coincideXZ(i, n.mech.make_point(n.frame.D.cpoint))) : n.mech.coincideXY(
									i, n.mech.make_point(n.frame.D.cpoint))
							}
						} else n.trans.frame(212, 10)
				}
			},
			11: function(e, t) {
				var n = this;
				switch (e) {
					case "state_entry":
						n.trans.inc_wait(0, 20);
						break;
					case "frame":
						switch (n.frame.N) {
							case 220:
							case 222:
							case 224:
							case 226:
								n.trans.inc_wait(2, 20, 99), n.frame.mobility = 0
						}
				}
			},
			12: function(e, t) {
				var n = this;
				switch (e) {
					case "frame":
						if (n.effect.dvy <= 0) switch (n.frame.N) {
							case 180:
								n.trans.set_next(181);
								break;
							case 181:
								n.trans.set_next(182);
								break;
							case 182:
								n.trans.set_next(183);
								break;
							case 186:
								n.trans.set_next(187);
								break;
							case 187:
								n.trans.set_next(188);
								break;
							case 188:
								n.trans.set_next(189)
						} else switch (n.frame.N) {
							case 180:
								n.trans.set_next(185);
								break;
							case 186:
								n.trans.set_next(191)
						}
						break;
					case "fell_onto_ground":
					case "fall_onto_ground":
						var i = n.ps;
						if (n.mech.speed() > r.character.bounceup.limit.xy || i.vy > r.character.bounceup.limit.y) {
							i.vy *= r.character.bounceup.factor.y, i.vx *= r.character.bounceup.factor.x, i.vz *= r.character.bounceup.factor
								.z;
							if (180 <= n.frame.N && n.frame.N <= 185) return 185;
							if (186 <= n.frame.N && n.frame.N <= 191) return 191
						} else {
							if (180 <= n.frame.N && n.frame.N <= 185) return 230;
							if (186 <= n.frame.N && n.frame.N <= 191) return 231
						}
						n.caught_throwinjury !== 0 && (n.health.hp -= n.caught_throwinjury, n.caught_throwinjury = 0)
				}
			},
			14: function(e, t) {
				var n = this;
				switch (e) {
					case "state_entry":
						n.health.fall = 0, n.health.bdefend = 0
				}
			},
			15: function(e, t) {
				var n = this;
				switch (e) {
					case "frame":
						n.hold.obj && n.hold.obj.type === "heavyweapon" && n.frame.N === 19 && n.trans.set_next(12);
						break;
					case "combo":
						if (n.frame.N === 215) {
							t === "def" && n.trans.frame(102, 10);
							if (t === "jump") {
								var r = n.con.state.left !== n.con.state.right;
								r ? (n.trans.frame(213, 10), n.switch_dir_fun(r === 1 ? "right" : "left")) : (n.trans.inc_wait(2, 10, 99), n
									.trans.set_next(210, 10))
							}
						}
				}
			},
			16: function(e, t) {
				var n = this;
				switch (e) {}
			},
			x: function(e, t) {
				var n = this;
				switch (e) {}
			}
		},
		s = {
			0: !0,
			1: !0,
			2: !1,
			3: !1,
			4: !0,
			5: !0,
			6: !1,
			7: !0,
			8: !1,
			9: !1,
			10: !1,
			11: !1,
			12: !1,
			13: !0,
			14: !1,
			15: !1,
			16: !1
		};
	return o.prototype = new e, o.prototype.constructor = o, o.prototype.hit = function(e, t, n, i) {
		function l() {
			e.fall !== undefined ? s.health.fall += e.fall : s.health.fall += r.default.fall.value;
			var t = s.health.fall;
			0 < t && t <= 20 ? s.trans.frame(220, 20) : 20 < t && t <= 40 && s.ps.y < 0 ? c() : 20 < t && t <= 40 ? s.trans.frame(
				s.match.random() < .5 ? 222 : 224, 20) : 40 < t && t <= 60 ? s.trans.frame(226, 20) : r.fall.KO < t && c()
		}

		function c() {
			e.dvy === undefined && (s.effect.dvy = r.default.fall.dvy), s.health.fall = 0;
			var t = n.x > s.ps.x == (s.ps.dir === "right");
			t && e.dvx < 0 && e.bdefend >= 60 ? s.trans.frame(186, 20) : t ? s.trans.frame(180, 20) : t || s.trans.frame(186,
				20), s.proper(s.effect_id(a), "drop_weapon") && s.drop_weapon(s.effect.dvx, s.effect.dvy)
		}
		var s = this,
			o = !1;
		if (s.cur_state() === 10) {
			s.catching.caught_cpointhurtable() && (s.itr.lasthit = 0, o = !0, l());
			if (s.catching.caught_cpointhurtable() !== 0 || s.catching === t) {
				s.itr.lasthit = 0, o = !0, s.health.hp -= Math.abs(e.injury);
				if (e.injury > 0) {
					s.effect_create(0, r.effect.duration);
					var u;
					e.vaction ? u = e.vaction : u = n.x > s.ps.x == (s.ps.dir === "right") ? s.frame.D.cpoint.fronthurtact : s.frame
						.D.cpoint.backhurtact, s.trans.frame(u, 20)
				}
			}
		} else if (s.cur_state() !== 14) {
			s.itr.lasthit = 0, o = !0, s.effect.dvx = e.dvx ? t.dirh() * e.dvx : 0, s.effect.dvy = e.dvy ? e.dvy : 0;
			var a = e.effect !== undefined ? e.effect : r.default.effect.num;
			s.cur_state() === 7 && n.x > s.ps.x == (s.ps.dir === "right") ? (e.injury && (s.health.hp -= r.defend.injury.factor *
				e.injury), e.bdefend && (s.health.bdefend += e.bdefend), s.health.bdefend > r.defend.break ? s.trans.frame(112,
				20) : s.trans.frame(111, 20)) : (e.injury && (s.health.hp -= e.injury), s.health.bdefend = 45, l());
			var f = r.effect.duration;
			switch (s.trans.next()) {
				case 111:
					f = 4;
					break;
				case 112:
					f = 5
			}
			s.effect_create(a, f), s.visualeffect_create(a, i, n.x < s.ps.x, s.health.fall > 0 ? 1 : 2)
		}
		return o
	}, o.prototype.interaction = function() {
		var e = this,
			t = n.make_array(e.frame.D.itr);
		for (var i in t) {
			var s = t[i],
				o = e.mech.volume(s),
				u = e.scene.query(o, e, {
					tag: "body"
				});
			switch (s.kind) {
				case 0:
					for (var a in u) {
						var f = !0;
						u[a].type === "character" && u[a].team === e.team && (f = !1);
						if (f && e.itr_rest_test(u[a].uid, s) && u[a].hit(s, e, {
								x: e.ps.x,
								y: e.ps.y,
								z: e.ps.z
							}, o)) {
							e.itr_rest_update(u[a].uid, s), e.frame.N === 72 ? e.trans.inc_wait(4, 10) : e.trans.inc_wait(r.itr.hit_stall,
								10);
							if (s.arest) break
						}
					}
					break;
				case 1:
				case 3:
					for (var a in u)
						if (u[a].team !== e.team && u[a].type === "character" && (s.kind === 1 && u[a].cur_state() === 16 || s.kind ===
								3) && e.itr_rest_test(u[a].uid, s)) {
							var l = u[a].caught_a(s, e, {
								x: e.ps.x,
								y: e.ps.y,
								z: e.ps.z
							});
							if (l) {
								e.itr_rest_update(u[a].uid, s), l === "front" ? e.trans.frame(s.catchingact[0], 10) : e.trans.frame(s.catchingact[
									1], 10), e.catching = u[a];
								break
							}
						}
					break;
				case 7:
					if (!e.con.state.att) break;
				case 2:
					for (var a in u)
						if (u[a].type === "lightweapon" || u[a].type === "heavyweapon")
							if (u[a].pick(e)) {
								e.itr_rest_update(u[a].uid, s), s.kind === 2 && (u[a].type === "lightweapon" ? e.trans.frame(115, 10) : u[a]
										.type === "heavyweapon" && e.trans.frame(116, 10)), e.hold.obj = u[a], e.hold.obj.team = e.team, e.hold.id =
									e.hold.obj.id;
								break
							}
			}
		}
	}, o.prototype.wpoint = function() {
		var e = this;
		if (e.hold.obj && e.frame.D.wpoint) {
			var t = e.hold.obj.act(e, e.frame.D.wpoint, e.mech.make_point(e.frame.D.wpoint));
			t.thrown && (e.hold.obj = null, e.hold.id = 0), t.hit !== null && t.hit !== undefined && (e.itr_rest_update(t.hit,
				t), e.trans.inc_wait(r.itr.hit_stall, 10))
		}
	}, o.prototype.drop_weapon = function(e, t) {
		var n = this;
		n.hold.obj && (n.hold.obj.drop(e, t), n.hold.obj = null, n.hold.id = 0)
	}, o.prototype.vol_itr = function(e) {
		var t = this;
		return t.frame.D.itr ? t.mech.body(t.frame.D.itr, function(t) {
			return t.kind == e
		}) : []
	}, o.prototype.caught_a = function(e, t, n) {
		var r = this;
		if (r.cur_state() === 16) return n.x > r.ps.x == (r.ps.dir === "right") ? r.trans.frame(e.caughtact[0], 20) : r.trans
			.frame(e.caughtact[1], 20), r.health.fall = 0, r.catching = t, r.drop_weapon(), n.x > r.ps.x == (r.ps.dir ===
				"right") ? "front" : "back"
	}, o.prototype.caught_b = function(e, t, n) {
		var r = this;
		r.caught_b_holdpoint = e, r.caught_b_cpoint = t, r.caught_b_adir = n
	}, o.prototype.caught_cpointkind = function() {
		var e = this;
		return e.frame.D.cpoint ? e.frame.D.cpoint.kind : 0
	}, o.prototype.caught_cpointhurtable = function() {
		var e = this;
		return e.frame.D.cpoint && e.frame.D.cpoint.hurtable !== undefined ? e.frame.D.cpoint.hurtable : r.default.cpoint.hurtable
	}, o.prototype.caught_throw = function(e, t) {
		var n = this;
		e.vaction !== undefined ? n.trans.frame(e.vaction, 20) : n.trans.frame(r.default.cpoint.vaction, 20), n.caught_throwinjury =
			e.throwinjury, n.caught_throwz = t
	}, o
}), define("LF/weapon", ["LF/livingobject", "LF/global", "F.core/util"], function(e, t, n) {
	function i(t) {
		function s(n, r, s) {
			var o = this;
			e.call(this, n, r, s), o.type = t, o.states = i, o.setup()
		}
		var i = {
			generic: function(e, t) {
				var n = this;
				switch (e) {
					case "TU":
						n.interaction();
						switch (n.cur_state()) {
							case 1001:
							case 2001:
								break;
							default:
								n.mech.dynamics()
						}
						var i = n.ps;
						i.y === 0 && i.vy > 0 && (n.heavy && this.mech.speed() > r.weapon.bounceup.limit ? (i.vy = r.weapon.bounceup.speed
							.y, i.vx = r.weapon.bounceup.speed.x * (i.vx === 0 ? 0 : i.vx > 0 ? 1 : -1), i.vz = r.weapon.bounceup.speed
							.z * (i.vz === 0 ? 0 : i.vz > 0 ? 1 : -1)) : (i.vy = 0, n.light && n.trans.frame(70), n.heavy && n.trans.frame(
							21), n.health.hp -= n.data.bmp.weapon_drop_hurt), i.zz = 0)
				}
			},
			1004: function(e, t) {
				var n = this;
				switch (e) {
					case "frame":
						n.frame.N === 64 && (n.team = 0)
				}
			},
			2e3: function(e, t) {
				var n = this;
				switch (e) {
					case "frame":
						n.frame.N === 21 && n.trans.set_next(20)
				}
			},
			2004: function(e, t) {
				var n = this;
				switch (e) {
					case "frame":
						n.frame.N === 20 && (n.team = 0)
				}
			}
		};
		return s.prototype = new e, s.prototype.constructor = s, s.prototype.light = t === "lightweapon", s.prototype.heavy =
			t === "heavyweapon", s.prototype.interaction = function() {
				var e = this,
					t = n.make_array(e.frame.D.itr);
				if (e.team !== 0)
					if (e.heavy || e.light && e.cur_state() === 1002)
						for (var i in t)
							if (t[i].kind === 0) {
								var s = e.mech.volume(t[i]),
									o = e.scene.query(s, e, {
										tag: "body",
										not_team: e.team
									});
								for (var u in o) {
									var a;
									t[i].arest !== undefined || t[i].vrest !== undefined ? a = t[i] : a = r.default.weapon, a.arest && (a.arest +=
										20);
									if (e.itr_rest_test(o[u].uid, a) && o[u].hit(t[i], e, {
											x: e.ps.x,
											y: e.ps.y,
											z: e.ps.z
										}, s)) {
										var f = e.ps,
											l = f.vx === 0 ? 0 : f.vx > 0 ? 1 : -1;
										e.light && (f.vx = l * r.weapon.hit.vx, f.vy = r.weapon.hit.vy), e.itr_rest_update(o[u].uid, a), e.effect.timeout =
											2, e.effect.stuck = !0
									}
								}
							}
			}, s.prototype.hit = function(e, t, n, i) {
				var s = this;
				if (s.holder) return !1;
				var o = !1;
				if (s.light)
					if (s.cur_state() === 1002) o = !0, t.dirh() > 0 != s.ps.vx > 0 && (s.ps.vx *= r.weapon.reverse.factor.vx), s.ps
						.vy *= r.weapon.reverse.factor.vy, s.ps.vz *= r.weapon.reverse.factor.vz;
					else if (s.cur_state() === 1004) {
					o = !0;
					var u = t.mech.speed();
					s.ps.vx = u * r.weapon.gain.factor.x * (t.ps.vx > 0 ? 1 : -1), s.ps.vy = u * r.weapon.gain.factor.y
				}
				var a = e.fall !== undefined ? e.fall : r.default.fall.value;
				if (s.heavy) {
					o = !0;
					if (t.type === "character") a < r.fall.KO ? s.ps.vy = r.weapon.soft_bounceup.speed.y : s.ps.vy = r.weapon.bounceup
						.speed.y;
					else {
						var u = t.mech.speed();
						s.ps.vx = u * r.weapon.gain.factor.x * (t.ps.vx > 0 ? 1 : -1), s.ps.vy = u * r.weapon.gain.factor.y
					}
				}
				return s.team = t.team, s.visualeffect_create(0, i, n.x < s.ps.x, a < r.fall.KO ? 1 : 2), o
			}, s.prototype.act = function(e, t, i) {
				var s = this,
					o = s.frame.D,
					u = {};
				s.data.frame[t.weaponact] && (s.trans.frame(t.weaponact), s.trans.trans());
				if (o.wpoint && o.wpoint.kind === 2) {
					t.dvx && (s.ps.vx = e.dirh() * t.dvx), t.dvz && (s.ps.vz = e.dirv() * t.dvz), t.dvy && (s.ps.vy = t.dvy);
					if (s.ps.vx || s.ps.vy || s.ps.vz) {
						var a, f;
						s.light && (a = 73, f = -23), s.heavy && (a = 48, f = -40), s.mech.set_pos(e.ps.x + e.dirh() * a, e.ps.y + f, e
								.ps.z + s.ps.vz), s.ps.zz = 1, s.light && s.trans.frame(40), s.heavy && s.trans.frame(999), s.trans.trans(),
							s.holder = null, u.thrown = !0
					}
					if (!u.thrown) {
						var l = t.cover !== undefined ? t.cover : r.default.wpoint.cover;
						l === 1 ? s.ps.zz = -1 : s.ps.zz = 0, s.switch_dir_fun(e.ps.dir), s.ps.sz = s.ps.z = e.ps.z, s.mech.coincideXY(
							i, s.mech.make_point(o.wpoint)), s.mech.project()
					}
					if (s.light && t.attacking) {
						var c = n.make_array(o.itr);
						for (var h in c)
							if (c[h].kind === 5) {
								var p = s.mech.volume(c[h]),
									d = s.scene.query(p, [s, e], {
										tag: "body",
										not_team: s.team
									});
								for (var v in d)
									if (s.itr_rest_test(d[v].uid, c[h]) && e.itr_rest_test(d[v].uid, c[h])) {
										s.itr_rest_update(d[v].uid, c[h]);
										var m;
										s.data.weapon_strength_list && s.data.weapon_strength_list[t.attacking] ? m = s.data.weapon_strength_list[t
											.attacking] : m = c[h], d[v].hit(m, e, {
											x: e.ps.x,
											y: e.ps.y,
											z: e.ps.z
										}, p) && (m.vrest && (u.vrest = m.vrest), m.arest && (u.arest = m.arest), u.hit = d[v].uid)
									}
							}
					}
				}
				return u
			}, s.prototype.drop = function(e, t) {
				var n = this;
				n.team = 0, n.holder = null, e && (n.ps.vx = e * .5), t && (n.ps.vy = t * .2), n.ps.zz = 0, n.trans.frame(999)
			}, s.prototype.pick = function(e) {
				var t = this;
				return t.holder ? !1 : (t.holder = e, !0)
			}, s.prototype.vol_itr = function(e) {
				var t = this;
				return t.frame.D.itr ? t.mech.body(t.frame.D.itr, function(t) {
					return t.kind == e
				}) : []
			}, s
	}
	var r = t.gameplay;
	return i
}), define("F.core/effects-pool", [], function() {
	function e(e) {
		this.pool = [], this.S = 0, this.E = 0, this.full = !1, this.config = e, this.livecount = 0, e.new_arg ? e.new_arg instanceof Array ?
			this.new_arg = e.new_arg : this.new_arg = [e.new_arg] : this.new_arg = [];
		for (var t = 0; t < e.init_size; t++) this.pool[t] = e.construct(), this.pool[t].parent = this
	}
	return e.prototype.create = function() {
		if (this.full) {
			if (!(this.pool.length + this.config.batch_size <= this.config.max_size)) return !1;
			var e = [this.E, 0];
			for (var t = 0; t < this.config.batch_size; t++) e[t + 2] = this.config.construct(), e[t + 2].parent = this;
			this.pool.splice.apply(this.pool, e), this.S !== 0 && (this.S += this.config.batch_size), this.full = !1
		}
		this.E < this.pool.length ? this.E++ : this.E = 1;
		if (this.E === this.S || this.S === 0 && this.E === this.pool.length) this.full = !0;
		return this.pool[this.E - 1].born && this.pool[this.E - 1].born.apply(this.pool[this.E - 1], arguments), this.livecount++,
			this.pool[this.E - 1]
	}, e.prototype.die = function() {
		if (this.livecount > 0) {
			var e = this.S;
			return this.pool[this.S].die && this.pool[this.S].die.apply(this.pool[this.S], arguments), this.S < this.pool.length -
				1 ? this.S++ : this.S = 0, this.full = !1, this.livecount--, this.pool[e]
		}
		console.log("die too much!")
	}, e.prototype.for_each = function(e) {
		if (this.livecount !== 0)
			if (this.S < this.E) {
				for (var t = this.S; t < this.E; t++)
					if (e(this.pool[t]) === "break") break
			} else {
				for (var n = this.S; n < this.pool.length; n++)
					if (e(this.pool[n]) === "break") return;
				for (var t = 0; t < this.E; t++)
					if (e(this.pool[t]) === "break") return
			}
	}, e.prototype.call_each = function(e) {
		if (this.pool[0][e]) {
			var t = Array.prototype.slice.call(arguments, 1);
			this.for_each(function(n) {
				n[e].apply(n, t)
			})
		}
	}, e
}), define("LF/effects", ["LF/global", "LF/sprite", "F.core/effects-pool"], function(e, t, n) {
	function r(e, t, r) {
		this.efs = {};
		for (var s = 0; s < t.length; s++) var o = {
				init_size: 5,
				batch_size: 5,
				max_size: 30,
				construct: function() {
					return new i(e, t[s], r[s])
				}
			},
			u = this.efs[r[s]] = new n(o)
	}

	function i(e, n, r) {
		this.dat = n, this.type = n.effect_list, this.id = r, this.sp = new t(this.dat.bmp, e.stage), this.sp.hide(), this.frame,
			this.frameD, this.wait = -1, this.next
	}
	return r.prototype.create = function(e, t, n) {
		n || (n = 0), this.efs[t] && this.efs[t].create(e, n)
	}, r.prototype.TU = function() {
		for (var e in this.efs) this.efs[e].TU()
	}, r.prototype.transit = function() {}, n.prototype.TU = function() {
		this.for_each(function(e) {
			e.TU()
		})
	}, i.prototype.TU = function() {
		this.sp.show_pic(this.frameD.pic), this.wait = this.frameD.wait, this.next = this.frameD.next;
		if (this.wait === 0) {
			if (this.next === 999) this.next = 0;
			else if (this.next === 1e3) {
				this.sp.hide(), this.parent.die();
				return
			}
			this.frame = this.next, this.frameD = this.dat.frame[this.frame]
		} else this.wait--
	}, i.prototype.transit = function() {}, i.prototype.set_pos = function(e, t, n) {}, i.prototype.born = function(e,
		t) {
		var n;
		this.type[t] && this.type[t].frame ? n = this.type[t].frame : n = 0, this.frame = n, this.frameD = this.dat.frame[
			this.frame];
		var r = e.x - this.frameD.centerx,
			i = e.y - this.frameD.centery,
			s = e.z;
		this.sp.set_xy({
			x: r,
			y: i + s
		}), this.sp.set_z(s + 1), this.sp.show_pic(this.frameD.pic), this.sp.show()
	}, r
}), define("LF/factories", ["LF/character", "LF/weapon", "LF/effects"], function(e, t, n) {
	return {
		character: e,
		lightweapon: t("lightweapon"),
		heavyweapon: t("heavyweapon"),
		effects: n
	}
}), define("F.core/math", [], function() {
	return math = {
		inbetween: function(e, t, n) {
			var r, i;
			return t <= n ? (r = t, i = n) : (r = n, i = t), e >= r && e <= i
		},
		round_d2: function(e) {
			return Math.round(e * 100) / 100
		},
		negligible: function(e) {
			return -1e-8 < e && e < 1e-8
		},
		bezier2: function(e, t, n, r) {
			var i = new Array;
			for (var s = 0; s < r; s++) i.push(math.bezier2_step(e, t, n, s, r));
			return i.push(n), i
		},
		bezier2_step: function(e, t, n, r, i) {
			function o(e, t, n, r) {
				return ((r - n) * e + n * t) / r
			}
			var s = {
				x: 0,
				y: 0
			};
			return s.x = o(o(e.x, t.x, r, i), o(t.x, n.x, r, i), r, i), s.y = o(o(e.y, t.y, r, i), o(t.y, n.y, r, i), r, i),
				s
		},
		add: function(e, t) {
			return {
				x: e.x + t.x,
				y: e.y + t.y
			}
		},
		sub: function(e, t) {
			return {
				x: e.x - t.x,
				y: e.y - t.y
			}
		},
		sca: function(e, t) {
			return {
				x: e.x * t,
				y: e.y * t
			}
		},
		length: function(e) {
			return Math.sqrt(e.x * e.x + e.y * e.y)
		},
		distance: function(e, t) {
			return Math.sqrt((t.x - e.x) * (t.x - e.x) + (t.y - e.y) * (t.y - e.y))
		},
		negative: function(e) {
			return {
				x: -e.x,
				y: -e.y
			}
		},
		normalize: function(e) {
			return math.sca(e, 1 / math.length(e))
		},
		perpen: function(e) {
			return {
				x: -e.y,
				y: e.x
			}
		},
		signed_area: function(e, t, n) {
			var r = (t.x - e.x) * (n.y - e.y) - (n.x - e.x) * (t.y - e.y);
			return r
		},
		intersect: function(e, t, n, r) {
			var i, s, o, u, a;
			return o = (r.y - n.y) * (t.x - e.x) - (r.x - n.x) * (t.y - e.y), u = (r.x - n.x) * (e.y - n.y) - (r.y - n.y) *
				(e.x - n.x), a = (t.x - e.x) * (e.y - n.y) - (t.y - e.y) * (e.x - n.x), negligible(u) && negligible(a) &&
				negligible(o) ? {
					x: (e.x + t.x) * .5,
					y: (e.y + t.y) * .5
				} : negligible(o) ? {
					x: 0,
					y: 0
				} : (i = u / o, s = a / o, {
					x: e.x + i * (t.x - e.x),
					y: e.y + i * (t.y - e.y)
				})
		}
	}, math
}), define("F.core/collision", ["F.core/math"], function(e) {
	return {
		rect: function(e, t) {
			return e.bottom < t.top ? !1 : e.top > t.bottom ? !1 : e.right < t.left ? !1 : e.left > t.right ? !1 : !0
		},
		normalize_rect: function(e) {
			return e.left > e.right && e.top > e.bottom ? {
				left: e.right,
				right: e.left,
				top: e.bottom,
				bottom: e.top
			} : e.left > e.right ? {
				left: e.right,
				right: e.left,
				top: e.top,
				bottom: e.bottom
			} : e.top > e.bottom ? {
				left: e.left,
				right: e.right,
				top: e.bottom,
				bottom: e.top
			} : e
		},
		tri: function(t, n) {
			function o() {
				var e = s;
				return s += 4, i[e] != i[e + 1] && i[e + 2] != i[e + 3]
			}
			var r = e.signed_area,
				i = [],
				s = 0;
			i.push(r(t[0], t[1], n[0]) > 0, r(t[0], t[1], n[1]) > 0, r(t[0], n[0], n[1]) > 0, r(t[1], n[0], n[1]) > 0);
			if (o()) return !0;
			i.push(i[1], r(t[0], t[1], n[2]) > 0, r(t[0], n[1], n[2]) > 0, r(t[1], n[1], n[2]) > 0);
			if (o()) return !0;
			i.push(i[0], i[5], r(t[0], n[0], n[2]) > 0, r(t[1], n[0], n[2]) > 0);
			if (o()) return !0;
			i.push(r(t[1], t[2], n[0]) > 0, r(t[1], t[2], n[1]) > 0, i[3], r(t[2], n[0], n[1]) > 0);
			if (o()) return !0;
			i.push(i[13], r(t[1], t[2], n[2]) > 0, i[7], r(t[2], n[1], n[2]) > 0);
			if (o()) return !0;
			i.push(i[12], i[17], i[11], r(t[2], n[0], n[2]) > 0);
			if (o()) return !0;
			i.push(r(t[0], t[2], n[0]) > 0, r(t[0], t[2], n[1]) > 0, i[2], i[15]);
			if (o()) return !0;
			i.push(i[25], r(t[0], t[2], n[2]) > 0, i[6], i[19]);
			if (o()) return !0;
			i.push(i[24], i[29], i[10], i[23]);
			if (o()) return !0;
			var u = [i[2] == i[6] && i[6] == !i[10], i[3] == i[7] && i[7] == !i[11], i[15] == i[19] && i[19] == !i[23]],
				a = [i[0] == i[12] && i[12] == !i[24], i[1] == i[13] && i[13] == !i[25], i[9] == i[21] && i[21] == !i[33]];
			return u[0] && u[1] && u[2] ? !0 : a[0] && a[1] && a[2] ? !0 : !1
		},
		circle: function(t, n) {
			return e.distance(t.center, n.center) <= t.radius + n.radius
		},
		line: function(t, n, r, i) {
			var s = e.signed_area(t, n, r) > 0 != e.signed_area(t, n, i) > 0 && e.signed_area(r, i, t) > 0 != e.signed_area(r,
				i, n) > 0;
			return s
		},
		point_in_rect: function(t, n) {
			return e.inbetween(t.x, n.left, n.right) && e.inbetween(t.y, n.top, n.bottom)
		}
	}
}), define("LF/scene", ["F.core/util", "F.core/collision"], function(e, t) {
	function r(e) {
		this.live = {}
	}
	var n = 0;
	return r.prototype.add = function(e) {
		return e.uid = n++, this.live[e.uid] = e, e.uid
	}, r.prototype.remove = function(e) {
		delete this.live[e.uid], e.uid = -1
	}, r.prototype.query = function(t, n, r) {
		var i = [],
			s = r.tag;
		s || (s = "body");
		var o = 0,
			u = s.indexOf(":");
		u !== -1 && (o = s.slice(u + 1), s = s.slice(0, u)), n = e.make_array(n);
		for (var a in this.live) {
			var f = !1;
			for (var l in n)
				if (this.live[a] === n[l]) {
					f = !0;
					break
				}
			if (f) continue;
			if (r.not_team && this.live[a].team === r.not_team) continue;
			if (r.type && this.live[a].type !== r.type) continue;
			if (r.filter && !r.filter(this.live[a])) continue;
			if (this.live[a]["vol_" + s]) {
				var c = this.live[a]["vol_" + s](o);
				for (var h in c)
					if (this.intersect(t, c[h])) {
						i.push(this.live[a]);
						break
					}
			}
		}
		return i
	}, r.prototype.intersect = function(e, n) {
		var r = {
				left: e.x + e.vx,
				top: e.y + e.vy,
				right: e.x + e.vx + e.w,
				bottom: e.y + e.vy + e.h
			},
			i = {
				left: n.x + n.vx,
				top: n.y + n.vy,
				right: n.x + n.vx + n.w,
				bottom: n.y + n.vy + n.h
			};
		return t.rect(r, i) && t.rect({
			left: e.z - e.zwidth,
			top: 0,
			right: e.z + e.zwidth,
			bottom: 1
		}, {
			left: n.z - n.zwidth,
			top: 0,
			right: n.z + n.zwidth,
			bottom: 1
		})
	}, r.prototype.distance = function(e, t) {
		var n = e.x + e.centerx - (t.x + t.centerx),
			r = e.y - t.y,
			i = e.z + e.centery - (t.z + t.centery);
		return Math.sqrt(n * n + r * r + i * i)
	}, r
}), define("LF/third_party/random", [], function() {
	function e() {
		this.next = function() {
			return this.x == 0 && this.x == -1, this.y == 0 && this.y == -1, this.x = this.nextX(), this.y = this.nextY(), ((
				this.x << 16) + (this.y & 65535)) / 4294967295 + .5
		}, this.nextX = function() {
			return 36969 * (this.x & 65535) + (this.x >> 16)
		}, this.nextY = function() {
			return 18273 * (this.y & 65535) + (this.y >> 16)
		}, this.nextInt = function(t, n) {
			return n || (t = 0, n = 4294967295), Math.floor(this.next() * (n - t)) + t
		}, this.seed = function(e) {
			this.x = e * 3253, this.y = this.nextX()
		}, this.seed2d = function(t, n) {
			this.x = t * 2549 + n * 3571, this.y = n * 2549 + t * 3571
		}, this.seed3d = function(t, n, r) {
			this.x = t * 2549 + n * 3571 + r * 3253, this.y = t * 3253 + n * 2549 + r * 3571
		}, this.seed_bytime = function() {
			var e = (new Date).getTime();
			return this.seed(e), e
		}
	}
	return e
}), define("LF/match", ["F.core/util", "F.core/controller", "LF/factories", "LF/scene", "LF/third_party/random"],
	function(e, t, n, r, i) {
		function s(t) {
			this.stage = t.stage, this.state = t.state, this.data = t.package.data, this.spec = t.package.specification, this.grouped_object =
				e.group_elements(this.data.object, "type"), this.config = t.config, this.config || (this.config = {}), this.time
		}
		return s.prototype.create = function(e) {
			this.scene = new r, this.effects = this.create_effects(this.config.effects), this.character = this.create_characters(
					e.player), this.randomseed = this.new_randomseed(), this.control = this.create_controller(e.control), this.lightweapon = [],
				this.heavyweapon = [], this.drop_weapons(), this.create_timer()
		}, s.prototype.create_timer = function() {
			this.time = {
				paused: !1,
				timer: null,
				$fps: document.getElementById("fps")
			};
			var e = this;
			this.time.timer = setInterval(function() {
				e.frame()
			}, 1e3 / 30.5)
		}, s.prototype.frame = function() {
			this.control && this.control.fetch(), this.time.paused ? this.time.$fps && (this.time.$fps.value = "paused") : (
				this.TU_trans(), this.calculate_fps(1))
		}, s.prototype.TU_trans = function() {
			this.for_all("transit"), this.for_all("TU")
		}, s.prototype.for_all = function(e) {
			for (var t in this.character) this.character[t][e]();
			for (var t in this.lightweapon) this.lightweapon[t][e]();
			for (var t in this.heavyweapon) this.heavyweapon[t][e]();
			this.effects[e]()
		}, s.prototype.calculate_fps = function(e) {
			if (this.time.$fps) {
				var t = this.time.time;
				this.time.time = (new Date).getTime();
				var n = this.time.time - t;
				this.time.$fps.value = Math.round(1e3 / n * e) + "fps"
			}
		}, s.prototype.create_characters = function(e) {
			var t = [{
					x: 400,
					y: 0,
					z: 200
				}, {
					x: 300,
					y: 0,
					z: 200
				}, {
					x: 200,
					y: 0,
					z: 200
				}, {
					x: 500,
					y: 0,
					z: 200
				}],
				r = [],
				i = {
					spec: this.spec,
					controller: null,
					match: this,
					stage: this.stage,
					scene: this.scene,
					effects: this.effects,
					team: 0
				};
			for (var s = 0; s < e.length; s++) {
				var o = e[s];
				i.controller = o.controller, i.team = o.team;
				var u = r.push(new n.character(i, o.data, o.id));
				r[u - 1].set_pos(t[u - 1].x, t[u - 1].y, t[u - 1].z)
			}
			return r
		}, s.prototype.create_effects = function(t) {
			var r = t ? t : {
				init_size: 20
			};
			r.match = this, r.stage = this.stage;
			var i = e.extract_array(this.grouped_object.effects, ["data", "id"]);
			return new n.effects(r, i.data, i.id)
		}, s.prototype.create_random = function() {}, s.prototype.drop_weapons = function() {
			this.create_weapon(100, {
				x: 100,
				y: -800,
				z: 200
			}), this.create_weapon(101, {
				x: 500,
				y: -800,
				z: 200
			}), this.create_weapon(150, {
				x: 400,
				y: -800,
				z: 250
			})
		}, s.prototype.create_weapon = function(t, r) {
			var i = t < 150 ? "lightweapon" : "heavyweapon",
				s = {
					spec: this.spec,
					match: this,
					stage: this.stage,
					scene: this.scene,
					effects: this.effects
				},
				o = e.arr_search(this.grouped_object[i], function(e) {
					return e.id === t
				}),
				u = this.grouped_object[i][o],
				a = new n[i](s, u.data, u.id);
			a.set_pos(r.x, r.y, r.z), this[i].push(a)
		}, s.prototype.periodic_event = function(e) {}, s.prototype.new_randomseed = function() {
			var e = new i;
			return e.seed_bytime(), e
		}, s.prototype.random = function() {
			return this.randomseed.next()
		}, s.prototype.create_controller = function(e) {
			if (e === "debug") {
				var n = {
						0: "0",
						1: "1",
						2: "2",
						3: "3",
						4: "4",
						5: "5",
						6: "6",
						7: "7",
						8: "8",
						9: "9",
						ctrl: "ctrl"
					},
					r = new t(n),
					i = this;
				return r.child.push({
					key: function(e, t) {
						if (t) switch (e) {
							case "1":
								i.time.paused ? i.time.paused = !1 : i.time.paused = !0;
								break;
							case "2":
								i.time.paused ? i.TU_trans() : i.time.paused = !0
						}
					}
				}), r.sync = !0, r
			}
		}, s
	}), define("LF/keychanger", ["F.core/controller"], function(e) {
	function t(t, n) {
		function o(n, r) {
			function h(t, r) {
				a(t, r);
				var i = a(t, n.config[r]);
				i.style.cursor = "pointer", i.onclick = function() {
					if (!change_active) {
						change_active = !0;
						var t = this;
						t.style.backgroundColor = "#FAA";
						var s = window.onkeydown;
						window.onkeydown = function(o) {
							o || (o = window.event);
							var u = o.keyCode;
							window.onkeydown = s, i.innerHTML = e.keycode_to_keyname(u), n.config[r] = e.keycode_to_keyname(u), n.keycode[
								r] = u, t.style.backgroundColor = "#EEE", change_active = !1
						}
					}
				}
			}
			if (r !== 0) {
				var i = u(t, "div");
				i.style.float = "left", i.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;"
			}
			var s = u(t, "table");
			s.style.float = "left";
			var o = [];
			o[0] = u(s, "tr");
			var f = a(o[0], "player " + (r + 1));
			f.colSpan = "2";
			var l = 1;
			for (var c in n.config) o[l] = u(s, "tr"), h(o[l], c), l++
		}

		function u(e, t, n) {
			var r = document.createElement(t);
			return e.appendChild(r), n && (r.id = n), r
		}

		function a(e, t) {
			var n = u(e, "td");
			return n.innerHTML = t, n.style.border = "1px solid #AAA", n.style.backgroundColor = "#EEE", n.style.fontFamily =
				"monospace", n.style.width = "40px", n.style.textAlign = "center", n
		}
		t.style.textAlign = "center";
		for (var r = 0; r < n.length; r++) o(n[r], r);
		var i = u(t, "div");
		i.style.clear = "both";
		var s = u(t, "button");
		s.innerHTML = "close", s.style.width = "120px", s.onclick = function() {
			s.onclick = null, t.parentNode.removeChild(t)
		}
	}
	return change_active = !1, t
}), define("LF/demo/buildinfo.js", {
	timestamp: "unbuilt"
}), requirejs.config({
	baseUrl: "../../",
	paths: {},
	config: {}
}), requirejs(["F.core/controller", "F.core/sprite", "LF/loader!packages", "LF/match", "LF/keychanger",
	"./buildinfo.js"
], function(e, t, n, r, i, s) {
	t.masterconfig_set("baseUrl", n.location);
	var o = {
			up: "u",
			down: "m",
			left: "h",
			right: "k",
			def: ",",
			jump: "i",
			att: "j"
		},
		u = {
			up: "w",
			down: "x",
			left: "a",
			right: "d",
			def: "z",
			jump: "q",
			att: "s"
		},
		a = new e(o),
		f = new e(u);
	a.sync = !0, f.sync = !0;
	var l = document.getElementById("keychanger");
	l.style.display = "none", i(l, [a, f]), l.style.backgroundColor = "#FFF", l.style.display = "", document.getElementById(
		"footnote").innerHTML += "; " + (s.timestamp === "unbuilt" ? "unbuilt demo" : "built on: " + s.timestamp);
	var c = new r({
		stage: document.getElementById("stage"),
		state: null,
		config: null,
		"package": n
	});
	c.create({
		player: [{
			controller: a,
			data: n.data.object[0].data,
			id: n.data.object[0].id,
			team: 1
		}, {
			controller: f,
			data: n.data.object[1].data,
			id: n.data.object[1].id,
			team: 2
		}],
		control: "debug"
	})
}), define("LF/demo/demo3", function() {});
