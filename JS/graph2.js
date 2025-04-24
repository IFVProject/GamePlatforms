function graph2(){
    let width = 350;
    let height= 450;

    //grab svg element and clean it with a fade out animation
    let svg = d3.select("#canvas");
    svg.selectAll("*")
    .transition()
    .duration(300)
    .style("opacity", 0)
    .remove();

    //load data
    d3.csv("Data/MAU.csv").then((data)=>{
        //parse time and typecast numeric conlumn
        var parseTime = d3.timeParse("%Y");
        data.forEach(function(d) { 
            d.date = parseTime(d.Year);
            d.MAU_Count = +d.MAU_Count;
        });
        function dateComparator(a,b){
            return a.date - b.date;
        }
        //sort the data
        data = data.sort(dateComparator);
        //group data by the platform
        var sumstat = d3.group(data,d=>d.Platform);

        var x = d3.scaleTime() //a scale to convert time to x-position
        .domain(d3.extent(data, function(d) { return d.date })) //min to max date
        .range([15, width]) //from 0px to full width of page
    
        var y = d3.scaleLinear() //a scale to convert MAU_count to y-position
        .domain([0, d3.max(data, function(d) { return d.MAU_Count; })]) //0 to max value
        .range([height, 0]) //from the bottom of the page to the top of the page

        //color scale for differnt platform
        var color = d3.scaleOrdinal()
        .domain(['Steam', 'EpicGames', 'Xbox'])
        .range(['steelblue', 'crimson', 'green']);

        //draw line
        var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) {return y(d.MAU_Count); });
        
        svg
        .selectAll("path") //select all SVG paths in our canvas (i.e.: lines)
        .data(sumstat) //add our rolled up data
        .join("path") //join the data to path
            .attr('fill', 'white') // removes the area inside the path
            .attr('stroke', d => color(d[0])) //map color to the key (negative/positive)
            .attr("d", (d)=> { //creates a stroke for each key/category returned by sumstat
                return line(d[1]);
            })
            .attr("transform", "translate(10,0)");
        
        //create axis
        svg.append('text') //x-axis
            .attr('class', 'axis-title') //Optional: change font size and font weight
            .attr('y', height +20) //add to the bottom of graph (-25 to add it above axis)
            .attr('x', width - 40) //add to the end of X-axis (-60 offsets the width of text)  
            .text('Year'); //actual text to display

        svg.append('text') //y-axis
            .attr('class', 'axis-title') //Optional: change font size and font weight
            .attr('x', 30) //add some x padding to clear the y axis
            .attr('y', 25) //add some y padding to align the end of the axis with the text
            .text('MAU/Million'); //actual text to display

        //add x-axis ticks
        svg.append("g")
        //put our axis on the bottom
                    .attr("transform", "translate(10," + (height) + ")")
        //ticks + tickSize adds grids 
                    .call( d3.axisBottom(x).ticks(10).tickSize(-height-10))
                
        //add y-axis ticks
        svg.append("g")
                    .attr("transform", "translate(25,0)")
                    .call(d3.axisLeft(y).ticks(10).tickSize(-width-10))
        //remove the first left axis endpoints
                    .selectAll(".tick:first-of-type").remove();
                    
        //create the legend
        const legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

        legend.append("rect")
            .attr("x", width+30)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width+55)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor","start")
            .text(d => d);
        
        //create point for mousehover interaction
        svg.selectAll("cirlce")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.date) + 10) // match the x offset from your line transform
            .attr("cy", d => y(d.MAU_Count))
            .attr("r", 4)
            .attr("fill", d => color(d.Platform))
            .on("mouseover", function(event, d) {
                d3.select(this) //add a stroke to highlighted point 
                    .style("stroke", "black");
                d3.select('#tooltip')
                    .style("opacity", 100)
                    .html(`
                        ${d.Platform}<br>
                        Year: ${d.Year}<br>
                        MAU: ${d.MAU_Count}<br>
                        Increase: ${d.Change*100}%
                    `)
                    .style("left", `${event.clientX}px`)
                    .style("top", `${event.clientY}px`);

            })
            .on("mouseleave", function(event) {
                //remove the stroke from point
                d3.select(this).style("stroke", "none");
                // hide tooltip
                d3.select('#tooltip').transition().duration(500).style("opacity", 0);
                
            });


        //fade the graph in
        svg.transition()
        .duration(400)
        .style("opacity", 1);
    });
}