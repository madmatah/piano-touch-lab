import { StrikeWeightDesign } from '../design/strike-weight/StrikeWeightDesign';
import { MainLayout } from '../MainLayout';
import { Settings2 } from 'lucide-react';
import { Tabs, TabsContent, TabsTrigger } from '../app-ui/tabs';
import { TabsList } from '../app-ui/tabs';
import { useTranslation } from '@/hooks/use-translation';

export const DesignPage = () => {
  const requiredDataPercentage = 0.8;
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Design')} pageIcon={<Settings2 />}>
      <Tabs defaultValue="strike-weight">
        <TabsList className="mb-5">
          <TabsTrigger value="strike-weight">{t('Strike Weight')}</TabsTrigger>
        </TabsList>
        <TabsContent value="strike-weight">
          <StrikeWeightDesign
            requiredDataPercentage={requiredDataPercentage}
            notEnoughDataErrorTitle={t('Not enough data')}
            notEnoughDataErrorDescription={t(
              'Not enough data to generate a strike weight design.',
            )}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};
