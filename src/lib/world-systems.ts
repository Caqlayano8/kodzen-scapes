// World Systems: Day/Night, Weather, Seasons, NPC AI

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";
export type Weather = "sunny" | "cloudy" | "rainy" | "snowy" | "foggy" | "stormy";
export type Season = "spring" | "summer" | "autumn" | "winter";

export interface WorldState {
  timeOfDay: TimeOfDay;
  hour: number;
  weather: Weather;
  season: Season;
  skyGradient: string;
  ambientOverlay: string;
  cloudOpacity: number;
  lightingFilter: string;
  particleType: string | null;
}

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

export function getSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function getWeather(season: Season): Weather {
  const rand = Math.random();
  switch (season) {
    case "spring":
      if (rand < 0.4) return "sunny";
      if (rand < 0.6) return "cloudy";
      if (rand < 0.85) return "rainy";
      return "foggy";
    case "summer":
      if (rand < 0.6) return "sunny";
      if (rand < 0.8) return "cloudy";
      if (rand < 0.9) return "stormy";
      return "sunny";
    case "autumn":
      if (rand < 0.3) return "sunny";
      if (rand < 0.5) return "cloudy";
      if (rand < 0.8) return "rainy";
      return "foggy";
    case "winter":
      if (rand < 0.2) return "sunny";
      if (rand < 0.4) return "cloudy";
      if (rand < 0.7) return "snowy";
      return "foggy";
  }
}

export function getWorldState(): WorldState {
  const now = new Date();
  const hour = now.getHours();
  const timeOfDay = getTimeOfDay(hour);
  const season = getSeason();
  const weather = getWeather(season);

  let skyGradient: string;
  let ambientOverlay: string;
  let cloudOpacity: number;
  let lightingFilter: string;
  let particleType: string | null = null;

  // Sky gradients based on time
  switch (timeOfDay) {
    case "morning":
      skyGradient = "linear-gradient(180deg, #87ceeb 0%, #ffd89b 15%, #a8d8ea 30%, #7ab648 50%, #5a9e32 100%)";
      ambientOverlay = "rgba(255, 220, 150, 0.08)";
      lightingFilter = "brightness(1.05) saturate(1.1)";
      cloudOpacity = 0.35;
      break;
    case "afternoon":
      skyGradient = "linear-gradient(180deg, #5ba3d9 0%, #87ceeb 20%, #a8d8ea 35%, #7ab648 50%, #5a9e32 100%)";
      ambientOverlay = "rgba(255, 255, 255, 0.03)";
      lightingFilter = "brightness(1.0) saturate(1.0)";
      cloudOpacity = 0.3;
      break;
    case "evening":
      skyGradient = "linear-gradient(180deg, #ff7e5f 0%, #feb47b 15%, #d4a574 30%, #6a8c3f 50%, #4a7a2e 100%)";
      ambientOverlay = "rgba(255, 140, 50, 0.12)";
      lightingFilter = "brightness(0.9) saturate(1.2) sepia(0.1)";
      cloudOpacity = 0.4;
      break;
    case "night":
      skyGradient = "linear-gradient(180deg, #0c1445 0%, #1a237e 15%, #283593 30%, #2d4a2e 50%, #1a3a1a 100%)";
      ambientOverlay = "rgba(20, 20, 80, 0.25)";
      lightingFilter = "brightness(0.6) saturate(0.7) hue-rotate(10deg)";
      cloudOpacity = 0.15;
      break;
  }

  // Weather particle effects
  switch (weather) {
    case "rainy":
      particleType = "rain";
      cloudOpacity = 0.6;
      lightingFilter += " brightness(0.85)";
      break;
    case "snowy":
      particleType = "snow";
      cloudOpacity = 0.5;
      ambientOverlay = "rgba(200, 220, 255, 0.1)";
      break;
    case "stormy":
      particleType = "storm";
      cloudOpacity = 0.7;
      lightingFilter += " brightness(0.7) contrast(1.1)";
      break;
    case "foggy":
      particleType = "fog";
      cloudOpacity = 0.5;
      lightingFilter += " blur(0.5px) brightness(0.9)";
      break;
    default:
      break;
  }

  return { timeOfDay, hour, weather, season, skyGradient, ambientOverlay, cloudOpacity, lightingFilter, particleType };
}

// NPC System
export interface NPCState {
  name: string;
  emoji: string;
  role: string;
  mood: "happy" | "neutral" | "excited" | "sleepy";
  activity: string;
  dialogue: string;
  relationship: number;
}

const NPC_DIALOGUES = {
  morning: {
    sunny: [
      "Gunaydin! Bugun bahce icin harika bir gun!",
      "Cicekler sabah ciyiyle parlıyor, ne guzel!",
      "Erken kalkan yol alir! Hadi bahceye bakalim!",
    ],
    rainy: [
      "Yagmur yagıyor, cicekler cok sevinecek!",
      "Semsiyeni unutma! Ama bahce sulanmis olacak.",
      "Yagmurda bahce isleri zor ama dogaya iyi geliyor!",
    ],
    snowy: [
      "Kar yagıyor! Bahce beyaz bir battaniyeye burundu!",
      "Sicak bir cay icip kar manzarasini seyredelim!",
    ],
    cloudy: [
      "Bulutlu bir gun, ama bahce hala guzel!",
      "Bugun golgede calisma gunu!",
    ],
    foggy: [
      "Sisli bir sabah... Bahcede gizemli bir hava var!",
      "Sis dagılinca bahce daha da guzel gorunecek!",
    ],
    stormy: [
      "Firtina geliyor! Bitkileri koruyalim!",
      "Firtina sonrasi gokkusagi cikabilir!",
    ],
  },
  afternoon: {
    sunny: [
      "Ogle gunesinde cicekler parlıyor!",
      "Bahcede oturma keyfi! Bir limonata ister misin?",
      "Bu saatte biraz golge lazim, hamaga uzanalim!",
    ],
    rainy: ["Yagmur devam ediyor, huzurlu bir ogle..."],
    snowy: ["Kar erimeden kardan adam yapalim!"],
    cloudy: ["Bulutlarin arasından gunesin süzüldügünü gör!"],
    foggy: ["Öğleden sonra sis dagılmaya başladı!"],
    stormy: ["İçeride kalalım, fırtına geçene kadar!"],
  },
  evening: {
    sunny: [
      "Aksam gunes batimi ne guzel! Bahceden seyret!",
      "Bugun cok guzel is cikardin, tebrikler!",
      "Fenerler yanmaya basladi, romantik bir aksam!",
    ],
    rainy: ["Yagmur durdu! Aksam gorunumu harika!"],
    snowy: ["Kar altında fenerler ne güzel parıldıyor!"],
    cloudy: ["Bulutlu bir akşam, ama huzurlu..."],
    foggy: ["Sisle karışan fener ışıkları çok atmosferik!"],
    stormy: ["Fırtına geçti, temiz hava içinde akşam keyfi!"],
  },
  night: {
    sunny: [
      "Yildizlar cok parlak bu gece!",
      "Gece bahcesi cok huzurlu, ates bocekleri dans ediyor!",
      "Iyi geceler! Yarin yeni maceralara!",
    ],
    rainy: ["Yagmur sesi altında uyumak ne güzel!"],
    snowy: ["Ay ışığında kar parıl parıl!"],
    cloudy: ["Bulutlu bir gece, huzurlu ve sessiz..."],
    foggy: ["Sisli gece, gizemli ve büyüleyici!"],
    stormy: ["Gece fırtınası... Pencereden seyretmek keyifli!"],
  },
};

export function getNPCState(worldState: WorldState, placedItemCount: number): NPCState {
  const { timeOfDay, weather } = worldState;

  const dialoguePool = NPC_DIALOGUES[timeOfDay]?.[weather] || NPC_DIALOGUES[timeOfDay]?.sunny || ["Merhaba!"];
  const dialogue = dialoguePool[Math.floor(Math.random() * dialoguePool.length)];

  let mood: NPCState["mood"] = "neutral";
  let activity = "Bahcede dolasiyor";

  switch (timeOfDay) {
    case "morning":
      mood = "happy";
      activity = weather === "rainy" ? "Semsiye altında bekliyor" : "Cicekleri suluyor";
      break;
    case "afternoon":
      mood = "neutral";
      activity = weather === "sunny" ? "Hamakta uzanıyor" : "Sera'da calisiyor";
      break;
    case "evening":
      mood = "happy";
      activity = "Fenerleri yakıyor";
      break;
    case "night":
      mood = "sleepy";
      activity = "Yildizlari seyrediyor";
      break;
  }

  if (placedItemCount > 5) mood = "excited";

  return {
    name: "Bahcivan Cem",
    emoji: "🧑‍🌾",
    role: "Rehber",
    mood,
    activity,
    dialogue,
    relationship: 50,
  };
}

// Animal System
export interface Animal {
  id: string;
  emoji: string;
  name: string;
  type: string;
  x: number;
  y: number;
  activity: string;
  animation: string;
}

export function getAnimals(timeOfDay: TimeOfDay, weather: Weather): Animal[] {
  const animals: Animal[] = [];

  if (timeOfDay !== "night") {
    animals.push({
      id: "cat1", emoji: "🐱", name: "Mimi", type: "cat",
      x: 25, y: 55, activity: timeOfDay === "afternoon" ? "Uyuyor" : "Oynuyor",
      animation: timeOfDay === "afternoon" ? "sleeping" : "bounce",
    });
  } else {
    animals.push({
      id: "cat1", emoji: "🐱", name: "Mimi", type: "cat",
      x: 25, y: 55, activity: "Gece gezisi",
      animation: "walk",
    });
  }

  if (weather !== "rainy" && weather !== "stormy") {
    animals.push({
      id: "bird1", emoji: "🐦", name: "Cik Cik", type: "bird",
      x: 65, y: 15, activity: "Sarkı soyluyor",
      animation: "float",
    });

    if (timeOfDay === "morning" || timeOfDay === "afternoon") {
      animals.push({
        id: "butterfly1", emoji: "🦋", name: "", type: "butterfly",
        x: 40, y: 30, activity: "Uçuyor",
        animation: "butterfly",
      });
    }
  }

  if (timeOfDay === "morning") {
    animals.push({
      id: "rabbit1", emoji: "🐰", name: "Pamuk", type: "rabbit",
      x: 75, y: 70, activity: "Havuç arıyor",
      animation: "hop",
    });
  }

  if (timeOfDay === "night") {
    animals.push({
      id: "firefly1", emoji: "✨", name: "", type: "firefly",
      x: 30, y: 40, activity: "",
      animation: "sparkle",
    });
    animals.push({
      id: "firefly2", emoji: "✨", name: "", type: "firefly",
      x: 60, y: 50, activity: "",
      animation: "sparkle",
    });
    animals.push({
      id: "owl1", emoji: "🦉", name: "Bilge", type: "owl",
      x: 10, y: 15, activity: "Gözetliyor",
      animation: "idle",
    });
  }

  return animals;
}

// Weather and time icons
export function getWeatherIcon(weather: Weather): string {
  switch (weather) {
    case "sunny": return "☀️";
    case "cloudy": return "⛅";
    case "rainy": return "🌧️";
    case "snowy": return "🌨️";
    case "foggy": return "🌫️";
    case "stormy": return "⛈️";
  }
}

export function getTimeIcon(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case "morning": return "🌅";
    case "afternoon": return "☀️";
    case "evening": return "🌇";
    case "night": return "🌙";
  }
}

export function getSeasonName(season: Season): string {
  switch (season) {
    case "spring": return "Ilkbahar";
    case "summer": return "Yaz";
    case "autumn": return "Sonbahar";
    case "winter": return "Kis";
  }
}

export function getSeasonIcon(season: Season): string {
  switch (season) {
    case "spring": return "🌸";
    case "summer": return "🌻";
    case "autumn": return "🍂";
    case "winter": return "❄️";
  }
}
