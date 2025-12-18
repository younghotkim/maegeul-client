import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// React.StrctMode
// 최신 React 패턴을 준수하도록 돕고, 
// 잠재적인 버그나 비효율적인 코드 사용을 조기에 발견
// 추후 StrictMode 지우기! <React.Fragment><App/></React.Fragment>
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
