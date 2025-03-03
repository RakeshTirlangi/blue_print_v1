"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { LogIn, Menu } from "lucide-react";
import { UserDetailsContext } from "@/context/UserDetailsContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const context = useContext(UserDetailsContext);
  const userDetail = context?.userDetail;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between py-4">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            width={150}
            height={80}
            alt="Blue Print Logo"
            className="object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        {!userDetail && (
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
              Sign In
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600">Get Started</Button>
          </nav>
        )}

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </Button>
        </div>

        {isMenuOpen && !userDetail (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
            <div className="flex flex-col items-center py-4 space-y-4">
              <Button
                variant="ghost"
                className="w-full text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Button>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;