import { getInput } from '@actions/core';
import { context } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';

import OpenAI from 'openai';

async function main() {
  // 打印仓库信息，包括仓库名、分支名、提交ID
  console.log('Repository:', context.repo.repo);
  console.log('Branch:', context.ref);
  console.log('Commit:', context.sha);

  // 检索文件，打印变更文件列表
  const files = context.payload.pull_request?.files;
  if (files) {
    console.log('Files:');
    files.forEach((file: any) => {
      console.log(file.filename);
    });
  }


  try {
    const OPENAI_API_KEY = getInput('openaiApiKey');
    const openai = new OpenAI({      apiKey: process.env['OPENAI_API_KEY']});

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [{ role: 'user', content: 'Say this is a test' }],
      model: 'gpt-3.5-turbo',
    };
    const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);

    console.log('chatCompletion:', chatCompletion);
  } catch (error) {
    console.error('error:', error);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(() => { })
  .finally(() => { console.log('Done'); });