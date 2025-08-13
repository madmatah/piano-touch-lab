import './index.css';

import { Provider } from 'inversify-react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Homepage } from './components/pages/Homepage';
import { HelpPage } from './components/pages/HelpPage';
import { MeasuresPage } from './components/pages/MeasuresPage';
import { BackupPage } from './components/pages/BackupPage';
import { DesignPage } from './components/pages/DesignPage';

import { container } from './app-container';

export function App() {
  return (
    <Provider container={container}>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Homepage} />
          <Route path="/backup" Component={BackupPage} />
          <Route path="/design" Component={DesignPage} />
          <Route path="/help" Component={HelpPage} />
          <Route path="/measures" Component={MeasuresPage} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
