/**
 * PageItems v1.0.
 */
;(function($){
		
	$.pagerItems = {};
	$.pagerItems.defaults = {
		domItem : "li",
		nbPagerSelector : 1,
		nbItemsPerPage: 3,		
		firstText: '<<',
		lastText: '>>',
		previousText: '<',
		nextText: '>',
	};	
	$.pagerItems.cssSel = {
		wrapper : 'pgr-wrapper',
		nbResult: 'pgr-result',
		list: 'pgr-list',
		pager: 'pgr-items',
		pagerNav : 'pgr-nav',
		numberPage: 'pgr-number-page',
		previous: 'pgr-previous',
		next: 'pgr-next',
		first: 'pgr-first',
		last: 'pgr-last'
	};
	
	$.fn.pagerItems = function( options ) {

		if (this.length == 0) return this;
		
		if (this.length > 1) {
			this.each(function(){
				$(this).pagerItems(options);
			});
			return this;
		}
				
		var el = this;
		var elPager = {};
		
		// plugin namespace.
		var pager = (function(){
			//
			// SETTINGS
			var _settings = $.extend({}, $.pagerItems.defaults, options);
			var _itemSelector = '>' + _settings.domItem; 
			var _items = el.find(_itemSelector);
			var _nbItems = _items.length;
			var _currentPage = 1;
			var _nbItemsPerPage = _settings.nbItemsPerPage;
			var _nbPages = Math.ceil(_nbItems/_nbItemsPerPage);
			// nombre de selector de page avant et après la page courante.
			var _nbPagerSelector = _settings.nbPagerSelector;
			// selector css.
			var _cssSel = $.extend({}, $.pagerItems.cssSel, options);
			// elts constitutifs du widget
			var _controls = {
				wrapper : '<div class="wdg_pgr_wrapper ' + _cssSel.wrapper + '"></div>',	
				pagerResult : '<div class="' + _cssSel.nbResult + '"><span>' + _nbItems + '</span> r&eacute;sultats</div>',
				pager: '<ul class="' + _cssSel.pager + '"></ul>',
				previousElts: '<li class="wdg_pgr_before wdg_pgr_first ' + _cssSel.pagerNav + '"><a class="' + _cssSel.first  + '">' + _settings.firstText + '</a></li><li class="wdg_pgr_before wdg_pgr_previous ' + _cssSel.pagerNav + '"><a class="' + _cssSel.previous + '">' + _settings.previousText + '</a></li><li class="wdg_pgr_before wdg_pgr_more_inf ' + _cssSel.pagerNav + '"><a class="' + _cssSel.numberPage + '">...</a></li>',
				nextElts: '<li class="wdg_pgr_after wdg_pgr_more_sup ' + _cssSel.pagerNav + '"><a class="' + _cssSel.numberPage + '">...</a></li><li class="wdg_pgr_after wdg_pgr_next ' + _cssSel.pagerNav + '"><a class="' + _cssSel.next + '">' + _settings.nextText + '</a></li><li class="wdg_pgr_after wdg_pgr_last ' + _cssSel.pagerNav + '"><a class="' + _cssSel.last + '">' + _settings.lastText + '</a></li>'			
			};	
		
			// events associés aux selector	 de la pagination.
			var selEvents = {
				".wdg_pgr_first" : {
					click : function(e) {
			    		_currentPage = 1;
			    		_repaginate();
					}
				},
				".wdg_pgr_previous" : {
					click : function(e) {
						_currentPage = elPager.data('currentPage') - 1;	
						_repaginate();
					}
				},
				".wdg_pgr_next" : {
					click : function(e) {
						_currentPage = elPager.data('currentPage') + 1;
						_repaginate();
					}
				},
				".wdg_pgr_last" : {
					click : function(e) {
			    		_currentPage = _nbPages;
						_repaginate();
					}					
				},
				".wdg_pgr_number" : {
					click : function(e){
						_currentPage = $(this).data("pageNb");
						_repaginate();
					}
				}
			};		
		    			
		    var _elementsSynchronize = function (){
		        el.find(_itemSelector)
		        	.hide()
		        	.slice((_currentPage-1) * _nbItemsPerPage, _currentPage * _nbItemsPerPage)
		        	.show()
		    };		    
		    
		    // permet de synchroniser les elements.
		    var _pagerSynchronize = function (){
		    	// on cache tous les elements de pagination
		    	elPager.find(">li").hide();
		   
		    	if (_currentPage > _nbPagerSelector+1){
		    		elPager.find(".wdg_pgr_before").show();
		    	}
		    	if (_currentPage < _nbPages-_nbPagerSelector) {
		    		elPager.find(".wdg_pgr_after").show();
		    	}
		    	
		    	// active page.
		    	elPager.find(".number-" + _currentPage)
		    		.show()
		    		.addClass('active')
		    		.siblings()
		    		.removeClass('active');
		    	
		    	// affichage previous page
		    	for (var i=1; i<=_nbPagerSelector ; i++) {
		    		if (_currentPage-i >= 1) {
		    			elPager.find(".number-" + (_currentPage-i)).show();
		    		}
		    	}
		    	// affichage next page
		    	for (var i=1; i<=_nbPagerSelector; i++) {
		    		if (_currentPage+i <= _nbPages) {
		    			elPager.find(".number-" + (_currentPage+i)).show();
		    		}
		    	}
		    	
		    	// affichage - plus INF.
		    	if (_currentPage-_nbPagerSelector > 1) {
		    		elPager.find(".wdg_pgr_more_inf").show()
		    	}
		    	
		    	// afficahge - plus SUP
		    	if (_currentPage+_nbPagerSelector < _nbPages) {
		    		elPager.find(".wdg_pgr_more_sup").show()
		    	}
		    };	
		    
			// construit le pager html.
		    var _setup = function () {
	    		elPager = $( _controls['pager'] )
	    			.insertBefore(el)
	    			.wrap( _controls['wrapper'] )
	    			.before( _controls['pagerResult'] )
	    			.append( _controls['previousElts'] );
	    		// insertion des pages
	    	    for (var _page = 1 ; _page <= _nbPages; _page++) {
	    	        // ajout des numeros de pages.
	    	        $('<li class="wdg_pgr_number number-' + _page 
	    	        		+ ' ' + _cssSel.pagerNav 
	    	        		+ ' ' + _cssSel.numberPage + '"></li>')
	    	        	.append('<a>' + _page + '</a>')
	    	        	.data("pageNb", _page)
	    	        	.appendTo( elPager );
	    	    } 
	    	    elPager.append( _controls['nextElts'] );	
		    };
		    
			var _bindEvents = function() {
		    	if (typeof(selEvents) != undefined) {
		    		$.each(selEvents , function(selector, events) {	    			
		    			$.each(events, function(eventName, handler){
		    				elPager.find(selector).bind(eventName, handler);
		    			});
		    		});
		    	}
		    };			    
		    
		    // lance la pagination.
		    var _repaginate = function(){
		    	elPager.data('currentPage', _currentPage);
		        _elementsSynchronize();
		        _pagerSynchronize();
		    };
		    
		    var _init = function(){
				_setup();
	    	    _bindEvents();
	    	    _repaginate();
		    };
		    
		    var _destroy = function(){
		    	elPager.closest(".wdg_pgr_wrapper").remove();
		    };
		    
			return {
				init : function(){
					_init();
				},
				reload : function(){
			    	_destroy();
			    	_init();
				},
				destroy : function(){
					_destroy();
				}
			}
			
		})(); 

		/**
		 * ===================================================================================
		 * = PUBLIC FUNCTIONS
		 * ===================================================================================
		 */		
		el.destroyPager = function(){
			pager.destroy();
		}
		
		el.reloadPager = function(settings){
			pager.reload();
		};
		
		// initialisation pager.
		pager.init();
		
		return this;
		
	}
	
})(jQuery);