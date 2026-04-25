
import React, { useState } from 'react';
import Header from './components/Header';
import IconReplacer from './components/IconReplacer';
import SimulatedPage from './components/SimulatedPage';

function App() {
  const [isReplacementEnabled, setReplacementEnabled] = useState<boolean>(true);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
      <Header 
        isEnabled={isReplacementEnabled} 
        onToggle={() => setReplacementEnabled(!isReplacementEnabled)} 
      />
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
          <h2 className="text-2xl font-bold mb-4 text-slate-700">محاكاة صفحة جوجل</h2>
          <p className="mb-6 text-slate-500">
            هذه الصفحة تحاكي كيف ستبدو إحدى خدمات جوجل عندما تكون خطوط الأيقونات محظورة. استخدم المفتاح في الأعلى لتفعيل أو تعطيل استبدال الأيقونات.
          </p>
          <div className="border-t border-slate-200 pt-6">
            <IconReplacer enabled={isReplacementEnabled}>
              <SimulatedPage />
            </IconReplacer>
          </div>
        </div>
        
        <div className="mt-8 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow" role="alert">
          <h3 className="font-bold">كيف يعمل هذا؟</h3>
          <p className="mt-2">
            هذا التطبيق هو عرض توضيحي. في إضافة متصفح حقيقية، سيعمل "سكربت محتوى" (Content Script) في الخلفية على صفحات جوجل. سيقوم هذا السكربت بالبحث عن عناصر HTML التي تحتوي على أسماء أيقونات (مثل <code className="bg-blue-200 p-1 rounded text-sm">settings</code>) ويستبدلها برموز SVG المقابلة لها، مما يحل المشكلة مباشرة في المتصفح.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;