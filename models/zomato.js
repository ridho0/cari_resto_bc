require('dotenv').config();
const Zomato = require('zomato.js');
const zmt = new Zomato(process.env.ZOMATO_KEY);


const searchHelp = (req,res) => {
  zmt.categories()
  .then((categories)=>{
    zmt.cuisines({ city_id: 74 })
    .then(function(cuisines) {
      zmt.establishments({
        lat: 19.0895595,
        lon: 72.8634203
      })
      .then(establishments => {
        categories = categories.map((x)=>`${x.id} - ${x.name}`).join('\n');
        cuisines = cuisines.map((x)=>`${x.cuisine_id} - ${x.cuisine_name}`).join('\n')
        establishments = establishments.map((x)=>`${x.id} - ${x.name}`).join('\n');
        let result =`CATEGORIES \n${categories}\nCUISINES\n${cuisines}\nESTABLISHMENTS\n${establishments}`;
        res.send(result)
      } )
      .catch( err_esta => console.log(err_esta));
    })
    .catch( err_cusn => console.log(err_cusn) );
  })
  .catch((err_cate)=>console.log(err_cate));

}

const searchResto = (req,res)=> {
  let search = {};
  //jakarta 74
  //bandung
  search.entity_id =  74;
  search.entity_type = 'city';
  for(key in req.query ) search[key] = req.query[key];
  //
  // if (typeof req.query.category !== 'undefined') search.category = req.query.category;
  // if (typeof req.query.q !== 'undefined') search.q = req.query.q;
  // if (typeof req.query.lat !== 'undefined') search.lat = req.query.lat;
  // if (typeof req.query.long !== 'undefined') search.long = req.query.long;
  // if (typeof req.query.radius !== 'undefined') search.radius = req.query.radius;
  // if (typeof req.query.establishment_type !== 'undefined') search.establishment_type = req.query.establishment_type;
  // if (typeof req.query.cuisines !== 'undefined') search.cuisines = req.query.cuisines;
  // if (typeof req.query.sort !== 'undefined') search.sort = req.query.sort;
  // if (typeof req.query.order !== 'undefined') search.order = req.query.order;
  // if (typeof req.query.count !== 'undefined') search.count = req.query.count;
  zmt.search(search)
  .then(function(restaurants) {
    restaurants = restaurants.map((resto)=>
    `${resto.id} - ${resto.name.toUpperCase()} :
    Cost For Two: ${resto.currency} ${resto.average_cost_for_two}
    User Rating: ${resto.user_rating.aggregate_rating}
    Cuisine: ${resto.cuisines}
    Photo: ${encodeURIComponent(resto.photos_url)}
    Menu: ${encodeURIComponent(resto.menu_url)}
    Location: ${resto.location.address}
    Open in zomato - ${resto.deeplink}`).join('\n\n');
    res.send(restaurants);
  })
  .catch(function(err) {
    console.error(err);
  });
}

const showResto = (req,res) => {
  zmt.restaurant({
    res_id: req.params.id
  })
  .then(function(resto) {
    resto =
    `${resto.id} - ${resto.name.toUpperCase()} :
    Cost For Two: ${resto.currency} ${resto.average_cost_for_two}
    User Rating: ${resto.user_rating.aggregate_rating}
    Cuisine: ${resto.cuisines}
    Photo: ${encodeURIComponent(resto.photos_url)}
    Menu: ${encodeURIComponent(resto.menu_url)}
    Offers: ${resto.offers.join(',')}
    Has Table Booking : ${resto.has_table_booking}
    Location: ${resto.location.address} (longitude : ${resto.location.longitude} latitude: ${resto.location.latitude})
    Open in zomato - ${resto.deeplink}`
    res.send(resto);
  })
  .catch(function(err) {
    console.error(err);
  });
}


module.exports = {
  searchHelp,
  searchResto,
  showResto
}
