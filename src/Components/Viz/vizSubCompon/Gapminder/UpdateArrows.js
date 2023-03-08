import * as d3 from 'd3';

export default function UpdateArrows(Arrows){

console.log("Arrow Update") 

const explainers = d3.select('.zoom_group_g')
                     .selectAll('.explainer')
            
explainers
    .filter(function(){return Arrows.includes(d3.select(this).attr("data-name"))})
    .attr("visibility", "visible")           

explainers
    .filter(function(){return !Arrows.includes(d3.select(this).attr("data-name"))})
    .attr("visibility", "hidden")  

}