import { getInput } from '@actions/core';
import { context } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';

const translate = require('google-translate-api');

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
  translate('Ik spreek Engels', {to: 'zh-cn'}).then((res:any) => {
    console.log(res.text);
    //=> I speak English
    console.log(res.from.language.iso);
    //=> nl
}).catch((err:any) => {
    console.error(err);
});

}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(() => { })
  .finally(() => { console.log('Done'); });