class Calc{
    // # menandakan private method, tidak bisa diakses di luar function (saat di-instantiate sebagai object)
    #data;
    #numberCount;
    #total;
    #mean;
    #range;
    #sorted;
    #largest;
    #smallest;
    #variance;
    #sampleVariance;
    #geometricMean;
    #standardDeviation;
    #sampleStandardDeviation;

    constructor(data) {
        this.#data = [...data];
        this.#refreshData();
    }


    // melakukan refresh pada data, dipakai saat instantiation object dan appending key value pair baru
    #refreshData() {
        this.#count();
        this.#sum();
        this.#calculateMean();

        this.#calculateFrequency();
        this.#calculateAllPossibleModes();

        this.#calculateSortedSequence();
        this.#calculateMedian();
        this.#calculateLargest();
        this.#calculateSmallest();

        this.#calculateRange();
        this.#calculateVariance();
        this.#calculateSampleVariance();
        this.#calculateGeometricMean();

        this.#CalcultaeStandardDeviation();
        this.#CalcultaeSampleStandardDeviation();
    }

    // retrieving the copy data

    get data() {
        return [...this.#data];
    }

    get numberCount() {
        return this.#numberCount;
    }

    get total() {
        return this.#total;
    }

    get mean() {
        return this.#mean;
    }

    get sorted() {
        return [...this.#sorted];
    }

    get largest() {
        return this.#largest;
    }

    get smallest() {
        return this.#smallest;
    }

    get variance() {
        return this.#variance;
    }
    
    get sampleVariance() {
        return this.#sampleVariance;
    }

    get geometricMean() {
        return this.#geometricMean;
    }

    get range() {
        return this.#range;
    }

    get standardDeviation() {
        return this.#standardDeviation;
    }

    get sampleVariance() {
        return this.#sampleStandardDeviation;
    }

 
    addData(value) {
        this.#data.push(value);
        this.#refreshData();
    }

    #count(){
        this.#numberCount = this.#data.length;
    }
    
    #sum(){
        let total = 0;
        for(let i = 0; i < this.numberCount; i++){
            total += this.#data[i];
        }
        this.#total = total;
    }

    #calculateMean(){
        this.#mean = this.total / this.numberCount;
    }

    #calculateSortedSequence(){
        // copy the data from this.data
        this.#sorted = [...this.#data].sort((a, b) => a - b);
    }

    #calculateMedian(){
        let result;
        if(this.numberCount % 2 == 0){
            let nb1Index = (this.numberCount) / 2 - 1;
            let nb2Index = nb1Index + 1;
            result = (this.sorted[nb1Index] + this.sorted[nb2Index]) / 2;
        } else {
            let index = Math.ceil(this.numberCount / 2) - 1;
            result = this.sorted[index];
        }
        this.median = result; 
    }

    #calculateFrequency(){
        const numberFrequency = new Map();
        for (let i = 0; i < this.numberCount; i++) {
            if (!numberFrequency.has(this.#data[i])) {
                numberFrequency.set(this.#data[i], 1);
            }   else {
                    numberFrequency.set(this.#data[i], numberFrequency.get(this.#data[i]) + 1);
            }
        }
        this.numberFrequency = numberFrequency;
        // console.log(this.numberFrequency);
    }

    #calculateAllPossibleModes(){
        let frequentData = this.#data[0];
        let frequentDataCount = 0;
        const allPossibleModes = new Map();
        for (const [key, value] of this.numberFrequency) {
            // console.log(`Key: ${key}, value: ${value}`)
            if (allPossibleModes.size === 0) {
                    // console.log(`key yang akan ditambahkan: ${key}, valuenya : ${value}`);
                    frequentData = key;
                    frequentDataCount = value;
                    allPossibleModes.set(frequentData, value);
                } 
            else if (allPossibleModes.size > 0) {
                    let firstKey = allPossibleModes.keys().next().value;
                    let firstKeyValue = allPossibleModes.get(firstKey);
                    
                    if (firstKeyValue < value){
                        // console.log(firstKeyValue)
                        // console.log(allPossibleModes)
                        
                        while (allPossibleModes.size !== 0) {
                            firstKey = allPossibleModes.keys().next().value;
                            firstKeyValue = allPossibleModes.get(firstKey);
                            // console.log(`First key: ${firstKey}, valuenya: ${firstKeyValue}, key pembanding: ${key}, value untuk pembanding: ${value}`);
                            // console.log(`Key ${firstKey} akan didelete`);
                            allPossibleModes.delete(firstKey);
                        }
                        // console.log(`Key ${key} akan ditambahkan`);
                        allPossibleModes.set(key, value);
                        frequentData = key;
                        frequentDataCount = value;
                    }
                    else if (firstKeyValue === value){
                        // console.log(`Value sama, keynya: ${key}`);
                        allPossibleModes.set(key, value);
                        continue; 
                    }
                
            }
        }
        this.frequentData = frequentData;
        this.frequentDataCount = frequentDataCount;
        this.allPossibleModes = allPossibleModes;
    }

    isMultipleMode() {
        return this.allPossibleModes.size > 1;
    }
    mode(){
        if (this.isMultipleMode()) {
            return this.allPossibleModes;
        }
        return [this.frequentData, this.frequentDataCount];
    }

    #calculateLargest(){
        this.#largest = this.sorted[this.numberCount-1];
    }

    #calculateSmallest(){
        this.#smallest = this.sorted[0];
    }
    
    #calculateRange(){
        this.#range = this.largest - this.smallest;
    }

    #calculateVariance() {
        let differenceOfMeanAndDataset = 0
        let result;
        for (let i = 0; i < this.numberCount; i++) {
            differenceOfMeanAndDataset += (this.#data[i] - this.mean) ** 2
        }
        result = differenceOfMeanAndDataset / this.numberCount;

        this.#variance = result;
    }

    #calculateSampleVariance() {
        let differenceOfMeanAndDataset = 0
        let result;
        for (let i = 0; i < this.numberCount; i++) {
            differenceOfMeanAndDataset += (this.#data[i] - this.mean) ** 2
        }
        result = differenceOfMeanAndDataset / (this.numberCount - 1);

        this.#sampleVariance = result;
    }

    #calculateGeometricMean() {
        let productOfDataset = 1;
        let result;
        for (let i = 0; i < this.numberCount; i++) {
            productOfDataset *= this.#data[i];
        }

        result = Math.pow(productOfDataset, 1/this.numberCount);
        this.#geometricMean = result;
    }

    #CalcultaeStandardDeviation(){
        this.#standardDeviation =  Math.sqrt(this.variance);
    }

    #CalcultaeSampleStandardDeviation(){
        this.#sampleStandardDeviation =  Math.sqrt(this.sampleVariance);
    }
}

export default Calc;
// // let TEST = new Calc(Array.from({length: 100}, () => Math.floor(Math.random() * 100) + 1));
// let TEST = new Calc([5, 77, 11, 61, 68, 24, 53, 64, 23, 50, 52, 72, 4, 44, 76, 85, 33, 2, 98, 31, 51, 38, 82, 88, 26, 17, 77, 63, 88, 41]);

// console.log(`The data is:\n${TEST.data}`);
// if (TEST.isMultipleMode()) {
//     for (const [key, value] of TEST.mode()) {
//         // console.log(`value ${key} has ${value} occurence`)
//     }
// }   else {
//         const [modeValue, modeFrequency] = TEST.mode();


//         // console.log(TEST.smallest());
//         // console.log(TEST.range());
//         console.log(`The mode is: ${modeValue}`);
//         console.log(`The frequency is: ${modeFrequency}`);
// }


// console.log("Before appending: ");

// console.log(`Varians: ${TEST.variance}`);
// console.log(`Sample Varians: ${TEST.sampleVariance}`);
// console.log(`Geometric mean: ${TEST.geometricMean}`);


// console.log("After the new data, 5");

// TEST.addData(5);
// console.log(`Varians: ${TEST.variance}`);
// console.log(`Sample Varians: ${TEST.sampleVariance}`);
// console.log(`Geometric mean: ${TEST.geometricMean}`);


// console.log(`The data is:\n${TEST.data}`);
// if (TEST.isMultipleMode()) {
//     for (const [key, value] of TEST.mode()) {
//         console.log(`value ${key} has ${value} occurence`)
//     }
// }   else {
//         const [modeValue, modeFrequency] = TEST.mode();


//         // console.log(TEST.smallest());
//         // console.log(TEST.range());
//         console.log(`The mode is: ${modeValue}`);
//         console.log(`The frequency is: ${modeFrequency}`);
// }

