import './Asset/scss/App.scss';
import { PikaButton } from './Component/Button/PikaButton';
import { PikaTextField } from './Component/TextField/PikaTextField';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PikaButton title="ASDDD" style="primaryPika"/>
        <PikaTextField label="Email" placeholder="Enter Email" type="email"/>
      </header>
    </div>
  );
}

export default App;
