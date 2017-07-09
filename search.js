var search = function(array, begin, end){
	/*
	6 * 6
	*/
	// var array = [
	// 	[-1, -1, -1, -1, -1, -1, -1],
	// 	[-1, -1, -1,  3,  1,  0, -1],
	// 	[-1, -1,  7, -1,  9, 10, -1],
	// 	[-1, -1,  2, -1,  9, 11, -1],
	// 	[-1, -1,  3, -1,  6,  7, -1],
	// 	[-1,  8, 10, 11, 12, 12, -1],
	// 	[-1, -1, -1, -1, -1, -1, -1],
	// ]
	var len = array.length;
	var big_corner = 100;
	var big_distance = 10000;
	function create_help_array(map){
		var len = map.length;
		var arr = new Array(len);
		map.forEach((d, i) => {
			arr[i] = [];
			d.forEach((e, j) => {
				arr[i][j] = {value: e, minCrossing: big_corner, minDistance: big_distance, lastPos: undefined}
			});
		});
		return arr;
	}
	function set(help_map, last, cur){
		/*
		  1.have less corners.
		  2.have same corners with less distance.
		*/
		var diffDis = last.x == cur.x ? Math.abs(last.y - cur.y) : Math.abs(last.x - cur.x);
		if(help_map[last.x][last.y].minCrossing + 1 < help_map[cur.x][cur.y].minCrossing || 
		  (help_map[last.x][last.y].minCrossing + 1 == help_map[cur.x][cur.y].minCrossing && 
		   help_map[last.x][last.y].minDistance + diffDis < help_map[cur.x][cur.y].minDistance)){
			help_map[cur.x][cur.y].minCrossing = help_map[last.x][last.y].minCrossing + 1;
			help_map[cur.x][cur.y].minDistance = help_map[last.x][last.y].minDistance + diffDis;
			help_map[cur.x][cur.y].lastPos = last;
		}
	}
	function find_horz_vert_each(help_map, goal, end){
		var sub_x = goal.x, sub_y =  goal.y, len = help_map.length;
		
		//----------------------vertical touch-----------------------
		// ->bottom
		sub_x += 1;
		while(sub_x < len && (help_map[sub_x][sub_y].value == -1 || help_map[sub_x][sub_y].value == help_map[end.x][end.y].value)){
			set(help_map, goal, {x: sub_x, y: sub_y});
			sub_x++;
		}
		// ->top
		sub_x = goal.x - 1;
		while(sub_x >= 0 && (help_map[sub_x][sub_y].value == -1 || help_map[sub_x][sub_y].value == help_map[end.x][end.y].value)){
			set(help_map, goal, {x: sub_x, y: sub_y});
			sub_x--;
		}
		//----------------------horizontal touch-----------------------
		// -> right
		sub_x = goal.x;
		sub_y = goal.y + 1;
		while(sub_y < len && (help_map[sub_x][sub_y].value == -1 || help_map[sub_x][sub_y].value == help_map[end.x][end.y].value)){
			set(help_map, goal, {x: sub_x, y: sub_y});
			sub_y++;
		}
		// -> left 
		sub_y = goal.y - 1;
		while(sub_y >= 0 && (help_map[sub_x][sub_y].value == -1 || help_map[sub_x][sub_y].value == help_map[end.x][end.y].value)){
			set(help_map, goal, {x: sub_x, y: sub_y});
			sub_y--;
		}
	}
	//collect set needed searching.
	function collect(help_map, times){
		var sub_re = [];
		help_map.forEach((d, i) => {
			d.forEach((e, j) => {
				if(e.minCrossing == times) sub_re.push({x:i, y: j});
			});
		})
		return sub_re;
	}
	function find(begin, end, help_map, times){
		if(times > 2) return false;
		var len = help_map.length;
		var sub_re = collect(help_map, times);
		sub_re.forEach((d, i)=>{
			find_horz_vert_each(help_map, d, end);
		});
		if(help_map[end.x][end.y].lastPos !== undefined) return true;	
		return find(begin, end, help_map, times + 1);
	}
	// x: 1-> len - 2 ,  y: 1 -> len - 2  have picture.
	function sub_search(begin, end, map){
		if(begin == null || end == null) return false;
		if(map[begin.x][begin.y] != map[end.x][end.y]) return false;
		if(begin.x === end.x && begin.y === end.y) return true;
		let help_map = create_help_array(map);
		help_map[begin.x][begin.y].minCrossing = -1;
		help_map[begin.x][begin.y].minDistance = 0;
		var isFound = find(begin, end, help_map, -1);
		var path = [];
		if(isFound){
			var tmp = end;
			while(tmp !== undefined){
				path.unshift(tmp);
				tmp = help_map[tmp.x][tmp.y].lastPos;
			}
		}
		return path;
	}
	//var begin = {x: 1, y: 3}, end = {x: 4, y: 2};
	return sub_search(begin, end, array);
};
