import { Search } from 'lucide-react';
import React, { ChangeEvent, useState } from 'react';

interface SearchListingsProps {
  onSearchQueryChange: (query: string) => void;
}

const SearchListings: React.FC<SearchListingsProps> = ({ onSearchQueryChange }) => {
  const [searchIconVisible, setSearchIconVisible] = useState(true);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearchQueryChange(query);
    setSearchIconVisible(!query.trim());
  };

  return (
    <div className=''>
      <div className="relative">
        <input
          type="text"
          id='Search'
          placeholder='Søk etter Poster'
          className='p-2 rounded-xl border opacity-30 md:opacity-100'
          onChange={handleInputChange}
          onFocus={() => setSearchIconVisible(false)}
          aria-label="Search for listings"
        />
        {searchIconVisible && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchListings;
