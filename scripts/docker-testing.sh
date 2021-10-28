#!/usr/bin/env bash

sleep $2

curl -f -LI http://127.0.0.1:8080/

RESULT=$?

if [[ $RESULT != 0 ]]; then
  eval "$1"
fi

exit $RESULT
