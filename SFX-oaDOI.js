$(document).ready(function(){
    SFXoaDOI.run('sv');
});

var SFXoaDOI = (function () {

    var LANGUAGE = 'en',
        STRINGS = {
            fulltextAvailable: {
                en: 'Full text available as',
                sv: 'Fulltext tillg&auml;nglig som'
            },
            moreVersionsFound: {
                en: 'Another version of this article was found:',
                sv: 'En annan version av artikeln hittades:'
            },
            openAccess: {
                en: 'Open Access',
                sv: 'Open Access'
            }
        };

    /**
     * Run
     * Runs the script. Requires language in the form of a 2 letter lowercase acronym.
     * @param language
     */
    var run = function(language) {
        "use strict";
        LANGUAGE = language;
        _API.getData(_printLink)
    };

    /**
     * Get DOI
     * @returns DOI {string}
     * @private
     */
    var _getDOI = function() {
        "use strict";
        var titleInfo = document.querySelector('#titleInfo .Z3988').title,
            titleMetadata = {};

        // Split up the string into keys & values and add them to an array
        var pairs = titleInfo.substring(titleInfo.indexOf('?') + 1).split('&');
        for (var i = 0; i < pairs.length; i++) {
            if(!pairs[i])
                continue;
            var pair = pairs[i].split('=');
            titleMetadata[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }

        // If the DOI exists, return it, otherwise return null
        return typeof titleMetadata['rft.doi'] === 'string' ? titleMetadata['rft.doi'] : null ;
    };

    /**
     * API
     * Class for handling functionality regarding the oaDOI API.
     * @type {{CLASS}}
     * @private
     */
    var _API = (function() {
        "use strict";

        /**
         * Get data
         * Gets data from the oaDOI API
         * @param callback
         */
        var getData = function(callback){
            "use strict";
            var requestURL = 'https://api.oadoi.org/'+_getDOI();
            console.log(requestURL);

            $.getJSON(requestURL, function(data){
                console.log(data.results[0]);
                callback(data.results[0])
            });
        };

        return {
            getData: getData
        }
    })();

    /**
     * Prints out the link if it exists.
     * @param data
     * @private
     */
    var _printLink = function(data){

        console.log(typeof data);
        // Check if link exists
        if(typeof data !== 'undefined' && data.is_free_to_read){
            var element = '\
                <p style="margin-top: 20px; font-size: 13px; font-weight: 700; color: rgb(125,125,125)">'+STRINGS.moreVersionsFound[LANGUAGE]+'</p>\
                <div class="oaDOI oa-'+data.oa_color+'">\
                    <p><a target="_blank" href="'+data.free_fulltext_url+'">'+STRINGS.fulltextAvailable[LANGUAGE]+'</a> <span class="targetName">'+STRINGS.openAccess[LANGUAGE]+'</span></p>\
                </div>';
            $('#services').after(element);

            // Add field to error reporting feature
            $('#sfx-feedback-form').append('<input type="hidden" value="'+STRINGS.fulltextAvailable[LANGUAGE]+' '+STRINGS.openAccess[LANGUAGE]+'" name="ticket-services[]">');
        }

    };

    // Make the functions public
    return {
        run: run
    };
})();