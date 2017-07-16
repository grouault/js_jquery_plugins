/**
* JQuery - Blink - Plug-in
*/	
(function($)
{
  $.fn.blink = function(options)
  {
	var $elf = $(this);		
	with($elf){
	setInterval(function(){			  
		animate({
		  opacity : (css("opacity") < 1 ? 1 : 0.1)
		},100 );
	  }, 
	  options&&options.delay||500);
	}
   }
}(jQuery))
