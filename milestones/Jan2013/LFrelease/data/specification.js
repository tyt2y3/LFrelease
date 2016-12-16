/** extended standard
	specify the properties of each object id
 */

define(function()
{

var ID={};

/** 0: default*/
ID['0']={};

/** 30: bandit*/
ID['30']=
{
	dash_backatt: false //can attack while dashing and turned back
};

/**	Light Weapons		id from 100~149*/

ID['100']= //stick (baseball bat)
{
	mass: 0.35,
	attackable: true, //can hold this to attack
	run_throw: true, //can throw while running by forward-attack
	jump_throw: true, //can throw while jumping by forward-attack
	dash_throw: false, //can throw while dashing
	stand_throw: false, //can throw while standing by forward-attack
	just_throw: false //can throw while standing by just pressing attack
	//TODO: 039.wav when hitting id: 121
};

ID['101']= //hoe
{
	mass: 0.65,
	attackable: true,
	run_throw: true,
	jump_throw: true
};

/**  heavyweapon				id from 150~199*/

ID['150']= //stone
{
	mass: 0.8
};

/**	Effects				id from 300~349 (extended standard)*/

ID['300']= //hit
{
	oscillate: 4, //oscillation amplitude
	cant_move: true,
	drop_weapon: true
};

ID['301']= //blood
{
	cant_move: true,
	drop_weapon: true
};

return ID;

});
