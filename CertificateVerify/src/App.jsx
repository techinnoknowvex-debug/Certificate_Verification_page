import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import VerifyPage from './verify';
import logo from './assets/logo.png';




function Home() {
  const [verificationId, setVerificationID] = useState("");
  const navigate = useNavigate();

  const Verify = (e) => {
    e.preventDefault();
    if (verificationId.trim() !== "") {
      navigate(`/verify/${verificationId}`);
    }
  }

  return (
    <div className="bg-cream min-h-screen font-sans text-gray-800">
      {/* Header */}
      <header className="bg-gray-200 text-center py-2 border-b border-gray-300 flex flex-col items-center gap-1">
        <img src={logo} alt="Innoknowvex logo" className="h-8" />
        <h1 className="text-lg font-serif text-gray-700 tracking-widest font-bold">ACADEMIX</h1>
        <p className="text-xs text-gray-500 tracking-wider uppercase">Certificate Verification Portal</p>
      </header>

      {/* Main Content */}
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Verification Form Card */}
          <div className="bg-black rounded-xl p-1 bg-gradient-to-br from-orange-400 via-orange-600 to-orange-400 shadow-2xl animate-fadeUp">
            <div className="bg-black rounded-lg p-10">
              {/* Decorative Top Element */}
              <div className="flex items-center justify-center gap-3 mb-8 opacity-60">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
              </div>

              {/* Form Title */}
              <div className="text-center mb-8">
                <h2 className="text-orange-400 uppercase text-xs tracking-widest mb-2">Verify Your Certificate</h2>
                <p className="text-white/60 text-sm">Enter your verification ID below</p>
              </div>

              {/* Form */}
              <form onSubmit={Verify} className="space-y-6">
                <div>
                  <label className="block text-white/70 text-xs uppercase tracking-wider mb-3">Verification ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g., CERT-2026-12345" 
                    value={verificationId} 
                    onChange={(e) => setVerificationID(e.target.value)}
                    className="w-full bg-white/10 border border-orange-400/50 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30 transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-black font-serif font-semibold py-3 rounded-lg uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-orange-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!verificationId.trim()}
                >
                  Verify Certificate
                </button>
              </form>

              {/* Decorative Bottom Element */}
              <div className="flex items-center justify-center gap-3 mt-8 opacity-60">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
              </div>

              {/* Help Text */}
              <p className="text-center text-white/40 text-xs mt-6 tracking-wide">
                Certificate authenticity is verified through our secure database
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-8">
            <p className="text-white/50 text-sm">© 2026 ACADEMIX Institute of Excellence</p>
            <p className="text-orange-400/60 text-xs mt-2 tracking-wider">All certificates are officially verified</p>
          </div>
        </div>
      </main>
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify/:id" element={<VerifyPage />} />
      </Routes>
    </Router>
  );
}