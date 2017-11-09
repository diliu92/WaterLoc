'use strict';

(function(Models, Views, Services) {
// (function() {
    var gmService = new Services.GoogleMapService();
    var uwService = new Services.UWaterlooService();
    var buildingListModel = new Models.BuildingListModel();
    var buildingListView;
    var mapView;

    $(document).ready(function() {
        mapView = new Views.MapView(buildingListModel,uwService, gmService);

        var initBuildingListModel = function(result){
            var buildings = result.data;
            for(var i = 0; i < buildings.length; i++){
                var name = buildings[i].building_name;
                var id = buildings[i].building_id;
                var code = buildings[i].building_code;
                var bModel = new Models.BuildingModel(name,id,code);
                buildingListModel.addBuilding(bModel);
            }
            buildingListView = new Views.BuildingListView(buildingListModel,uwService);
        };

        var handleError = function(e){
            console.log(e);
        };
        uwService.queryBuildings().then(initBuildingListModel, handleError);
    });
// })();
})(ModelModule, ViewModule, ServiceModule);
