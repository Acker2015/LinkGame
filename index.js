
//

(function(map_width_height){
	var pic_wh = 30;
	var padding = 5;
	var pre_src = './img/';
	var pic_len = map_width_height * map_width_height / 2 > 30 ? 30 : map_width_height * map_width_height / 2;
	function cal_data(){
		var pic_array = [], id;
		var pic_array_len = map_width_height * map_width_height;
		for (var i = 0; i < pic_array_len; i++) {
			id = i % (pic_len + 1);
			pic_array.push({id: id, src: pre_src + id + '.jpg'});
		};
		return pic_array;
	}
	/**
	 * Calculate pixel width and height of the game window.
	 *
	 * @param len {Number} width and height of the picture map
	 * @returns Object	
	 */
	function cal_squ(len){
		// (len + 2) * (len + 2)
		var real_len = len + 2;
		var width, height;
		width = real_len * pic_wh + (real_len - 1) * padding;
		height = width;
		return {width, height};
	}
	function find(i, j){
		var y = (i - 1) * (pic_wh + padding);
		var x = (j - 1) * (pic_wh + padding);
		return {x: x, y: y, width: pic_wh, height: pic_wh};
	}
	/**
	 * calculate pixel path of two picture
	 *
	 * @param    {Array}  path  matrix array of two picture
	 * @returns  Array
	 */
	function createPath(path){
		var points = [];
		path.forEach(function(d, i){
			let loc = find(d.x, d.y);
			points.push({x: loc.x + loc.width / 2, y: loc.y + loc.height} / 2);
		});
		return points;
	}	
	var vm = new Vue({
	    el: '#linkgame',
	    data: {
	      pics: [
	        {x: 0, y: 0, width: 30, height: 30, url: './img/1.jpg'},
	        {x: 35, y: 0, width: 30, height: 30, url: './img/5.jpg'},
	        {x: 70, y: 0, width: 30, height: 30, url: './img/7.jpg'},
	        {x: 105, y: 0, width: 30, height: 30, url: './img/9.jpg'},
	      ]
	    },
	    methods: {
	      hello: function(event){
	        console.log(event);
	      }
	    }
	 });

})(10);
