import { expect } from '../test_helper';
import swapCalculator from '../../src/lib/util/swapCalculator';
import swapObjectGenerator from '../testHelpers/swapObjectGenerator';
import quoteGenerator from '../testHelpers/quoteGenerator';

describe('Swap Calculator' , () => {

    it('calculates basic rate sell quantity', () => {
        let actualQuantities = swapCalculator.inQuantitiesFromOutQuantity(1, swapObjectGenerator.rateSellConfig().swap);
        expect(actualQuantities.quantity).to.equal(0.02);
        expect(actualQuantities.quantityBeforeDiscount).to.equal(0.02);
    });

    it('calculates basic rate buy quantity', () => {
        let actualQuantities = swapCalculator.inQuantitiesFromOutQuantity(1, swapObjectGenerator.rateBuyConfig().swap);
        expect(actualQuantities.quantity).to.equal(0.04);
        expect(actualQuantities.quantityBeforeDiscount).to.equal(0.04);
    });

    it('calculates basic fixed sell quantity', () => {
        let actualQuantities = swapCalculator.inQuantitiesFromOutQuantity(1, swapObjectGenerator.fixedConfig().swap);
        expect(actualQuantities.quantity).to.equal(2);
        expect(actualQuantities.quantityBeforeDiscount).to.equal(2);
    });

    it('calculates basic fiat sell quantity', () => {
        let actualQuantities = swapCalculator.inQuantitiesFromOutQuantity(1, swapObjectGenerator.fiatSellConfig().swap, quoteGenerator.buildBTCQuote());
        expect(actualQuantities.quantity).to.equal(0.02);
        expect(actualQuantities.quantityBeforeDiscount).to.equal(0.02);
        expect(actualQuantities.buffer).to.equal(0.00016);
    });

});
