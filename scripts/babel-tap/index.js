#!/usr/bin/env node

require('tap').mochaGlobals()

const chai = require('chai')
const sinon = require('sinon')

chai.use(require('sinon-chai'))

global.sinon = sinon
global.expect = chai.expect

require('@babel/register')({
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: true
                }
            }
        ]
    ]
})
