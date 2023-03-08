import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAtom } from 'jotai'
import './TFCheckbox.css'

function TFCheckbox(props) {

    const [contState, setcontState] = useAtom(props.atom)
    const [label,] = useState(props.label)

    return( 
            <FormControlLabel
            control={<Checkbox
                defaultChecked = {props.default}
                value = {contState}
                onChange={e => (
                    e.target.checked ? setcontState('true') : setcontState('false') 
                )}
            />}
            label = {label}
        />
    )
}

export default TFCheckbox;