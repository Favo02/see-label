FROM node:22 as react-build

ARG VERSION

WORKDIR /app
COPY . ./
RUN npm install --ignore-engines
RUN sed -i "s/VERSION/$VERSION/g" ./package.json
RUN npm run build

# server environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template

COPY --from=react-build /app/build /usr/share/nginx/html

ENV PORT 8001
EXPOSE 8001
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
