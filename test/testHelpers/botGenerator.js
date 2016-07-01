import c from '../../src/constants'

let generator = {}


generator.botOne = (config={}) => {
    return {
        name: 'Super Bot One',
        balances: {
            BTC:      2.0,
            ALPHA:    100,
            BETA:     200,
            GAMMA:    300,
            CRYSTALS: 100,
            TOKENLY:  100,
            TOKENLY:  100,
        },
        ...config
    }
}
generator.botTwo = (config={}) => {
    return {
        name: 'Super Bot Two',
        balances: {
            BTC:      2.0 * 2,
            ALPHA:    100 * 2,
            BETA:     200 * 2,
            GAMMA:    300 * 2,
            CRYSTALS: 100 * 2,
            TOKENLY:  100 * 2,
            TOKENLY:  100 * 2,
        },
        ...config
    }
}
generator.botThree = (config={}) => {
    return {
        name: 'Super Bot Three',
        balances: {
            BTC:      2.0 * 3,
            ALPHA:    100 * 3,
            BETA:     200 * 3,
            GAMMA:    300 * 3,
            CRYSTALS: 100 * 3,
            TOKENLY:  100 * 3,
            TOKENLY:  100 * 3,
        },
        ...config
    }
}


export default generator;