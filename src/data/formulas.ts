export interface FormulaCard {
  id: string;
  title: string;
  definition: string;
  formula: string;
  variables: Record<string, string>;
  units: Record<string, string>;
  important_notes: string[];
  common_mistakes: string[];
  example: string;
  difficulty: "Easy" | "Moderate" | "Advanced";
  exam_relevance: string[];
  status: {
    not_seen: boolean;
    memorized: boolean;
    bookmarked: boolean;
    need_revision: boolean;
  };
}

export interface TopicData {
  total_cards: number;
  cards: FormulaCard[];
}

export interface ChapterData {
  topics: Record<string, TopicData>;
}

export interface SubjectData {
  chapters: Record<string, ChapterData>;
}

export const formulasData: Record<string, SubjectData> = {
  Physics: {
    chapters: {
      "Current Electricity": {
        topics: {
          "Electric Current": {
            total_cards: 6,
            cards: [
              {
                id: "CE-EC-01",
                title: "Electric Current Definition",
                definition: "Electric current is the rate of flow of charge through a cross-section.",
                formula: "I = \\frac{dQ}{dt}",
                variables: {
                  I: "Electric current (Ampere)",
                  Q: "Charge (Coulomb)",
                  t: "Time (second)",
                },
                units: {
                  I: "Ampere (A)",
                  Q: "Coulomb (C)",
                  t: "Second (s)",
                },
                important_notes: [
                  "1 Ampere = 1 Coulomb/second",
                  "Current direction is opposite to electron flow",
                ],
                common_mistakes: ["Confusing electron flow with conventional current"],
                example: "If 10 C charge flows in 2 s, current = 5 A",
                difficulty: "Easy",
                exam_relevance: ["JEE Main", "JEE Advanced", "MHT-CET", "WBJEE"],
                status: {
                  not_seen: true,
                  memorized: false,
                  bookmarked: false,
                  need_revision: false,
                },
              },
              {
                id: "CE-EC-02",
                title: "Drift Velocity",
                definition: "The average velocity with which free electrons drift towards the positive terminal under the influence of an external electric field.",
                formula: "v_d = \\frac{eE}{m}\\tau",
                variables: {
                  v_d: "Drift velocity",
                  e: "Charge of an electron",
                  E: "Electric field",
                  m: "Mass of an electron",
                  "\\tau": "Relaxation time",
                },
                units: {
                  v_d: "m/s",
                  E: "V/m",
                  "\\tau": "s",
                },
                important_notes: [
                  "Drift velocity is very small (order of 10^-4 m/s)",
                  "It is directly proportional to the electric field",
                ],
                common_mistakes: ["Assuming drift velocity is the speed of electric signal (which is speed of light)"],
                example: "If E = 10 V/m and \\tau = 10^-14 s, calculate v_d.",
                difficulty: "Moderate",
                exam_relevance: ["JEE Main", "JEE Advanced", "NEET"],
                status: {
                  not_seen: true,
                  memorized: false,
                  bookmarked: false,
                  need_revision: false,
                },
              },
            ],
          },
          "Resistance and Resistivity": {
            total_cards: 5,
            cards: [
              {
                id: "CE-RR-01",
                title: "Ohm's Law",
                definition: "The current flowing through a conductor is directly proportional to the potential difference applied across its ends, provided temperature and other physical conditions remain constant.",
                formula: "V = IR",
                variables: {
                  V: "Potential difference",
                  I: "Electric current",
                  R: "Resistance",
                },
                units: {
                  V: "Volt (V)",
                  I: "Ampere (A)",
                  R: "Ohm (\\Omega)",
                },
                important_notes: [
                  "Ohm's law is not a universal law (non-ohmic devices exist)",
                  "V-I graph for ohmic conductors is a straight line passing through origin",
                ],
                common_mistakes: ["Applying Ohm's law to semiconductors or discharge tubes"],
                example: "If V = 10 V and R = 2 \\Omega, then I = 5 A",
                difficulty: "Easy",
                exam_relevance: ["JEE Main", "NEET", "Boards"],
                status: {
                  not_seen: true,
                  memorized: false,
                  bookmarked: false,
                  need_revision: false,
                },
              },
            ],
          },
        },
      },
      "Semiconductors": {
        topics: {
          "Intrinsic Semiconductors": {
            total_cards: 4,
            cards: []
          }
        }
      },
      "Alternating Current": {
        topics: {
          "AC Voltage Applied to a Resistor": {
            total_cards: 3,
            cards: []
          }
        }
      },
      "Rotational Motion": {
        topics: {
          "Moment of Inertia": {
            total_cards: 8,
            cards: []
          }
        }
      }
    },
  },
  Chemistry: {
    chapters: {
      "p Block Elements (Group 13 & 14)": {
        topics: {
          "General Properties": {
            total_cards: 5,
            cards: []
          }
        }
      },
      "Electrochemistry": {
        topics: {
          "Nernst Equation": {
            total_cards: 6,
            cards: []
          }
        }
      }
    }
  },
  Mathematics: {
    chapters: {
      "Calculus": {
        topics: {
          "Limits": {
            total_cards: 10,
            cards: []
          }
        }
      }
    }
  }
};
