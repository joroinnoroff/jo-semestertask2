"use client"
import { API_SOCIAL_URL } from '@/app/api/constants';
import { authFetch } from '@/app/api/storage/authFetch';
import React, { useEffect, useState } from 'react';
import '../../../app/globals.css'

// Define the User type
interface User {
  name: string;
  email: string;
  avatar: string;
  credits: number;
  wins: string[];
}

// Profile type
interface Profile {
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

}


interface Bid {
  id: string;
  amount: number;
  bidderName: string;
  created: string;
}


const SettingsPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [inputFieldValue, setInputFieldValue] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('profile');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {

        const profileResponse = await authFetch(`${API_SOCIAL_URL}/profiles/${user?.name}`);
        const profileData: Profile = await profileResponse.json();
        setProfile(profileData);

        const listingsResponse = await authFetch(`${API_SOCIAL_URL}/profiles/${profileData.name}/listings`);
        const listingsData: Listing[] = await listingsResponse.json();
        setListings(listingsData);

        const bidsResponse = await authFetch(`${API_SOCIAL_URL}/profiles/${profileData.name}/bids`);
        const bidsData: Bid[] = await bidsResponse.json();
        setBids(bidsData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (isLoggedIn && user) {
      fetchProfileData();
    }
  }, [isLoggedIn, user]);

  const handleUpdateAvatar = async () => {
    try {
      if (isEditing) {
        if (inputFieldValue) {

          const updatedProfileResponse = await authFetch(`${API_SOCIAL_URL}/profiles/${profile?.name}/media`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ avatar: inputFieldValue }),
          });

          const updatedProfileData: Profile = await updatedProfileResponse.json();

          setProfile(updatedProfileData);
        }
        setIsEditing(false);
      } else {

        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleCancel = () => {
    setInputFieldValue('');
    setIsEditing(false);
  };

  return (
    <div className='container'>
      <h1 className='text-3xl'>Your Profile</h1>
      {isLoggedIn && user && profile && (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Credits: {user.credits}</p>
          <p>Number of Wins: {profile.wins?.length || 0}</p>


          {/* Conditionally render the input field and button based on the editing state */}
          <div className=''>
            <img src={isEditing ? inputFieldValue : profile.avatar} alt="User Avatar" />
            <div className='flex mt-20'>
              <button onClick={handleUpdateAvatar} className="border p-3 rounded-3xl ">
                {isEditing ? 'Save Changes' : 'Update Avatar'}
              </button>

              {isEditing && (

                <button onClick={handleCancel}>Cancel</button>
              )}
            </div>
            {isEditing && (
              <div>
                <input
                  type="text"
                  value={inputFieldValue}
                  onChange={(e) => setInputFieldValue(e.target.value)}
                  placeholder="Enter new avatar URL"
                />
              </div>
            )}
          </div>


        </>
      )}
    </div>
  );
};

export default SettingsPage;