angular.module('angular-meditor', []).directive('meditor', [
  '$timeout',
  function ($timeout) {
    return {
      scope: {},
      transclude: true,
      templateUrl: 'views/editor.html',
      link: function (scope, element, attributes) {
        scope.position = {
          top: 10,
          left: 10,
          bellow: false
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
        var $toolbar = element.find('.angular-meditor-toolbar'), $content = element.find('.angular-meditor-content'), $selects = element.find('select');
        $content.attr('contenteditable', true);
        var setToolbarPosition = function () {
          var toolbarHeight = $toolbar[0].offsetHeight, toolbarWidth = $toolbar[0].offsetWidth, spacing = 5, selection = window.getSelection(), range = selection.getRangeAt(0), boundary = range.getBoundingClientRect(), elementBoundary = element.get(0).getBoundingClientRect(), topPosition = boundary.top - elementBoundary.top, leftPosition = boundary.left - elementBoundary.left;
          if (boundary.top < toolbarHeight + spacing) {
            scope.position.top = topPosition + boundary.height + spacing;
            scope.position.bellow = true;
          } else {
            scope.position.top = topPosition - toolbarHeight - spacing;
            scope.position.bellow = false;
          }
          scope.position.left = leftPosition - toolbarWidth / 2 + boundary.width / 2;
          return this;
        };
        var checkSelection = function () {
          var newSelection = window.getSelection();
          var parentNode = newSelection.anchorNode.parentNode;
          while (parentNode.tagName !== undefined && parentNode !== element[0]) {
            parentNode = parentNode.parentNode;
          }
          if (parentNode === element[0]) {
            $timeout(function () {
              if (newSelection.toString().trim() === '') {
                scope.showToolbar = false;
              } else {
                scope.showToolbar = true;
                setToolbarPosition();
              }
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
            angular.forEach(scope.familyOptions, function (family, i) {
              if (scope.styles.fontFamily.indexOf(family.label) !== -1) {
                scope.family = scope.familyOptions[i];
                return false;
              }
            });
            angular.forEach(scope.sizeOptions, function (size, i) {
              if (scope.styles.fontSize === size.label + 'px') {
                scope.size = scope.sizeOptions[i].value;
                return false;
              }
            });
          });
        };
        var showToolbarOnMouseup = false;
        $content.bind('keyup', checkSelection);
        $content.bind('mousedown', function () {
          showToolbarOnMouseup = true;
        });
        document.addEventListener('mouseup', function (e) {
          if (!showToolbarOnMouseup)
            return false;
          showToolbarOnMouseup = false;
          checkSelection(e);
        }, false);
        var contentBlurTimer;
        $content.bind('blur', function () {
          if (contentBlurTimer)
            clearTimeout(contentBlurTimer);
          contentBlurTimer = setTimeout(checkSelection, 200);
        });
        var selectBlurTimer;
        $selects.bind('blur', function () {
          if (selectBlurTimer)
            clearTimeout(selectBlurTimer);
          selectBlurTimer = setTimeout(checkSelection, 200);
        });
        scope.SimpleAction = function (action) {
          document.execCommand('styleWithCSS', false, false);
          document.execCommand(action, false, null);
        };
        scope.$watch('size', function () {
          document.execCommand('styleWithCSS', false, true);
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
          wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
          wf.type = 'text/javascript';
          wf.async = 'true';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(wf, s);
        }());
      }
    };
  }
]);
angular.module('angular-meditor').run([
  '$templateCache',
  function ($templateCache) {
    'use strict';
    $templateCache.put('views/editor.html', '<div class="angular-meditor">\n' + '\t<div class="angular-meditor-toolbar" style="top: {{ position.top }}px; left: {{ position.left }}px" ng-class="{ \'angular-meditor-toolbar--show\': showToolbar, \'angular-meditor-toolbar--bottom\': position.bellow }">\n' + '\t\t<ul>\n' + '\t\t\t<li>\n' + '\t\t\t\t<button type="button" ng-click="SimpleAction(\'bold\')" class="meditor-button-bold" ng-class="{ \'bold\': \'meditor-button--active\' }[styles.fontWeight]">\n' + '\t\t\t\t\tB\n' + '\t\t\t\t</button>\n' + '\t\t\t</li>\n' + '\t\t\t<li>\n' + '\t\t\t\t<button type="button" ng-click="SimpleAction(\'italic\')" class="meditor-button-italic" ng-class="{ \'italic\': \'meditor-button--active\' }[styles.fontStyle]">\n' + '\t\t\t\t\tI\n' + '\t\t\t\t</button>\n' + '\t\t\t</li>\n' + '\t\t\t<li>\n' + '\t\t\t\t<button type="button" ng-click="SimpleAction(\'underline\')" class="meditor-button-underline" ng-class="{ \'underline\': \'meditor-button--active\' }[styles.textDecoration]">\n' + '\t\t\t\t\tU\n' + '\t\t\t\t</button>\n' + '\t\t\t</li>\n' + '\t\t\t<li>\n' + '\t\t\t\t<label class="meditor-select">\n' + '\t\t\t\t\t<select ng-model="size" ng-options="s.value as s.label for s in sizeOptions" class="meditor-size-selector"></select>\n' + '\t\t\t\t</label>\n' + '\t\t\t</li>\n' + '\t\t\t<li>\n' + '\t\t\t\t<label class="meditor-select">\n' + '\t\t\t\t\t<select ng-model="family" ng-options="s as s.label for s in familyOptions" class="meditor-family-selector"></select>\n' + '\t\t\t\t</label>\n' + '\t\t\t</li>\n' + '\t\t</ul>\n' + '\t</div>\n' + '\t<div class="angular-meditor-content" ng-transclude></div>\n' + '</div>\n');
  }
]);
