import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { anthropicApiKey, setAnthropicApiKey } = useSettingsStore();
  const [keyInput, setKeyInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setKeyInput(anthropicApiKey);
    }
  }, [isOpen, anthropicApiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    setAnthropicApiKey(keyInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-bg-surface rounded-2xl w-[560px] max-w-[90vw] shadow-2xl flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-border-color">
          <h2 className="text-xl font-medium text-text-primary">Cài đặt hệ thống</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-hover text-text-secondary transition-colors"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <h3 className="text-[15px] font-medium text-text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-rounded text-primary text-[20px]">key</span>
              Anthropic API Key (BYO-key)
            </h3>
            <p className="text-[13px] text-text-secondary mb-4 leading-relaxed">
              Nhập API Key của bạn để sử dụng các tính năng AI (trích xuất tri thức, Socratic Chat). 
              Key được lưu trữ an toàn trong trình duyệt của bạn (Local Storage) và không bao giờ được gửi đến máy chủ của chúng tôi.
            </p>
            <div className="relative">
              <input 
                type="password" 
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="sk-ant-api03-..." 
                className="w-full px-4 py-3 border border-border-color rounded-lg text-[14px] text-text-primary outline-none focus:border-primary transition-colors pr-10"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border-color flex justify-end gap-3 bg-bg-app/50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-[14px] font-medium text-text-primary hover:bg-bg-hover transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-2.5 rounded-full text-[14px] font-medium bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};
