import * as d3 from 'd3';

export default function UpdateHighlightsSel(data, justSelHigh,
                                            XDomain, YDomain, XRange, YRange,
                                            SizeExponent, SizeRange, SizeDomain, SizeIncreasing,
                                            OpacityRange, // To set highlight intensity as upper bound of range
                                            valueSizes, sizeSel, allNames, nFirms, nTimes,
                                            trans_d3){

console.log("High Sel Update") 

const zoom_group = d3.select('.zoom_group_g')
const svg = d3.select(".svg-content-responsive")
const increasing = SizeIncreasing
const dom = d3.extent(data, d => d[sizeSel])
const label_mult_nudge = 0.12; // time label nudge away from circles

const selRank = 'rank-' + sizeSel;

const x = d3.scaleLinear()
            .domain(XDomain)
            .range(XRange)
const y = d3.scaleLinear()
            .domain(YDomain) //-4 leaves room for time label
            .range(YRange)
const size = d3.scalePow()
            .exponent(SizeExponent)
            .domain(SizeDomain)
            .range(SizeRange)

/* ----- */        
/*  */
/* HIGHLIGHTS  */
/*  */
/* ----- */  

d3.selectAll('circle')  // Put non-highlighted circles in opacity background 
  .filter(function() {
    const tthis = d3.select(this) 
    return !tthis.classed('trace') && 
           tthis.attr("data-highlighted") === "false"
  })
  .style('opacity', 0.25)
  .style('stroke', 'none')
  .on("mouseout", function(d) { // standard mouseout for non-highlighted
    d3.select('.tooltip')
      .transition()
      .duration(100)
      .style("opacity", 0);
    d3.select(this)
      .style("stroke", "none")
  })

d3.selectAll('.firmLabel')  // Put non-highlighted labels in opacity background 
  .filter(function() {
    const tthis = d3.select(this) 
    return !tthis.classed('trace') && 
           tthis.attr("data-highlighted") === "false"
  })
  .attr('fill-opacity', 0.25)

/* ----- */  
/*  */
/* HIGHLIGHT click if NOT already highlighted */
/*  */
/* ----- */  

var f_circs = zoom_group
              .selectAll('.circle-firm')
              .filter(d => justSelHigh[1].includes(d.name))


if(justSelHigh[0] === 'high'){                                                      
  f_circs // Highlight main firm circle
    .attr("data-highlighted", 'true')
    .style('opacity', 1)
    .style('stroke', 'black')
    .attr('display', 'inline')
    .on("mouseout", function(d) { //special mouseout to keep clicked stroke
      d3.select('.tooltip')
        .transition()
        .duration(100)
        .style("opacity", 0);
  })

  d3.selectAll('.firmLabel') //Highlight firm label
    .filter(function(d) {return justSelHigh[1].includes(d.name)})
    .attr('fill-opacity', OpacityRange[1])
    .attr('opacity', OpacityRange[1])
    .attr('display', 'inline')
    .attr("data-highlighted", 'true')

  let filt_data = data.filter(function(d){ return justSelHigh[1].includes(d.name)})

  /*  */
  /* Add Trace */
  /*  */

  /* Add path trace */

  if(filt_data.length === nTimes){ // Complete data series for all times
    zoom_group.selectAll('path-trace-firm') 
    .data([ filt_data  ]) // data is array because object to create is path element (multiple points)
    .enter()
    .append('path')
    .attr('data-highlighted', 'true')
    .sort((a, b) => d3.descending(a.time, b.time))
    .classed('trace', true)
    .classed('path-trace-firm', true)
    .attr("d", d3.line()
                .x(d => x(d.x))
                .y(d => y(d.y))
    )
    .attr('fill', 'none')
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .attr('opacity', 0.25) 
    .lower() 
  } else { // Incomplete data series, missing for some times

    for (let i = 0; i < filt_data.length - 1; i++) {

      let filt_data_2 = filt_data.slice(i, i+2)

      if(filt_data_2[1]['time'] - filt_data_2[0]['time'] === 1){
        zoom_group.selectAll('path-trace-firm') 
          .data([ filt_data_2  ]) // data is array because object to create is path element (multiple points)
          .enter()
          .append('path')
          .attr('data-highlighted', 'true')
          .sort((a, b) => d3.descending(a.time, b.time))
          .classed('trace', true)
          .classed('path-trace-firm', true)
          .attr("d", d3.line()
                      .x(d => x(d.x))
                      .y(d => y(d.y))
          )
          .attr('fill', 'none')
          .attr('stroke-width', 1)
          .attr('stroke', 'black')
          .attr('opacity', 0.25) 
          .lower()
      }
    }
  }

  /* Add circle trace */

    let f_trace = zoom_group.selectAll('circle-trace-firm') //Add circle trace
    .data(filt_data)
    .enter()
    .append('circle')
    .attr('display', 'inline')
    .attr('data-highlighted', 'true')
    .sort((a, b) => d3.descending(a.time, b.time))
    .classed('trace', 'true')
    .attr('fill', 'grey')
    .attr('stroke', 'black')
    .attr('cx', d => x(d.x))
    .attr('cy', d => y(d.y))
    .attr('opacity', 0.25) 
    .lower() 

    if(valueSizes === 'true'){
      f_trace
      .attr("r", function(d){
        if(SizeIncreasing === "true"){ 
          return   size(d[sizeSel]) / trans_d3.k } else {
          return   size(SizeDomain[1]-d[sizeSel]) / trans_d3.k  }
        })
    } else {
      f_trace.attr("r", d => 4 / trans_d3.k)
    }

    /* Add time labels */

    zoom_group.selectAll('time-label-trace-firm') //Add time label trace 
    .data(filt_data)
    .enter()
    .append('text')
    .attr('display', 'inline')
    .attr('data-highlighted', 'true')
    .sort((a, b) => d3.descending(a.time, b.time))
    .classed('trace', true)
    .classed('time-label-trace-firm', true)
    .classed('unselectable', true)
    .attr('fill', 'grey')
    .attr('stroke', 'black')
    .text(d => d.time)
    .attr('x', function(d){
      if(increasing === "true"){ 
        return x(d.x - label_mult_nudge*(Math.sqrt(size(d[sizeSel])) / trans_d3.k) ) } else {
        return x(d.x - label_mult_nudge*(Math.sqrt(size(dom[1]-d[sizeSel])) / trans_d3.k) )  }
    }) // adjust for size of circle
    .attr('y', function(d){
      if(increasing === "true"){ 
        return y(d.y - label_mult_nudge*(Math.sqrt(size(d[sizeSel])) / trans_d3.k) ) } else {
        return y(d.y - label_mult_nudge*(Math.sqrt(size(dom[1]-d[sizeSel])) / trans_d3.k) )  }
    })
    .attr('font-size', 12/trans_d3.k)
    .attr('opacity', 0.25)
    .attr("text-anchor", "end") // https://stackoverflow.com/questions/13188125/d3-add-multiple-classes-with-function
} 

/* ----- */  
/*  */
/* DE-HIGHLIGHT click if already highlighted */
/*  */
/* ----- */  

if(justSelHigh[0] === 'dehigh') { 

  f_circs
    .attr("data-highlighted", 'false')
    .style('opacity', 0.25)
    .style('stroke', 'none')
    .on("mouseout", function(d) {
      d3.select('.tooltip')
        .transition()
        .duration(100)
        .style("opacity", 0);
      d3.select(this)
      .style("stroke", "none")
    })
    .filter(d => d[selRank] > nFirms)
    .attr('display', 'none')

  svg.selectAll('.trace') //De-highlight trace
    .filter(d => d.length > 1 ?  justSelHigh[1].includes(d[0].name) : justSelHigh[1].includes(d.name)) // d[0] is first element of path if element is path element
    .remove()

  let to_be_dehigh = d3.selectAll('.firmLabel') //De-highlight firm label
                      .filter(d => justSelHigh[1].includes(d.name))
                      .attr("data-highlighted", 'false')

  if(allNames === 'true'){
  to_be_dehigh
  .attr('fill-opacity', 0.25)
  } else { 
  to_be_dehigh
  .attr('fill-opacity', 0.25)
  .attr('display', 'none')
  }

}

}