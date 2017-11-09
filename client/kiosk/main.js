﻿/* global requirejs */
requirejs.config({
    paths: {
        "text": "../lib/require/text",
        "durandal": "../lib/durandal/js",
        "plugins": "../lib/durandal/js/plugins",
        "transitions": "../lib/durandal/js/transitions",
        "knockout": "../lib/knockout/knockout-3.4.0",
        "bootstrap": "../lib/bootstrap/js/bootstrap",
        "jquery": "../lib/jquery/jquery-1.9.1",
        "primus": "../primus/primus",
        "eventHandler": "../lib/rts/eventHandler",
        "kioskDialog": "./viewmodels/dialog"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"],
            exports: "jQuery"
        }
    }
});

define(["durandal/system", "durandal/app", "durandal/viewLocator", "bootstrap"], function(system, app, viewLocator) {
    // >>excludeStart("build", true);
    system.debug(true);
    // >>excludeEnd("build");

    app.title = "Request To Speak";

    app.configurePlugins({
        router: true,
        dialog: true,
        observable: true
    });
    
    app.apiLocation = location.href.replace(/[^/]*$/, "") + "api/";    

    $(document).ajaxError(function(jqXHR, status, errorThrown) {
        if(status.status === 302) {
            app.showMessage("You are not authorized for this resource. Please login.").then(function() {
                location.reload();
            });
        }
    });

    app.start().then(function() {
        // Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        // Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        // Show the app by setting the root view model for our application with a transition.
        app.setRoot("viewmodels/kiosk", "entrance");
    });
});
