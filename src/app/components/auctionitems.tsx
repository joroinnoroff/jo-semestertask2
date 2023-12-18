"use client"
import React, { useState, useEffect, useRef } from 'react';
import { API_SOCIAL_URL } from '../api/constants';
import Modal from './Modal';
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/cursorAni.json'
import { motion } from 'framer-motion';
import Link from 'next/link';
import Pagination from './Pagination';
import { authFetch } from '../api/storage/authFetch';
import { toast } from 'sonner';

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



const AuctionItems: React.FC = () => {

  const [bidAmount, setBidAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [lastFiveBids, setLastFiveBids] = useState<Bid[]>([]);

  const [animationSize, setAnimationSize] = useState({ width: 0, height: 0 });
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredImageOffset, setHoveredImageOffset] = useState({ left: 0, top: 0 });
  const animationRef = useRef(null);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const [bidAmounts, setBidAmounts] = useState<{ [key: string]: string }>({});


  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(25); // Set the desired number of items per page
  const fetchListings = async (page: number, itemsPerPage: number, filter?: string) => {
    try {
      const sortField = 'endsAt';
      const sortOrder = 'asc';

      let url = `${API_SOCIAL_URL}/listings?_seller=true&_bids=true&_active=true&_listings=true`;

      // Adjust the URL based on the filter
      if (filter) {
        url += `&filter=${filter}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching listings: ${response.statusText}`);
      }

      let data: Listing[] = await response.json();

      // Apply filtering if necessary
      if (filter === 'mostpopular') {
        // Sort data based on the highest bid amount
        data.sort((a, b) => {
          const highestBidA = a.bids.length > 0 ? Math.max(...a.bids.map(bid => bid.amount)) : 0;
          const highestBidB = b.bids.length > 0 ? Math.max(...b.bids.map(bid => bid.amount)) : 0;
          return highestBidB - highestBidA;
        });
      } else if (filter === 'juststarted') {
        // Add logic to sort data based on start time
        // For example, you can sort by the 'created' field
        data.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
      } else if (filter === 'abouttoend') {
        // Add logic to sort data based on end time
        // For example, you can sort by the 'endsAt' field
        data.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
      }

      // Calculate total count based on the length of listings
      const totalCount = data.length;

      // Set the total pages using Math.ceil
      setTotalPages(Math.ceil(totalCount / itemsPerPage));

      // Calculate offset and limit based on the current page
      const offset = (page - 1) * itemsPerPage;
      const limit = itemsPerPage;

      // Extract the paginated data based on offset and limit
      const paginatedData = data.slice(offset, offset + limit);

      setListings(paginatedData);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  useEffect(() => {
    fetchListings(currentPage, itemsPerPage, filter);
  }, [currentPage, itemsPerPage, filter]);

  const handleClearFilter = () => {
    setFilter(null || undefined);
  };

  useEffect(() => {
    fetchListings(currentPage, itemsPerPage, filter);
  }, [currentPage, totalPages, itemsPerPage, filter]);




  const handlePageClick = (page: number, filter?: string) => {
    setCurrentPage(page);
    setFilter(filter || String); // Update the filter state
    fetchListings(page, itemsPerPage, filter); // Include itemsPerPage in the call
  };



  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchListings(currentPage - 1, itemsPerPage, filter); // Include itemsPerPage
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchListings(currentPage + 1, itemsPerPage, filter); // Include itemsPerPage
    }
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

  const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };



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
  const openModal = (item: Listing) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

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
        const errorMessage = await response.text();
        console.error('Error placing bid:', errorMessage);
        throw new Error(`Error placing bid: ${errorMessage}`);
      }

      toast.success(`Bid successful on ${bidAmounts[listingId]}`);

      setBidAmounts(prevBidAmounts => ({
        ...prevBidAmounts,
        [listingId]: '',
      }));


    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };





  return (
    <div className='h-screen w-full mt-32 p-4 md:p-24 mb-20'>


      <div>


        <div className='flex gap-3 mt-3'>



          <button onClick={() => setFilter('mostpopular')} className="border p-3 rounded-3xl text-sm md:text-lg">
            Most Popular
          </button>
          <button onClick={() => setFilter('juststarted')} className="border p-3 rounded-3xl text-sm md:text-lg">
            Just Started
          </button>
          <button onClick={() => setFilter('abouttoend')} className="border p-3 rounded-3xl text-sm md:text-lg">
            About to End
          </button>
          {filter && (
            <button onClick={handleClearFilter} className="border p-3 rounded-3xl text-sm md:text-lg bg-black text-white">
              Clear Filter X
            </button>
          )}

        </div>
      </div>

      <div className='flex flex-wrap justify-evenly items-center gap-20 h-screen mt-20'>
        {listings.map((listing) => (
          <motion.div
            variants={fadeInVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            key={listing.id}
            className=" md:p-2 md:w-1/2 lg:w-1/4 flex-grow-0" // Add the flex-1 class
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
            <div className='flex flex-col items-baseline'>

              <h6>{listing.title}</h6>
              <h2>
                Description:
              </h2>
              {listing.description}
              <p>Seller: {listing.seller?.name || 'Unknown Seller'}</p>
              {new Date(listing.endsAt) < new Date() ? (
                <h6>Auction ended at {formatDateTime(listing.endsAt)}</h6>
              ) : (
                <h6>{`Listing Ends At: ${formatDateTime(listing.endsAt)}`}</h6>
              )}

              {listing.bids?.length > 0 ? (
                <div>
                  <h2>Highest Bid: ${Math.max(...listing.bids.map((bid) => bid.amount))}</h2>
                </div>
              ) : (
                <h2>No bids yet</h2>
              )}

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
            </div>
          </motion.div>
        ))}

        <Pagination
          currentPage={currentPage}
          handlePageClick={(page) => handlePageClick(page, filter)}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          pageRange={Array.from({ length: totalPages }, (_, i) => i + 1)}
          totalPages={totalPages}
          endIndex={0}
        />
      </div>

      {selectedItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          imageURL={selectedItem.media[0]}
          madeBy={selectedItem.seller?.name || 'Unknown Seller'}
        >
          {/* Render all bids in the modal */}

          <div className='flex md:w-full gap-3 sm:w-[45vh]  flex-col '>
            <div className='flex flex-col md:flex-row m-auto justify-center gap-10'>
              <div>
                <img
                  id={`img-${selectedItem.id}`}
                  src={selectedItem.media[0]}
                  alt={`Item ${selectedItem.title}`}
                  className="w-full h-auto md:w-[600px] lg:h-[400px] xl:h-[500px] object-cover cursor-none"
                />
                <h6 className='w-1/5 mt-3'>{selectedItem.title}</h6>
              </div>
              <div className='flex flex-col m-auto gap-3'>
                <h3>{selectedItem.description}</h3>
                {selectedItem.bids
                  ?.sort((a, b) => b.amount - a.amount) // Sort bids in descending order based on amount
                  .map((bid, index, array) => (
                    <div key={`${bid.amount}-${bid.id}`} className="flex-col border-b">
                      <h6 className=''>
                        {index === 0 ? 'Current Highest Bid by:' : 'Last Bids by:'}
                      </h6>
                      <span className='font-bold text-green-400'>{bid.bidderName} : </span>
                      ${bid.amount}
                    </div>
                  ))}


                <div className='flex gap-2'>
                  <div>
                    <input
                      type="number"
                      className='border p-2 rounded-3xl'
                      value={bidAmounts[selectedItem.id] || ''}
                      onChange={(e) => setBidAmounts((prevBidAmounts) => ({ ...prevBidAmounts, [selectedItem.id]: e.target.value }))}
                      placeholder="Enter your bid"
                    />
                    <button
                      className='bg-green-500 text-white px-4 py-2 rounded-3xl'
                      onClick={() => handleBid(selectedItem.id)}
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              </div>





            </div>
          </div>
        </Modal>
      )}







    </div>


  );
};

export default AuctionItems;