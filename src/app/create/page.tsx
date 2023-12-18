"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { createPost } from '../api/auctionItems/create'
import Image from 'next/image'
import { ImageDown } from 'lucide-react';
interface Props { }

const CreatePage = () => {
  const router = useRouter();

  const [postData, setPostData] = useState({
    title: '',
    description: '',
    media: '',
    tags: [],
    endsAt: '', // Add endsAt to the state
  });
  const formatDateTimeLocalInput = (inputValue: string | number | Date) => {
    // Format the inputValue to match the expected format
    const formattedDate = new Date(inputValue).toISOString().slice(0, 16);
    return formattedDate;
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;

    setPostData((prevData) => ({
      ...prevData,
      [name]:
        name === 'tags'
          ? value.split(',')
          : name === 'endsAt'
            ? formatDateTimeLocalInput(value)
            : name === 'media'
              ? [value]
              : value,
    }));
  };







  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {

      if (!postData.title || !postData.endsAt) {
        console.error('Title and endsAt are required fields.');
        return;
      }


      const response = await createPost(postData);
      console.log('API response:', response);
      router.push('/');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return <div>



    <div>

      <section className='p-20'>
        <h6>Create an Auction Item</h6>

        <div>
          <form onSubmit={handleSubmit} className="py-10">
            <div className='container border w-full h-full py-10 rounded-md flex flex-col items-center justify-center gap-5'>
              <div className="mb-4 p-2 flex items-center justify-center flex-col">

                <h6 className='flex gap-2 mb-3'>Add a Image for Your Auction   <ImageDown /></h6>
                <input
                  type="url"
                  name="media"
                  id="media"
                  className="text-center text-md md:text-xl p-2 rounded-sm border "
                  value={postData.media}
                  onChange={handleInputChange}
                />

                <div className='mt-3 w-full lg:w-[800px] flex items-center justify-center'>
                  {postData.media && <img src={postData.media} alt="" />}
                </div>
              </div>
              <div className='  text-center p-2'>
                <label>
                  <h2 className="text-foreground-muted   font-semibold text-xl md:text-2xl">Auction End Date</h2>
                  <input
                    type="datetime-local"
                    required
                    name="endsAt"
                    className='border  p-2 rounded-sm text-center'
                    value={postData.endsAt}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div className=' text-center p-2'>

                <label>
                  <h2 className=" text-black font-semibold text-xl md:text-2xl">Title of Post</h2>
                  <input
                    type="text"
                    required
                    name="title"
                    className='border   p-2 rounded-sm text-center'
                    value={postData.title}
                    onChange={handleInputChange}
                    placeholder="Title of Post"
                  />
                </label>
              </div>
              <div className='flex flex-col items-center justify-center'>
                <label className='text-muted-foreground   font-semibold text-md'>
                  Add a Description to your item
                </label>
                <textarea
                  name="description"
                  required
                  value={postData.description}
                  className="rounded-sm resize-none p-10 md:p-20 text-center mt-1 border"
                  onChange={handleInputChange}
                  placeholder="Start Typing..."
                />
              </div>

              <div className='text-center mt-4 flex flex-col'>
                <div className='flex flex-col gap-2 dark:invert '>
                  <label className='dark:invert'>Tags</label>
                  <input
                    type="text"
                    name="tags"
                    className='border dark:invert'
                    value={postData.tags.join(',')}
                    onChange={handleInputChange}
                  />


                  <div>

                  </div>

                </div>
                <div className="flex-row gap-3 items-end justify-center mt-10 ">
                  <div className='flex flex-row items-center justify-center gap-3 '>
                    <button id='submit' className='transition-all text-black border p-3 rounded-xl' >Create Post +</button>
                    <button className=''>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
}

export default CreatePage