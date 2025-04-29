function graph1() {
  let width = window.innerWidth/1.5;
  let height = window.innerHeight/1.5;
  
  //grab svg element and clean it with a fade out animation
  let svg = d3
      .select("#canvas")
      .attr("width", width)
      .attr("height", height)
  
  svg.selectAll("*").transition().duration(300).style("opacity", 0).remove();
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", svg.attr("width"))
    .attr("height", svg.attr("height"))
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2);
  let margin = { top: 50, right: 60, bottom: 50, left: 80 };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const parseDate = d3.timeParse("%m/%Y");

  const formatDate = d3.timeFormat("%m/%Y");

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
      .domain([0, d3.max(data, (d) => d.sales)+10000000])
      .range([height, 0]);

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.sales));

    //create axis
    g.append("text") //x-axis
      .attr("class", "axis-title") 
      .attr("y", height - 10) 
      .attr("x", width - 45) 
      .text("Year"); //actual text to display

    g.append("text") //y-axis
      .attr("class", "axis-title") 
      .attr("x", 20) 
      .attr("y", 25) 
      .text("Sales"); //actual text to display

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g").call(d3.axisLeft(y));

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("pointer-events", "none") 
      .attr("d", line);

    // Draw circles for each point
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.sales))
      .attr("r", 10)
      .attr("fill", "orange")
      .on("mouseover", function (event, d) {
        d3.select(this).raise();
        d3.select(this)
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
