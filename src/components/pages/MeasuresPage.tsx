import { MainLayout } from '../MainLayout';
import { PageHeading } from '../layout/PageHeading';
import { PianoIdentity } from '../layout/PianoIdentity';
import { SavedLocallyIndicator } from '../layout/SavedLocallyIndicator';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../app-ui/tabs';
import { MeasureTab } from '../measures/MeasureTab';
import { MeasureOptionsTab } from '../measures/MeasureOptionsTab';

export const MeasurePage = () => {
  const { t } = useTranslation();

  return (
    <MainLayout
      headerRight={
        <>
          <PianoIdentity />
          <SavedLocallyIndicator />
        </>
      }
    >
      <Tabs defaultValue="measures" className="flex flex-col gap-6">
        <PageHeading
          eyebrow={t('Step {{number}}', { number: '01' })}
          title={t('Measure')}
          actions={
            <TabsList>
              <TabsTrigger value="measures">{t('Measures')}</TabsTrigger>
              <TabsTrigger value="options">{t('Options')}</TabsTrigger>
            </TabsList>
          }
        />
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
