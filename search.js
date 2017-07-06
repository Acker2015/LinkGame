/*
6 * 6
*/
var array = [
	[-1, -1, -1, -1, -1, -1, -1],
	[-1,  1,  2,  3,  1,  0, -1],
	[-1,  6,  7,  8,  9, 10, -1],
	[-1,  1,  2,  3,  9, 11, -1],
	[-1,  2,  3,  4,  6,  7, -1],
	[-1,  8, 10, 11, 12, 12, -1],
	[-1, -1, -1, -1, -1, -1, -1],
]

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
// x: 1-> len - 2 ,  y: 1 -> len - 2  have picture.
function search(begin, end, map){
	if(begin == null || end == null) return false;
	if(begin.x === end.x && begin.y === end.y) return true;
	let help_map = create_help_array(map);
	
}