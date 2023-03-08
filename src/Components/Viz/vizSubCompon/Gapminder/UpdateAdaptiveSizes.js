import * as d3 from 'd3';

export default function UpdateAdaptiveSizes(XDomain, YDomain, XRange, YRange,
                                            SizeExponent, SizeRange, SizeDomain, SizeIncreasing,
                                            FontRange, FontDomain, FontExponent, 
                                            OpacityRange, OpacityDomain, OpacityExponent,
                                            valueSizes, sizeSel,
                                            trans_d3){

console.log("Adaptive Size Update")

const svg = d3.select(".svg-content-responsive")
const label_mult_nudge = 0.12; // label nudge away from circles

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
const fontScale = d3.scalePow()
                .exponent(FontExponent)
                .domain(FontDomain)
                .range(FontRange)
const opacityScale = d3.scalePow()
              .exponent(OpacityExponent)
              .domain(OpacityDomain)
              .range(OpacityRange)

/*  */
/* Update current sizes */
/*  */

if(valueSizes === "true"){
  svg
    .selectAll('circle')
    .transition()
    .duration(700)
    .attr("r", function(d){
                if(SizeIncreasing === "true"){ 
                  return   size(d[sizeSel]) / trans_d3.k } else {
                  return   size(SizeDomain[1]-d[sizeSel]) / trans_d3.k  }
                })

  svg
    .selectAll('.firmLabel')
    .transition()
    .duration(700)
    .attr('x', function(d){
      if(SizeIncreasing === "true"){ 
        return x(d.x + label_mult_nudge*(Math.sqrt(size(d[sizeSel])) / trans_d3.k) ) } else {
        return x(d.x + label_mult_nudge*(Math.sqrt(size(SizeDomain[1]-d[sizeSel])) / trans_d3.k) )  }
    }) // adjust for size of circle
    .attr('y', function(d){
      if(SizeIncreasing === "true"){ 
        return y(d.y + label_mult_nudge*(Math.sqrt(size(d[sizeSel])) / trans_d3.k) ) } else {
        return y(d.y + label_mult_nudge*(Math.sqrt(size(SizeDomain[1]-d[sizeSel])) / trans_d3.k) )  }
    })
    .attr('font-size', function(d){
        if(SizeIncreasing === "true"){ 
          return fontScale(d[sizeSel])/trans_d3.k } else {
          return fontScale(SizeDomain[1] - d[sizeSel])/trans_d3.k}
    })
    .attr('opacity', function(d){
        if(SizeIncreasing === "true"){ 
          return opacityScale(d[sizeSel]) } else {
          return opacityScale(SizeDomain[1] - d[sizeSel])}
    })

}

if(valueSizes === "false"){
  svg
    .selectAll('circle')
    .transition()
    .duration(700)
    .attr("r", d => 4 / trans_d3.k)

  svg
    .selectAll('.firmLabel')
    .transition()
    .duration(700)
    .attr('x', function(d){ return x(d.x + label_mult_nudge*(Math.sqrt(4) / trans_d3.k) )  }) // adjust for size of circle
    .attr('y', function(d){ return y(d.y + label_mult_nudge*(Math.sqrt(4) / trans_d3.k) ) })
    .attr('font-size', 12/trans_d3.k)
    .filter(function(){return d3.select(this).attr("data-highlighted") === "false"})
    .attr('opacity', OpacityRange[1])
}

}