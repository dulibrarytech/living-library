/*
 *  Donor Application
 *
 *  Living Library date range filter
 *
 *  Filter a column on a specific date range. Note that you will likely need
 *  to change the id's on the inputs and the columns in which the start and
 *  end date exist.
 *
 *  @name Date range filter
 *  @summary Filter the table based on two dates in different columns
 *  @author _guillimon_
 *
 *  Original code:
 *  https://datatables.net/plug-ins/filtering/row-based/range_dates
 *
 *  Adapted for Living Library donations table by:
 *  Scott Salvaggio, University of Denver, August 2020
 *
 *  @example
 *    $(document).ready(function() {
 *        var table = $('#example').DataTable();
 *
 *        // Add event listeners to the two range filtering inputs
 *        $('#min').keyup( function() { table.draw(); } );
 *        $('#max').keyup( function() { table.draw(); } );
 *    } );
 */


$.fn.dataTableExt.afnFiltering.push(
	function( oSettings, aData, iDataIndex ) {

		let start_date_input_element = document.getElementById('start_date_input_box');
		console.log('From range_dates.js, start_date_input_element =');
		console.log(start_date_input_element);
		var iFini;
		if (start_date_input_element) {
				iFini = document.getElementById('start_date_input_box').value;
		    console.log('start_date_input_box.value = ' + iFini);
		}
		let end_date_input_element = document.getElementById('end_date_input_box');
		console.log('From range_dates.js, end_date_input_element =');
		console.log(end_date_input_element);
		var iFfin;
		if (end_date_input_element) {
				iFfin = document.getElementById('end_date_input_box').value;
		    console.log('end_date_input_box.value = ' + iFfin);
		}
		var iStartDateCol = 5;
		var iEndDateCol = 5;

		iFini=iFini.substring(0,4) + iFini.substring(5,7)+ iFini.substring(8,10);
		console.log('start date = ' + iFini);
		iFfin=iFfin.substring(0,4) + iFfin.substring(5,7)+ iFfin.substring(8,10);
		console.log('end date = ' + iFfin);

		console.log('date of donation (start) = ' + aData[iStartDateCol]);
		console.log('date of donation (start) [0-4] = ' + aData[iStartDateCol].substring(0,4));
		console.log('date of donation (start) [5-7] = ' + aData[iStartDateCol].substring(5,7));
		console.log('date of donation (start) [8-10] = ' + aData[iStartDateCol].substring(8,10));
		var datofini=aData[iStartDateCol].substring(0,4) + aData[iStartDateCol].substring(5,7)+ aData[iStartDateCol].substring(8,10);
		console.log('date of donation (start) = ' + datofini);
		var datoffin=aData[iEndDateCol].substring(0,4) + aData[iEndDateCol].substring(5,7)+ aData[iEndDateCol].substring(8,10);
		console.log('date of donation (end) = ' + datoffin);

		if ( iFini === "" && iFfin === "" )
		{
			return true;
		}
		else if ( iFini <= datofini && iFfin === "")
		{
			return true;
		}
		else if ( iFfin >= datoffin && iFini === "")
		{
			return true;
		}
		else if (iFini <= datofini && iFfin >= datoffin)
		{
			return true;
		}
		return false;
	}
);
