/**
 * This Vue component creates the items on homepage. 
 * @method imgFront: Returns the front image of the item on homepage
 * @method imgBack : Returns the rotated image, when the cursor is on item. 
 * @method imgFunction: Returns the full image of the item, when the screen width is decreased under 1000px.
 * @method typeCaller: Opens the page with selected item (category name).
 */

Vue.component("categories", {
    props: ["sth"],
    methods: {
        imgFront: function (name) {
            return "images/" + name + "/front.png"
        },
        imgBack: function (name) {
            return "images/" + name + "/back.png"
        },
        imgFunction: function (src) {
            return "images/" + src + "/full.png";
        },
        typeCaller: function (name) {
            window.location = "categories.html?cat=" + name;
        },
    },
    template: '<div class="random"><div class="mobile col-xs-10- col-xs-offset-1"> <div v-for="type in sth" class="col-xs-4 "><img v-bind:src="imgFunction(type.name)" class="image col-xs-offset-1" v-on:click="typeCaller(type.name)"> </div> </div>   <div class="large col-xs-10 col-xs-offset-1"> <div v-for="type in sth"  class="flip-container col-xs-4" >  <div class=" flipper col-xs-12"> <div class="front col-xs-10 col-xs-offset-1"> <img v-bind:src="imgFront(type.name)" class="frontimg  col-xs-offset-1">  </div>  <div class="back col-xs-10 col-xs-offset-1" v-on:click="typeCaller(type.name)"> <img v-bind:src="imgBack(type.name)" class="backimg col-xs-offset-1"> </div>  </div>  </div></div></div>'
})


var app = new Vue({

    el: '#vue-app',

    data: {
        pokelist: null,
        loading: true,
        random10: [],
        sorted10: null,
        random: true,
        sorted: false,
        name: null,
        scrollPosition:null,
    },

    mounted() {
        this.loadData();
         window.addEventListener('scroll', this.updateScroll);
    },

    methods: { 
        
        updateScroll: function ()  {
            
            /**
             * This function creates a dynamic navigation bar.
             * @method scrollPosition: The navigation bar is transparent behind the footer when the page is scrolled to the top. 
             * When the page gets scrolled down, the background of navigation bar gets fixed with black background color.
             */
            
          this.scrollPosition = window.scrollY;

            (1>this.scrollPosition)?document.getElementById("mainNav").style.backgroundColor="transparent": document.getElementById("mainNav").style.backgroundColor="black";

        },
        loadData: function () {
            /**
             * This function loads the Pokemon Type data from API and adds into pokelist.
             * @method splice: This method is used to eliminate the unwanted pokemon types.
             */
            
           fetch("https://pokeapi.co/api/v2/type/",                 
                )
                .then(r => r.json())
                .then(json => {
                    app.pokelist = json.results;
                    app.pokelist.splice(app.pokelist.findIndex(v => v.name === "unknown"), 1);
                    app.pokelist.splice(app.pokelist.findIndex(v => v.name === "shadow"), 1);
                    app.getTenNumbers();
                    app.loading = false;

                })
                .catch(r => console.log(r))

        },
              
        getTenNumbers: function () {
            /**
             * This function creates a random list of 10 numbers, inside of the length of all items (in this case, 18) and make sure that the numbers are unique.
             */
            let arrayOfTen = []
            while (arrayOfTen.length < 10) {
                random = Math.floor(Math.random() * 18)
                if (arrayOfTen.indexOf(random) < 0) {
                    arrayOfTen.push(random)
                }
            }
            this.getTenItems(arrayOfTen)

        },
        getTenItems: function (arrayOf) {
            /**
             * This function puts the items to homepage, which were detected by arrayOf. 
             * @param {Array} arrayOf: The field detects the item numbers.
             */
            for (i = 0; i < arrayOf.length; i++) {
                this.random10.push(this.pokelist[arrayOf[i]])
            }
            this.sortItems()
        },
        sortItems: function () {
            /**
             * This function alphabetically sorts the items, which are showed on homepage.
             */         
            this.sorted10 = this.random10.slice(0)
            this.sorted10.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        },

        capitalizeFirstLetter: function (word) {
            /**
             * This function turns the first letter of the word into capital letter.
             * @param {String} word: The word which will be capitalized.
             */
            return word.charAt(0).toUpperCase() + word.slice(1);
        },
        callType: function (name) {
            /**
             * This function redirects you to page of the item, which is selected from categories menu or sitemap.
             * @param {String} name: The name of the item which is selected.
             */
            window.location = "categories.html?cat=" + name;

        },
        sortOrRandom: function () {
            /**
             * This function changes the view of the page when the "Sort/Random It" button is clicked, either to sorted or random view.
             */
            this.random = !this.random;
            this.sorted = !this.sorted;
        },
        randomOne: function () {
            /**
             * This function selects a random type and opens the detail page of the selected item.
             */
            random = Math.floor(Math.random() * 18)
            name = this.pokelist[random].name
            window.location = "random.html?cat=" + name;

        },
    }




})
