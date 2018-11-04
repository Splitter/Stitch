/*
*
*	Copyright (c) SplitV a.k.a. M.Pippin
*	site: Split-Visionz.net.
*
*	All plugins and scripts in this file are dual licenced.
*	Dual licensed under the MIT and GPL version 2 licenses(same as jQuery).
*	http://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt
*	http://github.com/jquery/jquery/blob/master/GPL-LICENSE.txt
*
*
*/




/*
*   $.svPrettyHover
*   @ no params 
*   
*   ----------------------------------------------------
*   
*
*/
(function($){ 
    $.fn.svPrettyHover = function(speed) {   
        return this.each(function() { 
                $(this).find('img').hover(function(){
                    $(this).stop().fadeTo(speed, 0.5);
                },
                function(){
                    $(this).stop().fadeTo(speed, 1);
                });

        });
    };     
})(jQuery);






/*
*	$.svQuickFilter / $.svQuicksand
*	- $.svQuickFilter is a portfolio filter plugin that uses $.svQuicksand
*	- $.svQuicksand is a modified version of Quicksand 1.2.2
*	- modified to work with themes grid system
*	
*	Reorder and filter items with a nice shuffling animation.
*	
*	Copyright (c) 2010 Jacek Galanciak (razorjack.net) and agilope.com
*	Big thanks for Piotr Petrus (riddle.pl) for deep code review and wonderful docs & demos.
*	
*	Dual licensed under the MIT and GPL version 2 licenses.
*	
*	Project site: http://razorjack.net/quicksand
*	
*/

(function ($) {

	$.fn.svQuickFilter = function(opts) {
		var defaults = {
			list : null,
			callback : function(){}
		}
		opts = $.extend(defaults, opts); 
		$.svQuickFilterCache = $(opts.list).clone();
		var colms = 0;
		$.svQuickFilterCache.find('li').each(function(i){
			if( colms == 0 && $(this).hasClass('last')){
				if( i == 3 && i!=0 ){
					colms = 4;
				}
				else if( i == 2 && i!=0 ){
					colms = 3;
				}
				else if( i == 1 && i!=0 ){
					colms = 2;
				}
			}
		});
		return this.each(function() {

			$(this).click(function(e){
				$(this).parent().parent().find('a').each(function(){
					$(this).removeClass('current');
				});
				$(this).addClass('current');
				var id = $(this).attr('id');
				if(id == 'all'){
					$(opts.list).svQuicksand( $.svQuickFilterCache.find('li'), {
						duration: 500,
						cols:colms,
					    enhancement: function() {
					    	opts.callback.call();
					    }						
					});
					e.preventDefault();					
				}else{
					$(opts.list).svQuicksand( $.svQuickFilterCache.find('li.'+id), {
						duration: 500,
						cols:colms,
					    enhancement: function() {
					    	opts.callback.call();
					    }				
					});
					e.preventDefault();	
				}				
			});
		});
	};	

    $.fn.svQuicksand = function (collection, customOptions) {     
        var options = {
            duration: 750,
            easing: 'swing',
            attribute: 'data-id', // attribute to recognize same items within source and dest
            adjustHeight: 'auto', // 'dynamic' animates height during shuffling (slow), 'auto' adjusts it before or after the animation, false leaves height constant
            useScaling: true, // disable it if you're not using scaling effect or want to improve performance
            enhancement: function(c) {}, // Visual enhacement (eg. font replacement) function for cloned elements
            selector: '> *',
            dx: 0,
            dy: 0,
            cols: 3
        };
        $.extend(options, customOptions);
        
        if ($.browser.msie || (typeof($.fn.scale) == 'undefined')) {
            // Got IE and want scaling effect? Kiss my ass.
            options.useScaling = false;
        }
        
        var callbackFunction;
        if (typeof(arguments[1]) == 'function') {
            var callbackFunction = arguments[1];
        } else if (typeof(arguments[2] == 'function')) {
            var callbackFunction = arguments[2];
        }
    
        
        return this.each(function (i) {
            var val;
            var animationQueue = []; // used to store all the animation params before starting the animation; solves initial animation slowdowns
            var $collection = $(collection).clone(); // destination (target) collection
            var $sourceParent = $(this); // source, the visible container of source collection
            var sourceHeight = $(this).css('height'); // used to keep height and document flow during the animation
            
            var destHeight;
            var adjustHeightOnCallback = false;
            
            var offset = $($sourceParent).offset(); // offset of visible container, used in animation calculations
            var offsets = []; // coordinates of every source collection item            
            
            var $source = $(this).find(options.selector); // source collection items
            
            // Replace the collection and quit if IE6
            if ($.browser.msie && $.browser.version.substr(0,1)<7) {
                $sourceParent.html('').append($collection);
                return;
            }

            // Remove 'last' class from portfolio blocks
            // And add 'last' class to appropriate 'nth' portfolio block
            $collection.each(function(i){            	
                $(this).removeClass("last");
            	if((i+1)%options.cols == 0 && i!=0){
            		$(this).addClass("last");
            	}
            });

            // Gets called when any animation is finished
            var postCallbackPerformed = 0; // prevents the function from being called more than one time
            var postCallback = function () {
                
                if (!postCallbackPerformed) {
                    postCallbackPerformed = 1;
                    
                    // hack: 
                    // used to be: $sourceParent.html($dest.html()); // put target HTML into visible source container
                    // but new webkit builds cause flickering when replacing the collections
                    $toDelete = $sourceParent.find('> *');
                    $sourceParent.prepend($dest.find('> *'));
                    $toDelete.remove();
                         
                    if (adjustHeightOnCallback) {
                        $sourceParent.css('height', destHeight);
                    }
                    options.enhancement($sourceParent); // Perform custom visual enhancements on a newly replaced collection
                    if (typeof callbackFunction == 'function') {
                        callbackFunction.call(this);
                    }                    
                }
            };
            
            // Position: relative situations
            var $correctionParent = $sourceParent.offsetParent();
            var correctionOffset = $correctionParent.offset();
            if ($correctionParent.css('position') == 'relative') {
                if ($correctionParent.get(0).nodeName.toLowerCase() == 'body') {

                } else {
                    correctionOffset.top += (parseFloat($correctionParent.css('border-top-width')) || 0);
                    correctionOffset.left +=( parseFloat($correctionParent.css('border-left-width')) || 0);
                }
            } else {
                correctionOffset.top -= (parseFloat($correctionParent.css('border-top-width')) || 0);
                correctionOffset.left -= (parseFloat($correctionParent.css('border-left-width')) || 0);
                correctionOffset.top -= (parseFloat($correctionParent.css('margin-top')) || 0);
                correctionOffset.left -= (parseFloat($correctionParent.css('margin-left')) || 0);
            }
            
            // perform custom corrections from options (use when Quicksand fails to detect proper correction)
            if (isNaN(correctionOffset.left)) {
                correctionOffset.left = 0;
            }
            if (isNaN(correctionOffset.top)) {
                correctionOffset.top = 0;
            }
            
            correctionOffset.left -= options.dx;
            correctionOffset.top -= options.dy;

            // keeps nodes after source container, holding their position
            $sourceParent.css('height', $(this).height());
            
            // get positions of source collections

            $source.each(function (i) {
                offsets[i] = $(this).offset();
            });
            // stops previous animations on source container
            $(this).stop();
            var dx = 0; var dy = 0;
            $source.each(function (i) {
                $(this).stop(); // stop animation of collection items
                var rawObj = $(this).get(0);
                if (rawObj.style.position == 'absolute') {
                    dx = -options.dx;
                    dy = -options.dy;
                } else {
                    dx = options.dx;
                    dy = options.dy;                    
                }
                rawObj.style.position = 'absolute';
                rawObj.style.margin = '0';
                rawObj.style.top = (offsets[i].top - parseFloat(rawObj.style.marginTop) - correctionOffset.top + dy) + 'px';
                rawObj.style.left = (offsets[i].left - parseFloat(rawObj.style.marginLeft) - correctionOffset.left + dx) + 'px';
            });
                    
            // create temporary container with destination collection
            var $dest = $($sourceParent).clone();
            var rawDest = $dest.get(0);
            rawDest.innerHTML = '';
            rawDest.setAttribute('id', '');
            rawDest.style.height = 'auto';
            rawDest.style.width = $sourceParent.width() + 'px';
            $dest.append($collection);      
            // insert node into HTML
            // Note that the node is under visible source container in the exactly same position
            // The browser render all the items without showing them (opacity: 0.0)
            // No offset calculations are needed, the browser just extracts position from underlayered destination items
            // and sets animation to destination positions.
            $dest.insertBefore($sourceParent);
            $dest.css('opacity', 0.0);
            rawDest.style.zIndex = -1;
            
            rawDest.style.margin = '0';
            rawDest.style.position = 'absolute';
            rawDest.style.top = offset.top - correctionOffset.top + 'px';
            rawDest.style.left = offset.left - correctionOffset.left + 'px';
            
            
    
            

            if (options.adjustHeight === 'dynamic') {
                // If destination container has different height than source container
                // the height can be animated, adjusting it to destination height
                $sourceParent.animate({height: $dest.height()}, options.duration, options.easing);
            } else if (options.adjustHeight === 'auto') {
                destHeight = $dest.height();
                if (parseFloat(sourceHeight) < parseFloat(destHeight)) {
                    // Adjust the height now so that the items don't move out of the container
                    $sourceParent.css('height', destHeight);
                } else {
                    //  Adjust later, on callback
                    adjustHeightOnCallback = true;
                }
            }
            // Now it's time to do shuffling animation
            // First of all, we need to identify same elements within source and destination collections    
            $source.each(function (i) {
                var destElement = [];
                if (typeof(options.attribute) == 'function') {
                    
                    val = options.attribute($(this));
                    var c = 0;
                    $collection.each(function(i) {
                        if (options.attribute(this) == val) {
                            destElement = $(this);
                            
                            return false;
                        }
                        c++;
                    });
                } else {
                    destElement = $collection.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
                }

                if (destElement.length) {
                    // The item is both in source and destination collections
                    // It it's under different position, let's move it
                    if (!options.useScaling) {
                        animationQueue.push(
                                            {
                                                element: $(this), 
                                                animation: 
                                                    {top: destElement.offset().top - correctionOffset.top, 
                                                     left: destElement.offset().left - correctionOffset.left, 
                                                     opacity: 1.0
                                                    }
                                            });

                    } else {
                        animationQueue.push({
                                            element: $(this), 
                                            animation: {top: destElement.offset().top - correctionOffset.top, 
                                                        left: destElement.offset().left - correctionOffset.left, 
                                                        opacity: 1.0, 
                                                        scale: '1.0'
                                                       }
                                            });

                    }
                } else {
                    // The item from source collection is not present in destination collections
                    // Let's remove it
                    if (!options.useScaling) {
                        animationQueue.push({element: $(this), 
                                             animation: {opacity: '0.0'}});
                    } else {
                        animationQueue.push({element: $(this), animation: {opacity: '0.0', 
                                         scale: '0.0'}});
                    }
                }
            });
            
            $collection.each(function (i) {
                // Grab all items from target collection not present in visible source collection
                
                var sourceElement = [];
                var destElement = [];
                if (typeof(options.attribute) == 'function') {
                    val = options.attribute($(this));
                    $source.each(function() {
                        if (options.attribute(this) == val) {
                            sourceElement = $(this);
                            return false;
                        }
                    });                 

                    $collection.each(function() {
                        if (options.attribute(this) == val) {
                            destElement = $(this);
                            return false;
                        }
                    });
                } else {
                    sourceElement = $source.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
                    destElement = $collection.filter('[' + options.attribute + '=' + $(this).attr(options.attribute) + ']');
                }
                
                var animationOptions;
                if (sourceElement.length === 0) {

                    // No such element in source collection...
                    if (!options.useScaling) {
                        animationOptions = {
                            opacity: '1.0'
                        };
                    } else {
                        animationOptions = {
                            opacity: '1.0',
                            scale: '1.0'
                        };
                    }
                    // Let's create it
                    d = destElement.clone();
                    var rawDestElement = d.get(0);
                    rawDestElement.style.position = 'absolute';
                    rawDestElement.style.margin = '0';
                    rawDestElement.style.top = destElement.offset().top - correctionOffset.top + 'px';
                    rawDestElement.style.left = destElement.offset().left - correctionOffset.left + 'px';
                    d.css('opacity', 0.0); // IE
                    if (options.useScaling) {
                        d.css('transform', 'scale(0.0)');
                    }
                    d.appendTo($sourceParent);
                    
                    animationQueue.push({element: $(d), 
                                         animation: animationOptions});
                }
            });
            
            $dest.remove();
            options.enhancement($sourceParent); // Perform custom visual enhancements during the animation
            for (i = 0; i < animationQueue.length; i++) {
                animationQueue[i].element.animate(animationQueue[i].animation, options.duration, options.easing, postCallback);
            	
        	}
        });
    };
})(jQuery);





/*
*	$.svUltimateSlider
*	@ options object
*	
*	----------------------------------------------------
*	jQuery slideshow plugin. 
*
*/
(function($){	
	$.extend({
		svUltimateSlider:{
			transitions:{
				fade:{
					duration:800,
					delay:0,
					css:{opacity:0},
					columns:1,
					rows:1,
					order:'normal',
					easing:'linear',
					slide:'current'
				}
			}
		}
	});
	$.fn.svUltimateSlider = function(opts) {
		var defaults = {
				delay: 3000,
				type:'fade',
				onend:null,
				onstart:null
			};
		var settings = $.extend({}, defaults, opts);
		if(settings['transitions']){
			$.extend($.svUltimateSlider.transitions,settings.transitions);
		}
		this.each(function() {
			var $this=$(this);
			$this.attr('sv_cur',0);
			$this.attr('sv_ani',0);
			$this.attr('sv_timer',setTimeout(function(){
									startSwitch($this);
				}, settings.delay));
			$this.children('li').each(function(index){
				if(index==0){
					$(this).css({zIndex:2,position:'absolute'});
				}
				else{
					$(this).css({zIndex:0,position:'absolute'});
				}
			});	
			$(settings.prev).click(function(e){
				e.preventDefault();
				e.stopPropagation();
				if($this.attr('sv_ani')==0){
					var cur=$this.attr('sv_cur');
					var next=cur-1;
					if(next<0){
						next=$this.children('li').length-1;
					}	
					clearTimeout($this.attr('sv_timer'));
					startSwitch($this,next);
				}
			});
			$(settings.next).click(function(e){
				e.preventDefault();
				e.stopPropagation();
				if($this.attr('sv_ani')==0){
					clearTimeout($this.attr('sv_timer'));
					startSwitch($this);
				}
			});
			$('li',$(settings.controls)).each(function(index){
				$(this).click(function(){
					if($this.attr('sv_ani')==0){
						clearTimeout($this.attr('sv_timer'));
						startSwitch($this,index);
					}
				});				
			});
			$this.hover(
				function(){
					if($this.attr('sv_ani')==0){
						clearTimeout($this.attr('sv_timer'));
					}
				},
				function(){
					if($this.attr('sv_ani')==0){
						$this.attr('sv_timer',setTimeout(function(){
									startSwitch($this);
							}, settings.delay));
					}					
				});
		});		
		var startSwitch=function($this,index){

			var cur = $('.slider_center li .slider_caption, .slider_center li .slider_caption2, .slider_center li .slider_caption3');
			var w = cur.outerWidth();
			var t = $this;
			cur.animate({marginLeft:"-"+(w+20)+"px",opacity:0}, 300,function(){
				if($this.attr('sv_ani')==0 && $this.attr('sv_cur')!=index){
					$this.attr('sv_ani',1);
					clearTimeout($this.attr('sv_timer'));
					var cur =$this.attr('sv_cur');
					if(!isNaN(index)){
						var n = index;
					}	
					else if(cur<$this.children('li').length-1){
						var n= parseInt(cur)+1;
					}	
					else{
						var n= 0;
					}	
					doSwitch($this,n);
				}
			});
		}
		var getTransData = function($this){
			var type;
			if($.isArray(settings.type)){
				if(isNaN($this.attr('sv_type'))){$this.attr('sv_type',0)};	
				type = settings.type[parseInt($this.attr('sv_type'))];
				if(parseInt($this.attr('sv_type'))+1>=settings.type.length){
					$this.attr('sv_type',0);
				}
				else{
					$this.attr('sv_type',parseInt($this.attr('sv_type'))+1);
				}
			}
			else{
				type=settings.type
			}			
			if(!$.svUltimateSlider.transitions[type]){
				return $.svUltimateSlider.transitions.fade;
			}
			else{
				return $.extend({}, $.svUltimateSlider.transitions.fade, $.svUltimateSlider.transitions[type]);
			}
		}		
		var cloneSlide=function($this,trans,n){
			var divs = []
				cols=trans.columns,
				rows=trans.rows;	
			
			if(trans.slide=='next'){
				var slide = $($this.children('li')[n]);
			}
			else{
				var slide = $($this.children('li')[$this.attr('sv_cur')]);
			}
			var w=($this.width()/cols);
			var h=($this.height()/rows);
			var nLi=$('<li/>')
					.css({
						width:$this.width(),
						height:$this.height(),
						overflow:'hidden',
						position:'relative',
						top:0,
						display:'block',
						zIndex:3
					});		
			for(var j=0;j<rows;j++){//rows
				for(var i=0;i<cols;i++){//columns
					divs[((j*cols)+i)]=$('<div/>')
											.css({
												width:w+1,
												height:h+1,
												overflow:'hidden',
												position:'absolute',
												left:(w*i),
												top:(h*j)
											});
					if(trans.slide=='next'){
						var css={};
						css['width']=divs[((j*cols)+i)].css('width');
						css['height']=divs[((j*cols)+i)].css('height');
						css['opacity']=1;
						css['top']=divs[((j*cols)+i)].css('top');
						css['left']=divs[((j*cols)+i)].css('left');
					
						divs[((j*cols)+i)].data('sv_cssdata',css)									
									.animate(trans.css,0);
						divs[((j*cols)+i)].data('sv_divwidth',divs[((j*cols)+i)].css('width'));
						divs[((j*cols)+i)].css({width:0});
					
					}
					var div = $('<div/>')
								.html(slide.html())
								.css({
									marginTop:-(h*j),
									marginLeft:-(w*i),
									width:w,
									height:h
								});
					divs[((j*cols)+i)].append(div);	
					nLi.append(divs[((j*cols)+i)]);
				}
			}
			return [nLi,divs];
		}
		var doTransition=function($this,divs,nLi,n,trans){
			var j=0,
				count = divs.length;
				del = trans.delay;
				tt 	= trans.duration;
			if(trans.order=='reverse'){
				divs.reverse();
			}
			for(var i = 0; i<count; i++){
										if(trans.easing==undefined || !jQuery.easing[trans.easing]){trans.easing='swing'}
										if(j<count-1){
											if(trans.order=='random'){
												j++;
												var div = divs[Math.floor(Math.random()*divs.length)];
												divs = jQuery.grep(divs, function(value) {
															return value != div;
												});
												div.delay((del*i), "svUltimateSlider")
													.queue("svUltimateSlider", function(next) {
														
														if(trans.slide=='next'){
															var ncss=$(this).data('sv_cssdata');
														}
														else{var ncss=trans.css;}
														
														if(trans.slide=='next'){
															$(this).css({width:$(this).data('sv_divwidth')});
														}
														$(this).animate(ncss,tt,trans.easing);
														next();
													})
													.dequeue("svUltimateSlider");
											}
											else{											
												divs[j++].delay((del*i), "svUltimateSlider")
													.queue("svUltimateSlider", function(next) {
														if(trans.slide=='next'){
															var ncss=$(this).data('sv_cssdata');
														}
														else{var ncss=trans.css;}
														if(trans.slide=='next'){
															$(this).css({width:$(this).data('sv_divwidth')});
														}
														$(this).animate(ncss,tt,trans.easing);
														next();
													})
													.dequeue("svUltimateSlider");
											}
										}
										else{											
											var div = (trans.order=='random')?divs[0]:divs[j++];
											clearInterval($this.attr('sv_timer'));
											div.delay((del*i), "svUltimateSlider")
													.queue("svUltimateSlider", function(next) {
														if(trans.slide=='next'){
															var ncss=$(this).data('sv_cssdata');
														}
														else{var ncss=trans.css;}
														if(trans.slide=='next'){
															$(this).css({width:$(this).data('sv_divwidth')});
														}
														$(this).animate(ncss,tt,trans.easing,function(){
																		nLi.remove();
																		$($this.children('li')[n]).css({zIndex:2});
																		$($this.children('li')[$this.attr('sv_cur')]).css({zIndex:0});
																		if(settings.onend){settings.onend($this.attr('sv_cur'),n)}
																		var curs = $($('.slider_center ul li')[n]).find('.slider_caption2, .slider_caption, .slider_caption3');
																		curs.animate({marginLeft:"0px",opacity:1}, 100);

																		$this.attr('sv_cur',n);
																		$this.attr('sv_timer',setTimeout(function(){																			
																				startSwitch($this);
																			}, settings.delay));
																		$this.attr('sv_ani',0);	
																	});
														next();
													})
													.dequeue("svUltimateSlider");
										}
				}
		}
		var doSwitch=function($this,n){
			if(settings.onstart){settings.onstart($this.attr('sv_cur'),n);}				
			var trans=getTransData($this);
			var data = cloneSlide($this,trans,n);
			$this.append(data[0]);
			$('li',$(settings.controls)).removeClass('active');
			$($('li',$(settings.controls))[n]).addClass('active');
			if(trans.slide!='next'){
				$($this.children('li')[n]).css({zIndex:2});
				$($this.children('li')[$this.attr('sv_cur')]).css({zIndex:0});
			}
			doTransition($this,data[1],data[0],n,trans);
		}
		return this;
	}	
})(jQuery);


jQuery.extend(jQuery.svUltimateSlider.transitions,
{			
	blockfade:{
			duration:1000,
			delay:80,
			css:{opacity:0.0,left:'-=200'},
			columns:8,
			rows:3,
			order:'normal',
			easing:'swing'
	},
	blockfadein:{
			duration:1000,
			delay:80,
			css:{width:0,opacity:0.0,left:'-=200'},
			columns:8,
			rows:3,
			order:'normal',
			easing:'swing',
			slide:'next'
	},		
	blockshrink:{
			duration:1000,
			delay:80,
			css:{width:0,height:0,opacity:0.0},
			columns:8,
			rows:3,
			order:'normal',
			easing:'swing'
	},				
	blockgrow:{
			duration:1000,
			delay:80,
			css:{top:"-=30",left:"-=30",width:0,height:0,opacity:0.0},
			columns:8,
			rows:3,
			order:'normal',
			easing:'swing',
			slide:'next'
	},		
	blockdrop:{
			duration:900,
			delay:80,
			css:{top:'+=200',opacity:0.0},
			columns:8,
			rows:3,
			order:'reverse',
			easing:'easeInOutBack'
	},		
	blockdropin:{
			duration:1200,
			delay:100,
			css:{height:0,opacity:0.0},
			columns:8,
			rows:3,
			order:'reverse',
			easing:'easeInOutBack',
			slide:'next'
	},	
	blockflyout:{
			duration:500,
			delay:100,
			css:{top:"-=150",opacity:0},
			columns:8,
			rows:3,
			order:'normal',
			easing:'easeInOutBack'
	},		
	blockrandom:{
			duration:1000,
			delay:80,
			css:{width:0,height:0,opacity:0},
			columns:7,
			rows:3,
			order:'random',
			easing:'easeInSine'
	},	
	blockrandomin:{
			duration:1000,
			delay:80,
			css:{top:"-=30",left:"-=30",width:0,height:0,opacity:0},
			columns:7,
			rows:3,
			order:'random',
			easing:'easeInSine',
			slide:'next'
	},		
	rowfade:{
			duration:800,
			delay:100,
			css:{opacity:0},
			columns:1,
			rows:8,
			order:'normal',
			easing:'easeInSine'
	},			
	rowheightin:{
			duration:800,
			delay:100,
			css:{opacity:0,height:0},
			columns:1,
			rows:8,
			order:'normal',
			easing:'easeInSine',
			slide:'next'
	},				
	rowthin:{
			duration:800,
			delay:100,
			css:{height:0},
			columns:1,
			rows:8,
			order:'normal',
			easing:'easeInSine'
	},	
	rowgrowin:{
			duration:1600,
			delay:120,
			css:{width:0,height:0},
			columns:1,
			rows:6,
			order:'normal',
			easing:'easeInSine',
			slide:'next'
	},		
	rowslideleft:{
			duration:800,
			delay:100,
			css:{left:"-=500",opacity:0},
			columns:1,
			rows:6,
			order:'normal',
			easing:'easeInOutBack'
	},			
	rowslideright:{
			duration:800,
			delay:100,
			css:{left:"+=500",opacity:0},
			columns:1,
			rows:6,
			order:'normal',
			easing:'easeInOutBack'
	},		
	rowrandom:{
			duration:800,
			delay:100,
			css:{height:0,opacity:0,width:0},
			columns:1,
			rows:6,
			order:'random',
			easing:'easeInSine'
	},
	rowrandomin:{
			duration:1600,
			delay:120,
			css:{height:0,opacity:0,width:0},
			columns:1,
			rows:6,
			order:'random',
			easing:'easeInSine',
			slide:'next'
	},				
	columnfade:{
			duration:800,
			delay:80,
			css:{opacity:0},
			columns:12,
			rows:1,
			order:'normal',
			easing:'easeInSine'
	},			
	columnthin:{
			duration:800,
			delay:100,
			css:{width:0},
			columns:12,
			rows:1,
			order:'normal',
			easing:'easeInSine'
	},				
	columndropin:{
			duration:800,
			delay:100,
			css:{top:"-=300",opacity:0},
			columns:12,
			rows:1,
			order:'normal',
			easing:'easeInSine',
			slide:'next'
	},		
	columndrop:{
			duration:800,
			delay:100,
			css:{top:"+=300",opacity:0},
			columns:12,
			rows:1,
			order:'normal',
			easing:'easeInSine'
	},					
	columnflyin:{
			duration:800,
			delay:100,
			css:{top:"+=300",opacity:0},
			columns:12,
			rows:1,
			order:'normal',
			easing:'easeInOutBack',
			slide:'next'
	},			
	columnflyout:{
			duration:800,
			delay:100,
			css:{top:"-=300",opacity:0},
			columns:12,
			rows:1,
			order:'normal',
			easing:'easeInSine'
	},		
	columnrandom:{
			duration:800,
			delay:100,
			css:{opacity:0,width:0,height:0},
			columns:12,
			rows:1,
			order:'random',
			easing:'easeInSine'
	},		
	columnrandomin:{
			duration:800,
			delay:100,
			css:{opacity:0,width:0,height:0},
			columns:12,
			rows:1,
			order:'random',
			easing:'easeInSine',
			slide:'next'
	},
	top:{
			duration:1200,
			delay:0,
			css:{top:"-=300",opacity:0},
			columns:1,
			rows:1,
			order:'normal',
			easing:'easeInOutBack'
	},
	bottom:{
			duration:1200,
			delay:0,
			css:{top:"+=300",opacity:0},
			columns:1,
			rows:1,
			order:'normal',
			easing:'easeInOutBack'
	},
	left:{
			duration:1200,
			delay:0,
			css:{left:"-=500",opacity:0},
			columns:1,
			rows:1,
			order:'normal',
			easing:'easeInOutBack'
	},
	right:{
			duration:1200,
			delay:0,
			css:{left:"+=500",opacity:0},
			columns:1,
			rows:1,
			order:'normal',
			easing:'easeInOutBack'
	}
});


/*
*	$.svSelectReplace
*	@ no params 
*	
*	----------------------------------------------------
*	Replace select elements with a link & list that can be styled via CSS
*
*/
(function($){ 
    $.fn.extend({         
        svSelectReplace: function() {        
            return this.each(function() {
            		
				var wrap = $('<div class="select_wrap"/>');
				var link = $('<a class="select" href="#">'+$(this).val()+'</a>');
	            $(this).wrap('<div class="clearfix"/>')
				$('option',$(this)).each(function(){
	                if($(this).val()==link.text()){
	                    link.text($(this).text());
	                }
	            })
				var list = $('<ul/>');				
				link.appendTo(wrap).attr("tabindex",-1);
				list.appendTo(wrap);
				$(this).parent().append(wrap);
				$(this).addClass('elementHide');
				if($(this).is(':disabled')){
					link.addClass('disabled');
				}


			    $(this).focus(function(){
			    	$(this).parent().find('a.select').trigger('click');
			    });
    
				$('option',$(this)).each(function(){
					var opt = $('<li/>');
					var nl = $('<a href ="#" data-value="'+$(this).val()+'">'+$(this).text()+'</a>');
					opt.append(nl);
					if($(this).attr('selected')){
						nl.addClass('active');
					}
					nl.click(function(e){
							list.stop(true, false);
							e.preventDefault();
							e.stopPropagation();
							list.find('a').each(function(){
								$(this).removeClass('active');
							});
							$(this).addClass('active');
							link.text($(this).text());
							list.parent().parent().find('select.dropdown').val($(this).attr('data-value'));
		                   	list.hide();
						
					});
					opt.appendTo(list);
				});
				list.hide();
				link.click(function(e){
						e.preventDefault();
					if(!link.hasClass('disabled')){
						$(this).focus();
						list.slideToggle(300);
					}
				});
				link.focusout(function(){
					list.delay(300).slideUp(300);
					return true;
				});		
            });
        }

    });    
     
})(jQuery);





/*
*	$.svCheckboxReplace
*	@ no params 
*	
*	----------------------------------------------------
*	Replace checkbox elements with a div that can be styled via CSS
*
*/
(function($){ 
    $.fn.extend({         
        svCheckboxReplace: function() {        
            return this.each(function() {            	
				var wrap = $('<div class="checkbox"/>');
				$this = $(this);
				wrap.insertBefore($this);
				if($this.is(':checked')){
					wrap.addClass('checked');
				}
				if($this.is(':disabled')){
					wrap.addClass('disabled');
				}
				$this.addClass('elementHide');
			    $this.focus(function(){
			                $(this).parent().children('div.checkbox').trigger('click');
			    });
    
				wrap.click(function(e){
					e.preventDefault();
					if(!$(this).hasClass('disabled')){
						if($(this).hasClass('checked')){
							$(this).removeClass('checked');
							$(this).parent().children('input[type=checkbox]').removeAttr("checked");
						}
						else{
							$(this).addClass('checked');
							$(this).parent().children('input[type=checkbox]').attr("checked","checked");
						}
					}
				});


			});
        }

    });  
     
})(jQuery);






/*
*	$.svRadioReplace
*	@ no params 
*	
*	----------------------------------------------------
*	Replace radio elements with a div that can be styled via CSS
*
*/
(function($){ 
    $.fn.extend({         
        svRadioReplace: function() {        
            return this.each(function() {            	
				var wrap = $('<div class="radio"/>');
				$this = $(this);
				wrap.insertBefore($this);
				if($this.is(':checked')){
					wrap.addClass('checked');
				}
				if($this.is(':disabled')){
					wrap.addClass('disabled');
				}
				$this.addClass('elementHide');

			    $this.focus(function(){
			                $(this).parent().children('div.radio').trigger('click');
			    });

				wrap.click(function(e){
					e.preventDefault();
					if(!$(this).hasClass('disabled')){
						$("input.radio").removeAttr('checked');
						$("input.radio").each(function(){
							$(this).parent().children('div.radio').removeClass('checked');
						});
						$(this).addClass('checked');
						$(this).parent().children('input[type=radio]').attr("checked","checked");
					}
					
				});


			});
        }

    });  
     
})(jQuery);

/*
*	$.svResponder
*	@params 
*		- callback function
*		- interval for timer
*	----------------------------------------------------
*	Utility function designed for responsive layout
*	fires callback function when user stops resizing window
*
*/
(function($){
	$.svResponder = function(func, interval){
		var last =  null;
		var timer = null;
		$(window).resize(function(){
			if(timer === null){
				timer = setTimeout(check, interval);
			}
		});
		var check = function(){
			if( last != null && last == parseInt( $(document).width() ) ){
				last = null;
				clearTimeout(timer);
				timer = null;
				func.call();
			}
			else{
				timer = setTimeout(check, interval);
				last = parseInt($(document).width());
			}
		};
	}
} )(jQuery);


/*
*   $.svHoverBGRoll
*   @params 
*       - speed of animation
*       - new background X position
*   ----------------------------------------------------
*
*   depends on jQuery BackgroundPosition Animation plugin
*   vertically animates background position of element on hover 
*
*/
  
(function($){
    $.fn.extend({         
        svHoverBGRoll: function(speed,newX) {  
            return this.each(function() {
                var oldY = $(this).css('backgroundPosition');
                if(oldY){
                    oldY = oldY.split(" ");
                    var oldX = oldY[1];
                    oldY = oldY[0];
                }
                else{
                    var oldX = $(this).css('backgroundPositionY');
                    oldY = $(this).css('backgroundPositionX');
                }
                    //$(this).addClass('no_background');
                $(this).hover(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).stop().css({backgroundPosition : oldY + " " + oldX}).animate({
                                    backgroundPosition : oldY + " " + newX
                                    },
                                    speed);
                },function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).stop().animate({
                                    backgroundPosition : oldY + " " + oldX
                                    },
                                    speed);
                });                        
            });
        }
    });         
})(jQuery);


/*
*	$.svDropdownMenu
*	@params 
*		- width(in pixels) to disable dropdown
*	----------------------------------------------------
*
*	Dropdown menu plugin that allows you to disable the dropdown on small resolutions(small mobile handsets)
*
*/
  
(function($){
    $.fn.extend({         
        svDropdownMenu: function(widthToDisable) {   
            
            widthToDisable = widthToDisable ? widthToDisable : 480;

            return this.each(function() {
                $(this).find('li').each(function(){
                    $(this).hover(function(){
                        if(parseInt($(window).width()) > widthToDisable){
                            $(this).find('ul:first').css({visibility: "visible",display: "none"}).slideDown(400);
                        }
                    },function(){
                        if(parseInt($(window).width()) > widthToDisable){
                            $(this).find('ul:first').css({visibility: "hidden"});
                        }
                    });

                });
                        
            });
        }
    });         
})(jQuery);


/*
*	$.svAnimateHover
*	@params 
*		- options object 
*			- changes - CSS changes to make
*			- speed - Speed of the animation
*			- selector - OPTIONAL selector for child of element being hovered over
*			- easing - OPTIONAL easing function
*			- onstart - OPTIONAL on start callback function
*			- onend - OPTIONAL on end callback function
*	----------------------------------------------------
*
*	a universal hover animation plugin meant to reduce the size of the code used, be it 
*	the amount of plugins needed or custom code created, to implement hover animation effects.
*
*/
(function($){
	$.fn.svAnimateHover = function(opts) {
		var defaults = {changes:{},easing:'linear',speed:600,onstart:null,onend:null}, 
			st = {};
		opts = $.extend(defaults, opts); 		
		return this.each(function() {
			var $this=$(this);
			for (var i in opts.changes) {
				if(opts.selector){		
					st[i] = $this.find(opts.selector).css(i);
				}
				else{
					st[i] = $this.css(i);
				}
			}
			$this.hover(
				function(){
					svAnimateHoverAni.call(this,true);
				},
				function(){		
					svAnimateHoverAni.call(this,false);
				}
			);
			var svAnimateHoverAni = function(o){	
					var $this=this;
					if(o && opts.onstart){						
						opts.onstart.call($this);
					}
					var p=(!o)?st:opts.changes;					
					if(opts.selector){
						$($this).find(opts.selector).stop(true).animate(p,
														opts.speed,
														opts.easing,
														function(){
															if(!o && opts.onend){
																opts.onend.call($this);
															}
														});
					}
					else{
						$($this).stop(true).animate(p,
										opts.speed,
										opts.easing,
										function(){
											if(!o && opts.onend){
												opts.onend.call($this);
											}											
										});
					}
			}
		});
	};	
})(jQuery);









