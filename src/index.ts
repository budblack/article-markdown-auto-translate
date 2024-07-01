import { getInput } from '@actions/core';
import { context } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import translate from 'translate-google'

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

  const tranObj = {
    a: 1,
    b: '1',
    c: "How are you?\nI'm nice.",
    d: [true, 'true', 'hi', { a: 'hello', b: ['world'] }],
  }

  translate(tranObj, { to: 'zh-cn', except: ['a'] }).then((res: any) => {
    console.log(res)
  }).catch((error: any) => {
    console.error(error)
  })

}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .then(() => { })
  .finally(() => { console.log('Done'); });