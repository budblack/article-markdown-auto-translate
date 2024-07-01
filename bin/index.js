#!/usr/bin/env node
'use strict';

var github = require('@actions/github');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // 打印仓库信息，包括仓库名、分支名、提交ID
        console.log('Repository:', github.context.repo.repo);
        console.log('Branch:', github.context.ref);
        console.log('Commit:', github.context.sha);
        // 检索文件，打印变更文件列表
        const files = (_a = github.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.files;
        if (files) {
            console.log('Files:');
            files.forEach((file) => {
                console.log(file.filename);
            });
        }
    });
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .then(() => { })
    .finally(() => { console.log('Done'); });
