
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const renderApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error("لم يتم العثور على عنصر root في الصفحة");
      return;
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("فشل تشغيل تطبيق React:", error);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="color: white; padding: 20px; text-align: center; font-family: sans-serif;">
          <h2>عذراً، حدث خطأ أثناء تشغيل التطبيق</h2>
          <p>يرجى التحقق من الـ Console للمزيد من التفاصيل.</p>
        </div>
      `;
    }
  }
};

// التأكد من تحميل المستند بالكامل قبل التشغيل
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
