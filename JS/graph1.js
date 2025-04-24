function graph1(){
    //load data
    var data = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 10; j++) {
            data.push({x:j*40,y:i*40});
        }
    }

    //grab svg element and clean it with a fade out animation
    let svg = d3.select("#canvas");
    svg.selectAll("*")
    .transition()
    .duration(300)
    .style("opacity", 0)
    .remove();

    //start creating visulization
    let g1 = svg.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d) => d.x)
        .attr("y", (d) => d.y)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill','black')
        .style("opacity", 0);
    //fade the graph in
    g1.transition()
        .duration(400)
        .style("opacity", 1);

}