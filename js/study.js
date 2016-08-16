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
	$(".lang").click(
		function(){
			if(document.getElementById("answer").style.display=="none"){
   		document.getElementById("answer").style.display="block";
   	}else{
   		document.getElementById("answer").style.display="none";
   	}
   	}
	);
});