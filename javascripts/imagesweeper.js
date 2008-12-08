/**
*   Slides images with a smooth discrete sweep and fade.
*   == Author
*   Kevin Valdek (cannedApps)
*/

var ImageSweeper = new Class( {
    
    Implements: [ Options ],
    
    options: {
        shiftInterval: 7000,
        fadeDuration: 1500,
        sweepDuration: 1000,
        sweepLength: '20px'
    },
    
    sweepers: [ 'top', 'right', 'bottom', 'left' ],
    
    images: [],
    
    initialize: function( showRoom, options ) {
        this.showRoom = $( showRoom ).setStyle( 'overflow', 'hidden' );
        this.setOptions( options );
        this.options.sweepLength = this.options.sweepLength.toInt();
        
        // Load images ass assets in background.
        $each( this.showRoom.getElements( 'li' ), function( item ) {
            var dimensions = item.getProperty('size').split('x');
            var asset = new Asset.image( item.get('text'), {
                id: item.id,
                width: dimensions[0],
                height: dimensions[1]
            } );
            this.images.push( asset.setStyle( 'position', 'relative' ) );
        }.bind( this ) );
        this.showRoom.empty();
        
        // Centerize
        $each( this.images, function( image ) {
            image.setStyle( 'right', (  image.getStyle('width').toInt() / 4 ) );
            image.setStyle( 'bottom', ( image.getStyle('height').toInt() / 4 ) );
        }.bind( this ) );
        
        this.currentScreen = this.nextScreen();
        this.fadeIn( this.currentScreen );
        this.sweep();
        this.changeScreen.periodical( this.options.shiftInterval, this );
    },
    
    // Fade out previous, fade in next and start the sweeping.
    changeScreen: function() {
        this.currentScreen.set( 'tween', {
            onComplete:  function() {
                this.currentScreen.setStyle( this.currentSweep, this.currentScreen.getStyle( this.currentSweep ).toInt() - this.options.sweepLength ); //reposition
                this.currentScreen.setStyle( 'display', 'none' );
                this.currentScreen.set( 'tween', { onComplete: $empty } );
                this.currentScreen = this.nextScreen();
                this.fadeIn( this.currentScreen );
                this.sweep();
            }.bind( this )
        } ).tween( 'opacity', 0 );
    },
    
    sweep: function(){
        var sweeper = sweeper || new Fx.Morph( this.currentScreen, {
            duration: this.options.sweepDuration,
            transition: 'back:out'
        } );
        sweeper.start( this.getSweep() );
    },
    
    getSweep: function() {
        this.currentSweep = this.sweepers[ Math.floor( Math.random() * this.sweepers.length ) ];
        switch( this.currentSweep ) {
            case 'top':
                return { 'top': ( this.currentScreen.getStyle( 'top' ).toInt() + this.options.sweepLength ) };
            case 'right':
                return { 'right': ( this.currentScreen.getStyle( 'right' ).toInt() + this.options.sweepLength ) };
            case 'bottom':
                return { 'bottom': ( this.currentScreen.getStyle( 'bottom' ).toInt() + this.options.sweepLength ) };
            case 'left':
                return { 'left': ( this.currentScreen.getStyle( 'left' ).toInt() + this.options.sweepLength ) };
        }
    },
    
    // Pick next screen by random
    nextScreen: function() {
        return this.images[ Math.floor( Math.random() * ( this.images.length ) ) ];
    },
    
    fadeIn: function( screen ){
        screen.inject( this.showRoom ).setStyles( { display: 'block', opacity: 0 } ).set( 'tween', { duration: this.options.fadeDuration } ).tween( 'opacity', 1 );
    }
    
} );