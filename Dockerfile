# TRANSPILER
FROM node:16.3.0-alpine3.11 as base_transpile
RUN apk add --no-cache git protoc
WORKDIR /transpile
COPY libs/ libs/
COPY apps/ apps/
COPY common/ common/
COPY tsconfig.json .
RUN npm i -g pnpm
RUN npm i -g @microsoft/rush
COPY rush.json .
RUN rush update
RUN rush build

# SERVICE
FROM node:16.3.0-alpine3.11 as base_service
RUN apk add --no-cache git
ENV NODE_ENV production
WORKDIR /service

#FROM base_transpile as transpile_api
#RUN rush deploy -p @taverna/api

#FROM base_transpile as transpile_web
#RUN rush deploy -p @taverna/web

################
### SERVICES ###
################
FROM base_service as api
COPY --from=base_transpile /transpile/libs/typeorm ./transpile/libs/typeorm
COPY --from=base_transpile /transpile/apps/api .
EXPOSE 4000
CMD [ "node", "dist/index.js"]

FROM nginx:stable-alpine as web
COPY --from=base_transpile /transpile/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=base_transpile /transpile/apps/web/dist ./usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]