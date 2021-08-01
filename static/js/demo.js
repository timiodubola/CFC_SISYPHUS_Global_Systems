    require(["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Legend", "esri/widgets/Zoom", "esri/widgets/Search", "esri/widgets/Expand", "esri/Color", "esri/renderers/UniqueValueRenderer", "esri/widgets/Swipe"], function(esriConfig,Map, MapView, FeatureLayer, Legend, Zoom, Search, Expand, Color, UniqueValueRenderer, Swipe) {
      esriConfig.apiKey = MY_API_KEY;  
      var map = new Map({
          basemap: "gray-vector"
        });

    var view = new MapView({
        map: map,
        center: [-90.02, 29.97],
        zoom: 12, 
        container: "viewDiv",
        constraints: {
          snapToZoom: false
        }
      });
	
	
	// Adding a Zoom Widget
	// let zoom = new Zoom({view: view});
	
    // Adding a Search Widget
	const search = new Search({  //Add Search widget
      view: view
    });
	
	searchWidgetExpand = new Expand({
        expandIconClass: "esri-icon-search",
        expandTooltip: search.label,
        view: view,
        content: search,
        group: "top-left"
      });

    view.ui.add(searchWidgetExpand, "top-left"); //Add to the map

        /********************
         * Add feature layers
         ********************/
      

 
      // New Orleans Green Infrastructure layer
      var popupGreenInfrastructure ={
          "title":"Green Infrastructure",
          "content": "<b>CATEGORY:</b> {Category}<br><b>DESCRIPTION:</b>{Descriptio}<br><b>ADDRESS:</b> {Match_addr}<br><b>NEIGHBORHOOD:</b> {Neighborho}<br><b>PROJECT TYPE:</b> {Project_Ty}"
      } 
      
      var GreenInfrastructure = new FeatureLayer({
      url: "https://services3.arcgis.com/QVXXCmytNbrvUMAq/arcgis/rest/services/greeninfrastructure/FeatureServer/0",
      outFields: ["Category","Descriptio","Match_addr","Neighborho","Project_Ty"],
      popupTemplate: popupGreenInfrastructure,
    
        });
      
      //Change Green Infrastructures title
      GreenInfrastructure.title = "Green Infrastructure";

        
      // New Orleans Grey Infrastructure layer
      var popupGreyInfrastructure ={
          "title":"Gray Infrastructure",
          "content": "<b>Category</b> {SSSTAT}<br><b>TYPE:</b>{SSTYPE}"
      }  
            
   
     
      var GreyInfrastructure = new FeatureLayer({
          url: "https://services3.arcgis.com/QVXXCmytNbrvUMAq/arcgis/rest/services/nola_gray_infrastructure/FeatureServer/0",
          outFields: ["SSSTAT","SSTYPE"],
          popupTemplate: popupGreyInfrastructure,
        });

     //Change Grey title
     GreyInfrastructure.title = "Gray Infrastructure";
      


      // New Orleans Flood Insurance Rate Map
      
      var popupFIRM ={
          "title":"Flood Insurance Rate Map - Zone",
          "content": "<b>ZONE:</b> {FLD_ZONE}"
      }  
            
      
      var FIRM = new FeatureLayer({
          url: "https://services3.arcgis.com/QVXXCmytNbrvUMAq/arcgis/rest/services/firm/FeatureServer/0",
          outFields: ["FLD_ZONE"],
          popupTemplate: popupFIRM,
        });

      //Changing FIRM Title

      FIRM.title = "FIRM";
        
        // Adding all the  maps 
        
        
        map.add(GreenInfrastructure, 2);
        map.add(GreyInfrastructure, 1);
        map.add(FIRM, 0);
        
        var legend = new Legend({
          view: view
        });	

       view.ui.add(legend, "top-right");
    
      //Title labels for the two maps to be used for comparison
      var map1 = "Flood Hazard";
      var title1 = document.getElementById("layerTitle1");
      title1.innerHTML = map1;

      var map2 = "Flood Mitigation";
      var title2 = document.getElementById("layerTitle2");
      title2.innerHTML = map2;

    //Add title labels
    view.ui.add(title1, "bottom-left");
    view.ui.add(title2, "bottom-right");
	

		// create a Swipe widget
        const swipe = new Swipe({
          leadingLayers: [FIRM],
          trailingLayers: [GreyInfrastructure, GreenInfrastructure],
          position: 30, // set position of widget to 70%
          view: view
        });
        swipe.watch("position", function() {
          title1.style.opacity = swipe.position / 100;
          title2.style.opacity = (100 - swipe.position) / 100;
        });
        // add the widget to the view
        view.ui.add(swipe);
	  
      });

      
      