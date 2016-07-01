import c                   from '../../src/constants'
import botGenerator        from './botGenerator'
import SwapObject          from '../../src/lib/api/SwapObject'

let generator = {}

generator.alphaAndBetaArray = () => {
    return [
        generator.alpha(),
        generator.beta(),
    ];
}

generator.alphaBetaWithXCP = () => {
    return [
        generator.alpha(),
        generator.alpha({in: 'XCP', rate: 10}),
        generator.beta(),
        generator.beta({in: 'XCP', rate: 10}),
    ];
}

generator.rateSellConfig = (config={}, bot={}) => {
    let swapConfig = {
        in:        'BTC',
        out:       'TOKENLY',
        direction: 'sell',
        price:     0.02,
        rate:      50,
        strategy:  'rate',
        ...config
    };
    return new SwapObject({
        bot: { ...botGenerator.botOne(), ...bot},
        swap: {config: swapConfig},
    });
}

generator.rateSellConfigWithDiscount = (config={}, bot={}) => {
    let swapConfig = withDiscount({
        in:        'BTC',
        out:       'TOKENLY',
        direction: 'sell',
        price:     0.02,
        rate:      50,
        strategy:  'rate',
        ...config
    });

    return new SwapObject({
        bot: { ...botGenerator.botOne(), ...bot},
        swap: {config: swapConfig},
    });
}

generator.rateBuyConfig = (config={}, bot={}) => {
    let swapConfig = {
        in:        'TOKENLY',
        out:       'BTC',
        direction: 'buy',
        rate:      25,
        strategy:  'rate',
        ...config
    };
    return new SwapObject({
        bot: { ...botGenerator.botOne(), ...bot},
        swap: {config: swapConfig},
    });
}

generator.fixedConfig = (config={}, bot={}) => {
    let swapConfig = {
        strategy:  'fixed',
        in:        'COAL',
        out:       'CRYSTALS',
        in_qty:    2,
        out_qty:   1,
        divisible: false,
        ...config
    };
    return new SwapObject({
        bot: { ...botGenerator.botOne(), ...bot},
        swap: {config: swapConfig},
    });
}

generator.fiatSellConfig = (config={}, bot={}) => {
    let swapConfig = {
        in:        'BTC',
        out:       'TOKENLY',
        direction: 'sell',
        strategy:  'fiat',
        cost:      10,
        ...config
    };
    return new SwapObject({
        bot: { ...botGenerator.botOne(), ...bot},
        swap: {config: swapConfig},
    });
}

generator.greekLettersBase = (config={}, bot={}) => {
    let swapConfig = {
        in:        'BTC',
        out:       'ALPHA',
        direction: 'buy',
        rate:      100,
        strategy:  'rate',
        ...config
    };
    return new SwapObject({
        bot: { ...botGenerator.botOne(), ...bot},
        swap: {config: swapConfig},
    });
}

generator.alpha = (config={}, bot={}) => {
    return generator.greekLettersBase({out: 'ALPHA', rate: 1000, ...config}, bot);
}
generator.beta = (config={}, bot={}) => {
    return generator.greekLettersBase({out: 'BETA', rate: 500, ...config}, bot);
}
generator.gamma = (config={}, bot={}) => {
    return generator.greekLettersBase({out: 'GAMMA', rate: 250, ...config}, bot);
}
generator.phi = (config={}, bot={}) => {
    return generator.greekLettersBase({out: 'GAMMA', rate: 100, ...config}, bot);
}
generator.chi = (config={}, bot={}) => {
    return generator.greekLettersBase({out: 'CHI', rate: 50, ...config}, bot);
}
generator.psi = (config={}, bot={}) => {
    return generator.greekLettersBase({out: 'PSI', rate: 10, ...config}, bot);
}
generator.omega = (config={}, bot={}) => {
    return generator.greekLettersBase({out: 'OMEGA', rate: 5, ...config}, bot);
}


// ------------------------------------------------------------------------

let withDiscount = (config={}) => {
    return {
        swapRules: [
            {
                ruleType: c.RULE_TYPE_BULK_DISCOUNT,
                discounts: [
                    { moq: 10, pct: 0.1, },
                    { moq: 20, pct: 0.2, },
                    { moq: 50, pct: 0.5, },
                ],
            }
        ],
        ...config
    }
}

export default generator;