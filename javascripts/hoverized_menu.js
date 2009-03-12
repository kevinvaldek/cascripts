/**
*   == Script - hoverized_menu.js
*       Given a collection of menu icons or a wrapper, HoverizedMenu creates covers upon icons
*       that are displayed when icons get hovered. Dimensions from the icon are used on cover.
*       All covers are given the class 'icon_cover'. Use the class name to give it a background with css.
*
*   == Syntax
*      var myHoveredMenu = new HoverizedMenu(el[, options]);
*
*   == Arguments
*       1. el - (element|collection) The wrapper element of all icons(img-s) or all the icons in a collection.
*       2. options - (object, optional) Options for the cover effects.
*
*   == Options
*       width - (mixed: defaults to the icon width) The width of the cover.
*       height - (mixed: defaults to the icon height) The height of the cover.
*       cursor - (String: defaults to 'pointer') The cursor to be displayed on cover.
*       opacity - (Number: defaults to 1) The opacity of the cover.
*
*   == Events
*       onBuildCover: Fired when cover has been attached to icon. Passes the icon as argument.
*       onHover: Fired when icon is hovered. Passes the icon as argument.
*       onHoverOut: Fired when icon is no longer hovered. Passes the icon as argument.
*
*   == Author   
*       Kevin Valdek (cannedApps)  - created 2009-03-10
*/

var HoverizedMenu = new Class({

    Implements: [Options, Events],
    
    options: {
        onBuildCover: $empty,
        onHover: $empty,
        onHoverOut: $empty,
        width: null,        
        height: null,
        cursor: 'pointer',
        opacity: 1
    },

    /**
    *   el: Accepts a wrapper with icon images inside or all the icons as a collection.
    */
    initialize: function(el, options) {
        this.setOptions(options);
        if($type($(el)) == 'element') {
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
        var changeIconState = function(icon, display) {
            icon.retrieve('cover').setStyle('display', display);
            this.fireEvent(display == 'block' ? 'hover' : 'hoverOut', icon);
        }.bind(this);
        this.icons.each(function(icon) { icon.addEvent('mouseenter', changeIconState.pass([icon, 'block'])); }, this);
        this.wrapper.addEvent('mouseenter', function() { this.icons.each(function(icon) { 
            changeIconState(icon, 'none');
        }); }.bind(this));
        window.addEvent('resize', this.recalcPositions.bind(this));
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
            styles: this.mergedStyles(icon)
        })).inject(document.body, 'top');
        this.fireEvent('buildCover', icon);
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
    },
    
    mergedStyles: function(icon) {
        return $merge(icon.getCoordinates(), this.coverStyles());
    },
    
    recalcPositions: function() {
        this.icons.each(function(icon) { icon.retrieve('cover').setStyles(this.mergedStyles(icon)); }, this);
    }
    
});
