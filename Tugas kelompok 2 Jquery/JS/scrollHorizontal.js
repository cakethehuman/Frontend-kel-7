
// Ensures every tag is properly loaded before loading the javascript
$(function() {
    const $horizontalScrollerContainer = $(".menu-navigation");
    const speed = 0.3;
    $horizontalScrollerContainer.on("wheel", function(event) {
        // checks if it's on android mode
        if (window.innerWidth < 576) {
            const deltaY = event.originalEvent.deltaY;
            if (deltaY !== 0) {// if the user scrolls up or down, because deltaY === 0 when the user scrolls with trackpad
                event.preventDefault(); // method of the Event interface tells the user agent that 
        // the event is being explicitly handled, 
        // so its default action, 
        // such as page scrolling, link navigation, or pasting text, should not be taken. comment grabbed from vsc
                event.preventDefault();
                
                const currentScrollLeft = $horizontalScrollerContainer.scrollLeft();

                const newScrollLeft = currentScrollLeft + (deltaY * speed);
                // translates the vertical movement to horizontal movement, specifically scroll left
                // positive value scrolls left, negative value scrolls right
                $horizontalScrollerContainer.scrollLeft(newScrollLeft);
            } 
        }
    });
});

