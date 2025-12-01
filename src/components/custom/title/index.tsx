import React from 'react';
import GradientBackground , { colorsTypes } from '../svggradients/gradient.colors'; 

interface TitleProps {
  title: string;
  variant?: 'heading' | 'subheading1' | 'subheading2' | 'subheading3';
  noMargin?: boolean;
  className?: string;
  onClick?: () => void;
  useGradient?: boolean;
  colorChosen?: colorsTypes;
  animate?: boolean;
}

const Title: React.FC<TitleProps> = ({
  title = 'Title not set',
  variant = 'heading',
  noMargin = false,
  className = '',
  onClick,
  useGradient = false,
  colorChosen = 'blue',
  animate = false,
}) => {
  const getFontSize = (): string => {
    switch (variant) {
      case 'heading':
        return 'font-bold text-3xl';
      case 'subheading1':
        return 'font-bold text-xl';
      case 'subheading2':
        return 'font-bold text-lg';
      case 'subheading3':
        return 'font-bold text-md';
      default:
        return 'font-bold text-2xl';
    }
  };

  const gradientClass = useGradient
    ? `${GradientBackground({ colorChosen, animate })} bg-clip-text text-transparent`
    : '';

  return (
<h2
  className={`inline-block ${getFontSize()} ${noMargin ? 'py-1' : 'py-3'} ${gradientClass} ${className}`}
  onClick={onClick}
>
  {title}
</h2>
  );
};

export default Title;