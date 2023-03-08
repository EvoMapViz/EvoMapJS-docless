import React, {useState, Component } from 'react';

import './bulma.min.css';
import {Box, Columns} from 'react-bulma-components';
import './App.css';

import Viz from 'Components/Viz/Viz' // Absolute path import from src allowed through jsconfig.json in root (https://create-react-app.dev/docs/importing-a-component/, https://stackoverflow.com/questions/45213279/how-to-avoid-using-relative-path-imports-redux-action-action1-in-cre)
import NavbarArrow from 'Components/Navbar/NavbarArrow'
import NavbarNoArrow from 'Components/Navbar/NavbarNoArrow'

import { isArrows} from 'jotaiStore.js';
import { useAtom } from 'jotai'

const App = () => {

  const [locIsArrows,] = useAtom(isArrows)

  return (
    <div className="box">
    <div className="row header">
      <Columns>
        <Columns.Column size ={12}>
          {locIsArrows ? <NavbarArrow/> : <NavbarNoArrow/>}
        </Columns.Column>
      </Columns>
    </div>
    <div className="row content">
      <Viz/>
    </div>
  </div>
  );
}

export default App;
