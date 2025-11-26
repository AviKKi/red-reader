"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold text-xl">RedReader</span>
                </Link>
                <div className="flex items-center space-x-4">
                    <Link href="/saved">
                        <Button variant="ghost">Saved</Button>
                    </Link>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden sm:inline-block">
                                {user.email}
                            </span>
                            <Button variant="outline" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button>Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
