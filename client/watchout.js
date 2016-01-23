// start slingin' some d3 here.

  var width = $(window).width();
  var height = $(window).height();

  var asteroids = [];
  var minAsteroids = 5;
  var maxAsteroids = 20;
  var fps = 100;
  var svg;
  var collisions = 0;
  var score = 0;
  var highScore = 0;
  var level = 1;


var levelInit = function(level) {

  asteroids = [];
  window.level = level;
  $('.level span').html(level);
  var numAsteroids = Math.floor(Math.random() * (maxAsteroids - minAsteroids) + minAsteroids * level);
  for (var i = 0; i < numAsteroids; i++) {
    var dimension = Math.floor(Math.random() * 80 + 20);
    var xPos = Math.floor(Math.random() * (width - dimension));
    var yPos = Math.floor(Math.random() * (height - dimension));
    
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
      vx : Math.floor(vel * Math.cos(angle)),
      vy : Math.floor(vel * Math.sin(angle))
    });
  }
  populateAsteroids();
};


var populateAsteroids = function() {
  // Data Join
  var borders = svg.selectAll('.border')
    .data(asteroids);

  var images = svg.selectAll('.asteroid')
    .data(asteroids);



// UPDATE


// ENTER
    borders.enter()
    .append("circle")
    .attr("class", 'border')
    .attr("cx", function(d) { return d.x + d.width / 2; })
    .attr("cy", function(d) { return d.y + d.height / 2; })
    .attr("r", function(d) { return d.width * 0.6; });


    images.enter()
    .append('svg:image')
    .attr("xlink:href","asteroid.png")
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('width', function(d) { return d.width; })
    .attr('height', function(d) { return d.height; })
    .attr('class', 'asteroid');

// EXIT
    borders.exit().remove();
    images.exit().remove();


};



  var hero = {
    x:0,
    y:0,
    width:100,
    height:200
  };

  var updatePos = function() {

    $('.current span').html(score++);
    if(score > highScore) {
      highScore = score;
      $('.highscore span').html(highScore);
    }
    asteroids.forEach(function(asteroid) {
      if ((asteroid.x) < 0 || (asteroid.x + asteroid.width) > width) {
        asteroid.vx *= -1;
      }
      if ((asteroid.y) < 0 || (asteroid.y + asteroid.height) > height) {
        asteroid.vy *= -1;
      }
      asteroid.x += asteroid.vx;
      asteroid.y += asteroid.vy;

      if (radialCollision(hero, asteroid) && !asteroid.collision) {
        $('.collisions span').html(collisions++);
        hero.collision = true;
        asteroid.collision = true;
        score = 0;
        $('.current span').html(score);
            levelInit(1);
            

      } else {
        hero.collision = false;
        asteroid.collision = false;
      }
    });


    svg.selectAll(".asteroid")
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; });
    
    svg.selectAll(".border")
    .attr("cx", function(d) { return d.x + d.width / 2; })
    .attr("cy", function(d) { return d.y + d.height / 2; })
      .classed('collision', function(d) { return d.collision; });


    svg.select('hero-border')
      .attr("cx", hero.x + hero.width / 2 )
      .attr("cy", hero.y + hero.height / 2)
      .classed('.collision', hero.collision);


  if ( score > 0 && score % 1000 === 0) {
    levelInit(window.level + 1);
  }

};




var hasCollision = function(rect1, rect2)  {
 return rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.height + rect1.y > rect2.y;
};

var radialCollision = function(rect1, rect2) {
  var dx = (rect1.x + rect1.width/2) - (rect2.x + rect2.width/2);
  var dy = (rect1.y + rect1.height/2) - (rect2.y + rect2.height/2);
  var distance = Math.sqrt(dx * dx + dy * dy);

return (distance < rect1.width / 2 + rect2.width / 2);
};

$( document ).ready( function() {


  
  svg = d3.select( ".board" ).append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

levelInit(level);


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
  }, Math.floor(1000 / fps));

});  // document ready end
