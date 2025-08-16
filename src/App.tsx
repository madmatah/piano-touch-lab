import './index.css';

import { Provider } from 'inversify-react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Homepage } from './components/pages/Homepage';
import { HelpPage } from './components/pages/HelpPage';
import { MeasurePage } from './components/pages/MeasuresPage';
import { BackupPage } from './components/pages/BackupPage';
import { DesignPage } from './components/pages/DesignPage';

import { container } from './app-container';
import { AnalyzePage } from './components/pages/AnalyzePage';

export function App() {
  return (
    <Provider container={container}>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Homepage} />
          <Route path="/analyze" Component={AnalyzePage} />
          <Route path="/backup" Component={BackupPage} />
          <Route path="/design" Component={DesignPage} />
          <Route path="/help" Component={HelpPage} />
          <Route path="/measure" Component={MeasurePage} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
