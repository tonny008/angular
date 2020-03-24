/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * **Usage:**
 * ```
 * node rebase-pr <github-repository> <pull-request-number>
 * ```
 * **Example:**
 * ```
 * node rebase-pr angular/angular 123
 * ```
 *
 * Rebases the current branch on top of the GitHub PR target branch.
 *
 * **Context:**
 * Since a GitHub PR is not necessarily up to date with its target branch, it is useful to rebase
 * prior to testing it on CI to ensure more up to date test results.
 *
 * **Implementation details:**
 * This script obtains the base for a GitHub PR via the
 * [GitHub PR API](https://developer.github.com/v3/pulls/#get-a-single-pull-request), then
 * fetches that branch, and rebases the current branch on top of it.
 *
 * **NOTE:**
 * This script cannot use external dependencies or be compiled because it needs to run before the
 * environment is setup.
 * Use only features supported by the NodeJS versions used in the environment.
 */

// This script uses `console` to print messages to the user.
// tslint:disable:no-console

// Imports
const util = require('util');
const child_process = require('child_process');
const exec = util.promisify(child_process.exec);
const getRefsAndShasForTarget = require('./utils/get-refs-and-shas-for-target');

// CLI validation
if (process.argv.length != 4) {
  console.error(`This script requires the GitHub repository and PR number as arguments.`);
  console.error(`Example: node tools/rebase-pr.js angular/angular 123`);
  process.exitCode = 1;
  return;
}

// Run
_main(...process.argv.slice(2)).catch(err => {
  console.log('Failed to rebase on top of target branch.\n');
  console.error(err);
  process.exitCode = 1;
});

// Helpers
async function _main(repository, prNumber) {

  const target = await getRefsAndShasForTarget(prNumber);

  // Log known refs and shas
  console.log(`--------------------------------`);
  console.log(`    Target Branch:                   ${target.base.ref}`);
  console.log(`    Latest Commit for Target Branch: ${target.latestShaOfTargetBranch}`);
  console.log(`    Latest Commit for PR:            ${target.latestShaOfPrBranch}`);
  console.log(`    First Common Ancestor SHA:       ${target.commonAncestorSha}`);
  console.log(`--------------------------------`);
  console.log();



  // Get the count of commits between the latest commit from origin and the common ancestor SHA.
  const {stdout: commitCount} =
      await exec(`git rev-list --count origin/${target.base.ref}...${target.commonAncestorSha}`);
  console.log(`Checking ${commitCount.trim()} commits for changes in the CircleCI config file.`);

  // Check if the files changed between the latest commit from origin and the common ancestor SHA
  // includes the CircleCI config.
  const {stdout: circleCIConfigChanged} = await exec(
      `git diff --name-only origin/${target.base.ref} ${target.commonAncestorSha} -- .circleci/config.yml`);

  if (!!circleCIConfigChanged) {
    throw Error(`
        CircleCI config on ${target.base.ref} has been modified since commit ${target.commonAncestorSha.slice(0, 7)},
        which this PR is based on.

        Please rebase the PR on ${target.base.ref} after fetching from upstream.

        Rebase instructions for PR Author, please run the following commands:

          git fetch upstream ${target.base.ref};
          git checkout ${target.head.ref};
          git rebase upstream/${target.base.ref};
          git push --force-with-lease;
        `);
  } else {
    console.log('No change found in the CircleCI config file, continuing.');
  }
  console.log();

  // Rebase the PR.
  console.log(`Rebasing current branch on ${target.base.ref}.`);
  await exec(`git rebase origin/${target.base.ref}`);
  console.log('Rebase successful.');
}
