"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

/** Generate two random integers between 1–9 for the CAPTCHA */
function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

/** Safe static placeholder — used during SSR to avoid hydration mismatch */
const CAPTCHA_PLACEHOLDER = { a: 0, b: 0, answer: 0 };

export default function SignInForm() {
  const router = useRouter();
  const [pgwNip, setPgwNip] = useState("");
  const [pgwPassword, setPgwPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Captcha: start with static placeholder so SSR and initial client render match,
  // then generate a real captcha after mount (client-only).
  const [captcha, setCaptcha] = useState(CAPTCHA_PLACEHOLDER);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaMounted, setCaptchaMounted] = useState(false);

  useEffect(() => {
    setCaptcha(generateCaptcha());
    setCaptchaMounted(true);
  }, []);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCaptchaError(false);

    // Validate captcha first
    if (Number(captchaInput) !== captcha.answer) {
      setCaptchaError(true);
      refreshCaptcha();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pgw_nip: pgwNip,
          pgw_password: pgwPassword,
          rememberMe: isChecked,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Login gagal, silakan periksa NIP dan password Anda.");
        setLoading(false);
        refreshCaptcha();
        return;
      }

      // Redirect to dashboard on successful login
      window.location.href = "/";
    } catch (err: any) {
      setError("Terjadi kesalahan jaringan/server: " + (err.message || err));
      setLoading(false);
      refreshCaptcha();
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">

      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In Pegawai
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukkan NIP dan Password Pegawai Anda untuk masuk!
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    NIP Pegawai <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Masukkan NIP Pegawai (contoh: 123456)"
                    type="text"
                    value={pgwNip}
                    onChange={(e) => setPgwNip(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={pgwPassword}
                      onChange={(e) => setPgwPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>

                {/* CAPTCHA: penjumlahan dua angka */}
                <div>
                  <Label>
                    Verifikasi CAPTCHA <span className="text-error-500">*</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    {/* Soal — hanya tampil setelah mount (client-only) */}
                    <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 min-w-[130px] select-none">
                      {captchaMounted ? (
                        <>
                          <span className="text-lg font-bold text-gray-800 dark:text-white tabular-nums">{captcha.a}</span>
                          <span className="text-lg font-bold text-brand-500">+</span>
                          <span className="text-lg font-bold text-gray-800 dark:text-white tabular-nums">{captcha.b}</span>
                          <span className="text-lg font-bold text-gray-400">=</span>
                          <span className="text-lg font-bold text-gray-400">?</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 animate-pulse">...</span>
                      )}
                    </div>
                    {/* Input jawaban */}
                    <div className="flex-1">
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Jawaban"
                        value={captchaInput}
                        onChange={(e) => { setCaptchaInput(e.target.value); setCaptchaError(false); }}
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-gray-800 dark:text-white ${captchaError
                          ? "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500"
                          : "border-gray-300 bg-white dark:border-gray-700"
                          }`}
                      />
                    </div>
                    {/* Refresh button */}
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      title="Ganti soal CAPTCHA"
                      className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                  {captchaError && (
                    <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                      Jawaban CAPTCHA salah. Silakan coba lagi.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Ingat saya
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={loading}>
                    {loading ? "Memproses..." : "Sign In"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              {/* <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Belum punya akun pegawai?{" "}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium"
                >
                  Daftar di sini
                </Link>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
