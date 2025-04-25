function graph3() {
    const width = 500;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let svg = d3.select("#canvas")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("*")
        .transition()
        .duration(300)
        .style("opacity", 0)
        .remove();

    d3.json("Data/SalesEvents.json").then(data => {
        const platforms = data.map(d => d.platform);
        const discounts = Object.keys(data[0]).filter(d => d !== "platform");

        const stack = d3.stack().keys(discounts);
        const stackedSeries = stack(data);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .style("opacity", 0);  // Start invisible

        const x = d3.scaleBand()
            .domain(platforms)
            .range([0, innerWidth])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d3.sum(discounts, k => d[k]))])
            .nice()
            .range([innerHeight, 0]);

        const color = d3.scaleOrdinal()
            .domain(discounts)
            .range(d3.schemeCategory10);

        // Add bars
        g.selectAll("g.layer")
            .data(stackedSeries)
            .enter()
            .append("g")
            .attr("class", "layer")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .enter()
            .append("rect")
            .attr("x", d => x(d.data.platform))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth());

        // Add axes
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .call(d3.axisLeft(y));

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - margin.right - 150}, ${margin.top})`)
            .style("opacity", 0);  // Start invisible

        discounts.forEach((discount, i) => {
            const legendRow = legend.append("g")
                .attr("transform", `translate(0, ${i * 20})`);

            legendRow.append("rect")
                .attr("x", 60)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", color(discount));

            legendRow.append("text")
                .attr("x", 90)
                .attr("y", 12)
                .text(discount)
                .style("font-size", "12px")
                .attr("alignment-baseline", "middle");
        });

        // Fade in everything
        g.transition().duration(400).style("opacity", 1);
        legend.transition().duration(400).style("opacity", 1);
    });
}