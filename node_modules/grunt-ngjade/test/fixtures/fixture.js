angular.module('ng-templates').run(function($templateCache) {
  $templateCache.put('test/fixtures/smoke',
    '<h1>Fixture</h1><ul><li>Hello</li><li>Goodbye</li></ul>'
  );
});
