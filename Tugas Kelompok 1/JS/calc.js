class Calc{

    constructor(data){
        this.data = data;
    }

    count(){
        return this.data.length;
    }
    
    sum(){
        let total = 0;
        let dataLen = this.count();
        for(let i =0; i < dataLen; i++){
            total += this.data[i];
        }
        return total;
    }

    mean(){
        let total = this.sum();
        let dataLen = this.count();
        return total / dataLen;
    }

    sorted(){
        return this.data.sort((a, b) => a - b);
    }

    median(){
        let result;
        let dataLen = this.count();
        if(dataLen % 2 == 0){
            let nb1 = dataLen / 2;
            let nb2 = nb1 + 1;
            result = (nb1 + nb2 ) / 2;
        } else {
            let index = Math.ceil(dataLen / 2);
            result = dataLen[index];
        }
        return result;
    }

    mode(){
        return 1;
    }

    largest(){
        let newData = this.sorted();
        let dataLen = this.count();
        return newData[dataLen-1];
    }

    smallest(){
        let newData = this.sorted();
        return newData[0];
    }
    
    range(){
        let large = this.largest();
        let small = this.smallest();
        return large - small;
    }
}


let TEST = new Calc([0.2,1,2,3,433])
console.log(TEST.smallest())
console.log(TEST.range())