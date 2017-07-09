
//

(function(map_width_height){
	var pic_wh = 30;
	var padding = 5;
	var pre_src = './img/';
	var pic_len = map_width_height * map_width_height / 2 > 30 ? 30 : parseInt(map_width_height * map_width_height / 2);
	var MAP = [];
	for (var i = 0; i < map_width_height + 2; i++) {
		MAP.push([]);
		for(var j = 0; j < map_width_height + 2; j++){
			MAP[i][j] = -1;
		}
	};
	function cal_data(){
		var pic_array = [], id, sub_x, sub_y;
		var pic_array_len = map_width_height * map_width_height;
		for (var i = 0; i < pic_array_len; i++) {

			id = i % (pic_len) + 1;
			//start for(1, 1);
			//11->(1, 1)->(2, 2)
			sub_x = parseInt(i / map_width_height);
			sub_y = i % map_width_height;
			sub_x++; sub_y++;
			MAP[sub_x][sub_y] = id;
			pic_array.push({
				id: id, 
				src: pre_src + id + '.jpg', 
				pos: {x: sub_x, y: sub_y},
				space: find(sub_x, sub_y)
				});
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
		var y = (i) * (pic_wh + padding);
		var x = (j) * (pic_wh + padding);
		return {x: x, y: y, width: pic_wh, height: pic_wh};
	}
	/**
	 * calculate pixel path of two picture
	 *
	 * @param    {Array}  path  matrix array of two picture
	 * @returns  Array
	 */
	function create_path(path){
		var points = [];
		path.forEach((d, i) => {
			let loc = find(d.x, d.y);
			points.push({x: loc.x + loc.width / 2, y: loc.y + loc.height / 2});
		});
		var path_str= '';
		points.forEach((d, i) => {
			path_str += (i == 0 ? `M${d.x} ${d.y}` : ` L${d.x} ${d.y}`);
		})
		return path_str;
	}
	function get_which(ele){
		return parseInt(ele.getAttribute('which'));
	}	
	function get_pic_id(ele){
		return ele.getAttribute('sub-id');
	}
	var vm = new Vue({
	    el: '#linkgame',
	    data: {
	      // pics: [
	      //   {x: 0, y: 0, width: 30, height: 30, url: './img/1.jpg'},
	      //   {x: 35, y: 0, width: 30, height: 30, url: './img/5.jpg'},
	      //   {x: 70, y: 0, width: 30, height: 30, url: './img/7.jpg'},
	      //   {x: 105, y: 0, width: 30, height: 30, url: './img/9.jpg'},
	      // ],
	      pics: cal_data(),
	      space: cal_squ(map_width_height),
	      path: '',
	      select_one: undefined,
	      select_two: undefined

	    },
	    methods: {
	      hello: function(event){
	      	var target = event.target;
	      	target.setAttribute('opacity', 0.5);
	        if(this.select_one === undefined){
	        	this.select_one = target;
	        }else{
	        	this.select_two = target;
	        	let which_one = get_which(this.select_one);
	        	let which_two = get_which(this.select_two);
	        	if(this.pics[which_one].id != this.pics[which_two].id){
	        		this.init_select();
	        		return;
	        	}else{
	        		let pos_one = this.pics[which_one].pos;
	        		let pos_two = this.pics[which_two].pos;
	        		let re = search(MAP, pos_one, pos_two);
	        		if(re.length <= 0){
	        			this.init_select();
	        		}else{
	        			//update map
	        			MAP[pos_one.x][pos_one.y] = -1;
	        			MAP[pos_two.x][pos_two.y] = -1;
	        			//create path
	        			this.path = create_path(re);
	        			//link two same pic
	        			setTimeout((function(){
	        				let s1 = this.select_one, s2 = this.select_two;
	        				this.init_select();
	        				var parent = s1.parentElement;
	        				parent.removeChild(s1);
	        				parent.removeChild(s2);
	        				this.path = '';
	        				if(this.check()){
	        					alert('恭喜!');
	        				}
	        			}).bind(this), 500)
	        		}
	        	}
	        }
	      },
	      init_select: function(){
	      	this.select_one.setAttribute('opacity', 1);
	      	this.select_two.setAttribute('opacity', 1);
	      	this.select_one = this.select_two = undefined;
	      },
	      check: function(){
	      	var flag = true;
	      	MAP.forEach((d, i)=>{
	      		d.forEach((e, j) => {
	      			if(e != -1) flag = false;
	      		})
	      	});
	      	return flag;
	      }
	    }
	 });
})(10);
