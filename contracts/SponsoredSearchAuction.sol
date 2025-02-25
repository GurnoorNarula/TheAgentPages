pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title Sponsored Search Auction
 * @dev Implements time-bound auction mechanism for agent selection
 * @notice Manages decentralized auctions for task assignment between agents
 */
contract SponsoredSearchAuction {
    using EnumerableSet for EnumerableSet.AddressSet;
    
    // Auction structure
    struct Auction {
        address initiator;          // Task creator address
        string taskHash;            // IPFS hash of task details
        uint256 endTime;            // Auction expiration timestamp
        EnumerableSet.AddressSet bidders; // Participants list
        mapping(address => uint256) bids;  // Bid amounts
        address winner;             // Auction result
        bool resolved;              // Completion status
    }
    
    // Storage
    mapping(bytes32 => Auction) internal auctions; // All active auctions
    uint256 public auctionDuration = 300;       // 5-minute default duration
    
    // Events
    event AuctionCreated(bytes32 indexed auctionId);
    event BidSubmitted(bytes32 indexed auctionId, address bidder, uint256 amount);
    event AuctionResolved(bytes32 indexed auctionId, address winner);

    /**
     * @dev Initialize new auction for a task
     * @param taskDescription Task metadata hash
     * @return auctionId Generated auction identifier
     */
    function createAuction(
        string calldata taskDescription
    ) external returns (bytes32) {
        bytes32 auctionId = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        auctions[auctionId].initiator = msg.sender;
        auctions[auctionId].taskHash = taskDescription;
        auctions[auctionId].endTime = block.timestamp + auctionDuration;
        emit AuctionCreated(auctionId);
        return auctionId;
    }

    /**
     * @dev Submit bid to participate in auction
     * @param auctionId Target auction ID
     * @param bidAmount Bid value in ETH
     */
    function submitBid(bytes32 auctionId, uint256 bidAmount) external {
        Auction storage auction = auctions[auctionId];
        require(block.timestamp < auction.endTime, "Auction expired");
        require(bidAmount > 0, "Invalid bid");
        
        auction.bidders.add(msg.sender);
        auction.bids[msg.sender] = bidAmount;
        emit BidSubmitted(auctionId, msg.sender, bidAmount);
    }

    /**
     * @dev Finalize auction and select winner
     * @param auctionId Target auction ID
     */
    function resolveAuction(bytes32 auctionId) external {
        Auction storage auction = auctions[auctionId];
        require(block.timestamp >= auction.endTime, "Auction ongoing");
        require(!auction.resolved, "Already resolved");
        
        uint256 highestBid = 0;
        address winner;
        
        // Iterate through all bidders to find highest bid
        for(uint256 i = 0; i < auction.bidders.length(); i++) {
            address bidder = auction.bidders.at(i);
            if(auction.bids[bidder] > highestBid) {
                highestBid = auction.bids[bidder];
                winner = bidder;
            }
        }
        
        auction.winner = winner;
        auction.resolved = true;
        emit AuctionResolved(auctionId, winner);
    }
}