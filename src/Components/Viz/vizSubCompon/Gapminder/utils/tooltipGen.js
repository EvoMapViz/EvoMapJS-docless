import abbreviate from 'abbreviate';
import truncate from './truncate';

export default function tooltipGen(name, varList, width_c2)
{

let string = "<div class = 'tool_head'>" + abbreviate(name, {length:20, keepSeparators: true}) + "</div>" +
'<div class="grid-container">'

varList.map(function(d){

    if(d.type === 'continuous'){

        let unit = ''
        if(typeof d.unit !== 'undefined'){unit = ' ' + d.unit}
        let decimals = 0
        if(typeof d.decimals !== 'undefined'){decimals = d.decimals}
        let truncate_label = 9
        if(typeof d.truncate_label !== 'undefined'){truncate_label = d.truncate_label}

        console.log(truncate(d.label, truncate_label))

        string = string + '<div class="grid-item">' + 
        truncate(d.label, truncate_label) +
        // abbreviate(d.label, {length: truncate_label, keepSeparators: true}) + 
        '</div>'
        string = string + '<div class="grid-item" style = "max-width:' + width_c2 + Math.round(d.value*Math.pow(10,decimals)) + unit + '</div>'
    }

    if(d.type === 'discrete'){

        let truncate_value = 6
        if(typeof d.truncate_value !== 'undefined'){truncate_value = d.truncate_value}
        let truncate_label = 9
        if(typeof d.truncate_label !== 'undefined'){truncate_label = d.truncate_label}

        string = string + '<div class="grid-item">' + 
        //abbreviate(d.label, {length: truncate_label, keepSeparators: true, strict: false}) +
        // abbreviate(d.label, {length: truncate_label}) +
        // abbreviate(d.label, 5) +
        truncate(d.label, truncate_label) +
        '</div>'
        string = string + '<div class="grid-item" style = "max-width:' + width_c2 + 
        //abbreviate(d.value.toString(), {length: truncate_value, keepSeparators: true, strict: false}) +
        // abbreviate(d.value.toString(), {length: truncate_value}) +
        // abbreviate(d.value.toString(), 5) +
        truncate(d.value, truncate_value) +
         '</div>'
    }
})

string = string + '</div>' // this is the closing div to '<div class="grid-container">'

    return string
};