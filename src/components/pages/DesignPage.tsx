import { StrikeWeightDesign } from '../design/strike-weight/StrikeWeightDesign';
import { MainLayout } from '../MainLayout';
import { Settings2 } from 'lucide-react';
import { Tabs, TabsContent, TabsTrigger } from '../app-ui/tabs';
import { TabsList } from '../app-ui/tabs';

export const DesignPage = () => {
  const requiredDataPercentage = 0.8;

  return (
    <MainLayout pageTitle="Design" pageIcon={<Settings2 />}>
      <Tabs defaultValue="strike-weight">
        <TabsList className="mb-5">
          <TabsTrigger value="strike-weight">Strike Weight</TabsTrigger>
        </TabsList>
        <TabsContent value="strike-weight">
          <StrikeWeightDesign
            requiredDataPercentage={requiredDataPercentage}
            notEnoughDataErrorTitle="Not enough data"
            notEnoughDataErrorDescription="Not enough data to generate a strike weight design."
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};
