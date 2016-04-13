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
  
  vm.pomo = new PomoTimer();
  
  function PomoTimer() {
    this.work = {
      minutes: 0,
      seconds: 5,
      secondsStr: '05',
      inputMinutes: 0
    };
    this.rest = {
      minutes: 1,
      seconds: 0,
      secondsStr: '00',
      inputMinutes: 1
    };

    this.rest.timer = new Timer(this.rest);

    this.work.timer = new Timer(this.work, this.rest);
  }
  
  function Timer(timer, next) {
    this.stop;
    
    this.stopTimer = stopTimer;
    this.startTimer = startTimer;
    this.addMinutes = addMinutes;
    this.subMinutes = subMinutes;
    
    function stopTimer() {
      if (angular.isDefined(this.stop)) {
        $interval.cancel(this.stop);
        this.stop = undefined;
      }
    }
    
    function startTimer(next) {
      // Return immediately if timer is running
      if (angular.isDefined(this.stop)) return;
      // Assign stop the promise
      this.stop = $interval(function() {
        if (next && timer.minutes === 0 && timer.seconds === 1) {
          next.timer.startTimer();
        }
        if (timer.seconds === 0 && timer.minutes === 0) {
          stopTimer();
        } else if (timer.seconds === 0) {
          --timer.minutes;
          timer.seconds = 59;
        } else {
          --timer.seconds;
        }
        timer.secondsStr = timer.seconds.toString().length === 1 ? '0' + timer.seconds : timer.seconds;
      }, 1000);
    }
    
    function addMinutes(num) {
      timer.inputMinutes += num;
    }
    
    function subMinutes(num) {
      timer.inputMinutes -= num;
    }
  }
    
  $scope.$on('$destroy', function() {
    vm.work.timer.stopTimer();
    vm.rest.timer.stopTimer();
  });
  
});
