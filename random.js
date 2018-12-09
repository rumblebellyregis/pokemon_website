var app = new Vue({

    el: '#vue-app',

    data: {
        pokelist: null,
        loading: true,
        pokeDiv: false,
        pokeNames: null,
        damage: null,
        relation1: null,
        relation2: null,
        relation3: null,
        relatedDiv: false,
        random16: [],
        description: null,
        name: null,
        errorDiv:false

    },
    mounted() {
        this.loadData();
    },
    
    methods: {
        loadData: function () {
            /**
             * This function loads the Pokemon Type data from API and adds into pokelist.
             * @method splice: This method is used to eliminate the unwanted pokemon types.
             */
            fetch("https://pokeapi.co/api/v2/type/", )
                .then(r => r.json())
                .then(json => {
                    app.pokelist = json.results;
                    app.pokelist.splice(app.pokelist.findIndex(v => v.name === "unknown"), 1);
                    app.pokelist.splice(app.pokelist.findIndex(v => v.name === "shadow"), 1);
                    app.getCategory()
                    app.loading = false
                })
                .catch(e => console.log(e));
        },
        
        getCategory: function () {
            /**
             * This function gets the selected category name from the url.
             */
            var currentLocation = window.location;
            currentLocation = currentLocation.search.split('=').pop();
            index = app.pokelist.findIndex(v => v.name === currentLocation);

            if (index >= 0) {
                app.loadCategory(app.pokelist[index].url)
            } else {
                app.errorDiv = true;
            }
        },
        
        loadCategory: function (url) {
            /**
             * This function loads the category which is determined by getCategory function.
             * @param {String} url: The url of API, of the selected category
             */           
                fetch(url, )
                .then(r => r.json())
                .then(json => {
                    app.damage = json.damage_relations
                    app.pokeNames = json.pokemon;
                    app.name = json.name;
                    app.getDescription();
                    app.getSixteenNumbers()
                    app.pokeDiv = true;
                    app.getRelatedType();
                })
                .catch(r => console.log(r)) 
        },

        capitalizeFirstLetter: function (string) {
            /**
             * This function turns the first letter of the word into capital letter.
             * @param {String} word: The word which will be capitalized.
             */
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        
        callType: function (name) {
            /**
             * This function redirects you to page of the item, which is selected from categories menu or sitemap.
             * @param {String} name: The name of the item which is selected.
             */
            window.location = "categories.html?cat=" + name;
        },
        
        getSixteenNumbers: function () {
            /**
             * This function selects 16 random items, which have the id's less than 1000 (this is an extra check for data quality of API).
             */
            let j = this.pokeNames.length
            let arrayOfSixteen = []
            while (arrayOfSixteen.length < 16) {
                random = Math.floor(Math.random() * j)
                var field = (this.pokeNames[random].pokemon.url).split("/")
                if (arrayOfSixteen.indexOf(random) < 0 && field[6] < 808) {
                    arrayOfSixteen.push(random)
                }
            }
            this.getSixteenItems(arrayOfSixteen)
        },
        
        getSixteenItems: function (arrayOf) {
            /**
             * This function puts the items to detail page, which were detected by arrayOf. 
             * @param {Array} arrayOf: The field detects the item numbers.
             */
            this.random16 = []
            for (i = 0; i < arrayOf.length; i++) {
                this.random16.push(this.pokeNames[arrayOf[i]])
            }
        },
        
        loadImage(url) {        
            /**
             * This function fetches the image of the pokemon.
             * @param {String} url: The url of the detail API of the pokemon
             */
             let fields = url.split("/")
            let urlPart=(fields[6].length==1)?fields[6]="00"+fields[6]:(fields[6].length==2)?fields[6]="0"+fields[6]:fields[6];
           
            let img='https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+urlPart+".png"
            return img
        },
        
        getRelation: function (array, name1, name2) {
            /**
             * This function creates a related category name to the selected category, and checks if the related categories are unique and different from selected category.
             * @param {Array} array: The arrays from API, which will be checked for any relation to the selected type.
             * @param {String} name1: The name of first related item
             * @param {String} name2: The name of second related item
             */
            for (i = 0; i < array.length; i++) {
                if (app.name != array[i].name && name1 != array[i].name && name2 != array[i].name) {
                    return array[i];
                }
            }
        },

        getRelatedType: function () {
            /**
             * This function gets 3 related types to the selected type by conditional chains.
             */
            this.relation1 = (this.damage.double_damage_from.length > 0) ? this.getRelation(this.damage.double_damage_from, null, null) : null;
            (this.relation1 == null) ? this.relation1 = (this.this.damage.no_damage_to.length > 0) ? this.getRelation(this.this.damage.no_damage_to) : null: null;
            this.relation2 = (this.damage.double_damage_to.length > 0) ? this.getRelation(this.damage.double_damage_to, this.relation1.name, null) : null;
            (this.relation2 == null) ? this.relation2 = (this.damage.no_damage_from.length > 0) ? this.getRelation(this.damage.no_damage_from, this.relation1.name, null) : null: null;
            (this.relation2 == null) ? this.relation2 = (this.damage.double_damage_from.length > 0) ? this.getRelation(this.damage.double_damage_from, this.relation1.name, null) : null: null;
             this.relation3 = (this.damage.half_damage_from.length > 0) ? this.getRelation(this.damage.half_damage_from, this.relation1.name, this.relation2.name) : null;
            (this.relation3 == null) ? this.relation3 = (this.damage.half_damage_to.length > 0) ? this.getRelation(this.damage.half_damage_to, this.relation1.name, this.relation2.name) : null: null;

            app.relatedDiv = true;
        },
        
        getDescription: function () {
            /**
             * This function retrieves the descriptions of pokemon types.
             */
            fetch("https://api.myjson.com/bins/6u0z6", )
                .then(r => r.json())
                .then(json => {            
                    app.description = json;
                })
                .catch(r => console.log(r))
        },
        
        getRelatedTypeImages: function (src) {
            /**
             * This function retrieves the images of related types.
             */
            return "images/" + src + "/full.png";
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
