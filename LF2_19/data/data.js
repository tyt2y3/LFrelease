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
drinks (Milk and beer)
effects (blood,fire)	id from 300~349 (extended standard)
 */
//adapted standard

define({

	object:
	[
		{id:30, type:'character', file:'data/bandit.js'},
		{id: 1, type:'character', file:'data/deep.js'},

		{id:100, type:'lightweapon', file:'data/weapon0.js'}, //stick
		{id:101, type:'lightweapon', file:'data/weapon2.js'}, //hoe
		{id:150, type:'heavyweapon', file:'data/weapon1.js'}, //stone

		{id:300, type:'effects', file:'data/effect0.js'}, //blast
		{id:301, type:'effects', file:'data/effect1.js'}, //blood

		{id:203, type:'specialattack', file:'data/deep_ball.js'}
	],

	file_editing: {},

	background:
	[
		{id:1, file:'bg/cuhk/bg.js'},
		{id:10,file:'bg/template/1/bg.js'}
	],

	UI: {file:'data/UI.js'},

	config:
	[
		{id:'100~199', then:'drop weapon'}
	]
});
