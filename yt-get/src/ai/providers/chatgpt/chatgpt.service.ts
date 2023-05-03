import { CreateChatCompletionRequest, OpenAIApi } from 'openai';

export class ChatGPTService {
  constructor(private readonly openAIApi: OpenAIApi) {}

  async completion(
    createCompletionRequest: Omit<CreateChatCompletionRequest, 'model'>,
  ) {
    return this.openAIApi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      ...createCompletionRequest,
      temperature: 0.39,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
  }
}
