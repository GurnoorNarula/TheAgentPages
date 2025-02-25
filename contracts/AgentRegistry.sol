// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Agent Registry
 * @dev Maintains a decentralized registry of AI agents with performance metrics
 * @notice Stores agent capabilities, reliability scores, and uptime tracking
 */
contract AgentRegistry is Ownable {
    struct Agent {
        address wallet;
        string modelHash;
        uint256 uptime;
        uint256 reliability;
        uint256 tasksCompleted;
        string[] capabilities;
    }
    
    mapping(address => Agent) public agents;
    address[] public agentList;
    
    function registerAgent(
        string memory _modelHash,
        string[] memory _capabilities
    ) public {
        require(agents[msg.sender].wallet == address(0), "Already registered");
        
        agents[msg.sender] = Agent({
            wallet: msg.sender,
            modelHash: _modelHash,
            uptime: block.timestamp,
            reliability: 100,
            tasksCompleted: 0,
            capabilities: _capabilities
        });
        agentList.push(msg.sender);
        
        emit AgentRegistered(msg.sender);
    }

    constructor(){
        string[] memory initialCapabilities = new string[](1);
        initialCapabilities[0] = "general";
        registerAgent("InitialModelHash", initialCapabilities);
    }
    
    // Events
    event AgentRegistered(address indexed agentAddress);
    event AgentUpdated(address indexed agentAddress);

    /**
     * @dev Update agent performance metrics after task completion
     * @param agentAddress Address of agent to update
     * @param success Boolean indicating task success
     * @notice Only callable by owner (Operator Agent)
     */
    function updateAgentPerformance(
        address agentAddress,
        bool success
    ) external onlyOwner {
        Agent storage agent = agents[agentAddress];
        agent.tasksCompleted++;
        // Update reliability with moving average (90% history + 10% new result)
        agent.reliability = success ? 
            (agent.reliability * 9) / 10 + 10 : 
            (agent.reliability * 9) / 10;
        emit AgentUpdated(agentAddress);
    }
    
    /**
     * @dev Get agents with specific capability
     * @param capability Required capability string
     * @return Filtered list of agent addresses
     */
    function getAgentsByCapability(string memory capability) 
        external view returns (address[] memory) 
    {
        address[] memory result = new address[](agentList.length);
        uint256 count = 0;
        
        for(uint256 i = 0; i < agentList.length; i++) {
            if(hasCapability(agentList[i], capability)) {
                result[count] = agentList[i];
                count++;
            }
        }
        
        // Trim results array to actual size
        address[] memory filtered = new address[](count);
        for(uint256 i = 0; i < count; i++) {
            filtered[i] = result[i];
        }
        return filtered;
    }
    
    /**
     * @dev Internal helper to check capability existence
     * @param agentAddress Agent to check
     * @param capability Capability to verify
     * @return Boolean indicating capability presence
     */
    function hasCapability(address agentAddress, string memory capability) 
        private view returns (bool) 
    {
        for(uint256 i = 0; i < agents[agentAddress].capabilities.length; i++) {
            if(keccak256(bytes(agents[agentAddress].capabilities[i])) == 
               keccak256(bytes(capability))) {
                return true;
            }
        }
        return false;
    }
}