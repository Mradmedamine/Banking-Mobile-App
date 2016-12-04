angular.module('starter.controllers', ['ionic', 'ngCordova'])

//APP CONTROLLER
  .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $ionicHistory, LoginService, $state, $ionicPopup) {

    // Form data for the login modal
    $scope.loginData = {};
    $scope.registerData = {};

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {

      LoginService.loginUser($scope.loginData.username, $scope.loginData.password).success(function (data) {

        $rootScope.user = data;
        $rootScope.user.birthDate = new Date(data.birthDate);

        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('accountSelection');

      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: data
        });
      });
    };
  })

  //ACCOUNTS CONTROLLER
  .controller('accountsController', function ($scope, $rootScope, $ionicPopup, userService, transactionService, $state) {

    $scope.accounts = $rootScope.user.accounts;

    $scope.SelectAccount = function (account) {

      $rootScope.CurrentAccount = account;

      transactionService.retrieveTransaction(account._id).success(function (data) {
        $rootScope.transactions = data;
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: 'error!',
          template: data
        });
      });
      $state.go('home.account');
    }
  })

  //BANK CONTROLLER
  .controller('bankCtrl', function ($scope, $rootScope, userService, $state, pdfGenerationService, saveProfilService, LoginService, accountService, checkIbanService, transactionService, transferService, $location, $ionicPopup, $ionicHistory, $ionicModal) {

    $scope.transfer = {
      'iban': 0,
      'amount': 0
    };

    if ($location.url() == '/home/account/personal') {
      $scope.editbutton = true;
    }

    if ($location.url() == '/home/account/business') {
      $scope.switchButton = true;
    }

    if ($location.url() == '/home/history') {
      $scope.exportButton = true;
    }

    $ionicModal.fromTemplateUrl('templates/bank/editProfil.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $rootScope.$on('$locationChangeStart', function (event, newUrl) {

      $scope.editbutton = false;
      $scope.switchButton = false;
      $scope.exportButton = false;

      if ($location.url() == '/home/account/personal') {
        $scope.editbutton = true;
      }
      if ($location.url() == '/home/account/business') {
        $scope.switchButton = true;
      }
      if ($location.url() == '/home/history') {
        $scope.exportButton = true;
      }
    });

    //****************Account **************************

    $scope.edit = function () {
      $scope.userTemp = $scope.user;
      $scope.modal.show();
    };

    $scope.saveProfil = function () {
      saveProfilService.saveProfil($scope.userTemp).success(function (data) {
        $scope.user = $scope.userTemp;
        var alertPopup = $ionicPopup.alert({
          title: 'success!',
          template: data
        });
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: ' error',
          template: data
        });
      });
    };

    $scope.closeEdit = function () {
      $scope.modal.hide();
    };

    $scope.switchAccount = function () {
      var id = $rootScope.user._id;

      $rootScope.user = '';
      $rootScope.CurrentAccount = '';
      $rootScope.transactions = '';
      $scope.accounts = '';

      userService.User(id).success(function (data) {
        $rootScope.user = data;
        $rootScope.user.birthDate = new Date(data.birthDate);
      }).error(function (data) {
        var alertPopup = $ionicPopup.alert({
          title: ' error',
          template: data
        });
      });

      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();

      $rootScope.accounts = $rootScope.user.accounts;
      $state.go('accountSelection');
    };

    //******************Transfer*********************

    $scope.transfer = function () {

      if ($rootScope.CurrentAccount.balance < $scope.transfer.amount) {
        var alertPopup = $ionicPopup.alert({
          title: ' error',
          template: ' insufficient funds'
        });
      }
      else {

        checkIbanService.checkIban($scope.transfer.iban).success(function (data) {

          var confirmPopup = $ionicPopup.confirm({
            title: 'Transfer',
            template: data
          });
          confirmPopup.then(function (res) {
            if (res) {
              transferService.transfer($rootScope.CurrentAccount.iban, $scope.transfer.iban, $scope.transfer.amount).success(function (data) {
                var alertPopup = $ionicPopup.alert({
                  title: ' Success',
                  template: data
                });
              }).error(function (data) {
                var alertPopup = $ionicPopup.alert({
                  title: ' error',
                  template: data
                });
              });

              accountService.retrieveAccount($rootScope.CurrentAccount._id).success(function (data) {
                $rootScope.CurrentAccount = data;
              }).error(function (data) {
                var alertPopup = $ionicPopup.alert({
                  title: ' error',
                  template: data
                });
              });

              transactionService.retrieveTransaction($rootScope.CurrentAccount._id).success(function (data) {
                $rootScope.transactions = data;
              }).error(function (data) {
                var alertPopup = $ionicPopup.alert({
                  title: 'error!',
                  template: data
                });
              });
            }
          });
        }).error(function (data) {
          var alertPopup = $ionicPopup.alert({
            title: ' error',
            template: data
          });
        });
      }
    };

    //*********************Transactions *********************

    $ionicModal.fromTemplateUrl('templates/bank/transaction-detail.html', {
      scope: $scope
    }).then(function (mod) {
      $scope.mod = mod;
    });

    $scope.showTransaction = function (transaction) {
      $scope.transaction = transaction;
      $scope.mod.show();
    };

    $scope.closeTransaction = function () {
      $scope.mod.hide();
      $scope.transaction = '';
    };

    $scope.exportPDF = function () {
      $scope.date = new Date();
      pdfGenerationService.print();
    };

    //***************Logout **************

    $scope.logout = function () {

      var confirmPopup = $ionicPopup.confirm({
        title: 'Log out',
        template: "Log out now ?"
      });
      confirmPopup.then(function (res) {
        if (res) {

          $rootScope.user = '';
          $rootScope.CurrentAccount = '';
          $rootScope.transactions = '';
          $scope.accounts = '';

          $ionicHistory.clearHistory();
          $ionicHistory.clearCache();

          $state.go('app.login');

        }
      });
    }
  })

//MAP CONTROLLER
  .controller('MapController', function ($scope, $location, AgencyService, $cordovaGeolocation, $ionicLoading, $ionicPopup) {

    $scope.counter = 0;

    function onDeviceReady() {
      if ($scope.counter == 0) {
        document.addEventListener("online", onOnline, false);
        document.addEventListener("resume", onResume, false);
        loadMapsApi();
        $scope.counter = $scope.counter + 1;
      }
    }

    function closestAgency(data, mylatlng) {

      var Agency;
      var minDist = 1000000;
      var distance;
      var Latlng;

      for (var i in data) {
        Latlng = new google.maps.LatLng(data[i].lat, data[i].long);
        distance = google.maps.geometry.spherical.computeDistanceBetween(mylatlng, Latlng);
        if (distance < minDist) {
          Agency = data[i]._id;
          minDist = distance;
        }
      }
      return Agency;
    }

    function onOnline() {
      var url = $location.url();
      if (url == '/home/locations') {
        loadMapsApi();
      }
    }

    function onResume() {
      var url = $location.url();
      if ((url == '/home/locations') || (url == '/app/locations')) {
        loadMapsApi();
      }
    }

    function loadMapsApi() {

      if (navigator.network.connection.type == Connection.NONE) {
        var alertPopup = $ionicPopup.alert({
          title: 'Connection Error',
          template: 'Check your connection'
        });

      } else {
        $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });

        var posOptions = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          var lat = position.coords.latitude;
          var long = position.coords.longitude;

          var myLatlng = new google.maps.LatLng(lat, long);

          var mapOptions = {
            center: myLatlng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            navigationControl: true
          };

          var im = 'img/bluecircle.png';
          var bankIcon = 'img/bank-icon.png';
          var map = new google.maps.Map(document.getElementById("map"), mapOptions);

          AgencyService.getAgencies().success(function (data) {

            var Agency = closestAgency(data, myLatlng);

            for (var i in data) {
              var Latlng = new google.maps.LatLng(data[i].lat, data[i].long);
              if (data[i]._id == Agency) {
                new google.maps.Marker({
                  position: Latlng,
                  map: map,
                  title: data[i].name,
                  icon: bankIcon
                });
              } else {
                new google.maps.Marker({
                  position: Latlng,
                  map: map,
                  title: data[i].name
                });
              }
            }
          }).error(function (data) {
            var alertPopup = $ionicPopup.alert({
              title: ' error',
              template: 'error retrieving agencies'
            });
          });

          var userMarker1 = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: im
          });

          $scope.map = map;
          $ionicLoading.hide();

        }, function (err) {
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Error! cannot get your location',
            template: 'Please enable GPS on phone settings'
          });

        });
      }
    }

    // Add an event listener for deviceready
    document.addEventListener("deviceready", onDeviceReady, false);

  });

