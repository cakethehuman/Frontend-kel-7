const $acc = $(".accordion");

$acc.each(function(){
    $(this).toggleClass("active");
    
    $(this).on('click', function(){
        let $panel = $(this).next();
        let $pTag = $(this).find('p');

        if ($pTag.text() === '+') {
            $pTag.text('-');
        } else {
            $pTag.text('+');
        }

        $panel.slideToggle(); 
    });
});