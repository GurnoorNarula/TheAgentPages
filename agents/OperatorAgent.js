import { AgentKit } from '@coinbase/cdp-agent-kit';
import { RMSClient } from '@ora-protocol/rms';
import { AgentRegistryABI } from '../contracts/ABIs';

/**
 * Operator Agent Class
 * Orchestrates task decomposition, auction management, and execution coordination
 */
export class OperatorAgent {
  constructor(wallet, registryAddress, auctionAddress) {
    // Initialize Coinbase AgentKit with provided wallet
    this.agentKit = new AgentKit(wallet);
    
    // Connect to ORA's Resilient Model Services
    this.rmsClient = new RMSClient(process.env.ORA_API_KEY);
    
    // Set up registry contract interface
    this.registryContract = this.agentKit.createContract(
      registryAddress, 
      AgentRegistryABI
    );
  }

  /**
   * Main task processing pipeline
   * @param {string} userInput - Natural language task request
   * @returns {Promise<Object>} Task execution results
   */
  async processTask(userInput) {
    // Step 1: Task decomposition using ORA's AI
    const subtasks = await this.rmsClient.generateSubtasks(userInput);
    
    // Step 2: Initiate parallel auctions for each subtask
    const auctionResults = await Promise.all(
      subtasks.map(async (subtask) => ({
        subtask,
        auctionId: await this.initiateAuction(subtask)
      }))
    );
    
    // Step 3: Monitor auctions and select winners
    const agentAssignments = await Promise.all(
      auctionResults.map(async ({ subtask, auctionId }) => ({
        subtask,
        agent: await this.monitorAuction(auctionId)
      }))
    );
    
    // Step 4: Coordinate task execution with selected agents
    return this.executeTasks(agentAssignments);
  }

  /**
   * Start new auction for a subtask
   * @param {Object} subtask - Decomposed task object
   * @returns {Promise<string>} Auction ID
   */
  async initiateAuction(subtask) {
    return this.agentKit.executeContractMethod(
      auctionAddress,
      'createAuction',
      [subtask.description]
    );
  }

  /**
   * Monitor auction progress and resolve winner
   * @param {string} auctionId - Target auction ID
   * @returns {Promise<string>} Winning agent address
   */
  async monitorAuction(auctionId) {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        const status = await this.agentKit.readContract(
          auctionAddress,
          'auctions',
          [auctionId]
        );
        
        if(status.resolved) {
          clearInterval(interval);
          resolve(status.winner);
        }
      }, 5000); // Check every 5 seconds
    });
  }
}