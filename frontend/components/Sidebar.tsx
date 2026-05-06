"use client";

import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/icons/logo-brand.svg"
            alt="SecureIt Logo"
            width={52}
            height={52}
            className="object-contain"
          />

          <h1 className="text-2xl font-semibold tracking-tight text-[#f76b72]">
            SecureIt
          </h1>
        </div>

        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === url && "shad-active",
                )}
              >
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn(
                    "nav-icon",
                    pathname === url && "nav-icon-active",
                  )}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <Image
        src="/assets/images/files-2.png"
        alt="illustration"
        width={506}
        height={418}
        className="w-full opacity-90"
      />
    </aside>
  );
};

export default Sidebar;