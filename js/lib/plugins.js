(function(i){function l(a){null!=e&&(a.dropClass&&e.removeClass(a.dropClass),e=null);null!=c&&a.canDropClass&&c.removeClass(a.canDropClass)}var o={makeClone:!1,sourceClass:null,sourceHide:!1,dragClass:null,canDropClass:null,dropClass:null,isActive:!0,container:null,canDrag:function(a){return a},canDrop:function(a){return a.hasClass("drop")||0<a.parents(".drop").size()},didDrop:function(a,c){a.appendTo(c)}},h=null,c=null,e=null,m,n,j,k={init:function(a){a=i.extend({},o,a);this.data("options",a);this.bind("mousedown.dragdrop touchstart.dragdrop",
k.onStart);return this},destroy:function(){this.unbind("mousedown.dragdrop touchstart.dragdrop");return this},on:function(){this.data("options").isActive=!0},off:function(){this.data("options").isActive=!1},onStart:function(a){var g=i(this),b=g.data("options");if(b.isActive){var f=b.canDrag(g,a);if(f){h=f;var d=h.offset(),e=h.width(),l=h.height();"touchstart"==a.type?(m=a.originalEvent.touches[0].clientX-d.left,n=a.originalEvent.touches[0].clientY-d.top):(m=a.pageX-d.left,n=a.pageY-d.top);b.makeClone?
(c=h.clone(!1),c.appendTo(f.parent()),b.sourceClass?h.addClass(b.sourceClass):b.sourceHide&&h.css("visibility","hidden")):c=h;c.css({position:"absolute",left:d.left,top:d.top,width:e,height:l});b.dragClass&&c.addClass(b.dragClass);if(b=b.container)d=b.offset(),j={minX:d.left,minY:d.top,maxX:d.left+b.outerWidth()-f.outerWidth(),maxY:d.top+b.outerHeight()-f.outerHeight()};i(window).bind("mousemove.dragdrop touchmove.dragdrop",{source:g},k.onMove).bind("mouseup.dragdrop touchend.dragdrop",{source:g},
k.onEnd);a.stopPropagation();return!1}}},onMove:function(a){if(c){var g=a.data.source.data("options"),b,f;"touchmove"==a.type?(b=a.originalEvent.touches[0].clientX,f=a.originalEvent.touches[0].clientY):(b=a.pageX,f=a.pageY);c.css("display","none");var d=document.elementFromPoint(b-document.documentElement.scrollLeft-document.body.scrollLeft,f-document.documentElement.scrollTop-document.body.scrollTop);c.css("display","");b-=m;f-=n;j&&(b=Math.min(Math.max(b,j.minX),j.maxX),f=Math.min(Math.max(f,j.minY),
j.maxY));c.css({left:b,top:f});if(d){if(null==e||e.get(0)!=d)b=i(d),g.canDrop(b)?(g.dropClass&&(null!=e&&e.removeClass(g.dropClass),b.addClass(g.dropClass)),g.canDropClass&&c.addClass(g.canDropClass),e=b):null!=e&&l(g)}else null!=e&&l(g);a.stopPropagation();return!1}},onEnd:function(a){c&&(a=a.data.source.data("options"),e&&a.didDrop(h,e),l(a),a.makeClone?(c.remove(),a.sourceClass?h.removeClass(a.sourceClass):a.sourceHide&&h.css("visibility","visible")):(c.css("position","static"),c.css("width",""),
c.css("height",""),a.dragClass&&c.removeClass(a.dragClass)),i(window).unbind("mousemove.dragdrop touchmove.dragdrop"),i(window).unbind("mouseup.dragdrop touchend.dragdrop"),h=c=j=null)}};i.fn.dragdrop=function(a){if(k[a])return k[a].apply(this,Array.prototype.slice.call(arguments,1));if("object"===typeof a||!a)return k.init.apply(this,arguments);i.error("Method "+a+" does not exist on jQuery.dragdrop")}})(jQuery);