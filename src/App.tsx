import { useState } from 'react';
import './App.css';
import Attributes from './components/Attributes';


function App() {
  const [num, setNum] = useState<number>(0);
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        
        <h1>My D&D Character</h1>
        <Attributes />
        
      </section>
    </div>
  );
}

export default App;
