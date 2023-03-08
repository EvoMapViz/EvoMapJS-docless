import React, { useRef } from "react";
import ReactSelect from "react-select";
import abbreviate from "utils/abbreviate";
import { useAtom } from "jotai";
import {display} from 'jotaiStore.js';

export const MultiSelectAbrev = props => {

  // 
  // Selector style
  // 

  const cust_style = {    // https://codesandbox.io/s/10r714wp0l?file=/src/index.js:282-447 
    control: base => ({ // https://stackoverflow.com/questions/73939936/react-select-how-to-change-the-font-size-on-on-the-dropdown-menu
      ...base,
      fontSize: '13px',
      cursor: 'pointer'
    }),
    menu: base => ({
      ...base,
      fontSize: '13px',
      cursor: 'pointer'
    }),
    menuPortal: base => ({
        ...base,
        fontSize: '13px',
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

  // 
  // Creates differences between labels in menu and as selected values displayed in the selector
  // 

  function MultiValueLabel({ //https://stackoverflow.com/questions/68678071/react-select-abreviate-dropdown-names-on-multi-select
    data,
    innerProps,
    selectProps
  }) {

    let acronym = ''

    if(data.value === 'valueSizes') acronym = 'Adapt'
    if(data.value === 'allNames') acronym = 'Names'
    if(data.value === 'showTimes') acronym = 'Yr labs'
    
    return (
      <div {...innerProps}>
        {acronym}
      </div>
    )
  }

  // 
  // States
  // 

  const [, locSetAllNames] = useAtom(props.atoms['allNames'])
  const [, locSetShowTimes] = useAtom(props.atoms['showTimes'])
  const [, locSetValueSizes] = useAtom(props.atoms['valueSizes'])
  const [locDisplay, locSetDisplay] = useAtom(display)

  // 
  // Handle change
  // 

  const handleChange = (newDisp) => {
    
    newDisp = newDisp.map(d => d.value)

    if(newDisp.length > locDisplay.length){ // Option(s?) added

      const new_item = newDisp.filter(item => !locDisplay.includes(item))

      if(new_item[0] === 'valueSizes') locSetValueSizes('true')
      if(new_item[0] === 'allNames') locSetAllNames('true')
      if(new_item[0] === 'showTimes') locSetShowTimes('true')
    }

    if(newDisp.length < locDisplay.length){ // Option(s) removed

      const removed_item = locDisplay.filter(item => !newDisp.includes(item))

      if(removed_item[0] === 'valueSizes') locSetValueSizes('false')
      if(removed_item[0] === 'allNames') locSetAllNames('false')
      if(removed_item[0] === 'showTimes') locSetShowTimes('false')
    }

    locSetDisplay(newDisp)
  }


  return (
    <ReactSelect
      isMulti
      name = {props.name}
      options = {props.options}  
      className= {props.className}
      classNamePrefix= {props.classNamePrefix}
      defaultValue = {props.defaultValue}
      // controlShouldRenderValue={false} //https://stackoverflow.com/questions/66232149/hiding-multi-selected-options-react-select
      onChange={handleChange}
      styles={cust_style}
      hideSelectedOptions={false}
      components = {{MultiValueLabel,    //https://stackoverflow.com/questions/68678071/react-select-abreviate-dropdown-names-on-multi-select
                    DropdownIndicator:() => null, //https://stackoverflow.com/questions/54961077/react-select-is-there-a-way-to-remove-the-button-on-the-right-that-expand-the-l
                    IndicatorSeparator:() => null }} 
    />
  );
};