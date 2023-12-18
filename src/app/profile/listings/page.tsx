"use client"
import { authFetch } from '@/app/api/storage/authFetch';
import { motion } from 'framer-motion';
import { BadgeDollarSign, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { API_SOCIAL_URL } from '../../api/constants';

// Define the User type
interface User {
  name: string;
  email: string;
  avatar: string;
  credits: number;
  wins: string[];
}

interface Listing {
  id: string;
  title: string;
  description: string;
  highestBid: number;
  media: string[];
  endsAt: string;
  seller: {
    name: string;
  };
  bids: Bid[] | undefined;
}

interface Bid {
  id: string;
  amount: number;
  bidderName: string;
  // Add other bid properties as needed
}

// UserListings component
const UserListings: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userListings, setUserListings] = useState<Listing[]>([]);

  useEffect(() => {
    // Fetch user information when the component mounts
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('profile');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);

          // Fetch user listings with authorization header
          const response = await authFetch(`${API_SOCIAL_URL}/profiles/${parsedUser.name}/listings?_bids=true`, {
            headers: {
              'Authorization': `Bearer ${parsedUser.token}`,
            },
          });

          if (response.ok) {
            const data: Listing[] = await response.json();
            setUserListings(data);
          }
          console.log(response)
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };


    fetchUser(); // Invoke the fetchUser function

    // Cleanup function (optional)
    return () => {
      // Any cleanup logic if needed
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };


  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
  };
  return (
    <div className='mt-32 p-10 '>
      <h6 className='flex gap-2 items-center'>User Listings<BadgeDollarSign /></h6>

      {isLoggedIn && user && (
        <>

          <div className='mt-10 flex  flex-wrap gap-10 m-auto  justify-center'>

            {/* Render other user information as needed */}
            {userListings.map((listing) => (
              <motion.div
                key={listing.id}
                className='flex flex-col items-center p-4 border rounded-md mb-4'
                variants={fadeInVariants}
                initial='initial'
                animate='animate'
                exit='exit'
              >
                <img src={listing.media[0]} alt="Listing" className='mb-2 md:h-[400px]' />
                <h4>{listing.title}</h4>
                <p>{listing.description}</p>
                {new Date(listing.endsAt) < new Date() ? (

                  `Auction ended at ${formatDateTime(listing.endsAt)}`
                ) : (

                  `Listing Ends At: ${formatDateTime(listing.endsAt)}`
                )}
                {listing.bids && listing.bids.length > 0 ? (

                  <>
                    <h5>Current Bids:</h5>
                    <ul>
                      {listing.bids.map((bid) => {
                        console.log('Bid:', bid);
                        return (
                          <li key={bid.id} className="flex gap-3">
                            User: {bid.bidderName} <h6> ${bid.amount}</h6>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (

                  <p>No Bids</p>
                )}


                <Link href={`/profile/editListing?id=${listing.id}`} className="flex">
                  Edit Post <SettingsIcon />
                </Link>

              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserListings;