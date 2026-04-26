(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname)
    {
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

$(window).on('load', function(){
    var professional_ds_ids = ["professional_music", "professional_voting", "professional_vcontrol"];
    var professional_software_ids = ["professional_energy", "professional_parking", "professional_tracking"];
    var capstone_project_ids = ["capstone_mouse_control"];
    var personal_project_ids = ["coursework_mbso", "coursework_os", "coursework_trie", "coursework_ecommerce"];

    var professional_project_id, capstone_project_id, personal_project_id;

    for (professional_project_id of professional_ds_ids){
        var temp = $("#" + professional_project_id);
        temp.removeClass("d-none").addClass("d-flex");
        $("#all_projects").append(temp);
        $("#professional_projects").append(temp.clone());
    }

    for (capstone_project_id of capstone_project_ids){
        var temp = $("#" + capstone_project_id);
        temp.removeClass("d-none").addClass("d-flex");
        $("#all_projects").append(temp);
        $("#capstone_projects").append(temp.clone());
    }

    for (professional_project_id of professional_software_ids){
        var temp = $("#" + professional_project_id);
        temp.removeClass("d-none").addClass("d-flex");
        $("#all_projects").append(temp);
        $("#professional_projects").append(temp.clone());
    }

    for (personal_project_id of personal_project_ids){
        var temp = $("#" + personal_project_id);
        temp.removeClass("d-none").addClass("d-flex");
        $("#all_projects").append(temp);
        $("#personal_projects").append(temp.clone());
    }
});

//$('.nav-item a[href="#all_projects"]').click(function(){
//    alert("test");
//});

})(jQuery); // End of use strict
