import React from 'react';

// This component uses a common pattern for Material Icons: a span or i tag
// with a class and the icon name as its text content.
const MaterialIcon = ({ name }: { name: string }) => {
  // In a real scenario, these classes would trigger the icon font.
  // Here, we just use them for styling and to hold the text.
  return <span className="material-icon-placeholder align-middle mx-1 text-lg font-bold text-slate-600">{name}</span>;
};

const SimulatedPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
        <div className="flex items-center space-x-3">
          <MaterialIcon name="menu" />
          <img src="https://picsum.photos/100/30" alt="Logo" className="h-8"/>
        </div>
        <div className="flex-1 max-w-lg mx-4">
            <div className="flex items-center bg-white border border-slate-300 rounded-full px-4 py-2">
                <MaterialIcon name="search" />
                <input type="text" placeholder="بحث..." className="bg-transparent w-full focus:outline-none mr-2"/>
                <MaterialIcon name="close" />
            </div>
        </div>
        <div className="flex items-center space-x-4">
          <MaterialIcon name="help" />
          <MaterialIcon name="apps" />
          <MaterialIcon name="notifications" />
          <MaterialIcon name="account_circle" />
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-3">
        <button className="p-2 rounded-full hover:bg-slate-200 transition-colors"><MaterialIcon name="refresh" /></button>
        <button className="p-2 rounded-full hover:bg-slate-200 transition-colors"><MaterialIcon name="download" /></button>
        <button className="p-2 rounded-full hover:bg-slate-200 transition-colors"><MaterialIcon name="share" /></button>
        <button className="p-2 rounded-full hover:bg-slate-200 transition-colors"><MaterialIcon name="link" /></button>
        <div className="flex-grow"></div>
        <button className="p-2 rounded-full hover:bg-slate-200 transition-colors"><MaterialIcon name="light_mode" /></button>
         <button className="p-2 rounded-full hover:bg-slate-200 transition-colors"><MaterialIcon name="filter_list" /></button>
      </div>


      {/* Main Content */}
      <div className="p-3">
        <h2 className="text-xl font-semibold mb-4">ملفاتي</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {name: 'مستند مهم.docx', icon: 'code'},
            {name: 'عرض تقديمي.pptx', icon: 'segment'},
            {name: 'بيانات المشروع.xlsx', icon: 'data_object'},
            {name: 'صورة العطلة.jpg', icon: 'home'}
            ].map((file) => (
            <div key={file.name} className="bg-slate-100 p-4 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <MaterialIcon name={file.icon} />
                <span className="mr-2">{file.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <MaterialIcon name="edit" />
                <MaterialIcon name="delete" />
                <MaterialIcon name="more_vert" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Actions */}
       <div className="flex items-center justify-end space-x-3 p-3 border-t border-slate-200">
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            <MaterialIcon name="cloud_upload" /> 
            <span className="mr-2">رفع ملف</span>
          </button>
           <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            <MaterialIcon name="add" /> 
            <span className="mr-2">مجلد جديد</span>
          </button>
           <button className="flex items-center bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors">
            <MaterialIcon name="settings" /> 
            <span className="mr-2">الإعدادات</span>
          </button>
       </div>
    </div>
  );
};

export default SimulatedPage;
