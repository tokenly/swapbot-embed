import c from '../../src/constants'

let generator = {}

generator.buildSendHttpRequestMock = ()=>{

}

generator.rateSellConfig = (config={}) => {
    return {
        in:        'BTC',
        out:       'TOKENLY',
        direction: 'sell',
        price:     0.02,
        strategy:  'rate',
        ...config
    }
}

generator.rateBuyConfig = (config={}) => {
    return {
        inToken:   'TOKENLY',
        outToken:  'BTC',
        direction: 'buy',
        rate:      25,
        strategy:  'rate',
        ...config
    }
}

generator.fixedConfig = (config={}) => {
    return {
        strategy:  'fixed',
        in:        'COAL',
        out:       'CRYSTALS',
        in_qty:    2,
        out_qty:   1,
        divisible: false,
        ...config
    }
}

generator.fiatSellConfig = (config={}) => {
    return {
        in:        'BTC',
        out:       'TOKENLY',
        direction: 'sell',
        strategy:  'fiat',
        cost:      10,
        ...config
    }
}


// ------------------------------------------------------------------------

generator.rateSellConfigWithDiscount = (config={}) => {
    return {
        in:        'BTC',
        out:       'TOKENLY',
        direction: 'sell',
        price:     0.02,
        strategy:  'rate',
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