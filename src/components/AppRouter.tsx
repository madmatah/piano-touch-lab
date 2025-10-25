import { Routes, Route } from 'react-router-dom';
import { Homepage } from './pages/Homepage';
import { HelpPage } from './pages/HelpPage';
import { MeasurePage } from './pages/MeasuresPage';
import { AnalyzeTouchWeightPage } from './pages/analyze/AnalyzeTouchWeightPage';
import { AnalyzeFrontWeightPage } from './pages/analyze/AnalyzeFrontWeightPage';
import { AnalyzeStrikeWeightPage } from './pages/analyze/AnalyzeStrikeWeightPage';
import { AnalyzeWippenSupportSpringPage } from './pages/analyze/AnalyzeWippenSupportSpringPage';
import { AnalyzeStrikeWeightRatioPage } from './pages/analyze/AnalyzeStrikeWeightRatioPage';
import { DesignWippenSupportSpringsPage } from './pages/design/DesignWippenSupportSpringsPage';
import { DesignFrontWeightPage } from './pages/design/DesignFrontWeightPage';
import { DesignStrikeWeightPage } from './pages/design/DesignStrikeWeightPage';
import { DesignStrikeWeightRatioPage } from './pages/design/DesignStrikeWeightRatioPage';
import { DesignTouchWeightPreviewPage } from './pages/design/DesignTouchWeightPreviewPage';
import { DesignAdjustmentSheetPage } from './pages/design/DesignAdjustmentSheetPage';
import { AnalyzeDataSheetPage } from './pages/analyze/AnalyzeDatasheetPage';
import { PianoPage } from './pages/PianoPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" Component={Homepage} />
      <Route path="/analyze/data-sheet" Component={AnalyzeDataSheetPage} />
      <Route path="/analyze/front-weight" Component={AnalyzeFrontWeightPage} />
      <Route path="/analyze/touch-weight" Component={AnalyzeTouchWeightPage} />
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
      <Route path="/design/front-weight" Component={DesignFrontWeightPage} />
      <Route path="/design/strike-weight" Component={DesignStrikeWeightPage} />
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
  );
};
