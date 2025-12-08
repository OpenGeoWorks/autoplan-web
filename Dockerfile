ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /src

# Build
FROM base AS build

COPY --link package.json package-lock.json ./
RUN npm install

COPY --link . .

RUN npm run build
RUN npm prune

# Run
FROM base

ENV PORT=3000

COPY --from=build /src/.output /src/.output

CMD [ "node", ".output/server/index.mjs" ]