function graph1() {

  //grab svg element and clean it with a fade out animation
  let svg = d3.select("#canvas"),
          margin = {top: 20, right: 60, bottom: 50, left: 80},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;
  svg.selectAll("*").transition().duration(300).style("opacity", 0).remove();
  svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", svg.attr("width"))
  .attr("height", svg.attr("height"))
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-width", 2);
  

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const parseDate = d3.timeParse("%m/%Y");

  const formatDate = d3.timeFormat("%m/%Y");
    width = width + 40
    height = height + 20
  d3.csv("Data/popular.csv", (d) => {
    return {
      name: d.Name,
      date: parseDate(d.Date),
      sales: +d.Sales.replace(/,/g, ""), // remove commas and convert to number
      platform: d.Platform,
    };
  }).then((data) => {
    console.log(data);
    data.sort((a, b) => a.date - b.date);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.sales)])
      .range([height, 20]);

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.sales));
    
    //create axis
    g.append('text') //x-axis
    .attr('class', 'axis-title') //Optional: change font size and font weight
    .attr('y', height -10) //add to the bottom of graph (-25 to add it above axis)
    .attr('x', width - 45) //add to the end of X-axis (-60 offsets the width of text)  
    .text('Year'); //actual text to display

    g.append('text') //y-axis
    .attr('class', 'axis-title') //Optional: change font size and font weight
    .attr('x', 20) //add some x padding to clear the y axis
    .attr('y', 25) //add some y padding to align the end of the axis with the text
    .text('Sales'); //actual text to display

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g").call(d3.axisLeft(y));

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("pointer-events", "none") // << Add this!
      .attr("d", line);

    // Draw circles for each point
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.sales))
      .attr("r", 4)
      .attr("fill", "orange")
      .on("mouseover", function (event, d) {
        d3.select(this) //add a stroke to highlighted point
          .style("stroke", "black");
        d3.select("#tooltip")
          .style("opacity", 100)
          .html(
            `
                ${d.name}<br>
                Release: ${formatDate(d.date)}<br>
                Sales: ${d.sales}<br>
                Platform: ${d.platform}
            `
          )
          .style("left", `${event.clientX}px`)
          .style("top", `${event.clientY}px`);
      })
      .on("mouseleave", function (event) {
        //remove the stroke from point
        d3.select(this).style("stroke", "none");
        // hide tooltip
        d3.select("#tooltip").transition().duration(500).style("opacity", 0);
      });
  });
}
