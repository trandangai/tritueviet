import React, { useState, useEffect } from 'react';

export const FloatingActions: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside aria-label="Hỗ trợ nhanh" className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-3">
      {/* Scroll To Top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          title="Lên đầu trang"
          className="w-11 h-11 rounded-full bg-slate-800/90 hover:bg-slate-900 text-white shadow-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 border border-slate-700 cursor-pointer"
        >
          <i className="fa-solid fa-arrow-up text-sm"></i>
        </button>
      )}

      {/* Zalo Contact */}
      <a
        href="https://zalo.me/0988389302"
        target="_blank"
        rel="noreferrer"
        title="Nhắn tin Zalo tư vấn (0988 389 302)"
        className="w-12 h-12 rounded-full bg-[#0068FF] text-white shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 relative group"
      >
        <span className="font-extrabold text-sm tracking-tight">Zalo</span>
        <span className="absolute right-14 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md hidden group-hover:block transition">
          Nhắn tin Zalo: 0988 389 302
        </span>
      </a>

      {/* Hotline Call Button */}
      <a
        href="tel:0988389302"
        title="Gọi điện hotline 0988 389 302"
        className="w-13 h-13 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 relative group animate-bounce"
      >
        <i className="fa-solid fa-phone text-lg"></i>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white"></span>
        <span className="absolute right-15 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md hidden group-hover:block transition">
          Hotline: 0988 389 302
        </span>
      </a>
    </aside>
  );
};
