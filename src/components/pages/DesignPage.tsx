import { StrikeWeightDesign } from '../design/strike-weight/StrikeWeightDesign';
import { MainLayout } from '../MainLayout';
import { Settings2 } from 'lucide-react';
import { Tabs, TabsContent, TabsTrigger } from '../app-ui/tabs';
import { TabsList } from '../app-ui/tabs';
import { useTranslation } from '@/hooks/use-translation';
import { FrontWeightDesign } from '../design/front-weight/FrontWeightDesign';
import { StrikeWeightRatioDesign } from '../design/strike-weight-ratio/StrikeWeightRatioDesign';

export const DesignPage = () => {
  const requiredDataPercentage = 0.8;
  const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('Design')} pageIcon={<Settings2 />}>
      <Tabs defaultValue="front-weight">
        <TabsList className="mb-5">
          <TabsTrigger value="front-weight">{t('Front Weight')}</TabsTrigger>
          <TabsTrigger value="strike-weight">{t('Strike Weight')}</TabsTrigger>
          <TabsTrigger value="strike-weight-ratio">
            {t('Strike Weight Ratio')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="front-weight">
          <FrontWeightDesign
            requiredDataPercentage={requiredDataPercentage}
            notEnoughDataErrorTitle={t('Not enough data')}
            notEnoughDataErrorDescription={t(
              'Not enough data to generate a front weight design.',
            )}
          />
        </TabsContent>
        <TabsContent value="strike-weight">
          <StrikeWeightDesign
            requiredDataPercentage={requiredDataPercentage}
            notEnoughDataErrorTitle={t('Not enough data')}
            notEnoughDataErrorDescription={t(
              'Not enough data to generate a strike weight design.',
            )}
          />
        </TabsContent>
        <TabsContent value="strike-weight-ratio">
          <StrikeWeightRatioDesign
            requiredDataPercentage={requiredDataPercentage}
            notEnoughDataErrorTitle={t('Not enough data')}
            notEnoughDataErrorDescription={t(
              'Not enough data to generate a strike weight ratio design.',
            )}
          />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};
