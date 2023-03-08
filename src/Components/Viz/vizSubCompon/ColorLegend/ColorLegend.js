import { useRef, useEffect, useState } from "react";
import Draw from "./Draw.js"
import Update from "./Update.js"
import './ColorLegend.css'

import { data, colgroup, Time, metaData, colorSel, colorType, colorRange, colorBins, colorDomain, colorIncreasing } from 'jotaiStore.js';
import { useAtom } from 'jotai'

export default function ColorLegend() {

  const ref = useRef()
  const didMountRef = useRef(false); // Used below to prevent Draw but not Update on initial render (https://stackoverflow.com/questions/53253940/make-react-useeffect-hook-not-run-on-initial-render)

  const [locData, ] = useAtom(data)
  const [locTime, ] = useAtom(Time)
  const [, locSetColgroup] = useAtom(colgroup)
  const [locColorSel,] = useAtom(colorSel)
  const [locColortype,] = useAtom(colorType)
  const [locColorrange,] = useAtom(colorRange)
  const [locColorbins,] = useAtom(colorBins)
  const [locColordomain,] = useAtom(colorDomain)
  const [locColorincreasing,] = useAtom(colorIncreasing)
  const [locMeta,] = useAtom(metaData)

  const [width, setWidth] = useState(window.innerWidth); // https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/


/*  */
/* Initialize */
/*  */

useEffect(() => {
  const handleWindowResize = () => setWidth(window.innerWidth)
  window.addEventListener("resize", handleWindowResize);
  Draw(locData, locMeta,
        locColorSel,
        locColortype,locColorrange, locColorbins, locColordomain, locColorincreasing,
        locSetColgroup,
        ref.current,
        width)
  return () => window.removeEventListener("resize", handleWindowResize);
}, []) // [] implies code will run only once => similar to didMount

/*  */
/* Updates */
/*  */

useEffect(() => {
  if(didMountRef.current){
    const handleWindowResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleWindowResize);
    Update(locData, locMeta,
            locTime,
            locColorSel,
            locColortype,locColorrange, locColorbins, locColordomain, locColorincreasing,
            locSetColgroup,
            ref.current,
            width)
    return () => window.removeEventListener("resize", handleWindowResize);
        }
  didMountRef.current = true
}, [locData,locColorSel, width]) // [] implies code will run only once => similar to didMount


  return (
    <div
      ref={ref}
    />
  )
  
}

