// 需要修改
var Move = function(dx, dy, t, start){// 每次移动的dx，dy，总共移动的次数，开始时间
	this.direction = {
		x:dx,
		y:dy
	};
	this.times = t;
	this.startTime = start;
};
var Rotate = function(cen, dr, t, start){// 旋转中心，每次旋转角度度数，总共旋转次数，开始时间
	this.center = cen;
	this.angle = dr;
	this.times = t;
	this.startTime = start;
}
var Animate = function(obj, mlist, rlist, start){// mlist是Move对象数组， rlist是Rotate对象数组
	this.Obj = obj;
	this.moveList = typeof mlist === "undefined" ? null : mlist;
	this.rotateList = typeof rlist === "undefined" ? null : rlist;
	this.startTime = start;
};


var finishAnimate = 0;// 记录完成动画的对象数目
var timeStamp = 0;// 时间戳
var animateList = new Array();// 元素是Animate
function animateActive( callback ){
	++timeStamp;
	context.clearRect(0,0,context.canvas.width,context.canvas.height);// 清空画布
	var stillObjectNum = 0;
	for(var i=0; i<animateList.length; ++i){// 绘制每一个页面元素
		var object = animateList[i].Obj;
		var moveControllers = animateList[i].moveList;
		var rotateControllers = animateList[i].rotateList;
		
		if(moveControllers == null && rotateControllers == null){
			++stillObjectNum;
		}
		if(moveControllers != null && moveControllers.length != 0){
			for(var j = 0; j < moveControllers.length; ++j){// 遍历这个动画对象中的move操作序列
				if(moveControllers[j].startTime < timeStamp){
					if(moveControllers[j].times > 0){
						object.move(moveControllers[j].direction);
						--moveControllers[j].times;
					} else{
						moveControllers.splice(j,1);
					}
				}
			}
			if (moveControllers.length == 0 && (rotateControllers == null || rotateControllers.length == 0)) {
				++finishAnimate;
			};
		} 
		if(rotateControllers != null && rotateControllers.length != 0){
			for(j = 0; j < rotateControllers.length; ++j){
				if(rotateControllers[j].startTime < timeStamp){
					if(rotateControllers[j].times > 0){
						object.rotate(rotateControllers[j].center, rotateControllers[j].angle);
						--rotateControllers[j].times;
					} else{
						rotateControllers.splice(j,1);
					}
				}
			}
			if (rotateControllers.length == 0 && (moveControllers == null || moveControllers.length == 0)) {
				++finishAnimate;
			};
		}
		object.draw(context);
	}
	if(finishAnimate<animateList.length-stillObjectNum){
		window.setTimeout(function(){
			animateActive( callback );
		},10);
	} else{
		finishAnimate = 0;// 记录完成动画的对象数目
		timeStamp = 0;// 时间戳
		callback();
	} 
};
