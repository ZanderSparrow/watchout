// start slingin' some d3 here.



var width;
var height;

var asteroids = [];
var minAsteroids = 5;
var maxAsteroids = 10;
var fps = 100;
var svg;
var collisions = 0;
var score = 0;
var highScore = 0;
var level = 1;
var startingLives = 5;
var lives = startingLives;

var hero = {
  x:0,
  y:0,
  width:150,
  height:50
};

var paused = false;

var levelTransition = function(transitionType) {
  paused = true;


  if (transitionType === 'up') {
    $('.message').removeClass().addClass('message levelUp');
    showMessage('level ' + level);
  } else if (lives < 0) {
    transitionType = 'over';
    level = 1;
    lives = startingLives;
    $('.message').removeClass().addClass('message killed');
    showMessage('GAME OVER');
  } else {
  $('.message').removeClass().addClass('message killed');
    showMessage(lives + ' lives left');
  }

  svg.selectAll('.asteroid')
  .transition()
  .duration(250)
  .style('opacity', 0);
  
  setTimeout(function() {

    if (transitionType === 'over') {
      startScreen();
    } else {
      levelInit(level);
      updateGraphics();
      hideMessage();
      svg.selectAll('.asteroid')
      .transition()
      .duration(250)
      .style('opacity', 1.0);
      
      setTimeout(function(){
        paused = false;            
      }, 1000);
    }
  }, 1000);
};

var levelInit = function(level) {
  asteroids = [];
  window.level = level;
  $('.level span').html(level);
  var numAsteroids = Math.floor(Math.random() * (maxAsteroids - minAsteroids) + minAsteroids * level);
  for (var i = 0; i < numAsteroids; i++) {
    var dimension = Math.floor(Math.random() * 80 + 20);
    var xPos = Math.floor(Math.random() * (width - dimension));
    var yPos = Math.floor(Math.random() * (height - dimension));
    
    var angle = Math.random() * 2 * Math.PI;
    var vel = Math.random() * 2 + level * 0.5;
    asteroids.push( {
      x: xPos,
      y: yPos,
      width: dimension,
      height: dimension,
      vx : vel * Math.cos(angle),
      vy : vel * Math.sin(angle)
    });
  }
  populateAsteroids();
};


var startScreen = function() {
  $('.start-button').show();
  paused = true;
  $('.message').removeClass().addClass('message start-screen');
  showMessage('READY PLAYER 1');
  $('.start-button').on('click', function() {
    level = 1;
    levelTransition("up");
    $('.start-button').hide();
  });

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

var bounceOffWalls = function(asteroid) {
  if ((asteroid.x) < 0 || (asteroid.x + asteroid.width) > width) {
        asteroid.vx *= -1;
      }
  if ((asteroid.y) < 0 || (asteroid.y + asteroid.height) > height) {
    asteroid.vy *= -1;
  }
};

var move = function(asteroid) {
  asteroid.x += asteroid.vx;
  asteroid.y += asteroid.vy;
};

var showMessage = function(message, isKill) {
  // var messageClass = isKill ? '.killed' : '.levelUp';
  $('.message-text').html(message);
  $('.message').show();
};


var hideMessage = function() {
  $('.message').hide();
};

var resetGame = function(asteroid) {
  // Update collisions count on screen
  lives--;


  $('.lives span').html(lives);
  hero.collision = true;
  asteroid.collision = true;
  score = 0;

  $('.current span').html(score);
  levelTransition('down');
};

var updateGraphics = function() {
  svg.selectAll(".asteroid")
  .attr('x', function(d) { return d.x; })
  .attr('y', function(d) { return d.y; });

  svg.selectAll(".border")
  .attr("cx", function(d) { return d.x  + d.width / 2; })
  .attr("cy", function(d) { return d.y + d.height / 2; })
  .classed('collision', function(d) { return d.collision; });


  // svg.select('hero-border')
  // .attr("cx", hero.x + hero.width / 2 )
  // .attr("cy", hero.y + hero.height / 2)
  // .classed('.collision', hero.collision);
};

var updatePos = function() {


  if (!paused) {
    // Update score on screen
    $('.current span').html(score++);

    // Reset high score if winning
    if(score > highScore) {
      highScore = score;
      $('.highscore span').html(highScore);
    }

    // Update each asteroid
    for (var i = 0; i < asteroids.length; i++) {
      var asteroid = asteroids[i];
      bounceOffWalls(asteroid);
      move(asteroid);



        if (radialCollision(hero, asteroid) && !asteroid.collision) {
          resetGame(asteroid);
          return;
        } else {
          hero.collision = false;
          asteroid.collision = false;
        }
    }
    // Update DOM with new position
      updateGraphics();

    if ( score > 0 && score % 1000 === 0) {
      window.level ++;
      levelTransition('up');
    }
  }
};




var hasCollision = function(rect1, rect2)  {
 return rect1.x < rect2.x + rect2.width &&
 rect1.x + rect1.width > rect2.x &&
 rect1.y < rect2.y + rect2.height &&
 rect1.height + rect1.y > rect2.y;
};

var radialCollision = function(rect1, rect2) {
  var dx = (rect1.x) - (rect2.x);
  var dy = (rect1.y) - (rect2.y);
  var distance = Math.sqrt(dx * dx + dy * dy);

  return (distance < rect1.width / 2 + rect2.width / 2);
};

$( document ).ready( function() {

  width = $('body').width() ;
  height = $('body').height();


  svg = d3.select( ".board" ).append( "svg" )
  .attr( "width", width )
  .attr( "height", height );


  startScreen();
  // levelInit(level);


  svg.append('svg:image')
  .attr("xlink:href","toastcat.png")
  .attr('class', 'hero')
  .attr('width', 150)
  .attr('height', 75);

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
