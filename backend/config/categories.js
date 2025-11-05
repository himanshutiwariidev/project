// central source of truth
module.exports.CATEGORY_MAP = {
  men: [
    "regular-tshirt",
    "oversize-tshirt",
    "jin-tshirt",
    "polo-tshirt",
    "formal-shirt",
    "regular-shirt",
    "jeans",
    "joggers",
    "shorts",
    "sweat-shirt",
    "jacket",
    "hoodies",
  ],
  women: [
    "regular-tshirt",
    "polo-tshirt",
    "oversize-tshirt",
    "jeans",
    "jackets",
    "hoodies",
    "sweat-shirt",
  ],
  customize: [
    "hoodies",
    "sweatshirt",
    "regular-tshirt",
    "oversize-tshirt",
    "polo-tshirt",
    "regular-coupletshirt",
    "oversize-coupletshirt",
    "couple-hoodies",
  ],
};

module.exports.ALL_CATEGORIES = Object.keys(module.exports.CATEGORY_MAP);
