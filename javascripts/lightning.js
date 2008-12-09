/**
*    == Script: lightning.js
*       Throws a lightning effect on target element.
*   
*    == Syntax
*       var myLightning = new Lightning(target[, options]);
*
*   == Arguments
*       1. target - (element) The element to be attacked with lightning.
*       2. options - (object, optional) Options for the lightning effect.
*
*   == Options
*       thickness - (mixed: defaults to 1px) The width of the smallest lightning.
*       color - (mixed: defaults to #fff) The color of the lightning effect.
*       verticalDuration - (number: defaults to 1200) the duration of the vertical lightning effect.
*       frontDuration - (number: defaults to 800) the duration of the element fade away.
*       strikeInterval - (number: defaults to 7000) How often the Lightning is applied.
*
*   == Example
*       new Lightning('logo');
*
*   == Author
*       Kevin Valdek (cannedApps)
*/

var Lightning = new Class( {
    
    Implements: [ Options ],
    
    options: {
        thickness: '1px',
        color: '#fff',
        verticalDuration: 1200,
        frontDuration: 800,
        strikeInterval: 7000
    },
    
    lightnings: [],
    
    initialize: function( target, options ) {
        this.target = $( target );
        this.setOptions( options );
        this.targetCoords = this.target.getCoordinates();
        this.firstLightning = new Element( 'span', {
            styles: {
                position: 'absolute',
                top: this.targetCoords.top,
                left: this.targetCoords.left,
                height: this.targetCoords.height,
                width: this.options.thickness,
                background: this.options.color,
                display: 'none'
            }
        } ).inject( document.body, 'top' );
        this.lightnings.push( this.firstLightning );
        this.lightnings.push( this.clone( this.firstLightning, 2 ) );
        this.lightnings.push( this.clone( this.firstLightning, 3 ) );
        
        $each( this.lightnings, function( lightning ) {
            lightning.verticalAttack = this.applyVerticalAttack( lightning, this.options.verticalDuration );
            this.options.verticalDuration -= parseInt( this.options.verticalDuration / 3 );
        }, this );
        
        this.explosionContainer = new Element( 'div', {
            styles: this.targetCoords
        } ).set( 'styles', { position: 'absolute', background: this.options.color, opacity: 0 } ).inject( document.body, 'top' );
        this.explosionContainer.frontAttack = new Fx.Tween( this.explosionContainer, {
            duration: this.options.frontDuration,
            transition: 'bounce:in:out'
        } );
        
        this.attack.periodical( this.options.strikeInterval, this );
    },
    
    attack: function() {
        Browser.Engine.trident4 ?  this.iexplode() : this.explode();
        $each( this.lightnings, function( lightning ) {
            lightning.setStyle( 'display', 'block' ).verticalAttack.start( 'left', lightning.getStyle( 'left' ).toInt() + this.targetCoords.width.toInt() );
        }, this );
    },
    
    explode: function() {
        this.explosionContainer.frontAttack.start( 'opacity', .85 ).chain( function() {
            this.start( 'opacity', 0 )
        } );
    },
    
    iexplode: function() {
        // TODO: some effect for the ie6eers
    },
    
    clone: function( who, multiple ) {
        return who.clone().setStyle( 'width', this.options.thickness.toInt() * multiple ).inject( document.body, 'top' );
    },
    
    applyVerticalAttack: function( lightning, duration ) {
        return new Fx.Tween( lightning, {
            duration: duration,
            transition: 'cubic:in',
            onComplete: function() {
                lightning.set( 'styles', {
                    left: this.targetCoords.left,
                    display: 'none'
                } );
            }.bind( this )
        } );
    }
    
} );
