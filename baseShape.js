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
	this.type = "line";
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
	this.type = "rectangle";
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
	this.type = "circle";
	var centerOfcircle = new Point(center.x, center.y);
	var radius = r;
	var color = typeof circleColor === "undefined" ? "black" : circleColor;
	this.getCenter = function(){
		return centerOfcircle.getPoint();
	};
	this.getRedius = function(){
		return radius;
	}
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
	this.drawHollow = function(context){
		context.strokeStyle = color;
		context.beginPath();
		context.arc(centerOfcircle.getPoint().x, centerOfcircle.getPoint().y, radius, 0, 2*Math.PI);
		context.closePath();
		context.stroke();
	};
}

var Polygon = function(pList, circleColor){
	this.type = "polygon";
	var pointsList = new Array();
	for(var i=0; i<pList.length; ++i){
		pointsList[i] = new Point(pList[i].x, pList[i].y);
	}// 顺时针点列表
	var color = typeof circleColor === "undefined" ? "black" : circleColor;
	var circumcircle = null;// 外接圆

	//生成最小外接圆
	//获取三个点的外心
	var getTriangleExcenter = function(a,b,c){
		var result = {x:0, y:0};
		var A1 = 2*(b.x-a.x);
		var B1 = 2*(b.y-a.y);
		var C1 = b.x*b.x + b.y*b.y - a.x*a.x - a.y*a.y;
		var A2 = 2*(c.x-b.x);
		var B2 = 2*(c.y-b.y);
		var C2 = c.x*c.x + c.y*c.y - b.x*b.x - b.y*b.y;
		result.x = ((C1*B2)-(C2*B1))/((A1*B2)-(A2*B1));
		result.y = ((A1*C2)-(A2*C1))/((A1*B2)-(A2*B1));
		return result;
	}
	//获取多边形的外心
	var getPolygonExcenter = function(){
		//计算多边形中最长距离的两个点
		var idx1 = 0;
		var idx2 = 0;
		var dist = 0;
		for(var i=0; i<pointsList.length; ++i){
			for(var j=i+1; j<pointsList.length; ++j){
				var temp = dist2D(pointsList[i].getPoint(),pointsList[j].getPoint());
				if(temp > dist){
					dist = temp;
					idx1 = i;
					idx2 = j;
				}
			}
		}
		var tempCenter = {
			x: (pointsList[idx1].getPoint().x + pointsList[idx2].getPoint().x) / 2,
			y: (pointsList[idx1].getPoint().y + pointsList[idx2].getPoint().y) / 2
		};
		var tempR = dist/2;
		var existExceed = false;
		//检查是否存在在最小覆盖圆外的点
		for(var i=0; i<pointsList.length; ++i){
			if(i!=idx1 && i!=idx2){
				if(dist2D(pointsList[i].getPoint(), tempCenter) > tempR){
					existExceed = true; break;
				}
			}
		}

		var finish = false;
		if(existExceed){//至少三个点在最小覆盖圆上
			for(var i=0; i<pointsList.length && !finish; ++i){
				for(var j=i+1; j<pointsList.length && !finish; ++j){
					for(var k=j+1; k<pointsList.length && !finish; ++k){
						var a = pointsList[i].getPoint();
						var b = pointsList[j].getPoint();
						var c = pointsList[k].getPoint();
						tempCenter = getTriangleExcenter(a, b, c);
						tempR = dist2D(tempCenter, a);

						existExceed = false;
						for(var l = 0; l<pointsList.length; ++l){
							if(l!=i && l!=j && l!= k){
								if(tempR < dist2D(tempCenter, pointsList[l].getPoint())){
									existExceed = true;
								}
							}
						}
						if(!existExceed){
							finish = true;
						}
					}
				}
			}
			circumcircle = new Circle(tempCenter, tempR);
		} else{
			circumcircle = new Circle(tempCenter, tempR);
		}
	}
	getPolygonExcenter();//计算多边形的最小覆盖圆

	this.getCircumCircle = function(){
		return circumcircle;
	}
	this.getPointList = function(){
		return pointsList;
	}
	this.rotate = function(center, angle){
		for(var i=0; i<pointsList.length; ++i){
			pointsList[i].rotate(center, angle);
		}
		circumcircle.rotate(center, angle);
	};
	this.move = function(direction){
		for(var i=0; i<pointsList.length; ++i){
			pointsList[i].move(direction);
		}
		circumcircle.move(direction);
	};
	this.draw = function(context){
		context.fillStyle = color;
		context.beginPath();
		context.moveTo(pointsList[0].getPoint().x, pointsList[0].getPoint().y);
		for(var i=1; i<pointsList.length; ++i){
			context.lineTo(pointsList[i].getPoint().x, pointsList[i].getPoint().y);
		}
		context.closePath();
		context.fill();
		//circumcircle.drawHollow(context);
	};
}

// var canvas = document.getElementById("canvas");
// var context = canvas.getContext("2d");




