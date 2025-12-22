
import { RegionalData } from "../types";

/**
 * REGIONAL DATABASE (Step 2: Cleaned & Normalized)
 * Data tagged by region and climate zone.
 */
export const regionalDatabase: RegionalData[] = [
  {
    region: "Southern Africa (ZWE, ZAM, SA)",
    crops: [
      {
        name: "Maize (Resistant SC-Series)",
        climatePerformance: "High performance in summer rainfall areas. Drought-tolerant hybrids available (SC403, SC513).",
        needs: "Rich nitrogen soil, consistent moisture during tasseling.",
        commonIssues: ["Fall Armyworm", "Maize Streak Virus", "Witchweed (Striga)"]
      },
      {
        name: "Sorghum (Macia Variety)",
        climatePerformance: "Excellent drought tolerance, thrives in Matabeleland and Limpopo regions.",
        needs: "Well-drained soil, low water requirements compared to maize.",
        commonIssues: ["Birds (Quelea)", "Stalk Borer"]
      },
      {
        name: "Groundnuts (Nyanda)",
        climatePerformance: "Prefers sandy soils of the Mashonaland plains.",
        needs: "Gypsum (Calcium) application for pod filling.",
        commonIssues: ["Rosette Virus", "Aflatoxin contamination"]
      }
    ],
    livestock: [
      {
        name: "Mashona Cattle",
        suitability: "Highly adapted to local tick-borne diseases and heat (Sanga type).",
        productivity: "Smaller frame but high fertility and hardy.",
        vulnerabilities: ["Theileriosis (January Disease)", "Lumpy Skin Disease"]
      },
      {
        name: "Boer Goat",
        suitability: "Thrives in bushveld/scrub areas of Zimbabwe and South Africa.",
        productivity: "High meat production, fast growth rate.",
        vulnerabilities: ["Internal parasites in wet seasons"]
      }
    ]
  },
  {
    region: "West Africa (NGA, GHA, CIV)",
    crops: [
      {
        name: "Cocoa (Forastero)",
        climatePerformance: "Thrives in humid forest zones with high rainfall.",
        needs: "Shade trees during early growth, high soil organic matter.",
        commonIssues: ["Black Pod Disease", "Swollen Shoot Virus", "Capsids"]
      },
      {
        name: "Yam (Puna/White Yam)",
        climatePerformance: "Main staple in the Savannah-Forest transition zones.",
        needs: "Mounding/staking, potassium-rich soil for tuber development.",
        commonIssues: ["Yam Mosaic Virus", "Scale Insects"]
      },
      {
        name: "Cassava (TME 419)",
        climatePerformance: "Drought hardy, thrives in sandy-clay soils of Nigeria.",
        needs: "Low inputs, thrives where other crops fail.",
        commonIssues: ["Cassava Mosaic Disease", "Bacterial Blight"]
      }
    ],
    livestock: [
      {
        name: "West African Dwarf Goat",
        suitability: "Highly resistant to Trypanosomiasis (Tsetse fly disease).",
        productivity: "High prolificacy, excellent meat quality.",
        vulnerabilities: ["PPR (Goat Plague)"]
      }
    ]
  },
  {
    region: "East Africa (KEN, ETH, TZA)",
    crops: [
      {
        name: "Arabica Coffee (SL28/SL34)",
        climatePerformance: "High altitude highlands (1500m-2100m).",
        needs: "Acidic volcanic soils, precise pruning.",
        commonIssues: ["Coffee Berry Disease", "Leaf Rust"]
      },
      {
        name: "Teff (Quncho)",
        climatePerformance: "Resilient grain for Ethiopian highlands, varied rainfall.",
        needs: "Fine seedbed preparation, low nitrogen requirement.",
        commonIssues: ["Lodging", "Head Smut"]
      }
    ],
    livestock: [
      {
        name: "Zebu (Boran Cattle)",
        suitability: "Hardy, heat-tolerant beef breed for arid lowlands.",
        productivity: "High meat quality in harsh conditions.",
        vulnerabilities: ["Foot and Mouth", "ECF (East Coast Fever)"]
      }
    ]
  },
  {
    region: "Southeast Asia (VNM, THA, IDN)",
    crops: [
      {
        name: "Jasmine Rice (Khao Dawk Mali)",
        climatePerformance: "Thrives in tropical monsoonal climates of the Mekong Delta.",
        needs: "Flood irrigation, high humidity.",
        commonIssues: ["Rice Blast", "Brown Planthopper", "Stem Borer"]
      },
      {
        name: "Rubber (RRIM 600)",
        climatePerformance: "Prefers high temperatures and even rainfall distributions.",
        needs: "Deep, acidic soil; careful tapping management.",
        commonIssues: ["White Root Disease", "Pink Disease"]
      }
    ],
    livestock: [
      {
        name: "Murrah Buffalo",
        suitability: "Ideal for wet paddy fields and high humidity.",
        productivity: "Draft power, high fat milk.",
        vulnerabilities: ["Foot and Mouth Disease", "Haemorrhagic Septicaemia"]
      }
    ]
  },
  {
    region: "South Asia (IND, PAK, BGD)",
    crops: [
      {
        name: "Basmati Rice (Pusa 1121)",
        climatePerformance: "Grows best in North India/Pakistan plains during the Kharif season.",
        needs: "Careful nitrogen management to prevent lodging.",
        commonIssues: ["Bacterial Leaf Blight", "Neck Blast"]
      },
      {
        name: "Wheat (HD 2967)",
        climatePerformance: "Winter crop (Rabi), prefers cool night temperatures during grain filling.",
        needs: "Timely irrigation, balanced NPK.",
        commonIssues: ["Yellow Rust", "Loose Smut", "Aphids"]
      }
    ],
    livestock: [
      {
        name: "Sahiwal Cattle",
        suitability: "Best dairy breed for tropical climates, heat tolerant.",
        productivity: "High milk yield (2000-2500 kg per lactation).",
        vulnerabilities: ["Mastitis", "Tick-borne diseases"]
      }
    ]
  },
  {
    region: "Latin America (BRA, ARG, COL)",
    crops: [
      {
        name: "Soybean (RR Hybrids)",
        climatePerformance: "Major crop in the Cerrado and Pampas regions.",
        needs: "Rhizobium inoculation for nitrogen fixation.",
        commonIssues: ["Asian Soybean Rust", "Caterpillars", "Nematodes"]
      },
      {
        name: "Coffee (Castillo)",
        climatePerformance: "Mid-altitude Andean volcanic soils.",
        needs: "Regular pruning, high potassium levels.",
        commonIssues: ["La Roya (Rust)", "Coffee Berry Borer"]
      }
    ],
    livestock: [
      {
        name: "Nellore Cattle",
        suitability: "Thrives in the hot, humid regions of Brazil (Zebu type).",
        productivity: "Excellent beef yield, very hardy.",
        vulnerabilities: ["Ectoparasites", "Vampire Bat Rabies"]
      }
    ]
  },
  {
    region: "Europe (FRA, DEU, ESP)",
    crops: [
      {
        name: "Winter Wheat (Apache)",
        climatePerformance: "Temperate maritime and continental climates.",
        needs: "High inputs, precisely timed fungicide applications.",
        commonIssues: ["Septoria Tritici", "Fusarium Head Blight"]
      },
      {
        name: "Vineyard Grapes (Cabernet)",
        climatePerformance: "Warm, dry summers with mild winters.",
        needs: "Well-drained, often stony soils.",
        commonIssues: ["Downy Mildew", "Powdery Mildew", "Phylloxera"]
      }
    ],
    livestock: [
      {
        name: "Holstein Friesian",
        suitability: "High-intensity dairy production in temperate zones.",
        productivity: "Highest milk volume per animal globally.",
        vulnerabilities: ["Lameness", "Metabolic disorders"]
      }
    ]
  },
  {
    region: "North America (USA, CAN)",
    crops: [
      {
        name: "Corn (Yellow Dent)",
        climatePerformance: "Midwest Corn Belt, long warm growing season.",
        needs: "High nitrogen, high organic matter soil.",
        commonIssues: ["Corn Rootworm", "Grey Leaf Spot"]
      },
      {
        name: "Canola (Canola Brassica)",
        climatePerformance: "Cool temperate Canadian prairies.",
        needs: "Sulfur fertilization, precise harvesting timing.",
        commonIssues: ["Blackleg", "Sclerotinia Stem Rot"]
      }
    ],
    livestock: [
      {
        name: "Angus Cattle",
        suitability: "Temperate pasture finishing.",
        productivity: "High-quality marbled beef.",
        vulnerabilities: ["Pinkeye", "Foot Rot"]
      }
    ]
  }
];

export const getRegionNames = () => regionalDatabase.map(d => d.region);
export const getRegionData = (name: string) => regionalDatabase.find(d => d.region === name);
