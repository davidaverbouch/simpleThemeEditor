import { useState, useEffect } from "react";
import './App.css';
import {
  Typography,
  Collapse,
  Button
} from '@material-ui/core';

import RuleEditor from './RuleEditor'

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

// json model
let rules = [
  {
    title: 'General colors',
    values: [
      { key: 0, rule: "Primary font color", type: "colors", keyName: "primary" },
      { key: 1, rule: "Primary background color", type: "colors", keyName: "primaryBackground" },
      { key: 2, rule: "Secondary font color", type: "colors", keyName: "secondary" },
      { key: 3, rule: "Secondary background color", type: "colors", keyName: "secondaryBackground" },
      { key: 4, rule: "Highlight on primary background", type: "colors", keyName: "highlight1" },
      { key: 5, rule: "Highlight on secondary background", type: "colors", keyName: "highlight2" }
    ]
  },
  {
    title: 'Global sizes',
    values: [
      { key: 0, rule: "Default text size", type: "sizes", keyName: "text", unit: "em" },
      { key: 1, rule: "Header1 text size", type: "sizes", keyName: "h1", unit: "em" },
      { key: 2, rule: "Header2 text size", type: "sizes", keyName: "h2", unit: "em" },
      { key: 3, rule: "Default border width", type: "sizes", keyName: "borderWidth", unit: "px" }
    ]
  },
  {
    title: 'Text field',
    values: [
      { key: 0, rule: "Text size", type: "textfield", keyName: "textSize", unit: "em" },
      { key: 1, rule: "Font color", type: "textfield", keyName: "color" },
      { key: 2, rule: "Border", type: "textfield", keyName: "border" },
      { key: 3, rule: "Background", type: "textfield", keyName: "background" }
    ]
  },
  {
    title: 'Buttons',
    values: [
      { key: 0, rule: "Font size", type: "buttons", keyName: "fontSize", unit: "em" },
      { key: 1, rule: "Font color", type: "buttons", keyName: "color" },
      { key: 3, rule: "Background", type: "buttons", keyName: "background" }
    ]
  }
];

// initial values
let keysValues = {
  colors: {
    primary: '#000',
    primaryBackground: '#fff',
    secondary: '#fff',
    secondaryBackground: '#4a86e8',
    highlight1: '#4a86e8',
    highlight2: '#ffab40'
  },
  sizes: {
    text: 1.1,
    h1: 1.4,
    h2: 1.2,
    borderWidth: 1
  },
  textfield: {
    textSize: 1.1,
    color: '#000',
    border: '1px solid #000',
    background: '#fff'
  },
  buttons: {
    fontSize: 'calc(1.1*1.2)',
    color: '#000',
    background: '#4a86e8'
  }
}

function App(props) {
  // extract localStorage
  let lStorage = JSON.parse(localStorage.getItem('simpleThemeEditor'));
  let cT;
  if (lStorage) {
    rules = lStorage.rules;
    keysValues = lStorage.values;
  }
  // All rules
  const [allRules, setAllRules] = useState(rules);
  // All values
  const [allValues, setAllValues] = useState(keysValues);
  // collapsing state
  const [open, setOpen] = useState([true]);
  // Hack to know if a value of collapsing changes
  const [openCollapseIndex, setOpenCollapseIndex] = useState();
  // hack to force reload car rules and values donc re render cause they keep structure
  const [forceReload, setForceReload] = useState(true);

  // function to toggle collapsing state
  const handleClick = (index) => {
    let oldValOpening = open;
    oldValOpening[index] = !open[index];
    setOpen(oldValOpening);
    setOpenCollapseIndex(index);
  };

  // hack to handle changes in collapse opening state, 
  // cause array don't change, only value change
  useEffect(() => {
    setOpenCollapseIndex(null);
  }, [openCollapseIndex]);

  // init values of collapsing header
  useEffect(() => {
    let initOpen = allRules.map((o, i) => true);
    setOpen(initOpen);
  }, [allRules]);

  // on changes of child
  const onChildChange = (idChild, propsChild, type) => {
    if (type === 'unit') {
      let r = rules;
      r[idChild[0]].values[idChild[1]].unit = propsChild;
      setAllRules(r);
    } else {
      let v = allValues;
      v[idChild[0]][idChild[1]] = propsChild;
      setAllValues(v);
    }
    setForceReload(!forceReload);
    clearTimeout(cT);
    cT = setTimeout(saveOnLocalStorage, 300);
  };

  // function to store in local storage
  const saveOnLocalStorage = () => {
    let STE = {
      rules: allRules,
      values: allValues
    }
    window.localStorage.setItem('simpleThemeEditor', JSON.stringify(STE));
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography>Simple Theme editor</Typography>
      </header>

      <div className="Content">
        {
          allRules.map((obj, i) => {
            let collapseVal = open[i];
            return (
              <div key={(2 * i) + '_wrapper'} className="RulesSetBlock">
                <Typography key={(2 * i)} onClick={() => handleClick(i)} style={{ cursor: 'pointer', alignItems: 'center', display: 'flex' }}>
                  {collapseVal ? <ExpandLess /> : <ExpandMore />} {obj.title}
                </Typography>
                <div key={'collapseWrapper_' + i} className="CollapseRulesWrapper">
                  <Collapse key={'collapse_' + i} in={collapseVal} timeout="auto" unmountOnExit>
                    {
                      obj.values && obj.values.map((valRule, idx) => {
                        return (
                          <>
                            <RuleEditor key={idx} idChild={[i, idx]} onChange={onChildChange} rules={allRules} values={allValues} {...valRule} />
                          </>
                        )
                      })
                    }
                  </Collapse>
                </div>
              </div>
            );
          })
        }
        <Button onClick={saveOnLocalStorage} style={{ padding: '.5em 2em', textTransform: 'capitalize' }} variant="contained" color="primary" >Save</Button>
      </div>
    </div>
  );
}

export default App;
