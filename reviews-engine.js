/**
 * Varuna Traders - AI SEO Review Engine
 * Generates natural, authentic, and search-optimized reviews for Google Maps.
 * Ensures variety so that reviews appear organic and distinct for each customer.
 */

const ReviewEngine = (() => {
  // SEO Keyword Clusters for Household & Kitchenware Store
  const keywords = {
    store: [
      "Varuna Traders",
      "this household shop",
      "this neighborhood store",
      "Varuna Traders household store"
    ],
    owner: [
      "The owner personally assisted me and recommended the most durable products",
      "The owner is extremely polite, humble, and guides you to the right item without pushing expensive options",
      "I was impressed by how helpful and knowledgeable the owner is; he personally tests and explains each item",
      "The owner himself takes care of every customer with great patience and genuine care",
      "The owner's personal recommendation saved me money while getting better quality goods",
      "Very friendly owner who treats customers like family and ensures you get exact sizes and items"
    ],
    quality: [
      "Top-notch quality kitchenware and sturdy daily household essentials",
      "Heavy-duty utensils and premium grade plastic containers that last for years",
      "Reliable brand-name and authentic home goods that you can trust",
      "Great build quality on all cookware, buckets, storage racks, and cleaning tools",
      "Everything from kitchen appliances to daily cleaning supplies is thoroughly vetted and top quality"
    ],
    pricing: [
      "Wholesale-like competitive prices with complete transparency",
      "Much better rates than big supermarkets or online delivery apps with instant availability",
      "Fair and honest pricing on all home utility items without any hidden markups",
      "Unbeatable value for money — great discounts and durable household products",
      "Affordable rates for everyday household items, utensils, and bathroom essentials"
    ],
    variety: [
      "You will find virtually every household need under one single roof",
      "Huge collection of stainless steel utensils, non-stick cookware, airtight jars, and mops",
      "Comprehensive stock of kitchen essentials, plastics, electrical basics, and cleaning supplies",
      "Well-organized shop with wide selection of modern kitchenware and traditional home utilities",
      "Impressive range of home improvement, cleaning tools, storage boxes, and daily hardware essentials"
    ],
    experience: [
      "Smooth shopping experience with fast billing and personal attention",
      "Quick checkout, neatly organized racks, and very courteous customer service",
      "A pleasant neighborhood shopping experience you won't get on commercial websites",
      "Conveniently located with hassle-free shopping and direct owner accountability"
    ],
    conclusion: [
      "Highly recommended for anyone looking for reliable household and kitchen supplies!",
      "Must-visit store for all home setup and kitchenware needs. Will definitely come back again!",
      "Hands down the best household shop in the area. 100% recommended!",
      "Truly a 5-star experience! Support local business with such dedicated owners.",
      "Five stars all the way! Best place for home essentials and honest advice."
    ]
  };

  // Pre-configured aspect tags for one-click personalization
  const aspectModifiers = {
    owner: [
      "Special thanks to the owner for taking the time to show all options patiently.",
      "The shop owner's personal guidance makes shopping here so easy and reassuring.",
      "The owner personally helped me pick the right products for my home setup."
    ],
    kitchenware: [
      "The kitchenware and cookware section has phenomenal quality and great variety.",
      "Bought stainless steel utensils and storage jars here — top grade finish and durable.",
      "Their kitchen accessories and utensil collection is the best in this locality."
    ],
    pricing: [
      "Prices are very reasonable and pocket-friendly compared to retail malls.",
      "Got genuine products at honest wholesale rates with great value.",
      "Unbeatable pricing and completely transparent billing."
    ],
    variety: [
      "They have literally every household product you could possibly need.",
      "Wide assortment of plasticware, cleaning equipment, and kitchen tools.",
      "One-stop destination for all home and kitchen necessities."
    ],
    durability: [
      "All products purchased here are sturdy, durable, and long-lasting.",
      "Premium quality materials that withstand heavy daily home use.",
      "Genuine items with high durability at fair rates."
    ]
  };

  function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generates a unique, SEO-friendly 5-star review based on selected aspects.
   * @param {Object} options
   * @param {string[]} options.selectedAspects - Array of aspect keys ('owner', 'pricing', etc.)
   * @param {string} options.storeName - Name of the store
   * @param {string} options.customerCustomInput - Optional custom focus keyword or product
   * @returns {string} Natural review text
   */
  function generateReview(options = {}) {
    const store = options.storeName || "Varuna Traders";
    const aspects = options.selectedAspects || [];
    const customInput = (options.customerCustomInput || "").trim();

    // Opening variations
    const openings = [
      `Had a fantastic shopping experience at ${store}!`,
      `Visited ${store} today for household essentials and was thoroughly impressed.`,
      `${store} is definitely our go-to neighborhood store for all home and kitchen needs!`,
      `Such a wonderful local household shop! ${store} never disappoints.`,
      `Found everything I needed for my home in one single visit at ${store}.`,
      `Exceptional service and product quality at ${store}.`,
      `If you need kitchenware or home goods, ${store} is simply the best.`
    ];

    const opening = getRandom(openings);
    const ownerLine = getRandom(keywords.owner);
    const qualityLine = getRandom(keywords.quality);
    const priceLine = getRandom(keywords.pricing);
    const varietyLine = getRandom(keywords.variety);
    const conclusion = getRandom(keywords.conclusion);

    let middleClauses = [];

    // Aspect-driven inclusions
    if (aspects.includes("owner")) {
      middleClauses.push(getRandom(aspectModifiers.owner));
    } else {
      middleClauses.push(ownerLine);
    }

    if (aspects.includes("kitchenware")) {
      middleClauses.push(getRandom(aspectModifiers.kitchenware));
    } else if (aspects.includes("variety")) {
      middleClauses.push(varietyLine);
    } else {
      middleClauses.push(qualityLine);
    }

    if (aspects.includes("pricing")) {
      middleClauses.push(getRandom(aspectModifiers.pricing));
    } else if (aspects.includes("durability")) {
      middleClauses.push(getRandom(aspectModifiers.durability));
    } else {
      middleClauses.push(priceLine);
    }

    // Custom product mention if provided by customer
    let customClause = "";
    if (customInput) {
      customClause = ` Particularly happy with the quality of ${customInput} I purchased here.`;
    }

    // Structure randomized assembly for organic diversity
    const templates = [
      `${opening} ${middleClauses[0]}. ${middleClauses[1]}.${customClause} ${middleClauses[2]}. ${conclusion}`,
      `${opening} ${middleClauses[1]}. ${middleClauses[0]}.${customClause} ${conclusion}`,
      `${opening} What stands out most is that ${middleClauses[0].toLowerCase().startsWith("the") ? middleClauses[0] : "the owner is so helpful"}. ${middleClauses[2]}.${customClause} ${conclusion}`,
      `A true 5-star household store! ${middleClauses[0]}. ${middleClauses[1]}.${customClause} ${middleClauses[2]}. ${conclusion}`
    ];

    let result = getRandom(templates);
    // Clean up double spaces or accidental punctuation artifacts
    result = result.replace(/\s+/g, " ").replace(/\.\./g, ".").trim();
    return result;
  }

  /**
   * Optional Gemini API integration if user configures their API key
   */
  async function generateWithGemini(apiKey, storeName, aspects, customInput) {
    if (!apiKey) {
      return generateReview({ storeName, selectedAspects: aspects, customerCustomInput: customInput });
    }

    const prompt = `Write a genuine, natural, warm 5-star customer review for "${storeName}", a local household and kitchenware retail shop where the owner personally serves customers.
Key highlights: ${aspects.join(", ") || "owner personal assistance, durable products, fair prices"}.
${customInput ? `Product purchased: ${customInput}.` : ""}
Requirements:
- Sound like a real, happy local customer writing on Google Maps.
- Keep it concise (3 to 4 sentences).
- Naturally include SEO terms like household shop, kitchenware, owner service, fair pricing.
- Do not use hashtags or quotes. Return only the review text.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return text ? text.trim() : generateReview({ storeName, selectedAspects: aspects, customerCustomInput: customInput });
    } catch (err) {
      console.warn("Gemini API generation failed, falling back to local SEO generator:", err);
      return generateReview({ storeName, selectedAspects: aspects, customerCustomInput: customInput });
    }
  }

  return {
    generateReview,
    generateWithGemini
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = ReviewEngine;
}
