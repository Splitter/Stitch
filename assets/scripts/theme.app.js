

(function($){    

	$(document).ready(function() {

		//Cufon Replacement
		Cufon.replace('h1:not(.no_cufon),h2:not(.no_cufon),h3:not(.no_cufon),h4:not(.no_cufon),h5:not(.no_cufon),h6:not(.no_cufon):not(.pullright):not(.pullleft)',{hover:true}); 
		
		//Sliding Dropdown Menu
		$("#header > ul").svDropdownMenu();

		// <=480 menu display button functionality		
		$.svClickMenuToggle = true;
		var menu = $("#header>ul");
		if($(window).width()<=480){
			menu.css({visibility: "hidden", display:"none"});
		}
		$.svResponder(function(){
			if($(window).width()<=480){
				menu.css({visibility: "hidden", display:"none"});
			}
			else{
				menu.css({visibility: "visible", display:"block"});
			}
		},30);
		$("#navbutton").click(function() {
			if($(window).width()<=480){
				if($.svClickMenuToggle){
					$.svClickMenuToggle = false;
					menu.slideDown(400, function(){ menu.css({visibility: "visible"})});                      
				}
				else{
					$.svClickMenuToggle = true;
					menu.css({visibility: "hidden"}).slideUp(400);			
				}
			}
		});	

		//'More' Links rollover effect
		$('div.more a, div.moreleft a').svHoverBGRoll( 300 , '-25px' );

		// Socail Links Rollover effect
		$('#copyright ul li a').svHoverBGRoll( 300 , '-44px' );


		//Form element Replacements
		$('select.dropdown').svSelectReplace();
		$('input.checkbox').svCheckboxReplace();
		$('input.radio').svRadioReplace();


		//Scroll To Top Button
		$('.scrollto').click(function(e){
								e.preventDefault();
								e.stopPropagation();
								$.scrollTo(0,300);
							});

		//FrontPage Slideshow
		$('.slider_caption2, .slider_caption, .slider_caption3').each(function(i){
			if((i+"")!="0"){
				var w = $(this).outerWidth();
				$(this).css({marginLeft:"-"+(w*2),opacity:0});
			}
		});
		var options = {
					delay: 5000,
					type:['blockrandomin','rowslideright','rowgrowin','blockfadein','blockflyout','rowheightin','rowslideleft','columnflyout','columnflyin'],
					controls:'.center_cont ul',
					next:'.sliderc_right',
					prev:'.sliderc_left',
					onend: function(c,n){},
					onstart: function(c,n){}
				};
		$('.slider_center ul').svUltimateSlider(options);


		//Refresh scripts on browser resize
		$.svResponder(function(){
			Cufon.replace('h1:not(.no_cufon),h2:not(.no_cufon),h3:not(.no_cufon),h4:not(.no_cufon),h5:not(.no_cufon),h6:not(.no_cufon):not(.pullright):not(.pullleft)',{hover:true}); 
		
		},20);



		var opts = {
			list : $("ul.portfolio_list"),
			callback : function(){
					Cufon.replace('ul.portfolio_list h4',{hover:true}); 
					var optss={
							changes:{'padding-right':'45px'},
							speed:200
						};
					$('ul.portfolio_list div.more a').svAnimateHover(optss);
					$(".prettyphoto").svPrettyHover('slow');
			}
		}

		$("div.filters a").svQuickFilter(opts);
		$(".zoom").svPrettyHover('slow');

        $(".prettyPhoto").prettyPhoto({
            theme: 'dark_rounded', /* light_rounded / dark_rounded / light_square / dark_square / facebook */
            social_tools:""
        });

	});
})(jQuery);

