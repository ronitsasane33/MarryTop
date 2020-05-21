
// Personal Details  SECTION 1

$(document).ready(function() {
    $("#editPersonalDetails").click(function() {
      $(".inputSegment1").toggleClass("editable");
      $("#section1").toggleClass("square square1");
      $("#btn1").toggleClass("toggleInvisisble toggleVisisble");
      $('.inputSegment1').prop('disabled', function(i, v) { return !v; });
    });
 });

 
// Professional Details  SECTION 3

$(document).ready(function() {
    $("#editProfessional").click(function() {
      $(".inputSegment3").toggleClass("editable");
      $("#section3").toggleClass("square square1");
      $("#btn3").toggleClass("toggleInvisisble toggleVisisble");
      $('.inputSegment3').prop('disabled', function(i, v) { return !v; });
    });
 });

//Religion & Lifestyle  SECTION 4

$(document).ready(function() {
    $("#editReligionLife").click(function() {
      $(".inputSegment4").toggleClass("editable");
      $("#section4").toggleClass("square square1");
      $("#btn4").toggleClass("toggleInvisisble toggleVisisble");
      $('.inputSegment4').prop('disabled', function(i, v) { return !v; });
    });
 });

 //Family Details  SECTION 5

$(document).ready(function() {
    $("#editFamily").click(function() {
      $(".inputSegment5").toggleClass("editable");
      $("#section5").toggleClass("square square1");
      $("#btn5").toggleClass("toggleInvisisble toggleVisisble");
      $('.inputSegment5').prop('disabled', function(i, v) { return !v; });
    });
 });

 //Location  SECTION 6

$(document).ready(function() {
    $("#editLocation").click(function() {
      $(".inputSegment6").toggleClass("editable");
      $("#section6").toggleClass("square square1");
      $("#btn6").toggleClass("toggleInvisisble toggleVisisble");
      $('.inputSegment6').prop('disabled', function(i, v) { return !v; });
    });
 });