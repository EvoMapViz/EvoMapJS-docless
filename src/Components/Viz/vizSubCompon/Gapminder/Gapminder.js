import { useRef, useEffect, useContext } from "react";
import * as d3 from 'd3';
import Draw from "./Draw.js"
import UpdateTime from "./UpdateTime.js";
import UpdateCircleClick from "./UpdateCircleClick.js";
import UpdateHighlightSel from "./UpdateHighlightSel.js";
import UpdateAllnames from "./UpdateAllnames.js";
import UpdateN from "./UpdateN.js";
import UpdateAdaptiveSizes from "./UpdateAdaptiveSizes.js";
import UpdateSizeSel from "./UpdateSizeSel.js";
import UpdateColorSel from "./UpdateColorSel.js";
import UpdateArrows from "./UpdateArrows.js";
import UpdateColgroupDiscrete from "./UpdateColgroupDiscrete.js";
import UpdateColgroupContinuous from "./UpdateColgroupContinuous.js";
import UpdateZoom from "./UpdateZoom.js"
import clearSVG from "./utils/clearSVG";

import "./Gapminder.css"

import { data, metaData,
         Width, Height, Margin,
         xDomain, yDomain, xRange, yRange,
         allFirms, allNames, maxNfirms, minTime, nTimes,
         valueSizes, Time, nFirms, sizeSel, colorSel, colgroup, arrowsSel,
         transD3, 
         justClicked, justSelHigh, 
         colorType, colorDomain, colorRange, colorBins, colorIncreasing, colorBounds, 
         sizeIncreasing, sizeUnit, sizeExponent, sizeDomain, sizeRange,
         fontExponent, fontDomain, fontRange,
         opacityExponent, opacityDomain, opacityRange, Share, 
         arrows, isArrows} from 'jotaiStore.js';
import { useAtom } from 'jotai'

export default function Gapminder() {

  const ref = useRef()
  const didMountRef = useRef(false); // Used below to prevent Draw but not Update on initial render (https://stackoverflow.com/questions/53253940/make-react-useeffect-hook-not-run-on-initial-render)


  const [locData, locSetData ] = useAtom(data)
  const [locMeta, ] = useAtom(metaData)
  const [locArrows, ] = useAtom(arrows)
  const [locIsArrows, ] = useAtom(isArrows)

  const [locShare, ] = useAtom(Share)
  const [locWidth, ] = useAtom(Width)
  const [locHeight, ] = useAtom(Height)
  const [locMargin, ] = useAtom(Margin)

  const [locXDomain, ] = useAtom(xDomain)
  const [locYDomain, ] = useAtom(yDomain)
  const [locXRange, ] = useAtom(xRange)
  const [locYRange, ] = useAtom(yRange)

  const [locTime, ] = useAtom(Time)
  const [locColgroup,] = useAtom(colgroup)

  const [locColorSel,] = useAtom(colorSel)
  const [locColortype,] = useAtom(colorType)
  const [locColorrange,] = useAtom(colorRange)
  const [locColorbins,] = useAtom(colorBins)
  const [locColordomain,] = useAtom(colorDomain)
  const [locColorincreasing,] = useAtom(colorIncreasing)
  const [locColorbounds, locSetColorbounds] = useAtom(colorBounds)

  const [locSizeSel,] = useAtom(sizeSel)
  const [locSizeIncreasing,] = useAtom(sizeIncreasing)
  const [locSizeUnit, ] = useAtom(sizeUnit)
  const [locSizeExponent, ] = useAtom(sizeExponent)
  const [locSizeDomain, ] = useAtom(sizeDomain)
  const [locSizeRange, ] = useAtom(sizeRange)

  const [locArrowSel, ] = useAtom(arrowsSel)

  const [locFontExponent, ] = useAtom(fontExponent)
  const [locFontDomain, ] = useAtom(fontDomain)
  const [locFontRange, ] = useAtom(fontRange)

  const [locOpacityExponent, ] = useAtom(opacityExponent)
  const [locOpacityDomain, ] = useAtom(opacityDomain)
  const [locOpacityRange, ] = useAtom(opacityRange)

  const [locValueSizes,] = useAtom(valueSizes)
  const [locAllNames,] = useAtom(allNames)
  const [locAllFirms,] = useAtom(allFirms)
  const [locMaxnfirms,] = useAtom(maxNfirms)
  const [locMintime,] = useAtom(minTime)
  const [locNTimes,] = useAtom(nTimes)
  const [locNfirms,] = useAtom(nFirms)
  const [locTransD3, locSetTransD3 ] = useAtom(transD3)
  const [locJustClicked, locSetJustClicked] = useAtom(justClicked)
  const [locJustSelHigh, locSetJustSelHigh] = useAtom(justSelHigh)


  const varType = locMeta
                      .filter(d => d.name === locColorSel)
                      .map(d => d.type)
  
/*  */
/* Initialize */
/*  */

useEffect(() => {
  Draw(locData, locMeta, locArrows, locIsArrows,
        locWidth, locHeight, locMargin, locShare,
        locXDomain, locYDomain, locXRange, locYRange,
        locAllFirms, locAllNames,locMaxnfirms, locMintime,
        locColortype,locColorrange, locColorbins, locColordomain, locColorincreasing,
        locSizeUnit, locSizeExponent, locSizeDomain, locSizeRange, locSizeIncreasing,
        locFontExponent, locFontDomain, locFontRange,
        locOpacityExponent, locOpacityDomain, locOpacityRange,
        locValueSizes, locTime, locNfirms,
        locSizeSel, locColorSel, 
        locSetTransD3, locSetJustClicked, locSetData,
        ref.current)
}, []) // [] implies code will run only once => similar to didMount

/*  */
/* Updates */
/*  */

/* Zoom */

useEffect(() => {
  if (didMountRef.current){ // Prevents run on initial render
    return UpdateZoom(locData,
                      locWidth, locHeight,
                      locXDomain, locYDomain, locXRange, locYRange,
                      locSizeExponent, locSizeRange, locSizeDomain, locSizeIncreasing,
                      locFontRange, locFontDomain, locFontExponent, 
                      locOpacityRange, locOpacityDomain, locOpacityExponent,
                      locValueSizes, locSizeSel,
                      locTransD3, locSetTransD3,
                      locIsArrows)}  
}, [locValueSizes, locSizeSel, locTime])

/* Main circle/label animation */

useEffect(() => {
  if (didMountRef.current){ // Prevents run on initial render 
    return UpdateTime(locData, locArrows, locIsArrows,
                             locXDomain, locYDomain, locXRange, locYRange,
                             locTime, locValueSizes, locSizeSel, locColorSel,
                             locSizeExponent, locSizeRange, locSizeDomain, locSizeIncreasing,
                             locFontRange, locFontDomain, locFontExponent, 
                             locOpacityRange, locOpacityDomain, locOpacityExponent,
                             locColortype,locColorrange, locColorbins, locColordomain, 
                             locTransD3)} 
}, [locData, locTime, locAllFirms]) // [] contains states which, upon change, will trigger execution of Update function

/* Size selector */

useEffect(() => {
  if (didMountRef.current){ // Prevents run on initial render 
    return UpdateSizeSel(locXDomain, locYDomain, locXRange, locYRange,
                         locSizeExponent, locSizeRange, locSizeDomain, locSizeIncreasing,
                         locFontRange, locFontDomain, locFontExponent, 
                         locOpacityRange, locOpacityDomain, locOpacityExponent,
                         locValueSizes, locSizeSel,
                         locTransD3)} 
}, [locSizeSel])

/* Color selector */

useEffect(() => {
  if (didMountRef.current){ // Prevents run on initial render
    return UpdateColorSel(locData, locMeta,
                          locColorSel,
                          locColortype,locColorrange, locColordomain, locColorincreasing, 
                          locSizeIncreasing,
                          locSetJustClicked, locAllNames,
                          locSizeSel, locTime, opacityRange, opacityDomain, opacityExponent // For use in clearSVG
                          )} 
}, [locColorSel])

/* Show all names */

useEffect(() => {
  if (didMountRef.current){  // Prevents run on initial render 
    return UpdateAllnames(locAllNames,
                          locColorSel, locSetJustClicked, locData, locSizeSel, locTime, opacityRange, opacityDomain, opacityExponent // For use in updating clearSVG click event
                          )} 
}, [locAllNames, locSizeSel])

/* Max. number of firms N */

useEffect(() => {
  if (didMountRef.current){  // Prevents run on initial render 
    return UpdateN(locAllNames, locMaxnfirms,
                   locSizeIncreasing, locNfirms, locColgroup, locSetJustClicked,
                   locData, locSizeSel, locColorSel, locTime,
                   locColortype, locColorbounds,
                   opacityRange, opacityDomain, opacityExponent // For use in clearSVG
                   )} 
}, [locNfirms, locSizeSel])

/* Value Sizes */

useEffect(() => {
  if (didMountRef.current){ // Prevents run on initial render
    return UpdateAdaptiveSizes(locXDomain, locYDomain, locXRange, locYRange,
                              locSizeExponent, locSizeRange, locSizeDomain, locSizeIncreasing,
                              locFontRange, locFontDomain, locFontExponent, 
                              locOpacityRange, locOpacityDomain, locOpacityExponent,
                              locValueSizes, locSizeSel,
                              locTransD3)}  
}, [locValueSizes])

/* Colgroup */

  useEffect(() => {
    if (didMountRef.current){                                       // Prevents run on initial render 
      if (varType[0] === "discrete"){
        return UpdateColgroupDiscrete(locColgroup, locNfirms, locSizeSel, locColorSel, locAllNames,
                                      locSizeIncreasing, locMaxnfirms) } 
      if (varType[0] === "continuous"){
        return UpdateColgroupContinuous(locColgroup, locNfirms, locAllNames, locSizeSel, locColorSel, locColorbins, locSetColorbounds,
                                       locSizeIncreasing, locMaxnfirms) }
    }
  }, [locColgroup])

/* Highlights (includes all circle-click related events) */

// From Viz

useEffect(() => {
  if (didMountRef.current){  // Prevents run on initial render 
    const zoom_group = d3.select('.zoom_group_g')
    // if (zoom_group.attr('data-high-count') !== '0'){ // Go through highlight routine only if last click was NOT dehighlight of last highlighted 
      return UpdateCircleClick(locData, locTime, locJustClicked,
                              locXDomain, locYDomain, locXRange, locYRange,
                              locSizeExponent, locSizeRange, locSizeDomain, locSizeIncreasing,
                              locOpacityRange, locOpacityDomain, locOpacityExponent, 
                              locValueSizes, locSizeSel, locAllNames, locNfirms, locNTimes,
                              locTransD3)
                            // } 
    }
}, [locJustClicked])

// From Selector

useEffect(() => {
  if (didMountRef.current){ // Prevents run on initial render 
    const zoom_group = d3.select('.zoom_group_g')
    if (zoom_group.attr('data-high-count') !== '0'){ // Go through highlight routine only if last click was NOT dehighlight of last highlighted 
      return UpdateHighlightSel(locData, locJustSelHigh, 
                                locXDomain, locYDomain, locXRange, locYRange,
                                locSizeExponent, locSizeRange, locSizeDomain, locSizeIncreasing,
                                locOpacityRange, // To set highlight intensity as upper bound of range
                                locValueSizes, locSizeSel,locAllNames, locNfirms, locNTimes,
                                locTransD3)} 
    if (zoom_group.attr('data-high-count') === '0'){
      clearSVG(zoom_group, allNames,
               locData, locSizeSel, locTime,
               opacityRange, opacityDomain, opacityExponent)
    }
  
  }
  didMountRef.current = true; // Allows running update functions on future renders 
}, [locJustSelHigh])

/* Explainer arrows */

useEffect(() => {
  if (didMountRef.current && isArrows){ // didMountRef.current prevents run on initial render
    return UpdateArrows(locArrowSel)}  
}, [locArrowSel])

/* Return DIV element */

  return (
    <div
      ref={ref}
    />
  )
}

