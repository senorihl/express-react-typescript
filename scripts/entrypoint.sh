#!/usr/bin/env bash

set -x

if [[ ! -z "$DEV_UID" ]] 
then 
    usermod -u ${DEV_UID} www-data
    groupmod -g ${DEV_UID} www-data
fi

eval "$@"