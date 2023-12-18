"use client"
import Lottie from 'lottie-react';
import React, { useState, useEffect, useRef } from 'react';
import { API_SOCIAL_URL } from '../api/constants';
import Modal from './Modal';
import animationData from '../../assets/animations/cursorAni.json'
import { authFetch } from '../api/storage/authFetch';
import { motion } from 'framer-motion';
import { CornerDownLeft } from 'lucide-react';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
interface Bid {
  id: string;
  amount: number;
  bidderName: string;
  created: string;
}

interface Profile {
  name: string;
  email: string;
  avatar: string;
  credits: number;
  wins: string[];
  _count: {
    listings: number;
  };
}

interface Listing {
  id: string;
  title: string;
  description: string;
  highestBid: number;
  created: string;
  endsAt: string;
  media: string[];
  seller: {
    name: string;
  };
  bids: Bid[];
}


const NewestItems: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [bidAmounts, setBidAmounts] = useState<{ [key: string]: string }>({});
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
  const [animationSize, setAnimationSize] = useState({ width: 0, height: 0 });
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredImageOffset, setHoveredImageOffset] = useState({ left: 0, top: 0 });
  const animationRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const handleImageHover = (imageId: string) => {
    setHoveredImageId(imageId);
    const hoveredElement = document.getElementById(`img-${imageId}`);
    if (hoveredElement) {
      const { left, top } = hoveredElement.getBoundingClientRect();
      setHoveredImageOffset({ left, top });
    }
  };

  const handleImageLeave = () => {
    setHoveredImageId(null);
  };

  const handleAnimationSize = () => {
    if (animationRef.current) {
      const { offsetWidth, offsetHeight } = animationRef.current;
      setAnimationSize({ width: offsetWidth, height: offsetHeight });
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch(`${API_SOCIAL_URL}/listings?_seller=true&_bids=true`);
      if (!response.ok) {
        throw new Error(`Error fetching listings: ${response.statusText}`);
      }
      const data: Listing[] = await response.json();
      const sortedListings = data.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      setListings(sortedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);
  const screenWidth = window.innerWidth;


  useEffect(() => {
    const storedUser = localStorage.getItem('profile');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);

    } else {
      setUser(null);
      redirect("/")
      setIsLoggedIn(false);
    }
  }, []);


  const handleBid = async (listingId: string) => {
    try {
      const userToken = localStorage.getItem('token');
      console.log('User Token:', userToken);

      if (!userToken) {
        console.error('User token not found');
        return;
      }


      const response = await authFetch(`${API_SOCIAL_URL}/listings/${listingId}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          amount: parseFloat(bidAmounts[listingId] || '0'),
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from the response
        console.error('Error placing bid:', errorMessage);
        throw new Error(`Error placing bid: ${errorMessage}`);
      }

      toast.success(`Bid successful on ${bidAmounts[listingId]}`);

      // Clear the bid amount for the specific listing
      setBidAmounts(prevBidAmounts => ({
        ...prevBidAmounts,
        [listingId]: '',
      }));

      fetchListings();
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };




  const openModal = (item: Listing) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };


  const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };


  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className=' md:flex justify-center items-center w-full h-screen mb-40'>
      <div className=' flex flex-co mt-10 md:mt-0 md:mb-20  gap-1 md:gap-2 flex-wrap flex-grow flex-row-reverse justify-between items-between h-screen md:h-full '>
        <h6 className='mt-32 absolute'>Newest Items<CornerDownLeft /></h6>
        <div className='flex  flex-wrap flex-grow justify-between md:gap-3 h-screen'>
          {listings.slice(0, screenWidth <= 1024 ? 2 : 4).map((listing) => (
            <motion.div
              variants={fadeInVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              key={listing.id}
              className="flex flex-col mt-32 h-[25%  md:w-1/2 px-2 mb-4 w-full justify-between sm:justify-between  sm:h-[280px]  md:h-[230px] lg:h-[750px] lg:w-[400px] relative"
            >
              {/* Lottie Cursor */}
              {hoveredImageId === listing.id && (
                <div
                  style={{ position: 'absolute', zIndex: 10 }}
                  ref={animationRef}
                  onMouseMove={(e) => e.stopPropagation()} // Prevents the cursor from affecting the animation position
                >
                  <Lottie
                    animationData={animationData}
                    onComplete={handleAnimationSize}
                    style={{
                      position: 'absolute',
                      left: cursorPosition.x - hoveredImageOffset.left,
                      top: cursorPosition.y - hoveredImageOffset.top * 1,
                      pointerEvents: 'none',
                      width: '50px', // Adjust the size as needed
                      height: 'auto',
                    }}
                  />
                </div>
              )}
              <img
                id={`img-${listing.id}`}
                src={listing.media[0]}
                alt={`Item ${listing.title}`}
                className="w-full h-auto md:h-[300px] lg:h-[400px] xl:h-[500px] object-cover cursor-none"
                onClick={() => openModal(listing)}
                onMouseEnter={() => handleImageHover(listing.id || '')}
                onMouseLeave={handleImageLeave}
              />
              <div className="flex flex-col ">
                <h6 className="text-xl font-bold mb-2">{listing.title}</h6>
                <h2 className='text-sm '>{listing.description}</h2>
                <h6 className='text-sm'>Seller: {listing.seller?.name || 'Unknown Seller'}</h6>
                <h2>Current highest bid $ {listing.bids && listing.bids.length > 0
                  ? Math.max(...listing.bids.map(bid => bid.amount)).toFixed(2)
                  : 'No bids yet'}
                </h2>
                {new Date(listing.endsAt) < new Date() ? (
                  <h6>Auction ended at {formatDateTime(listing.endsAt)}</h6>
                ) : (
                  <h6>{`Listing Ends At: ${formatDateTime(listing.endsAt)}`}</h6>
                )}
              </div>
              <div className='flex flex-col md:mt-4'>
                <div className='flex gap-2'>
                  <input
                    type="number"
                    className='border p-2 rounded-3xl'
                    value={bidAmounts[listing.id] || ''}
                    onChange={(e) => setBidAmounts((prevBidAmounts) => ({ ...prevBidAmounts, [listing.id]: e.target.value }))}
                    placeholder="Enter your bid"
                  />
                  <button
                    className='bg-green-500 text-white px-4 py-2 rounded-3xl'
                    onClick={() => handleBid(listing.id)}
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          imageURL={selectedItem.media[0]}
          madeBy={selectedItem.seller.name}
        >
          <img src={selectedItem.media[0]} alt={`Item ${selectedItem.title}`} className="w-full object-cover md:h-[70%]" />
          <h1>{selectedItem.title}</h1>
          <p>{selectedItem.description}</p>
          <p>Seller: {selectedItem.seller.name}</p>
          <h2>Current highest bid $  {selectedItem.bids && selectedItem.bids.length > 0
            ? Math.max(...selectedItem.bids.map(bid => bid.amount)).toFixed(2)
            : 'No bids yet'}
          </h2>

        </Modal>
      )}
    </div>
  );
};

export default NewestItems;