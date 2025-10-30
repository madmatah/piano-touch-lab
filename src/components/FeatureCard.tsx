import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface FeatureCardProps {
  icon: ReactElement;
  title: string;
  description: string;
  to?: string;
}

export const FeatureCard = ({
  icon,
  title,
  description,
  to,
}: FeatureCardProps) => {
  const content = (
    <Card className="h-full hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] transition-all delay-0 duration-150 bg-[radial-gradient(ellipse_at_top,rgba(120,120,255,0.08),transparent)] shadow-inner shadow-neutral-200">
      <CardHeader>
        <div className="flex items-center gap-3 text-purple-900">
          <div className="bg-gradient-to-br from-purple-400 to-purple-900 text-white p-2 rounded-xl">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return <div className="block">{content}</div>;
};
