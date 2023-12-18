"use client"
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { API_SOCIAL_URL } from '../api/constants';
import { authFetch } from '../api/storage/authFetch';

// Import the new interfaces
interface User {
  name: string;
  email: string;
  avatar: string;
  credits: number;
  wins: string[];
}

interface Bid {
  id: string;
  amount: number;
  bidderName: string;
  created: string;
  listing?: Listing;
  description: string;
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


const UsersItems: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userBids, setUserBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const [wonListings, setWonListings] = useState<Listing[]>([]);


  const fetchUserProfile = async () => {
    try {

      const storedUser = localStorage.getItem('profile');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);


        const profileResponse = await authFetch(`${API_SOCIAL_URL}/profiles/${parsedUser.name}`);
        if (!profileResponse.ok) {
          throw new Error(`Error fetching user profile: ${profileResponse.statusText}`);
        }

        const profileData: Profile = await profileResponse.json();
        setProfile(profileData);


        const bidsResponse = await authFetch(`${API_SOCIAL_URL}/profiles/${parsedUser.name}/bids?_listings=true`);
        if (!bidsResponse.ok) {
          throw new Error(`Error fetching user bids: ${bidsResponse.statusText}`);
        }

        const bidsData: Bid[] = await bidsResponse.json();
        console.log('User Bids:', bidsData);
        setUserBids(bidsData);
        setIsLoading(false);


        const wonListingsData: Listing[] = await Promise.all(
          profileData.wins.map(async (listingId: string) => {
            try {
              const listingResponse = await authFetch(`${API_SOCIAL_URL}/listings/${listingId}`);
              if (listingResponse.ok) {
                return listingResponse.json();
              } else {
                console.error(`Error fetching listing ${listingId}: ${listingResponse.statusText}`);
                return null;
              }
            } catch (error) {
              console.error(`Error fetching listing ${listingId}`);
              return null;
            }
          })
        );

        // Remove null values (failed listing fetches)
        const filteredWins = wonListingsData.filter(Boolean);
        setWonListings(filteredWins);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };





  useEffect(() => {
    fetchUserProfile();
  }, []);

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
  const fadeInVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };








  return (
    <div className='mt-32 p-10 '>




      <div className='mt-10 flex  flex-wrap gap-10 m-auto  justify-center'>
        <h6 className=''>User's Bids <History /></h6>
        {isLoading && <p>Loading...</p>}
        {userBids.length > 0 && (

          <div className='flex flex-wrap h-screen justify-center'>
            {userBids.map((bid) => (

              <motion.div
                key={bid.id}
                variants={fadeInVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                className="flex mt-10 flex-col items-center gap-4 p-2 border w-full sm:w-auto rounded-md shadow-md m-4"
              >
                {bid.listing ? (
                  <>


                    {bid.listing.media.length > 0 && (
                      <img src={bid.listing.media[0]} alt={`Listing ${bid.listing.title}`} className="rounded-md lg:h-[50%]" />
                    )}
                    <div className='w-full'>
                      <p>
                        {new Date(bid.listing.endsAt) < new Date() ? (
                          `Auction ended at ${formatDateTime(bid.listing.endsAt)}`
                        ) : (
                          `Listing Ends At: ${formatDateTime(bid.listing.endsAt)}`
                        )}
                      </p>
                      {(profile && profile.wins && profile.wins.includes(bid.listing.id)) ? (
                        <h6 className="text-green-500 font-bold">Congratulations, you won this auction!</h6>
                      ) : (
                        <h2 className="text-red-500 font-bold">You did not win this auction yet.</h2>
                      )}
                      <div className='flex flex-col'>
                        <h4 className='flex'>Title:</h4>
                        {bid.listing.title}
                      </div>

                      <h2>Bid Amount: ${bid.amount}</h2>
                    </div>
                  </>
                ) : (
                  <p>Error: No listing information available for this bid.</p>
                )}
              </motion.div>
            ))}


          </div>
        )}

        {userBids.length === 0 && <p>{user?.name}, you have not made any bids.</p>}
      </div>
    </div>
  );
};

export default UsersItems;