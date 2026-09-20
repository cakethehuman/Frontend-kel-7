$(function() {
    const $containers = $(".coffee-selection-container");
    const animation_delay = 800;
    // for delay
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    $containers.each(function() {
        // getting the buttons
        const $size = $(this).find(".display-content").first();
        const $cups = $(this).find(".coffee-selection-button");
        const $currentContainer = $(this);

        // getting the priceholder via container
        const $priceDisplay = $(this).closest('.item-description').find('.price-placeholder').first();

        $size.on('pointerdown', function(event) {
            event.stopPropagation();

            $containers.not($currentContainer).removeClass("active");

            $currentContainer.toggleClass("active");
        });

        $cups.each(function() {
            const $cup = $(this);
            $cup.on('pointerdown', async function(event) {
                event.stopPropagation();
                const price = $cup.data('price');
                await sleep(animation_delay);

                if ($priceDisplay && price) {
                    $priceDisplay.text(`${price}`);
                }
            });
        });

    });

});





