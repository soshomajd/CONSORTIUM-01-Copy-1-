import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Mail } from "lucide-react";
import logoImg from "@/imports/LOGO01.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { setUser } from "@/app/components/Header";

const F = { fontFamily: "'Vazirmatn', sans-serif" };

function toFarsiDigits(n: number) {
  return n.toString().replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[+d]);
}

function formatTimer(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${toFarsiDigits(+m)}:${toFarsiDigits(+s)}`;
}

export function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone: string = (location.state as { phone?: string })?.phone ?? "09123456789";

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(109); // 1:49

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleConfirm = () => {
    setUser("سهیل شکوهی");
    navigate("/");
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(109);
    setOtp("");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white flex flex-col" style={F}>

      {/* Logo */}
      <div className="flex justify-center pt-10 pb-6">
        <ImageWithFallback src={logoImg} alt="کنسرسیوم کاغذدیواری" className="h-14 w-auto object-contain" />
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-24">
        <div className="w-full max-w-[300px] flex flex-col gap-5">

          {/* Edit phone link */}
          <button
            onClick={() => navigate("/login")}
            className="text-gray-400 text-center hover:text-gray-600 transition-colors mx-[0px] mt-[0px] mb-[20px] font-normal text-[16px]"
            style={F}
          >
            ویرایش شماره تلفن <span dir="ltr" className="inline-block">{phone}</span>
          </button>

          {/* OTP input */}
          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white mx-[0px] mt-[0px] mb-[-6px]">
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="کد تایید"
              maxLength={6}
              className="flex-1 px-5 py-3.5 text-sm bg-transparent outline-none text-right placeholder-gray-400"
              style={F}
            />
            <div className="w-px h-6 bg-gray-300 shrink-0" />
            <div className="px-4 flex items-center justify-center">
              <Mail size={18} className="text-gray-500" />
            </div>
          </div>

          {/* Confirm button */}
          <button
            onClick={handleConfirm}
            className="w-full text-white font-bold py-4 rounded-full transition-colors text-base"
            style={{ ...F, backgroundColor: "#370080" }}
          >
            تایید
          </button>

          {/* Resend timer */}
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`text-sm text-center transition-colors ${ timer > 0 ? "text-gray-400 cursor-default" : "text-cyan-500 hover:text-cyan-600" } mx-[0px] mt-[-5px] mb-[0px] text-[#370080]`}
            style={F}
          >
            ارسال مجدد کد{" "}
            {timer > 0 && <span dir="ltr" className="inline-block">{formatTimer(timer)}</span>}
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
