$(function(){
	headerToggleInit();
	function headerToggleInit(){
		var open = false;
		$('#filter-btn').click(function(){
			open = headerToggle(open);
		});
		$("#filter-options a").css( "width", 0 );
	}
	function headerToggle(state){
		if(state === false) {
			$("#filter-indicator").animate({width: 80}, 250);
			$("#filter-options a").animate({width: 0}, 500);
			return true;
		} else {
			$("#filter-indicator").animate({width: 0}, 250);
			$("#filter-options a").animate({width: 80}, 500);
			return false;
		}
	}
});


var $container = $('#masonry');
// initialize
$container.masonry({
  itemSelector: '.item'
});

