import { default as geometricBrownianMotion } from '../src/geometricBrownianMotion';

describe('geometricBrownianMotion', () => {

    it('should output the correct number sequence', () => {
        // create a random number generator that produces a predictable sequence
        // 0.2, 0.8, 0.2, 0.8 ...
        const normal = () => {
            let index = 0;
            return () => index++ % 2 ? 0.2 : 0.8;
        };

        const gbm = geometricBrownianMotion()
            .steps(5)
            .random(normal());

        const gbmData = gbm(10);

        // this test data was generated at the following point:
        // b0ee0a397a6ecc4cf60663d5b51af15de3534ef1
        // and is assumed correct for the purposes of further refactor.
        expect(gbmData)
            .toEqual([
                10,
                10.563051249613967,
                10.862390962256633,
                11.473999242766038,
                11.799153741691457,
                12.463506567556125
            ]);
    });

    it('should accommodate boundary values', () => {
        expect(geometricBrownianMotion().steps(0)(10)).toEqual([10]);
    });

    it('should default seed value to 0', () => {
        const data = geometricBrownianMotion()();
        expect(data).toEqual([
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]);
    });

});
