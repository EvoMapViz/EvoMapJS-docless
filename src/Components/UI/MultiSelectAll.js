import React, { useRef } from "react";
import ReactSelect from "react-select";

export const MultiSelectAll = props => { // https://stackoverflow.com/questions/52001629/select-all-unselect-all-option-in-react-select
  // isOptionSelected sees previous props.value after onChange
  const valueRef = useRef(props.value);
  valueRef.current = props.value;

  const selectAllOption = {
    value: "<SELECT_ALL>",
    label: "All items"
  };

  const isSelectAllSelected = () =>
    valueRef.current.length === props.options.length;

  const isOptionSelected = option =>
    valueRef.current.some(({ value }) => value === option.value) ||
    isSelectAllSelected();

  const getOptions = () => [selectAllOption, ...props.options];

  const getValue = () =>
    isSelectAllSelected() ? [selectAllOption] : props.value;

  const onChange = (newValue, actionMeta) => {
    const { action, option, removedValue } = actionMeta;

    // Update "internal" state that keeps track of "select all" interactions
    if (action === "select-option" && option.value === selectAllOption.value) {
      props.onChange[0](props.options, actionMeta);
      props.onChange[1](props.options, actionMeta);
    } else if (
      (action === "deselect-option" &&
        option.value === selectAllOption.value) ||
      (action === "remove-value" &&
        removedValue.value === selectAllOption.value)
    ) {
      props.onChange[0]([], actionMeta);
      props.onChange[1]([], actionMeta);
    } else if (
      actionMeta.action === "deselect-option" &&
      isSelectAllSelected()
    ) {
      props.onChange[0](
        props.options.filter(({ value }) => value !== option.value),
        actionMeta
      );
      props.onChange[1](
        props.options.filter(({ value }) => value !== option.value),
        actionMeta
      );
    } else {
      props.onChange[0](newValue || [], actionMeta);
      props.onChange[1](newValue || [], actionMeta);
    }
  };

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

  return (
    <ReactSelect
      isOptionSelected={isOptionSelected}
      options={getOptions()}
      value={getValue()}
      onChange={onChange}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      isMulti
      styles={cust_style}
      components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }} //https://stackoverflow.com/questions/54961077/react-select-is-there-a-way-to-remove-the-button-on-the-right-that-expand-the-l
    />
  );
};