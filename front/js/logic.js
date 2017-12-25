paper.install(window);

var pencil, rectangle, line, circle, eraser;
var glColor, glWidth;
var socket = io();

var setPencil = function(){
	pencil.activate();
}

var setRectangle = function(){
	rectangle.activate();
}

var setLine = function(){
	line.activate();
}

var setCircle = function(){
	circle.activate();
}

var setEraser = function(){
	eraser.activate();
}

var setGlWidth = function(){
	glWidth = document.getElementById('width').value;
}

var setGlColor = function(){
	glColor = '#' + document.getElementById('color').value;
}

window.onload = function(){
	paper.setup("PAINT_HERE");
	glColor = 'red';
	glWidth = 5;
	var path;

	pencil = new Tool();
    pencil.onMouseDown = function(event) {
        path = new Path();
        path.strokeColor = glColor;
        path.strokeWidth = glWidth;
        path.add(event.point);
    };
    pencil.onMouseDrag = function(event) {
        path.add(event.point);
    }
    pencil.onMouseUp = function(event) {
        var clone = new Path();
        clone = path;
        socket.emit('commit', clone.exportJSON());
        clone.remove;
    }

    rectangle = new Tool();
    rectangle.onMouseDrag = function(event){
    	path = new Path.Rectangle({
    		from: event.downPoint,
    		to: event.point
    	});
        path.strokeColor = glColor;
        path.strokeWidth = glWidth;
        path.add(event.point);

        path.removeOnDrag();
    }
    rectangle.onMouseUp = function(event){
        var clone = new Path();
        clone = path;
        socket.emit('commit', clone.exportJSON());
        clone.remove; 
    }

    line = new Tool();
    line.onMouseDrag = function(event){
    	path = new Path.Line({
    		from: event.downPoint,
    		to: event.point
    	});
		path.strokeColor = glColor;
        path.strokeWidth = glWidth;
    	path.add(event.point);

    	path.removeOnDrag();
    }
    line.onMouseUp = function(event){
        var clone = new Path();
        clone = path;
        socket.emit('commit', clone.exportJSON());
        clone.remove; 
    }    

    circle = new Tool();
    circle.onMouseDown = function(event){}
    circle.onMouseDrag = function(event){
    	path = new Path.Circle({
    		center: event.downPoint,
    		radius: Math.sqrt(Math.pow(event.point.x-event.downPoint.x,2)+Math.pow(event.point.y-event.downPoint.y,2))
    	});
    	path.strokeColor = glColor;
        path.strokeWidth = glWidth;

    	path.removeOnDrag();
    }
    circle.onMouseUp = function(event){
        var clone = new Path();
        clone = path;
        socket.emit('commit', clone.exportJSON());
        clone.remove; 
    }

	eraser = new Tool();
    eraser.onMouseDown = function(event) {
        path = new Path();
        path.strokeColor = '#ffffff';
        path.strokeWidth = glWidth;
        path.add(event.point);
    };
    eraser.onMouseDrag = function(event) {
        path.add(event.point);
    }
    eraser.onMouseUp = function(event){
        var clone = new Path();
        clone = path;
        socket.emit('commit', clone.exportJSON());
        clone.remove; 
    }    

    socket.on('update', function(msg){
      var otherPath = new Path();
      otherPath.importJSON(msg);
      console.log(msg);
      view.draw();
    });

    socket.on('open', function(msg){
      var arr = msg;
      arr.forEach(function(item, i, arr){
        var otherPath = new Path();
        otherPath.importJSON(item);
        view.draw();
      });
    });

}