FROM node:20-bullseye-slim AS base

FROM base AS installer
WORKDIR /installer
RUN mkdir -p /installer

COPY package.json yarn.lock ./ 
RUN yarn install --frozen-lockfile --production
COPY . .
ARG API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$API_BASE_URL
RUN yarn build

FROM base AS runner
WORKDIR /app
COPY --from=installer /installer/.next/standalone ./ 
COPY --from=installer /installer/.next/static ./.next/static
COPY --from=installer /installer/public ./public 

ENTRYPOINT [ "node", "server.js" ]