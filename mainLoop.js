var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var gap = 70;
var newGap;
var width1 = 40;
var height = 90;
var width2 = 50;
var playerOverFlatLeft = 10;// 玩家起始相对于平台1左边的距离
var player = new Circle({x:30+playerOverFlatLeft, y:200},10);
var flatRoof = new Rectangle({x:30, y:context.canvas.height-height},width1,100);
var flatRoof2 = new Rectangle({x:30+gap+width1, y:context.canvas.height-height},width2,100);
var pole;
var poleLength = 0;
var drawPole = true;
var animateStart = true;
var score = 0;

flatRoof.draw(context);
flatRoof2.draw(context);
player.draw(context);


function drawPoleFunction(){
	if(drawPole){
		poleLength += 10;
		pole = new Rectangle({x:flatRoof.getKeypoint().x+playerOverFlatLeft, y:context.canvas.height-height-poleLength}, 5, poleLength);
		pole.draw(context);
		window.setTimeout("drawPoleFunction()",100);
	}
}

canvas.addEventListener('mousedown',function(e){// 绑定鼠标点击事件
	drawPoleFunction();
});

var successFinishFunction = function(){
	++score;
	var temp = flatRoof;
	flatRoof = flatRoof2;
	flatRoof2 = temp;
	gap = newGap;
	playerOverFlatLeft = player.getKeypoint().x - flatRoof.getKeypoint().x;
	console.log(playerOverFlatLeft);
	poleLength = 0;

	context.clearRect(0,0,context.canvas.width,context.canvas.height);// 清空画布

	flatRoof.draw(context);
	flatRoof2.draw(context);
	player.draw(context);

	drawPole = true;
	animateStart = true;
}

var failFinishFunction = function(){
	alert("die!!!!   you got "+score+" score!");
};

canvas.addEventListener('mouseup',function(e){// 绑定鼠标点击事件
	drawPole = false;
	newGap = Math.ceil(Math.random()*150+30);
	if(animateStart){
		animateStart = false;
		if(poleLength > width1 - playerOverFlatLeft + gap && poleLength < width1 - playerOverFlatLeft + gap +width2 ){//成功情况
			// pole对象动画对象
			var poleRotate = new Array(
				new Rotate({x:flatRoof.getKeypoint().x+playerOverFlatLeft, y:context.canvas.height-height}, 1, 90, 0)
			);
			var poleMove = new Array(
				new Move(-1, 0, gap+width1, poleLength + 90 + 5)
			);
			var poleAnimate = new Animate(pole, poleMove, poleRotate);

			// flatRoof动画对象
			var flat1Move = new Array(
				new Move(-1, 0, gap+width1, poleLength + 90 + 5),
				new Move(0, height, 1, poleLength + 90 + 6 + gap+width1),
				new Move(newGap+gap+width1+width2, 0, 1, poleLength + 90 + 7 + gap+width1),
				new Move(0, -1, height, poleLength + 90 + 8 + gap+width1)
			);
			var flatRoofAnimate = new Animate(flatRoof, flat1Move, null);

			// flatRoof2动画对象
			var flat2Move = new Array(
				new Move(-1, 0, gap+width1, poleLength + 90 + 5)
			);
			var flatRoof2Animate = new Animate(flatRoof2, flat2Move, null);

			// player动画对象
			var playerMove = new Array(
				new Move(1, 0, poleLength, 90),
				new Move(-1, 0, gap+width1, poleLength + 90 + 5)
			);
			var playerAnimate = new Animate(player, playerMove, null);
			animateList = new Array();
			animateList[0] = poleAnimate;
			animateList[1] = flatRoofAnimate;
			animateList[2] = flatRoof2Animate;
			animateList[3] = playerAnimate;
			
			animateActive(successFinishFunction);
		} else{
			// pole对象动画对象
			var poleRotate = new Array(
				new Rotate({x:flatRoof.getKeypoint().x+playerOverFlatLeft, y:context.canvas.height-height}, 1, 90, 0)
			);
			var poleAnimate = new Animate(pole, null, poleRotate);

			var flatRoofAnimate = new Animate(flatRoof, null, null);

			var flatRoof2Animate = new Animate(flatRoof2, null, null);

			// player动画对象
			var playerMove = new Array(
				new Move(1, 0, poleLength+5, 90),
				new Move(0, 5, 100, 90+poleLength+5)
			);
			var playerAnimate = new Animate(player, playerMove, null);
			animateList = new Array();
			animateList[0] = poleAnimate;
			animateList[1] = flatRoofAnimate;
			animateList[2] = flatRoof2Animate;
			animateList[3] = playerAnimate;
			
			animateActive(failFinishFunction);
		}
	}
	
});