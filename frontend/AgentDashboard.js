import { useEffect, useState } from 'react';
import { Contract, providers } from 'ethers';

/**
 * Agent Dashboard Component
 * Displays real-time registry data with agent performance metrics
 */
export default function AgentDashboard({ registryAddress, abi }) {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    // Fetch agent data from blockchain
    async function loadAgents() {
      const provider = new providers.Web3Provider(window.ethereum);
      const contract = new Contract(registryAddress, abi, provider);
      
      // Get list of all registered agent addresses
      const agentAddresses = await contract.agentList();
      
      // Fetch detailed data for each agent
      const agentsData = await Promise.all(
        agentAddresses.map(async (address) => {
          const agent = await contract.agents(address);
          return {
            address,
            model: agent.modelHash,
            reliability: agent.reliability,
            uptime: Math.floor((Date.now()/1000 - agent.uptime)/3600),
            capabilities: agent.capabilities
          };
        })
      );
      
      setAgents(agentsData);
    }
    
    loadAgents();
    const interval = setInterval(loadAgents, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {agents.map((agent) => (
        <div key={agent.address} className="p-4 border rounded">
          <h3 className="font-bold">{agent.address}</h3>
          <p>Model: {agent.model}</p>
          <p>Reliability: {agent.reliability}%</p>
          <p>Uptime: {agent.uptime} hours</p>
          <div className="mt-2">
            {agent.capabilities.map((cap) => (
              <span key={cap} className="bg-gray-100 px-2 py-1 mr-2 text-sm">
                {cap}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
