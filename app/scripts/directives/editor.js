/* angular-meditor directive
 */

angular.module('angular-meditor', []).directive('meditor', [ '$timeout', function ($timeout) {
  return {
    scope: {},
    transclude: true,
    templateUrl: 'views/editor.html',
    link: function (scope, element, attributes) {

      // toolbar position
      scope.position = {
        top: 10,
        left: 10,
        bellow: false
      };

      scope.showToolbar = false;

      // fontSize options
      scope.sizeOptions = [
        {
          label: '10',
          value: 1
        },
        {
          label: '13',
          value: 2
        },
        {
          label: '16',
          value: 3
        },
        {
          label: '18',
          value: 4
        },
        {
          label: '24',
          value: 5
        },
        {
          label: '32',
          value: 6
        },
        {
          label: '48',
          value: 7
        }
      ];
      scope.size = scope.sizeOptions[0].value;

      scope.familyOptions = [
        {
          label: 'Open Sans',
          value: 'Open Sans, sans-serif'
        },
        {
          label: 'Source Sans Pro',
          value: 'Source Sans Pro, sans-serif'
        },
        {
          label: 'Exo',
          value: 'Exo, sans-serif'
        },
        {
          label: 'Oswald',
          value: 'Oswald, sans-serif'
        },
        {
          label: 'Cardo',
          value: 'Cardo, serif'
        },
        {
          label: 'Vollkorn',
          value: 'Vollkorn, serif'
        },
        {
          label: 'Old Standard TT',
          value: 'Old Standard TT, serif'
        }
      ];
      scope.family = scope.familyOptions[0];

      // current styles of selected elements
      // used to highlight active buttons
      scope.styles = {};

      // tags generated by the editor
      // used to highlight active styles
      var generatedTags = {
        'b': '',
        'strong': '',
        'i': '',
        'em': '',
        'u': ''
      };

      var $toolbar = element.find('.angular-meditor-toolbar'),
        $content = element.find('.angular-meditor-content'),
        $selects = element.find('select');

      // edit all the things
      $content.attr('contenteditable', true);

      // position the toolbar above or bellow the selected text
      var setToolbarPosition = function () {
        var toolbarHeight = $toolbar[0].offsetHeight,
          toolbarWidth = $toolbar[0].offsetWidth,
          spacing = 5,
          selection = window.getSelection(),
          range = selection.getRangeAt(0),
          boundary = range.getBoundingClientRect(),
          elementBoundary = element.get(0).getBoundingClientRect(),
          topPosition = boundary.top - elementBoundary.top,
          leftPosition = boundary.left - elementBoundary.left;

        // if there isn't enough space at the top, place it at the bottom
        // of the selection
        if(boundary.top < (toolbarHeight + spacing)) {
          scope.position.top = topPosition + boundary.height + spacing;
          // tell me if it's above or bellow the selection
          // used in the template to place the triangle above or bellow
          scope.position.bellow = true;
        } else {
          scope.position.top = topPosition - toolbarHeight - spacing;
          scope.position.bellow = false;
        }

        // center toolbar above selected text
        scope.position.left = leftPosition - (toolbarWidth/2) + (boundary.width/2);

        return this;
      };

      // get current selection and act on toolbar depending on it
      var checkSelection = function () {
        var newSelection = window.getSelection();

        // check if selection is in the current editor/directive container
        var parentNode = newSelection.anchorNode.parentNode;
        while (parentNode.tagName !== undefined && parentNode !== element[0]) {
          parentNode = parentNode.parentNode;
        }

        // if the selection is in the current editor
        if(parentNode === element[0]) {
          // show the toolbar
          $timeout(function() {
            if (newSelection.toString().trim() === '') {
              scope.showToolbar = false;
            } else {
              scope.showToolbar = true;
              setToolbarPosition();
            }
          });

          // check selection styles and active buttons based on it
          checkActiveButtons(newSelection);
        } else {
          // hide the toolbar
          $timeout(function() {
            scope.showToolbar = false;
          });
        }

        return this;
      };

      // check current selection styles and activate buttons
      var checkActiveButtons = function (selection) {
        var parentNode = selection.anchorNode;

        if (!parentNode.tagName) {
          parentNode = selection.anchorNode.parentNode;
        }

        // TODO underline button activation not working properly
        var childNode = parentNode.childNodes[0];

        if(childNode && childNode.tagName && childNode.tagName.toLowerCase() in generatedTags) {
          parentNode = parentNode.childNodes[0];
        }

        $timeout(function() {
          // get real styles of selected element
          scope.styles = window.getComputedStyle(parentNode, null);

          // set font family selector
          angular.forEach(scope.familyOptions, function(family, i) {
            if(scope.styles.fontFamily.indexOf(family.label) !== -1) {
              scope.family = scope.familyOptions[i];
              return false;
            }
          });

          // set font size selector
          angular.forEach(scope.sizeOptions, function(size, i) {
            if(scope.styles.fontSize === (size.label + 'px')) {
              scope.size = scope.sizeOptions[i].value;
              return false;
            }
          });
        });

      };

      var showToolbarOnMouseup = false;
      $content.bind('keyup', checkSelection);
      $content.bind('mousedown', function() {
        showToolbarOnMouseup = true;
      });

      // in case you select the text, but move the mouse outside the container
      // the toolbar will show up if you started the selection from the container
      document.addEventListener('mouseup', function(e) {
        if(!showToolbarOnMouseup) return false;
        showToolbarOnMouseup = false;
        checkSelection(e);
      }, false);

      var contentBlurTimer;
      $content.bind('blur', function() {
        if(contentBlurTimer) clearTimeout(contentBlurTimer);
        contentBlurTimer = setTimeout(checkSelection, 200);
      });

      // if after a selection in the select,
      // the contenteditable doesn't get the focus
      // the toolbar will not hide on blur.
      // so I have to add a blur event to the selects.
      var selectBlurTimer;
      $selects.bind('blur', function() {
        if(selectBlurTimer) clearTimeout(selectBlurTimer);
        selectBlurTimer = setTimeout(checkSelection, 200);
      });

      // simple edit action - bold, italic, underline
      scope.SimpleAction = function(action) {
        document.execCommand('styleWithCSS', false, false);
        document.execCommand(action, false, null);
      };

      // watch the font size selector
      scope.$watch('size', function() {
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('fontSize', false, scope.size);
      });

      // watch the font family selector
      scope.$watch('family', function() {
        // dynamically load the family from google fonts
        if(window.WebFont) {
          WebFont.load({
            google: {
              families: [ scope.family.label ]
            }
          });
        }

        document.execCommand('styleWithCSS', false, true);
        document.execCommand('fontName', false, scope.family.value);
      });

      // load google webfont library
      // to be able to dynamically load fonts
      (function() {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
      })();

    }
  }
}]);
