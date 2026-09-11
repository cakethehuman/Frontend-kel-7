import Calc from './calc.js'

const form = document.getElementById("stat-form");
const element = document.getElementById("hidden-table");


function createTable(data){
    const mainTabel = document.querySelector('#hidden-table tbody');
    const template = document.getElementById('result-template');

    const fragment = document.createDocumentFragment();
    
    data.forEach(element => {
        const clone =  template.content.cloneNode(true);

        clone.querySelector('.table-id').textContent = element.id
        clone.querySelector('.table-content').textContent = element.content

        fragment.append(clone);
    });

    mainTabel.replaceChildren(fragment);
}

// Listen to button press
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let data = Object.fromEntries(formData.entries()); 
    let data_clean = data['angka_input'].split(',').map(Number)
    let result = new Calc(data_clean);
    let mode  = result.mode()
    let hasilMode;
    if(Array.isArray(mode)){
        hasilMode = `${mode[0]} with a frequency of ${mode[1]}`;
    } else{
        let hasilMultipleMode = [];
        let frequency;
        mode.forEach((freq, num) =>{
            frequency = freq;
            hasilMultipleMode.push(num);
        });
        hasilMode = `${hasilMultipleMode} have all have a frequncy of ${frequency}`; 
    }
    let statisticResult = [
        {'id': 'Count', "content" : result.numberCount},
        {'id': 'Sum', "content" : result.total},
        {'id': 'Mean', "content" : result.mean},
        {'id': 'Mode', "content" : hasilMode},
        {'id': 'Max', "content" : result.largest},
        {'id': 'Min', "content" : result.smallest},
        {'id': 'Range', "content" : result.range},
        {'id': 'Variance', "content" : result.variance},
        {'id': 'Sample Variance', "content" : result.sampleVariance},
        {'id': 'STD', "content" : result.standardDeviation},
        {'id': 'Sample STD', "content" : result.sampleStandardDeviation},
        {'id': 'Geometric Mean', "content" : result.geometricMean},
        {'id': 'sorted data', "content": result.sorted}
    ];

    createTable(statisticResult);

    element.style.display = "block";
});

form.addEventListener("reset", (event) => {
    event.preventDefault();

    element.style.display = "none";
});

