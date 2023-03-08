import * as d3 from 'd3';

export default function UpdateColgroupContinuous(colGroup, nFirms, allNames, sizeSel, colorSel,
                                                 Colorbins, SetColorbounds,
                                                Sizeincreasing, maxNfirms){

console.log("Cluster CONTINUOUS Update") 

const selRank = 'rank-' + sizeSel

let bounds = colGroup.split(',')
bounds = bounds.map(function(d){ // handles rounding problems at top and bottom of scale (extremest value not included upon colGrouping)
  let numb = Number(d)
  if(numb < Colorbins[0]){return numb-1}
  if(numb > Colorbins[Colorbins.length - 1]){return numb + 1}
  return numb
  })
SetColorbounds(bounds)

const svg = d3.select(".svg-content-responsive")

const f_circ =  svg.selectAll('.circle-firm')
const f_trace =  svg.selectAll('.trace')
const f_lab =  svg.selectAll('.firmLabel')
const f_circ_Nshow = f_circ
                      .filter(function(d){
                        if(Sizeincreasing === 'true'){ return d[selRank] <= nFirms}
                        if(Sizeincreasing === 'false'){return d[selRank] >= (maxNfirms - nFirms)}  
                      })
const f_trace_Nshow = f_trace
                      .filter(function(d){
                        if(Sizeincreasing === 'true'){ return d[selRank] <= nFirms}
                        if(Sizeincreasing === 'false'){return d[selRank] >= (maxNfirms - nFirms)}  
                      })
const f_lab_Nshow = f_lab
                      .filter(function(d){
                        if(Sizeincreasing === 'true'){ return d[selRank] <= nFirms}
                        if(Sizeincreasing === 'false'){return d[selRank] >= (maxNfirms - nFirms)}  
                      })

// 
// Click is on background of colGroup legend, go back to showing everything  
//

if(colGroup === "Show All"){ 
  f_circ_Nshow
    .attr('display', 'inline')
  f_trace_Nshow
    .filter(function(d){ return d3.select(this).attr('data-highlighted') === 'true'})
    .attr('display', 'inline')

  f_lab
     .filter(function(d){ return d3.select(this).attr('data-highlighted') === 'true'})
     .attr('display', 'inline') 

  if(allNames === 'true'){
    f_lab_Nshow
      .attr('display', 'inline')
  }

} else {

// 
// Click is on a colGroup in the legend, show only those circles 
//

  // Elements to hide
  f_circ
    .filter(d => d[colorSel] < bounds[0] | d[colorSel] >= bounds[1])
    .attr('display', 'none')
  f_trace
    .filter(d => d[colorSel] < bounds[0] | d[colorSel] >= bounds[1])
    .attr('display', 'none')
  f_lab
    .filter(d => d[colorSel] < bounds[0] | d[colorSel] >= bounds[1])
    .attr('display', 'none')

  // Elements to show
  f_circ_Nshow
    .filter(d => d[colorSel] >= bounds[0] && d[colorSel] < bounds[1])
     .attr('display', 'inline')
  f_trace_Nshow
    .filter(function(d){return d[colorSel] >= bounds[0] && d[colorSel] < bounds[1] &&
                               d3.select(this).attr('data-highlighted') === 'true'})
     .attr('display', 'inline')
  f_lab
    .filter(function(d){return d[colorSel] >= bounds[0] && d[colorSel] < bounds[1] &&
                                d3.select(this).attr('data-highlighted') === 'true'})
     .attr('display', 'inline') 

  // All names case
  if(allNames === 'true'){
    f_lab_Nshow
      .filter(function(d){return d[colorSel] >= bounds[0] && d[colorSel] < bounds[1] &&
                                  d3.select(this).attr('data-highlighted') === 'true'})
      .attr('display', 'inline') 
  }

}

}