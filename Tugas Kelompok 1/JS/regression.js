import Calc from './calc.js'

class Regression{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    fit(){
        let XCalc = new Calc(this.x);
        let YCalc = new Calc(this.y);
        let xMean = XCalc.mean;
        let yMean = YCalc.mean;

        let conv = 0;
        let varianceX = 0;
        for(let i = 0; i < this.x.length; i++){
            conv += (x[i] - xMean) * (y[i] - yMean);
            varianceX += (x[i] - xMean)**2;
        }
        let slope = conv / varianceX
        let intercept = yMean - slope * xMean;
        return [slope, intercept]
    }
}

let x = [1,2];
let y = [2,1];
const r = new Regression(x,y);
console.log(r.fit());