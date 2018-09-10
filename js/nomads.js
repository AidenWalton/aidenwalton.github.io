(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav'
  });

})(jQuery); // End of use strict


(function ($) {
  "use strict";



  /*==================================================================
  [ Validate ]*/
  var name = $('.validate-input input[name="name"]');
  var email = $('.validate-input input[name="email"]');
  var message = $('.validate-input textarea[name="message"]');


  $('.validate-form').on('submit',function(){
      var check = true;

      if($(name).val().trim() == ''){
          showValidate(name);
          check=false;
      }


      if($(email).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
          showValidate(email);
          check=false;
      }

      if($(message).val().trim() == ''){
          showValidate(message);
          check=false;
      }

      return check;
  });


  $('.validate-form .input3').each(function(){
      $(this).focus(function(){
         hideValidate(this);
     });
  });

  function showValidate(input) {
      var thisAlert = $(input).parent();

      $(thisAlert).addClass('alert-validate');
  }

  function hideValidate(input) {
      var thisAlert = $(input).parent();

      $(thisAlert).removeClass('alert-validate');
  }

})(jQuery);

AOS.init({
    duration: 1200,
})

var typed = new Typed('.logo', {
    strings: ["Digital Nomads."],
    typeSpeed: 100
  });

