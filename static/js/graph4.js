/* global $, _, crossfilter, d3  */
(function(learnviz) {
    'use strict';
    var chartHolder4 = d3.select('#graph4');

    var margin4 = {top:20, right:20, bottom:25, left:65};
    var boundingRect4 = chartHolder4.node().getBoundingClientRect();
    var width4 = boundingRect4.width - margin4.left - margin4.right
    var height4 = boundingRect4.height - margin4.top - margin4.bottom;
    var xPaddingLeft4 = 10;

    var xScale4 = d3.time.scale().range([xPaddingLeft4, width4]);
    var yScale4 = d3.scale.linear().range([height4, 0]);
    var xAxis4 = d3.svg.axis().scale(xScale4).orient("bottom").ticks(d3.time.month, 0.5).tickFormat(d3.time.format("%m/%d"));
    var yAxis4 = d3.svg.axis().scale(yScale4).orient('left').ticks(4);

    var svg = chartHolder4.append("svg")
            .attr("width", width4 + margin4.left + margin4.right)
            .attr("height", height4 + margin4.top + margin4.bottom)
            .append("g")
            .attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height4 + ")");
    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr('id', 'y-axis-label')
        .attr("x", width4/2)
        .style("text-anchor", "middle")
    ;
    learnviz.updateChart4 = function(data) {
        data = data.filter(function(d) {return d.obitos_novos;});
        var minDate = d3.min(data, function(d) {return d.datahora});
        var maxDate = new Date(d3.max(data, function(d) {return +d.datahora}) + 24 * 60 * 60 * 1000);
        xScale4.domain([minDate, maxDate]);
        yScale4.domain([0, d3.max(data, function(d) { return +d.obitos_novos;})]);
        var tooltip = d3.select('#graph-tooltip2');

        svg.select('.x.axis')
            .call(xAxis4)
            .selectAll("text");

        svg.select('.y.axis').call(yAxis4);
        var yLabel4 = svg.select('#y-axis-label');
        yLabel4.text("Óbitos por dia");

        var bars = svg.selectAll(".bar").data(data, function(d) {return d.datahora;});
        bars.enter().append("rect").attr("class", "bar").attr("x", xPaddingLeft4);

        bars
            .classed('active', true)
            .attr("x", function(d) { return xScale4(d.datahora); })
            .attr("width", width4/data.length*0.70)
            .attr("y", function(d) { return yScale4(d.obitos_novos); })
            .attr("height", function(d) { return height4 - yScale4(d.obitos_novos); });
        bars.exit().remove();

        bars
        .on("mouseenter", function(d) {
            tooltip.select('#casos').text('Casos: ' + d.casos_novos);
            tooltip.select('#obitos').text('Óbitos: ' + d.obitos_novos);
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
