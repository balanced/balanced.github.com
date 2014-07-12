$(document).ready(function(){
	headerToggleInit();

	$('#filter-options a').click(function(event){
		console.log($(event.target).text())
	});

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

	var mastPhotoResize = function() {
		var photoSelector = function() {
			$( window ).resize(function() {
				if ($(window).width() <= 600 && $('#mast-img .img-responsive, #feat-img .img-responsive').attr('src').match(/cover.jpg/) =="cover.jpg")
				{
					$('#mast-img .img-responsive, #feat-img .img-responsive').each(function() {
				    	var src = $(this).attr("src").replace("-cover.jpg", ".jpg");
						$(this).attr("src", src);
				    });
				}
				else if ($(window).width() >= 600 && $('#mast-img .img-responsive, #feat-img .img-responsive').attr('src').match(/cover.jpg/) != "cover.jpg")
				{
				 	$('#mast-img .img-responsive, #feat-img .img-responsive').each(function() {
						var src = $(this).attr("src").match(/[^\.]+/) + "-cover.jpg";
						$(this).attr("src", src);
					})
				}
			});
		}


	   if ($(window).width() <= 600)
		{
			$('#mast-img .img-responsive, #feat-img .img-responsive').each(function() {
				var src = $(this).attr("src").replace("-cover.jpg", ".jpg");
				$(this).attr("src", src);
			});
			photoSelector();
		}
		else
		{
			$( window ).resize(function() {
			photoSelector();
			});
		}
	};
	mastPhotoResize();
});

$(window).load(function(){
	var $container = $('#masonry');
	// initialize
	$container.masonry({
	  itemSelector: '.item',
	  transitionDuration: 0
	});
});


