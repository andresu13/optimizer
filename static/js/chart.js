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
          .range([5,40]);

var color = d3.scaleOrdinal(d3.schemeCategory10 )

//Set variables

var sectors = []

data.forEach(function(d){
  sectors.push(d["Sector"])
})

//Remove duplicates from sectors
sectors = [...new Set(sectors)]

//console.log(sectors)

          
var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "svg_chart")
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

  // format the data
  data.forEach(function(d) {
    //console.log(d)
  });

  // Scale the range of the data in the domains
  var xExtent = d3.extent(data, function(d) { return d['Reward'] });
  var xRange = xExtent[1] - xExtent[0];
  var yExtent = d3.extent(data, function(d) { return d['RISK'] });
  var yRange = yExtent[1] - yExtent[0];
  var circle_sizeExtent = d3.extent(data, function(d) { return d['Total'] });
  var circle_sizeRange = circle_sizeExtent[1] - circle_sizeExtent[0];
    
    circle_size.domain([circle_sizeExtent[0] - (circle_sizeRange * .05), circle_sizeExtent[1] + (circle_sizeRange * .05)]);
    color.domain(sectors)

  // Tooltip
  var tooltip = d3.select(".chart")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  //.style("visibility", "hidden")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

var showTooltip = function(d) {
    //console.log("IM INSIDE TOOLTIP")
    //tooltip
    //  .transition()
    //  .duration(200)
    tooltip
      .style("opacity", 1)
      //.style("visibility", "visible")
      .html("<ul><li>Company Name: <b>"+d['Name']+"</b></li><li># of stocks to buy: <b>"+d['QTY']+"</b></li><li>Capital to invest: <b>$"+d['Total']+"</b></li></ul>")
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
}
var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
}
var hideTooltip = function(d) {
    tooltip
    //  .transition()
    //  .duration(200)
      .style("opacity", 0)
      //.style("visibility", "hidden")
}


  var circles = svg.append('g')
                  .selectAll("dot")
                  .data(data)
                  .enter()
                  .append("circle")

  var circleAttributes = circles
                  .attr("class", "circle")
                  .attr("cx", function (d) { return x(d['Reward']); } )
                  .attr("cy", function (d) { return y(d['RISK']); } )
                  .attr("r", function (d) { return circle_size(d['Total']); })
                  .style("fill", function(d){return color(d['Sector']) })
                  .on("mouseover", showTooltip )
                  .on("mousemove", moveTooltip )
                  .on("mouseleave", hideTooltip )

  var circle_text = svg.selectAll("text")
                    .data(data)
                    .enter();
                    //.append("text");

  var text_labels = circle_text
                    .append("text")
                    .attr("x", function(d) { return x(d['Reward']); })
                    .attr("y", function(d)  { return y(d['RISK'])-circle_size(d['Total'])-8; })
                    //.html(function(d){
                    //  return "test"+"<br/>"+d['QTY']})
                    //.html('<div class"style-me"><p>My label or other text</p></div>')
                    .text(function(d){return d['Stock']})
                    .style("text-anchor", "middle")
                    .attr("font-family", "sans-serif")
                    .attr("font-weight", "bold")
                    .attr("font-size", "13px")


  
  //var stock_count_text = svg.selectAll("text")
  //                  .data(data)
  //                  .enter()
  //                  .append("text");

  //var stock_count_labels = circle_text
  //                  .append("text")
  //                  .attr("x", function(d) { return x(d['Reward']); })
  //                  .attr("y", function(d)  { return y(d['RISK'])-circle_size(d['Total'])-7; })
  //                  .text(function(d){return d['QTY']})
  //                  .style("text-anchor", "middle")
  //                  .attr("font-family", "sans-serif")
  //                  .attr("font-weight", "bold")
  //                  .attr("font-size", "13px")


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
      .attr("y", height+42)
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

function drawAxis(){
  var margin = {top: 20, right: 250, bottom: 45, left: 80},
  width = 900 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

  var x = d3.scaleLinear()
          .range([0, width])
          .domain([0,100]);
  var y = d3.scaleLinear()
          .range([height, 0])
          .domain([0,100]);

  var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "svg_chart")
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

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
          .attr("y", height+42)
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
    

}