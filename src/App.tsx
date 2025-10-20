import './index.css';

import { Provider } from 'inversify-react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Homepage } from './components/pages/Homepage';
import { HelpPage } from './components/pages/HelpPage';
import { MeasurePage } from './components/pages/MeasuresPage';

import { container } from './app-container';
import { KeyboardProvider } from './contexts/keyboard-context';
import { Toaster } from './components/ui/sonner';
import { AnalyzeTouchWeightPage } from './components/pages/analyze/AnalyzeTouchWeightPage';
import { AnalyzeFrontWeightPage } from './components/pages/analyze/AnalyzeFrontWeightPage';
import { AnalyzeStrikeWeightPage } from './components/pages/analyze/AnalyzeStrikeWeightPage';
import { AnalyzeWippenSupportSpringPage } from './components/pages/analyze/AnalyzeWippenSupportSpringPage';
import { AnalyzeStrikeWeightRatioPage } from './components/pages/analyze/AnalyzeStrikeWeightRatioPage';
import { DesignWippenSupportSpringsPage } from './components/pages/design/DesignWippenSupportSpringsPage';
import { DesignFrontWeightPage } from './components/pages/design/DesignFrontWeightPage';
import { DesignStrikeWeightPage } from './components/pages/design/DesignStrikeWeightPage';
import { DesignStrikeWeightRatioPage } from './components/pages/design/DesignStrikeWeightRatioPage';
import { DesignTouchWeightPreviewPage } from './components/pages/design/DesignTouchWeightPreviewPage';
import { DesignAdjustmentSheetPage } from './components/pages/design/DesignAdjustmentSheetPage';
import { AnalyzeDataSheetPage } from './components/pages/analyze/AnalyzeDatasheetPage';
import { PianoPage } from './components/pages/PianoPage';

export function App() {
  return (
    <Provider container={container}>
      <KeyboardProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={Homepage} />
            <Route
              path="/analyze/data-sheet"
              Component={AnalyzeDataSheetPage}
            />
            <Route
              path="/analyze/front-weight"
              Component={AnalyzeFrontWeightPage}
            />
            <Route
              path="/analyze/touch-weight"
              Component={AnalyzeTouchWeightPage}
            />
            <Route
              path="/analyze/strike-weight"
              Component={AnalyzeStrikeWeightPage}
            />
            <Route
              path="/analyze/strike-weight-ratio"
              Component={AnalyzeStrikeWeightRatioPage}
            />
            <Route
              path="/analyze/wippen-support-springs"
              Component={AnalyzeWippenSupportSpringPage}
            />
            <Route
              path="/design/wippen-support-springs"
              Component={DesignWippenSupportSpringsPage}
            />
            <Route
              path="/design/front-weight"
              Component={DesignFrontWeightPage}
            />
            <Route
              path="/design/strike-weight"
              Component={DesignStrikeWeightPage}
            />
            <Route
              path="/design/strike-weight-ratio"
              Component={DesignStrikeWeightRatioPage}
            />
            <Route
              path="/design/touch-weight-preview"
              Component={DesignTouchWeightPreviewPage}
            />
            <Route
              path="/design/adjustment-sheet"
              Component={DesignAdjustmentSheetPage}
            />
            <Route path="/help" Component={HelpPage} />
            <Route path="/measure" Component={MeasurePage} />
            <Route path="/piano" Component={PianoPage} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </KeyboardProvider>
    </Provider>
  );
}

export default App;
