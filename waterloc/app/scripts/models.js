'use strict';

/* exported ModelModule */
/* The above comment disables the JSHint warning of ModelModule being defined but not used. */

var ModelModule = (function() {
    var AbstractModel = function() {
        this.listeners = [];
    };


    _.extend(AbstractModel.prototype, {
        addListener: function(listener) {
            this.listeners.push(listener);
        },

        removeListener: function(listener) {
            var index = this.listeners.indexOf(listener);
            if (index !== -1) {
                    this.listeners.splice(index, 1);
            }
        },

        notify: function(bModel) {
            _.each(this.listeners, function(listener) {
               listener.update(bModel);
            });
        },

        update: function() {
            this.notify(this);
        }
    });



    var BuildingModel = function(name, id, code) {
        AbstractModel.apply(this, arguments);
        this.name = name;
        this.id = id;
        this.code = code;
        this.showOnMap = false;
    };

    _.extend(BuildingModel.prototype, AbstractModel.prototype, {
        setShowOnMap: function(val){
            this.showOnMap = val;
            this.notify();
        }
    });




    var BuildingListModel = function() {
        AbstractModel.apply(this, arguments);
        this.buildinglist = [];
    };

    _.extend(BuildingListModel.prototype, AbstractModel.prototype, {
        addBuilding: function(building){
            this.buildinglist.push(building);
            building.addListener(this);
        },

        update: function(checkbox){
            for(var i = 0; i < this.buildinglist.length; i++){
                var b = this.buildinglist[i];
                if (b.code === checkbox.value){
                    b.showOnMap = checkbox.checked;
                    this.notify(b);
                }
            }
        }
    });

    return {
        BuildingModel: BuildingModel,
        BuildingListModel: BuildingListModel
    };
})();
