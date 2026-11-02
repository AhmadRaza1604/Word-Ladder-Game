class Level {
  final int id;
  final String title;
  final int wordLength;
  final String startWord;
  final String targetWord;
  final int optimalMoves;
  final int maxMoves;
  final int tier;
  final String hintClue;
  final List<String> verifiedPath;

  const Level({
    required this.id,
    required this.title,
    required this.wordLength,
    required this.startWord,
    required this.targetWord,
    required this.optimalMoves,
    required this.maxMoves,
    required this.tier,
    required this.hintClue,
    required this.verifiedPath,
  });
}

class LevelRepository {
  static const List<Level> levels = [
    // Tier 1 (3 letters)
    Level(id: 1, title: 'Cat to Dog', wordLength: 3, startWord: 'CAT', targetWord: 'DOG', optimalMoves: 3, maxMoves: 7, tier: 1, hintClue: 'CAT -> COT -> DOT -> DOG', verifiedPath: ['CAT', 'COT', 'DOT', 'DOG']),
    Level(id: 2, title: 'Bad to God', wordLength: 3, startWord: 'BAD', targetWord: 'GOD', optimalMoves: 3, maxMoves: 6, tier: 1, hintClue: 'BAD -> BED -> ROD -> GOD', verifiedPath: ['BAD', 'BED', 'ROD', 'GOD']),
    Level(id: 3, title: 'Car to Van', wordLength: 3, startWord: 'CAR', targetWord: 'VAN', optimalMoves: 2, maxMoves: 5, tier: 1, hintClue: 'CAR -> CAN -> VAN', verifiedPath: ['CAR', 'CAN', 'VAN']),
    Level(id: 4, title: 'Hat to Cap', wordLength: 3, startWord: 'HAT', targetWord: 'CAP', optimalMoves: 2, maxMoves: 5, tier: 1, hintClue: 'HAT -> CAT -> CAP', verifiedPath: ['HAT', 'CAT', 'CAP']),
    Level(id: 5, title: 'Cry to Joy', wordLength: 3, startWord: 'CRY', targetWord: 'JOY', optimalMoves: 2, maxMoves: 5, tier: 1, hintClue: 'CRY -> COY -> JOY', verifiedPath: ['CRY', 'COY', 'JOY']),
    Level(id: 6, title: 'Run to Jog', wordLength: 3, startWord: 'RUN', targetWord: 'JOG', optimalMoves: 4, maxMoves: 8, tier: 1, hintClue: 'RUN -> BUN -> BUG -> BOG -> JOG', verifiedPath: ['RUN', 'BUN', 'BUG', 'BOG', 'JOG']),
    Level(id: 7, title: 'Sit to Run', wordLength: 3, startWord: 'SIT', targetWord: 'RUN', optimalMoves: 3, maxMoves: 6, tier: 1, hintClue: 'SIT -> SIN -> SUN -> RUN', verifiedPath: ['SIT', 'SIN', 'SUN', 'RUN']),
    Level(id: 8, title: 'Day to Eve', wordLength: 3, startWord: 'DAY', targetWord: 'EVE', optimalMoves: 3, maxMoves: 6, tier: 1, hintClue: 'DAY -> DYE -> EYE -> EVE', verifiedPath: ['DAY', 'DYE', 'EYE', 'EVE']),
    Level(id: 9, title: 'Win to Tie', wordLength: 3, startWord: 'WIN', targetWord: 'TIE', optimalMoves: 2, maxMoves: 5, tier: 1, hintClue: 'WIN -> TIN -> TIE', verifiedPath: ['WIN', 'TIN', 'TIE']),
    Level(id: 10, title: 'Sun to Ray', wordLength: 3, startWord: 'SUN', targetWord: 'RAY', optimalMoves: 3, maxMoves: 6, tier: 1, hintClue: 'SUN -> RUN -> RAN -> RAY', verifiedPath: ['SUN', 'RUN', 'RAN', 'RAY']),
    Level(id: 11, title: 'Pig to Cow', wordLength: 3, startWord: 'PIG', targetWord: 'COW', optimalMoves: 4, maxMoves: 8, tier: 1, hintClue: 'PIG -> BIG -> BOG -> COG -> COW', verifiedPath: ['PIG', 'BIG', 'BOG', 'COG', 'COW']),
    Level(id: 12, title: 'Bed to Cot', wordLength: 3, startWord: 'BED', targetWord: 'COT', optimalMoves: 4, maxMoves: 8, tier: 1, hintClue: 'BED -> LED -> LET -> LOT -> COT', verifiedPath: ['BED', 'LED', 'LET', 'LOT', 'COT']),
    Level(id: 13, title: 'Hot to Tea', wordLength: 3, startWord: 'HOT', targetWord: 'TEA', optimalMoves: 4, maxMoves: 8, tier: 1, hintClue: 'HOT -> HAT -> HAY -> SAY -> SEA -> TEA', verifiedPath: ['HOT', 'HAT', 'HAY', 'SAY', 'SEA', 'TEA']),
    Level(id: 14, title: 'Sun to Ice', wordLength: 3, startWord: 'SUN', targetWord: 'ICE', optimalMoves: 5, maxMoves: 9, tier: 1, hintClue: 'SUN -> SIN -> SIP -> PIP -> PIE -> ICE', verifiedPath: ['SUN', 'SIN', 'SIP', 'PIP', 'PIE', 'ICE']),
    Level(id: 15, title: 'Arm to Leg', wordLength: 3, startWord: 'ARM', targetWord: 'LEG', optimalMoves: 5, maxMoves: 9, tier: 1, hintClue: 'ARM -> AIM -> AID -> LID -> LED -> LEG', verifiedPath: ['ARM', 'AIM', 'AID', 'LID', 'LED', 'LEG']),

    // Tier 2 (4 letters)
    Level(id: 16, title: 'Cold to Warm', wordLength: 4, startWord: 'COLD', targetWord: 'WARM', optimalMoves: 4, maxMoves: 8, tier: 2, hintClue: 'COLD -> CORD -> CARD -> WARD -> WARM', verifiedPath: ['COLD', 'CORD', 'CARD', 'WARD', 'WARM']),
    Level(id: 17, title: 'Case to Take', wordLength: 4, startWord: 'CASE', targetWord: 'TAKE', optimalMoves: 3, maxMoves: 6, tier: 2, hintClue: 'CASE -> BASE -> BAKE -> TAKE', verifiedPath: ['CASE', 'BASE', 'BAKE', 'TAKE']),
    Level(id: 18, title: 'Lead to Gold', wordLength: 4, startWord: 'LEAD', targetWord: 'GOLD', optimalMoves: 3, maxMoves: 6, tier: 2, hintClue: 'LEAD -> LOAD -> GOAD -> GOLD', verifiedPath: ['LEAD', 'LOAD', 'GOAD', 'GOLD']),
    Level(id: 19, title: 'Bird to Wing', wordLength: 4, startWord: 'BIRD', targetWord: 'WING', optimalMoves: 3, maxMoves: 6, tier: 2, hintClue: 'BIRD -> BIND -> WIND -> WING', verifiedPath: ['BIRD', 'BIND', 'WIND', 'WING']),
    Level(id: 20, title: 'Gold to Coin', wordLength: 4, startWord: 'GOLD', targetWord: 'COIN', optimalMoves: 4, maxMoves: 8, tier: 2, hintClue: 'GOLD -> COLD -> CORD -> CORN -> COIN', verifiedPath: ['GOLD', 'COLD', 'CORD', 'CORN', 'COIN']),
    Level(id: 21, title: 'Dark to Dawn', wordLength: 4, startWord: 'DARK', targetWord: 'DAWN', optimalMoves: 3, maxMoves: 6, tier: 2, hintClue: 'DARK -> DART -> DARN -> DAWN', verifiedPath: ['DARK', 'DART', 'DARN', 'DAWN']),
    Level(id: 22, title: 'Fire to Cold', wordLength: 4, startWord: 'FIRE', targetWord: 'COLD', optimalMoves: 4, maxMoves: 8, tier: 2, hintClue: 'FIRE -> FORE -> FORD -> CORD -> COLD', verifiedPath: ['FIRE', 'FORE', 'FORD', 'CORD', 'COLD']),
    Level(id: 23, title: 'Soup to Bowl', wordLength: 4, startWord: 'SOUP', targetWord: 'BOWL', optimalMoves: 4, maxMoves: 8, tier: 2, hintClue: 'SOUP -> SOUL -> FOUL -> FOWL -> BOWL', verifiedPath: ['SOUP', 'SOUL', 'FOUL', 'FOWL', 'BOWL']),
    Level(id: 24, title: 'Safe to Lock', wordLength: 4, startWord: 'SAFE', targetWord: 'LOCK', optimalMoves: 5, maxMoves: 9, tier: 2, hintClue: 'SAFE -> SAKE -> LAKE -> LACE -> LACK -> LOCK', verifiedPath: ['SAFE', 'SAKE', 'LAKE', 'LACE', 'LACK', 'LOCK']),
    Level(id: 25, title: 'Warm to Cool', wordLength: 4, startWord: 'WARM', targetWord: 'COOL', optimalMoves: 5, maxMoves: 9, tier: 2, hintClue: 'WARM -> WORM -> WORD -> WOOD -> WOOL -> COOL', verifiedPath: ['WARM', 'WORM', 'WORD', 'WOOD', 'WOOL', 'COOL']),
    Level(id: 26, title: 'Head to Tail', wordLength: 4, startWord: 'HEAD', targetWord: 'TAIL', optimalMoves: 5, maxMoves: 9, tier: 2, hintClue: 'HEAD -> HEAL -> TEAL -> TELL -> TALL -> TAIL', verifiedPath: ['HEAD', 'HEAL', 'TEAL', 'TELL', 'TALL', 'TAIL']),
    Level(id: 27, title: 'Love to Hate', wordLength: 4, startWord: 'LOVE', targetWord: 'HATE', optimalMoves: 3, maxMoves: 6, tier: 2, hintClue: 'LOVE -> HOVE -> HAVE -> HATE', verifiedPath: ['LOVE', 'HOVE', 'HAVE', 'HATE']),
    Level(id: 28, title: 'Cake to Pies', wordLength: 4, startWord: 'CAKE', targetWord: 'PIES', optimalMoves: 5, maxMoves: 9, tier: 2, hintClue: 'CAKE -> CANE -> PANE -> PINE -> PINS -> PIES', verifiedPath: ['CAKE', 'CANE', 'PANE', 'PINE', 'PINS', 'PIES']),
    Level(id: 29, title: 'Ship to Boat', wordLength: 4, startWord: 'SHIP', targetWord: 'BOAT', optimalMoves: 6, maxMoves: 10, tier: 2, hintClue: 'SHIP -> SLIP -> SLOP -> SLOT -> SOOT -> BOOT -> BOAT', verifiedPath: ['SHIP', 'SLIP', 'SLOP', 'SLOT', 'SOOT', 'BOOT', 'BOAT']),
    Level(id: 30, title: 'Book to Page', wordLength: 4, startWord: 'BOOK', targetWord: 'PAGE', optimalMoves: 6, maxMoves: 10, tier: 2, hintClue: 'BOOK -> COOK -> CORK -> CORE -> CARE -> CAGE -> PAGE', verifiedPath: ['BOOK', 'COOK', 'CORK', 'CORE', 'CARE', 'CAGE', 'PAGE']),
    Level(id: 31, title: 'Race to Beat', wordLength: 4, startWord: 'RACE', targetWord: 'BEAT', optimalMoves: 6, maxMoves: 10, tier: 2, hintClue: 'RACE -> FACE -> FACT -> FAST -> FEST -> BEST -> BEAT', verifiedPath: ['RACE', 'FACE', 'FACT', 'FAST', 'FEST', 'BEST', 'BEAT']),
    Level(id: 32, title: 'Tree to Leaf', wordLength: 4, startWord: 'TREE', targetWord: 'LEAF', optimalMoves: 7, maxMoves: 11, tier: 2, hintClue: 'TREE -> FREE -> FRET -> FEET -> FEAT -> FEAR -> LEAR -> LEAF', verifiedPath: ['TREE', 'FREE', 'FRET', 'FEET', 'FEAT', 'FEAR', 'LEAR', 'LEAF']),
    Level(id: 33, title: 'Time to Year', wordLength: 4, startWord: 'TIME', targetWord: 'YEAR', optimalMoves: 7, maxMoves: 12, tier: 2, hintClue: 'TIME -> TILE -> TILL -> HILL -> HELL -> HEAL -> HEAR -> YEAR', verifiedPath: ['TIME', 'TILE', 'TILL', 'HILL', 'HELL', 'HEAL', 'HEAR', 'YEAR']),
    Level(id: 34, title: 'Road to Path', wordLength: 4, startWord: 'ROAD', targetWord: 'PATH', optimalMoves: 7, maxMoves: 12, tier: 2, hintClue: 'ROAD -> READ -> REAL -> PEAL -> PEAS -> PETS -> PATS -> PATH', verifiedPath: ['ROAD', 'READ', 'REAL', 'PEAL', 'PEAS', 'PETS', 'PATS', 'PATH']),
    Level(id: 35, title: 'Moon to Suns', wordLength: 4, startWord: 'MOON', targetWord: 'SUNS', optimalMoves: 7, maxMoves: 12, tier: 2, hintClue: 'MOON -> MORN -> TORN -> TORE -> TONE -> TONS -> SONS -> SUNS', verifiedPath: ['MOON', 'MORN', 'TORN', 'TORE', 'TONE', 'TONS', 'SONS', 'SUNS']),
    Level(id: 36, title: 'Work to Play', wordLength: 4, startWord: 'WORK', targetWord: 'PLAY', optimalMoves: 6, maxMoves: 10, tier: 2, hintClue: 'WORK -> PORK -> PARK -> PART -> PANT -> PLAT -> PLAY', verifiedPath: ['WORK', 'PORK', 'PARK', 'PART', 'PANT', 'PLAT', 'PLAY']),
    Level(id: 37, title: 'Fish to Bird', wordLength: 4, startWord: 'FISH', targetWord: 'BIRD', optimalMoves: 6, maxMoves: 10, tier: 2, hintClue: 'FISH -> FIST -> MIST -> MINT -> BINT -> BIND -> BIRD', verifiedPath: ['FISH', 'FIST', 'MIST', 'MINT', 'BINT', 'BIND', 'BIRD']),
    Level(id: 38, title: 'East to West', wordLength: 4, startWord: 'EAST', targetWord: 'WEST', optimalMoves: 4, maxMoves: 8, tier: 2, hintClue: 'EAST -> PAST -> PEST -> REST -> WEST', verifiedPath: ['EAST', 'PAST', 'PEST', 'REST', 'WEST']),
    Level(id: 39, title: 'Sand to Dust', wordLength: 4, startWord: 'SAND', targetWord: 'DUST', optimalMoves: 5, maxMoves: 9, tier: 2, hintClue: 'SAND -> LAND -> LARD -> DART -> DUST', verifiedPath: ['SAND', 'LAND', 'LARD', 'DART', 'DUST']),
    Level(id: 40, title: 'Wild to Tame', wordLength: 4, startWord: 'WILD', targetWord: 'TAME', optimalMoves: 5, maxMoves: 9, tier: 2, hintClue: 'WILD -> WILE -> MILE -> MALE -> TALE -> TAME', verifiedPath: ['WILD', 'WILE', 'MILE', 'MALE', 'TALE', 'TAME']),

    // Tier 3 (5 letters)
    Level(id: 41, title: 'Black to Blank', wordLength: 5, startWord: 'BLACK', targetWord: 'BLANK', optimalMoves: 1, maxMoves: 4, tier: 3, hintClue: 'A single letter swap', verifiedPath: ['BLACK', 'BLANK']),
    Level(id: 42, title: 'Light to Sight', wordLength: 5, startWord: 'LIGHT', targetWord: 'SIGHT', optimalMoves: 1, maxMoves: 4, tier: 3, hintClue: 'Swap initial letter', verifiedPath: ['LIGHT', 'SIGHT']),
    Level(id: 43, title: 'Pride to Prize', wordLength: 5, startWord: 'PRIDE', targetWord: 'PRIZE', optimalMoves: 1, maxMoves: 4, tier: 3, hintClue: 'Change to Z', verifiedPath: ['PRIDE', 'PRIZE']),
    Level(id: 44, title: 'Round to Sound', wordLength: 5, startWord: 'ROUND', targetWord: 'SOUND', optimalMoves: 1, maxMoves: 4, tier: 3, hintClue: 'Swap R for S', verifiedPath: ['ROUND', 'SOUND']),
    Level(id: 45, title: 'Track to Train', wordLength: 5, startWord: 'TRACK', targetWord: 'TRAIN', optimalMoves: 3, maxMoves: 7, tier: 3, hintClue: 'TRACK -> TRACT -> TRAIT -> TRAIN', verifiedPath: ['TRACK', 'TRACT', 'TRAIT', 'TRAIN']),
    Level(id: 46, title: 'Crane to Train', wordLength: 5, startWord: 'CRANE', targetWord: 'TRAIN', optimalMoves: 6, maxMoves: 11, tier: 3, hintClue: 'CRANE -> CRANK -> CRACK -> TRACK -> TRACT -> TRAIT -> TRAIN', verifiedPath: ['CRANE', 'CRANK', 'CRACK', 'TRACK', 'TRACT', 'TRAIT', 'TRAIN']),
    Level(id: 47, title: 'Bread to Toast', wordLength: 5, startWord: 'BREAD', targetWord: 'TOAST', optimalMoves: 6, maxMoves: 12, tier: 3, hintClue: 'BREAD -> TREAD -> TREAT -> TRAIT -> TRACT -> TRAST -> TOAST', verifiedPath: ['BREAD', 'TREAD', 'TREAT', 'TRAIT', 'TRACT', 'TRAST', 'TOAST']),
    Level(id: 48, title: 'Black to White', wordLength: 5, startWord: 'BLACK', targetWord: 'WHITE', optimalMoves: 7, maxMoves: 13, tier: 3, hintClue: 'BLACK -> BLANK -> BLINK -> CLINK -> CHINK -> CHINE -> SHINE -> WHITE', verifiedPath: ['BLACK', 'BLANK', 'BLINK', 'CLINK', 'CHINK', 'CHINE', 'SHINE', 'WHITE']),
    Level(id: 49, title: 'Smart to Brain', wordLength: 5, startWord: 'SMART', targetWord: 'BRAIN', optimalMoves: 5, maxMoves: 10, tier: 3, hintClue: 'SMART -> START -> STARE -> SPARE -> SPAIN -> BRAIN', verifiedPath: ['SMART', 'START', 'STARE', 'SPARE', 'SPAIN', 'BRAIN']),
    Level(id: 50, title: 'River to Water', wordLength: 5, startWord: 'RIVER', targetWord: 'WATER', optimalMoves: 6, maxMoves: 11, tier: 3, hintClue: 'RIVER -> RIDER -> AIDED -> DATED -> HATER -> WATER', verifiedPath: ['RIVER', 'RIDER', 'AIDED', 'DATED', 'HATER', 'WATER']),
    Level(id: 51, title: 'Sleep to Dream', wordLength: 5, startWord: 'SLEEP', targetWord: 'DREAM', optimalMoves: 7, maxMoves: 13, tier: 3, hintClue: 'SLEEP -> SLEEK -> SPECK -> SPEAK -> SPEAR -> SMEAR -> STREAM -> DREAM', verifiedPath: ['SLEEP', 'SLEEK', 'SPECK', 'SPEAK', 'SPEAR', 'SMEAR', 'STREAM', 'DREAM']),
    Level(id: 52, title: 'Heart to Peace', wordLength: 5, startWord: 'HEART', targetWord: 'PEACE', optimalMoves: 6, maxMoves: 12, tier: 3, hintClue: 'HEART -> HEARD -> BEARD -> BEARL -> PEARL -> PLACE -> PEACE', verifiedPath: ['HEART', 'HEARD', 'BEARD', 'BEARL', 'PEARL', 'PLACE', 'PEACE']),
  ];

  static Level? getById(int id) {
    try {
      return levels.firstWhere((l) => l.id == id);
    } catch (_) {
      return null;
    }
  }

  static List<Level> getByTier(int tier) {
    return levels.where((l) => l.tier == tier).toList();
  }
}
