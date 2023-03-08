import * as d3 from 'd3';

export default function UpdateAllnames(allNames,
                                       colorSel, setJustClicked, data, sizeSel, time, OpacityRange, OpacityDomain, OpacityExponent
                                       ){

console.log("All Names Update")

const svg = d3.select(".svg-content-responsive")

/*  */
/* Update names*/
/*  */

let visible_svg = svg.selectAll('.circle-firm')
                 .filter(function(d){return  d3.select(this).attr('display') === 'inline'})

let visible = visible_svg['_groups'][0].map(d => d['__data__'].name)

let f_lab = svg.selectAll('.firmLabel')

if(allNames === 'true'){
  f_lab
  .filter(d => visible.includes(d.name))
  .attr('display', 'inline')
}

if(allNames === 'false'){
  f_lab
  .filter(function(d){ return d3.select(this).attr('data-highlighted') === 'false'})
  .attr('display', 'none')
}

}