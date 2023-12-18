import { useEffect, useState } from 'react';
import { API_SOCIAL_URL } from '../app/api/constants';
import scrollAni from '../assets/animations/scrolldownupAni.json';
import Lottie from 'lottie-react'
const StickySections = () => {
  const [listings, setListings] = useState([]);
  const [rotateAni, setRotateAni] = useState(false);

  useEffect(() => {
    const fetchListings = async (limit) => {
      try {
        const response = await fetch(`${API_SOCIAL_URL}/listings?_bids=true&_active=true&_limit=${limit}`);

        if (!response.ok) {
          throw new Error(`Error fetching listings: ${response.statusText}`);
        }

        const data = await response.json();
        const sortedListings = data.sort((a, b) => b._count.bids - a._count.bids);
        const topListings = sortedListings.slice(0, limit);
        setListings(topListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings(5);
  }, []);

  useEffect(() => {
    const scrollSection = document.querySelector('.scroll_section');

    if (!scrollSection) {
      console.error('Scroll section not found');
      return;
    }

    scrollSection.innerHTML = '';

    listings.forEach((listing, index) => {
      const listingContainer = document.createElement('div');
      listingContainer.className = 'listing-item w-[800px] h-[80%]';

      const img = document.createElement('img');
      img.src = listing.media[0];
      img.alt = listing.title;

      const bidAmount = document.createElement('h6');
      bidAmount.className = 'bid-amount';
      bidAmount.textContent = `Highest Bid: $ ${listing.bids && listing.bids.length > 0
        ? Math.max(...listing.bids.map(bid => bid.amount)).toFixed(2)
        : 'No bids yet'}`;
      

      listingContainer.appendChild(img);
      listingContainer.appendChild(bidAmount);

      scrollSection.appendChild(listingContainer);
    });
    const transform = () => {
      const offsetTop = scrollSection.offsetTop;
      let startTransformOffset;

      if (window.innerWidth >= 992) {
        startTransformOffset = window.innerHeight * 2.5;
      } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
       
        startTransformOffset = window.innerHeight * 2;
      } else {
        startTransformOffset = window.innerHeight * 2;
      }
      

      let scrollPosition = window.scrollY - offsetTop;
      scrollPosition = Math.max(0, scrollPosition - startTransformOffset);

      let percentage = (scrollPosition / window.innerHeight) * 100;
      percentage = percentage < 0 ? 0 : percentage > 800 ? 800 : percentage;

      scrollSection.style.transform = `translate3d(${-(percentage)}vw, 0, 0)`;

      
      const shouldRotate = percentage >= 250;
      setRotateAni(shouldRotate);
    };

    transform();
    window.addEventListener('scroll', transform);

    return () => {
      window.removeEventListener('scroll', transform);
    };
  }, [listings]);

  return (
    <div className="sticky_parent bg-green-300 mt-20">
      <div className="sticky">
      <h6 className='sticky md:p-20'>Five of our most popular items:
      
      <div className="absolute right-0">
      {rotateAni && (
  <Lottie
    animationData={scrollAni}
    loop
    autoplay
    style={{
      width: '200px',
      height: '200px',
      transform: 'rotate(180deg)',
      transition: 'transform 0.5s ease-in-out 0.5s', // 
    }}
  />
)}
{!rotateAni && (
  <Lottie
    animationData={scrollAni}
    loop
    autoplay
    style={{
      width: '200px',
      height: '200px',
      transform: 'rotate(0deg)',
      transition: 'transform 0.5s ease-in-out 0.5s',  
    }}
  />
)}

        </div>
        </h6>

        <div className="scroll_section"></div>
      </div>
    </div>
  );
};

export default StickySections;