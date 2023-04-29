import { Configuration, OpenAIApi } from 'openai';
import { ChatGPTService } from './chatgpt.service';
import { CHATGPT_SERVICE } from './chatgpt.constants';
import { Inject, Provider } from '@nestjs/common';

export const InjectChatGPTService = () => Inject(CHATGPT_SERVICE);

export const ChatGTPServiceProvider: Provider = {
  provide: CHATGPT_SERVICE,
  useFactory: async () => {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const opeApi = new OpenAIApi(configuration);

    return new ChatGPTService(opeApi);
  },
};
