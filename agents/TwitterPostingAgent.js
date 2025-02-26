import { TwitterAgentkit } from "@coinbase/cdp-agentkit-core";
import { TwitterToolkit } from "@coinbase/twitter-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

class TwitterPostingAgent {
  constructor(twitterCredentials) {
    this.agentkit = new TwitterAgentkit();
    this.toolkit = new TwitterToolkit(this.agentkit);
    this.llm = new ChatOpenAI({ model: "gpt-4o-mini" });
  }

  async postTweet(content) {
    const tools = this.toolkit.getTools();
    const agent = createReactAgent({ llm: this.llm, tools });
    
    const result = await agent.invoke({
      messages: [{ content: `Post the following tweet: ${content}` }]
    });
    
    return result.messages[result.messages.length - 1].content;
  }
}

// Create two instances
const twitterAgent1 = new TwitterPostingAgent(twitterCredentials1);
const twitterAgent2 = new TwitterPostingAgent(twitterCredentials2);
