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
  
  vm.work = {
    minutes: 2,
    seconds: 0,
    secondsStr: '00',
    inputWorkMinutes: 2
  };
  vm.rest = {
    minutes: 1,
    seconds: 0,
    secondsStr: '00',
    inputRestMinutes: 1
  };
  
  vm.work.timer = new PomoTimer(vm.work);
  
  vm.rest.timer = new PomoTimer(vm.rest);

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
