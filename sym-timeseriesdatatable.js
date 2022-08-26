(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = { 
		typeName: "timeseriesdatatable",
		displayName: 'Time Series Data Table',
		iconUrl: 'Scripts/app/editor/symbols/ext/icons/timeseriesdatatable.png',
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		getDefaultConfig: function(){ 
			return { 
				DataShape: 'Timeseries',
				Height: 150,
				Width: 150, 
				HeaderColor: "blue",
				
			} 
		},
		configOptions: function(){
			return[
				{
					title: "Format Symbol",
					mode: "format"
					
				}
			];
		}
	}
	
	symbolVis.prototype.init = function(scope, elem) { 
		this.onDataUpdate = dataUpdate;
		
		scope.Headers = [];
		scope.Headers.push('Timestamp');
		
		function dataUpdate(data){
			if(!data) return;
			
			scope.ColumnsRaw = data.Data;
			scope.Timestamp = [];
			scope.Columns = [];
			
			scope.Table = [];
									
			for(var i=0; i< scope.ColumnsRaw.length; i++){
				for(var j=0; j< scope.ColumnsRaw[i].Values.length; j++){
					scope.Timestamp = scope.Timestamp.concat(scope.ColumnsRaw[i].Values[j].Time);
				}
			}
			// use for loop to remove duplicate items
			for (var i = 0; i < scope.Timestamp.length; i++) {
				for (var j = i + 1; j < scope.Timestamp.length; j++) {
					if (scope.Timestamp[i] === scope.Timestamp[j])
						scope.Timestamp.splice(j--, 1);
				}
			}
			
			for(var i=0; i< scope.ColumnsRaw.length; i++){
				if(scope.ColumnsRaw.length > scope.Headers.length-1){
					if(scope.Headers[i+1] == undefined){						
						scope.Headers.push(scope.ColumnsRaw[i].Label);
					}
					else if(scope.ColumnsRaw[i].Label != scope.Headers[i+1]){
						scope.Headers.push(scope.ColumnsRaw[i].Label);
					}
				}
				scope.Columns.push({'TagName':scope.ColumnsRaw[i].Label, 'Values': []});
				var lapseOnTimestamp = 0;
				for(var j=0; j< scope.Timestamp.length; j++){
					if(scope.ColumnsRaw[i].Values[j-lapseOnTimestamp] != undefined && scope.Timestamp[j] == scope.ColumnsRaw[i].Values[j-lapseOnTimestamp].Time){
						scope.Columns[i].Values.push(scope.ColumnsRaw[i].Values[j-lapseOnTimestamp].Value);
					}
					else{
						scope.Columns[i].Values.push('');
						lapseOnTimestamp = lapseOnTimestamp + 1;
					}
				}
			}
			
			for(var i=0; i< scope.Timestamp.length; i++){
				scope.Table[i] = [];
				scope.Table[i].push(scope.Timestamp[i]);
				for(var j=0; j< scope.Columns.length; j++){
					scope.Table[i].push(scope.Columns[j].Values[i]);
				}				
			}
			
			scope.Table.reverse();
			
		}
		
	};
	
	PV.symbolCatalog.register(definition); 

})(window.PIVisualization); 
