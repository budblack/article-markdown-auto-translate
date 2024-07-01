import { getInput } from '@actions/core';
import { context } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { access, constants, readFile } from 'fs-extra'
import { marked } from 'marked';
import { parseHTML } from 'linkedom';

import OpenAI from 'openai';
import { join } from 'path';

function getRouteAddr(markdown: string) {
  const IndexHTML = /index\.\w+$/i;
  const { document } = parseHTML(marked(markdown));

  const { href } = document.querySelector('a') || {};

  const URI = new URL(href);

  URI.pathname = URI.pathname.replace(IndexHTML, '');

  return URI + '';
}

async function main() {
  const newsLink = getInput('newsLink'),
    ignoreSelector = getInput('ignoreSelector'),
    markDownFilePath = getInput('markDownFilePath') || './';

  const path = getRouteAddr(newsLink);
  const filePath = join(
    markDownFilePath,
    path.split('/').filter(Boolean).at(-1) + '.md'
  );

  const str_md = await readFile(filePath, 'utf-8');
  const str_prompt = `我有一篇 md 文件，请翻译为中文。翻译需要严格保留源文件 markdown 排版布局。\n`
  console.log('str_md:', str_md);

  const OPENAI_API_KEY = getInput('openaiApiKey');
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [{ role: 'user', content: str_prompt + str_md }],
    model: 'gpt-4o',
  };
  const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
  const response = chatCompletion.choices[0].message.content;
  console.log('response:', response);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(() => { })
  .finally(() => { console.log('Done'); });