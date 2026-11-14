import { useState } from "react";
import { useNavigate } from "react-router";
import { User } from "lucide-react";
import logoImg from "@/imports/LOGO01.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const F = { fontFamily: "'Vazirmatn', sans-serif" };

export function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  const handleNext = () => {
    navigate("/otp", { state: { phone: phone || "09123456789" } });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white flex flex-col" style={F}>

      {/* Logo */}
      <div className="flex justify-center pt-10 pb-6">
        <ImageWithFallback src={logoImg} alt="کنسرسیوم کاغذدیواری" className="h-16 w-auto object-contain" />
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-24">
        <div className="w-full max-w-[320px] flex flex-col gap-5">

          {/* Title */}
          <h1 className="text-xl font-black text-gray-900 text-center" style={F}>
            ورود یا ثبت نام
          </h1>

          {/* Phone input */}
          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white">
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="09"
              className="flex-1 px-5 py-3.5 text-sm bg-transparent outline-none text-right placeholder-gray-400"
              style={F}
              dir="ltr"
            />
            <div className="w-px h-6 bg-gray-300 shrink-0" />
            <div className="px-4 flex items-center justify-center">
              <User size={18} className="text-gray-500" />
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="w-full text-white font-bold py-4 rounded-full transition-colors text-base"
            style={{ ...F, backgroundColor: "#370080" }}
          >
            بعدی
          </button>

          {/* Back link */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-center transition-colors"
            style={{ ...F, color: "#370080" }}
          >
            بازگشت به صفحه قبل
          </button>

        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-2 pb-8 px-6">
        <p className="text-xs text-gray-500 text-center" style={F}>
          ورود شما به معنای پذیرش کنسرسیوم{" "}
          <span className="text-pink-500 cursor-pointer hover:underline">شرایط و قوانین</span>{" "}
          است
        </p>
        <span className="text-xs text-gray-300" style={F}>V 1.2.40</span>
      </div>

    </div>
  );
}
