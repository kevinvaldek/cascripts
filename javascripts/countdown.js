var Countdown = new Class( {
    options:{
        oldTime: 0
    },
    
    initialize: function (emStart){
        this.timerFunction( emStart );
        this.timerFunction.periodical(1000,this,emStart);
    },
    
    timerFunction: function (emStart){
        var actualTime = new Date();
        newHeight=[];
        var timeDiff = Math.floor((emStart-actualTime.getTime())/1000);
        
        this.days = Math.floor(timeDiff/86400)+"";
        //$('days').set( 'text', days );
        newHeight[0] = this.days.slice(0,1)*10;
        newHeight[1] = this.days.slice(1,2)*10;
        newHeight[2] = this.days.slice(2,3)*10;
        timeDiff -= this.days*86400;
        
        this.hours=Math.floor(timeDiff/3600);
        //$('hours').set( 'text', hours ); 
        newHeight[3] = this.days.slice(0,1)*10;
        newHeight[4] = this.days.slice(1,2)*10;
        timeDiff -= this.hours*3600;
        
        this.minutes = (Math.floor(timeDiff/60));
        //$('minutes').set( 'text', minutes );
        newHeight[5] = this.days.slice(0,1)*10;
        newHeight[6] = this.days.slice(1,2)*10;
        timeDiff -= this.minutes*60;
        
        this.seconds = timeDiff;
        //$('seconds').set( 'text', seconds );
        newHeight[7] = this.days.slice(0,1)*10;
        newHeight[8] = this.days.slice(1,2)*10;
        
        this.options.oldTime=actualTime.getTime();
        this.exportTime();
    },
    
    exportTime: function() {
    
    }
    
} );