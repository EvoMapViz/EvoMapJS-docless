import React, { useState } from 'react';
import * as d3 from "d3";
import Grid from "@mui/material/Grid";

import AtomSlider from 'Components/UI/AtomSlider';
import PlaySlider from 'Components/UI/PlaySlider';
import {MultiSelectAll} from 'Components/UI/MultiSelectAll';
import { MultiSelectAbrev } from 'Components/UI/MultiSelectAbrev.js';

import HighlightFirmSelector from './HighlightFirmSelector.js';

import ReactSelect from 'react-select';

import {Columns} from 'react-bulma-components';
import './Navbar.css';

import {useAtom} from 'jotai';
import {data, arrows, 
        valueSizes, allNames, showTimes, 
        nFirms, maxNfirms, Time, minTime, maxTime, metaData, sizeSel, colorSel, sizeSelLabel, colorSelLabel, colgroup,
        colorType, colorDomain, colorRange, colorBins, colorIncreasing, colorExtremes,
        sizeIncreasing, sizeExponent, sizeDomain, sizeRange, arrowsSel} 
        from 'jotaiStore.js';
import {interpolatePlasma} from "d3-scale-chromatic";

const NavbarArrow = () => {

    const [locData,] = useAtom(data)
    const [locArrows, ] = useAtom(arrows)
    const [locMeta, ] = useAtom(metaData)
    const [locmaxNfirms, ] = useAtom(maxNfirms)
    const [locminTime, ] = useAtom(minTime)
    const [locmaxTime, ] = useAtom(maxTime)
    const [, locSetColgroup] = useAtom(colgroup)
    
    const sizeOptions = locMeta
                        .filter(d =>  d.type === "continuous" && d.tooltip !== 'only')
                        .map(d => ({"value": d.name, "label": d.label}) )
                        .sort((a, b) => a.label.localeCompare(b.label))
    const defaultSizeOption = sizeOptions[0]
    
    const arrowOptions = locArrows
                            .filter(d => d.time === locminTime)
                            .map(d => ({"value": d.name, "label": d.name}) )
    const [selected, setSelected] = useState([]); // Select-all "local" state for multi-selection in arrow selector

    const [, locSetArrowSel] = useAtom(arrowsSel)

    const [, locSetSizeSel] = useAtom(sizeSel)
    const [, locSetSizeSelLabel] = useAtom(sizeSelLabel)
    
    const colorOptions = locMeta
                          .filter(d => d.tooltip !== 'only')
                          .map(d => ({"value": d.name, "label": d.label}) )
    const defaultColorOption = colorOptions[0]
    const [ ,locSetColorSel] = useAtom(colorSel)
    const [ ,locSetColorSelLabel] = useAtom(colorSelLabel)
    const [ ,locSetColortype] = useAtom(colorType)
    const [ ,locSetColorrange] = useAtom(colorRange)
    const [ ,locSetColorbins] = useAtom(colorBins)
    const [ ,locSetColordomain] = useAtom(colorDomain)
    const [ ,locSetColorincreasing] = useAtom(colorIncreasing)
    const [locColorExtremes, ] = useAtom(colorExtremes)

    const [, locSetSizeincreasing] = useAtom(sizeIncreasing)
    const [, locSetSizeexponent] = useAtom(sizeExponent)
    const [, locSetSizedomain] = useAtom(sizeDomain)
    const [, locSetSizerange] = useAtom(sizeRange)
    


const handleSizeChange = (event) => {
    let sizeSel = event.value

    locSetSizeSel(sizeSel) // Communicate the change to relevant jotai state
    locSetSizeSelLabel(event.label)

    const sizeSelMeta = locMeta.filter(d => d.name === sizeSel)

    var increasing = 'true'
    if(typeof sizeSelMeta[0].scale_increasing !== 'undefined'){increasing = sizeSelMeta[0].scale_increasing}
    locSetSizeincreasing(increasing)
    
    var size_exponent = 1
    if(typeof sizeSelMeta[0].scale_exponent !== 'undefined'){size_exponent = Number(sizeSelMeta[0].scale_exponent)}
    locSetSizeexponent(size_exponent)

    const size_domain = d3.extent(locData, d => d[sizeSel])
    locSetSizedomain(size_domain)

    var max_size = 50
    if(typeof sizeSelMeta[0].scale_maxSize !== 'undefined'){max_size = Number(sizeSelMeta[0].scale_maxSize)}
    var min_size = 1
    if(typeof sizeSelMeta[0].scale_minSize !== 'undefined'){min_size = Number(sizeSelMeta[0].scale_minSize)}
    const size_range = [min_size, max_size]
    locSetSizerange(size_range)
}

const handleColorChange = (event) => {
    // Needs to be manually synchronized with similar code in jotaiStore.js -> "Color Scales"

    const colorSel = event.value
    console.log('New ColorSel: ' + colorSel)

    locSetColorSel(colorSel) // Communicate the change to relevant jotai state
    locSetColorSelLabel(event.label)
    locSetColgroup('Show All')

    const colorSelMeta = locMeta.filter(d => d.name === colorSel)

    let selType = "discrete"
    if(typeof colorSelMeta[0].type !== 'undefined'){selType = colorSelMeta[0].type}
    
    let bins = []
    let domain = []
    let range = []

    if(selType === 'discrete'){
    domain = locData.sort((a, b) => d3.ascending(a[colorSel], b[colorSel])).map(d => d[colorSel])
    range = ["#3957ff", "#c9080a", "#fec7f8", "#0b7b3e", "#0bf0e9", "#c203c8", "#fd9b39", "#888593", "#906407", "#98ba7f", "#fe6794", "#10b0ff", "#ac7bff", "#fee7c0", "#964c63", "#1da49c", "#0ad811", "#bbd9fd", "#fe6cfe", "#297192", "#d1a09c", "#78579e", "#81ffad", "#739400", "#ca6949", "#d9bf01", "#646a58", "#d5097e", "#bb73a9", "#ccf6e9", "#9cb4b6", "#b6a7d4", "#9e8c62", "#6e83c8", "#01af64", "#a71afd", "#cfe589", "#d4ccd1", "#fd4109", "#bf8f0e", "#2f786e", "#4ed1a5", "#d8bb7d", "#a54509", "#6a9276", "#a4777a", "#fc12c9", "#606f15", "#3cc4d9", "#f31c4e", "#73616f", "#f097c6", "#fc8772", "#92a6fe", "#875b44", "#699ab3", "#94bc19", "#7d5bf0", "#d24dfe", "#c85b74", "#68ff57", "#b62347", "#994b91", "#646b8c", "#977ab4", "#d694fd", "#c4d5b5", "#fdc4bd", "#1cae05", "#7bd972", "#e9700a", "#d08f5d", "#8bb9e1", "#fde945", "#a29d98", "#1682fb", "#9ad9e0", "#d6cafe", "#8d8328", "#b091a7", "#647579", "#1f8d11", "#e7eafd", "#b9660b", "#a4a644", "#fec24c", "#b1168c", "#188cc1", "#7ab297", "#4468ae", "#c949a6", "#d48295", "#eb6dc2", "#d5b0cb", "#ff9ffb", "#fdb082", "#af4d44", "#a759c4", "#a9e03a", "#0d906b", "#9ee3bd", "#5b8846", "#0d8995", "#f25c58", "#70ae4f", "#847f74", "#9094bb", "#ffe2f1", "#a67149", "#936c8e", "#d04907", "#c3b8a6", "#cef8c4", "#7a9293", "#fda2ab", "#2ef6c5", "#807242", "#cb94cc", "#b6bdd0"]
    // https://stackoverflow.com/questions/20847161/how-can-i-generate-as-many-colors-as-i-want-using-d3
    // http://jnnnnn.github.io/category-colors-constrained.html
    }
    
    if(selType === 'continuous'){
        bins = [Math.round(d3.quantile(locData.map(d => d[colorSel]), 0.2)),
                Math.round(d3.quantile(locData.map(d => d[colorSel]), 0.4)),
                Math.round(d3.quantile(locData.map(d => d[colorSel]), 0.6)),
                Math.round(d3.quantile(locData.map(d => d[colorSel]), 0.8)),
                Math.round(d3.quantile(locData.map(d => d[colorSel]), 1))
                ]
    if(typeof colorSelMeta[0].color_bins !== 'undefined'){bins = colorSelMeta[0].color_bins} 

    domain = bins

    let colExtremes = locColorExtremes
    let arr = [...Array(bins.length + 1).keys()] 
    arr = arr.map(d => colExtremes[0] + (d*(1/(arr[arr.length - 1])))*(colExtremes[1]-colExtremes[0]) ) //
    range = arr.map(d => interpolatePlasma(d))

    var increasing = 'true'
    if(typeof colorSelMeta[0].scale_increasing !== 'undefined'){increasing = colorSelMeta[0].scale_increasing}
    locSetColorincreasing(increasing)
    }

    if(increasing === 'false'){
        range.reverse()
    }

    locSetColortype(selType)
    locSetColorrange(range)
    locSetColorbins(bins)
    locSetColordomain(domain)
}

const handleArrowChange = (event) => { // `event` is and arrow containing the value of each selected option as a string
    locSetArrowSel(event.map(d => d.value))
}

// Display options

const displayOptions = [
    { value: "valueSizes", label: "Adaptive display" },
    { value: "allNames", label: "Show all names" },
    { value: "showTimes", label: "Time labels" }
  ];

const displayDefault = [displayOptions[0], displayOptions[2]]

// Selector styles

const cust_style = {  
    control: base => ({ // https://stackoverflow.com/questions/73939936/react-select-how-to-change-the-font-size-on-on-the-dropdown-menu
        ...base,
        cursor: 'pointer'
      }), 
    menu: base => ({
    ...base,
    cursor: 'pointer'
    }),
    menuPortal: base => ({
        ...base,
        cursor: 'pointer'
    }),
    option: (styles) => ({ // https://github.com/JedWatson/react-select/issues/3831
        ...styles,
        cursor: 'pointer',
      })
  };
    
    return (
        <div id = 'Navbar'>
            <Columns centered = {true} vCentered = {true}>
                {/* HIGHLIGHT + FACTOR Block */}
                <Columns.Column size = {4}>
                    <Columns centered = {true} vCentered = {true}>
                        {/* Highlight column */}
                        <Columns.Column size = {7}>
                        <HighlightFirmSelector></HighlightFirmSelector>
                        </Columns.Column>
                         {/* Factor column */}
                        <Columns.Column size = {5}>
                            <Grid container direction="column" alignItems="center" justifyContent="center">
                                <Grid item xs ={12}>
                                    <h4> Explaining factors </h4>
                                </Grid>
                                <Grid item xs ={12} style={{'width': '100%'}}>
                                <MultiSelectAll 
                                    options={arrowOptions} 
                                    value = {selected}
                                    onChange={[setSelected, handleArrowChange]} // setSelected updates "internal" atom that keeps track of "select all" interaction. Seconds function follows up and acts on state update for communication with rest of App 
                                    />
                                </Grid>
                            </Grid>
                        </Columns.Column>
                    </Columns>
                </Columns.Column>
                {/* DISPLAY OPTIONS Block */}
                <Columns.Column size = {2}>
                    <Grid container direction="column" alignItems="center" justifyContent="center">
                        <Grid item xs ={12}>
                            <h4> Display options </h4>
                        </Grid>
                        <Grid item xs ={12} style={{'width': '100%'}}>
                        <MultiSelectAbrev
                            className="basic-single"
                            classNamePrefix="select"
                            name= "display"
                            options = {displayOptions}
                            defaultValue = {displayDefault}
                            atoms = {{'valueSizes' : valueSizes, 'allNames' : allNames, 'showTimes': showTimes}}
                        />
                        </Grid>
                    </Grid>
                </Columns.Column>
                {/* SIZE + COLOR BLOCK */}
                <Columns.Column size = {3}>
                    <Columns centered = {true} vCentered = {true}>
                        {/* Size column */}
                        <Columns.Column size = {6}>
                            <Grid container direction="column" alignItems="center" justifyContent="center">
                                <Grid item xs ={12}>
                                    <h4> Size </h4>
                                </Grid>
                                <Grid item xs ={12} style={{'width': '100%'}}>
                                    <ReactSelect
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={defaultSizeOption}
                                        name="size"
                                        options = {sizeOptions}
                                        onChange={handleSizeChange}
                                        styles = {cust_style}
                                        components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }} //https://stackoverflow.com/questions/54961077/react-select-is-there-a-way-to-remove-the-button-on-the-right-that-expand-the-l
                                    />
                                </Grid>
                            </Grid>
                        </Columns.Column>
                        {/* Color column */}
                        <Columns.Column size = {6}>
                            <Grid container direction="column" alignItems="center" justifyContent="center">
                                <Grid item xs ={12}>
                                    <h4> Color </h4>
                                </Grid>
                                <Grid item xs ={12} style={{'width': '100%'}}>
                                    <ReactSelect
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={defaultColorOption}
                                        name="color"
                                        options = {colorOptions}
                                        onChange={handleColorChange}
                                        styles = {cust_style}
                                        components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }} //https://stackoverflow.com/questions/54961077/react-select-is-there-a-way-to-remove-the-button-on-the-right-that-expand-the-l
                                    />
                                </Grid>
                            </Grid>
                        </Columns.Column>
                    </Columns>
                </Columns.Column>
                {/* SHOW TOP N + YEAR Block */}
                <Columns.Column column size = {3}>
                    <Columns centered = {true} vCentered = {true}>
                        {/* Show top N column */}
                        <Columns.Column size = {5}>
                            <Grid container direction="column" alignItems="center" justifyContent="center">
                                <Grid item xs ={12}>
                                    <h4> Show top N </h4>
                                </Grid>
                                <Grid item xs ={12}>
                                    <AtomSlider min={0} max ={locmaxNfirms} default={100} width={100} atom={nFirms}/>
                                </Grid>
                            </Grid>
                        </Columns.Column>
                        {/* Time column */}
                        <Columns.Column size = {7}>
                            <Grid container direction="column" alignItems="center" justifyContent="center">
                                <Grid item xs ={12}>
                                    <h4> Time </h4>
                                </Grid>
                                <Grid item xs ={12}>
                                    <PlaySlider min={locminTime} max ={locmaxTime} delay={700} width={100} atom ={Time}/>
                                </Grid>
                            </Grid>
                        </Columns.Column>
                    </Columns>
                </Columns.Column>
            </Columns>
            
        </div>
    )
}

export default NavbarArrow