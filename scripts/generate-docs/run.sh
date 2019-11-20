#!/usr/bin/env bash
documentation readme \
    src/operators/*.js \
    src/*.js \
    --config=documentation.yml \
    --babel=.babelrc \
    --shallow \
    --section API