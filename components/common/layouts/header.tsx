"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import UserDropDown from "@/components/user-drop-down";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium ${pathname === link.href ? "text-primary" : ""
                }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/learnings">
                <Button variant="outline" size="sm">
                  Learnings
                </Button>
              </Link>
          <UserDropDown />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${pathname === link.href ? "text-primary" : ""
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <UserDropDown />
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;