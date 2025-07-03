"use strict";

;(function (global, page) {

    /**
     * @callback textDisplayFormatter
     * 
     * @param {String} filteredListItem
     * @param {String} filterQuery 
     * @param {String=} formatKey 
     * @param {Boolean=} splitQuery 
     * 
     * @example
     * // returns "<b>san</b>ders pepper"
     * 
     * textDisplayFormatter(
     *   "sanders pepper",
     *   "san"
     * )
     * 
     * @returns {(undefined|String)}
     */
    function  textDisplayFormatter (
        filteredListItem = "",
        filterQuery = "",
        formatKey = "bold",
        splitQuery = false
    ) {
        if (typeof filteredListItem !== "string" || typeof filterQuery !== "string") {
            return;
        }

        var getFormatKeyPairUsing = function (format) {
            if (typeof format !== "string") {
                return ['', ''];
            }
    
            const formatMap = {
              "italics":['<i>','</i>'],
              "bold":['<b>','</b>'],
              "format-inline-x-custom":['<span class="format-inline-x-custom">','</span>']
            };

            return formatMap[String(format)];
        };

        if (splitQuery) {
            var modifiedFilteredListItem = filteredListItem;
            var splitedQuery = filterQuery.split("");

            splitedQuery.forEach(function (character) {
                modifiedFilteredListItem = modifiedFilteredListItem.replace(
                    new RegExp(character+'(?!\<)','gi'),
                    getFormatKeyPairUsing(formatKey).join(character)
                );
            });

            return modifiedFilteredListItem;
        } else {
            return filteredListItem.replace(
                new RegExp(''+filterQuery+'', 'gi'),
                function(match) {
                    if (!match) {
                        return "";
                    }

                    return getFormatKeyPairUsing(formatKey).join(match);
            });
        }
    }
    
    

    /**
     * 
     * 
     * @param {String} objectProperty - the object property name(s) to extract
     * @param {Object} object - the target object to extract property value from
     * @param {String=} delimeter - the delimiter used to establish nested heirachy
     * 
     * @example 
     * // returns 23
     * 
     * extractPropertyValue(
     * "user.age",
     *  {
     *    user: {
     *      age: 23
     *    },
     *    token: "xxxxxxxxxxxxxxxxxx"
     *  }
     * )
     * 
     * @returns {(undefined|String)}
     */

    function extractPropertyValue (
        objectProperty = "",
        targetObject = {},
        delimeter = "."
      ) {
        if (typeof objectProperty !== "string" || typeof targetObject !== "object") {
          return undefined;
        }
        var value = objectProperty.includes(delimeter)
          ? objectProperty
            .split(delimeter)
            .reduce((subObject, prop) => {
              const result = typeof subObject === "object" 
              ? subObject[prop] 
              : subObject;

              return result;
            }, targetObject)
          : targetObject[objectProperty];
        return value;
    }

    /**
     * An array filter/search algorithm that matches characters from a search
     * query string at any position in the target string contained in the
     * array
     * 
     * @param {String} filterQuery - the search query string input text
     * @param {Array} filterList - the array of items to search/filter on
     * @param {Array.<String>=} filterListItemKeys - the list of keys in array (if array contains objects)
     * 
     * @example
     * // returns ["apple", "pineapple"]
     * 
     * completeCharacterSearch(
     *   "app"
     *   ["apple", "banana", "oranges", "avacardo", "pineapple"]
     * );
	 *				
     * @returns {Array}
     */
    function completeCharacterSearch (
        filterQuery = "",
        filterList = [],
        filterListItemKeys = [""]
    ) {
        if (typeof filterQuery !== "string" || Array.isArray(filterList) === false) {
            return [];
        }
        return filterList.filter((filterListItem) => {
          return filterListItemKeys.reduce((finalStatusResult, filterListItemKey) => {
            var listItem =
              typeof filterListItem !== "object"
                ? filterListItem
                : extractPropertyValue(filterListItemKey, filterListItem);
            var haystack =
              typeof listItem === "string" 
                ? listItem.toLowerCase()
                : String(listItem).toLowerCase();
            var needle = filterQuery.toLowerCase();
  
            var result = true,
              radix = -1,
              charPosition = 0,
              charValue = needle[charPosition] || null;
  
            while (null !== charValue) {
              radix = haystack.indexOf(charValue, radix + 1);
              if (radix === -1) {
                result = false;
                break;
              }
              charPosition += 1;
              charValue = needle[charPosition] || null;
            }

            return result || finalStatusResult;
          }, false);
        });
    }

    /**
     * @constant
     * @type {Array}
     * @default
     */
     var books = [
        {
            title: "The Effective Engineer",
            authors: [
                "Edmond Lau"
            ],
            genres: [
                "Motivational"
            ],
            status: "",
            ratings: 4.0,
            year_published: "2009",
            likes_count: 10,
            used_count: 31
        },
        {
            title: "Built To Last",
            authors: [
                "Jim Collins",
                "Jerry I. Porras"
            ],
            genres: [
                "Business",
                "Entrepreneurship"
            ],
            status: "",
            ratings: 4.0,
            year_published: "2001",
            likes_count: 29,
            used_count: 31
        },
        {
            title: "Effective Python",
            authors: [
                "Diomiddis Spinellis"
            ],
            genres: [
                "Motivational"
            ],
            status: "",
            ratings: 4.0,
            year_published: "2006",
            likes_count: 29,
            used_count: 31
        },
        {
            title: "The Lean Startup",
            authors: [
                "Eric Reiss"
            ],
            genres: [
                "Motivational"
            ],
            isbn: 9245789930312,
            status: "in_discussion",
            ratings: 4.0,
            year_published: "2005",
            likes_count: 29,
            used_count: 31
        },
        {
            title: "Big Magic",
            authors: [
                "Elizabeth Gilbert"
            ],
            genres: [
                "Motivational"
            ],
            isbn: 1294059930311,
            status: "in_discussion",
            ratings: 4.0,
            year_published: "2014",
            likes_count: 29,
            used_count: 31
        }
    ];

    /**
     * @callback onMediaDeviceQueried
     * 
     * @param {Event} event
     */

    function onMediaDeviceQueried (event) {
        // Get reference to the searcg text box in the page header banner
        var inputElement = page.getElementById("search-textbox");

        if (event.matches) {
            // viewport is less than 1146px wide
            if (inputElement) {
                inputElement.placeholder = "Search";
            }
        } else {
            // viewport is at least 1146px wide
            if (inputElement) {
                inputElement.placeholder = "Search books, genres, authors, etc.";
            }
        }
    }

    

    /**
     * @callback onElementOutsideClick
     * 
     * @param {Event} event
     */

     function onElementOutsideClick (event) {

    }

    page.addEventListener("click", onElementOutsideClick);

    /**
     * @callback onPageLoadedOrReady
     * 
     * @param {Event} event
     */

    function onPageLoadedOrReady (event) {

        page.removeEventListener("DOMContentLoaded", onPageLoadedOrReady);

        /**
         * @var
         */
        // Get reference to the search text box in the page header banner
        var inputElement = page.getElementById("search-textbox");

        // Check the initial state of the media query
        if (mediaQuery.matches) {
            // viewport is less than 1146px wide
            if (inputElement) {
                inputElement.placeholder = "Search";
            }
        } else {
            // viewport is at least 1146px wide
            if (inputElement) {
                inputElement.placeholder = "Search books, genres, authors, etc.";
            }
        }

        if (inputElement) {
            inputElement.addEventListener("input", onSearchTextBoxInput);
        }

        if (inputElement) {
            inputElement.addEventListener("blur", onSearchTextBoxBlur);
        }

        if (inputElement) {
            inputElement.addEventListener("focus", onSearchTextBoxFocus);
        }

        /**
         * @var
         */
        // Get reference to the button for the search box form to intiate a search
        var buttonElementSearch = page.getElementById("search-textbox-button");

        buttonElementSearch.addEventListener("click", (event) => {
            // Get reference to the search text box in the page header banner
            var inputElement = event.target.form.elements["search-textbox"];

            // Get reference to autocomplete dropdown list for search text box 
            var listElement = page.getElementById("autocomplete-dropdown");

            var inputText = inputElement.value;

            inputElement.value = "";


        });

        /**
         * @var
         */
        // Get reference to the button for hiding the search box in mobile view
        var buttonElementSearchTrigger = page.getElementById("dismiss-search-trigger");

        buttonElementSearchTrigger.addEventListener("click", () => {
            var sectionElement = page.getElementById("search-bar");

            if (sectionElement.classList.contains("show-as-banner-overlay")) {
                sectionElement.classList.remove("show-as-banner-overlay");
            }
        });

        /**
         * @var
         */
        // Get reference to the button for showing the search box in mobile view
        var buttonElementSearchPopup = page.getElementById("searchbox-popup-button");

        buttonElementSearchPopup.addEventListener("click", function () {
            var searchBarElement = page.getElementById("search-bar");

            // Show the search box by adding a CSS class
            if (! searchBarElement.classList.contains("show-as-banner-overlay")) {
                searchBarElement.classList.add("show-as-banner-overlay");
            }
        });

        /**
         * @var
         */
        // Get reference to the button for hiding the  sidde bar menu in mobile view
        var buttonElementMenuDismissTrigger = page.getElementById("dismiss-menu-trigger");

        buttonElementMenuDismissTrigger.addEventListener("click", function () {
            var sideBarMenuElement = page.getElementById("side-bar");
            var menuOverlayElement = page.getElementById("menu-shade");

            // Hide the side bar by adding a CSS class
            if (sideBarMenuElement.classList.contains("show-as-menu-slide-in")) {
                sideBarMenuElement.classList.remove("show-as-menu-slide-in");
            }

            // Hide the sidebar menu overlay by adding a CSS class
            if ( menuOverlayElement.classList.contains("show-when-menu-slide-in")) {
                menuOverlayElement.classList.remove("show-when-menu-slide-in");
            }
        });

        /**
         * @var
         */
        // Get reference to the overlay cover
        var menuOverlayElement = page.getElementById("menu-shade");

        menuOverlayElement.addEventListener("click", function () {
            buttonElementMenuDismissTrigger.click();
        });

        /**
         * @var
         */
        // Get reference to the button for showing the side bar menu in mobile view
        var buttonElementMenuShowTrigger = page.getElementById("menu-trigger-button");
        buttonElementMenuShowTrigger.addEventListener("click", function () {
            var sideBarMenuElement = page.getElementById("side-bar");
            var menuOverlayElement = page.getElementById("menu-shade");

            // Show the side bar by adding a CSS class
            if (! sideBarMenuElement.classList.contains("show-as-menu-slide-in")) {
                sideBarMenuElement.classList.add("show-as-menu-slide-in");
            }

            // Show the sidebar menu overlay by adding a CSS class
            if (! menuOverlayElement.classList.contains("show-when-menu-slide-in")) {
                menuOverlayElement.classList.add("show-when-menu-slide-in");
            }
        });
    }

    page.addEventListener("DOMContentLoaded", onPageLoadedOrReady);
    
    // Check if the viewport is less than 1146px wide
    var mediaQuery = global.matchMedia('(max-width: 1146px)');

    // Add a listener to react to changes in the viewport size
    if ("addListener" in mediaQuery) {
        mediaQuery.addListener(onMediaDeviceQueried);
    } else {
        mediaQuery.addEventListener(onMediaDeviceQueried);
    }

    /**
     * @callback onSearchTextBoxInput
     * 
     * @param {Event} event
     */

     function onSearchTextBoxInput (event) {
        // Get reference to autocomplete dropdown list for search text box 
        var listElement = page.getElementById("autocomplete-dropdown");

        // Create document fragment
        var subTreeFragment = page.createDocumentFragment();

        // Get reference to search text box
        var inputElement =  event.target;

        var inputText = inputElement.value;

        var listItemElement = page.createElement("li");

        listItemElement.className = "floating-banner_search-autocomplete-dropdown-listitem";
        listItemElement.setAttribute("role", "option");
        listItemElement.setAttribute("tabindex", "0");

        var results = completeCharacterSearch(
            inputText,
            books.slice(0),
            ["title", "authors", "genres"]
        );

        results.map(function (result) {
            return textDisplayFormatter(
                result.title + " - " + result.authors.join(", "), inputText, "format-inline-x-custom"
            );
        }).map(function (formattedResult) {
            var node = listItemElement.cloneNode();
            var nodeFragment = new DOMParser().parseFromString(
                window.Puritan.createHTML(
                    ['<div class="format-inline-x-custom-rig">', '</div>'].join(formattedResult)
                ), 
                "text/html"
            );
            var listItemChildElement = nodeFragment.body.firstChild;
            node.appendChild(
                listItemChildElement
            );
            subTreeFragment.appendChild(node);
        });

        listElement.innerHTML = window.Puritan.createHTML("");

        listElement.appendChild(subTreeFragment);
    }

    

    /**
     * @callback onSearchTextBoxBlur
     * 
     * @param {Event} event
     */

    function onSearchTextBoxBlur (event) {
        // Get reference to autocomplete dropdown list for search text box 
        var listElement = page.getElementById("autocomplete-dropdown");

        // Get reference to search text box
        var inputElement =  event.target;

        if (inputElement.value.length === 0) {
            if (listElement.classList.contains("show-as-popup")) {
                listElement.classList.remove("show-as-popup");
            }
        }
    }



    /**
     * @callback onSearchTextBoxFocus
     * 
     * @param {Event} event
     */

    function onSearchTextBoxFocus (event) {
        // Get reference to autocomplete dropdown list for search text box 
        var listElement = page.getElementById("autocomplete-dropdown");


        if (! listElement.classList.contains("show-as-popup")) {
            listElement.classList.add("show-as-popup");
        }
    }


}(window, document));

