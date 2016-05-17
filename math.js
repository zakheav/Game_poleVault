var matrixMmatrix = function(matrixLeft, matrixRight){//矩阵与矩阵相乘
	var lrow = matrixLeft.length;
	var lcol = matrixLeft[0].length;
	var rrow = matrixRight.length;
	var rcol = matrixRight[0].length;
	if(lcol == rrow){
		var result = new Array(lrow);
		for(var i=0; i<lrow; ++i){
			result[i] = new Array(rcol);
			for(var j=0; j<rcol; ++j){
				result[i][j] = 0;
			}
		}

		for(var i=0; i<lrow; ++i){
			for(var j=0; j<rcol; ++j){
				for(var k=0; k<lcol; ++k){
					result[i][j] = result[i][j] + matrixLeft[i][k]*matrixRight[k][j];
				}
			}
		}
		return result;
	} else{
		return null;
	}
}	

var vectorMmatrix = function(vector, matrix){//向量与矩阵相乘
	var vsize = vector.length;
	var mrow = matrix.length;
	var mcol = matrix[0].length;
	
	if(vsize == mrow){
		var result = new Array(mcol);
		for(var i=0; i<mcol; ++i){
			result[i] = 0;
		}
		for(var i=0; i<mcol; ++i){
			for(var j=0; j<vsize; ++j){
				result[i] = result[i] + vector[j]*matrix[j][i];
			}
		}
		return result;
	} else{
		return null;
	}
}

var vectorMvector = function(vector1, vector2){//向量点乘
	var result = 0;
	if(vector1.length == vector2.length){
		for(var i=0; i<vector1.length; ++i){
			result = result + vector1[i]*vector2[i];
		}
		return result;
	} else{
		return null;
	}
	
}

var dist2D = function(point1, point2){//二维空间内的欧式距离
	return Math.sqrt( Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2) );
}

// var vector = new Array(1,2);
// var matrix = [[1,2,3],[4,5,6]];
// var matrix2 = [[1,4],[2,5],[3,6]];
// console.log(vectorMmatrix(vector,matrix));
// console.log(matrixMmatrix(matrix,matrix2));
// console.log(vectorMvector(vector,vector));
// console.log(dist2D({x:1,y:10},{x:2,y:12}));

