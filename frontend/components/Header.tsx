"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";

const Header = () => {
  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    window.location.href = "/sign-in";
  };

  return (
    <header className="header">
      <Search />

      <div className="header-wrapper">
        <FileUploader />

        <Button onClick={handleLogout} className="sign-out-button">
          <Image
            src="/assets/icons/logout.svg"
            alt="logout"
            width={24}
            height={24}
          />
        </Button>
      </div>
    </header>
  );
};

export default Header;