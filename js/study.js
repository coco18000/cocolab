//キャプションフェードイン
$(function () {
   	$(".lang").hover(
   		function () {
      	$(".explain", this).fadeIn("slow");
    	}, 
    	function () {
        $(".explain", this).fadeOut("slow");
    	}
    );
});

$(function (){
	$(".lang").hover(
		function(){
   		document.getElementById("answer").style.display="block";
   	}
	);
});