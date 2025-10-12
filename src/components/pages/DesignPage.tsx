import { StrikeWeightDesign } from '../design/strike-weight/StrikeWeightDesign';
import { MainLayout } from '../MainLayout';
import { Settings2 } from 'lucide-react';
import { Tabs, TabsContent, TabsTrigger } from '../app-ui/tabs';
import { TabsList } from '../app-ui/tabs';
import { useTranslation } from '@/hooks/use-translation';
import { FrontWeightDesign } from '../design/front-weight/FrontWeightDesign';
import { StrikeWeightRatioDesign } from '../design/strike-weight-ratio/StrikeWeightRatioDesign';
import { TouchWeightPreview } from '../design/TouchWeightPreview';
import { useAnalyzedKeyboard } from '@/hooks/keyboard/use-analyzed-keyboard';
import { useDesignedKeyboard } from '@/hooks/keyboard/use-designed-keyboard';
import { useMemo } from 'react';

export const DesignPage = () => {
  const requiredDataPercentage = 0.8;
  const { t } = useTranslation();

  const analyzedKeyboard = useAnalyzedKeyboard();
  const designedKeyboard = useDesignedKeyboard(analyzedKeyboard);

  const isDesignCompleted = useMemo(() => {
    return (
      designedKeyboard
        .mapToArray((key) => key.payload.downWeight)
        .filter((v) => v !== undefined && v !== null).length >=
      Math.round(designedKeyboard.size * requiredDataPercentage)
    );
  }, [designedKeyboard, requiredDataPercentage]);

  return (
    <MainLayout pageTitle={t('Design')} pageIcon={<Settings2 />}>
      <Tabs defaultValue="front-weight">
        <TabsList className="mb-5">
          <TabsTrigger value="front-weight">{t('Front Weight')}</TabsTrigger>
          <TabsTrigger value="strike-weight">{t('Strike Weight')}</TabsTrigger>
          <TabsTrigger value="strike-weight-ratio">
            {t('Strike Weight Ratio')}
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!isDesignCompleted}>
            {t('Touch Weight preview')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="front-weight">
          <FrontWeightDesign
            analyzedKeyboard={analyzedKeyboard}
            requiredDataPercentage={requiredDataPercentage}
            notEnoughDataErrorTitle={t('Not enough data')}
            notEnoughDataErrorDescription={t(
              'Not enough data to generate a front weight design.',
            )}
          />
        </TabsContent>
        <TabsContent value="strike-weight">
          <StrikeWeightDesign
            analyzedKeyboard={analyzedKeyboard}
            notEnoughDataErrorTitle={t('Not enough data')}
            notEnoughDataErrorDescription={t(
              'Not enough data to generate a strike weight design.',
            )}
            requiredDataPercentage={requiredDataPercentage}
          />
        </TabsContent>
        <TabsContent value="strike-weight-ratio">
          <StrikeWeightRatioDesign
            analyzedKeyboard={analyzedKeyboard}
            notEnoughDataErrorTitle={t('Not enough data')}
            notEnoughDataErrorDescription={t(
              'Not enough data to generate a strike weight ratio design.',
            )}
            requiredDataPercentage={requiredDataPercentage}
          />
        </TabsContent>
        <TabsContent value="preview">
          <TouchWeightPreview designedKeyboard={designedKeyboard} />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};
