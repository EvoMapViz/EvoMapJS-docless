import { useRef, useEffect, useState } from "react";
import * as d3 from 'd3';
import Draw from "./Draw.js"
import Update from "./Update.js"
import './LegendTitle.css'

export default function LegendTitle(props) {

const ref = useRef()
const didMountRef = useRef(false); // Used below to prevent Draw but not Update on initial render (https://stackoverflow.com/questions/53253940/make-react-useeffect-hook-not-run-on-initial-render)
const [width, setWidth] = useState(window.innerWidth); // https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/


useEffect(() => {
  const handleWindowResize = () => setWidth(window.innerWidth)
  window.addEventListener("resize", handleWindowResize);
  Draw(props.varHeader, props.varLabel, props.instance, ref.current, width)
  return () => window.removeEventListener("resize", handleWindowResize);
}, []) // [] implies code will run only once => similar to didMount

useEffect(() => {
  if(didMountRef.current){
    const handleWindowResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handleWindowResize);
    Update(props.varHeader, props.varLabel, props.instance, width)
    return () => window.removeEventListener("resize", handleWindowResize);
  }
  didMountRef.current = true
}) // [] implies code will run only once => similar to didMount

  return (
    <div
      ref={ref}
    />
  )
  
}

