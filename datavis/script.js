var state_abbr = {"ALABAMA":"AL","ALASKA":"AK","AMERICAN SAMOA":"AS","ARIZONA":"AZ","ARKANSAS":"AR","CALIFORNIA":"CA","COLORADO":"CO","CONNECTICUT":"CT","DELAWARE":"DE","DISTRICT OF COLUMBIA":"DC","FEDERATED STATES OF MICRONESIA":"FM","FLORIDA":"FL","GEORGIA":"GA","GUAM":"GU","HAWAII":"HI","IDAHO":"ID","ILLINOIS":"IL","INDIANA":"IN","IOWA":"IA","KANSAS":"KS","KENTUCKY":"KY","LOUISIANA":"LA","MAINE":"ME","MARSHALL ISLANDS":"MH","MARYLAND":"MD","MASSACHUSETTS":"MA","MICHIGAN":"MI","MINNESOTA":"MN","MISSISSIPPI":"MS","MISSOURI":"MO","MONTANA":"MT","NEBRASKA":"NE","NEVADA":"NV","NEW HAMPSHIRE":"NH","NEW JERSEY":"NJ","NEW MEXICO":"NM","NEW YORK":"NY","NORTH CAROLINA":"NC","NORTH DAKOTA":"ND","NORTHERN MARIANA ISLANDS":"MP","OHIO":"OH","OKLAHOMA":"OK","OREGON":"OR","PALAU":"PW","PENNSYLVANIA":"PA","PUERTO RICO":"PR","RHODE ISLAND":"RI","SOUTH CAROLINA":"SC","SOUTH DAKOTA":"SD","TENNESSEE":"TN","TEXAS":"TX","UTAH":"UT","VERMONT":"VT","VIRGIN ISLANDS":"VI","VIRGINIA":"VA","WASHINGTON":"WA","WEST VIRGINIA":"WV","WISCONSIN":"WI","WYOMING":"WY"};

$(function(){
  var dataset = {};

  var toolTip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

  function getCentroid(element) {
    // get the DOM element from a D3 selection
    // you could also use "this" inside .each()
    // var element = selection.node(),
        // use the native SVG interface to get the bounding box
        bbox = element.getBBox();
    // return the center of the bounding box
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
  }

  var loadData = function(filePath) {
    $.ajax({
    type: "GET",
    url: filePath,
    dataType: "text",
    success: function(data) { 
            dat3 = d3.csv.parse(data);
            procesData(dat3);
          }
    });
  };
  $('select').on('change', function() {
    var filename = $(this).find('option:selected').val();
    loadData(filename);
  });

loadData('US_PER_CAPITA09.CSV');  

var getMin = function(obj, key) {
  var min = Infinity;
  for(var item in obj) {
    if(obj[item][key] < min) {
      min = obj[item][key];
    }
  }
  return min;
};

var getMax = function(obj, key) {
  var max = -Infinity;
  for(var item in obj) {
    if(obj[item][key] > max) {
      max = obj[item][key];
    }
  }
  return max;
};

  var procesData = function(data) {

    data.forEach(function(d) {
      if(d['State_Name']) {
        var abbr = state_abbr[d['State_Name'].toUpperCase()];
        dataset[abbr] = {state: d['State_Name'], spending: +d['Y2009'] }; 
      } 
    });

    
    var colorScale = d3.scale.linear()
      .domain([getMin(dataset, 'spending'), getMax(dataset, 'spending')])
      .range(["white", "black"]);

    var states = d3.selectAll('.state');
    
    states.transition(200)
    .attr('fill', function(d){
      var stateData = dataset[this.id];
      return colorScale(stateData.spending);
    });

    states.on("mouseover", function(d) {
      var stateData = dataset[this.id];
      var centroid = getCentroid(this);
      toolTip.transition()
        .duration(300)
        .style("opacity", 0.9);
      toolTip.html(stateData.state + ": $" + stateData.spending)
        .style("left", function() {
          return centroid[0] + "px";
        })
        .style("top", function() {
          // var centroid = getCentroid(this);
          return centroid[1] + 50 + "px";
        })
      .on("mouseout", function(d) {
        toolTip.transition()
          .duration(500)
          .style("opacity", 0);
      });
    });
  };
});
