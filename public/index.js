$(function() {
  $(".list-card-click").on("click",function(e) {
    var form = $(this).closest("form");
    form.submit();
    });
  });
