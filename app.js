// app.js
angular.module('pomoApp', [])
// Add lodash for use in controllers, unit tests
.constant('_', window._)
// Add lodash for use in views, ng-repeat="x in _.range(3)"
.run(function ($rootScope) {
  $rootScope._ = window._;
})
//.constant('moment', window.moment)
// Main Controller
.controller('MainController', function($scope, $interval) {
  var vm = this;
  
  vm.work = {};
  vm.rest = {};
  
  vm.work.inputWorkMinutes = 25;
  vm.rest.inputRestMinutes = 5;

  vm.work.minutes = 2;
  vm.work.seconds = 0;
  vm.work.secondsStr = '00';
  
//  vm.countdown = vm.minutes.toString() + ':' + (vm.seconds.toString().length === 1 ? '0' + vm.seconds : vm.seconds);
  
  vm.work.timer = new PomoTimer(vm.work);
  
  function PomoTimer(timer) {
    var stop;
    
    this.startTimer = function() {
      // Return immediately if timer is running
      if (angular.isDefined(stop)) return;
      // Assign stop the promise
      stop = $interval(function() {
        if (timer.seconds === 0 && timer.minutes === 0) {
          this.stopTimer();
        } else if (timer.seconds === 0) {
          --timer.minutes;
          timer.seconds = 59;
        } else {
          --timer.seconds;
        }
        timer.secondsStr = timer.seconds.toString().length === 1 ? '0' + timer.seconds : timer.seconds;
      }, 1000);
    }
    this.stopTimer = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    }
    
  }
    
  $scope.$on('$destroy', function() {
    vm.workTimer.stopTimer();
  });
  
});
