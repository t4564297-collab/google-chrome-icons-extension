
import React from 'react';
import ToggleSwitch from './ToggleSwitch';

interface HeaderProps {
  isEnabled: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ isEnabled, onToggle }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">مُصلح أيقونات جوجل</h1>
          <p className="text-slate-500">عرض توضيحي لاستبدال أيقونات جوجل المفقودة</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-slate-700">
            {isEnabled ? 'الاستبدال مفعل' : 'الاستبدال معطل'}
          </span>
          <ToggleSwitch isEnabled={isEnabled} onToggle={onToggle} />
        </div>
      </div>
    </header>
  );
};

export default Header;
