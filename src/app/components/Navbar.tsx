"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from 'sonner'
import Settings from "./Settings";
import '../globals.css'

import Image from "next/image";


import { X } from "lucide-react";


interface UserProfile {
  name: string;
  avatar?: string;
  credits?: number;

}

export default function Navbar() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("profile");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setCredits(parsedUser.credits);
    } else {
      setUser(null);
      setIsLoggedIn(false);
      setCredits(0);
    }
  }, []);

  useEffect(() => {

    setCredits(user ? user.credits ?? 0 : 0);
  }, [user]);


  const handleLogout = () => {
    localStorage.removeItem('profile');
    localStorage.removeItem('token');
    setUser(null);
    setCredits(0);
    toast.success("Signed Out");
    window.location.href = '/';
  };




  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const menuVars = {
    initial: {
      scaleY: 0,
    },
    animate: {
      scaleY: 1,
      transition: {
        duration: 0.5,
        ease: [0.12, 0, 0.39, 0],
      },
    },
    exit: {
      scaleY: 0,
      transition: {
        delay: 0.5,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const containerVars = {
    initial: {
      transition: {
        staggerChildren: 0.09,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.09,
        staggerDirection: 1,
      },
    },
  };

  return (
    <header className="fixed  top-0 left-0 right-0 z-20 h-f">
      <nav className="flex justify-end items-center flex-wrap py-8 lg:py-4 px-2 w-auto">
        <Link href={"/"}>
          <div className="flex items-center ">
            <h6>Noroff Auction</h6>

          </div>
        </Link>


        <div className="px-4 py-2 ml-2 m-0 rounded-full text-md flex justify-between gap-3 items-center">
          {isLoggedIn ? (
            <>
              <ul className="flex items-center   ">
                <div className="px-4 py-2 ml-2 text-black w-full rounded-full text-md flex justify-between gap-3 items-center">
                  <div className="flex  justify-between gap-3 md:gap-10 w-max items-center">

                    <Link href={"/profile/listings"}>
                      <h1 className="w-max font-light hover:scale-105 hover:font-bold transition-all text-sm md:text-lg">Your Listings</h1>
                    </Link>

                    <Link href={"/profile/bids"}>
                      <h1 className="w-max font-light  hover:scale-105 hover:font-bold transition-all text-sm md:text-lg">Your Bids</h1>
                    </Link>
                    <small className="text-sm flex flex-row">
                      Credit left: {credits}
                    </small>


                    <Link href={"/profile/settings"}>
                      <span className="mr- w-[] flex">


                        {user?.avatar ? (
                          <img src={user.avatar} alt="" className="w-[30px] h-[30px] md:w-[60px] md:h-[40px] rounded-3xl" />
                        ) : (
                          <Settings />
                        )}

                      </span>
                    </Link>
                    <button className="text-sm"
                      onClick={() => handleLogout()}>Sign Out</button>

                  </div>






                </div>
              </ul>

            </>
          ) : (
            <>

            </>
          )}
        </div>


      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed z-999 left-0 top-0 w-full h-screen origin-top bg-blue-500 text-white p-10"
          >
            <div className="flex h-full flex-col">
              <div className="flex justify-between">
                <Image src={""} alt="Logo" width={100} height={100} className="none:invert" />

                <p
                  className="cursor-pointer text-md text-black mt-2"
                  onClick={toggleMenu}
                >
                  <X size={35} />
                </p>
              </div>
              <motion.div
                variants={containerVars}
                initial="initial"
                animate="open"
                exit="initial"
                className="flex flex-col h-full justify-center text-center items-center gap-6 mb-5 z-20 "
              >

              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const mobileLinkVars = {
  initial: {
    y: "30vh",
    transition: {
      duration: 0.5,
      ease: [0.37, 0, 0.63, 1],
    },
  },
  open: {
    y: 0,
    transition: {
      ease: [0, 0.55, 0.45, 1],
      duration: 0.7,
    },
  }
};

const MobileNavLink = ({ title, href }: { title: string; href: string }) => (
  <motion.div variants={mobileLinkVars} className="text-md flex z-20">
    <Link className={`uppercase border p-1 lg:p-2 rounded-md transform hover:bg-blue-300 hover:text-white transition-all text-2xl`} href={href}>
      <h1>{title}</h1>
    </Link>
  </motion.div>
);



