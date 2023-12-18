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
  media: string[];
  seller: {
    name: string;
  };
  bids: Bid[];
}

interface UpdateMediaRequest {
  avatar: string;
}

interface UpdateMediaResponse extends Profile { }

interface ProfileQueryParams {
  _listings?: boolean;
}

type AllProfilesResponse = Profile[];
type SingleProfileResponse = Profile;
type AllListingsByProfileResponse = Listing[];
type AllBidsByProfileResponse = Bid[];
