/** extended standard
	specify the properties of each object id
 */

define(function()
{

var ID={};

// 1: Deep
ID[1]=
{
	//hp:500,mp:500 //optional
};

// 30: Bandit
ID[30]=
{
	dash_backattack: false, //can attack while dashing and turned back
	heavy_weapon_dash: false,//extended standard; can dash while holding a heavy weapon
	heavy_weapon_jump: false //extended standard; can jump while holding a heavy weapon
};

// lightweapon		id from 100~149

ID[100]= //stick (baseball bat)
{
	mass: 0.3,
	attackable: true, //can hold this to attack
	run_throw: true, //can throw while running by forward-attack
	jump_throw: true, //can throw while jumping by forward-attack
	dash_throw: false, //can throw while dashing
	stand_throw: false, //can throw while standing by forward-attack
	just_throw: false, //can throw while standing by just pressing attack
	no_shadow: false
	//TODO: 039.wav when hitting id: 121
};

ID[101]= //hoe
{
	mass: 0.7,
	attackable: true,
	run_throw: true,
	jump_throw: true
};

// heavyweapon		id from 150~199

ID[150]= //stone
{
	mass: 0.9
};

// specialattack	id from 200~299

ID[203]=
{
	mass: 0
};

// effects			id from 300~349 (extended standard)

ID[300]= //hit
{
	oscillate: 4, //oscillation amplitude
	cant_move: true,
	drop_weapon: true
};

ID[301]= //blood
{
	cant_move: true,
	drop_weapon: true
};

ID[304]=
{
	cant_move: true,
	drop_weapon: true,
	reflect_flying_attack: true
};

return ID;

});
