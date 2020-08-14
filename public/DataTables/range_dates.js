/*
 *  Donor Application
 *
 *  Living Library date range filter
 *
 *  Filter a column on a specific date range. Note that you will likely need
 *  to change the id's on the inputs and the column number where the date field
 *  exists.
 *
 *  @name Date range filter
 *  @summary  			Filter the table based on two dates in different columns
 *  @author   			_guillimon_
 *  @update					Filter the table based on a single date column
 *  @update_author	Scott Salvaggio
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
 *        // Add event listeners to the two date range filtering inputs
 *        $('#from_date').keyup( function() { table.draw(); } );
 *        $('#to_date').keyup( function() { table.draw(); } );
 *    } );
 */
$.fn.dataTableExt.afnFiltering.push(
		function( oSettings, aData, iDataIndex ) {

				let from_date_element = document.getElementById('start_date_input_box');
				var from_date;
				if (from_date_element) {
						from_date = from_date_element.value;
				}

				let to_date_element = document.getElementById('end_date_input_box');
				var to_date;
				if (to_date_element) {
						to_date = to_date_element.value;
				}

				var date_col = 5;

				from_date = from_date.substring(0,4) + from_date.substring(5,7) +
										from_date.substring(8,10);
				to_date = to_date.substring(0,4) + to_date.substring(5,7) +
									to_date.substring(8,10);

				var donation_date = aData[date_col].substring(0,4) +
														aData[date_col].substring(5,7) +
														aData[date_col].substring(8,10);

				if ( (from_date === "" && to_date === "") ||
						 (from_date <= donation_date && to_date === "") ||
						 (to_date >= donation_date && from_date === "") ||
						 (from_date <= donation_date && to_date >= donation_date) ) {
						return true;
				}
				return false;
		}
);
