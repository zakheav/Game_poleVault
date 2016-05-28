var ObjectManager = function(){// 简单物理引擎
	var Objects = Array();
	this.addObject = function(Obj){// 添加物体
		Objects.push(Obj);
	};

	var fieldList = new Array();//不同的场
	fieldList.push(
		function gravity(){
			for(var i=0; i<Objects.length; ++i){
				Objects[i].setA(0,0.5);
			}
		}
	);
	var fieldEffect = function(){// 不同的场对物体的作用
		for(var i=0; i<fieldList.length; ++i){
			fieldList[i]();
		}
	};

	var getCollisionList = function(objIdx){// 找到与指定下标物体相碰的其他物体，返回一个物体列表（今后改进）
		var collisinList = new Array();
		if(Objects[objIdx].collisionRemit == 0){
			for(var i=0; i<Objects.length; ++i){
				if(i != objIdx){
					if(polygonCollision(Objects[objIdx].getShape(), Objects[i].getShape())){
						collisinList.push(Objects[i]);
					}
				}
			}
		} else{
			--Objects[objIdx].collisionRemit;
		}
		return collisinList;
	};

	var collisionEffect = function(){// 碰撞造成的物体运动的变化
		for(var i=0; i<Objects.length; ++i){
			var cl = getCollisionList(i); 
			var m1 = Objects[i].getM();
			var v1 = Objects[i].getV();
			for(var j=0; j<cl.length; ++j){
				var m2 = cl[j].getM();
				var v2 = cl[j].getV();
				var v11x, v11y;
				v11x = (m1-m2)*v1.x/(m1+m2) + 2*m2*v2.x/(m1+m2); 
				v11y = (m1-m2)*v1.y/(m1+m2) + 2*m2*v2.y/(m1+m2);
				Objects[i].vList.push(new Array(v11x, v11y));
			}
		}
		for(var i=0; i<Objects.length; ++i){
			for(var j=1; j<Objects[i].vList.length; ++j){
				vectorAdd(Objects[i].vList[0], Objects[i].vList[j]);
			}
			if(Objects[i].vList.length != 0){// 发生了碰撞
				Objects[i].collisionRemit = 2;// 防止碰撞精度造成的恶性bug
				Objects[i].setV(Objects[i].vList[0][0], Objects[i].vList[0][1]);
				Objects[i].vList = new Array();// 清空vList
			}
		}
	};

	this.objectsMoving = function(context){
		fieldEffect();
		collisionEffect();
		for(var i=0; i<Objects.length; ++i){
			Objects[i].objectMove();
			Objects[i].drawObject(context);
		}
	}
}

var Object = function(s, m, velocity){
	this.collisionRemit = 0;// 碰撞豁免，为了降低bug
	var mass = m;// 质量
	var shape = s;// 全部使用polygon
	var v;
	if(typeof velocity === "undefined")
		v = new Array(0,0);// 速度
	else
		v = new Array(velocity.x, velocity.y);

	var a = new Array(0,0);// 加速度

	this.vList = new Array();// 速度列表，用于计算速度的合成
	this.getShape = function(){
		return shape;
	}
	this.setV = function(x, y){
		v[0] = x;
		v[1] = y;
	}
	this.getV = function(){
		return {x:v[0], y:v[1]};
	};
	this.setA = function(x, y){
		a[0] = x;
		a[1] = y;
	}
	this.getA = function(){
		return {x:a[0], y:a[1]};
	};
	this.getM = function(){
		return mass;
	};
	this.objectMove = function(){// 按照物体的速度运动，无法制定运动方式
		vectorAdd(v, a);
		var direction = this.getV();
		shape.move(direction);
	};
	this.move = function(direction){
		shape.move(direction);
	};
	this.rotate = function(center, angle){
		shape.rotate(center, angle);
	};
	this.drawObject = function(context){
		shape.draw(context);
	};
}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var objM = new ObjectManager();

var pList1 = new Array();
pList1[0] = {x: 110, y: 100};
pList1[1] = {x: 110, y: 110};
pList1[2] = {x: 120, y: 105};

var pList2 = new Array();
pList2[0] = {x: 210, y: 200};
pList2[1] = {x: 210, y: 210};
pList2[2] = {x: 220, y: 205};

var pList3 = new Array();
pList3[0] = {x: 210, y: 0};
pList3[1] = {x: 210, y: 10};
pList3[2] = {x: 220, y: 5};

var p1 = new Polygon(pList1,"red");
var p2 = new Polygon(pList2,"blue");
var p3 = new Polygon(pList3,"black");

objM.addObject(new Object(p1, 100, {x:7, y:0}));
objM.addObject(new Object(p2, 100, {x:3, y:-10}));
objM.addObject(new Object(p3, 100, {x:5, y:5}));

setInterval(
	function(){
		context.clearRect(0,0,1500,800);
		objM.objectsMoving(context);
	}, 
	100
);