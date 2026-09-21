$(document).ready(function() {
    $('.btn-elevator').on('click', function(e) {
        e.preventDefault(); 
        var targetId = $(this).attr('data-target'); 
        var $btn = $(this);
        
        $btn.css('opacity', '0.5');
        
        $('html, body').animate({
            scrollTop: $(targetId).offset().top
        }, 'slow', function() {
            $btn.css('opacity', '1'); 
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