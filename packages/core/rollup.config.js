import babel from 'rollup-plugin-babel'

export default [
    {
        input: 'src/index.js',
        output: [
            { dir: 'dist', format: 'cjs' },
            { dir: 'dist/es', format: 'es' }
        ],
        plugins: [babel({ exclude: 'node_modules/**' })]
    }
]
