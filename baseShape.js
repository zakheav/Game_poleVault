var Point = function(x,y){
	var coordinate = new Array();
	coordinate[0] = x;
	coordinate[1] = y;
	coordinate[2] = 1;//齐次坐标

	this.getPoint = function(){
		return {
			x: coordinate[0],
			y: coordinate[1]
		};
	};
	this.rotate = function(center, angle){//center是旋转中心，angle是度数
		//先平移，再旋转，最后平移回去
		var moveMatrix1 = [[1,0,0],[0,1,0],[-center.x,-center.y,1]];
		var rotateMatrix = [[Math.cos(angle*Math.PI/180),Math.sin(angle*Math.PI/180),0],[-Math.sin(angle*Math.PI/180),Math.cos(angle*Math.PI/180),0],[0,0,1]];
		var moveMatrix2 = [[1,0,0],[0,1,0],[center.x,center.y,1]];
		var finalMatrix = matrixMmatrix(matrixMmatrix(moveMatrix1, rotateMatrix), moveMatrix2);
		coordinate = vectorMmatrix(coordinate, finalMatrix);
	};
	this.move = function(direction){
		var moveMatrix = [[1,0,0],[0,1,0],[direction.x,direction.y,1]];
		coordinate = vectorMmatrix(coordinate, moveMatrix);
	};
};

var Line = function(begin,end,lineWidth,lineColor){
	var beginPoint = new Point(begin.x, begin.y);
	var endPoint = new Point(end.x, end.y);
	var width = typeof lineWidth === "undefined" ? 5 : lineWidth;
	var color = typeof lineColor === "undefined" ? "black" : lineColor;

	this.returnBegin = function(){
		return beginPoint.getPoint();
	};
	this.rotate = function(center, angle){
		beginPoint.rotate(center, angle);
		endPoint.rotate(center, angle);
	};
	this.move = function(direction){
		beginPoint.move(direction);
		endPoint.move(direction);
	};
	this.draw = function(context){
		context.strokeStyle = color;
		context.lineWidth = width;
		context.beginPath();
		context.moveTo(beginPoint.getPoint().x, beginPoint.getPoint().y);
		context.lineTo(endPoint.getPoint().x, endPoint.getPoint().y);
		context.closePath();
		context.stroke();
	}
};

var Rectangle = function(keyPoint, width, height, rectColor){
	var a = new Point(keyPoint.x, keyPoint.y);
	var b = new Point(keyPoint.x+width, keyPoint.y);
	var c = new Point(keyPoint.x+width, keyPoint.y+height);
	var d = new Point(keyPoint.x, keyPoint.y+height); 
	var color = typeof rectColor === "undefined" ? "black" : rectColor;
	this.getKeypoint = function(){
		return a.getPoint();
	};
	this.rotate = function(center, angle){
		a.rotate(center, angle);
		b.rotate(center, angle);
		c.rotate(center, angle);
		d.rotate(center, angle);
	};
	this.move = function(direction){
		a.move(direction);
		b.move(direction);
		c.move(direction);
		d.move(direction);
	};
	this.draw = function(context){
		context.fillStyle = color;
		context.beginPath();
		context.moveTo(a.getPoint().x, a.getPoint().y);
		context.lineTo(b.getPoint().x, b.getPoint().y);
		context.lineTo(c.getPoint().x, c.getPoint().y);
		context.lineTo(d.getPoint().x, d.getPoint().y);
		context.lineTo(a.getPoint().x, a.getPoint().y);
		context.closePath();
		context.fill();
	};
}

var Circle = function(center, r, circleColor){
	var centerOfcircle = new Point(center.x, center.y);
	var radius = r;
	var color = typeof circleColor === "undefined" ? "black" : circleColor;
	this.getKeypoint = function(){
		return centerOfcircle.getPoint();
	};
	this.rotate = function(center, angle){
		centerOfcircle.rotate(center, angle);
	};
	this.move = function(direction){
		centerOfcircle.move(direction);
	};
	this.draw = function(context){
		context.fillStyle = color;
		context.beginPath();
		context.arc(centerOfcircle.getPoint().x, centerOfcircle.getPoint().y, radius, 0, 2*Math.PI);
		context.closePath();
		context.fill();
	};
}

// var canvas = document.getElementById("canvas");
// var context = canvas.getContext("2d");
var rectangle = new Rectangle({x:300,y:100}, 50, 50);
var circle = new Circle({x:250, y:200}, 50);



