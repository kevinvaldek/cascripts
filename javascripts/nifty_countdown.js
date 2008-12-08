/**
*   Displays a countdown in a nifty manner.
*   == Author
*   Kevin Valdek (cannedApps)
*/


var NiftyCountdown = new Class( {

    Extends: Countdown,
    
    initialize: function( clockBoard, startTime ) {
        this.clockBoard = $( clockBoard );
        this.buildBlocks();
        this.parent( new Date( startTime ) );
    },
    
    buildBlocks: function() {
      this.daysBoard = this.insertBlock( 'days' );
      this.hoursBoard = this.insertBlock( 'hours' );
      this.minutesBoard = this.insertBlock( 'minutes' );
      this.secondsBoard = this.insertBlock( 'seconds' );
    },
    
    insertBlock: function( spectrum ) {
        return new Element( 'div', { id: spectrum, styles: {
            width: this.clockBoard.getStyle( 'width' ),
            height: this.clockBoard.getStyle( 'height' ).toInt() / 4
        } } ).adopt( new Element( 'img', { src: '/images/countdown/' + spectrum[0,0] + '.png', class: 'time_unit',styles: { 'float': 'right' } } ) ).inject( this.clockBoard );
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
        var twodigit = $defined( (time + '')[0,1] );
        if( !twodigit ) this.getNumber( 0 ).inject( board );
        this.getNumber( (time + '')[0,0] ).inject( board );
        if( twodigit ) this.getNumber( (time + '')[0,1] ).inject( board );
    },
    
    getNumber: function( number ) {
        return new Element( 'img', { src: '/images/countdown/' + number + '.png', class: 'number' } );
    }

} );