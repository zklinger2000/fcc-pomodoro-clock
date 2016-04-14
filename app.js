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
  vm.workMins = 25;
  vm.restMins = 5;
  
  vm.toggleTimer = toggleTimer;

  // Create a PomoTimer
  vm.pomo = new PomoTimer(vm.workMins, vm.restMins);

  // Toggle a Timer on/off
  function toggleTimer(timer, next) {
    if (timer._stop) {
      timer.stopTimer();
    } else {
      if (next) {
        timer.startTimer(next);
      }
    }
  }  
  // PomoTimer constructor
  function PomoTimer(workMins, restMins) {
    var _workMins = workMins;
    var _restMins = restMins;
    this.work = {
      minutes: _workMins,
      seconds: 0,
      secondsStr: '00',
      inputMinutes: _workMins,
      graphBlank: {
        height: '100%'
      },
      graph: {
        height: '0%'
      },
      isActive: false
    };
    this.rest = {
      minutes: _restMins,
      seconds: 0,
      secondsStr: '00',
      inputMinutes: _restMins,
      graphBlank: {
        height: '100%'
      },
      graph: {
        height: '0%'
      },
      isActive: false
    };
    // Reset function
    this.reset = function() {
      // Reset Rest Timer
      this.rest.timer.stopTimer();
      this.rest.minutes = _restMins;
      this.rest.seconds = 0;
      this.rest.secondsStr = '00';
      this.rest.inputMinutes = _restMins;
      this.rest.graphBlank = {
        height: '100%'
      };
      this.rest.graph = {
        height: '0%'
      };
      this.rest.isActive = false;
      // Reset Work Timer
      this.work.timer.stopTimer();
      this.work.minutes = _workMins;
      this.work.seconds = 0;
      this.work.secondsStr = '00';
      this.work.inputMinutes = _workMins;
      this.work.graphBlank = {
        height: '100%'
      };
      this.work.graph = {
        height: '0%'
      };
      this.work.isActive = false;
    };
    
    // Create a Rest Timer
    this.rest.timer = new Timer(this.rest);
    // Create a Work Timer and pass it the Rest Timer
    this.work.timer = new Timer(this.work, this.rest);

  }
  // Timer constructor
  function Timer(timer, next) {
    this._stop;  // promise from $interval timer
    //this.isActive = false;
    
    // METHODS
    this.stopTimer = stopTimer;
    this.startTimer = startTimer;
    this.addMinutes = addMinutes;
    this.subMinutes = subMinutes;
    var timerLength;
    // Cancel the $interval and set its promise to 'undefined'
    function stopTimer() {
      timer.isActive = false;
      if (angular.isDefined(this._stop)) {
        $interval.cancel(this._stop);
        this._stop = undefined;
      }
    }
    // Start the $interval and assign its promise to _stop
    function startTimer(next) {
      timerLength = timerLength || (timer.minutes * 60);
      // Return immediately if timer is running
      if (angular.isDefined(this._stop)) return;
      
      timer.isActive = true;
      // Assign _stop the promise returned from $interval
      this._stop = $interval(function() {
      timer.graphBlank.height = Math.max(0, (((timer.minutes * 60 + timer.seconds) / timerLength) * 100) - 1) + '%';
      timer.graph.height = Math.min(100, (101 - ((timer.minutes * 60 + timer.seconds) / timerLength) * 100)) + '%';
        // If there is a next timer, start it at 1 second left on this timer
        if (next && timer.minutes === 0 && timer.seconds === 1) {
          next.timer.startTimer();
        }
        // If timer runs out, call stopTimer() to unassign 'stop' properly
        if (timer.seconds === 0 && timer.minutes === 0) {
//          this.isActive = false;
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
      if (!this._stop) {
        timer.minutes = timer.inputMinutes;
        timer.seconds = 0;
        timer.secondsStr = '00';
        timerLength = undefined;
      }
    }
    
    function subMinutes(num) {
      if (timer.inputMinutes <= 1) return;
      timer.inputMinutes -= num;
      if (!this._stop) {
        timer.minutes = timer.inputMinutes;
        timer.seconds = 0;
        timer.secondsStr = '00';
        timerLength = undefined;
      }
    }
  }

  $scope.$on('$destroy', function() {
    vm.pomo.work.timer.stopTimer();
    vm.pomo.rest.timer.stopTimer();
  });
  
});
