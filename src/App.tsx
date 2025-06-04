import React from 'react';
import AutoComplete from './components/AutoComplete';

import './App.css';

const App: React.FC = () => {
  return (
    <>
      <span className='version'>v0.0.1</span>
      <div className='container'>
        <AutoComplete />
      </div>
    </>
  );
};

export default App;
