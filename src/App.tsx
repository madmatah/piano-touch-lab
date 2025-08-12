import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Homepage } from './components/pages/Homepage';
import { HelpPage } from './components/pages/HelpPage';
import { MeasuresPage } from './components/pages/MeasuresPage';
import { BackupPage } from './components/pages/BackupPage';
import { DesignPage } from './components/pages/DesignPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Homepage} />
        <Route path="/backup" Component={BackupPage} />
        <Route path="/design" Component={DesignPage} />
        <Route path="/help" Component={HelpPage} />
        <Route path="/measures" Component={MeasuresPage} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
