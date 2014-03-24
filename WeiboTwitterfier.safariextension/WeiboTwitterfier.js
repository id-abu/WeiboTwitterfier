if (window.top === window) {
// Make sure the parent frame is not an iframe



/*
 * Load settings
 */

var settings;
loadSettings();


/*
 * Main
 */

function main() {
    if (settings.two_column_mode === true) {
        enterTwoColumnMode();
    }
}


/*
 * Get elements
 */

var main_wrapper = document.body.querySelector(".W_main");
var left_column = document.body.querySelector(".W_main_l");
var left_column_nav;
if (left_column) left_column_nav = left_column.querySelector(".WB_left_nav");
var right_column = document.body.querySelector(".W_main_r");
var right_column_info;
if (right_column) right_column_info = right_column.querySelector("#pl_rightmod_myinfo");


/*
 * Settings
 */

function loadSettings() {
    // Add event listener
    safari.self.addEventListener("message", function(event) {
        if (event.name === "setSettings") {
            settings = event.message;
            main();
        }
    }, false);
    
    // Get settings from global page
    safari.self.tab.dispatchMessage("getSettings");
}


/*
 * Custom layout
 */

function enterTwoColumnMode() {
    var nav_header;
    var nav_header_search;
    
    var changeLayout = function() {
        // Remove left column
        left_column.remove();
        
        // Change nav header width
        nav_header.style.width = "830px";
        nav_header_search.setAttribute("two-column-mode", "");
        
        // Change main width and background position
        main_wrapper.style.width = "830px";
        main_wrapper.style.backgroundPositionX = "-150px";
        
        // Append left column to right column under info
        right_column.insertBefore(left_column, right_column_info.nextSibling);
    };

    var waitForLoad = function() {
        // Return if left column not exist or in relation page
        if (!left_column ||
            !left_column_nav ||
            left_column_nav.id === "pl_leftNav_relation") {
            return;
        }
        
        // Return if right column not exist
        if (!right_column ||
            !right_column_info) {
            return;
        }
        
        // Wait for nav header to load
        var find_nav_header_max_retries = 50;
        var nav_header_int = window.setInterval(function() {
            nav_header = document.body.querySelector(".gn_header");
            if (nav_header ||
                !find_nav_header_max_retries) {
                if (nav_header) {
                    nav_header_search = nav_header.querySelector(".gn_search");
                    
                    // Return if nav header not exist
                    if (!nav_header ||
                        !nav_header_search) {
                        return;
                    }
                    
                    changeLayout();
                }
                nav_header_int = window.clearInterval(nav_header_int);
            }
            find_nav_header_max_retries -= 1;
        }, 100);
    };
    waitForLoad();
}



}
