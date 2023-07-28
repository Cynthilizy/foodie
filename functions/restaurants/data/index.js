const lagos = require("./lagosRestaurants");

module.exports.data = {
  "6.465422,3.406448": lagos,
};

const dataImages = [
  "https://cdn.theculturetrip.com/wp-content/uploads/2017/09/djrthdbx0aaendp-1024x561.jpg",
  "https://cdn.usarestaurants.info/assets/uploads/b3260162e9412d1d66922244fd979844_-united-states-new-jersey-somerset-county-franklin-township-221895-asanka-delight-african-cuisinehtm.jpg",
  "https://duyt4h9nfnj50.cloudfront.net/resized/1c47bc6176d1815c75d36ad298e12ef3-w750-13.jpg",
  "https://i.pinimg.com/736x/6c/c5/a6/6cc5a63885bede80542d06700ec7e755--african-recipes-ghana-liberian-food.jpg",
  "https://i.pinimg.com/originals/0d/72/93/0d729323c27b2bb355901692a1cd186f.jpg",
  "https://dnbstories.com/wp-content/uploads/2021/05/pounded-yam-and-soup.jpg",
];

module.exports.addDataImage = (restaurant, index) => {
  // Assign the image to the restaurant based on the index
  const imageIndex = index % dataImages.length;
  restaurant.photos = [dataImages[imageIndex]];
  return restaurant;
};
