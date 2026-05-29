// Lightweight i18n — 4 languages, no URL routing, persisted in localStorage.

export type Locale = 'es' | 'en' | 'fr' | 'pt'

export const LOCALES: Locale[] = ['es', 'en', 'fr', 'pt']
export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_LABELS: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  pt: 'Português',
}

// Short tag shown in the compact selector
export const LOCALE_SHORT: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  fr: 'FR',
  pt: 'PT',
}

const en = {
  score: 'Score',
  best: 'Best',
  grid: 'Grid',
  mode: 'Mode',
  modeClassic: 'Classic',
  modeTimed: 'Timed',
  modeClassicDesc: 'No time limit',
  modeTimedDesc: '90 seconds',
  modeFluid: 'Fluid',
  modeFluidDesc: 'Smart tiles',
  newGame: 'New Game',
  undoTitle: 'Undo',
  themeToLight: 'Switch to light mode',
  themeToDark: 'Switch to dark mode',
  movesTitle: 'Total moves',
  timeLeftTitle: 'Time remaining',
  tagline: 'Join the numbers and get to the 4096 tile!',
  howToPlayTitle: 'HOW TO PLAY:',
  howToPlayBody:
    'Use your arrow keys or WASD to move the tiles. When two tiles with the same number touch, they merge into one! Reach the 4096 tile to win.',
  swipeHint: 'Swipe to move tiles',
  win: 'You Win!',
  gameOver: 'Game Over',
  winSubtitle: 'You reached the 4096 tile!',
  keepGoing: 'Keep Going',
  topScores: 'Top Scores',
  confirmGridTitle: 'Change grid size',
  confirmGridMessage:
    'Changing the grid size will start a new game and you will lose all current progress. Do you want to continue?',
  confirmModeTitle: 'Change game mode',
  confirmModeMessage:
    'Changing the game mode will start a new game and you will lose all current progress. Do you want to continue?',
  accept: 'Confirm',
  cancel: 'Cancel',
  language: 'Language',
  timerPresetTitle: 'Select preset time',
  timerInputTitle: 'Seconds (10-600)',
}

export type TranslationKey = keyof typeof en

const es: Record<TranslationKey, string> = {
  score: 'Puntos',
  best: 'Récord',
  grid: 'Tablero',
  mode: 'Modo',
  modeClassic: 'Clásico',
  modeTimed: 'Contrarreloj',
  modeClassicDesc: 'Sin límite de tiempo',
  modeTimedDesc: '90 segundos',
  modeFluid: 'Fluido',
  modeFluidDesc: 'Fichas inteligentes',
  newGame: 'Nuevo juego',
  undoTitle: 'Deshacer',
  themeToLight: 'Cambiar a modo claro',
  themeToDark: 'Cambiar a modo oscuro',
  movesTitle: 'Movimientos totales',
  timeLeftTitle: 'Tiempo restante',
  tagline: '¡Une los números y llega a la ficha 4096!',
  howToPlayTitle: 'CÓMO JUGAR:',
  howToPlayBody:
    'Usa las teclas de flecha o WASD para mover las fichas. Cuando dos fichas con el mismo número se tocan, ¡se fusionan en una! Llega a la ficha 4096 para ganar.',
  swipeHint: 'Desliza para mover las fichas',
  win: '¡Ganaste!',
  gameOver: 'Juego terminado',
  winSubtitle: '¡Alcanzaste la ficha 4096!',
  keepGoing: 'Seguir jugando',
  topScores: 'Mejores puntajes',
  confirmGridTitle: 'Cambiar tamaño del tablero',
  confirmGridMessage:
    'Al cambiar el tamaño del tablero se iniciará un nuevo juego y perderás todo el progreso actual. ¿Deseas continuar?',
  confirmModeTitle: 'Cambiar modo de juego',
  confirmModeMessage:
    'Al cambiar el modo de juego se iniciará un nuevo juego y perderás todo el progreso actual. ¿Deseas continuar?',
  accept: 'Aceptar',
  cancel: 'Cancelar',
  language: 'Idioma',
  timerPresetTitle: 'Seleccionar tiempo predefinido',
  timerInputTitle: 'Segundos (10-600)',
}

const fr: Record<TranslationKey, string> = {
  score: 'Score',
  best: 'Record',
  grid: 'Grille',
  mode: 'Mode',
  modeClassic: 'Classique',
  modeTimed: 'Chronométré',
  modeClassicDesc: 'Sans limite de temps',
  modeTimedDesc: '90 secondes',
  modeFluid: 'Fluide',
  modeFluidDesc: 'Tuiles intelligentes',
  newGame: 'Nouvelle partie',
  undoTitle: 'Annuler',
  themeToLight: 'Passer en mode clair',
  themeToDark: 'Passer en mode sombre',
  movesTitle: 'Coups au total',
  timeLeftTitle: 'Temps restant',
  tagline: 'Associez les nombres et atteignez la tuile 4096 !',
  howToPlayTitle: 'COMMENT JOUER :',
  howToPlayBody:
    'Utilisez les touches fléchées ou ZQSD pour déplacer les tuiles. Quand deux tuiles avec le même nombre se touchent, elles fusionnent en une seule ! Atteignez la tuile 4096 pour gagner.',
  swipeHint: 'Glissez pour déplacer les tuiles',
  win: 'Gagné !',
  gameOver: 'Partie terminée',
  winSubtitle: 'Vous avez atteint la tuile 4096 !',
  keepGoing: 'Continuer',
  topScores: 'Meilleurs scores',
  confirmGridTitle: 'Changer la taille de la grille',
  confirmGridMessage:
    'Changer la taille de la grille démarrera une nouvelle partie et vous perdrez toute la progression actuelle. Voulez-vous continuer ?',
  confirmModeTitle: 'Changer le mode de jeu',
  confirmModeMessage:
    'Changer le mode de jeu démarrera une nouvelle partie et vous perdrez toute la progression actuelle. Voulez-vous continuer ?',
  accept: 'Confirmer',
  cancel: 'Annuler',
  language: 'Langue',
  timerPresetTitle: 'Sélectionner un temps prédéfini',
  timerInputTitle: 'Secondes (10-600)',
}

const pt: Record<TranslationKey, string> = {
  score: 'Pontos',
  best: 'Recorde',
  grid: 'Tabuleiro',
  mode: 'Modo',
  modeClassic: 'Clássico',
  modeTimed: 'Contra o tempo',
  modeClassicDesc: 'Sem limite de tempo',
  modeTimedDesc: '90 segundos',
  modeFluid: 'Fluido',
  modeFluidDesc: 'Peças inteligentes',
  newGame: 'Novo jogo',
  undoTitle: 'Desfazer',
  themeToLight: 'Mudar para o modo claro',
  themeToDark: 'Mudar para o modo escuro',
  movesTitle: 'Total de movimentos',
  timeLeftTitle: 'Tempo restante',
  tagline: 'Junte os números e chegue à peça 4096!',
  howToPlayTitle: 'COMO JOGAR:',
  howToPlayBody:
    'Use as teclas de seta ou WASD para mover as peças. Quando duas peças com o mesmo número se tocam, elas se fundem em uma! Chegue à peça 4096 para vencer.',
  swipeHint: 'Deslize para mover as peças',
  win: 'Você venceu!',
  gameOver: 'Fim de jogo',
  winSubtitle: 'Você alcançou a peça 4096!',
  keepGoing: 'Continuar jogando',
  topScores: 'Melhores pontuações',
  confirmGridTitle: 'Alterar tamanho do tabuleiro',
  confirmGridMessage:
    'Alterar o tamanho do tabuleiro iniciará um novo jogo e você perderá todo o progresso atual. Deseja continuar?',
  confirmModeTitle: 'Alterar modo de jogo',
  confirmModeMessage:
    'Alterar o modo de jogo iniciará um novo jogo e você perderá todo o progresso atual. Deseja continuar?',
  accept: 'Confirmar',
  cancel: 'Cancelar',
  language: 'Idioma',
  timerPresetTitle: 'Selecionar tempo predefinido',
  timerInputTitle: 'Segundos (10-600)',
}

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  en,
  es,
  fr,
  pt,
}

/** Detect language from the browser's configured languages (region preference). */
function detectFromNavigator(): Locale | null {
  if (typeof navigator === 'undefined') return null
  const langs =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language]
  for (const lang of langs) {
    if (!lang) continue
    const code = lang.toLowerCase().split('-')[0]
    if ((LOCALES as string[]).includes(code)) return code as Locale
  }
  return null
}

/**
 * Detect language from the device's approximate location (IANA timezone).
 * Timezone is available without any permission prompt and gives a coarse
 * geographic hint we can map to a language.
 */
function detectFromTimezone(): Locale | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (!tz) return null

    const ptZones = [
      'Sao_Paulo', 'Bahia', 'Fortaleza', 'Recife', 'Manaus', 'Belem',
      'Cuiaba', 'Porto_Velho', 'Boa_Vista', 'Maceio', 'Araguaina',
      'Santarem', 'Noronha', 'Rio_Branco', 'Lisbon', 'Azores', 'Madeira',
      'Luanda', 'Maputo', 'Bissau', 'Sao_Tome', 'Praia',
    ]
    const frZones = [
      'Paris', 'Brussels', 'Luxembourg', 'Monaco', 'Reunion', 'Martinique',
      'Guadeloupe', 'Cayenne', 'Noumea', 'Tahiti', 'Kerguelen',
      'Abidjan', 'Dakar', 'Bamako', 'Ouagadougou', 'Niamey', 'Kinshasa',
    ]
    const esZones = [
      'Madrid', 'Canary', 'Ceuta', 'Mexico_City', 'Cancun', 'Monterrey',
      'Tijuana', 'Merida', 'Chihuahua', 'Hermosillo', 'Mazatlan',
      'Bogota', 'Lima', 'Santiago', 'Caracas', 'La_Paz', 'Guayaquil',
      'Asuncion', 'Montevideo', 'Argentina', 'Buenos_Aires', 'Guatemala',
      'Tegucigalpa', 'Managua', 'Costa_Rica', 'Panama', 'El_Salvador',
      'Havana', 'Santo_Domingo',
    ]

    if (ptZones.some(z => tz.includes(z))) return 'pt'
    if (frZones.some(z => tz.includes(z))) return 'fr'
    if (esZones.some(z => tz.includes(z))) return 'es'
    return null
  } catch {
    return null
  }
}

/**
 * Resolve the initial locale when the user has not chosen one manually.
 * Priority: browser language preference → approximate location (timezone)
 * → English fallback.
 */
export function detectLocale(): Locale {
  return detectFromNavigator() ?? detectFromTimezone() ?? DEFAULT_LOCALE
}
