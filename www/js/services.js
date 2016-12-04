angular.module('starter.services', ['ngCordova'])


  .service('LoginService', function ($q, $cordovaSQLite, $http) {
    return {

      loginUser: function (login, pw) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http({
          method: 'POST',
          url: pathRacine + '/users',
          data: {
            "login": login,
            "password": pw
          }

        }).then(function successCallback(response) {

          if (response.data.success == true) {

            deferred.resolve(response.data.extras.userModel);

          } else {
            if (response.data.extras.msg == 0) {
              deferred.reject('Wrong credentials.');
            } else {
              deferred.reject('Wrong Password.');
            }
          }
        }, function errorCallback(response) {
          deferred.reject('connection error.');
        });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      }
    }
  })

  .service('AgencyService', function ($q, $http) {
    return {

      getAgencies: function () {

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http({
          method: 'get',
          url: pathRacine + '/agencies'

        }).then(function successCallback(response) {

          deferred.resolve(response.data);

        }, function errorCallback(response) {

          deferred.reject('error retrieving agencies');

        });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;

      }
    }
  })


  .service('saveProfilService', function ($q, $http) {
    return {

      saveProfil: function (user) {

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http({
          method: 'put',
          url: pathRacine + '/users/' + user._id,
          data: JSON.stringify(user)

        }).then(function successCallback(response) {

          console.log(response);

          if (response.data.success == true) {
            deferred.resolve('profil saved');
          } else {
            deferred.reject('database error.');
          }

        }, function errorCallback(response) {
          deferred.reject('connection error.');
        });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      }
    }
  })


  .service('checkIbanService', function ($q, $http) {
    return {

      checkIban: function (iban) {

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http({
          method: 'get',
          url: pathRacine + '/users/accounts/' + iban

        }).then(function successCallback(response) {

          if (!(response.data.length == 0)) {

            deferred.resolve('do you want to Transfer to ' + response.data[0].firstname + ' ' + response.data[0].lastname);

          } else {
            deferred.reject('wrong IBAN !');
          }

        }, function errorCallback(response) {

          deferred.reject('connection error.');

        });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      }
    }
  })


  .service('transferService', function ($q, $http) {
    return {

      transfer: function (ibansender, ibanreceiver, amount) {

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http({
          method: 'post',
          url: pathRacine + '/users/accounts',
          data: {
            "ibansender": ibansender,
            "ibanreceiver": ibanreceiver,
            "amount": amount
          }

        }).then(function successCallback(response) {

          if (response.data.success == true) {
            deferred.resolve('Transfer done successfully !');
          }
        }, function errorCallback(response) {

          deferred.reject('connection error.');

        });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      }
    }
  })

  .service('transactionService', function ($q, $http) {
    return {
      retrieveTransaction: function (id) {

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http({
          method: 'get',
          url: pathRacine + '/transactions/' + id

        }).then(function successCallback(response) {

          deferred.resolve(response.data);

        }, function errorCallback(response) {

          deferred.reject('connection error.');

        });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };

        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      }
    }
  })

  .service('accountService', function ($q, $http) {
    return {

      retrieveAccount: function (id) {

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http({
          method: 'get',
          url: pathRacine + '/accounts/' + id

        }).then(function successCallback(response) {

          deferred.resolve(response.data);

        }, function errorCallback(response) {

          deferred.reject('connection error.');

        });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
        return promise;
      }
    }
  })

  .service('userService', function ($q, $http) {
    return {

      User: function (id) {

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http({
          method: 'get',
          url: pathRacine + '/users/' + id

        }).then(function successCallback(response) {

          deferred.resolve(response.data);

        }, function errorCallback(response) {
          deferred.reject('connection error.');
        });

        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };

        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };

        return promise;
      }
    }
  })

  .service('pdfGenerationService', function ($http, $compile, $timeout, $rootScope) {
    return {

      // Génération du PDF
      print: function () {
        //génération du code HTML

        $http.get('file:///android_asset/www/templates/bank-statement/bank-statement-template.html').then(function (response) {

          var el = angular.element(response.data);
          var result = $compile(el)($rootScope);

          $timeout(function () {
            var compiledHtml = (
            '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"> <HTML> <HEAD>'
            + ' \<META http-equiv="Content-Type" content="text/html; charset=UTF-8">'
            + '  \<META http-equiv="X-UA-Compatible" content="IE=8">'
            + ' \<TITLE>Created by BCL easyConverter SDK 3 (HTML Version)</TITLE>'
            + ' \<STYLE type="text/css">'
            + result[7].innerHTML
            + '  \</STYLE> </HEAD> <BODY> '
            + result[9].outerHTML
            + '\</BODY> </HTML>' );
            var success = function (status) {
              // alert('Message: ' + status);
            };
            var error = function (status) {
              alert('Error: ' + status);
            };
            window.html2pdf.create(compiledHtml,
              "/mnt/sdcard/at.modalog.cordova.plugin.html2pdf/bankStatement.pdf",
              success,
              error
            );
          });
        });
      }
    }

  })
;

