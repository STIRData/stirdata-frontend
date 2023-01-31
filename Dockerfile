FROM node:14-alpine AS final
WORKDIR /app
COPY . /app
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
