import React from 'react';
import type { IconProps } from 'lucide-react';
type Icon = React.ForwardRefExoticComponent<IconProps>;

interface SectionHeaderProps {
  icon: Icon;
  title: string;
  description?: string;
}

export function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-green-600" />
        <span className="text-xl font-semibold text-gray-900">{title}</span>
      </div>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}

