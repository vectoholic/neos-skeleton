$(document).ready(function () {
  if ($('body').hasClass('neos-backend')) {
    cssUrl = $('#main-css').attr('href');
    backendHalfCssUrl = cssUrl.replace('main', 'main-backend-half');
    backendFullCssUrl = cssUrl.replace('main', 'main-backend-full');

    var setCssUrl = function() {
      var left = $('body').css('marginLeft').replace('px', '');
      var right = $('body').css('marginRight').replace('px', '');

      if ((left > 0 && right == 0) || (right > 0 && left == 0)) {
        $('#main-css').attr('href', backendHalfCssUrl);
      } else if (left > 0 && right > 0) {
        $('#main-css').attr('href', backendFullCssUrl);
      } else if (right == 0 && left == 0) {
        $('#main-css').attr('href', cssUrl);
      }
    }

    $('body').on('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', function(event) {
      if (event.target.localName == 'body') {
        setCssUrl();
      }
    });
  }
});
