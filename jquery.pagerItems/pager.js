/**
 * Initialiation des pagers. 
 */
$(function(){
	
	var $pager1 = $('.wdg_paginated-1').pagerItems({
		nbItemsPerPage: 4,
		nbPagerSelector : 2
	});

	var stop1 = "stop";
	var $pager2 = $('.wdg_paginated-2').pagerItems();
	var stop2 = "stop";
	
	$pager1.reloadPager();

});