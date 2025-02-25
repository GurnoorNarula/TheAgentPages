import { useState, useEffect } from 'react';
import { Contract, providers } from 'ethers';

/**
 * Real-Time Auction Visualizer
 * Displays live auction status and bidding activity
 */
export default function AuctionVisualizer({ auctionId, contractAddress, abi }) {
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Set up contract connection
    const provider = new providers.Web3Provider(window.ethereum);
    const contract = new Contract(contractAddress, abi, provider);
    
    // Load initial auction data
    const loadAuction = async () => {
      const auction = await contract.auctions(auctionId);
      setTimeLeft(Math.max(0, auction.endTime - Math.floor(Date.now()/1000)));
      
      // Fetch historical bid events
      const bidEvents = await contract.queryFilter(
        contract.filters.BidSubmitted(auctionId)
      );
      
      // Process bid data
      const bidsData = await Promise.all(
        bidEvents.map(async (event) => ({
          bidder: event.args.bidder,
          amount: await contract.bids(auctionId, event.args.bidder)
        }))
      );
      
      setBids(bidsData);
    };
    
    loadAuction();
    const interval = setInterval(loadAuction, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [auctionId]);

  return (
    <div className="p-4 border rounded">
      <h3 className="text-xl font-bold mb-4">
        Auction Progress ({timeLeft}s remaining)
      </h3>
      <div className="space-y-2">
        {bids.map((bid, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-gray-50">
            <span>{bid.bidder.slice(0,6)}...{bid.bidder.slice(-4)}</span>
            <span className="font-mono">{bid.amount} ETH</span>
          </div>
        ))}
      </div>
    </div>
  );
}
