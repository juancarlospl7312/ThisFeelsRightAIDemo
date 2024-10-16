// src/app/models/api-models.ts

export interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
}

export interface GoogleSearchResponse {
  items?: GoogleSearchResult[];
}

export interface OpenAIMessage {
  role: string;
  content: string;
}

export interface OpenAIChoice {
  message: OpenAIMessage;
}

export interface OpenAIResponse {
  choices: OpenAIChoice[];
}

export interface Summary {
  title: string;
  link: string;
  summary: string;
}

export interface ProcessResponse {
  generalSummary: string;
  briefSummaries: Summary[];
  sources?: GoogleSearchResult[];
}
