import React from 'react';
import ReactDOM from 'react-dom';
import VideoApp from './VideoApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<VideoApp />, div);
});