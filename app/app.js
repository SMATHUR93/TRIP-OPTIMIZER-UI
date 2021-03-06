var app = angular.module('myApp', ['gm']);


app.directive('errorMessage', function() {
    return {
        restrict : "E",
        templateUrl : "app/errorMessage/errorMessage.html"
    };
});
app.directive('placesSearchCombo', function() {
    return {
        restrict : "E",
        templateUrl : "app/placesSearchCombo/placesSearchCombo.html"
    };
});
app.directive('sourceAndDestinationCombos', function() {
    return {
        restrict : "E",
        templateUrl : "app/sourceAndDestinationCombos/sourceAndDestinationCombos.html"
    };
});
app.directive('locationCardsCarousalsContainer', function() {
    return {
        restrict : "E",
        templateUrl : "app/locationCardsCarousalsContainer/locationCardsCarousalsContainer.html"
    };
});
app.directive('outputOptimizationMap', function() {
    return {
        restrict : "E",
        templateUrl : "app/outputOptimizationMap/outputOptimizationMap.html"
    };
});
app.directive('outputPathTiles', function() {
    return {
        restrict : "E",
        templateUrl : "app/outputPathTiles/outputPathTiles.html"
    };
});

app.service('Map', function($q) {
    
    this.init = function() {
        var options = {
            center: new google.maps.LatLng(40.7127837, -74.00594130000002),
            zoom: 13,
            disableDefaultUI: true    
        }
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
        this.places = new google.maps.places.PlacesService(this.map);
    }
    
    this.search = function(str) {
        var d = $q.defer();
        this.places.textSearch({query: str}, function(results, status) {
            if (status == 'OK') {
                d.resolve(results[0]);
            }
            else d.reject(status);
        });
        return d.promise;
    }
    
    this.addMarker = function(res) {
        if(this.marker) this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            map: this.map,
            position: res.geometry.location,
            animation: google.maps.Animation.DROP
        });
        this.map.setCenter(res.geometry.location);
    }
    
});

app.controller('newPlaceCtrl', function($scope, Map) {
    
    $scope.place = {};
    
    $scope.search = function() {
        $scope.apiError = false;
        Map.search($scope.searchPlace)
        .then(
            function(res) { // success
                Map.addMarker(res);
                $scope.place.name = res.name;
                $scope.place.lat = res.geometry.location.lat();
                $scope.place.lng = res.geometry.location.lng();
            },
            function(status) { // error
                $scope.apiError = true;
                $scope.apiStatus = status;
            }
        );
    }
    
    $scope.send = function() {
        alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);    
    }

    // Map.init();
});  

function myMap() {
  var stavanger = new google.maps.LatLng(58.983991,5.734863);
  var amsterdam = new google.maps.LatLng(52.395715,4.888916);
  var london = new google.maps.LatLng(51.508742,-0.120850);

  var mapCanvas = document.getElementById("map");
  var mapOptions = {center: amsterdam, zoom: 4};
  var map = new google.maps.Map(mapCanvas,mapOptions);

  var flightPath = new google.maps.Polyline({
    path: [stavanger, amsterdam, london],
    strokeColor: "#0000FF",
    strokeOpacity: 0.8,
    strokeWeight: 2
  });
  flightPath.setMap(map);
}  