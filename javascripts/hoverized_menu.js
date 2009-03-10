/**
*   == Script - hoverized_menu.js
*       Given a collection of menu icons or a wrapper, HoverizedMenu creates covers upon icons
*       that are displayed when icons get hovered. Dimensions from the icon are used on cover.
*
*    == Syntax
*       var myHoveredMenu = new HoverizedMenu(el[, options]);
*
*   == Arguments
*       1. el - (element|collection) The wrapper element of all icons(img-s) or all the icons in a collection.
*       2. options - (object, optional) Options for the cover effects.
*
*   == Options
*       width - (mixed: defaults to the icon width) The width of the cover.
*       height - (mixed: defaults to the icon height) The height of the cover.
*       hursor - (String: defaults to 'pointer') The cursor to be displayed on cover.
*       opacity - (Number: defaults to 0.5) The opacity of the cover.
*
*   == Events
*       onBuildCover: Fired when cover has been attached to icon. Passes the cover as argument.
*
*   == Author   
*       Kevin Valdek (cannedApps)  - created 2009-03-10
*/

var HoverizedMenu = new Class({

    Implements: [Options, Events],
    
    options: {
        onBuildCover: $empty,
        width: null,        
        height: null,
        cursor: 'pointer',
        opacity: 0.5
    },

    /**
    *   el: Accepts a wrapper with icon images inside or all the icons as a collection.
    */
    initialize: function(el, options) {
        this.setOptions(options);
        if($type(el) == 'element') {
            this.wrapper = $(el);
            this.icons = this.wrapper.getElements('img');
        } else { // collection
            this.icons = $A(el); 
            this.wrapper = this.icons[0].getParent(); // not ideal
        }
        
        this.buildCovers();
        this.addHoverEffects();
    },
    
    addHoverEffects: function() {
        this.icons.addEvent('mouseenter', function() { this.retrieve('cover').setStyle('display', 'block'); });
        this.wrapper.addEvent('mouseenter', function() { $$('.icon_cover').setStyle('display', 'none'); }); // remove all covers (avoiding stuck covers)
    },
    
    buildCovers: function() {
        this.icons.each(function(icon) { this.buildCover(icon); }, this);
    },
    
    /**
    *   Builds the actual hover cover to be displayed upon icon.
    */
    buildCover: function(icon) {
        icon.retrieve('cover', new Element('div', {
            'class': 'icon_cover', // set cover background with css property
            styles: $merge(icon.getCoordinates(), this.coverStyles())
        })).inject(document.body, 'top');
        this.fireEvent('buildCover', icon.retrieve('cover'));
    },
    
    /**
    *   Core styles.
    */
    coverStyles: function() {
        var styles = {
            position: 'absolute',
            display: 'none',
            opacity: this.options.opacity,
            cursor: this.options.cursor
        };
        if(this.options.width) styles['width'] = this.options.width;
        if(this.options.height) styles['height'] = this.options.height;
        return styles;
    }
    
});
