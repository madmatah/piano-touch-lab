import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { MainMenuItem } from './MainMenuItem';
import {
  BadgeQuestionMark,
  ChartLine,
  FileDown,
  FlaskConical,
  Scale,
  Settings2,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const MainMenu = () => {
  return (
    <div className="container mx-auto flex gap-4 py-4 px-6">
      <NavLink className="flex items-center gap-1 group" to="/">
        <FlaskConical className="w-5 h-5 group-hover:text-primary group-hover:animate-[spin_800ms_ease-in-out] transition duration-150" />

        <span className="font-extrabold text-l tracking-tight">
          Piano Touch Lab
        </span>
      </NavLink>
      <NavigationMenu>
        <NavigationMenuList>
          <MainMenuItem
            destinationUrl="/measure"
            label="Measure"
            icon={<Scale />}
          />
          <MainMenuItem
            destinationUrl="/analyze"
            label="Analyze"
            icon={<ChartLine />}
          />
          <MainMenuItem
            destinationUrl="/design"
            label="Design"
            icon={<Settings2 />}
          />
          <MainMenuItem
            destinationUrl="/backup"
            label="Backup"
            icon={<FileDown />}
          />
          <MainMenuItem
            destinationUrl="/help"
            label="Help"
            icon={<BadgeQuestionMark />}
          />
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
