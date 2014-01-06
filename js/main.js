$(document).ready(function(){
	headerToggleInit();
	function headerToggleInit(){
		var open = false;
		$('#filter-btn').click(function(){
			open = headerToggle(open);
		});
		$("#filter-options a").css( "width", 0 );
	}
	function headerToggle(state){
		if(state === true) {
			$("#filter-indicator").animate({width: 80}, 250);
			$("#filter-options a").animate({width: 0}, 500);
			return false;
		} else {
			$("#filter-indicator").animate({width: 0}, 250);
			$("#filter-options a").animate({width: 80}, 500);
			return true;
		}
	}
});

$(window).load(function(){
	var $container = $('#masonry');
	// initialize
	$container.masonry({
	  itemSelector: '.item',
	  transitionDuration: 0
	});
});


