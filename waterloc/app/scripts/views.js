'use strict';

/* exported ViewModule */
/* The above comment disables the JSHint warning of ViewModule being defined but not used. */

var ViewModule = (function() {

    var AbstractView = function(model) {
        this.model = model;
        this.model.addListener(this);
    };

    _.extend(AbstractView.prototype, {
        init: function() {

        },

        update: function(bModel) {
            return bModel;
        },
    });

    var BuildingListView = function(model, UWaterlooService) {
        AbstractView.apply(this, arguments);
        this.UWaterlooService = UWaterlooService;
        this.init();
    };

    _.extend(BuildingListView.prototype, AbstractView.prototype, {
        init: function(){
            var buildingListFrom = document.getElementById('building-list-form');
            var buildings = this.model.buildinglist;

            var that = this;
            var updateCheckbox = function(e){
                var cb = e.currentTarget.childNodes[0];
                if(cb.checked){
                    cb.checked = false;
                    if (e.currentTarget.className !== undefined && e.currentTarget.className.indexOf('selected') >= 0){
                        e.currentTarget.className = e.currentTarget.className.replace('selected','');
                    }
                    that.model.update(cb);
                }
                else{
                    cb.checked = true;
                    if (e.currentTarget.className !== undefined && e.currentTarget.className.indexOf('selected') < 0){
                        e.currentTarget.className += ' selected';
                    }
                    that.model.update(cb);
                }
            };

            var checkboxStateChanged = function(e){
                that.model.update(e.currentTarget);
                var parent = e.currentTarget.parentNode;
                if(e.currentTarget.checked){
                    if (parent.className !== undefined && parent.className.indexOf('selected') < 0){
                        parent.className += ' selected';
                    }
                }
                else{
                    if (parent.className !== undefined && parent.className.indexOf('selected') >= 0){
                        parent.className = parent.className.replace('selected','');
                    }
                }
            };

            for(var i = 0; i < buildings.length; i++){
                var b = buildings[i];
                var bElement = document.createElement('div');
                bElement.setAttribute('id',b.code);
                var checkbox = document.createElement('input');
                checkbox.setAttribute('type','checkbox');
                checkbox.setAttribute('value',b.code);
                var textNode = document.createElement('span');
                textNode.innerHTML = b.name + ' (' + b.code + ')';
                bElement.appendChild(checkbox);
                bElement.appendChild(textNode);
                buildingListFrom.appendChild(bElement);

                bElement.addEventListener('click', updateCheckbox);

                checkbox.addEventListener('click', function(e){e.stopPropagation();});
                checkbox.addEventListener('change', checkboxStateChanged);
            }


            var buildingSearchBox = document.getElementById('building-search');
            buildingSearchBox.addEventListener('keyup', function(e){
                var str = e.currentTarget.value;
                var regexp_str = '.*';
                for (var i = 0; i < str.length; i++) {
                    regexp_str = regexp_str + str[i] + '.*';
                }
                var regexp = new RegExp(regexp_str,'i');
                var elements = buildingListFrom.childNodes;
                for (var j = 0; j < elements.length; j++){
                    if (!regexp.test(elements[j].innerText)){
                        if (elements[j].className !== undefined && elements[j].className.indexOf('hidden') < 0){
                            elements[j].className += ' hidden';
                        }
                    }
                    else{
                        if (elements[j].className !== undefined && elements[j].className.indexOf('hidden') >= 0){
                            elements[j].className = elements[j].className.replace(' hidden','');
                        }
                    }
                }
            });
        }

    });

    var MapView = function(model, UWaterlooService, GoogleMapService) {
        AbstractView.apply(this, arguments);
        this.UWaterlooService = UWaterlooService;
        this.GoogleMapService = GoogleMapService;
        this.init();
    };

    _.extend(MapView.prototype, AbstractView.prototype, {
        init: function() {
            this.GoogleMapService.initialize();
        },

        update: function(bModel) {
            var that = this;
            if (bModel.showOnMap){
                var resolve = function(result){
                    that.GoogleMapService.addMarker(result.data.latitude,result.data.longitude,bModel.code);
                };

                var handleError = function(e){
                    console.log(e);
                };

                that.UWaterlooService.getBuilding(bModel.code).then(resolve,handleError);
            }
            else{
                that.GoogleMapService.removeMarker(bModel.code);
            }
        }
    });

    return {
        BuildingListView: BuildingListView,
        MapView: MapView
    };
})();
