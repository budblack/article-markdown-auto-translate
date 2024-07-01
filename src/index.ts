import { getInput } from '@actions/core';
import { context } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';

import {translateWithOpenAI} from 'openai-translate';

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

  const OPENAI_API_KEY = getInput('openaiApiKey');
  const message = 'hello world';
  const openai_url = 'https://api.openai.com/v1/engines/davinci/completions';
  const model = 'gpt-3.5-turbo';
  const target_langualge = 'zh-cn';

  console.log('OPENAI_API_KEY:', OPENAI_API_KEY);

  const result = await translateWithOpenAI(OPENAI_API_KEY, openai_url, model, message, target_langualge);
  
  console.log('result:', result);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(() => { })
  .finally(() => { console.log('Done'); });