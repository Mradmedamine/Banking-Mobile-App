angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }

    });

  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.locations', {
        url: '/locations',
        views: {
          'menuContent': {
            templateUrl: 'templates/bank/locations.html',
            controller: 'MapController'
          }
        }
      })

      .state('app.contact', {
        url: '/contact',
        views: {
          'menuContent': {
            templateUrl: 'templates/bank/contact.html'
          }
        }
      })

      .state('app.inscription', {
        url: '/inscription',
        views: {
          'menuContent': {
            templateUrl: 'templates/inscription.html'
          }
        }
      })

      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html'
          }
        }
      })

      .state('accountSelection', {
        url: '/accountSelection',
        templateUrl: 'templates/bank/accountSelect.html',
        controller: 'accountsController'

      })


      .state('home', {
        url: '/home',
        abstract: true,
        templateUrl: 'templates/bank/bmenu.html',
        controller: 'bankCtrl'
      })


      .state('home.account', {
        url: '/account',
        views: {
          'menuContent': {

            templateUrl: 'templates/bank/accountTabs.html'
          }
        }

      })

      .state('home.account.personal', {
        url: '/personal',
        views: {
          'tab-personal': {
            templateUrl: 'templates/bank/tab-personal.html'

          }
        }
      })

      .state('home.account.business', {
        url: '/business',
        views: {
          'tab-business': {
            templateUrl: 'templates/bank/tab-business.html'
          }
        }
      })

      .state('home.transfers', {
        url: '/transfers',
        views: {
          'menuContent': {
            templateUrl: 'templates/bank/transfers.html'
          }
        }
      })
      .state('home.history', {
        url: '/history',
        views: {
          'menuContent': {
            templateUrl: 'templates/bank/history.html'
          }
        }
      })

      .state('home.locations', {
        url: '/locations',
        views: {
          'menuContent': {
            templateUrl: 'templates/bank/locations.html',
            controller: 'MapController'
          }
        }
      })

      .state('home.contact', {
        url: '/contact',
        views: {
          'menuContent': {
            templateUrl: 'templates/bank/contact.html'
          }
        }
      });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');

  });
