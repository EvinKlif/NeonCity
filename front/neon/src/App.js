import React, { useState } from "react";
import PagesScroll from './components/PagesScroll';

const App = () => {
  const [globalName, setGlobalName] = useState(null);
  window.focus();
  return (
    <div>
      <PagesScroll GN={setGlobalName} globalName={globalName}/>
    </div>
  );
};

export default App;
