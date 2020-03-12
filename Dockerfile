# This Dockerfile is part of London Borough of Hackney's Tenancy & Household
# Check process: https://github.com/LBHackney-IT/mat-process-thc
#

# ------------------------------------------------------------------------------
# base
# ------------------------------------------------------------------------------

FROM node:12.16.1-alpine AS base

RUN apk add --no-cache bash

WORKDIR /app

ENV NODE_ENV production

# ------------------------------------------------------------------------------
# dependencies
# ------------------------------------------------------------------------------

FROM base AS dependencies

RUN apk add --no-cache g++ git make openssh python3

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

# ------------------------------------------------------------------------------
# build
# ------------------------------------------------------------------------------

FROM base AS build

RUN apk add --no-cache g++ make python3

COPY . /app

RUN NODE_ENV=development npm ci

RUN npm run build

# ------------------------------------------------------------------------------
# app
# ------------------------------------------------------------------------------

FROM base AS app

COPY Dockerfile /app/Dockerfile
COPY LICENCE /app/LICENCE
COPY README.md /app/README.md

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

COPY --from=dependencies /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next
COPY --from=build /app/next.config.js /app/next.config.js
COPY --from=build /app/build /app/build
COPY --from=build /app/pages /app/pages
COPY --from=build /app/public /app/public
COPY --from=build /app/server /app/server

EXPOSE 3000

CMD [ "npm", "start" ]
