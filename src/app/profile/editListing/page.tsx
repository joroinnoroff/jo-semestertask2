"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';

import { useRouter } from 'next/navigation';


import { Image, Trash } from 'lucide-react';
import { authFetch } from '../../api/storage/authFetch';
import { API_SOCIAL_URL } from '../../api/constants';
import { toast } from 'sonner';






const EditPage = () => {
  const [listing, setListing] = useState({
    Id: '',
    title: '',
    description: '',
    tags: [],
    media: 'url',
  });

  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');

    if (id) {
      const getListingURL = `${API_SOCIAL_URL}/listings/${id}`;

      authFetch(getListingURL)
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            setListing({ ...data, Id: id });
          } else {
            console.error('Error fetching listing data:', response);
          }
        })
        .catch((error) => console.error('Error fetching listing data:', error));
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setListing((prevListing) => ({
      ...prevListing,
      [name]: name === 'tags' ? value.split(',') : value,
    }));
  };

  const handleChangeTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setListing((prevListing) => ({
      ...prevListing,
      description: value,
    }));
  };


  const updateListing = async (listingData: { Id?: string; title?: string; description?: string; tags?: string[]; media?: string; id?: any; }) => {
    if (!listingData.id) {
      throw new Error("Update requires a ListingId");
    }

    const updateListingURL = `${API_SOCIAL_URL}/listings/${listingData.id}`;
    const response = await authFetch(updateListingURL, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });

    console.log(response);

    if (response.ok) {
      const updatedListingData = await response.json();
      setListing(updatedListingData);
      toast.success('Changes Saved');
      router.push('/profile/listings');
    }
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateListing(listing);
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error(`Error updating listing: ${error}`);
    }
  };

  const handleDelete = async () => {
    try {
      const deleteListingURL = `https://nf-api.onrender.com/api/v1/auction/listings/${listing.Id}`;
      const response = await authFetch(deleteListingURL, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Listing deleted successfully');
        router.push('/profile/listings');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);

    }
  };



  return (
    <div className="mt-32">
      <div className="text-center">
        <h1>Edit Post</h1>
      </div>

      <div className="container flex items-center justify-center p-3 text-center">
        <div className="border px-5 py-10 rounded-sm shadow-md">
          <form onSubmit={handleSaveChanges}>

            <div className="mb-4 p-2 flex items-center justify-center flex-col">
              <label htmlFor="title" className="flex items-center justify-center text-gray-700 text-sm font-bold mb-2">
                Edit Media
                <Image color='grey' width={20} height={20} />

              </label>
              <input
                type={listing.media}
                value={listing.media}
                name="media"
                id="media"
                onChange={handleChange}
                className="text-center text-md md:text-xl"
              />
              <div className='mt-3'>
                <img src={listing.media} width={300} alt="" />
              </div>
            </div>
            <div className="mb-4 w-full">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                Edit Title
              </label>
              <input
                type="text"
                value={listing.title}
                name="title"
                id="title"
                onChange={handleChange}
                className="text-center text-md md:text-xl w-full"
              />
            </div>



            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Edit Message
              </label>
              <textarea
                name="body"
                id="message"

                required
                maxLength={100}
                value={listing.description}
                onChange={handleChangeTextarea}
                className="px-3 py-2 border rounded-lg resize-none shadow-sm focus:outline-none focus:ring focus:border-blue-500 text-center text-l md:text-2xl"
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">
                Edit tags
              </label>
              <input
                type="text"
                name="tags"
                className='border'
                value={listing.tags.join(',')}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <button type="submit">Save Changes</button>
              <div>
                <button>Cancel</button>
              </div>

              <button onClick={handleDelete}  >
                Delete <Trash />
              </button>


            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
