var level = 9;
var dire = "right";
var tempDire = "right";
var onepace = 15;
var snake = [{
	x:0,
	y:0
}];

var pFood = {
	x:-1,
	y:-1
}
var scores = 0;


function moveDirection(){
	dire = tempDire;
	var targetX =0;
	var targetY = 0;

	switch(dire){
		case "right":
			targetX =snake[0].x + onepace;
			targetY = snake[0].y;
			if(targetX>285) targetX =0;
			break;
		case "left":
			targetX =snake[0].x - onepace;
			targetY = snake[0].y;
			if(targetX<0) targetX = 285;
			break;
		case "bottom":
			targetX =snake[0].x ;
			targetY = snake[0].y + onepace;
			if(targetY>135) targetY = 0;
			break;
		case "top":
			targetX =snake[0].x ;
			targetY = snake[0].y - onepace;
			if(targetY<0) targetY = 135;
			break;
	}
	move(targetX,targetY);
}
//生成食物
var food = function(){
	var randomX = Math.floor(Math.random()*20) * onepace;
	var randomY = Math.floor(Math.random()*10) * onepace;
	for(i=0,len=snake.length;i<len;i++){
		if(snake[i].x == randomX && snake[i].y == randomY)
			food();
		else{
			pFood.x = randomX;
			pFood.y = randomY;
		}
	}
	
}

var knock = function(targetX,targetY){
	if(snake.length<=2)
		return false;
	for(i=0,len=snake.length;i<len;i++){
		if(snake[i].x == targetX && snake[i].y == targetY)
			return true;
	}
	return false;
}

//移动
var move = function(targetX,targetY){
	var canvas = document.getElementById("gamebody");
	var ctt = canvas.getContext("2d");

	if(knock(targetX,targetY)){
		alert("游戏结束！ 得分："+document.getElementById("score").innerHTML.substring(3));
		scores = 0;
		clearInterval(snakeInterval);
		snake = [];
		snake.push({x:0,y:0});
		return;
	}
	ctt.clearRect(0,0,900,450);
	ctt.beginPath();
	ctt.fillStyle = "black";
	if((pFood.x == targetX && pFood.y == targetY) || pFood.x == -1) {
		if(pFood.x>0){ //吃掉食物
			scores = scores +10-level;
			document.getElementById("score").innerHTML = "分数:"+scores;

			//增加蛇长度
			//snake.pop(); //不删尾巴视为增加蛇长度
			snake.unshift({x:targetX,y:targetY});//加头部
		}
		food();
	}
	else{
		snake.pop(); //删尾巴
		snake.unshift({x:targetX,y:targetY});//加头部
	}
	ctt.arc(pFood.x+7.5,pFood.y+7.5,7.5,0,2*Math.PI);
	for(i=0,length=snake.length; i< length;i++){
		ctt.fillRect(snake[i].x+1,snake[i].y+1,onepace-2,onepace-2);
	}
	ctt.stroke();	
};


var snakeInterval = setInterval(moveDirection, level*100);

//按键控制
document.onkeyup = function(e){
	switch(e.keyCode){
		case 37:
		if(dire != "right") tempDire = "left";
		break;
		case 38:
		if(dire != "bottom") tempDire = "top";
		break;
		case 39:
		if(dire != "left") tempDire = "right";
		break;
		case 40:
		if(dire != "top") tempDire = "bottom";
		break;
	}
};

//暂停开始按钮
function pause(e){
	// var btnState = document.getElementById("pause");
	var state = e.getAttribute("data-state");
	if(state == "0"){
		clearInterval(snakeInterval);
		e.setAttribute("data-state","1");
		e.setAttribute("value","开始");
	}else{
		snakeInterval = setInterval(moveDirection, level*100);
		e.setAttribute("data-state","0");
		e.setAttribute("value","暂停");
	}
}

//游戏开始
function restart(){
	dire = "right";
	snake = [];
	snake.push({x:0,y:0});
	//重置食物
	pFood.x = pFood.y = -1;
	scores = 0;
	document.getElementById("score").innerHTML = "分数:"+0;
	
	move(0,0);
	clearInterval(snakeInterval);
	var setting = document.getElementById("setting");
	level = setting.options[setting.selectedIndex].value;
	snakeInterval = setInterval(moveDirection, level*100);
}

//设置等级
function setLevel(){
	restart();
}



