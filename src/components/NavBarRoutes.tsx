"use client";

import { UserButton, auth, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./SearchInput";
import { isTeacher } from "@/lib/teacher";

const navBarRoutes = [{}];

const NavBarRoutes = () => {

  const {userId} = useAuth()  // we use useAuth because this is a client compnent

  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/courses");
  const isSearchPage = pathname ==="/search"

  return (
    <>
    {isSearchPage && (
      <div className="hidden md:block">
        <SearchInput/>
      </div>
    )}
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button size={"sm"} variant={"ghost"}>
            <LogOut className="w-4 h-4 mr-2" />
            Exit
          </Button>
        </Link>
      ) : isTeacher(userId)? (
        <Link href="/teacher/courses">
          <Button size={"sm"} variant={"ghost"}>
            Teacher Mode
          </Button>
        </Link>
      ):null}

      <UserButton afterSignOutUrl="/" />
    </div>
    </>
  );
};

export default NavBarRoutes;
