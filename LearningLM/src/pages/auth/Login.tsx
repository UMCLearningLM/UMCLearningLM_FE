import { useState } from 'react';
import GoogleLogin from '../auth/GoogleLogin';

export default function LoginPage() {
  
  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = import.meta.env.VITE_API_BASE_URL + '/auth/google';
  };
  const [isLoading, setIsLoading] = useState(false);
  if(isLoading){
    return <GoogleLogin/>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">
          로그인
        </h1>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-[360px] h-[56px] rounded-[12px] border border-[#D9D9D9] bg-white hover:bg-gray-50 transition"
        >
          <img
            src="/google-logo.svg"
            alt="Google"
            className="w-6 h-6 mr-3"
          />

          <span className="text-[18px] font-medium text-[#3C4043]">
            Google로 로그인
          </span>
        </button>
      </div>
    </div>
  );
}