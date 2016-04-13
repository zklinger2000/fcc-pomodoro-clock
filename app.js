// app.js
angular.module('pomoApp', [])
// Add lodash for use in controllers, unit tests
.constant('_', window._)
// Add lodash for use in views, ng-repeat="x in _.range(3)"
.run(function ($rootScope) {
  $rootScope._ = window._;
})
// Main Controller
.controller('MainController', function($scope, $interval) {
  var vm = this;
  
  // Create a PomoTimer
  vm.pomo = new PomoTimer();
  
  // PomoTimer constructor
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
    // Create a Rest Timer
    this.rest.timer = new Timer(this.rest);
    // Create a Work Timer and pass it the Rest Timer
    this.work.timer = new Timer(this.work, this.rest);
  }
  // Timer constructor
  function Timer(timer, next) {
    this._stop;  // promise from $interval timer
    
    // METHODS
    this.stopTimer = stopTimer;
    this.startTimer = startTimer;
    this.addMinutes = addMinutes;
    this.subMinutes = subMinutes;
    
    // Cancel the $interval and set its promise to 'undefined'
    function stopTimer() {
      if (angular.isDefined(this._stop)) {
        $interval.cancel(this._stop);
        this._stop = undefined;
      }
    }
    // Start the $interval and assing its promise to _stop
    function startTimer(next) {
      // Return immediately if timer is running
      if (angular.isDefined(this._stop)) return;
      // Assign _stop the promise returned from $interval
      this._stop = $interval(function() {
        // If there is a next timer, start it at 1 second left on this timer
        if (next && timer.minutes === 0 && timer.seconds === 1) {
          next.timer.startTimer();
        }
        // If timer runs out, call stopTimer() to unassign 'stop' properly
        if (timer.seconds === 0 && timer.minutes === 0) {
          stopTimer();
        // Else, if we hit zero seconds with minutes left, decrement minutes, seconds
        } else if (timer.seconds === 0) {
          --timer.minutes;
          timer.seconds = 59;
        // Else, decrement seconds
        } else {
          --timer.seconds;
        }
        // Set the string for seconds to pad a zero if needed
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
