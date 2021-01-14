/* global $, _, crossfilter, d3  */
(function(learnviz) {
    'use strict';
    var chartHolder3 = d3.select('#graph3');

    var margin3 = {top:20, right:20, bottom:25, left:65};
    var boundingRect3 = chartHolder3.node().getBoundingClientRect();
    var width3 = boundingRect3.width - margin3.left - margin3.right
    var height3 = boundingRect3.height - margin3.top - margin3.bottom;
    var xPaddingLeft3 = 10;

    var xScale3 = d3.time.scale().range([xPaddingLeft3, width3]);
    var yScale3 = d3.scale.linear().range([height3, 0]);
    var xAxis3 = d3.svg.axis().scale(xScale3).orient("bottom").ticks(d3.time.month, 0.5).tickFormat(d3.time.format("%m/%d"));
    var yAxis3 = d3.svg.axis().scale(yScale3).orient('left').ticks(4);

    var svg = chartHolder3.append("svg")
            .attr("width", width3 + margin3.left + margin3.right)
            .attr("height", height3 + margin3.top + margin3.bottom)
            .append("g")
            .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height3 + ")");
    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr('id', 'y-axis-label')
        .attr("x", width3/2)
        .style("text-anchor", "middle")
    ;
    learnviz.updateChart3 = function(data) {
        data = data.filter(function(d) {return d.casos_novos;});
        var minDate = d3.min(data, function(d) {return d.datahora});
        var maxDate = new Date(d3.max(data, function(d) {return +d.datahora}) + 24 * 60 * 60 * 1000);
        xScale3.domain([minDate, maxDate]);
        yScale3.domain([0, d3.max(data, function(d) { return +d.casos_novos;})]);
        var tooltip = d3.select('#graph-tooltip2');

        svg.select('.x.axis')
            .call(xAxis3)
            .selectAll("text");

        svg.select('.y.axis').call(yAxis3);
        var yLabel3 = svg.select('#y-axis-label');
        yLabel3.text("Casos por dia");

        var bars = svg.selectAll(".bar").data(data, function(d) {return d.datahora;});
        bars.enter().append("rect").attr("class", "bar").attr("x", xPaddingLeft3);

        bars
            .classed('active', true)
            .attr("x", function(d) { return xScale3(d.datahora); })
            .attr("width", width3/data.length*0.70)
            .attr("y", function(d) { return yScale3(d.casos_novos); })
            .attr("height", function(d) { return height3 - yScale3(d.casos_novos); });
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
