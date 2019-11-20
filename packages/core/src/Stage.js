export const TYPE = {
    NOTIFY: Symbol('Stage.type notify'),
    TRANSFORM: Symbol('Stage.type transform'),
    EFFECT: Symbol('Stage.type effect')
}

export class Stage {
    constructor(type, name, { input, output, catchToOutput } = {}) {
        this.type = type
        this.name = name

        this.input = input
        this.output = output
        this.catchToOutput = catchToOutput ?? false
    }

    getStage() {
        if (this.type === TYPE.NOTIFY) {
            return 'notifyStage'
        } else if (this.type === TYPE.TRANSFORM) {
            return 'transformStage'
        } else if (this.type === TYPE.EFFECT) {
            return 'effectStage'
        }
    }

    static of(type, name, opts) {
        return new Stage(type, name, opts)
    }
}
