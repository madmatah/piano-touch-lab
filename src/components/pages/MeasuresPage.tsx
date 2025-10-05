import { MainLayout } from '../MainLayout';
import { Scale } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../app-ui/tabs';
import { MeasureTab } from '../measures/MeasureTab';
import { MeasureOptionsTab } from '../measures/MeasureOptionsTab';

export const MeasurePage = () => {
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Measure')} pageIcon={<Scale />}>
      <Tabs defaultValue="measures">
        <TabsList className="mb-5">
          <TabsTrigger value="measures">{t('Measures')}</TabsTrigger>
          <TabsTrigger value="options">{t('Options')}</TabsTrigger>
        </TabsList>
        <TabsContent value="measures">
          <MeasureTab />
        </TabsContent>
        <TabsContent value="options">
          <MeasureOptionsTab />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};
