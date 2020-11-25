import AceEditor from 'react-ace';
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export default class Editor extends Component {
  render() {
    return (
      <div>
        <DropdownButton id="dropdown-basic-button" title="Dropdown button">
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </DropdownButton>
        <AceEditor mode="javascript" theme="monokai" />
      </div>
    );
  }
}
