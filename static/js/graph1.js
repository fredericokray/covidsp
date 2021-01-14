/* global $, _, crossfilter, d3  */
(function(learnviz) {
    'use strict';
    var chartHolder = d3.select('#graph1');

    var margin = {top:20, right:20, bottom:25, left:65};
    var boundingRect = chartHolder.node().getBoundingClientRect();
    var width = boundingRect.width - margin.left - margin.right
    var height = boundingRect.height - margin.top - margin.bottom;
    var xPaddingLeft = 10;

    var xScale = d3.time.scale().range([xPaddingLeft, width]);
    var yScale = d3.scale.linear().range([height, 0]);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(d3.time.month, 0.5).tickFormat(d3.time.format("%m/%d"));
    var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(4);

    var svg = chartHolder.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");
    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr('id', 'y-axis-label')
        .attr("x", width/2)
        .style("text-anchor", "middle")
    ;

    learnviz.updateChart = function(data) {
        data = data.filter(function(d) {return d.casos;});
        var minDate = d3.min(data, function(d) {return d.datahora});
        var maxDate = new Date(d3.max(data, function(d) {return +d.datahora}) + 24 * 60 * 60 * 1000);
        xScale.domain([minDate, maxDate]);
        yScale.domain([0, d3.max(data, function(d) { return +d.casos;})]);
        var tooltip = d3.select('#graph-tooltip');

        svg.select('.x.axis').call(xAxis).selectAll("text");

        svg.select('.y.axis').call(yAxis);
        var yLabel = svg.select('#y-axis-label');
        yLabel.text("Total de casos");

        var bars = svg.selectAll(".bar").data(data, function(d) {return d.datahora;});
        bars.enter().append("rect").attr("class", "bar").attr("x", xPaddingLeft);

        bars
            .classed('active', true)
            .attr("x", function(d) { return xScale(d.datahora); })
            .attr("width", width/data.length*0.75)
            .attr("y", function(d) { return yScale(d.casos); })
            .attr("height", function(d) { return height - yScale(d.casos); });
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
