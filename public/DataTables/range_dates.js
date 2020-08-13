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
		var iFini = document.getElementById('start_date_input_box').value;
    console.log('start_date_input_box.value = ' + iFini);
		var iFfin = document.getElementById('end_date_to_input_box').value;
    console.log('end_date_input_box.value = ' + iFfin);
		var iStartDateCol = 5;
		var iEndDateCol = 5;

		iFini=iFini.substring(6,10) + iFini.substring(3,5)+ iFini.substring(0,2);
		iFfin=iFfin.substring(6,10) + iFfin.substring(3,5)+ iFfin.substring(0,2);

		var datofini=aData[iStartDateCol].substring(6,10) + aData[iStartDateCol].substring(3,5)+ aData[iStartDateCol].substring(0,2);
		var datoffin=aData[iEndDateCol].substring(6,10) + aData[iEndDateCol].substring(3,5)+ aData[iEndDateCol].substring(0,2);

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
