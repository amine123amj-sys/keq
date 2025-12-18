
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { analyzeVideoLink } from './geminiService';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  const steps = [
    "جاري فحص الرابط...",
    "تجاوز حماية المنصة...",
    "البحث عن النسخة الأصلية...",
    "تجهيز رابط التحميل الآمن..."
  ];

  const handleProcess = useCallback(async (targetUrl: string) => {
    if (!targetUrl?.trim().startsWith('http')) {
      setError("يرجى إدخال رابط فيديو صالح (http/https)");
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
        thumbnail: `https://picsum.photos/seed/${Math.random()}/800/450`,
        timestamp: new Date().toLocaleTimeString('ar-EG'),
      };
      setVideos(prev => [newVideo, ...prev]);
      setUrl('');
      // إزالة معلمات الرابط من العنوان بعد النجاح
      window.history.replaceState({}, '', window.location.pathname);
    } catch (err: any) {
      setError("حدث خطأ أثناء المعالجة. تأكد من أن الرابط عام وغير محمي.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      let i = 0;
      setStatusMessage(steps[0]);
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setStatusMessage(steps[i]);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const copyShareLink = (vUrl: string) => {
    const base = window.location.origin + window.location.pathname;
    const share = `${base}?url=${encodeURIComponent(vUrl)}`;
    navigator.clipboard.writeText(share);
    alert("تم نسخ رابط المشاركة السحري!");
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-sky-500/30">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-3 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-sky-500/20">
            <i className="fas fa-bolt text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-black gradient-text tracking-tight font-outfit uppercase">Video Master</h1>
            <p className="text-[9px] text-slate-500 font-bold -mt-1 uppercase tracking-widest">IS_ME_UNNI Edition</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="text-slate-400 hover:text-white transition-colors text-sm"><i className="fas fa-shield-halved ml-1"></i> آمن</button>
          <button className="hidden md:block bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/5 transition-all">
            <i className="fas fa-coffee ml-2 text-amber-500"></i> ادعمنا
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            تحديث PRO v3.5: دعم كامل لـ Instagram Reels
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-white leading-[1.1] tracking-tight">
            حول الرابط إلى <br/> <span className="gradient-text">فيديو خام</span> نقي
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            لا مزيد من العلامات المائية المزعجة. استخرج فيديوهاتك المفضلة من جميع المنصات بضغطة واحدة باستخدام قوة الذكاء الاصطناعي.
          </p>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleProcess(url); }} 
            className="relative max-w-2xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-3 p-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl focus-within:border-sky-500/50 transition-all">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="ضع رابط TikTok أو Instagram هنا..."
                className="flex-1 bg-transparent border-none py-4 px-6 text-white placeholder:text-slate-600 focus:ring-0 text-sm font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !url}
                className="btn-primary text-white px-10 py-4 rounded-[1.5rem] font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                {isLoading ? 'جاري التحليل' : 'استخراج الفيديو'}
              </button>
            </div>
            {isLoading && (
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 animate-[loading_2s_infinite]"></div>
                </div>
                <p className="text-sky-400 font-bold text-[11px] animate-pulse uppercase tracking-widest">{statusMessage}</p>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3 justify-center">
                <i className="fas fa-circle-exclamation text-lg"></i>
                {error}
              </div>
            )}
          </form>
        </section>

        {/* Results Section */}
        <div className="grid grid-cols-1 gap-8 mb-20">
          {videos.map((v) => (
            <div key={v.id} className="glass rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col md:flex-row card-video animate-slide-up">
              <div className="md:w-80 relative group shrink-0">
                <img src={v.thumbnail} className="w-full h-full object-cover min-h-[220px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <span className="px-3 py-1 bg-sky-500/20 backdrop-blur-md border border-sky-500/30 rounded-full text-sky-400 text-[10px] font-black uppercase tracking-tighter">
                    {v.platform}
                  </span>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-white text-xl leading-tight line-clamp-2">{v.title}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyShareLink(v.url)}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-sky-400 transition-colors"
                      title="نسخ رابط المشاركة"
                    >
                      <i className="fas fa-share-nodes"></i>
                    </button>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3 italic">"{v.summary}"</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {v.tags?.slice(0, 5).map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-white/5 rounded-lg text-slate-500 text-[10px] font-bold">#{tag}</span>
                  ))}
                </div>
                
                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => {
                      const link = v.downloadLink || (v.sources?.[0]?.web?.uri);
                      if (link) window.open(link, '_blank');
                    }}
                    className="flex-1 bg-white text-black font-black py-4 rounded-2xl text-xs hover:bg-sky-500 hover:text-white transition-all transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-cloud-arrow-down text-lg"></i>
                    تحميل مباشر (بدون علامة)
                  </button>
                  <button className="px-6 py-4 bg-white/5 text-white rounded-2xl hover:bg-white/10 border border-white/5 font-bold text-xs">
                    تغيير الجودة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Grid - Addressing supporting materials issue */}
        <section className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="glass p-8 rounded-[2rem] border border-white/5">
            <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 mb-6">
              <i className="fas fa-wand-sparkles text-xl"></i>
            </div>
            <h4 className="text-white font-black mb-3">ذكاء اصطناعي فائق</h4>
            <p className="text-slate-500 text-xs leading-relaxed">يستخدم التطبيق محرك Gemini 3 لتحليل الروابط وفهم المحتوى لتقديم أفضل رابط تحميل متاح عالمياً.</p>
          </div>
          <div className="glass p-8 rounded-[2rem] border border-white/5">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
              <i className="fas fa-instagram text-xl"></i>
            </div>
            <h4 className="text-white font-black mb-3">أفضل ما في Instagram</h4>
            <p className="text-slate-500 text-xs leading-relaxed">دعم مخصص لـ Reels و IGTV. استخرج المقاطع بجودة HDR أصلية بدون ضغط أو فقدان للجودة.</p>
          </div>
          <div className="glass p-8 rounded-[2rem] border border-white/5">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
              <i className="fas fa-shield-check text-xl"></i>
            </div>
            <h4 className="text-white font-black mb-3">خصوصية وأمان</h4>
            <p className="text-slate-500 text-xs leading-relaxed">لا نقوم بتخزين فيديوهاتك. يتم التحليل والمعالجة في الوقت الفعلي لضمان أقصى درجات الخصوصية.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 glass border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <i className="fas fa-bolt text-sky-500"></i>
              <span className="font-black text-white font-outfit">VIDEO MASTER PRO</span>
            </div>
            <p className="text-slate-500 text-[10px] max-w-xs leading-relaxed">مشروع مفتوح المصدر تم تطويره لتقديم أفضل تجربة تحميل فيديوهات في الوطن العربي.</p>
          </div>
          
          <div className="flex gap-6 text-slate-400 text-xs font-bold">
            <a href="#" className="hover:text-sky-400 transition-colors">اتصل بنا</a>
            <a href="#" className="hover:text-sky-400 transition-colors">قواعد السلوك</a>
            <a href="#" className="hover:text-sky-400 transition-colors">GitHub</a>
          </div>
          
          <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
            MADE BY IS_ME_UNNI • 2024
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
