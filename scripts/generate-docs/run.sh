#!/usr/bin/env bash
documentation readme \
    src/operators/*.js \
    src/*.js \
    --config=documentation.yml \
    --markdown-toc-max-depth=3 \
    --babel=.babelrc \
    --shallow \
    --section API