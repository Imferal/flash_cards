// theme/index.ts

import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const warmCocoaTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6D4C41',  // молочный шоколад
    accent: '#8B6B61',   // кофейный оттенок
    background: '#FFF8E1',  // ванильно-молочный
    surface: '#FFEBCD',  // оттенок "крем-брюле"
    text: '#3E2723',  // глубокий какао
    onSurface: '#795548',  // коричневый
    error: '#D32F2F',  // алый красный
  },
  roundness: 8,
  sizes: {
    iconSizeSmall: 20,
    iconSizeMedium: 28,
    iconSizeLarge: 36,
  },
};

export const autumnGlowTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#D2691E',  // коричнево-оранжевый
    accent: '#FF4500',   // оранжево-красный
    background: '#FAF3E0',  // кремовый
    surface: '#FDE8D0',  // светло-бежевый
    text: '#4A2C2A',  // глубокий коричневый
    onSurface: '#5C4033',  // темный ореховый
    error: '#B22222',  // бордовый
  },
  roundness: 8,
  sizes: {
    iconSizeSmall: 20,
    iconSizeMedium: 28,
    iconSizeLarge: 36,
  },
};

export const cozySunsetTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6F61',  // тёплый коралловый
    accent: '#FFA07A',   // светло-лососевый
    background: '#FFF1E6',  // ванильный оттенок
    surface: '#FFE4C4',  // персиковый крем
    text: '#5D4037',  // глубокий шоколадный
    onSurface: '#8B5E3C',  // коричневый
    error: '#C71585',  // малиновый
  },
  roundness: 4,
  sizes: {
    iconSizeSmall: 20,
    iconSizeMedium: 28,
    iconSizeLarge: 36,
  },
};

export const goldenWheatTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F4A460',  // светлый песочный
    accent: '#FFD700',   // золотистый
    background: '#FFFACD',  // лимонный крем
    surface: '#FAF0E6',  // светло-лёгкий беж
    text: '#6B4226',  // древесно-коричневый
    onSurface: '#8B5A2B',  // коричнево-золотистый
    error: '#B22222',  // бордовый
  },
  roundness: 8,
  sizes: {
    iconSizeSmall: 20,
    iconSizeMedium: 28,
    iconSizeLarge: 36,
  },
};

export const honeyCinnamonTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FFB74D',  // янтарно-медовый
    accent: '#D2691E',   // коричный
    background: '#FFFDE7',  // светло-жёлтый
    surface: '#FFE4B5',  // цвет топлёного молока
    text: '#4E342E',  // тёмно-шоколадный
    onSurface: '#6D4C41',  // кофейный оттенок
    error: '#FF6347',  // томатный
  },
  roundness: 8,
  sizes: {
    iconSizeSmall: 20,
    iconSizeMedium: 28,
    iconSizeLarge: 36,
  },
};

export const festiveFiestaTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF1744',  // яркий алый
    accent: '#FFEA00',   // жёлто-золотистый
    background: '#FFF8E7',  // светлый кремовый фон
    surface: '#FFCCBC',  // светло-розовый персик
    text: '#311B92',  // насыщенный фиолетовый
    onSurface: '#8E24AA',  // глубокий пурпурный
    error: '#D50000',  // ярко-красный
  },
  roundness: 10,
  sizes: {
    iconSizeSmall: 20,
    iconSizeMedium: 30,
    iconSizeLarge: 40,
  },
};

export const carnivalCelebrationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E88E5',  // яркий синий
    accent: '#FFD700',   // золотистый
    background: '#F1F8E9',  // светло-зелёный
    surface: '#FFEB3B',  // жёлтый
    text: '#004D40',  // тёмно-зелёный
    onSurface: '#1B5E20',  // насыщенный изумрудный
    error: '#E53935',  // алый красный
  },
  roundness: 12,
  sizes: {
    iconSizeSmall: 20,
    iconSizeMedium: 28,
    iconSizeLarge: 36,
  },
};

export const cherryBlossomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F48FB1',  // светло-розовый
    accent: '#FF80AB',   // ярко-розовый
    background: '#FFF1F1',  // розовый фон
    surface: '#FFD1DC',  // нежный персиково-розовый
    text: '#880E4F',  // насыщенный бордово-розовый
    onSurface: '#AD1457',  // пурпурный оттенок
    error: '#C2185B',  // малиновый
  },
  roundness: 8,
  sizes: {
    iconSizeSmall: 18,
    iconSizeMedium: 28,
    iconSizeLarge: 36,
  },
};

export const tropicalVibesTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00BFA5',  // бирюзовый
    accent: '#FF6F00',   // ярко-оранжевый
    background: '#E0F7FA',  // светло-бирюзовый фон
    surface: '#FFF3E0',  // светло-персиковый
    text: '#004D40',  // тёмный изумрудный
    onSurface: '#00695C',  // тёмный бирюзовый
    error: '#F4511E',  // красно-оранжевый
  },
  roundness: 10,
  sizes: {
    iconSizeSmall: 20,
    iconSizeMedium: 32,
    iconSizeLarge: 42,
  },
};
export const neonPartyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF3D00',  // неоново-красный
    accent: '#00E5FF',   // неоново-голубой
    background: '#1A1A2E',  // тёмно-фиолетовый фон
    surface: '#16213E',  // глубокий индиго
    text: '#F8F8F8',  // светло-серый
    onSurface: '#00FFAB',  // неоново-зелёный
    error: '#FF0266',  // неоново-розовый
  },
  roundness: 16,
  sizes: {
    iconSizeSmall: 22,
    iconSizeMedium: 30,
    iconSizeLarge: 40,
  },
};
export const midnightBlueTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E88E5',  // насыщенный синий
    accent: '#BB86FC',  // фиолетовый
    background: '#121212',  // глубокий чёрный
    surface: '#1F1B24',  // тёмно-серый
    text: '#E0E0E0',  // светло-серый
    onSurface: '#90CAF9',  // небесно-голубой
    error: '#CF6679',  // розово-красный
  },
  roundness: 8,
  sizes: {
    iconSizeSmall: 20,
    iconSizeMedium: 28,
    iconSizeLarge: 36,
  },
};
export const mochaDreamTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6D4C41',  // какао-коричневый
    accent: '#A1887F',  // молочный капучино
    background: '#2E2C29',  // цвет тёмного шоколада
    surface: '#3E3A36',  // тёмный кофе
    text: '#D7CCC8',  // цвет кофе с молоком
    onSurface: '#8D6E63',  // коричневый с оттенком ореха
    error: '#D32F2F',  // алый красный
  },
  roundness: 10,
  sizes: {
    iconSizeSmall: 20,
    iconSizeMedium: 28,
    iconSizeLarge: 36,
  },
};
export const nightForestTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E7D32',  // глубокий зелёный
    accent: '#76FF03',  // салатовый
    background: '#1B1F1E',  // цвет хвои ночью
    surface: '#263238',  // угольно-зелёный
    text: '#C8E6C9',  // мятный светлый
    onSurface: '#4CAF50',  // яркий травяной
    error: '#FF5252',  // ярко-красный
  },
  roundness: 8,
  sizes: {
    iconSizeSmall: 18,
    iconSizeMedium: 26,
    iconSizeLarge: 34,
  },
};

export const darkOceanTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0288D1',  // насыщенный морской синий
    accent: '#00BCD4',  // бирюзовый акцент
    background: '#0D1B2A',  // тёмный океанический фон
    surface: '#1B263B',  // глубокий синий
    text: '#B3E5FC',  // голубой ледяной
    onSurface: '#29B6F6',  // аквамарин
    error: '#FF5722',  // ярко-оранжевый
  },
  roundness: 10,
  sizes: {
    iconSizeSmall: 20,
    iconSizeMedium: 28,
    iconSizeLarge: 36,
  },
};

