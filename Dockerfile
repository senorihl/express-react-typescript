FROM node:lts

ARG DEV_UID

ENV DEV_UID=$DEV_UID

COPY ./scripts/entrypoint.sh /entrypoint.sh
COPY ./scripts/permissions.sh /permissions.sh

RUN ["/permissions.sh"]

RUN mkdir -p /var/www ; chown www-data:www-data -R /var/www

USER www-data

VOLUME /var/www/app

COPY --chown=www-data:www-data . /var/www/app

WORKDIR /var/www/app

ENTRYPOINT [ "/entrypoint.sh" ]

EXPOSE 8080