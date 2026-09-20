$(document).ready(function() {
    $('.btn-elevator').on('click', function(e) {
        e.preventDefault(); 
        var targetId = $(this).attr('data-target'); 
        var $btn = $(this);
        var originalText = $btn.text();
        
        $btn.text('Naik...').css('background-color', '#555');
        
        $('html, body').animate({
            scrollTop: $(targetId).offset().top
        }, 'slow', function() {
            $btn.text(originalText).css('background-color', '');
        });
    });

    $('.menu-navigation a').on('click', function(e) {
        e.preventDefault();
        var targetId = $(this).attr('href');
        
        $('.menu-navigation a').css({
            'font-weight': 'normal',
            'color': ''
        });
        $(this).css({
            'font-weight': 'bold',
            'color': '#8B4513'
        });

        $('html, body').animate({
            scrollTop: $(targetId).offset().top
        }, 'slow');
    });
});