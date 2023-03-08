import React, {useRef, useState } from "react"; //https://stackoverflow.com/questions/66983676/control-the-material-ui-slider-with-a-play-and-stop-buttons-in-react-js

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

import {Level, Columns} from 'react-bulma-components';
import "./Slider.css";

import {useAtom} from 'jotai';

export default function AtomSlider(props) {

  const smin = props.min
  const smax = props.max 
  const locdefault = props.default
  const [value, setValue] = useAtom(props.atom);

  const handleChange = (event) => {
    setValue(event.target.value)
  };

  return (
    <Columns>
        <Columns.Column narrow = {true}> 
            <Box display="flex" justifyContent="center" alignItems="center">
                <div style ={{width: props.width}}>
                    <Slider 
                    value={value} 
                    valueLabelDisplay="auto"
                    defaultValue={locdefault}
                    min={smin}
                    max = {smax}
                    step={1}
                    onChange={handleChange} />
                </div>
            </Box>
        </Columns.Column>
    </Columns>
  );
}
