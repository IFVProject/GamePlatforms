function graph3a() {
    const width = 500;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let svg = d3.select("#canvas")
        .attr("width", width)
        .attr("height", height);

    d3.json("Data/SalesEvents.json").then(data => {
        const platforms = data.map(d => d.platform);
        const free = data.map(d => +d.Free);

        const g = svg.append("g") 
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(platforms)
            .range([0, innerWidth])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(free)])
            .nice()
            .range([innerHeight, 0]);
        
        svg.append('text') //x-axis
            .attr('class', 'axis-title') 
            .attr('y', height -20) 
            .attr('x', width - 65)  
            .text('Platform'); 

        svg.append('text') //y-axis
            .attr('class', 'axis-title')
            .attr('x', 5) 
            .attr('y', 30) 
            .text('Free Games'); 

        g.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.platform)) // FIX: d.platform, not d.data.platform
            .attr("y", d => y(d.Free))      // FIX: d.Free, not d.data.free
            .attr("width", x.bandwidth())
            .attr("height", d => innerHeight - y(d.Free)) // FIX: use innerHeight
            .attr("fill", "#d62728");

        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

            // Add legend
       // Add legend
        const legend = svg.append("g")
        .attr("transform", `translate(${width - margin.right - 100}, ${margin.top})`);

        legend.append("rect")
        .attr("x", 53)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "#d62728"); // your red color

        legend.append("text")
        .attr("x", 78)
        .attr("y", 12)
        .text("Free Games")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");


    });

};


    