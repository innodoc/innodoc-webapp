ARG BUILD_IMAGE
FROM $BUILD_IMAGE as build

FROM gitlab-registry.tubit.tu-berlin.de/innodoc/innodoc-webapp/playwright:latest
LABEL maintainer="Mirko Dietrich <dietrich@math.tu-berlin.de>"
ENV INNODOC_WEBAPP_CI=true

USER innodocuser
WORKDIR /home/innodocuser/innodoc-webapp
COPY --from=build /home/innodocuser/innodoc-webapp/. .

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["yarn", "run", "test:e2e", "--color"]
