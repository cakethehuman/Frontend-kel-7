$('#shopping-cart').load('cart.html');

$('#shopping-cart').on('click', function(){
    window.location.href = "cart-info.html";
})

$(document).on('click', '.add-to-cart', function(){
    CartStore.add(CartStore.fromCard($(this).closest('.menu-card')));
    window.location.href = "cart-info.html";
})