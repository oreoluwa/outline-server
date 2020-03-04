#!/bin/sh
# https://gist.github.com/willprice/e07efd73fb7f13f917ea

setup() {
  echo "https://oreoluwa:${GH_TOKEN}@github.com" > ~/.git-credentials
}

setup_git() {
  git config --global credential.helper store
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

upload_files() {
  # https://github.com/Jigsaw-Code/outline-server.git
  git remote add origin https://oreoluwa:${GH_TOKEN}@github.com/oreoluwa/outline-server.git > /dev/null 2>&1
  git remote add upstream https://github.com/Jigsaw-Code/outline-server.git > /dev/null 2>&1
  echo "Fetching updates from upstream server"
  git fetch upstream
  echo "Merging updates from upstream/master to local branch"
  git merge --commit -m "Merge branch 'master' of github.com:Jigsaw-Code/outline-server" upstream/master
  # git pull upstream master
  echo "push the latest commit"
  git push --quiet --set-upstream origin shadowbox/deploy
}

setup
setup_git
upload_files
