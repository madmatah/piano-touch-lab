import { useAutoloadDemoData } from '@/hooks/demo/use-autoload-demo-data';
import { MainLayout } from '../MainLayout';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  FileSpreadsheet,
  Github,
  Scale,
  Goal,
  Info,
  HandHeart,
} from 'lucide-react';
import { SupportSpring } from '../../assets/icons/SupportSpring';
import { FeatureCard } from '@/components/FeatureCard';

export const Homepage = () => {
  const { t } = useTranslation();
  useAutoloadDemoData();

  return (
    <MainLayout shouldDisplayDemoCard={false}>
      <section className="py-8 md:py-10">
        <div className="container">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="mx-auto max-w-5xl text-balance text-4xl font-semibold md:text-6xl bg-gradient-to-r from-gray-800 via-purple-600 to-gray-800 text-transparent bg-clip-text">
              {t('Piano Touch Lab')}
            </h1>
            <p className="mx-auto max-w-3xl text-muted-foreground md:text-xl">
              {t('A toolkit for grand piano action balancing')}
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="pt-8 pb-10">
        <div className="container">
          <h2 className="mb-7 text-center text-3xl font-bold tracking-tight">
            {t('Key features')}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Scale />}
              title={t('Visual Analysis')}
              description={t(
                'Enter your measurements, explore your touch weight profile and other charts to quickly identify irregularities in your piano action.',
              )}
              to="/analyze/touch-weight"
            />

            <FeatureCard
              icon={<LineChart />}
              title={t('Interactive modeling')}
              description={t(
                'Adjust settings in interactive graphs, discover how they affect the touch weight and gradually build your ideal keyboard!',
              )}
              to="/analyze/front-weight"
            />

            <FeatureCard
              icon={<Goal />}
              title={t('Balance Weight targeting')}
              description={t(
                'Achieve a specific, desired feel by setting a target Balance Weight. The system automatically generates the necessary Front Weight or Strike Weight values, providing you with a precise, actionable design blueprint.',
              )}
              to="/design/front-weight"
            />

            <FeatureCard
              icon={<SupportSpring className="w-6 h-6 mr-[-3px]" />}
              title={t('Wippen Support Spring')}
              description={t(
                'Integrated support for wippen assist springs, allowing you to directly incorporate their influence into your calculations. Achieve an accurate design while optimizing the required key weighting.',
              )}
              to="/design/wippen-support-springs"
            />

            <FeatureCard
              icon={<FileSpreadsheet />}
              title={t('Adjustment sheets')}
              description={t(
                'Convert your finalized design into a printable worksheet. This crucial sheet serves as a note-by-note checklist for required modifications, ready to be implemented directly in your shop.',
              )}
              to="/design/adjustment-sheet"
            />

            <FeatureCard
              icon={
                <div className="flex items-center gap-2">
                  <HandHeart />
                </div>
              }
              title={t('Free and respectful of your privacy')}
              description={t(
                'No account is required, all your data is stored locally in your browser and never leaves your computer.',
              )}
            />
          </div>
        </div>
      </section>

      <section className="py-2">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-2 rounded-lg p-6 text-center border border-purple-500">
            <h3 className="text-xl font-semibold flex justify-center items-center gap-2 text-purple-900">
              <span>
                <Info className="mx-auto w-5 h-5" />
              </span>
              <span className="">{t('Warning')}</span>
            </h3>
            <p className="text-base leading-relaxed text-purple-900">
              {t(
                'Piano Touch Lab is a toolbox, not a magic wand. It provides the tools for measurement, analysis, and calculation, but it makes no design decisions for you. All balancing and adjustment choices must come from a trained technician with proper knowledge of piano action regulation methods. This tool is here to assist your expertise, not replace it.',
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-2">
        <div className="container">
          <div className="mx-auto max-w-6xl space-y-4 text-center rounded-2xl p-8">
            <h3 className="text-2xl font-semibold">
              {t('About this project')}
            </h3>
            <p className="text-muted-foreground md:text-lg text-justify leading-relaxed">
              {t(
                'Piano Touch Lab was born from my curiosity as an amateur pianist and software developer, eager to understand the piano’s mechanics in depth. In exploring the fundamentals of piano geometry and touch, I discovered the work of David C. Stanwood and created this tool to experiment with his “Equation of Balance” and the “New Touch Weight Metrology”. What began as a way to deepen my own understanding gradually evolved into a full-fledged application, which I decided to share as open source, so that others can explore, learn, and build upon it.',
              )}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <a
                href="https://github.com/madmatah/piano-touch-lab"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" className="gap-2 hover:bg-muted">
                  <Github className="w-5 h-5" />
                  {t('View on GitHub')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
