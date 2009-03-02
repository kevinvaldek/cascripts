/**
*   == Script - moo_list.js
*       Ajax list with automated growth on user scroll down.
*       Uses the +page+ parameter to fetch new rows (increments page at each request).
*
*   == Author   
*       Kevin Valdek - created 2009-02-24
*/

var MooList = new Class({
    
    Implements: [ Options, Events ],

    options: {
        onFetch: $empty,
        onFetched: $empty,
        onAllFetched: $empty,
        offsetBuffer: 300,
        remoteURL: null,
        currentPage: 1,
        rowsWrapper: 'tbody'
    },
    
    initialize: function(list, options) {
        this.setOptions(options);
        this.list = $(list);
        
        this.fetchUnlocked = true; // so we do not fetch new while already fetching rows
        this.lastBottomOffset = this.getBottomOffset();
        window.addEvent('scroll', this.onScroll.bind(this));
        if( this.getBottomOffset() <= 0 ) this.fetchRows(); // in case the client has greater height on the window than the initial list
    },
    
    onScroll: function() {
        var bottomOffset = this.getBottomOffset();
        if(this.criticalOffset(bottomOffset) && this.fetchUnlocked) this.fetchRows();
        this.lastBottomOffset = bottomOffset;
    },
    
    fetchRows: function() {
        this.fetchUnlocked = false; // lock
        this.fireEvent('onFetch');

        this.request = this.request || new Request.HTML({
            url: this.options.remoteURL || location.href.replace(/\?.*$/, ''), // default to current uri without the parameters stripped
            method: 'get',
            onSuccess: function() {
                var html = arguments[2]; // arg[2] is pure html
                if(html.trim().length) {
                    var wrapper = new Element(this.options.rowsWrapper).inject(this.list).set('html', html);
                    this.fireEvent('onFetched', wrapper);
                    this.fetchUnlocked = true;
                } // not unlocking when all rows are fetched
                else { this.fireEvent('onAllFetched'); }
            }.bind(this)
        })
        this.request.send( $H({ page: ++this.options.currentPage }).toQueryString() );
    },
    
    /**
    *   Returns true if +bottomOffset+ is less than last registered bottomOffset and less than +options.offsetBuffer+
    */
    criticalOffset: function(bottomOffset) {
        return bottomOffset < this.lastBottomOffset && bottomOffset <= this.options.offsetBuffer;
    },
    
    /**
    *   Returns the integer offset from bottom of body (relative from current scroll position).
    */
    getBottomOffset: function() {
        return document.body.offsetHeight - (window.getHeight() + window.getScroll().y);
    }
  
});