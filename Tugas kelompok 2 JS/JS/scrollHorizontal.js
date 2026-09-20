
// Ensures every tag is properly loaded before loading the javascript
document.addEventListener("DOMContentLoaded", () => {
    const horizontalScrollerContainer = document.querySelector(".menu-navigation");
    const speed = 0.3; // ranging from 0 to 1
    horizontalScrollerContainer.addEventListener("wheel", (event) => {
        // checks if it's on android mode
        if (window.innerWidth < 576) {
            if (event.deltaY !== 0) { // if the user scrolls up or down, because deltaY === 0 when the user scrolls with trackpad
            event.preventDefault(); // method of the Event interface tells the user agent that 
            // the event is being explicitly handled, 
            // so its default action, 
            // such as page scrolling, link navigation, or pasting text, should not be taken. comment grabbed from vsc
            horizontalScrollerContainer.scrollLeft += (event.deltaY * speed); // translates the vertical movement to horizontal movement, specifically scroll left
            // positive value scrolls left, negative value scrolls right
            }
        }
    });
});
