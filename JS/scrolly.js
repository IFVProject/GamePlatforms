(function(){
//Create scrolly
function scroll(n, offset, func1, func2){
    const el = document.getElementById(n)
    return new Waypoint({
        element: document.getElementById(n),
        handler: function(direction) {
            direction == 'down' ? func1() : func2();
        },
        //start offset percentage from the top of the div
        offset: offset
    });
};
new scroll('div1', '75%', graph1, graphClean);  //open graph 1
new scroll('div2', '75%', graph2, graph1);  //transit to graph 2
new scroll('div3', '75%', graph3, graph2);  //transit to graph 3
new scroll('div4', '75%', graphClean, graph3);
new scroll('div5', '75%', graphClean, graphClean);
function graphClean(){
    //grab svg element
    let svg = d3.select("#canvas");
    svg.selectAll("*").remove();
}

   
})()