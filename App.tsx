
import React, { useState, useCallback } from 'react';
import { VideoInfo, Platform } from './types';
import { analyzeVideoLink } from './geminiService';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const analysis = await analyzeVideoLink(url);
      
      const newVideo: VideoInfo = {
        id: Math.random().toString(36).substr(2, 9),
        url: url,
        title: analysis.suggestedTitle || "فيديو جديد",
        platform: analysis.platform || Platform.UNKNOWN,
        thumbnail: `https://picsum.photos/seed/${Math.random()}/400/225`,
        status: 'ready',
        summary: analysis.summary,
        tags: analysis.tags,
        downloadUrl: "#", // In a real app, this would be the processed blob or external link
      };

      setVideos(prev => [newVideo, ...prev]);
      setUrl('');
    } catch (err) {
      setError("عذراً، حدث خطأ أثناء تحليل الرابط. تأكد من صحة الرابط وحاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass px-6 py-4 flex justify-between items-center mb-8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
            <i className="fas fa-play text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold gradient-text">فيديو ماستر</h1>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-sky-400 transition-colors">الرئيسية</a>
          <a href="#" className="hover:text-sky-400 transition-colors">عن التطبيق</a>
          <a href="#" className="hover:text-sky-400 transition-colors">الدعم الفني</a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-in fade-in duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">تحميل الفيديوهات بذكاء</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            قم بنسخ الرابط من تيك توك، إنستقرام أو يوتيوب، وسيقوم نظامنا المدعوم بالذكاء الاصطناعي بتحليل الفيديو وتجهيزه للتحميل بدون علامة مائية.
          </p>
        </section>

        {/* Input Section */}
        <section className="glass rounded-3xl p-6 md:p-8 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10"></div>
          
          <form onSubmit={handleDownload} className="relative">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="ضع رابط الفيديو هنا (تيك توك، إنستقرام...)"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-12 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-lg placeholder:text-slate-600"
                />
                <i className="fas fa-link absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
              <button
                type="submit"
                disabled={isLoading || !url}
                className={`px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isLoading 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i>
                    تحميل الآن
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
        </section>

        {/* Features/Guides */}
        {!videos.length && !isLoading && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: 'fa-bolt', title: 'سرعة فائقة', desc: 'تحميل ومعالجة الفيديوهات في ثوانٍ معدودة.' },
              { icon: 'fa-shield-halved', title: 'بدون علامة مائية', desc: 'نضمن لك الحصول على الفيديو بجودته الأصلية وبدون شعارات.' },
              { icon: 'fa-robot', title: 'ذكاء اصطناعي', desc: 'تلخيص ذكي للمحتوى واستخراج الكلمات المفتاحية.' }
            ].map((f, i) => (
              <div key={i} className="glass p-6 rounded-2xl hover:bg-slate-800/50 transition-colors group">
                <i className={`fas ${f.icon} text-3xl text-sky-400 mb-4 group-hover:scale-110 transition-transform`}></i>
                <h3 className="text-xl font-bold mb-2 text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </section>
        )}

        {/* Results Section */}
        <section className="space-y-6">
          {videos.map((video) => (
            <div key={video.id} className="glass rounded-3xl p-6 flex flex-col md:flex-row gap-6 animate-in slide-in-from-bottom-4 duration-500 shadow-xl overflow-hidden group">
              {/* Thumbnail Container */}
              <div className="w-full md:w-72 h-48 rounded-2xl overflow-hidden relative shadow-inner flex-shrink-0">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-sky-400 flex items-center gap-1">
                  <i className={`fab fa-${video.platform.toLowerCase()}`}></i>
                  {video.platform}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                   <button className="bg-white/20 backdrop-blur-lg p-4 rounded-full text-white text-2xl hover:scale-110 transition-transform">
                     <i className="fas fa-play"></i>
                   </button>
                </div>
              </div>

              {/* Content Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white line-clamp-1">{video.title}</h3>
                    <button 
                      onClick={() => removeVideo(video.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                  
                  {video.summary && (
                    <div className="bg-slate-900/50 p-4 rounded-2xl mb-4 border border-slate-800/50">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        <span className="text-sky-400 font-bold block mb-1">🤖 ملخص ذكي:</span>
                        {video.summary}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {video.tags?.map((tag, idx) => (
                      <span key={idx} className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all">
                    <i className="fas fa-download"></i>
                    تحميل بدون علامة مائية
                  </button>
                  <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <i className="fas fa-copy"></i>
                    نسخ الرابط المباشر
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="glass py-12 mt-20 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center">
              <i className="fas fa-play text-white"></i>
            </div>
            <span className="text-xl font-bold gradient-text">فيديو ماستر</span>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
            تطبيق فيديو ماستر هو أداة تعليمية وتجريبية لتحليل المحتوى المرئي باستخدام تقنيات الذكاء الاصطناعي. نحن نشجع على احترام حقوق الملكية الفكرية.
          </p>
          <div className="flex justify-center gap-6 text-slate-400 text-2xl">
            <a href="#" className="hover:text-sky-400 transition-colors"><i className="fab fa-github"></i></a>
            <a href="#" className="hover:text-sky-400 transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-sky-400 transition-colors"><i className="fab fa-instagram"></i></a>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800/50 text-slate-600 text-xs">
            © {new Date().getFullYear()} فيديو ماستر الذكي. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
