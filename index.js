const SEARCH_URL = 'https://www.cheapshark.com/api/1.0/games?title='
const SEARCH_URL_SUFFIX = '&limit=15&exact=0'

const GAME_DETAILS_URL = 'https://www.cheapshark.com/api/1.0/games?id='

const GAME_DEALS_LOOKUP = 'https://www.cheapshark.com/api/1.0/deals?id='

const STORE_LIST_URL = 'https://www.cheapshark.com/api/1.0/stores' 

const DEAL_ID_LOOKUP = 'https://www.cheapshark.com/redirect?dealID='

var app = new Vue({
  el: '#app',
  components: {
    Autocomplete
  },
  vuetify: new Vuetify(),
  data: {
    info: null,
    cardTitle: '',
    cheapestPrice: '',
    cheapestStoreName: '',
    cover: 'https://www.kindpng.com/picc/m/19-191345_game-controller-pad-videogame-video-game-icon-png.png',
    stores: {},
    middleword: '',
    dollarsign: '',
    show: false,
    other_deals: [],
    info_hover_active:false,
    cheapestDealID: '',
  },

  mounted: function(){
    this.handleStores()
  },

  methods: {
    search(input){
      const url = `${SEARCH_URL}${encodeURI(input)}${SEARCH_URL_SUFFIX}`
      console.log(url)

      return new Promise(resolve => {
        if (input.length < 3) {
          return resolve([])
        }
        fetch(url)
        .then(response => response.json())
        .then(data => resolve(data))
      })
    },

    getResultValue(result) {
      return result.external
    }, 
    handleSubmit(result){
      const url = `${GAME_DETAILS_URL}${encodeURI(result.gameID)}`
      const deal_url = `${GAME_DEALS_LOOKUP}${result.cheapestDealID}`
      console.log(deal_url)


      
      fetch(url)
      .then(response => response.json())
      .then(data => { 
        this.show = true
        this.cardTitle = data.info.title
        this.dollarsign = '$'
        this.cheapestPrice = result.cheapest
        this.cover = result.thumb
        this.middleword = 'at'
        this.cheapestDealID = result.cheapestDealID
      })
      
      fetch(deal_url)
      .then(response => response.json())
      .then(data => {
        this.cheapestStoreName = this.stores.get(data.gameInfo.storeID)
      })

      fetch(url)
      .then(response => response.json())
      .then(data => {
        this.other_deals = data.deals
        for(var i = 0; i < this.other_deals.length; i++){
          var storeNameFromMap = this.stores.get(this.other_deals[i].storeID)

          this.other_deals[i]["storeName"] = storeNameFromMap

          if(storeNameFromMap === this.cheapestStoreName){
            this.other_deals.splice(i, 1)
            i--
          }
        }
        console.log(this.other_deals)
      })
      
    },
    handleStores(){
      const stores_url = `${STORE_LIST_URL}`
      fetch(stores_url)
      .then(response => response.json())
      .then(data => {
        console.log(data[0].storeID)
        this.stores = new Map()
        for(var i = 0; i < data.length; i++){
          this.stores.set(data[i].storeID, data[i].storeName)
        }
        
      })
    },
    openCheapestDeal(){
      const deal_url = `${GAME_DEALS_LOOKUP}${this.cheapestDealID}`

      fetch(deal_url)
      .then(response => response.json())
      .then(data => {
        window.open("https://www.cheapshark.com/redirect?dealID=" + this.cheapestDealID, "_self")  
        console.log(data)
      })

    }, 

    handleOtherDeals(deal){

        window.open("https://www.cheapshark.com/redirect?dealID=" + deal.dealID, "_self")


    }
  }

})
