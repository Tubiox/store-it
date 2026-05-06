import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-rose-500 to-red-400 p-10 lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center">
          <div className="space-y-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/icons/logo-brand.svg"
                alt="SecureIt Logo"
                width={68}
                height={68}
                className="object-contain opacity-100"
              />

              <h1 className="text-3xl font-semibold tracking-tight text-white">
                SecureIt
              </h1>
            </div>

            <div className="space-y-5 text-white">
              <h1 className="text-[34px] font-semibold leading-[1.1] tracking-tight">
                Your data.
                <br />
                Encrypted. Protected.
              </h1>
              <p className="text-[15px] text-white/80 max-w-xs leading-relaxed">
                Private cloud storage with secure access, encrypted uploads, and protected sharing.
              </p>

              <div className="h-1 w-10 bg-white/40 rounded-full" />
            </div>

            <Image
              src="/assets/images/files.png"
              alt="files"
              width={342}
              height={342}
              className="opacity-90 max-w-[280px] mx-auto mt-6"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;
