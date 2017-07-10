(function(map_width_height){
	if(map_width_height % 2 != 0) {
		alert('Even rows required!');
		return;
	}
	var pic_wh = 40;
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
		var pic_array = [], id, sub_x, sub_y, tmp;
		var pic_array_len = map_width_height * map_width_height;
		var all_row_columns = [];
		for (var i = 1; i <= map_width_height; i++) 
			for(var j = 1; j <= map_width_height; j++)
				all_row_columns.push({x:i, y:j});
		all_row_columns = _.shuffle(all_row_columns);
		for (var i = 0; i < all_row_columns.length; i+=2) {
			id = parseInt(1 + Math.random() * (pic_len - 0.0001));
			// i
			tmp = all_row_columns[i];
			MAP[tmp.x][tmp.y] = id;
			pic_array.push({
				id: id, 
				src: pre_src + id + '.jpg', 
				pos: {x: tmp.x, y: tmp.y},
				space: find(tmp.x, tmp.y)
			});
			//i + 1
			tmp = all_row_columns[i + 1];
			MAP[tmp.x][tmp.y] = id;
			pic_array.push({
				id: id, 
				src: pre_src + id + '.jpg', 
				pos: {x: tmp.x, y: tmp.y},
				space: find(tmp.x, tmp.y)
			});
		};
		return pic_array;
	}
	function fetch_first_undistribute(sub_map){
		for (var i = 0; i < sub_map.length; i++) {
			if(!sub_map[i].distribute) return i;
		};
		return -1;
	}
	//---------------------------------------------------------
	/**
	 * 拉斯维加斯算法和回溯法创建有效棋盘
	 * 
	 */
	function init_map_layout(sub_map, distributed_num, pic_index){
		if(sub_map.length == distributed_num) return true;
		var id = (pic_index % pic_len) + 1;
		var last = sub_map[fetch_first_undistribute(sub_map)];
		last.distribute = true;
		MAP[last.x][last.y] = id;
		for(var i = 0; i < sub_map.length; ++i){
			var tmp = sub_map[i];
			if(tmp.distribute) continue;
			MAP[tmp.x][tmp.y] = id;
			let re = search(MAP, last, tmp);
			if(re.length <= 0){
				last.distribute = false;
				//MAP[last.x][last.y] = -1;
				MAP[tmp.x][tmp.y] = -1;
			}else{
				last.distribute = tmp.distribute = true;
				if(init_map_layout(sub_map, distributed_num + 2, pic_index + 1)){
					return true;
				}else{
					MAP[tmp.x][tmp.y] = -1;
					last.distributed = tmp.distribute = false;
				}
			}
		}
		MAP[last.x][last.y] = -1;
		return false;
	}
	function generate_map(){
		var sub_map = [];
		for (var i = 1; i <= map_width_height; i++) {
			for (var j = 1; j <= map_width_height; j++) {
				sub_map.push({x: i, y: j, distribute: false});
			};
		};
		sub_map = _.shuffle(sub_map);
		debugger;
		var re = init_map_layout(sub_map, 0, 1);
		console.log(MAP);
		
	}
	//---------------------------------------------------------

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
	      pics: [],
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
	        	if(this.pics[which_one].id != this.pics[which_two].id || which_one == which_two){
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
	        					alert('Congratulations!');
	        				}
	        			}).bind(this), 300)
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

	var control = new Vue({
		el: '#header',
		methods: {
			start: function(){
				vm.pics = cal_data();
				console.log('start');
			},
			deep_clone: function(arg){
				if(Array.isArray(arg)){
					var sub_arr = [];
					for (var i = 0; i < arg.length; i++) {
						sub_arr.push(this.deep_clone(arg[i]));
					};
					return sub_arr;
				}else if(Object.prototype.toString.call(arg) === "[object Object]"){
					var sub_obj = {};
					for(var k in arg){
						sub_obj[k] = deep_clone(arg[k]);
					}
					return sub_obj;
				}else{
					return arg;
				}
			},	
			confused: function(){
				var new_pics = vm.pics.map((d, i) => {
					var tmp = {};
					tmp.id = d.id;
					tmp.pos = d.pos;
					tmp.space = d.space;
					tmp.src = d.src;
					return tmp;
				});
				debugger;
				var pos_set = new_pics.map((d, i) => d.pos);
				pos_set = _.shuffle(pos_set);
				var new_arr = [];
				new_pics.forEach((d, i) => {
					d.pos = pos_set[i];
					new_arr.push(Object.assign({}, d));
				});
			}

		}
	});
})(10);
