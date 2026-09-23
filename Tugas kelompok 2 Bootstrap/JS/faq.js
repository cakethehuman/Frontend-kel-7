const $acc = $(".accordion");

$acc.each(function () {
    $(this).on('click', function () {
        let $panel = $(this).next();
        let $pTag = $(this).find('p');

        $(this).toggleClass("active");

        if ($pTag.text() === '+') {
            $pTag.text('-');
        } else {
            $pTag.text('+');
        }

        $panel.slideToggle();
    });
});
