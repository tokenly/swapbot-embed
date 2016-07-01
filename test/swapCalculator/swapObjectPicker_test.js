import { expect }          from '../test_helper';
import swapObjectGenerator from '../testHelpers/swapObjectGenerator';
import botGenerator        from '../testHelpers/botGenerator';
import swapObjectPicker    from '../../src/reducers/desiredSwap/swapObjectPicker';

describe('Swap Object Picker' , () => {

    it('filters by out token', () => {
        let swapObjects = swapObjectGenerator.alphaAndBetaArray();
        let chosenSwapObject = swapObjectPicker.pickBestSwapObject(swapObjects, 'BETA', 10, 'BTC');

        expect(chosenSwapObject).to.exist
        expect(chosenSwapObject.bot.name).to.equal('Super Bot One')


        chosenSwapObject = swapObjectPicker.pickBestSwapObject(swapObjects, 'BETA', null, null);
        expect(chosenSwapObject).to.exist
        expect(chosenSwapObject.bot.name).to.equal('Super Bot One')

    });

    it('filters by in token', () => {
        let swapObjects = [swapObjectGenerator.alpha({in: 'XCP'}),swapObjectGenerator.beta(),]
        let chosenSwapObject = swapObjectPicker.pickBestSwapObject(swapObjects, '', null, 'BTC');

        expect(chosenSwapObject).to.exist
        expect(chosenSwapObject.bot.name).to.equal('Super Bot One')

    });

    it('finds by out and in token', () => {
        let swapObjects = swapObjectGenerator.alphaBetaWithXCP();
        let chosenSwapObject = swapObjectPicker.pickBestSwapObject(swapObjects, 'BETA', 10, 'BTC');

        expect(chosenSwapObject).to.exist
        expect(chosenSwapObject.bot.name).to.equal('Super Bot One')

    });

    it('filters by amount', () => {
        let swapObjects = [
            swapObjectGenerator.alpha({}),
            swapObjectGenerator.alpha({}, botGenerator.botTwo()),
        ];

        let chosenSwapObject = swapObjectPicker.pickBestSwapObject(swapObjects, 'ALPHA', 150, 'BTC');

        expect(chosenSwapObject).to.exist
        expect(chosenSwapObject.bot.name).to.equal('Super Bot Two')
    });

    it('chooses by by best price', () => {
        let swapObjects = [
            swapObjectGenerator.alpha({rate: 100}),
            swapObjectGenerator.alpha({rate: 200}, botGenerator.botTwo()),
            swapObjectGenerator.alpha({rate: 300}, botGenerator.botThree()),
        ];

        let chosenSwapObject = swapObjectPicker.pickBestSwapObject(swapObjects, 'ALPHA', 100, 'BTC');

        expect(chosenSwapObject).to.exist
        expect(chosenSwapObject.bot.name).to.equal('Super Bot Three')
    });

});
