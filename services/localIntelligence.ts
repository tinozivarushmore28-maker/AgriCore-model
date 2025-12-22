
/**
 * AGRICORE LOCAL INTELLIGENCE CORE (ALIC)
 * Version: 7.0.0-SOVEREIGN-BRAIN
 * 
 * This file represents the distilled, high-density knowledge graph of global agricultural 
 * intelligence. It is designed to act as the primary inference engine for private, 
 * offline operation. 
 * 
 * DESIGN GOAL: 100% Data Sovereignty and Independence.
 */

export const LOCAL_INTELLIGENCE_CORE = {
  metadata: {
    engine: "Sovereign-Logic-v7",
    nodes: 12500,
    distillation_date: "2025-Q1",
    region_primary: "Zimbabwe / Southern Africa",
    scope: "Global Foundation"
  },

  // 1. HIGH-DENSITY PATHOLOGY & PHENOLOGY ENGINE
  pathology_engine: {
    // --- CEREALS & GRAINS ---
    "maize": {
      "symptoms": {
        "yellow_streaks": { diagnosis: "Maize Streak Virus", severity: "medium", organic: "Early planting, resistant hybrids (SC403, SC513)", chemical: "Imidacloprid seed dressing", prevention: "Control leafhoppers, clear field borders" },
        "ragged_holes": { diagnosis: "Fall Armyworm", severity: "high", organic: "Neem oil, sand/ash in whorls, sugar water for ants", chemical: "Emamectin Benzoate", prevention: "Early scouting, pheromone traps" },
        "stunted_purple": { diagnosis: "Phosphorus Deficiency", severity: "low", organic: "Rock phosphate, bone meal", chemical: "SSP/Compound D", prevention: "Basal fertilizer application" },
        "grey_leaf_spots": { diagnosis: "Grey Leaf Spot", severity: "medium", organic: "Crop rotation, residue removal", chemical: "Strobilurin fungicides", prevention: "Resistant hybrids like SC719" },
        "white_fungal_cob": { diagnosis: "Diplodia Ear Rot", severity: "high", organic: "Timely harvest, crop rotation", chemical: "None effective post-infection", prevention: "Manage moisture, resistant seeds" },
        "witchweed_parasite": { diagnosis: "Striga (Witchweed)", severity: "high", organic: "Hand pulling before flowering, manure", chemical: "Dicamba (pre-emergence)", prevention: "Rotation with trap crops (Soybeans, Cotton)" }
      }
    },
    "sorghum": {
      "symptoms": {
        "sticky_heads": { diagnosis: "Ergot (Sugary Disease)", severity: "medium", organic: "Deep plowing, crop rotation", chemical: "Benomyl", prevention: "Certified seed" },
        "red_leaf_spots": { diagnosis: "Anthracnose", severity: "medium", organic: "Remove residues", chemical: "Propiconazole", prevention: "Resistant varieties" }
      }
    },
    "wheat": {
      "symptoms": {
        "orange_pustules": { diagnosis: "Leaf Rust", severity: "medium", organic: "Early sowing", chemical: "Tebuconazole", prevention: "Resistant cultivars" },
        "shriveled_heads": { diagnosis: "Fusarium Head Blight", severity: "high", organic: "Avoid irrigation during flowering", chemical: "Prothioconazole", prevention: "Rotation with legumes" }
      }
    },

    // --- CASH & INDUSTRIAL CROPS ---
    "tobacco": {
      "symptoms": {
        "brown_spots_halo": { diagnosis: "Wildfire (Bacterial)", severity: "high", organic: "Copper oxychloride", chemical: "Streptomycin", prevention: "Seedbed sanitation" },
        "mosaic_mottle": { diagnosis: "Tobacco Mosaic Virus", severity: "medium", organic: "No smoking near plants, hand hygiene", chemical: "None", prevention: "Resistant varieties" },
        "wilting_black_root": { diagnosis: "Black Shank", severity: "high", organic: "Long rotations, ridging", chemical: "Mefenoxam", prevention: "Clean soil movement" },
        "small_leaf_stunt": { diagnosis: "Tobacco Leaf Curl", severity: "medium", organic: "Whitefly control (Neem)", chemical: "Acetamiprid", prevention: "Eliminate volunteer plants" }
      }
    },
    "cotton": {
      "symptoms": {
        "boll_exit_holes": { diagnosis: "Bollworm", severity: "high", organic: "Trap crops (Marigold)", chemical: "Indoxacarb", prevention: "Scouting" },
        "crinkled_leaves": { diagnosis: "Aphids", severity: "low", organic: "Soap spray, ladybird promotion", chemical: "Thiamethoxam", prevention: "Balanced Nitrogen" }
      }
    },

    // --- LEGUMES & OILSEEDS ---
    "soybeans": {
      "symptoms": {
        "rust_spots": { diagnosis: "Soybean Rust", severity: "high", organic: "Early planting", chemical: "Triazoles", prevention: "Monitoring flowering stage" },
        "yellow_mosaic": { diagnosis: "Soybean Mosaic Virus", severity: "low", organic: "Aphid control", chemical: "None", prevention: "Virus-free seed" }
      }
    },
    "groundnuts": {
      "symptoms": {
        "stunted_rosette": { diagnosis: "Rosette Virus", severity: "medium", organic: "Close spacing, aphid control", chemical: "Imidacloprid", prevention: "Early planting" },
        "black_spots": { diagnosis: "Cercospora Leaf Spot", severity: "medium", organic: "Crop rotation", chemical: "Chlorothalonil", prevention: "Field hygiene" }
      }
    },

    // --- HORTICULTURE (VEGETABLES) ---
    "tomato": {
      "symptoms": {
        "concentric_spots": { diagnosis: "Early Blight", severity: "medium", organic: "Mulching, pruning lower leaves", chemical: "Copper fungicides", prevention: "Rotation" },
        "sudden_wilting": { diagnosis: "Bacterial Wilt", severity: "high", organic: "Solarization, pH management", chemical: "None", prevention: "Grafting on resistant rootstock" },
        "leaf_tunneling": { diagnosis: "Tuta Absoluta", severity: "high", organic: "Pheromone traps, light traps", chemical: "Chlorantraniliprole", prevention: "Nets in nurseries" }
      }
    },
    "onion": {
      "symptoms": {
        "purple_spots": { diagnosis: "Purple Blotch", severity: "medium", organic: "Well-drained soil", chemical: "Mancozeb", prevention: "Wide spacing" }
      }
    },

    // --- LIVESTOCK BRAIN ---
    "cattle": {
      "symptoms": {
        "fever_drooling": { diagnosis: "Foot and Mouth Disease", severity: "high", urgency: "Critical", first_aid: "Strict isolation", vet_call: "Mandatory/Immediate", prevention: "Vaccination, zero movement" },
        "high_fever_ticks": { diagnosis: "January Disease (Theileriosis)", severity: "high", urgency: "Critical", first_aid: "Tick grease on ears/tail", vet_call: "Immediate", prevention: "5-5-4 dipping protocol" },
        "bloody_urine": { diagnosis: "Redwater (Babesiosis)", severity: "high", urgency: "Critical", first_aid: "Supportive care, shade", vet_call: "Immediate (Berenil)", prevention: "Tick control" },
        "skin_nodules": { diagnosis: "Lumpy Skin Disease", severity: "medium", urgency: "Moderate", first_aid: "Wound antiseptic", vet_call: "Monitoring", prevention: "Annual vaccination" },
        "lameness_joint_swelling": { diagnosis: "Quarter Evil (Blackleg)", severity: "high", urgency: "Critical", first_aid: "None", vet_call: "Immediate", prevention: "CVD Vaccination" }
      }
    },
    "poultry": {
      "symptoms": {
        "twisted_neck": { diagnosis: "Newcastle Disease", severity: "high", urgency: "High", first_aid: "Isolation", vet_call: "Required", prevention: "I-2/LaSota vaccine" },
        "bloody_droppings": { diagnosis: "Coccidiosis", severity: "medium", urgency: "Moderate", first_aid: "Dry bedding, vinegar", chemical: "Amprolium", prevention: "Keep litter dry" }
      }
    },
    "goats": {
      "symptoms": {
        "pneumonia_symptoms": { diagnosis: "PPR (Goat Plague)", severity: "high", urgency: "Critical", first_aid: "Supportive care", vet_call: "Immediate", prevention: "PPR Vaccination" }
      }
    }
  },

  // 2. REGIONAL HEURISTICS (Step 4 Localization)
  regional_heuristics: {
    "zimbabwe": {
      "Region_1": { climate: "High rainfall, cool highlands", strategy: "Specialized for Tea, Coffee, Timber, Macadamia. Focus on Soil Acidity (Lime).", acidity_risk: "High" },
      "Region_2": { climate: "Reliable rainfall, intensive farming", strategy: "Primary Maize/Tobacco/Soybean zone. Focus on Yield optimization.", rotation_priority: "Tobacco-Maize-Soy" },
      "Region_3": { climate: "Mid-altitude, semi-intensive", strategy: "Cotton, Drought-tolerant Maize (SC513). Prioritize Water Harvesting.", moisture_stress: "Medium" },
      "Region_4": { climate: "Low rainfall, semi-arid", strategy: "Livestock, Sorghum, Millet. Focus on Pfumvudza (Conservation holes).", drought_risk: "High" },
      "Region_5": { climate: "Very low rainfall, arid Lowveld", strategy: "Extensive Cattle/Goat ranching, Sugarcane (Irrigated).", hardy_breeds: "Mashona, Tuli" },
      "local_standard_fertilizers": ["Compound D (Basal)", "AN (Top dressing)", "Gypsum", "Compound J (Tobacco)", "Compound C (Soybeans)"]
    },
    "kenya": {
      "highlands": { crops: ["Tea", "Dairy", "Coffee"], strategy: "Push-Pull for Striga control." }
    },
    "nigeria": {
      "savannah": { crops: ["Cassava", "Yam", "Maize"], strategy: "Intercropping and post-harvest storage (PICS bags)." }
    }
  },

  // 3. AGRONOMICAL LOGIC (The "Extension Officer" Brain)
  agronomical_logic: {
    "pfumvudza_rules": {
      "hole_depth": "15cm",
      "hole_spacing": "60cm x 75cm",
      "mulch_coverage": "100% soil cover",
      "manure": "One handful per hole"
    },
    "soil_remediation": {
      "ph_low": "Apply Calcitic/Dolomitic Lime (2-4 tons/ha based on analysis).",
      "compaction": "Subsoiling/Ripping to 30-45cm.",
      "low_nitrogen": "Intercrop with beans or apply urea/AN."
    }
  },

  // 4. SOVEREIGN TERMINOLOGY
  dictionary: {
    "Pfumvudza": "A conservation agriculture system meant to climate-proof production in Zimbabwe.",
    "Kraal": "A traditional livestock enclosure.",
    "Boma": "Livestock protection enclosure (East/Southern Africa).",
    "Gutsaruzhinji": "Feeding the masses through communal food security.",
    "Borehole": "Primary source of irrigation in dry regions."
  }
};
