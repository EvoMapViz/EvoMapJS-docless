import * as d3 from 'd3';
import svgButton from "./utils/svgButton";
import arrow9 from './utils/arrow9.js';

export default function UpdateZoom( data,
                                    Width, Height,
                                    XDomain, YDomain, XRange, YRange,
                                    SizeExponent, SizeRange, SizeDomain, SizeIncreasing,
                                    FontRange, FontDomain, FontExponent, OpacityRange, OpacityDomain, OpacityExponent,
                                    valueSizes, sizeSel,
                                    trans_d3, setTrans_d3,
                                    isArrows){

console.log("Update Zoom") 

/*  */
/* Parameters and scales */
/*  */

const svg = d3.select(".svg-content-responsive")

const width = Width;
const height = Height;
const label_mult_nudge = 0.12; // label nudge away from circles
const arrow_text_dodge = 0.5; // nudge text away from arrow

const increasing = SizeIncreasing
const dom = d3.extent(data, d => d[sizeSel])

const x = d3.scaleLinear()
            .domain(XDomain)
            .range(XRange)
const y = d3.scaleLinear()
            .domain(YDomain) 
            .range(YRange) 
const size = d3.scalePow()
            .exponent(SizeExponent)
            .domain(SizeDomain)
            .range(SizeRange)
const fontScale = d3.scalePow()
                .exponent(FontExponent)
                .domain(FontDomain)
                .range(FontRange)
const opacityScale = d3.scalePow()
              .exponent(OpacityExponent)
              .domain(OpacityDomain)
              .range(OpacityRange)

/*  */            
// Zoom elements
/*  */

var zoom = d3.zoom()
  .scaleExtent([.5, 20])  
  .extent([[0, 0], [width, height]])
  .on("zoom", zoomed);

var zoom_group = d3.select(".zoom_group_g")

var xAxis = svg.select("axis--x")
var yAxis = svg.select("axis--y")
        
/*  */            
// New Zoom elements
/*  */

function zoomed({transform}) {
  let trans_d3 = transform
  setTrans_d3(transform);
  // recover the new scale
  var newX = trans_d3.rescaleX(x);
  var newY = trans_d3.rescaleY(y);

  // update axes with these new boundaries
  xAxis.call(d3.axisBottom(newX))
  yAxis.call(d3.axisLeft(newY))

  // Update firms circles and labels
  /*  */
  if(valueSizes === 'true'){
    zoom_group //Apply zoom to groups rather than individual elements for better performance: https://stackoverflow.com/questions/51562401/d3-slow-zoomable-heatmap
    .attr("transform", trans_d3)
    .selectAll('circle')
    .attr("r", function(d){
      if(SizeIncreasing === "true"){ 
        return   size(d[sizeSel]) / trans_d3.k } else {
        return   size(SizeDomain[1]-d[sizeSel]) / trans_d3.k  }
      })

    zoom_group
      .selectAll('.firmLabel')
      .attr('x', function(d){
        if(SizeIncreasing === "true"){ 
          return x(d.x + label_mult_nudge*(Math.sqrt(size(d[sizeSel])) / trans_d3.k) ) } else {
          return x(d.x + label_mult_nudge*(Math.sqrt(size(SizeDomain[1]-d[sizeSel])) / trans_d3.k) )  }
      }) // Update for size of circle
      .attr('y', function(d){
        if(SizeIncreasing === "true"){ 
          return y(d.y + label_mult_nudge*(Math.sqrt(size(d[sizeSel])) / trans_d3.k) ) } else {
          return y(d.y + label_mult_nudge*(Math.sqrt(size(SizeDomain[1]-d[sizeSel])) / trans_d3.k) )  }
      })
      .attr('font-size', function(d){
        if(SizeIncreasing === "true"){ 
          return fontScale(d[sizeSel])/trans_d3.k } else {
          return fontScale(SizeDomain[1] - d[sizeSel])/trans_d3.k
        }
      })
      .attr('opacity', function(d){
        if(SizeIncreasing === "true"){ 
          return opacityScale(d[sizeSel]) } else {
          return opacityScale(SizeDomain[1] - d[sizeSel])
        }
      })
  } else {
    zoom_group //Apply zoom to groups rather than individual elements for better performance: https://stackoverflow.com/questions/51562401/d3-slow-zoomable-heatmap
    .attr("transform", trans_d3)
    .selectAll('circle')
    .attr("r", 4/trans_d3.k) // Still need to make sure circles don't grow in size upon zoom.

    zoom_group
      .selectAll('.firmLabel')
      .attr('x', function(d){ return x(d.x + label_mult_nudge*(Math.sqrt(4) / trans_d3.k) ) }) 
      .attr('y', function(d){return y(d.y + label_mult_nudge*(Math.sqrt(4) / trans_d3.k) )  })
      .attr('font-size', 12/ trans_d3.k)
      .attr('opacity', 0.7)
  }

  // Update trace time labels
  /*  */
  zoom_group
    .selectAll('.time-label-trace-firm')
    .attr('x', function(d){
      if(increasing === "true"){ 
        return x(d.x + label_mult_nudge*(Math.sqrt(size(d[sizeSel])) / trans_d3.k) ) } else {
        return x(d.x + label_mult_nudge*(Math.sqrt(size(dom[1]-d[sizeSel])) / trans_d3.k) )  }
    }) // Update for size of circle
    .attr('y', function(d){
      if(increasing === "true"){ 
        return y(d.y - label_mult_nudge*(Math.sqrt(size(d[sizeSel])) / trans_d3.k) ) } else {
        return y(d.y - label_mult_nudge*(Math.sqrt(size(dom[1]-d[sizeSel])) / trans_d3.k) )  }
    })
    .attr('font-size', 12/trans_d3.k)
  
  // Update explainer elements
  /*  */

  if(isArrows){
    // Arrows
    zoom_group
    .selectAll('.explainer-arrow')
    .attr("stroke-width", 2/trans_d3.k)

    zoom_group
      .selectAll('.explainer-arrow')
      .attr("stroke-width", 2/trans_d3.k)

    zoom_group
      .selectAll('#my-arrow')
      .remove()

    // Arrow heads
    const arrow = arrow9( Math.min(1/trans_d3.k, 1) ) // scale parameter
    .id("my-arrow")

    zoom_group.call(arrow);

    d3.select('#my-arrow')
      .selectAll('path')
      .attr("fill", "#C0C0C0")

    // Arrow explainer text
    d3.selectAll('.arrow-text')
      .attr('x', function(d){
        const alpha = Math.abs(d.y/d.x)
        return( 
          x(
            d.x + Math.sign(d.x) * ( 
              (arrow_text_dodge/trans_d3.k)/(Math.sqrt(1 + alpha**2)) 
              )
          )
        )
      })
      .attr('y', function(d){
        const alpha = Math.abs(d.y/d.x)
        return( 
          y(
            d.y + Math.sign(d.y) * ( 
              (arrow_text_dodge/trans_d3.k) * (alpha/(Math.sqrt(1 + alpha**2))) 
              )
          )
        )
      })
      .attr('font-size', 12/trans_d3.k)
  } // End of "isArrows" if statement
} // End of new zoom function  

/*  */            
// Apply new Zoom function
/*  */

d3.select('.back-fore').call(zoom) 

/*  */            
// Update button zoom behavior
/*  */

d3.select('#button-in')
.on('click', function(){
  d3.select('#button-in')
      .transition()
      .duration(150)
      .attr('class','button-clicked')
      .transition()
      .duration(150)
      .attr('class','button-baseline')

    d3.select('.back-fore').transition().call(zoom.scaleBy, 1.5)
})

d3.select('#button-out')
.on('click', function(){
  d3.select('#button-out')
      .transition()
      .duration(150)
      .attr('class','button-clicked')
      .transition()
      .duration(150)
      .attr('class','button-baseline')

    d3.select('.back-fore').transition().call(zoom.scaleBy, 0.6)
})

d3.select('#button-reset')
.on('click', function(){
  d3.select('#button-reset')
    .transition()
    .duration(150)
    .attr('class','button-clicked')
    .transition()
    .duration(150)
    .attr('class','button-baseline')
    
    d3.select('.back-fore').transition().call(zoom.transform, d3.zoomIdentity);
})

}