import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

class CryptoPurchaseAgent {
  constructor(networkId, walletData) {
    this.agentkit = CdpAgentkit.configureWithWallet({
      networkId: networkId,
      cdpWalletData: walletData
    });
    this.llm = new ChatOpenAI({ model: "gpt-4o-mini" });
  }

  async purchaseCrypto(asset, amount) {
    const tools = await this.agentkit.getTools();
    const agent = createReactAgent({ llm: this.llm, tools });
    
    const result = await agent.invoke({
      messages: [{ content: `Purchase ${amount} of ${asset}` }]
    });
    
    return result.messages[result.messages.length - 1].content;
  }
}

// Create two instances
const purchaseAgent1 = new CryptoPurchaseAgent("base-mainnet", walletData1);
const purchaseAgent2 = new CryptoPurchaseAgent("base-mainnet", walletData2);
