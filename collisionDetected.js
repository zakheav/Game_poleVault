var vector2dCrossProduct = function(v1, v2){
	return v1.x*v2.y - v1.y*v2.x;
}

//相交返回true
var lineIntersect = function(point1, point2, point3, point4){//point1 point2是第一条线段的两个点 point3 point4是第二条线段的两个点
	//快速排斥实验
	var line1Left = point1.x > point2.x ? point2.x : point1.x;
	var line1Right = point1.x > point2.x ? point1.x : point2.x;
	var line1up = point1.y > point2.y ? point2.y : point1.y;
	var line1down = point1.y > point2.y ? point1.y : point2.y;

	var line2Left = point3.x > point4.x ? point4.x : point3.x;
	var line2Right = point3.x > point4.x ? point3.x : point4.x;
	var line2up = point3.y > point4.y ? point4.y : point3.y;
	var line2down = point3.y > point4.y ? point3.y : point4.y;
	if(line1Right<line2Left || line2Right<line1Left || line1up > line2down || line2up > line1down) {// 没通过快速排斥实验
		return false;
	} else {
		var p1p3 = {x: point3.x-point1.x, y: point3.y-point1.y};
		var p1p4 = {x: point4.x-point1.x, y: point4.y-point1.y};
		var p1p2 = {x: point2.x-point1.x, y: point2.y-point1.y};
		var p3p1 = {x: point1.x-point3.x, y: point1.y-point3.y};
		var p3p2 = {x: point2.x-point3.x, y: point2.y-point3.y};
		var p3p4 = {x: point4.x-point3.x, y: point4.y-point3.y};

		if(vector2dCrossProduct(p1p3, p1p2)*vector2dCrossProduct(p1p2, p1p4) >= 0
		&& vector2dCrossProduct(p3p1, p3p4)*vector2dCrossProduct(p3p4, p3p2) >= 0){
			return true;
		} else{
			return false;
		}
	}
}

//相交返回true
var circleCollision = function(circle1, circle2){
	var o1 = circle1.getCenter();
	var o2 = circle2.getCenter();
	var dist = dist2D(o1,o2);
	if(circle1.getRedius() + circle2.getRedius() < dist){
		return false;
	} else{
		return true;
	}
}

//相交返回true
var polygonCollision = function(polygon1, polygon2){
	if(!circleCollision(polygon1.getCircumCircle(), polygon2.getCircumCircle())){// 宽阶段
		return false;// 没有碰撞
	} else{// 严阶段
		var plist1 = polygon1.getPointList();
		var plist2 = polygon2.getPointList();
		for(var i=0; i<plist1.length; ++i){
			for(var j=0; j<plist2.length; ++j){
				var p1 = plist1[i].getPoint(); var p2 = i+1 == plist1.length ? plist1[0].getPoint() : plist1[i+1].getPoint();
				var p3 = plist2[j].getPoint(); var p4 = j+1 == plist2.length ? plist2[0].getPoint() : plist2[j+1].getPoint();
				if(lineIntersect(p1, p2, p3, p4)){
					return true;
				}
			}
		}
		return false;
	}
}

var pList = new Array();
pList[0] = {x: 60, y: 0};
pList[1] = {x: 120, y: 10};
pList[2] = {x: 100, y: 100};
pList[3] = {x: 20, y: 150};
pList[4] = {x: 20, y: 100};
pList[5] = {x: 0, y: 80};

var polygon1 = new Polygon(pList);
var polygon2 = new Polygon(pList);
polygon1.move({x:150, y:50});
polygon1.draw(context);
polygon2.draw(context);
console.log( polygonCollision(polygon1, polygon2) );
