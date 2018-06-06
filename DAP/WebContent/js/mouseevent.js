$(function(){
	$(".RowSelect").live('mouseover', function() {
		$(this).css({"background": "#DEEEFC", "cursor": "pointer"});
		
	});
	$(".RowSelect").live('mouseout', function() {
		$(this).css({"background": "", "cursor": "auto"});
	});
});

$(function(){
	$(".RowSel").live('mouseover', function() {
		$(this).css({"background": "#DEEEFC", "cursor": "auto"});
		
	});
	$(".RowSel").live('mouseout', function() {
		$(this).css({"background": "", "cursor": "auto"});
	});
});

