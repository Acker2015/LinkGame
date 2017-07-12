# LinkGame
This is a easy game to learn the use about Vue.js and SVG. In the game, it has some algorithms to support itself including Backtracking Algorithm, random layout for initialization of the game map. it can also help to learn how to find the break points less that 2.
<hr>
# 1.I use the random layout for the initialization of the game map. But it may have deadlock situation. It provides the disorganization to resort the map. Of course, using backtracking would be better, but I need too much time to layout. So in this game I don't use this algorithm. Anyway I retain this method in the ./index.js(function generate_map and function init_map_layout).
<hr>
# 2. The link condition of two picture is the break points less than 2. So I have find the arrival positions that have 0 break points, and then find the arrival positions with 1 break point, and then find the arrival positions with 2 break points. If the position of other picture in the set of position within 2 break points, they can be removed together.
