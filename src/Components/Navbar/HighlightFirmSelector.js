import React, { Component, useState, useEffect, useLayoutEffect, useRef } from 'react';
import * as d3 from 'd3';
import ReactSelect from 'react-select';
import Grid from "@mui/material/Grid";
import abbreviate from 'abbreviate';

import {useAtom} from 'jotai'
import { allFirms, justClicked, justSelHigh } from 'jotaiStore';

const HighlightFirmSelector = () => {

const didMountRef = useRef(false); // Used below to prevent some effects from running on initial render (https://stackoverflow.com/questions/53253940/make-react-useeffect-hook-not-run-on-initial-render)

/*  */
/* Initialize elements */
/*  */

    const [locAllFirms, ] = useAtom(allFirms)
    const [locJustClicked, ] = useAtom(justClicked)
    const[, locSetJustSelHigh] = useAtom(justSelHigh)

    const firmOptions = locAllFirms.map(d => ({value: d, label: d}) )

/*  */
/* Elements update and reactivity */
/*  */

/* Highlight firm selector */

const [selected, setSelected] = useState([]); // Tieing selector to state
const outsideClick = useRef(false); // Records whether state changes came from outside click (i.e., click inside the viz)

const handleHighlightChange = (event) => {

    const zoom_group = d3.select('.zoom_group_g')

    if(!outsideClick.current){  // If does not originate from click (i.e., originates from inside selection)
       // Keep track of highlight count
       var cur_count = parseInt(zoom_group.attr('data-high-count'))
       // Communicate the change to relevant jotai state
       var diff = event.length - selected.length
       if(diff > 0){ // Last change was addition
        locSetJustSelHigh(['high', event[event.length - 1].value])
        zoom_group.attr('data-high-count', cur_count + diff)
       }
       if(diff < 0){ // Last change was removal
        console.log('Just removed')
        let old_names = event.map(d => d.value)
        let sel_names = selected.map(d => d.value)
        locSetJustSelHigh(['dehigh', sel_names.filter(d => !old_names.includes(d))])
        zoom_group.attr('data-high-count', cur_count + diff)
       }
       // Apply to selector
       setSelected(event)
    } else {                    // If originates from click
        if(locJustClicked[0] === 'high'){       // if click was a highilight
            if(selected.length === 0){    // No firm already selected
                setSelected([{value:locJustClicked[1], label:locJustClicked[1]}])
            } else {                                        // some firms already selected
                setSelected([...selected, {value:locJustClicked[1], label:locJustClicked[1]}]) // !! Anything like setSelected(selected) or let sel = selected, sel.push(...), setSelected(sel) is NOT identified by React as a state change to be taken into account in next re-rendre. The reason is "React evaluates state changes by checking its shallow equality (or reference equality), which checks to see if both the preview and new value for state reference the same object. In our example, we updated one of the properties of the user object, but we technically made setUser the same object reference, and thus, React didn’t perceive any change in its state." see https://blog.logrocket.com/how-when-to-force-react-component-re-render/ 
            }  
        }  
        if(locJustClicked[0] === 'dehigh'){     // if click was a *de*-highlight
                    setSelected(selected.filter(d => d.value !== locJustClicked[1]))
            }   
        if(locJustClicked[0] === 'background'){ // if click was background clear
                setSelected([])
        }                                   
    }
    outsideClick.current = false
  };

// Match click selection inside visualization

  useEffect(() => {
    if(didMountRef.current){ // Prevents effect from running on initial render
    outsideClick.current = true
    handleHighlightChange()
    }   
    didMountRef.current = true // Allows effect to run on future render
  }, [locJustClicked])


// Selector style

const cust_style = {    // https://codesandbox.io/s/10r714wp0l?file=/src/index.js:282-447 
    control: base => ({ // https://stackoverflow.com/questions/73939936/react-select-how-to-change-the-font-size-on-on-the-dropdown-menu
      ...base,
      fontSize: '13px',
      cursor: 'pointer'
    }),
    menu: base => ({
      ...base,
      fontSize: '10px',
      cursor: 'pointer'
    }),
    menuPortal: base => ({
        ...base,
        fontSize: '10px',
        cursor: 'pointer'
    }),
    option: (provided, state) => ({ // https://github.com/JedWatson/react-select/issues/3831
        ...provided,
        cursor: 'pointer',
        // color: 'black',
        backgroundColor: state.isSelected ? '#2584ff' : 'inherit',
        '&:hover': { backgroundColor: state.isSelected ? '#2584ff' : 'rgb(222, 235, 255)' } // https://stackoverflow.com/questions/69893553/unable-to-change-selected-option-background-color-react-select
      }),
  };

  function MultiValueLabel({ //https://stackoverflow.com/questions/68678071/react-select-abreviate-dropdown-names-on-multi-select
    data,
    innerProps,
    selectProps
  }) {

    const acronym = abbreviate(data.value.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}), // Copilot: in string "str", make every letter lower case except for the first letter of each word which is upper case
                               {length: 8})

    return (
      <div {...innerProps}>
        {acronym}
      </div>
    )
  }

/*  */
/* Return component */
/*  */

    return (
        <div id = 'highlight_selector'>
                <Grid container direction="column" alignItems="center" justifyContent="center">
                    <Grid item xs ={12}>
                        <h4> Highlight </h4>
                    </Grid>
                    <Grid item xs ={12} style={{'width': '100%'}}>
                        <ReactSelect
                            isMulti
                            name = "highlight"
                            options = {firmOptions}  
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value= {selected}
                            onChange={handleHighlightChange}
                            styles={cust_style}
                            hideSelectedOptions={false}
                            components = {{MultiValueLabel,    //https://stackoverflow.com/questions/68678071/react-select-abreviate-dropdown-names-on-multi-select
                                            DropdownIndicator:() => null, //https://stackoverflow.com/questions/54961077/react-select-is-there-a-way-to-remove-the-button-on-the-right-that-expand-the-l
                                            IndicatorSeparator:() => null }} 
                        />
                    </Grid>
                </Grid>
        </div>
    )
}

export default HighlightFirmSelector