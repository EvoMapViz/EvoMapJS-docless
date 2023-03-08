import React, { useLayoutEffect, useRef, useState } from "react"; //https://stackoverflow.com/questions/66983676/control-the-material-ui-slider-with-a-play-and-stop-buttons-in-react-js

import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StopIcon from "@mui/icons-material/Stop";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import {useAtom} from 'jotai';

import {Level, Columns} from 'react-bulma-components';
import "./Slider.css";

export default function AtomSlider(props) { //https://stackoverflow.com/questions/66983676/control-the-material-ui-slider-with-a-play-and-stop-buttons-in-react-js

  const smin = props.min
  const smax = props.max 
  const [value, setValue] = useAtom(props.atom);
  const [isRunning, setIsRunning] = useState(false);
  const directionRef = useRef("back");
  const intervalIdRef = useRef(0);

  const handleChange = (event) => {
    if(event.target.value !== value){ // Otherwise, state change triggered on every "continuous" mouse move, including those that do *not* pass discrete change threshold
      setValue(event.target.value);
    }
  };

  const handlePlay = () => {
    directionRef.current = "forward";
    let localv = value
    if(localv < smax){!isRunning ? setIsRunning(true) : setIsRunning((r) => !r)}
  };

  useLayoutEffect(() => {
    let localv = value
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        if (directionRef.current === "forward" && localv <= smax) {
          localv = ++localv;
          setValue((v) => ++v);
          if(localv === smax){setIsRunning(false)}
        }
      }, props.delay);
    }

    return () => {
      return clearInterval(intervalIdRef.current);
    };
  }, [isRunning]);

  return (
    <Columns gap = {'2 rem'}>
        <Columns.Column narrow = {true}>
            <Level>
                <Level.Item>
                    <IconButton size={'small'} onClick={handlePlay}>
                    {isRunning ? <PauseIcon />  : <PlayIcon /> } {/* https://stackoverflow.com/questions/58257228/how-to-switch-materialui-icon-when-clicked */}
                    </IconButton>
                </Level.Item>
            </Level>
        </Columns.Column>
        <Columns.Column narrow = {true}> 
                <div style ={{width: props.width}}>
                    <Slider 
                    value={value} 
                    valueLabelDisplay="auto"
                    defaultValue={smin}
                    min={smin}
                    max = {smax}
                    step={1}
                    onChange={handleChange} />
                </div>
        </Columns.Column>
    </Columns>
  );
}
