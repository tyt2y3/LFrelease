/** serves the same as data.txt or (deep_chop.dat in earlier versions)
 */
/**
type:
character				id from 0~99
lightweapon				id from 100~149
heavyweapon				id from 150~199
specialattack			id from 200~299
baseball
miscell (Criminal, etc, broken_weapon)
drink (Milk and beer)
effects (blood,fire)	id from 300~349 (extended standard)
 */
//adapted standard

define({

	object:
	[
		{id:30, type:'character', file:'data/bandit.js', name:'Bandit', pic:'sprite/bandit_f.png'},
		{id: 1, type:'character', file:'data/deep.js', name:'Deep', pic:'sprite/deep_f.png'},
		{id:11, type:'character', file:'data/davis.js', name:'Davis', pic:'sprite/davis_f.png'},

		{id:100, type:'lightweapon', file:'data/weapon0.js'}, //stick
		{id:101, type:'lightweapon', file:'data/weapon2.js'}, //hoe
		{id:150, type:'heavyweapon', file:'data/weapon1.js'}, //stone

		{id:300, type:'effects', file:'data/effect0.js'}, //blast
		{id:301, type:'effects', file:'data/effect1.js'}, //blood

		{id:203, type:'specialattack', file:'data/deep_ball.js'},
		{id:207, type:'specialattack', file:'data/davis_ball.js'}
	],

	AI:
	[
		{type:'AIscript', file:'AI/Crusher.js', name:'Crusher 1.0'}
	],

	file_editing: {},

	background:
	[
		{id:4, file:'bg/hkc/bg.js'},
		{id:2, file:'bg/lf/bg.js'},
		{id:3, file:'bg/sp/bg.js'},
		{id:5, file:'bg/gw/bg.js'},
		{id:6, file:'bg/qi/bg.js'},
		{id:7, file:'bg/ft/bg.js'},
		{id:1, file:'bg/cuhk/bg.js'},
		{id:0, file:'bg/thv/bg.js'},
		{id:10,file:'bg/template/bg.js'}
	],

	config:
	[
		'id: 100~199 drop weapon'
	],

	//extended standard

	UI: {file:'UI/UI.js'},

	properties: {file:'data/properties.js'}

});
