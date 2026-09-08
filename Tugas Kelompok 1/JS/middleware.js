import Calc from '../JS/calc.js'

let TEST = new Calc([5, 77, 11, 61, 68, 24, 53, 64, 23, 50, 52, 72, 4, 44, 76, 85, 33, 2, 98, 31, 51, 38, 82, 88, 26, 17, 77, 63, 88, 41]);

const form = document.getElementById("stat-form");
const element = document.getElementById("hidden-table");
const meanValue = document.getElementById('mean-result');

form.addEventListener("submit", (event) => {
    event.preventDefault();

    meanValue.innerText = TEST.mean;
    element.style.display = "block";
});

form.addEventListener("reset", (event) => {
    event.preventDefault();

    element.style.display = "none";
});