// =====================================================
//  汉字冒险 5.0 — Course & HSK Data Layer
// =====================================================

const COURSES = [
  { id:"c01", nameRu:"Первые числа", desc:"Научись считать от 1 до 10 на китайском!", icon:"1️⃣",
    storyPre:"Дракон Чисел украл все цифры из Китайского королевства! Помоги вернуть их!", storyPost:"Ура! Ты вернул цифры в королевство! Теперь все могут считать по-китайски!", bossLine:"Ха-ха! Попробуй узнать иероглифы без пиньиня!",
    lesson:{ category:"Числа", categoryZh:"数字", bossEmoji:"🐉", bossName:"Дракон Чисел", skyColors:["#87CEEB","#E0F0FF"], groundColor:"#4CAF50", theme:"grass",
      words:[
        {hanzi:"一",pinyin:"yī",ru:"один",difficulty:"easy",emoji:"1️⃣",example:"一个",exampleRu:"один (штук)"},
        {hanzi:"二",pinyin:"èr",ru:"два",difficulty:"easy",emoji:"2️⃣",example:"二十",exampleRu:"двадцать"},
        {hanzi:"三",pinyin:"sān",ru:"три",difficulty:"easy",emoji:"3️⃣",example:"三月",exampleRu:"март"},
        {hanzi:"四",pinyin:"sì",ru:"четыре",difficulty:"easy",emoji:"4️⃣",example:"四季",exampleRu:"четыре сезона"},
        {hanzi:"五",pinyin:"wǔ",ru:"пять",difficulty:"easy",emoji:"5️⃣",example:"五月",exampleRu:"май"},
        {hanzi:"六",pinyin:"liù",ru:"шесть",difficulty:"medium",emoji:"6️⃣",example:"六月",exampleRu:"июнь"},
        {hanzi:"七",pinyin:"qī",ru:"семь",difficulty:"medium",emoji:"7️⃣",example:"七月",exampleRu:"июль"},
        {hanzi:"八",pinyin:"bā",ru:"восемь",difficulty:"medium",emoji:"8️⃣",example:"八月",exampleRu:"август"},
        {hanzi:"九",pinyin:"jiǔ",ru:"девять",difficulty:"hard",emoji:"9️⃣",example:"九月",exampleRu:"сентябрь"},
        {hanzi:"十",pinyin:"shí",ru:"десять",difficulty:"hard",emoji:"🔟",example:"十个",exampleRu:"десять штук"}
      ]}},

  { id:"pronouns", nameRu:"Местоимения", desc:"学会说我、你、他", icon:"🙋", storyPre:"Хранитель Местоимений потерял слова! Помоги вернуть их!", storyPost:"Теперь ты умеешь говорить 'я', 'ты', 'он'! Отлично!", bossLine:"Покажи, что знаешь кто есть кто!",
    lesson:{ category:"Местоимения", categoryZh:"代词", bossEmoji:"🦁", bossName:"Лев Местоимений", skyColors:["#FFE4B5","#FFF8DC"], groundColor:"#8D6E63", theme:"cozy",
      words:[
        {hanzi:"我",pinyin:"wǒ",ru:"я",difficulty:"easy",emoji:"🙋",example:"我的",exampleRu:"мой"},
        {hanzi:"你",pinyin:"nǐ",ru:"ты",difficulty:"easy",emoji:"👉",example:"你好",exampleRu:"привет"},
        {hanzi:"他",pinyin:"tā",ru:"он",difficulty:"easy",emoji:"👦",example:"他们",exampleRu:"они"},
        {hanzi:"她",pinyin:"tā",ru:"она",difficulty:"medium",emoji:"👧",example:"她们",exampleRu:"они (жен.)"},
        {hanzi:"人",pinyin:"rén",ru:"человек",difficulty:"easy",emoji:"🧑",example:"大人",exampleRu:"взрослый"},
        {hanzi:"大",pinyin:"dà",ru:"большой",difficulty:"easy",emoji:"⬆️",example:"大人",exampleRu:"взрослый"},
        {hanzi:"小",pinyin:"xiǎo",ru:"маленький",difficulty:"easy",emoji:"⬇️",example:"小鸟",exampleRu:"птичка"},
        {hanzi:"这",pinyin:"zhè",ru:"это/этот",difficulty:"medium",emoji:"👈",example:"这个",exampleRu:"этот"},
        {hanzi:"那",pinyin:"nà",ru:"то/тот",difficulty:"medium",emoji:"👉",example:"那个",exampleRu:"тот"},
        {hanzi:"谁",pinyin:"shéi",ru:"кто",difficulty:"medium",emoji:"❓",example:"是谁",exampleRu:"кто это"}
      ]}},

  { id:"verbs1", nameRu:"Глаголы 1", desc:"Базовые глаголы: есть, быть, мочь", icon:"🏃", storyPre:"Глаголы разбежались по всему лесу! Собери их!", storyPost:"Теперь ты знаешь важные глаголы!", bossLine:"Проверим, помнишь ли ты глаголы!",
    lesson:{ category:"Глаголы", categoryZh:"动词", bossEmoji:"🐺", bossName:"Волк Глаголов", skyColors:["#B0E0E6","#E0F7FA"], groundColor:"#2E7D32", theme:"forest",
      words:[
        {hanzi:"是",pinyin:"shì",ru:"быть/есть",difficulty:"easy",emoji:"✅",example:"是的",exampleRu:"да"},
        {hanzi:"有",pinyin:"yǒu",ru:"иметь",difficulty:"easy",emoji:"🤲",example:"有人",exampleRu:"есть люди"},
        {hanzi:"在",pinyin:"zài",ru:"находиться",difficulty:"easy",emoji:"📍",example:"在家",exampleRu:"дома"},
        {hanzi:"去",pinyin:"qù",ru:"идти/ехать",difficulty:"easy",emoji:"🚶",example:"去学校",exampleRu:"идти в школу"},
        {hanzi:"来",pinyin:"lái",ru:"приходить",difficulty:"easy",emoji:"👋",example:"来吧",exampleRu:"давай"},
        {hanzi:"吃",pinyin:"chī",ru:"есть (пищу)",difficulty:"easy",emoji:"🍽️",example:"吃饭",exampleRu:"есть (приём пищи)"},
        {hanzi:"喝",pinyin:"hē",ru:"пить",difficulty:"easy",emoji:"🥤",example:"喝水",exampleRu:"пить воду"},
        {hanzi:"看",pinyin:"kàn",ru:"смотреть",difficulty:"easy",emoji:"👀",example:"看书",exampleRu:"читать книгу"},
        {hanzi:"听",pinyin:"tīng",ru:"слушать",difficulty:"medium",emoji:"👂",example:"听音乐",exampleRu:"слушать музыку"},
        {hanzi:"说",pinyin:"shuō",ru:"говорить",difficulty:"medium",emoji:"🗣️",example:"说话",exampleRu:"говорить"},
        {hanzi:"想",pinyin:"xiǎng",ru:"думать/хотеть",difficulty:"medium",emoji:"💭",example:"想你",exampleRu:"скучать по тебе"},
        {hanzi:"知道",pinyin:"zhīdào",ru:"знать",difficulty:"medium",emoji:"💡",example:"知道吗",exampleRu:"знаешь ли"}
      ]}},

  { id:"adj1", nameRu:"Прилагательные", desc:"Хороший, плохой, красивый", icon:"🌈", storyPre:"Описания потерялись! Без них всё серое!", storyPost:"Теперь мир снова красочный!", bossLine:"Угадай описания!",
    lesson:{ category:"Прилагательные", categoryZh:"形容词", bossEmoji:"🦄", bossName:"Единорог Описаний", skyColors:["#E8F5E9","#F1F8E9"], groundColor:"#66BB6A", theme:"grass",
      words:[
        {hanzi:"好",pinyin:"hǎo",ru:"хороший",difficulty:"easy",emoji:"👍",example:"你好",exampleRu:"привет"},
        {hanzi:"不好",pinyin:"bù hǎo",ru:"плохой",difficulty:"easy",emoji:"👎",example:"不好吃",exampleRu:"невкусно"},
        {hanzi:"多",pinyin:"duō",ru:"много",difficulty:"easy",emoji:"➕",example:"很多",exampleRu:"очень много"},
        {hanzi:"少",pinyin:"shǎo",ru:"мало",difficulty:"easy",emoji:"➖",example:"不少",exampleRu:"недостаточно"},
        {hanzi:"热",pinyin:"rè",ru:"горячий/жарко",difficulty:"medium",emoji:"🔥",example:"很热",exampleRu:"очень жарко"},
        {hanzi:"冷",pinyin:"lěng",ru:"холодный",difficulty:"medium",emoji:"❄️",example:"很冷",exampleRu:"очень холодно"},
        {hanzi:"快",pinyin:"kuài",ru:"быстрый",difficulty:"medium",emoji:"⚡",example:"快走",exampleRu:"быстро идти"},
        {hanzi:"慢",pinyin:"màn",ru:"медленный",difficulty:"medium",emoji:"🐢",example:"慢一点",exampleRu:"помедленнее"},
        {hanzi:"高兴",pinyin:"gāoxìng",ru:"радостный",difficulty:"hard",emoji:"😊",example:"很高兴",exampleRu:"очень рад"},
        {hanzi:"漂亮",pinyin:"piàoliang",ru:"красивый",difficulty:"hard",emoji:"✨",example:"很漂亮",exampleRu:"очень красиво"}
      ]}},

  { id:"time", nameRu:"Время", desc:"Сегодня, завтра, вчера", icon:"⏰", storyPre:"Время остановилось! Верни слова времени!", storyPost:"Теперь ты знаешь когда!", bossLine:"Проверим, знаешь ли ты время!",
    lesson:{ category:"Время", categoryZh:"时间", bossEmoji:"⏰", bossName:"Страж Времени", skyColors:["#E1BEE7","#F3E5F5"], groundColor:"#7B1FA2", theme:"cozy",
      words:[
        {hanzi:"今天",pinyin:"jīntiān",ru:"сегодня",difficulty:"easy",emoji:"📅",example:"今天好",exampleRu:"сегодня хорошо"},
        {hanzi:"明天",pinyin:"míngtiān",ru:"завтра",difficulty:"easy",emoji:"➡️",example:"明天见",exampleRu:"увидимся завтра"},
        {hanzi:"昨天",pinyin:"zuótiān",ru:"вчера",difficulty:"easy",emoji:"⬅️",example:"昨天好",exampleRu:"вчера было хорошо"},
        {hanzi:"年",pinyin:"nián",ru:"год",difficulty:"easy",emoji:"📆",example:"新年",exampleRu:"Новый год"},
        {hanzi:"月",pinyin:"yuè",ru:"месяц/луна",difficulty:"easy",emoji:"🌙",example:"一月",exampleRu:"январь"},
        {hanzi:"日",pinyin:"rì",ru:"день/солнце",difficulty:"medium",emoji:"☀️",example:"日出",exampleRu:"восход"},
        {hanzi:"早上",pinyin:"zǎoshang",ru:"утро",difficulty:"medium",emoji:"🌅",example:"早上好",exampleRu:"доброе утро"},
        {hanzi:"晚上",pinyin:"wǎnshang",ru:"вечер",difficulty:"medium",emoji:"🌙",example:"晚上好",exampleRu:"добрый вечер"},
        {hanzi:"现在",pinyin:"xiànzài",ru:"сейчас",difficulty:"medium",emoji:"⏱️",example:"现在好",exampleRu:"сейчас хорошо"},
        {hanzi:"时候",pinyin:"shíhou",ru:"время/момент",difficulty:"hard",emoji:"⏳",example:"什么时候",exampleRu:"когда"}
      ]}},

  { id:"nature", nameRu:"Природа", desc:"Небо, гора, вода", icon:"🌿", storyPre:"Дракон Природы украл иероглифы! Верни их!", storyPost:"Природа снова в порядке! Ты настоящий герой!", bossLine:"Я не отдам иероглифы просто так!",
    lesson:{ category:"Природа", categoryZh:"自然", bossEmoji:"🐲", bossName:"Дракон Природы", skyColors:["#C8E6C9","#E8F5E9"], groundColor:"#2E7D32", theme:"forest",
      words:[
        {hanzi:"天",pinyin:"tiān",ru:"небо",difficulty:"easy",emoji:"🌤️",example:"天气",exampleRu:"погода"},
        {hanzi:"地",pinyin:"dì",ru:"земля",difficulty:"easy",emoji:"🌍",example:"地上",exampleRu:"на земле"},
        {hanzi:"山",pinyin:"shān",ru:"гора",difficulty:"easy",emoji:"⛰️",example:"大山",exampleRu:"большая гора"},
        {hanzi:"水",pinyin:"shuǐ",ru:"вода",difficulty:"easy",emoji:"💧",example:"喝水",exampleRu:"пить воду"},
        {hanzi:"火",pinyin:"huǒ",ru:"огонь",difficulty:"easy",emoji:"🔥",example:"火车",exampleRu:"поезд"},
        {hanzi:"木",pinyin:"mù",ru:"дерево",difficulty:"medium",emoji:"🌳",example:"木头",exampleRu:"древесина"},
        {hanzi:"花",pinyin:"huā",ru:"цветок",difficulty:"medium",emoji:"🌸",example:"开花",exampleRu:"цвести"},
        {hanzi:"草",pinyin:"cǎo",ru:"трава",difficulty:"medium",emoji:"🌿",example:"草地",exampleRu:"лужайка"},
        {hanzi:"风",pinyin:"fēng",ru:"ветер",difficulty:"medium",emoji:"💨",example:"大风",exampleRu:"сильный ветер"},
        {hanzi:"雨",pinyin:"yǔ",ru:"дождь",difficulty:"medium",emoji:"🌧️",example:"下雨",exampleRu:"идёт дождь"},
        {hanzi:"雪",pinyin:"xuě",ru:"снег",difficulty:"hard",emoji:"❄️",example:"下雪",exampleRu:"идёт снег"},
        {hanzi:"云",pinyin:"yún",ru:"облако",difficulty:"hard",emoji:"☁️",example:"白云",exampleRu:"белое облако"}
      ]}},

  { id:"animals", nameRu:"Животные", desc:"Кот, собака, лошадь", icon:"🐾", storyPre:"Животные разбежались! Поймай иероглифы!", storyPost:"Все животные вернулись домой!", bossLine:"Я — царь зверей! Докажи свои знания!",
    lesson:{ category:"Животные", categoryZh:"动物", bossEmoji:"🐻", bossName:"Медведь Зверей", skyColors:["#C8E6C9","#E8F5E9"], groundColor:"#33691E", theme:"deepforest",
      words:[
        {hanzi:"猫",pinyin:"māo",ru:"кот",difficulty:"easy",emoji:"🐱",example:"小猫",exampleRu:"котёнок"},
        {hanzi:"狗",pinyin:"gǒu",ru:"собака",difficulty:"easy",emoji:"🐶",example:"小狗",exampleRu:"щенок"},
        {hanzi:"鸟",pinyin:"niǎo",ru:"птица",difficulty:"medium",emoji:"🐦",example:"小鸟",exampleRu:"птичка"},
        {hanzi:"鱼",pinyin:"yú",ru:"рыба",difficulty:"medium",emoji:"🐟",example:"小鱼",exampleRu:"рыбка"},
        {hanzi:"马",pinyin:"mǎ",ru:"лошадь",difficulty:"medium",emoji:"🐴",example:"小马",exampleRu:"лошадка"},
        {hanzi:"牛",pinyin:"niú",ru:"корова",difficulty:"hard",emoji:"🐮",example:"牛奶",exampleRu:"молоко"},
        {hanzi:"羊",pinyin:"yáng",ru:"овца",difficulty:"hard",emoji:"🐑",example:"小羊",exampleRu:"ягнёнок"},
        {hanzi:"鸡",pinyin:"jī",ru:"курица",difficulty:"hard",emoji:"🐔",example:"小鸡",exampleRu:"цыплёнок"},
        {hanzi:"猪",pinyin:"zhū",ru:"свинья",difficulty:"hard",emoji:"🐷",example:"小猪",exampleRu:"поросёнок"}
      ]}},

  { id:"colors", nameRu:"Цвета и размер", desc:"Красный, синий, большой", icon:"🎨", storyPre:"Мир потерял цвета! Верни краски!", storyPost:"Мир снова яркий и красочный!", bossLine:"Угадай цвета без подсказок!",
    lesson:{ category:"Цвета", categoryZh:"颜色", bossEmoji:"🎨", bossName:"Художник-Тень", skyColors:["#FCE4EC","#F8BBD0"], groundColor:"#C2185B", theme:"cozy",
      words:[
        {hanzi:"红",pinyin:"hóng",ru:"красный",difficulty:"easy",emoji:"🔴",example:"红色",exampleRu:"красный цвет"},
        {hanzi:"白",pinyin:"bái",ru:"белый",difficulty:"easy",emoji:"⚪",example:"白色",exampleRu:"белый цвет"},
        {hanzi:"黑",pinyin:"hēi",ru:"чёрный",difficulty:"easy",emoji:"⚫",example:"黑色",exampleRu:"чёрный цвет"},
        {hanzi:"蓝",pinyin:"lán",ru:"синий",difficulty:"medium",emoji:"🔵",example:"蓝色",exampleRu:"синий цвет"},
        {hanzi:"绿",pinyin:"lǜ",ru:"зелёный",difficulty:"medium",emoji:"🟢",example:"绿色",exampleRu:"зелёный цвет"},
        {hanzi:"黄",pinyin:"huáng",ru:"жёлтый",difficulty:"medium",emoji:"🟡",example:"黄色",exampleRu:"жёлтый цвет"},
        {hanzi:"长",pinyin:"cháng",ru:"длинный",difficulty:"medium",emoji:"📏",example:"很长",exampleRu:"очень длинный"},
        {hanzi:"短",pinyin:"duǎn",ru:"короткий",difficulty:"hard",emoji:"📐",example:"很短",exampleRu:"очень короткий"},
        {hanzi:"新",pinyin:"xīn",ru:"новый",difficulty:"hard",emoji:"✨",example:"新年",exampleRu:"Новый год"},
        {hanzi:"旧",pinyin:"jiù",ru:"старый",difficulty:"hard",emoji:"📰",example:"旧书",exampleRu:"старая книга"}
      ]}},

  { id:"food", nameRu:"Еда и питьё", desc:"Рис, чай, мясо", icon:"🍜", storyPre:"Голодный дракон съел все слова о еде!", storyPost:"Теперь ты знаешь как попросить еду!", bossLine:"Что это за еда? Покажи!",
    lesson:{ category:"Еда", categoryZh:"食物", bossEmoji:"🐲", bossName:"Дракон Вкусняшек", skyColors:["#FFF3E0","#FFE0B2"], groundColor:"#E65100", theme:"cozy",
      words:[
        {hanzi:"饭",pinyin:"fàn",ru:"рис/еда",difficulty:"easy",emoji:"🍚",example:"吃饭",exampleRu:"есть (приём пищи)"},
        {hanzi:"水",pinyin:"shuǐ",ru:"вода",difficulty:"easy",emoji:"💧",example:"喝水",exampleRu:"пить воду"},
        {hanzi:"茶",pinyin:"chá",ru:"чай",difficulty:"easy",emoji:"🍵",example:"喝茶",exampleRu:"пить чай"},
        {hanzi:"菜",pinyin:"cài",ru:"овощи/блюдо",difficulty:"medium",emoji:"🥬",example:"好菜",exampleRu:"вкусное блюдо"},
        {hanzi:"肉",pinyin:"ròu",ru:"мясо",difficulty:"medium",emoji:"🥩",example:"牛肉",exampleRu:"говядина"},
        {hanzi:"果",pinyin:"guǒ",ru:"фрукт",difficulty:"medium",emoji:"🍎",example:"水果",exampleRu:"фрукты"},
        {hanzi:"鸡",pinyin:"jī",ru:"курица",difficulty:"medium",emoji:"🍗",example:"鸡肉",exampleRu:"куриное мясо"},
        {hanzi:"面",pinyin:"miàn",ru:"лапша",difficulty:"hard",emoji:"🍜",example:"面条",exampleRu:"лапша"},
        {hanzi:"鸡蛋",pinyin:"jīdàn",ru:"яйцо",difficulty:"hard",emoji:"🥚",example:"吃鸡蛋",exampleRu:"есть яйцо"},
        {hanzi:"牛奶",pinyin:"niúnǎi",ru:"молоко",difficulty:"hard",emoji:"🥛",example:"喝牛奶",exampleRu:"пить молоко"}
      ]}},

  { id:"school", nameRu:"Школа и тело", desc:"Книга, рот, рука, глаз", icon:"📚", storyPre:"Школа закрыта! Верни слова!", storyPost:"Ты настоящий ученик!", bossLine:"Проверим школьные знания!",
    lesson:{ category:"Школа", categoryZh:"学校", bossEmoji:"📚", bossName:"Учитель-Призрак", skyColors:["#E3F2FD","#BBDEFB"], groundColor:"#1565C0", theme:"forest",
      words:[
        {hanzi:"书",pinyin:"shū",ru:"книга",difficulty:"easy",emoji:"📖",example:"看书",exampleRu:"читать книгу"},
        {hanzi:"字",pinyin:"zì",ru:"иероглиф/буква",difficulty:"easy",emoji:"🔤",example:"汉字",exampleRu:"китайский иероглиф"},
        {hanzi:"文",pinyin:"wén",ru:"текст/язык",difficulty:"medium",emoji:"📝",example:"中文",exampleRu:"китайский язык"},
        {hanzi:"学",pinyin:"xué",ru:"учиться",difficulty:"medium",emoji:"🎓",example:"学生",exampleRu:"студент"},
        {hanzi:"口",pinyin:"kǒu",ru:"рот",difficulty:"medium",emoji:"👄",example:"开口",exampleRu:"открыть рот"},
        {hanzi:"手",pinyin:"shǒu",ru:"рука",difficulty:"medium",emoji:"🤚",example:"左手",exampleRu:"левая рука"},
        {hanzi:"目",pinyin:"mù",ru:"глаз",difficulty:"hard",emoji:"👁️",example:"目光",exampleRu:"взгляд"},
        {hanzi:"耳",pinyin:"ěr",ru:"ухо",difficulty:"hard",emoji:"👂",example:"耳朵",exampleRu:"ухо"},
        {hanzi:"头",pinyin:"tóu",ru:"голова",difficulty:"hard",emoji:"🗣️",example:"点头",exampleRu:"кивать головой"},
        {hanzi:"足",pinyin:"zú",ru:"нога/ступня",difficulty:"hard",emoji:"🦶",example:"足球",exampleRu:"футбол"}
      ]}},

  { id:"actions2", nameRu:"Действия 2", desc:"Читать, писать, играть", icon:"🎬", storyPre:"Герой забыл как двигаться! Помоги ему!", storyPost:"Герой снова в движении!", bossLine:"Покажи движения!",
    lesson:{ category:"Действия", categoryZh:"动作", bossEmoji:"🎬", bossName:"Тень Движений", skyColors:["#F3E5F5","#E1BEE7"], groundColor:"#7B1FA2", theme:"forest",
      words:[
        {hanzi:"读",pinyin:"dú",ru:"читать",difficulty:"easy",emoji:"📖",example:"读书",exampleRu:"учиться/читать"},
        {hanzi:"写",pinyin:"xiě",ru:"писать",difficulty:"easy",emoji:"✏️",example:"写字",exampleRu:"писать иероглифы"},
        {hanzi:"开",pinyin:"kāi",ru:"открывать",difficulty:"easy",emoji:"🚪",example:"开门",exampleRu:"открыть дверь"},
        {hanzi:"关",pinyin:"guān",ru:"закрывать",difficulty:"easy",emoji:"🔒",example:"关门",exampleRu:"закрыть дверь"},
        {hanzi:"走",pinyin:"zǒu",ru:"идти",difficulty:"easy",emoji:"🚶",example:"走路",exampleRu:"идти пешком"},
        {hanzi:"跑",pinyin:"pǎo",ru:"бегать",difficulty:"medium",emoji:"🏃",example:"跑步",exampleRu:"бегать"},
        {hanzi:"坐",pinyin:"zuò",ru:"сидеть",difficulty:"medium",emoji:"🪑",example:"坐下",exampleRu:"садись"},
        {hanzi:"站",pinyin:"zhàn",ru:"стоять",difficulty:"medium",emoji:"🧍",example:"站起来",exampleRu:"встать"},
        {hanzi:"买",pinyin:"mǎi",ru:"покупать",difficulty:"medium",emoji:"🛒",example:"买东西",exampleRu:"покупать вещи"},
        {hanzi:"卖",pinyin:"mài",ru:"продавать",difficulty:"hard",emoji:"🏪",example:"卖东西",exampleRu:"продавать вещи"},
        {hanzi:"玩",pinyin:"wán",ru:"играть",difficulty:"medium",emoji:"🎮",example:"玩游戏",exampleRu:"играть в игры"},
        {hanzi:"问",pinyin:"wèn",ru:"спрашивать",difficulty:"hard",emoji:"❓",example:"问好",exampleRu:"здороваться"}
      ]}},

  { id:"family", nameRu:"Семья", desc:"Папа, мама, старший брат", icon:"👨‍👩‍👧‍👦", storyPre:"Семья потерялась! Найди всех!", storyPost:"Семья воссоединилась!", bossLine:"Угадай кто есть кто!",
    lesson:{ category:"Семья", categoryZh:"家庭", bossEmoji:"👨‍👩‍👧", bossName:"Семья-Тень", skyColors:["#FFF8E7","#FFE0B2"], groundColor:"#FF8F00", theme:"cozy",
      words:[
        {hanzi:"爸",pinyin:"bà",ru:"папа",difficulty:"easy",emoji:"👨",example:"爸爸",exampleRu:"папа"},
        {hanzi:"妈",pinyin:"mā",ru:"мама",difficulty:"easy",emoji:"👩",example:"妈妈",exampleRu:"мама"},
        {hanzi:"哥",pinyin:"gē",ru:"старший брат",difficulty:"medium",emoji:"👦",example:"哥哥",exampleRu:"старший брат"},
        {hanzi:"姐",pinyin:"jiě",ru:"старшая сестра",difficulty:"medium",emoji:"👧",example:"姐姐",exampleRu:"старшая сестра"},
        {hanzi:"弟",pinyin:"dì",ru:"младший брат",difficulty:"medium",emoji:"👦",example:"弟弟",exampleRu:"младший брат"},
        {hanzi:"妹",pinyin:"mèi",ru:"младшая сестра",difficulty:"medium",emoji:"👧",example:"妹妹",exampleRu:"младшая сестра"},
        {hanzi:"家",pinyin:"jiā",ru:"дом/семья",difficulty:"easy",emoji:"🏠",example:"家人",exampleRu:"семья"},
        {hanzi:"朋友",pinyin:"péngyou",ru:"друг",difficulty:"medium",emoji:"🤝",example:"好朋友",exampleRu:"хороший друг"},
        {hanzi:"老师",pinyin:"lǎoshī",ru:"учитель",difficulty:"hard",emoji:"👨‍🏫",example:"好老师",exampleRu:"хороший учитель"},
        {hanzi:"学生",pinyin:"xuésheng",ru:"студент",difficulty:"hard",emoji:"🎓",example:"好学生",exampleRu:"хороший ученик"}
      ]}},

  { id:"travel", nameRu:"Город и транспорт", desc:"Машина, автобус, магазин", icon:"🏙️", storyPre:"Город пуст! Верни жителей и их слова!", storyPost:"Город снова живёт!", bossLine:"Покажи, что знаешь город!",
    lesson:{ category:"Город", categoryZh:"城市", bossEmoji:"🏙️", bossName:"Страж Города", skyColors:["#E8EAF6","#C5CAE9"], groundColor:"#283593", theme:"grass",
      words:[
        {hanzi:"车",pinyin:"chē",ru:"машина/автомобиль",difficulty:"easy",emoji:"🚗",example:"汽车",exampleRu:"автомобиль"},
        {hanzi:"飞机",pinyin:"fēijī",ru:"самолёт",difficulty:"medium",emoji:"✈️",example:"坐飞机",exampleRu:"лететь на самолёте"},
        {hanzi:"商店",pinyin:"shāngdiàn",ru:"магазин",difficulty:"medium",emoji:"🏪",example:"去商店",exampleRu:"пойти в магазин"},
        {hanzi:"饭馆",pinyin:"fànguǎn",ru:"ресторан",difficulty:"hard",emoji:"🍽️",example:"去饭馆",exampleRu:"пойти в ресторан"},
        {hanzi:"医院",pinyin:"yīyuàn",ru:"больница",difficulty:"hard",emoji:"🏥",example:"去医院",exampleRu:"пойти в больницу"},
        {hanzi:"学校",pinyin:"xuéxiào",ru:"школа",difficulty:"medium",emoji:"🏫",example:"去学校",exampleRu:"идти в школу"},
        {hanzi:"路",pinyin:"lù",ru:"дорога",difficulty:"medium",emoji:"🛣️",example:"马路",exampleRu:"улица"},
        {hanzi:"门",pinyin:"mén",ru:"дверь/ворота",difficulty:"medium",emoji:"🚪",example:"开门",exampleRu:"открыть дверь"},
        {hanzi:"上",pinyin:"shàng",ru:"верх/на",difficulty:"easy",emoji:"⬆️",example:"上面",exampleRu:"сверху"},
        {hanzi:"下",pinyin:"xià",ru:"низ/под",difficulty:"easy",emoji:"⬇️",example:"下面",exampleRu:"снизу"}
      ]}
  }
];

function getDefaultLessons() { return COURSES.map(c => c.lesson); }
function getDefaultCourses() { return JSON.parse(JSON.stringify(COURSES)); }

function parseCSV(text) {
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 1) return [];
  const header = lines[0].toLowerCase();
  const startIdx = header.includes('hanzi') ? 1 : 0;
  const results = [];
  for (let i = startIdx; i < lines.length; i++) {
    const parts = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    if (parts.length >= 3) results.push({ hanzi: parts[0], pinyin: parts[1] || '', ru: parts[2] || '', category: parts[3] || 'Другое', difficulty: parts[4] || 'easy', emoji: parts[5] || '' });
  }
  return results;
}
