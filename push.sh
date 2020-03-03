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
  git fetch upstream && git merge upstream/master
  # git pull upstream master
  git push --quiet --set-upstream origin shadowbox/deploy
}

setup
setup_git
upload_files
