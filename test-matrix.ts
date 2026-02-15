
import { Matrix } from './src/core/Matrix.ts';

const m = new Matrix();
console.log('Matrix initialized');
m.enter().catch(e => {
    console.error('FAILED TO ENTER MATRIX');
    console.error(e);
});
