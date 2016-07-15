$(function(){
	$(".panel:not(:first)").hide();
	$("#tabs a").click(function(){
		$(".panel").hide();
		$(".panel").filter(this.hash).show();
		$("#tabs a").removeClass("selected");
		$(this).addClass("selected");
		return false;
	}).filter(":first").click();
});