$(document).ready(function () {
   $('#logo-box').bigtext();
});

$(window).load(function () {
   centerLogo();
});

let resizeId;
$(window).resize(function () {
   clearTimeout(resizeId);
   resizeId = setTimeout(doneResizing, 200); // sets the milliseconds to wait before completing resizing functions
});

function doneResizing() {
   // All the functions you want to execute after resize go here
   centerLogo();
}

function centerLogo() {
   let logoHeight = $('#logo-box').outerHeight();
   let wrapperHeight = $('.js-img-height').outerHeight();
   $('#logo-box').css({
      'margin-top': (wrapperHeight - logoHeight) * 0.48
   });
}
