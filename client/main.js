// declare consts up here

$(document).ready(function () {
   
});

$(window).load(function () {
   centerLogo();
});

let resizeId;
$(window).resize(function () {
   clearTimeout(resizeId);
   resizeId = setTimeout(doneResizing, 150); // sets the milliseconds to wait before completing resizing functions
});

function doneResizing() {
   // All the functions you want to execute after resize go here
   
}
