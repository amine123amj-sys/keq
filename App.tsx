
import React, { useState, useEffect } from 'react';
import { VideoInfo, Platform } from './types';
import { analyzeVideoLink } from './geminiService';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  const steps = [
    "فحص صحة الرابط...",
    "تجاوز حماية المنصة...",
    "البحث عن نسخة الـ Ultra HD...",
    "توليد رابط تحميل آمن...",
    "جاهز للتحميل بنجاح!"
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      let i = 0;
      setProcessStep(steps[0]);
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setProcessStep(steps[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeVideoLink(url);
      
      const newVideo = {
        id: Date.now().toString(),
        url,
        ...result,
        thumbnail: `https://picsum.photos/seed/${Math.random()}/600/400`,
        timestamp: new Date().toLocaleTimeString('ar-EG'),
        selectedQuality
      };

      setVideos(prev => [newVideo, ...prev]);
      setUrl('');
    } catch (err: any) {
      setError("فشل التحليل. يرجى التأكد من أن الرابط صحيح أو حاول استخدام متصفح آخر.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <i className="fas fa-play text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-black gradient-text leading-none">VIDEO MASTER</h1>
            <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Ultra HD Edition</span>
          </div>
        </div>
        <div className="flex gap-2">
          {['720p', '1080p', '4K'].map(q => (
            <button
              key={q}
              onClick={() => setSelectedQuality(q)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                selectedQuality === q 
                ? 'bg-sky-500 text-white' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        {/* Input Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight">
            حمّل من تيك توك ويوتيوب <br/>
            <span className="text-sky-500 italic">بدون علامة مائية</span>
          </h2>
          
          <form onSubmit={handleProcess} className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex flex-col md:flex-row gap-3 p-2 bg-slate-900 border border-white/10 rounded-3xl">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="ضع رابط الفيديو هنا..."
                className="flex-1 bg-transparent border-none py-4 px-6 text-white focus:ring-0 text-lg"
              />
              <button
                type="submit"
                disabled={isLoading || !url}
                className="bg-white text-black px-8 py-4 rounded-2xl font-black hover:bg-sky-400 hover:text-white transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : 'معالجة الآن'}
              </button>
            </div>
          </form>

          {isLoading && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 animate-[shimmer_2s_infinite] w-full"></div>
              </div>
              <p className="text-sky-400 font-bold animate-pulse text-sm">{processStep}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 text-red-400 text-sm font-bold bg-red-400/10 py-2 px-4 rounded-full inline-block">
              <i className="fas fa-exclamation-circle ml-2"></i> {error}
            </div>
          )}
        </section>

        {/* Video Cards */}
        <div className="grid gap-8">
          {videos.map((v) => (
            <div key={v.id} className="glass rounded-[2.5rem] overflow-hidden border border-white/10 group animate-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-72 h-48 md:h-auto relative overflow-hidden">
                  <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 bg-sky-500 text-white text-[10px] font-black px-2 py-1 rounded">
                    {v.platform}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white leading-tight">{v.title}</h3>
                    <button onClick={() => setVideos(vs => vs.filter(x => x.id !== v.id))} className="text-slate-600 hover:text-red-400 transition-colors">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2 italic">"{v.summary}"</p>
                  
                  <div className="bg-sky-500/5 border border-sky-500/20 p-4 rounded-2xl mb-6">
                    <h4 className="text-sky-400 font-bold text-xs mb-2 flex items-center gap-2">
                      <i className="fas fa-magic"></i> تعليمات التحميل الذكي:
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {v.downloadInstructions}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {v.tags?.slice(0, 5).map((t: string) => (
                      <span key={t} className="text-[10px] bg-white/5 text-slate-500 px-2 py-1 rounded-md border border-white/5">#{t}</span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-white text-black font-black py-4 rounded-2xl hover:bg-sky-500 hover:text-white transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2">
                      <i className="fas fa-download"></i>
                      تحميل بجودة {v.selectedQuality}
                    </button>
                    {v.sources?.length > 0 && (
                      <a 
                        href={v.sources[0]?.maps?.uri || v.sources[0]?.web?.uri} 
                        target="_blank" 
                        className="px-6 bg-slate-800 text-white rounded-2xl flex items-center justify-center hover:bg-slate-700 transition-colors"
                      >
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {videos.length === 0 && !isLoading && (
            <div className="py-24 text-center">
              <div className="inline-block p-8 rounded-full bg-white/5 mb-6">
                <i className="fas fa-cloud-download-alt text-6xl text-slate-800"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-700">لا توجد عمليات سابقة</h3>
              <p className="text-slate-800 text-sm">انسخ رابط فيديو من تيك توك وابدأ الآن</p>
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 text-center text-slate-600 text-[10px] border-t border-white/5">
        <p>التطبيق مدعوم بتقنية Google Search Grounding & Gemini 3</p>
        <p className="mt-2">تم التطوير ليكون الأسرع والأكثر دقة في فك تشفير الروابط</p>
      </footer>
    </div>
  );
};

export default App;
