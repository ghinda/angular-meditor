angular.module('angular-meditor', []).directive('meditor', [
  '$timeout',
  function ($timeout) {
    'use strict';
    return {
      scope: {},
      transclude: true,
      templateUrl: 'views/editor.html',
      link: function (scope, element, attributes) {
        scope.position = {
          top: 10,
          left: 10,
          below: false
        };
        scope.showToolbar = false;
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
        scope.styles = {};
        var generatedTags = {
            'b': '',
            'strong': '',
            'i': '',
            'em': '',
            'u': ''
          };
        var $toolbar = element.find('.angular-meditor-toolbar');
        var $content = element.find('.angular-meditor-content');
        var $selects = element.find('select');
        var $body = angular.element('body');
        $content.attr('contenteditable', true);
        var setToolbarPosition = function () {
          var toolbarHeight = $toolbar[0].offsetHeight;
          var toolbarWidth = $toolbar[0].offsetWidth;
          var spacing = 5;
          var selection = window.getSelection();
          var range = selection.getRangeAt(0);
          var boundary = range.getBoundingClientRect();
          var topPosition = boundary.top;
          var leftPosition = boundary.left;
          if (boundary.top < toolbarHeight + spacing) {
            scope.position.top = topPosition + boundary.height + spacing;
            scope.position.below = true;
          } else {
            scope.position.top = topPosition - toolbarHeight - spacing;
            scope.position.below = false;
          }
          scope.position.left = leftPosition - toolbarWidth / 2 + boundary.width / 2;
          var scrollLeft = window.pageXOffset !== undefined ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
          var scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
          scope.position.top += scrollTop;
          scope.position.left += scrollLeft;
          return this;
        };
        var checkSelection = function (e) {
          if (e && e.target && $toolbar.find(e.target).length) {
            return false;
          }
          var newSelection = window.getSelection();
          var anchorNode = newSelection.anchorNode;
          if (newSelection.toString().trim() === '' || !anchorNode) {
            return $timeout(function () {
              scope.showToolbar = false;
            });
          }
          var parentNode = anchorNode.parentNode;
          while (parentNode.tagName !== undefined && parentNode !== element[0]) {
            parentNode = parentNode.parentNode;
          }
          if (parentNode === element[0]) {
            $timeout(function () {
              scope.showToolbar = true;
              setToolbarPosition();
            });
            checkActiveButtons(newSelection);
          } else {
            $timeout(function () {
              scope.showToolbar = false;
            });
          }
          return this;
        };
        var checkActiveButtons = function (selection) {
          var parentNode = selection.anchorNode;
          if (!parentNode.tagName) {
            parentNode = selection.anchorNode.parentNode;
          }
          var childNode = parentNode.childNodes[0];
          if (childNode && childNode.tagName && childNode.tagName.toLowerCase() in generatedTags) {
            parentNode = parentNode.childNodes[0];
          }
          $timeout(function () {
            scope.styles = window.getComputedStyle(parentNode, null);
            if (scope.styles.fontSize !== scope.size.label + 'px') {
              angular.forEach(scope.sizeOptions, function (size, i) {
                if (scope.styles.fontSize === size.label + 'px') {
                  scope.size = scope.sizeOptions[i].value;
                  return false;
                }
              });
            }
          });
        };
        $content.bind('keyup', checkSelection);
        document.addEventListener('mouseup', checkSelection);
        var contentBlurTimer;
        $content.bind('blur', function () {
          if (contentBlurTimer) {
            clearTimeout(contentBlurTimer);
          }
          contentBlurTimer = setTimeout(checkSelection, 200);
        });
        var selectBlurTimer;
        $selects.bind('blur', function () {
          if (selectBlurTimer) {
            clearTimeout(selectBlurTimer);
          }
          selectBlurTimer = setTimeout(checkSelection, 200);
        });
        scope.SimpleAction = function (action) {
          document.execCommand('styleWithCSS', false, false);
          document.execCommand(action, false, null);
        };
        scope.$watch('size', function () {
          document.execCommand('styleWithCSS', false, false);
          document.execCommand('fontSize', false, scope.size);
        });
        scope.$watch('family', function () {
          if (window.WebFont) {
            WebFont.load({ google: { families: [scope.family.label] } });
          }
          document.execCommand('styleWithCSS', false, true);
          document.execCommand('fontName', false, scope.family.value);
        });
        (function () {
          var wf = document.createElement('script');
          wf.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
          wf.type = 'text/javascript';
          wf.async = 'true';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(wf, s);
        }());
        $body.append($toolbar);
      }
    };
  }
]);
angular.module('angular-meditor').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('views/editor.html', '<div class="angular-meditor">\n' + '  <div class="angular-meditor-toolbar" style="top: {{ position.top }}px; left: {{ position.left }}px" ng-class="{ \'angular-meditor-toolbar--show\': showToolbar, \'angular-meditor-toolbar--bottom\': position.below }">\n' + '    <ul>\n' + '      <li>\n' + '        <button type="button" ng-click="SimpleAction(\'bold\')" class="meditor-button-bold" ng-class="{ \'bold\': \'meditor-button--active\' }[styles.fontWeight]">\n' + '          B\n' + '        </button>\n' + '      </li>\n' + '      <li>\n' + '        <button type="button" ng-click="SimpleAction(\'italic\')" class="meditor-button-italic" ng-class="{ \'italic\': \'meditor-button--active\' }[styles.fontStyle]">\n' + '          I\n' + '        </button>\n' + '      </li>\n' + '      <li>\n' + '        <button type="button" ng-click="SimpleAction(\'underline\')" class="meditor-button-underline" ng-class="{ \'underline\': \'meditor-button--active\' }[styles.textDecoration]">\n' + '          U\n' + '        </button>\n' + '      </li>\n' + '      <li>\n' + '        <label class="meditor-select">\n' + '          <select ng-model="size" ng-options="s.value as s.label for s in sizeOptions" class="meditor-size-selector"></select>\n' + '        </label>\n' + '      </li>\n' + '      <li>\n' + '        <label class="meditor-select">\n' + '          <select ng-model="family" ng-options="s as s.label for s in familyOptions" class="meditor-family-selector"></select>\n' + '        </label>\n' + '      </li>\n' + '    </ul>\n' + '  </div>\n' + '  <div class="angular-meditor-content" ng-transclude></div>\n' + '</div>\n');
  }
]);