/* global $, _, crossfilter, d3  */
(function(learnviz) {
    'use strict';
    var chartHolder2 = d3.select('#graph2');

    var margin2 = {top:20, right:20, bottom:25, left:65};
    var boundingRect2 = chartHolder2.node().getBoundingClientRect();
    var width2 = boundingRect2.width - margin2.left - margin2.right
    var height2 = boundingRect2.height - margin2.top - margin2.bottom;
    var xPaddingLeft2 = 10;

    var xScale2 = d3.time.scale().range([xPaddingLeft2, width2]);
    var yScale2 = d3.scale.linear().range([height2, 0]);
    var xAxis2 = d3.svg.axis().scale(xScale2).orient("bottom").ticks(d3.time.month, 0.5).tickFormat(d3.time.format("%m/%d"));
    var yAxis2 = d3.svg.axis().scale(yScale2).orient('left').ticks(4);

    var svg = chartHolder2.append("svg")
            .attr("width", width2 + margin2.left + margin2.right)
            .attr("height", height2 + margin2.top + margin2.bottom)
            .append("g")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")");
    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr('id', 'y-axis-label')
        .attr("x", width2/2)
        .style("text-anchor", "middle")
    ;
    learnviz.updateChart2 = function(data) {
        data = data.filter(function(d) {return d.obitos;});
        var minDate = d3.min(data, function(d) {return d.datahora});
        var maxDate = new Date(d3.max(data, function(d) {return +d.datahora}) + 24 * 60 * 60 * 1000);
        xScale2.domain([minDate, maxDate]);
        yScale2.domain([0, d3.max(data, function(d) { return +d.obitos;})]);
        var tooltip = d3.select('#graph-tooltip');

        svg.select('.x.axis').call(xAxis2).selectAll("text");

        svg.select('.y.axis').call(yAxis2);
        var yLabel2 = svg.select('#y-axis-label');
        yLabel2.text("Total de óbitos");

        var bars = svg.selectAll(".bar").data(data, function(d) {return d.datahora;});
        bars.enter().append("rect").attr("class", "bar").attr("x", xPaddingLeft2);

        bars
            .classed('active', true)
            .attr("x", function(d) { return xScale2(d.datahora); })
            .attr("width", width2/data.length*0.75)
            .attr("y", function(d) { return yScale2(d.obitos); })
            .attr("height", function(d) { return height2 - yScale2(d.obitos); });
        bars.exit().remove();

        bars
        .on("mouseenter", function(d) {
            tooltip.select('#casos').text('Casos: ' + d.casos);
            tooltip.select('#casos_pc').text('Casos por 100mil: ' + d.casos_pc);
            tooltip.select('#obitos').text('Óbitos: ' + d.obitos);
            tooltip.select('#obitos_pc').text('Óbitos por 100mil: ' + d.obitos_pc);
            var parseTime = d3.time.format("%d-%m-%Y");
            tooltip.select('#data').text('Data: ' + parseTime(d.datahora));
            var mouseCoords = d3.mouse(this);
            var w = parseInt(tooltip.style('width')),
                h = parseInt(tooltip.style('height'));
            tooltip.style('top', d3.event.pageY - 100 +'px');
            tooltip.style('left', d3.event.pageX - 150 +'px');
        })
        .on("mouseout", function(d) {
            svg.selectAll("line").remove()
            tooltip.style("left", -9999 + 'px')
        });
    };

}(window.learnviz = window.learnviz || {}));
