/**
*   == Script: nifty_countdown.js
*       Displays a countdown in a nifty manner, using styled images as numbers.
*   
*   == Syntax
*       var myCountdown = new NiftyCountdown(clockBoard, endTime);
*
*   == Arguments
*       1. clockBoard - (element) The container Element for the countdown blocks.
*       2. endTime - (String) The end time to be passed to new Date(endTime).
*
*   == Example
*       new NiftyCountdown( 'countdown', "23 December, 2009" );
*
*   == Author
*       Kevin Valdek (cannedApps)
*/


var NiftyCountdown = new Class( {

    Extends: Countdown,
    
    initialize: function( clockBoard, endTime ) {
        this.clockBoard = $( clockBoard );
        this.buildBlocks();
        this.parent( new Date( endTime ) );
    },
    
    buildBlocks: function() {
      this.daysBoard = this.insertBlock( 'days' );
      this.hoursBoard = this.insertBlock( 'hours' );
      this.minutesBoard = this.insertBlock( 'minutes' );
      this.secondsBoard = this.insertBlock( 'seconds' );
    },
    
    insertBlock: function( spectrum ) {
        return new Element( 'div', { 'id': spectrum, 'styles': {
            'width': this.clockBoard.getStyle( 'width' ),
            'height': this.clockBoard.getStyle( 'height' ).toInt() / 4
        } } ).adopt( new Element( 'img', { 'src': '/images/countdown/' + spectrum.substring( 0, 1 ) + '.png', 'class': 'time_unit', 'styles': { 'float': 'right' } } ) ).inject( this.clockBoard );
    },
    
    exportTime: function() {
        this.updateTime( this.secondsBoard, this.seconds );
        this.conditionalUpdate( this.previous_minutes, this.minutes, this.minutesBoard );
        this.conditionalUpdate( this.previous_hours, this.hours, this.hoursBoard );
        this.conditionalUpdate( this.previous_days, this.days, this.daysBoard );
    },
    
    conditionalUpdate: function( previous, current, board ) {
        if ( previous != current ) {
            this.updateTime( board, current );
            previous = current;
        }        
    },
    
    updateTime: function( board, time ) {
        board.getElements( '.number' ).dispose();
        var twodigit = (time + '').substring( 1, 2 ) != '';
        if( !twodigit ) this.getNumber( 0 ).inject( board );
        this.getNumber( (time + '').substring( 0, 1 ) ).inject( board );
        if( twodigit ) this.getNumber( (time + '').substring( 1, 2 ) ).inject( board );
    },
    
    getNumber: function( number ) {
        return new Element( 'img', { 'src': '/images/countdown/' + number + '.png', 'class': 'number' } );
    }

} );
