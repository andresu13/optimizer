function drawChart(data){
    d3.select(".svg_chart").remove();
    //console.log("I AM INSIDE CHART")
    //console.log(data)

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear()
          .range([0, width]);
var y = d3.scaleLinear()
          .range([height, 0]);

var circle_size = d3.scaleSqrt()
          .range([15,40]);

var color = d3.scaleOrdinal(d3.schemeCategory10 )

//Set variables

var sectors = []

data.forEach(function(d){
  sectors.push(d["Sector"])
})

console.log(sectors)

          
var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "svg_chart")
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
//d3.csv("sales.csv", function(error, data) {
//  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    console.log(d)
    //d.sales = +d.sales;
  });

  // Scale the range of the data in the domains
  var xExtent = d3.extent(data, function(d) { return d['RSI'] });
  var xRange = xExtent[1] - xExtent[0];
  var yExtent = d3.extent(data, function(d) { return d['BETA'] });
  var yRange = yExtent[1] - yExtent[0];
  var circle_sizeExtent = d3.extent(data, function(d) { return d['Total'] });
  var circle_sizeRange = circle_sizeExtent[1] - circle_sizeExtent[0];

    x.domain([xExtent[0] - (xRange * .1), xExtent[1] + (xRange * .1)]);
    y.domain([yExtent[0] - (yRange * .1), yExtent[1] + (yRange * .1)]);
    circle_size.domain([circle_sizeExtent[0] - (circle_sizeRange * .05), circle_sizeExtent[1] + (circle_sizeRange * .05)]);
    color.domain(sectors)
    //circle_size.domain([3350,3440]);

  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      //.attr("class", function(d) { return "bubbles " + d.continent })
      .attr("cx", function (d) { return x(d['RSI']); } )
      .attr("cy", function (d) { return y(d['BETA']); } )
      .attr("r", function (d) { return circle_size(d['Total']); })
      .attr("fill", function(d){
        console.log("I AM INSIDE COLOR")
        console.log(color(d['Sector']))
        return color(d['Sector']) })

  // append the rectangles for the bar chart
  //svg.selectAll(".bar")
  //    .data(data)
  //  .enter().append("rect")
  //    .attr("class", "bar")
  //    .attr("x", function(d) { return x(d.salesperson); })
  //    .attr("width", x.bandwidth())
  //    .attr("y", function(d) { return y(d.sales); })
  //    .attr("height", function(d) { return height - y(d.sales); });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

//});
}