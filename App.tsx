
import React, { useState, useEffect, useCallback } from 'react';
import { analyzeVideoLink } from './geminiService';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  const steps = [
    "جاري التحليل...",
    "فك التشفير...",
    "تجهيز الجودة العالية...",
    "توليد الرابط..."
  ];

  // دالة المعالجة الرئيسية
  const handleProcess = useCallback(async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeVideoLink(targetUrl);
      const newVideo = {
        id: Date.now().toString(),
        url: targetUrl,
        ...result,
        thumbnail: `https://picsum.photos/seed/${Math.random()}/600/400`,
        timestamp: new Date().toLocaleTimeString('ar-EG'),
        selectedQuality
      };
      setVideos(prev => [newVideo, ...prev]);
      setUrl('');
    } catch (err: any) {
      setError("الرابط غير مدعوم حالياً أو حدث خطأ في الاتصال.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedQuality]);

  // التحقق من وجود رابط في الـ URL عند تحميل الصفحة (للمشاركة)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url') || params.get('v');
    if (sharedUrl) {
      setUrl(sharedUrl);
      handleProcess(sharedUrl);
    }
  }, [handleProcess]);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      let i = 0;
      setProcessStep(steps[0]);
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setProcessStep(steps[i]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-bolt text-white text-lg"></i>
          </div>
          <h1 className="text-xl font-black gradient-text">VIDEO PRO</h1>
        </div>
        <div className="flex gap-2">
          {['1080p', '4K'].map(q => (
            <button
              key={q}
              onClick={() => setSelectedQuality(q)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                selectedQuality === q ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-400'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">تحميل ذكي بدون علامة</h2>
          <p className="text-slate-500 text-sm mb-8">يدعم TikTok, YouTube, Instagram بجودة فائقة</p>
          
          <form onSubmit={(e) => { e.preventDefault(); handleProcess(url); }} className="relative group">
            <div className="flex flex-col md:flex-row gap-2 p-2 bg-slate-900 border border-white/10 rounded-2xl">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="ألصق الرابط هنا..."
                className="flex-1 bg-transparent border-none py-3 px-4 text-white focus:ring-0"
              />
              <button
                type="submit"
                disabled={isLoading || !url}
                className="bg-sky-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-sky-400 disabled:opacity-50"
              >
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'تحميل'}
              </button>
            </div>
          </form>

          {isLoading && <p className="mt-4 text-sky-400 font-bold animate-pulse text-xs">{processStep}</p>}
          {error && <p className="mt-4 text-red-500 text-xs font-bold">{error}</p>}
        </section>

        <div className="grid gap-6">
          {videos.map((v) => (
            <div key={v.id} className="glass rounded-3xl overflow-hidden border border-white/5 flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
              <div className="md:w-64 h-40 md:h-auto overflow-hidden">
                <img src={v.thumbnail} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold text-white text-lg line-clamp-1">{v.title}</h3>
                  <span className="text-sky-500 text-[10px] font-black">{v.platform}</span>
                </div>
                <p className="text-slate-500 text-xs mb-4 line-clamp-2">{v.summary}</p>
                <div className="bg-white/5 p-3 rounded-xl mb-4 text-[11px] text-slate-300">
                  <i className="fas fa-info-circle ml-2 text-sky-500"></i> {v.downloadInstructions}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white text-black font-black py-3 rounded-xl text-sm hover:bg-sky-500 hover:text-white transition-all">
                    تنزيل الملف
                  </button>
                  {v.sources?.length > 0 && (
                    <a href={v.sources[0]?.web?.uri} target="_blank" className="p-3 bg-white/5 rounded-xl text-white">
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-8 text-center border-t border-white/5">
        <p className="text-slate-600 text-[10px]">نظام التحميل المتقدم v2.1 • 2024</p>
      </footer>
    </div>
  );
};

export default App;
