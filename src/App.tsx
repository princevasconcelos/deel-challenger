import React from 'react';
import AutoComplete from './components/AutoComplete';

import './App.css';

const App: React.FC = () => {
  const handleSelect = (country: any) => {
    console.log('Selected Country:', country);
  };

  return (
    <div className='container'>
      <AutoComplete onSelect={handleSelect} />
    </div>
  );
};

export default App;
