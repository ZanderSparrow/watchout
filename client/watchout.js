// start slingin' some d3 here.

  var width = 800,
    height = 600;

  var asteroids = [];
  var minAsteroids = 5;
  var maxAsteroids = 20;
  var numAsteroids = Math.floor(Math.random() * (maxAsteroids - minAsteroids) + minAsteroids);
  var fps = 60;
  var svg;
  var collisions = 0;

  for (var i = 0; i < numAsteroids; i++) {
    var dimension = Math.floor(Math.random() * 80 + 20);
    var xPos = Math.floor(Math.random() * width - dimension);
    var yPos = Math.floor(Math.random() * height - dimension);
    
    // avoid corner case where asteroid starts out of bounds
    if (xPos + dimension > width) { 
      xPos = width - dimension; 
    }
    if (yPos + dimension > height) { 
      yPos = height - dimension; 
    }
    
    var angle = Math.random() * 2 * Math.PI;
    var vel = Math.random() * 2 + 2;
    asteroids.push( {
      x: xPos,
      y: yPos,
      width: dimension,
      height: dimension,
      vx : vel * Math.cos(angle),
      vy : vel * Math.sin(angle)
    });
  }

  var hero = {
    x:0,
    y:0,
    width:100,
    height:200
  };

  var updatePos = function() {


    asteroids.forEach(function(asteroid) {
      if ((asteroid.x) < 0 || (asteroid.x + asteroid.width) > width) {
        asteroid.vx *= -1;
      }
      if ((asteroid.y) < 0 || (asteroid.y + asteroid.height) > height) {
        asteroid.vy *= -1;
      }
      asteroid.x += asteroid.vx;
      asteroid.y += asteroid.vy;

      if (hasCollision(hero, asteroid)) {
        $('.collisions span').html(collisions++);
      }


    });


    svg.selectAll(".asteroid")
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .classed('collision', function(d) { return d.collision; });
    
  };

var hasCollision = function(rect1, rect2)  {
 return rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.height + rect1.y > rect2.y;
};

$( document ).ready( function() {

  svg = d3.select( ".board" ).append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

  svg.selectAll('.asteroid')
    .data(asteroids)
    .enter()
    .append('svg:image')
    .attr("xlink:href","asteroid.png")
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', function(d) { return d.width; })
    .attr('height', function(d) { return d.height; })
    .attr('class', 'asteroid');

  svg.append('svg:image')
    .attr("xlink:href","kodos.png")
    .attr('class', 'hero')
    .attr('width', 50)
    .attr('height', 100);

  svg.on("mousemove", function() { 
    var mousePos = d3.mouse(this); 
    svg.select('.hero')
      .attr('x', hero.x = mousePos[0])
      .attr('y', hero.y = mousePos[1]); 
  });


  setInterval(function() {
    updatePos();
  }, 1000 / fps);

});  // document ready end
