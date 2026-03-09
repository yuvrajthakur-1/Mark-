import { Chapter, ExamType, SubjectType } from '../components/TestEngine/types';

export const syllabusData: Record<ExamType, Record<SubjectType, string[]> | Partial<Record<SubjectType, string[]>>> = {
  'JEE Main': {
    Physics: [
      'Units & Measurements', 'Kinematics', 'Laws of Motion', 'Work, Energy & Power',
      'Rotational Motion', 'Gravitation', 'Properties of Solids & Liquids', 'Thermodynamics',
      'Kinetic Theory of Gases', 'Oscillations', 'Waves', 'Electrostatics', 'Capacitors',
      'Current Electricity', 'Magnetic Effects of Current', 'Magnetism & Matter',
      'Electromagnetic Induction', 'Alternating Current', 'Electromagnetic Waves',
      'Ray Optics', 'Wave Optics', 'Dual Nature of Radiation & Matter', 'Atoms', 'Nuclei',
      'Semiconductor Electronics', 'Experimental Skills'
    ],
    Chemistry: [
      'Some Basic Concepts of Chemistry', 'Atomic Structure', 'Chemical Bonding & Molecular Structure',
      'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions', 'Solutions',
      'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'Classification of Elements & Periodicity',
      'Hydrogen', 's-Block Elements', 'p-Block Elements', 'd- & f-Block Elements', 'Coordination Compounds',
      'Environmental Chemistry', 'General Principles of Metallurgy', 'General Organic Chemistry',
      'Hydrocarbons', 'Haloalkanes & Haloarenes', 'Alcohols, Phenols & Ethers', 'Aldehydes, Ketones & Carboxylic Acids',
      'Amines', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life'
    ],
    Mathematics: [
      'Sets', 'Relations & Functions', 'Complex Numbers', 'Quadratic Equations', 'Matrices',
      'Determinants', 'Permutations & Combinations', 'Binomial Theorem', 'Sequences & Series',
      'Limits', 'Continuity & Differentiability', 'Applications of Derivatives', 'Indefinite Integrals',
      'Definite Integrals', 'Differential Equations', 'Coordinate Geometry', 'Three-Dimensional Geometry',
      'Vector Algebra', 'Statistics', 'Probability', 'Trigonometric Functions', 'Inverse Trigonometric Functions'
    ]
  },
  'JEE Advanced': {
    Physics: [
      'Mechanics', 'Fluid Mechanics', 'Elasticity', 'Thermodynamics', 'Kinetic Theory',
      'Oscillations & Waves', 'Electrostatics', 'Current Electricity', 'Magnetostatics',
      'EMI & AC', 'Optics', 'Modern Physics', 'Experimental Physics'
    ],
    Chemistry: [
      'Physical Chemistry', 'Inorganic Chemistry', 'Organic Chemistry'
    ],
    Mathematics: [
      'Algebra', 'Trigonometry', 'Analytical Geometry (2D & 3D)', 'Differential Calculus',
      'Integral Calculus', 'Differential Equations', 'Probability'
    ]
  },
  'BITSAT': {
    Physics: [
      'Units & Measurement', 'Laws of Motion', 'Work & Energy', 'Rotational Motion',
      'Gravitation', 'Thermodynamics', 'Oscillations & Waves', 'Electrostatics',
      'Current Electricity', 'Magnetism', 'EMI & AC', 'Optics', 'Modern Physics'
    ],
    Chemistry: [
      'Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium',
      'Electrochemistry', 'Chemical Kinetics', 'Organic Chemistry', 'Inorganic Chemistry'
    ],
    Mathematics: [
      'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Calculus', 'Vectors', 'Probability'
    ],
    'English Proficiency': [
      'Grammar', 'Vocabulary', 'Reading Comprehension'
    ],
    'Logical Reasoning': [
      'Verbal Reasoning', 'Non-Verbal Reasoning', 'Logical Sequences', 'Puzzle Tests'
    ]
  },
  'MHT-CET': {
    Physics: [
      'Motion', 'Laws of Motion', 'Gravitation', 'Thermal Properties', 'Waves',
      'Electrostatics', 'Current Electricity', 'Magnetism', 'Optics', 'Modern Physics'
    ],
    Chemistry: [
      'Some Basic Concepts', 'Structure of Atom', 'Chemical Bonding', 'Thermodynamics',
      'Electrochemistry', 'Organic Chemistry', 'Inorganic Chemistry'
    ],
    Mathematics: [
      'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Calculus', 'Probability', 'Vectors'
    ]
  },
  'NDA': {
    Mathematics: [
      'Algebra', 'Matrices & Determinants', 'Trigonometry', 'Analytical Geometry',
      'Differential Calculus', 'Integral Calculus', 'Differential Equations',
      'Vector Algebra', 'Statistics', 'Probability'
    ],
    'General Ability Test': [
      'English', 'General Knowledge'
    ]
  },
  'VITEEE': {
    Physics: [
      'Mechanics', 'Heat & Thermodynamics', 'Oscillations & Waves', 'Electrostatics',
      'Magnetism', 'Optics', 'Modern Physics'
    ],
    Chemistry: [
      'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'
    ],
    Mathematics: [
      'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Calculus', 'Vectors'
    ],
    Biology: [
      'Taxonomy', 'Cell and Molecular Biology', 'Reproduction', 'Genetics and Evolution',
      'Human Health and Diseases', 'Plant Physiology', 'Human Physiology'
    ],
    English: [
      'Grammar', 'Comprehension'
    ],
    Aptitude: [
      'Data Interpretation', 'Logical Thinking', 'Quantitative Ability'
    ]
  },
  'WBJEE': {
    Physics: [
      'Mechanics', 'Thermodynamics', 'Waves', 'Electricity', 'Magnetism', 'Optics', 'Modern Physics'
    ],
    Chemistry: [
      'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'
    ],
    Mathematics: [
      'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Calculus', 'Probability'
    ]
  },
  'KCET': {
    Physics: [
      'Motion', 'Laws of Motion', 'Gravitation', 'Thermodynamics', 'Electricity',
      'Magnetism', 'Optics', 'Modern Physics'
    ],
    Chemistry: [
      'Atomic Structure', 'Bonding', 'Thermodynamics', 'Equilibrium', 'Organic Chemistry', 'Inorganic Chemistry'
    ],
    Mathematics: [
      'Algebra', 'Trigonometry', 'Calculus', 'Coordinate Geometry', 'Probability'
    ],
    Biology: [
      'Diversity in Living World', 'Structural Organization in Animals and Plants',
      'Cell Structure and Function', 'Plant Physiology', 'Human Physiology'
    ]
  },
  'NEST': {
    Physics: [
      'Mechanics', 'Electricity & Magnetism', 'Thermodynamics', 'Modern Physics'
    ],
    Chemistry: [
      'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'
    ],
    Mathematics: [
      'Algebra', 'Calculus', 'Coordinate Geometry', 'Probability'
    ],
    Biology: [
      'Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Plant Physiology', 'Human Physiology'
    ]
  },
  'COMEDK': {
    Physics: [
      'Mechanics', 'Thermodynamics', 'Electricity', 'Magnetism', 'Optics', 'Modern Physics'
    ],
    Chemistry: [
      'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'
    ],
    Mathematics: [
      'Algebra', 'Trigonometry', 'Calculus', 'Coordinate Geometry', 'Probability'
    ]
  }
};

export const getChaptersForExam = (exam: ExamType): Chapter[] => {
  const examData = syllabusData[exam];
  if (!examData) return [];

  const chapters: Chapter[] = [];
  let idCounter = 1;

  Object.entries(examData).forEach(([subject, subjectChapters]) => {
    (subjectChapters as string[]).forEach((chapterName) => {
      chapters.push({
        id: `${exam.replace(/\s+/g, '')}-${subject}-${idCounter++}`,
        name: chapterName,
        subject: subject as SubjectType,
      });
    });
  });

  return chapters;
};
