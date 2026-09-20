const containers = document.querySelectorAll(".coffee-selection-container");


const animation_delay = 800;

// for delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

containers.forEach((container) =>{
    // getting the buttons
    const size = container.querySelector(".display-content");
    const cups = container.querySelectorAll(".coffee-selection-button");
    // getting the priceholder via container
    const priceDisplay = container.closest('.item-description').querySelector('.price-placeholder');


    // for size button
    size.addEventListener("pointerdown", (event) => {
        // ensures that once a button clicked, you have to click something to disable the popup
        event.stopPropagation();

        containers.forEach((otherContainer) => {
            if (otherContainer !== container) {
                otherContainer.classList.remove("active");
            }
        });

        container.classList.toggle("active");
    });

    // for cups button displaying price
    cups.forEach((cup) => {
        cup.addEventListener('pointerdown', async (event) => {
            event.stopPropagation();

            const price = cup.dataset.price;

            // trigger the delay

            await sleep(animation_delay);
            if (priceDisplay && price) {
                priceDisplay.textContent = price;
            }
            

            container.classList.remove("active");
        });
    });



});


document.addEventListener("pointerdown", () => {
    containers.forEach((container) => {
        container.classList.remove("active");
    });
});