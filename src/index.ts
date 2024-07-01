import { getInput } from '@actions/core';
import { context } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { access, constants, readFile, unlink, writeFile } from 'fs-extra'
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

async function translate(str_md: string) {
  const str_prompt = `我有段 md 文件，请翻译为中文。翻译需要严格保留源文件 markdown 排版布局，请直接输出，不要在作询问。\n`

  const OPENAI_API_KEY = getInput('openaiApiKey');
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [{ role: 'user', content: str_prompt + str_md }],
    model: 'gpt-4o',
  };
  const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
  const response = chatCompletion.choices[0].message.content;



  console.log(str_md);
  console.log('-----------------------------------');
  console.log(response);

  return response;
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

  const arr_str_md = str_md.split('\n\n');
  let str_md_translated = '';
  const len = arr_str_md.length;
  let str_temp = '';
  const MAX_LENGTH = 1024;
  let count_scope_token = 0;
  for (let i = 0; i < len; i++) {
    const str = arr_str_md[i];
    // 快速扫描 str 中有多少个 ``` 符号
    const count = (str.match(/```/g) || []).length;
    count_scope_token += count;
    // 如果是代码块，直接输出
    if (count_scope_token % 2 === 1) {
      str_temp += (str + '\n\n');
      continue;
    }else{
      count_scope_token = 0;
    }

    if (str_temp.length < MAX_LENGTH) {
      str_temp += (str + '\n\n');
      continue;
    }
    console.log(`============== [${i} / ${len}] ==============`)
    const str_translated = await translate(str_temp);
    str_temp = '';

    str_md_translated += str_translated + '\n\n';
    console.log('\n')
  }

  // 写文件
  console.log('filePath:', filePath);
  await unlink(filePath);
  await writeFile(filePath, str_md_translated);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(() => { })
  .finally(() => { console.log('Done'); });