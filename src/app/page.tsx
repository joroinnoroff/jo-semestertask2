"use client"
import Image from 'next/image'
import StickySections from '../app/stickySection';
import Lottie from "lottie-react";
import auctionAni from "../assets/animations/auctionanimation.json";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowDown, Plus, Store } from 'lucide-react';

import nLogo from '../app/images/norofflogo.png'

import NewestItems from './components/NewestItems';
import { motion } from 'framer-motion';

interface UserProfile {
  name: string;
  avatar?: string;
  credits?: number;
  listings?: Listing[];
}
interface Bid {
  id: string;
  amount: number;
  bidderName: string;
  created: string;
}

interface Seller {
  name: string;
  email: string;
  avatar: string;
  wins: string[];
}

interface Listing {
  id: string;
  title: string;
  description: string;
  media: string[];
  tags: string[];
  created: string;
  updated: string;
  endsAt: string;
  bids: Bid[];
  seller: Seller;
  _count: {
    bids: number;
  };
}



export default function Home() {


  const [bidAmounts, setBidAmounts] = useState<{ [key: string]: string }>({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);



  useEffect(() => {
    const storedUser = localStorage.getItem("profile");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);

    } else {
      setUser(null);
      setIsLoggedIn(false);

    }
  }, []);





  const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (

    <main>

      {isLoggedIn ? (

        <section className='h-screen'>
          <motion.div
            variants={fadeInVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            className='mt-20 p-20 ease-out h-fit'>
            <div className=''>
              <Image src={nLogo} height={100} width={100} className="bg-[#56BEA3] hidden md:flex  p-3 rounded-2xl w-[400px]" alt='Noroff-logo' />
            </div>
            <h6 className='text-4xl mt-3 ease-out'>
              Welcome {user?.name}
            </h6>
            <Link href={"/viewAll"} className="w-25 lg:w-30 flex">
              <button className='login-btn shadow-2xl flex flex-row p-2 px-3 md:p-2 md:py-8 md:px-20 md:text-3xl text-center rounded-3xl hover:bg-[#53B9F6] bg-[#cae5e0] text-black hover:text-white uppercase transition-all mt-3 mb-3 text-xl z-40 hover:scale-110 items-center'>
                View all
                <div className="door-icon">
                  <Store />
                </div>
              </button>
            </Link>
            <h1 className='text-xl'>Create Listing</h1>
            <Link href={"/create"} className="w-6 flex">
              <button className='login-btn shadow-2xl flex  p-2 px-3 md:p-2 md:py-8 md:px-20 md:text-3xl text-center rounded-3xl hover:bg-[#117665] bg-[#0ec8a9]  hover:text-white uppercase transition-all mt-3 mb-3 text-xl z-40 hover:scale-110 items-center'>
                Here
                <div className="door-icon">
                  <Plus />
                </div>
              </button>
            </Link>

            <div className='mt-10 w-full'>


              <NewestItems />





            </div>


            <div className='absolute h-10 right-0 left-60 md:left-[23rem] lg:left-[35rem] top-[20rem] sm:top-[20rem] lg:top-[50rem] xl:top-[20rem] bottom-40   md:bottom-60 '>
              <Lottie animationData={auctionAni} className="flex items-center justify-center sm:w-[50%]  md:w-3/6 lg:w-5/12 m-auto" />
            </div>


          </motion.div>




        </section>

      ) : (

        <section>
          <motion.div
            variants={fadeInVariants}
            initial='initial'
            animate='animate'
            exit='exit'

            className="container mt-20 h-[60vh] ease-out">
            <h6 className='text-6xl'>
              Welcome to Noroff Auction
            </h6>
            <p className='md:text-lg'>where the thrill of online bidding meets the joy of listing your treasures! Sign up today to unlock a world of possibilities with a generous <span className='font-bold'>1000 credits</span> waiting for you. Dive into our dynamic marketplace where you can bid on a variety of exciting items or showcase your own by creating personalized listings. Whether you're a seasoned bidder or a first-time seller, Noroff Auction is your go-to destination for an interactive and rewarding online experience. Join us now to start exploring, bidding, and listing – the next adventure is just a click away!</p>

            <div className="text-md flex gap-10 items-center ">
              <Link href={"/profile/login"} className="border p-4 md:p-6 md:text-2xl rounded-2xl  text-green-700 hover:text-green-900 hover:scale-105 transition-all">
                <h2>Login</h2>
              </Link>
              <span className="text-xs">Or</span>
              <Link href={"/profile/register"} className="border  p-4 md:p-6 md:text-2xl rounded-2xl text-green-700 hover:text-green-900 hover:scale-105 transition-all ">
                <h2>Register</h2>
              </Link>
            </div>

            <div className='flex items-center justify-center xl:absolute xl:right-0 xl:top-0 xl:bottom-20'>
              <Lottie animationData={auctionAni} className="flex items-center justify-center w-3/4  md:w-5/12 m-auto" />
            </div>

          </motion.div>
          <div>
          </div>

        </section>
      )}




      <div className='h-screen lg:mt-[50rem] container '>
        {!isLoggedIn && (
          <div>
            <p className='mt-52'>When a listing ends, the <span>winning</span> bid amount will be transferred to the seller's credits. All losing bids will be refunded to its original bidder's credits.</p>
            <h6 className='mt-5 text-4xl p-20'>Browse items below <ArrowDown color='green' className='animate-bounce' /></h6>
          </div>
        )}
      </div>



      <StickySections />


      <div className="container ease-out">
        <h6 className='text-4xl ease-in'>
          About Us
        </h6>
        <p>we believe in creating a sustainable future through innovative, green software engineering. As a free-to-use platform, we prioritize accessibility for all users while also championing environmental responsibility. At Noroff Auction, we are committed to minimizing our ecological footprint by adopting energy-efficient practices in our server management. Our dedication to green software engineering ensures that you can enjoy our services guilt-free, knowing that your online activities contribute to a more sustainable and eco-friendly digital landscape. Join us in building a greener tomorrow while enjoying the convenience of a free and user-friendly platform. Together, we can make a positive impact on the world.</p>

      </div >

      <section>
        <div className="container">
          <h6>
            Do you have a question ?
          </h6>
          <h1>Contact us here</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quis, doloremque neque temporibus reprehenderit aliquam sed delectus aspernatur consectetur perspiciatis. Impedit iste necessitatibus hic fugiat doloribus dicta quia vitae perferendis.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quis, doloremque neque temporibus reprehenderit aliquam sed delectus aspernatur consectetur perspiciatis. Impedit iste necessitatibus hic fugiat doloribus dicta quia vitae perferendis.</p>
        </div>
      </section>


    </main >
  )
}