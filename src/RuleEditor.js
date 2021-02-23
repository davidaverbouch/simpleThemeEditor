import { useState, useEffect } from "react";
import './App.css';
import {
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

// units for sizes
const allUnits = ["px", "em", "rem", "vh", "vw"];

function RuleEditor(props) {
    // state of open editor
    const [open, setOpen] = useState(false);
    // value (with variables)
    const [value, setValue] = useState('');
    // value to display (without variables)
    const [valueToDisplay, setValueToDisplay] = useState('');
    // unit if sizes
    const [unit, setUnit] = useState(allUnits.indexOf(props.unit));
    // errors
    const [error, setError] = useState(false);

    // when receive proprerties
    useEffect(() => {
        let v = props.values[props.type][props.keyName];
        setValue(v);
        setValueToDisplay(getValueInVariable(v));
    }, [props]);

    // when value change
    useEffect(() => {
        let val = value;
        if (value !== '') val = getValueInVariable(value);
        setValueToDisplay(val);
    }, [value]);

    // change state of editor opening to open
    const openEditor = () => {
        setOpen(true);
    };

    // change state of editor opening to close
    const closeEditor = () => {
        setOpen(false);
    };

    // change state of unit
    const changeUnit = (event) => {
        setUnit(event.target.value);
        props.onChange(props.idChild, allUnits[event.target.value], 'unit');
    };

    // change value
    const changeValue = (event) => {
        if (isColorType()) {
            let isValidColor = true;
            isValidColor = isColor(event.target.value);
            if (isValidColor) {
                setValue(event.target.value);
                setError(false);
            } else setError(true);
        }
        if (isSizeType()) {
            let isValidSize = true;
            isValidSize = isSize(event.target.value + allUnits[unit]);
            if (isFunctionSize(event.target.value)) isValidSize = true;
            setValue(event.target.value);
            if (isValidSize) setError(false);
            else setError(true);
        } else setValue(event.target.value);

        props.onChange([props.type, props.keyName], event.target.value, 'value');
    };

    // find value of a variable
    const getValueInVariable = (str) => {
        let regEx = new RegExp(/\{(.*?)\}/g);
        if (regEx.test(str)) {
            return str.replace(/\{(.*?)\}/g, function (x) {
                x = x.replace('{', '').replace('}', '');
                let variables = x.split('.');
                variables[0] = variables[0].replace(/(.*?)\{/g, '');
                variables[1] = variables[1].replace(/\}(.*?)/g, '');
                let u = null;
                props.rules.map((o, i) => {
                    o.values.map((rule, idx) => {
                        if (rule.type === variables[0] && rule.keyName === variables[1] && rule.unit)
                            u = rule.unit;
                    });
                });
                if (variables.length === 2) {
                    let ret = props.values[variables[0]] && (props.values[variables[0]][variables[1]] + ((u) ? u : ''));
                    return ret;
                }
                else return str
            });
        } else return str;
    };

    // test if it's a color
    const isColor = (strColor) => {
        let str = getValueInVariable(strColor);
        const s = new Option().style;
        s.color = str;
        return s.color !== '';
    };

    // test if it's a function to calculate size
    const isFunctionSize = (size) => {
        let regExp = new RegExp(/^calc\([0-9.]*[-+*\/][0-9.]*\)$/g);
        return regExp.test(size);
    }

    // test if it's a size
    const isSize = (size) => {
        let str = getValueInVariable(size);
        const s = new Option().style;
        s.fontSize = str;
        return s.fontSize !== '';
    };

    // test if it's a color's type
    const isColorType = () => {
        return (props.type === 'colors' || props.keyName.toLowerCase().indexOf('color') > -1 || props.keyName.toLowerCase().indexOf('background') > -1)
    };

    // tes if it's a size's type
    const isSizeType = () => {
        return (props.type === 'sizes' || props.keyName.toLowerCase().indexOf('size') > -1)
    };

    return (
        <div className="RuleEditorWrapper">
            { !open &&
                <div className="RuleEditor" onClick={openEditor}>
                    <Typography style={{ flex: 2, display: 'flex', alignItems: 'center' }}>
                        {props.rule} {isSizeType() && <span>({allUnits[unit]})</span>} : {!error && valueToDisplay} {error && <span className="Error"> Error !</span>} {isColorType() && isColor(valueToDisplay) && <span style={{ display: 'inline-block', marginLeft: '8px', border: '1px solid black', background: valueToDisplay, width: '14px', height: '14px', borderRadius: '4px' }}></span>}
                    </Typography>
                    <Typography style={{ flex: 1 }}>
                        {props.type}.{props.keyName}
                    </Typography>
                </div>
            }
            { open &&
                <div className="RuleEditorOpened">
                    <div className="RuleEditorResume">
                        <Typography style={{ flex: 2 }}>
                            {props.rule} {isSizeType() && <span>({allUnits[unit]})</span>} : {!error && valueToDisplay} {error && <span className="Error"> Error !</span>} {isColorType() && isColor(valueToDisplay) && <span style={{ display: 'inline-block', marginLeft: '8px', border: '1px solid black', background: valueToDisplay, width: '14px', height: '14px', borderRadius: '4px' }}></span>}
                        </Typography>
                        <Typography style={{ flex: 1 }}>
                            {props.type}.{props.keyName}
                        </Typography>
                        <Typography onClick={closeEditor} style={{ position: 'absolute', right: '8px', top: '4px' }}><CloseIcon /></Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField error={error} style={{ flex: 5 }} autoFocus margin="dense" value={value} onChange={changeValue} label="Value" type="text" fullWidth />
                        {isSizeType() &&
                            <FormControl style={{ marginLeft: '8px', flex: 1 }}>
                                <InputLabel id="unit">Unit</InputLabel>
                                <Select labelId="unit" value={unit} onChange={changeUnit} >
                                    {allUnits.map((o, i) => <MenuItem value={i}>{o}</MenuItem>)}
                                </Select>
                            </FormControl>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default RuleEditor;
