import * as d3 from 'd3';

export default function clearSVG(svg, allNames, 
                                 data, sizeSel, time,
                                 OpacityRange, OpacityDomain, OpacityExponent){

    console.log('Clearing up! (clearSVG)')

    const opacityScale = d3.scalePow()
                            .exponent(OpacityExponent)
                            .domain(OpacityDomain)
                            .range(OpacityRange)

    svg.selectAll('.trace') // Remove circle traces
    .filter(function() { return d3.select(this).classed('trace') })
    .remove()

    let to_be_dehigh = svg.selectAll('.firmLabel') //Hide labels
    if(allNames === "true"){ 
      to_be_dehigh
      .attr('fill-opacity', d => opacityScale(d[sizeSel]))
      .attr('data-highlighted', false)
    } else { 
      to_be_dehigh
      .attr('display', 'none')
      .attr('fill-opacity', d => opacityScale(d[sizeSel]))
      .attr('data-highlighted', false)
    }

    svg.selectAll('.circle-firm')//De-highlight firm circles
    .style('stroke', 'none')
    .style('opacity', 0.65)
    .attr('data-trace', false)
    .attr('data-highlighted', false)
    .on("mouseout", function(d) {
      d3.select('.tooltip')
        .transition()
        .duration(100)
        .style("opacity", 0);
    d3.select(this)
    .style("stroke", "none")
    })

}