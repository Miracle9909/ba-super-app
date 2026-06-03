const fs = require('fs');
let base = fs.readFileSync('../BA Super App/ba-icons.jsx', 'utf8');
let extra = fs.readFileSync('../BA Super App/ba2-icons-extra.jsx', 'utf8');

let baseObjMatch = base.match(/const BA_ICON_PATHS = (\{[\s\S]*?\n\});/);
let extraObjMatch = extra.match(/Object\.assign\(BA_ICON_PATHS, (\{[\s\S]*?\n\})\);/);

let combined = `import React from 'react';

export const BA_ICON_PATHS: Record<string, any[]> = {\n`;
if (baseObjMatch) {
  let inner = baseObjMatch[1].replace(/^\{/, '').replace(/\}$/, '');
  combined += inner;
}
if (extraObjMatch) {
  let inner = extraObjMatch[1].replace(/^\{/, '').replace(/\}$/, '');
  combined += inner;
}
combined += `
};

export interface IconProps {
  name: string;
  size?: number | string;
  className?: string;
  strokeWidth?: number | string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, size = 18, className = '', strokeWidth = 1.85, style }) => {
  const paths = BA_ICON_PATHS[name];
  if (!paths) return <span style={{ width: size, height: size, display: 'inline-block', ...style }} />;
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor"
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className} 
      style={style} 
      aria-hidden="true"
    >
      {paths.map(([tag, attrs], i) => React.createElement(tag as any, { key: i, ...attrs }))}
    </svg>
  );
};
`;

fs.writeFileSync('./v2-web-app/src/components/ui/Icon.tsx', combined);
console.log('Icon.tsx generated');
