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
 *        let table = $('#example').DataTable();
 *
 *        // Add event listeners to the two range filtering inputs
 *        $('#min').keyup( function() { table.draw(); } );
 *        $('#max').keyup( function() { table.draw(); } );
 *    } );
 */


$.fn.dataTableExt.afnFiltering.push(
	function( oSettings, aData, iDataIndex ) {

		let from_date_element = document.getElementById('start_date_input_box');
		console.log('From range_dates.js, from_date_element =');
		console.log(from_date_element);
		var from_date;
		if (from_date_element) {
				from_date = from_date_element.value;
		    console.log('FROM date = ' + from_date);
		}

		let to_date_element = document.getElementById('end_date_input_box');
		console.log('From range_dates.js, to_date_element =');
		console.log(to_date_element);
		var to_date;
		if (to_date_element) {
				to_date = to_date_element.value;
		    console.log('TO date = ' + to_date);
		}

		var date_col = 5;

		from_date = from_date.substring(0,4) + from_date.substring(5,7)+ from_date.substring(8,10);
		console.log('start date = ' + from_date);
		to_date = to_date.substring(0,4) + to_date.substring(5,7)+ to_date.substring(8,10);
		console.log('end date = ' + to_date);

		console.log('date of donation = ' + aData[date_col]);
		console.log('date of donation [0-4] = ' + aData[date_col].substring(0,4));
		console.log('date of donation [5-7] = ' + aData[date_col].substring(5,7));
		console.log('date of donation [8-10] = ' + aData[date_col].substring(8,10));
		var donation_date = aData[date_col].substring(0,4) + aData[date_col].substring(5,7) + aData[date_col].substring(8,10);
		console.log('date of donation (after substring functions) = ' + donation_date);

		if ( (from_date === "" && to_date === "") ||
				 (from_date <= donation_date && to_date === "") ||
				 (to_date >= donation_date && from_date === "") ||
				 (from_date <= donation_date && to_date >= donation_date) ) {
				return true;
		}
		return false;
	}
);
