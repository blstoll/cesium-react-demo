import React from 'react';
import { render } from 'react-dom';

import 'cesium/Source/Widgets/widgets.css';
import App from './components/App';

import './style.scss';

render(<App/>, document.getElementById('app'));