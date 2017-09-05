/* eslint no-console: "off" */
define(["durandal/app", "eventHandler"], function(app, event) {
    var ret = {
        isConnected: false,
        isMeetingActive: false,
        requests: [],
        displayRequests: [],
        messages: [],
        primus: null,
        activate: function() {
            // the router's activator calls this function and waits for it to complete before proceeding
            if(this.primus === null || this.primus.online !== true) {
                event.setupPrimus(this, "wall");
            }
        },
        initializeMessage: function(message) {
            if(message.meeting.meetingId !== undefined) {
                this.isMeetingActive = true;
            } else {
                this.isMeetingActive = false;
            }
            this.requests = message.requests;
            this.setDisplay();
        },
        meetingMessage: function(message) {
            if(message.event === "started") {
                this.isMeetingActive = true;
            } else {
                this.isMeetingActive = false;
            }
            this.requests = [];
            this.setDisplay();
        },
        refreshMessage: function(message) {
            this.requests = message.requests;
            this.setDisplay();
        },
        requestMessage: function(message) {
            switch(message.event) {
            case "remove":
                this.removeFromList(message.requestId);
                break;
            }
        }
    };

    ret.setDisplay = function() {
        this.displayRequests = this.requests.sort(function(a, b) {
            if(a.status === "active") {
                return -1;
            } else if(b.status === "active") {
                return 1;
            } else if(a.item.itemOrder === b.item.itemOrder) {
                return a.dateAdded.valueOf() - b.dateAdded.valueOf();
            } else {
                // send Off Agenda to the bottom
                return ((a.item.itemName === "Off Agenda") ? 1000 : a.item.itemOrder) - ((b.item.itemName === "Off Agenda") ? 1000 : b.item.itemOrder);
            }
        }).slice(0, 10);
    };

    ret.removeFromList = function(requestId) {
        var toRemove = this.requests.find(function(r) {
            return r.requestId === parseInt(requestId);
        });
        if(toRemove) {
            this.requests.splice(this.requests.indexOf(toRemove), 1);
        }

        this.setDisplay();
    }.bind(ret);

    return ret;
});
