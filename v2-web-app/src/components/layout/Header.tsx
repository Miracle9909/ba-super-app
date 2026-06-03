import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { IconBtn } from '../ui/Buttons';
import { PrimaryBtn } from '../ui/Buttons';
import { SettingsModal } from './SettingsModal';

interface HeaderProps {
  onCreateProject?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateProject }) => {
  const [focus, setFocus] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="h-16 shrink-0 flex items-center gap-3 px-6 border-b border-border-color">
        {/* Search */}
        <div
          className="flex items-center gap-2.5 h-11 rounded-full px-4 transition-all"
          style={{
            width: 480,
            maxWidth: '46%',
            background: focus ? '#fff' : 'var(--bg-hover)',
            boxShadow: focus ? '0 0 0 2px rgba(11,87,208,0.2)' : 'none',
            border: focus ? '1px solid var(--primary)' : '1px solid transparent',
          }}
        >
          <Icon name="search" size={19} className="text-text-secondary" />
          <input
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder="Tìm kiếm dự án, tài liệu, user story…"
            className="flex-1 bg-transparent outline-none text-[13.5px] text-text-primary placeholder:text-text-disabled"
          />
        </div>

        <div className="flex-1" />

        <IconBtn icon="bell" title="Thông báo" badge />
        <IconBtn icon="help-circle" title="Trợ giúp" />
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary transition-colors hover:bg-bg-hover"
          title="Cài đặt"
        >
          <Icon name="settings" size={20} />
        </button>
        <div className="w-px h-7 mx-1 bg-border-color" />
        <PrimaryBtn icon="plus" size="sm" onClick={onCreateProject}>Tạo mới</PrimaryBtn>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
