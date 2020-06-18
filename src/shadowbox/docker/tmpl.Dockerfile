# Copyright 2018 The Outline Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Versions can be found at https://github.com/Jigsaw-Code/outline-ss-server/releases
ARG SS_VERSION=1.1.5

FROM golang:alpine AS ss_builder
# add git so we can build outline-ss-server from source
RUN apk add --update git && rm -rf /var/cache/apk/*
WORKDIR /tmp
ARG SS_VERSION
RUN git clone --branch "v${SS_VERSION}" https://github.com/Jigsaw-Code/outline-ss-server --single-branch
WORKDIR /tmp/outline-ss-server
ENV GO111MODULE=on
ENV GOOS={{ .GoOS }}
ENV GOARCH={{ .GoARCH }}
ENV GOARM={{ .GoARM }}
ENV CGO_ENABLED=0
RUN go build -o /app/outline-ss-server

FROM golang:alpine AS prombuilder
# Versions can be found at https://github.com/prometheus/prometheus/releases
ARG PM_VERSION=2.18.1
# add git so we can build the prometheus version from source
RUN apk add --update git && rm -rf /var/cache/apk/*
WORKDIR /tmp
RUN git clone --branch "v${PM_VERSION}" https://github.com/prometheus/prometheus --single-branch
WORKDIR /tmp/prometheus
ENV GO111MODULE=on
ENV GOOS={{ .GoOS }}
ENV GOARCH={{ .GoARCH }}
ENV GOARM={{ .GoARM }}
# RUN go mod init
RUN go mod vendor
RUN go build -o /app/prometheus ./cmd/prometheus


ARG NODE_IMAGE={{ .RuntimeImage }}

# Multi-stage build: use a build image to prevent bloating the shadowbox image with dependencies.
# Run `yarn` and build inside the container to package the right dependencies for the image.
FROM ${NODE_IMAGE} AS build

RUN apk add --no-cache --upgrade bash
WORKDIR /

# Don't copy node_modules and other things not needed for install.
COPY package.json yarn.lock ./
COPY src/shadowbox/package.json src/shadowbox/
RUN yarn install

# We copy the source code only after yarn install, so that source code changes don't trigger re-installs.
COPY scripts scripts/
COPY src src/
COPY tsconfig.json ./
COPY third_party third_party
RUN ROOT_DIR=/ yarn do shadowbox/server/build

# shadowbox image
FROM ${NODE_IMAGE}

# Save metadata on the software versions we are using.
LABEL shadowbox.node_version=12.16.3
# Keep in sync with version in third_party/outline-ss-server
LABEL shadowbox.outline-ss-server_version=1.1.5

ARG GITHUB_RELEASE
LABEL shadowbox.github.release="${GITHUB_RELEASE}"

# We use curl to detect the server's public IP. We need to use the --date option in `date` to
# safely grab the ip-to-country database
RUN apk add --no-cache --upgrade coreutils curl

COPY src/shadowbox/scripts scripts/
COPY src/shadowbox/scripts/update_mmdb.sh /etc/periodic/weekly/update_mmdb

RUN /etc/periodic/weekly/update_mmdb

# Create default state directory.
RUN mkdir -p /root/shadowbox/persisted-state

# Install shadowbox.
WORKDIR /opt/outline-server

# The shadowbox build directory has the following structure:
#   - app/          (bundled node app)
#   - bin/          (binary dependencies)
#   - package.json  (shadowbox package.json)
COPY --from=build /build/shadowbox/ .
COPY --from=ss_builder /app/outline-ss-server/outline-ss-server ./bin/outline-ss-server
COPY --from=prombuilder /app/prometheus/prometheus ./bin/prometheus

COPY src/shadowbox/docker/cmd.sh /
CMD /cmd.sh