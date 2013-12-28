//extended standard
define({
	panel:
	{
		pic:'UI/panel.png',
		x: 5, y: 6,
		hpx: 57, hpy: 16, hpw: 125, hph: 10,
		mpx: 57, mpy: 36, mpw: 125, mph: 10,
		hp_bright: '#FF0000',
		hp_dark: '#6f081f',
		mp_bright: '#0000FF',
		mp_dark: '#1f086f',
		pane_width:198,
		pane_height:53
	},
	pause:'UI/pause.png',
	character_selection:
	{
		pic:'UI/character_selection.png',
		posx:[
			147,300,453,606
		],
		posy:[
			93,213,234,256,
			299,420,441,463
		],
		waiting:
		{
			pic:'UI/press_attack_to_join.png',
			w:120,h:116
		},
		text:
		{
			//      blink1    blink2    static    computer
			color:['#afdcff','#1946ff','#ffffff','#ff9b9b'],
			box_width:120, box_height:18
		}
	}
});