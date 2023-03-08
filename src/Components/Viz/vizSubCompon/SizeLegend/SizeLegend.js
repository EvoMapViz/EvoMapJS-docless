import { useRef, useEffect, useState } from "react";
import Draw from "./Draw.js"
import Update from "./Update.js"
import './SizeLegend.css'

import { data, sizeSel, metaData } from 'jotaiStore.js';
import { useAtom } from 'jotai'

export default function SizeLegend() {

  const ref = useRef()
  const didMountRef = useRef(false); // Used below to prevent Draw but not Update on initial render (https://stackoverflow.com/questions/53253940/make-react-useeffect-hook-not-run-on-initial-render)

  const [locData, ] = useAtom(data)
  const [locSizeSel,] = useAtom(sizeSel)
  const [locMeta,] = useAtom(metaData)

  const [width, setWidth] = useState(window.innerWidth); // https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/

/*  */
/* Initialize */
/*  */

useEffect(() => {
  const handleWindowResize = () => setWidth(window.innerWidth)
  window.addEventListener("resize", handleWindowResize);
  Draw(locData, locMeta,
        locSizeSel,
        ref.current,
        width)
   // Return a function from the effect that removes the event listener
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
            locSizeSel,
            ref.current,
            width)
    // Return a function from the effect that removes the event listener
    return () => window.removeEventListener("resize", handleWindowResize);
        }
  didMountRef.current = true
}, [locData, locSizeSel, width]) // [] implies code will run only once => similar to didMount


  return (
    <div
      ref={ref}
    />
  )
  
}

