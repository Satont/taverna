# TRANSPILER
FROM node:16.7.0-alpine3.11 as base_transpile
RUN apk add --no-cache git protoc
WORKDIR /transpile
COPY package.json tsconfig.json .
COPY packages/backend/package.json packages/backend/package.json
COPY packages/web/package.json packages/web/package.json 
RUN npm install yarn@1.22.11 -g
RUN yarn install --pure-lockfile
COPY packages/ packages/
COPY libs/ libs/
RUN yarn build

# SERVICE
FROM node:16.7.0-alpine3.11 as base_service
RUN apk add --no-cache git
ENV NODE_ENV production
WORKDIR /service

################
### SERVICES ###
################
FROM base_service as backend
ENV NODE_ENV="production"
COPY --from=base_transpile /transpile/libs/typeorm libs/typeorm
COPY --from=base_transpile /transpile/packages/backend packages/backend
EXPOSE 4000
WORKDIR packages/backend
CMD ["yarn", "start"]

FROM nginx:stable-alpine as web
COPY --from=base_transpile /transpile/packages/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=base_transpile /transpile/packages/web/dist ./usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]