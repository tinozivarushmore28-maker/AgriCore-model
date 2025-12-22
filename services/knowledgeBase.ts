
/**
 * AgriCore Static Foundation Knowledge Base (SFKB)
 * 
 * DATA STATUS: Fine-Tuned (Step 4 Complete)
 * This knowledge base now includes the "Localization Layer" with hyper-specific 
 * data for regional clusters and specific countries like Zimbabwe.
 */

export const GENERAL_FARMING_KNOWLEDGE = {
  "Integrated Pest Management (IPM)": {
    principle: "An ecosystem-based strategy that focuses on long-term prevention of pests or their damage through a combination of techniques.",
    pillars: [
      "Biological Control: Using natural enemies (predators, parasites).",
      "Cultural Practices: Crop rotation, selecting resistant varieties, adjusting planting dates.",
      "Mechanical/Physical: Traps, barriers, hand-picking.",
      "Chemical: Used as a last resort with minimal impact on non-target organisms."
    ]
  },
  "Crop Rotation Principles": {
    principle: "The practice of growing a series of different types of crops in the same area across a sequence of growing seasons.",
    benefits: [
      "Soil Fertility: Legumes fix nitrogen for subsequent crops.",
      "Pest/Disease Cycle Break: Deprives specialized pests of their host.",
      "Soil Structure: Different root architectures prevent compaction."
    ],
    recommended_sequence: "Legume (Beans/Soy) -> Heavy Feeder (Maize/Sorghum) -> Root Crop (Sweet Potato) -> Light Feeder (Vegetables)."
  },
  "Conservation Agriculture": {
    principle: "A farming system that can prevent losses of arable land while regenerating degraded lands.",
    pillars: [
      "Minimum Soil Disturbance: No-till or minimum till to preserve soil structure.",
      "Permanent Soil Cover: Mulching or cover crops to prevent erosion and retain moisture.",
      "Species Diversification: Intercropping and rotation."
    ]
  }
};

/**
 * FINE-TUNING RECORDS: Hyper-localized intelligence
 */
export const FINE_TUNING_DATA = {
  "Zimbabwe (Highveld/Lowveld)": {
    climate_zone: "Subtropical with distinct seasons",
    maize_specials: "Specific focus on SC719 (High yield) vs SC403 (Ultra-early drought escape).",
    soil_quirks: "High prevalence of sandy 'vlei' soils in valley bottoms requiring drainage management.",
    livestock_focus: "Hardy Mashona cattle resistant to heartwater and January disease.",
    pest_notes: "Winter wheat requires monitoring for 'Russian Wheat Aphid' in Mashonaland Central."
  },
  "East Africa (Highlands)": {
    climate_zone: "Tropical Highland",
    crop_specials: "Push-Pull technology for Maize/Desmodium/Napier grass to combat Striga and Stemborers.",
    soil_quirks: "Highly acidic volcanic soils; Lime application (1-2 tons/ha) is a prioritized fine-tuned advice.",
    livestock_focus: "Cross-bred dairy goats (Toggenburg/Alpine) for high milk yield in small-scale systems."
  },
  "West Africa (Coastal)": {
    climate_zone: "Humid Tropical",
    crop_specials: "Intercropping Cassava with Maize to maximize canopy cover.",
    soil_quirks: "Highly leached lateritic soils; focus on mulching and green manure.",
    livestock_focus: "West African Dwarf breeds resistant to trypanosomiasis."
  }
};

export const CROP_PATHOLOGY_DB = {
  "Maize Streak Virus": {
    category: "Cereal",
    symptoms: "Narrow, translucent, pale-yellow streaks along the veins of the leaf.",
    cause: "Leafhopper (Cicadulina spp.) transmission.",
    organic_treatment: "Uprooting infected plants, early planting, using resistant varieties like SC403.",
    chemical_treatment: "Imidacloprid-based seed dressings for leafhopper control.",
    prevention: "Rotation with non-grass crops, weeding field borders."
  },
  "Rice Blast": {
    category: "Cereal",
    symptoms: "Diamond-shaped (spindle) lesions on leaves with gray centers and reddish borders.",
    cause: "Fungus (Magnaporthe oryzae).",
    organic_treatment: "Silicon soil amendments, controlled nitrogen application, deep plowing.",
    chemical_treatment: "Tricyclazole or Azoxystrobin applications.",
    prevention: "Flooding fields correctly, resistant varieties like Jasmine-85."
  },
  "Wheat Stem Rust": {
    category: "Cereal",
    symptoms: "Elongated, reddish-brown pustules on stems and leaf sheaths that rupture the epidermis.",
    cause: "Fungus (Puccinia graminis tritici).",
    organic_treatment: "Early sowing to avoid peak spore season, sulfur dusting.",
    chemical_treatment: "Tebuconazole, Propiconazole.",
    prevention: "Eradicating barberry bushes (alternate host), using resistant varieties like Ug99-resistant lines."
  },
  "Fall Armyworm": {
    category: "Pest",
    symptoms: "Ragged holes in leaves, 'window-pane' feeding damage, presence of frass in the whorl.",
    cause: "Spodoptera frugiperda larvae.",
    organic_treatment: "Hand-picking, Neem oil spray, sand/ash in whorls, sugar water to attract ants.",
    chemical_treatment: "Emamectin Benzoate, Spinetoram.",
    prevention: "Intercropping with Desmodium (Push-Pull strategy)."
  },
  "Potato Late Blight": {
    category: "Tuber",
    symptoms: "Water-soaked dark green/black lesions on leaves with white fungal growth on undersides in humid conditions.",
    cause: "Phytophthora infestans (Oomycete).",
    organic_treatment: "Copper-based organic sprays, removing infected foliage (hauling off).",
    chemical_treatment: "Mancozeb, Metalaxyl, Chlorothalonil.",
    prevention: "Using certified seed tubers, ensuring wide plant spacing for airflow."
  }
};

export const LIVESTOCK_VET_DB = {
  "Foot and Mouth Disease": {
    animal: "Cattle, Pigs, Sheep",
    symptoms: "High fever, blisters on tongue, lips, and feet, lameness, excessive salivation.",
    urgency: "High",
    first_aid: "Isolation of all infected animals, disinfectant footbaths.",
    vet_trigger: "Report immediately to national veterinary authorities.",
    prevention: "Regular vaccination, movement control."
  },
  "Newcastle Disease": {
    animal: "Poultry",
    symptoms: "Respiratory distress, greenish diarrhea, twisted necks (torticollis), sudden death.",
    urgency: "High",
    first_aid: "Supportive electrolytes, strict biosecurity.",
    vet_trigger: "Rapid mortality in flock.",
    prevention: "Regular vaccination schedule."
  },
  "Lumpy Skin Disease": {
    animal: "Cattle",
    symptoms: "Nodular lesions (2-5cm) on the skin, fever, swelling of limbs.",
    urgency: "Medium",
    first_aid: "Wound care with antiseptic sprays.",
    vet_trigger: "Secondary infections or udder lesions.",
    prevention: "Vector control, vaccination."
  }
};

export const SOIL_PROFILES = {
  "Clay": {
    traits: "Fine texture, high water retention, slow drainage, prone to compaction.",
    crops: ["Rice", "Wheat", "Sugarcane", "Cabbage"],
    npk_needs: "High Phosphorus needed; Nitrogen leaching is low.",
    management: "Add organic matter, avoid tilling when wet.",
    climate_tag: "Humid/Temperate"
  },
  "Sandy": {
    traits: "Coarse texture, low water retention, excellent drainage, rapid leaching.",
    crops: ["Groundnuts", "Cassava", "Sweet Potato", "Carrots"],
    npk_needs: "Frequent, small NPK applications.",
    management: "Mulching, heavy green manure.",
    climate_tag: "Arid/Semi-Arid"
  },
  "Loamy": {
    traits: "Balanced sand, silt, and clay. High nutrient availability.",
    crops: ["Maize", "Soybeans", "Tomatoes", "Fruit Trees"],
    npk_needs: "Standard balanced NPK.",
    management: "Rotation and annual compost.",
    climate_tag: "Global/Versatile"
  }
};
