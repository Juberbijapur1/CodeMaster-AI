
export enum AITool {
  Chat = 'Chat',
  Image = 'Image Analysis',
  Search = 'Research Assistant',
  Thinking = 'Deep Dive',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}
