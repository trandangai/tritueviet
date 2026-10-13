import React, { useState } from 'react';
import { User } from 'firebase/auth';

interface HeaderProps {
  onOpenConsultation: () => void;
  onOpenAdmin: () => void;
  currentUser: User | null;
  onGoogleSignIn: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConsultation,
  onOpenAdmin,
  currentUser,
  onGoogleSignIn,
  onLogout,
  isLoggingIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Học Thêm', href: '#hoc-them', icon: 'fa-book-open' },
    { name: 'Bán Trú', href: '#ban-tru', icon: 'fa-shield-heart' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F294A] text-white shadow-lg border-b border-blue-900/40 backdrop-blur-md bg-[#0F294A]/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenAdmin}
              title="Nhấn để mở Quản Trị"
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#0F294A] shadow-md shadow-amber-500/20 hover:scale-105 transition cursor-pointer"
            >
              <i className="fa-solid fa-graduation-cap text-2xl"></i>
            </button>
            <a href="#" className="group">
              <span className="block text-xs font-semibold uppercase tracking-wider text-amber-300">
                Trung Tâm Giáo Dục
              </span>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white group-hover:text-amber-200 transition">
                TRÍ TUỆ <span className="font-light text-slate-300">|</span> <span className="text-amber-400 font-bold">DẠY THÊM & BÁN TRÚ</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-200 hover:text-amber-400 transition-colors flex items-center gap-2"
              >
                <i className={`fa-solid ${link.icon} text-amber-400/80 text-xs`}></i>
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Google Sign-in / User Info */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-blue-950/60 border border-blue-800/80 px-3 py-1.5 rounded-xl">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-amber-400"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center text-xs font-bold">
                    {currentUser.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                <span className="text-xs font-medium text-slate-200 max-w-[100px] truncate">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Đăng xuất Google"
                  className="text-slate-400 hover:text-rose-400 p-1 transition cursor-pointer text-xs ml-1"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition border border-slate-200 cursor-pointer disabled:opacity-50"
                title="Đăng nhập Google Workspace để đồng bộ Sheets, Drive & Calendar"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.26v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.27c-.24-.73-.38-1.5-.38-2.27s.14-1.54.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.06-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.18 15.24 0 12 0 7.36 0 3.26 2.64 1.26 6.58l4.06 3.15c.94-2.83 3.58-4.96 6.68-4.96z"
                  />
                </svg>
                <span>{isLoggingIn ? 'Đang kết nối...' : 'Google'}</span>
              </button>
            )}

            {/* CTA Đăng Ký Tư Vấn */}
            <button
              type="button"
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <i className="fa-solid fa-file-signature"></i>
              <span>Đăng Ký Tư Vấn</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onOpenConsultation}
              className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
            >
              Đăng ký
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white"
              aria-label="Toggle menu"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-900/60 space-y-3 animate-fadeIn">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-200 hover:text-amber-400 transition"
              >
                <i className={`fa-solid ${link.icon} mr-2 text-amber-400`}></i>
                {link.name}
              </a>
            ))}

            <div className="pt-3 border-t border-blue-900/60 flex flex-col gap-2">
              {currentUser ? (
                <div className="flex items-center justify-between bg-blue-950 p-2.5 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    {currentUser.photoURL && (
                      <img
                        src={currentUser.photoURL}
                        alt="User"
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-slate-200 truncate">
                      {currentUser.displayName || currentUser.email}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-rose-400 font-semibold px-2 py-1"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGoogleSignIn();
                  }}
                  className="w-full py-2 bg-white text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
                >
                  <i className="fa-brands fa-google text-red-500"></i>
                  <span>Đăng nhập Google Workspace</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
