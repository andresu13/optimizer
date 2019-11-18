function drawChart(data){
    d3.select(".svg_chart").remove();
    //console.log("I AM INSIDE CHART")
    //console.log(data)

// set the dimensions and margins of the graph
var margin = {top: 20, right: 250, bottom: 45, left: 80},
    width = 900 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear()
          .range([0, width])
          .domain([0,100]);
var y = d3.scaleLinear()
          .range([height, 0])
          .domain([0,100]);

var circle_size = d3.scaleSqrt()
          .range([10,45]);

var color = d3.scaleOrdinal(d3.schemeCategory10 )

//Set variables

var sectors = []

data.forEach(function(d){
  sectors.push(d["Sector"])
})

//Remove duplicates from sectors
sectors = [...new Set(sectors)]

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
  var xExtent = d3.extent(data, function(d) { return d['Reward'] });
  var xRange = xExtent[1] - xExtent[0];
  var yExtent = d3.extent(data, function(d) { return d['RISK'] });
  var yRange = yExtent[1] - yExtent[0];
  var circle_sizeExtent = d3.extent(data, function(d) { return d['Total'] });
  var circle_sizeRange = circle_sizeExtent[1] - circle_sizeExtent[0];

    //x.domain([xExtent[0] - (xRange * .15), xExtent[1] + (xRange * .1)]);
    //y.domain([yExtent[0] - (yRange * .15), yExtent[1] + (yRange * .1)]);
    
    circle_size.domain([circle_sizeExtent[0] - (circle_sizeRange * .05), circle_sizeExtent[1] + (circle_sizeRange * .05)]);
    color.domain(sectors)
    //circle_size.domain([3350,3440]);

  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      //.attr("class", function(d) { return "bubbles " + d.continent })
      .attr("class", "circle")
      .attr("cx", function (d) { return x(d['Reward']); } )
      .attr("cy", function (d) { return y(d['RISK']); } )
      .attr("r", function (d) { return circle_size(d['Total']); })
      .attr("fill", function(d){
        //console.log("I AM INSIDE COLOR")
        //console.log(color(d['Sector']))
        return color(d['Sector']) })

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  //Add X axis Label
  svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width/2)
      .attr("y", height+50)
      .style("font-weight", "bold")
      .text("Reward (Higher is better)");

  //Add X axis Label
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+45)
    .attr("x", -height/2)
    .style("font-weight", "bold")
    .text("Risk (Lower is better)")


    // Add legend
    var size = 20
    svg.selectAll("legend_circles")
      .data(sectors)
      .enter()
      .append("circle")
        .attr("cx", 620)
        .attr("cy", function(d,i){ return 6 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return color(d)})
        //.on("mouseover", highlight)
        //.on("mouseleave", noHighlight)

    // Add labels beside legend dots
    svg.selectAll("legend_labels")
      .data(sectors)
      .enter()
      .append("text")
        .attr("x", 620 + size*.8)
        .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        //.on("mouseover", highlight)
        //.on("mouseleave", noHighlight)

//});
}