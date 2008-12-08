/**
*   Throws a lightning effect on target element.
*   == Author
*   Kevin Valdek (cannedApps)
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
    
    initialize: function( target ) {
        this.target = $( target );
        this.setOptions( target );
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
        this.explode();
        $each( this.lightnings, function( lightning ) {
            lightning.setStyle( 'display', 'block' ).verticalAttack.start( 'left', lightning.getStyle( 'left' ).toInt() + this.targetCoords.width.toInt() );
        }, this );
    },
    
    explode: function() {
        this.explosionContainer.frontAttack.start( 'opacity', .85 ).chain( function() {
            this.start( 'opacity', 0 )
        } );
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