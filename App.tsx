
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { analyzeVideoLink } from './geminiService';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const isInitialMount = useRef(true);

  const steps = [
    "جاري تحليل الرابط...",
    "البحث عن النسخة الأصلية...",
    "تجاوز العلامة المائية...",
    "تحضير رابط التحميل المباشر..."
  ];

  const handleProcess = useCallback(async (targetUrl: string) => {
    if (!targetUrl || !targetUrl.trim() || !targetUrl.startsWith('http')) {
      setError("يرجى إدخال رابط صحيح");
      return;
    }
    
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
      };
      setVideos(prev => [newVideo, ...prev]);
      setUrl('');
      // مسح الرابط من الـ URL بعد المعالجة لعدم التكرار عند التحديث
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err: any) {
      setError("فشل التحليل. تأكد من صحة الرابط أو حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // التحقق من الرابط عند التشغيل (دعم المشاركة)
  useEffect(() => {
    if (isInitialMount.current) {
      const params = new URLSearchParams(window.location.search);
      const sharedUrl = params.get('url') || params.get('v') || params.get('link');
      if (sharedUrl) {
        setUrl(sharedUrl);
        handleProcess(sharedUrl);
      }
      isInitialMount.current = false;
    }
  }, [handleProcess]);

  // تأثير تبديل خطوات المعالجة
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
    <div className="min-h-screen flex flex-col bg-[#020617] selection:bg-sky-500/30">
      <header className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <i className="fas fa-video text-white"></i>
          </div>
          <h1 className="text-xl font-black gradient-text tracking-tighter">VIDEO MASTER</h1>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1"><i className="fas fa-check-circle text-green-500"></i> متاح الآن</span>
          <span className="flex items-center gap-1"><i className="fas fa-bolt text-yellow-500"></i> معالجة سريعة</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        <section className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold mb-6 animate-bounce">
            النسخة PRO متوفرة الآن مجاناً
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight">
            حمّل فيديوهاتك <br/> <span className="text-sky-500">بدون أي علامات</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-10 leading-relaxed">
            أداة الذكاء الاصطناعي الأقوى لتحليل الروابط واستخراج الفيديوهات بأعلى جودة ممكنة من تيك توك، يوتيوب وإنستغرام.
          </p>
          
          <form onSubmit={(e) => { e.preventDefault(); handleProcess(url); }} className="relative max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 p-2.5 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="ألصق رابط الفيديو هنا..."
                className="flex-1 bg-transparent border-none py-3.5 px-5 text-white placeholder:text-slate-600 focus:ring-0 text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !url}
                className="bg-sky-500 hover:bg-sky-400 text-white px-10 py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i>
                    جاري العمل
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i>
                    ابدأ التحليل
                  </>
                )}
              </button>
            </div>
            {isLoading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sky-400 font-bold text-[11px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                {processStep}
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-bold flex items-center gap-2 justify-center">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </div>
            )}
          </form>
        </section>

        <div className="space-y-6">
          {videos.length === 0 && !isLoading && (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
              <i className="fas fa-link text-slate-800 text-4xl mb-4"></i>
              <p className="text-slate-600 text-xs">لا توجد فيديوهات معالجة حالياً. ضع رابطاً للبدء.</p>
            </div>
          )}
          
          {videos.map((v) => (
            <div key={v.id} className="glass rounded-3xl overflow-hidden border border-white/10 flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="md:w-72 relative group">
                <img src={v.thumbnail} className="w-full h-full object-cover aspect-video md:aspect-auto" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <i className="fas fa-play text-white text-2xl"></i>
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[9px] font-bold uppercase mb-2 inline-block">
                      {v.platform}
                    </span>
                    <h3 className="font-bold text-white text-lg leading-tight line-clamp-1">{v.title}</h3>
                  </div>
                  <button className="text-slate-500 hover:text-white transition-colors">
                    <i className="fas fa-share-alt"></i>
                  </button>
                </div>
                
                <p className="text-slate-400 text-xs mb-5 line-clamp-2 leading-relaxed">{v.summary}</p>
                
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 bg-white/5 p-3 rounded-xl border border-white/5">
                    <i className="fas fa-lightbulb text-yellow-500 shrink-0"></i>
                    <span className="line-clamp-2">{v.downloadInstructions}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => v.sources?.[0]?.web?.uri && window.open(v.sources[0].web.uri, '_blank')}
                      className="flex-1 bg-white text-black font-black py-3 rounded-xl text-xs hover:bg-sky-500 hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-download"></i>
                      تحميل بجودة {selectedQuality}
                    </button>
                    <button className="px-4 bg-white/5 text-white rounded-xl hover:bg-white/10 border border-white/5">
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-10 text-center border-t border-white/5">
        <div className="flex justify-center gap-6 mb-4 text-slate-500 text-sm">
          <a href="#" className="hover:text-sky-400 transition-colors">سياسة الخصوصية</a>
          <a href="#" className="hover:text-sky-400 transition-colors">عن التطبيق</a>
          <a href="#" className="hover:text-sky-400 transition-colors">الدعم الفني</a>
        </div>
        <p className="text-slate-700 text-[10px] font-bold">حقوق الطبع والنشر © 2024 فيديو ماستر برو • يعمل بواسطة Gemini 3</p>
      </footer>
    </div>
  );
};

export default App;
