import * as d3 from 'd3';
import clearSVG from "./utils/clearSVG";

export default function UpdateN(allNames, maxNfirms,
                                Sizeincreasing, nFirms, colGroup, setJustClicked,
                                data, sizeSel, colorSel,  time,
                                Colortype, Colorbounds,
                                OpacityRange, OpacityDomain, OpacityExponent // For use in clearSVG
                                ){

console.log("Top N Update") 

const svg = d3.select(".svg-content-responsive")
const zoom_group = d3.select('.zoom_group_g')
const selRank = 'rank-' + sizeSel

const nFirmsHigh = maxNfirms - nFirms

/*  */
/* Update svg background click event */
/*  */

svg.on('click', function(event){
  if(event.target.className.baseVal === "svg-content-responsive"){ // if click is not also firm or other element in group
    clearSVG(svg, allNames, data, sizeSel, time, OpacityRange, OpacityDomain,  OpacityExponent)
    zoom_group.attr('data-high-count', 0) // Counts number of highlighted elements (firms) in group, to trigger `clearSVG` when de-highlighting the last highlighted element
    setJustClicked(['background'])
  }
});

/*  */
/* Single out colGroup selected elements */
/*  */

const all_circ =  svg.selectAll('.circle-firm')
const all_lab =  svg.selectAll('.firmLabel')

var colGroup_circ = all_circ
var colGroup_lab = all_lab

if(colGroup !== "Show All"){
  colGroup_circ = all_circ
                  .filter(function(d){ 
                    if(Colortype === 'continuous'){ // Early return
                      return d[colorSel] >= Colorbounds[0] &&  d[colorSel] <= Colorbounds[1]
                    }
                    return d[colorSel] === colGroup
                  })
  colGroup_lab = all_lab
                  .filter(function(d){ 
                    if(Colortype === 'continuous'){ // Early return
                      return d[colorSel] >= Colorbounds[0] &&  d[colorSel] <= Colorbounds[1]
                    }
                    return d[colorSel] === colGroup
                  })
}

/*  */
/* Change display as a function of allNames */
/*  */

if(allNames === "true"){

  colGroup_lab
  .filter(function(d){
    return Sizeincreasing === 'true' ? 
            d[selRank] <= nFirms : 
            d[selRank] >= nFirmsHigh
  })
  .attr('display', 'inline')


  colGroup_circ
  .filter(function(d){
    return Sizeincreasing === 'true' ? d[selRank] <= nFirms : d[selRank] >= nFirmsHigh
  })
  .attr('display', 'inline')

  all_circ
  .filter(function(d){
    const high = d3.select(this).attr('data-highlighted')
    return Sizeincreasing === 'true' ? 
            d[selRank] > nFirms && high === 'false' : 
            d[selRank] >= nFirmsHigh && high === 'false'
  })
  .attr('display', 'none')

  all_lab
  .filter(function(d){
    const high = d3.select(this).attr('data-highlighted')
    return Sizeincreasing === 'true' ? 
            d[selRank] > nFirms && high === 'false' : 
            d[selRank] >= nFirmsHigh && high === 'false'
  })
  .attr('display', 'none')
}

if(allNames === "false"){

  colGroup_circ
  .filter(function(d){
    return Sizeincreasing === 'true' ? 
            d[selRank] <= nFirms : 
            d[selRank] >= nFirmsHigh
  })
  .attr('display', 'inline')

    
  all_circ
  .filter(function(d){
    const high = d3.select(this).attr('data-highlighted')
    return Sizeincreasing === 'true' ? 
            d[selRank] > nFirms && high === 'false' : 
            d[selRank] > nFirmsHigh && high === 'false'
  })
  .attr('display', 'none')

  all_lab.attr('display', function(d){ if(d3.select(this).attr('data-highlighted') === 'false'){return 'none'} })

}

}