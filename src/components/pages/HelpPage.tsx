import { Glossary } from '../glossary/Glossary';
import { MainLayout } from '../MainLayout';
import { BadgeQuestionMark } from 'lucide-react';

export const HelpPage = () => {
  return (
    <MainLayout pageTitle="Help" pageIcon={<BadgeQuestionMark />}>
      <div className="flex flex-col gap-20">
        <section>
          <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            Touch Weight Metrology cheat sheet
          </h2>

          <Glossary
            terms={[
              {
                abbreviation: 'BW',
                description:
                  'The amount of weight placed on the measuring point that causes the key to be balanced.',
                name: 'Balance Weight',
              },
              {
                abbreviation: 'BWS',
                description:
                  'The difference between the balance weight with the wippen support spring disengaged and with it engaged.',
                name: 'Support Spring Balance Weight',
              },
              {
                abbreviation: 'D',
                description:
                  'The minimum amount of weight, to the nearest gram, placed on the measuring point that causes the key to drop while maintaining a slow controlled motion of the hammer.',
                name: 'Down Weight',
              },
              {
                abbreviation: 'F',
                description:
                  'The minimum amount of weight added to the balance weight that causes the key to drop while maintaining a slow controlled motion of the hammer or the minimum amount of weight taken away from the Balance Weight that causes the key to rise while maintaining a slow controlled motion of the hammer.',
                name: 'Friction Weight',
              },
              {
                abbreviation: 'FW',
                description:
                  'The amount of static weight, to the nearest 0.1 gram, that the level key, tipped on its balance pin point, exerts at the measuring point.',
                name: 'Front Weight',
              },
              {
                abbreviation: 'HW',
                description: 'The weight of the hammer with shank removed.',
                name: 'Hammer Weight',
              },
              {
                abbreviation: 'KF',
                description:
                  'A component of Friction Weight which is the minimum amount of weight, to the nearest gram, placed on the measuring point of a key that causes the key to fall, with the Front Weight(FW) set to zero with temporary weight and with the key on its frame and the stack removed.',
                name: 'Key Friction Weight',
              },
              {
                abbreviation: 'KR',
                description:
                  'The ratio of downward force on the capstan/heel versus the corresponding upwards force at the measuring point as translated through the key or the amount of weight at the measuring point needed to balance 1.0 grams of weight at the capstan/heel contact point.',
                name: 'Key Weight Ratio',
              },
              {
                abbreviation: 'R',
                description:
                  'The ratio of downward force at the hammer versus the upwards force at the measuring point as translated through the shank, wippen, and key, or the amount of weight placed on the measuring point needed to balance 1 gram of Strike Weight',
                name: 'Strike Weight Ratio',
              },
              {
                abbreviation: 'SBW',
                description:
                  'The upward static force at the measuring point resulting from the static weight of the hammer and shank, leveraged through the shank, wippen, and key',
                name: 'Strike Balance Weight',
              },
              {
                abbreviation: 'SS',
                description:
                  'The amount of weight to the nearest 0.1 gram, of the shank, pivoted without friction at the hammer center with shank level, measured at the strike line radius.',
                name: 'Shank Strike Weight',
              },
              {
                abbreviation: 'SW',
                description:
                  'The amount of weight to the nearest 0.1 gram, of the shank and hammer, pivoted without friction at the hammer center with shank level, measured at the strike line radius.',
                name: 'Strike Weight',
              },
              {
                abbreviation: 'TBW',
                description:
                  'The combined upward static force at the measuring point resulting from the static weight of the wippen leveraged through the key and from the static weight of the hammer and shank, leveraged through the shank, wippen, and key.',
                name: 'Top Action Balance Weight',
              },
              {
                abbreviation: 'U',
                description:
                  'The maximum amount of weight, to the nearest gram, placed on the measuring point that the key can lift while maintaining a slow controlled motion of the hammer.',
                name: 'Up Weight',
              },
              {
                abbreviation: 'WBW',
                description:
                  'The upward static force at the measuring point resulting from the static weight of the wippen leveraged through the key.',
                name: 'Wippen Balance Weight',
              },
              {
                abbreviation: 'WW',
                description:
                  'The amount of weight, to the nearest 0.1 gram, of the level wippen, pivoted without friction, at the wippen center, and measured at the capstan/heel contact point.',
                name: 'Wippen Weight',
              },
            ]}
          />
        </section>
      </div>
    </MainLayout>
  );
};
