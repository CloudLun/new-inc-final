let topCircles = [];
let bottomCircles = [];
let connections = [];
let islandConnections = [];
let topColors = [];
let islandCircles = [];

const scaleFactor = 2; // 1 for HD, 2 for 4K; adjust as needed

const rectX = 100 * scaleFactor;
const rectY = 100 * scaleFactor;
const rectW = 1440 * scaleFactor;
const rectH = 340 * scaleFactor;
const titleH = 20 * scaleFactor;

// title image

let titleImages = {};
let currentPhase = 1; // or update dynamically

function preload() {
  titleImages = {
    1: loadImage("title/Opening.png"),
    2: loadImage("title/Chapter 1.png"),
    3: loadImage("title/Chapter 2.png"),
    4: loadImage("title/Chapter 3.png"),
    5: loadImage("title/Chapter 4.png"),
    6: loadImage("title/Closing.png"),
  };
}

// ======= FRAME SETTING SECTION =====
let frameCounter = 0;
const phase1StartFrame = 0;
const phase1EndFrame = 600;

let phase3ColorList = [];

const phase3ShuffleDelay = 1280; // adjust this delay to your needs

const phase2StartFrame = phase1EndFrame + 40;
const phase2EndFrame = phase2StartFrame + 1500;

const phase3StartFrame = phase2EndFrame + 40;
const phase3EndFrame = phase3StartFrame + 1800;

const phase4StartFrame = phase3EndFrame + 40;
const phase4EndFrame = phase4StartFrame + 2000;

const phase5StartFrame = phase4EndFrame + 40;
const phase5TransitionFrame = phase5StartFrame + 60;
const phase5EndFrame = phase5StartFrame + 1500;
const phase5AnimatedFadeStart = phase5EndFrame - 600;
const phase5AnimatedFadeEnd = phase5EndFrame - 60;
const phase6StartFrame = phase5EndFrame + 40;
const phase6ClearStartFrame = phase6StartFrame + 120;
const phase6EndFrame = phase6StartFrame + 3000;

const phaseTitles = {
  phase1:
    "What is lost from these over-simplified racial categories? How are we meant to interpret its inconsistencies? ",
  phase2:
    "Why are the Asian categories based on countries, while black and mixed-black categories are based on blackness?",
  phase3:
    "How can invisible borders determine your identity? Is it possible to disentangle culture and heritage from ethnicity?",
  phase4: "Why are people who aren’t in the States included in the Census?",
  phase5: "What is otherness?",
  phase6: "What does the future hold or what does the future look like?",
};
const phaseQuote = {
  phase1:
    "“With racial statistics, one can ‘quantify’ what one subjectively perceived as a problem to be studied using objective methods. Because such statistics look and sound scientific... great weight is accorded them, even if their import is in fact distorted by subjective predispositions.” Tukufu Zuberi from Thicker than Blood: How Racial Statistics Lie (2001)",
  phase2:
    "“While Blackness is policed through the one-drop rule, making it an essentialized category, Asian Americans are racialized through ethnic and national origin distinctions that produce multiple racialized positions within the same racial group—revealing the unevenness of racial classification in the U.S.” Claire Jean Ki from “The Racial Triangulation of Asian Americans” (1999)",
  phase3:
    "“The panethnic label ‘Hispanic’ elides the complex racial and ethnic diversity within Latino populations, reducing distinct Native American, Black, and European ancestries into a monolithic category that serves bureaucratic convenience more than social reality.” Leah R. Vázquez from “The Discourse of ‘Hispanic’ and the Racialization of Latinos” (2005)",
  phase4:
    "“Census classifications in Oceania are deeply entangled with colonial legacies that sought to map, manage, and control Indigenous populations, transforming living peoples into racialized categories for imperial governance.” Brenda L Croft From “Making Kin: A Feminist Indigenous Approach to Oceania” (2018)",
  phase5:
    "“Census categories such as ‘Other’ reflect the state’s failure to recognize the fluid and hybrid nature of identities, imposing fixed categories that marginalize those who do not fit neatly within official racial taxonomies.” Nina G. Schiller & Ayse Caglar from “Locating Migration: Rescaling Cities and Migrants” (2009)",
  phase6: "  ",
};

const ethnics = [
  "White",
  "Chinese",
  "Japanese",
  "Hindu",
  "Korean",
  "Philippino", 
  "Vietnamese",
  "Asian Indian",
  "Samoan",
  "Guamanian or Chamorro",
  "Guamanian",
  "Part Hawaiian",
  "Hawaiian",
  "Other Asian",
  "Other API",
  "Other Pacific Islander",
  "Other Spanish",
  "Other Spanish or Hispanic",
  "Other Spanish, Hispanic, or Latino",
  "Other",
  "Alaska Native",
  "Eskimo",
  "American Indian",
  "Aleut",
  "Indian",
  "Mexican",
  "Cuban",
  "Puerto Rican",
  "Central or South American",
  "Mexican, Mexican-American, Chicano",
  "Mixed Black",
  "Black",
];

function splitLabel(label) {
  const wrapMap = {
    "White": ["White"],
    "Chinese": ["Chinese"],
    "Japanese": ["Japanese"],
    "Hindu": ["Hindu"],
    "Korean": ["Korean"],
    "Philippino": ["Philippino"], 
    "Vietnamese": ["Vietnamese"],
    "Asian Indian": ["Asian", "Indian"],
    "Samoan": ["Samoan"],
    "Guamanian or Chamorro": ["Guamanian or", "Chamorro"],
    "Guamanian": ["Guamanian"],
    "Part Hawaiian": ["Part", "Hawaiian"],
    "Hawaiian": ["Hawaiian"],
    "Other Asian": ["Other", "Asian"],
    "Other API": ["Other", "API"],
    "Other Pacific Islander": ["Other Pacific", "Islander"],
    "Other Spanish": ["Other", "Spanish"],
    "Other Spanish or Hispanic": ["Other Spanish", "or Hispanic"],
    "Other Spanish, Hispanic, or Latino": ["Other Spanish,", "Hispanic or Latino"],
    "Other": ["Other"],
    "Alaska Native": ["Alaska Native"],
    "Eskimo": ["Eskimo"],
    "American Indian": ["American Indian"],
    "Aleut": ["Aleut"],
    "Indian": ["Indian"],
    "Mexican": ["Mexican"],
    "Cuban": ["Cuban"],
    "Puerto Rican": ["Puerto", "Rican"],
    "Central or South American": ["Central or South", "American"],
    "Mexican, Mexican-American, Chicano": ["Mexican-Am.,", "Mexican, Chicano"],
    "Mixed Black": ["Mixed", "Black"],
    "Black": ["Black"],
  };

  return wrapMap[label] ?? [label]; // fallback to one line if not matched
}

const ethnicColors = {
  White: "#56804d",
  Chinese: "#799ae0",
  Japanese: "#64e8ed",
  Hindu: "#42b7ed",
  Korean: "#5789f2",
  Philippino: "#a6e3f7",
  Vietnamese: "#009dff",
  "Asian Indian": "#478ff5",
  Samoan: "#b694ff",
  "Guamanian or Chamorro": "#9c43e0",
  Guamanian: "#bb77e6",
  "Part Hawaiian": "#bca4db",
  Hawaiian: "#8955cf",
  "Other Asian": "#70c4ff",
  "Other API": "#7086ff",
  "Other Pacific Islander": "#7649f2",
  "Other Spanish": "#828c16",
  "Other Spanish or Hispanic": "#b3ad15",
  "Other Spanish, Hispanic, or Latino": "#d1c32a",
  "Other": "#ff0000",
  "Alaska Native": "#ffc496",
  Eskimo: "#f78025",
  "American Indian": "#eb9e1a",
  Aleut: "#ff6200",
  Indian: "#db8348",
  Mexican: "#f3ff73",
  Cuban: "#e8d900",
  "Puerto Rican": "#cfa81d",
  "Central or South American": "#adb519",
  "Mexican, Mexican-American, Chicano": "#f2e89b",
  "Mixed Black": "#de6f6f",
  Black: "#FFC0CB",
};

const firstGroups = {
  White: [],
  Chinese: [
    1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970,
    1980, 1990, 2000, 2010, 2020,
  ],
  Japanese: [
    1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000,
    2010, 2020,
  ],
  Hindu: [1920, 1930, 1940],
  Korean: [1920, 1930, 1940, 1970, 1980, 1990, 2000, 2010, 2020],
  Philippino: [
    1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020,
  ],
  Vietnamese: [1980, 1990, 2000, 2010, 2020],
  "Asian Indian": [1980, 1990, 2000, 2010, 2020],
  "Guamanian or Chamorro": [2000, 2010, 2020],
  Samoan: [1980, 1990, 2000, 2010, 2020],
  Guamanian: [1980, 1990, 2000],
  "Part Hawaiian": [1960],
  Hawaiian: [1960, 1970, 1980, 1990, 2000, 2010],
  "Other API": [1990],
  "Other Asian": [2000, 2010, 2020],
  "Other Pacific Islander": [2000, 2010],
  "Other Spanish": [1970],
  "Other Spanish or Hispanic": [1980, 1990],
  "Other Spanish, Hispanic, or Latino": [2000, 2010, 2020],
  Other: [1790, 1800, 1810, 1820, 1830, 1840, 1910, 1920, 1930, 1940, 1950, 1970, 1980, 1990, 2000, 2010, 2020],
  "Alaska Native": [2000, 2010, 2020],
  Eskimo: [1960, 1980],
  Aleut: [1960, 1970, 1980, 1990],
  "American Indian":[1960, 1970, 1980, 1990],
  Indian: [1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950],
  Cuban: [1970, 1980, 1990, 2000, 2010, 2020],
  "Puerto Rican": [1970, 1980, 1990, 2000, 2010, 2020],
  "Central or South American": [1970],
  "Mexican, Mexican-American, Chicano": [1980, 1990, 2000, 2010, 2020],
  Mexican: [1930, 1970],
  "Mixed Black": [1850, 1860, 1870, 1880, 1880, 1890, 1910, 1920],
  Black: [],
};

const secondGroups = {
  Black: [],
  "Mixed Black": [1850, 1860, 1870, 1880, 1880, 1890, 1910, 1920],
  Chinese: [
    1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970,
    1980, 1990, 2000, 2010, 2020,
  ],
  Japanese: [
    1890, 1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000,
    2010, 2020,
  ],
  Hindu: [1920, 1930, 1940],
  Korean: [1920, 1930, 1940, 1970, 1980, 1990, 2000, 2010, 2020],
  Philippino: [
    1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020,
  ],
  Vietnamese: [1980, 1990, 2000, 2010, 2020],
  "Asian Indian": [1980, 1990, 2000, 2010, 2020],
  // "Other Asian": [2000, 2010, 2020],
};

const secondGroupsByYears = {
  1850: ["Mixed Black"],
  1860: ["Chinese", "Mixed Black"],
  1870: ["Chinese", "Mixed Black"],
  1880: ["Chinese", "Mixed Black"],
  1890: ["Chinese", "Japanese", "Mixed Black"],
  1900: ["Chinese", "Japanese"],
  1910: ["Chinese", "Japanese", "Mixed Black"],
  1920: ["Chinese", "Japanese", "Hindu", "Korean", "Philippino", "Mixed Black"],
  1930: ["Chinese", "Japanese", "Hindu", "Korean", "Philippino"],
  1940: ["Chinese", "Japanese", "Hindu", "Korean", "Philippino"],
  1950: ["Chinese", "Japanese", "Philippino"],
  1960: ["Chinese", "Japanese", "Philippino"],
  1970: ["Chinese", "Japanese", "Korean", "Philippino"],
  1980: [
    "Chinese",
    "Japanese",
    "Korean",
    "Philippino",
    "Vietnamese",
    "Asian Indian",
  ],
  1990: [
    "Chinese",
    "Japanese",
    "Korean",
    "Philippino",
    "Vietnamese",
    "Asian Indian",
  ],
  2000: [
    "Chinese",
    "Japanese",
    "Korean",
    "Philippino",
    "Vietnamese",
    "Asian Indian",
    // "Other Asian",
  ],
  2010: [
    "Chinese",
    "Japanese",
    "Korean",
    "Philippino",
    "Vietnamese",
    "Asian Indian",
    // "Other Asian",
  ],
  2020: [
    "Chinese",
    "Japanese",
    "Korean",
    "Philippino",
    "Vietnamese",
    "Asian Indian",
    // "Other Asian",
  ],
};

const thirdGroups = {
  Mexican: [1930, 1970],
  "Mexican, Mexican-American, Chicano": [1980, 1990, 2000, 2010, 2020],
  Indian: [1860, 1870, 1880, 1890, 1900, 1910, 1920, 1930, 1940, 1950],
  "American Indian": [1960, 1970, 1980, 1990],
  "Central or South American": [1970],
  "Other Spanish": [1970],
  "Other Spanish, Hispanic, or Latino": [2000, 2010, 2020],
  "Other Spanish or Hispanic": [1980, 1990],
};

const fourthGroups = {
  Hawaiian: [1960, 1970, 1980, 1990, 2000, 2010],
  "Part Hawaiian": [1960],
  Guamanian: [1980, 1990, 2000],
  Samoan: [1980, 1990, 2000, 2010, 2020],
  "Guamanian or Chamorro": [2000, 2010, 2020],
  "Other Pacific Islander": [2000, 2010],
};

// 島嶼位置
const islandGroups = [
  { label: "Hawaii", groups: ["Hawaiian", "Part Hawaiian"], x: 1080, y: 80 },
  {
    label: "Guam",
    groups: ["Guamanian", "Guamanian or Chamorro"],
    x: 930,
    y: 90,
  },
  {
    label: "Northern Mariana",
    groups: ["Guamanian or Chamorro"],
    x: 880,
    y: 75,
  },
  { label: "American Samoa", groups: ["Samoan"], x: 1000, y: 110 },
  { label: "Other Pacific", groups: ["Other Pacific Islander"], x: 1050, y: 90 },
];

const fifthGroup = {
  "Other API": [1990],
  "Other Asian": [2000, 2010, 2020],
  "Other Pacific Islander": [2000, 2010],
  "Other Spanish": [1970],
  "Other Spanish or Hispanic": [1980, 1990],
  "Other Spanish, Hispanic, or Latino": [2000, 2010, 2020],
  Other: [1790, 1800, 1810, 1820, 1830, 1840, 1910, 1920, 1930, 1940, 1950, 1970, 1980, 1990, 2000, 2010, 2020],
};

const yearLabels = [
  1790, 1800, 1810, 1820, 1830, 1840, 1850, 1860, 1870, 1880, 1890, 1900, 1910,
  1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2050,
];

function drawGradientLine(x1, y1, x2, y2, colors, thickness) {
  let steps = 30;
  let dx = x2 - x1;
  let dy = y2 - y1;
  let len = dist(x1, y1, x2, y2);
  let nx = -dy / len;
  let ny = dx / len;

  for (let i = -steps; i <= steps; i++) {
    let distFromCenter = map(abs(i), 0, steps, 0, 1);
    let colorIndex = distFromCenter * (colors.length - 1);
    let low = floor(colorIndex);
    let high = ceil(colorIndex);
    let amt = colorIndex - low;
    let col = lerpColor(colors[low], colors[high], amt);
    stroke(col);
    strokeWeight(1);

    let offset = (i * thickness) / steps;
    line(x1 + nx * offset, y1 + ny * offset, x2 + nx * offset, y2 + ny * offset);
  }
}

function setup() {
  createCanvas(1920 * scaleFactor, 1080 * scaleFactor); // now 3840x2160 for 4K
  colorMode(HSL, 360, 100, 100);
  textFont("sans-serif");
  textStyle(NORMAL); 
  
  const margin = 30* scaleFactor;
  const spacingTop = (rectW - margin * 2) / (ethnics.length - 1);
  const spacingBottom = (rectW - margin * 2) / (yearLabels.length - 1);
  const titleH = 10* scaleFactor; // adjust top circle location by editing this
  const yTop = rectY + titleH + margin;
  const yBottom = rectY + rectH - margin;

  for (let i = 0; i < ethnics.length; i++) {
    let x = rectX + margin + i * spacingTop;
    topCircles.push({ x, y: yTop, name: ethnics[i], nameLines:splitLabel(ethnics[i]) });

    const hex = ethnicColors[ethnics[i]];
    if (hex) {
      topColors[i] = color(hex);
    } else {
      topColors[i] = color(map(i, 0, ethnics.length - 1, 0, 360), 80, 50); // fallback
    }
  }

  for (let i = 0; i < yearLabels.length; i++) {
    let x = rectX + margin + i * spacingBottom;
    bottomCircles.push({ x, y: yBottom, year: yearLabels[i] });
  }

  // Phase 1
  for (let i = 0; i < topCircles.length; i++) {
    const topPt = topCircles[i];
    const years = firstGroups[topPt.name] ?? [];
    for (let year of years) {
      const bottomPt = bottomCircles.find((b) => b.year === year);
      if (bottomPt) {
        connections.push({
          top: topPt,
          bottom: bottomPt,
          topGroup: i,
          startFrame: phase1StartFrame, // 所有都一樣
          phase: 1,
        });
      }
    }
  }

  // Phase 2（依年份逐年畫完）

  const animationPerYear = 60;
  const pauseBetweenYears = 20;
  let totalFrame = 0;

  // 🔹 1. 原本亞洲與 Mixed Black 的連線
  const yearsSorted = Object.keys(secondGroupsByYears)
    .map(Number)
    .sort((a, b) => a - b);

  for (const year of yearsSorted) {
    const groupNames = secondGroupsByYears[year];
    const bottomPt = bottomCircles.find((b) => b.year === year);
    if (!bottomPt) continue;

    const yearStart = phase2StartFrame + totalFrame;

    for (let i = 0; i < topCircles.length; i++) {
      const topPt = topCircles[i];
      if (groupNames.includes(topPt.name)) {
        connections.push({
          top: topPt,
          bottom: bottomPt,
          topGroup: i,
          startFrame: yearStart,
          phase: 2,
        });
      }
    }

    totalFrame += animationPerYear + pauseBetweenYears;
  }

  // // 🔸 2. Mixed Black 右側額外 5 點（透明圓），塞進 spacing 範圍內
  // const baseMixed = topCircles.find((t) => t.name === "Mixed Black");
  // const spacing = (rectW - 60) / (ethnics.length - 1);
  // mixedExtraCircles = []; // ⬅️ global 變數
  // const mixedExtraConnections = [];

  // if (baseMixed) {
  //   const baseMixed = topCircles.find((t) => t.name === "Mixed Black");
  //   const baseBlack = topCircles.find((t) => t.name === "Black");

  //   mixedExtraCircles = [];
  //   const mixedExtraConnections = [];

  //   if (baseMixed && baseBlack) {
  //     const x1 = baseMixed.x;
  //     const x2 = baseBlack.x;
  //     const baseY = baseMixed.y;

  //     const fixedColors = ["#de6f6f", "#de6f6f", "#de6f6f", "#FF818F"];
  //     const count = fixedColors.length;
  //     const tMin = 0.2;
  //     const tMax = 0.8;

  //     for (let i = 0; i < count; i++) {
  //       const t = map(i, 0, count - 1, tMin, tMax);
  //       const x = lerp(baseMixed.x, baseBlack.x, t);
  //       const y = baseMixed.y;
  //       const c = color(fixedColors[i]);
  //       const pt = { x, y, name: "MixedBlackExtra-" + i, alpha: 0 };
  //       mixedExtraCircles.push({ pt, color: c });
  //     }

  //     // 下面這段保留你原本的連線邏輯不變
  //     const mixedYears = [
  //       1850, 1860, 1870, 1880, 1880, 1890, 1910, 1920, 1930, 1940, 1950, 1960,
  //       1970, 1980, 1990, 2000, 2010, 2020,
  //     ];
  //     totalFrame = 0;

  //     for (let year of mixedYears) {
  //       const bottomPt = bottomCircles.find((b) => b.year === year);
  //       if (!bottomPt) continue;

  //       const yearStart = phase2StartFrame + totalFrame;

  //       for (const { pt, color } of mixedExtraCircles) {
  //         mixedExtraConnections.push({
  //           top: pt,
  //           bottom: bottomPt,
  //           topGroup: -1,
  //           customColor: color,
  //           startFrame: yearStart,
  //           phase: 2,
  //         });
  //       }

  //       totalFrame += animationPerYear + pauseBetweenYears;
  //     }

  //     connections.push(...mixedExtraConnections);
  //   }

  //   // 🔸 連接到 Mixed Black 相同年份
  //   const mixedYears = [
  //     1850, 1860, 1870, 1880, 1880, 1890, 1910, 1920, 1930, 1940, 1950, 1960,
  //     1970, 1980, 1990, 2000, 2010, 2020,
  //   ];
  //   if (mixedYears) {
  //     totalFrame = 0; // reset 時間

  //     for (let year of mixedYears) {
  //       const bottomPt = bottomCircles.find((b) => b.year === year);
  //       if (!bottomPt) continue;

  //       const yearStart = phase2StartFrame + totalFrame;

  //       for (const { pt, color } of mixedExtraCircles) {
  //         mixedExtraConnections.push({
  //           top: pt,
  //           bottom: bottomPt,
  //           topGroup: -1,
  //           customColor: color,
  //           startFrame: yearStart,
  //           phase: 2,
  //         });
  //       }

  //       totalFrame += animationPerYear + pauseBetweenYears;
  //     }
  //   }

  //   connections.push(...mixedExtraConnections);
  // }

  // ✅ Phase 3 修改版：Mexican 優先，族群之間有頓點
  const thirdGroupOrder = [
    "Mexican",
    ...Object.keys(thirdGroups).filter((g) => g !== "Mexican"),
  ];
  let delay3 = 0;
  const connectionDuration = 40;
  const groupPause = 20;
  const overlapThreshold = 0.8;
  let frameOffset = connectionDuration * overlapThreshold;

  for (const groupName of thirdGroupOrder) {
    const years = thirdGroups[groupName];
    const topPtIndex = topCircles.findIndex((t) => t.name === groupName);
    if (topPtIndex === -1) continue;

    const topPt = topCircles[topPtIndex];

    for (let year of years) {
      const bottomPt = bottomCircles.find((b) => b.year === year);
      if (!bottomPt) continue;

      connections.push({
        top: topPt,
        bottom: bottomPt,
        topGroup: topPtIndex,
        startFrame: phase3StartFrame + delay3 * frameOffset,
        phase: 3,
      });
      delay3++;
    }

    delay3 += Math.ceil(groupPause / frameOffset); // 頓點延遲
  }

  // Phase 4 - Island groups (保留原寫法)
  const islandGroupTriples = [];
  const delayPhase4 = 60; // 1 秒
  for (const island of islandGroups) {
    for (const ethnic of island.groups) {
      const years = fourthGroups[ethnic];
      if (!years) continue;

      const topPt = topCircles.find((t) => t.name === ethnic);
      if (!topPt) continue;

      for (let year of years) {
        const bottomPt = bottomCircles.find((b) => b.year === year);
        if (!bottomPt) continue;

        islandGroupTriples.push({
          island: { x: island.x, y: island.y, label: island.label },
          top: topPt,
          bottom: bottomPt,
          year,
        });
      }
    }
  }

  islandGroupTriples.sort((a, b) => a.year - b.year);

  const duration = 60;
  const pause = 30;
  islandConnections.length = 0;
  // connections = connections.filter((c) => c.phase !== 4);

  islandGroupTriples.forEach((triple, i) => {
    const baseFrame = phase4StartFrame + i * (duration + pause);

    const topIndex = topCircles.findIndex((t) => t.name === triple.top.name);
    const lineColor = topColors[topIndex] ?? color(0);

    islandConnections.push({
      top: triple.island,
      bottom: { x: triple.top.x, y: triple.top.y },
      startFrame: baseFrame,
      phase: 4,
      lineColor,
    });

    connections.push({
      top: triple.top,
      bottom: triple.bottom,
      topGroup: topCircles.findIndex((t) => t.name === triple.top.name),
      startFrame: baseFrame + duration,
      phase: 4,
    });

    const existingIsland = islandCircles.find(
      (i) => i.label === triple.island.label
    );
    if (!existingIsland) {
      const fullIsland = islandGroups.find(
        (ig) => ig.label === triple.island.label
      );

      const groupIndices = fullIsland.groups
        .map((g) => topCircles.findIndex((t) => t.name === g))
        .filter((i) => i !== -1);

      // 平均顏色（RGB）
      colorMode(RGB);
      let r = 0,
        g = 0,
        b = 0;
      for (let idx of groupIndices) {
        const c = topColors[idx];
        r += red(c);
        g += green(c);
        b += blue(c);
      }
      const n = groupIndices.length || 1;
      const fillColor = color(r / n, g / n, b / n);
      colorMode(HSL, 360, 100, 100);

      islandCircles.push({
        x: triple.island.x,
        y: triple.island.y,
        label: triple.island.label,
        lineColor: color(0),
        fillColor,
        targets: [],
      });
    }
  });

  // ✅ Phase 5: static + animated
  const phase5StaticFadeDuration = 120;
  const durationPerConn = 40; // 一條動畫間隔
  const phase5TransitionFrame = phase5StartFrame + phase5StaticFadeDuration;

  // 1️⃣ 所有族群的 static 線條（subPhase: static）
  let delay5 = 0;
  for (let groupName of Object.keys(firstGroups)) {
    const years = firstGroups[groupName];
    if (!years) continue;

    const topIndex = topCircles.findIndex((t) => t.name === groupName);
    if (topIndex === -1) continue;

    const topPt = topCircles[topIndex];

    const groupStartFrame = phase5StartFrame + delay5 * 2; // 小間隔讓畫面變化自然
    for (let year of years) {
      const bottomPt = bottomCircles.find((b) => b.year === year);
      if (!bottomPt) continue;

      connections.push({
        top: topPt,
        bottom: bottomPt,
        topGroup: topIndex,
        startFrame: groupStartFrame,
        phase: 5,
        subPhase: "static",
      });
    }

    delay5++;
  }

  // 2️⃣ Others group 的 animated 線條（subPhase: animated）
  const fifthGroupsByYears = {};
  for (let groupName in fifthGroup) {
    const years = fifthGroup[groupName];
    if (!years) continue;
    for (let year of years) {
      if (!fifthGroupsByYears[year]) fifthGroupsByYears[year] = [];
      fifthGroupsByYears[year].push(groupName);
    }
  }

  const sortedFifthYears = Object.keys(fifthGroupsByYears)
    .map(Number)
    .sort((a, b) => a - b);

  frameOffset = 0;
  for (let year of sortedFifthYears) {
    const groupNames = fifthGroupsByYears[year];
    const bottomPt = bottomCircles.find((b) => b.year === year);
    if (!bottomPt) continue;

    const topGroupPoints = groupNames
      .map((name) => topCircles.find((t) => t.name === name))
      .filter(Boolean)
      .sort((a, b) => a.y - b.y);

    for (let i = 0; i < topGroupPoints.length; i++) {
      const topPt = topGroupPoints[i];
      const topGroupIndex = topCircles.findIndex((t) => t.name === topPt.name);
      if (topGroupIndex === -1) continue;

      connections.push({
        top: topPt,
        bottom: bottomPt,
        topGroup: topGroupIndex,
        startFrame: phase5TransitionFrame + frameOffset,
        phase: 5,
        subPhase: "animated",
      });

      frameOffset += durationPerConn;
    }
  }

  // ✅ 根據動畫總長度重新定義 phase5EndFrame
  const phase5EndBuffer = 200;
  const phase5EndFrame = phase5TransitionFrame + frameOffset + phase5EndBuffer;
}

function draw() {
  background(0);
  noFill();
  stroke(20);
  rect(rectX, rectY, rectW, rectH);

  // 顯示當前階段的標題
  if (frameCounter >= phase1StartFrame && frameCounter < phase1EndFrame) {
    currentPhase = 1;
  } else if (frameCounter >= phase2StartFrame && frameCounter < phase2EndFrame) {
    currentPhase = 2;
  } else if (frameCounter >= phase3StartFrame && frameCounter < phase3EndFrame) {
    currentPhase = 3;
  } else if (frameCounter >= phase4StartFrame && frameCounter < phase4EndFrame) {
    currentPhase = 4;
  } else if (frameCounter >= phase5StartFrame && frameCounter < phase5EndFrame) {
    currentPhase = 5;
  } else if (frameCounter >= phase6StartFrame && frameCounter < phase6EndFrame) {
    currentPhase = 6;
  }

  let img = titleImages[currentPhase];
  if (img) {
    imageMode(CORNER);
    image(img, rectX + 10* scaleFactor, rectY - 80* scaleFactor, 800* scaleFactor, 50* scaleFactor);
  }
// else if (currentPhaseKey && phaseTitles[currentPhaseKey]) {
//   noStroke();
//   fill(255);
//   textSize(16);
//   textStyle(NORMAL);
//   textFont("sans-serif");
//   textAlign(LEFT, BOTTOM);
//   text(phaseTitles[currentPhaseKey], rectX + 30, rectY - 40);
// }

  const asianGroups = new Set([
    "Black",
    "Chinese",
    "Japanese",
    "Hindu",
    "Korean",
    "Philippino",
    "Vietnamese",
    "Asian Indian",
    // "Other Asian",
  ]);

  const isPhase2 =
    frameCounter >= phase2StartFrame && frameCounter <= phase2EndFrame;
  const isPhase3 =
    frameCounter >= phase3StartFrame && frameCounter <= phase3EndFrame;
  const thirdGroupSet = new Set(Object.keys(thirdGroups));

  if (isPhase3) {
    // Capture the visible topCircle colors for phase 3
    phase3ColorList = topCircles
      .map((pt, i) => {
        if (thirdGroupSet.has(pt.name)) {
          return { name: pt.name, originalIndex: i, color: topColors[i] };
        }
        return null;
      })
      .filter(c => c !== null);
  }

  if (isPhase3) {
    const timeIntoPhase3 = frameCounter - phase3StartFrame;
  
    // Wait until delay has passed before shuffling
    if (timeIntoPhase3 >= phase3ShuffleDelay) {
      const progress = (timeIntoPhase3 - phase3ShuffleDelay) / (phase3EndFrame - phase3StartFrame - phase3ShuffleDelay);
  
      const minInterval = 3;   // fastest
      const maxInterval = 20;  // slowest
      const interval = Math.floor(lerp(maxInterval, minInterval, constrain(progress, 0, 1)));
  
      if (frameCounter % interval === 0 && phase3ColorList.length > 1) {
        // Shuffle using Fisher-Yates
        for (let i = phase3ColorList.length - 1; i > 0; i--) {
          let j = Math.floor(random(i + 1));
          [phase3ColorList[i].color, phase3ColorList[j].color] = [phase3ColorList[j].color, phase3ColorList[i].color];
        }
  
        // Apply to topColors
        for (let item of phase3ColorList) {
          topColors[item.originalIndex] = item.color;
        }
      }
    }
  }

  // let bgAlpha = 0;

  // if (frameCounter >= phase6ClearStartFrame) {
  //   const disappearInterval = 5;
  //   const step = Math.floor(
  //     (frameCounter - phase6ClearStartFrame) / disappearInterval
  //   );
  //   const maxIndex = topCircles.length - 1;
  //   const fadeProgress = constrain(step*10 / maxIndex, 0, 1);
  //   bgAlpha = lerp(0, 255, fadeProgress);
  
  //   noStroke();
  //   fill(255, bgAlpha);
  //   rect(0, 0, width, height);
  // }

  for (let i = 0; i < topCircles.length; i++) {
    const pt = topCircles[i];
    const isAsian = asianGroups.has(pt.name);
    const isMixedBlack = pt.name === "Mixed Black";
    const isInThirdGroup = thirdGroupSet.has(pt.name);

    let visible = true;

    if (isPhase2) {
      visible = isAsian || isMixedBlack;
    } else if (isPhase3) {
      visible = isInThirdGroup;
    } else if (
      frameCounter >= phase4StartFrame &&
      frameCounter <= phase4EndFrame
    ) {
      const fourthGroupSet = new Set(Object.keys(fourthGroups));
      visible = fourthGroupSet.has(pt.name);
    }
    const disappearInterval = 5;

    if (frameCounter >= phase6ClearStartFrame) {
      const step = Math.floor(
        (frameCounter - phase6ClearStartFrame) / disappearInterval
      );
      const maxIndex = topCircles.length - 1;
      if (i >= maxIndex - step) visible = false;
    }


  // 👇 Only draw if both logical group visibility and fadeAlpha allow
    if (visible) {
      fill(topColors[i]);
      noStroke();
      ellipse(pt.x, pt.y, 7* scaleFactor);
      fill(255); // 👈 fade text too
      textStyle(NORMAL); 
      textFont("sans-serif");
      textAlign(CENTER, BOTTOM);
      textSize(6* scaleFactor);
      const nameLines = pt.nameLines;
      for (let j = 0; j < nameLines.length; j++) {
        let lineY = pt.y - 10* scaleFactor - (nameLines.length - 1 - j) * 9* scaleFactor; // stack upward
        text(nameLines[j], pt.x, lineY);
      }
    }
  }

  for (let i = 0; i < bottomCircles.length; i++) {
    const pt = bottomCircles[i];

    if (pt.year === 2050 && frameCounter < phase6StartFrame) continue;

    const disappearInterval = 5;
    // ✅ 隱藏邏輯：phase6 從右至左不顯示
    if (pt.year !== 2050 && frameCounter >= phase6ClearStartFrame) {
      const step = Math.floor(
        (frameCounter - phase6ClearStartFrame) / disappearInterval
      );
      const maxIndex = bottomCircles.length - 1;
      if (i >= maxIndex - step) continue;
    }

    fill(255);
    noStroke();
    ellipse(pt.x, pt.y, 5* scaleFactor);
    textStyle(NORMAL); 
    textFont("sans-serif");
    textAlign(CENTER, TOP);
    textSize(10* scaleFactor);
    text(pt.year, pt.x, pt.y + 6* scaleFactor);
  }

  const mixedBlackDrawnYears = new Set();
  for (let conn of connections) {
    if (
      conn.phase === 2 &&
      conn.top.name === "Mixed Black" &&
      frameCounter >= conn.startFrame
    ) {
      mixedBlackDrawnYears.add(conn.bottom.year);
    }
  }

  const fadedYears = new Set();
  const phase2Years = [
    ...new Set(
      connections
        .filter((conn) => conn.phase === 2)
        .map((conn) => conn.bottom.year)
    ),
  ];

  for (let year of phase2Years) {
    const connsOfYear = connections.filter(
      (conn) => conn.phase === 2 && conn.bottom.year === year
    );
    const allFinished = connsOfYear.every(
      (conn) => frameCounter > conn.startFrame + 40
    );
    if (allFinished) fadedYears.add(year);
  }

  strokeWeight(0.9* scaleFactor);

  for (let conn of connections) {
    if (frameCounter >= phase6ClearStartFrame) {
      continue;
    }
    if (
      (conn.phase === 1 && frameCounter > phase1EndFrame) ||
      (conn.phase === 2 &&
        (frameCounter < phase2StartFrame || frameCounter > phase2EndFrame)) ||
      (conn.phase === 3 &&
        (frameCounter < phase3StartFrame || frameCounter > phase3EndFrame)) ||
      (conn.phase === 4 &&
        (frameCounter < phase4StartFrame || frameCounter > phase4EndFrame)) ||
      (conn.phase === 5 &&
        conn.subPhase !== "animated" && // 👈 新增這條判斷：animated 要留下來
        frameCounter > phase5EndFrame &&
        frameCounter <= phase5EndFrame)
    )
      continue;

    // === Phase 5 特別處理 ===
    if (conn.phase === 5) {
      if (conn.subPhase === "static") {
        if (
          frameCounter >= phase5StartFrame &&
          frameCounter < phase5TransitionFrame
        ) {
          colorMode(RGB);
          const c = topColors[conn.topGroup];
          stroke(red(c), green(c), blue(c), 255);
          line(conn.top.x, conn.top.y, conn.bottom.x, conn.bottom.y);
          colorMode(HSL, 360, 100, 100);
        } else if (frameCounter >= phase5TransitionFrame) {
          colorMode(RGB);
          const c = topColors[conn.topGroup];
          stroke(red(c), green(c), blue(c), 30);
          line(conn.top.x, conn.top.y, conn.bottom.x, conn.bottom.y);
          colorMode(HSL, 360, 100, 100);
        }
        continue;
      }

      if (conn.subPhase === "animated" && frameCounter >= conn.startFrame) {
        let progress = constrain((frameCounter - conn.startFrame) / 60, 0, 1);

        let x1 = conn.bottom.x;
        let y1 = conn.bottom.y;
        let x2 = lerp(x1, conn.top.x, progress);
        let y2 = lerp(y1, conn.top.y, progress);

        // === 新增：處理淡出 alpha ===
        let alpha = 255;
        if (frameCounter >= phase5AnimatedFadeStart) {
          const fadeProgress = constrain(
            (frameCounter - phase5AnimatedFadeStart) /
              (phase5AnimatedFadeEnd - phase5AnimatedFadeStart),
            0,
            1
          );
          alpha = lerp(255, 0, fadeProgress);
        }

        colorMode(RGB);
        const c = topColors[conn.topGroup];
        stroke(red(c), green(c), blue(c), alpha);
        line(x1, y1, x2, y2);
        colorMode(HSL, 360, 100, 100);
        continue;
      }

      continue;
    }

    if (conn.phase === 3 && frameCounter >= conn.startFrame) {
      let elapsed = frameCounter - conn.startFrame;
      let progress = constrain(elapsed / 60, 0, 1); // 60 為動畫時長

      let x1 = conn.bottom.x;
      let y1 = conn.bottom.y;
      let x2 = lerp(x1, conn.top.x, progress);
      let y2 = lerp(y1, conn.top.y, progress);

      let alpha = lerp(0, 255, progress); // 淡入透明度

      colorMode(RGB);
      const c = topColors[conn.topGroup];
      stroke(red(c), green(c), blue(c), alpha);
      line(x1, y1, x2, y2);
      colorMode(HSL, 360, 100, 100);
      continue;
    }

    if (frameCounter >= conn.startFrame) {
      let progress = constrain((frameCounter - conn.startFrame) / 60, 0, 1);
      let x1, y1, x2, y2;

      if (conn.phase === 1) {
        x1 = conn.top.x;
        y1 = conn.top.y;
        x2 = conn.bottom.x;
        y2 = conn.bottom.y;

        const fadeInDuration = 60;
        const holdDuration = 600;
        const totalDuration = fadeInDuration + holdDuration;

        const elapsed = frameCounter - conn.startFrame;
        if (elapsed > totalDuration) continue; // 🔹 超過顯示時間，直接不畫

        let alpha = 255;
        if (elapsed < fadeInDuration) {
          alpha = (elapsed / fadeInDuration) * 255; // 🔹 fade in
        }

        colorMode(RGB);
        const c = topColors[conn.topGroup];
        stroke(red(c), green(c), blue(c), alpha);
        line(x1, y1, x2, y2);
        colorMode(HSL, 360, 100, 100);
        continue;
      } else if (conn.phase === 2) {
        const yearDuration = 60;
        const fadeStart = yearDuration;
        const fadeDuration = 60;

        const elapsed = frameCounter - conn.startFrame;

        if (elapsed < 0) continue;

        let progress = constrain(elapsed / yearDuration, 0, 1);
        let x1 = conn.bottom.x;
        let y1 = conn.bottom.y;
        let x2 = lerp(x1, conn.top.x, progress);
        let y2 = lerp(y1, conn.top.y, progress);


        // ==== Fading logic ===
        let alpha = 255;
        let alpha_mix = 200;
        let weight =0.9* scaleFactor;
        if (elapsed >= fadeStart) {
          const fadeProgress = constrain(
            (elapsed - fadeStart) / fadeDuration,
            0,
            1
          );
          alpha_mix = lerp(255, 60, fadeProgress); // alpha for phase 2
          alpha= lerp(255, 120, fadeProgress);
        }

        if (conn.top.name === "Mixed Black") {
          // Define your gradient color palette
          const baseHexes = ['#FF5347', '#FF5F59', '#FF6A6B', '#FF767D', '#FF818F'];
          const alphaSteps = [40, 100, 255, 100, 40];

          let baseGradient = baseHexes.map((hex, idx) => {
            let c = color(hex);
            c.setAlpha(alphaSteps[idx]);
            return c;
          });

          const fadeProgressMix = constrain((frameCounter - fadeStart) / fadeDuration, 0, 1);
          const fadeFactorMix = lerp(1, 0.4, fadeProgressMix); // or fade to 0.2, 0, etc.

          let fadedGradientMix = baseGradient.map(col => {
            let a = col._getAlpha ? col._getAlpha() * fadeFactorMix : 255 * fadeFactorMix;
            return color(red(col), green(col), blue(col), a);
          });

          drawGradientLine(x1, y1, x2, y2, fadedGradientMix, 3); // adjust thickness
        } else {
          colorMode(RGB);
          const c = conn.customColor ?? topColors[conn.topGroup];
          stroke(red(c), green(c), blue(c), alpha);
          strokeWeight(weight);
          line(x1, y1, x2, y2);
          colorMode(HSL, 360, 100, 100);
        }

        continue;
      }

      if (conn.phase === 4 && frameCounter >= conn.startFrame) {
        const drawDuration = 60;
        const fadeDuration = 30;

        const elapsed = frameCounter - conn.startFrame;

        let alpha = 255;
        if (elapsed > drawDuration) {
          const fadeProgress = constrain(
            (elapsed - drawDuration) / fadeDuration,
            0,
            1
          );
          alpha = lerp(255, 120, fadeProgress);  // alpha for island striaght line
          // if (fadeProgress === 1) continue;
        }

        let progress = constrain(elapsed / drawDuration, 0, 1);

        let x1 = conn.top.x;
        let y1 = conn.top.y;
        let x2 = lerp(x1, conn.bottom.x, progress);
        let y2 = lerp(y1, conn.bottom.y, progress);

        colorMode(RGB);
        const c = topColors[conn.topGroup];
        stroke(red(c), green(c), blue(c), alpha);
        line(x1, y1, x2, y2);
        colorMode(HSL, 360, 100, 100);
        continue;
      }

      let alpha = 255;
      const isAsian = asianGroups.has(conn.top.name);
      const isMixedBlack = conn.top.name === "Mixed Black";

      // 🔽 phase 1 fade-in alpha
      if (conn.phase === 1) {
        alpha = progress * 255;
      }

      if (
        conn.phase === 2 &&
        fadedYears.has(conn.bottom.year) &&
        (isAsian || isMixedBlack)
      ) {
        alpha = 150;
      } else if (
        conn.phase === 2 &&
        isAsian &&
        mixedBlackDrawnYears.has(conn.bottom.year)
      ) {
        alpha = 150;
      }

      colorMode(RGB);
      const c = topColors[conn.topGroup];
      stroke(red(c), green(c), blue(c), alpha);
      line(x1, y1, x2, y2);
      colorMode(HSL, 360, 100, 100);
    }
  }

  // Phase 4 島嶼連線
  if (frameCounter >= phase4StartFrame && frameCounter <= phase4EndFrame) {
    for (let island of islandCircles) {
      fill(island.fillColor || color(0));
      noStroke();
      ellipse(island.x, island.y, 12* scaleFactor);
      fill(0);
      textStyle(NORMAL); 
      textFont("sans-serif");
      textAlign(CENTER, BOTTOM);
      textSize(10* scaleFactor);
      text(island.label, island.x, island.y - 6* scaleFactor);
    }

    for (let conn of islandConnections) {
      if (frameCounter >= conn.startFrame) {
        const drawDuration = 60;
        const fadeDelay = 15; // 多等一點才開始淡出
        const fadeDuration = 45; // 比直線久

        const elapsed = frameCounter - conn.startFrame;
        const fadeStart = drawDuration + fadeDelay;
        let alpha = 255;
        if (elapsed > fadeStart) {
          const fadeProgress = constrain(
            (elapsed - drawDuration) / fadeDuration,
            0,
            1
          );
          alpha = lerp(255, 100, fadeProgress); // alpha for curve
          // if (fadeProgress === 1) continue;
        }

        let progress = constrain(elapsed / drawDuration, 0, 1);

        let x1 = conn.top.x;
        let y1 = conn.top.y;
        let x2 = conn.bottom.x;
        let y2 = conn.bottom.y;

        let cp1x = lerp(x1, x2, 0.3);
        let cp1y = lerp(y1, y2, 0.3) - 60* scaleFactor;
        let cp2x = lerp(x1, x2, 0.7);
        let cp2y = lerp(y1, y2, 0.7) - 60* scaleFactor;

        colorMode(RGB);
        const c = conn.lineColor ?? color(0);
        stroke(red(c), green(c), blue(c), alpha);
        noFill();
        const steps = 30;
        for (let i = 0; i < steps * progress; i++) {
          let t1 = i / steps;
          let t2 = (i + 1) / steps;
          let px1 = bezierPoint(x1, cp1x, cp2x, x2, t1);
          let py1 = bezierPoint(y1, cp1y, cp2y, y2, t1);
          let px2 = bezierPoint(x1, cp1x, cp2x, x2, t2);
          let py2 = bezierPoint(y1, cp1y, cp2y, y2, t2);
          line(px1, py1, px2, py2);
        }
        colorMode(HSL, 360, 100, 100);
      }
    }
  }

  let currentQuote = "";
  if (frameCounter >= phase1StartFrame && frameCounter < phase1EndFrame) {
    currentQuote = phaseQuote.phase1;
  } else if (
    frameCounter >= phase2StartFrame &&
    frameCounter < phase2EndFrame
  ) {
    currentQuote = phaseQuote.phase2;
  } else if (
    frameCounter >= phase3StartFrame &&
    frameCounter < phase3EndFrame
  ) {
    currentQuote = phaseQuote.phase3;
  } else if (
    frameCounter >= phase4StartFrame &&
    frameCounter < phase4EndFrame
  ) {
    currentQuote = phaseQuote.phase4;
  } else if (
    frameCounter >= phase5StartFrame &&
    frameCounter < phase5EndFrame
  ) {
    currentQuote = phaseQuote.phase5;
  } else if (
    frameCounter >= phase6StartFrame &&
    frameCounter < phase6EndFrame
  ) {
    currentQuote = phaseQuote.phase6; // ✅ 加這一行就好
  }

  if (currentQuote) {
    noStroke();
    fill(255); // 比純黑淡一些
    textSize(12* scaleFactor);
    textStyle(ITALIC);
    textFont("sans-serif");
    textAlign(LEFT, TOP);

    const quoteBoxWidth = 700* scaleFactor; // 換行寬度上限
    text(currentQuote, rectX + 30* scaleFactor, rectY + rectH + 30* scaleFactor, quoteBoxWidth);
  }

  frameCounter++;
}

// 第五階段
