/* =========================================================================
   BA Super App — Icon set (lucide-style inline SVG, no external lib)
   Maps Material Symbols → lucide-equivalent glyphs per spec.
   ========================================================================= */
const BA_ICON_PATHS = {
  "layout-dashboard": [["rect",{x:3,y:3,width:7,height:9,rx:1}],["rect",{x:14,y:3,width:7,height:5,rx:1}],["rect",{x:14,y:12,width:7,height:9,rx:1}],["rect",{x:3,y:16,width:7,height:5,rx:1}]],
  "folder-open": [["path",{d:"M6 14l1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6A2 2 0 0 1 18.45 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"}]],
  "graduation-cap": [["path",{d:"M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"}],["path",{d:"M22 10v6"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5"}]],
  "square-kanban": [["rect",{width:18,height:18,x:3,y:3,rx:2}],["path",{d:"M8 7v7"}],["path",{d:"M12 7v4"}],["path",{d:"M16 7v9"}]],
  "bar-chart-3": [["path",{d:"M3 3v18h18"}],["path",{d:"M18 17V9"}],["path",{d:"M13 17V5"}],["path",{d:"M8 17v-3"}]],
  "settings": [["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"}],["circle",{cx:12,cy:12,r:3}]],
  "search": [["circle",{cx:11,cy:11,r:8}],["path",{d:"m21 21-4.3-4.3"}]],
  "bell": [["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0"}]],
  "help-circle": [["circle",{cx:12,cy:12,r:10}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"}],["path",{d:"M12 17h.01"}]],
  "plus": [["path",{d:"M5 12h14"}],["path",{d:"M12 5v14"}]],
  "upload": [["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m17 8-5-5-5 5"}],["path",{d:"M12 3v12"}]],
  "link-2": [["path",{d:"M9 17H7A5 5 0 0 1 7 7h2"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2"}],["path",{d:"M8 12h8"}]],
  "file-text": [["path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}],["path",{d:"M14 2v6h6"}],["path",{d:"M16 13H8"}],["path",{d:"M16 17H8"}],["path",{d:"M10 9H8"}]],
  "brain-circuit": [["path",{d:"M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"}],["path",{d:"M9 13a4.5 4.5 0 0 0 3-4"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516"}],["path",{d:"M12 13h4"}],["path",{d:"M12 18h6a2 2 0 0 1 2 2v1"}],["path",{d:"M12 8h8"}],["path",{d:"M16 8V5a2 2 0 0 1 2-2"}],["circle",{cx:16,cy:13,r:.5}],["circle",{cx:18,cy:3,r:.5}],["circle",{cx:20,cy:21,r:.5}],["circle",{cx:20,cy:8,r:.5}]],
  "info": [["circle",{cx:12,cy:12,r:10}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]],
  "badge-check": [["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"}],["path",{d:"m9 12 2 2 4-4"}]],
  "eye": [["path",{d:"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"}],["circle",{cx:12,cy:12,r:3}]],
  "trash-2": [["path",{d:"M3 6h18"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}],["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}]],
  "forward": [["path",{d:"m15 17 5-5-5-5"}],["path",{d:"M4 18v-2a4 4 0 0 1 4-4h12"}]],
  "book-copy": [["path",{d:"M2 16V4a2 2 0 0 1 2-2h11"}],["path",{d:"M22 18H11a2 2 0 1 0 0 4h10.5a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5H11a2 2 0 0 0-2 2v12"}],["path",{d:"M5 14H4a2 2 0 1 0 0 4h1"}]],
  "file-pen-line": [["path",{d:"m18 5-2.4-2.4A2 2 0 0 0 14.2 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2"}],["path",{d:"M21.4 12.6a1 1 0 0 0-3-3l-4 4a2 2 0 0 0-.5.86l-.84 2.87a.5.5 0 0 0 .62.62l2.87-.84a2 2 0 0 0 .85-.5z"}],["path",{d:"M8 18h1"}]],
  "drafting-compass": [["circle",{cx:12,cy:5,r:2}],["path",{d:"m3 21 8.02-14.26"}],["path",{d:"m12.99 6.74 1.93 3.44"}],["path",{d:"M19.14 12a10 10 0 0 1-14.28 0"}],["path",{d:"m21 21-2.16-3.84"}]],
  "check": [["path",{d:"M20 6 9 17l-5-5"}]],
  "check-circle": [["path",{d:"M21.8 10A10 10 0 1 1 17 3.34"}],["path",{d:"m9 11 3 3L22 4"}]],
  "chevron-right": [["path",{d:"m9 18 6-6-6-6"}]],
  "chevron-down": [["path",{d:"m6 9 6 6 6-6"}]],
  "play": [["polygon",{points:"6 3 20 12 6 21 6 3"}]],
  "refresh-cw": [["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]],
  "building-2": [["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"}],["path",{d:"M10 6h4"}],["path",{d:"M10 10h4"}],["path",{d:"M10 14h4"}],["path",{d:"M10 18h4"}]],
  "shield-check": [["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}],["path",{d:"m9 12 2 2 4-4"}]],
  "lock": [["rect",{width:18,height:11,x:3,y:11,rx:2}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4"}]],
  "loader": [["path",{d:"M12 2v4"}],["path",{d:"m16.2 7.8 2.9-2.9"}],["path",{d:"M18 12h4"}],["path",{d:"m16.2 16.2 2.9 2.9"}],["path",{d:"M12 18v4"}],["path",{d:"m4.9 19.1 2.9-2.9"}],["path",{d:"M2 12h4"}],["path",{d:"m4.9 4.9 2.9 2.9"}]],
  "git-branch": [["line",{x1:6,x2:6,y1:3,y2:15}],["circle",{cx:18,cy:6,r:3}],["circle",{cx:6,cy:18,r:3}],["path",{d:"M18 9a9 9 0 0 1-9 9"}]],
  "mail": [["rect",{width:20,height:16,x:2,y:4,rx:2}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"}]],
  "layout-template": [["rect",{width:18,height:7,x:3,y:3,rx:1}],["rect",{width:9,height:7,x:3,y:14,rx:1}],["rect",{width:5,height:7,x:16,y:14,rx:1}]],
  "arrow-right": [["path",{d:"M5 12h14"}],["path",{d:"m12 5 7 7-7 7"}]],
  "clock": [["circle",{cx:12,cy:12,r:10}],["path",{d:"M12 6v6l4 2"}]],
  "user": [["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"}],["circle",{cx:12,cy:7,r:4}]],
  "database": [["ellipse",{cx:12,cy:5,rx:9,ry:3}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5"}],["path",{d:"M3 12A9 3 0 0 0 21 12"}]],
  "list-checks": [["path",{d:"m3 17 2 2 4-4"}],["path",{d:"m3 7 2 2 4-4"}],["path",{d:"M13 6h8"}],["path",{d:"M13 12h8"}],["path",{d:"M13 18h8"}]],
  "table": [["path",{d:"M12 3v18"}],["rect",{width:18,height:18,x:3,y:3,rx:2}],["path",{d:"M3 9h18"}],["path",{d:"M3 15h18"}]],
  "sparkles": [["path",{d:"M9.94 14.66A1 1 0 0 1 9 14a1 1 0 0 1 .94-.66l1.36-.45a2 2 0 0 0 1.27-1.27l.45-1.36a1 1 0 0 1 1.9 0l.45 1.36a2 2 0 0 0 1.27 1.27l1.36.45a1 1 0 0 1 0 1.9l-1.36.45a2 2 0 0 0-1.27 1.27l-.45 1.36a1 1 0 0 1-1.9 0l-.45-1.36a2 2 0 0 0-1.27-1.27z"}],["path",{d:"M5 3v4"}],["path",{d:"M3 5h4"}],["path",{d:"M6 17v2"}],["path",{d:"M5 18H7"}]],
  "file-down": [["path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}],["path",{d:"M14 2v6h6"}],["path",{d:"M12 18v-6"}],["path",{d:"m9 15 3 3 3-3"}]],
  "circle-dot": [["circle",{cx:12,cy:12,r:10}],["circle",{cx:12,cy:12,r:3}]],
  "calendar": [["path",{d:"M8 2v4"}],["path",{d:"M16 2v4"}],["rect",{width:18,height:18,x:3,y:4,rx:2}],["path",{d:"M3 10h18"}]],
  "x": [["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]],
  "gauge": [["path",{d:"m12 14 4-4"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0"}]],
  "coins": [["circle",{cx:8,cy:8,r:6}],["path",{d:"M18.09 10.37A6 6 0 1 1 10.34 18"}],["path",{d:"M7 6h1v4"}],["path",{d:"m16.71 13.88.7.71-2.82 2.82"}]],
  "scroll-text": [["path",{d:"M15 12h-5"}],["path",{d:"M15 8h-5"}],["path",{d:"M19 17V5a2 2 0 0 0-2-2H4"}],["path",{d:"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"}]],
};

function Icon({ name, size = 18, className = "", strokeWidth = 1.85, style }) {
  const paths = BA_ICON_PATHS[name];
  if (!paths) return <span style={{ width: size, height: size, display: "inline-block", ...style }} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={style} aria-hidden="true">
      {paths.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}

Object.assign(window, { Icon, BA_ICON_PATHS });
