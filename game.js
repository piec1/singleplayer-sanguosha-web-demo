(() => {
  const $ = (id) => document.getElementById(id);

  const SUITS = ["♠", "♥", "♣", "♦"];
  const RED_SUITS = new Set(["♥", "♦"]);
  const ROLE_SETS = {
    "8": ["主公", "忠臣", "忠臣", "反贼", "反贼", "反贼", "反贼", "内奸"],
    "5": ["主公", "忠臣", "反贼", "反贼", "内奸"]
  };
  const ROSTER_EXTRAS = {
    standard2013: new Set(["huaxiong", "yuanshu"]),
    future: new Set(["xunyou", "fazheng", "xushu", "zhangchunhua", "wuguotai", "bulianshi"])
  };
  const HUASHEN_POOL = ["rende", "wusheng", "paoxiao", "longdan", "qixi", "keji", "yingzi", "jizhi", "qicai", "mashu", "duanliang", "jiang", "qingguo", "lianhuan", "kanpo"];
  const AI_PROFILES = [
    { key: "blade", label: "猛攻", aggression: 1.3, caution: 0.72, trickiness: 0.78, loyalty: 0.9, patience: 0.72, chaos: 1.08 },
    { key: "shield", label: "守成", aggression: 0.82, caution: 1.35, trickiness: 0.78, loyalty: 1.18, patience: 1.22, chaos: 0.72 },
    { key: "control", label: "控场", aggression: 1.02, caution: 1.05, trickiness: 1.18, loyalty: 1.0, patience: 1.08, chaos: 0.88 },
    { key: "mask", label: "诈术", aggression: 0.96, caution: 0.92, trickiness: 1.42, loyalty: 0.86, patience: 0.95, chaos: 1.22 }
  ];
  const DAMAGE = {
    NORMAL: "normal",
    FIRE: "fire",
    THUNDER: "thunder"
  };
  const TURN_FLOW = {
    step: 1,
    label: "逆时针",
    humanNextHint: "下家在你的右手边，沿牌桌逆时针前进"
  };
  const LIMITED_SKILLS = new Set(["luanwu", "niepan"]);

  const SKILL_TEXT = {
    rende: "仁德",
    wusheng: "武圣",
    paoxiao: "咆哮",
    longdan: "龙胆",
    mashu: "马术",
    tieji: "铁骑",
    guanxing: "观星",
    kongcheng: "空城",
    jizhi: "集智",
    qicai: "奇才",
    kurou: "苦肉",
    zhiheng: "制衡",
    jiuyuan: "救援",
    qixi: "奇袭",
    keji: "克己",
    yingzi: "英姿",
    fanjian: "反间",
    guose: "国色",
    liuli: "流离",
    qianxun: "谦逊",
    lianying: "连营",
    jieyin: "结姻",
    xiaoji: "枭姬",
    jianxiong: "奸雄",
    hujia: "护驾",
    fankui: "反馈",
    guicai: "鬼才",
    ganglie: "刚烈",
    tuxi: "突袭",
    luoyi: "裸衣",
    tiandu: "天妒",
    yiji: "遗计",
    luoshen: "洛神",
    qingguo: "倾国",
    jijiu: "急救",
    qingnang: "青囊",
    wushuang: "无双",
    lijian: "离间",
    biyue: "闭月",
    huoji: "火计",
    kanpo: "看破",
    lianhuan: "连环",
    niepan: "涅槃",
    liegong: "烈弓",
    kuanggu: "狂骨",
    quhu: "驱虎",
    jieming: "节命",
    qiangxi: "强袭",
    qice: "奇策",
    tianyi: "天义",
    tianxiang: "天香",
    hongyan: "红颜",
    mengjin: "猛进",
    jiuchi: "酒池",
    roulin: "肉林",
    benghuai: "崩坏",
    shuangxiong: "双雄",
    luanji: "乱击",
    xueyi: "血裔",
    baonue: "暴虐",
    wansha: "完杀",
    weimu: "帷幕",
    shensu: "神速",
    jushou: "据守",
    buqu: "不屈",
    leiji: "雷击",
    guidao: "鬼道",
    huangtian: "黄天",
    guhuo: "蛊惑",
    bazhen: "八阵",
    duanliang: "断粮",
    xingshang: "行殇",
    fangzhu: "放逐",
    songwei: "颂威",
    huoshou: "祸首",
    zaiqi: "再起",
    juxiang: "巨象",
    lieren: "烈刃",
    haoshi: "好施",
    dimeng: "缔盟",
    yinghun: "英魂",
    luanwu: "乱武",
    qiaobian: "巧变",
    tuntian: "屯田",
    zaoxian: "凿险",
    jixi: "急袭",
    tiaoxin: "挑衅",
    zhiji: "志继",
    xiangle: "享乐",
    fangquan: "放权",
    ruoyu: "若愚",
    jijiang: "激将",
    jiang: "激昂",
    hunzi: "魂姿",
    zhiba: "制霸",
    zhijian: "直谏",
    guzheng: "固政",
    beige: "悲歌",
    duanchang: "断肠",
    huashen: "化身",
    xinsheng: "新生",
    yongsi: "庸肆",
    weidi: "伪帝",
    enyuan: "恩怨",
    xuanhuo: "眩惑",
    wuyan: "无言",
    jujian: "举荐",
    jueqing: "绝情",
    shangshi: "伤逝",
    ganlu: "甘露",
    buyi: "补益",
    anxu: "安恤",
    zhuiyi: "追忆"
  };

  const SKILL_COVERAGE = {
    full: new Set([
      "wusheng", "paoxiao", "longdan", "mashu", "kongcheng", "jizhi", "qicai", "qixi", "keji", "yingzi",
      "qianxun", "lianying", "xiaoji", "jianxiong", "hujia", "fankui", "guicai", "tiandu", "luoshen", "qingguo",
      "jijiu", "wushuang", "biyue", "huoji", "kanpo", "lianhuan", "weimu", "duanliang", "bazhen", "guanxing", "tuxi", "juxiang", "lieren",
      "haoshi", "dimeng", "leiji", "guidao", "zhiheng", "guose", "fanjian", "tieji", "liuli", "liegong", "rende", "qingnang", "jieyin", "ganglie", "lijian", "guhuo", "qiangxi", "quhu", "tianyi", "shuangxiong", "yiji", "kuanggu", "jiuchi", "roulin", "wansha", "jiuyuan", "kurou", "luoyi", "mengjin", "shensu", "xueyi", "jushou", "fangzhu", "songwei", "zhiba"
    ]),
    partial: new Set([
      "niepan", "jieming",
      "qice", "tianxiang", "hongyan", "benghuai",
      "luanji", "baonue", "buqu", "huangtian",
      "xingshang", "huoshou", "zaiqi",
      "yinghun", "luanwu", "qiaobian", "tuntian", "zaoxian", "jixi", "tiaoxin", "zhiji",
      "xiangle", "fangquan", "ruoyu", "jijiang", "jiang", "hunzi", "zhijian", "guzheng", "beige", "duanchang",
      "huashen", "xinsheng", "yongsi", "weidi", "enyuan", "xuanhuo", "wuyan", "jujian", "jueqing", "shangshi", "ganlu", "buyi", "anxu", "zhuiyi"
    ]),
    notes: {
      full: "已接入主要触发/响应窗口",
      partial: "已可发动，部分官方细节简化",
      todo: "展示在武将牌上，机制待补"
    }
  };

  const SKILL_RULE_TEXT = {
    rende: "出牌阶段可将任意张手牌交给一名其他角色；本阶段给出的牌首次累计达到两张或更多后，你回复 1 点体力。",
    wusheng: "红色牌可当杀使用或打出。",
    paoxiao: "出牌阶段使用杀没有次数限制。",
    longdan: "杀可当闪，闪可当杀。",
    mashu: "你计算与其他角色的距离 -1。",
    tieji: "当你使用杀指定一名角色为目标后，可以进行判定；若结果为红色，该角色不能使用闪响应此杀。",
    guanxing: "准备阶段观看牌堆顶若干张并调整顶底顺序。",
    kongcheng: "没有手牌时不能成为杀或决斗的目标。",
    jizhi: "使用锦囊牌后摸一张牌。",
    qicai: "锦囊距离限制放宽。",
    kurou: "出牌阶段失去 1 点体力并摸两张牌。",
    zhiheng: "出牌阶段限一次，弃置任意张手牌或装备区里的牌，然后摸等量牌。",
    jiuyuan: "主公技，吴势力角色在你濒死时对你使用桃，额外回复 1 点体力。",
    qixi: "黑色牌可当过河拆桥使用。",
    keji: "本回合未使用杀时可跳过弃牌阶段。",
    yingzi: "摸牌阶段额外摸一张。",
    fanjian: "出牌阶段限一次，令一名其他角色选择一种花色后获得你一张手牌；若此牌花色与其选择不同，其受到你造成的 1 点伤害。",
    guose: "方片牌可当乐不思蜀使用。",
    liuli: "当你成为杀的目标时，可以弃置一张牌，将此杀转移给你攻击范围内的一名其他角色（不能是此杀的使用者）。",
    qianxun: "不能成为顺手牵羊和乐不思蜀的目标。",
    lianying: "失去最后手牌后摸一张。",
    jieyin: "出牌阶段限一次，弃置两张手牌并选择一名已受伤男性其他角色，你与其各回复 1 点体力。",
    xiaoji: "失去装备区牌后摸两张牌。",
    jianxiong: "受到伤害后获得造成伤害的牌。",
    hujia: "主公技，需要使用或打出闪时，可令魏势力角色代为打出闪。",
    fankui: "受到伤害后获得伤害来源一张牌。",
    guicai: "判定牌生效前可用手牌替换。",
    ganglie: "受到伤害后可判定，若结果不为红桃，伤害来源选择弃两张手牌或受到 1 点伤害。",
    tuxi: "摸牌阶段可少摸牌并获得至多两名角色各一张手牌。",
    luoyi: "摸牌阶段可少摸一张，本回合杀和决斗伤害 +1。",
    tiandu: "判定牌生效后获得该判定牌。",
    yiji: "每受到 1 点伤害后摸两张牌，可将刚摸到的牌分配给其他角色。",
    luoshen: "准备阶段连续判定黑色牌并获得，直到出现红色。",
    qingguo: "黑色牌可当闪使用或打出。",
    jijiu: "回合外红色牌可当桃使用。",
    qingnang: "出牌阶段限一次，弃置一张手牌，令一名已受伤角色回复 1 点体力。",
    wushuang: "杀和决斗需要目标连续响应两张对应牌。",
    lijian: "出牌阶段限一次，弃置一张牌并选择两名男性角色，视为其中一名男性角色对另一名男性角色使用决斗。",
    biyue: "结束阶段摸一张牌。",
    huoji: "红色牌可当火攻使用。",
    kanpo: "黑色牌可当无懈可击使用。",
    lianhuan: "梅花牌可当铁索连环使用或重铸。",
    niepan: "濒死时限一次弃牌并回复至 3 点体力。",
    liegong: "当你使用杀指定目标后，若其手牌数不小于你的体力值，或不大于你的攻击范围，你可以令其不能使用闪响应此杀。",
    kuanggu: "对距离 1 内角色造成伤害后回复 1 点体力。",
    quhu: "出牌阶段限一次，你可以与体力值大于你的角色拼点；若你赢，你选择其攻击范围内的一名角色，该角色对其造成 1 点伤害；若你没赢，该角色对你造成 1 点伤害。",
    jieming: "受到伤害后，可令一名角色将手牌补至体力上限，最多五张。",
    qiangxi: "出牌阶段限一次，你可以失去 1 点体力或弃置一张武器牌，对攻击范围内一名其他角色造成 1 点伤害。",
    qice: "出牌阶段将全部手牌当一张普通锦囊使用。",
    tianyi: "出牌阶段限一次，你可以与一名角色拼点；若你赢，本回合使用杀无距离限制且可以多指定一个目标，并可额外使用一张杀；若你没赢，本回合不能使用杀。",
    tianxiang: "受到伤害时可弃红桃牌转移伤害并令目标摸牌。",
    hongyan: "你的黑桃牌视为红桃。",
    mengjin: "杀被闪避后可弃置目标一张牌。",
    jiuchi: "黑桃牌可当酒使用。",
    roulin: "女性角色与你互相使用杀时需要额外响应。",
    benghuai: "结束阶段若体力不为全场最低，需失去体力或体力上限。",
    shuangxiong: "摸牌阶段可放弃摸牌并进行判定，获得判定牌；本回合可将与判定牌颜色不同的一张手牌当决斗使用。",
    luanji: "两张同花色手牌可当万箭齐发使用。",
    xueyi: "主公技，每有一名其他群势力角色存活，你的手牌上限 +2。",
    baonue: "群势力角色造成伤害后，主公可判定黑桃回复。",
    wansha: "你的回合内濒死求桃受限。",
    weimu: "不能成为黑色锦囊目标。",
    shensu: "神速一：跳过判定阶段和摸牌阶段，视为使用一张无距离限制的杀；神速二：弃置一张装备并跳过出牌阶段，视为使用一张无距离限制的杀。",
    jushou: "结束阶段可摸三张并翻面；下个回合翻回并跳过整个回合。",
    buqu: "濒死时以不屈牌维持存活。",
    leiji: "使用或打出闪后可令一名其他角色判定，黑桃受2点雷伤，梅花则你回复1点并令其受1点雷伤。",
    guidao: "黑色牌可用于替换判定。",
    huangtian: "主公技，群势力角色可交给你闪或闪电。",
    guhuo: "需要使用或打出基本牌或普通锦囊牌时，可以声明并扣置一张手牌。无人质疑则按声明牌结算；有人质疑则验明：真牌令质疑者各失去 1 点体力，且仅红桃真牌继续生效，否则作废；假牌令质疑者各摸一张牌并作废。",
    bazhen: "没有防具时视为装备八卦阵。",
    duanliang: "黑色基本牌或装备牌可当兵粮寸断使用。",
    xingshang: "其他角色死亡后获得其牌。",
    fangzhu: "受到伤害后，可令一名角色摸X张牌并翻面（X为你已损失体力值）。",
    songwei: "其他魏势力角色黑色判定牌生效后，其可令你摸一张牌。",
    huoshou: "南蛮入侵对你无效，且你视为南蛮伤害来源。",
    zaiqi: "摸牌阶段可改为亮牌，红桃回复，其余收入手牌。",
    juxiang: "南蛮入侵对你无效，并可获得结算后的南蛮。",
    lieren: "杀造成伤害后可拼点，赢则获得目标一张牌。",
    haoshi: "摸牌阶段，你可以多摸两张牌，然后若你的手牌数大于 5，则你将一半的手牌（向下取整）交给手牌最少的一名其他角色。",
    dimeng: "出牌阶段限一次，你可以选择两名其他角色并弃置 X 张牌（X 为这两名角色手牌数的差），然后令这两名角色交换手牌。",
    yinghun: "准备阶段若已受伤，令一名角色摸弃或弃摸。",
    luanwu: "限定技，令其他角色依次使用杀或失去体力。",
    qiaobian: "可弃牌跳过阶段，并移动判定牌、场上牌或获得手牌。",
    tuntian: "回合外失去牌后判定，非红桃成为田。",
    zaoxian: "田达到数量后觉醒并获得急袭。",
    jixi: "可将田当顺手牵羊使用。",
    tiaoxin: "出牌阶段令攻击范围内角色对你使用杀，否则弃其一张牌。",
    zhiji: "准备阶段若无手牌，觉醒后失去体力上限，回复 1 点体力或摸两张牌，并获得观星。",
    xiangle: "成为杀目标时，来源需弃基本牌，否则杀无效。",
    fangquan: "出牌阶段可跳过，结束时弃牌令一名角色额外回合。",
    ruoyu: "主公觉醒技，体力最低时增加上限、回复并获得激将。",
    jijiang: "主公技，需要使用或打出杀时，可令蜀势力角色代为使用或打出杀。",
    jiang: "使用或成为决斗/红色杀目标后摸牌。",
    hunzi: "觉醒后获得英姿和英魂。",
    zhiba: "主公技，其他吴势力角色可与你拼点；若其没赢，你可获得两张拼点牌。",
    zhijian: "出牌阶段可将装备牌置入其他角色装备区并摸一张。",
    guzheng: "其他角色弃牌阶段后，可返还其中一张并获得其余牌。",
    beige: "一名角色受到杀伤害后，可弃牌判定并产生补偿或惩罚。",
    duanchang: "死亡时令杀死你的角色失去所有技能。",
    huashen: "准备阶段随机获得一个化身技能。",
    xinsheng: "受到伤害后获得新的化身技能。",
    yongsi: "锁定技，摸牌阶段额外摸势力数张牌；弃牌阶段开始时弃置势力数张手牌。",
    weidi: "锁定技，视为拥有当前主公的主公技。",
    enyuan: "锁定技，其他角色令你回复体力后其摸牌；对你造成伤害后需交给你红桃手牌，否则失去体力。",
    xuanhuo: "出牌阶段限一次，交给一名角色红桃手牌，获得其一张牌并交给另一名角色。",
    wuyan: "锁定技，你使用的非延时锦囊对其他角色无效；其他角色使用的非延时锦囊对你无效。",
    jujian: "出牌阶段限一次，弃至多三张手牌令一名其他角色摸等量牌；若三张类别相同则回复体力。",
    jueqing: "锁定技，你造成的伤害均改为目标失去体力。",
    shangshi: "锁定技，弃牌阶段外手牌数小于已损失体力值时补至该数，最多 2 张。",
    ganlu: "出牌阶段限一次，交换两名角色装备区里的牌，装备数差不能超过你已损失体力值。",
    buyi: "一名角色濒死时，可展示其一张手牌；若不为基本牌，弃置之并令其回复体力。",
    anxu: "出牌阶段限一次，令两名手牌数不同的其他角色中手牌少者获得多者一张手牌；若不为黑桃，你摸一张。",
    zhuiyi: "死亡时，可令一名非杀死你的其他角色摸三张牌并回复 1 点体力。"
  };

  const GENERALS = [
    { id: "liubei", name: "刘备", kingdom: "蜀", gender: "male", maxHp: 4, skills: ["rende", "jijiang"] },
    { id: "guanyu", name: "关羽", kingdom: "蜀", gender: "male", maxHp: 4, skills: ["wusheng"] },
    { id: "zhangfei", name: "张飞", kingdom: "蜀", gender: "male", maxHp: 4, skills: ["paoxiao"] },
    { id: "zhaoyun", name: "赵云", kingdom: "蜀", gender: "male", maxHp: 4, skills: ["longdan"] },
    { id: "machao", name: "马超", kingdom: "蜀", gender: "male", maxHp: 4, skills: ["mashu", "tieji"] },
    { id: "zhugeliang", name: "诸葛亮", kingdom: "蜀", gender: "male", maxHp: 3, skills: ["guanxing", "kongcheng"] },
    { id: "wolongzhugeliang", name: "卧龙诸葛", kingdom: "蜀", gender: "male", maxHp: 3, skills: ["bazhen", "huoji", "kanpo"] },
    { id: "huangyueying", name: "黄月英", kingdom: "蜀", gender: "female", maxHp: 3, skills: ["jizhi", "qicai"] },
    { id: "huangzhong", name: "黄忠", kingdom: "蜀", gender: "male", maxHp: 4, skills: ["liegong"] },
    { id: "weiyan", name: "魏延", kingdom: "蜀", gender: "male", maxHp: 4, skills: ["kuanggu"] },
    { id: "pangtong", name: "庞统", kingdom: "蜀", gender: "male", maxHp: 3, skills: ["lianhuan", "niepan"] },
    { id: "jiangwei", name: "姜维", kingdom: "蜀", gender: "male", maxHp: 4, skills: ["tiaoxin", "zhiji"] },
    { id: "liushan", name: "刘禅", kingdom: "蜀", gender: "male", maxHp: 3, skills: ["xiangle", "fangquan", "ruoyu"] },

    { id: "caocao", name: "曹操", kingdom: "魏", gender: "male", maxHp: 4, skills: ["jianxiong", "hujia"] },
    { id: "simayi", name: "司马懿", kingdom: "魏", gender: "male", maxHp: 3, skills: ["fankui", "guicai"] },
    { id: "xiahoudun", name: "夏侯惇", kingdom: "魏", gender: "male", maxHp: 4, skills: ["ganglie"] },
    { id: "xiahouyuan", name: "夏侯渊", kingdom: "魏", gender: "male", maxHp: 4, skills: ["shensu"] },
    { id: "caoren", name: "曹仁", kingdom: "魏", gender: "male", maxHp: 4, skills: ["jushou"] },
    { id: "zhangliao", name: "张辽", kingdom: "魏", gender: "male", maxHp: 4, skills: ["tuxi"] },
    { id: "xuchu", name: "许褚", kingdom: "魏", gender: "male", maxHp: 4, skills: ["luoyi"] },
    { id: "guojia", name: "郭嘉", kingdom: "魏", gender: "male", maxHp: 3, skills: ["tiandu", "yiji"] },
    { id: "zhenji", name: "甄姬", kingdom: "魏", gender: "female", maxHp: 3, skills: ["luoshen", "qingguo"] },
    { id: "xunyu", name: "荀彧", kingdom: "魏", gender: "male", maxHp: 3, skills: ["quhu", "jieming"] },
    { id: "dianwei", name: "典韦", kingdom: "魏", gender: "male", maxHp: 4, skills: ["qiangxi"] },
    { id: "xunyou", name: "荀攸", kingdom: "魏", gender: "male", maxHp: 3, skills: ["qice"] },
    { id: "xuhuang", name: "徐晃", kingdom: "魏", gender: "male", maxHp: 4, skills: ["duanliang"] },
    { id: "caopi", name: "曹丕", kingdom: "魏", gender: "male", maxHp: 3, skills: ["xingshang", "fangzhu", "songwei"] },
    { id: "zhanghe", name: "张郃", kingdom: "魏", gender: "male", maxHp: 4, skills: ["qiaobian"] },
    { id: "dengai", name: "邓艾", kingdom: "魏", gender: "male", maxHp: 4, skills: ["tuntian", "zaoxian"] },

    { id: "sunquan", name: "孙权", kingdom: "吴", gender: "male", maxHp: 4, skills: ["zhiheng", "jiuyuan"] },
    { id: "ganning", name: "甘宁", kingdom: "吴", gender: "male", maxHp: 4, skills: ["qixi"] },
    { id: "lvmeng", name: "吕蒙", kingdom: "吴", gender: "male", maxHp: 4, skills: ["keji"] },
    { id: "huanggai", name: "黄盖", kingdom: "吴", gender: "male", maxHp: 4, skills: ["kurou"] },
    { id: "zhouyu", name: "周瑜", kingdom: "吴", gender: "male", maxHp: 3, skills: ["yingzi", "fanjian"] },
    { id: "daqiao", name: "大乔", kingdom: "吴", gender: "female", maxHp: 3, skills: ["guose", "liuli"] },
    { id: "luxun", name: "陆逊", kingdom: "吴", gender: "male", maxHp: 3, skills: ["qianxun", "lianying"] },
    { id: "sunshangxiang", name: "孙尚香", kingdom: "吴", gender: "female", maxHp: 3, skills: ["jieyin", "xiaoji"] },
    { id: "taishici", name: "太史慈", kingdom: "吴", gender: "male", maxHp: 4, skills: ["tianyi"] },
    { id: "xiaoqiao", name: "小乔", kingdom: "吴", gender: "female", maxHp: 3, skills: ["tianxiang", "hongyan"] },
    { id: "zhoutai", name: "周泰", kingdom: "吴", gender: "male", maxHp: 4, skills: ["buqu"] },
    { id: "lusu", name: "鲁肃", kingdom: "吴", gender: "male", maxHp: 3, skills: ["haoshi", "dimeng"] },
    { id: "sunjian", name: "孙坚", kingdom: "吴", gender: "male", maxHp: 4, skills: ["yinghun"] },
    { id: "sunce", name: "孙策", kingdom: "吴", gender: "male", maxHp: 4, skills: ["jiang", "hunzi", "zhiba"] },
    { id: "zhangzhaozhanghong", name: "张昭张纮", kingdom: "吴", gender: "male", maxHp: 3, skills: ["zhijian", "guzheng"] },

    { id: "huatuo", name: "华佗", kingdom: "群", gender: "male", maxHp: 3, skills: ["jijiu", "qingnang"] },
    { id: "lvbu", name: "吕布", kingdom: "群", gender: "male", maxHp: 4, skills: ["wushuang"] },
    { id: "diaochan", name: "貂蝉", kingdom: "群", gender: "female", maxHp: 3, skills: ["lijian", "biyue"] },
    { id: "zhangjiao", name: "张角", kingdom: "群", gender: "male", maxHp: 3, skills: ["leiji", "guidao", "huangtian"] },
    { id: "yuji", name: "于吉", kingdom: "群", gender: "male", maxHp: 3, skills: ["guhuo"] },
    { id: "yuanshao", name: "袁绍", kingdom: "群", gender: "male", maxHp: 4, skills: ["luanji", "xueyi"] },
    { id: "huaxiong", name: "华雄", kingdom: "群", gender: "male", maxHp: 6, skills: [] },
    { id: "jiaxu", name: "贾诩", kingdom: "群", gender: "male", maxHp: 3, skills: ["wansha", "weimu", "luanwu"] },
    { id: "pangde", name: "庞德", kingdom: "群", gender: "male", maxHp: 4, skills: ["mashu", "mengjin"] },
    { id: "yanliangwenchou", name: "颜良文丑", kingdom: "群", gender: "male", maxHp: 4, skills: ["shuangxiong"] },
    { id: "dongzhuo", name: "董卓", kingdom: "群", gender: "male", maxHp: 8, skills: ["jiuchi", "roulin", "benghuai", "baonue"] },
    { id: "menghuo", name: "孟获", kingdom: "群", gender: "male", maxHp: 4, skills: ["huoshou", "zaiqi"] },
    { id: "zhurong", name: "祝融", kingdom: "群", gender: "female", maxHp: 4, skills: ["juxiang", "lieren"] },
    { id: "caiwenji", name: "蔡文姬", kingdom: "群", gender: "female", maxHp: 3, skills: ["beige", "duanchang"] },
    { id: "zuoci", name: "左慈", kingdom: "群", gender: "male", maxHp: 3, skills: ["huashen", "xinsheng"] },
    { id: "yuanshu", name: "袁术", kingdom: "群", gender: "male", maxHp: 4, skills: ["yongsi", "weidi"] },
    { id: "fazheng", name: "法正", kingdom: "蜀", gender: "male", maxHp: 3, skills: ["enyuan", "xuanhuo"] },
    { id: "xushu", name: "徐庶", kingdom: "蜀", gender: "male", maxHp: 3, skills: ["wuyan", "jujian"] },
    { id: "zhangchunhua", name: "张春华", kingdom: "魏", gender: "female", maxHp: 3, skills: ["jueqing", "shangshi"] },
    { id: "wuguotai", name: "吴国太", kingdom: "吴", gender: "female", maxHp: 3, skills: ["ganlu", "buyi"] },
    { id: "bulianshi", name: "步练师", kingdom: "吴", gender: "female", maxHp: 3, skills: ["anxu", "zhuiyi"] }
  ];

  const CARD_POOL = [
    { name: "杀", type: "basic", subtype: "slash", count: 34 },
    { name: "火杀", type: "basic", subtype: "slash", nature: DAMAGE.FIRE, count: 6 },
    { name: "雷杀", type: "basic", subtype: "slash", nature: DAMAGE.THUNDER, count: 6 },
    { name: "闪", type: "basic", subtype: "dodge", count: 24 },
    { name: "桃", type: "basic", subtype: "peach", count: 12 },
    { name: "酒", type: "basic", subtype: "wine", count: 8 },
    { name: "无中生有", type: "trick", subtype: "draw2", count: 4 },
    { name: "顺手牵羊", type: "trick", subtype: "steal", count: 5 },
    { name: "过河拆桥", type: "trick", subtype: "dismantle", count: 6 },
    { name: "借刀杀人", type: "trick", subtype: "borrowSword", count: 2 },
    { name: "无懈可击", type: "trick", subtype: "nullify", count: 7 },
    { name: "决斗", type: "trick", subtype: "duel", count: 4 },
    { name: "南蛮入侵", type: "trick", subtype: "barbarians", count: 3 },
    { name: "万箭齐发", type: "trick", subtype: "arrows", count: 2 },
    { name: "桃园结义", type: "trick", subtype: "taoyuan", count: 2 },
    { name: "五谷丰登", type: "trick", subtype: "harvest", count: 2 },
    { name: "火攻", type: "trick", subtype: "fireAttack", count: 3 },
    { name: "铁索连环", type: "trick", subtype: "chain", count: 6 },
    { name: "乐不思蜀", type: "trick", subtype: "lebu", delayed: true, count: 3 },
    { name: "兵粮寸断", type: "trick", subtype: "bingliang", delayed: true, count: 2 },
    { name: "闪电", type: "trick", subtype: "lightning", delayed: true, count: 1 },
    { name: "诸葛连弩", type: "equip", subtype: "weapon", range: 1, count: 2 },
    { name: "青釭剑", type: "equip", subtype: "weapon", range: 2, ignoreArmor: true, count: 1 },
    { name: "雌雄双股剑", type: "equip", subtype: "weapon", range: 2, count: 1 },
    { name: "寒冰剑", type: "equip", subtype: "weapon", range: 2, count: 1 },
    { name: "青龙偃月刀", type: "equip", subtype: "weapon", range: 3, count: 1 },
    { name: "丈八蛇矛", type: "equip", subtype: "weapon", range: 3, count: 1 },
    { name: "贯石斧", type: "equip", subtype: "weapon", range: 3, count: 1 },
    { name: "方天画戟", type: "equip", subtype: "weapon", range: 4, count: 1 },
    { name: "麒麟弓", type: "equip", subtype: "weapon", range: 5, count: 1 },
    { name: "古锭刀", type: "equip", subtype: "weapon", range: 2, count: 1 },
    { name: "八卦阵", type: "equip", subtype: "armor", count: 2 },
    { name: "仁王盾", type: "equip", subtype: "armor", count: 1 },
    { name: "白银狮子", type: "equip", subtype: "armor", count: 1 },
    { name: "藤甲", type: "equip", subtype: "armor", count: 1 },
    { name: "+1马", type: "equip", subtype: "plusHorse", count: 4 },
    { name: "-1马", type: "equip", subtype: "minusHorse", count: 4 }
  ];

  const GUHUO_DECLARE_NAMES = [
    "杀", "火杀", "雷杀", "闪", "桃", "酒",
    "无中生有", "顺手牵羊", "过河拆桥", "借刀杀人", "无懈可击", "决斗",
    "南蛮入侵", "万箭齐发", "桃园结义", "五谷丰登", "火攻", "铁索连环"
  ];

  const CARD_IMAGE_ASSETS = {
    "杀": "assets/cards/official/sha.jpg",
    "火杀": "assets/cards/official/huosha.jpg",
    "雷杀": "assets/cards/official/leisha.jpg",
    "闪": "assets/cards/official/shan.jpg",
    "桃": "assets/cards/official/tao.jpg",
    "酒": "assets/cards/official/jiu.jpg",
    "无中生有": "assets/cards/official/wuzhongshengyou.png",
    "顺手牵羊": "assets/cards/official/shunshouqianyang.png",
    "过河拆桥": "assets/cards/official/guohechaiqiao.png",
    "借刀杀人": "assets/cards/official/jiedaosharen.png",
    "无懈可击": "assets/cards/official/wuxiekeji.png",
    "决斗": "assets/cards/official/juedou.png",
    "南蛮入侵": "assets/cards/official/nanmanruqin.png",
    "万箭齐发": "assets/cards/official/wanjianqifa.png",
    "桃园结义": "assets/cards/official/taoyuanjieyi.png",
    "五谷丰登": "assets/cards/official/wugufengdeng.png",
    "火攻": "assets/cards/official/huogong.png",
    "铁索连环": "assets/cards/official/tiesuolianhuan.png",
    "乐不思蜀": "assets/cards/official/lebusishu.png",
    "兵粮寸断": "assets/cards/official/bingliangcunduan.png",
    "闪电": "assets/cards/official/shandian.png",
    "诸葛连弩": "assets/cards/official/zhugeliannu.png",
    "青釭剑": "assets/cards/official/115.png",
    "雌雄双股剑": "assets/cards/official/cixiongshuanggujian.png",
    "寒冰剑": "assets/cards/official/117.png",
    "丈八蛇矛": "assets/cards/official/zhangbashemao.png",
    "贯石斧": "assets/cards/official/guanshifu.png",
    "麒麟弓": "assets/cards/official/qilingong.png",
    "八卦阵": "assets/cards/official/baguazhen.png",
    "仁王盾": "assets/cards/official/renwangdun.png",
    "白银狮子": "assets/cards/official/baiyinshizi.png",
    "藤甲": "assets/cards/official/tengjia.png",
    "绝影": "assets/cards/official/plus-horse.png",
    "的卢": "assets/cards/official/plus-horse.png",
    "爪黄飞电": "assets/cards/official/plus-horse.png",
    "骅骝": "assets/cards/official/plus-horse.png",
    "大宛": "assets/cards/official/minus-horse.png",
    "赤兔": "assets/cards/official/minus-horse.png",
    "紫骍": "assets/cards/official/minus-horse.png",
    "+1马": "assets/cards/official/plus-horse.png",
    "-1马": "assets/cards/official/minus-horse.png"
  };

  const HORSE_DISPLAY_NAMES = {
    plusHorse: {
      "♠5": "绝影",
      "♣5": "的卢",
      "♥K": "爪黄飞电",
      "♦K": "骅骝"
    },
    minusHorse: {
      "♠K": "大宛",
      "♥5": "赤兔",
      "♣K": "紫骍",
      "♦5": "紫骍"
    }
  };

  function cardImageUrl(cardOrName) {
    const name = typeof cardOrName === "string" ? cardOrName : cardOrName?.name;
    return name ? CARD_IMAGE_ASSETS[name] || "" : "";
  }

  function imageVarStyle(url) {
    return url ? `--card-image: url('${url}')` : "";
  }

  function cardImageStyle(cardOrName) {
    return imageVarStyle(cardImageUrl(cardOrName));
  }

  const CARD_DECK_BLUEPRINT = [
    { name: "杀", codes: "♠7 ♠8 ♠8 ♠9 ♠9 ♠10 ♠10 ♠J ♣2 ♣3 ♣4 ♣5 ♣6 ♣7 ♣8 ♣8 ♣9 ♣9 ♣10 ♣10 ♣J ♣J ♥10 ♥10 ♥J ♥J ♥K ♦6 ♦7 ♦8 ♦9 ♦10 ♦J ♦K" },
    { name: "火杀", codes: "♥4 ♥7 ♥10 ♦4 ♦5 ♦Q" },
    { name: "雷杀", codes: "♠4 ♠5 ♠6 ♣5 ♣6 ♣7" },
    { name: "闪", codes: "♥2 ♥2 ♥3 ♥4 ♥8 ♥9 ♥K ♥K ♦A ♦2 ♦2 ♦3 ♦4 ♦5 ♦6 ♦7 ♦8 ♦9 ♦10 ♦J ♦J ♦Q ♦Q ♦K" },
    { name: "桃", codes: "♥A ♥3 ♥4 ♥6 ♥7 ♥8 ♥9 ♥Q ♦2 ♦3 ♦Q ♦K" },
    { name: "酒", codes: "♠3 ♠9 ♣3 ♣9 ♥A ♥9 ♦A ♦9" },
    { name: "无中生有", codes: "♥7 ♥8 ♥9 ♥J" },
    { name: "顺手牵羊", codes: "♠3 ♠4 ♣3 ♦3 ♦4" },
    { name: "过河拆桥", codes: "♠3 ♠4 ♠Q ♣3 ♣4 ♥Q" },
    { name: "借刀杀人", codes: "♣Q ♣K" },
    { name: "无懈可击", codes: "♠J ♠K ♣Q ♣K ♥A ♦Q ♦K" },
    { name: "决斗", codes: "♠A ♣A ♥A ♦A" },
    { name: "南蛮入侵", codes: "♠7 ♠K ♣7" },
    { name: "万箭齐发", codes: "♠A ♥A" },
    { name: "桃园结义", codes: "♥A ♥Q" },
    { name: "五谷丰登", codes: "♥3 ♥4" },
    { name: "火攻", codes: "♥2 ♥3 ♦Q" },
    { name: "铁索连环", codes: "♠J ♠Q ♠K ♣10 ♣J ♣Q" },
    { name: "乐不思蜀", codes: "♠6 ♣6 ♥6" },
    { name: "兵粮寸断", codes: "♠10 ♣4" },
    { name: "闪电", codes: "♠A" },
    { name: "诸葛连弩", codes: "♣A ♦A" },
    { name: "青釭剑", codes: "♠6" },
    { name: "雌雄双股剑", codes: "♠2" },
    { name: "寒冰剑", codes: "♠2" },
    { name: "青龙偃月刀", codes: "♠5" },
    { name: "丈八蛇矛", codes: "♠Q" },
    { name: "贯石斧", codes: "♦5" },
    { name: "方天画戟", codes: "♦Q" },
    { name: "麒麟弓", codes: "♥5" },
    { name: "古锭刀", codes: "♠A" },
    { name: "八卦阵", codes: "♠2 ♣2" },
    { name: "仁王盾", codes: "♣2" },
    { name: "白银狮子", codes: "♣A" },
    { name: "藤甲", codes: "♣2" },
    { name: "+1马", codes: "♠5 ♥K ♣5 ♦K" },
    { name: "-1马", codes: "♠K ♥5 ♣K ♦5" }
  ];

  const ROLE_NOTE_ORDER = ["unknown", "loyal", "rebel", "traitor", "lord"];
  const ROLE_NOTE_LABEL = {
    unknown: "标",
    loyal: "忠",
    rebel: "反",
    traitor: "内",
    lord: "主"
  };
  const ROLE_NOTE_LONG = {
    unknown: "未标注；悬停头像可标忠、反、内",
    loyal: "我判断他偏忠臣",
    rebel: "我判断他偏反贼",
    traitor: "我判断他偏内奸",
    lord: "主公/我确认的主公"
  };
  const CAREER_STORAGE_KEY = "sgs-singleplayer-career-v1";
  const MATCH_SAVE_STORAGE_KEY = "sgs-singleplayer-match-v1";

  const state = {
    started: false,
    gameOver: false,
    gameRecorded: false,
    gameStartedAt: 0,
    mode: "8",
    rosterMode: "strict",
    aiMode: "strategist",
    debug: false,
    tempo: "normal",
    loopId: 0,
    loopError: null,
    autoplayHuman: false,
    autoplayHumanForTurn: false,
    players: [],
    deck: [],
    discard: [],
    round: 1,
    current: 0,
    masterId: 0,
    log: [],
    spotlight: null,
    eventTrail: [],
    eventHoldUntil: 0,
    pendingWaitSpotlight: null,
    pendingWaitTimer: null,
    eventStepMode: false,
    eventStepWaiting: false,
    eventStepResolver: null,
    eventStepStartedAt: 0,
    decisionTrail: [],
    waitSeq: 0,
    pending: null,
    targetPick: null,
    cardPick: null,
    playContext: null,
    playCardId: null,
    testMode: false,
    extraTurns: [],
    currentExtraReturn: null,
    infoTab: "log",
    sidePanelCollapsed: false,
    logExpanded: false,
    logCollapsed: false,
    endGameModalOpen: false,
    generalPicker: {
      open: false,
      filter: "all",
      sort: "default",
      draft: "random"
    },
    reads: {},
    readReasons: {},
    roleNotes: {},
    cardReads: {},
    career: createEmptyCareer(),
    careerNotice: "",
    runStats: createEmptyRunStats(),
    lastMatchSaveAt: 0,
    lastMatchSaveReason: "",
    lastEventId: 1,
    status: {
      phase: "未开始",
      detail: "",
      actorId: null,
      updatedAt: 0,
      waitKind: null,
      waitId: 0,
      waitPrompt: "",
      waitingForId: null,
      waitStartedAt: 0,
      recoveries: 0,
      warning: ""
    }
  };

  let nextCardId = 1;
  let tooltipTarget = null;
  const identityPopoverState = {
    playerId: null,
    anchor: null,
    closeTimer: null,
    locked: false
  };

  function syncVisualViewportOffset() {
    const offsetLeft = window.visualViewport?.offsetLeft || 0;
    document.documentElement.style.setProperty("--sg-viewport-offset-left", `${offsetLeft}px`);
  }

  function correctGameViewportPosition() {
    const game = $("game");
    if (!game || game.classList.contains("hidden")) return;
    game.style.setProperty("transform", "none", "important");
    const left = game.getBoundingClientRect().left;
    const correction = Math.abs(left) > 0.5 ? -left : 0;
    game.style.setProperty("transform", correction ? `translateX(${correction}px)` : "none", "important");
  }

  function setGameViewportLock(locked) {
    const app = document.querySelector(".app");
    const game = $("game");
    const lockedStyles = {
      position: "fixed",
      inset: "0",
      left: "0",
      top: "0",
      width: "100vw",
      maxWidth: "none",
      minWidth: "0",
      height: "100dvh",
      margin: "0",
      transform: "none",
      overflow: "hidden"
    };
    const clearKeys = Object.keys(lockedStyles);
    if (locked) {
      syncVisualViewportOffset();
      requestAnimationFrame(syncVisualViewportOffset);
      setTimeout(syncVisualViewportOffset, 0);
      Object.assign(app.style, lockedStyles, { padding: "0" });
      Object.assign(game.style, lockedStyles);
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return;
    }
    clearKeys.concat("padding").forEach((key) => {
      app.style[key] = "";
      game.style[key] = "";
    });
    document.documentElement.style.removeProperty("--sg-viewport-offset-left");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  function boot() {
    state.career = loadCareerStats();
    renderSetupCareer();
    refreshGeneralSelect();
    renderSetupMatchSummary();
    renderContinueGameStatus();

    $("startGame").addEventListener("click", () => startGame(false));
    $("continueGame")?.addEventListener("click", handleContinueGameClick);
    $("quickSim").addEventListener("click", () => startGame(true));
    $("modeSelect").addEventListener("change", updateModeLabel);
    document.querySelectorAll("[data-mode-value]").forEach((button) => {
      button.addEventListener("click", () => setSetupMode(button.dataset.modeValue || "8"));
    });
    $("rosterSelect")?.addEventListener("change", handleRosterModeChange);
    $("aiMode")?.addEventListener("change", renderSetupMatchSummary);
    document.querySelectorAll("[data-ai-mode]").forEach((button) => {
      button.addEventListener("click", () => setSetupAiMode(button.dataset.aiMode || "strategist"));
    });
    document.querySelectorAll("[data-roster-mode]").forEach((button) => {
      button.addEventListener("click", () => setSetupRosterMode(button.dataset.rosterMode || "strict"));
    });
    $("debugMode")?.addEventListener("change", renderSetupMatchSummary);
    $("generalSelect")?.addEventListener("change", updateGeneralPickerSummary);
    $("generalPickerOpen")?.addEventListener("click", openGeneralPicker);
    $("generalPickerClose")?.addEventListener("click", () => closeGeneralPicker(false));
    $("generalPickerCancel")?.addEventListener("click", () => closeGeneralPicker(false));
    $("generalPickerConfirm")?.addEventListener("click", () => closeGeneralPicker(true));
    $("generalSort")?.addEventListener("change", (event) => {
      state.generalPicker.sort = event.target.value || "default";
      renderGeneralPicker();
    });
    document.querySelectorAll("[data-general-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        state.generalPicker.filter = button.dataset.generalFilter || "all";
        renderGeneralPicker();
      });
    });
    $("generalPickerBackdrop")?.addEventListener("click", (event) => {
      if (event.target?.id === "generalPickerBackdrop") closeGeneralPicker(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && state.generalPicker.open) closeGeneralPicker(false);
      if (event.key === "Escape" && !$("settingsModal")?.classList.contains("hidden")) closeSettingsModal();
    });
    $("tempoSelect")?.addEventListener("change", (event) => {
      state.tempo = event.target.value || "normal";
      renderTempoControls();
      renderSettingsPanel();
    });
    $("tempoQuick")?.addEventListener("click", openSettingsModal);
    $("settingsOpen")?.addEventListener("click", openSettingsModal);
    $("settingsClose")?.addEventListener("click", closeSettingsModal);
    $("settingsModal")?.addEventListener("click", (event) => {
      if (event.target?.id === "settingsModal") closeSettingsModal();
    });
    $("settingsContent")?.addEventListener("click", handleSettingsClick);
    $("newGame").addEventListener("click", () => {
      state.gameOver = true;
      state.loopId += 1;
      releaseEventStepWait();
      clearSavedMatch();
      hideTooltip();
      document.body.classList.remove("in-game");
      setGameViewportLock(false);
      $("setup").classList.remove("hidden");
      $("game").classList.add("hidden");
      renderSetupCareer();
      renderContinueGameStatus();
    });
    $("autoPlay")?.addEventListener("click", () => {
      activateAutoplayForTurn();
      render();
    });
    $("stepMode")?.addEventListener("click", () => {
      state.eventStepMode = !state.eventStepMode;
      if (!state.eventStepMode) releaseEventStepWait();
      renderStepControls();
    });
    $("nextEvent")?.addEventListener("click", () => {
      releaseEventStepWait();
    });
    $("sidePanelToggle")?.addEventListener("click", () => {
      state.sidePanelCollapsed = !state.sidePanelCollapsed;
      renderLayoutState();
      renderSettingsPanel();
    });
    $("logTab").addEventListener("click", () => {
      state.infoTab = "log";
      state.sidePanelCollapsed = false;
      state.logCollapsed = false;
      renderLayoutState();
      renderInfoPanel();
    });
    $("coverageTab").addEventListener("click", () => {
      state.infoTab = "coverage";
      state.sidePanelCollapsed = false;
      renderLayoutState();
      renderInfoPanel();
    });
    $("careerTab")?.addEventListener("click", () => {
      state.infoTab = "career";
      state.sidePanelCollapsed = false;
      renderLayoutState();
      renderInfoPanel();
    });
    $("readsTab").addEventListener("click", () => {
      state.infoTab = "reads";
      state.sidePanelCollapsed = false;
      renderLayoutState();
      renderInfoPanel();
    });
    $("logCollapse")?.addEventListener("click", () => {
      state.infoTab = "log";
      state.sidePanelCollapsed = false;
      state.logCollapsed = !state.logCollapsed;
      if (state.logCollapsed) state.logExpanded = false;
      renderLayoutState();
      renderInfoPanel();
    });
    $("logExpand")?.addEventListener("click", () => {
      state.infoTab = "log";
      state.sidePanelCollapsed = false;
      state.logExpanded = state.logCollapsed ? true : !state.logExpanded;
      if (state.logExpanded) state.logCollapsed = false;
      renderLayoutState();
      renderInfoPanel();
    });
    $("careerPanel")?.addEventListener("click", handleCareerActionClick);
    $("setupCareer")?.addEventListener("click", handleCareerActionClick);
    $("careerImportFile")?.addEventListener("change", handleCareerImportFile);
    $("endGameClose")?.addEventListener("click", () => closeEndGameModal());
    $("endGameModal")?.addEventListener("click", (event) => {
      if (event.target?.id === "endGameModal") closeEndGameModal();
    });
    $("endGameContent")?.addEventListener("click", handleEndGameActionClick);
    setupTooltips();
    setupIdentityPopover();
    setupRuntimeErrorHandlers();
    updateModeLabel();
    const params = new URLSearchParams(document.defaultView?.location?.search || "");
    if (params.get("scenario") === "human-play-ui") {
      prepareHumanPlayUiScenario();
    } else if (params.get("scenario") === "skill-gain-ui") {
      prepareSkillGainVisualScenario();
    } else if (params.get("scenario") === "delayed-nullify-ui") {
      prepareDelayedNullifyVisualScenario();
    } else if (params.get("scenario") === "judgement-reveal-ui") {
      prepareJudgementRevealVisualScenario();
    } else if (params.get("scenario") === "relation-event-ui") {
      prepareRelationEventVisualScenario();
    } else if (params.get("scenario") === "death-reveal-ui") {
      prepareDeathRevealVisualScenario();
    } else if (params.get("scenario") === "ai-decision-ui") {
      prepareAIDecisionTrailVisualScenario();
    } else if (params.get("scenario") === "endgame-ui") {
      prepareEndGameVisualScenario();
    }
  }

  async function startGame(autoplay) {
    resetState();
    state.mode = $("modeSelect").value || "8";
    state.rosterMode = $("rosterSelect")?.value || "strict";
    state.aiMode = $("aiMode").value;
    state.debug = $("debugMode").value === "on";
    state.tempo = $("tempoSelect")?.value || "normal";
    state.autoplayHuman = autoplay;
    document.activeElement?.blur?.();
    window.scrollTo?.(0, 0);
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
    document.body.classList.add("in-game");
    setGameViewportLock(true);
    $("setup").classList.add("hidden");
    $("game").classList.remove("hidden");
    correctGameViewportPosition();
    requestAnimationFrame(correctGameViewportPosition);
    setTimeout(correctGameViewportPosition, 0);

    const humanGeneral = $("generalSelect").value;
    setupPlayers(humanGeneral);
    state.deck = shuffle(createDeck());
    state.players.forEach((p) => drawCards(p, 4, false));
    log(`身份局开始。主公是 ${nameOf(playerById(state.masterId))}。`);
    saveMatchAtSafePoint("game-start");
    render();
    window.scrollTo?.(0, 0);
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
    correctGameViewportPosition();
    requestAnimationFrame(correctGameViewportPosition);
    await delay(400);
    startGameLoop();
  }

  function resetState() {
    const loopId = (state.loopId || 0) + 1;
    const eventStepMode = Boolean(state.eventStepMode);
    clearPendingWaitSpotlight();
    nextCardId = 1;
    Object.assign(state, {
      started: true,
      gameOver: false,
      gameRecorded: false,
      gameStartedAt: Date.now(),
      mode: "8",
      rosterMode: $("rosterSelect")?.value || "strict",
      autoplayHuman: false,
      autoplayHumanForTurn: false,
      tempo: $("tempoSelect")?.value || "normal",
      loopId,
      loopError: null,
      players: [],
      deck: [],
      discard: [],
      round: 1,
      current: 0,
      masterId: 0,
      log: [],
      spotlight: null,
      eventTrail: [],
      eventHoldUntil: 0,
      pendingWaitSpotlight: null,
      pendingWaitTimer: null,
      eventStepMode,
      eventStepWaiting: false,
      eventStepResolver: null,
      eventStepStartedAt: 0,
      decisionTrail: [],
      waitSeq: 0,
      pending: null,
      targetPick: null,
      cardPick: null,
      playContext: null,
      playCardId: null,
      testMode: false,
      extraTurns: [],
      currentExtraReturn: null,
      infoTab: "log",
      sidePanelCollapsed: false,
      logExpanded: false,
      logCollapsed: false,
      endGameModalOpen: false,
      reads: {},
      readReasons: {},
      roleNotes: {},
      cardReads: {},
      runStats: createEmptyRunStats(),
      lastMatchSaveAt: 0,
      lastMatchSaveReason: "",
      lastEventId: 1,
      status: {
        phase: "开局",
        detail: "",
        actorId: null,
        updatedAt: Date.now(),
        waitKind: null,
        waitId: 0,
        waitPrompt: "",
        waitingForId: null,
        waitStartedAt: 0,
        recoveries: 0,
        warning: ""
      }
    });
  }

  function setupPlayers(humanGeneralId) {
    const roles = shuffle([...(ROLE_SETS[state.mode] || ROLE_SETS["8"])]);
    const masterSeat = roles.indexOf("主公");
    state.masterId = masterSeat;
    state.current = masterSeat;

    const availableGenerals = rosterGenerals();
    const generalPool = shuffle([...availableGenerals]);
    const humanGeneral = humanGeneralId === "random"
      ? generalPool.pop()
      : availableGenerals.find((g) => g.id === humanGeneralId) || generalPool.pop();
    removeGeneralFromPool(generalPool, humanGeneral.id);
    const assignedGenerals = Array(roles.length).fill(null);
    assignedGenerals[0] = humanGeneral;
    if (masterSeat !== 0) {
      assignedGenerals[masterSeat] = pickAIGeneral(generalPool, {
        role: "主公",
        seat: masterSeat,
        masterSeat,
        mode: state.mode
      });
    }
    const lordGeneral = assignedGenerals[masterSeat] || humanGeneral;
    for (let i = 0; i < roles.length; i += 1) {
      if (assignedGenerals[i]) continue;
      assignedGenerals[i] = pickAIGeneral(generalPool, {
        role: roles[i],
        seat: i,
        masterSeat,
        mode: state.mode,
        lordGeneral,
        tableRoles: roles
      });
    }

    for (let i = 0; i < roles.length; i += 1) {
      const general = assignedGenerals[i] || drawUniqueGeneral(generalPool, humanGeneral.id);
      const maxHp = general.maxHp + (roles[i] === "主公" ? 1 : 0);
      const personality = createPersonality(i === 0, roles[i]);
      state.players.push({
        id: i,
        seat: i,
        isHuman: i === 0,
        name: i === 0 ? "你" : general.name,
        role: roles[i],
        revealed: roles[i] === "主公" || i === 0,
        general,
        hp: maxHp,
        maxHp,
        hand: [],
        equip: {},
        judgeArea: [],
        alive: true,
        linked: false,
        drunk: false,
        flags: {},
        extraSkills: [],
        tempSkills: [],
        disabledSkills: [],
        fields: [],
        buquPile: [],
        turn: {},
        personality
      });
    }

    state.players.forEach((p) => {
      state.reads[p.id] = {};
      state.readReasons[p.id] = {};
      state.cardReads[p.id] = { slash: 0, dodge: 0, peach: 0, nullify: 0 };
      state.roleNotes[p.id] = p.revealed ? roleToNote(p.role) : "unknown";
      state.players.forEach((target) => {
        state.reads[p.id][target.id] = target.role === "主公" ? -2 : 0;
        state.readReasons[p.id][target.id] = target.role === "主公" ? ["公开身份：主公"] : [];
      });
    });
  }

  function updateModeLabel() {
    const mode = $("modeSelect")?.value || "8";
    renderStartGameCta();
    renderModeSegment(mode);
    renderSetupMatchSummary();
  }

  function setupAiLabel(value = $("aiMode")?.value || state.aiMode || "strategist") {
    return {
      fair: "稳健",
      strategist: "老练",
      oracle: "强敌挑战"
    }[value] || "老练";
  }

  function setupRosterLabel(value = $("rosterSelect")?.value || state.rosterMode || "strict") {
    return {
      strict: "标准 + 风火林山",
      standard2013: "标准扩展",
      all: "全部武将"
    }[value] || "标准 + 风火林山";
  }

  function setupRosterShortLabel(value = $("rosterSelect")?.value || state.rosterMode || "strict") {
    return {
      strict: "标准池",
      standard2013: "扩展池",
      all: "全部武将"
    }[value] || "标准池";
  }

  function renderStartGameCta() {
    const start = $("startGame");
    if (!start) return;
    const mode = $("modeSelect")?.value || "8";
    const rosterMode = $("rosterSelect")?.value || state.rosterMode || "strict";
    const selected = $("generalSelect")?.value || "random";
    const general = rosterGenerals(rosterMode).find((item) => item.id === selected);
    const generalLabel = general ? general.name : "随机武将";
    start.textContent = "开始新局";
    start.dataset.tip = `开始${mode}人身份局\n${generalLabel} · ${setupAiLabel()} · ${setupRosterLabel(rosterMode)}\n主公公开，其余身份隐藏。`;
    start.dataset.subtitle = `${mode} 人身份局 · ${generalLabel} · ${setupAiLabel()} · ${setupRosterShortLabel(rosterMode)}`;
  }

  function setSetupMode(value) {
    const select = $("modeSelect");
    if (select) select.value = value === "5" ? "5" : "8";
    updateModeLabel();
  }

  function renderModeSegment(mode = $("modeSelect")?.value || "8") {
    document.querySelectorAll("[data-mode-value]").forEach((button) => {
      const active = (button.dataset.modeValue || "8") === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setSetupAiMode(value) {
    const normalized = ["fair", "strategist", "oracle"].includes(value) ? value : "strategist";
    const select = $("aiMode");
    if (select) select.value = normalized;
    renderAiSegment(normalized);
    renderSetupMatchSummary();
  }

  function renderAiSegment(mode = $("aiMode")?.value || "strategist") {
    document.querySelectorAll("[data-ai-mode]").forEach((button) => {
      const active = (button.dataset.aiMode || "strategist") === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function setSetupRosterMode(value) {
    const normalized = ["strict", "standard2013", "all"].includes(value) ? value : "strict";
    const select = $("rosterSelect");
    if (select) select.value = normalized;
    handleRosterModeChange();
  }

  function renderRosterSegment(mode = $("rosterSelect")?.value || state.rosterMode || "strict") {
    document.querySelectorAll("[data-roster-mode]").forEach((button) => {
      const active = (button.dataset.rosterMode || "strict") === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function handleRosterModeChange() {
    state.rosterMode = $("rosterSelect")?.value || "strict";
    refreshGeneralSelect(state.rosterMode);
    renderRosterSegment(state.rosterMode);
    renderSetupMatchSummary();
  }

  function refreshGeneralSelect(mode = $("rosterSelect")?.value || state.rosterMode || "strict") {
    const select = $("generalSelect");
    if (!select) return;
    const previous = select.value || "random";
    const generals = rosterGenerals(mode);
    select.innerHTML = `<option value="random">随机武将（${generals.length}人）</option>` + generals
      .map((g) => `<option value="${g.id}">${g.name}（${g.kingdom}，${g.maxHp}血）</option>`)
      .join("");
    select.value = generals.some((g) => g.id === previous) ? previous : "random";
    updateGeneralPickerSummary();
    renderGeneralPicker();
  }

  function openGeneralPicker() {
    state.generalPicker.open = true;
    state.generalPicker.draft = $("generalSelect")?.value || "random";
    $("generalPickerBackdrop")?.classList.remove("hidden");
    renderGeneralPicker();
  }

  function closeGeneralPicker(confirm) {
    if (confirm && $("generalSelect")) {
      $("generalSelect").value = state.generalPicker.draft || "random";
      updateGeneralPickerSummary();
    }
    state.generalPicker.open = false;
    $("generalPickerBackdrop")?.classList.add("hidden");
  }

  function updateGeneralPickerSummary() {
    const select = $("generalSelect");
    const summary = $("generalPickerSummary");
    const meta = $("generalPickerMeta");
    if (!select || !summary || !meta) return;
    const generals = rosterGenerals();
    const current = generals.find((general) => general.id === select.value);
    summary.textContent = current ? current.name : "随机武将";
    meta.textContent = current
      ? `${current.kingdom}势力 · ${current.maxHp}体力 · ${generalSkillKeywords(current).join(" / ")}`
      : `从 ${generals.length} 名武将中抽取`;
    renderSetupMatchSummary();
  }

  function loadSavedMatchInfo() {
    if (typeof localStorage === "undefined") return null;
    try {
      const raw = localStorage.getItem(MATCH_SAVE_STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!isUsableMatchSave(data)) return null;
      return data;
    } catch {
      return null;
    }
  }

  function isUsableMatchSave(data) {
    return Boolean(
      data
      && data.version === 1
      && data.resumable === true
      && Array.isArray(data.players)
      && data.players.length >= 2
      && Array.isArray(data.deck)
      && Array.isArray(data.discard)
      && Number.isInteger(data.current)
      && Number.isInteger(data.round)
    );
  }

  function clearSavedMatch() {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.removeItem(MATCH_SAVE_STORAGE_KEY);
    } catch {
      // Browser storage may be unavailable in restricted contexts.
    }
  }

  function saveMatchAtSafePoint(reason = "safe-point") {
    if (typeof localStorage === "undefined") return false;
    if (!canSaveMatchNow()) return false;
    try {
      const snapshot = createMatchSaveSnapshot(reason);
      localStorage.setItem(MATCH_SAVE_STORAGE_KEY, JSON.stringify(snapshot));
      state.lastMatchSaveAt = snapshot.savedAt;
      state.lastMatchSaveReason = reason;
      renderSettingsPanel();
      return true;
    } catch {
      return false;
    }
  }

  function canSaveMatchNow() {
    return Boolean(
      typeof localStorage !== "undefined"
      && state.started
      && !state.gameOver
      && !state.testMode
      && !state.pending
      && !state.targetPick
      && !state.cardPick
      && !state.playContext
      && !state.eventStepWaiting
    );
  }

  function latestMatchSaveInfo() {
    const saved = loadSavedMatchInfo();
    const at = state.lastMatchSaveAt || saved?.savedAt || 0;
    const reason = state.lastMatchSaveReason || saved?.reason || "";
    return { saved, at, reason };
  }

  function matchSaveReasonLabel(reason) {
    if (reason === "game-start") return "开局安全点";
    if (reason === "turn-start") return "回合开始";
    if (reason === "manual") return "手动保存";
    if (reason === "contract") return "测试存档";
    if (reason === "restored") return "读取存档";
    return "安全节点";
  }

  function createMatchSaveSnapshot(reason) {
    return {
      version: 1,
      resumable: true,
      savedAt: Date.now(),
      reason,
      mode: state.mode,
      rosterMode: state.rosterMode,
      aiMode: state.aiMode,
      debug: state.debug,
      tempo: state.tempo,
      gameStartedAt: state.gameStartedAt,
      gameRecorded: state.gameRecorded,
      round: state.round,
      current: state.current,
      masterId: state.masterId,
      players: state.players,
      deck: state.deck,
      discard: state.discard,
      log: state.log,
      spotlight: state.spotlight,
      eventTrail: state.eventTrail,
      decisionTrail: state.decisionTrail,
      extraTurns: state.extraTurns,
      currentExtraReturn: state.currentExtraReturn,
      reads: state.reads,
      readReasons: state.readReasons,
      roleNotes: state.roleNotes,
      cardReads: state.cardReads,
      runStats: state.runStats,
      lastEventId: state.lastEventId,
      status: {
        phase: "读取存档",
        detail: "从最近安全节点继续",
        actorId: state.current,
        updatedAt: Date.now(),
        waitKind: null,
        waitId: 0,
        waitPrompt: "",
        waitingForId: null,
        waitStartedAt: 0,
        recoveries: 0,
        warning: ""
      }
    };
  }

  function restoreSavedMatch(options = {}) {
    const saved = loadSavedMatchInfo();
    if (!saved) {
      renderContinueGameStatus();
      return false;
    }
    clearPendingWaitSpotlight();
    releaseEventStepWait();
    nextCardId = Math.max(nextCardId, maxSavedCardId(saved) + 1);
    Object.assign(state, {
      started: true,
      gameOver: false,
      gameRecorded: Boolean(saved.gameRecorded),
      gameStartedAt: saved.gameStartedAt || Date.now(),
      mode: saved.mode || "8",
      rosterMode: saved.rosterMode || "strict",
      aiMode: saved.aiMode || "strategist",
      debug: Boolean(saved.debug),
      tempo: saved.tempo || "normal",
      loopId: (state.loopId || 0) + 1,
      loopError: null,
      autoplayHuman: false,
      autoplayHumanForTurn: false,
      players: saved.players || [],
      deck: saved.deck || [],
      discard: saved.discard || [],
      round: saved.round || 1,
      current: saved.current || 0,
      masterId: saved.masterId || 0,
      log: saved.log || [],
      spotlight: saved.spotlight || null,
      eventTrail: saved.eventTrail || [],
      eventHoldUntil: 0,
      pendingWaitSpotlight: null,
      pendingWaitTimer: null,
      eventStepWaiting: false,
      eventStepResolver: null,
      eventStepStartedAt: 0,
      decisionTrail: saved.decisionTrail || [],
      waitSeq: 0,
      pending: null,
      targetPick: null,
      cardPick: null,
      playContext: null,
      playCardId: null,
      testMode: false,
      extraTurns: saved.extraTurns || [],
      currentExtraReturn: saved.currentExtraReturn || null,
      infoTab: "log",
      sidePanelCollapsed: false,
      logExpanded: false,
      logCollapsed: false,
      endGameModalOpen: false,
      reads: saved.reads || {},
      readReasons: saved.readReasons || {},
      roleNotes: saved.roleNotes || {},
      cardReads: saved.cardReads || {},
      runStats: saved.runStats || createEmptyRunStats(),
      lastMatchSaveAt: saved.savedAt || 0,
      lastMatchSaveReason: saved.reason || "restored",
      lastEventId: saved.lastEventId || 1,
      status: saved.status || {
        phase: "读取存档",
        detail: "从最近安全节点继续",
        actorId: saved.current || 0,
        updatedAt: Date.now(),
        waitKind: null,
        waitId: 0,
        waitPrompt: "",
        waitingForId: null,
        waitStartedAt: 0,
        recoveries: 0,
        warning: ""
      }
    });
    restorePlayerDefaults();
    if (options.renderDom !== false) {
      document.body?.classList?.add?.("in-game");
      setGameViewportLock(true);
      $("setup")?.classList.add("hidden");
      $("game")?.classList.remove("hidden");
      render();
    }
    if (options.autoStart !== false) startGameLoop();
    return true;
  }

  function restorePlayerDefaults() {
    state.players.forEach((player) => {
      player.hand ||= [];
      player.equip ||= {};
      player.judgeArea ||= [];
      player.flags ||= {};
      player.extraSkills ||= [];
      player.tempSkills ||= [];
      player.disabledSkills ||= [];
      player.fields ||= [];
      player.buquPile ||= [];
      player.turn ||= {};
      player.personality ||= createPersonality(player.isHuman, player.role);
      if (!player.general) player.general = GENERALS.find((general) => general.name === player.name) || GENERALS[0];
    });
  }

  function maxSavedCardId(saved) {
    let max = 0;
    const visitCard = (card) => {
      if (card && typeof card === "object" && typeof card.name === "string" && Number.isFinite(card.id)) {
        max = Math.max(max, Number(card.id));
      }
    };
    const visitCards = (value) => {
      if (!value) return;
      if (Array.isArray(value)) {
        value.forEach(visitCards);
        return;
      }
      if (typeof value === "object") {
        visitCard(value);
        Object.values(value).forEach(visitCards);
      }
    };
    visitCards(saved.deck);
    visitCards(saved.discard);
    visitCards(saved.players?.map((player) => [player.hand, player.equip, player.judgeArea, player.fields, player.buquPile]));
    return max;
  }

  function renderContinueGameStatus() {
    const button = $("continueGame");
    if (!button) return;
    const status = $("continueGameStatus");
    const saved = loadSavedMatchInfo();
    const canResume = Boolean(saved);
    const currentPlayer = canResume ? saved.players?.find((player) => player.id === saved.current) : null;
    const currentName = currentPlayer ? nameOf(currentPlayer).replace(/^你\((.+)\)$/, "$1") : "";
    button.dataset.label = "继续上次对局";
    button.dataset.resumeState = canResume ? "ready" : "empty";
    button.disabled = !canResume;
    button.classList.toggle("is-empty", !canResume);
    button.classList.toggle("is-ready", canResume);
    const statusText = canResume
      ? `第 ${Number(saved.round) || 1} 轮 · ${saved.mode === "5" ? "五人" : "八人"}身份局${currentName ? ` · ${currentName}行动` : ""}`
      : "暂无可继续对局";
    if (status) status.textContent = statusText;
    button.dataset.tip = canResume
      ? `继续上次对局\n${statusText}\n恢复到最近一次安全保存的牌桌。`
      : "继续上次对局\n当前没有保存中的牌局；开局后会在回合开始等安全节点自动保存。";
  }

  function handleContinueGameClick() {
    renderContinueGameStatus();
    const button = $("continueGame");
    if (!button || button.disabled) return;
    restoreSavedMatch();
  }

  function renderSetupMatchSummary() {
    const summary = $("setupMatchSummary");
    if (!summary) return;
    const mode = $("modeSelect")?.value || "8";
    const rosterMode = $("rosterSelect")?.value || state.rosterMode || "strict";
    const aiMode = $("aiMode")?.value || state.aiMode || "strategist";
    const debugMode = $("debugMode")?.value || "off";
    const generals = rosterGenerals(rosterMode);
    const selected = $("generalSelect")?.value || "random";
    const general = generals.find((item) => item.id === selected);
    const aiLabel = setupAiLabel(aiMode);
    renderAiSegment(aiMode);
    const rosterLabel = setupRosterLabel(rosterMode);
    renderRosterSegment(rosterMode);
    renderStartGameCta();
    const infoLabel = debugMode === "on" ? "调试可见" : "身份信息";
    const infoDetail = debugMode === "on" ? "AI 手牌公开" : "主公公开 · 暗身份";
    summary.innerHTML = `
      <span class="setup-summary-chip"><b>武将包</b><em>${escapeHtml(rosterLabel)} · ${generals.length}人</em></span>
      <span class="setup-summary-chip setup-summary-ai"><b>AI 难度</b><em>${escapeHtml(aiLabel)}</em></span>
      <span class="setup-summary-chip setup-summary-info"><b>${escapeHtml(infoLabel)}</b><em>${escapeHtml(infoDetail)}</em></span>
    `;
    renderContinueGameStatus();
  }

  function renderGeneralPicker() {
    const backdrop = $("generalPickerBackdrop");
    const grid = $("generalPickerGrid");
    if (!backdrop || !grid) return;
    backdrop.classList.toggle("hidden", !state.generalPicker.open);
    document.querySelectorAll("[data-general-filter]").forEach((button) => {
      button.classList.toggle("active", (button.dataset.generalFilter || "all") === state.generalPicker.filter);
    });
    if ($("generalSort")) $("generalSort").value = state.generalPicker.sort || "default";
    const mode = $("rosterSelect")?.value || state.rosterMode || "strict";
    const all = rosterGenerals(mode);
    const filtered = all
      .filter((general) => state.generalPicker.filter === "all" || general.kingdom === state.generalPicker.filter)
      .sort(generalPickerSorter(state.generalPicker.sort || "default"));
    const randomSelected = (state.generalPicker.draft || "random") === "random";
    grid.innerHTML = `
      <button type="button" class="general-option random-option ${randomSelected ? "selected" : ""}" data-general-id="random">
        <span class="general-option-crest">?</span>
        <strong>随机武将</strong>
        <small>${all.length} 人池 · 开局随机</small>
        <em>适合直接开局</em>
      </button>
      ${filtered.map((general) => renderGeneralOption(general)).join("")}
    `;
    if (typeof grid.querySelectorAll === "function") {
      grid.querySelectorAll("[data-general-id]").forEach((button) => {
        button.addEventListener("click", () => {
          state.generalPicker.draft = button.dataset.generalId || "random";
          renderGeneralPicker();
        });
      });
    }
  }

  function renderGeneralOption(general) {
    const selected = state.generalPicker.draft === general.id;
    const skills = (general.skills || []).map((skill) => SKILL_TEXT[skill] || skill);
    const keywords = generalSkillKeywords(general);
    return `
      <button type="button" class="general-option ${kingdomClass(general.kingdom)} ${selected ? "selected" : ""}" data-general-id="${escapeAttr(general.id)}">
        <span class="general-option-portrait" style="${escapeAttr(portraitVars({ general }))}">
          <b>${escapeHtml(general.kingdom)}</b>
          <i>${escapeHtml(portraitDisplayName(general.name))}</i>
        </span>
        <strong>${escapeHtml(general.name)}</strong>
        <small>${escapeHtml(general.kingdom)}势力 · ${general.maxHp}体力</small>
        <em>${escapeHtml(keywords.join(" / "))}</em>
        <span>${escapeHtml(skills.slice(0, 3).join("、") || "无技能")}</span>
      </button>
    `;
  }

  function generalPickerSorter(sort) {
    const kingdomOrder = { "魏": 0, "蜀": 1, "吴": 2, "群": 3 };
    if (sort === "kingdom") return (a, b) => (kingdomOrder[a.kingdom] ?? 9) - (kingdomOrder[b.kingdom] ?? 9) || a.name.localeCompare(b.name, "zh-Hans-CN");
    if (sort === "hp") return (a, b) => b.maxHp - a.maxHp || a.name.localeCompare(b.name, "zh-Hans-CN");
    if (sort === "skill") return (a, b) => generalPrimaryTrait(a).localeCompare(generalPrimaryTrait(b), "zh-Hans-CN") || a.name.localeCompare(b.name, "zh-Hans-CN");
    return () => 0;
  }

  function generalPrimaryTrait(general) {
    const traits = [
      ["进攻", generalTraitScore(general, "offense")],
      ["支援", generalTraitScore(general, "support")],
      ["控制", generalTraitScore(general, "control")],
      ["防守", generalTraitScore(general, "defense")]
    ].sort((a, b) => b[1] - a[1]);
    return traits[0]?.[1] > 0 ? traits[0][0] : "均衡";
  }

  function generalSkillKeywords(general) {
    const primary = generalPrimaryTrait(general);
    const skills = (general.skills || []).map((skill) => SKILL_TEXT[skill] || skill).slice(0, 2);
    return [primary, ...skills].slice(0, 3);
  }

  function rosterGenerals(mode = state.rosterMode || $("rosterSelect")?.value || "strict") {
    return GENERALS.filter((general) => rosterIncludesGeneral(general.id, mode));
  }

  function rosterIncludesGeneral(id, mode) {
    if (ROSTER_EXTRAS.future.has(id)) return mode === "all";
    if (ROSTER_EXTRAS.standard2013.has(id)) return mode === "standard2013" || mode === "all";
    return true;
  }

  function drawUniqueGeneral(pool, avoidId) {
    let g = pool.pop();
    while (g?.id === avoidId && pool.length) g = pool.pop();
    const fallback = rosterGenerals();
    return g || fallback[Math.floor(Math.random() * fallback.length)] || GENERALS[Math.floor(Math.random() * GENERALS.length)];
  }

  function removeGeneralFromPool(pool, id) {
    const index = pool.findIndex((general) => general.id === id);
    return index >= 0 ? pool.splice(index, 1)[0] : null;
  }

  function pickAIGeneral(pool, context = {}) {
    if (!pool.length) return drawUniqueGeneral(pool, context.avoidId);
    const options = aiGeneralPickOptions(pool, context, true);
    const total = options.reduce((sum, item) => sum + item.weight, 0);
    let pick = Math.random() * total;
    const selected = options.find((item) => {
      pick -= item.weight;
      return pick <= 0;
    }) || options[0];
    return removeGeneralFromPool(pool, selected.general.id) || selected.general;
  }

  function aiGeneralPickOptions(pool, context = {}, withRandomNoise = false) {
    const temperature = context.role === "主公" ? 0.72 : context.role === "内奸" ? 0.78 : 0.86;
    return pool
      .map((general) => {
        const score = aiGeneralPickScore(general, context) + (withRandomNoise ? rand(-0.28, 0.28) : 0);
        return { general, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => ({ ...item, weight: Math.exp(item.score / temperature) }));
  }

  const GENERAL_PICK_TRAITS = {
    support: new Set(["rende", "qingnang", "jieyin", "zhijian", "fangquan", "jieming", "yiji", "haoshi", "yinghun", "dimeng", "jijiu", "jiuyuan", "jijiang", "hujia", "huangtian", "zhiba", "songwei", "buqu", "beige", "weidi", "enyuan", "xuanhuo", "jujian", "ganlu", "buyi", "anxu", "zhuiyi"]),
    offense: new Set(["paoxiao", "wushuang", "luanji", "qiangxi", "fanjian", "quhu", "tianyi", "tiaoxin", "jixi", "qixi", "duanliang", "liegong", "tieji", "lieren", "leiji", "huoji", "qice", "luanwu", "kurou", "jueqing"]),
    control: new Set(["guicai", "guidao", "guanxing", "qiaobian", "keji", "qianxun", "kongcheng", "kanpo", "dimeng", "guzheng", "haoshi", "qice", "wansha", "weimu", "zhiheng", "fankui", "ganglie", "wuyan", "xuanhuo", "ganlu", "anxu"]),
    defense: new Set(["hujia", "jijiu", "bazhen", "xiangle", "buqu", "yiji", "fankui", "ganglie", "enyuan", "beige", "tuntian", "kongcheng", "longdan", "kanpo", "wusheng", "jizhi", "wuyan", "shangshi", "buyi", "zhuiyi"])
  };

  function aiGeneralPickScore(general, context = {}) {
    const role = context.role || "反贼";
    const lord = context.lordGeneral || null;
    const support = generalTraitScore(general, "support");
    const offense = generalTraitScore(general, "offense");
    const control = generalTraitScore(general, "control");
    const defense = generalTraitScore(general, "defense");
    const hp = general.maxHp || 4;
    let score = hp >= 4 ? 0.22 : -0.05;
    if (role === "主公") {
      score += defense * 0.48 + control * 0.32 + offense * 0.18 + support * 0.16 + (hp - 3) * 0.2;
      if (hasAnySkill(general, ["jijiang", "hujia", "jiuyuan", "huangtian", "zhiba", "songwei", "baonue", "xueyi"])) score += 0.34;
    } else if (role === "忠臣") {
      score += support * 0.62 + control * 0.32 + defense * 0.28 + offense * 0.22;
      score += lordSynergyScore(general, lord) * 0.9;
    } else if (role === "反贼") {
      score += offense * 0.52 + control * 0.38 + defense * 0.12 + support * 0.08;
      if (lord && general.kingdom === lord.kingdom) score -= 0.08;
    } else {
      score += defense * 0.44 + control * 0.42 + offense * 0.22 - Math.max(0, support - 0.8) * 0.18 + (hp >= 4 ? 0.2 : 0);
    }
    return score;
  }

  function generalTraitScore(general, trait) {
    const skills = general?.skills || [];
    const set = GENERAL_PICK_TRAITS[trait] || new Set();
    return skills.reduce((sum, skill) => sum + (set.has(skill) ? 1 : 0), 0);
  }

  function hasAnySkill(general, skills) {
    return skills.some((skill) => general?.skills?.includes(skill));
  }

  function lordSynergyScore(general, lord) {
    if (!general || !lord) return 0;
    let score = general.kingdom === lord.kingdom ? 0.45 : 0;
    const skills = lord.skills || [];
    if (skills.includes("jijiang") && general.kingdom === "蜀") score += 0.62;
    if (skills.includes("hujia") && general.kingdom === "魏") score += 0.62;
    if (skills.includes("jiuyuan") && general.kingdom === "吴") score += 0.62;
    if ((skills.includes("huangtian") || skills.includes("xueyi") || skills.includes("baonue")) && general.kingdom === "群") score += 0.58;
    if ((skills.includes("zhiba") || skills.includes("songwei")) && general.kingdom === lord.kingdom) score += 0.5;
    return score;
  }

  function createPersonality(isHuman, role) {
    if (isHuman) {
      return { key: "human", label: "玩家", aggression: 1, caution: 1, trickiness: 1, loyalty: 1, patience: 1, chaos: 1 };
    }
    let pool = AI_PROFILES;
    if (role === "主公" || role === "忠臣") pool = AI_PROFILES.filter((p) => p.key === "shield" || p.key === "control");
    if (role === "反贼") pool = AI_PROFILES.filter((p) => p.key === "blade" || p.key === "control" || p.key === "mask");
    if (role === "内奸") pool = AI_PROFILES.filter((p) => p.key === "control" || p.key === "mask");
    const base = randomOf(pool);
    return {
      key: base.key,
      label: base.label,
      aggression: clamp(base.aggression * rand(0.88, 1.12), 0.55, 1.65),
      caution: clamp(base.caution * rand(0.88, 1.12), 0.55, 1.65),
      trickiness: clamp(base.trickiness * rand(0.88, 1.12), 0.55, 1.75),
      loyalty: clamp(base.loyalty * rand(0.88, 1.12), 0.55, 1.55),
      patience: clamp(base.patience * rand(0.88, 1.12), 0.55, 1.55),
      chaos: clamp(base.chaos * rand(0.88, 1.12), 0.55, 1.65)
    };
  }

  function startGameLoop() {
    const loopId = state.loopId;
    gameLoop(loopId).catch((error) => handleGameLoopError(error, loopId));
  }

  async function gameLoop(loopId = state.loopId) {
    while (!state.gameOver && loopId === state.loopId) {
      const player = state.players[state.current];
      const completedId = player?.id ?? state.current;
      if (player?.alive) {
        markStatus("回合进行", player, "准备进入角色回合");
        saveMatchAtSafePoint("turn-start");
        await takeTurn(player);
      }
      if (state.gameOver || loopId !== state.loopId) break;
      advanceTurnAfterCompleted(completedId);
      markStatus("切换座次", playerById(state.current), "等待下一名角色");
      render();
      await delay(250);
    }
  }

  function scheduleExtraTurn(granter, target) {
    if (!target?.alive) return false;
    const activeReturn = state.currentExtraReturn;
    const fallbackReturnTo = granter ? nextAliveIndex(granter.id) : nextAliveIndex(state.current);
    const returnTo = activeReturn?.returnTo != null && playerById(activeReturn.returnTo)?.alive
      ? activeReturn.returnTo
      : fallbackReturnTo;
    const roundIncrement = activeReturn?.returnTo != null
      ? Boolean(activeReturn.roundIncrement)
      : granter ? turnPassedRoundBoundary(granter.id, returnTo) : turnPassedRoundBoundary(state.current, returnTo);
    state.extraTurns.push({ playerId: target.id, returnTo, roundIncrement });
    return true;
  }

  function normalizeExtraTurnEntry(entry, completedId) {
    if (entry == null) return null;
    if (typeof entry === "object") {
      return {
        playerId: entry.playerId,
        returnTo: entry.returnTo,
        roundIncrement: Boolean(entry.roundIncrement)
      };
    }
    const returnTo = nextAliveIndex(completedId);
    return { playerId: entry, returnTo, roundIncrement: turnPassedRoundBoundary(completedId, returnTo) };
  }

  function nextQueuedExtraTurn(completedId) {
    while (state.extraTurns.length) {
      const entry = normalizeExtraTurnEntry(state.extraTurns.shift(), completedId);
      if (entry && playerById(entry.playerId)?.alive) return entry;
    }
    return null;
  }

  function advanceTurnAfterCompleted(completedId) {
    const extra = nextQueuedExtraTurn(completedId);
    if (extra) {
      state.current = extra.playerId;
      state.currentExtraReturn = { returnTo: extra.returnTo, roundIncrement: extra.roundIncrement };
      log(`${nameOf(playerById(extra.playerId))} 开始额外回合。`);
      return "extra";
    }
    const returnInfo = state.currentExtraReturn;
    state.currentExtraReturn = null;
    if (returnInfo?.returnTo != null && playerById(returnInfo.returnTo)?.alive) {
      if (returnInfo.roundIncrement) state.round += 1;
      state.current = returnInfo.returnTo;
      return "return";
    }
    const next = nextAliveIndex(completedId);
    if (turnPassedRoundBoundary(completedId, next)) state.round += 1;
    state.current = next;
    return "normal";
  }

  function handleGameLoopError(error, loopId) {
    if (loopId !== state.loopId || state.gameOver) return;
    recordRuntimeIssue(error, "结算异常", true);
  }

  async function takeTurn(player) {
    if (player.flags.skipTurnOnce) {
      player.flags.skipTurnOnce = false;
      markStatus("翻面跳过", player, "跳过整个回合");
      log(`${nameOf(player)} 翻回正面，跳过本回合。`);
      await eventPause(1180, "important");
      state.autoplayHumanForTurn = false;
      return;
    }
    resetTurnFlags(player);
    markStatus("回合开始", player, "准备阶段前");
    log(`进入 ${nameOf(player)} 的回合。`);
    await eventPause(player.isHuman && !state.autoplayHuman ? 160 : 520);

    markStatus("准备阶段", player);
    await startPhase(player);
    if (!player.alive || state.gameOver) return;

    let judgeResult = { skipDraw: false, skipPlay: false };
    const usedEarlyShensu = await maybeShensuEarly(player);
    if (!player.alive || state.gameOver) return;
    if (!usedEarlyShensu) {
      markStatus("判定阶段", player);
      judgeResult = await maybeQiaobianJudge(player) ? { skipDraw: false, skipPlay: false } : await judgePhase(player);
      if (!player.alive || state.gameOver) return;

      markStatus("摸牌阶段", player);
      if (!judgeResult.skipDraw && !(await maybeQiaobianDraw(player))) await drawPhase(player);
      if (!player.alive || state.gameOver) return;
    }

    if (player.flags.skipPlayOnce) {
      player.flags.skipPlayOnce = false;
      log(`${nameOf(player)} 跳过出牌阶段。`);
    } else if (!judgeResult.skipPlay) {
      markStatus("出牌阶段", player);
      if (!(await maybeShensuPlay(player)) && !(await maybeQiaobianPlay(player))) await playPhase(player);
    }
    if (!player.alive || state.gameOver) return;

    markStatus("弃牌阶段", player);
    if (!(await maybeQiaobianDiscard(player))) await discardPhase(player);
    if (!player.alive || state.gameOver) return;

    markStatus("结束阶段", player);
    await endPhase(player);
    player.drunk = false;
    state.autoplayHumanForTurn = false;
  }

  function resetTurnFlags(player) {
    player.turn = {
      slashUsed: 0,
      usedSkills: {},
      usedSlashThisTurn: false,
      usedWine: false,
      luoyi: false,
      tianyi: false,
      shuangxiongColor: null,
      gaveByRende: 0,
      haoshi: false
    };
  }

  function turnUsedSkills(player) {
    if (!player.turn) player.turn = {};
    if (!player.turn.usedSkills) player.turn.usedSkills = {};
    return player.turn.usedSkills;
  }

  async function maybeShensuEarly(player) {
    const usedSkills = turnUsedSkills(player);
    if (!hasSkill(player, "shensu") || usedSkills.shensuEarly) return false;
    const move = await chooseShensuMove(player, "early");
    if (!move) return false;
    usedSkills.shensuEarly = true;
    markStatus("神速", player, "跳过判定阶段和摸牌阶段");
    log(`${nameOf(player)} 发动神速，跳过判定阶段和摸牌阶段，视为对 ${nameOf(move.targets[0])} 使用杀。`);
    await resolveShensuSlash(player, move);
    return true;
  }

  async function maybeShensuPlay(player) {
    const usedSkills = turnUsedSkills(player);
    if (!hasSkill(player, "shensu") || usedSkills.shensuPlay || !chooseShensuEquip(player)) return false;
    const move = await chooseShensuMove(player, "play");
    if (!move) return false;
    const equip = await payShensuEquipCost(player);
    if (!equip) return false;
    usedSkills.shensuPlay = true;
    markStatus("神速", player, "跳过出牌阶段");
    log(`${nameOf(player)} 发动神速，弃置 ${cardName(equip.card)} 并跳过出牌阶段，视为对 ${nameOf(move.targets[0])} 使用杀。`);
    await resolveShensuSlash(player, move);
    return true;
  }

  async function chooseShensuMove(player, stage) {
    const action = shensuAction(stage);
    const targets = legalTargets(player, action);
    if (!targets.length) return null;
    if (humanControls(player)) {
      const prompt = stage === "early"
        ? "是否发动神速，跳过判定阶段和摸牌阶段，视为使用一张无距离限制的杀？"
        : "是否发动神速，弃置一张装备并跳过出牌阶段，视为使用一张无距离限制的杀？";
      if (!(await askYesNo(prompt, false, player))) return null;
      const target = await askHumanTarget("神速：选择杀的目标。", targets, player);
      return target ? { ...action, targets: [target], score: 1 } : null;
    }
    const best = targets
      .map((target) => {
        const move = { ...action, targets: [target] };
        move.score = scoreMove(player, move) + shensuStageAdjustment(player, stage);
        return move;
      })
      .sort((a, b) => b.score - a.score)[0] || null;
    if (!best) return null;
    const threshold = stage === "early" ? 0.82 + player.personality.caution * 0.2 : 0.58 + player.personality.caution * 0.14;
    return best.score > threshold ? best : null;
  }

  function shensuAction(stage) {
    return {
      type: "skill",
      skill: "shensu",
      shensuStage: stage,
      label: stage === "early" ? "神速一" : "神速二",
      needsTarget: true,
      targetMode: "hostile",
      effect: "slash",
      scoreHint: stage === "early" ? 0.45 : 0.75
    };
  }

  function shensuStageAdjustment(player, stage) {
    if (stage === "early") {
      const harmfulJudges = player.judgeArea.filter((card) => isHarmfulJudgeCard(card)).length;
      return -1.2 - player.personality.caution * 0.18 + harmfulJudges * 1.15 + (player.hp <= 2 ? -0.18 : 0);
    }
    const equip = chooseShensuEquip(player);
    if (!equip) return -9;
    return -0.32 - cardKeepValue(player, equip.card) * 0.34 + (player.hand.length <= handLimit(player) ? 0.12 : 0);
  }

  function chooseShensuEquip(player) {
    return Object.entries(player.equip)
      .filter(([, card]) => card)
      .map(([slot, card]) => ({ slot, card }))
      .sort((a, b) => cardKeepValue(player, a.card) - cardKeepValue(player, b.card))[0] || null;
  }

  async function payShensuEquipCost(player) {
    const equipOptions = Object.entries(player.equip)
      .filter(([, card]) => card)
      .map(([slot, card]) => ({ label: card.name, value: slot, card }));
    if (!equipOptions.length) return null;
    const slot = humanControls(player)
      ? await askChoice("神速：弃置一张装备。", equipOptions, player)
      : chooseShensuEquip(player)?.slot;
    if (!slot) return null;
    const card = removeEquipCard(player, slot);
    if (!card) return null;
    discardCards([card]);
    await afterLoseHand(player, { lostHand: false, lostCard: true });
    return { slot, card };
  }

  async function resolveShensuSlash(player, move) {
    player.turn.usedSlashThisTurn = true;
    await resolveSlash(player, move.targets[0], virtualCard({ id: `shensu-${move.shensuStage}`, suit: "♠", rank: "" }, "杀", "basic", "slash"), { name: "神速", virtual: true });
    updateReadsForMove(player, move);
  }

  async function startPhase(player) {
    if (hasSkill(player, "huashen")) {
      performHuashen(player);
    }
    if (hasSkill(player, "zhiji") && !player.flags.zhijiAwakened && player.hand.length === 0) {
      await performZhiji(player);
    }
    if (hasSkill(player, "hunzi") && !player.flags.hunziAwakened && player.hp <= 1) {
      player.flags.hunziAwakened = true;
      await loseMaxHp(player, 1);
      ["yingzi", "yinghun"].forEach((skill) => {
        if (!player.extraSkills.includes(skill)) player.extraSkills.push(skill);
      });
      log(`${nameOf(player)} 觉醒魂姿，获得英姿和英魂。`);
    }
    if (hasSkill(player, "ruoyu") && player.role === "主公" && !player.flags.ruoyuAwakened && hasLowestHp(player)) {
      player.flags.ruoyuAwakened = true;
      player.maxHp += 1;
      heal(player, player, 1);
      if (!player.extraSkills.includes("jijiang")) player.extraSkills.push("jijiang");
      log(`${nameOf(player)} 觉醒若愚，增加 1 点体力上限、回复 1 点体力并获得激将。`);
    }
    if (hasSkill(player, "yinghun") && player.hp < player.maxHp) {
      await performYinghun(player);
    }
    if (hasSkill(player, "luoshen")) {
      await performLuoshen(player);
    }
    if (hasSkill(player, "guanxing")) {
      await performGuanxing(player);
    }
  }

  async function performZhiji(player) {
    player.flags.zhijiAwakened = true;
    await loseMaxHp(player, 1);
    if (!player.alive) return;
    const choice = humanControls(player)
      ? await askChoice("志继：回复 1 点体力，还是摸两张牌？", [
        { label: "回复体力", value: "heal" },
        { label: "摸两张牌", value: "draw" }
      ], player)
      : (player.hp < player.maxHp ? "heal" : "draw");
    let benefitText = "";
    if (choice === "heal") {
      const healed = heal(player, player, 1, `${nameOf(player)} 因志继回复 1 点体力。`);
      benefitText = healed > 0 ? "回复 1 点体力" : "选择回复体力";
    } else {
      drawCards(player, 2, false);
      log(`${nameOf(player)} 因志继摸 2 张牌。`);
      benefitText = "摸 2 张牌";
    }
    if (!player.extraSkills.includes("guanxing")) player.extraSkills.push("guanxing");
    log(`${nameOf(player)} 觉醒志继，失去 1 点体力上限，${benefitText}并获得观星。`);
  }

  async function judgePhase(player) {
    const result = { skipDraw: false, skipPlay: false };
    for (let i = 0; i < player.judgeArea.length; i += 1) {
      const delayed = player.judgeArea[i];
      const originalSource = playerById(delayed.sourceId);
      const nullifySource = originalSource?.alive ? originalSource : player;
      if (await maybeNullify(nullifySource, player, delayed, {
        seatStartId: player.id,
        reason: `${nameOf(player)} 判定区的 ${delayed.name} 即将结算，是否使用无懈可击？`
      })) {
        player.judgeArea.splice(i, 1);
        i -= 1;
        discardCards([delayed]);
        log(`${nameOf(player)} 判定阶段结算 ${delayed.name}，被无懈可击抵消。`);
        await eventPause(760, "important");
        continue;
      }
      const judge = await judgeCard(player, delayed.name);
      player.judgeArea.splice(i, 1);
      i -= 1;

      if (delayed.subtype === "lebu") {
        if (judge.suit !== "♥") {
          result.skipPlay = true;
          log(`${nameOf(player)} 的乐不思蜀生效，跳过出牌阶段。`);
        } else {
          log(`${nameOf(player)} 的乐不思蜀判定成功。`);
        }
        discardCards([delayed]);
      }
      if (delayed.subtype === "bingliang") {
        if (judge.suit !== "♣") {
          result.skipDraw = true;
          log(`${nameOf(player)} 的兵粮寸断生效，跳过摸牌阶段。`);
        } else {
          log(`${nameOf(player)} 的兵粮寸断判定成功。`);
        }
        discardCards([delayed]);
      }
      if (delayed.subtype === "lightning") {
        if (judge.suit === "♠" && rankValue(judge.rank) >= 2 && rankValue(judge.rank) <= 9) {
          log(`${nameOf(player)} 被闪电击中。`);
          await damage(null, player, 3, DAMAGE.THUNDER, delayed);
          discardCards([delayed]);
        } else {
          const next = playerById(nextAliveIndex(player.id));
          if (next) next.judgeArea.push(delayed);
          log(`闪电没有命中，移动给 ${nameOf(next)}。`);
        }
      }
    }
    return result;
  }

  async function drawPhase(player) {
    if (player.flags.skipDrawOnce) {
      player.flags.skipDrawOnce = false;
      log(`${nameOf(player)} 跳过摸牌阶段。`);
      return;
    }
    if (hasSkill(player, "zaiqi") && player.hp < player.maxHp) {
      const use = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askYesNo(`${nameOf(player)} 是否发动再起？`, true, player)
        : player.hp <= 2 || player.maxHp - player.hp >= 2;
      if (use) {
        await performZaiqi(player);
        return;
      }
    }
    if (hasSkill(player, "tuxi") && countStealableOpponents(player) > 0) {
      const use = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askYesNo(`${nameOf(player)} 是否发动突袭，放弃摸牌并获得至多两名角色各一张手牌？`, true, player)
        : aiShouldTuxi(player);
      if (use) {
        const candidates = tuxiCandidates(player);
        const targets = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
          ? await pickTargets("突袭：选择至多两名有手牌的角色。", candidates, 1, Math.min(2, candidates.length))
          : chooseTuxiTargets(player);
        if (targets.length) {
          for (const target of targets) {
            await stealRandomHandCard(player, target, "突袭");
          }
          log(`${nameOf(player)} 发动突袭，获得 ${targets.map(nameOf).join("、")} 的手牌。`);
          await eventPause(520);
          return;
        }
      }
    }

    let drawCount = 2;
    if (hasSkill(player, "yingzi")) drawCount += 1;
    if (hasSkill(player, "haoshi")) {
      const use = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askYesNo(`${nameOf(player)} 是否发动好施？多摸两张牌；若此时手牌数大于 5，需交给手牌最少的一名其他角色一半手牌（向下取整）。`, true, player)
        : aiShouldUseHaoshi(player, drawCount);
      if (use) {
        player.turn.haoshi = true;
        drawCount += 2;
        log(`${nameOf(player)} 发动好施，额外摸两张牌。`);
      }
    }
    if (hasSkill(player, "luoyi")) {
      const use = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askYesNo(`${nameOf(player)} 是否发动裸衣？本回合杀/决斗伤害 +1，少摸一张。`, false, player)
        : aiShouldUseLuoyi(player);
      if (use) {
        player.turn.luoyi = true;
        drawCount -= 1;
        log(`${nameOf(player)} 发动裸衣。`);
      }
    }
    if (hasSkill(player, "shuangxiong")) {
      const use = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askYesNo(`${nameOf(player)} 是否发动双雄？放弃摸牌并获得判定牌。`, true, player)
        : aiEnemies(player).length > 0;
      if (use) {
        const judge = await revealJudgeCard(player, "双雄");
        player.hand.push(judge);
        player.turn.shuangxiongColor = isRedFor(player, judge) ? "black" : "red";
        drawCount = 0;
        log(`${nameOf(player)} 发动双雄，获得 ${cardNameFor(player, judge)}，本回合${player.turn.shuangxiongColor === "red" ? "红色" : "黑色"}手牌可当决斗。`);
      }
    }
    if (hasSkill(player, "yongsi")) {
      const bonus = livingKingdomCount();
      drawCount += bonus;
      log(`${nameOf(player)} 的庸肆生效，额外摸 ${bonus} 张牌。`);
    }
    drawCards(player, Math.max(0, drawCount), false);
    log(`${nameOf(player)} 摸 ${Math.max(0, drawCount)} 张牌。`);
    if (player.turn.haoshi && player.hand.length > 5) {
      await performHaoshi(player);
    }
    await eventPause(460);
  }

  function aiShouldUseLuoyi(player) {
    if (!player?.alive || !hasSkill(player, "luoyi")) return false;
    const enemies = aiEnemies(player).filter((target) => target.alive && attitude(player, target) < -0.15);
    if (!enemies.length) return false;
    const slashCards = player.hand.filter((card) => card.subtype === "slash");
    const duelCards = player.hand.filter((card) => card.subtype === "duel");
    const slashTargets = slashCards.length && canUseSlash(player)
      ? enemies.filter((target) => canSlashTarget(player, target))
      : [];
    const duelTargets = duelCards.length
      ? enemies.filter((target) => duelCards.some((card) => !isProtectedFromTrick(target, { effect: "duel", card })))
      : [];
    const targets = [...new Set([...slashTargets, ...duelTargets])];
    if (!targets.length) return false;
    return targets.some((target) => {
      const isVulnerable = target.hp <= 2 || target.hand.length === 0;
      const responseKind = slashTargets.includes(target) ? "dodge" : "slash";
      const lowDefense = estimatedResponseCount(target, responseKind, player) <= 0.45;
      const highThreat = threatScore(player, target) >= 2.3;
      return isVulnerable || lowDefense || highThreat;
    });
  }

  async function playPhase(player) {
    if (player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
      await humanPlayPhase(player);
    } else {
      await aiPlayPhase(player);
    }
  }

  async function discardPhase(player) {
    if (hasSkill(player, "yongsi")) {
      await performYongsiDiscard(player);
      if (!player.alive || state.gameOver) return;
    }
    if (!needsDiscard(player)) {
      if (hasSkill(player, "keji") && !player.turn.usedSlashThisTurn) {
        log(`${nameOf(player)} 发动克己，不需要弃牌。`);
      }
      return;
    }

    if (hasSkill(player, "keji") && !player.turn.usedSlashThisTurn) {
      log(`${nameOf(player)} 发动克己，跳过弃牌阶段。`);
      return;
    }

    const limit = handLimit(player);
    const count = player.hand.length - limit;
    let discarded = [];
    if (player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
      const cards = await askHumanSelectCards(player, `${nameOf(player)} 需要弃 ${count} 张牌。`, count, count, () => true, false);
      discarded = await discardFromHand(player, cards, "弃牌阶段");
    } else {
      const ids = chooseDiscardCards(player, count).map((c) => c.id);
      discarded = await discardFromHand(player, ids, "弃牌阶段");
    }
    await triggerGuzheng(player, discarded);
    await eventPause(420);
  }

  function livingKingdomCount() {
    return new Set(alivePlayers().map((player) => player.general.kingdom).filter(Boolean)).size || 1;
  }

  async function performYongsiDiscard(player) {
    const count = Math.min(player.hand.length, livingKingdomCount());
    if (count <= 0) {
      log(`${nameOf(player)} 的庸肆生效，但没有手牌可弃。`);
      return [];
    }
    const ids = humanControls(player)
      ? await askHumanSelectCards(player, `庸肆：弃置 ${count} 张手牌。`, count, count, () => true, false)
      : chooseDiscardCards(player, count).map((card) => card.id);
    const discarded = await discardFromHand(player, ids, "庸肆");
    log(`${nameOf(player)} 的庸肆弃置 ${discarded.length} 张牌。`);
    return discarded;
  }

  async function endPhase(player) {
    const usedSkills = player.turn?.usedSkills || {};
    if (usedSkills.fangquan && player.hand.length > 0) {
      const target = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askHumanTarget("选择一名角色获得额外回合。", alivePlayers().filter((p) => p.id !== player.id))
        : bestExtraTurnTarget(player);
      if (target) {
        const id = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
          ? (await askHumanSelectCards(player, "弃一张手牌完成放权。", 1, 1, () => true, false))[0]
          : chooseDiscardCards(player, 1)[0]?.id;
        if (id) {
          await discardFromHand(player, [id], "放权");
          scheduleExtraTurn(player, target);
          log(`${nameOf(player)} 放权给 ${nameOf(target)}，其将获得一个额外回合。`);
        }
      }
    }
    if (hasSkill(player, "biyue")) {
      drawCards(player, 1, false);
      log(`${nameOf(player)} 发动闭月，摸一张牌。`);
    }
    if (hasSkill(player, "jushou") && !player.flags.skipTurnOnce) {
      const use = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askYesNo(`${nameOf(player)} 是否发动据守？摸三张并翻面，下个回合跳过。`, false, player)
        : player.hp <= 2 || player.hand.length < 2;
      if (use) {
        drawCards(player, 3, false);
        player.flags.skipTurnOnce = true;
        log(`${nameOf(player)} 发动据守，摸三张牌并翻面。`);
      }
    }
    if (hasSkill(player, "benghuai") && !hasLowestHp(player)) {
      const loseMax = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? (await askChoice("崩坏：失去 1 点体力上限，还是失去 1 点体力？", [
          { label: "失去体力", value: false },
          { label: "失去上限", value: true }
        ], player))
        : aiShouldLoseMaxForBenghuai(player);
      if (loseMax) {
        await loseMaxHp(player, 1);
        log(`${nameOf(player)} 发动崩坏，失去 1 点体力上限。`);
      } else {
        log(`${nameOf(player)} 发动崩坏，失去 1 点体力。`);
        await loseHp(player, 1);
      }
    }
    render();
  }

  function aiShouldLoseMaxForBenghuai(player) {
    if (!player) return false;
    if (player.hp <= 2) return true;
    if (player.hp >= 4) return false;
    const handPressureAfterHpLoss = player.hand.length > Math.max(0, player.hp - 1);
    const maxHpBuffer = player.maxHp - player.hp;
    if (handPressureAfterHpLoss && maxHpBuffer >= 2) return true;
    return player.hp <= 3 && player.maxHp >= 6 && player.personality.caution > 1.05;
  }

  function canQiaobianPhase(player, phase) {
    return player.alive && hasSkill(player, "qiaobian") && player.hand.length > 0 && !turnUsedSkills(player)[`qiaobian-${phase}`];
  }

  async function payQiaobianCost(player, phaseLabel) {
    const id = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? (await askHumanSelectCards(player, `弃一张手牌发动巧变，跳过${phaseLabel}阶段。`, 1, 1, () => true, true))[0]
      : chooseDiscardCards(player, 1)[0]?.id;
    if (!id) return false;
    await discardFromHand(player, [id], "巧变");
    return true;
  }

  async function maybeQiaobianJudge(player) {
    if (!canQiaobianPhase(player, "judge") || !player.judgeArea.length) return false;
    const moves = qiaobianJudgeMoves(player);
    const shouldUse = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`${nameOf(player)} 是否发动巧变，跳过判定阶段？`, true, player)
      : player.judgeArea.some((card) => isHarmfulJudgeCard(card)) && (moves.length || player.judgeArea.some((card) => card.subtype !== "lightning"));
    if (!shouldUse) return false;
    const move = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn && moves.length
      ? await chooseQiaobianJudgeMove(player, moves)
      : moves[0];
    if (!(await payQiaobianCost(player, "判定"))) return false;
    player.turn.usedSkills["qiaobian-judge"] = true;
    log(`${nameOf(player)} 发动巧变，跳过判定阶段。`);
    if (move) await moveJudgeCard(player, move.index, move.to, "巧变");
    return true;
  }

  async function maybeQiaobianDraw(player) {
    if (!canQiaobianPhase(player, "draw")) return false;
    const targets = alivePlayers().filter((p) => p.id !== player.id && p.hand.length > 0);
    if (!targets.length) return false;
    const preferred = chooseQiaobianDrawTargets(player);
    const shouldUse = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`${nameOf(player)} 是否发动巧变，跳过摸牌阶段并获得至多两名角色各一张手牌？`, false, player)
      : preferred.length >= 2 && preferred.reduce((sum, target) => sum - attitude(player, target), 0) > 1.1;
    if (!shouldUse) return false;
    const chosen = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await pickTargets("巧变：选择至多两名有手牌的角色。", targets, 1, Math.min(2, targets.length))
      : preferred;
    if (!chosen.length) return false;
    if (!(await payQiaobianCost(player, "摸牌"))) return false;
    player.turn.usedSkills["qiaobian-draw"] = true;
    for (const target of chosen.slice(0, 2)) {
      await stealRandomHandCard(player, target, "巧变");
    }
    log(`${nameOf(player)} 发动巧变，跳过摸牌阶段。`);
    render();
    await eventPause(360);
    return true;
  }

  async function maybeQiaobianPlay(player) {
    if (!canQiaobianPhase(player, "play")) return false;
    const moves = qiaobianFieldMoves(player);
    if (!moves.length) return false;
    const best = chooseQiaobianFieldMove(player, moves);
    const shouldUse = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`${nameOf(player)} 是否发动巧变，跳过出牌阶段并移动场上的一张牌？`, false, player)
      : best && best.score > 1.35 && (player.hp <= 2 || player.hand.length <= 3 || player.personality.trickiness > 1.05);
    if (!shouldUse) return false;
    const move = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askQiaobianFieldMove(player, moves)
      : best;
    if (!move || !(await payQiaobianCost(player, "出牌"))) return false;
    player.turn.usedSkills["qiaobian-play"] = true;
    await moveFieldCard(move.from, move.item, move.to, "巧变");
    log(`${nameOf(player)} 发动巧变，跳过出牌阶段。`);
    render();
    await eventPause(360);
    return true;
  }

  async function maybeQiaobianDiscard(player) {
    if (!canQiaobianPhase(player, "discard") || !needsDiscard(player)) return false;
    const discardCount = player.hand.length - handLimit(player);
    const shouldUse = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`${nameOf(player)} 是否发动巧变，弃一张手牌跳过弃牌阶段？`, discardCount > 1, player)
      : discardCount >= 2 || player.hand.some((card) => cardKeepValue(player, card) >= 4);
    if (!shouldUse || !(await payQiaobianCost(player, "弃牌"))) return false;
    player.turn.usedSkills["qiaobian-discard"] = true;
    log(`${nameOf(player)} 发动巧变，跳过弃牌阶段。`);
    render();
    await eventPause(320);
    return true;
  }

  async function humanPlayPhase(player) {
    let keepPlaying = true;
    while (keepPlaying && player.alive && !state.gameOver) {
      const actions = buildPlayableActions(player);
      const result = await waitForHumanPlay(player, actions);
      if (result.type === "end") keepPlaying = false;
      if (result.type === "auto") {
        await aiPlayPhase(player);
        keepPlaying = false;
      }
      if (result.type === "move") {
        await executeMove(player, result.move);
        if (player.turn.forceEndPlay) keepPlaying = false;
      }
    }
    state.playContext = null;
    state.playCardId = null;
    state.targetPick = null;
    render();
  }

  function waitForHumanPlay(player, actions) {
    return new Promise((resolve) => {
      markStatus("玩家出牌", player, `${actions.length} 个可用操作`);
      setWait("出牌操作", "点手牌直接使用，或从操作条选择；也可以结束出牌。", player.id, `${actions.length} 个可用操作`);
      state.playContext = { playerId: player.id, actions, resolver: resolve };
      state.playCardId = null;
      state.pending = null;
      state.targetPick = null;
      state.cardPick = null;
      render();
    });
  }

  async function aiPlayPhase(player) {
    let safety = 0;
    while (player.alive && !state.gameOver && safety < 18) {
      safety += 1;
      const moves = buildAIMoves(player);
      if (!moves.length) break;
      const move = chooseAIMove(player, moves);
      if (!move || move.score < aiMoveAcceptanceThreshold(player, move) + Math.random() * aiMoveAcceptanceJitter(player, move)) break;
      recordAIDecision(player, move, moves);
      await executeMove(player, move);
      render();
      await eventPause(520);
      if (player.turn.forceEndPlay) break;
    }
  }

  function buildPlayableActions(player) {
    const actions = [];
    player.hand.forEach((card) => {
      addCardAction(actions, player, card, card.id, null);
    });
    addVirtualActions(actions, player);
    addSkillActions(actions, player);
    return actions.filter((action) => legalTargets(player, action).length || !action.needsTarget);
  }

  function addCardAction(actions, player, card, consumeId, virtualSkill) {
    if (card.subtype === "slash") {
      if (!canUseSlash(player)) return;
      actions.push({
        type: "card",
        card,
        consumeId,
        virtualSkill,
        label: labelForCard(card, virtualSkill),
        needsTarget: true,
        targetMode: slashTargetMode(player, consumeId ? [consumeId] : []),
        effect: "slash"
      });
    } else if (card.subtype === "peach") {
      if (player.hp < player.maxHp) actions.push({ type: "card", card, consumeId, virtualSkill, label: labelForCard(card, virtualSkill), needsTarget: false, effect: "peach" });
    } else if (card.subtype === "wine") {
      if (!player.drunk && !player.turn.usedWine) actions.push({ type: "card", card, consumeId, virtualSkill, label: labelForCard(card, virtualSkill), needsTarget: false, effect: "wine" });
    } else if (card.type === "equip") {
      actions.push({ type: "card", card, consumeId, virtualSkill, label: `装备 ${cardDisplayName(card)}`, needsTarget: false, effect: "equip" });
    } else if (card.subtype === "draw2" || card.subtype === "taoyuan" || card.subtype === "harvest" || card.subtype === "barbarians" || card.subtype === "arrows") {
      actions.push({ type: "card", card, consumeId, virtualSkill, label: labelForCard(card, virtualSkill), needsTarget: false, effect: card.subtype });
    } else if (card.subtype === "duel") {
      actions.push({ type: "card", card, consumeId, virtualSkill, label: labelForCard(card, virtualSkill), needsTarget: true, targetMode: "any", effect: card.subtype });
    } else if (card.subtype === "fireAttack") {
      actions.push({ type: "card", card, consumeId, virtualSkill, label: labelForCard(card, virtualSkill), needsTarget: true, targetMode: "hasHand", effect: card.subtype });
    } else if (card.subtype === "borrowSword") {
      actions.push({ type: "card", card, consumeId, virtualSkill, label: labelForCard(card, virtualSkill), needsTarget: true, targetMode: "borrowSword", effect: "borrowSword" });
    } else if (card.subtype === "chain") {
      actions.push({ type: "card", card, consumeId, virtualSkill, label: labelForCard(card, virtualSkill), needsTarget: true, targetMode: "chainTargets", effect: "chain" });
      if (virtualSkill !== "guhuo") actions.push({ type: "card", card, consumeId, virtualSkill, label: `重铸${cardDisplayName(card)}`, needsTarget: false, effect: "recastChain" });
    } else if (card.subtype === "steal" || card.subtype === "dismantle") {
      actions.push({ type: "card", card, consumeId, virtualSkill, label: labelForCard(card, virtualSkill), needsTarget: true, targetMode: "hasCards", effect: card.subtype });
    } else if (card.subtype === "lebu" || card.subtype === "bingliang") {
      actions.push({ type: "card", card, consumeId, virtualSkill, label: labelForCard(card, virtualSkill), needsTarget: true, targetMode: "delayed", effect: card.subtype });
    } else if (card.subtype === "lightning") {
      actions.push({ type: "card", card, consumeId, virtualSkill, label: labelForCard(card, virtualSkill), needsTarget: false, effect: "lightning" });
    }
  }

  function guhuoDeclarationSpecs() {
    return GUHUO_DECLARE_NAMES
      .map((name) => CARD_POOL.find((spec) => spec.name === name))
      .filter(Boolean);
  }

  function guhuoVirtualCard(baseCard, spec) {
    return virtualCard(baseCard, spec.name, spec.type, spec.subtype, spec.nature || DAMAGE.NORMAL);
  }

  function addVirtualActions(actions, player) {
    player.hand.forEach((card) => {
      if (hasSkill(player, "wusheng") && isRed(card) && card.subtype !== "slash") {
        addCardAction(actions, player, virtualCard(card, "杀", "basic", "slash", DAMAGE.NORMAL), card.id, "wusheng");
      }
      if (hasSkill(player, "jiuchi") && card.suit === "♠" && card.subtype !== "wine" && !player.drunk && !player.turn.usedWine) {
        addCardAction(actions, player, virtualCard(card, "酒", "basic", "wine"), card.id, "jiuchi");
      }
      if (hasSkill(player, "longdan") && card.subtype === "dodge") {
        addCardAction(actions, player, virtualCard(card, "杀", "basic", "slash", DAMAGE.NORMAL), card.id, "longdan");
      }
      if (hasSkill(player, "shuangxiong") && player.turn.shuangxiongColor && colorOfFor(player, card) === player.turn.shuangxiongColor) {
        addCardAction(actions, player, virtualCard(card, "决斗", "trick", "duel"), card.id, "shuangxiong");
      }
      if (hasSkill(player, "qixi") && isBlack(card)) {
        addCardAction(actions, player, virtualCard(card, "过河拆桥", "trick", "dismantle"), card.id, "qixi");
      }
      if (hasSkill(player, "duanliang") && isBlackFor(player, card) && (card.type === "basic" || card.type === "equip")) {
        addCardAction(actions, player, virtualCard(card, "兵粮寸断", "trick", "bingliang"), card.id, "duanliang");
      }
      if (hasSkill(player, "guhuo")) {
        guhuoDeclarationSpecs().forEach((spec) => addCardAction(actions, player, guhuoVirtualCard(card, spec), card.id, "guhuo"));
      }
      if (hasSkill(player, "guose") && card.suit === "♦") {
        addCardAction(actions, player, virtualCard(card, "乐不思蜀", "trick", "lebu"), card.id, "guose");
      }
      if (hasSkill(player, "huoji") && isRed(card)) {
        addCardAction(actions, player, virtualCard(card, "火攻", "trick", "fireAttack"), card.id, "huoji");
      }
      if (hasSkill(player, "lianhuan") && card.suit === "♣") {
        addCardAction(actions, player, virtualCard(card, "铁索连环", "trick", "chain"), card.id, "lianhuan");
      }
    });
    if (player.equip.weapon?.name === "丈八蛇矛" && player.hand.length >= 2 && canUseSlash(player)) {
      allPairs(player.hand).slice(0, 10).forEach((pair) => {
        const card = virtualCard({ id: `${pair[0].id}-${pair[1].id}`, suit: pair[0].suit, rank: pair[0].rank }, "杀", "basic", "slash", DAMAGE.NORMAL);
        actions.push({
          type: "card",
          card,
          consumeIds: pair.map((c) => c.id),
          virtualSkill: "丈八",
          label: `丈八：${pair.map((c) => c.name).join("+")}当杀`,
          needsTarget: true,
          targetMode: slashTargetMode(player, pair.map((c) => c.id)),
          effect: "slash"
        });
      });
    }
    if (canUseJijiang(player) && canUseSlash(player) && hasJijiangSlashProvider(player, { activeUse: true })) {
      actions.push({
        type: "card",
        card: virtualCard({ id: `jijiang-${player.id}`, suit: "", rank: "" }, "杀", "basic", "slash", DAMAGE.NORMAL),
        virtualSkill: "jijiang",
        label: "激将：杀",
        needsTarget: true,
        targetMode: slashTargetMode(player),
        effect: "slash",
        scoreHint: 0.95
      });
    }
  }

  function slashTargetMode(player, consumeIds = []) {
    const ids = Array.isArray(consumeIds) ? consumeIds : [];
    const consumesWholeHand = ids.length > 0 && player.hand.length === ids.length && ids.every((id) => player.hand.some((card) => card.id === id));
    if (player.equip.weapon?.name === "方天画戟" && consumesWholeHand) return "fangtian";
    if (player.turn?.tianyi) return "tianyiSlash";
    return "enemy";
  }

  function qiceTrickSpecs() {
    return [
      { effect: "draw2", name: "无中生有", needsTarget: false, scoreHint: 1.1 },
      { effect: "steal", name: "顺手牵羊", needsTarget: true, targetMode: "hasCards", scoreHint: 1.0 },
      { effect: "dismantle", name: "过河拆桥", needsTarget: true, targetMode: "hasCards", scoreHint: 0.95 },
      { effect: "duel", name: "决斗", needsTarget: true, targetMode: "any", scoreHint: 1.0 },
      { effect: "borrowSword", name: "借刀杀人", needsTarget: true, targetMode: "borrowSword", scoreHint: 1.0 },
      { effect: "barbarians", name: "南蛮入侵", needsTarget: false, scoreHint: 0.82 },
      { effect: "arrows", name: "万箭齐发", needsTarget: false, scoreHint: 0.82 },
      { effect: "taoyuan", name: "桃园结义", needsTarget: false, scoreHint: 0.7 },
      { effect: "harvest", name: "五谷丰登", needsTarget: false, scoreHint: 0.7 },
      { effect: "fireAttack", name: "火攻", needsTarget: true, targetMode: "hasHand", scoreHint: 0.95 },
      { effect: "chain", name: "铁索连环", needsTarget: true, targetMode: "chainTargets", scoreHint: 0.82 }
    ];
  }

  function addSkillActions(actions, player) {
    if (hasSkill(player, "kurou") && player.hp > 0) {
      actions.push({ type: "skill", skill: "kurou", label: "苦肉", needsTarget: false, scoreHint: 1.1 });
    }
    if (hasSkill(player, "zhiheng") && !player.turn.usedSkills.zhiheng && zhihengCandidates(player).length > 0) {
      actions.push({ type: "skill", skill: "zhiheng", label: "制衡", needsTarget: false, scoreHint: 1 });
    }
    if (hasSkill(player, "qingnang") && !player.turn.usedSkills.qingnang && player.hand.length > 0) {
      actions.push({ type: "skill", skill: "qingnang", label: "青囊", needsTarget: true, targetMode: "damagedAny", scoreHint: 1.2 });
    }
    if (hasSkill(player, "rende") && player.hand.length > 0) {
      actions.push({ type: "skill", skill: "rende", label: "仁德", needsTarget: true, targetMode: "any", scoreHint: 1 });
    }
    if (hasSkill(player, "jieyin") && !player.turn.usedSkills.jieyin && player.hand.length >= 2) {
      actions.push({ type: "skill", skill: "jieyin", label: "结姻", needsTarget: true, targetMode: "woundedMale", scoreHint: 1.1 });
    }
    if (hasSkill(player, "lijian") && !player.turn.usedSkills.lijian && lijianCostChoices(player).length > 0) {
      actions.push({ type: "skill", skill: "lijian", label: "离间", needsTarget: true, targetMode: "twoMaleAny", scoreHint: 1.2 });
    }
    if (hasSkill(player, "luanji") && countSameSuit(player.hand) >= 2) {
      actions.push({ type: "skill", skill: "luanji", label: "乱击", needsTarget: false, scoreHint: 1 });
    }
    if (hasSkill(player, "qice") && !player.turn.usedSkills.qice && player.hand.length > 0) {
      qiceTrickSpecs().forEach((spec) => {
        actions.push({
          type: "skill",
          skill: "qice",
          qiceEffect: spec.effect,
          qiceName: spec.name,
          card: virtualCard({ id: `qice-${spec.effect}`, suit: "♣", rank: "" }, spec.name, "trick", spec.effect),
          label: `奇策：${spec.name}`,
          needsTarget: spec.needsTarget,
          targetMode: spec.targetMode,
          effect: spec.effect,
          scoreHint: spec.scoreHint
        });
      });
    }
    if (hasSkill(player, "qiangxi") && !player.turn.usedSkills.qiangxi && canPayQiangxiCost(player)) {
      actions.push({ type: "skill", skill: "qiangxi", label: "强袭", needsTarget: true, targetMode: "inRangeEnemy", scoreHint: 1.3 });
    }
    if (hasSkill(player, "fanjian") && !player.turn.usedSkills.fanjian && player.hand.length > 0) {
      actions.push({ type: "skill", skill: "fanjian", label: "反间", needsTarget: true, targetMode: "any", scoreHint: 1.2 });
    }
    if (hasSkill(player, "quhu") && !player.turn.usedSkills.quhu && player.hand.length > 0) {
      actions.push({ type: "skill", skill: "quhu", label: "驱虎", needsTarget: true, targetMode: "higherHpAny", scoreHint: 1.15 });
    }
    if (hasSkill(player, "tianyi") && !player.turn.usedSkills.tianyi && player.hand.length > 0) {
      actions.push({ type: "skill", skill: "tianyi", label: "天义", needsTarget: true, targetMode: "pindianEnemy", scoreHint: 1.05 });
    }
    if (hasSkill(player, "tiaoxin") && !player.turn.usedSkills.tiaoxin) {
      actions.push({ type: "skill", skill: "tiaoxin", label: "挑衅", needsTarget: true, targetMode: "canAttackMe", scoreHint: 1.05 });
    }
    if (hasSkill(player, "zhijian") && !player.turn.usedSkills.zhijian && player.hand.some((card) => card.type === "equip")) {
      actions.push({ type: "skill", skill: "zhijian", label: "直谏", needsTarget: true, targetMode: "any", scoreHint: 0.95 });
    }
    if (hasSkill(player, "xuanhuo") && !player.turn.usedSkills.xuanhuo && player.hand.some((card) => card.suit === "♥") && xuanhuoPairs(player).length > 0) {
      actions.push({ type: "skill", skill: "xuanhuo", label: "眩惑", needsTarget: true, targetMode: "xuanhuoPair", scoreHint: 1.05 });
    }
    if (hasSkill(player, "jujian") && !player.turn.usedSkills.jujian && player.hand.length > 0) {
      actions.push({ type: "skill", skill: "jujian", label: "举荐", needsTarget: true, targetMode: "ally", scoreHint: 0.95 });
    }
    if (hasSkill(player, "ganlu") && !player.turn.usedSkills.ganlu && ganluPairs(player).length > 0) {
      actions.push({ type: "skill", skill: "ganlu", label: "甘露", needsTarget: true, targetMode: "ganluPair", scoreHint: 0.9 });
    }
    if (hasSkill(player, "anxu") && !player.turn.usedSkills.anxu && anxuPairs(player).length > 0) {
      actions.push({ type: "skill", skill: "anxu", label: "安恤", needsTarget: true, targetMode: "anxuPair", scoreHint: 1.0 });
    }
    if (hasSkill(player, "luanwu") && !player.flags.luanwuUsed) {
      actions.push({ type: "skill", skill: "luanwu", label: "乱武", needsTarget: false, scoreHint: 1.15 });
    }
    if (hasSkill(player, "jixi") && player.fields.length > 0) {
      actions.push({ type: "skill", skill: "jixi", label: "急袭", needsTarget: true, targetMode: "hasCards", scoreHint: 1.05 });
    }
    if (hasSkill(player, "fangquan") && !player.turn.usedSkills.fangquan && player.hand.length > 0) {
      actions.push({ type: "skill", skill: "fangquan", label: "放权", needsTarget: false, scoreHint: 1.0 });
    }
    if (hasSkill(player, "dimeng") && !player.turn.usedSkills.dimeng && dimengPairs(player).length > 0) {
      actions.push({ type: "skill", skill: "dimeng", label: "缔盟", needsTarget: true, targetMode: "dimengPair", scoreHint: 1.0 });
    }
    const huangtianLord = huangtianLordFor(player);
    if (huangtianLord && !player.turn.usedSkills.huangtian && huangtianCards(player).length) {
      actions.push({ type: "skill", skill: "huangtian", label: "黄天", needsTarget: false, scoreHint: 0.85 });
    }
    const zhibaLord = zhibaLordFor(player);
    if (zhibaLord && zhibaLord.id !== player.id && player.general.kingdom === "吴" && !player.turn.usedSkills.zhiba && player.hand.length > 0 && zhibaLord.hand.length > 0) {
      actions.push({ type: "skill", skill: "zhiba", label: "制霸", needsTarget: false, scoreHint: 0.75 });
    }
  }

  function buildAIMoves(player) {
    const actions = buildPlayableActions(player);
    const moves = [];
    actions.forEach((action) => {
      const targets = legalTargets(player, action);
      if (!action.needsTarget) {
        const move = { ...action, targets: [] };
        move.score = scoreMove(player, move);
        moves.push(move);
      } else if (action.targetMode === "twoMaleAny") {
        directedPairs(targets).forEach((pair) => {
          const move = { ...action, targets: pair };
          move.score = scoreMove(player, move);
          moves.push(move);
        });
      } else if (action.targetMode === "twoMaleEnemies" || action.targetMode === "twoAny") {
        const pairs = allPairs(targets).slice(0, 8);
        pairs.forEach((pair) => {
          const move = { ...action, targets: pair };
          move.score = scoreMove(player, move);
          moves.push(move);
        });
      } else if (action.targetMode === "dimengPair") {
        dimengPairs(player).forEach((pair) => {
          const move = { ...action, targets: pair };
          move.score = scoreMove(player, move);
          moves.push(move);
        });
      } else if (action.targetMode === "xuanhuoPair") {
        xuanhuoPairs(player).forEach((pair) => {
          const move = { ...action, targets: pair };
          move.score = scoreMove(player, move);
          moves.push(move);
        });
      } else if (action.targetMode === "ganluPair") {
        ganluPairs(player).forEach((pair) => {
          const move = { ...action, targets: pair };
          move.score = scoreMove(player, move);
          moves.push(move);
        });
      } else if (action.targetMode === "anxuPair") {
        anxuPairs(player).forEach((pair) => {
          const move = { ...action, targets: pair };
          move.score = scoreMove(player, move);
          moves.push(move);
        });
      } else if (action.targetMode === "fangtian" || action.targetMode === "tianyiSlash") {
        slashTargetMoveOptions(player, action, targets).forEach((move) => moves.push(move));
      } else if (action.targetMode === "chainTargets") {
        targets.slice(0, 6).forEach((target) => {
          const move = { ...action, targets: [target] };
          move.score = scoreMove(player, move);
          moves.push(move);
        });
        allPairs(targets).slice(0, 10).forEach((pair) => {
          const move = { ...action, targets: pair };
          move.score = scoreMove(player, move);
          moves.push(move);
        });
      } else if (action.targetMode === "borrowSword") {
        borrowSwordPairs(player, action).forEach((pair) => {
          const move = { ...action, targets: pair };
          move.score = scoreMove(player, move);
          moves.push(move);
        });
      } else {
        targets.forEach((target) => {
          const move = { ...action, targets: [target] };
          move.score = scoreMove(player, move);
          moves.push(move);
        });
      }
    });
    return moves.filter((m) => Number.isFinite(m.score)).sort((a, b) => b.score - a.score);
  }

  function slashTargetMoveOptions(player, action, targets) {
    const moves = [];
    const ordered = targets
      .slice()
      .sort((a, b) => attitude(player, a) - attitude(player, b) || threatScore(player, b) - threatScore(player, a));
    ordered.slice(0, 5).forEach((target) => {
      const move = { ...action, targets: [target] };
      move.score = scoreMove(player, move);
      moves.push(move);
    });
    const maxTargets = slashTargetMax(action, player, ordered.length);
    for (let size = 2; size <= maxTargets; size += 1) {
      if (ordered.length >= size) {
        const move = { ...action, targets: ordered.slice(0, size) };
        move.score = scoreMove(player, move) + (size - 1) * 0.45;
        moves.push(move);
      }
    }
    return moves;
  }

  function slashTargetMax(action, player, legalCount = 1) {
    const baseMax = action?.targetMode === "fangtian" ? 3 : action?.targetMode === "tianyiSlash" ? 2 : 1;
    const tianyiExtra = action?.targetMode === "fangtian" && player?.turn?.tianyi ? 1 : 0;
    return Math.max(1, Math.min(legalCount, baseMax + tianyiExtra));
  }

  function chooseAIMove(player, moves) {
    const top = moves.slice(0, 7);
    const accepted = top.filter((move) => move.score >= aiMoveAcceptanceThreshold(player, move) - 0.04);
    const pool = accepted.length ? accepted : top;
    const committedSupport = top.find((move) => {
      if (!isCooperativeSupportMove(player, move)) return false;
      const target = aiMovePrimaryTarget(player, move);
      if (!target) return false;
      return supportTeamworkScore(player, target, supportKindForMove(move)) >= 0.88;
    });
    if (committedSupport && top[0] && top[0].score - committedSupport.score <= 0.34) return committedSupport;
    const temperature = state.aiMode === "oracle" ? 0.42 : 0.55 + player.personality.trickiness * 0.22 + player.personality.chaos * 0.14;
    const weights = pool.map((move) => Math.exp(move.score / temperature));
    const total = weights.reduce((sum, n) => sum + n, 0);
    let pick = Math.random() * total;
    for (let i = 0; i < pool.length; i += 1) {
      pick -= weights[i];
      if (pick <= 0) return pool[i];
    }
    return pool[0];
  }

  function recordAIDecision(player, move, moves = []) {
    if (!player || !move || (player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn)) return;
    const entry = {
      id: state.lastEventId++,
      actorId: player.id,
      actor: nameOf(player),
      title: aiMoveTitle(move),
      target: aiMoveTargetLabel(player, move),
      score: Number.isFinite(move.score) ? move.score.toFixed(1) : "?",
      reason: aiDecisionReason(player, move, moves)
    };
    state.decisionTrail = [entry, ...(state.decisionTrail || [])].slice(0, 8);
  }

  function aiMoveTitle(move) {
    if (move.type === "skill") return SKILL_TEXT[move.skill] || move.skill || "技能";
    if (move.effect === "recastChain") return `重铸${move.card?.name || "铁索连环"}`;
    return `${skillPrefix(move.virtualSkill)}${move.card?.name || move.label || "行动"}`;
  }

  function aiMovePrimaryTarget(player, move) {
    if (move.skill === "anxu" && move.targets?.length >= 2) {
      const [a, b] = move.targets;
      return a.hand.length <= b.hand.length ? a : b;
    }
    if (move.skill === "xuanhuo" && move.targets?.length >= 2) return move.targets[1];
    if (move.targets?.[0]) return move.targets[0];
    if (move.skill === "fangquan") return bestExtraTurnTarget(player);
    if (move.skill === "huangtian") return huangtianLordFor(player);
    if (move.skill === "zhiba") return zhibaLordFor(player);
    return null;
  }

  function aiMoveTargetLabel(player, move) {
    if (move.targets?.length) return move.targets.map(nameOf).join("、");
    const target = aiMovePrimaryTarget(player, move);
    return target ? nameOf(target) : "无目标";
  }

  function aiDecisionReason(player, move, moves = []) {
    const parts = [];
    const rank = moves.indexOf(move) + 1;
    if (rank > 0) parts.push(`候选#${rank}`);
    parts.push(`评分 ${Number.isFinite(move.score) ? move.score.toFixed(1) : "?"}`);
    const intent = moveIntentKindForActor(player, move);
    if (intent === "offense") parts.push("进攻/压制");
    if (intent === "support") parts.push("支援/保护");
    const target = aiMovePrimaryTarget(player, move);
    if (target) {
      parts.push(aiTargetReadText(player, target));
      const evidence = aiTargetEvidenceText(player, target);
      if (evidence) parts.push(evidence);
      if (intent === "support") parts.push(`配合分 ${supportTeamworkScore(player, target, supportKindForMove(move)).toFixed(1)}`);
      if (intent === "offense") parts.push(`威胁分 ${threatScore(player, target).toFixed(1)}`);
      if (target.hp <= 2) parts.push("目标体力低");
      if (threatScore(player, target) >= 1.15) parts.push("威胁较高");
    } else if (move.effect === "draw2" || move.effect === "recastChain") {
      parts.push("补充手牌");
    } else if (move.effect === "equip") {
      parts.push("提升装备");
    }
    return parts.slice(0, 6).join(" · ");
  }

  function aiTargetReadText(observer, target) {
    if (!observer || !target) return "无目标读数";
    if (state.aiMode === "oracle" && !isRolePublicTo(observer, target)) return `挑战模式身份：${target.role}`;
    if (isRolePublicTo(observer, target)) return `公开身份：${target.role}`;
    const read = state.reads[observer.id]?.[target.id] || 0;
    return `公平读数：${readLabel(read).text}`;
  }

  function aiTargetEvidenceText(observer, target) {
    if (!observer || !target) return "";
    if (state.aiMode === "oracle" && !isRolePublicTo(observer, target)) return "证据：强敌挑战可见身份";
    if (isRolePublicTo(observer, target)) return "证据：身份已公开";
    const reasons = state.readReasons[observer.id]?.[target.id] || [];
    if (!reasons.length) return "证据：暂无公开行为，按中性估计";
    return `证据：公开行为 · ${stripReadReasonScore(reasons[0])}`;
  }

  function stripReadReasonScore(reason) {
    return String(reason || "").replace(/^偏[反忠]\s[+-]\d+\.\d+：/, "");
  }

  function aiPlayThreshold(player) {
    let threshold = 0.58;
    threshold += (player.personality.caution - 1) * 0.22;
    threshold -= (player.personality.aggression - 1) * 0.18;
    if (player.hp <= 2) threshold += 0.1 * player.personality.caution;
    if (player.role === "内奸" && alivePlayers().length > 3) threshold += 0.08 * player.personality.patience;
    return clamp(threshold, 0.32, 0.95);
  }

  function aiMoveAcceptanceThreshold(player, move) {
    let threshold = aiPlayThreshold(player);
    if (isCooperativeSupportMove(player, move)) {
      threshold -= 0.24;
      const target = aiMovePrimaryTarget(player, move);
      threshold -= Math.min(0.16, committedSupportBonus(player, target, supportKindForMove(move)) * 0.35);
      if (target?.hp <= 1 || target?.hand.length <= 1) threshold -= 0.08;
    }
    if (isReliableUtilityMove(move)) threshold -= 0.12;
    return clamp(threshold, 0.18, 0.95);
  }

  function aiMoveAcceptanceJitter(player, move) {
    if (isReliableUtilityMove(move)) return 0.06;
    return 0.38 * player.personality.patience;
  }

  function isReliableUtilityMove(move) {
    return ["equip", "draw2", "steal", "dismantle"].includes(move?.effect);
  }

  function threatScore(actor, target) {
    if (!target?.alive) return 0;
    let score = 0;
    score += Math.max(0, target.hand.length - 2) * 0.18;
    score += countEquip(target) * 0.24;
    score += target.hp <= 2 ? 0.55 : 0;
    score += isPublicLordTo(actor, target) ? 0.4 : 0;
    score += hasSkill(target, "wushuang") || hasSkill(target, "paoxiao") ? 0.45 : 0;
    score += hasSkill(target, "qice") || hasSkill(target, "luanji") || hasSkill(target, "wansha") ? 0.35 : 0;
    if (actor.role === "内奸") {
      const { rebels, loyal } = estimatedFactionBalance(actor);
      score += Math.abs(rebels - loyal) <= 1 ? 0 : 0.25;
    }
    return score;
  }

  function protectorHiddenTargetPenalty(actor, target) {
    if (!actor || !target || actor.id === target.id || state.aiMode === "oracle") return 0;
    if (actor.role !== "主公" && actor.role !== "忠臣") return 0;
    if (isPublicLordTo(actor, target)) return 1.4;
    if (isRolePublicTo(actor, target)) return target.role === "反贼" ? 0 : 1.1;
    const read = state.reads[actor.id]?.[target.id] || 0;
    if (read > 0.45) return 0;
    let penalty = actor.role === "主公" ? 0.44 : 0.34;
    if (alivePlayers().length > 4) penalty += 0.12;
    if (read < -0.45) penalty += 0.2;
    if (target.hp <= 1) penalty -= 0.12;
    return clamp(penalty * actor.personality.caution, 0.08, 0.9);
  }

  function supportTeamworkScore(actor, target, kind = "support") {
    if (!actor || !target || actor.id === target.id || !target.alive) return 0;
    const read = perceivedRebelRead(actor, target);
    let score = 0;
    if (isPublicLordTo(actor, target)) {
      if (actor.role === "主公" || actor.role === "忠臣") score += 1.45;
      else if (actor.role === "反贼") score -= 1.7;
      else score += alivePlayers().length > 2 ? 0.2 : -0.9;
    } else if (actor.role === "反贼") {
      if (read > 0.35) score += 0.48 + read * 0.54 + (read > 1.2 ? 0.24 : 0);
      if (read < -0.45) score -= 0.46 + (-read) * 0.48;
    } else if (actor.role === "主公" || actor.role === "忠臣") {
      if (read < -0.35) score += 0.46 + (-read) * 0.52 + (read < -1.2 ? 0.22 : 0);
      if (read > 0.45) score -= 0.5 + read * 0.5;
    } else {
      const { rebels, loyal } = estimatedFactionBalance(actor);
      if (rebels > loyal + 0.5 && read < -0.55) score += 0.22;
      if (loyal > rebels + 0.5 && read > 0.55) score += 0.18;
      if (Math.abs(read) > 1.4) score -= 0.18;
    }
    if (kind === "heal" && target.hp < target.maxHp) score += target.hp <= 1 ? 0.62 : 0.3;
    if (kind === "gift") score += target.hand.length <= 2 ? 0.32 : 0.12;
    if (kind === "equip") score += countEquip(target) === 0 ? 0.28 : 0.08;
    if (kind === "support") score += target.hp <= 2 ? 0.12 : 0;
    return clamp(score, -2.3, 2.35);
  }

  function supportRelationshipScore(actor, target, kind = "gift") {
    return attitude(actor, target) + supportTeamworkScore(actor, target, kind) * 0.65 + committedSupportBonus(actor, target, kind);
  }

  function committedSupportBonus(actor, target, kind = "support") {
    if (!actor || !target || actor.id === target.id || !target.alive) return 0;
    const teamwork = supportTeamworkScore(actor, target, kind);
    const read = perceivedRebelRead(actor, target);
    let bonus = teamwork > 0.72 ? clamp((teamwork - 0.72) * 0.2, 0, 0.34) : 0;
    if (actor.role === "反贼" && read > 0.75) bonus += clamp((read - 0.75) * 0.16, 0.06, 0.22);
    if ((actor.role === "主公" || actor.role === "忠臣") && read < -0.75) bonus += clamp((-read - 0.75) * 0.16, 0.06, 0.22);
    if (isPublicLordTo(actor, target) && (actor.role === "忠臣" || actor.role === "主公")) bonus += 0.16;
    if (kind === "heal" && target.hp <= 2) bonus += 0.1;
    if (kind === "gift" && target.hand.length <= 2) bonus += 0.08;
    return clamp(bonus, 0, 0.52);
  }

  function supportMoveScoreBonus(actor, target, kind = "support") {
    if (!target) return 0;
    const teamwork = supportTeamworkScore(actor, target, kind);
    return committedSupportBonus(actor, target, kind) + (teamwork >= 1.05 ? 0.12 : 0);
  }

  function targetCardControlOpportunity(actor, target, effect) {
    if (!actor || !target || !["steal", "dismantle"].includes(effect)) return 0;
    const options = targetCardOptions(target);
    if (!options.length) return 0;
    return options.reduce((best, option) => Math.max(best, targetCardControlOptionScore(actor, target, option, effect)), -1);
  }

  function targetCardControlOptionScore(actor, target, option, effect) {
    const att = attitude(actor, target);
    if (option.zone === "judge") {
      const harmful = isHarmfulJudgeCard(option.card);
      if (harmful) return att > 0 ? 4.1 + harmfulJudgeSupportUrgency(actor, target) * 1.18 + (target.hp <= 2 ? 0.35 : 0) : -1.25;
      return att < 0 ? 0.65 : -0.35;
    }
    if (option.zone === "equip") {
      const utility = equipmentUtilityFor(target, option.card, actor);
      if (att < -0.15) return 1.05 + utility * 0.36 + (option.card?.subtype === "weapon" ? 0.22 : 0);
      return effect === "steal" && utility <= 0.7 ? 0.1 : -0.75;
    }
    if (option.zone === "hand") {
      if (att < -0.15) return 0.52 + Math.min(0.42, target.hand.length * 0.08);
      return -0.55;
    }
    return 0;
  }

  function isSupportiveControlMove(actor, move, target) {
    if (!actor || !target || !["steal", "dismantle"].includes(move?.effect)) return false;
    if (attitude(actor, target) <= 0) return false;
    return target.judgeArea.some(isHarmfulJudgeCard);
  }

  function harmfulJudgeCards(player) {
    return player?.judgeArea?.filter(isHarmfulJudgeCard) || [];
  }

  function turnsUntilPlayerFrom(actor, target) {
    if (!actor || !target || actor.id === target.id || !target.alive) return 99;
    const order = aliveFrom(actor.id).filter((player) => player.id !== actor.id);
    const index = order.findIndex((player) => player.id === target.id);
    return index < 0 ? 99 : index + 1;
  }

  function harmfulJudgeSupportUrgency(actor, target) {
    const harmfulCount = harmfulJudgeCards(target).length;
    if (!actor || !target || !harmfulCount || attitude(actor, target) <= 0) return 0;
    const teamwork = Math.max(0, supportTeamworkScore(actor, target, "support"));
    if (teamwork < 0.18 && !isPublicLordTo(actor, target)) return 0;
    const steps = turnsUntilPlayerFrom(actor, target);
    const turnPressure = steps <= 1 ? 0.92 : steps <= 2 ? 0.68 : steps <= 4 ? 0.42 : 0.22;
    const healthPressure = target.hp <= 2 ? 0.18 : 0;
    const publicLordPressure = isPublicLordTo(actor, target) ? 0.28 : 0;
    const stackPressure = Math.min(0.55, (harmfulCount - 1) * 0.28);
    return clamp(0.72 + turnPressure + healthPressure + publicLordPressure + stackPressure + teamwork * 0.18, 0, 2.4);
  }

  function scoreMove(player, move) {
    const consumed = moveConsumeIds(move).map((id) => findHandCard(player, id)).filter(Boolean);
    const cardValuePenalty = consumed.reduce((sum, card) => sum + cardKeepValue(player, card), 0) * 0.26;
    let score = (move.scoreHint || 0.5) - cardValuePenalty + rand(-0.22, 0.28) * player.personality.trickiness;
    const target = move.targets?.[0];

    if (move.effect === "slash" || move.effect === "duel" || move.effect === "fireAttack") {
      if (!target) return -1;
      if (move.effect === "fireAttack" && !target.hand.length) return -1;
      score += -attitude(player, target) * player.personality.aggression;
      score += threatScore(player, target) * 0.32;
      score += target.hp <= 2 ? 0.8 : 0;
      score += target.hand.length === 0 && move.effect !== "fireAttack" ? 0.5 : 0;
      score += hasSkill(target, "kongcheng") && target.hand.length === 0 ? -4 : 0;
      score -= protectorHiddenTargetPenalty(player, target);
      if (move.effect === "slash") score -= estimatedResponseCount(target, "dodge", player) * 0.22;
      if (move.effect === "duel" && estimatedResponseCount(player, "slash", player) < estimatedResponseCount(target, "slash", player)) score -= 1.2;
      if (move.effect === "fireAttack") {
        const excludeIds = new Set(move.qiceAllHand ? player.hand.map((c) => c.id) : moveConsumeIds(move));
        const revealEstimate = estimateFireAttackRevealForScoring(player, target, excludeIds);
        const discard = revealEstimate?.discard;
        if (!discard || revealEstimate.hitChance < 0.22) return -1;
        score += target.equip.armor?.name === "藤甲" ? 0.55 * revealEstimate.hitChance : 0;
        score += target.linked ? 0.22 * revealEstimate.hitChance : 0;
        score += (revealEstimate.hitChance - 0.5) * 0.7;
        score -= cardKeepValue(player, discard) * 0.32;
      }
      if (move.effect === "slash" && move.targets?.length > 1) {
        score += move.targets.slice(1).reduce((sum, extra) => {
          return sum + (-attitude(player, extra) * 0.55 + threatScore(player, extra) * 0.16 + (extra.hp <= 2 ? 0.35 : 0) - estimatedResponseCount(extra, "dodge", player) * 0.14);
        }, 0);
      }
    }
    if (move.effect === "steal" || move.effect === "dismantle" || move.effect === "lebu" || move.effect === "bingliang") {
      if (!target) return -1;
      const controlValue = targetCardControlOpportunity(player, target, move.effect);
      const supportiveControl = isSupportiveControlMove(player, move, target);
      const judgeReliefValue = supportiveControl ? harmfulJudgeSupportUrgency(player, target) : 0;
      score += supportiveControl ? supportRelationshipScore(player, target, "support") * 0.72 : -attitude(player, target) * 0.9;
      score += threatScore(player, target) * 0.18;
      score += controlValue * (move.effect === "steal" ? 0.48 : 0.42);
      score += target.hand.length + countEquip(target) > 2 ? 0.35 : 0;
      if (supportiveControl) score += 0.85 + judgeReliefValue + (move.effect === "dismantle" ? 0.2 : 0.1);
      if (!supportiveControl && attitude(player, target) < -0.2 && countEquip(target) > 0) score += 0.2;
      if (move.effect === "lebu" && isPublicLordTo(player, target)) score += 0.8;
      if (!supportiveControl) score -= protectorHiddenTargetPenalty(player, target);
    }
    if (move.effect === "barbarians" || move.effect === "arrows") {
      const expected = alivePlayers()
        .filter((p) => p.id !== player.id)
        .filter((p) => !isProtectedFromMassDamage(p, move.effect))
        .reduce((sum, p) => sum + (-attitude(player, p)) * (p.hp <= 2 ? 0.75 : 0.45), 0);
      score += expected;
    }
    if (move.effect === "taoyuan") {
      const net = alivePlayers().reduce((sum, p) => sum + attitude(player, p) * (p.hp < p.maxHp ? 0.9 : 0), 0);
      score += net;
    }
    if (move.effect === "chain") {
      const chainValue = (move.targets || []).reduce((sum, chainTarget) => {
        const desiredLinked = attitude(player, chainTarget) < 0;
        return sum + (desiredLinked === !chainTarget.linked ? 0.45 : -0.25) + (chainTarget.hp <= 2 && desiredLinked ? 0.18 : 0);
      }, 0);
      score += chainValue;
    }
    if (move.effect === "harvest") {
      const net = alivePlayers().reduce((sum, p) => sum + attitude(player, p) * (p.hand.length <= 2 ? 0.2 : 0.08), 0);
      score += net;
    }
    if (move.effect === "recastChain") score += player.hand.length <= 2 ? 0.95 : 0.28;
    if (move.effect === "borrowSword") {
      const wielder = move.targets?.[0];
      const victim = move.targets?.[1];
      if (!canBorrowSwordPair(player, wielder, victim, move)) return -1;
      score += scoreBorrowSwordMove(player, wielder, victim, move);
    }
    if (move.effect === "draw2") score += 1.35 + (player.hand.length <= 2 ? 0.18 : 0);
    if (move.effect === "wine") score += 0.8;
    if (move.effect === "equip") {
      const equipCard = move.card;
      if (!equipCard) return -1;
      const oldEquip = player.equip[equipCard.subtype];
      const newValue = equipmentUtilityFor(player, equipCard, player);
      const oldValue = equipmentUtilityFor(player, oldEquip, player);
      const upgrade = newValue - oldValue;
      if (oldEquip && upgrade <= 0.05) {
        score -= 1.05 + oldValue * 0.22;
      } else {
        score += 0.52 + newValue * 0.6 + Math.max(0, upgrade) * 0.88 + (oldEquip ? 0 : 0.24);
        if (player.hand.length > handLimit(player)) score += 0.18;
      }
    }
    if (move.effect === "peach") score += player.hp <= 2 ? 1.7 : 0.8;
    if (move.skill === "kurou") score += player.hp <= 1 ? -8 : (player.hp > 2 && player.hand.length < 3 ? 1.1 : -0.18);
    if (move.skill === "zhiheng") score += zhihengCandidates(player).filter((item) => zhihengDiscardValue(player, item) < 2).length * 0.42;
    if (move.skill === "qingnang") {
      if (!target) return -1;
      const att = attitude(player, target);
      const discardCost = chooseDiscardCards(player, 1).reduce((sum, card) => sum + cardKeepValue(player, card), 0) * 0.16;
      const teamwork = supportTeamworkScore(player, target, "heal");
      score += att + teamwork + supportMoveScoreBonus(player, target, "heal") + (target.hp <= 2 ? 0.8 : 0.25) - discardCost;
      if (att <= 0 && teamwork <= 0.2) score -= 1.6;
    }
    if (move.skill === "rende") {
      if (!target) return -1;
      const gifts = chooseRendeCards(player, target, player.hand.length);
      if (!gifts.length) return -1;
      const giftCost = gifts.reduce((sum, card) => sum + cardKeepValue(player, card), 0);
      score += attitude(player, target) + supportTeamworkScore(player, target, "gift") + supportMoveScoreBonus(player, target, "gift") + (player.hp < player.maxHp && player.turn.gaveByRende + gifts.length >= 2 ? 0.75 : 0) - giftCost * 0.18;
    }
    if (move.skill === "jieyin") {
      if (!target) return -1;
      const att = attitude(player, target);
      const discardCost = chooseDiscardCards(player, 2).reduce((sum, card) => sum + cardKeepValue(player, card), 0) * 0.18;
      const teamwork = supportTeamworkScore(player, target, "heal");
      score += att + teamwork + supportMoveScoreBonus(player, target, "heal") + (target.hp <= 2 ? 0.75 : 0.25) + (player.hp < player.maxHp ? 0.65 : 0) - discardCost;
      if (att <= 0 && teamwork <= 0.2) score -= 1.7;
    }
    if (move.skill === "lijian") {
      const costChoice = chooseAILijianCost(player);
      if (!costChoice) return -1;
      const discardCost = lijianDiscardValue(player, costChoice) * 0.16;
      score += scoreLijian(player, move.targets || []) - discardCost;
    }
    if (move.skill === "luanji") score += alivePlayers().filter((p) => p.id !== player.id).reduce((s, p) => s - attitude(player, p) * 0.35, 0);
    if (move.skill === "qice") {
      const fake = { effect: move.qiceEffect, targets: move.targets || [], card: move.card, scoreHint: move.scoreHint, qiceAllHand: true };
      const totalHandCost = player.hand.reduce((sum, card) => sum + cardKeepValue(player, card), 0);
      const costScale = player.hand.length <= 1 ? 0.08 : player.hand.length <= 2 ? 0.14 : 0.2;
      score += scoreMove(player, fake) * 0.78 - totalHandCost * costScale + (player.hand.length <= 2 ? 0.35 : -0.12);
    }
    if (move.skill === "qiangxi") {
      if (!target) return -1;
      const cost = chooseAIQiangxiCost(player);
      if (!cost) return -1;
      score += -attitude(player, target) + (target.hp <= 2 ? 0.9 : 0.25) - qiangxiCostPenalty(player, cost);
    }
    if (move.skill === "fanjian") {
      if (!target) return -1;
      const card = chooseFanjianCard(player, target);
      if (!card) return -1;
      const hitChance = target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? estimatedHumanFanjianHitChance(player, target, card)
        : estimatedFanjianHitChance(player, target, card);
      const damageValue = -attitude(player, target) + threatScore(player, target) * 0.2 + (target.hp <= 2 ? 0.75 : 0.22);
      score += damageValue * hitChance - cardKeepValue(player, card) * 0.16;
      if (attitude(player, target) >= 0) score -= 1.8;
    }
    if (move.skill === "quhu") {
      if (!target) return -1;
      const victim = chooseQuhuVictim(player, target);
      const winChance = estimatePindianWinChance(player, target, "驱虎");
      const victimValue = victim ? scoreQuhuVictim(player, victim) : -0.65;
      const failPain = 0.72 + (player.hp <= 2 ? 0.85 : 0.25);
      const targetAtt = attitude(player, target);
      const targetPressure = targetAtt < 0 ? -targetAtt * 0.42 : Math.min(0.28, targetAtt * 0.12);
      const allyRisk = targetAtt > 0 ? (1 - winChance) * targetAtt * 0.28 : 0;
      score += targetPressure + winChance * victimValue - (1 - winChance) * failPain - allyRisk;
    }
    if (move.skill === "tianyi") {
      if (!target) return -1;
      const winChance = estimatePindianWinChance(player, target, "天义");
      const slashStock = estimatedResponseCount(player, "slash", player);
      const futureTargets = alivePlayers().filter((p) => p.id !== player.id && attitude(player, p) < 0 && distance(player, p) <= attackRange(player)).length;
      const winValue = 0.32 + Math.min(1.15, slashStock * 0.34 + futureTargets * 0.18);
      const failPain = slashStock > 0 ? 0.95 : 0.32;
      score += -attitude(player, target) * 0.42 + winChance * winValue - (1 - winChance) * failPain;
    }
    if (move.skill === "shensu") score += target ? -attitude(player, target) + (target.hp <= 2 ? 0.6 : 0.1) - estimatedResponseCount(target, "dodge", player) * 0.12 : -1;
    if (move.skill === "tiaoxin") score += target ? -attitude(player, target) + (player.hp > 2 ? 0.5 : -0.5) - estimatedResponseCount(target, "slash", player) * 0.2 : -1;
    if (move.skill === "zhijian") {
      if (!target) return -1;
      const card = chooseZhijianCard(player, target);
      if (!card) return -1;
      const att = attitude(player, target);
      const equipGain = equipmentUtilityFor(target, card, player) - equipmentUtilityFor(target, target.equip[card.subtype], player);
      const teamwork = supportTeamworkScore(player, target, "equip");
      score += att * 0.65 + teamwork + supportMoveScoreBonus(player, target, "equip") + equipGain * Math.max(-0.4, att) - cardKeepValue(player, card) * 0.12 + 0.35;
      if (att <= 0 && teamwork <= 0.2) score -= 1.6;
    }
    if (move.skill === "luanwu") score += alivePlayers().filter((p) => p.id !== player.id).reduce((s, p) => s - attitude(player, p) * (p.hp <= 2 ? 0.55 : 0.32), 0);
    if (move.skill === "jixi") score += target ? -attitude(player, target) + 0.35 : -1;
    if (move.skill === "fangquan") {
      const ally = bestExtraTurnTarget(player);
      if (ally) {
        const teamwork = supportTeamworkScore(player, ally, "gift");
        score += attitude(player, ally) + teamwork + supportMoveScoreBonus(player, ally, "gift") + Math.min(1.2, ally.hand.length * 0.18) + (ally.hp <= 2 ? 0.16 : 0) - (player.hp <= 2 ? 0.2 : 0);
      } else {
        score -= 1;
      }
    }
    if (move.skill === "dimeng") score += scoreDimeng(player, move.targets || []);
    if (move.skill === "xuanhuo") score += scoreXuanhuo(player, move.targets || []);
    if (move.skill === "jujian") {
      if (!target) return -1;
      const cards = chooseJujianCards(player, target);
      if (!cards.length) return -1;
      const cost = cards.reduce((sum, card) => sum + cardKeepValue(player, card), 0);
      const sameCategoryHeal = cards.length === 3 && player.hp < player.maxHp && sameCardCategory(cards);
      score += supportRelationshipScore(player, target, "gift") + supportMoveScoreBonus(player, target, "gift") + cards.length * 0.34 + (sameCategoryHeal ? 0.62 : 0) - cost * 0.2;
    }
    if (move.skill === "ganlu") score += scoreGanlu(player, move.targets || []);
    if (move.skill === "anxu") score += scoreAnxu(player, move.targets || []);
    if (move.skill === "huangtian") return scoreHuangtianMove(player);
    if (move.skill === "zhiba") return scoreZhibaMove(player);

    return score;
  }

  function supportKindForMove(move) {
    if (!move) return "support";
    if (move.effect === "peach" || move.skill === "qingnang" || move.skill === "jieyin") return "heal";
    if (move.skill === "rende" || move.skill === "fangquan" || move.skill === "huangtian" || move.skill === "jujian" || move.skill === "anxu") return "gift";
    if (move.skill === "zhijian" || move.skill === "ganlu") return "equip";
    return "support";
  }

  function isCooperativeSupportMove(player, move) {
    const target = aiMovePrimaryTarget(player, move);
    if (!player || !move || !target || target.id === player.id) return false;
    if (isSupportiveControlMove(player, move, target)) return true;
    if (moveIntentKind(move) !== "support") return false;
    const teamwork = supportTeamworkScore(player, target, supportKindForMove(move));
    return teamwork >= 0.68 || attitude(player, target) >= 0.82 || committedSupportBonus(player, target, supportKindForMove(move)) >= 0.14;
  }

  function scoreLijian(actor, targets) {
    if (!targets || targets.length < 2) return -1;
    const [source, target] = targets;
    if (!source?.alive || !target?.alive || source.id === target.id) return -1;
    const targetFails = duelFailureChance(target, source, actor);
    const sourceFails = (1 - targetFails) * duelFailureChance(source, target, actor);
    const targetDamageValue = lijianDamageValue(actor, source, target);
    const sourceDamageValue = lijianDamageValue(actor, target, source);
    const pressure = [source, target].reduce((sum, p) => sum + Math.max(0, -attitude(actor, p)) * 0.12, 0);
    const friendlyRisk = Math.max(0, attitude(actor, target)) * targetFails * 0.45
      + Math.max(0, attitude(actor, source)) * sourceFails * 0.45;
    return targetFails * targetDamageValue + sourceFails * sourceDamageValue + pressure - friendlyRisk;
  }

  function duelFailureChance(responder, opponent, observer) {
    const required = (hasSkill(responder, "wushuang") || hasSkill(opponent, "wushuang")) ? 2 : 1;
    const slashEstimate = estimatedResponseCount(responder, "slash", observer);
    let chance = 0.82 - (slashEstimate / required) * 0.38;
    if (responder.hp <= 2) chance += 0.08;
    if (attitude(responder, opponent) < 0) chance -= 0.06;
    return clamp(chance, 0.08, 0.9);
  }

  function lijianDamageValue(actor, damager, damaged) {
    let value = -attitude(actor, damaged);
    value += threatScore(actor, damaged) * 0.22;
    value += damaged.hp <= 2 ? 0.68 : 0.12;
    if (attitude(actor, damager) > 0 && attitude(actor, damaged) < 0) value += 0.18;
    return value;
  }

  function canPayQiangxiCost(player) {
    return Boolean(player?.alive && (player.equip.weapon || player.hp > 0));
  }

  function qiangxiCostOptions(player) {
    const options = [];
    if (player.equip.weapon) {
      options.push({
        value: "weapon",
        label: `弃置武器 ${cardName(player.equip.weapon)}`,
        tip: `弃置装备区武器牌\n${equipmentRuleText(player.equip.weapon)}`
      });
    }
    if (player.hp > 0) {
      options.push({
        value: "hp",
        label: "失去 1 点体力",
        tip: "失去 1 点体力作为强袭成本。若体力降至 0，会先进入濒死结算。"
      });
    }
    return options;
  }

  function qiangxiHpCostPenalty(player) {
    if (player.hp <= 1) return 8.5;
    if (player.hp === 2) return 1.65;
    return 0.72;
  }

  function qiangxiCostPenalty(player, cost) {
    if (cost === "weapon") return equipmentUtilityFor(player, player.equip.weapon, player) * 0.34 + 0.18;
    if (cost === "hp") return qiangxiHpCostPenalty(player);
    return 9;
  }

  function chooseAIQiangxiCost(player) {
    if (!canPayQiangxiCost(player)) return "";
    if (!player.equip.weapon) return "hp";
    const weaponPenalty = qiangxiCostPenalty(player, "weapon");
    const hpPenalty = qiangxiCostPenalty(player, "hp");
    return hpPenalty < weaponPenalty ? "hp" : "weapon";
  }

  async function askHumanQiangxiCost(player) {
    const options = qiangxiCostOptions(player);
    if (!options.length) return "";
    if (options.length === 1) {
      const choice = await askChoice("强袭：选择支付方式。", [...options, { label: "取消强袭", value: "cancel", danger: true }], player);
      return choice === "cancel" ? "" : choice;
    }
    const choice = await askChoice("强袭：弃置武器或失去 1 点体力？", [...options, { label: "取消强袭", value: "cancel", danger: true }], player);
    return choice === "cancel" ? "" : choice;
  }

  async function payQiangxiCost(player, cost) {
    if (cost === "weapon") {
      const weapon = removeEquipCard(player, "weapon");
      if (!weapon) return false;
      discardCards([weapon]);
      log(`${nameOf(player)} 弃置 ${cardName(weapon)} 发动强袭。`);
      await afterLoseHand(player, { lostHand: false, lostCard: true });
      return true;
    }
    if (cost === "hp") {
      log(`${nameOf(player)} 失去 1 点体力发动强袭。`);
      await loseHp(player, 1);
      return player.alive;
    }
    return false;
  }

  async function executeMove(player, move) {
    if (!player.alive || state.gameOver) return;
    if (move.type === "skill") {
      noteHumanSkillUse(player);
      const event = {
        id: state.lastEventId++,
        ...enrichSpotlightEvent({
          kind: "skill",
          actor: nameOf(player),
          title: SKILL_TEXT[move.skill] || move.skill || "技能",
          target: move.targets?.length ? move.targets.map(nameOf).join("、") : "",
          detail: move.targets?.length ? `目标：${move.targets.map(nameOf).join("、")}` : "准备发动技能"
        })
      };
      state.spotlight = event;
      state.eventHoldUntil = state.autoplayHuman ? Date.now() + 120 : Date.now() + eventHoldDuration(event);
      pushEventTrail(event);
      await eventPause(620);
      await executeSkill(player, move);
      return;
    }

    let jijiangResult = null;
    if (move.virtualSkill === "jijiang") {
      jijiangResult = await askForJijiangSlash(player, {
        activeUse: true,
        target: move.targets?.[0] || null,
        reason: "激将"
      });
      if (!jijiangResult) return;
    }
    const consumeIds = moveConsumeIds(move);
    const rawCards = consumeIds.map((id) => findHandCard(player, id)).filter(Boolean);
    if (consumeIds.length && rawCards.length !== consumeIds.length) return;
    if (consumeIds.length) removeHandCards(player, consumeIds);
    const rawCard = jijiangResult?.card || rawCards[0] || null;
    const usedCard = move.card;
    noteHumanCardUse(player, Math.max(1, consumeIds.length || (usedCard ? 1 : 0)));
    if (move.effect === "recastChain") {
      log(`${nameOf(player)} ${skillPrefix(move.virtualSkill)}重铸${usedCard.name}，摸一张牌。`);
      await eventPause(620);
      discardCards(rawCards.length ? rawCards : [usedCard]);
      drawCards(player, 1, false);
      await afterLoseHand(player);
      return;
    }
    if (move.virtualSkill === "guhuo") {
      const proceed = await resolveGuhuoDeclaration(player, rawCard, usedCard);
      if (!proceed) {
        discardUsedCards(rawCards.length ? rawCards : [rawCard || usedCard]);
        if (consumeIds.length) await afterLoseHand(player);
        updateReadsForMove(player, move);
        return;
      }
    }
    log(`${nameOf(player)} 使用 ${skillPrefix(move.virtualSkill)}${usedCard.name}${move.targets?.length ? `，目标 ${move.targets.map(nameOf).join("、")}` : ""}。`);
    await eventPause(820);
    triggerJizhiAfterTrick(player, usedCard);
    if (hasSkill(player, "jiang") && (usedCard.subtype === "duel" || (usedCard.subtype === "slash" && isRedFor(player, usedCard)))) {
      drawCards(player, 1);
      log(`${nameOf(player)} 发动激昂，摸一张牌。`);
    }

    await applyCardEffect(player, usedCard, move.targets || [], rawCard || usedCard);
    if (usedCard.subtype === "barbarians") maybeJuxiangGainBarbarians(player, rawCard || usedCard);
    if (!["lightning", "lebu", "bingliang"].includes(usedCard.subtype) && usedCard.type !== "equip") {
      discardUsedCards(rawCards.length ? rawCards : [usedCard]);
    }
    if (consumeIds.length) await afterLoseHand(player);
    updateReadsForMove(player, move);
  }

  async function applyCardEffect(player, card, targets, rawCard) {
    if (card.subtype === "slash") {
      player.turn.slashUsed += 1;
      player.turn.usedSlashThisTurn = true;
      for (const target of targets) {
        if (!player.alive || state.gameOver) return;
        await resolveSlash(player, target, card, rawCard);
      }
      return;
    }
    if (card.subtype === "peach") {
      heal(player, player, 1);
      return;
    }
    if (card.subtype === "wine") {
      player.drunk = true;
      player.turn.usedWine = true;
      log(`${nameOf(player)} 进入酒状态，下一张杀伤害 +1。`);
      return;
    }
    if (card.type === "equip") {
      equipCard(player, rawCard || card);
      return;
    }
    if (card.subtype === "draw2") {
      if (await maybeNullify(player, player, card)) return;
      drawCards(player, 2);
      return;
    }
    if (card.subtype === "steal") {
      if (trickInvalidByWuyan(player, targets[0], card)) return;
      if (await maybeNullify(player, targets[0], card)) return;
      await resolveStealCard(player, targets[0], card.name);
      return;
    }
    if (card.subtype === "dismantle") {
      if (trickInvalidByWuyan(player, targets[0], card)) return;
      if (await maybeNullify(player, targets[0], card)) return;
      await resolveDismantleCard(player, targets[0], card.name);
      return;
    }
    if (card.subtype === "duel") {
      if (trickInvalidByWuyan(player, targets[0], card)) return;
      if (await maybeNullify(player, targets[0], card)) return;
      await resolveDuel(player, targets[0], card);
      return;
    }
    if (card.subtype === "borrowSword") {
      await resolveBorrowSword(player, targets[0], targets[1], card);
      return;
    }
    if (card.subtype === "barbarians") {
      const barbarianSource = alivePlayers().find((p) => hasSkill(p, "huoshou")) || player;
      for (const target of massTrickTargetsInOrder(player)) {
        if (hasSkill(target, "huoshou") || hasSkill(target, "juxiang")) {
          log(`${nameOf(target)} 的技能抵消了南蛮入侵。`);
          continue;
        }
        if (isProtectedFromTrick(target, { effect: card.subtype, card })) {
          log(`${nameOf(target)} 的技能抵消了 ${card.name}。`);
          continue;
        }
        if (trickInvalidByWuyan(player, target, card)) continue;
        if (isProtectedFromMassDamage(target, card.subtype)) {
          log(`${nameOf(target)} 的藤甲抵消了 ${card.name}。`);
          continue;
        }
        if (await maybeNullify(player, target, card, {
          seatStartId: target.id,
          reason: `${nameOf(player)} 的南蛮入侵即将对 ${nameOf(target)} 生效，是否使用无懈可击？`
        })) {
          log(`${nameOf(target)} 的南蛮入侵伤害被无懈可击抵消。`);
          render();
          await eventPause(520, "important");
          continue;
        }
        const ok = await askForResponse(target, "slash", { source: player, card, reason: "南蛮入侵" });
        if (!ok) await damage(barbarianSource, target, 1, DAMAGE.NORMAL, card);
        if (state.gameOver) return;
      }
      return;
    }
    if (card.subtype === "arrows") {
      for (const target of massTrickTargetsInOrder(player)) {
        if (isProtectedFromTrick(target, { effect: card.subtype, card })) {
          log(`${nameOf(target)} 的技能抵消了 ${card.name}。`);
          continue;
        }
        if (trickInvalidByWuyan(player, target, card)) continue;
        if (isProtectedFromMassDamage(target, card.subtype)) {
          log(`${nameOf(target)} 的藤甲抵消了 ${card.name}。`);
          continue;
        }
        if (await maybeNullify(player, target, card, {
          seatStartId: target.id,
          reason: `${nameOf(player)} 的万箭齐发即将对 ${nameOf(target)} 生效，是否使用无懈可击？`
        })) {
          log(`${nameOf(target)} 的万箭齐发伤害被无懈可击抵消。`);
          render();
          await eventPause(520, "important");
          continue;
        }
        const ok = await askForResponse(target, "dodge", { source: player, card, reason: "万箭齐发" });
        if (!ok) await damage(player, target, 1, DAMAGE.NORMAL, card);
        if (state.gameOver) return;
      }
      return;
    }
    if (card.subtype === "taoyuan") {
      for (const target of massTrickTargetsInOrder(player, { includeSource: true })) {
        if (trickInvalidByWuyan(player, target, card)) continue;
        if (await maybeNullify(player, target, card, {
          seatStartId: target.id,
          reason: `${nameOf(player)} 的桃园结义即将对 ${nameOf(target)} 生效，是否使用无懈可击？`
        })) {
          log(`${nameOf(target)} 的桃园结义回复被无懈可击抵消。`);
          render();
          await eventPause(520, "important");
          continue;
        }
        heal(player, target, 1);
      }
      return;
    }
    if (card.subtype === "harvest") {
      await resolveHarvest(player, card);
      return;
    }
    if (card.subtype === "fireAttack") {
      if (trickInvalidByWuyan(player, targets[0], card)) return;
      if (await maybeNullify(player, targets[0], card)) return;
      await resolveFireAttack(player, targets[0], card);
      return;
    }
    if (card.subtype === "chain") {
      for (const target of targets) {
        if (!target?.alive) continue;
        if (trickInvalidByWuyan(player, target, card)) continue;
        if (await maybeNullify(player, target, card)) continue;
        target.linked = !target.linked;
        log(`${nameOf(target)} ${target.linked ? "被横置" : "重置"}。`);
      }
      return;
    }
    if (card.subtype === "lebu" || card.subtype === "bingliang") {
      targets[0].judgeArea.push(materializeDelayedCard(card, rawCard, player));
      log(`${card.name} 置入 ${nameOf(targets[0])} 的判定区。`);
      return;
    }
    if (card.subtype === "lightning") {
      player.judgeArea.push(materializeDelayedCard(card, rawCard, player));
      log(`${nameOf(player)} 放置闪电。`);
    }
  }

  function maybeJuxiangGainBarbarians(source, card) {
    if (!card || card.virtual || card.name !== "南蛮入侵" || card.subtype !== "barbarians") return false;
    const holder = alivePlayers().find((player) => player.id !== source?.id && hasSkill(player, "juxiang"));
    if (!holder || isCardHeldByAnyPlayer(card)) return false;
    holder.hand.push(card);
    log(`${nameOf(holder)} 发动巨象，获得结算后的 ${cardName(card)}。`);
    return true;
  }

  function trickInvalidByWuyan(source, target, card) {
    const invalidatedBy = wuyanInvalidationOwner(source, target, card);
    if (!invalidatedBy) return false;
    if (invalidatedBy.id === source.id) {
      log(`${nameOf(source)} 的无言生效，${card.name} 对 ${nameOf(target)} 无效。`);
    } else {
      log(`${nameOf(target)} 的无言生效，${card.name} 对其无效。`);
    }
    return true;
  }

  function wuyanInvalidationOwner(source, target, card) {
    if (!source?.alive || !target?.alive || !card || card.type !== "trick" || isDelayedTrick(card) || card.subtype === "nullify") return null;
    if (source.id === target.id) return null;
    if (hasSkill(source, "wuyan")) return source;
    if (hasSkill(target, "wuyan")) return target;
    return null;
  }

  async function resolveGuhuoDeclaration(source, rawCard, declaredCard) {
    if (!rawCard || !declaredCard) return false;
    log(`${nameOf(source)} 发动蛊惑，声明 ${declaredCard.name}。`);
    const doubters = await collectGuhuoDoubters(source, declaredCard);
    if (!doubters.length) {
      log(`无人质疑，${nameOf(source)} 的蛊惑按 ${declaredCard.name} 结算。`);
      return true;
    }
    const truthful = isTrueGuhuo(rawCard, declaredCard);
    log(`${doubters.map(nameOf).join("、")} 质疑蛊惑，验明为 ${cardName(rawCard)}，${truthful ? "真" : "假"}。`);
    if (truthful) {
      for (const doubter of doubters.filter((player) => player.alive)) {
        await loseHp(doubter, 1);
      }
      if (cardSuitFor(source, rawCard) === "♥") {
        log(`${nameOf(source)} 的红桃真蛊惑继续生效。`);
        return true;
      }
      log(`${nameOf(source)} 的蛊惑被质疑，非红桃真牌作废。`);
      return false;
    }
    doubters.filter((player) => player.alive).forEach((doubter) => drawCards(doubter, 1, false));
    log(`蛊惑为假，质疑者各摸一张牌，${declaredCard.name} 作废。`);
    return false;
  }

  async function collectGuhuoDoubters(source, declaredCard) {
    const doubters = [];
    for (const observer of aliveFrom(source.id).filter((player) => player.id !== source.id)) {
      const doubt = humanControls(observer)
        ? await askYesNo(`${nameOf(source)} 蛊惑声明 ${declaredCard.name}，是否质疑？`, false, observer)
        : aiShouldDoubtGuhuo(observer, source, declaredCard);
      if (doubt) doubters.push(observer);
    }
    return doubters;
  }

  function aiShouldDoubtGuhuo(observer, source, declaredCard) {
    const hostility = -attitude(observer, source);
    const impact = guhuoDeclaredImpact(declaredCard);
    const suspicion = 0.22 + Math.max(0, hostility) * 0.18 + impact * 0.08 + observer.personality.trickiness * 0.05;
    const trustPenalty = Math.max(0, attitude(observer, source)) * 0.2 + observer.personality.caution * 0.04;
    return suspicion - trustPenalty > 0.42;
  }

  function guhuoDeclaredImpact(card) {
    if (!card) return 0;
    if (["barbarians", "arrows", "duel", "borrowSword"].includes(card.subtype)) return 2.4;
    if (["draw2", "peach", "wine", "nullify"].includes(card.subtype)) return 1.8;
    if (["steal", "dismantle", "fireAttack"].includes(card.subtype)) return 1.45;
    return 1;
  }

  function isTrueGuhuo(rawCard, declaredCard) {
    if (!rawCard || !declaredCard) return false;
    if (declaredCard.subtype === "slash" && declaredCard.name === "杀") return rawCard.subtype === "slash";
    return rawCard.name === declaredCard.name;
  }

  function zhihengCandidates(player) {
    return [
      ...player.hand.map((card) => ({ zone: "hand", id: card.id, card })),
      ...Object.entries(player.equip).map(([slot, card]) => ({ zone: "equip", slot, card }))
    ];
  }

  function zhihengChoiceKey(choice) {
    return choice.zone === "hand" ? `hand:${choice.id}` : `equip:${choice.slot}`;
  }

  function zhihengChoiceLabel(choice) {
    return choice.zone === "hand"
      ? `手牌 ${cardName(choice.card)}`
      : `装备 ${equipSlotLabel(choice.slot)} ${cardDisplayName(choice.card)}`;
  }

  function zhihengDiscardValue(player, choice) {
    if (!choice?.card) return 9;
    if (choice.zone === "equip") return equipmentUtilityFor(player, choice.card, player) + 0.18;
    return cardKeepValue(player, choice.card);
  }

  function chooseAIZhihengCards(player) {
    const candidates = zhihengCandidates(player)
      .slice()
      .sort((a, b) => zhihengDiscardValue(player, a) - zhihengDiscardValue(player, b));
    let choices = candidates
      .filter((choice) => zhihengDiscardValue(player, choice) < 2.35)
      .slice(0, Math.max(1, Math.min(4, candidates.length)));
    if (!choices.length && candidates.length) choices = [candidates[0]];
    return choices;
  }

  async function askHumanZhihengCards(player) {
    const selected = [];
    while (selected.length < zhihengCandidates(player).length) {
      const selectedKeys = new Set(selected.map(zhihengChoiceKey));
      const remaining = zhihengCandidates(player).filter((choice) => !selectedKeys.has(zhihengChoiceKey(choice)));
      const options = [
        ...(selected.length ? [{ label: `确认制衡 ${selected.length} 张`, value: "done" }] : []),
        ...remaining.map((choice) => ({
          label: zhihengChoiceLabel(choice),
          value: zhihengChoiceKey(choice),
          tip: `${choice.zone === "equip" ? "装备区牌" : "手牌"}\n${cardTooltipText(choice.card)}`
        })),
        { label: "取消制衡", value: "cancel", danger: true }
      ];
      const choiceKey = await askChoice(
        selected.length
          ? `制衡：已选择 ${selected.length} 张；继续选择或确认。`
          : "制衡：选择任意张手牌或装备区里的牌。",
        options,
        player
      );
      if (choiceKey === "cancel") return [];
      if (choiceKey === "done") return selected;
      const next = remaining.find((choice) => zhihengChoiceKey(choice) === choiceKey);
      if (!next) break;
      selected.push(next);
    }
    return selected;
  }

  async function discardZhihengChoices(player, choices) {
    const discarded = [];
    const handIds = choices.filter((choice) => choice.zone === "hand").map((choice) => choice.id);
    if (handIds.length) {
      const handDiscarded = await discardFromHand(player, handIds, "制衡");
      discarded.push(...handDiscarded);
    }
    for (const choice of choices.filter((item) => item.zone === "equip")) {
      const card = removeEquipCard(player, choice.slot);
      if (!card) continue;
      discardCards([card]);
      discarded.push(card);
      log(`${nameOf(player)} 因 制衡 弃置装备区的 ${cardName(card)}。`);
      await afterLoseHand(player, { lostHand: false, lostCard: true });
    }
    return discarded;
  }

  async function executeSkill(player, move) {
    if (move.skill === "kurou") {
      log(`${nameOf(player)} 发动苦肉。`);
      await loseHp(player, 1);
      if (!player.alive) return;
      drawCards(player, 2);
    }
    if (move.skill === "zhiheng") {
      player.turn.usedSkills.zhiheng = true;
      const choices = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askHumanZhihengCards(player)
        : chooseAIZhihengCards(player);
      if (!choices.length) return;
      const discarded = await discardZhihengChoices(player, choices);
      const count = discarded.length;
      if (!count) return;
      drawCards(player, count);
      log(`${nameOf(player)} 发动制衡，弃置 ${count} 张牌${discardedCardListSuffix(discarded)}，摸 ${count} 张牌。`);
    }
    if (move.skill === "qingnang") {
      const target = move.targets?.[0] || (await askHumanTarget("选择青囊目标。", legalTargets(player, move)));
      if (!target) return;
      const id = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? (await askHumanSelectCards(player, "弃一张手牌发动青囊。", 1, 1, () => true, false))[0]
        : chooseDiscardCards(player, 1)[0]?.id;
      if (!id) return;
      player.turn.usedSkills.qingnang = true;
      await discardFromHand(player, [id], "青囊");
      heal(player, target, 1);
      log(`${nameOf(player)} 发动青囊，令 ${nameOf(target)} 回复 1 点体力。`);
    }
    if (move.skill === "rende") {
      const target = move.targets?.[0] || (await askHumanTarget("选择仁德目标。", legalTargets(player, move)));
      if (!target) return;
      const max = player.hand.length;
      const ids = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askHumanSelectCards(player, "选择给出的手牌。", 1, max, () => true, true)
        : chooseRendeCards(player, target, max).map((c) => c.id);
      if (!ids.length) return;
      const cards = removeHandCards(player, ids);
      target.hand.push(...cards);
      player.turn.gaveByRende += cards.length;
      log(`${nameOf(player)} 发动仁德，交给 ${nameOf(target)} ${cards.length} 张牌。`);
      if (player.turn.gaveByRende >= 2 && player.hp < player.maxHp && !player.turn.usedSkills.rendeHeal) {
        player.turn.usedSkills.rendeHeal = true;
        heal(player, player, 1);
      }
      await afterLoseHand(player);
    }
    if (move.skill === "jieyin") {
      const target = move.targets?.[0] || (await askHumanTarget("选择结姻目标。", legalTargets(player, move)));
      if (!target) return;
      const ids = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askHumanSelectCards(player, "弃两张手牌发动结姻。", 2, 2, () => true, false)
        : chooseDiscardCards(player, 2).map((c) => c.id);
      if (ids.length < 2) return;
      player.turn.usedSkills.jieyin = true;
      await discardFromHand(player, ids, "结姻");
      const beforeSelf = player.hp;
      const beforeTarget = target.hp;
      heal(player, player, 1);
      heal(player, target, 1);
      const healed = [];
      if (player.hp > beforeSelf) healed.push(nameOf(player));
      if (target.hp > beforeTarget) healed.push(nameOf(target));
      log(`${nameOf(player)} 发动结姻，${healed.length ? `${healed.join("、")} 回复 1 点体力` : "没有角色回复体力"}。`);
    }
    if (move.skill === "lijian") {
      const targets = move.targets?.length === 2
        ? move.targets
        : await pickTargets("离间：先选视为使用决斗的男性角色，再选其决斗目标。", legalTargets(player, move), 2, 2);
      if (targets.length < 2) return;
      const cost = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askHumanLijianCost(player)
        : chooseAILijianCost(player);
      if (!cost) return;
      const paid = await discardLijianCost(player, cost);
      if (!paid) return;
      player.turn.usedSkills.lijian = true;
      log(`${nameOf(player)} 发动离间，令 ${nameOf(targets[0])} 视为对 ${nameOf(targets[1])} 使用决斗。`);
      await resolveDuel(targets[0], targets[1], { name: "离间", subtype: "duel" });
    }
    if (move.skill === "luanji") {
      const suit = bestPairSuit(player.hand);
      const ids = player.hand.filter((c) => c.suit === suit).slice(0, 2).map((c) => c.id);
      await discardFromHand(player, ids, "乱击");
      log(`${nameOf(player)} 发动乱击，视为使用万箭齐发。`);
      await applyCardEffect(player, virtualCard({ suit, rank: "" }, "万箭齐发", "trick", "arrows"), [], null);
    }
    if (move.skill === "qice") {
      player.turn.usedSkills.qice = true;
      const cards = player.hand.splice(0);
      if (!cards.length) return;
      discardCards(cards);
      const card = move.card || virtualCard({ id: "qice", suit: "♣", rank: "" }, move.qiceName, "trick", move.qiceEffect);
      log(`${nameOf(player)} 发动奇策，弃置全部手牌${discardedCardListSuffix(cards)}，当作 ${move.qiceName} 使用。`);
      await applyCardEffect(player, card, move.targets || [], card);
      await afterLoseHand(player);
    }
    if (move.skill === "qiangxi") {
      const target = move.targets?.[0] || (await askHumanTarget("选择强袭目标。", legalTargets(player, move)));
      if (!target) return;
      const cost = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askHumanQiangxiCost(player)
        : chooseAIQiangxiCost(player);
      if (!cost) return;
      const paid = await payQiangxiCost(player, cost);
      if (!paid) return;
      player.turn.usedSkills.qiangxi = true;
      await damage(player, target, 1, DAMAGE.NORMAL, { name: "强袭" });
    }
    if (move.skill === "fanjian") {
      const target = move.targets?.[0] || (await askHumanTarget("选择反间目标。", legalTargets(player, move)));
      if (!target || !player.hand.length) return;
      const cardId = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? (await askHumanSelectCards(player, "选择一张手牌交给目标发动反间。", 1, 1, () => true, true))[0]
        : chooseFanjianCard(player, target)?.id;
      if (!cardId) return;
      const card = removeHandCard(player, cardId);
      if (!card) return;
      player.turn.usedSkills.fanjian = true;
      const guessedSuit = target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askChoice("反间：猜一个花色。", SUITS.map((suit) => ({ label: suit, value: suit })), target)
        : chooseFanjianSuit(target);
      target.hand.push(card);
      log(`${nameOf(player)} 发动反间，${nameOf(target)} 猜 ${guessedSuit}，获得 ${cardName(card)}。`);
      if (cardSuitFor(target, card) !== guessedSuit) {
        await damage(player, target, 1, DAMAGE.NORMAL, { name: "反间" });
      }
      await afterLoseHand(player);
    }
    if (move.skill === "quhu") {
      const target = move.targets?.[0] || (await askHumanTarget("选择驱虎拼点目标。", legalTargets(player, move)));
      if (!target) return;
      player.turn.usedSkills.quhu = true;
      const win = await pindian(player, target, "驱虎");
      if (win) {
        const candidates = quhuVictimCandidates(target);
        const victim = candidates.length
          ? (humanControls(player)
            ? await askHumanTarget(`驱虎：选择 ${nameOf(target)} 造成伤害的目标。`, candidates, player)
            : chooseQuhuVictim(player, target))
          : null;
        if (victim) {
          log(`${nameOf(player)} 驱虎成功，令 ${nameOf(target)} 对 ${nameOf(victim)} 造成 1 点伤害。`);
          await damage(target, victim, 1, DAMAGE.NORMAL, { name: "驱虎" });
        } else {
          log(`${nameOf(player)} 驱虎成功，但 ${nameOf(target)} 攻击范围内没有可选目标。`);
        }
      } else {
        log(`${nameOf(player)} 驱虎失败，受到 ${nameOf(target)} 造成的 1 点伤害。`);
        await damage(target, player, 1, DAMAGE.NORMAL, { name: "驱虎" });
      }
    }
    if (move.skill === "tianyi") {
      const target = move.targets?.[0] || (await askHumanTarget("选择天义拼点目标。", legalTargets(player, move)));
      if (!target) return;
      player.turn.usedSkills.tianyi = true;
      const win = await pindian(player, target, "天义");
      if (win) {
        player.turn.tianyi = true;
        log(`${nameOf(player)} 天义成功，本回合使用杀无距离限制、可多指定一个目标，并可额外使用一张杀。`);
      } else {
        player.turn.slashUsed = 99;
        log(`${nameOf(player)} 天义失败，本回合不能再使用杀。`);
      }
    }
    if (move.skill === "tiaoxin") {
      const target = move.targets?.[0] || (await askHumanTarget("选择挑衅目标。", legalTargets(player, move)));
      if (!target) return;
      player.turn.usedSkills.tiaoxin = true;
      log(`${nameOf(player)} 对 ${nameOf(target)} 发动挑衅。`);
      const canHit = canSlashTarget(target, player);
      const shouldSlash = canHit && (target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askYesNo(`是否对 ${nameOf(player)} 出杀响应挑衅？`, true, target)
        : attitude(target, player) < 0 && estimatedResponseCount(target, "slash", target) > 0);
      if (shouldSlash) {
        const ok = await askForResponse(target, "slash", { source: player, reason: "挑衅" });
        if (ok) await resolveSlash(target, player, virtualCard({ id: "tiaoxin", suit: "♠", rank: "" }, "杀", "basic", "slash"), { name: "挑衅", virtual: true });
      } else if (totalCards(target) > 0) {
        await discardRandomFromTarget(player, target, "挑衅");
      }
    }
    if (move.skill === "zhijian") {
      const target = move.targets?.[0] || (await askHumanTarget("选择直谏目标。", legalTargets(player, move)));
      if (!target) return;
      const equip = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? (await askHumanSelectCards(player, "选择一张装备牌交给目标。", 1, 1, (card) => card.type === "equip", true))[0]
        : chooseZhijianCard(player, target)?.id;
      if (!equip) return;
      const card = removeHandCard(player, equip);
      if (!card) return;
      player.turn.usedSkills.zhijian = true;
      const replaced = equipCard(target, card);
      if (replaced) await afterLoseHand(target, { lostHand: false });
      drawCards(player, 1);
      log(`${nameOf(player)} 发动直谏，将 ${card.name} 置入 ${nameOf(target)} 装备区并摸一张牌。`);
      await afterLoseHand(player);
    }
    if (move.skill === "luanwu") {
      player.flags.luanwuUsed = true;
      log(`${nameOf(player)} 发动乱武。`);
      for (const target of aliveFrom(nextAliveIndex(player.id)).filter((p) => p.id !== player.id)) {
        const victims = nearestTargets(target);
        const victim = humanControls(target)
          ? await chooseHumanLuanwuVictim(target, victims)
          : chooseAILuanwuVictim(target, victims, player);
        const slash = responseOptions(target, "slash")[0];
        const shouldSlash = Boolean(victim && slash) && (humanControls(target)
          ? await askYesNo(`乱武：是否对 ${nameOf(victim)} 使用杀？否则失去 1 点体力。`, true, target)
          : aiShouldSlashForLuanwu(target, victim, player));
        if (shouldSlash) {
          const ok = await consumeResponseOption(target, slash, "杀", "使用", { target: victim, reason: "乱武" });
          if (ok) await resolveSlash(target, victim, virtualCard({ id: "luanwu", suit: "♠", rank: "" }, "杀", "basic", "slash"), { name: "乱武", virtual: true });
          else await loseHp(target, 1);
        } else {
          await loseHp(target, 1);
        }
        if (state.gameOver) return;
      }
    }
    if (move.skill === "jixi") {
      const target = move.targets?.[0] || (await askHumanTarget("选择急袭目标。", legalTargets(player, move)));
      if (!target || !player.fields.length) return;
      const field = player.fields.pop();
      discardCards([field]);
      log(`${nameOf(player)} 发动急袭，将田 ${cardName(field)} 当顺手牵羊使用。`);
      await resolveStealCard(player, target, "急袭");
    }
    if (move.skill === "fangquan") {
      player.turn.usedSkills.fangquan = true;
      player.turn.forceEndPlay = true;
      log(`${nameOf(player)} 发动放权，结束出牌阶段。`);
    }
    if (move.skill === "dimeng") {
      const targets = move.targets?.length === 2 && canDimengPair(player, move.targets[0], move.targets[1])
        ? move.targets
        : await pickDimengTargets(player, move);
      if (targets.length < 2) return;
      const [a, b] = targets;
      const diff = Math.abs(a.hand.length - b.hand.length);
      if (!canDimengPair(player, a, b)) return;
      const cost = diff > 0
        ? player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
          ? await askHumanDimengCost(player, diff)
          : chooseAIDimengCost(player, diff)
        : [];
      if (cost.length < diff) return;
      player.turn.usedSkills.dimeng = true;
      const discarded = diff ? await discardDimengCost(player, cost) : [];
      if (discarded.length < diff) return;
      [a.hand, b.hand] = [b.hand, a.hand];
      log(`${nameOf(player)} 发动缔盟，${diff ? `弃置 ${diff} 张牌，` : "无需弃牌，"}令 ${nameOf(a)} 与 ${nameOf(b)} 交换手牌。`);
    }
    if (move.skill === "xuanhuo") {
      const targets = move.targets?.length === 2
        ? move.targets
        : await pickTargets("眩惑：先选获得红桃牌的角色，再选转交牌的角色。", legalTargets(player, move), 2, 2, player);
      if (!isXuanhuoPair(player, targets?.[0], targets?.[1])) return;
      const [receiver, recipient] = targets;
      const heartId = humanControls(player)
        ? (await askHumanSelectCards(player, "眩惑：选择一张红桃手牌交给第一名目标。", 1, 1, (card) => card.suit === "♥", false))[0]
        : chooseXuanhuoHeart(player)?.id;
      const heart = removeHandCard(player, heartId);
      if (!heart) return;
      player.turn.usedSkills.xuanhuo = true;
      receiver.hand.push(heart);
      noteCardsGained(receiver, 1);
      log(`${nameOf(player)} 发动眩惑，将 ${cardName(heart)} 交给 ${nameOf(receiver)}。`);
      await afterLoseHand(player, { lostHand: true, lostCard: true });
      if (!receiver.alive || !recipient.alive || totalCards(receiver) <= 0) return;
      const choice = await chooseTargetCard(player, receiver, "steal", "眩惑");
      const moved = removeChosenTargetCard(receiver, choice);
      if (!moved) return;
      recipient.hand.push(moved);
      noteCardsGained(recipient, 1);
      log(`${nameOf(player)} 因眩惑获得 ${nameOf(receiver)} 的${targetCardLogLabel(choice, moved)}，并交给 ${nameOf(recipient)}：${cardName(moved)}。`);
      await afterLoseHand(receiver, { lostHand: choice.zone === "hand", lostCard: true });
    }
    if (move.skill === "jujian") {
      const target = move.targets?.[0] || (await askHumanTarget("选择举荐目标。", legalTargets(player, move)));
      if (!target || target.id === player.id || !player.hand.length) return;
      const ids = humanControls(player)
        ? await askHumanSelectCards(player, "举荐：弃置 1 至 3 张手牌。", 1, Math.min(3, player.hand.length), () => true, true)
        : chooseJujianCards(player, target).map((card) => card.id);
      if (!ids.length) return;
      player.turn.usedSkills.jujian = true;
      const discarded = await discardFromHand(player, ids.slice(0, 3), "举荐");
      if (!discarded.length) return;
      drawCards(target, discarded.length);
      log(`${nameOf(player)} 发动举荐，令 ${nameOf(target)} 摸 ${discarded.length} 张牌。`);
      if (discarded.length === 3 && sameCardCategory(discarded)) {
        const healed = heal(player, player, 1, `${nameOf(player)} 的举荐弃置三张同类别牌，回复 1 点体力。`);
        if (!healed) log(`${nameOf(player)} 的举荐弃置三张同类别牌，但体力已满。`);
      }
    }
    if (move.skill === "ganlu") {
      const targets = move.targets?.length === 2
        ? move.targets
        : await pickTargets("甘露：选择两名交换装备区的角色。", legalTargets(player, move), 2, 2, player);
      if (!canGanluPair(player, targets?.[0], targets?.[1])) return;
      const [a, b] = targets;
      player.turn.usedSkills.ganlu = true;
      const beforeA = equipmentSummary(a);
      const beforeB = equipmentSummary(b);
      log(`${nameOf(player)} 发动甘露，交换 ${nameOf(a)} 与 ${nameOf(b)} 的装备区（${beforeA} ↔ ${beforeB}）。`);
      await exchangeEquipAreas(a, b);
    }
    if (move.skill === "anxu") {
      const targets = move.targets?.length === 2
        ? move.targets
        : await pickTargets("安恤：选择两名手牌数不同的其他角色。", legalTargets(player, move), 2, 2, player);
      if (!isAnxuPair(player, targets?.[0], targets?.[1])) return;
      const [a, b] = targets;
      const low = a.hand.length < b.hand.length ? a : b;
      const high = low.id === a.id ? b : a;
      const index = await chooseAnxuHandIndex(player, high);
      const card = high.hand.splice(index, 1)[0];
      if (!card) return;
      player.turn.usedSkills.anxu = true;
      low.hand.push(card);
      noteCardsGained(low, 1);
      log(`${nameOf(player)} 发动安恤，令 ${nameOf(low)} 获得并展示 ${nameOf(high)} 的 ${cardName(card)}。`);
      await afterLoseHand(high, { lostHand: true, lostCard: true });
      if (card.suit !== "♠") {
        drawCards(player, 1);
        log(`${nameOf(player)} 的安恤展示牌不为黑桃，摸一张牌。`);
      }
    }
    if (move.skill === "huangtian") {
      const lord = huangtianLordFor(player);
      if (!lord) return;
      const card = humanControls(player)
        ? await askHumanHuangtianCard(player, lord)
        : chooseHuangtianCard(player, lord);
      if (!card) return;
      player.turn.usedSkills.huangtian = true;
      removeHandCard(player, card.id);
      lord.hand.push(card);
      log(`${nameOf(player)} 发动黄天，将 ${card.name} 交给 ${nameOf(lord)}。`);
      await afterLoseHand(player);
    }
    if (move.skill === "zhiba") {
      const lord = zhibaLordFor(player);
      if (!lord) return;
      player.turn.usedSkills.zhiba = true;
      const donation = !humanControls(player) && aiShouldDonateZhiba(player, lord);
      const result = await pindian(player, lord, "制霸", {
        returnCards: true,
        sourceWantsWin: !donation,
        targetWantsWin: true
      });
      if (!result) return;
      const cards = [result.sourceCard, result.targetCard].filter(Boolean);
      if (result.win) {
        discardCards(cards);
        log(`${nameOf(player)} 制霸拼点成功，拼点牌进入弃牌堆${discardedCardListSuffix(cards)}。`);
      } else {
        const take = humanControls(lord)
          ? await askYesNo("制霸：是否获得两张拼点牌？", true, lord)
          : true;
        if (take) {
          lord.hand.push(...cards);
          log(`${nameOf(lord)} 因制霸获得两张拼点牌。`);
        } else {
          discardCards(cards);
          log(`${nameOf(lord)} 放弃获得制霸拼点牌，拼点牌进入弃牌堆${discardedCardListSuffix(cards)}。`);
        }
      }
    }
    render();
    await eventPause(360);
  }

  async function resolveSlash(source, target, card, rawCard, liuliChain = new Set()) {
    if (!target || !target.alive) return;
    const redirectedTarget = await maybeLiuli(source, target, card, rawCard, liuliChain);
    if (redirectedTarget) {
      await resolveSlash(source, redirectedTarget, card, rawCard, liuliChain);
      return;
    }
    const drunkBonus = source.drunk ? 1 : 0;
    const consumeDrunkSlash = () => {
      if (source.drunk) source.drunk = false;
    };
    if (hasSkill(target, "kongcheng") && target.hand.length === 0) {
      consumeDrunkSlash();
      log(`${nameOf(target)} 触发空城，不能成为杀的目标。`);
      return;
    }
    if (hasSkill(target, "xiangle")) {
      const basics = source.hand.filter((c) => c.type === "basic");
      if (!basics.length) {
        consumeDrunkSlash();
        log(`${nameOf(target)} 触发享乐，${nameOf(source)} 没有基本牌，杀无效。`);
        return;
      }
      const pay = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askYesNo(`享乐：是否弃一张基本牌继续对 ${nameOf(target)} 使用杀？`, true, source)
        : attitude(source, target) < 0 && (target.hp <= 2 || source.hand.length > 3);
      if (!pay) {
        consumeDrunkSlash();
        log(`${nameOf(target)} 触发享乐，杀无效。`);
        return;
      }
      const id = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? (await askHumanSelectCards(source, "弃一张基本牌响应享乐。", 1, 1, (c) => c.type === "basic", false))[0]
        : basics.sort((a, b) => cardKeepValue(source, a) - cardKeepValue(source, b))[0].id;
      await discardFromHand(source, [id], "享乐");
    }
    if (hasSkill(target, "jiang") && card.subtype === "slash" && isRedFor(source, card)) {
      drawCards(target, 1);
      log(`${nameOf(target)} 发动激昂，摸一张牌。`);
    }
    if (!ignoresArmor(source) && target.equip.armor?.name === "仁王盾" && isBlack(card)) {
      consumeDrunkSlash();
      log(`${nameOf(target)} 的仁王盾抵消了黑色杀。`);
      return;
    }
    if (!ignoresArmor(source) && target.equip.armor?.name === "藤甲" && card.nature === DAMAGE.NORMAL) {
      consumeDrunkSlash();
      log(`${nameOf(target)} 的藤甲抵消了普通杀。`);
      return;
    }

    if (source.equip.weapon?.name === "雌雄双股剑" && source.general.gender !== target.general.gender) {
      await triggerCixiong(source, target);
    }

    let dodgeForbidden = false;
    if (hasSkill(source, "liegong") && canTriggerLiegong(source, target)) {
      const useLiegong = humanControls(source)
        ? await askYesNo(`是否发动烈弓，令 ${nameOf(target)} 不能出闪？`, aiShouldLiegong(source, target), source)
        : aiShouldLiegong(source, target);
      if (useLiegong) {
        dodgeForbidden = true;
        log(`${nameOf(source)} 发动烈弓，${nameOf(target)} 不能出闪。`);
      }
    }
    if (hasSkill(source, "tieji")) {
      const useTieji = humanControls(source)
        ? await askYesNo(`是否发动铁骑，判定红色则 ${nameOf(target)} 不能出闪？`, aiShouldTieji(source, target), source)
        : aiShouldTieji(source, target);
      if (useTieji) {
        log(`${nameOf(source)} 发动铁骑，对 ${nameOf(target)} 进行判定。`);
        const judge = await judgeCard(source, "铁骑");
        if (isRedFor(source, judge)) {
          dodgeForbidden = true;
          log(`${nameOf(source)} 的铁骑判定为红色，${nameOf(target)} 不能出闪。`);
        } else {
          log(`${nameOf(source)} 的铁骑判定未命中，${nameOf(target)} 仍可出闪。`);
        }
      }
    }

    let required = hasSkill(source, "wushuang") ? 2 : 1;
    if ((hasSkill(source, "roulin") && target.general.gender === "female") || (hasSkill(target, "roulin") && source.general.gender === "female")) {
      required += 1;
      log(`肉林触发，${nameOf(target)} 需要额外出闪。`);
    }
    let dodged = true;
    if (dodgeForbidden) {
      dodged = false;
    } else {
      for (let i = 0; i < required; i += 1) {
        const ok = await askForResponse(target, "dodge", { source, card, reason: required > 1 ? "额外响应" : "杀" });
        if (!ok) {
          dodged = false;
          break;
        }
      }
    }
    if (dodged) {
      log(`${nameOf(target)} 闪避了 ${nameOf(source)} 的杀。`);
      if (hasSkill(source, "mengjin") && totalCards(target) > 0) {
        const use = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
          ? await askYesNo(`是否发动猛进，弃置 ${nameOf(target)} 的一张牌？`, true, source)
          : attitude(source, target) < 0;
        if (use) {
          const removed = await resolveDismantleCard(source, target, "猛进");
          if (removed) log(`${nameOf(source)} 发动猛进。`);
        }
      }
      if (!(await maybeGuanshiHit(source, target))) {
        consumeDrunkSlash();
        await maybeQinglongSlash(source, target);
        return;
      }
    }

    let amount = 1 + drunkBonus + (source.turn?.luoyi ? 1 : 0);
    if (source.equip.weapon?.name === "古锭刀" && target.hand.length === 0) amount += 1;
    if (!ignoresArmor(source) && target.equip.armor?.name === "藤甲" && card.nature === DAMAGE.FIRE) amount += 1;
    consumeDrunkSlash();
    if (await maybeHanbingPreventDamage(source, target, amount)) return;
    await damage(source, target, amount, card.nature || DAMAGE.NORMAL, rawCard || card);
    if (source.alive && target.alive) await maybeQilin(source, target);
    await maybeLieren(source, target);
  }

  async function resolveDuel(source, target, card) {
    if (!source?.alive || !target?.alive) return;
    let attacker = target;
    let defender = source;
    while (attacker.alive && defender.alive) {
      const required = hasSkill(defender, "wushuang") || hasSkill(attacker, "wushuang") ? 2 : 1;
      let ok = true;
      for (let i = 0; i < required; i += 1) {
        ok = await askForResponse(attacker, "slash", { source: defender, card, reason: "决斗" });
        if (!ok) break;
      }
      if (!ok) {
        await damage(defender, attacker, 1 + (defender.turn.luoyi ? 1 : 0), DAMAGE.NORMAL, card);
        return;
      }
      [attacker, defender] = [defender, attacker];
    }
  }

  async function maybeLieren(source, target) {
    if (!source?.alive || !target?.alive || !hasSkill(source, "lieren")) return false;
    if (!source.hand.length || !target.hand.length) return false;
    const shouldUse = humanControls(source)
      ? await askYesNo(`是否发动烈刃，与 ${nameOf(target)} 拼点？`, true, source)
      : attitude(source, target) < -0.25 && totalCards(target) > 0;
    if (!shouldUse) return false;
    log(`${nameOf(source)} 发动烈刃。`);
    const win = await pindian(source, target, "烈刃");
    if (!win || !target.alive || totalCards(target) <= 0) return true;
    await resolveStealCard(source, target, "烈刃");
    return true;
  }

  async function resolveBorrowSword(source, wielder, victim, card) {
    if (!canBorrowSwordPair(source, wielder, victim, { effect: "borrowSword", card })) {
      log("借刀杀人的目标不合法。");
      return;
    }
    if (trickInvalidByWuyan(source, wielder, card)) return;
    if (await maybeNullify(source, wielder, card)) return;
    const usedSlash = await askForBorrowSwordSlash(wielder, victim, source, card);
    if (usedSlash) {
      log(`${nameOf(wielder)} 受借刀杀人影响，对 ${nameOf(victim)} 使用杀。`);
      await resolveSlash(wielder, victim, virtualCard({ id: `borrow-${card.id}`, suit: card.suit, rank: card.rank }, "杀", "basic", "slash", DAMAGE.NORMAL), { name: "借刀杀人", virtual: true });
      return;
    }
    const weapon = removeEquipCard(wielder, "weapon");
    if (weapon) {
      source.hand.push(weapon);
      noteCardsGained(source, 1);
      log(`${nameOf(wielder)} 未使用杀，将 ${weapon.name} 交给 ${nameOf(source)}。`);
      await afterLoseHand(wielder, { lostHand: false });
    }
  }

  async function askForBorrowSwordSlash(wielder, victim, source, card) {
    const options = responseOptions(wielder, "slash", { source, target: victim, card, reason: "借刀杀人" });
    if (!options.length) {
      noteResponse(wielder, "slash", false);
      return false;
    }
    if (wielder.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
      const used = await askHumanBorrowSwordSlash(wielder, victim, options);
      noteResponse(wielder, "slash", Boolean(used));
      return Boolean(used);
    }
    const use = aiShouldBorrowSwordSlash(wielder, victim, source, options);
    if (!use) {
      noteResponse(wielder, "slash", false);
      return false;
    }
    const option = chooseResponseOption(wielder, options);
    await consumeResponseOption(wielder, option, responseOptionKindLabel(option, "杀"), "使用", { target: victim, reason: "借刀杀人" });
    noteResponse(wielder, "slash", true);
    return true;
  }

  function askHumanBorrowSwordSlash(wielder, victim, options) {
    return new Promise((resolve) => {
      setWait("借刀响应", `借刀杀人：是否对 ${nameOf(victim)} 使用一张杀？`, wielder.id, `${options.length} 个可用响应`);
      state.pending = {
        prompt: `借刀杀人：是否对 ${nameOf(victim)} 使用一张杀？不使用则交出武器。`,
        ownerId: wielder.id,
        options: [
          ...options.map((option) => ({
            label: option.label,
            value: option,
            onChoose: async () => {
              state.pending = null;
              clearWait();
              await consumeResponseOption(wielder, option, responseOptionKindLabel(option, "杀"), "使用", { target: victim, reason: "借刀杀人" });
              resolve(true);
            }
          })),
          {
            label: "不使用杀",
            value: null,
            danger: true,
            onChoose: () => {
              state.pending = null;
              clearWait();
              resolve(false);
            }
          }
        ]
      };
      render();
    });
  }

  function aiShouldBorrowSwordSlash(wielder, victim, source, options) {
    const cheapest = options
      .map((option) => findHandCard(wielder, option.cardId))
      .filter(Boolean)
      .sort((a, b) => cardKeepValue(wielder, a) - cardKeepValue(wielder, b))[0];
    const slashUtility = -attitude(wielder, victim) * 1.05
      + threatScore(wielder, victim) * 0.16
      + (victim.hp <= 2 ? 0.38 : 0)
      - cardKeepValue(wielder, cheapest) * 0.24;
    const weapon = wielder.equip.weapon;
    const giveWeaponUtility = -cardKeepValue(wielder, weapon) * 0.34 + attitude(wielder, source) * 0.76;
    return slashUtility > giveWeaponUtility + rand(-0.18, 0.22) * wielder.personality.trickiness;
  }

  async function resolveHarvest(source, card) {
    const revealed = drawFromDeck(alivePlayers().length);
    log(`五谷丰登亮出：${revealed.map(cardName).join("、")}。`);
    for (const player of aliveFrom(source.id)) {
      if (!revealed.length) break;
      if (trickInvalidByWuyan(source, player, card)) continue;
      if (await maybeNullify(source, player, card, {
        seatStartId: player.id,
        reason: `${nameOf(source)} 的五谷丰登即将对 ${nameOf(player)} 生效，是否使用无懈可击？`
      })) {
        log(`${nameOf(player)} 的五谷丰登取牌被无懈可击抵消。`);
        render();
        await eventPause(520, "important");
        continue;
      }
      let picked;
      if (player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
        picked = await askChoice(`${nameOf(player)} 选择一张五谷牌。`, harvestChoiceOptions(revealed), player);
      } else {
        picked = revealed.slice().sort((a, b) => cardKeepValue(player, b) - cardKeepValue(player, a))[0].id;
      }
      const index = revealed.findIndex((c) => c.id === picked);
      const pickedCard = revealed.splice(index, 1)[0];
      player.hand.push(pickedCard);
      log(`${nameOf(player)} 获得 ${cardName(pickedCard)}。`);
      render();
      await eventPause(320);
    }
    discardCards(revealed);
  }

  function harvestChoiceOptions(cards) {
    return cards.map((card) => ({
      label: cardName(card),
      value: card.id,
      tip: `五谷丰登可选牌\n${cardTooltipText(card)}`
    }));
  }

  async function resolveFireAttack(source, target, card) {
    if (!target?.alive || !target.hand.length) return;
    const revealed = await chooseFireAttackRevealCard(source, target);
    if (!revealed) return;
    log(`${nameOf(target)} 展示 ${cardName(revealed)}。`);
    const sameSuit = source.hand.filter((c) => c.suit === revealed.suit);
    if (!sameSuit.length) {
      log(`${nameOf(source)} 没有 ${revealed.suit} 手牌，火攻未造成伤害。`);
      return;
    }
    const use = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`弃一张 ${revealed.suit} 手牌，对 ${nameOf(target)} 造成火焰伤害？`, true, source)
      : aiShouldPayFireAttack(source, target, revealed, sameSuit);
    if (!use) return;
    const id = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? (await askHumanSelectCards(source, `选择一张 ${revealed.suit} 手牌。`, 1, 1, (c) => c.suit === revealed.suit, false))[0]
      : bestFireAttackDiscard(source, revealed.suit)?.id;
    if (!id) return;
    await discardFromHand(source, [id], "火攻");
    await damage(source, target, 1, DAMAGE.FIRE, card);
  }

  async function chooseFireAttackRevealCard(source, target) {
    if (target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
      const id = (await askHumanSelectCards(target, "火攻：选择一张手牌展示。", 1, 1, () => true, false))[0];
      return findHandCard(target, id) || target.hand[0];
    }
    return bestFireAttackRevealCard(target, source);
  }

  function bestFireAttackRevealCard(target, source, excludeIds = new Set()) {
    if (!target?.hand.length) return null;
    return target.hand
      .slice()
      .sort((a, b) => fireAttackRevealSafety(target, source, b, excludeIds) - fireAttackRevealSafety(target, source, a, excludeIds))[0];
  }

  function estimateFireAttackRevealForScoring(source, target, excludeIds = new Set()) {
    if (!target?.hand.length) return null;
    if (canUseExactHandInfo(source, target)) {
      const revealed = bestFireAttackRevealCard(target, source, excludeIds);
      return {
        suit: revealed?.suit || "",
        discard: bestFireAttackDiscard(source, revealed?.suit, excludeIds),
        hitChance: revealed ? 1 : 0
      };
    }
    const options = SUITS.map((suit) => {
      const discard = bestFireAttackDiscard(source, suit, excludeIds);
      const presence = estimatedSuitPresence(target, suit, source);
      const sourcePain = discard ? cardKeepValue(source, discard) * 0.62 : 3.4;
      return {
        suit,
        discard,
        hitChance: discard ? presence : 0,
        targetSafety: presence * sourcePain
      };
    }).sort((a, b) => b.targetSafety - a.targetSafety);
    return options[0] || null;
  }

  function fireAttackRevealSafety(target, source, card, excludeIds = new Set()) {
    const sourceHostile = attitude(target, source) < 0;
    if (canUseExactHandInfo(target, source)) {
      const sameSuit = source.hand.filter((sourceCard) => sourceCard.suit === card.suit && !excludeIds.has(sourceCard.id));
      const cheapest = sameSuit.slice().sort((a, b) => cardKeepValue(source, a) - cardKeepValue(source, b))[0];
      const noMatchValue = sameSuit.length ? 0 : 3.5;
      const discardCost = cheapest ? cardKeepValue(source, cheapest) * 0.6 : 0;
      return noMatchValue + discardCost + (sourceHostile ? sameSuit.length * -0.28 : sameSuit.length * -0.08);
    }
    const visibleCount = Math.max(0, source.hand.length - [...excludeIds].length);
    const suitPresence = clamp(0.24 + visibleCount * 0.115, 0.28, 0.88);
    const expectedMatches = visibleCount * 0.25;
    const estimatedDiscardCost = 1.25 + Math.min(1.1, visibleCount * 0.08);
    const noMatchValue = (1 - suitPresence) * 3.5;
    const pressure = sourceHostile ? expectedMatches * -0.24 : expectedMatches * -0.07;
    return noMatchValue + suitPresence * estimatedDiscardCost * 0.6 + pressure;
  }

  function bestFireAttackDiscard(source, suit, excludeIds = new Set()) {
    if (!suit) return null;
    return source.hand
      .filter((card) => card.suit === suit && !excludeIds.has(card.id))
      .sort((a, b) => cardKeepValue(source, a) - cardKeepValue(source, b))[0] || null;
  }

  function estimatedSuitPresence(player, suit, observer) {
    if (!player?.hand?.length) return 0;
    if (canUseExactHandInfo(observer, player)) {
      return player.hand.some((card) => cardSuitFor(player, card) === suit) ? 1 : 0;
    }
    return clamp(0.24 + player.hand.length * 0.115, 0.28, 0.88);
  }

  function aiShouldPayFireAttack(source, target, revealed, sameSuit) {
    if (attitude(source, target) >= 0) return false;
    const discard = sameSuit.slice().sort((a, b) => cardKeepValue(source, a) - cardKeepValue(source, b))[0];
    if (!discard) return false;
    const damageValue = 1.1 + (target.hp <= 2 ? 0.65 : 0) + (target.equip.armor?.name === "藤甲" ? 0.65 : 0) + (target.linked ? 0.24 : 0);
    return damageValue > cardKeepValue(source, discard) * 0.34 + source.personality.caution * 0.18 + Math.random() * 0.24;
  }

  async function damage(source, target, amount, nature = DAMAGE.NORMAL, card = null, visited = new Set()) {
    if (!target?.alive || amount <= 0) return;
    if (source?.alive && source.id !== target.id && hasSkill(source, "jueqing")) {
      log(`${nameOf(source)} 的绝情生效，${nameOf(target)} 改为失去 ${amount} 点体力。`);
      updateReadsForDamage(source, target, card);
      await loseHp(target, amount);
      return;
    }
    if (await maybeTianxiang(source, target, amount, nature, card)) return;
    if (target.equip.armor?.name === "白银狮子" && amount > 1) {
      amount = 1;
      log(`${nameOf(target)} 的白银狮子将伤害降为 1。`);
    }
    target.hp -= amount;
    const damageText = source
      ? `${nameOf(source)} 对 ${nameOf(target)} 造成 ${amount} 点${natureLabel(nature)}伤害，${nameOf(target)} 体力 ${Math.max(target.hp, 0)}/${target.maxHp}。`
      : `${nameOf(target)} 受到 ${amount} 点${natureLabel(nature)}伤害，体力 ${Math.max(target.hp, 0)}/${target.maxHp}。`;
    log(damageText);
    noteHumanDamage(source, target, amount);
    await eventPause(740);
    await afterDamaged(source, target, amount, card);
    render();

    if ((nature === DAMAGE.FIRE || nature === DAMAGE.THUNDER) && target.linked && !visited.has(target.id)) {
      visited.add(target.id);
      target.linked = false;
      const linkedTargets = alivePlayers().filter((p) => p.linked && p.id !== target.id);
      for (const linked of linkedTargets) {
        linked.linked = false;
        log(`${nameOf(linked)} 受到铁索传导。`);
        await damage(source, linked, amount, nature, card, visited);
      }
    }

    while (target.alive && target.hp <= 0) {
      const saved = await dying(target, source);
      if (!saved) {
        await killPlayer(target, source);
        return;
      }
      if (isBuquSustaining(target)) break;
    }
    checkVictory();
  }

  async function loseHp(player, amount) {
    player.hp -= amount;
    log(`${nameOf(player)} 失去 ${amount} 点体力。`);
    await maybeShangshi(player);
    while (player.alive && player.hp <= 0) {
      const saved = await dying(player, null);
      if (!saved) {
        await killPlayer(player, null);
        return;
      }
      if (isBuquSustaining(player)) break;
    }
  }

  async function afterDamaged(source, target, amount, card) {
    if (source) updateReadsForDamage(source, target, card);
    if (source && target.alive && hasSkill(target, "jianxiong") && gainDamageCardViaJianxiong(target, card)) {
      log(`${nameOf(target)} 发动奸雄，获得造成伤害的牌。`);
    }
    if (source && target.alive && hasSkill(target, "fankui") && totalCards(source) > 0) {
      await maybeFankui(target, source);
    }
    if (source && target.alive && hasSkill(target, "ganglie")) {
      await maybeGanglie(target, source);
    }
    if (source?.alive && target.alive && hasSkill(target, "enyuan")) {
      await maybeEnyuanPunish(target, source);
    }
    if (target.alive && hasSkill(target, "yiji")) {
      const drawn = drawCards(target, 2 * amount, false);
      log(`${nameOf(target)} 发动遗计，摸 ${2 * amount} 张牌。`);
      await maybeDistributeYijiCards(target, drawn);
    }
    if (target.alive && hasSkill(target, "xinsheng")) {
      for (let i = 0; i < amount; i += 1) {
        grantHuashenSkill(target, "新生");
      }
    }
    if (source?.alive && hasSkill(source, "kuanggu") && distance(source, target) <= 1) {
      const recoverable = Math.min(amount, Math.max(0, source.maxHp - source.hp));
      if (recoverable > 0) {
        heal(source, source, amount, `${nameOf(source)} 发动狂骨，回复 ${recoverable} 点体力。`);
      } else {
        log(`${nameOf(source)} 发动狂骨，但体力已满。`);
      }
    }
    if (target.alive && hasSkill(target, "jieming")) {
      await maybeJieming(target);
    }
    if (target.alive && hasSkill(target, "fangzhu") && target.maxHp > target.hp) {
      await maybeFangzhu(target);
    }
    if (source?.alive && card?.subtype === "slash") {
      await triggerBeige(source, target);
    }
    await maybeShangshi(target);
    await maybeBaonue(source);
  }

  async function maybeEnyuanPunish(target, source) {
    const hearts = source.hand.filter((card) => card.suit === "♥");
    let give = false;
    if (hearts.length) {
      give = humanControls(source)
        ? await askYesNo(`恩怨：是否交给 ${nameOf(target)} 一张红桃手牌？否则失去 1 点体力。`, true, source)
        : (source.hp <= 1 || cardKeepValue(source, hearts.slice().sort((a, b) => cardKeepValue(source, a) - cardKeepValue(source, b))[0]) <= 3.2 || attitude(source, target) > 0);
    }
    if (give && hearts.length) {
      const id = humanControls(source)
        ? (await askHumanSelectCards(source, "恩怨：选择一张红桃手牌交给对方。", 1, 1, (card) => card.suit === "♥", false))[0]
        : hearts.slice().sort((a, b) => cardKeepValue(source, a) - cardKeepValue(source, b))[0].id;
      const moved = removeHandCards(source, [id]);
      if (moved.length) {
        target.hand.push(...moved);
        noteCardsGained(target, moved.length);
        log(`${nameOf(source)} 因恩怨交给 ${nameOf(target)} ${cardName(moved[0])}。`);
        await afterLoseHand(source, { lostHand: true, lostCard: true });
        return true;
      }
    }
    log(`${nameOf(source)} 未交出红桃手牌，因 ${nameOf(target)} 的恩怨失去 1 点体力。`);
    await loseHp(source, 1);
    return true;
  }

  async function maybeFankui(target, source) {
    if (!target?.alive || !source?.alive || totalCards(source) <= 0) return false;
    const shouldUse = humanControls(target)
      ? await askYesNo(`${nameOf(target)} 是否发动反馈，获得 ${nameOf(source)} 的一张牌？`, true, target)
      : attitude(target, source) < 0.5;
    if (!shouldUse) return false;
    const gained = await resolveStealCard(target, source, "反馈");
    if (!gained) return false;
    log(`${nameOf(target)} 发动反馈。`);
    return true;
  }

  async function maybeGanglie(target, source) {
    if (!target?.alive || !source?.alive) return false;
    const shouldUse = humanControls(target)
      ? await askYesNo(`${nameOf(target)} 是否发动刚烈？`, attitude(target, source) < 0.35, target)
      : attitude(target, source) < 0.35;
    if (!shouldUse) return false;
    const judge = await judgeCard(target, "刚烈");
    if (judge.suit === "♥") {
      log(`${nameOf(target)} 的刚烈判定为红桃，未触发。`);
      return false;
    }
    let discardForGanglie = false;
    if (source.hand.length >= 2) {
      discardForGanglie = humanControls(source)
        ? await askChoice("刚烈：弃两张手牌，还是受到 1 点伤害？", [
          { label: "弃两张手牌", value: true },
          { label: "受到伤害", value: false, danger: true }
        ], source)
        : aiShouldDiscardForGanglie(source, target);
    }
    if (discardForGanglie) {
      const ids = humanControls(source)
        ? await askHumanSelectCards(source, "刚烈：选择两张手牌弃置。", 2, 2, () => true, false)
        : chooseGanglieDiscardIds(source);
      if (ids.length >= 2) {
        await discardFromHand(source, ids, "刚烈");
        log(`${nameOf(source)} 弃两张手牌响应刚烈。`);
        return true;
      }
    }
    await damage(target, source, 1, DAMAGE.NORMAL, { name: "刚烈" });
    return true;
  }

  function aiShouldDiscardForGanglie(source, target) {
    if (!source?.hand || source.hand.length < 2) return false;
    const discardCost = chooseDiscardCards(source, 2).reduce((sum, card) => sum + cardKeepValue(source, card), 0);
    const damageCost = 2.7 + (source.hp <= 1 ? 8 : 0) + (source.hp <= 2 ? 2 : 0) + (attitude(source, target) < 0 ? 0.35 : 0);
    return discardCost <= damageCost;
  }

  function chooseGanglieDiscardIds(source) {
    return chooseDiscardCards(source, 2).map((card) => card.id);
  }

  async function dying(target, source) {
    if (hasSkill(target, "niepan") && !target.flags.niepanUsed) {
      const use = target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askYesNo("是否发动涅槃？", true, target)
        : true;
      if (use) {
        target.flags.niepanUsed = true;
        const discarded = [
          ...target.hand.splice(0),
          ...removeAllEquipCards(target),
          ...target.judgeArea.splice(0)
        ];
        discardCards(discarded);
        target.linked = false;
        target.drunk = false;
        target.hp = Math.min(3, target.maxHp);
        drawCards(target, 3);
        log(`${nameOf(target)} 发动涅槃${discarded.length ? `，弃置所有牌${discardedCardListSuffix(discarded)}` : ""}，回复至 ${target.hp} 点体力并摸三张牌。`);
        await eventPause(900, "important");
        return true;
      }
    }
    if (hasSkill(target, "buqu")) {
      const card = drawFromDeck(1)[0];
      target.buquPile.push(card);
      const ranks = target.buquPile.map((c) => c.rank);
      const unique = new Set(ranks).size === ranks.length;
      log(`${nameOf(target)} 发动不屈，亮出 ${cardName(card)}，${unique ? "点数不重复，暂不死亡" : "点数重复，不屈失败"}。`);
      if (unique) {
        target.hp = 0;
        await eventPause(900, "important");
        return true;
      }
    }
    log(`${nameOf(target)} 濒死${source ? `，来源 ${nameOf(source)}` : ""}，需要 ${1 - target.hp} 个桃或可用的自救牌。`);
    await eventPause(960, "important");
    if (await tryBuyiRescue(target, source)) {
      log(`${nameOf(target)} 脱离濒死。`);
      await eventPause(760, "important");
      return true;
    }
    const wanshaHolder = state.players[state.current];
    const savers = aliveFrom(target.id).filter((saver) => {
      if (!hasSkill(wanshaHolder, "wansha")) return true;
      return saver.id === target.id || saver.id === wanshaHolder.id;
    });
    if (hasSkill(wanshaHolder, "wansha")) log(`${nameOf(wanshaHolder)} 的完杀生效。`);
    for (const saver of savers) {
      while (target.hp <= 0) {
        const rescue = await askForPeach(saver, target, source);
        if (!rescue) break;
        await eventPause(820, "important");
        const healed = heal(saver, target, rescue.amount);
        if (rescue.jiuyuan && healed > 1) log(`${nameOf(target)} 发动救援，额外回复 1 点体力。`);
        if (target.hp > 0) {
          log(`${nameOf(target)} 脱离濒死。`);
          await eventPause(860, "important");
          return true;
        }
      }
    }
    return target.hp > 0;
  }

  async function tryBuyiRescue(target, source) {
    if (!target?.alive || !target.hand.length || target.hp > 0) return false;
    const holders = aliveFrom(target.id).filter((player) => hasSkill(player, "buyi"));
    for (const holder of holders) {
      if (!holder.alive || !target.alive || !target.hand.length || target.hp > 0) break;
      const use = humanControls(holder)
        ? await askYesNo(`补益：是否展示 ${nameOf(target)} 的一张手牌尝试救援？`, attitude(holder, target) > 0, holder)
        : attitude(holder, target) > 0 || holder.id === target.id || target.role === "主公";
      if (!use) continue;
      const index = await chooseBuyiCardIndex(holder, target);
      const card = target.hand[index];
      if (!card) continue;
      log(`${nameOf(holder)} 发动补益，展示 ${nameOf(target)} 的 ${cardName(card)}。`);
      if (card.type === "basic") {
        log(`${cardName(card)} 是基本牌，补益未能回复体力。`);
        continue;
      }
      const removed = target.hand.splice(index, 1)[0];
      discardCards([removed]);
      log(`${nameOf(target)} 因补益弃置 ${cardName(removed)}。`);
      await afterLoseHand(target, { lostHand: true, lostCard: true });
      heal(holder, target, 1, `${nameOf(holder)} 的补益令 ${nameOf(target)} 回复 1 点体力。`);
    }
    return target.hp > 0;
  }

  async function chooseBuyiCardIndex(holder, target) {
    if (!target?.hand?.length) return 0;
    if (humanControls(holder)) {
      const choice = await askChoice(`补益：选择 ${nameOf(target)} 的一张手牌展示。`, target.hand.map((card, index) => ({
        label: `手牌 ${index + 1}`,
        value: index,
        tip: `补益展示牌\n若展示牌不是基本牌，将弃置并回复 1 点体力。`
      })), holder);
      return Math.max(0, Math.min(target.hand.length - 1, choice ?? 0));
    }
    if (canUseExactHandInfo(holder, target)) {
      const nonBasic = target.hand.map((card, index) => ({ card, index })).find((item) => item.card.type !== "basic");
      if (nonBasic) return nonBasic.index;
    }
    return Math.floor(Math.random() * target.hand.length);
  }

  function isBuquSustaining(player) {
    if (!player?.alive || !hasSkill(player, "buqu") || player.hp > 0 || !player.buquPile?.length) return false;
    const ranks = player.buquPile.map((card) => card.rank);
    return new Set(ranks).size === ranks.length;
  }

  async function askForPeach(saver, target, source) {
    if (!saver.alive) return false;
    const options = responseOptions(saver, "peach", { dying: target });
    if (!options.length) {
      noteResponse(saver, "peach", false);
      return false;
    }
    if (saver.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
      const used = await askHumanUseResponse(saver, "peach", { dying: target, source, options, reason: `${nameOf(target)} 濒死，是否出桃？` });
      noteResponse(saver, "peach", Boolean(used));
      if (used) await eventPause(820, "important");
      return used ? peachRescueResult(saver, target) : null;
    }
    const shouldSave = aiShouldSave(saver, target, source);
    if (!shouldSave) {
      noteResponse(saver, "peach", false);
      return false;
    }
    const option = chooseResponseOption(saver, options);
    await consumeResponseOption(saver, option, responseOptionKindLabel(option, "桃"), "使用", { dying: target, source });
    noteResponse(saver, "peach", true);
    await eventPause(820, "important");
    return peachRescueResult(saver, target);
  }

  function peachRescueResult(saver, target) {
    const jiuyuan = Boolean(target?.alive && canActAsLordSkillOwner(target, "jiuyuan") && saver?.id !== target.id && saver?.general.kingdom === "吴");
    return { amount: jiuyuan ? 2 : 1, jiuyuan };
  }

  async function killPlayer(target, source) {
    noteHumanDeath(target, source);
    target.alive = false;
    target.revealed = true;
    recordDeathReveal(target, source);
    const remainingCards = [
      ...target.hand.splice(0),
      ...removeAllEquipCards(target),
      ...target.judgeArea.splice(0)
    ];
    const xingshangHolder = alivePlayers().find((p) => p.id !== target.id && hasSkill(p, "xingshang"));
    if (xingshangHolder && remainingCards.length) {
      xingshangHolder.hand.push(...remainingCards);
      log(`${nameOf(xingshangHolder)} 发动行殇，获得 ${nameOf(target)} 的牌。`);
    } else {
      discardCards(remainingCards);
    }
    log(source?.alive
      ? `${nameOf(target)} 被 ${nameOf(source)} 击杀，身份为 ${target.role}。`
      : `${nameOf(target)} 阵亡，身份为 ${target.role}。`);
    await maybeZhuiyi(target, source);
    if (source?.alive && hasSkill(target, "duanchang")) {
      source.disabledSkills = Array.from(new Set([...source.disabledSkills, ...source.general.skills, ...source.extraSkills, ...source.tempSkills]));
      log(`${nameOf(target)} 发动断肠，${nameOf(source)} 失去所有武将技能。`);
    }
    if (source?.alive && target.role === "反贼") {
      drawCards(source, 3, false);
      log(`${nameOf(source)} 击杀反贼，摸三张牌。`);
    }
    if (source?.alive && source.role === "主公" && target.role === "忠臣") {
      const lostHandCount = source.hand.length;
      const lostEquipCount = countEquip(source);
      const penaltyCards = [
        ...source.hand.splice(0),
        ...removeAllEquipCards(source)
      ];
      discardCards(penaltyCards);
      log(`${nameOf(source)} 误杀忠臣，弃置所有牌${discardedCardListSuffix(penaltyCards)}。`);
      await afterLoseHand(source, { lostHand: lostHandCount > 0, lostCard: lostHandCount > 0 || lostEquipCount > 0 });
    }
    checkVictory();
    render();
  }

  async function maybeZhuiyi(target, source) {
    if (!hasSkill(target, "zhuiyi")) return false;
    const candidates = alivePlayers().filter((player) => player.id !== target.id && player.id !== source?.id);
    if (!candidates.length) return false;
    const use = humanControls(target)
      ? await askYesNo("追忆：是否令一名非杀死你的其他角色摸三张牌并回复 1 点体力？", true, target)
      : true;
    if (!use) return false;
    const recipient = humanControls(target)
      ? await askHumanTarget("追忆：选择受益角色。", candidates, target)
      : candidates.slice().sort((a, b) => supportRelationshipScore(target, b, "gift") - supportRelationshipScore(target, a, "gift"))[0];
    if (!recipient) return false;
    drawCards(recipient, 3);
    const healed = heal(null, recipient, 1, `${nameOf(target)} 的追忆令 ${nameOf(recipient)} 回复 1 点体力。`);
    log(`${nameOf(target)} 发动追忆，令 ${nameOf(recipient)} 摸三张牌${healed ? "并回复体力" : ""}。`);
    return true;
  }

  function recordDeathReveal(target, source) {
    if (!target) return;
    state.players.forEach((observer) => {
      if (!state.reads[observer.id]) return;
      state.reads[observer.id][target.id] = publicRoleReadValue(target.role);
      state.readReasons[observer.id][target.id] = [`身份已公开：${target.role}`];
    });
    if (!source?.alive || source.id === target.id) return;
    if (target.role === "反贼") {
      bumpAllReads(source.id, -0.75, `${nameOf(source)} 击杀公开反贼 ${nameOf(target)}`);
    } else if (target.role === "忠臣" || target.role === "主公") {
      bumpAllReads(source.id, 0.82, `${nameOf(source)} 击杀公开${target.role} ${nameOf(target)}`);
    }
  }

  function publicRoleReadValue(role) {
    if (role === "反贼") return 2.2;
    if (role === "忠臣" || role === "主公") return -2.2;
    return 0;
  }

  function checkVictory() {
    const alive = alivePlayers();
    const master = state.players.find((p) => p.role === "主公");
    if (!master) return;
    if (!master.alive) {
      const traitorAlive = alive.length === 1 && alive[0].role === "内奸";
      finishGame(traitorAlive ? "内奸获胜" : "反贼获胜");
      return;
    }
    const enemies = alive.filter((p) => p.role === "反贼" || p.role === "内奸");
    if (!enemies.length) finishGame("主忠方获胜");
  }

  function createEmptyCareer() {
    return {
      version: 3,
      totalGames: 0,
      wins: 0,
      losses: 0,
      currentWinStreak: 0,
      bestWinStreak: 0,
      survivedGames: 0,
      longestGameRound: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      totalKills: 0,
      totalDeaths: 0,
      totalCardsUsed: 0,
      totalSkillsUsed: 0,
      bestDamageDealt: 0,
      bestKills: 0,
      roleStats: {},
      generalStats: {},
      modeStats: {},
      lastGames: []
    };
  }

  function createEmptyRunStats() {
    return {
      damageDealt: 0,
      damageTaken: 0,
      kills: 0,
      deaths: 0,
      cardsUsed: 0,
      skillsUsed: 0
    };
  }

  function noteHumanCardUse(player, count = 1) {
    if (!player?.isHuman || !state.runStats) return;
    state.runStats.cardsUsed += Math.max(0, Number(count) || 0);
  }

  function noteHumanSkillUse(player, count = 1) {
    if (!player?.isHuman || !state.runStats) return;
    state.runStats.skillsUsed += Math.max(0, Number(count) || 0);
  }

  function noteHumanDamage(source, target, amount) {
    if (!state.runStats || amount <= 0) return;
    if (source?.isHuman && source.id !== target?.id) state.runStats.damageDealt += amount;
    if (target?.isHuman) state.runStats.damageTaken += amount;
  }

  function noteHumanDeath(target, source) {
    if (!state.runStats || !target) return;
    if (source?.isHuman && source.id !== target.id) state.runStats.kills += 1;
    if (target.isHuman) state.runStats.deaths += 1;
  }

  function loadCareerStats() {
    if (typeof localStorage === "undefined") return createEmptyCareer();
    try {
      return normalizeCareerStats(JSON.parse(localStorage.getItem(CAREER_STORAGE_KEY) || "null"));
    } catch {
      return createEmptyCareer();
    }
  }

  function saveCareerStats(stats) {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(CAREER_STORAGE_KEY, JSON.stringify(normalizeCareerStats(stats)));
    } catch {
      // Local storage can be unavailable in private or restricted browser contexts.
    }
  }

  function serializeCareerStats(stats = state.career) {
    return JSON.stringify({
      kind: "sanguosha-singleplayer-career",
      exportedAt: new Date().toISOString(),
      career: normalizeCareerStats(stats)
    }, null, 2);
  }

  function importCareerStatsFromText(text) {
    const parsed = JSON.parse(String(text || ""));
    const imported = parsed?.career || parsed;
    const stats = normalizeCareerStats(imported);
    state.career = stats;
    state.careerNotice = "生涯存档已导入。";
    saveCareerStats(stats);
    renderSetupCareer();
    renderCareer();
    return stats;
  }

  function exportCareerStats() {
    const blob = new Blob([serializeCareerStats()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sanguosha-career-${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    state.careerNotice = "已导出生涯存档。";
    renderSetupCareer();
    renderCareer();
  }

  function resetCareerStats() {
    if (!confirm("确定清空本机生涯档案吗？这个操作不会影响当前牌局。")) return;
    state.career = createEmptyCareer();
    state.careerNotice = "本机生涯档案已清空。";
    saveCareerStats(state.career);
    renderSetupCareer();
    renderCareer();
  }

  function handleCareerActionClick(event) {
    const button = event.target.closest("[data-career-action]");
    if (!button) return;
    const action = button.dataset.careerAction;
    if (action === "export") exportCareerStats();
    if (action === "import") $("careerImportFile")?.click();
    if (action === "reset") resetCareerStats();
  }

  async function handleCareerImportFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      importCareerStatsFromText(await file.text());
    } catch {
      state.careerNotice = "导入失败：请选择有效的生涯存档 JSON。";
      renderSetupCareer();
      renderCareer();
    } finally {
      event.target.value = "";
    }
  }

  function normalizeCareerBucket(bucket, fallbackLabel = "") {
    const source = bucket && typeof bucket === "object" ? bucket : {};
    const games = Number(source.games) || 0;
    const wins = Number(source.wins) || 0;
    return {
      label: source.label || fallbackLabel,
      games,
      wins,
      losses: Number(source.losses) || Math.max(0, games - wins),
      survived: Number(source.survived) || 0,
      damageDealt: Number(source.damageDealt) || 0,
      damageTaken: Number(source.damageTaken) || 0,
      kills: Number(source.kills) || 0,
      deaths: Number(source.deaths) || 0,
      cardsUsed: Number(source.cardsUsed) || 0,
      skillsUsed: Number(source.skillsUsed) || 0
    };
  }

  function normalizeCareerGroup(group) {
    if (!group || typeof group !== "object") return {};
    return Object.fromEntries(Object.entries(group).map(([key, bucket]) => [key, normalizeCareerBucket(bucket, key)]));
  }

  function normalizeCareerStats(input) {
    const stats = input && typeof input === "object" ? input : createEmptyCareer();
    return {
      version: 3,
      totalGames: Number(stats.totalGames) || 0,
      wins: Number(stats.wins) || 0,
      losses: Number(stats.losses) || 0,
      currentWinStreak: Number(stats.currentWinStreak) || 0,
      bestWinStreak: Number(stats.bestWinStreak) || 0,
      survivedGames: Number(stats.survivedGames) || 0,
      longestGameRound: Number(stats.longestGameRound) || 0,
      totalDamageDealt: Number(stats.totalDamageDealt) || 0,
      totalDamageTaken: Number(stats.totalDamageTaken) || 0,
      totalKills: Number(stats.totalKills) || 0,
      totalDeaths: Number(stats.totalDeaths) || 0,
      totalCardsUsed: Number(stats.totalCardsUsed) || 0,
      totalSkillsUsed: Number(stats.totalSkillsUsed) || 0,
      bestDamageDealt: Number(stats.bestDamageDealt) || 0,
      bestKills: Number(stats.bestKills) || 0,
      roleStats: normalizeCareerGroup(stats.roleStats),
      generalStats: normalizeCareerGroup(stats.generalStats),
      modeStats: normalizeCareerGroup(stats.modeStats),
      lastGames: Array.isArray(stats.lastGames) ? stats.lastGames.slice(0, 30) : []
    };
  }

  function careerBucket(stats, group, key, label = key) {
    if (!stats[group]) stats[group] = {};
    if (!stats[group][key]) {
      stats[group][key] = { label, games: 0, wins: 0, losses: 0 };
    }
    if (label && !stats[group][key].label) stats[group][key].label = label;
    return stats[group][key];
  }

  function recordCareerBucket(bucket, won, survived = false) {
    const metrics = careerRunMetrics();
    if (!Number.isFinite(bucket.survived)) bucket.survived = 0;
    bucket.games += 1;
    if (won) bucket.wins += 1;
    else bucket.losses += 1;
    if (survived) bucket.survived += 1;
    addCareerMetrics(bucket, metrics);
  }

  function addCareerMetrics(target, metrics) {
    target.damageDealt = (Number(target.damageDealt) || 0) + (metrics.damageDealt || 0);
    target.damageTaken = (Number(target.damageTaken) || 0) + (metrics.damageTaken || 0);
    target.kills = (Number(target.kills) || 0) + (metrics.kills || 0);
    target.deaths = (Number(target.deaths) || 0) + (metrics.deaths || 0);
    target.cardsUsed = (Number(target.cardsUsed) || 0) + (metrics.cardsUsed || 0);
    target.skillsUsed = (Number(target.skillsUsed) || 0) + (metrics.skillsUsed || 0);
  }

  function careerRunMetrics() {
    return { ...createEmptyRunStats(), ...(state.runStats || {}) };
  }

  function humanWonResult(resultText, human) {
    if (!human) return false;
    if (resultText.includes("反贼获胜")) return human.role === "反贼";
    if (resultText.includes("主忠方获胜")) return human.role === "主公" || human.role === "忠臣";
    if (resultText.includes("内奸获胜")) return human.role === "内奸";
    return false;
  }

  function recordGameResult(resultText) {
    if (state.gameRecorded) return state.career;
    const human = state.players[0];
    if (!human) return state.career;
    const won = humanWonResult(resultText, human);
    const stats = normalizeCareerStats(state.career);
    const survived = Boolean(human.alive);
    const durationSec = Math.max(0, Math.round((Date.now() - (state.gameStartedAt || Date.now())) / 1000));
    const metrics = careerRunMetrics();
    stats.totalGames += 1;
    if (won) {
      stats.wins += 1;
      stats.currentWinStreak += 1;
      stats.bestWinStreak = Math.max(stats.bestWinStreak, stats.currentWinStreak);
    } else {
      stats.losses += 1;
      stats.currentWinStreak = 0;
    }
    if (survived) stats.survivedGames += 1;
    stats.longestGameRound = Math.max(stats.longestGameRound || 0, Number(state.round) || 0);
    stats.totalDamageDealt += metrics.damageDealt;
    stats.totalDamageTaken += metrics.damageTaken;
    stats.totalKills += metrics.kills;
    stats.totalDeaths += metrics.deaths;
    stats.totalCardsUsed += metrics.cardsUsed;
    stats.totalSkillsUsed += metrics.skillsUsed;
    stats.bestDamageDealt = Math.max(stats.bestDamageDealt || 0, metrics.damageDealt);
    stats.bestKills = Math.max(stats.bestKills || 0, metrics.kills);
    recordCareerBucket(careerBucket(stats, "roleStats", human.role, human.role), won, survived);
    recordCareerBucket(careerBucket(stats, "generalStats", human.general.id, human.general.name), won, survived);
    recordCareerBucket(careerBucket(stats, "modeStats", state.mode, `${state.mode}人局`), won, survived);
    stats.lastGames.unshift({
      at: Date.now(),
      mode: state.mode,
      role: human.role,
      generalId: human.general.id,
      generalName: human.general.name,
      result: resultText,
      won,
      survived,
      round: state.round,
      durationSec,
      aliveCount: alivePlayers().length,
      damageDealt: metrics.damageDealt,
      damageTaken: metrics.damageTaken,
      kills: metrics.kills,
      deaths: metrics.deaths,
      cardsUsed: metrics.cardsUsed,
      skillsUsed: metrics.skillsUsed
    });
    stats.lastGames = stats.lastGames.slice(0, 30);
    state.career = stats;
    state.gameRecorded = true;
    saveCareerStats(stats);
    renderSetupCareer();
    return stats;
  }

  function finishGame(text) {
    if (state.gameOver) return;
    recordGameResult(text);
    clearSavedMatch();
    state.gameOver = true;
    state.players.forEach((p) => p.revealed = true);
    state.infoTab = "career";
    state.sidePanelCollapsed = false;
    state.logCollapsed = false;
    state.endGameModalOpen = true;
    markStatus("对局结束", null, text);
    log(`游戏结束：${text}。`);
    setWait("对局结束", `游戏结束：${text}`, 0, text);
    state.pending = {
      prompt: `游戏结束：${text}`,
      ownerId: 0,
      options: [{
        label: "再开一局",
        value: "new",
        danger: false,
        onChoose: () => $("newGame")?.click()
      }]
    };
    render();
  }

  async function askForResponse(player, kind, context) {
    if (!player?.alive) return false;
    if (kind === "dodge" && (player.equip.armor?.name === "八卦阵" || (hasSkill(player, "bazhen") && !player.equip.armor))) {
      const judge = await judgeCard(player, "八卦阵");
      if (isRed(judge)) {
        log(`${nameOf(player)} 的${player.equip.armor?.name === "八卦阵" ? "八卦阵" : "八阵"}判定为红色，视为出闪。`);
        await eventPause(420);
        if (hasSkill(player, "leiji")) await triggerLeiji(player, context.source);
        return true;
      }
    }

    const options = responseOptions(player, kind, context);
    if (!options.length) {
      if (kind === "slash") {
        const jijiang = await askForJijiangSlash(player, context);
        if (jijiang) {
          noteResponse(player, kind, true);
          await eventPause(420);
          return true;
        }
      }
      if (kind === "dodge") {
        const hujia = await askForHujiaDodge(player, context);
        if (hujia) {
          noteResponse(player, kind, true);
          await eventPause(420);
          return true;
        }
      }
      noteResponse(player, kind, false);
      logNoResponse(player, kind, context);
      await eventPause(420);
      return false;
    }
    if (player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
      const used = await askHumanUseResponse(player, kind, { ...context, options });
      noteResponse(player, kind, Boolean(used));
      if (!used) logNoResponse(player, kind, context);
      await eventPause(used ? 420 : 380);
      if (used && kind === "dodge" && hasSkill(player, "leiji")) await triggerLeiji(player, context.source);
      return Boolean(used);
    }
    const use = aiShouldRespond(player, kind, context);
    if (!use) {
      if (kind === "slash") {
        const jijiang = await askForJijiangSlash(player, context);
        if (jijiang) {
          noteResponse(player, kind, true);
          await eventPause(420);
          return true;
        }
      }
      if (kind === "dodge") {
        const hujia = await askForHujiaDodge(player, context);
        if (hujia) {
          noteResponse(player, kind, true);
          await eventPause(420);
          return true;
        }
      }
      noteResponse(player, kind, false);
      logNoResponse(player, kind, context);
      await eventPause(380);
      return false;
    }
    const consumed = await consumeResponseOption(player, chooseResponseOption(player, options), responseLabel(kind), "打出", context);
    noteResponse(player, kind, Boolean(consumed));
    await eventPause(420);
    if (!consumed) {
      logNoResponse(player, kind, context);
      return false;
    }
    if (kind === "dodge" && hasSkill(player, "leiji")) await triggerLeiji(player, context.source);
    return true;
  }

  function responseOptions(player, kind, context = {}) {
    const options = [];
    player.hand.forEach((card) => {
      if (kind === "slash" && card.subtype === "slash") options.push({ cardId: card.id, label: cardName(card) });
      if (kind === "dodge" && card.subtype === "dodge") options.push({ cardId: card.id, label: cardName(card) });
      if (kind === "peach" && card.subtype === "peach") options.push({ cardId: card.id, label: cardName(card) });
      if (kind === "nullify" && card.subtype === "nullify") options.push({ cardId: card.id, label: cardName(card) });
      if (kind === "peach" && context.dying?.id === player.id && card.subtype === "wine") options.push({ cardId: card.id, label: `酒自救：${cardName(card)}` });
      if (kind === "peach" && context.dying?.id === player.id && hasSkill(player, "jiuchi") && card.suit === "♠" && card.subtype !== "wine") options.push({ cardId: card.id, label: `酒池：${cardName(card)}当酒`, virtualSkill: "jiuchi" });
      if (kind === "slash" && hasSkill(player, "longdan") && card.subtype === "dodge") options.push({ cardId: card.id, label: `龙胆：${cardName(card)}当杀`, virtualSkill: "longdan" });
      if (kind === "dodge" && hasSkill(player, "longdan") && card.subtype === "slash") options.push({ cardId: card.id, label: `龙胆：${cardName(card)}当闪`, virtualSkill: "longdan" });
      if (kind === "dodge" && hasSkill(player, "qingguo") && isBlack(card)) options.push({ cardId: card.id, label: `倾国：${cardName(card)}当闪`, virtualSkill: "qingguo" });
      if (kind === "peach" && hasSkill(player, "jijiu") && isRed(card) && !isCurrentTurn(player)) options.push({ cardId: card.id, label: `急救：${cardName(card)}当桃`, virtualSkill: "jijiu" });
      if (kind === "nullify" && hasSkill(player, "kanpo") && isBlackFor(player, card)) options.push({ cardId: card.id, label: `看破：${cardName(card)}当无懈`, virtualSkill: "kanpo" });
      if (hasSkill(player, "guhuo")) {
        guhuoResponseSpecs(kind, context).forEach((spec) => {
          options.push({ cardId: card.id, label: `蛊惑：${spec.name}`, virtualSkill: "guhuo", guhuoSpec: spec });
        });
      }
    });
    return options;
  }

  function guhuoResponseSpecs(kind, context = {}) {
    const names = [];
    if (kind === "slash") names.push("杀", "火杀", "雷杀");
    if (kind === "dodge") names.push("闪");
    if (kind === "peach") {
      names.push("桃");
      if (context.dying) names.push("酒");
    }
    if (kind === "nullify") names.push("无懈可击");
    return names.map((name) => CARD_POOL.find((spec) => spec.name === name)).filter(Boolean);
  }

  function canUseJijiang(player) {
    return canActAsLordSkillOwner(player, "jijiang");
  }

  function jijiangProviderCandidates(lord, context = {}) {
    if (!canUseJijiang(lord)) return [];
    return aliveFrom(lord.id)
      .filter((provider) => provider.id !== lord.id && provider.general.kingdom === "蜀")
      .map((provider) => {
        const options = responseOptions(provider, "slash", { ...context, jijiangLord: lord });
        const option = chooseResponseOption(provider, options);
        return { provider, options, option, score: option ? jijiangProviderScore(provider, lord, context, option) : -Infinity };
      })
      .filter((entry) => entry.option);
  }

  function hasJijiangSlashProvider(lord, context = {}) {
    return jijiangProviderCandidates(lord, context).length > 0;
  }

  function aiShouldAskJijiang(lord, context = {}, providers = []) {
    if (!providers.length) return false;
    if (context.activeUse && context.target) return attitude(lord, context.target) < -0.18;
    if (context.source) return aiShouldRespond(lord, "slash", context) || attitude(lord, context.source) < 0.85 || lord.hp <= 2;
    return true;
  }

  function jijiangProviderScore(provider, lord, context = {}, option = null) {
    const card = option ? findHandCard(provider, option.cardId) : null;
    let score = attitude(provider, lord) * 0.72 + supportTeamworkScore(provider, lord, "support") * 0.42;
    if (context.source) score += Math.max(0, -attitude(provider, context.source)) * 0.22;
    if (context.target) score += Math.max(0, -attitude(provider, context.target)) * 0.28;
    if (isPublicLordTo(provider, lord) && (provider.role === "忠臣" || provider.role === "主公")) score += 0.62;
    if (isPublicLordTo(provider, lord) && provider.role === "反贼") score -= 1.05;
    score += provider.personality.loyalty * 0.16;
    score -= cardKeepValue(provider, card) * 0.13;
    return score;
  }

  async function askForJijiangSlash(lord, context = {}) {
    if (!canUseJijiang(lord)) return null;
    const candidates = jijiangProviderCandidates(lord, context).sort((a, b) => b.score - a.score);
    if (!candidates.length) return null;
    const shouldAsk = humanControls(lord)
      ? await askYesNo("是否发动激将，令蜀势力角色代为打出杀？", true, lord)
      : aiShouldAskJijiang(lord, context, candidates);
    if (!shouldAsk) return null;

    for (const entry of candidates) {
      const { provider, options, option, score } = entry;
      if (!option) continue;
      if (!humanControls(provider) && score < -0.12) continue;
      log(`${nameOf(lord)} 发动激将，请 ${nameOf(provider)} 代为打出杀。`);
      if (humanControls(provider)) {
        const used = await askHumanUseResponse(provider, "slash", {
          ...context,
          options,
          reason: `${nameOf(lord)} 发动激将，需要你打出杀。`
        });
        noteResponse(provider, "slash", Boolean(used));
        if (used) return { provider, card: null };
        continue;
      }
      const card = await consumeResponseOption(provider, option, "杀", "打出", { source: lord, reason: "激将" });
      if (card) {
        noteResponse(provider, "slash", true);
        return { provider, card };
      }
    }
    return null;
  }

  function canUseHujia(player) {
    return canActAsLordSkillOwner(player, "hujia");
  }

  function hujiaProviderCandidates(lord, context = {}) {
    if (!canUseHujia(lord)) return [];
    return aliveFrom(lord.id)
      .filter((provider) => provider.id !== lord.id && provider.general.kingdom === "魏")
      .map((provider) => {
        const options = responseOptions(provider, "dodge", { ...context, hujiaLord: lord });
        const option = chooseResponseOption(provider, options);
        return { provider, options, option, score: option ? hujiaProviderScore(provider, lord, context, option) : -Infinity };
      })
      .filter((entry) => entry.option);
  }

  function aiShouldAskHujia(lord, context = {}, providers = []) {
    if (!providers.length) return false;
    if (context.source) return aiShouldRespond(lord, "dodge", context) || attitude(lord, context.source) < 0.85 || lord.hp <= 2;
    return true;
  }

  function hujiaProviderScore(provider, lord, context = {}, option = null) {
    const card = option ? findHandCard(provider, option.cardId) : null;
    let score = attitude(provider, lord) * 0.78 + supportTeamworkScore(provider, lord, "support") * 0.44;
    if (context.source) score += Math.max(0, -attitude(provider, context.source)) * 0.18;
    if (isPublicLordTo(provider, lord) && (provider.role === "忠臣" || provider.role === "主公")) score += 0.68;
    if (isPublicLordTo(provider, lord) && provider.role === "反贼") score -= 1.12;
    score += provider.personality.loyalty * 0.18;
    score -= cardKeepValue(provider, card) * 0.15;
    return score;
  }

  async function askForHujiaDodge(lord, context = {}) {
    if (!canUseHujia(lord)) return null;
    const candidates = hujiaProviderCandidates(lord, context).sort((a, b) => b.score - a.score);
    if (!candidates.length) return null;
    const shouldAsk = humanControls(lord)
      ? await askYesNo("是否发动护驾，令魏势力角色代为打出闪？", true, lord)
      : aiShouldAskHujia(lord, context, candidates);
    if (!shouldAsk) return null;

    for (const entry of candidates) {
      const { provider, options, option, score } = entry;
      if (!option) continue;
      if (!humanControls(provider) && score < -0.12) continue;
      log(`${nameOf(lord)} 发动护驾，请 ${nameOf(provider)} 代为打出闪。`);
      if (humanControls(provider)) {
        const used = await askHumanUseResponse(provider, "dodge", {
          ...context,
          options,
          reason: `${nameOf(lord)} 发动护驾，需要你打出闪。`
        });
        noteResponse(provider, "dodge", Boolean(used));
        if (used) {
          if (hasSkill(provider, "leiji")) await triggerLeiji(provider, context.source);
          return { provider, card: null };
        }
        continue;
      }
      const card = await consumeResponseOption(provider, option, "闪", "打出", { source: lord, reason: "护驾" });
      if (card) {
        noteResponse(provider, "dodge", true);
        if (hasSkill(provider, "leiji")) await triggerLeiji(provider, context.source);
        return { provider, card };
      }
    }
    return null;
  }

  async function askHumanUseResponse(player, kind, context) {
    return new Promise((resolve) => {
      const label = responseLabel(kind);
      setWait("响应窗口", context.reason || `${nameOf(player)} 需要打出${label}。`, player.id, `${context.options.length} 个可用响应`);
      state.pending = {
        prompt: context.reason || `${nameOf(player)} 需要打出${label}。`,
        ownerId: player.id,
        options: [
          ...context.options.map((option) => ({
            label: option.label,
            value: option,
            onChoose: async () => {
              state.pending = null;
              clearWait();
              const consumed = await consumeResponseOption(player, option, responseOptionKindLabel(option, label), "打出", context);
              resolve(Boolean(consumed));
            }
          })),
          {
            label: `不出${label}`,
            value: null,
            danger: true,
            onChoose: () => {
              state.pending = null;
              clearWait();
              resolve(false);
            }
          }
        ]
      };
      render();
    });
  }

  async function consumeResponseOption(player, option, label, verb = "打出", context = {}) {
    const card = removeHandCard(player, option.cardId);
    if (card) {
      let responseCard = card;
      if (option.virtualSkill === "guhuo") {
        const spec = option.guhuoSpec || CARD_POOL.find((item) => item.name === label);
        const declared = spec ? guhuoVirtualCard(card, spec) : virtualCard(card, label, "basic", label === "闪" ? "dodge" : "slash");
        const proceed = await resolveGuhuoDeclaration(player, card, declared);
        if (!proceed) {
          discardCards([card]);
          await afterLoseHand(player);
          return null;
        }
        responseCard = declared;
      }
      discardCards([card]);
      log(`${nameOf(player)} ${skillPrefix(option.virtualSkill)}${verb}${label}${responseLogSuffix(label, verb, context, player)}。`);
      noteHumanCardUse(player);
      if (label === "无懈可击") triggerJizhiAfterTrick(player, { name: "无懈可击", type: "trick", subtype: "nullify" });
      await afterLoseHand(player);
      return responseCard;
    }
    return null;
  }

  function triggerJizhiAfterTrick(player, card) {
    if (!player?.alive || !card || card.type !== "trick" || isDelayedTrick(card) || !hasSkill(player, "jizhi")) return;
    drawCards(player, 1);
    log(`${nameOf(player)} 发动集智，摸一张牌。`);
  }

  function isDelayedTrick(card) {
    return ["lebu", "bingliang", "lightning"].includes(card?.subtype);
  }

  function responseLogSuffix(label, verb, context = {}, player = null) {
    if (label === "桃" || label === "酒") {
      if (context?.dying) return context.dying.id === player?.id ? "，自救" : `，救援 ${nameOf(context.dying)}`;
      return "";
    }
    if (context?.target && (label === "杀" || verb === "使用")) return `，目标 ${nameOf(context.target)}`;
    const source = context?.source ? nameOf(context.source) : "";
    const reason = label === "无懈可击"
      ? context?.card?.name || "锦囊"
      : context?.reason === "额外响应"
      ? context?.card?.name || label
      : context?.reason || context?.card?.name || "";
    if (source && reason) return `，响应 ${source} 的${reason}`;
    if (source) return `，响应 ${source}`;
    if (reason && reason !== label) return `，响应 ${reason}`;
    return "";
  }

  function logNoResponse(player, kind, context = {}) {
    if (shouldSuppressNoResponseLog(kind, context)) return;
    const label = responseLabel(kind);
    const sourceText = context.source ? `，来源 ${nameOf(context.source)}` : "";
    log(`${nameOf(player)} 未响应${label}${sourceText}。`);
  }

  function shouldSuppressNoResponseLog(kind, context = {}) {
    if (kind === "slash" || kind === "dodge") return true;
    const reason = context.reason || context.card?.name || "";
    return ["杀", "额外响应", "南蛮入侵", "万箭齐发", "决斗"].includes(reason) || context.card?.subtype === "duel";
  }

  function responseOptionKindLabel(option, fallback) {
    if (option.label?.includes("酒")) return "酒";
    if (option.label?.includes("桃")) return "桃";
    if (option.label?.includes("杀")) return "杀";
    if (option.label?.includes("闪")) return "闪";
    if (option.label?.includes("无懈")) return "无懈可击";
    return fallback;
  }

  async function judgeCard(player, reason) {
    const card = await revealJudgeCard(player, reason);
    if (hasSkill(player, "tiandu")) {
      player.hand.push(card);
      log(`${nameOf(player)} 发动天妒，获得判定牌。`);
    } else {
      discardCards([card]);
    }
    await maybeSongwei(player, card);
    return card;
  }

  async function revealJudgeCard(player, reason) {
    let card = drawFromDeck(1)[0];
    if (hasSkill(player, "hongyan") && card.suit === "♠") {
      card = { ...card, suit: "♥", hongyan: true };
    }
    log(`${nameOf(player)} 的 ${reason} 判定：${cardName(card)}。`);
    await eventPause(980, "important");
    card = await maybeRewriteJudge(player, reason, card);
    return card;
  }

  async function maybeRewriteJudge(judgeOwner, reason, initialCard) {
    let card = initialCard;
    const rewriters = aliveFrom(judgeOwner.id).filter((player) => canRewriteJudge(player));
    for (const rewriter of rewriters) {
      const skill = judgeRewriteSkill(rewriter);
      const candidates = judgeRewriteCandidates(rewriter);
      if (!skill || !candidates.length) continue;
      const shouldRewrite = humanControls(rewriter)
        ? await askYesNo(`${nameOf(judgeOwner)} 的 ${reason} 判定为 ${cardName(card)}，是否发动${SKILL_TEXT[skill] || skill}改判？`, false, rewriter)
        : aiShouldGuicai(rewriter, judgeOwner, reason, card);
      if (!shouldRewrite) continue;
      const id = humanControls(rewriter)
        ? (await askHumanSelectCards(rewriter, `${SKILL_TEXT[skill] || skill}：选择一张手牌替换 ${nameOf(judgeOwner)} 的 ${reason} 判定。`, 1, 1, (candidate) => canUseCardForJudgeRewrite(rewriter, candidate), false))[0]
        : chooseGuicaiCard(rewriter, judgeOwner, reason, card)?.id;
      const replacement = removeHandCard(rewriter, id);
      if (!replacement) continue;
      discardCards([card]);
      card = replacement;
      log(`${nameOf(rewriter)} 发动${SKILL_TEXT[skill] || skill}，将 ${nameOf(judgeOwner)} 的 ${reason} 判定改为 ${cardName(card)}。`);
      await afterLoseHand(rewriter);
      await eventPause(980, "important");
    }
    return card;
  }

  async function performLuoshen(player) {
    if (player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
      const start = await askYesNo("是否发动洛神？", true, player);
      if (!start) return;
    }
    let count = 0;
    while (true) {
      const card = await revealJudgeCard(player, "洛神");
      if (isBlack(card)) {
        player.hand.push(card);
        count += 1;
        if (player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
          const keep = await askYesNo("洛神继续判定？", true, player);
          if (!keep) break;
        }
      } else {
        discardCards([card]);
        break;
      }
      if (count >= 8) break;
    }
    if (count) log(`${nameOf(player)} 洛神获得 ${count} 张牌。`);
  }

  async function performGuanxing(player) {
    const n = Math.min(5, state.deck.length);
    if (!n) return;
    const peek = state.deck.splice(0, n);
    const { top, bottom } = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askHumanGuanxing(player, peek)
      : chooseAIGuanxing(player, peek);
    state.deck.unshift(...top);
    state.deck.push(...bottom);
    log(`${nameOf(player)} 发动观星，查看 ${n} 张，置顶 ${top.length} 张、置底 ${bottom.length} 张。`);
    await eventPause(320);
  }

  async function askHumanGuanxing(player, cards) {
    const remaining = [...cards];
    const top = [];
    while (remaining.length) {
      const selected = await askChoice(
        `观星：选择第 ${top.length + 1} 张置于牌堆顶，或结束置顶。`,
        [
          { label: "结束置顶，剩余置底", value: "done" },
          ...remaining.map((card) => ({ label: cardName(card), value: card.id }))
        ],
        player
      );
      if (selected === "done") break;
      const index = remaining.findIndex((card) => card.id === selected);
      if (index < 0) break;
      top.push(remaining.splice(index, 1)[0]);
    }
    const bottom = [];
    while (remaining.length) {
      const selected = await askChoice(
        `观星：选择第 ${bottom.length + 1} 张置于牌堆底。`,
        remaining.map((card) => ({ label: cardName(card), value: card.id })),
        player
      );
      const index = remaining.findIndex((card) => card.id === selected);
      if (index < 0) break;
      bottom.push(remaining.splice(index, 1)[0]);
    }
    return { top, bottom: [...bottom, ...remaining] };
  }

  function chooseAIGuanxing(player, cards) {
    const remaining = [...cards];
    const top = [];
    player.judgeArea.forEach((judge) => {
      if (!remaining.length) return;
      const best = remaining
        .slice()
        .sort((a, b) => judgeCardScoreFor(player, judge, b) - judgeCardScoreFor(player, judge, a))[0];
      top.push(best);
      remaining.splice(remaining.indexOf(best), 1);
    });
    const drawCount = Math.min(remaining.length, expectedDrawCountAfterJudgement(player, top));
    const draws = remaining
      .slice()
      .sort((a, b) => cardKeepValue(player, b) - cardKeepValue(player, a))
      .slice(0, drawCount);
    draws.forEach((card) => {
      top.push(card);
      remaining.splice(remaining.indexOf(card), 1);
    });
    const bottom = remaining.slice().sort((a, b) => cardKeepValue(player, a) - cardKeepValue(player, b));
    return { top, bottom };
  }

  function expectedDrawCountAfterJudgement(player, arrangedTop) {
    let skipDraw = false;
    player.judgeArea.forEach((judge, index) => {
      const card = arrangedTop[index];
      if (judge.subtype === "bingliang" && card && cardSuitFor(player, card) !== "♣") skipDraw = true;
    });
    if (skipDraw || player.flags.skipDrawOnce) return 0;
    let count = 2;
    if (hasSkill(player, "yingzi")) count += 1;
    if (hasSkill(player, "haoshi") && aiShouldUseHaoshi(player, count)) count += 2;
    return Math.max(0, count);
  }

  function judgeCardScoreFor(player, judge, card) {
    if (!judge || !card) return 0;
    const suit = cardSuitFor(player, card);
    if (judge.subtype === "lebu") return suit === "♥" ? 5 : -4;
    if (judge.subtype === "bingliang") return suit === "♣" ? 5 : -4;
    if (judge.subtype === "lightning") {
      const hit = suit === "♠" && rankValue(card.rank) >= 2 && rankValue(card.rank) <= 9;
      return hit ? -8 : 3;
    }
    return cardKeepValue(player, card) * 0.1;
  }

  async function performYinghun(player) {
    const lost = player.maxHp - player.hp;
    if (lost <= 0) return;
    const candidates = alivePlayers().filter((p) => p.id !== player.id);
    if (!candidates.length) return;
    const shouldUse = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`${nameOf(player)} 是否发动英魂？`, true, player)
      : bestYinghunMove(player, lost)?.score > 0.25;
    if (!shouldUse) return;
    const target = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askHumanTarget("英魂：选择一名其他角色。", candidates)
      : bestYinghunMove(player, lost)?.target;
    if (!target) return;
    const mode = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askChoice("英魂：选择效果。", yinghunModeOptions(lost), player)
      : bestYinghunMode(player, target, lost)?.mode;
    if (!mode) return;
    await resolveYinghun(player, target, lost, mode);
  }

  function yinghunModeOptions(lost) {
    if (lost <= 1) return [
      { label: "摸 1 弃 1", value: "drawLostDiscardOne" }
    ];
    return [
      { label: `摸 ${lost} 弃 1`, value: "drawLostDiscardOne" },
      { label: `摸 1 弃 ${lost}`, value: "drawOneDiscardLost" }
    ];
  }

  async function resolveYinghun(player, target, lost, mode) {
    const drawCount = mode === "drawLostDiscardOne" ? lost : 1;
    const discardCount = mode === "drawLostDiscardOne" ? 1 : lost;
    drawCards(target, drawCount, false);
    const actualDiscard = Math.min(discardCount, target.hand.length);
    if (actualDiscard > 0) {
      if (target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
        const ids = await askHumanSelectCards(target, `英魂：弃 ${actualDiscard} 张牌。`, actualDiscard, actualDiscard, () => true, false);
        await discardFromHand(target, ids, "英魂");
      } else {
        await discardFromHand(target, chooseDiscardCards(target, actualDiscard).map((c) => c.id), "英魂");
      }
    }
    log(`${nameOf(player)} 发动英魂，令 ${nameOf(target)} 摸 ${drawCount} 弃 ${actualDiscard}。`);
  }

  function bestYinghunMove(player, lost) {
    return alivePlayers()
      .filter((target) => target.id !== player.id)
      .flatMap((target) => yinghunModeOptions(lost).map((option) => ({
        target,
        mode: option.value,
        score: scoreYinghun(player, target, lost, option.value)
      })))
      .sort((a, b) => b.score - a.score)[0] || null;
  }

  function bestYinghunMode(player, target, lost) {
    return yinghunModeOptions(lost)
      .map((option) => ({ mode: option.value, score: scoreYinghun(player, target, lost, option.value) }))
      .sort((a, b) => b.score - a.score)[0] || null;
  }

  function scoreYinghun(player, target, lost, mode) {
    const drawCount = mode === "drawLostDiscardOne" ? lost : 1;
    const discardCount = mode === "drawLostDiscardOne" ? 1 : lost;
    const actualDiscard = Math.min(discardCount, target.hand.length + drawCount);
    const att = attitude(player, target);
    const relation = supportRelationshipScore(player, target, "gift");
    const drawValue = drawCount * (target.hp <= 2 ? 0.55 : 0.42);
    const discardValue = actualDiscard * (target.hand.length <= 1 ? 0.48 : 0.36);
    let value = relation * drawValue - relation * discardValue;
    if (relation < 0 && actualDiscard >= target.hand.length) value += 0.35;
    if (relation > 0 && target.hp <= 2 && drawCount > actualDiscard) value += 0.22;
    value += threatScore(player, target) * (att < 0 ? 0.1 * actualDiscard : -0.05 * actualDiscard);
    return value;
  }

  async function performZaiqi(player) {
    const count = player.maxHp - player.hp;
    const cards = drawFromDeck(count);
    let hearts = 0;
    cards.forEach((card) => {
      if (cardSuitFor(player, card) === "♥") {
        hearts += 1;
        discardCards([card]);
      } else {
        player.hand.push(card);
      }
    });
    if (hearts) heal(player, player, hearts);
    log(`${nameOf(player)} 发动再起，展示 ${cards.length} 张，回复 ${hearts} 点并获得 ${cards.length - hearts} 张。`);
  }

  async function performHaoshi(player) {
    const giveCount = Math.floor(player.hand.length / 2);
    if (giveCount <= 0) return;
    const targets = haoshiTargets(player);
    let target = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn && targets.length > 1
      ? (await pickTargets("好施：选择一名手牌最少的角色。", targets, 1, 1))[0]
      : chooseHaoshiTarget(player, targets);
    if (!target) target = chooseHaoshiTarget(player, targets);
    if (!target) return;
    const ids = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askHumanSelectCards(player, `好施：选择 ${giveCount} 张手牌交给 ${nameOf(target)}。`, giveCount, giveCount, () => true, false)
      : chooseHaoshiCards(player, target, giveCount).map((card) => card.id);
    if (ids.length < giveCount) return;
    const cards = ids.map((id) => findHandCard(player, id)).filter(Boolean);
    const moved = removeHandCards(player, cards.map((c) => c.id));
    target.hand.push(...moved);
    log(`${nameOf(player)} 因好施手牌超过 5，将一半手牌交给 ${nameOf(target)}：${moved.length} 张牌${discardedCardListSuffix(moved)}。`);
    await afterLoseHand(player);
  }

  function haoshiTargets(player) {
    const candidates = alivePlayers().filter((p) => p.id !== player.id);
    if (!candidates.length) return [];
    const minHand = Math.min(...candidates.map((p) => p.hand.length));
    return candidates.filter((p) => p.hand.length === minHand);
  }

  function chooseHaoshiTarget(player, targets = haoshiTargets(player)) {
    return targets
      .slice()
      .sort((a, b) => supportRelationshipScore(player, b, "gift") - supportRelationshipScore(player, a, "gift") || a.hp - b.hp || a.id - b.id)[0] || null;
  }

  function aiShouldUseHaoshi(player, baseDrawCount) {
    const projectedHand = player.hand.length + baseDrawCount + 2;
    if (projectedHand <= 5) return true;
    const target = chooseHaoshiTarget(player);
    if (!target) return false;
    const giveCount = Math.floor(projectedHand / 2);
    const att = attitude(player, target);
    const relation = supportRelationshipScore(player, target, "gift");
    let score = 1.35;
    score += relation * giveCount * 0.38;
    if (relation < 0) score += relation * giveCount * 0.32;
    if (target.hp <= 1 && relation > 0) score += 0.45;
    if (player.hp <= 2 && relation < 0) score -= 0.25;
    score += player.personality.chaos * rand(-0.12, 0.18);
    return score > 0.35;
  }

  function chooseHaoshiCards(player, target, count) {
    if (supportRelationshipScore(player, target, "gift") > 0.25) return chooseGiftCards(player, target, count);
    return player.hand
      .slice()
      .sort((a, b) => haoshiEnemyGiftCost(player, target, a) - haoshiEnemyGiftCost(player, target, b))
      .slice(0, count);
  }

  function haoshiEnemyGiftCost(player, target, card) {
    let value = cardKeepValue(player, card) * 0.35 + cardKeepValue(target, card) * 0.75;
    if (card.subtype === "peach" || card.subtype === "wine") value += target.hp <= 2 ? 1.3 : 0.6;
    if (card.subtype === "dodge" || card.subtype === "nullify") value += target.hp <= 2 ? 0.7 : 0.25;
    if (card.subtype === "slash" && attitude(target, player) < 0) value += 0.22;
    return value;
  }

  function performHuashen(player) {
    const skill = randomOf(HUASHEN_POOL.filter((s) => !player.general.skills.includes(s)));
    player.tempSkills = skill ? [skill] : [];
    if (skill) log(`${nameOf(player)} 发动化身，本回合获得 ${SKILL_TEXT[skill] || skill}。`);
  }

  function grantHuashenSkill(player, reason) {
    const known = new Set([...player.general.skills, ...player.extraSkills, ...player.tempSkills]);
    const skill = randomOf(HUASHEN_POOL.filter((s) => !known.has(s)));
    if (!skill) return;
    player.extraSkills.push(skill);
    log(`${nameOf(player)} 发动${reason}，获得 ${SKILL_TEXT[skill] || skill}。`);
  }

  async function triggerLeiji(player, preferredTarget) {
    const target = await chooseLeijiTarget(player, preferredTarget);
    if (!target) return;
    const judge = await judgeCard(target, "雷击");
    const suit = cardSuitFor(target, judge);
    if (suit === "♠") {
      log(`${nameOf(player)} 发动雷击，${nameOf(target)} 判定为黑桃，受到 2 点雷电伤害。`);
      await damage(player, target, 2, DAMAGE.THUNDER, { name: "雷击" });
      return;
    }
    if (suit === "♣") {
      const healed = heal(player, player, 1);
      log(`${nameOf(player)} 发动雷击，${nameOf(target)} 判定为梅花${healed ? `，${nameOf(player)} 回复 1 点体力` : ""}，${nameOf(target)} 受到 1 点雷电伤害。`);
      await damage(player, target, 1, DAMAGE.THUNDER, { name: "雷击" });
      return;
    }
    log(`${nameOf(player)} 发动雷击，${nameOf(target)} 判定未命中。`);
  }

  async function chooseLeijiTarget(player, preferredTarget = null) {
    const candidates = alivePlayers().filter((target) => target.id !== player.id);
    if (!candidates.length) return null;
    if (humanControls(player)) {
      const use = await askYesNo(`${nameOf(player)} 使用/打出闪，是否发动雷击？`, true, player);
      if (!use) return null;
      return askHumanTarget("雷击：选择一名其他角色进行判定。", candidates, player);
    }
    return candidates
      .slice()
      .sort((a, b) => leijiTargetScore(player, b, preferredTarget) - leijiTargetScore(player, a, preferredTarget))[0];
  }

  function leijiTargetScore(player, target, preferredTarget = null) {
    const hostile = -attitude(player, target);
    const weakBonus = target.hp <= 1 ? 1.15 : target.hp <= 2 ? 0.62 : 0;
    const chainBonus = target.linked ? 0.22 : 0;
    const preferredBonus = preferredTarget?.id === target.id ? 0.28 : 0;
    return hostile + weakBonus + chainBonus + preferredBonus + threatScore(player, target) * 0.12;
  }

  async function triggerBeige(source, damaged) {
    const singer = alivePlayers().find((p) => hasSkill(p, "beige") && p.hand.length);
    if (!singer || attitude(singer, damaged) <= 0) return;
    const id = singer.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? (await askHumanSelectCards(singer, "弃一张牌发动悲歌。", 1, 1, () => true, true))[0]
      : chooseDiscardCards(singer, 1)[0]?.id;
    if (!id) return;
    await discardFromHand(singer, [id], "悲歌");
    const judge = await judgeCard(damaged, "悲歌");
    if (judge.suit === "♥") heal(singer, damaged, 1, `${nameOf(damaged)} 因悲歌红桃回复 1 点体力。`);
    if (judge.suit === "♦") {
      drawCards(damaged, 2, false);
      log(`${nameOf(damaged)} 因悲歌方片摸 2 张牌。`);
    }
    if (judge.suit === "♣" && source?.alive) await discardFromTarget(damaged, source, Math.min(2, totalCards(source)), "悲歌梅花");
    if (judge.suit === "♠" && source?.alive) {
      source.flags.skipPlayOnce = true;
      log(`${nameOf(source)} 因悲歌黑桃跳过下个出牌阶段。`);
    }
    log(`${nameOf(singer)} 发动悲歌。`);
  }

  async function maybeLiuli(source, target, card, rawCard, liuliChain) {
    if (!source?.alive || !target?.alive || !hasSkill(target, "liuli") || totalCards(target) === 0 || liuliChain.has(target.id)) return null;
    const candidates = alivePlayers().filter((p) =>
      p.id !== source.id &&
      p.id !== target.id &&
      !liuliChain.has(p.id) &&
      distance(target, p) <= attackRange(target)
    );
    if (!candidates.length) return null;
    const preferred = candidates
      .slice()
      .sort((a, b) => attitude(target, a) - attitude(target, b) || a.hp - b.hp)[0];
    const shouldUse = target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`是否发动流离，将 ${nameOf(source)} 的杀转移？`, true, target)
      : attitude(target, source) < 0 && attitude(target, preferred) < 0 && (target.hp <= 2 || estimatedResponseCount(target, "dodge", target) === 0);
    if (!shouldUse) return null;
    const newTarget = target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askHumanTarget("选择流离转移目标。", candidates, target)
      : preferred;
    if (!newTarget) return null;
    const paid = target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await payHumanLiuliCost(target)
      : await payAILiuliCost(target);
    if (!paid) return null;
    liuliChain.add(target.id);
    log(`${nameOf(target)} 发动流离，将杀转移给 ${nameOf(newTarget)}。`);
    return newTarget;
  }

  async function payHumanLiuliCost(player) {
    const options = [
      ...player.hand.map((card) => ({ label: `手牌 ${cardName(card)}`, value: `hand:${card.id}` })),
      ...Object.entries(player.equip).map(([slot, card]) => ({ label: `装备 ${cardDisplayName(card)}`, value: `equip:${slot}` }))
    ];
    if (!options.length) return false;
    const choice = await askChoice("流离：选择弃置一张牌。", options, player);
    if (choice.startsWith("hand:")) {
      const id = Number(choice.slice(5));
      const discarded = await discardFromHand(player, [id], "流离");
      return discarded.length > 0;
    }
    const slot = choice.slice(6);
    const card = removeEquipCard(player, slot);
    if (!card) return false;
    discardCards([card]);
    log(`${nameOf(player)} 因 流离 弃置 ${cardName(card)}。`);
    await afterLoseHand(player, { lostHand: false });
    return true;
  }

  async function payAILiuliCost(player) {
    const hand = chooseDiscardCards(player, 1)[0];
    const equips = Object.entries(player.equip)
      .map(([slot, card]) => ({ slot, card }))
      .sort((a, b) => cardKeepValue(player, a.card) - cardKeepValue(player, b.card));
    const equip = equips[0];
    if (equip && (!hand || cardKeepValue(player, equip.card) <= cardKeepValue(player, hand) + 0.15)) {
      const card = removeEquipCard(player, equip.slot);
      if (!card) return false;
      discardCards([card]);
      log(`${nameOf(player)} 因 流离 弃置 ${cardName(card)}。`);
      await afterLoseHand(player, { lostHand: false });
      return true;
    }
    if (!hand) return false;
    const discarded = await discardFromHand(player, [hand.id], "流离");
    return discarded.length > 0;
  }

  async function triggerGuzheng(discarder, discarded) {
    const cards = discarded.filter((card) => card && !card.virtual);
    if (!cards.length) return;
    const holders = alivePlayers().filter((p) => p.id !== discarder.id && hasSkill(p, "guzheng"));
    for (const holder of holders) {
      const shouldUse = holder.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askYesNo(`${nameOf(discarder)} 弃置了 ${cards.length} 张牌，是否发动固政？`, true, holder)
        : attitude(holder, discarder) > 0 || cards.length >= 2;
      if (!shouldUse) continue;
      removeFromDiscard(cards);
      const returnCardId = holder.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askChoice("固政：选择一张牌返还给弃牌者。", cards.map((card) => ({ label: cardName(card), value: card.id })), holder)
        : chooseGuzhengReturnCard(holder, discarder, cards).id;
      const returned = cards.find((card) => card.id === returnCardId) || cards[0];
      const gained = cards.filter((card) => card.id !== returned.id);
      discarder.hand.push(returned);
      holder.hand.push(...gained);
      log(`${nameOf(holder)} 发动固政，将 ${cardName(returned)} 交还 ${nameOf(discarder)}${gained.length ? `，获得其余 ${gained.length} 张牌：${gained.map(cardName).join("、")}` : ""}。`);
      return;
    }
  }

  function chooseGuzhengReturnCard(holder, discarder, cards) {
    const sorted = cards.slice().sort((a, b) => cardKeepValue(discarder, b) - cardKeepValue(discarder, a));
    if (attitude(holder, discarder) > 0) return sorted[0];
    return sorted[sorted.length - 1];
  }

  function removeFromDiscard(cards) {
    const ids = new Set(cards.map((card) => card.id));
    state.discard = state.discard.filter((card) => !ids.has(card.id));
  }

  function nearestTargets(player) {
    const candidates = alivePlayers().filter((p) => p.id !== player.id);
    const min = Math.min(...candidates.map((p) => distance(player, p)));
    return candidates.filter((p) => distance(player, p) === min);
  }

  async function chooseHumanLuanwuVictim(player, victims) {
    if (!victims?.length) return null;
    if (victims.length === 1) return victims[0];
    return askHumanTarget("乱武：选择一名距离最近的角色作为杀的目标。", victims, player);
  }

  function chooseAILuanwuVictim(player, victims, caster) {
    if (!victims?.length) return null;
    return victims
      .slice()
      .sort((a, b) => luanwuVictimScore(player, b, caster) - luanwuVictimScore(player, a, caster))[0] || victims[0];
  }

  function luanwuVictimScore(player, victim, caster) {
    let score = -attitude(player, victim) + threatScore(player, victim) * 0.14;
    if (victim.id === caster?.id) score += 0.08;
    if (victim.hp <= 1) score += attitude(player, victim) < 0 ? 0.28 : -0.22;
    return score;
  }

  function aiShouldSlashForLuanwu(player, victim, caster) {
    if (!victim) return false;
    if (player.hp <= 1) return true;
    const victimValue = luanwuVictimScore(player, victim, caster);
    if (attitude(player, victim) < -0.25) return true;
    if (victim.id === caster?.id && attitude(player, victim) < 0.15) return true;
    const selfLossPain = player.hp <= 2 ? 0.95 : 0.42;
    return victimValue > selfLossPain;
  }

  function borrowSwordWielders(source, action) {
    return alivePlayers()
      .filter((target) => target.id !== source.id)
      .filter((target) => target.equip.weapon)
      .filter((target) => !isProtectedFromTrick(target, action || { effect: "borrowSword", card: null }))
      .filter((target) => borrowSwordVictims(source, target).length);
  }

  function borrowSwordVictims(source, wielder) {
    if (!wielder?.alive || !wielder.equip.weapon) return [];
    return alivePlayers().filter((target) => target.id !== source.id && target.id !== wielder.id && canSlashTarget(wielder, target));
  }

  function borrowSwordPairs(source, action) {
    return borrowSwordWielders(source, action)
      .flatMap((wielder) => borrowSwordVictims(source, wielder).map((victim) => [wielder, victim]));
  }

  function scoreBorrowSwordMove(source, wielder, victim, action) {
    if (!canBorrowSwordPair(source, wielder, victim, action)) return -9;
    const wielderAtt = attitude(source, wielder);
    const victimAtt = attitude(source, victim);
    const likelySlash = estimatedResponseCount(wielder, "slash", source);
    const weaponValue = equipmentUtilityFor(wielder, wielder.equip.weapon, source);
    const slashPressure = -victimAtt * 0.92
      + threatScore(source, victim) * 0.22
      + (victim.hp <= 2 ? 0.42 : 0)
      - estimatedResponseCount(victim, "dodge", source) * 0.08;
    const weaponPressure = -wielderAtt * 0.92
      + weaponValue * 0.24
      + threatScore(source, wielder) * 0.16;
    const friendlyWielder = wielderAtt > 0.45 || supportTeamworkScore(source, wielder, "support") > 0.7;
    const friendlyVictim = victimAtt > 0.45 || supportTeamworkScore(source, victim, "support") > 0.7;
    const strongSlashEvidence = canUseExactHandInfo(source, wielder)
      ? countResponseCards(wielder, "slash") > 0
      : (state.cardReads?.[wielder.id]?.slash || 0) >= 1.45;
    const advancedCoop = friendlyWielder
      && strongSlashEvidence
      && victimAtt < -0.55
      && weaponValue < 1.9
      && slashPressure > 0.55;

    if (friendlyWielder && !advancedCoop) {
      return -4.05 - weaponValue * 0.46 + Math.max(0, slashPressure) * 0.08;
    }

    let score = weaponPressure + Math.max(-0.45, slashPressure) * clamp(likelySlash, 0.15, 1.1);
    if (friendlyVictim) score -= 2.1 + friendlyVictim * 0.34 + Math.max(0, likelySlash - 0.35) * 0.72;
    if (wielderAtt < -0.25) score += 0.42 + weaponValue * 0.12;
    if (wielderAtt < -0.25 && victimAtt < -0.25) score += 0.18;
    if (advancedCoop) score += 0.28 - weaponValue * 0.16;
    return score;
  }

  function canBorrowSwordPair(source, wielder, victim, action) {
    if (!source?.alive || !wielder?.alive || !victim?.alive) return false;
    if (source.id === wielder.id || source.id === victim.id || wielder.id === victim.id) return false;
    if (!wielder.equip.weapon) return false;
    if (isProtectedFromTrick(wielder, action || { effect: "borrowSword", card: null })) return false;
    return canSlashTarget(wielder, victim);
  }

  function legalTargets(player, action) {
    const candidates = alivePlayers().filter((p) => p.id !== player.id);
    if (!action.needsTarget) return [];
    if (action.targetMode === "enemy" || action.targetMode === "fangtian" || action.targetMode === "tianyiSlash") {
      return candidates.filter((target) => canSlashTarget(player, target));
    }
    if (action.targetMode === "chainTargets") {
      return candidates;
    }
    if (action.targetMode === "borrowSword") {
      return borrowSwordWielders(player, action);
    }
    if (action.targetMode === "hostile") {
      return candidates.filter((target) => attitude(player, target) < 0);
    }
    if (action.targetMode === "hasCards") {
      return candidates.filter((target) => totalCards(target) > 0 && !isProtectedFromTrick(target, action) && inTrickRange(player, target, action));
    }
    if (action.targetMode === "hasHand") {
      return candidates.filter((target) => target.hand.length > 0 && !isProtectedFromTrick(target, action) && inTrickRange(player, target, action));
    }
    if (action.targetMode === "delayed") {
      return candidates.filter((target) => !target.judgeArea.some((c) => c.subtype === action.effect) && !isProtectedFromTrick(target, action) && inTrickRange(player, target, action));
    }
    if (action.targetMode === "damagedAlly") {
      return alivePlayers().filter((target) => target.hp < target.maxHp && attitude(player, target) > 0);
    }
    if (action.targetMode === "damagedAny") {
      return alivePlayers().filter((target) => target.hp < target.maxHp);
    }
    if (action.targetMode === "ally") {
      return candidates.filter((target) => attitude(player, target) > 0);
    }
    if (action.targetMode === "woundedMale") {
      return candidates.filter((target) => target.general.gender === "male" && target.hp < target.maxHp);
    }
    if (action.targetMode === "twoMaleEnemies") {
      return candidates.filter((target) => target.general.gender === "male" && attitude(player, target) < 0);
    }
    if (action.targetMode === "twoMaleAny") {
      return candidates.filter((target) => target.general.gender === "male");
    }
    if (action.targetMode === "twoAny") {
      return alivePlayers().filter((target) => target.id !== player.id);
    }
    if (action.targetMode === "dimengPair") {
      return dimengFirstTargets(player);
    }
    if (action.targetMode === "xuanhuoPair") {
      const ids = new Set(xuanhuoPairs(player).flatMap((pair) => pair.map((target) => target.id)));
      return alivePlayers().filter((target) => ids.has(target.id));
    }
    if (action.targetMode === "ganluPair") {
      const ids = new Set(ganluPairs(player).flatMap((pair) => pair.map((target) => target.id)));
      return alivePlayers().filter((target) => ids.has(target.id));
    }
    if (action.targetMode === "anxuPair") {
      const ids = new Set(anxuPairs(player).flatMap((pair) => pair.map((target) => target.id)));
      return alivePlayers().filter((target) => ids.has(target.id));
    }
    if (action.targetMode === "inRangeEnemy") {
      return candidates.filter((target) => attitude(player, target) < 0 && distance(player, target) <= 1);
    }
    if (action.targetMode === "higherHpEnemy") {
      return candidates.filter((target) => attitude(player, target) < 0 && target.hp > player.hp && target.hand.length > 0 && player.hand.length > 0);
    }
    if (action.targetMode === "higherHpAny") {
      return candidates.filter((target) => target.hp > player.hp && target.hand.length > 0 && player.hand.length > 0);
    }
    if (action.targetMode === "pindianEnemy") {
      return candidates.filter((target) => attitude(player, target) < 0 && target.hand.length > 0 && player.hand.length > 0);
    }
    if (action.targetMode === "canAttackMe") {
      return candidates.filter((target) => attitude(player, target) < 0 && distance(target, player) <= attackRange(target));
    }
    return candidates.filter((target) => !isProtectedFromTrick(target, action));
  }

  function canSlashTarget(source, target) {
    if (!target?.alive || source.id === target.id) return false;
    if (hasSkill(target, "kongcheng") && target.hand.length === 0) return false;
    if (source.turn?.tianyi) return true;
    return distance(source, target) <= attackRange(source);
  }

  function canUseSlash(player) {
    if (hasSkill(player, "paoxiao")) return true;
    if (player.equip.weapon?.name === "诸葛连弩") return true;
    if (player.turn.tianyi && player.turn.slashUsed < 2) return true;
    return player.turn.slashUsed < 1;
  }

  function inTrickRange(player, target, action) {
    if (hasSkill(player, "qicai")) return true;
    if (action.effect === "steal" || action.effect === "bingliang") return distance(player, target) <= 1;
    return true;
  }

  function isProtectedFromTrick(target, action) {
    const effect = typeof action === "string" ? action : action.effect;
    const card = typeof action === "string" ? null : action.card;
    if (hasSkill(target, "qianxun") && (effect === "steal" || effect === "lebu")) return true;
    if (hasSkill(target, "weimu") && card && isBlackFor(target, card) && effect !== "chain") return true;
    return false;
  }

  function isProtectedFromMassDamage(target, effect) {
    return target.equip.armor?.name === "藤甲" && (effect === "barbarians" || effect === "arrows");
  }

  function attackRange(player) {
    return player.equip.weapon?.range || 1;
  }

  function distance(from, to) {
    const alive = alivePlayers().map((p) => p.id);
    const a = alive.indexOf(from.id);
    const b = alive.indexOf(to.id);
    if (a < 0 || b < 0) return 99;
    const direct = Math.abs(a - b);
    let dist = Math.min(direct, alive.length - direct);
    if (from.equip.minusHorse || hasSkill(from, "mashu")) dist -= 1;
    if (from.fields?.length) dist -= from.fields.length;
    if (to.equip.plusHorse) dist += 1;
    return Math.max(1, dist);
  }

  function equipCard(player, card) {
    const slot = card.subtype;
    const old = removeEquipCard(player, slot);
    if (old) {
      discardCards([old]);
    }
    player.equip[slot] = card;
    log(`${nameOf(player)} 装备 ${cardDisplayName(card)}。`);
    return old;
  }

  function removeEquipCard(player, slot) {
    const card = player.equip[slot];
    if (!card) return null;
    delete player.equip[slot];
    if (player.alive && card.name === "白银狮子" && player.hp < player.maxHp) {
      heal(null, player, 1, `${nameOf(player)} 失去白银狮子，回复 1 点体力。`);
    }
    if (player.alive && hasSkill(player, "xiaoji")) {
      drawCards(player, 2);
      log(`${nameOf(player)} 发动枭姬，摸两张牌。`);
    }
    return card;
  }

  function removeAllEquipCards(player) {
    return Object.keys(player.equip).map((slot) => removeEquipCard(player, slot)).filter(Boolean);
  }

  async function exchangeEquipAreas(a, b) {
    const aCards = removeEquipAreaForMove(a);
    const bCards = removeEquipAreaForMove(b);
    bCards.forEach(({ slot, card }) => {
      if (card) a.equip[slot] = card;
    });
    aCards.forEach(({ slot, card }) => {
      if (card) b.equip[slot] = card;
    });
    if (aCards.length) await afterLoseHand(a, { lostHand: false, lostCard: true });
    if (bCards.length) await afterLoseHand(b, { lostHand: false, lostCard: true });
  }

  function removeEquipAreaForMove(player) {
    return Object.keys(player.equip)
      .map((slot) => ({ slot, card: removeEquipCard(player, slot) }))
      .filter((item) => item.card);
  }

  async function resolveStealCard(actor, target, reason) {
    const choice = await chooseTargetCard(actor, target, "steal", reason);
    if (!choice) return null;
    const card = removeChosenTargetCard(target, choice);
    if (!card) return null;
    actor.hand.push(card);
    log(`${nameOf(actor)} 因 ${reason} 获得 ${nameOf(target)} 的${targetCardLogLabel(choice, card)}。`);
    await afterLoseHand(target, { lostHand: choice.zone === "hand" });
    return card;
  }

  async function resolveDismantleCard(actor, target, reason) {
    const choice = await chooseTargetCard(actor, target, "dismantle", reason);
    if (!choice) return null;
    const card = removeChosenTargetCard(target, choice);
    if (!card) return null;
    discardCards([card]);
    log(`${nameOf(actor)} 因 ${reason} 弃置 ${nameOf(target)} 的${discardedTargetCardLogLabel(choice, card)}。`);
    await afterLoseHand(target, { lostHand: choice.zone === "hand" });
    return card;
  }

  async function chooseTargetCard(actor, target, mode, reason) {
    const options = targetCardOptions(target);
    if (!options.length) return null;
    if (humanControls(actor)) {
      return askChoice(`${reason}：选择 ${nameOf(target)} 的一张牌。`, options.map((option) => ({
        label: option.label,
        tip: targetCardOptionTip(option, mode, reason),
        value: option
      })), actor);
    }
    return chooseAITargetCard(actor, target, mode, options);
  }

  function targetCardOptions(target) {
    const options = [];
    target.hand.forEach((card, index) => {
      options.push({
        zone: "hand",
        index,
        card,
        hidden: true,
        label: `手牌 ${index + 1}`
      });
    });
    Object.entries(target.equip).forEach(([slot, card]) => {
      options.push({
        zone: "equip",
        slot,
        card,
        hidden: false,
        label: `装备 · ${equipSlotLabel(slot)} ${cardDisplayName(card)}`
      });
    });
    target.judgeArea.forEach((card, index) => {
      options.push({
        zone: "judge",
        index,
        card,
        hidden: false,
        label: `判定 · ${cardDisplayName(card)}`
      });
    });
    return options;
  }

  function targetCardOptionTip(option, mode, reason = "") {
    const action = mode === "steal"
      ? `${reason || "顺手牵羊"}：选择后获得这张牌。`
      : `${reason || "过河拆桥"}：选择后弃置这张牌。`;
    if (option.zone === "hand") {
      return `隐藏手牌槽位\n${option.label} 是对方的一张未知手牌；不会显示具体牌名。\n${action}`;
    }
    if (option.zone === "equip") {
      return `${option.label}\n公开装备牌：${equipmentRuleText(option.card)}\n${action}`;
    }
    if (option.zone === "judge") {
      return `${option.label}\n公开判定牌：${cardTooltipText(option.card)}\n${action}`;
    }
    return `${option.label}\n${action}`;
  }

  function chooseAITargetCard(actor, target, mode, options) {
    const visible = options.filter((option) => !option.hidden);
    const publicScore = (option) => {
      if (option.zone === "judge") {
        const harmful = isHarmfulJudgeCard(option.card);
        return harmful ? (attitude(actor, target) > 0 ? 4.8 : -1.5) : 1.5;
      }
      if (option.zone === "equip") return 2.2 + cardKeepValue(target, option.card) * 0.28;
      return 0;
    };
    const bestVisible = visible
      .slice()
      .sort((a, b) => publicScore(b) - publicScore(a))[0];
    if (bestVisible && publicScore(bestVisible) > 0.25) return bestVisible;
    const handOptions = options.filter((option) => option.zone === "hand");
    if (handOptions.length) return randomOf(handOptions);
    return bestVisible || options[0];
  }

  function removeChosenTargetCard(target, choice) {
    if (!choice) return null;
    if (choice.zone === "hand") {
      const index = Math.max(0, Math.min(target.hand.length - 1, choice.index ?? 0));
      return target.hand.splice(index, 1)[0] || null;
    }
    if (choice.zone === "equip") {
      return removeEquipCard(target, choice.slot);
    }
    if (choice.zone === "judge") {
      const index = Math.max(0, Math.min(target.judgeArea.length - 1, choice.index ?? 0));
      return target.judgeArea.splice(index, 1)[0] || null;
    }
    return null;
  }

  function targetCardLogLabel(choice, card) {
    if (choice.zone === "hand") return "一张手牌";
    if (choice.zone === "equip") return `装备区的 ${cardName(card)}`;
    if (choice.zone === "judge") return `判定区的 ${cardName(card)}`;
    return "一张牌";
  }

  function discardedTargetCardLogLabel(choice, card) {
    if (choice.zone === "hand") return `手牌：${cardName(card)}`;
    if (choice.zone === "equip") return `装备区的 ${cardName(card)}`;
    if (choice.zone === "judge") return `判定区的 ${cardName(card)}`;
    return `牌：${cardName(card)}`;
  }

  async function stealRandomCard(actor, target, reason) {
    const card = takeBestVisibleCard(target, actor);
    if (!card) return null;
    actor.hand.push(card.card);
    log(`${nameOf(actor)} 因 ${reason} 获得 ${nameOf(target)} 的一张牌。`);
    await afterLoseHand(target, { lostHand: card.zone === "hand" });
    return card.card;
  }

  async function discardRandomFromTarget(actor, target, reason) {
    const card = takeBestVisibleCard(target, actor, true);
    if (!card) return null;
    discardCards([card.card]);
    log(`${nameOf(actor)} 因 ${reason} 弃置 ${nameOf(target)} 的${discardedTargetCardLogLabel(card, card.card)}。`);
    await afterLoseHand(target, { lostHand: card.zone === "hand" });
    return card.card;
  }

  async function discardFromTarget(actor, target, count, reason) {
    const discarded = [];
    for (let i = 0; i < count; i += 1) {
      const card = await discardRandomFromTarget(actor, target, reason);
      if (card) discarded.push(card);
    }
    return discarded;
  }

  async function stealRandomHandCard(actor, target, reason) {
    if (!target.hand.length) return null;
    const index = Math.floor(Math.random() * target.hand.length);
    const card = target.hand.splice(index, 1)[0];
    actor.hand.push(card);
    log(`${nameOf(actor)} 因 ${reason} 获得 ${nameOf(target)} 的一张手牌。`);
    await afterLoseHand(target);
    return card;
  }

  function takeBestVisibleCard(target, actor, preferEquip = false) {
    const equipCards = Object.entries(target.equip).map(([slot, card]) => ({ zone: "equip", slot, card }));
    const judgeCards = target.judgeArea.map((card, index) => ({ zone: "judge", index, card }));
    if (preferEquip && equipCards.length) {
      const picked = equipCards.sort((a, b) => cardKeepValue(actor, b.card) - cardKeepValue(actor, a.card))[0];
      return { ...picked, card: removeEquipCard(target, picked.slot) };
    }
    if (target.hand.length) {
      const index = Math.floor(Math.random() * target.hand.length);
      return { zone: "hand", card: target.hand.splice(index, 1)[0] };
    }
    if (equipCards.length) {
      const picked = equipCards[0];
      return { ...picked, card: removeEquipCard(target, picked.slot) };
    }
    if (judgeCards.length) {
      const picked = judgeCards[0];
      return { ...picked, card: target.judgeArea.splice(picked.index, 1)[0] };
    }
    return null;
  }

  function qiaobianJudgeMoves(player) {
    const moves = [];
    player.judgeArea.forEach((card, index) => {
      alivePlayers()
        .filter((target) => target.id !== player.id && canReceiveFieldCard(target, { zone: "judge", card }))
        .forEach((to) => {
          const score = (isHarmfulJudgeCard(card) ? -attitude(player, to) : attitude(player, to)) + (to.hp <= 2 ? 0.2 : 0);
          moves.push({ index, card, to, score });
        });
    });
    return moves.sort((a, b) => b.score - a.score);
  }

  async function chooseQiaobianJudgeMove(player, moves) {
    if (!moves.length) return null;
    const selected = await askChoice("巧变：选择要移动的判定牌。", moves.map((move, index) => ({
      label: `${cardName(move.card)} -> ${nameOf(move.to)}`,
      value: index
    })), player);
    return moves[selected] || null;
  }

  async function moveJudgeCard(from, index, to, reason) {
    const card = from.judgeArea.splice(index, 1)[0];
    if (!card) return;
    to.judgeArea.push(card);
    log(`${nameOf(from)} 因 ${reason} 将 ${card.name} 移动给 ${nameOf(to)}。`);
    await afterLoseHand(from, { lostHand: false });
  }

  function chooseQiaobianDrawTargets(player) {
    return alivePlayers()
      .filter((target) => target.id !== player.id && target.hand.length > 0)
      .sort((a, b) => attitude(player, a) - attitude(player, b) || b.hand.length - a.hand.length)
      .slice(0, 2);
  }

  function qiaobianFieldMoves(player) {
    const moves = [];
    alivePlayers().forEach((from) => {
      fieldCards(from).forEach((item) => {
        alivePlayers()
          .filter((to) => to.id !== from.id && canReceiveFieldCard(to, item))
          .forEach((to) => moves.push({ from, item, to, score: qiaobianFieldMoveScore(player, from, item, to) }));
      });
    });
    return moves.sort((a, b) => b.score - a.score);
  }

  function fieldCards(player) {
    const equip = Object.entries(player.equip).map(([slot, card]) => ({ zone: "equip", slot, card }));
    const judge = player.judgeArea.map((card, index) => ({ zone: "judge", index, card }));
    return [...equip, ...judge];
  }

  function canReceiveFieldCard(target, item) {
    if (item.zone === "equip") return !target.equip[item.slot];
    if (item.zone === "judge") return !target.judgeArea.some((card) => card.subtype === item.card.subtype);
    return false;
  }

  function qiaobianFieldMoveScore(actor, from, item, to) {
    if (item.zone === "judge") {
      const harmful = isHarmfulJudgeCard(item.card) ? 1 : -1;
      return harmful * (attitude(actor, from) - attitude(actor, to)) + (to.hp <= 2 ? 0.2 : 0);
    }
    const value = cardKeepValue(from, item.card) * 0.18;
    return (-attitude(actor, from) + attitude(actor, to)) + value;
  }

  function chooseQiaobianFieldMove(player, moves) {
    return moves[0] || null;
  }

  async function askQiaobianFieldMove(player, moves) {
    const worthwhile = moves.slice(0, 16);
    const selected = await askChoice("巧变：选择移动的场上牌。", worthwhile.map((move, index) => ({
      label: `${nameOf(move.from)} 的 ${move.item.card.name} -> ${nameOf(move.to)}`,
      value: index
    })), player);
    return worthwhile[selected] || null;
  }

  async function moveFieldCard(from, item, to, reason) {
    let card = null;
    if (item.zone === "equip") {
      card = from.equip[item.slot];
      if (!card || to.equip[item.slot]) return;
      removeEquipCard(from, item.slot);
      to.equip[item.slot] = card;
    } else if (item.zone === "judge") {
      card = from.judgeArea.splice(item.index, 1)[0];
      if (!card || to.judgeArea.some((judge) => judge.subtype === card.subtype)) return;
      to.judgeArea.push(card);
    }
    if (card) {
      log(`${nameOf(from)} 因 ${reason} 将 ${card.name} 移动给 ${nameOf(to)}。`);
      await afterLoseHand(from, { lostHand: false });
    }
  }

  function isHarmfulJudgeCard(card) {
    return ["lebu", "bingliang", "lightning"].includes(card.subtype);
  }

  function drawCards(player, count, shouldLog = true) {
    const drawn = drawFromDeck(count);
    player.hand.push(...drawn);
    noteCardsGained(player, drawn.length);
    if (shouldLog && count) log(`${nameOf(player)} 摸 ${count} 张牌。`);
    return drawn;
  }

  function drawFromDeck(count) {
    const drawn = [];
    for (let i = 0; i < count; i += 1) {
      if (!state.deck.length) {
        state.deck = shuffle(state.discard.splice(0));
        log("弃牌堆洗回牌堆。");
      }
      const card = state.deck.shift();
      if (card) drawn.push(card);
    }
    return drawn;
  }

  function discardCards(cards) {
    cards.filter(Boolean).forEach((card) => {
      if (!card.virtual) state.discard.push(card);
    });
  }

  function discardUsedCards(cards) {
    discardCards(cards.filter((card) => card && !isCardHeldByAnyPlayer(card)));
  }

  async function discardFromHand(player, ids, reason) {
    const cards = removeHandCards(player, ids);
    discardCards(cards);
    if (cards.length) log(`${nameOf(player)} 因 ${reason} 弃置 ${cards.length} 张牌${discardedCardListSuffix(cards)}。`);
    await afterLoseHand(player, { lostHand: cards.length > 0, lostCard: cards.length > 0 });
    return cards;
  }

  function discardedCardListSuffix(cards) {
    const text = cards.filter(Boolean).map(cardName).join("、");
    return text ? `：${text}` : "";
  }

  function removeHandCards(player, ids) {
    const set = new Set(ids);
    const removed = [];
    player.hand = player.hand.filter((card) => {
      if (set.has(card.id)) {
        removed.push(card);
        return false;
      }
      return true;
    });
    return removed;
  }

  function removeHandCard(player, id) {
    const index = player.hand.findIndex((card) => card.id === id);
    if (index < 0) return null;
    return player.hand.splice(index, 1)[0];
  }

  function isCardHeldByAnyPlayer(card) {
    if (!card) return false;
    return state.players.some((player) => player.hand.some((held) => held.id === card.id));
  }

  async function afterLoseHand(player, context = {}) {
    const lostCard = context.lostCard !== false;
    const lostHand = context.lostHand !== false;
    await maybeShangshi(player);
    if (lostCard && player.alive && hasSkill(player, "tuntian") && !isCurrentTurn(player) && !player.flags.tuntianLock) {
      player.flags.tuntianLock = true;
      const judge = await judgeCard(player, "屯田");
      if (judge.suit !== "♥") {
        player.fields.push(copyCard(judge));
        log(`${nameOf(player)} 发动屯田，获得一张田。`);
        if (hasSkill(player, "zaoxian") && !player.flags.zaoxianAwakened && player.fields.length >= 3) {
          player.flags.zaoxianAwakened = true;
          await loseMaxHp(player, 1);
          if (!player.extraSkills.includes("jixi")) player.extraSkills.push("jixi");
          log(`${nameOf(player)} 觉醒凿险，获得急袭。`);
        }
      }
      player.flags.tuntianLock = false;
    }
    if (lostHand && player.alive && hasSkill(player, "lianying") && player.hand.length === 0 && !player.flags.lianyingLock) {
      player.flags.lianyingLock = true;
      drawCards(player, 1);
      log(`${nameOf(player)} 发动连营，摸一张牌。`);
      player.flags.lianyingLock = false;
    }
  }

  async function maybeShangshi(player) {
    if (!player?.alive || !hasSkill(player, "shangshi")) return false;
    if (state.status.phase === "弃牌阶段") return false;
    const targetCount = Math.min(2, Math.max(0, player.maxHp - player.hp));
    const need = targetCount - player.hand.length;
    if (need <= 0) return false;
    drawCards(player, need, false);
    log(`${nameOf(player)} 发动伤逝，将手牌补至 ${targetCount} 张。`);
    return true;
  }

  async function maybeNullify(source, target, card, context = {}) {
    if (!card || card.type !== "trick" || card.subtype === "nullify") return false;
    let nullified = false;
    const used = new Set();
    while (true) {
      const responder = await chooseNullifyResponder(source, target, card, nullified, used, context);
      if (!responder) break;
      nullified = !nullified;
      used.add(responder.id);
      const targetText = nullifyTargetText(target, card, nullified);
      log(`${nameOf(responder)} 使用无懈可击，${nullified ? "抵消" : "反抵消"} ${card.name}${targetText}。`);
      updateReadsForNullify(responder, source, target, card, nullified);
      await eventPause(720, "important");
    }
    return nullified;
  }

  async function chooseNullifyResponder(source, target, card, nullified, used, context = {}) {
    const responders = aliveFrom(context.seatStartId ?? source.id).filter((p) => !used.has(p.id) && responseOptions(p, "nullify", { source, target, card }).length);
    for (const responder of responders) {
      const options = responseOptions(responder, "nullify", { source, target, card });
      const shouldUse = responder.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
        ? await askHumanUseResponse(responder, "nullify", {
          source,
          target,
          card,
          options,
          reason: nullified
            ? `${card.name} 已被无懈，是否再使用无懈可击令其继续生效？`
            : context.reason || `${nameOf(source)} 使用 ${card.name}${target ? `，目标 ${nameOf(target)}` : ""}，是否使用无懈可击？`
        })
        : aiShouldNullify(responder, source, target, card, nullified);
      if (shouldUse) {
        if (!responder.isHuman || state.autoplayHuman || state.autoplayHumanForTurn) {
          await consumeResponseOption(responder, chooseResponseOption(responder, options), "无懈可击", "打出", { source, target, card });
        }
        noteResponse(responder, "nullify", true);
        return responder;
      }
      noteResponse(responder, "nullify", false);
    }
    return null;
  }

  function nullifyTargetText(target, card, nullified) {
    if (!target?.alive) return "";
    if (isHelpfulTrickForTarget(card, target)) {
      return `，${nullified ? "阻止" : "继续给予"} ${nameOf(target)}`;
    }
    return `，${nullified ? "保护" : "继续影响"} ${nameOf(target)}`;
  }

  function aiShouldNullify(responder, source, target, card, nullified = false) {
    const value = trickImpactFor(responder, source, target, card);
    const options = responseOptions(responder, "nullify", { source, target, card });
    if (!options.length) return false;
    const cheapest = options
      .map((option) => findHandCard(responder, option.cardId))
      .filter(Boolean)
      .sort((a, b) => cardKeepValue(responder, a) - cardKeepValue(responder, b))[0];
    const cost = cardKeepValue(responder, cheapest);
    const harmfulTarget = target && isHarmfulTrickForTarget(card, target);
    const helpfulTarget = target && isHelpfulTrickForTarget(card, target);
    const selfTarget = target?.id === responder.id;
    if (!nullified && harmfulTarget) {
      if (selfTarget) {
        if (isMassDamageCard(card)) {
          const responseKind = requiredResponseKindForMassTrick(card);
          const canUseCheaperResponse = responseKind && responseOptions(responder, responseKind, { source, target, card, reason: card.name }).length > 0;
          return responder.hp <= 1 || !canUseCheaperResponse;
        }
        return true;
      }
      const protection = nullifyProtectionScore(responder, target);
      if (protection < 0.72) return false;
      return value + protection * 0.36 > Math.max(0.9, cost * 0.42 + responder.personality.caution * 0.18);
    }
    if (!nullified && helpfulTarget && selfTarget) return false;
    if (nullified) {
      return -value > Math.max(0.75, cost * 0.38 + responder.personality.caution * 0.18 + Math.random() * 0.3);
    }
    return value > Math.max(0.7, cost * 0.45 + responder.personality.caution * 0.2 + Math.random() * 0.35);
  }

  function requiredResponseKindForMassTrick(card) {
    if (card?.subtype === "barbarians") return "slash";
    if (card?.subtype === "arrows") return "dodge";
    return "";
  }

  function nullifyProtectionScore(responder, target) {
    if (!responder || !target || !target.alive) return 0;
    if (responder.id === target.id) return 3;
    let score = supportTeamworkScore(responder, target, "support");
    if (isPublicLordTo(responder, target) && (responder.role === "主公" || responder.role === "忠臣")) score += 0.48;
    if (isRolePublicTo(responder, target) && roleAttitude(responder, target) > 0) score += 0.28;
    if (target.hp <= 2) score += 0.14;
    return clamp(score, -2.5, 2.6);
  }

  function trickImpactFor(observer, source, target, card) {
    if (target) {
      const att = attitude(observer, target);
      if (["steal", "dismantle", "duel", "fireAttack", "lebu", "bingliang", "borrowSword"].includes(card.subtype)) {
        return att > 0 ? 1.4 + (target.hp <= 2 ? 0.5 : 0) : -0.8;
      }
      if (card.subtype === "draw2" || card.subtype === "lightning") {
        return attitude(observer, source) < 0 ? 1.0 : -0.5;
      }
      if (card.subtype === "chain") return att > 0 && target.linked ? 0.7 : -0.2;
    }
    if (card.subtype === "barbarians" || card.subtype === "arrows") {
      return alivePlayers()
        .filter((p) => p.id !== source.id)
        .filter((p) => !isProtectedFromMassDamage(p, card.subtype))
        .reduce((sum, p) => sum + attitude(observer, p) * (p.hp <= 2 ? 0.45 : 0.25), 0);
    }
    if (card.subtype === "taoyuan") {
      return -alivePlayers().reduce((sum, p) => sum + attitude(observer, p) * (p.hp < p.maxHp ? 0.5 : 0), 0);
    }
    if (card.subtype === "harvest") {
      return attitude(observer, source) < 0 ? 0.8 : -0.4;
    }
    return attitude(observer, source) < 0 ? 0.4 : -0.2;
  }

  async function maybeTianxiang(source, target, amount, nature, card) {
    if (!target.alive || !hasSkill(target, "tianxiang") || card?.name === "天香") return false;
    const hearts = target.hand.filter((c) => cardSuitFor(target, c) === "♥");
    if (!hearts.length) return false;
    const candidates = alivePlayers().filter((p) => p.id !== target.id);
    if (!candidates.length) return false;
    const heart = chooseTianxiangCard(target, hearts);
    const preferred = chooseTianxiangTarget(target, candidates, amount, nature, heart);
    if (!preferred) return false;
    const shouldUse = target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`是否发动天香，弃一张红桃牌转移 ${amount} 点伤害？`, true, target)
      : scoreTianxiang(target, preferred, amount, nature, heart) > 0.45 + target.personality.caution * 0.22;
    if (!shouldUse) return false;
    const cardId = target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? (await askHumanSelectCards(target, "选择一张红桃牌发动天香。", 1, 1, (c) => cardSuitFor(target, c) === "♥", true))[0]
      : heart?.id;
    const newTarget = target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askHumanTarget("选择天香转移目标。", candidates, target)
      : preferred;
    if (!cardId || !newTarget) return false;
    await discardFromHand(target, [cardId], "天香");
    log(`${nameOf(target)} 发动天香，将 ${amount} 点${natureLabel(nature)}伤害转移给 ${nameOf(newTarget)}。`);
    await damage(source, newTarget, amount, nature, { name: "天香" });
    const drawCount = Math.max(0, newTarget.maxHp - newTarget.hp);
    if (newTarget.alive && drawCount > 0) {
      drawCards(newTarget, drawCount, false);
      log(`${nameOf(newTarget)} 因天香摸 ${drawCount} 张牌。`);
    }
    return true;
  }

  function chooseTianxiangCard(player, hearts) {
    return hearts
      .slice()
      .sort((a, b) => cardKeepValue(player, a) - cardKeepValue(player, b))[0] || null;
  }

  function chooseTianxiangTarget(player, candidates, amount, nature, costCard) {
    return candidates
      .slice()
      .sort((a, b) => scoreTianxiang(player, b, amount, nature, costCard) - scoreTianxiang(player, a, amount, nature, costCard))[0] || null;
  }

  function scoreTianxiang(player, redirectTarget, amount, nature, costCard) {
    if (!redirectTarget?.alive || redirectTarget.id === player.id) return -4;
    const avoidSelf = -tianxiangOutcomeValue(player, player, amount, nature);
    const redirectValue = tianxiangOutcomeValue(player, redirectTarget, amount, nature);
    const cost = cardKeepValue(player, costCard) * 0.2;
    const enemyPressure = attitude(player, redirectTarget) < 0 ? threatScore(player, redirectTarget) * 0.12 : 0;
    return avoidSelf + redirectValue + enemyPressure - cost;
  }

  function tianxiangOutcomeValue(observer, damaged, amount, nature) {
    const effectiveAmount = damaged.equip.armor?.name === "白银狮子" ? Math.min(1, amount) : amount;
    const afterHp = damaged.hp - effectiveAmount;
    const lostHpAfter = Math.max(0, damaged.maxHp - Math.max(0, afterHp));
    const att = attitude(observer, damaged);
    let value = -att * effectiveAmount * 1.05;
    value += att * lostHpAfter * 0.24;
    if (afterHp <= 0) {
      value += -att * (isPublicLordTo(observer, damaged) ? 1.5 : 1.0);
      if (hasSkill(damaged, "niepan") && !damaged.flags.niepanUsed) value -= -att * 0.45;
      if (hasSkill(damaged, "buqu")) value -= -att * 0.28;
    }
    if ((nature === DAMAGE.FIRE || nature === DAMAGE.THUNDER) && damaged.linked) value += -att * 0.22;
    return value;
  }

  async function pindian(source, target, reason, options = {}) {
    if (!source.hand.length || !target.hand.length) return false;
    const sourceWantsWin = options.sourceWantsWin ?? true;
    const targetWantsWin = options.targetWantsWin ?? (attitude(target, source) < 0);
    const sourceId = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? (await askHumanSelectCards(source, `${reason}：选择一张拼点牌。`, 1, 1, () => true, false))[0]
      : choosePindianCard(source, target, sourceWantsWin, { reason, defender: false })?.id;
    const targetId = target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? (await askHumanSelectCards(target, `${reason}：选择一张拼点牌。`, 1, 1, () => true, false))[0]
      : choosePindianCard(target, source, targetWantsWin, { reason, defender: true })?.id;
    const sourceCard = removeHandCard(source, sourceId);
    const targetCard = removeHandCard(target, targetId);
    if (!sourceCard || !targetCard) return false;
    const win = rankValue(sourceCard.rank) > rankValue(targetCard.rank);
    log(`${nameOf(source)} 与 ${nameOf(target)} ${reason} 拼点：${cardName(sourceCard)} 对 ${cardName(targetCard)}，${win ? "成功" : "失败"}。`);
    await afterLoseHand(source);
    await afterLoseHand(target);
    if (options.returnCards) return { win, sourceCard, targetCard };
    discardCards([sourceCard, targetCard]);
    return win;
  }

  function choosePindianCard(player, opponent, wantsWin, options = {}) {
    const cards = player.hand.slice().sort((a, b) => rankValue(a.rank) - rankValue(b.rank) || cardKeepValue(player, a) - cardKeepValue(player, b));
    if (!cards.length) return null;
    if (!wantsWin) return chooseConcedePindianCard(player, cards);

    const opponentWantsWin = attitude(opponent, player) < 0;
    const expectedRank = estimateOpponentPindianRank(player, opponent, opponentWantsWin, options.reason);
    const neededRank = options.defender ? Math.ceil(expectedRank) : Math.floor(expectedRank) + 1;
    const enough = cards
      .filter((card) => rankValue(card.rank) >= neededRank)
      .sort((a, b) => pindianCardUseCost(player, a, expectedRank) - pindianCardUseCost(player, b, expectedRank));
    if (enough.length) return enough[0];

    const best = cards[cards.length - 1];
    const bestEdge = rankValue(best.rank) - expectedRank;
    if (bestEdge >= -1.2 || cardKeepValue(player, best) < 2.6) return best;
    return chooseConcedePindianCard(player, cards);
  }

  function chooseConcedePindianCard(player, cards) {
    return cards
      .slice()
      .sort((a, b) => (rankValue(a.rank) * 0.16 + cardKeepValue(player, a)) - (rankValue(b.rank) * 0.16 + cardKeepValue(player, b)))[0];
  }

  function pindianCardUseCost(player, card, expectedRank) {
    const overkill = Math.max(0, rankValue(card.rank) - expectedRank - 1);
    return cardKeepValue(player, card) + overkill * 0.08 - rankValue(card.rank) * 0.015;
  }

  function estimateOpponentPindianRank(observer, opponent, opponentWantsWin, reason = "") {
    if (!opponent?.hand?.length) return 0;
    if (state.aiMode === "oracle" || observer.id === opponent.id) {
      const ranks = opponent.hand.map((card) => rankValue(card.rank)).sort((a, b) => a - b);
      if (!opponentWantsWin) return ranks[0];
      return ranks[Math.min(ranks.length - 1, Math.max(0, Math.floor(ranks.length * 0.72)))];
    }
    const handFactor = clamp(opponent.hand.length, 1, 6);
    let estimate = opponentWantsWin ? 8.1 + handFactor * 0.42 : 3.6 + handFactor * 0.22;
    if (opponentWantsWin && (reason === "驱虎" || reason === "天义" || reason === "烈刃")) estimate += 0.45;
    if (opponent.hp <= 2 && opponentWantsWin) estimate += 0.35;
    return clamp(estimate, 2, 12.5);
  }

  function estimatePindianWinChance(source, target, reason = "") {
    if (!source.hand.length || !target.hand.length) return 0;
    const sourceCard = choosePindianCard(source, target, true, { reason, defender: false });
    if (!sourceCard) return 0;
    const targetWantsWin = attitude(target, source) < 0;
    const targetRank = canUseExactHandInfo(source, target)
      ? rankValue(choosePindianCard(target, source, targetWantsWin, { reason, defender: true })?.rank)
      : estimateOpponentPindianRank(source, target, targetWantsWin, reason);
    if (!Number.isFinite(targetRank)) return 0;
    const edge = rankValue(sourceCard.rank) - targetRank;
    const base = edge > 0 ? 0.62 : 0.38;
    return clamp(base + edge * 0.065 + (source.hand.length - target.hand.length) * 0.025, 0.06, 0.94);
  }

  function quhuVictimCandidates(tiger) {
    return alivePlayers().filter((p) => p.id !== tiger.id && distance(tiger, p) <= attackRange(tiger));
  }

  function scoreQuhuVictim(actor, victim) {
    if (!actor || !victim) return -Infinity;
    return -attitude(actor, victim)
      + threatScore(actor, victim) * 0.18
      + (victim.hp <= 2 ? 0.55 : 0.1)
      - (victim.id === actor.id ? 2.2 : 0);
  }

  function chooseQuhuVictim(actor, tiger) {
    return quhuVictimCandidates(tiger)
      .map((victim) => ({ victim, score: scoreQuhuVictim(actor, victim) }))
      .sort((a, b) => b.score - a.score)[0]?.victim || null;
  }

  function chooseJiemingTarget(source) {
    return bestJiemingTarget(source)?.target || source;
  }

  async function maybeJieming(player) {
    const candidates = jiemingTargets();
    if (!candidates.length) return false;
    const best = bestJiemingTarget(player, candidates);
    const shouldUse = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`${nameOf(player)} 是否发动节命？令一名角色将手牌补至体力上限，最多五张。`, true, player)
      : best && best.score > 0.22;
    if (!shouldUse) return false;
    const recipient = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askHumanTarget("节命：选择一名角色。", candidates, player)
      : best?.target;
    if (!recipient) return false;
    const drawTo = Math.min(5, recipient.maxHp);
    const count = Math.max(0, drawTo - recipient.hand.length);
    if (count <= 0) return false;
    drawCards(recipient, count, false);
    log(`${nameOf(player)} 发动节命，令 ${nameOf(recipient)} 将手牌补至 ${drawTo} 张。`);
    return true;
  }

  function jiemingTargets() {
    return alivePlayers().filter((target) => Math.max(0, Math.min(5, target.maxHp) - target.hand.length) > 0);
  }

  function bestJiemingTarget(source, candidates = jiemingTargets()) {
    return candidates
      .map((target) => ({ target, score: scoreJieming(source, target) }))
      .sort((a, b) => b.score - a.score)[0] || null;
  }

  function scoreJieming(source, target) {
    const drawTo = Math.min(5, target.maxHp);
    const count = Math.max(0, drawTo - target.hand.length);
    if (count <= 0) return -2;
    const att = attitude(source, target);
    const teamwork = supportTeamworkScore(source, target, "gift");
    let value = (att + teamwork * 0.72) * count * (target.hp <= 2 ? 0.58 : 0.44);
    if ((att > 0 || teamwork > 0.55) && target.hp <= 1) value += 0.35;
    if ((att > 0 || teamwork > 0.55) && target.hand.length === 0) value += 0.25;
    if (att < 0 && teamwork < 0.45) value -= threatScore(source, target) * 0.12;
    if (target.id === source.id) value += source.hp <= 2 ? 0.18 : 0.04;
    value += source.personality.chaos * rand(-0.1, 0.14);
    return value;
  }

  function chooseFangzhuTarget(source) {
    return bestFangzhuTarget(source)?.target || null;
  }

  async function maybeFangzhu(player) {
    const count = Math.max(1, player.maxHp - player.hp);
    const candidates = alivePlayers().filter((p) => p.id !== player.id);
    if (!candidates.length) return false;
    const best = bestFangzhuTarget(player, candidates, count);
    const shouldUse = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`${nameOf(player)} 是否发动放逐？令一名其他角色摸 ${count} 张牌并翻面。`, true, player)
      : best && best.score > 0.28;
    if (!shouldUse) return false;
    const recipient = player.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askHumanTarget("放逐：选择一名其他角色。", candidates, player)
      : best?.target;
    if (!recipient) return false;
    drawCards(recipient, count, false);
    recipient.flags.skipTurnOnce = true;
    log(`${nameOf(player)} 发动放逐，令 ${nameOf(recipient)} 摸 ${count} 张牌并翻面。`);
    return true;
  }

  function bestFangzhuTarget(source, candidates = alivePlayers().filter((p) => p.id !== source.id), count = Math.max(1, source.maxHp - source.hp)) {
    return candidates
      .map((target) => ({ target, score: scoreFangzhu(source, target, count) }))
      .sort((a, b) => b.score - a.score)[0] || null;
  }

  function scoreFangzhu(source, target, count) {
    const att = attitude(source, target);
    const relation = supportRelationshipScore(source, target, "gift");
    const drawValue = count * (0.42 + (target.hp <= 2 ? 0.12 : 0) + Math.min(0.18, Math.max(0, 3 - target.hand.length) * 0.04));
    const skipValue = target.flags.skipTurnOnce
      ? 0.15
      : 1.0 + threatScore(source, target) * 0.22 + Math.min(0.4, target.hand.length * 0.06);
    let score = relation * drawValue - relation * skipValue;
    if (relation > 0 && target.hp <= 1) score += 0.28;
    if (att < 0 && isPublicLordTo(source, target)) score += 0.22;
    if (relation > 0 && target.flags.skipTurnOnce) score += 0.22;
    score += source.personality.chaos * rand(-0.1, 0.14);
    return score;
  }

  function chooseFanjianCard(source, target) {
    return source.hand
      .slice()
      .sort((a, b) => fanjianCardScore(source, target, b) - fanjianCardScore(source, target, a))[0] || null;
  }

  function fanjianCardScore(source, target, card) {
    const hitChance = estimatedFanjianHitChance(source, target, card);
    const damageValue = -attitude(source, target) + threatScore(source, target) * 0.18 + (target.hp <= 2 ? 0.7 : 0.2);
    return damageValue * hitChance - cardKeepValue(source, card) * 0.2 + (hitChance > 0.7 ? 0.12 : 0);
  }

  function chooseZhijianCard(source, target) {
    return source.hand
      .filter((card) => card.type === "equip")
      .sort((a, b) => zhijianCardScore(source, target, b) - zhijianCardScore(source, target, a))[0] || null;
  }

  function zhijianCardScore(source, target, card) {
    const att = attitude(source, target);
    const old = target.equip[card.subtype];
    const netEquip = equipmentUtilityFor(target, card, source) - equipmentUtilityFor(target, old, source);
    const ownCost = cardKeepValue(source, card) * (att > 0 ? 0.18 : 0.34);
    const replacementPenalty = old && att > 0 ? equipmentUtilityFor(target, old, source) * 0.12 : 0;
    return netEquip * Math.max(-0.5, att) - ownCost - replacementPenalty + (att > 0 ? 0.25 : -0.65);
  }

  function equipmentUtilityFor(player, card, observer = player) {
    if (!card) return 0;
    if (card.subtype === "weapon") {
      let value = 1.4 + (card.range || 1) * 0.18;
      const slashStock = canUseExactHandInfo(observer, player)
        ? (player.hand.some((c) => c.subtype === "slash") ? 1 : 0)
        : estimatedResponseCount(player, "slash", observer);
      if (card.name === "诸葛连弩" && slashStock >= 0.9) value += 0.55;
      if (card.name === "贯石斧" && player.hand.length >= 2) value += 0.25;
      if (card.name === "青釭剑" || card.name === "古锭刀" || card.name === "寒冰剑") value += 0.18;
      if (hasSkill(player, "paoxiao") || hasSkill(player, "wushuang") || hasSkill(player, "tianyi")) value += 0.22;
      return value;
    }
    if (card.subtype === "armor") {
      let value = player.hp <= 2 ? 1.55 : 1.15;
      if (card.name === "八卦阵" || card.name === "仁王盾") value += 0.25;
      if (card.name === "白银狮子" && player.hp < player.maxHp) value += 0.22;
      if (card.name === "藤甲" && player.hp <= 2) value -= 0.12;
      return value;
    }
    if (card.subtype === "plusHorse") return player.hp <= 2 ? 1.1 : 0.82;
    if (card.subtype === "minusHorse") return 0.72 + Math.min(0.45, aiEnemies(player).length * 0.12);
    return 0.6;
  }

  function bestExtraTurnTarget(player) {
    return alivePlayers()
      .filter((p) => p.id !== player.id && (attitude(player, p) > 0 || supportTeamworkScore(player, p, "gift") > 0.55))
      .sort((a, b) => {
        const score = (target) => attitude(player, target) + supportTeamworkScore(player, target, "gift") + target.hand.length * 0.08;
        return score(b) - score(a);
      })[0];
  }

  function scoreDimeng(player, targets) {
    if (!targets || targets.length < 2) return -1;
    const [a, b] = targets;
    if (!canDimengPair(player, a, b)) return -2;
    const diff = Math.abs(a.hand.length - b.hand.length);
    const aWeight = dimengHandWeight(player, a);
    const bWeight = dimengHandWeight(player, b);
    const before = aWeight * estimatedHandBundleValue(player, a, a) + bWeight * estimatedHandBundleValue(player, b, b);
    const after = aWeight * estimatedHandBundleValue(player, a, b) + bWeight * estimatedHandBundleValue(player, b, a);
    const discardCost = chooseAIDimengCost(player, diff).reduce((sum, choice) => sum + dimengDiscardValue(player, choice), 0);
    let score = (after - before) * 0.16 - discardCost * 0.22 - diff * 0.1;
    const aAtt = attitude(player, a);
    const bAtt = attitude(player, b);
    if ((aAtt > 0 && bAtt < 0) || (aAtt < 0 && bAtt > 0)) score += 0.38;
    if (aAtt > 0 && bAtt > 0) score -= 0.55 + discardCost * 0.08;
    if (aAtt < 0 && bAtt < 0) score -= 0.18;
    if (diff === 0 && score > -0.25) score += 0.16;
    return score;
  }

  function dimengPairs(player) {
    const candidates = alivePlayers().filter((target) => target.id !== player.id);
    return allPairs(candidates).filter(([a, b]) => canDimengPair(player, a, b));
  }

  function dimengFirstTargets(player) {
    const ids = new Set(dimengPairs(player).flatMap((pair) => pair.map((target) => target.id)));
    return alivePlayers().filter((target) => ids.has(target.id));
  }

  function canDimengPair(player, a, b) {
    if (!player?.alive || !a?.alive || !b?.alive) return false;
    if (a.id === b.id || a.id === player.id || b.id === player.id) return false;
    return Math.abs(a.hand.length - b.hand.length) <= dimengCostChoices(player).length;
  }

  function dimengCostChoices(player) {
    return zhihengCandidates(player).filter((choice) => choice?.card);
  }

  function dimengDiscardValue(player, choice) {
    return zhihengDiscardValue(player, choice);
  }

  function lijianCostChoices(player) {
    return dimengCostChoices(player);
  }

  function lijianDiscardValue(player, choice) {
    return dimengDiscardValue(player, choice);
  }

  function chooseAILijianCost(player) {
    return chooseAIDimengCost(player, 1)[0] || null;
  }

  async function askHumanLijianCost(player) {
    const choices = lijianCostChoices(player);
    if (!choices.length) return null;
    const options = choices.map((choice) => ({
      label: zhihengChoiceLabel(choice),
      value: zhihengChoiceKey(choice),
      tip: `${choice.zone === "equip" ? "装备区牌" : "手牌"}\n${cardTooltipText(choice.card)}`
    }));
    options.push({ label: "取消离间", value: "cancel", danger: true });
    const choiceKey = await askChoice("离间：选择弃置一张牌。", options, player);
    if (choiceKey === "cancel") return null;
    return choices.find((choice) => zhihengChoiceKey(choice) === choiceKey) || null;
  }

  async function discardLijianCost(player, choice) {
    const discarded = await discardSkillCostChoices(player, [choice], "离间");
    return discarded.length === 1;
  }

  function chooseAIDimengCost(player, count) {
    if (count <= 0) return [];
    return dimengCostChoices(player)
      .slice()
      .sort((a, b) => dimengDiscardValue(player, a) - dimengDiscardValue(player, b))
      .slice(0, count);
  }

  async function askHumanDimengCost(player, count) {
    const selected = [];
    while (selected.length < count) {
      const selectedKeys = new Set(selected.map(zhihengChoiceKey));
      const remaining = dimengCostChoices(player).filter((choice) => !selectedKeys.has(zhihengChoiceKey(choice)));
      const options = remaining.map((choice) => ({
        label: zhihengChoiceLabel(choice),
        value: zhihengChoiceKey(choice),
        tip: `${choice.zone === "equip" ? "装备区牌" : "手牌"}\n${cardTooltipText(choice.card)}`
      }));
      if (!options.length) return [];
      if (selected.length) options.unshift({ label: `已选择 ${selected.length}/${count} 张`, value: "noop", disabled: true });
      options.push({ label: "取消缔盟", value: "cancel", danger: true });
      const choiceKey = await askChoice(
        selected.length
          ? `缔盟：还需弃置 ${count - selected.length} 张牌。`
          : `缔盟：选择弃置 ${count} 张牌。`,
        options,
        player
      );
      if (choiceKey === "cancel") return [];
      if (choiceKey === "noop") continue;
      const next = remaining.find((choice) => zhihengChoiceKey(choice) === choiceKey);
      if (!next) return [];
      selected.push(next);
    }
    return selected;
  }

  async function discardSkillCostChoices(player, choices, reason) {
    const discarded = [];
    const handIds = choices.filter((choice) => choice.zone === "hand").map((choice) => choice.id);
    if (handIds.length) {
      const cards = await discardFromHand(player, handIds, reason);
      discarded.push(...cards);
    }
    for (const choice of choices.filter((item) => item.zone === "equip")) {
      const card = removeEquipCard(player, choice.slot);
      if (!card) continue;
      discardCards([card]);
      discarded.push(card);
      log(`${nameOf(player)} 因 ${reason} 弃置装备区的 ${cardName(card)}。`);
      await afterLoseHand(player, { lostHand: false, lostCard: true });
    }
    return discarded;
  }

  async function discardDimengCost(player, choices) {
    return discardSkillCostChoices(player, choices, "缔盟");
  }

  function xuanhuoPairs(player) {
    if (!player?.alive || !player.hand.some((card) => card.suit === "♥")) return [];
    const receivers = alivePlayers().filter((target) => target.id !== player.id && totalCards(target) > 0);
    const recipients = alivePlayers().filter((target) => target.id !== player.id);
    const pairs = [];
    receivers.forEach((receiver) => {
      recipients.forEach((recipient) => {
        if (receiver.id !== recipient.id) pairs.push([receiver, recipient]);
      });
    });
    return pairs;
  }

  function isXuanhuoPair(player, receiver, recipient) {
    return Boolean(
      player?.alive &&
      receiver?.alive &&
      recipient?.alive &&
      receiver.id !== player.id &&
      recipient.id !== player.id &&
      receiver.id !== recipient.id &&
      player.hand.some((card) => card.suit === "♥") &&
      totalCards(receiver) > 0
    );
  }

  function chooseXuanhuoHeart(player) {
    return player.hand.filter((card) => card.suit === "♥").sort((a, b) => cardKeepValue(player, a) - cardKeepValue(player, b))[0] || null;
  }

  function scoreXuanhuo(player, targets) {
    if (!targets || targets.length < 2) return -1;
    const [receiver, recipient] = targets;
    if (!receiver?.alive || !recipient?.alive || receiver.id === recipient.id || receiver.id === player.id || recipient.id === player.id || totalCards(receiver) <= 0) return -1;
    const heart = chooseXuanhuoHeart(player);
    if (!heart) return -1;
    const takeValue = estimatedBestTargetCardValue(player, receiver) * (attitude(player, recipient) > 0 ? 0.5 : 0.25);
    return -attitude(player, receiver) * 0.78 + supportRelationshipScore(player, recipient, "gift") * 0.68 + takeValue - cardKeepValue(player, heart) * 0.2;
  }

  function estimatedBestTargetCardValue(actor, target) {
    if (!target) return 0;
    return Math.max(
      target.hand.length ? 2.2 : 0,
      ...Object.values(target.equip || {}).filter(Boolean).map((card) => cardKeepValue(actor, card)),
      ...target.judgeArea.map((card) => isHarmfulJudgeCard(card) ? 2.8 : 0.8)
    );
  }

  function chooseJujianCards(player, target) {
    if (!player?.hand?.length) return [];
    const sorted = player.hand.slice().sort((a, b) => cardKeepValue(player, a) - cardKeepValue(player, b));
    if (player.hp < player.maxHp && sorted.length >= 3) {
      const sameType = ["basic", "trick", "equip"]
        .map((type) => sorted.filter((card) => card.type === type).slice(0, 3))
        .filter((cards) => cards.length >= 3)
        .sort((a, b) => a.reduce((sum, card) => sum + cardKeepValue(player, card), 0) - b.reduce((sum, card) => sum + cardKeepValue(player, card), 0))[0];
      if (sameType) return sameType;
    }
    const teamwork = target ? supportTeamworkScore(player, target, "gift") : 0;
    const count = teamwork > 1.05 || target?.hp <= 2 ? Math.min(2, sorted.length) : 1;
    return sorted.slice(0, count);
  }

  function sameCardCategory(cards) {
    if (!cards?.length) return false;
    return cards.every((card) => card.type === cards[0].type);
  }

  function ganluPairs(player) {
    const maxDiff = Math.max(0, player.maxHp - player.hp);
    const candidates = alivePlayers();
    return allPairs(candidates).filter(([a, b]) => canGanluPair(player, a, b, maxDiff));
  }

  function canGanluPair(player, a, b, maxDiff = Math.max(0, player?.maxHp - player?.hp)) {
    if (!player?.alive || !a?.alive || !b?.alive || a.id === b.id) return false;
    return Math.abs(countEquip(a) - countEquip(b)) <= maxDiff && (countEquip(a) || countEquip(b));
  }

  function scoreGanlu(player, targets) {
    if (!targets || targets.length < 2) return -1;
    const [a, b] = targets;
    if (!a?.alive || !b?.alive || a.id === b.id || Math.abs(countEquip(a) - countEquip(b)) > Math.max(0, player.maxHp - player.hp)) return -1;
    const valueA = equipmentBundleValueFor(a, b) - equipmentBundleValueFor(a, a);
    const valueB = equipmentBundleValueFor(b, a) - equipmentBundleValueFor(b, b);
    return attitude(player, a) * valueA * 0.32 + attitude(player, b) * valueB * 0.32 + (countEquip(a) !== countEquip(b) ? 0.15 : 0);
  }

  function equipmentBundleValueFor(receiver, owner) {
    return Object.values(owner?.equip || {}).filter(Boolean).reduce((sum, card) => sum + equipmentUtilityFor(receiver, card, receiver), 0);
  }

  function equipmentSummary(player) {
    const cards = Object.values(player?.equip || {}).filter(Boolean);
    return cards.length ? cards.map((card) => card.name).join("、") : "无装备";
  }

  function anxuPairs(player) {
    const others = alivePlayers().filter((target) => target.id !== player.id);
    return allPairs(others).filter(([a, b]) => isAnxuPair(player, a, b));
  }

  function isAnxuPair(player, a, b) {
    if (!player?.alive || !a?.alive || !b?.alive || a.id === b.id) return false;
    if (a.id === player.id || b.id === player.id) return false;
    return a.hand.length !== b.hand.length && Math.max(a.hand.length, b.hand.length) > 0;
  }

  function scoreAnxu(player, targets) {
    if (!targets || targets.length < 2) return -1;
    const [a, b] = targets;
    if (!a?.alive || !b?.alive || a.id === b.id || a.hand.length === b.hand.length) return -1;
    const low = a.hand.length < b.hand.length ? a : b;
    const high = low.id === a.id ? b : a;
    return supportRelationshipScore(player, low, "gift") * 0.78 - attitude(player, high) * 0.42 + (low.hp <= 2 ? 0.18 : 0) + (high.hand.length >= 3 ? 0.18 : 0);
  }

  async function chooseAnxuHandIndex(player, high) {
    if (!high?.hand?.length) return 0;
    if (humanControls(player)) {
      const choice = await askChoice(`安恤：选择 ${nameOf(high)} 的一张手牌槽位。`, high.hand.map((card, index) => ({
        label: `手牌 ${index + 1}`,
        value: index,
        tip: `安恤展示牌\n这是一张未知手牌；选择后会公开展示并移动。`
      })), player);
      return Math.max(0, Math.min(high.hand.length - 1, choice ?? 0));
    }
    if (canUseExactHandInfo(player, high)) {
      const ranked = high.hand.map((card, index) => ({ card, index }))
        .sort((a, b) => cardKeepValue(player, b.card) - cardKeepValue(player, a.card));
      return ranked[0]?.index || 0;
    }
    return Math.floor(Math.random() * high.hand.length);
  }

  function handBundleValue(receiver, cards) {
    return cards.reduce((sum, card) => sum + cardKeepValue(receiver, card), 0) + cards.length * 0.45;
  }

  function estimatedHandBundleValue(observer, receiver, owner) {
    if (!owner?.hand) return 0;
    if (canUseExactHandInfo(observer, owner)) return handBundleValue(receiver, owner.hand);
    const count = owner.hand.length;
    const urgency = receiver.hp <= 2 ? 0.42 : 0.08;
    const rolePressure = Math.max(0, -attitude(observer, receiver)) * 0.12;
    const averageCardValue = 2.35 + urgency + rolePressure;
    return count * (averageCardValue + 0.45);
  }

  function dimengHandWeight(observer, target) {
    let weight = supportRelationshipScore(observer, target, "gift");
    if (weight < 0) weight -= threatScore(observer, target) * 0.18;
    if (weight > 0 && target.hp <= 2) weight += 0.18;
    return weight;
  }

  function huangtianLordFor(player) {
    if (!player?.alive || player.general.kingdom !== "群") return null;
    return alivePlayers().find((p) => canActAsLordSkillOwner(p, "huangtian") && p.id !== player.id) || null;
  }

  function huangtianCards(player) {
    return player?.hand?.filter((card) => card.subtype === "dodge" || card.subtype === "lightning") || [];
  }

  function chooseHuangtianCard(player, lord = huangtianLordFor(player)) {
    return huangtianCards(player)
      .slice()
      .sort((a, b) => huangtianCardScore(player, lord, b) - huangtianCardScore(player, lord, a))[0] || null;
  }

  function huangtianCardScore(player, lord, card) {
    if (!player || !lord || !card) return -2;
    const relation = supportRelationshipScore(player, lord, "gift");
    const lordValue = card.subtype === "dodge"
      ? 1.05 + (lord.hp <= 2 ? 0.45 : 0) + (hasSkill(lord, "leiji") ? 0.35 : 0)
      : 0.65 + (hasSkill(lord, "guidao") ? 0.25 : 0);
    const selfDefensePenalty = card.subtype === "dodge" && player.hp <= 2 ? 0.55 : 0.28;
    return relation * 0.78 + lordValue - cardKeepValue(player, card) * selfDefensePenalty;
  }

  function scoreHuangtianMove(player) {
    const lord = huangtianLordFor(player);
    const card = chooseHuangtianCard(player, lord);
    if (!lord || !card) return -2;
    const relation = supportRelationshipScore(player, lord, "gift");
    const teamwork = supportTeamworkScore(player, lord, "gift");
    let score = huangtianCardScore(player, lord, card);
    if (relation <= 0.35 && teamwork < 0.55) score -= 1.6;
    if (isPublicLordTo(player, lord) && player.role === "反贼") score -= 1.2;
    if (isPublicLordTo(player, lord) && (player.role === "忠臣" || player.role === "主公")) score += 0.35;
    return score;
  }

  async function askHumanHuangtianCard(player, lord) {
    const cards = huangtianCards(player);
    if (cards.length <= 1) return cards[0] || null;
    const ids = await askHumanSelectCards(
      player,
      `黄天：选择一张闪或闪电交给 ${nameOf(lord)}。`,
      1,
      1,
      (card) => card.subtype === "dodge" || card.subtype === "lightning",
      true
    );
    return ids.length ? findHandCard(player, ids[0]) : null;
  }

  function baonueLordFor(source) {
    if (!source?.alive || source.general.kingdom !== "群") return null;
    return alivePlayers().find((p) => canActAsLordSkillOwner(p, "baonue") && p.id !== source.id && p.hp < p.maxHp) || null;
  }

  function aiShouldBaonue(source, lord = baonueLordFor(source)) {
    if (!source || !lord) return false;
    const teamwork = supportTeamworkScore(source, lord, "heal");
    const relation = supportRelationshipScore(source, lord, "heal");
    if (isPublicLordTo(source, lord) && source.role === "反贼") return false;
    if (isPublicLordTo(source, lord) && (source.role === "忠臣" || source.role === "主公")) return true;
    return relation > 0.62 || teamwork > 0.8;
  }

  async function maybeBaonue(source) {
    const lord = baonueLordFor(source);
    if (!lord) return false;
    const use = humanControls(source)
      ? await askYesNo(`是否发动暴虐，令 ${nameOf(lord)} 判定，黑桃则其回复 1 点体力？`, aiShouldBaonue(source, lord), source)
      : aiShouldBaonue(source, lord);
    if (!use) return false;
    log(`${nameOf(source)} 发动暴虐，请 ${nameOf(lord)} 进行判定。`);
    const judge = await judgeCard(lord, "暴虐");
    if (judge.suit === "♠") {
      heal(source, lord, 1);
      log(`${nameOf(lord)} 因暴虐回复 1 点体力。`);
      return true;
    }
    return true;
  }

  function songweiLordFor(player, card) {
    if (!player?.alive || player.general.kingdom !== "魏" || !card) return null;
    if (!isBlackFor(player, card)) return null;
    return alivePlayers().find((p) => canActAsLordSkillOwner(p, "songwei") && p.id !== player.id) || null;
  }

  function aiShouldSongwei(player, lord = null) {
    if (!player || !lord) return false;
    const teamwork = supportTeamworkScore(player, lord, "gift");
    const relation = supportRelationshipScore(player, lord, "gift");
    if (isPublicLordTo(player, lord) && player.role === "反贼") return false;
    if (isPublicLordTo(player, lord) && (player.role === "忠臣" || player.role === "主公")) return true;
    return relation > 0.58 || teamwork > 0.76;
  }

  async function maybeSongwei(player, card) {
    const lord = songweiLordFor(player, card);
    if (!lord) return false;
    const use = humanControls(player)
      ? await askYesNo(`是否发动颂威，令 ${nameOf(lord)} 摸一张牌？`, aiShouldSongwei(player, lord), player)
      : aiShouldSongwei(player, lord);
    if (!use) return false;
    drawCards(lord, 1, false);
    log(`${nameOf(player)} 发动颂威，令 ${nameOf(lord)} 摸一张牌。`);
    return true;
  }

  function zhibaLordFor(player) {
    if (!player?.alive || player.general.kingdom !== "吴") return null;
    return alivePlayers().find((p) => canActAsLordSkillOwner(p, "zhiba") && p.id !== player.id);
  }

  function scoreZhibaMove(player) {
    const lord = zhibaLordFor(player);
    if (!lord || !player.hand.length || !lord.hand.length) return -2;
    const relation = supportRelationshipScore(player, lord, "support");
    const teamwork = supportTeamworkScore(player, lord, "support");
    const winChance = estimatePindianWinChance(player, lord, "制霸");
    const donateChance = 1 - winChance;
    const donationValue = relation > 0 || teamwork > 0
      ? donateChance * 1.05 - Math.min(0.45, lowestPindianDonationCost(player) * 0.12)
      : 0;
    let score = -0.35 + relation * 0.58 + teamwork * 0.5 + donationValue;
    if (isPublicLordTo(player, lord) && player.role === "反贼") score -= 1.4;
    if (isPublicLordTo(player, lord) && (player.role === "忠臣" || player.role === "主公")) score += 0.45;
    if (relation < 0 && teamwork < 0) score -= 0.65;
    return score;
  }

  function aiShouldDonateZhiba(player, lord = zhibaLordFor(player)) {
    if (!player || !lord) return false;
    if (isPublicLordTo(player, lord) && player.role === "反贼") return false;
    if (isPublicLordTo(player, lord) && (player.role === "忠臣" || player.role === "主公")) return true;
    const relation = supportRelationshipScore(player, lord, "support");
    const teamwork = supportTeamworkScore(player, lord, "support");
    return relation > 0.55 || teamwork > 0.72;
  }

  function lowestPindianDonationCost(player) {
    const card = chooseConcedePindianCard(player, player.hand || []);
    return card ? cardKeepValue(player, card) + rankValue(card.rank) * 0.025 : 2;
  }

  function chooseFanjianSuit(target) {
    const counts = SUITS.map((suit) => ({
      suit,
      count: target.hand.filter((card) => cardSuitFor(target, card) === suit).length
    })).sort((a, b) => b.count - a.count);
    return counts[0]?.suit || randomOf(SUITS);
  }

  function estimatedFanjianHitChance(source, target, card) {
    if (!card) return 0;
    if (canUseExactHandInfo(source, target)) {
      return cardSuitFor(target, card) === chooseFanjianSuit(target) ? 0.08 : 0.92;
    }
    return clamp(0.74 - target.personality.caution * 0.035 + source.personality.trickiness * 0.025, 0.62, 0.82);
  }

  function estimatedHumanFanjianHitChance(source, target, card) {
    if (!card) return 0;
    if (canUseExactHandInfo(source, target)) {
      return cardSuitFor(target, card) === chooseFanjianSuit(target) ? 0.32 : 0.68;
    }
    return clamp(0.66 - target.personality.caution * 0.025 + source.personality.trickiness * 0.02, 0.58, 0.74);
  }

  function aiShouldTieji(source, target) {
    if (!source?.alive || !target?.alive || source.id === target.id) return false;
    const read = attitude(source, target);
    if (read < -0.12) return true;
    if (read > 0.35) return false;
    return target.hp <= 2 || threatScore(source, target) > 1.1;
  }

  function canTriggerLiegong(source, target) {
    return Boolean(source?.alive && target?.alive && (target.hand.length >= source.hp || target.hand.length <= attackRange(source)));
  }

  function aiShouldLiegong(source, target) {
    if (!canTriggerLiegong(source, target)) return false;
    const read = attitude(source, target);
    if (read < -0.08) return true;
    if (read > 0.3) return false;
    return target.hp <= 2 || threatScore(source, target) > 1;
  }

  function canUseExactHandInfo(observer, owner) {
    return Boolean(owner && (state.aiMode === "oracle" || observer?.id === owner.id));
  }

  function hasLowestHp(player) {
    const lowest = Math.min(...alivePlayers().map((p) => p.hp));
    return player.hp <= lowest;
  }

  async function loseMaxHp(player, amount) {
    player.maxHp = Math.max(0, player.maxHp - amount);
    player.hp = Math.min(player.hp, player.maxHp);
    if (player.maxHp <= 0 || player.hp <= 0) {
      await killPlayer(player, null);
    }
  }

  function heal(source, target, amount, message = "") {
    if (!target.alive || target.hp >= target.maxHp) return 0;
    const before = target.hp;
    target.hp = Math.min(target.maxHp, target.hp + amount);
    const healed = target.hp - before;
    log(message || `${nameOf(target)} 回复 ${healed} 点体力。`);
    if (source) updateReadsForHeal(source, target);
    if (healed > 0 && source?.alive && source.id !== target.id && target.alive && hasSkill(target, "enyuan")) {
      drawCards(source, healed, false);
      log(`${nameOf(target)} 的恩怨触发，${nameOf(source)} 摸 ${healed} 张牌。`);
    }
    return healed;
  }

  function createDeck() {
    const deck = [];
    const specByName = Object.fromEntries(CARD_POOL.map((spec) => [spec.name, spec]));
    CARD_DECK_BLUEPRINT.forEach((entry) => {
      const spec = specByName[entry.name];
      if (!spec) throw new Error(`Missing card spec: ${entry.name}`);
      entry.codes.split(/\s+/).filter(Boolean).forEach((code) => {
        deck.push(createCard(spec, code[0], code.slice(1)));
      });
    });
    const expected = CARD_POOL.reduce((sum, spec) => sum + spec.count, 0);
    if (deck.length !== expected) console.warn(`Deck size mismatch: ${deck.length}/${expected}`);
    return deck;
  }

  function createCard(spec, suit, rank) {
    return {
      id: nextCardId++,
      name: spec.name,
      type: spec.type,
      subtype: spec.subtype,
      suit,
      rank,
      range: spec.range || 1,
      nature: spec.nature || DAMAGE.NORMAL,
      delayed: Boolean(spec.delayed),
      ignoreArmor: Boolean(spec.ignoreArmor)
    };
  }

  function virtualCard(base, name, type, subtype, nature = DAMAGE.NORMAL) {
    return {
      id: `v-${base.id}-${name}`,
      name,
      type,
      subtype,
      suit: base.suit,
      rank: base.rank,
      nature,
      virtual: true
    };
  }

  function materializeDelayedCard(card, rawCard, source = null) {
    const base = rawCard && !rawCard.virtual ? rawCard : card;
    return {
      ...base,
      name: card.name,
      type: "trick",
      subtype: card.subtype,
      delayed: true,
      nature: card.nature || base.nature || DAMAGE.NORMAL,
      sourceId: source?.id ?? base.sourceId ?? null,
      originalName: base.name
    };
  }

  function copyCard(card) {
    return {
      ...card,
      id: nextCardId++,
      virtual: false
    };
  }

  function gainDamageCardViaJianxiong(player, card) {
    if (!isGainableDamageCard(card)) return false;
    removeFromDiscard([card]);
    state.players.forEach((holder) => {
      if (holder.id !== player.id) holder.hand = holder.hand.filter((held) => held.id !== card.id);
    });
    if (!player.hand.some((held) => held.id === card.id)) {
      player.hand.push(card);
      noteCardsGained(player, 1);
    }
    return true;
  }

  function isGainableDamageCard(card) {
    return Boolean(
      card
      && !card.virtual
      && Number.isInteger(card.id)
      && card.name
      && CARD_POOL.some((spec) => spec.name === card.name)
      && card.type
      && card.subtype
      && card.suit
      && card.rank
    );
  }

  function render() {
    if (!state.started || state.testMode) return;
    renderLayoutState();
    renderStepControls();
    renderTempoControls();
    renderSettingsPanel();
    $("roundTitle").textContent = topbarRoundTitle();
    renderTableStatusBar();
    $("deckCount").textContent = String(state.deck.length);
    $("discardCount").textContent = String(state.discard.length);
    renderBoard();
    renderHand();
    renderActionBar();
    renderPrompt();
    renderLog();
    renderReads();
    renderCoverage();
    renderCareer();
    renderInfoPanel();
    renderEndGameModal();
    syncNativeTooltips();
  }

  function topbarRoundTitle() {
    if (state.gameOver) return "对局结束";
    return `第 ${state.round} 轮`;
  }

  function topbarActorLabel(current = state.players[state.current]) {
    if (!current) return "等待开始";
    if (state.gameOver) return "已结束";
    return current.isHuman ? "你的回合" : `${shortVisualName(nameOf(current))}行动`;
  }

  function topbarActorTip(current = state.players[state.current], mode = "", detail = "") {
    if (!current) return "当前：等待开始";
    return [
      `当前：${nameOf(current)}`,
      `窗口：${mode || "牌局推进"}`,
      detail || state.status?.phase || ""
    ].filter(Boolean).join("\n");
  }

  function topbarActorMood(current = state.players[state.current]) {
    if (!current || state.gameOver) return "system";
    return current.isHuman ? "human" : "ai";
  }

  function renderTableStatusBar() {
    const bar = $("tableStatusBar");
    if (!bar) return;
    const current = state.players[state.current];
    const mode = state.pending
      ? state.pending.playerId === 0 || state.pending.waitingForId === 0
        ? "需要你响应"
        : "响应窗口"
      : state.cardPick
        ? "选择手牌"
        : state.targetPick
          ? "选择目标"
          : state.playContext
            ? "你的出牌阶段"
            : state.eventStepWaiting
              ? "单步暂停"
              : state.gameOver
                ? "对局结束"
                : current?.isHuman
                  ? "等待你操作"
                  : "AI 行动中";
    const phase = state.status?.phase || spotlightKindLabel((activePreviewSpotlight() || state.spotlight || {}).kind || "system");
    const detail = centerStatusText().replace(/[。.]$/, "");
    const mood = /濒死|死亡|伤害|桃|酒|救援/.test(detail) ? "danger" : /选择|响应|出牌|操作/.test(mode + detail) ? "active" : "calm";
    const active = tablePhaseStepKey(phase, mode);
    const steps = [
      ["prepare", "准备"],
      ["judge", "判定"],
      ["draw", "摸牌"],
      ["play", "出牌"],
      ["discard", "弃牌"],
      ["finish", "结束"]
    ];
    bar.className = `table-status-bar table-status-${mood}`;
    const actorLabel = topbarActorLabel(current);
    const actorTip = topbarActorTip(current, mode, detail || phase);
    bar.innerHTML = `
      <span class="status-actor-pill status-actor-${topbarActorMood()} tip" data-tip="${escapeAttr(actorTip)}">${escapeHtml(actorLabel)}</span>
      ${renderTopbarTurnRoute()}
    ` + steps.map(([key, label]) => `
      <span class="status-pill status-phase-step ${active === key ? "status-phase" : ""} tip" data-tip="${escapeAttr(`${label}阶段\n当前：${current ? nameOf(current) : "等待开始"}\n窗口：${mode}\n${detail || phase}`)}">
        <em>${escapeHtml(label)}</em>
      </span>
    `).join("");
  }

  function renderTopbarTurnRoute() {
    const path = upcomingTurnPlayers(4);
    if (!path.length) return "";
    const current = path[0];
    const next = path[1] || null;
    const routeText = next
      ? `${shortVisualName(nameOf(current))} → ${shortVisualName(nameOf(next))}`
      : shortVisualName(nameOf(current));
    const tip = [
      `出牌方向：${TURN_FLOW.label}`,
      next ? `下家：${nameOf(next)}` : "",
      `顺序：${path.map(nameOf).join(" → ")}`
    ].filter(Boolean).join("\n");
    return `<span class="status-route-pill tip" data-tip="${escapeAttr(tip)}"><i aria-hidden="true"></i><em>${escapeHtml(routeText)}</em></span>`;
  }

  function tablePhaseStepKey(phase, mode) {
    const text = `${phase || ""} ${mode || ""}`;
    if (/弃牌/.test(text)) return "discard";
    if (/结束|对局结束/.test(text)) return "finish";
    if (/出牌|选择目标|选择手牌|需要你响应|响应窗口|等待你操作/.test(text)) return "play";
    if (/摸牌/.test(text)) return "draw";
    if (/判定/.test(text)) return "judge";
    return "prepare";
  }

  function renderLayoutState() {
    const game = $("game");
    const button = $("sidePanelToggle");
    const collapsed = Boolean(state.sidePanelCollapsed);
    game?.classList.toggle("panel-collapsed", collapsed);
    game?.classList.toggle("log-expanded", Boolean(state.logExpanded && state.infoTab === "log" && !collapsed));
    game?.classList.toggle("log-collapsed", Boolean(state.logCollapsed && state.infoTab === "log" && !collapsed));
    if (button) {
      button.textContent = collapsed ? "展开战报" : "收起战报";
      button.classList.toggle("active", !collapsed);
      button.setAttribute("aria-expanded", String(!collapsed));
      button.dataset.tip = collapsed
        ? "展开右侧战报，继续查看牌局记录。"
        : "收起右侧战报，给牌桌留出更多空间。";
    }
  }

  function tempoLabel(value = state.tempo) {
    return {
      ultra: "超慢",
      slow: "慢速",
      normal: "正常",
      fast: "快速"
    }[value] || "正常";
  }

  function renderTempoControls() {
    const select = $("tempoSelect");
    if (select && select.value !== state.tempo) select.value = state.tempo || "normal";
    const label = $("tempoLabel");
    if (label) label.textContent = tempoLabel();
    const quick = $("tempoQuick");
    if (quick) quick.dataset.tip = `节奏设置\n当前：${tempoLabel()}。打开设置面板调整牌局速度。`;
  }

  function openSettingsModal() {
    $("settingsModal")?.classList.remove("hidden");
    renderSettingsPanel();
  }

  function closeSettingsModal() {
    $("settingsModal")?.classList.add("hidden");
  }

  function handleSettingsClick(event) {
    const tempoButton = event.target?.closest?.("[data-tempo-value]");
    if (tempoButton) {
      state.tempo = tempoButton.dataset.tempoValue || "normal";
      if ($("tempoSelect")) $("tempoSelect").value = state.tempo;
      renderTempoControls();
      renderSettingsPanel();
      return;
    }
    const action = event.target?.closest?.("[data-settings-action]")?.dataset?.settingsAction;
    if (!action) return;
    if (action === "step") {
      state.eventStepMode = !state.eventStepMode;
      if (!state.eventStepMode) releaseEventStepWait();
      renderStepControls();
      renderSettingsPanel();
      return;
    }
    if (action === "panel") {
      state.sidePanelCollapsed = !state.sidePanelCollapsed;
      renderLayoutState();
      renderSettingsPanel();
      return;
    }
    if (action === "save") {
      saveMatchAtSafePoint("manual");
      renderSettingsPanel();
      return;
    }
    if (action === "autoplay") {
      activateAutoplayForTurn();
      closeSettingsModal();
      render();
    }
  }

  function renderSettingsPanel() {
    const panel = $("settingsContent");
    if (!panel) return;
    const tempos = [
      ["ultra", "超慢", "适合慢慢看结算"],
      ["slow", "慢速", "保留主要反馈"],
      ["normal", "正常", "更接近快速打牌"],
      ["fast", "快速", "适合观战扫局"]
    ];
    const saveInfo = latestMatchSaveInfo();
    const saveReady = Boolean(saveInfo.at);
    const saveTime = saveReady ? formatCareerDate(saveInfo.at) : "尚未保存";
    const canSave = canSaveMatchNow();
    const advancedOpen = Boolean(state.eventStepMode);
    panel.innerHTML = `
      <section class="settings-group">
        <div class="settings-group-head">
          <strong>牌局节奏</strong>
          <span>当前 ${escapeHtml(tempoLabel())}</span>
        </div>
        <div class="settings-segment" role="group" aria-label="牌局节奏">
          ${tempos.map(([value, label, detail]) => `
            <button type="button" class="${state.tempo === value ? "active" : ""}" data-tempo-value="${escapeAttr(value)}">
              <b>${escapeHtml(label)}</b>
              <small>${escapeHtml(detail)}</small>
            </button>
          `).join("")}
        </div>
      </section>
      <section class="settings-group">
        <div class="settings-group-head">
          <strong>牌桌显示</strong>
          <span>${state.sidePanelCollapsed ? "牌桌优先" : "战报可见"}</span>
        </div>
        <div class="settings-actions">
          <button type="button" class="${state.sidePanelCollapsed ? "" : "active"}" data-settings-action="panel">
            <b>${state.sidePanelCollapsed ? "展开战报" : "收起战报"}</b>
            <small>${state.sidePanelCollapsed ? "恢复右侧战报和战绩面板" : "给牌桌留出更多空间"}</small>
          </button>
        </div>
      </section>
      <section class="settings-group settings-save">
        <div class="settings-group-head">
          <strong>本机保存</strong>
          <span>${saveReady ? `${escapeHtml(matchSaveReasonLabel(saveInfo.reason))} · ${escapeHtml(saveTime)}` : "等待安全点"}</span>
        </div>
        <div class="settings-save-row">
          <p>${saveReady ? "本局会在安全节点自动保存；刷新或关闭后，可以从首页继续最近一次安全牌桌。" : "开局后会在回合开始等安全节点自动保存，避免恢复到半截响应窗口。"}</p>
          <button type="button" data-settings-action="save" ${canSave ? "" : "disabled"}>
            <b>${canSave ? "立即保存" : "结算中"}</b>
            <small>${canSave ? "保存当前安全牌桌" : "保留最近安全点"}</small>
          </button>
        </div>
      </section>
      <details class="settings-group settings-advanced-tools" ${advancedOpen ? "open" : ""}>
        <summary>
          <span>
            <strong>高级辅助</strong>
            <small>单步结算、临时托管</small>
          </span>
          <em>${state.eventStepMode ? "单步中" : "展开"}</em>
        </summary>
        <div class="settings-actions">
          <button type="button" class="${state.eventStepMode ? "active" : ""}" data-settings-action="step">
            <b>${state.eventStepMode ? "关闭单步" : "开启单步"}</b>
            <small>每个事件停一下，适合复盘复杂结算</small>
          </button>
          <button type="button" data-settings-action="autoplay">
            <b>托管本回合</b>
            <small>只托管当前玩家回合，之后交还操作</small>
          </button>
        </div>
      </details>
    `;
  }

  function renderStepControls() {
    const step = $("stepMode");
    const next = $("nextEvent");
    if (step) {
      step.textContent = state.eventStepMode ? "自动继续" : "单步";
      step.classList.toggle("active", state.eventStepMode);
      step.dataset.tip = state.eventStepMode
        ? "关闭单步，事件会按当前节奏自动继续。"
        : "开启后，每个事件会停住，点下一步再继续。";
      step.setAttribute("aria-pressed", String(Boolean(state.eventStepMode)));
    }
    if (next) {
      next.disabled = !state.eventStepMode || !state.eventStepWaiting;
      next.classList.toggle("active", state.eventStepWaiting);
      next.dataset.tip = state.eventStepWaiting
        ? "继续到下一个事件。"
        : "单步模式下，事件停住时才能继续。";
    }
    renderSettingsPanel();
  }

  function renderBoard() {
    promotePendingWaitSpotlight();
    const board = $("board");
    const spotlight = activePreviewSpotlight() || state.spotlight || {
      kind: "system",
      actor: "系统",
      title: "身份局准备中",
      target: "",
      detail: centerStatusText()
    };
    const stageLabel = spotlightKindLabel(spotlight.kind);
    const stageActor = spotlight.actor || currentActorLabel();
    const centerClasses = centerEventClasses(spotlight);
    board.className = `board players-${state.players.length}`;
    board.innerHTML = `
      <div class="center-mat event-kind-${spotlight.kind} ${centerClasses}">
        <div class="event-stage-head">
          <span class="center-symbol" aria-hidden="true">${spotlightIcon(spotlight.kind)}</span>
          <span class="event-chip">${escapeHtml(stageLabel)}</span>
          <small>${escapeHtml(stageActor)}</small>
          ${renderTableHud()}
        </div>
        ${renderEventCast(spotlight)}
        ${renderEventVisual(spotlight)}
        <div class="event-copy">
          <strong>${escapeHtml(spotlight.title || "当前事件")}</strong>
          <small class="center-target">${escapeHtml(spotlight.target ? `目标：${spotlight.target}` : centerStatusText())}</small>
          <em>${escapeHtml(spotlight.detail || spotlight.message || "等待下一步")}</em>
        </div>
      </div>
      ${renderTablePilesDock()}
      <div class="event-trail">${renderEventTrail()}</div>
      ${renderTurnCompass()}
    ` + state.players.map((player) => renderPlayer(player, spotlight)).join("");
    document.querySelectorAll(".player").forEach((node) => {
      const id = Number(node.dataset.id);
      node.addEventListener("click", () => handlePlayerClick(id));
    });
    document.querySelectorAll("[data-note-trigger-id]").forEach((node) => {
      const id = Number(node.dataset.noteTriggerId);
      node.addEventListener("pointerenter", () => openIdentityPopover(id, node, { locked: false }));
      node.addEventListener("pointerleave", scheduleIdentityPopoverClose);
      node.addEventListener("focus", () => openIdentityPopover(id, node, { locked: false }));
      node.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleIdentityPopover(id, node);
      });
    });
  }

  function centerEventClasses(event) {
    const actor = eventActorPlayer(event);
    const targets = eventTargetPlayers(event, actor?.id);
    const mood = eventMood(event);
    return [
      isAreaSpotlightEvent(event) || targets.length > 2 ? "center-event-area" : "",
      targets.length ? "center-event-directed" : "center-event-self",
      event.kind === "damage" || event.kind === "dying" || event.kind === "death" ? "center-event-danger" : "",
      event.kind === "judge" ? "center-event-judge" : "",
      eventResourceCardInfo(event).length ? "center-event-cardlist" : "",
      eventRelationClass(event) ? "center-event-relation" : "",
      eventDeathRoleInfo(event) ? "center-event-death-reveal" : "",
      event.kind === "wait" ? "center-event-wait-clean" : "",
      event.kind === "response" || event.kind === "miss" ? "center-event-response" : "",
      mood ? `center-event-${mood}` : "",
      eventOutcomeBadge(event) ? "center-event-has-outcome" : ""
    ].filter(Boolean).join(" ");
  }

  function renderEventTrail() {
    return (state.eventTrail || [])
      .slice(0, 4)
      .map((event) => `
        <div class="trail-item trail-${event.kind}">
          <span>${escapeHtml(spotlightIcon(event.kind))}</span>
          <div>
            <strong>${escapeHtml(event.title || "事件")}</strong>
            <small>${escapeHtml(trailLine(event))}</small>
          </div>
        </div>
      `)
      .join("");
  }

  function renderEventFace(event) {
    const visual = eventVisualMeta(event);
    const imageClass = "";
    const imageStyle = "";
    return `
      <div class="event-face event-face-${event.kind} event-face-${visual.tone} ${imageClass}" style="${escapeAttr(imageStyle)}">
        <span>${escapeHtml(visual.label)}</span>
        <strong>${escapeHtml(compactEventTitle(visual.title))}</strong>
        <small>${escapeHtml(visual.type)}</small>
        <em>${escapeHtml(visual.footer)}</em>
      </div>
    `;
  }

  function renderEventCast(event) {
    if (event?.kind === "wait") return "";
    const actor = eventActorPlayer(event);
    const targets = eventTargetPlayers(event, actor?.id);
    const area = isAreaSpotlightEvent(event) || targets.length > 2;
    const visibleTargets = targets.slice(0, area ? 5 : 3);
    const visual = eventVisualMeta(event);
    const actionTitle = compactEventTitle(visual.title).replace(/\n/g, " ");
    const outcome = eventOutcomeBadge(event);
    const targetMarkup = visibleTargets.length
      ? visibleTargets.map((target) => renderMiniPortrait(target, "target")).join("")
      : `<span class="cast-empty">${escapeHtml(eventRouteFallback(event))}</span>`;
    const more = targets.length > visibleTargets.length
      ? `<span class="cast-more">+${targets.length - visibleTargets.length}</span>`
      : "";
    const targetLabel = targets.length
      ? area ? `目标 · ${targets.length}` : "目标"
      : "状态";
    const actionImageClass = "";
    const actionImageStyle = "";
    const relationClass = eventRelationClass(event);
    return `
      <div class="event-cast ${area ? "area" : ""} ${targets.length ? "has-target" : "no-target"} ${escapeAttr(relationClass)}">
        <div class="cast-column cast-source">
          ${renderMiniPortrait(actor, "actor")}
          <span>${escapeHtml(actor ? nameOf(actor) : (event.actor || "事件"))}</span>
        </div>
        <div class="cast-action-card event-action-${escapeAttr(visual.tone || event.kind || "system")} event-mood-${escapeAttr(visual.mood || eventMood(event))} ${actionImageClass}" style="${escapeAttr(actionImageStyle)}">
          <span>${escapeHtml(visual.label || spotlightKindLabel(event.kind))}</span>
          <strong>${escapeHtml(actionTitle)}</strong>
          <small>${escapeHtml(visual.type || compactVisualActionLabel(event))}</small>
          ${outcome ? `<b class="event-outcome event-outcome-${escapeAttr(visual.mood || eventMood(event))}">${escapeHtml(outcome)}</b>` : ""}
        </div>
        <div class="cast-column cast-destination">
          <div class="cast-targets">${targetMarkup}${more}</div>
          <span>${escapeHtml(targetLabel)}</span>
        </div>
        <div class="cast-settlement-lane" aria-hidden="true">
          <i class="lane-dot lane-source"></i>
          <span class="lane-segment"></span>
          <i class="lane-card"></i>
          <span class="lane-segment"></span>
          <i class="lane-dot lane-target"></i>
        </div>
      </div>
    `;
  }

  function currentSkillEntries(player) {
    if (!player) return [];
    const entries = [];
    const seen = new Set();
    const add = (skill, source) => {
      if (!skill || seen.has(skill)) return;
      seen.add(skill);
      entries.push({
        skill,
        source,
        disabled: player.disabledSkills?.includes(skill),
        limited: isLimitedSkill(skill),
        spent: isLimitedSkillSpent(player, skill)
      });
    };
    (player.general.skills || []).forEach((skill) => add(skill, "base"));
    (player.extraSkills || []).forEach((skill) => add(skill, "extra"));
    (player.tempSkills || []).forEach((skill) => add(skill, "temp"));
    return entries;
  }

  function skillSourceLabel(source) {
    if (source === "extra") return "新";
    if (source === "temp") return "临";
    return "";
  }

  function isLimitedSkill(skill) {
    return LIMITED_SKILLS.has(skill);
  }

  function isLimitedSkillSpent(player, skill) {
    if (!player || !isLimitedSkill(skill)) return false;
    if (skill === "luanwu") return Boolean(player.flags?.luanwuUsed);
    if (skill === "niepan") return Boolean(player.flags?.niepanUsed);
    return false;
  }

  function skillSourceText(source) {
    if (source === "extra") return "来源：额外获得的技能。";
    if (source === "temp") return "来源：临时技能，通常只在当前阶段、当前回合或特定条件内有效。";
    return "来源：武将初始技能。";
  }

  function currentSkillTip(entry) {
    const prefix = entry.source === "extra" ? "获得技能" : entry.source === "temp" ? "临时技能" : "初始技能";
    const limited = entry.limited ? `限定技：${entry.spent ? "已发动，本局不能再次发动。" : "本局限一次，尚未发动。"}` : "";
    const status = entry.disabled
      ? "状态：已失效，当前不能发动。"
      : entry.spent
        ? "状态：已用完。"
        : "状态：可发动或可生效。";
    return `${prefix}\n${skillTooltipText(entry.skill)}\n${skillSourceText(entry.source)}${limited ? `\n${limited}` : ""}\n${status}`;
  }

  function currentSkillSummary(player, separator = "；") {
    const entries = currentSkillEntries(player);
    if (!entries.length) return "无技能";
    return entries.map((entry) => {
      const name = SKILL_TEXT[entry.skill] || entry.skill;
      const source = skillSourceLabel(entry.source);
      const stateParts = [];
      if (entry.disabled) stateParts.push("失效");
      if (source) stateParts.push(`${source}获`);
      if (entry.limited) stateParts.push(entry.spent ? "限定已用" : "限定");
      const stateText = stateParts.join("/");
      return `${name}${stateText ? `(${stateText})` : ""}：${SKILL_RULE_TEXT[entry.skill] || coverageNote(skillCoverageStatus(entry.skill), entry.skill)}`;
    }).join(separator);
  }

  function renderMiniPortrait(player, role = "") {
    if (!player) {
      return `<span class="mini-portrait unknown ${role}"><i class="portrait-shape" aria-hidden="true"></i><b class="portrait-crest">?</b><strong class="portrait-name">未知</strong><small>未知</small></span>`;
    }
    const tip = `${nameOf(player)}\n${player.general.name} · ${player.general.kingdom} · ${player.maxHp}体力\n${currentSkillSummary(player, "\n")}`;
    return `
      <span class="mini-portrait tip ${kingdomClass(player.general.kingdom)} gender-${escapeAttr(player.general.gender || "unknown")} ${role}" style="${escapeAttr(portraitVars(player))}" data-tip="${escapeAttr(tip)}">
        <i class="portrait-shape" aria-hidden="true"></i>
        <b class="portrait-crest">${escapeHtml(player.general.kingdom)}</b>
        <strong class="portrait-name">${escapeHtml(portraitDisplayName(player.general.name))}</strong>
        <small>${escapeHtml(player.isHuman ? "你" : `座${player.seat + 1}`)}</small>
      </span>
    `;
  }

  function eventActorPlayer(event) {
    const explicit = event?.actorId != null ? playerById(event.actorId) : null;
    if (explicit) return explicit;
    const parsed = findPlayerIdInText(event?.actor || event?.detail || event?.message || "");
    return playerById(parsed) || playerById(state.current) || state.players[0] || null;
  }

  function eventTargetPlayers(event, actorId = null) {
    if (!event) return [];
    let ids = Array.isArray(event.targetIds) && event.targetIds.length
      ? [...event.targetIds]
      : playerIdsFromText(`${event.target || ""} ${event.detail || ""} ${event.message || ""}`);
    if (!ids.length) ids = areaEventTargetIds(event, actorId);
    const allowSelfTarget = ["damage", "dying", "death", "heal", "chain", "skip"].includes(event.kind);
    const seen = new Set();
    return ids
      .filter((id) => id != null && (allowSelfTarget || id !== actorId) && !seen.has(id) && seen.add(id))
      .map(playerById)
      .filter(Boolean);
  }

  function renderTurnCompass() {
    const current = playerById(state.current);
    const next = currentNextPlayerId();
    const nextPlayer = next == null ? null : playerById(next);
    const path = upcomingTurnPlayers(3);
    const tip = [
      `出牌方向：${TURN_FLOW.label}（${TURN_FLOW.humanNextHint}）`,
      current ? `当前：${nameOf(current)}` : "",
      nextPlayer ? `下家：${nameOf(nextPlayer)}` : "",
      path.length ? `顺序：${path.map(nameOf).join(" → ")}` : ""
    ].filter(Boolean).join("\n");
    return `
      <div class="turn-compass tip" data-tip="${escapeAttr(tip)}">
        <span class="turn-ring"><i></i></span>
        <b>${escapeHtml(TURN_FLOW.label)} · 下家</b>
        <small>${escapeHtml(nextPlayer ? `下家 ${shortVisualName(nameOf(nextPlayer))}` : "等待")}</small>
        <div class="turn-path" aria-hidden="true">
          ${path.map((player, index) => `
            ${index ? `<span class="turn-path-arrow">→</span>` : ""}
            ${renderMiniPortrait(player, `flow ${index === 0 ? "flow-current" : index === 1 ? "flow-next" : ""}`)}
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderTableHud() {
    const actor = playerById(state.status.actorId ?? state.current);
    const next = currentNextPlayerId();
    const nextPlayer = next == null ? null : playerById(next);
    const latestDiscard = state.discard[state.discard.length - 1];
    const phase = compactTablePhaseLabel();
    const discardTip = latestDiscard
      ? `弃牌堆：${state.discard.length} 张\n最新：${cardTooltipText(latestDiscard)}`
      : `弃牌堆：${state.discard.length} 张`;
    const phaseTip = [
      actor ? `当前行动：${nameOf(actor)}` : "当前行动：牌桌",
      `阶段：${state.status.phase || "等待"}`,
      state.status.waitPrompt ? `等待：${state.status.waitPrompt}` : "",
      state.pending?.prompt ? `提示：${state.pending.prompt}` : ""
    ].filter(Boolean).join("\n");
    const nextTip = [
      `出牌方向：${TURN_FLOW.label}（${TURN_FLOW.humanNextHint}）`,
      nextPlayer ? `下家：${nameOf(nextPlayer)}` : "下家：等待",
      upcomingTurnPlayers(4).length ? `顺序：${upcomingTurnPlayers(4).map(nameOf).join(" → ")}` : ""
    ].filter(Boolean).join("\n");
    return `
      <div class="table-hud" aria-label="牌桌状态">
        <span class="table-hud-chip table-hud-phase tip" data-tip="${escapeAttr(phaseTip)}"><b>阶段</b><em>${escapeHtml(phase)}</em></span>
        <span class="table-hud-chip table-hud-deck tip" data-tip="${escapeAttr(`牌堆：${state.deck.length} 张`)}"><b>牌堆</b><em>${state.deck.length}</em></span>
        <span class="table-hud-chip table-hud-discard tip" data-tip="${escapeAttr(discardTip)}"><b>弃牌</b><em>${state.discard.length}${latestDiscard ? ` · ${escapeHtml(compactCardLabel(latestDiscard))}` : ""}</em></span>
        <span class="table-hud-chip table-hud-next tip" data-tip="${escapeAttr(nextTip)}"><b>下家</b><em>${escapeHtml(nextPlayer ? shortVisualName(nameOf(nextPlayer)) : "等待")}</em></span>
      </div>
    `;
  }

  function compactTablePhaseLabel() {
    if (state.gameOver) return "结束";
    if (state.cardPick) return "选牌";
    if (state.targetPick) return "选目标";
    if (state.pending) return "等待选择";
    const raw = state.status.waitKind || state.status.phase || "进行中";
    return String(raw).replace(/阶段$/, "") || "进行中";
  }

  function compactCardLabel(card) {
    if (!card) return "无";
    return `${card.suit}${card.rank} ${cardDisplayName(card)}`;
  }

  function renderTablePilesDock() {
    const latestDiscard = state.discard[state.discard.length - 1];
    const judgeCards = state.players
      .flatMap((player) => player.judgeArea.map((card) => ({ player, card })));
    const latestJudge = judgeCards[judgeCards.length - 1];
    const judgeTip = judgeCards.length
      ? `全场判定区：${judgeCards.length} 张\n${judgeCards.map(({ player, card }) => `${nameOf(player)}：${cardName(card)}`).join("\n")}`
      : "全场判定区：暂无延时锦囊";
    return `
      <div class="table-piles-dock" aria-label="牌桌牌堆">
        <div class="table-pile table-pile-deck tip" data-tip="${escapeAttr(`牌堆：${state.deck.length} 张\n摸牌、判定都从这里翻开。`)}">
          <span class="pile-card-back" aria-hidden="true"><i></i></span>
          <b>牌堆</b>
          <em>${state.deck.length}</em>
        </div>
        <div class="table-pile table-pile-discard tip" data-tip="${escapeAttr(latestDiscard ? `弃牌堆：${state.discard.length} 张\n最新：${cardTooltipText(latestDiscard)}` : "弃牌堆：暂无牌")}">
          ${renderPileCardFace(latestDiscard, "弃")}
          <b>弃牌</b>
          <em>${latestDiscard ? escapeHtml(cardDisplayName(latestDiscard)) : "空"}</em>
        </div>
        <div class="table-pile table-pile-judge tip" data-tip="${escapeAttr(judgeTip)}">
          ${renderPileCardFace(latestJudge?.card, "判")}
          <b>判定区</b>
          <em>${judgeCards.length ? `${judgeCards.length}张` : "空"}</em>
        </div>
      </div>
    `;
  }

  function renderPileCardFace(card, fallback) {
    if (!card) {
      return `<span class="pile-card-face pile-card-empty" aria-hidden="true"><strong>${escapeHtml(fallback)}</strong><em>空</em></span>`;
    }
    return `
      <span class="pile-card-face ${isRed(card) ? "red" : ""}" aria-hidden="true">
        <strong>${escapeHtml(`${card.suit}${card.rank}`)}</strong>
        <em>${escapeHtml(cardDisplayName(card))}</em>
      </span>
    `;
  }

  function currentNextPlayerId() {
    if (!state.players.length || state.gameOver) return null;
    const next = nextAliveIndex(state.current);
    return next === state.current ? null : next;
  }

  function upcomingTurnPlayers(count = 3) {
    if (!state.players.length || state.gameOver) return [];
    const path = [];
    let id = state.current;
    const seen = new Set();
    while (path.length < count && !seen.has(id)) {
      seen.add(id);
      const player = playerById(id);
      if (player?.alive) path.push(player);
      const next = nextAliveIndex(id);
      if (next === id) break;
      id = next;
    }
    return path;
  }

  function activePreviewSpotlight() {
    if (state.gameOver) return null;
    if (state.cardPick) {
      const owner = playerById(state.cardPick.ownerId ?? state.status.waitingForId ?? state.current);
      const selected = (state.cardPick.selected || [])
        .map((id) => owner?.hand.find((card) => card.id === id))
        .filter(Boolean);
      return {
        id: 0,
        kind: "wait",
        actor: owner ? nameOf(owner) : "玩家",
        title: "选择手牌",
        target: "",
        detail: selected.length
          ? `已选：${selected.map((card) => card.name).join("、")}`
          : `需要选择 ${state.cardPick.min}${state.cardPick.max !== state.cardPick.min ? `-${state.cardPick.max}` : ""} 张牌。`,
        message: state.cardPick.prompt || "",
        actorId: owner?.id ?? null,
        targetIds: [],
        damageIds: []
      };
    }
    if (state.targetPick?.previewAction) {
      const owner = playerById(state.targetPick.ownerId ?? state.status.waitingForId ?? state.current);
      const action = state.targetPick.previewAction;
      const selectedIds = state.targetPick.selected || [];
      const ids = selectedIds.length ? selectedIds : (state.targetPick.validIds || []).slice(0, Math.min(4, state.targetPick.max || 1));
      const targets = ids.map(playerById).filter(Boolean);
      return {
        id: 0,
        kind: action.type === "skill" ? "skill" : "card",
        actor: owner ? nameOf(owner) : "玩家",
        title: actionPreviewTitle(action),
        target: targets.map(nameOf).join("、"),
        detail: selectedIds.length ? "已选目标，等待确认。" : "选择目标后确认使用。",
        message: state.targetPick.prompt || "",
        actorId: owner?.id ?? null,
        targetIds: ids,
        damageIds: []
      };
    }
    if (state.playContext?.playerId === 0 && state.playCardId) {
      const human = playerById(state.playContext.playerId);
      const actions = playActionsForCard(state.playCardId);
      const card = human?.hand.find((item) => item.id === state.playCardId);
      const action = actions[0];
      return {
        id: 0,
        kind: action?.type === "skill" ? "skill" : "card",
        actor: human ? nameOf(human) : "玩家",
        title: action ? actionPreviewTitle(action) : card?.name || "已选手牌",
        target: "",
        detail: actions.length > 1 ? "这张牌有多种用法，请在下方选择。" : "准备使用这张牌。",
        message: card ? cardRuleText(card) : "",
        actorId: human?.id ?? null,
        targetIds: [],
        damageIds: []
      };
    }
    return null;
  }

  function actionPreviewTitle(action) {
    if (!action) return "准备行动";
    if (action.type === "skill") return SKILL_TEXT[action.skill] || action.label || action.skill || "技能";
    return action.label || action.card?.name || "使用牌";
  }

  function renderPlayer(player, spotlight = state.spotlight) {
    const hp = Array.from({ length: player.maxHp }, (_, i) => `<span class="heart hp-gem ${i < Math.max(0, player.hp) ? "on" : ""}"></span>`).join("");
    const equipCards = Object.values(player.equip);
    const equip = equipCards.map(cardDisplayName).join(" / ") || "无装备";
    const equipTitle = equipCards.map(equipmentRuleText).filter(Boolean).join("；") || equip;
    const delayed = player.judgeArea.map((c) => c.name).join(" / ") || "无判定";
    const delayedTitle = player.judgeArea.map(cardRuleText).filter(Boolean).join("；") || delayed;
    const visibleRole = player.revealed || state.debug ? player.role : "?";
    const roleClass = player.revealed || state.debug ? `role-${roleToNote(player.role)}` : "role-unknown";
    const note = state.roleNotes[player.id] || "unknown";
    const trueRoleTip = `${player.revealed || state.debug ? `真实身份：${player.role}` : "真实身份：未公开"}\n主公公开；其他身份只在阵亡或调试显示时公开。`;
    const noteTip = `我的标注：${ROLE_NOTE_LONG[note] || ROLE_NOTE_LONG.unknown}\n仅作为你的个人判断；不影响 AI、真实身份或胜负结算。点击切换。`;
    const targetable = state.targetPick?.validIds?.includes(player.id);
    const selected = state.targetPick?.selected?.includes(player.id);
    const eventClasses = playerEventClasses(player, spotlight);
    const nextId = currentNextPlayerId();
    const turnClasses = `${state.current === player.id ? "turn-active" : ""} ${nextId === player.id ? "next-turn" : ""}`;
    const handCount = player.hand.length;
    const skillEntries = currentSkillEntries(player);
    const visibleSkillEntries = skillEntries.slice(0, 3);
    const hiddenSkillEntries = skillEntries.slice(3);
    const generalTip = playerInfoTooltipText(player);
    const skills = visibleSkillEntries.map((entry) => {
      const source = skillSourceLabel(entry.source);
      const sourceBadge = source ? `<small>${escapeHtml(source)}</small>` : "";
      const limitedBadge = entry.limited ? `<small class="${entry.spent ? "spent" : "limited"}">${entry.spent ? "已" : "限"}</small>` : "";
      const stateClasses = [
        `skill-${entry.source}`,
        entry.disabled ? "skill-disabled" : "",
        entry.limited ? "skill-limited" : "",
        entry.spent ? "skill-spent" : ""
      ].filter(Boolean).join(" ");
      return `<span class="skill-tag ${stateClasses} tip" data-tip="${escapeAttr(currentSkillTip(entry))}">${SKILL_TEXT[entry.skill] || entry.skill}${sourceBadge}${limitedBadge}</span>`;
    }).join("") + (hiddenSkillEntries.length
      ? `<span class="skill-tag skill-more tip" data-tip="${escapeAttr(hiddenSkillEntries.map(currentSkillTip).join("\n\n"))}">+${hiddenSkillEntries.length}</span>`
      : "") || `<span class="skill-tag muted">无技能</span>`;
    const readBadge = renderPlayerReadBadge(player);
    const statusBadges = [
      player.linked ? "横置" : "",
      player.flags.skipTurnOnce ? "翻面" : "",
      player.drunk ? "酒" : "",
      !player.alive ? "阵亡" : ""
    ].filter(Boolean);
    const metaChips = [
      `<span class="hand-count tip" data-tip="公开手牌数：${handCount}">手${handCount}</span>`,
      equipCards.length ? `<span class="tip" data-tip="${escapeAttr(equipTitle)}">装${equipCards.length}</span>` : "",
      player.judgeArea.length ? `<span class="tip" data-tip="${escapeAttr(delayedTitle)}">判${player.judgeArea.length}</span>` : ""
    ].filter(Boolean).join("");
    return `
      <article class="player p${player.id} ${player.isHuman ? "human" : ""} ${state.current === player.id ? "current" : ""} ${turnClasses} ${player.alive ? "" : "dead"} ${state.targetPick ? "target-mode" : ""} ${state.targetPick && player.alive && !targetable ? "untargetable" : ""} ${targetable ? "targetable" : ""} ${selected ? "selected-target" : ""} ${eventClasses} manual-note-${note}" data-id="${player.id}" data-seat="${player.seat}" data-next-seat="${nextAliveIndex(player.id)}" data-note="${escapeAttr(note)}" style="${escapeAttr(portraitVars(player))}">
        <div class="seat-focus" aria-hidden="true"></div>
        ${renderTurnBadges(player)}
        ${renderPlayerEventMarker(player, spotlight)}
        <div class="player-head">
          <div class="avatar-row">
            <div class="avatar portrait tip ${kingdomClass(player.general.kingdom)} gender-${escapeAttr(player.general.gender || "unknown")}" style="${escapeAttr(portraitVars(player))}" data-tip="${escapeAttr(generalTip)}">
              <i class="portrait-shape" aria-hidden="true"></i>
              <b class="portrait-crest">${escapeHtml(player.general.kingdom)}</b>
              <span class="portrait-kingdom">${escapeHtml(player.general.kingdom)}</span>
              <strong class="portrait-name">${escapeHtml(portraitDisplayName(player.general.name))}</strong>
            </div>
            <div>
              <div class="player-name">${nameOf(player)}</div>
              <div class="general">${player.general.name} · ${player.general.kingdom}</div>
            </div>
          </div>
          <div class="role-stack compact-role">
            <div class="role tip ${roleClass} ${player.revealed || state.debug ? "revealed" : ""}" data-tip="${escapeAttr(trueRoleTip)}">${visibleRole}</div>
            <button type="button" class="role-note note-${note}" data-note-trigger-id="${player.id}" aria-label="${escapeAttr(noteTip)}" aria-haspopup="dialog" aria-expanded="false">${ROLE_NOTE_LABEL[note] || ROLE_NOTE_LABEL.unknown}</button>
          </div>
        </div>
        <div class="seat-status">
          <div class="hp">${hp}</div>
          ${statusBadges.map((status) => `<span>${escapeHtml(status)}</span>`).join("")}
        </div>
        <div class="player-meta">
          ${metaChips}
        </div>
        <div class="player-zones">
          ${renderStateZone(player)}
          ${renderEquipZone(player)}
          ${renderJudgeZone(player)}
        </div>
        ${readBadge}
        <div class="skills">${skills}</div>
      </article>
    `;
  }

  function renderEquipZone(player) {
    const slots = ["weapon", "armor", "plusHorse", "minusHorse"];
    const chips = slots
      .map((slot) => [slot, player.equip[slot]])
      .filter(([, card]) => card)
      .map(([slot, card]) => `
        <span class="zone-chip zone-equip tip" data-tip="${escapeAttr(equipmentRuleText(card))}">
          <b>${escapeHtml(equipSlotLabel(slot))}</b>${escapeHtml(cardDisplayName(card))}
        </span>
      `)
      .join("");
    if (!chips) return "";
    return `
      <div class="zone-line equip-line">
        <strong>装</strong>
        <div>${chips}</div>
      </div>
    `;
  }

  function renderStateZone(player) {
    const chips = [
      player.linked ? ["铁索", "已被铁索连环横置，属性伤害会传导。", "chain"] : null,
      player.flags.skipTurnOnce ? ["翻面", "武将牌背面朝上；下个自己的回合会翻回并跳过。", "flip"] : null,
      player.flags.skipPlayOnce ? ["跳出牌", "本回合将跳过出牌阶段。", "skip"] : null,
      player.flags.skipDrawOnce ? ["跳摸牌", "本回合将跳过摸牌阶段。", "skip"] : null,
      player.drunk ? ["酒", "酒状态：下一张杀伤害 +1。", "wine"] : null,
      !player.alive ? ["阵亡", "该角色已阵亡，身份已公开。", "dead"] : null
    ].filter(Boolean).map(([label, tip, kind]) => `
      <span class="zone-chip zone-state zone-state-${kind} tip" data-tip="${escapeAttr(tip)}">${escapeHtml(label)}</span>
    `).join("");
    if (!chips) return "";
    return `
      <div class="zone-line state-line">
        <strong>态</strong>
        <div>${chips}</div>
      </div>
    `;
  }

  function renderJudgeZone(player) {
    const chips = player.judgeArea
      .map((card) => `
        <span class="zone-chip zone-judge tip" data-tip="${escapeAttr(cardRuleText(card))}">
          ${escapeHtml(card.name)}
        </span>
      `)
      .join("");
    if (!chips) return "";
    return `
      <div class="zone-line judge-line">
        <strong>判</strong>
        <div>${chips}</div>
      </div>
    `;
  }

  function equipSlotLabel(slot) {
    return {
      weapon: "武",
      armor: "防",
      plusHorse: "+1",
      minusHorse: "-1"
    }[slot] || "装";
  }

  function renderPlayerReadBadge(player) {
    if (!state.debug) return "";
    const observer = readObserver();
    if (!observer || observer.id === player.id) {
      return `<div class="read-mini read-mini-self">AI判断：自身</div>`;
    }
    const read = state.reads[observer.id]?.[player.id] || 0;
    const label = readLabel(read);
    const reasons = state.readReasons[observer.id]?.[player.id] || [];
    const tip = `AI判断：${label.text}\n观察视角：${nameOf(observer)}\n${reasons.length ? reasons.join("\n") : "暂无可见行为证据"}\n此标签只显示 AI 的公开推理，不代表真实身份。`;
    return `<div class="read-mini read-mini-${label.key} tip" data-tip="${escapeAttr(tip)}">AI ${label.text}</div>`;
  }

  function playerInfoTooltipText(player) {
    if (!player) return "武将信息\n暂无技能信息";
    const roleText = player.revealed || player.isHuman || state.debug ? player.role : "身份未公开";
    const skillLines = currentSkillEntries(player).map((entry) => {
      const name = SKILL_TEXT[entry.skill] || entry.skill;
      const source = skillSourceLabel(entry.source);
      const stateParts = [
        source ? `${source}获得` : "",
        entry.limited ? (entry.spent ? "限定已用" : "限定技") : "",
        entry.disabled ? "当前失效" : ""
      ].filter(Boolean);
      const stateText = stateParts.length ? `（${stateParts.join(" / ")}）` : "";
      return `${name}${stateText}：${SKILL_RULE_TEXT[entry.skill] || coverageNote(skillCoverageStatus(entry.skill), entry.skill)}`;
    });
    return [
      `${nameOf(player)} · ${player.general.kingdom} · ${Math.max(0, player.hp)}/${player.maxHp}体力`,
      `身份：${roleText}`,
      skillLines.length ? "技能：" : "暂无技能信息",
      ...skillLines
    ].join("\n");
  }

  function renderRoleNoteChoices(playerId, currentNote) {
    const choices = [
      ["lord", "主"],
      ["loyal", "忠"],
      ["rebel", "反"],
      ["traitor", "内"],
      ["unknown", "清除"]
    ];
    return choices.map(([value, label]) => {
      const long = ROLE_NOTE_LONG[value] || ROLE_NOTE_LONG.unknown;
      return `<button type="button" class="identity-mark-option mark-${value} ${currentNote === value ? "active" : ""}" data-note-id="${playerId}" data-note-value="${value}" aria-label="${escapeAttr(long)}"><span>${label}</span></button>`;
    }).join("");
  }

  function renderTurnBadges(player) {
    const badges = [];
    const waitOwnerId = state.pending?.ownerId
      ?? state.cardPick?.ownerId
      ?? state.targetPick?.ownerId
      ?? state.status.waitingForId;
    if (waitOwnerId === player.id && !state.gameOver) {
      badges.push(`<span class="turn-badge badge-active">待操作</span>`);
    } else if (state.status.actorId === player.id && !state.gameOver) {
      badges.push(`<span class="turn-badge badge-active">行动中</span>`);
    } else if (state.current === player.id && !state.gameOver) {
      badges.push(`<span class="turn-badge badge-active">回合中</span>`);
    }
    if (currentNextPlayerId() === player.id) {
      badges.push(`<span class="turn-badge badge-next">下家</span>`);
    }
    return badges.length ? `<div class="turn-badges">${badges.join("")}</div>` : "";
  }

  function renderHand() {
    const human = state.players[0];
    const mode = handModeCue();
    const hp = Array.from({ length: human.maxHp }, (_, i) => `<span class="heart hp-gem ${i < Math.max(0, human.hp) ? "on" : ""}"></span>`).join("");
    const handPanel = document.querySelector(".hand-panel");
    if (handPanel) {
      handPanel.classList.remove(
        "hand-state-danger",
        "hand-state-response",
        "hand-state-pick",
        "hand-state-target",
        "hand-state-play",
        "hand-state-pause",
        "hand-state-idle"
      );
      handPanel.classList.add(`hand-state-${mode.kind}`);
    }
    const humanNameNode = $("humanName");
    if (humanNameNode) {
      humanNameNode.classList.add("tip", "human-skill-trigger");
      humanNameNode.dataset.tip = playerInfoTooltipText(human);
      delete humanNameNode.dataset.nativeTitle;
      humanNameNode.removeAttribute("title");
      humanNameNode.innerHTML = `
        <span class="human-seat-portrait portrait ${kingdomClass(human.general.kingdom)} gender-${escapeAttr(human.general.gender || "unknown")}" style="${escapeAttr(portraitVars(human))}">
          <i class="portrait-shape" aria-hidden="true"></i>
        </span>
        <span class="human-seat-copy">
          <span class="human-seat-name">${escapeHtml(human.general.name)}</span>
          <span class="human-seat-role role-${roleToNote(human.role)}">${escapeHtml(human.role)}</span>
          <span class="human-seat-hp">${hp}<em>${Math.max(0, human.hp)} / ${human.maxHp}</em></span>
        </span>
      `;
    }
    $("humanStats").innerHTML = renderHumanSeatStats(human);
    const handMode = $("handMode");
    if (handMode) {
      handMode.className = `hand-mode tip hand-mode-${mode.kind}`;
      handMode.innerHTML = `
        <div class="hand-mode-mark" aria-hidden="true">${escapeHtml(handModeMark(mode.kind))}</div>
        <div class="hand-mode-copy">
          <strong>${escapeHtml(mode.title)}</strong>
          <span>${escapeHtml(mode.detail)}</span>
        </div>
        ${handFlowStepsHtml(mode.kind)}
      `;
      handMode.dataset.tip = mode.tip;
    }
    $("hand").innerHTML = human.hand.map((card) => renderCard(card, isCardSelected(card), isCardPickable(card), cardPlayMeta(card))).join("");
    document.querySelectorAll(".card").forEach((node) => {
      node.addEventListener("click", () => handleCardClick(Number(node.dataset.id)));
    });
  }

  function renderHumanSeatStats(human) {
    const chips = [];
    const equipSlots = ["weapon", "armor", "plusHorse", "minusHorse"];
    equipSlots.forEach((slot) => {
      const card = human.equip?.[slot];
      if (!card) return;
      chips.push(`
        <span class="human-stat-chip human-stat-equip tip" data-tip="${escapeAttr(equipmentRuleText(card))}">
          <b>${escapeHtml(equipSlotLabel(slot))}</b>${escapeHtml(cardDisplayName(card))}
        </span>
      `);
    });
    (human.judgeArea || []).forEach((card) => {
      chips.push(`
        <span class="human-stat-chip human-stat-judge tip" data-tip="${escapeAttr(cardRuleText(card))}">
          <b>判</b>${escapeHtml(cardDisplayName(card))}
        </span>
      `);
    });
    const states = [
      human.linked ? ["铁索", "已被铁索连环横置，属性伤害会传导。", "chain"] : null,
      human.flags?.skipTurnOnce ? ["翻面", "武将牌背面朝上；下个自己的回合会翻回并跳过。", "flip"] : null,
      human.flags?.skipPlayOnce ? ["跳出牌", "本回合将跳过出牌阶段。", "skip"] : null,
      human.flags?.skipDrawOnce ? ["跳摸牌", "本回合将跳过摸牌阶段。", "skip"] : null,
      human.drunk ? ["酒", "酒状态：下一张杀伤害 +1。", "wine"] : null
    ].filter(Boolean);
    states.forEach(([label, tip, kind]) => {
      chips.push(`<span class="human-stat-chip human-stat-state human-stat-${kind} tip" data-tip="${escapeAttr(tip)}">${escapeHtml(label)}</span>`);
    });
    return chips.join("");
  }

  function handModeMark(kind) {
    return {
      danger: "救",
      response: "应",
      pick: "选",
      target: "准",
      play: "出",
      pause: "停",
      idle: "观"
    }[kind] || "牌";
  }

  function handFlowStepsHtml(kind) {
    const stepsByKind = {
      danger: ["看求救", "用桃/酒", "脱险"],
      response: ["看提示", "选响应", "结算"],
      pick: ["点手牌", "确认", "结算"],
      target: ["点目标", "确认", "出牌"],
      play: ["点手牌", "选目标", "结算"],
      pause: ["看事件", "下一步"],
      idle: ["观测牌桌"]
    };
    const activeByKind = {
      danger: 1,
      response: 1,
      pick: 0,
      target: 0,
      play: state.playCardId ? 1 : 0,
      pause: 1,
      idle: 0
    };
    const steps = stepsByKind[kind] || stepsByKind.idle;
    const active = activeByKind[kind] ?? 0;
    return `
      <div class="hand-flow" aria-label="当前操作流程">
        ${steps.map((step, index) => `
          <span class="${index < active ? "done" : index === active ? "active" : ""}">
            <i>${index + 1}</i>${escapeHtml(step)}
          </span>
        `).join("")}
      </div>
    `;
  }

  function handModeCue() {
    if (state.pending) {
      const prompt = state.pending.prompt || "请选择一个操作。";
      const danger = /濒死|伤害|桃|酒|死亡/.test(prompt);
      return {
        kind: danger ? "danger" : "response",
        title: danger ? "关键响应" : "响应窗口",
        detail: prompt,
        tip: `当前需要你选择。\n${prompt}\n可用按钮在手牌下方。`
      };
    }
    if (state.cardPick) {
      const selected = state.cardPick.selected?.length || 0;
      const range = state.cardPick.min === state.cardPick.max ? `${state.cardPick.max}` : `${state.cardPick.min}-${state.cardPick.max}`;
      return {
        kind: "pick",
        title: "选择手牌",
        detail: `已选 ${selected} / 需要 ${range} 张`,
        tip: `${state.cardPick.prompt || "请选择手牌。"}\n点亮的牌可以选择；选完后点确认。`
      };
    }
    if (state.targetPick) {
      return {
        kind: "target",
        title: "选择目标",
        detail: targetPickHint(),
        tip: targetPickDetailText()
      };
    }
    if (state.playContext) {
      const selectedCard = state.playCardId ? state.players[0].hand.find((card) => card.id === state.playCardId) : null;
      if (selectedCard) {
        const actions = playActionsForCard(selectedCard.id);
        return {
          kind: "play",
          title: "已选手牌",
          detail: `${cardName(selectedCard)} · ${actions.length ? "选择用法" : "暂无可用用法"}`,
          tip: playContextTip(selectedCard, actions)
        };
      }
      return {
        kind: "play",
        title: "出牌阶段",
        detail: "点亮的牌可直接使用",
        tip: playContextTip(null, state.playContext.actions || [])
      };
    }
    if (state.eventStepWaiting) {
      const title = state.spotlight?.title || "当前事件";
      return {
        kind: "pause",
        title: "单步暂停",
        detail: title,
        tip: "单步模式暂停中。\n点击下一步继续结算。"
      };
    }
    const current = state.players[state.current];
    if (current?.isHuman) {
      return {
        kind: "idle",
        title: "准备你的回合",
        detail: "牌桌正在结算，稍后会提示可用操作",
        tip: "当前没有需要你确认的手牌操作。\n进入出牌或响应窗口后，手牌区会切换为可点击状态。"
      };
    }
    return {
      kind: "idle",
      title: current ? `${shortVisualName(nameOf(current))}正在行动` : "等待牌桌",
      detail: centerStatusText(),
      tip: "当前没有需要你处理的手牌操作。"
    };
  }

  function renderCard(card, selected, enabled, playMeta = { label: "", detail: "", key: "" }) {
    const tip = [cardTooltipText(card), playMeta.detail ? `操作：${playMeta.detail}` : ""].filter(Boolean).join("\n");
    const suppressTip = Boolean(state.targetPick);
    const displayName = cardDisplayName(card);
    const longName = displayName.length >= 4;
    const playClass = playMeta.key ? `card-${playMeta.key}` : "";
    const toneClass = cardToneClass(card);
    return `
      <button class="card mock-card ${suppressTip ? "" : "tip"} ${longName ? "long-name" : ""} ${playClass} ${toneClass} tone-${cardDisplayTone(card)} ${isCardRedSuit(card) ? "red" : ""} ${selected ? "selected" : ""} ${enabled ? "" : "disabled"}" data-id="${card.id}" ${suppressTip ? "" : `data-tip="${escapeAttr(tip)}"`} aria-label="${escapeAttr(tip)}" aria-disabled="${enabled ? "false" : "true"}">
        <div class="suit">
          <strong>${escapeHtml(cardRankLabel(card))}</strong>
          <span>${escapeHtml(cardSuitSymbol(card))}</span>
        </div>
        <div class="card-name">${renderCardFaceText(card)}</div>
        <div class="card-type">${escapeHtml(cardMetaLine(card))}</div>
        ${selected ? `<span class="selected-badge">已选中</span>` : ""}
        ${playMeta.label ? `<span class="card-play-badge">${escapeHtml(playMeta.label)}</span>` : ""}
      </button>
    `;
  }

  function cardToneClass(card) {
    const name = cardDisplayName(card);
    if (["桃", "桃园结义"].includes(name)) return "card-tone-heal";
    if (["杀", "火杀", "雷杀", "决斗", "南蛮入侵", "万箭齐发", "火攻", "闪电"].includes(name)) return "card-tone-attack";
    if (card.type === "equipment") return "card-tone-equip";
    if (card.type === "trick" || card.type === "delayed") return "card-tone-trick";
    return "card-tone-basic";
  }

  function cardVisualClass(card) {
    if (!card) return "visual-card";
    if (card.subtype === "slash") {
      if (card.nature === DAMAGE.FIRE) return "visual-slash visual-fire";
      if (card.nature === DAMAGE.THUNDER) return "visual-slash visual-thunder";
      return "visual-slash";
    }
    if (card.subtype === "dodge") return "visual-dodge";
    if (card.subtype === "peach") return "visual-peach";
    if (card.subtype === "wine") return "visual-wine";
    if (card.subtype === "nullify") return "visual-nullify";
    if (card.type === "equip") {
      if (card.subtype === "weapon") return "visual-equip visual-weapon";
      if (card.subtype === "armor") return "visual-equip visual-armor";
      return "visual-equip visual-horse";
    }
    if (card.delayed) return "visual-trick visual-delayed";
    if (card.type === "trick") return "visual-trick";
    return "visual-card";
  }

  function cardPlayMeta(card) {
    if (state.cardPick) {
      const pickable = state.cardPick.filter(card);
      return pickable
        ? { key: "pickable", label: "可选", detail: "点击选择或取消选择这张牌。" }
        : { key: "unavailable", label: "", detail: "这次选择不能使用这张牌。" };
    }
    if (!state.playContext || state.playContext.playerId !== 0) return { key: "", label: "", detail: "" };
    const actions = playActionsForCard(card.id);
    if (!actions.length) {
      return { key: "unavailable", label: "", detail: "当前出牌阶段不能主动使用这张牌。" };
    }
    if (actions.length > 1) {
      return { key: "multi", label: "多用", detail: `点击此牌后，在底部选择一种用法：${actions.map((action) => action.label).join(" / ")}。` };
    }
    const action = actions[0];
    if (action.needsTarget) {
      return { key: "target", label: "选目标", detail: `点击此牌后，为 ${action.label} 选择目标，再确认使用。` };
    }
    return { key: "direct", label: "点出", detail: `点击此牌会直接使用 ${action.label}。` };
  }

  function renderActionHintTask({ eyebrow = "", title = "", detail = "", tip = "", tone = "", meta = "" } = {}) {
    return `
      <div class="action-hint action-hint-task ${tone ? `action-task-${tone}` : ""} tip" data-action-tone="${escapeAttr(tone || "default")}" data-tip="${escapeAttr(tip || [eyebrow, title, detail].filter(Boolean).join("\n"))}">
        <div class="action-task-eyebrow-row">
          ${eyebrow ? `<span class="action-eyebrow">${escapeHtml(eyebrow)}</span>` : ""}
          ${meta ? `<span class="action-task-meta">${escapeHtml(meta)}</span>` : ""}
        </div>
        <span class="action-task-main">
          <i class="action-task-dot" aria-hidden="true"></i>
          <strong>${escapeHtml(title || "等待操作")}</strong>
        </span>
        ${detail ? `<em class="action-task-detail">${escapeHtml(detail)}</em>` : ""}
      </div>
    `;
  }

  function actionPhaseEyebrow(label = "") {
    const phase = state.status.phase || "牌桌";
    return label ? `${label} · ${phase}` : phase;
  }

  function renderActionBar() {
    const bar = $("actionBar");
    bar.dataset.actionState = state.pending
      ? "pending"
      : state.cardPick
        ? "pick"
        : state.targetPick
          ? "target"
          : state.playContext
            ? "play"
            : state.eventStepWaiting
              ? "pause"
              : "passive";
    if (state.pending) {
      const mode = handModeCue();
      const prompt = state.pending.prompt || "请选择操作";
      bar.innerHTML = `
        ${renderActionHintTask({
          eyebrow: actionPhaseEyebrow(mode.kind === "danger" ? "关键响应" : "需要你处理"),
          title: prompt,
          detail: "请选择一个选项继续结算。",
          tip: mode.tip || prompt,
          tone: mode.kind,
          meta: "待选择"
        })}
        <div class="action-buttons">
          ${state.pending.options.map((option, index) => `<button class="${option.danger ? "warn" : index === 0 ? "primary" : ""} tip" data-pending-action="${index}" data-tip="${escapeAttr(option.tip || option.detail || option.label)}">${escapeHtml(option.label)}</button>`).join("")}
        </div>
      `;
      document.querySelectorAll("[data-pending-action]").forEach((btn) => {
        btn.addEventListener("click", () => choosePendingOption(Number(btn.dataset.pendingAction)));
      });
      return;
    }
    if (state.cardPick) {
      const selected = state.cardPick.selected.length;
      const range = state.cardPick.min === state.cardPick.max ? `${state.cardPick.max}` : `${state.cardPick.min}-${state.cardPick.max}`;
      bar.innerHTML = `
        ${renderActionHintTask({
          eyebrow: actionPhaseEyebrow("选择手牌"),
          title: `请选择 ${range} 张牌`,
          detail: `已选 ${selected} 张。${state.cardPick.prompt || "点亮的牌可以选择。"}`,
          tip: `${state.cardPick.prompt || "请选择手牌。"}\n点亮的牌可以选择；选完后点确认。`,
          tone: "pick",
          meta: `${selected}/${state.cardPick.max}`
        })}
        <div class="action-buttons">
          <button class="primary tip" id="confirmCards" data-tip="确认选牌\n提交当前选中的手牌，继续结算当前技能或响应。" ${selected < state.cardPick.min ? "disabled" : ""}>确认 ${selected}/${state.cardPick.max}</button>
          ${state.cardPick.allowCancel ? `<button class="tip" id="cancelCards" data-tip="取消选牌\n放弃当前选择，返回上一层操作。">取消</button>` : ""}
        </div>
      `;
      $("confirmCards")?.addEventListener("click", () => {
        const ids = [...state.cardPick.selected];
        const resolve = state.cardPick.resolve;
        state.cardPick = null;
        clearWait();
        resolve(ids);
      });
      $("cancelCards")?.addEventListener("click", () => {
        const resolve = state.cardPick.resolve;
        state.cardPick = null;
        clearWait();
        render();
        resolve([]);
      });
      return;
    }

    if (state.targetPick) {
      const count = state.targetPick.selected.length;
      const canConfirm = targetPickSelectionValid(state.targetPick);
      const hint = targetPickHint();
      bar.innerHTML = `
        ${renderActionHintTask({
          eyebrow: actionPhaseEyebrow("选择目标"),
          title: hint,
          detail: "点亮的角色可选；选满后确认。",
          tip: targetPickDetailText(),
          tone: "target",
          meta: `${count}/${state.targetPick.max}`
        })}
        <div class="action-buttons">
          <button class="primary tip" id="confirmTargets" data-tip="确认目标\n提交当前目标并使用这张牌或发动这个技能。" ${canConfirm ? "" : "disabled"}>确认目标 ${count}/${state.targetPick.max}</button>
          <button class="tip" id="cancelTargets" data-tip="取消目标\n放弃当前目标选择，回到出牌阶段。">取消</button>
        </div>
      `;
      $("confirmTargets")?.addEventListener("click", () => {
        if (!targetPickSelectionValid(state.targetPick)) {
          state.status.warning = state.targetPick?.validatorMessage || "目标组合不合法。";
          render();
          return;
        }
        const ids = [...state.targetPick.selected];
        const targets = ids.map(playerById).filter(Boolean);
        const resolve = state.targetPick.resolve;
        state.targetPick = null;
        clearWait();
        resolve(targets);
        Promise.resolve().then(() => render());
      });
      $("cancelTargets")?.addEventListener("click", () => {
        const resolve = state.targetPick.resolve;
        state.targetPick = null;
        clearWait();
        render();
        resolve([]);
      });
      return;
    }

    if (state.playContext) {
      const actions = state.playContext.actions;
      const selectedCard = state.playCardId ? state.players[0].hand.find((card) => card.id === state.playCardId) : null;
      const visibleActions = selectedCard ? playActionsForCard(state.playCardId) : actions.filter((action) => action.type === "skill");
      const actionHint = selectedCard
        ? `已选 ${cardName(selectedCard)}`
        : visibleActions.length
          ? "点手牌直接出牌；主动技能在这里。"
          : "点手牌直接出牌";
      const actionDetail = selectedCard
        ? "选择此牌用法；需要目标时会进入选目标。"
        : visibleActions.length
          ? "主动技能在按钮区；手牌可直接点击。"
          : "也可以结束出牌。";
      const actionButtons = visibleActions.length
        ? visibleActions.map((action, index) => `<button class="${selectedCard && index === 0 ? "primary" : ""} tip" data-action="${index}" data-tip="${escapeAttr(actionRuleText(action))}">${action.label}</button>`).join("")
        : "";
      bar.innerHTML = `
        ${renderActionHintTask({
          eyebrow: actionPhaseEyebrow("轮到你"),
          title: actionHint,
          detail: actionDetail,
          tip: playContextTip(selectedCard, visibleActions),
          tone: selectedCard ? "pick" : "play",
          meta: selectedCard ? "已选牌" : "出牌阶段"
        })}
        <div class="action-buttons">
          ${selectedCard ? "" : `<button class="primary phase-end tip" id="endPhase" data-tip="结束出牌\n不再使用手牌或主动技能，进入弃牌/结束结算。">结束出牌</button>`}
          ${actionButtons}
          ${selectedCard ? `<button class="tip" id="clearPlayCard" data-tip="取消选牌\n取消当前选中的手牌，回到手牌选择。">取消选牌</button>` : ""}
          ${selectedCard ? `<button class="primary phase-end tip" id="endPhase" data-tip="结束出牌\n不再使用手牌或主动技能，进入弃牌/结束结算。">结束出牌</button>` : ""}
        </div>
      `;
      document.querySelectorAll("[data-action]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const action = visibleActions[Number(btn.dataset.action)];
          await commitPlayAction(action);
        });
      });
      $("clearPlayCard")?.addEventListener("click", () => {
        state.playCardId = null;
        render();
      });
      $("endPhase")?.addEventListener("click", () => {
        const resolve = state.playContext.resolver;
        state.playContext = null;
        state.playCardId = null;
        clearWait();
        resolve({ type: "end" });
      });
      return;
    }

    if (state.eventStepWaiting) {
      const title = state.spotlight?.title || "当前事件";
      bar.innerHTML = `
        ${renderActionHintTask({
          eyebrow: actionPhaseEyebrow("单步模式"),
          title: `单步暂停 · ${title}`,
          detail: "点击下一步继续结算。",
          tip: "单步模式暂停中\n点击继续到下一个事件。",
          tone: "pause",
          meta: "暂停"
        })}
        <div class="action-buttons">
          <button class="primary step-next tip" id="nextEventBottom" data-tip="继续\n进入下一个事件或下一段结算。">下一步</button>
        </div>
      `;
      $("nextEventBottom")?.addEventListener("click", releaseEventStepWait);
      return;
    }

    const mode = handModeCue();
    const current = state.players[state.current];
    const passive = passiveActionBarCopy(mode, current);
    bar.innerHTML = `
      <div class="action-hint action-hint-passive tip" data-tip="${escapeAttr(passive.tip)}">
        <span class="action-eyebrow">${escapeHtml(passive.eyebrow)}</span>
        <strong>${escapeHtml(passive.title)}</strong>
        <em>${escapeHtml(passive.detail)}</em>
      </div>
      <div class="action-buttons action-buttons-passive">
        <button class="phase-end ghost tip" disabled data-tip="${escapeAttr(passive.buttonTip)}">${escapeHtml(passive.button)}</button>
      </div>
    `;
  }

  function passiveActionBarCopy(mode, current) {
    const phase = state.status.phase || "牌桌";
    if (current?.isHuman) {
      const idle = mode.kind === "idle";
      return {
        eyebrow: `轮到你 · ${phase}`,
        title: idle ? "准备你的回合" : (mode.title || "等待操作"),
        detail: idle ? "牌桌正在结算，稍后会提示可用操作。" : (mode.detail || "请选择下一步。"),
        button: "等待",
        buttonTip: "当前没有可确认的操作。",
        tip: mode.tip || "等待你处理当前牌桌操作。"
      };
    }
    const actor = current ? shortVisualName(nameOf(current)) : "AI";
    const detail = centerStatusText().replace(/[。.]$/, "") || "AI 正在思考";
    return {
      eyebrow: `观战中 · ${phase}`,
      title: `${actor}正在行动`,
      detail: `你当前无需操作 · ${detail}`,
      button: "等待",
      buttonTip: "当前是其他角色行动，不需要你确认。",
      tip: [
        current ? `当前行动：${nameOf(current)}` : "当前行动：AI",
        `阶段：${phase}`,
        detail,
        "轮到你操作时，手牌区会切换为可点击状态。"
      ].join("\n")
    };
  }

  function playContextTip(selectedCard, visibleActions) {
    if (selectedCard) {
      const actionNames = visibleActions.length ? visibleActions.map((action) => action.label).join(" / ") : "无可用用法";
      return [
        "出牌操作",
        `已选：${cardName(selectedCard)}`,
        `可用：${actionNames}`,
        "点击底部按钮确认用法；需要目标时，再点角色卡选择目标。",
        "也可以取消选牌或结束出牌。"
      ].join("\n");
    }
    return [
      "出牌阶段",
      "可直接点击手牌：可直接使用的牌会立刻出牌，需要目标的牌会进入选目标。",
      "底部只显示主动技能和结束出牌等命令。",
      "灰掉的手牌当前不能主动使用，但仍可能在响应窗口中使用。"
    ].join("\n");
  }

  function targetPickHint() {
    const pick = state.targetPick;
    if (!pick) return "";
    const selectedNames = pick.selected.map(playerById).filter(Boolean).map((player) => shortVisualName(nameOf(player)));
    return selectedNames.length ? `已选：${selectedNames.join("、")}` : "选目标";
  }

  function targetPickDetailText() {
    const pick = state.targetPick;
    if (!pick) return "";
    const validNames = (pick.validIds || [])
      .map(playerById)
      .filter(Boolean)
      .map(nameOf)
      .join("、") || "无";
    const selectedNames = (pick.selected || [])
      .map(playerById)
      .filter(Boolean)
      .map(nameOf)
      .join("、") || "无";
    return [
      "目标选择",
      pick.prompt || "点击角色卡选择目标。",
      `已选：${selectedNames}`,
      `可选：${validNames}`,
      "选好后点击确认目标；点已选角色可取消选择。"
    ].join("\n");
  }

  function targetPickSelectionValid(pick = state.targetPick) {
    if (!pick) return false;
    const count = pick.selected?.length || 0;
    if (count < pick.min || count > pick.max) return false;
    if (typeof pick.selectionValidator !== "function") return true;
    const targets = pick.selected.map(playerById).filter(Boolean);
    return Boolean(pick.selectionValidator(targets, pick));
  }

  function targetPickOptionsForAction(action, player) {
    if (action?.targetMode === "dimengPair") {
      return {
        selectionValidator: (targets) => targets.length === 2 && canDimengPair(player, targets[0], targets[1]),
        validatorMessage: "缔盟目标需要是两名其他角色，且弃牌数不能超过你的手牌数。"
      };
    }
    return {};
  }

  async function commitPlayAction(action) {
    if (!state.playContext || !action) return;
    const player = playerById(state.playContext.playerId);
    if (!player) return;
    const bounds = targetBounds(action, player);
    const targets = action.needsTarget
      ? action.targetMode === "borrowSword"
        ? await pickBorrowSwordTargets(player, action, { autoConfirm: false, previewAction: action })
        : await pickTargets(
          targetPromptForAction(action),
          legalTargets(player, action),
          bounds.min,
          bounds.max,
          player,
          { autoConfirm: false, previewAction: action, ...targetPickOptionsForAction(action, player) }
        )
      : [];
    if (action.needsTarget && targets.length < bounds.min) {
      state.playCardId = null;
      restorePlayWait(player);
      render();
      return;
    }
    if (!state.playContext) return;
    const resolve = state.playContext.resolver;
    state.playContext = null;
    state.playCardId = null;
    clearWait();
    resolve({ type: "move", move: { ...action, targets } });
  }

  function restorePlayWait(player) {
    if (!state.playContext) return;
    setWait(
      "出牌操作",
      "点手牌直接使用，或从操作条选择；也可以结束出牌。",
      player.id,
      `${state.playContext.actions?.length || 0} 个可用操作`
    );
  }

  function renderPrompt() {
    if (state.cardPick) {
      $("prompt").textContent = state.cardPick.prompt;
      $("choices").innerHTML = "";
      return;
    }
    if (state.targetPick) {
      $("prompt").textContent = state.targetPick.prompt;
      $("choices").innerHTML = "";
      return;
    }
    if (state.pending) {
      $("prompt").textContent = state.pending.prompt;
      $("choices").innerHTML = state.pending.options.map((option, index) => `<button class="${option.danger ? "warn" : ""}" data-choice="${index}">${option.label}</button>`).join("");
      document.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => choosePendingOption(Number(btn.dataset.choice)));
      });
      return;
    }
    if (state.playContext) {
      $("prompt").textContent = "你的出牌阶段。点手牌直接使用，或从操作条选择。";
      $("choices").innerHTML = "";
      return;
    }
    $("prompt").textContent = state.gameOver ? "对局结束" : "AI 正在思考。";
    $("choices").innerHTML = "";
  }

  function choosePendingOption(index) {
    if (!state.pending) return;
    const option = state.pending.options[index];
    if (!option) return;
    if (state.gameOver && option.value === "new") {
      $("newGame").click();
      return;
    }
    if (typeof option.onChoose === "function") {
      option.onChoose(option.value);
      return;
    }
    state.status.warning = `选项缺少处理函数：${option.label || option.value || "未知选项"}`;
    log(state.status.warning);
  }

  function waitConsistencyIssues(wait = activeWaitState()) {
    const issues = [];
    let active = [
      state.pending ? "pending" : "",
      state.cardPick ? "cardPick" : "",
      state.targetPick ? "targetPick" : "",
      state.playContext ? "playContext" : ""
    ].filter(Boolean);
    if (state.targetPick && state.playContext && state.targetPick.ownerId === state.playContext.playerId) {
      active = active.filter((item) => item !== "playContext");
    }
    if (active.length > 1) issues.push(`多个等待通道同时存在：${active.join(" / ")}`);
    if (state.eventStepWaiting && active.length) issues.push(`单步暂停叠加了交互等待：${active.join(" / ")}`);
    if (!wait) return issues;
    const ownerId = wait.waitingForId;
    const owner = ownerId != null ? playerById(ownerId) : null;
    if (ownerId != null && !owner) issues.push(`等待对象不存在：${ownerId}`);
    if (owner && !owner.alive && !state.gameOver) issues.push(`等待对象已阵亡：${nameOf(owner)}`);
    if (state.pending && state.pending.ownerId != null && ownerId != null && state.pending.ownerId !== ownerId) {
      issues.push(`pending owner 与等待对象不一致：${state.pending.ownerId} vs ${ownerId}`);
    }
    if (state.cardPick && state.cardPick.ownerId != null && ownerId != null && state.cardPick.ownerId !== ownerId) {
      issues.push(`cardPick owner 与等待对象不一致：${state.cardPick.ownerId} vs ${ownerId}`);
    }
    if (state.targetPick && state.targetPick.ownerId != null && ownerId != null && state.targetPick.ownerId !== ownerId) {
      issues.push(`targetPick owner 与等待对象不一致：${state.targetPick.ownerId} vs ${ownerId}`);
    }
    if (state.playContext && state.playContext.playerId != null && ownerId != null && state.playContext.playerId !== ownerId) {
      issues.push(`playContext owner 与等待对象不一致：${state.playContext.playerId} vs ${ownerId}`);
    }
    if (owner?.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
      issues.push("当前是玩家等待，不应自动恢复。");
    }
    return issues;
  }

  function recoveryPreview(wait) {
    if (state.loopError) return "重启结算";
    if (state.pending) return "默认选项";
    if (state.cardPick) return "取消选牌";
    if (state.targetPick) return "取消目标";
    if (state.playContext) return "结束出牌";
    return wait?.kind ? "清理等待" : "无";
  }

  function renderLog() {
    const sections = groupedLogSections(logEntriesForDisplay());
    $("log").innerHTML = sections
      .slice(-12)
      .reverse()
      .map(renderLogSection)
      .join("");
    if (!state.logCollapsed) {
      const logNode = $("log");
      logNode.scrollTop = 0;
    }
  }

  function logEntriesForDisplay() {
    const entries = state.log.slice(-180);
    if (entries.length) return entries;
    const live = liveSpotlightLogEntry();
    if (!live) return entries;
    const event = state.spotlight || {};
    const actor = event.actor && event.actor !== "事件" && event.actor !== "系统" ? event.actor : "";
    return actor ? [`进入 ${actor} 的回合。`, live] : [live];
  }

  function liveSpotlightLogEntry() {
    const event = state.spotlight;
    if (!event || event.kind === "wait") return "";
    const message = String(event.message || "").trim();
    if (message && !/等待开始|等待下一步|身份局准备/.test(message)) return message;
    const actor = event.actor || "系统";
    const title = event.title && event.title !== "当前事件" ? event.title : spotlightKindLabel(event.kind);
    const target = event.target ? `，目标 ${event.target}` : "";
    if (!title || title === "等待操作") return "";
    return `${actor} ${title}${target}。`;
  }

  function groupedLogSections(entries) {
    const sections = [];
    let current = { actor: "系统", title: "系统事件", items: [] };
    entries.forEach((raw) => {
      const entry = String(raw || "");
      const turn = entry.match(/^进入 (.+?) 的回合。$/);
      const extra = entry.match(/^(.+?) 开始额外回合。$/);
      if (turn || extra) {
        if (current.items.length) sections.push(current);
        const actor = (turn || extra)[1];
        current = {
          actor,
          title: extra ? `${actor} 的额外回合` : `${actor} 的回合`,
          items: [entry]
        };
        return;
      }
      current.items.push(entry);
    });
    if (current.items.length) sections.push(current);
    if (!sections.length) sections.push({ actor: "系统", title: "暂无战报", items: ["等待开始。"] });
    return sections.map((section, index) => ({
      ...section,
      current: index === sections.length - 1
    }));
  }

  function renderLogSection(section) {
    const summary = logSectionSummary(section);
    const actorInitial = section.actor === "系统" ? "局" : shortVisualName(section.actor).slice(0, 1);
    return `
      <section class="log-section ${section.current ? "current-log-section" : ""}">
        <div class="log-turn-separator">
          <span>${escapeHtml(actorInitial || "局")}</span>
          <strong>${highlightLogNames(section.title)}</strong>
          <small class="log-section-meta">${escapeHtml(summary)}</small>
        </div>
        ${section.items.map((entry) => renderLogAction(entry, section.actor)).join("")}
      </section>
    `;
  }

  function logSectionSummary(section) {
    const entries = (section.items || []).filter(Boolean);
    const actionEntries = entries.filter((entry) => !/^进入 .+ 的回合。$/.test(entry) && !/^.+? 开始额外回合。$/.test(entry));
    const count = actionEntries.length || entries.length;
    const kinds = new Set(actionEntries.map(logEntryKind));
    const priorities = [
      ["death", "阵亡"],
      ["dying", "濒死"],
      ["damage", "伤害"],
      ["heal", "救援"],
      ["judge", "判定"],
      ["response", "响应"],
      ["skill", "技能"],
      ["discard", "弃牌"],
      ["card", "出牌"],
      ["gain", "摸牌"]
    ];
    const focus = priorities
      .filter(([kind]) => kinds.has(kind))
      .slice(0, 2)
      .map(([, label]) => label);
    const parts = [];
    if (section.current) parts.push("进行中");
    parts.push(`${count}条`);
    if (focus.length) parts.push(focus.join("/"));
    return parts.join(" · ");
  }

  function renderLogAction(entry, actor) {
    const kind = logEntryKind(entry);
    const summary = logActionSummary(entry, actor);
    const repeatedDetail = isRedundantLogDetail(summary);
    const sameActorRoute = normalizeLogText(summary.route) === normalizeLogText(summary.actor);
    return `
      <div class="log-message log-message-${kind}">
        <span class="log-message-kind">${escapeHtml(logEntryKindLabel(kind))}</span>
        <div class="log-bubble" data-actor="${escapeHtml(summary.actor)}">
          <div class="log-line-head">
            <strong>${highlightLogNames(summary.title)}</strong>
            <small class="${sameActorRoute ? "log-route-muted" : ""}">${highlightLogNames(summary.route)}</small>
          </div>
          <p class="${repeatedDetail ? "log-detail-redundant" : ""}">${highlightLogNames(summary.detail)}</p>
        </div>
      </div>
    `;
  }

  function isRedundantLogDetail(summary) {
    const title = normalizeLogText(summary.title);
    const detail = normalizeLogText(summary.detail);
    if (!detail) return true;
    if (detail === title) return true;
    if (detail === normalizeLogText(summary.route)) return true;
    return false;
  }

  function normalizeLogText(text) {
    return String(text || "")
      .replace(/[。.\s]/g, "")
      .replace(/^目标[:：]/, "")
      .trim();
  }

  function logActionSummary(entry, actor) {
    const event = enrichSpotlightEvent(eventFromLog(entry));
    const fallback = logActionText(entry, actor);
    const eventActor = event.actor && event.actor !== "事件" ? event.actor : (actor || "系统");
    const target = event.target && event.target !== eventActor ? event.target : "";
    const title = event.kind === "death" && target && eventActor !== target
      ? "击杀阵亡"
      : event.title;
    return {
      actor: eventActor,
      route: target ? `${eventActor} → ${target}` : eventActor,
      title: title && title !== "当前事件" ? title : fallback,
      detail: event.detail && event.detail !== entry ? event.detail : fallback
    };
  }

  function logActionText(entry, actor) {
    if (entry === `进入 ${actor} 的回合。`) return "回合开始";
    if (entry === `${actor} 开始额外回合。`) return "额外回合开始";
    if (actor && entry.startsWith(`${actor} `)) return entry.slice(actor.length + 1);
    return entry;
  }

  function highlightLogNames(text) {
    const raw = String(text || "");
    if (!raw || !state.players?.length) return escapeHtml(raw);
    const candidates = [];
    state.players.forEach((player) => {
      [nameOf(player), player.general?.name, player.name].filter(Boolean).forEach((label) => {
        if (!label || label.length < 2) return;
        let start = 0;
        while (start < raw.length) {
          const index = raw.indexOf(label, start);
          if (index < 0) break;
          candidates.push({ index, end: index + label.length, label, player });
          start = index + label.length;
        }
      });
    });
    if (!candidates.length) return escapeHtml(raw);
    candidates.sort((a, b) => a.index - b.index || (b.end - b.index) - (a.end - a.index));
    const matches = [];
    let occupiedUntil = -1;
    candidates.forEach((match) => {
      if (match.index < occupiedUntil) return;
      matches.push(match);
      occupiedUntil = match.end;
    });
    let cursor = 0;
    return matches.map((match) => {
      const before = escapeHtml(raw.slice(cursor, match.index));
      cursor = match.end;
      return `${before}${renderLogName(match.label, match.player)}`;
    }).join("") + escapeHtml(raw.slice(cursor));
  }

  function renderLogName(label, player) {
    const note = player?.revealed ? roleToNote(player.role) : (state.roleNotes?.[player.id] || "unknown");
    const classes = [
      "log-name",
      `log-name-${note}`,
      kingdomClass(player?.general?.kingdom),
      player?.isHuman ? "log-name-self" : ""
    ].filter(Boolean).join(" ");
    return `<span class="${classes}" data-player-id="${player.id}">${escapeHtml(label)}</span>`;
  }

  function logEntryKind(entry) {
    if (/进入 .+ 的回合|开始额外回合/.test(entry)) return "turn";
    if (/阵亡|击杀/.test(entry)) return "death";
    if (/使用(桃|酒)，(救援|自救)|脱离濒死|回复 \d+ 点体力/.test(entry)) return "heal";
    if (/濒死/.test(entry)) return "dying";
    if (/受到|造成 \d+ 点|失去 \d+ 点体力|伤害/.test(entry)) return "damage";
    if (/判定改为|改判/.test(entry)) return "judge";
    if (/发动|触发|觉醒/.test(entry)) return "skill";
    if (/使用无懈可击，(抵消|反抵消)/.test(entry)) return "response";
    if (/使用|装备|置入|放置|当作/.test(entry)) return "card";
    if (/判定|展示|亮出|拼点/.test(entry)) return "judge";
    if (/摸|获得|交给|移动给/.test(entry)) return "gain";
    if (/弃牌|弃置/.test(entry)) return "discard";
    if (/弃|未响应|跳过|无效|抵消/.test(entry)) return "response";
    if (/游戏结束|身份局开始|诊断/.test(entry)) return "system";
    return "normal";
  }

  function logEntryKindLabel(kind) {
    return {
      turn: "回合",
      damage: "伤",
      dying: "濒",
      death: "亡",
      skill: "技",
      card: "牌",
      judge: "判",
      heal: "愈",
      gain: "得",
      discard: "弃",
      response: "应",
      system: "局",
      normal: "事"
    }[kind] || "事";
  }

  function renderReads() {
    const summary = $("readsSummary");
    const list = $("readsList");
    if (!summary || !list) return;
    const observer = readObserver();
    if (!observer) {
      summary.innerHTML = `<div class="reads-empty">开局后显示 AI 判断。</div>`;
      list.innerHTML = "";
      return;
    }
    const modeText = aiFairnessModeText();
    summary.innerHTML = `
      <div class="reads-stat">
        <span>观察视角</span>
        <strong>${escapeHtml(nameOf(observer))}</strong>
      </div>
      <div class="reads-stat">
        <span>模式</span>
        <strong>${escapeHtml(modeText)}</strong>
      </div>
      ${renderFairnessAudit(observer)}
      ${renderDecisionTrail()}
    `;
    const reads = state.reads[observer.id] || {};
    list.innerHTML = state.players
      .filter((target) => target.id !== observer.id)
      .map((target) => renderReadRow(observer, target, reads[target.id] || 0))
      .join("");
  }

  function aiFairnessModeText() {
    if (state.aiMode === "oracle") return "强敌挑战：AI 有额外信息";
    if (state.aiMode === "strategist") return "策略增强：公平读数 + 更积极评分";
    return "公平推理：只看公开行为";
  }

  function renderFairnessAudit(observer) {
    const hiddenRoles = state.players
      .filter((target) => target.id !== observer.id && !isRolePublicTo(observer, target))
      .length;
    const hiddenHandOwners = state.players
      .filter((target) => target.id !== observer.id && target.alive)
      .length;
    const items = state.aiMode === "oracle"
      ? [
        "强敌挑战会使用暗身份和手牌内容",
        "这是高难挑战，不代表公平 AI"
      ]
      : [
        `${hiddenRoles} 个暗身份未给 AI 直接读取`,
        `${hiddenHandOwners} 名其他角色手牌只按数量/响应读数估计`,
        "决策理由来自公开行为、公开主公身份、体力/装备/手牌数"
      ];
    return `
      <div class="fairness-audit ${state.aiMode === "oracle" ? "oracle" : "fair"}">
        <strong>${state.aiMode === "oracle" ? "挑战边界" : "公平边界"}</strong>
        ${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    `;
  }

  function readObserver() {
    const current = state.players[state.current];
    if (current && !current.isHuman && current.alive) return current;
    const master = playerById(state.masterId);
    if (master?.alive && !master.isHuman) return master;
    return alivePlayers().find((p) => !p.isHuman) || master || state.players[0];
  }

  function renderDecisionTrail() {
    const trail = (state.decisionTrail || []).slice(0, 4);
    if (!trail.length) {
      return `<div class="decision-trail empty">AI 出牌后会显示最近决策理由。</div>`;
    }
    return `
      <div class="decision-trail">
        ${trail.map((entry) => `
          <div class="decision-item">
            <strong>${escapeHtml(entry.actor)} · ${escapeHtml(entry.title)}</strong>
            <span>${escapeHtml(entry.target)} · ${escapeHtml(entry.reason)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderReadRow(observer, target, read) {
    const label = readLabel(read);
    const reasons = state.readReasons[observer.id]?.[target.id] || [];
    const publicText = isRolePublicTo(observer, target) || state.debug ? `公开：${target.role}` : "暗身份";
    return `
      <div class="read-row">
        <div class="read-target">
          <strong>${escapeHtml(nameOf(target))}</strong>
          <span>${escapeHtml(publicText)}</span>
        </div>
        <div class="read-meter">
          <span class="read-fill ${label.key}" style="width:${readWidth(read)}%"></span>
        </div>
        <div class="read-label ${label.key}">${label.text}</div>
        <div class="read-reasons">
          ${reasons.length ? reasons.map((reason) => `<span>${escapeHtml(reason)}</span>`).join("") : "<span>暂无公开行为证据，AI 暂按中性估计</span>"}
        </div>
      </div>
    `;
  }

  function readLabel(read) {
    if (read > 1.4) return { key: "rebel", text: "很像反" };
    if (read > 0.45) return { key: "rebel", text: "偏反" };
    if (read < -1.4) return { key: "loyal", text: "很像忠" };
    if (read < -0.45) return { key: "loyal", text: "偏忠" };
    return { key: "unknown", text: "不明" };
  }

  function readWidth(read) {
    return Math.round(clamp(Math.abs(read) / 3, 0.08, 1) * 100);
  }

  function renderCoverage() {
    const skills = Object.keys(SKILL_TEXT);
    const counts = skills.reduce((acc, skill) => {
      acc[skillCoverageStatus(skill)] += 1;
      return acc;
    }, { full: 0, partial: 0, todo: 0 });
    $("coverageSummary").innerHTML = `
      <div class="coverage-stat"><span>完整</span><strong>${counts.full}</strong></div>
      <div class="coverage-stat"><span>简化可玩</span><strong>${counts.partial}</strong></div>
      <div class="coverage-stat"><span>关键缺失</span><strong>${counts.todo}</strong></div>
    `;
    $("coverageList").innerHTML = skills
      .map((skill) => {
        const status = skillCoverageStatus(skill);
        return `
          <div class="coverage-row">
            <div class="coverage-name">${SKILL_TEXT[skill]}</div>
            <div>
              <div>${skill}</div>
              <div class="coverage-note">${coverageNote(status, skill)}</div>
            </div>
            <span class="coverage-status ${status}">${coverageLabel(status)}</span>
          </div>
        `;
      })
      .join("");
  }

  function renderSetupCareer() {
    const panel = $("setupCareer");
    if (!panel) return;
    const stats = normalizeCareerStats(state.career);
    panel.innerHTML = `
      <div class="setup-career-strip" aria-label="战绩名将档案">
        <div class="setup-career-left">
          <div class="setup-career-label">名将档案</div>
          ${renderRecentForm(stats)}
        </div>
        <div class="setup-career-divider" aria-hidden="true"></div>
        <div class="setup-career-stats">
          ${renderCareerStat("总局", stats.totalGames)}
          ${renderCareerStat("胜率", careerRate(stats.wins, stats.totalGames))}
          ${renderCareerStreakStat(stats.currentWinStreak, stats.bestWinStreak)}
          ${renderCareerStat("存活率", careerRate(stats.survivedGames, stats.totalGames))}
        </div>
      </div>
    `;
  }

  function renderCareer() {
    const panel = $("careerPanel");
    if (!panel) return;
    const stats = normalizeCareerStats(state.career);
    const insight = careerInsights(stats);
    const roles = ["主公", "忠臣", "反贼", "内奸"];
    const roleRows = roles.map((role) => stats.roleStats[role] || { label: role, games: 0, wins: 0, losses: 0, survived: 0 });
    const modeRows = ["5", "8"].map((mode) => stats.modeStats[mode] || { label: `${mode}人局`, games: 0, wins: 0, losses: 0, survived: 0 });
    const generals = Object.values(stats.generalStats)
      .sort((a, b) => b.games - a.games || b.wins - a.wins)
      .slice(0, 8);
    const recent = stats.lastGames.slice(0, 10);
    panel.innerHTML = `
      <div class="career-banner">
        <div>
          <span class="eyebrow">生涯档案</span>
          <strong>${escapeHtml(insight.rank)}</strong>
          <small>${escapeHtml(careerStorageText())}</small>
        </div>
        ${renderRecentForm(stats)}
      </div>
      <div class="career-hero">
        ${renderCareerStat("总局", stats.totalGames)}
        ${renderCareerStat("胜率", careerRate(stats.wins, stats.totalGames))}
        ${renderCareerStat("当前连胜", stats.currentWinStreak)}
        ${renderCareerStat("最佳连胜", stats.bestWinStreak)}
        ${renderCareerStat("存活率", careerRate(stats.survivedGames, stats.totalGames))}
        ${renderCareerStat("最长局", stats.longestGameRound ? `${stats.longestGameRound}轮` : "0轮")}
        ${renderCareerStat("总伤害", stats.totalDamageDealt)}
        ${renderCareerStat("总击杀", stats.totalKills)}
        ${renderCareerStat("用牌/技能", `${stats.totalCardsUsed}/${stats.totalSkillsUsed}`)}
      </div>
      <div class="career-focus">
        <div>
          <span>最常用</span>
          <strong>${escapeHtml(insight.favoriteGeneral)}</strong>
          <small>${escapeHtml(insight.favoriteDetail)}</small>
        </div>
        <div>
          <span>表现最好</span>
          <strong>${escapeHtml(insight.bestGeneral)}</strong>
          <small>${escapeHtml(insight.bestDetail)}</small>
        </div>
        <div>
          <span>下个目标</span>
          <strong>${escapeHtml(insight.nextTitle)}</strong>
          <small>${escapeHtml(insight.nextDetail)}</small>
        </div>
      </div>
      ${renderCareerActions()}
      ${renderCareerNotice()}
      <div class="career-section">
        <header>
          <strong>身份表现</strong>
          <span>${stats.wins} 胜 / ${stats.losses} 负</span>
        </header>
        <div class="career-role-grid">
          ${roleRows.map(renderCareerRole).join("")}
        </div>
      </div>
      <div class="career-section">
        <header>
          <strong>模式表现</strong>
          <span>五人 / 八人</span>
        </header>
        <div class="career-role-grid">
          ${modeRows.map(renderCareerRole).join("")}
        </div>
      </div>
      <div class="career-section">
        <header>
          <strong>武将记录</strong>
          <span>${generals.length ? "按出场排序" : "暂无记录"}</span>
        </header>
        <div class="career-list">
          ${generals.length ? generals.map(renderCareerGeneral).join("") : `<div class="career-empty">完成一局后会记录武将胜率。</div>`}
        </div>
      </div>
      <div class="career-section">
        <header>
          <strong>里程碑</strong>
          <span>${careerMilestones(stats).filter((item) => item.done).length}/${careerMilestones(stats).length}</span>
        </header>
        <div class="career-milestones">
          ${careerMilestones(stats).map(renderCareerMilestone).join("")}
        </div>
      </div>
      <div class="career-section">
        <header>
          <strong>最近对局</strong>
          <span>${recent.length ? "本机记录" : "暂无记录"}</span>
        </header>
        <div class="career-list">
          ${recent.length ? recent.map(renderCareerGame).join("") : `<div class="career-empty">打完一局后，这里会出现结果。</div>`}
        </div>
      </div>
    `;
  }

  function renderCareerActions() {
    return "";
  }

  function renderCareerNotice() {
    if (!state.careerNotice) {
      return `<div class="career-note">${escapeHtml(careerStorageText())}</div>`;
    }
    return `<div class="career-note active">${escapeHtml(state.careerNotice)}</div>`;
  }

  function renderRecentForm(stats) {
    const recent = (stats.lastGames || []).slice(0, 5);
    if (!recent.length) {
      return `<div class="career-form"><span>待开局</span><span>待记录</span><span>待首胜</span></div>`;
    }
    return `
      <div class="career-form">
        ${recent.map((game) => `<span class="${game.won ? "win" : "loss"}">${game.won ? "胜" : "败"}</span>`).join("")}
      </div>
    `;
  }

  function careerInsights(stats) {
    const milestones = careerMilestones(stats);
    const doneCount = milestones.filter((item) => item.done).length;
    const points = stats.wins * 4 + stats.totalGames + stats.bestWinStreak * 3 + doneCount * 5;
    const rank = points >= 90 ? "名将档案" : points >= 45 ? "老练牌手" : points >= 16 ? "熟悉战局" : stats.totalGames ? "初阵牌手" : "未开档";
    const generals = Object.values(stats.generalStats || {});
    const favorite = generals.slice().sort((a, b) => b.games - a.games || b.wins - a.wins)[0];
    const best = generals
      .filter((item) => item.games >= 2)
      .sort((a, b) => (b.wins / Math.max(1, b.games)) - (a.wins / Math.max(1, a.games)) || b.games - a.games)[0] || favorite;
    const next = milestones.find((item) => !item.done);
    return {
      rank,
      favoriteGeneral: favorite?.label || "暂无",
      favoriteDetail: favorite ? `${favorite.games} 局 · ${careerRate(favorite.wins, favorite.games)}` : "完成一局后开始记录",
      bestGeneral: best?.label || "暂无",
      bestDetail: best ? `${best.wins} 胜 / ${best.games} 局` : "至少两局后更可信",
      nextTitle: next?.title || "全里程碑达成",
      nextDetail: next?.detail || "可以继续冲更高胜率和连胜"
    };
  }

  function careerStorageText() {
    if (typeof localStorage === "undefined") return "当前环境不支持浏览器本地保存，可用导出存档备份。";
    return "保存在本浏览器本地；换浏览器、移动文件或清缓存前建议导出。";
  }

  function renderCareerStat(label, value) {
    return `
      <div class="career-stat">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(String(value))}</strong>
      </div>
    `;
  }

  function renderCareerStreakStat(current, best) {
    return `
      <div class="career-stat career-stat-streak">
        <span>连胜</span>
        <strong><b>${escapeHtml(String(current || 0))}</b><small>/ 最佳 ${escapeHtml(String(best || 0))}</small></strong>
      </div>
    `;
  }

  function renderCareerRole(bucket) {
    const games = bucket.games || 0;
    const wins = bucket.wins || 0;
    return `
      <div class="career-role">
        <span>${escapeHtml(bucket.label)}</span>
        <strong>${careerRate(wins, games)}</strong>
        <small>${games} 局 · ${wins} 胜 · 存活 ${careerRate(bucket.survived || 0, games)} · 伤害 ${bucket.damageDealt || 0} · 击杀 ${bucket.kills || 0}</small>
      </div>
    `;
  }

  function renderCareerGeneral(bucket) {
    return `
      <div class="career-row">
        <strong>${escapeHtml(bucket.label)}</strong>
        <span>${bucket.games || 0} 局 · ${careerRate(bucket.wins || 0, bucket.games || 0)} · ${bucket.wins || 0} 胜 · 存活 ${careerRate(bucket.survived || 0, bucket.games || 0)} · 伤害 ${bucket.damageDealt || 0} · 击杀 ${bucket.kills || 0}</span>
      </div>
    `;
  }

  function renderCareerGame(game) {
    const duration = game.durationSec ? ` · ${formatDurationSec(game.durationSec)}` : "";
    const aliveCount = Number.isFinite(game.aliveCount) ? ` · 结算存活 ${game.aliveCount} 人` : "";
    const combat = ` · 伤害 ${Number(game.damageDealt) || 0}/${Number(game.damageTaken) || 0} · 击杀 ${Number(game.kills) || 0}`;
    return `
      <div class="career-row ${game.won ? "career-win" : "career-loss"}">
        <strong>${escapeHtml(game.won ? "胜利" : "失败")} · ${escapeHtml(game.generalName || "未知武将")}</strong>
        <span>${escapeHtml(game.mode || "?")}人局 · ${escapeHtml(game.role || "?")} · 第 ${Number(game.round) || 1} 轮${duration}${aliveCount}${combat} · ${escapeHtml(formatCareerDate(game.at))}</span>
      </div>
    `;
  }

  function renderCareerMilestone(item) {
    return `
      <div class="career-milestone ${item.done ? "done" : ""}">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.detail)}</span>
      </div>
    `;
  }

  function careerMilestones(stats) {
    const role = (name) => stats.roleStats[name] || { games: 0, wins: 0 };
    const generals = Object.values(stats.generalStats || {});
    return [
      { title: "初阵", detail: "完成 1 局", done: stats.totalGames >= 1 },
      { title: "渐入佳境", detail: "完成 5 局", done: stats.totalGames >= 5 },
      { title: "连胜开张", detail: "达成 2 连胜", done: stats.bestWinStreak >= 2 },
      { title: "反贼首胜", detail: "以反贼身份获胜", done: role("反贼").wins >= 1 },
      { title: "主忠守成", detail: "以主公或忠臣获胜", done: role("主公").wins + role("忠臣").wins >= 1 },
      { title: "孤胆翻盘", detail: "以内奸身份获胜", done: role("内奸").wins >= 1 },
      { title: "锋芒初现", detail: "累计造成 10 点伤害", done: (stats.totalDamageDealt || 0) >= 10 },
      { title: "斩将", detail: "累计击杀 1 名角色", done: (stats.totalKills || 0) >= 1 },
      { title: "武将熟练", detail: "任一武将出场 3 次", done: generals.some((item) => item.games >= 3) },
      { title: "百战雏形", detail: "完成 20 局", done: stats.totalGames >= 20 }
    ];
  }

  function careerRate(wins, games) {
    if (!games) return "0%";
    return `${Math.round((wins / games) * 100)}%`;
  }

  function formatCareerDate(value) {
    const date = new Date(value || Date.now());
    if (Number.isNaN(date.getTime())) return "刚刚";
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  function formatDurationSec(value) {
    const seconds = Math.max(0, Number(value) || 0);
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    if (minutes <= 0) return `${rest}秒`;
    return `${minutes}分${String(rest).padStart(2, "0")}秒`;
  }

  function renderInfoPanel() {
    const showingCoverage = state.infoTab === "coverage";
    const showingReads = state.infoTab === "reads";
    const showingCareer = state.infoTab === "career";
    const showingLog = !showingCoverage && !showingReads && !showingCareer;
    $("logTab").classList.toggle("active", showingLog);
    $("readsTab").classList.toggle("active", showingReads);
    $("coverageTab").classList.toggle("active", showingCoverage);
    $("careerTab")?.classList.toggle("active", showingCareer);
    $("logPanel").classList.toggle("hidden", !showingLog);
    $("readsPanel").classList.toggle("hidden", !showingReads);
    $("coveragePanel").classList.toggle("hidden", !showingCoverage);
    $("careerPanel")?.classList.toggle("hidden", !showingCareer);
    $("logPanel")?.classList.toggle("collapsed", Boolean(state.logCollapsed));
    $("logPanel")?.classList.toggle("expanded", Boolean(state.logExpanded));
    const mode = $("logModeText");
    if (mode) {
      mode.textContent = state.logCollapsed
        ? "已收起"
        : state.logExpanded
          ? "放大 · 最新在上"
          : "最新在上";
    }
    const collapse = $("logCollapse");
    if (collapse) {
      collapse.textContent = state.logCollapsed ? "恢复" : "收起";
      collapse.classList.toggle("active", state.logCollapsed);
      collapse.disabled = !showingLog;
    }
    const expand = $("logExpand");
    if (expand) {
      expand.textContent = state.logExpanded ? "还原" : "放大";
      expand.classList.toggle("active", state.logExpanded);
      expand.disabled = !showingLog;
    }
  }

  function closeEndGameModal() {
    state.endGameModalOpen = false;
    renderEndGameModal();
  }

  function handleEndGameActionClick(event) {
    const action = event.target?.closest?.("[data-endgame-action]")?.dataset?.endgameAction;
    if (!action) return;
    if (action === "restart") {
      state.endGameModalOpen = false;
      startGame(false);
      return;
    }
    if (action === "home") {
      state.endGameModalOpen = false;
      $("newGame")?.click();
      return;
    }
    if (action === "log") {
      state.endGameModalOpen = false;
      state.infoTab = "log";
      state.sidePanelCollapsed = false;
      state.logCollapsed = false;
      render();
      return;
    }
    if (action === "career") {
      state.endGameModalOpen = false;
      state.infoTab = "career";
      state.sidePanelCollapsed = false;
      render();
    }
  }

  function endGameResultText() {
    return state.status?.detail || state.pending?.prompt?.replace(/^游戏结束：/, "") || "对局结束";
  }

  function winnerLabel(resultText) {
    if (resultText.includes("反贼")) return "反贼阵营";
    if (resultText.includes("主忠")) return "主忠阵营";
    if (resultText.includes("内奸")) return "内奸";
    return resultText.replace(/获胜/g, "") || "未知";
  }

  function renderEndGameModal() {
    const modal = $("endGameModal");
    const content = $("endGameContent");
    if (!modal || !content) return;
    const shouldShow = Boolean(state.gameOver && state.endGameModalOpen);
    modal.classList.toggle("hidden", !shouldShow);
    document.body?.classList?.toggle?.("endgame-open", shouldShow);
    if (!shouldShow) {
      content.innerHTML = "";
      return;
    }
    content.innerHTML = renderEndGameContent();
  }

  function renderEndGameContent() {
    const human = state.players[0];
    const resultText = endGameResultText();
    const won = humanWonResult(resultText, human);
    const metrics = careerRunMetrics();
    const alive = alivePlayers();
    const durationSec = Math.max(0, Math.round((Date.now() - (state.gameStartedAt || Date.now())) / 1000));
    const careerStats = normalizeCareerStats(state.career);
    const careerInsight = careerInsights(careerStats);
    const milestones = careerMilestones(careerStats);
    const doneMilestones = milestones.filter((item) => item.done).length;
    const recent = careerStats.lastGames?.[0];
    const recentForm = (careerStats.lastGames || []).slice(0, 5).map((game) => game.won ? "胜" : "败").join(" · ") || "完成一局后开始记录";
    const resultClass = won ? "win" : "loss";
    const roleClass = human ? `role-${roleToNote(human.role)}` : "role-unknown";
    const survivalText = human?.alive ? "存活到结算" : "阵亡后结算";
    const personalLine = `${won ? "你的阵营获胜" : "你的阵营落败"} · ${escapeHtml(human?.role || "未知身份")} · ${escapeHtml(human?.general?.name || "未知武将")}`;
    const playerRows = state.players.map((player) => `
      <span class="endgame-role-pill ${player.alive ? "alive" : "dead"} role-${roleToNote(player.role)}">
        <b>${escapeHtml(nameOf(player))}</b>
        <em>${escapeHtml(player.role)}</em>
      </span>
    `).join("");
    return `
      <div class="endgame-hero ${resultClass}">
        <span class="eyebrow">本局结算</span>
        <h2 id="endGameTitle">${won ? "胜利" : "失败"}</h2>
        <p>${escapeHtml(personalLine)}</p>
        <div class="endgame-result-strip" aria-label="本局关键结果">
          <span><b>获胜阵营</b><em>${escapeHtml(winnerLabel(resultText))}</em></span>
          <span><b>结局</b><em>${escapeHtml(survivalText)}</em></span>
          <span><b>结束轮次</b><em>第 ${Number(state.round) || 1} 轮</em></span>
        </div>
      </div>
      <div class="endgame-player-card">
        <div>
          <span>你的身份</span>
          <strong class="${roleClass}">${escapeHtml(human?.role || "未知")}</strong>
        </div>
        <div>
          <span>你的武将</span>
          <strong>${escapeHtml(human?.general?.name || "未知")}</strong>
        </div>
        <div>
          <span>生涯</span>
          <strong>${recent?.won ? "本局入胜" : "本局已记录"}</strong>
        </div>
      </div>
      <div class="endgame-stats">
        ${renderEndGameStat("回合", `第 ${Number(state.round) || 1} 轮`)}
        ${renderEndGameStat("存活", `${alive.length}/${state.players.length}`)}
        ${renderEndGameStat("时长", formatDurationSec(durationSec))}
        ${renderEndGameStat("伤害", `${metrics.damageDealt || 0}/${metrics.damageTaken || 0}`)}
        ${renderEndGameStat("击杀", metrics.kills || 0)}
        ${renderEndGameStat("用牌/技能", `${metrics.cardsUsed || 0}/${metrics.skillsUsed || 0}`)}
      </div>
      <section class="endgame-section">
        <header>
          <strong>身份揭示</strong>
          <span>所有身份已公开</span>
        </header>
        <div class="endgame-role-grid">${playerRows}</div>
      </section>
      <section class="endgame-section compact">
        <header>
          <strong>最近生涯</strong>
          <span>${escapeHtml(careerStorageText())}</span>
        </header>
        <p>当前连胜 ${Number(state.career?.currentWinStreak) || 0} · 最佳连胜 ${Number(state.career?.bestWinStreak) || 0} · 总局 ${Number(state.career?.totalGames) || 0}</p>
      </section>
      <section class="endgame-section compact endgame-career-callout">
        <header>
          <strong>生涯进度</strong>
          <span>里程碑 ${doneMilestones}/${milestones.length}</span>
        </header>
        <div class="endgame-career-grid">
          <div>
            <span>当前档案</span>
            <strong>${escapeHtml(careerInsight.rank)}</strong>
            <small>${escapeHtml(careerRate(careerStats.wins, careerStats.totalGames))} 胜率 · ${Number(careerStats.totalGames) || 0} 局</small>
          </div>
          <div>
            <span>下个目标</span>
            <strong>${escapeHtml(careerInsight.nextTitle)}</strong>
            <small>${escapeHtml(careerInsight.nextDetail)}</small>
          </div>
          <div>
            <span>最近走势</span>
            <strong>${escapeHtml(recentForm)}</strong>
            <small>下一局会继续写入本机生涯</small>
          </div>
        </div>
      </section>
      <div class="endgame-actions">
        <button type="button" class="primary" data-endgame-action="restart">再来一局</button>
        <button type="button" data-endgame-action="home">回到首页</button>
        <button type="button" data-endgame-action="log">查看战报</button>
        <button type="button" data-endgame-action="career">看战绩</button>
      </div>
    `;
  }

  function renderEndGameStat(label, value) {
    return `
      <div class="endgame-stat">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(String(value))}</strong>
      </div>
    `;
  }

  function handlePlayerClick(id) {
    if (!state.targetPick) return;
    if (!state.targetPick.validIds.includes(id)) return;
    hideTooltip();
    const selected = state.targetPick.selected;
    if (selected.includes(id)) {
      state.targetPick.selected = selected.filter((x) => x !== id);
    } else if (selected.length < state.targetPick.max) {
      state.targetPick.selected.push(id);
      if (state.targetPick.autoConfirm !== false && state.targetPick.max === 1 && state.targetPick.min === 1) {
        if (!targetPickSelectionValid(state.targetPick)) {
          state.status.warning = state.targetPick?.validatorMessage || "目标组合不合法。";
          render();
          return;
        }
        const targets = state.targetPick.selected.map(playerById).filter(Boolean);
        const resolve = state.targetPick.resolve;
        state.targetPick = null;
        clearWait();
        resolve(targets);
      }
    }
    render();
  }

  function cycleRoleNote(id) {
    hideTooltip();
    closeIdentityPopover();
    const current = state.roleNotes[id] || "unknown";
    const index = ROLE_NOTE_ORDER.indexOf(current);
    state.roleNotes[id] = ROLE_NOTE_ORDER[(index + 1) % ROLE_NOTE_ORDER.length];
    render();
  }

  function setRoleNote(id, value) {
    if (!ROLE_NOTE_ORDER.includes(value)) return;
    hideTooltip();
    closeIdentityPopover();
    state.roleNotes[id] = value;
    render();
  }

  async function handleCardClick(id) {
    hideTooltip();
    if (state.cardPick) {
      const card = state.players[0].hand.find((c) => c.id === id);
      if (!card || !state.cardPick.filter(card)) return;
      if (state.cardPick.selected.includes(id)) {
        state.cardPick.selected = state.cardPick.selected.filter((x) => x !== id);
      } else if (state.cardPick.selected.length < state.cardPick.max) {
        state.cardPick.selected.push(id);
      }
      render();
      return;
    }
    if (!state.playContext || state.playContext.playerId !== 0) return;
    const actions = playActionsForCard(id);
    if (!actions.length) return;
    state.playCardId = id;
    if (actions.length === 1) {
      render();
      await commitPlayAction(actions[0]);
      return;
    }
    render();
  }

  function playActionsForCard(cardId) {
    if (!state.playContext) return [];
    return (state.playContext.actions || []).filter((action) => moveConsumeIds(action).includes(cardId));
  }

  function pickTargets(prompt, targets, min, max, owner = playerById(state.current), options = {}) {
    if (!humanControls(owner)) return Promise.resolve(autoPickTargets(targets, min, max));
    return new Promise((resolve) => {
      const waitPrompt = options.autoConfirm === false ? `${prompt} 选好后点击确认目标。` : prompt;
      setWait("选择目标", waitPrompt, owner.id, `${targets.length} 个合法目标`);
      state.targetPick = {
        prompt: waitPrompt,
        validIds: targets.map((p) => p.id),
        selected: [],
        min,
        max,
        autoConfirm: options.autoConfirm !== false,
        ownerId: owner.id,
        previewAction: options.previewAction || null,
        selectionValidator: options.selectionValidator || null,
        validatorMessage: options.validatorMessage || "",
        resolve
      };
      render();
    });
  }

  function autoPickTargets(targets, min, max) {
    const legal = (targets || []).filter((target) => target?.alive);
    if (legal.length < min) return [];
    return legal.slice(0, Math.max(min, max));
  }

  async function pickBorrowSwordTargets(player, action, options = {}) {
    const wielders = legalTargets(player, action);
    const wielder = await askHumanTarget("借刀杀人：选择一名有武器的目标。", wielders, player, options);
    if (!wielder) return [];
    const victim = await askHumanTarget(`借刀杀人：选择 ${nameOf(wielder)} 要出杀的目标。`, borrowSwordVictims(player, wielder), player, options);
    return victim ? [wielder, victim] : [];
  }

  async function pickDimengTargets(player, action, options = {}) {
    if (!humanControls(player)) {
      return dimengPairs(player)
        .slice()
        .sort((a, b) => scoreDimeng(player, b) - scoreDimeng(player, a))[0] || [];
    }
    return pickTargets(
      "缔盟：一次选择两名其他角色，然后确认交换手牌。",
      legalTargets(player, action),
      2,
      2,
      player,
      { ...options, autoConfirm: false, ...targetPickOptionsForAction(action, player) }
    );
  }

  function targetBounds(action, player) {
    if (!action.needsTarget) return { min: 0, max: 0 };
    if (action.targetMode === "twoMaleEnemies" || action.targetMode === "twoMaleAny" || action.targetMode === "twoAny" || action.targetMode === "dimengPair" || action.targetMode === "xuanhuoPair" || action.targetMode === "ganluPair" || action.targetMode === "anxuPair") return { min: 2, max: 2 };
    if (action.targetMode === "borrowSword") return { min: 2, max: 2 };
    if (action.targetMode === "chainTargets") {
      const legalCount = player ? legalTargets(player, action).length : 1;
      return { min: 1, max: Math.min(2, legalCount) };
    }
    if (action.targetMode === "fangtian" || action.targetMode === "tianyiSlash") {
      const legalCount = player ? legalTargets(player, action).length : 1;
      return { min: 1, max: slashTargetMax(action, player, legalCount) };
    }
    return { min: 1, max: 1 };
  }

  function targetPromptForAction(action) {
    if (action.skill === "lijian") return "离间：先选视为使用决斗的男性角色，再选其决斗目标。";
    if (action.skill === "dimeng") return "缔盟：一次选择两名可交换手牌的角色，然后确认。";
    if (action.skill === "xuanhuo") return "眩惑：先选获得红桃牌的角色，再选转交牌的角色。";
    if (action.skill === "ganlu") return "甘露：选择两名交换装备区的角色。";
    if (action.skill === "anxu") return "安恤：选择两名手牌数不同的其他角色。";
    if (action.targetMode === "tianyiSlash") return "天义：为杀选择 1-2 名目标。";
    if (action.targetMode === "fangtian" && action.effect === "slash") return "方天画戟：为杀选择多个目标。";
    return `为 ${action.label} 选择目标。`;
  }

  async function askHumanTarget(prompt, targets, owner = playerById(state.current), options = {}) {
    const chosen = await pickTargets(prompt, targets, 1, 1, owner, options);
    return chosen[0] || null;
  }

  function askHumanSelectCards(player, prompt, min, max, filter, allowCancel) {
    if (!player.isHuman || state.autoplayHuman || state.autoplayHumanForTurn) return Promise.resolve([]);
    return new Promise((resolve) => {
      setWait("选择手牌", prompt, player.id, `${min}-${max} 张`);
      state.cardPick = {
        prompt,
        ownerId: player.id,
        min,
        max,
        filter,
        allowCancel,
        selected: [],
        resolve
      };
      render();
    });
  }

  function askChoice(prompt, options, owner = null) {
    const chooser = owner || playerById(state.current);
    if (!humanControls(chooser)) return Promise.resolve(autoChoiceValue(options));
    return new Promise((resolve) => {
      setWait("选择", prompt, chooser.id, `${options.length} 个选项`);
      state.pending = {
        prompt,
        ownerId: chooser.id,
        options: options.map((option) => ({
          ...option,
          onChoose: () => {
            state.pending = null;
            clearWait();
            resolve(option.value);
          }
        }))
      };
      render();
    });
  }

  function askYesNo(prompt, defaultYes, owner = null) {
    const chooser = owner || playerById(state.current);
    if (!humanControls(chooser)) return Promise.resolve(Boolean(defaultYes));
    return new Promise((resolve) => {
      setWait("是否发动", prompt, chooser.id);
      state.pending = {
        prompt,
        ownerId: chooser.id,
        options: [
          { label: "是", value: true, onChoose: () => { state.pending = null; clearWait(); resolve(true); } },
          { label: "否", value: false, danger: !defaultYes, onChoose: () => { state.pending = null; clearWait(); resolve(false); } }
        ]
      };
      render();
    });
  }

  function humanControls(player) {
    return Boolean(player?.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn);
  }

  function autoChoiceValue(options) {
    if (!options?.length) return null;
    const safePass = options.find((option) => option.value === false || option.value === null);
    return (safePass || options[0]).value;
  }

  function resolveDefaultPending() {
    if (!state.pending?.options?.length) return;
    const pass = state.pending.options.find((o) => o.value === false || o.value === null) || state.pending.options[0];
    pass.onChoose?.(pass.value);
  }

  function activateAutoplayForTurn() {
    state.autoplayHumanForTurn = true;
    if (state.pending) {
      resolveDefaultPending();
      return;
    }
    if (state.cardPick?.resolve) {
      const pick = state.cardPick;
      const resolve = pick.resolve;
      const ids = autoPickCardIds(pick);
      state.cardPick = null;
      state.playCardId = null;
      clearWait();
      resolve(ids);
      return;
    }
    if (state.targetPick?.resolve) {
      const pick = state.targetPick;
      const resolve = pick.resolve;
      const targets = autoPickTargets(pick.validIds.map(playerById).filter(Boolean), pick.min, pick.max);
      state.targetPick = null;
      state.playCardId = null;
      clearWait();
      resolve(targets);
      return;
    }
    if (state.playContext?.resolver) {
      const resolve = state.playContext.resolver;
      state.playContext = null;
      state.playCardId = null;
      clearWait();
      log("诊断：已将玩家出牌阶段转交 AI 托管。");
      resolve({ type: "auto" });
    }
  }

  function autoPickCardIds(pick) {
    if (!pick || pick.allowCancel || pick.min <= 0) return [];
    return state.players[0].hand
      .filter((card) => !pick.filter || pick.filter(card))
      .slice(0, pick.min)
      .map((card) => card.id);
  }

  function isCardSelected(card) {
    return Boolean(state.cardPick?.selected?.includes(card.id) || state.playCardId === card.id);
  }

  function isCardPickable(card) {
    if (state.playContext) return playActionsForCard(card.id).length > 0;
    if (!state.cardPick) return true;
    return state.cardPick.filter(card);
  }

  const LORD_SKILLS = new Set(["jijiang", "hujia", "jiuyuan", "huangtian", "zhiba", "songwei", "baonue", "xueyi"]);

  function hasNativeSkill(player, skill) {
    if (!player || player.disabledSkills?.includes(skill)) return false;
    return player.general.skills.includes(skill) || player.extraSkills?.includes(skill) || player.tempSkills?.includes(skill);
  }

  function hasSkill(player, skill) {
    if (hasNativeSkill(player, skill)) return true;
    if (!player || player.disabledSkills?.includes(skill) || !hasNativeSkill(player, "weidi") || !LORD_SKILLS.has(skill)) return false;
    const lord = playerById(state.masterId);
    return Boolean(lord && lord.id !== player.id && hasNativeSkill(lord, skill) && !lord.disabledSkills?.includes(skill));
  }

  function canActAsLordSkillOwner(player, skill) {
    return Boolean(player?.alive && hasSkill(player, skill) && (player.role === "主公" || hasNativeSkill(player, "weidi")));
  }

  function alivePlayers() {
    return state.players.filter((p) => p.alive);
  }

  function aliveFrom(startId) {
    if (!state.players.length) return [];
    const first = playerById(startId)?.alive ? startId : nextAliveIndex(startId);
    const ordered = [];
    const seen = new Set();
    let id = first;
    while (!seen.has(id)) {
      seen.add(id);
      const player = playerById(id);
      if (player?.alive) ordered.push(player);
      const next = nextAliveIndex(id);
      if (next === id) break;
      id = next;
    }
    return ordered;
  }

  function nextAliveIndex(from) {
    for (let step = 1; step <= state.players.length; step += 1) {
      const id = (from + TURN_FLOW.step * step + state.players.length) % state.players.length;
      if (state.players[id].alive) return id;
    }
    return from;
  }

  function turnPassedRoundBoundary(from, to) {
    if (from == null || to == null || from === to) return false;
    return TURN_FLOW.step > 0 ? to <= from : to >= from;
  }

  function massTrickTargetsInOrder(source, { includeSource = false } = {}) {
    if (!source?.alive) return [];
    const startId = includeSource ? source.id : nextAliveIndex(source.id);
    return aliveFrom(startId).filter((player) => includeSource || player.id !== source.id);
  }

  function playerById(id) {
    return state.players.find((p) => p.id === id);
  }

  function nameOf(player) {
    if (!player) return "未知角色";
    return player.isHuman ? `你(${player.general.name})` : player.general.name;
  }

  function roleSide(role) {
    if (role === "主公" || role === "忠臣") return "lord";
    if (role === "反贼") return "rebel";
    return "traitor";
  }

  function attitude(actor, target) {
    if (!actor || !target) return 0;
    if (actor.id === target.id) return 2;
    if (state.aiMode === "oracle" || isRolePublicTo(actor, target)) {
      if (actor.role === "内奸" && target.role === "主公") return traitorLordAttitude(actor, target) + rand(-0.12, 0.12) * actor.personality.chaos;
      return roleAttitude(actor, target) + rand(-0.18, 0.18);
    }
    const read = state.reads[actor.id]?.[target.id] || 0;
    const confidence = clamp(Math.abs(read) / 3, 0, 1);
    const noise = rand(-0.12, 0.12) * actor.personality.chaos;
    let base = 0;
    if (isPublicLordTo(actor, target)) {
      if (actor.role === "反贼") return -2;
      if (actor.role === "忠臣" || actor.role === "主公") return 2;
      return traitorLordAttitude(actor, target);
    }
    if (actor.role === "反贼") {
      base = read > 0.35 ? 0.55 + confidence * 0.45 : -0.35 - confidence * 0.3;
    } else if (actor.role === "忠臣" || actor.role === "主公") {
      base = read > 0.35 ? -0.8 - confidence * 0.55 : 0.12 + confidence * 0.28;
    } else {
      base = traitorReadAttitude(actor, target, read);
    }
    if (state.aiMode === "strategist" && read > 0.35 && (actor.role === "主公" || actor.role === "忠臣")) {
      base -= Math.min(0.32, threatScore(actor, target) * 0.08);
    }
    return base + noise;
  }

  function isRolePublicTo(actor, target) {
    return target.id === actor.id || target.role === "主公" || (target.revealed && !target.alive);
  }

  function isPublicLordTo(actor, target) {
    return Boolean(target?.role === "主公" && (!actor || isRolePublicTo(actor, target)));
  }

  function roleAttitude(actor, target) {
    if (actor.role === "主公") return target.role === "忠臣" ? 2 : target.role === "主公" ? 2 : -2;
    if (actor.role === "忠臣") return target.role === "主公" || target.role === "忠臣" ? 2 : -2;
    if (actor.role === "反贼") return target.role === "反贼" ? 1.7 : -2;
    return traitorAttitude(actor, target);
  }

  function traitorAttitude(actor, target) {
    const { rebels, loyal } = estimatedFactionBalance(actor);
    if (alivePlayers().length <= 2) return target.role === "主公" ? -2.5 : -1;
    if (rebels > loyal) return target.role === "反贼" ? -1.4 : 0.4;
    if (loyal > rebels) return target.role === "忠臣" ? -1.2 : target.role === "主公" ? 0.2 : 0.1;
    return target.hp <= 2 ? -0.9 : 0;
  }

  function traitorLordAttitude(actor, lord) {
    const alive = alivePlayers().length;
    if (alive <= 2) return -2.45;
    const { rebels, loyal } = estimatedFactionBalance(actor);
    const pressure = rebels - loyal;
    if (lord.hp <= 1 && rebels > 0.45) return 1.35;
    if (pressure > 0.65) return 0.95;
    if (pressure < -1.2 && lord.hp > 2) return -0.42;
    if (pressure < -0.65 && lord.hp > 1) return -0.16;
    return 0.48;
  }

  function estimatedFactionBalance(observer) {
    if (state.aiMode === "oracle") {
      return {
        rebels: alivePlayers().filter((p) => p.role === "反贼").length,
        loyal: alivePlayers().filter((p) => p.role === "忠臣" || p.role === "主公").length
      };
    }
    // Fair AI should not count hidden identities; estimate balance from public lord info and behavior reads.
    const reads = state.reads[observer.id] || {};
    return alivePlayers().reduce((balance, player) => {
      if (player.id === observer.id) return balance;
      if (isPublicLordTo(observer, player)) {
        balance.loyal += 1;
        return balance;
      }
      if (isRolePublicTo(observer, player)) {
        if (player.role === "反贼") balance.rebels += 1;
        if (player.role === "忠臣") balance.loyal += 1;
        return balance;
      }
      const read = reads[player.id] || 0;
      balance.rebels += clamp(0.5 + read * 0.18, 0.15, 0.85);
      balance.loyal += clamp(0.5 - read * 0.18, 0.15, 0.85);
      return balance;
    }, { rebels: 0, loyal: 0 });
  }

  function traitorReadAttitude(actor, target, read) {
    const alive = alivePlayers().length;
    if (alive <= 2) return read > 0.35 ? -1.05 : read < -0.35 ? -0.72 : -0.82;
    const { rebels, loyal } = estimatedFactionBalance(actor);
    const pressure = rebels - loyal;
    const confidence = clamp(Math.abs(read) / 3, 0, 1);
    const threat = threatScore(actor, target);
    const lowHpRestraint = target.hp <= 1 && alive > 3 ? 0.24 : 0;
    if (read > 0.35) {
      if (pressure > 0.45) return -0.56 - confidence * 0.56 - threat * 0.06 + lowHpRestraint;
      if (pressure < -0.65) return 0.22 + confidence * 0.32;
      return target.hp <= 2 ? -0.28 - confidence * 0.18 : -0.04;
    }
    if (read < -0.35) {
      if (pressure < -0.45) return -0.5 - confidence * 0.5 - threat * 0.05 + lowHpRestraint;
      if (pressure > 0.65) return 0.2 + confidence * 0.28;
      return target.hp <= 2 ? -0.24 - confidence * 0.14 : 0.02;
    }
    if (pressure > 0.9 && target.hp <= 2) return -0.22;
    if (pressure < -0.9 && target.hp > 1) return -0.16;
    return target.hp <= 1 ? 0.18 : 0.06;
  }

  function updateReadsForMove(actor, move) {
    move.targets?.forEach((target) => {
      const controlSupport = isSupportiveControlMove(actor, move, target);
      const isOffense = !controlSupport && isTargetedOffenseMove(move);
      const isSupport = controlSupport || isTargetedSupportMove(move);
      if (isPublicLordTo(actor, target) && isOffense) {
        bumpAllReads(actor.id, 1.3, `${nameOf(actor)} 对主公做出进攻行为`);
      }
      if (isPublicLordTo(actor, target) && isSupport) {
        bumpAllReads(actor.id, -1.1, `${nameOf(actor)} 保护或支援主公`);
      }
      if (actor.role === "主公" && !isPublicLordTo(actor, target) && isOffense) {
        bumpAllReads(target.id, 0.45, `主公主动压制 ${nameOf(target)}`);
      }
      if (actor.role === "主公" && !isPublicLordTo(actor, target) && isSupport) {
        bumpAllReads(target.id, -0.55, `主公支援 ${nameOf(target)}`);
      }
      updateReadsFromObservedTarget(actor, target, isSupport ? "support" : (isOffense ? "offense" : ""));
    });
    updateReadsForLordAvoidance(actor, move);
    updateReadsForMassTrick(actor, move);
  }

  function updateReadsForDamage(source, target, card = null) {
    const massDamage = isMassDamageCard(card);
    if (isPublicLordTo(source, target)) {
      const amount = massDamage ? (target.hp <= 1 ? 0.14 : 0.08) : 1.2;
      const reason = massDamage
        ? `${nameOf(source)} 的${card.name}实际波及主公，AOE伤害只作弱证据`
        : `${nameOf(source)} 对主公造成伤害`;
      if (massDamage) bumpAllMassReadEvidence(source.id, amount, reason, "damage");
      else bumpAllReads(source.id, amount, reason);
    }
    if (source.role === "主公") {
      const amount = massDamage ? 0.08 : 0.4;
      const reason = `${nameOf(target)} 被主公${massDamage ? "AOE波及，弱证据" : "伤害"}`;
      if (massDamage) bumpAllMassReadEvidence(target.id, amount, reason, "damage");
      else bumpAllReads(target.id, amount, reason);
    }
    updateReadsFromObservedTarget(source, target, "offense", massDamage ? 0.11 : 0.7, { massDamage });
  }

  function isMassDamageCard(card) {
    return ["barbarians", "arrows"].includes(card?.subtype) || ["南蛮入侵", "万箭齐发"].includes(card?.name);
  }

  function updateReadsForHeal(source, target) {
    if (isPublicLordTo(source, target)) bumpAllReads(source.id, -0.9, `${nameOf(source)} 治疗主公`);
    if (source.role === "主公" && !isPublicLordTo(source, target)) bumpAllReads(target.id, -0.5, `主公治疗 ${nameOf(target)}`);
    updateReadsFromObservedTarget(source, target, "support", 0.65);
  }

  function updateReadsForNullify(responder, source, target, card, becomesNullified) {
    if (!responder || !card || card.type !== "trick" || card.subtype === "nullify") return;
    const targetIntent = nullifyTargetIntent(card, target, becomesNullified);
    if (targetIntent && target) {
      updateReadsForPublicIntent(responder, target, targetIntent.intent, targetIntent.scale, targetIntent.reason);
    }
    if (source && source.id !== responder.id) {
      const sourceIntent = nullifySourceIntent(card, target, becomesNullified);
      if (sourceIntent) {
        updateReadsForPublicIntent(responder, source, sourceIntent.intent, sourceIntent.scale, sourceIntent.reason);
      }
    }
  }

  function nullifyTargetIntent(card, target, becomesNullified) {
    if (!target) return null;
    const harmful = isHarmfulTrickForTarget(card, target);
    const helpful = isHelpfulTrickForTarget(card, target);
    if (!harmful && !helpful) return null;
    if (harmful) {
      return becomesNullified
        ? { intent: "support", scale: 0.72, reason: `用无懈保护 ${nameOf(target)} 免受${card.name}` }
        : { intent: "offense", scale: 0.66, reason: `反无懈使 ${nameOf(target)} 继续承受${card.name}` };
    }
    return becomesNullified
      ? { intent: "offense", scale: 0.46, reason: `用无懈阻止 ${nameOf(target)} 获益于${card.name}` }
      : { intent: "support", scale: 0.42, reason: `反无懈让 ${nameOf(target)} 继续获得${card.name}` };
  }

  function nullifySourceIntent(card, target, becomesNullified) {
    const harmful = target ? isHarmfulTrickForTarget(card, target) : ["barbarians", "arrows"].includes(card.subtype);
    const helpful = target ? isHelpfulTrickForTarget(card, target) : ["taoyuan", "harvest"].includes(card.subtype);
    if (!harmful && !helpful) return null;
    if (harmful) {
      return becomesNullified
        ? { intent: "offense", scale: 0.36, reason: `无懈阻止 ${card.name}` }
        : { intent: "support", scale: 0.32, reason: `反无懈帮助 ${card.name} 生效` };
    }
    return becomesNullified
      ? { intent: "offense", scale: 0.32, reason: `无懈阻止 ${card.name} 生效` }
      : { intent: "support", scale: 0.28, reason: `反无懈帮助 ${card.name} 生效` };
  }

  function isHarmfulTrickForTarget(card, target) {
    if (!card || !target) return false;
    return ["steal", "dismantle", "duel", "fireAttack", "lebu", "bingliang", "borrowSword", "barbarians", "arrows"].includes(card.subtype);
  }

  function isHelpfulTrickForTarget(card, target) {
    if (!card || !target) return false;
    return card.subtype === "draw2" || card.subtype === "taoyuan" || card.subtype === "harvest";
  }

  function updateReadsForPublicIntent(actor, target, intent, scale = 1, reason = "") {
    if (!actor || !target || !intent || actor.id === target.id) return;
    if (isPublicLordTo(actor, target)) {
      const amount = (intent === "offense" ? 0.96 : -0.86) * scale;
      bumpAllReads(actor.id, amount, reason || `${nameOf(actor)} ${intent === "offense" ? "压制" : "支援"}主公`);
    }
    if (actor.role === "主公" && !isPublicLordTo(actor, target)) {
      const amount = (intent === "offense" ? 0.38 : -0.46) * scale;
      bumpAllReads(target.id, amount, reason || `主公${intent === "offense" ? "压制" : "支援"} ${nameOf(target)}`);
    }
    updateReadsFromObservedTarget(actor, target, intent, scale);
  }

  function moveIntentKind(move) {
    if (isTargetedOffenseMove(move)) return "offense";
    if (isTargetedSupportMove(move)) return "support";
    return "";
  }

  function moveIntentKindForActor(actor, move) {
    const target = aiMovePrimaryTarget(actor, move);
    if (isSupportiveControlMove(actor, move, target)) return "support";
    return moveIntentKind(move);
  }

  function isTargetedOffenseMove(move) {
    const effect = move?.effect;
    const skill = move?.skill;
    return ["slash", "duel", "fireAttack", "lebu", "bingliang", "dismantle", "steal", "borrowSword"].includes(effect)
      || ["qiangxi", "fanjian", "lijian", "quhu", "shensu", "tiaoxin", "jixi"].includes(skill);
  }

  function isTargetedSupportMove(move) {
    const effect = move?.effect;
    const skill = move?.skill;
    return effect === "peach" || ["qingnang", "rende", "jieyin", "zhijian", "fangquan", "huangtian", "zhiba", "jujian", "ganlu", "anxu"].includes(skill);
  }

  function publicLord() {
    return alivePlayers().find((player) => player.role === "主公") || null;
  }

  function updateReadsForLordAvoidance(actor, move) {
    const lord = publicLord();
    if (!actor || !move || !lord || actor.id === lord.id) return;
    if (!moveCouldTargetPublicLord(actor, move, lord)) return;
    const chosenTargets = move.targets || [];
    const targetText = chosenTargets.length ? chosenTargets.map(nameOf).join("、") : "其他目标";
    state.players.forEach((observer) => {
      const targetReads = chosenTargets
        .filter((target) => target && !isPublicLordTo(observer, target))
        .map((target) => perceivedRebelRead(observer, target));
      let amount = observer.role === "反贼" ? -0.66 : observer.role === "内奸" ? -0.36 : -0.62;
      if (targetReads.some((read) => read > 0.65)) amount -= 0.2;
      if (targetReads.some((read) => read < -0.65)) amount += 0.32;
      if (amount < -0.05) {
        const stance = observer.role === "反贼"
          ? "表露主忠立场"
          : observer.role === "内奸"
            ? "表露偏忠，内奸暂记为控场信号"
            : "表露偏忠";
        bumpRead(observer, actor.id, amount, `${nameOf(actor)} 可压制主公但选择 ${targetText}，${stance}`);
      }
    });
  }

  function moveCouldTargetPublicLord(actor, move, lord) {
    if (!move?.needsTarget || !isTargetedOffenseMove(move)) return false;
    if ((move.targets || []).some((target) => target?.id === lord.id)) return false;
    if (move.effect === "borrowSword") {
      return borrowSwordPairs(actor, move).some((pair) => pair.some((target) => target.id === lord.id));
    }
    return legalTargets(actor, move).some((target) => target.id === lord.id);
  }

  function updateReadsForMassTrick(actor, move) {
    if (!actor || !["barbarians", "arrows"].includes(move?.effect)) return;
    const lord = publicLord();
    const affected = massTrickPotentialTargets(actor, move);
    if (!affected.length) return;
    const cardNameText = move.card?.name || move.label || "群体锦囊";
    state.players.forEach((observer) => {
      let amount = 0;
      const reasons = [];
      const priorRead = state.reads[observer.id]?.[actor.id] || 0;
      if (lord && actor.id !== lord.id && affected.some((target) => target.id === lord.id)) {
        const lordAmount = lord.hp <= 1 ? 0.52 : lord.hp <= 2 ? 0.38 : 0.26;
        amount += lordAmount;
        reasons.push(lord.hp <= 2 ? "主公低体力" : "波及主公");
      }
      affected.forEach((target) => {
        if (target.id === actor.id || target.id === lord?.id) return;
        const read = perceivedRebelRead(observer, target);
        if (read > 0.65) {
          amount -= clamp(read * 0.055, 0.05, 0.16);
          reasons.push("也波及疑似反贼");
        } else if (read < -0.65) {
          amount += clamp(-read * 0.055, 0.05, 0.16);
          reasons.push("波及疑似忠臣");
        }
      });
      if (priorRead < -0.65 && amount > 0) {
        amount *= 0.42;
        reasons.push("已有偏忠读数，AOE不直接翻案");
      } else if (priorRead > 0.9 && amount > 0) {
        amount *= 1.05;
        reasons.push("已有偏反读数，AOE作为补充证据");
      } else if (priorRead < -0.45 && amount > 0) {
        amount *= 0.62;
        reasons.push("已有偏忠读数，AOE不直接翻案");
      }
      amount = clamp(amount, -0.36, 0.68);
      if (Math.abs(amount) >= 0.08) {
        const reason = `${nameOf(actor)} 使用${cardNameText}：${Array.from(new Set(reasons)).join("、") || "群体影响，弱证据"}`;
        bumpMassReadEvidence(observer, actor.id, amount, reason, "move");
      }
    });
  }

  function massTrickPotentialTargets(actor, move) {
    return alivePlayers()
      .filter((target) => target.id !== actor.id)
      .filter((target) => massTrickThreatensTarget(target, move));
  }

  function massTrickThreatensTarget(target, move) {
    if (!target?.alive) return false;
    if (isProtectedFromTrick(target, move)) return false;
    if (isProtectedFromMassDamage(target, move.effect)) return false;
    if (move.effect === "barbarians" && (hasSkill(target, "huoshou") || hasSkill(target, "juxiang"))) return false;
    return true;
  }

  function updateReadsFromObservedTarget(actor, target, intent, scale = 1, options = {}) {
    if (!actor || !target || !intent || actor.id === target.id || isPublicLordTo(actor, target)) return;
    state.players.forEach((observer) => {
      if (observer.id === actor.id) return;
      const targetRead = perceivedRebelRead(observer, target);
      if (targetRead > 0.65) {
        const amount = intent === "offense" ? -0.34 : 0.32;
        const verb = intent === "offense" ? "压制疑似反贼" : "支援疑似反贼";
        const reason = `${nameOf(actor)} ${verb} ${nameOf(target)}${options.massDamage ? "，AOE波及弱证据" : ""}`;
        if (options.massDamage) bumpMassReadEvidence(observer, actor.id, amount * scale, reason, "damage");
        else bumpRead(observer, actor.id, amount * scale, reason);
      } else if (targetRead < -0.65) {
        const amount = intent === "offense" ? 0.34 : -0.32;
        const verb = intent === "offense" ? "攻击疑似忠臣" : "支援疑似忠臣";
        const reason = `${nameOf(actor)} ${verb} ${nameOf(target)}${options.massDamage ? "，AOE波及弱证据" : ""}`;
        if (options.massDamage) bumpMassReadEvidence(observer, actor.id, amount * scale, reason, "damage");
        else bumpRead(observer, actor.id, amount * scale, reason);
      }
    });
  }

  function perceivedRebelRead(observer, target) {
    if (isRolePublicTo(observer, target)) {
      if (target.role === "反贼") return 2.2;
      if (target.role === "忠臣" || target.role === "主公") return -2.2;
      return 0;
    }
    return state.reads[observer.id]?.[target.id] || 0;
  }

  function bumpAllReads(playerId, amount, reason = "") {
    state.players.forEach((observer) => bumpRead(observer, playerId, amount, reason));
  }

  function bumpAllMassReadEvidence(playerId, amount, reason = "", stage = "move") {
    state.players.forEach((observer) => bumpMassReadEvidence(observer, playerId, amount, reason, stage));
  }

  function bumpMassReadEvidence(observer, playerId, amount, reason = "", stage = "move") {
    const adjusted = massReadDeltaWithLoyalInertia(observer, playerId, amount, stage);
    if (Math.abs(adjusted) < 0.015) return;
    const cappedReason = amount > 0 && adjusted < amount - 0.015 && !reason.includes("AOE不直接") && !reason.includes("单次AOE")
      ? `${reason}，单次AOE不直接定性`
      : reason;
    bumpRead(observer, playerId, adjusted, Math.abs(adjusted) >= 0.05 ? cappedReason : "");
  }

  function massReadDeltaWithLoyalInertia(observer, playerId, amount, stage = "move") {
    if (!observer || amount <= 0) return amount;
    const prior = state.reads[observer.id]?.[playerId] || 0;
    const ceiling = massReadCeilingForPrior(prior, stage);
    if (ceiling === null) return amount;
    return Math.min(amount, Math.max(0, ceiling - prior));
  }

  function massReadCeilingForPrior(prior, stage = "move") {
    if (prior < -0.9) return stage === "damage" ? -0.68 : -0.55;
    if (prior < -0.65) return stage === "damage" ? -0.56 : -0.28;
    if (prior < -0.45) return stage === "damage" ? -0.46 : 0.12;
    if (prior < -0.2) return 0.34;
    if (prior < 0.3) return 0.34;
    return null;
  }

  function bumpRead(observer, playerId, amount, reason = "") {
    if (!state.reads[observer.id]) return;
    state.reads[observer.id][playerId] = clamp((state.reads[observer.id][playerId] || 0) + amount, -3, 3);
    if (reason && observer.id !== playerId) noteReadReason(observer.id, playerId, amount, reason);
  }

  function noteReadReason(observerId, playerId, amount, reason) {
    if (!state.readReasons[observerId]) state.readReasons[observerId] = {};
    if (!state.readReasons[observerId][playerId]) state.readReasons[observerId][playerId] = [];
    const label = amount > 0 ? "偏反" : "偏忠";
    state.readReasons[observerId][playerId].unshift(`${label} ${amount > 0 ? "+" : ""}${amount.toFixed(1)}：${reason}`);
    state.readReasons[observerId][playerId] = state.readReasons[observerId][playerId].slice(0, 4);
  }

  function noteResponse(player, kind, used) {
    const reads = state.cardReads[player.id];
    if (!reads || !Object.prototype.hasOwnProperty.call(reads, kind)) return;
    const delta = used ? 1.0 : -0.85;
    reads[kind] = clamp((reads[kind] || 0) + delta, -3, 3);
  }

  function noteCardsGained(player, count) {
    const reads = state.cardReads[player.id];
    if (!reads || !count) return;
    Object.keys(reads).forEach((kind) => {
      reads[kind] = clamp((reads[kind] || 0) * 0.82 + count * 0.08, -3, 3);
    });
  }

  function estimatedResponseCount(player, kind, observer = null) {
    if (state.aiMode === "oracle" || observer?.id === player.id) return countResponseCards(player, kind);
    const read = state.cardReads[player.id]?.[kind] || 0;
    const base = kind === "peach" || kind === "nullify" ? 0.45 : 0.9;
    const handFactor = Math.min(2.4, player.hand.length * 0.18);
    return clamp(base + handFactor + read * 0.38, 0, Math.max(0.2, player.hand.length));
  }

  function aiEnemies(player) {
    return alivePlayers().filter((p) => p.id !== player.id && attitude(player, p) < -0.4);
  }

  function aiShouldRespond(player, kind, context) {
    if (kind === "dodge" || kind === "slash") {
      if (responsePreventsDamage(kind, context)) return true;
      if (!context.source) return true;
      const att = attitude(player, context.source);
      const friendlyFire = att > 0.8;
      const danger = player.hp <= 2 ? 1.05 : 0.42;
      if (friendlyFire && player.hp > 2) return Math.random() < 0.12 * player.personality.chaos;
      const responseStock = Math.min(4, estimatedResponseCount(player, kind, player));
      const willingness = danger * player.personality.caution + (-att) * 0.32 + responseStock * 0.08;
      return willingness > 0.45 + Math.random() * 0.35;
    }
    return true;
  }

  function responsePreventsDamage(kind, context = {}) {
    const reason = context.reason || "";
    const subtype = context.card?.subtype || "";
    if (kind === "slash") {
      return subtype === "barbarians" || subtype === "duel" || ["南蛮入侵", "决斗", "额外响应"].includes(reason);
    }
    if (kind === "dodge") {
      return subtype === "arrows" || ["杀", "万箭齐发", "额外响应"].includes(reason);
    }
    return false;
  }

  function aiShouldSave(saver, target, source) {
    if (saver.id === target.id) return true;
    const att = attitude(saver, target);
    if (att <= 0) return false;
    if (isPublicLordTo(saver, target) && (saver.role === "忠臣" || saver.role === "主公")) return true;
    if (saver.hp <= 1 && estimatedResponseCount(saver, "peach", saver) <= 1) return att > 1.5;
    if (saver.hp <= 2 && estimatedResponseCount(saver, "peach", saver) <= 1 && !isPublicLordTo(saver, target)) {
      return att > 1.4 && Math.random() < 0.55 * saver.personality.loyalty;
    }
    const risk = target.hp <= 0 ? 0.16 : 0;
    return Math.random() < (0.72 + risk) * saver.personality.loyalty;
  }

  function aiShouldTuxi(player) {
    const targets = chooseTuxiTargets(player);
    if (!targets.length) return false;
    const pressure = targets.reduce((sum, target) => sum + Math.max(0, -attitude(player, target)) + threatScore(player, target) * 0.16, 0);
    return pressure > 0.85 || (targets.length >= 2 && player.hand.length >= player.hp);
  }

  function chooseTuxiTargets(player) {
    return tuxiCandidates(player)
      .sort((a, b) => tuxiTargetScore(player, b) - tuxiTargetScore(player, a))
      .filter((target) => tuxiTargetScore(player, target) > -0.15)
      .slice(0, 2);
  }

  function tuxiCandidates(player) {
    return alivePlayers().filter((p) => p.id !== player.id && p.hand.length > 0);
  }

  function tuxiTargetScore(player, target) {
    return -attitude(player, target) + threatScore(player, target) * 0.22 + Math.min(0.6, target.hand.length * 0.08);
  }

  function canRewriteJudge(player) {
    return Boolean(player?.alive && player.hand.length && (hasSkill(player, "guicai") || hasSkill(player, "guidao")) && judgeRewriteCandidates(player).length);
  }

  function judgeRewriteSkill(player) {
    if (hasSkill(player, "guicai")) return "guicai";
    if (hasSkill(player, "guidao")) return "guidao";
    return "";
  }

  function canUseCardForJudgeRewrite(player, card) {
    if (!card) return false;
    if (hasSkill(player, "guicai")) return true;
    return hasSkill(player, "guidao") && isBlackFor(player, card);
  }

  function judgeRewriteCandidates(player) {
    return player.hand.filter((card) => canUseCardForJudgeRewrite(player, card));
  }

  function aiShouldGuicai(player, judgeOwner, reason, card) {
    const attitudeToOwner = attitude(player, judgeOwner);
    if (Math.abs(attitudeToOwner) < 0.35) return false;
    const wantsGood = attitudeToOwner > 0;
    const currentGood = judgeOutcomeGoodForOwner(reason, card);
    if (currentGood == null || currentGood === wantsGood) return false;
    return Boolean(chooseGuicaiCard(player, judgeOwner, reason, card, wantsGood));
  }

  function chooseGuicaiCard(player, judgeOwner, reason, currentCard, wantsGood = null) {
    const desiredGood = wantsGood ?? (attitude(player, judgeOwner) >= 0);
    const candidates = judgeRewriteCandidates(player)
      .filter((card) => judgeOutcomeGoodForOwner(reason, card) === desiredGood)
      .sort((a, b) => cardKeepValue(player, a) - cardKeepValue(player, b));
    if (candidates.length) return candidates[0];
    return null;
  }

  function judgeOutcomeGoodForOwner(reason, card) {
    if (!card) return null;
    const suit = cardSuitFor(null, card);
    if (reason.includes("乐不思蜀")) return suit === "♥";
    if (reason.includes("兵粮寸断")) return suit === "♣";
    if (reason.includes("闪电")) return !(suit === "♠" && rankValue(card.rank) >= 2 && rankValue(card.rank) <= 9);
    if (reason.includes("八卦") || reason.includes("八阵")) return RED_SUITS.has(suit);
    if (reason.includes("洛神")) return !RED_SUITS.has(suit);
    if (reason.includes("铁骑")) return RED_SUITS.has(suit);
    if (reason.includes("雷击")) return suit !== "♠" && suit !== "♣";
    if (reason.includes("刚烈")) return suit !== "♥";
    if (reason.includes("暴虐")) return suit === "♠";
    if (reason.includes("屯田")) return suit !== "♥";
    return null;
  }

  function chooseResponseOption(player, options) {
    return options
      .slice()
      .sort((a, b) => cardKeepValue(player, findHandCard(player, a.cardId)) - cardKeepValue(player, findHandCard(player, b.cardId)))[0];
  }

  function chooseDiscardCards(player, count) {
    return player.hand
      .slice()
      .sort((a, b) => cardKeepValue(player, a) - cardKeepValue(player, b))
      .slice(0, count);
  }

  function chooseGiftCards(player, target, max) {
    if (target.hp <= 1) {
      const peach = player.hand.find((c) => c.subtype === "peach");
      if (peach) return [peach];
    }
    return chooseDiscardCards(player, max);
  }

  function chooseRendeCards(player, target, max) {
    const teamwork = supportTeamworkScore(player, target, "gift");
    if (attitude(player, target) <= 0 && teamwork < 0.55) return [];
    const cards = player.hand
      .slice()
      .sort((a, b) => cardKeepValue(player, a) - cardKeepValue(player, b));
    const picked = [];
    if (target.hp <= 1) {
      const peach = cards.find((card) => card.subtype === "peach");
      if (peach) picked.push(peach);
    }
    const wantsHeal = player.hp < player.maxHp && !player.turn.usedSkills.rendeHeal;
    const neededForHeal = wantsHeal ? Math.max(0, 2 - player.turn.gaveByRende - picked.length) : 0;
    for (const card of cards) {
      if (picked.includes(card)) continue;
      const lowValue = cardKeepValue(player, card) < (wantsHeal ? 3.25 : 2.4);
      if (!lowValue && picked.length >= neededForHeal) continue;
      picked.push(card);
      if (picked.length >= Math.min(max, Math.max(1, neededForHeal || 1))) break;
    }
    return picked.slice(0, max);
  }

  function yijiDistributionPlan(source, cards) {
    if (!source?.alive || !cards?.length) return null;
    const available = cards.filter((card) => source.hand.some((held) => held.id === card.id));
    if (!available.length) return null;
    const candidates = alivePlayers()
      .filter((target) => target.id !== source.id)
      .map((target) => ({ target, score: scoreYijiRecipient(source, target, available) }))
      .filter((item) => item.score > 0.85)
      .sort((a, b) => b.score - a.score);
    if (!candidates.length) return null;
    const allocations = [];
    const remaining = available.slice();
    const allocatedCounts = new Map();
    while (remaining.length) {
      const choices = [];
      remaining.forEach((card) => {
        candidates.forEach(({ target }) => {
          const currentCount = allocatedCounts.get(target.id) || 0;
          const spreadPenalty = currentCount > 0 && candidates.length > 1 ? 0.38 + currentCount * 0.18 : 0;
          const handNeed = Math.max(0, Math.min(5, target.maxHp) - target.hand.length - currentCount);
          const score = scoreYijiRecipient(source, target, [card]) + Math.min(0.2, handNeed * 0.06) - spreadPenalty;
          choices.push({ target, card, score });
        });
      });
      choices.sort((a, b) => b.score - a.score);
      const best = choices[0];
      if (!best || best.score < 0.82) break;
      const teamwork = supportTeamworkScore(source, best.target, "gift");
      if (attitude(source, best.target) <= 0 && teamwork < 0.55) break;
      let allocation = allocations.find((item) => item.target.id === best.target.id);
      if (!allocation) {
        allocation = { target: best.target, cards: [], score: 0 };
        allocations.push(allocation);
      }
      allocation.cards.push(best.card);
      allocation.score += best.score;
      allocatedCounts.set(best.target.id, (allocatedCounts.get(best.target.id) || 0) + 1);
      remaining.splice(remaining.findIndex((card) => card.id === best.card.id), 1);
    }
    const gifts = allocations.flatMap((item) => item.cards);
    if (!gifts.length) return null;
    allocations.sort((a, b) => b.score - a.score);
    return {
      target: allocations[0].target,
      cards: gifts,
      allocations,
      score: allocations.reduce((sum, item) => sum + item.score, 0)
    };
  }

  function scoreYijiRecipient(source, target, cards) {
    if (!source || !target || source.id === target.id || !cards.length) return -2;
    const att = attitude(source, target);
    const teamwork = supportTeamworkScore(source, target, "gift");
    if (att <= 0 && teamwork < 0.55) return -2;
    const handNeed = Math.max(0, Math.min(5, target.maxHp) - target.hand.length);
    const cardFit = cards.reduce((sum, card) => {
      return sum + (cardKeepValue(target, card) - cardKeepValue(source, card) * 0.52);
    }, 0) * 0.1;
    return att + teamwork + Math.min(0.8, handNeed * 0.18) + (target.hp <= 2 ? 0.18 : 0) + cardFit;
  }

  function chooseYijiCards(source, target, cards) {
    const teamwork = supportTeamworkScore(source, target, "gift");
    if (attitude(source, target) <= 0 && teamwork < 0.55) return [];
    const strongBond = teamwork >= 1.15 || target.hand.length <= 1 || target.hp <= 2;
    return cards
      .slice()
      .sort((a, b) => {
        const value = (card) => cardKeepValue(target, card) - cardKeepValue(source, card) * 0.5;
        return value(b) - value(a);
      })
      .filter((card) => strongBond || cardKeepValue(target, card) >= cardKeepValue(source, card) * 0.58)
      .slice(0, strongBond ? cards.length : 1);
  }

  async function maybeDistributeYijiCards(source, drawn) {
    if (!drawn?.length) return null;
    if (humanControls(source)) {
      const candidates = alivePlayers().filter((target) => target.id !== source.id);
      const availableIds = new Set(drawn.map((card) => card.id));
      if (!candidates.length || !source.hand.some((card) => availableIds.has(card.id))) return null;
      const allocations = [];
      while (source.hand.some((card) => availableIds.has(card.id))) {
        const use = await askYesNo(
          allocations.length ? "遗计：是否继续分配剩余刚摸到的牌？" : "遗计：是否将刚摸到的牌交给其他角色？",
          allocations.length === 0,
          source
        );
        if (!use) break;
        const remainingCount = source.hand.filter((card) => availableIds.has(card.id)).length;
        const ids = await askHumanSelectCards(
          source,
          "遗计：选择要交出的刚摸到的牌。",
          1,
          remainingCount,
          (card) => availableIds.has(card.id),
          true
        );
        if (!ids.length) break;
        const target = await askHumanTarget("遗计：选择获得这些牌的角色。", candidates, source);
        if (!target) break;
        const picked = ids.map((id) => source.hand.find((card) => card.id === id)).filter(Boolean);
        if (!picked.length) break;
        allocations.push({ target, cards: picked, score: 0 });
        ids.forEach((id) => availableIds.delete(id));
      }
      return applyYijiDistributionPlan(source, { allocations, score: 0 });
    }
    const plan = yijiDistributionPlan(source, drawn);
    return applyYijiDistributionPlan(source, plan);
  }

  async function applyYijiDistributionPlan(source, plan) {
    const allocations = (plan?.allocations || []).filter((item) => item?.target?.alive && item.cards?.length);
    if (!source?.alive || !allocations.length) return null;
    const movedAll = [];
    const applied = [];
    for (const allocation of allocations) {
      const ids = allocation.cards.map((card) => card.id);
      const moved = removeHandCards(source, ids);
      if (!moved.length) continue;
      allocation.target.hand.push(...moved);
      noteCardsGained(allocation.target, moved.length);
      movedAll.push(...moved);
      applied.push({ target: allocation.target, cards: moved, score: allocation.score || 0 });
      log(`${nameOf(source)} 发动遗计，将 ${moved.length} 张牌${discardedCardListSuffix(moved)}交给 ${nameOf(allocation.target)}。`);
    }
    if (!movedAll.length) return null;
    await afterLoseHand(source);
    return {
      target: applied[0].target,
      cards: movedAll,
      allocations: applied,
      score: plan?.score || applied.reduce((sum, item) => sum + (item.score || 0), 0)
    };
  }

  function cardKeepValue(player, card) {
    if (!card) return 0;
    let value = 1;
    if (card.subtype === "peach") value = player.hp <= 2 ? 6 : 4;
    else if (card.subtype === "dodge") value = player.hp <= 2 ? 4.2 : 2.7;
    else if (card.subtype === "slash") value = canUseSlash(player) ? 2.5 : 1.3;
    else if (card.subtype === "wine") value = player.hp <= 1 ? 4 : 2;
    else if (card.subtype === "nullify") value = player.hp <= 2 ? 3.4 : 3;
    else if (card.subtype === "lebu" || card.subtype === "bingliang") value = 3.2;
    else if (card.type === "equip") value = 3;
    else if (card.subtype === "draw2") value = 4.1;
    else if (card.type === "trick") value = 2.8;
    if (hasSkill(player, "wusheng") && isRed(card)) value += 0.4;
    if (hasSkill(player, "qixi") && isBlack(card)) value += 0.4;
    if (player.role === "内奸" && (card.subtype === "peach" || card.subtype === "dodge" || card.subtype === "nullify")) value += 0.4;
    return value * (0.9 + player.personality.caution * 0.1);
  }

  function countResponseCards(player, kind) {
    return responseOptions(player, kind).length;
  }

  function countStealableOpponents(player) {
    return alivePlayers().filter((p) => p.id !== player.id && p.hand.length).length;
  }

  function countSameSuit(cards) {
    const counts = {};
    cards.forEach((c) => counts[c.suit] = (counts[c.suit] || 0) + 1);
    return Math.max(0, ...Object.values(counts));
  }

  function bestPairSuit(cards) {
    const counts = {};
    cards.forEach((c) => counts[c.suit] = (counts[c.suit] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  }

  function allPairs(items) {
    const pairs = [];
    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) pairs.push([items[i], items[j]]);
    }
    return pairs;
  }

  function directedPairs(items) {
    const pairs = [];
    for (let i = 0; i < items.length; i += 1) {
      for (let j = 0; j < items.length; j += 1) {
        if (i !== j) pairs.push([items[i], items[j]]);
      }
    }
    return pairs;
  }

  async function triggerCixiong(source, target) {
    if (!target.hand.length) {
      drawCards(source, 1);
      log(`${nameOf(source)} 的雌雄双股剑触发，摸一张牌。`);
      return;
    }
    if (target.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn) {
      const discard = await askYesNo("雌雄双股剑：是否弃一张牌？否则对方摸一张。", true, target);
      if (discard) {
        const ids = await askHumanSelectCards(target, "弃一张牌响应雌雄双股剑。", 1, 1, () => true, false);
        await discardFromHand(target, ids, "雌雄双股剑");
        return;
      }
    } else if (attitude(target, source) < 0 && target.hand.length > 2) {
      await discardFromHand(target, [chooseDiscardCards(target, 1)[0].id], "雌雄双股剑");
      return;
    }
    drawCards(source, 1);
    log(`${nameOf(source)} 的雌雄双股剑触发，摸一张牌。`);
  }

  async function maybeGuanshiHit(source, target) {
    if (!source.alive || !target.alive || source.equip.weapon?.name !== "贯石斧" || source.hand.length < 2) return false;
    const shouldUse = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`是否发动贯石斧，弃两张手牌令杀依然造成伤害？`, true, source)
      : attitude(source, target) < 0 && (target.hp <= 2 || source.hand.length >= 4);
    if (!shouldUse) return false;
    const ids = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askHumanSelectCards(source, "选择两张手牌发动贯石斧。", 2, 2, () => true, false)
      : chooseDiscardCards(source, 2).map((card) => card.id);
    if (ids.length < 2) return false;
    await discardFromHand(source, ids, "贯石斧");
    log(`${nameOf(source)} 发动贯石斧，杀依然命中 ${nameOf(target)}。`);
    return true;
  }

  async function maybeQinglongSlash(source, target) {
    if (!source.alive || !target.alive || source.equip.weapon?.name !== "青龙偃月刀") return false;
    const slash = source.hand.find((card) => card.subtype === "slash");
    if (!slash) return false;
    const shouldUse = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`是否发动青龙偃月刀，对 ${nameOf(target)} 再使用一张杀？`, true, source)
      : attitude(source, target) < 0 && (target.hp <= 2 || source.hand.length > 2);
    if (!shouldUse) return false;
    const id = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? (await askHumanSelectCards(source, "选择一张杀发动青龙偃月刀。", 1, 1, (card) => card.subtype === "slash", false))[0]
      : slash.id;
    const card = removeHandCard(source, id);
    if (!card) return false;
    discardCards([card]);
    await afterLoseHand(source);
    log(`${nameOf(source)} 发动青龙偃月刀，对 ${nameOf(target)} 追击一张杀。`);
    await resolveSlash(source, target, card, card);
    return true;
  }

  async function maybeHanbingPreventDamage(source, target, amount) {
    if (!source?.alive || !target?.alive || source.equip.weapon?.name !== "寒冰剑" || totalCards(target) <= 0) return false;
    const discardCount = Math.min(2, totalCards(target));
    const shouldUse = humanControls(source)
      ? await askYesNo(`是否发动寒冰剑，防止对 ${nameOf(target)} 的 ${amount} 点伤害，改为弃置其 ${discardCount} 张牌？`, true, source)
      : aiShouldUseHanbing(source, target, amount, discardCount);
    if (!shouldUse) return false;
    log(`${nameOf(source)} 发动寒冰剑，防止对 ${nameOf(target)} 的 ${amount} 点伤害，改为弃置 ${discardCount} 张牌。`);
    for (let i = 0; i < discardCount; i += 1) {
      if (totalCards(target) <= 0) break;
      await resolveDismantleCard(source, target, "寒冰剑");
    }
    return true;
  }

  function aiShouldUseHanbing(source, target, amount, discardCount) {
    if (attitude(source, target) >= 0) return false;
    if (target.hp <= amount) return false;
    const visibleValue = fieldCards(target)
      .reduce((sum, item) => sum + cardKeepValue(target, item.card) * (item.zone === "equip" ? 0.36 : 0.28), 0);
    const hiddenValue = Math.min(target.hand.length, discardCount) * 0.38;
    const controlValue = Math.min(discardCount, totalCards(target)) * 0.42 + visibleValue + hiddenValue;
    const damageValue = amount * (target.hp <= 2 ? 1.35 : 0.95) + (target.linked ? 0.35 : 0);
    return controlValue > damageValue + source.personality.caution * 0.12;
  }

  async function maybeQilin(source, target) {
    if (source.equip.weapon?.name !== "麒麟弓") return;
    const horses = ["plusHorse", "minusHorse"].filter((slot) => target.equip[slot]);
    if (!horses.length) return;
    const shouldUse = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn
      ? await askYesNo(`是否发动麒麟弓，弃置 ${nameOf(target)} 的一匹马？`, true, source)
      : attitude(source, target) < 0;
    if (!shouldUse) return;
    const slot = source.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn && horses.length > 1
      ? await askChoice("麒麟弓：选择弃置的坐骑。", horses.map((horseSlot) => ({ label: target.equip[horseSlot].name, value: horseSlot })), source)
      : horses[0];
    const card = target.equip[slot];
    if (!card) return;
    removeEquipCard(target, slot);
    discardCards([card]);
    log(`${nameOf(source)} 发动麒麟弓，弃置 ${nameOf(target)} 的 ${cardName(card)}。`);
    await afterLoseHand(target, { lostHand: false });
  }

  function ignoresArmor(source) {
    return source.equip.weapon?.ignoreArmor;
  }

  function totalCards(player) {
    return player.hand.length + countEquip(player) + player.judgeArea.length;
  }

  function countEquip(player) {
    return Object.keys(player.equip).length;
  }

  function moveConsumeIds(move) {
    if (move.consumeIds?.length) return move.consumeIds;
    return move.consumeId ? [move.consumeId] : [];
  }

  function needsDiscard(player) {
    return player.hand.length > handLimit(player);
  }

  function handLimit(player) {
    if (!player) return 0;
    let limit = Math.max(0, player.hp);
    if (player.alive && canActAsLordSkillOwner(player, "xueyi")) {
      limit += alivePlayers().filter((p) => p.id !== player.id && p.general.kingdom === "群").length * 2;
    }
    return limit;
  }

  function findHandCard(player, id) {
    return player.hand.find((c) => c.id === id);
  }

  function isCurrentTurn(player) {
    return state.players[state.current]?.id === player.id;
  }

  function isRed(card) {
    return RED_SUITS.has(card?.suit);
  }

  function isBlack(card) {
    return card && !isRed(card);
  }

  function cardSuitFor(player, card) {
    if (player && hasSkill(player, "hongyan") && card?.suit === "♠") return "♥";
    return card?.suit;
  }

  function isRedFor(player, card) {
    return RED_SUITS.has(cardSuitFor(player, card));
  }

  function isBlackFor(player, card) {
    return card && !isRedFor(player, card);
  }

  function colorOfFor(player, card) {
    return isRedFor(player, card) ? "red" : "black";
  }

  function cardNameFor(player, card) {
    return `${cardSuitFor(player, card)}${card.rank} ${cardDisplayName(card)}`;
  }

  function cardName(card) {
    return `${card.suit}${card.rank} ${cardDisplayName(card)}`;
  }

  function cardDisplayName(card) {
    if (!card) return "";
    const key = `${card.suit}${card.rank}`;
    if (card.subtype === "plusHorse" || card.subtype === "minusHorse") {
      return HORSE_DISPLAY_NAMES[card.subtype]?.[key] || card.name;
    }
    return card.name;
  }

  function cardTypeLabel(card) {
    if (card.type === "basic") return "基本牌";
    if (card.type === "trick") return card.delayed ? "延时锦囊" : "锦囊牌";
    if (card.subtype === "weapon") return `武器 · ${card.range}`;
    if (card.subtype === "armor") return "防具";
    return "坐骑";
  }

  function cardRuleText(card) {
    if (card.type === "equip") return equipmentRuleText(card);
    if (card.subtype === "slash") return `${card.name}：对距离内一名角色使用，目标需出闪。`;
    if (card.subtype === "dodge") return "闪：响应杀或万箭齐发。";
    if (card.subtype === "peach") return "桃：回复 1 点体力，也可救濒死角色。";
    if (card.subtype === "wine") return "酒：出牌阶段每回合限一次，令下一张杀伤害 +1；濒死时只能自己用来回复 1 点。";
    if (card.subtype === "nullify") return "无懈可击：抵消锦囊，也可反抵消另一张无懈。";
    if (card.subtype === "borrowSword") return "借刀杀人：令一名有武器角色对另一名角色使用杀，否则其武器交给你。";
    if (card.subtype === "chain") return "铁索连环：横置或重置一至两名角色，也可重铸摸一张牌。";
    if (card.subtype === "fireAttack") return "火攻：目标展示一张手牌，你可弃同花色手牌造成 1 点火焰伤害。";
    if (card.subtype === "lebu") return "乐不思蜀：判定不为红桃则跳过出牌阶段。";
    if (card.subtype === "bingliang") return "兵粮寸断：判定不为梅花则跳过摸牌阶段。";
    if (card.subtype === "lightning") return "闪电：黑桃 2-9 造成 3 点雷电伤害，否则传给下家。";
    return card.name;
  }

  function cardTooltipText(card) {
    const rows = [
      cardName(card),
      `类型：${cardTypeLabel(card)}`,
      `时机：${cardTimingText(card)}`,
      `目标：${cardTargetText(card)}`,
      `效果：${cardRuleText(card)}`
    ];
    const note = cardExtraRuleText(card);
    if (note) rows.push(`补充：${note}`);
    return rows.join("\n");
  }

  function cardTimingText(card) {
    if (card.type === "equip") return "出牌阶段装备";
    if (card.subtype === "dodge") return "响应杀或万箭齐发时";
    if (card.subtype === "nullify") return "锦囊生效前响应";
    if (card.subtype === "peach") return "出牌阶段或濒死求桃时";
    if (card.subtype === "wine") return "出牌阶段；濒死时仅自己可用";
    if (card.delayed) return "出牌阶段置入判定区";
    if (card.type === "trick") return "出牌阶段使用";
    return "出牌阶段使用";
  }

  function cardTargetText(card) {
    if (card.type === "equip") return "自己";
    if (card.subtype === "slash") return "攻击范围内一名角色";
    if (card.subtype === "dodge" || card.subtype === "nullify") return "响应当前结算";
    if (card.subtype === "peach" || card.subtype === "wine") return "自己；桃也可救濒死角色";
    if (card.subtype === "draw2" || card.subtype === "taoyuan" || card.subtype === "harvest" || card.subtype === "barbarians" || card.subtype === "arrows") return "全场或所有存活角色";
    if (card.subtype === "borrowSword") return "一名有武器角色及其可杀目标";
    if (card.subtype === "chain") return "一至两名角色；也可重铸";
    if (card.subtype === "steal") return "距离 1 内一名有牌角色";
    if (card.subtype === "dismantle") return "一名有牌角色";
    if (card.subtype === "duel" || card.subtype === "fireAttack") return "一名角色";
    if (card.subtype === "lebu" || card.subtype === "bingliang") return "一名未有同类判定牌的角色";
    if (card.subtype === "lightning") return "自己判定区";
    return "按当前可选目标";
  }

  function cardExtraRuleText(card) {
    if (card.subtype === "slash") return "通常每回合限一次；武器和技能可能改变次数或目标。";
    if (card.subtype === "nullify") return "也可以反抵消另一张无懈可击。";
    if (card.subtype === "chain") return "重铸不使用锦囊效果，只弃置并摸一张。";
    if (card.subtype === "fireAttack") return "目标展示一张手牌后，你需弃同花色手牌才造成伤害。";
    if (card.delayed) return "使用时置入判定区，不立即询问无懈；目标判定阶段结算前可被无懈抵消。";
    return "";
  }

  function equipmentRuleText(card) {
    if (!card) return "";
    if (card.subtype === "plusHorse") return `${cardDisplayName(card)}：其他角色计算与你的距离 +1。`;
    if (card.subtype === "minusHorse") return `${cardDisplayName(card)}：你计算与其他角色的距离 -1。`;
    const rules = {
      "诸葛连弩": "诸葛连弩：出牌阶段可使用任意张杀。",
      "青釭剑": "青釭剑：杀无视目标防具。",
      "雌雄双股剑": "雌雄双股剑：杀异性目标时，对方弃一张牌或你摸一张。",
      "寒冰剑": "寒冰剑：杀即将造成伤害时，可防止此伤害，改为弃置目标两张牌。",
      "青龙偃月刀": "青龙偃月刀：杀被闪避后，可再对同一目标使用一张杀。",
      "丈八蛇矛": "丈八蛇矛：可将两张手牌当杀使用。",
      "贯石斧": "贯石斧：杀被闪避后，可弃两张手牌令杀依然命中。",
      "方天画戟": "方天画戟：最后一张手牌作为杀时，可额外指定至多两个目标。",
      "麒麟弓": "麒麟弓：杀造成伤害后，可弃置目标一匹马。",
      "古锭刀": "古锭刀：杀无手牌目标伤害 +1。",
      "八卦阵": "八卦阵：需要出闪时判定红色视为闪。",
      "仁王盾": "仁王盾：黑色杀无效。",
      "白银狮子": "白银狮子：受到多点伤害时降为 1；失去装备区里的白银狮子后回复 1 点体力。",
      "藤甲": "藤甲：普通杀、南蛮和万箭无效，火焰伤害 +1。"
    };
    return rules[card.name] || card.name;
  }

  function labelForCard(card, virtualSkill) {
    return `${skillPrefix(virtualSkill)}${cardDisplayName(card)}`;
  }

  function eventFromLog(message) {
    const text = String(message || "");
    let match = text.match(/^进入 (.+) 的回合。$/);
    if (match) return { kind: "turn", actor: match[1], title: "回合开始", target: "", detail: text, message: text };

    match = text.match(/^(.+?) 濒死(?:，来源 (.+?))?，需要 (.+?) 个桃或可用的自救牌。$/);
    if (match) {
      return {
        kind: "dying",
        actor: match[2] || match[1],
        title: "濒死",
        target: match[1],
        detail: `${match[2] ? `来源：${match[2]} · ` : ""}需要 ${match[3]} 个桃或自救牌`,
        damage: match[1],
        message: text
      };
    }

    match = text.match(/^(.+?) 脱离濒死。$/);
    if (match) {
      return {
        kind: "heal",
        actor: match[1],
        title: "脱离濒死",
        target: match[1],
        detail: "救援成功",
        message: text
      };
    }

    match = text.match(/^(.+?) (?:(.+?)：)?(打出|使用)(桃|酒)，(救援|自救)(?: (.+?))?。$/);
    if (match) {
      return {
        kind: "heal",
        actor: match[1],
        title: match[2] ? `${match[2]}：${match[4]}` : match[4],
        target: match[6] || match[1],
        detail: match[5] === "自救" ? "濒死自救" : "濒死救援",
        message: text
      };
    }

    match = text.match(/^(.+?) (?:(.+?)：)?(打出|使用)(杀|闪|桃|酒|无懈可击)，响应 (.+?) 的(.+?)。$/);
    if (match) {
      return {
        kind: "response",
        actor: match[1],
        title: match[2] ? `${match[2]}：${match[4]}` : match[4],
        target: match[5],
        detail: `${match[3]}${match[4]} · 响应${match[6]}`,
        message: text
      };
    }

    match = text.match(/^(.+?) (?:(.+?)：)?使用(杀|闪|桃|酒|无懈可击)，目标 (.+?)。$/);
    if (match) {
      return {
        kind: "response",
        actor: match[1],
        title: match[2] ? `${match[2]}：${match[3]}` : match[3],
        target: match[4],
        detail: `使用${match[3]}`,
        message: text
      };
    }

    match = text.match(/^(.+?) 使用无懈可击，(.+?) (.+?)(?:，(保护|继续影响|阻止|继续给予) (.+?))?。$/);
    if (match) {
      return {
        kind: "response",
        actor: match[1],
        title: "无懈可击",
        target: match[5] || match[3],
        detail: match[4] && match[5] ? `${match[2]} ${match[3]} · ${match[4]} ${match[5]}` : match[2],
        cancelledCard: match[3],
        relation: match[4] || "",
        message: text
      };
    }

    match = text.match(/^(.+?) 判定阶段结算 (.+?)，被无懈可击抵消。$/);
    if (match) {
      return {
        kind: "judge",
        actor: match[1],
        title: `${match[2]}被抵消`,
        target: match[1],
        detail: "判定阶段 · 无懈可击抵消",
        message: text
      };
    }

    match = text.match(/^(.+?) 判定区的(.+?)被无懈可击抵消。$/);
    if (match) {
      return {
        kind: "judge",
        actor: match[1],
        title: `${match[2]}被抵消`,
        target: match[1],
        detail: "判定阶段 · 无懈可击抵消",
        message: text
      };
    }

    match = text.match(/^(.+?) 使用 (.+?)(?:，目标 (.+))?。$/);
    if (match) {
      return {
        kind: "card",
        actor: match[1],
        title: match[2],
        target: match[3] || "",
        detail: match[3] ? `目标：${match[3]}` : "无目标或作用于自己",
        message: text
      };
    }

    match = text.match(/^(.+?) 使用(.+?)(?:，(.+))?。$/);
    if (match) {
      return {
        kind: "card",
        actor: match[1],
        title: match[2],
        target: "",
        detail: match[3] || "响应或全局结算",
        message: text
      };
    }

    match = text.match(/^(.+?) (?:(.+?)：)?(打出|使用)(杀|闪|桃|酒|无懈可击)。$/);
    if (match) {
      return {
        kind: "response",
        actor: match[1],
        title: match[2] ? `${match[2]}：${match[4]}` : match[4],
        target: "",
        detail: `${match[3]}${match[4]}`,
        message: text
      };
    }

    match = text.match(/^(.+?) 对 (.+?) 使用(桃|酒)。$/);
    if (match) {
      return {
        kind: "response",
        actor: match[1],
        title: match[3],
        target: match[2],
        detail: "濒死救援",
        message: text
      };
    }

    match = text.match(/^(.+?) 未响应(杀|闪|桃|酒|无懈可击)(?:，来源 (.+?))?。$/);
    if (match) {
      return {
        kind: "miss",
        actor: match[1],
        title: `未响应${match[2]}`,
        target: match[3] || "",
        detail: match[3] ? `来源：${match[3]}` : "未响应",
        message: text
      };
    }

    match = text.match(/^(.+?) 闪避了 (.+?) 的杀。$/);
    if (match) {
      return {
        kind: "response",
        actor: match[1],
        title: "闪",
        target: match[2],
        detail: "杀被闪避",
        message: text
      };
    }

    match = text.match(/^(.+?) 的(八卦阵|八阵)判定为红色，视为出闪。$/);
    if (match) {
      return {
        kind: "response",
        actor: match[1],
        title: "闪",
        target: "",
        detail: `${match[2]}视为出闪`,
        message: text
      };
    }

    match = text.match(/^(.+?) 发动(.+?)，将 (.+?) 的 (.+?) 判定改为 (.+?)。$/);
    if (match) {
      return {
        kind: "judge",
        actor: match[1],
        title: `${match[2]}改判`,
        target: match[3],
        detail: `${match[3]} 的 ${match[4]} 改为 ${match[5]}`,
        judgeReason: match[4],
        judgeCard: match[5],
        message: text
      };
    }

    match = text.match(/^(.+?) 发动(化身|新生)，((?:本回合)?获得) (.+?)。$/);
    if (match) {
      const gainedSkill = skillIdFromEventTitle(match[4]);
      const gainedName = SKILL_TEXT[gainedSkill] || match[4];
      const rule = gainedSkill ? (SKILL_RULE_TEXT[gainedSkill] || coverageNote(skillCoverageStatus(gainedSkill), gainedSkill)) : "查看武将牌技能说明";
      return {
        kind: "skill",
        actor: match[1],
        title: `${match[2]}：${gainedName}`,
        target: "",
        detail: `${match[3]} ${gainedName}：${rule}`,
        message: text,
        gainedSkill,
        gainedSkillName: gainedName
      };
    }

    match = text.match(/^(.+?) 发动(.+?)(?:，|。)/);
    if (match) {
      return {
        kind: "skill",
        actor: match[1],
        title: match[2],
        target: skillTargetFromLog(text),
        detail: text,
        message: text
      };
    }

    match = text.match(/^(.+?) 对 (.+?) 造成 (\d+) 点(.*?)伤害，(.+?) 体力 (.+?)。$/);
    if (match) {
      return {
        kind: "damage",
        actor: match[1],
        title: `${match[3]}点${match[4] || "普通"}伤害`,
        target: match[2],
        detail: `${match[5]} 体力 ${match[6]}`,
        damage: match[2],
        message: text
      };
    }

    match = text.match(/^(.+?) 受到 (\d+) 点(.*?)伤害，体力 (.+?)。$/);
    if (match) {
      return {
        kind: "damage",
        actor: match[1],
        title: `${match[2]}点${match[3] || "普通"}伤害`,
        target: match[1],
        detail: `体力 ${match[4]}`,
        damage: match[1],
        message: text
      };
    }

    match = text.match(/^(.+?) 失去 (\d+) 点体力。$/);
    if (match) {
      return {
        kind: "damage",
        actor: match[1],
        title: `失去 ${match[2]} 点体力`,
        target: match[1],
        detail: "体力流失",
        message: text
      };
    }

    match = text.match(/^(.+?) 回复 (\d+) 点体力。$/);
    if (match) {
      return {
        kind: "heal",
        actor: match[1],
        title: `回复 ${match[2]} 点体力`,
        target: match[1],
        detail: "体力回复",
        message: text
      };
    }

    match = text.match(/^(.+?) 装备 (.+?)。$/);
    if (match) {
      return {
        kind: "equip",
        actor: match[1],
        title: match[2],
        target: "",
        detail: "装备生效",
        message: text
      };
    }

    match = text.match(/^(.+?) 因 (.+?) 获得 (.+?)。$/);
    if (match) {
      return {
        kind: "gain",
        actor: match[1],
        title: "获得牌",
        target: "",
        detail: `${match[2]}：${match[3]}`,
        message: text
      };
    }

    match = text.match(/^(.+?) 获得 (.+?)。$/);
    if (match) {
      return {
        kind: "gain",
        actor: match[1],
        title: "获得牌",
        target: "",
        detail: match[2],
        message: text
      };
    }

    match = text.match(/^(.+?) (被横置|重置)。$/);
    if (match) {
      return {
        kind: "chain",
        actor: match[1],
        title: match[2],
        target: match[1],
        detail: match[2] === "被横置" ? "连环状态" : "解除连环",
        message: text
      };
    }

    match = text.match(/^(.+?) 展示 (.+?)。$/);
    if (match) {
      return {
        kind: "reveal",
        actor: match[1],
        title: "展示",
        target: "",
        detail: match[2],
        message: text
      };
    }

    match = text.match(/^(.+?) 的 (乐不思蜀|兵粮寸断)生效，跳过(.+?)阶段。$/);
    if (match) {
      return {
        kind: "skip",
        actor: match[1],
        title: `跳过${match[3]}阶段`,
        target: match[1],
        detail: `${match[2]}生效`,
        message: text
      };
    }

    match = text.match(/^(.+?) 跳过(.+?)阶段。$/);
    if (match) {
      return {
        kind: "skip",
        actor: match[1],
        title: `跳过${match[2]}阶段`,
        target: match[1],
        detail: "阶段跳过",
        message: text
      };
    }

    match = text.match(/^(.+?) 的 (.+?) 判定：(.+)。$/);
    if (match) {
      return {
        kind: "judge",
        actor: match[1],
        title: `${match[2]}判定`,
        target: match[1],
        detail: `判定牌：${match[3]}`,
        judgeReason: match[2],
        judgeCard: match[3],
        message: text
      };
    }

    match = text.match(/^(.+?) 摸 (\d+) 张牌。$/);
    if (match) {
      return { kind: "draw", actor: match[1], title: `摸 ${match[2]} 张牌`, target: "", detail: text, message: text };
    }

    match = text.match(/^(.+?) 因 (.+?) 弃置 (.+?)。$/);
    if (match) {
      return { kind: "discard", actor: match[1], title: "弃置", target: "", detail: `${match[2]}：${match[3]}`, message: text };
    }

    match = text.match(/^(.+?) 被 (.+?) 击杀，身份为 (.+?)。$/);
    if (match) {
      return {
        kind: "death",
        actor: match[2],
        title: "角色阵亡",
        target: match[1],
        detail: `身份：${match[3]}`,
        damage: match[1],
        message: text
      };
    }

    match = text.match(/^(.+?) 阵亡，身份为 (.+?)。$/);
    if (match) {
      return {
        kind: "death",
        actor: match[1],
        title: "角色阵亡",
        target: match[1],
        detail: `身份：${match[2]}`,
        damage: match[1],
        message: text
      };
    }
    if (text.includes("阵亡")) return { kind: "death", actor: "事件", title: "角色阵亡", target: "", detail: text, message: text };
    match = text.match(/^身份局开始。主公是(.+?)。$/);
    if (match) {
      return {
        kind: "system",
        actor: "系统",
        title: "身份局开始",
        target: match[1].trim(),
        detail: `主公是${match[1].trim()}`,
        message: text
      };
    }
    if (text.includes("游戏结束")) return { kind: "system", actor: "系统", title: "游戏结束", target: "", detail: text, message: text };
    return { kind: "system", actor: "事件", title: "当前事件", target: "", detail: text, message: text };
  }

  function skillTargetFromLog(text) {
    const patterns = [
      /令 (.+?) 回复/,
      /令 (.+?) 摸/,
      /令 (.+?) 弃/,
      /令 (.+?) 失去/,
      /令 (.+?) 获得/,
      /将 .+? 置入 (.+?) 装备区/,
      /交给 (.+?)(?:。|，)/,
      /对 (.+?) 发动/,
      /指定 (.+?)(?:为|，|。)/
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match?.[1]) return match[1].trim();
    }
    return "";
  }

  function spotlightIcon(kind) {
    const icons = {
      card: "牌",
      skill: "技",
      damage: "伤",
      judge: "判",
      draw: "摸",
      discard: "弃",
      response: "应",
      dying: "危",
      death: "亡",
      miss: "空",
      heal: "愈",
      equip: "装",
      gain: "得",
      chain: "锁",
      reveal: "示",
      skip: "跳",
      wait: "等",
      turn: "轮",
      system: "局"
    };
    return icons[kind] || "局";
  }

  function spotlightKindLabel(kind) {
    const labels = {
      card: "使用牌",
      skill: "发动技能",
      damage: "造成伤害",
      judge: "判定",
      draw: "摸牌",
      discard: "弃牌",
      response: "响应",
      dying: "濒死",
      death: "阵亡",
      miss: "未响应",
      heal: "回复",
      equip: "装备",
      gain: "获得",
      chain: "横置",
      reveal: "展示",
      skip: "跳过阶段",
      wait: "等待操作",
      turn: "回合",
      system: "事件"
    };
    return labels[kind] || "事件";
  }

  function compactEventTitle(title) {
    const text = String(title || "事件").replace(/：/g, "\n");
    const compact = text.length > 10 ? `${text.slice(0, 10)}…` : text;
    if (compact.includes("\n")) return compact;
    if (/^[\u4e00-\u9fff]{4}$/.test(compact)) return `${compact.slice(0, 2)}\n${compact.slice(2)}`;
    if (/^[\u4e00-\u9fff]{5,6}$/.test(compact)) return `${compact.slice(0, 3)}\n${compact.slice(3)}`;
    return compact;
  }

  function eventFaceFooter(event) {
    if (event.target) return `目标 ${event.target}`;
    if (event.kind === "damage") return event.detail || "伤害结算";
    if (event.kind === "dying") return event.detail || "等待救援";
    if (event.kind === "death") return event.detail || "角色阵亡";
    if (event.kind === "judge") return "判定";
    if (event.kind === "draw") return "摸牌";
    if (event.kind === "discard") return "弃牌";
    if (event.kind === "response") return event.detail || "响应";
    if (event.kind === "miss") return "未响应";
    if (event.kind === "heal") return "回复";
    if (event.kind === "equip") return "装备";
    if (event.kind === "gain") return "获得";
    if (event.kind === "chain") return "连环";
    if (event.kind === "reveal") return "展示";
    if (event.kind === "skip") return "跳过";
    if (event.kind === "wait") return event.detail || "等待操作";
    return event.actor || "事件";
  }

  function eventVisualMeta(event) {
    const title = event.title || "事件";
    const judgeInfo = event.kind === "judge" ? eventJudgeCardInfo(event) : null;
    if (judgeInfo) {
      const reason = event.judgeReason || judgeReasonFromTitle(title) || "判定";
      const isRewrite = String(event.message || event.detail || title).includes("改判");
      return {
        label: isRewrite ? "改判牌" : "判定牌",
        title: `${reason}\n${judgeInfo.name}`,
        type: `${judgeInfo.suit}${judgeInfo.rank} · ${judgeInfo.colorLabel}`,
        footer: event.target ? `${event.target} 的判定` : "判定结果",
        tone: "judge",
        mood: "control",
        image: judgeInfo.image,
        judgeCard: judgeInfo
      };
    }
    const resourceCards = eventResourceCardInfo(event);
    if (resourceCards.length) {
      const first = resourceCards[0];
      return {
        label: eventResourceLabel(event),
        title: resourceCards.length === 1 ? first.name : resourceCards.map((card) => card.name).slice(0, 2).join("\n"),
        type: resourceCards.length === 1 ? `${first.suit}${first.rank} · ${first.colorLabel}` : `${resourceCards.length} 张公开牌`,
        footer: eventResourceReason(event) || eventFaceFooter(event),
        tone: event.kind || "resource",
        mood: eventMood(event),
        image: first.image,
        resourceCards
      };
    }
    const cardSpec = eventCardSpec(title);
    if (cardSpec) {
      return {
        label: spotlightKindLabel(event.kind),
        title: displayEventCardName(title, cardSpec.name),
        type: cardTypeLabel(cardSpec),
        footer: event.target ? `目标 ${event.target}` : eventRuleSummary(cardRuleText(cardSpec), cardSpec.name),
        tone: cardSpec.type || event.kind || "system",
        mood: eventMood(event),
        image: cardImageUrl(cardSpec)
      };
    }
    const skill = event.kind === "skill" ? skillIdFromEventTitle(title) : "";
    if (skill) {
      const gainedSkill = event.gainedSkill || "";
      const gainedName = event.gainedSkillName || (gainedSkill ? SKILL_TEXT[gainedSkill] : "");
      return {
        label: "发动技能",
        title: gainedName ? `${SKILL_TEXT[skill] || title}：${gainedName}` : (SKILL_TEXT[skill] || title),
        type: gainedName ? "获得技能" : "武将技能",
        footer: gainedSkill ? eventRuleSummary(skillRuleText(gainedSkill), SKILL_TEXT[gainedSkill]) : event.target ? `目标 ${event.target}` : eventRuleSummary(skillRuleText(skill), SKILL_TEXT[skill]),
        tone: "skill",
        mood: "skill",
        image: ""
      };
    }
    return {
      label: spotlightKindLabel(event.kind),
      title,
      type: eventTypeShortLabel(event.kind),
      footer: eventFaceFooter(event),
      tone: event.kind || "system",
      mood: eventMood(event),
      image: ""
    };
  }

  function eventJudgeCardInfo(event) {
    if (!event || event.kind !== "judge") return null;
    const source = [event.judgeCard, event.detail, event.message, event.title].filter(Boolean).join(" ");
    const match = source.match(/([♠♥♣♦])\s*(10|[2-9AJQKA])\s*([^\s，。]+)/);
    if (!match) return null;
    const [, suit, rank, name] = match;
    const red = RED_SUITS.has(suit);
    return {
      suit,
      rank,
      name,
      text: `${suit}${rank} ${name}`,
      color: red ? "red" : "black",
      colorLabel: red ? "红色" : "黑色",
      image: cardImageUrl(name)
    };
  }

  function eventResourceCardInfo(event) {
    if (!event || !["discard", "gain", "reveal"].includes(event.kind)) return [];
    const source = [event.detail, event.message, event.title].filter(Boolean).join(" ");
    const seen = new Set();
    const cards = [];
    const pattern = /([♠♥♣♦])\s*(10|[2-9AJQKA])\s*([^，。、；;：:\s]+)/g;
    let match;
    while ((match = pattern.exec(source))) {
      const [, suit, rank, rawName] = match;
      const name = rawName.trim();
      const key = `${suit}${rank}${name}`;
      if (!name || seen.has(key)) continue;
      seen.add(key);
      const spec = eventCardSpec(name) || CARD_POOL.find((item) => item.name === name) || null;
      const red = RED_SUITS.has(suit);
      cards.push({
        suit,
        rank,
        name,
        text: `${suit}${rank} ${name}`,
        color: red ? "red" : "black",
        colorLabel: red ? "红色" : "黑色",
        image: cardImageUrl(spec || name),
        typeLabel: spec ? cardTypeLabel(spec) : "公开牌"
      });
    }
    return cards;
  }

  function eventResourceLabel(event) {
    if (event?.kind === "discard") return "公开弃置";
    if (event?.kind === "gain") return "公开获得";
    if (event?.kind === "reveal") return "公开展示";
    return "公开牌";
  }

  function eventResourceReason(event) {
    const detail = String(event?.detail || "");
    if (detail.includes("：")) return detail.split("：")[0].trim();
    if (event?.kind === "discard") return "进入弃牌堆";
    if (event?.kind === "gain") return "加入手牌/区域";
    if (event?.kind === "reveal") return "展示给所有人";
    return "";
  }

  function judgeReasonFromTitle(title) {
    const text = String(title || "").trim();
    if (!text) return "";
    return text
      .replace(/判定$/, "")
      .replace(/改判$/, "")
      .replace(/被抵消$/, "")
      .trim();
  }

  function eventMood(event) {
    if (!event) return "neutral";
    if (isAreaSpotlightEvent(event) || event.targetIds?.length > 2) return "area";
    if (["damage", "dying", "death", "miss"].includes(event.kind)) return "danger";
    if (["heal", "gain"].includes(event.kind)) return "recovery";
    if (["judge", "skip", "chain", "response"].includes(event.kind)) return "control";
    if (event.kind === "skill") return "skill";
    if (["draw", "discard", "equip"].includes(event.kind)) return "resource";
    if (event.kind === "card") return "card";
    return "neutral";
  }

  function eventOutcomeBadge(event) {
    if (!event) return "";
    const text = [event.title, event.detail, event.message].filter(Boolean).join(" ");
    if (isAreaSpotlightEvent(event) || event.targetIds?.length > 2) {
      const count = event.targetIds?.length || eventRouteTargets(event).length;
      return count ? `影响${count}` : "全场";
    }
    if (event.kind === "damage") {
      const match = text.match(/(\d+)\s*点/);
      return match ? `-${match[1]} HP` : "伤害";
    }
    if (event.kind === "dying") return "求桃";
    if (event.kind === "death") return "亮身份";
    if (event.kind === "heal") {
      const match = text.match(/回复\s*(\d+)\s*点/);
      if (match) return `+${match[1]} HP`;
      return text.includes("自救") ? "自救" : "救援";
    }
    if (event.kind === "judge") {
      const judgeInfo = eventJudgeCardInfo(event);
      if (text.includes("改判")) return "改判";
      if (judgeInfo) return `${judgeInfo.suit}${judgeInfo.rank}`;
      return "判定";
    }
    if (event.kind === "draw") {
      const match = text.match(/摸\s*(\d+)\s*张/);
      return match ? `+${match[1]}牌` : "摸牌";
    }
    if (event.kind === "discard") return "弃牌";
    if (event.kind === "response") return text.includes("无懈可击") ? "抵消" : "响应";
    if (event.kind === "miss") return "未响应";
    if (event.kind === "skill") return event.gainedSkillName ? "获技能" : "技能";
    if (event.kind === "gain") return "得牌";
    if (event.kind === "equip") return "装备";
    if (event.kind === "chain") return "横置";
    if (event.kind === "reveal") return "展示";
    if (event.kind === "skip") return "跳过";
    return "";
  }

  function eventCardSpec(title) {
    const raw = String(title || "").trim();
    const withoutResult = raw.split(/[，,]/)[0].trim();
    const afterSkill = withoutResult.includes("：") ? withoutResult.split("：").pop().trim() : withoutResult;
    const candidates = [afterSkill, withoutResult, raw].filter(Boolean);
    const exact = CARD_POOL.find((spec) => candidates.includes(spec.name));
    if (exact) return exact;
    return CARD_POOL
      .slice()
      .sort((a, b) => b.name.length - a.name.length)
      .find((spec) => candidates.some((candidate) => candidate.includes(spec.name))) || null;
  }

  function displayEventCardName(title, cardNameText) {
    const raw = String(title || "").trim();
    if (!raw.includes("：")) return cardNameText;
    const skill = raw.split("：")[0];
    return `${skill}\n${cardNameText}`;
  }

  function skillIdFromEventTitle(title) {
    const clean = String(title || "").replace(/^[:：]/, "").split(/[：:，,。]/)[0].trim();
    const entry = Object.entries(SKILL_TEXT).find(([id, label]) => id === clean || label === clean);
    return entry?.[0] || "";
  }

  function eventRuleSummary(text, name) {
    let clean = String(text || "").trim();
    if (name && clean.startsWith(name)) clean = clean.slice(String(name).length).replace(/^[:：]/, "").trim();
    return clean.length > 28 ? `${clean.slice(0, 28)}…` : clean || "查看说明";
  }

  function eventTypeShortLabel(kind) {
    const labels = {
      damage: "结算",
      death: "阵亡",
      judge: "判定牌",
      draw: "牌堆",
      discard: "弃牌堆",
      response: "响应牌",
      miss: "未响应",
      heal: "回复",
      equip: "装备",
      gain: "获得",
      chain: "连环",
      reveal: "展示",
      skip: "阶段",
      wait: "等待",
      turn: "回合",
      system: "系统"
    };
    return labels[kind] || "事件";
  }

  function renderEventRoute(event) {
    const actor = event.actor || currentActorLabel();
    const targets = eventRouteTargets(event);
    const targetMarkup = targets.length
      ? `<span class="route-arrow">→</span><span class="route-targets">${targets.slice(0, 3).map((target) => `<span class="route-node target">${escapeHtml(target)}</span>`).join("")}${targets.length > 3 ? `<span class="route-more">+${targets.length - 3}</span>` : ""}</span>`
      : `<span class="route-arrow muted">•</span><span class="route-note">${escapeHtml(eventRouteFallback(event))}</span>`;
    return `
      <div class="event-route event-route-${event.kind || "system"}">
        <span class="route-node actor">${escapeHtml(actor || "事件")}</span>
        ${targetMarkup}
      </div>
    `;
  }

  function renderEventVisual(event) {
    if (!event || event.kind === "system" || event.kind === "wait") return "";
    const judgeInfo = eventJudgeCardInfo(event);
    if (judgeInfo) {
      const visual = eventVisualMeta(event);
      return `
        <div class="event-visual visual-judge-card visual-judge-${escapeAttr(judgeInfo.color)}" aria-hidden="true">
          <span class="judge-owner">${escapeHtml(shortVisualName(event.target || event.actor))}</span>
          <div class="judge-card-face">
            <span class="judge-card-label">${escapeHtml(visual.label)}</span>
            <strong class="judge-card-rank">
              <b class="judge-card-suit">${escapeHtml(judgeInfo.suit)}</b>
              <span>${escapeHtml(judgeInfo.rank)}</span>
            </strong>
            <em>${escapeHtml(judgeInfo.name)}</em>
            <small>${escapeHtml(judgeInfo.colorLabel)}</small>
          </div>
          <span class="judge-reason">${escapeHtml(judgeReasonFromTitle(event.title) || event.judgeReason || "判定")}</span>
        </div>
      `;
    }
    const resourceCards = eventResourceCardInfo(event);
    if (resourceCards.length) return renderResourceCardVisual(event, resourceCards);
    const deathInfo = eventDeathRoleInfo(event);
    if (deathInfo) return renderDeathRevealVisual(event, deathInfo);
    const actor = event.actor || currentActorLabel();
    const targets = eventRouteTargets(event);
    const actionLabel = directedVisualActionLabel(event);
    const relationClass = eventRelationClass(event);
    const isArea = isAreaSpotlightEvent(event) || targets.length > 2;
    if (isArea) {
      const spokes = targets.length ? targets : alivePlayers().map(nameOf);
      const visible = spokes.slice(0, 8);
      const targetCount = event.targetIds?.length || spokes.length;
      return `
        <div class="event-visual visual-area visual-${event.kind || "system"}" aria-hidden="true">
          <span class="visual-core">${escapeHtml(spotlightIcon(event.kind))}</span>
          <span class="visual-area-label">${escapeHtml(actionLabel)}</span>
          <span class="visual-target-count">${targetCount ? `影响 ${targetCount} 人` : "全场"}</span>
          ${visible.map((target, index) => {
            const angle = Math.round((360 / Math.max(visible.length, 1)) * index - 90);
            return `<span class="visual-spoke" style="--angle:${angle}deg"><i></i><b>${escapeHtml(shortVisualName(target))}</b></span>`;
          }).join("")}
        </div>
      `;
    }
    if (targets.length) {
      const mainTarget = targets[0];
      return `
        <div class="event-visual visual-directed ${escapeAttr(relationClass)} visual-${event.kind || "system"}" aria-hidden="true">
          ${renderEventRelationCaption(event, actor, mainTarget, actionLabel, relationClass)}
          <span class="visual-person actor">${escapeHtml(shortVisualName(actor))}</span>
          <span class="visual-arrow-line"><i></i><b>${escapeHtml(actionLabel)}</b></span>
          <span class="visual-person target">${escapeHtml(shortVisualName(mainTarget))}</span>
        </div>
      `;
    }
    return `
      <div class="event-visual visual-pulse visual-${event.kind || "system"}" aria-hidden="true">
        <span>${escapeHtml(spotlightIcon(event.kind))}</span>
      </div>
    `;
  }

  function eventDeathRoleInfo(event) {
    if (!event || event.kind !== "death") return null;
    const source = [event.detail, event.message, event.title].filter(Boolean).join(" ");
    const match = source.match(/身份[：为]\s*(主公|忠臣|反贼|内奸)/);
    if (!match) return null;
    const role = match[1];
    const target = event.target || event.damage || event.actor || "阵亡角色";
    const killer = event.actor && event.actor !== target ? event.actor : "";
    return {
      role,
      note: roleToNote(role),
      target,
      killer
    };
  }

  function renderDeathRevealVisual(event, info) {
    return `
      <div class="event-visual visual-death-reveal visual-death-role-${escapeAttr(info.note)}" aria-hidden="true">
        <span class="death-reveal-label">身份公开</span>
        <strong>${escapeHtml(shortVisualName(info.target))}</strong>
        <b>${escapeHtml(info.role)}</b>
        <em>${escapeHtml(info.killer ? `${shortVisualName(info.killer)} 击杀` : "角色阵亡")}</em>
      </div>
    `;
  }

  function renderEventRelationCaption(event, actor, target, actionLabel, relationClass) {
    if (!relationClass) return "";
    const actorName = shortVisualName(actor);
    const targetName = shortVisualName(target);
    const verb = eventRelationCaptionVerb(event, actionLabel, relationClass);
    return `
      <div class="visual-relation-caption">
        <b>${escapeHtml(actorName)}</b>
        <strong>${escapeHtml(verb)}</strong>
        <b>${escapeHtml(targetName)}</b>
      </div>
    `;
  }

  function eventRelationCaptionVerb(event, actionLabel, relationClass) {
    const text = [event?.title, event?.detail, event?.message].filter(Boolean).join(" ");
    if (relationClass.includes("selfsave")) return "自救";
    if (relationClass.includes("rescue")) return "救援";
    if (relationClass.includes("counter-nullify")) {
      if (text.includes("继续给予")) return "继续给予";
      return "继续影响";
    }
    if (relationClass.includes("nullify")) {
      if (text.includes("阻止")) return "阻止";
      if (text.includes("保护")) return "保护";
      return "抵消";
    }
    return actionLabel || "影响";
  }

  function renderResourceCardVisual(event, cards) {
    const visible = cards.slice(0, 5);
    const overflow = cards.length - visible.length;
    return `
      <div class="event-visual visual-resource-cards visual-resource-${escapeAttr(event.kind || "resource")}" aria-hidden="true">
        <span class="resource-owner">${escapeHtml(shortVisualName(event.actor || currentActorLabel()))}</span>
        <div class="resource-card-stack">
          ${visible.map((card, index) => `
            <div class="resource-card-face resource-card-${escapeAttr(card.color)}" style="--resource-index:${index}" title="${escapeAttr(card.text)}">
              <strong>
                <b>${escapeHtml(card.suit)}</b>
                <span>${escapeHtml(card.rank)}</span>
              </strong>
              <em>
                <span class="resource-card-code">${escapeHtml(`${card.suit}${card.rank}`)}</span>
                <span class="resource-card-name">${escapeHtml(card.name)}</span>
              </em>
              <small>${escapeHtml(`${card.colorLabel} · ${card.typeLabel}`)}</small>
            </div>
          `).join("")}
          ${overflow > 0 ? `<span class="resource-more">+${overflow}</span>` : ""}
        </div>
        <span class="resource-reason">${escapeHtml(eventResourceReason(event) || spotlightKindLabel(event.kind))}</span>
      </div>
    `;
  }

  function compactVisualActionLabel(event) {
    const spec = eventCardSpec(event.title);
    if (spec) return spec.name.length > 4 ? spec.name.slice(0, 4) : spec.name;
    if (event.kind === "skill") {
      const skill = skillIdFromEventTitle(event.title);
      const text = event.gainedSkillName || SKILL_TEXT[skill] || event.title || "技能";
      return text.length > 4 ? text.slice(0, 4) : text;
    }
    const title = String(event.title || spotlightKindLabel(event.kind) || "事件").split(/[，,。]/)[0];
    const clean = title.includes("：") ? title.split("：").pop() : title;
    return clean.length > 4 ? clean.slice(0, 4) : clean;
  }

  function directedVisualActionLabel(event) {
    const text = [event.title, event.detail, event.message].filter(Boolean).join(" ");
    if (event.kind === "heal") {
      if (text.includes("自救")) return `${compactVisualActionLabel(event)}自救`;
      if (text.includes("救援")) return `${compactVisualActionLabel(event)}救援`;
    }
    if (event.kind === "response" && text.includes("无懈可击")) {
      if (text.includes("反抵消")) return "反无懈";
      return "无懈抵消";
    }
    return compactVisualActionLabel(event);
  }

  function eventRelationClass(event) {
    const text = [event.title, event.detail, event.message].filter(Boolean).join(" ");
    if (event.kind === "heal" && text.includes("救援")) return "visual-relation-rescue";
    if (event.kind === "heal" && text.includes("自救")) return "visual-relation-selfsave";
    if (event.kind === "response" && text.includes("无懈可击")) return text.includes("反抵消") ? "visual-relation-counter-nullify" : "visual-relation-nullify";
    return "";
  }

  function isAreaSpotlightEvent(event) {
    const spec = eventCardSpec(event.title);
    return Boolean(spec && ["arrows", "barbarians", "taoyuan", "harvest"].includes(spec.subtype));
  }

  function shortVisualName(text) {
    let clean = String(text || "").trim();
    const asciiOpen = clean.lastIndexOf("(");
    const cjkOpen = clean.lastIndexOf("（");
    const open = Math.max(asciiOpen, cjkOpen);
    const asciiClose = clean.lastIndexOf(")");
    const cjkClose = clean.lastIndexOf("）");
    const close = Math.max(asciiClose, cjkClose);
    if (open >= 0 && close > open) clean = clean.slice(open + 1, close);
    if (!clean) return "?";
    return clean.length > 3 ? clean.slice(0, 2) : clean;
  }

  function eventRouteTargets(event) {
    const raw = event.target || (event.kind === "damage" || event.kind === "dying" || event.kind === "death" ? event.actor : "");
    if (!raw && event.targetIds?.length) {
      return event.targetIds
        .map((id) => playerById(id))
        .filter(Boolean)
        .map(nameOf);
    }
    return String(raw || "")
      .split(/[、,，/]+/)
      .map((name) => name.trim())
      .filter(Boolean)
      .filter((name) => name !== event.actor || event.kind === "damage");
  }

  function eventRouteFallback(event) {
    if (event.kind === "turn") return "回合开始";
    if (event.kind === "draw") return "摸牌";
    if (event.kind === "discard") return "弃牌";
    if (event.kind === "judge") return "判定";
    if (event.kind === "response") return "响应";
    if (event.kind === "dying") return "濒死求救";
    if (event.kind === "death") return "角色阵亡";
    if (event.kind === "miss") return "未响应";
    if (event.kind === "heal") return "回复体力";
    if (event.kind === "equip") return "装备";
    if (event.kind === "gain") return "获得牌";
    if (event.kind === "chain") return "连环状态";
    if (event.kind === "reveal") return "展示信息";
    if (event.kind === "skip") return "跳过阶段";
    if (event.kind === "wait") return "等待玩家";
    if (event.kind === "system") return "全局事件";
    if (event.gainedSkillName) return "获得技能";
    return "自己 / 全场";
  }

  function pushEventTrail(event) {
    if (!event) return;
    const compact = {
      id: event.id,
      kind: event.kind || "system",
      actor: event.actor || "",
      title: event.title || "事件",
      target: event.target || "",
      detail: event.detail || event.message || ""
    };
    state.eventTrail = [compact, ...(state.eventTrail || [])].slice(0, 6);
  }

  function trailLine(event) {
    if (event.target) return `${event.actor || "事件"} → ${event.target}`;
    if (event.actor && event.detail && event.detail !== event.actor) return `${event.actor} · ${event.detail}`;
    return event.detail || event.actor || "刚刚发生";
  }

  function enrichSpotlightEvent(event) {
    const actorId = findPlayerIdInText(event.actor);
    const allowSelfTarget = ["damage", "dying", "death", "heal", "chain", "skip", "judge"].includes(event.kind);
    let targetIds = playerIdsFromText(event.target || event.detail || event.message)
      .filter((id) => allowSelfTarget || id !== actorId);
    if (!targetIds.length) targetIds = areaEventTargetIds(event, actorId);
    const damageIds = event.kind === "damage" || event.kind === "dying" || event.kind === "death"
      ? playerIdsFromText(event.damage || event.target || event.actor || event.message || "")
      : [];
    return {
      ...event,
      actorId,
      targetIds,
      damageIds
    };
  }

  function areaEventTargetIds(event, actorId) {
    if (event.kind !== "card") return [];
    const spec = eventCardSpec(event.title);
    if (!spec) return [];
    if (spec.subtype === "arrows" || spec.subtype === "barbarians") {
      const actor = playerById(actorId);
      return actor ? massTrickTargetsInOrder(actor).map((player) => player.id) : [];
    }
    if (spec.subtype === "taoyuan" || spec.subtype === "harvest") {
      const actor = playerById(actorId);
      return actor ? massTrickTargetsInOrder(actor, { includeSource: true }).map((player) => player.id) : alivePlayers().map((player) => player.id);
    }
    return [];
  }

  function findPlayerIdInText(text) {
    return playerIdsFromText(text)[0] ?? null;
  }

  function playerIdsFromText(text) {
    const raw = String(text || "");
    if (!raw) return [];
    const ids = [];
    state.players.forEach((player) => {
      const labels = [nameOf(player), player.name, player.general.name].filter(Boolean);
      if (labels.some((label) => raw.includes(label))) ids.push(player.id);
    });
    return [...new Set(ids)];
  }

  function setupRuntimeErrorHandlers() {
    if (setupRuntimeErrorHandlers.bound) return;
    setupRuntimeErrorHandlers.bound = true;
    window.addEventListener("error", (event) => {
      recordRuntimeIssue(event.error || event.message, "运行错误", false);
    });
    window.addEventListener("unhandledrejection", (event) => {
      recordRuntimeIssue(event.reason, "异步错误", false);
    });
  }

  function recordRuntimeIssue(error, label, stopLoop) {
    if (!state.started || state.gameOver) return;
    const message = errorMessage(error);
    state.loopError = {
      message,
      label,
      at: Date.now(),
      phase: state.status.phase,
      actorId: state.status.actorId ?? state.current
    };
    if (stopLoop) state.loopId += 1;
    state.status.warning = `${label}：${message}`;
    state.status.updatedAt = Date.now();
    try {
      log(`诊断：${label}：${message}`);
    } catch {
      state.spotlight = {
        id: state.lastEventId++,
        kind: "system",
        actor: "诊断",
        title: label,
        detail: message
      };
    }
    try {
      render();
    } catch {
      // Keep the failure in the battle log; v1 has no visible debug panel.
    }
  }

  function errorMessage(error) {
    if (!error) return "未知错误";
    if (typeof error === "string") return error.slice(0, 160);
    return String(error.message || error).slice(0, 160);
  }

  function markStatus(phase, actor = null, detail = "") {
    state.status.phase = phase;
    state.status.detail = detail;
    state.status.actorId = actor?.id ?? null;
    state.status.updatedAt = Date.now();
    state.status.warning = "";
  }

  function setWait(kind, prompt, waitingForId = null, detail = "") {
    state.waitSeq = (state.waitSeq || 0) + 1;
    state.status.waitKind = kind;
    state.status.waitId = state.waitSeq;
    state.status.waitPrompt = prompt;
    state.status.waitingForId = waitingForId;
    state.status.waitStartedAt = Date.now();
    state.status.detail = detail || state.status.detail;
    state.status.warning = "";
    showWaitSpotlight(kind, prompt, waitingForId, detail);
  }

  function clearWait() {
    state.status.waitKind = null;
    state.status.waitId = 0;
    state.status.waitPrompt = "";
    state.status.waitingForId = null;
    state.status.waitStartedAt = 0;
    state.status.warning = "";
    clearPendingWaitSpotlight();
  }

  function showWaitSpotlight(kind, prompt, waitingForId, detail = "") {
    if (!state.started || state.gameOver) return;
    const owner = waitingForId != null ? playerById(waitingForId) : playerById(state.current);
    const event = {
      id: state.lastEventId++,
      kind: "wait",
      actor: owner ? nameOf(owner) : "玩家",
      title: kind || "等待操作",
      target: "",
      detail: prompt || detail || "等待操作",
      message: prompt || detail || "",
      actorId: owner?.id ?? null,
      targetIds: [],
      damageIds: [],
      waitId: state.status.waitId,
      waitKind: state.status.waitKind
    };
    if (shouldDeferWaitSpotlight(event)) {
      state.pendingWaitSpotlight = event;
      schedulePendingWaitSpotlight();
      return;
    }
    clearPendingWaitSpotlight();
    state.spotlight = event;
    state.eventHoldUntil = 0;
  }

  function shouldDeferWaitSpotlight(waitEvent, now = Date.now()) {
    if (!waitEvent || waitEvent.kind !== "wait") return false;
    const current = state.spotlight;
    if (!current || current.kind === "wait") return false;
    if ((state.eventHoldUntil || 0) <= now) return false;
    if (state.targetPick?.previewAction || state.cardPick) return false;
    return isSpotlightWorthKeepingOverWait(current);
  }

  function isSpotlightWorthKeepingOverWait(event) {
    if (!event) return false;
    if (eventResourceCardInfo(event).length) return true;
    return ["judge", "damage", "dying", "death", "heal", "response", "equip"].includes(event.kind);
  }

  function schedulePendingWaitSpotlight() {
    if (state.pendingWaitTimer) {
      clearTimeout(state.pendingWaitTimer);
      state.pendingWaitTimer = null;
    }
    if (state.testMode || !state.pendingWaitSpotlight) return;
    const delayMs = Math.max(0, (state.eventHoldUntil || 0) - Date.now());
    state.pendingWaitTimer = setTimeout(() => {
      state.pendingWaitTimer = null;
      if (promotePendingWaitSpotlight()) render();
    }, delayMs + 24);
  }

  function promotePendingWaitSpotlight(now = Date.now()) {
    const pending = state.pendingWaitSpotlight;
    if (!pending || (state.eventHoldUntil || 0) > now) return false;
    if (state.status.waitId !== pending.waitId || state.status.waitKind !== pending.waitKind) {
      clearPendingWaitSpotlight();
      return false;
    }
    state.spotlight = pending;
    state.eventHoldUntil = 0;
    state.pendingWaitSpotlight = null;
    return true;
  }

  function clearPendingWaitSpotlight() {
    if (state.pendingWaitTimer) {
      clearTimeout(state.pendingWaitTimer);
      state.pendingWaitTimer = null;
    }
    state.pendingWaitSpotlight = null;
  }

  function activeWaitState() {
    const startedAt = state.status.waitStartedAt || state.status.updatedAt || Date.now();
    const waitingForId = state.status.waitingForId;
    if (state.eventStepWaiting) {
      return {
        id: 0,
        kind: "单步暂停",
        prompt: "事件已停住。点击顶部“下一步”继续结算，或点“自动继续”关闭单步。",
        detail: state.spotlight?.title || "等待下一步",
        startedAt: state.eventStepStartedAt || Date.now(),
        waitingForId: 0
      };
    }
    if (state.cardPick) {
      return {
        id: state.status.waitId || 0,
        kind: "选牌",
        prompt: state.cardPick.prompt,
        detail: `${state.cardPick.selected.length}/${state.cardPick.min}-${state.cardPick.max}`,
        startedAt,
        waitingForId: state.cardPick.ownerId ?? waitingForId
      };
    }
    if (state.targetPick) {
      return {
        id: state.status.waitId || 0,
        kind: "选目标",
        prompt: state.targetPick.prompt,
        detail: `${state.targetPick.selected.length}/${state.targetPick.min}-${state.targetPick.max}`,
        startedAt,
        waitingForId: state.targetPick.ownerId ?? waitingForId
      };
    }
    if (state.pending) {
      return {
        id: state.status.waitId || 0,
        kind: state.status.waitKind || "选择",
        prompt: state.pending.prompt,
        detail: `${state.pending.options?.length || 0} 个选项`,
        startedAt,
        waitingForId: state.pending.ownerId ?? waitingForId
      };
    }
    if (state.playContext) {
      return {
        id: state.status.waitId || 0,
        kind: "出牌操作",
        prompt: "点手牌直接使用，或从操作条选择。",
        detail: `${state.playContext.actions?.length || 0} 个操作`,
        startedAt,
        waitingForId: state.playContext.playerId
      };
    }
    return null;
  }

  function ageLabel(ms) {
    if (!Number.isFinite(ms) || ms < 0) return "0s";
    if (ms < 1000) return "刚刚";
    return `${Math.floor(ms / 1000)}s`;
  }

  function watchdogTick() {
    const wait = activeWaitState();
    if (!wait || state.gameOver) return;
    const age = Date.now() - (wait.startedAt || Date.now());
    if (age < 12000 || state.status.warning) return;
    const issues = waitConsistencyIssues(wait).filter((issue) => !issue.includes("玩家等待"));
    if (issues.length) {
      state.status.warning = `等待状态异常：${issues[0]}`;
      if (canRecoverNow(wait) && recoverStaleWait(wait, "自动")) {
        state.status.recoveries += 1;
        state.status.warning = `等待状态异常，已自动回退：${issues[0]}`;
      }
      return;
    }
    if (isHumanControlledWait(wait)) {
      state.status.warning = "等待玩家操作中；这不是 AI 卡住。";
      return;
    }
    if (!canRecoverNow(wait)) {
      state.status.warning = "等待状态超过 12 秒；已记录，未自动处理。";
      return;
    }
    if (recoverStaleWait(wait, "自动")) {
      state.status.recoveries += 1;
      state.status.warning = "检测到非玩家等待超时，已自动回退。";
    }
  }

  function canRecoverNow(wait = activeWaitState()) {
    if (state.loopError) return true;
    if (!wait) return false;
    if (isHumanControlledWait(wait)) return false;
    const owner = wait.waitingForId != null ? playerById(wait.waitingForId) : null;
    if (owner && !owner.alive && !state.gameOver) return true;
    return Boolean(state.pending || state.cardPick || state.targetPick || state.playContext);
  }

  function isHumanControlledWait(wait) {
    const owner = wait?.waitingForId != null ? playerById(wait.waitingForId) : playerById(state.current);
    return Boolean(owner?.isHuman && !state.autoplayHuman && !state.autoplayHumanForTurn);
  }

  function recoverStaleWait(wait, source = "自动") {
    log(`诊断：${waitSummary(wait)} 超过 12 秒，${source}尝试${recoveryPreview(wait)}。`);
    if (state.pending) {
      resolveDefaultPending();
      return true;
    }
    if (state.cardPick?.resolve) {
      const resolve = state.cardPick.resolve;
      state.cardPick = null;
      state.playCardId = null;
      clearWait();
      resolve([]);
      return true;
    }
    if (state.targetPick?.resolve) {
      const resolve = state.targetPick.resolve;
      state.targetPick = null;
      state.playCardId = null;
      clearWait();
      resolve([]);
      return true;
    }
    if (state.playContext?.resolver) {
      const resolve = state.playContext.resolver;
      state.playContext = null;
      state.playCardId = null;
      clearWait();
      resolve({ type: "end" });
      return true;
    }
    return false;
  }

  function waitSummary(wait) {
    if (!wait) return "未知等待";
    const owner = wait.waitingForId != null ? playerById(wait.waitingForId) : playerById(state.current);
    const ownerText = owner ? nameOf(owner) : "未知角色";
    return `${wait.id ? `#${wait.id} · ` : ""}${wait.kind || "等待"} · ${ownerText}${wait.detail ? ` · ${wait.detail}` : ""}`;
  }

  function currentActorLabel() {
    if (state.gameOver) return "对局结束";
    const current = state.players[state.current];
    return current ? `当前：${nameOf(current)}` : "等待开始";
  }

  function centerStatusText() {
    if (state.cardPick) return state.cardPick.prompt;
    if (state.targetPick) return state.targetPick.prompt;
    if (state.pending) return state.pending.prompt;
    if (state.playContext) return "你的出牌阶段。";
    if (state.gameOver) return "对局结束。";
    const current = state.players[state.current];
    return current?.isHuman ? "等待玩家操作。" : "AI 正在思考。";
  }

  function shortZoneText(text) {
    if (!text || text.startsWith("无")) return "无";
    if (text.includes("/")) return `${text.split("/").length}张`;
    return text.length > 4 ? "有" : text;
  }

  function shortGeneralName(name) {
    if (!name) return "?";
    return name.length > 3 ? name.slice(0, 2) : name;
  }

  function portraitDisplayName(name) {
    if (!name) return "?";
    return name.length > 4 ? name.slice(0, 4) : name;
  }

  function portraitVars(player) {
    const general = player?.general || {};
    const palette = portraitPalette(general.kingdom);
    const seed = hashString(`${general.id || general.name || "hero"}-${player?.id ?? 0}`);
    const x = 28 + (seed % 42);
    const y = 18 + ((seed >> 3) % 30);
    const angle = 125 + (seed % 80);
    const mark = 18 + ((seed >> 5) % 62);
    const genderGlow = general.gender === "female" ? "rgba(255, 212, 232, 0.44)" : "rgba(255, 238, 191, 0.36)";
    const portraitId = String(general.id || "")
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .trim();
    return [
      `--portrait-a:${palette[0]}`,
      `--portrait-b:${palette[1]}`,
      `--portrait-c:${palette[2]}`,
      `--portrait-x:${x}%`,
      `--portrait-y:${y}%`,
      `--portrait-angle:${angle}deg`,
      `--portrait-mark:${mark}%`,
      `--portrait-glow:${genderGlow}`,
      portraitId ? `--portrait-image:url("assets/portraits/${portraitId}.png")` : ""
    ].filter(Boolean).join(";");
  }

  function cardSuitSymbol(card) {
    return {
      heart: "♥",
      diamond: "♦",
      club: "♣",
      spade: "♠",
      "♥": "♥",
      "♦": "♦",
      "♣": "♣",
      "♠": "♠"
    }[card?.suit] || card?.suit || "";
  }

  function cardRankLabel(card) {
    const rank = String(card?.rank || "");
    return rank === "1" ? "A" : rank;
  }

  function cardMetaLine(card) {
    const base = cardTypeLabel(card);
    if (!card || card.type !== "equipment") return base;
    const slot = card.slot ? equipSlotLabel(card.slot) : "";
    const range = card.range ? ` · ${card.range}` : "";
    return `${slot || "装备"}${range}`;
  }

  function cardDisplayTone(card) {
    const name = cardDisplayName(card);
    if (["桃", "桃园结义", "五谷丰登"].includes(name)) return "good";
    if (["杀", "火杀", "雷杀", "决斗", "南蛮入侵", "万箭齐发", "火攻", "闪电"].includes(name)) return "harm";
    if (card?.type === "equipment") return "gear";
    if (card?.type === "trick" || card?.type === "delayed") return "trick";
    return "plain";
  }

  function cardNameParts(name) {
    const text = String(name || "");
    if (text.length <= 3) return [text];
    if (text.length === 4) return [text.slice(0, 2), text.slice(2)];
    return [text.slice(0, 2), text.slice(2, 5), text.slice(5)].filter(Boolean);
  }

  function renderCardFaceText(card) {
    const parts = cardNameParts(cardDisplayName(card));
    return parts.map((part) => `<span>${escapeHtml(part)}</span>`).join("");
  }

  function isCardRedSuit(card) {
    const suit = cardSuitSymbol(card);
    return suit === "♥" || suit === "♦";
  }

  function renderMiniCardFace(card, extraClass = "") {
    if (!card) return "";
    return `
      <span class="mini-card-face ${extraClass} tone-${cardDisplayTone(card)} ${isCardRedSuit(card) ? "red" : ""}">
        <span class="mini-card-rank">${escapeHtml(cardRankLabel(card))}${escapeHtml(cardSuitSymbol(card))}</span>
        <strong>${renderCardFaceText(card)}</strong>
        <small>${escapeHtml(cardMetaLine(card))}</small>
      </span>
    `;
  }

  function portraitPalette(kingdom) {
    if (kingdom === "魏") return ["#7095b4", "#1e3140", "#cfe5ef"];
    if (kingdom === "蜀") return ["#6ec783", "#173424", "#d7f2c1"];
    if (kingdom === "吴") return ["#cf615b", "#3a1d1f", "#ffe0b8"];
    return ["#8b75bd", "#211c34", "#eee1ff"];
  }

  function hashString(text) {
    let hash = 2166136261;
    for (let i = 0; i < String(text).length; i += 1) {
      hash ^= String(text).charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function playerEventClasses(player, spotlight = state.spotlight) {
    if (!spotlight || !player) return "";
    const classes = [];
    if (spotlight.actorId === player.id) classes.push("event-actor");
    if (spotlight.targetIds?.includes(player.id)) classes.push("event-target");
    if (spotlight.damageIds?.includes(player.id)) classes.push("event-damage");
    if (spotlight.kind === "death" && (spotlight.targetIds?.includes(player.id) || spotlight.damageIds?.includes(player.id))) classes.push("event-death");
    return classes.join(" ");
  }

  function renderPlayerEventMarker(player, spotlight = state.spotlight) {
    if (!spotlight || !player) return "";
    if (spotlight.kind === "death" && (spotlight.targetIds?.includes(player.id) || spotlight.damageIds?.includes(player.id))) return `<div class="event-marker marker-death">阵亡</div>`;
    if (!player.alive) return "";
    if (state.targetPick?.selected?.includes(player.id)) return `<div class="event-marker marker-pick">已选</div>`;
    if (state.targetPick?.validIds?.includes(player.id)) return `<div class="event-marker marker-pickable">可选</div>`;
    if (spotlight.damageIds?.includes(player.id)) return `<div class="event-marker marker-damage">受伤</div>`;
    if (spotlight.targetIds?.includes(player.id)) return `<div class="event-marker marker-target">目标</div>`;
    if (spotlight.actorId === player.id) return `<div class="event-marker marker-actor">行动</div>`;
    return "";
  }

  function kingdomClass(kingdom) {
    if (kingdom === "魏") return "kingdom-wei";
    if (kingdom === "蜀") return "kingdom-shu";
    if (kingdom === "吴") return "kingdom-wu";
    return "kingdom-qun";
  }

  function roleToNote(role) {
    if (role === "主公") return "lord";
    if (role === "忠臣") return "loyal";
    if (role === "反贼") return "rebel";
    if (role === "内奸") return "traitor";
    return "unknown";
  }

  function skillRuleText(skill) {
    const label = SKILL_TEXT[skill] || skill;
    const rule = SKILL_RULE_TEXT[skill] || coverageNote(skillCoverageStatus(skill), skill);
    return `${label}：${rule}`;
  }

  function skillImplementationText(skill) {
    const status = skillCoverageStatus(skill);
    return `实现：${coverageLabel(status)} - ${coverageNote(status, skill)}`;
  }

  function skillTooltipText(skill) {
    return `${skillRuleText(skill)}\n${skillImplementationText(skill)}`;
  }

  function actionRuleText(action) {
    if (action.type === "card" && action.card) return `${action.label}\n${cardTooltipText(action.card)}`;
    if (action.type === "skill" && action.skill) return `${action.label || SKILL_TEXT[action.skill] || action.skill}\n${skillTooltipText(action.skill)}`;
    return action.label || "操作";
  }

  function setupIdentityPopover() {
    if (setupIdentityPopover.bound) return;
    setupIdentityPopover.bound = true;
    const popover = identityPopoverNode();
    popover.addEventListener("pointerenter", clearIdentityPopoverClose);
    popover.addEventListener("pointerleave", scheduleIdentityPopoverClose);
    popover.addEventListener("click", handleIdentityPopoverClick);
    document.addEventListener("pointerdown", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || !isIdentityPopoverOpen()) return;
      if (popover.contains(target) || identityPopoverState.anchor?.contains?.(target)) return;
      closeIdentityPopover();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeIdentityPopover();
    });
    window.addEventListener("resize", () => {
      if (isIdentityPopoverOpen()) positionFloatingLayer(identityPopoverState.anchor, popover);
    });
    window.addEventListener("scroll", () => {
      if (isIdentityPopoverOpen()) positionFloatingLayer(identityPopoverState.anchor, popover);
    }, true);
  }

  function identityPopoverNode() {
    let node = $("identityPopover");
    if (!node) {
      node = document.createElement("div");
      node.id = "identityPopover";
      node.className = "identity-popover hidden";
      node.setAttribute("role", "dialog");
      node.setAttribute("aria-label", "标记身份");
      document.body.appendChild(node);
    }
    return node;
  }

  function isIdentityPopoverOpen() {
    const node = $("identityPopover");
    return Boolean(node && !node.classList.contains("hidden"));
  }

  function openIdentityPopover(playerId, anchor, { locked = false } = {}) {
    const player = playerById(playerId);
    if (!player || !anchor) return;
    clearIdentityPopoverClose();
    hideTooltip();
    const popover = identityPopoverNode();
    identityPopoverState.playerId = playerId;
    identityPopoverState.anchor = anchor;
    identityPopoverState.locked = locked;
    popover.innerHTML = renderIdentityPopoverContent(player);
    popover.dataset.playerId = String(playerId);
    popover.classList.remove("hidden");
    document.querySelectorAll("[data-note-trigger-id]").forEach((node) => {
      node.setAttribute("aria-expanded", String(node === anchor));
    });
    positionFloatingLayer(anchor, popover);
  }

  function toggleIdentityPopover(playerId, anchor) {
    if (isIdentityPopoverOpen() && identityPopoverState.playerId === playerId && identityPopoverState.locked) {
      closeIdentityPopover();
      return;
    }
    openIdentityPopover(playerId, anchor, { locked: true });
  }

  function renderIdentityPopoverContent(player) {
    const note = state.roleNotes[player.id] || "unknown";
    const current = ROLE_NOTE_LONG[note] || ROLE_NOTE_LONG.unknown;
    return `
      <section class="identity-popover-card">
        <header>
          <strong>标记身份</strong>
          <span>${escapeHtml(nameOf(player))}</span>
        </header>
        <p>仅用于你的推断，不影响真实身份或 AI 判断。</p>
        <div class="identity-popover-options" role="group" aria-label="身份标记选项">
          ${renderRoleNoteChoices(player.id, note)}
        </div>
        <footer>
          <span>当前标记</span>
          <b class="note-${escapeAttr(note)}">${escapeHtml(current)}</b>
        </footer>
      </section>
    `;
  }

  function handleIdentityPopoverClick(event) {
    const button = event.target instanceof Element ? event.target.closest("[data-note-value]") : null;
    if (!button) return;
    event.stopPropagation();
    const playerId = Number(button.dataset.noteId);
    const value = button.dataset.noteValue || "unknown";
    closeIdentityPopover();
    setRoleNote(playerId, value);
  }

  function clearIdentityPopoverClose() {
    if (identityPopoverState.closeTimer) {
      clearTimeout(identityPopoverState.closeTimer);
      identityPopoverState.closeTimer = null;
    }
  }

  function scheduleIdentityPopoverClose() {
    clearIdentityPopoverClose();
    if (identityPopoverState.locked) return;
    identityPopoverState.closeTimer = window.setTimeout(closeIdentityPopover, 220);
  }

  function closeIdentityPopover() {
    clearIdentityPopoverClose();
    const popover = $("identityPopover");
    if (popover) {
      popover.classList.add("hidden");
      popover.innerHTML = "";
      popover.style.left = "";
      popover.style.top = "";
      popover.style.visibility = "";
      delete popover.dataset.playerId;
      delete popover.dataset.placement;
    }
    document.querySelectorAll("[data-note-trigger-id]").forEach((node) => {
      node.setAttribute("aria-expanded", "false");
    });
    identityPopoverState.playerId = null;
    identityPopoverState.anchor = null;
    identityPopoverState.locked = false;
  }

  function positionFloatingLayer(anchor, layer) {
    if (!anchor || !layer || layer.classList.contains("hidden")) return;
    const pad = 12;
    const gap = 10;
    const anchorRect = anchor.getBoundingClientRect();
    const avoidRect = anchor.closest?.(".player")?.getBoundingClientRect?.() || anchorRect;
    layer.style.visibility = "hidden";
    layer.style.left = "0px";
    layer.style.top = "0px";
    const rect = layer.getBoundingClientRect();
    const vertical = avoidRect.top + Math.min(8, Math.max(0, (avoidRect.height - rect.height) / 2));
    const alignRight = avoidRect.right - rect.width;
    const candidates = [
      { placement: "right", x: avoidRect.right + gap, y: vertical },
      { placement: "bottom", x: alignRight, y: avoidRect.bottom + gap },
      { placement: "top", x: alignRight, y: avoidRect.top - rect.height - gap },
      { placement: "left", x: avoidRect.left - rect.width - gap, y: vertical }
    ];
    const fits = (candidate) => (
      candidate.x >= pad
      && candidate.y >= pad
      && candidate.x + rect.width <= window.innerWidth - pad
      && candidate.y + rect.height <= window.innerHeight - pad
    );
    const picked = candidates.find(fits) || candidates[0];
    let { x, y, placement } = picked;
    x = clamp(x, pad, Math.max(pad, window.innerWidth - rect.width - pad));
    y = clamp(y, pad, Math.max(pad, window.innerHeight - rect.height - pad));
    layer.style.left = `${x}px`;
    layer.style.top = `${y}px`;
    layer.style.visibility = "";
    layer.dataset.placement = placement;
  }

  function setupTooltips() {
    if (setupTooltips.bound) return;
    setupTooltips.bound = true;
    document.addEventListener("pointerover", handleTooltipOver);
    document.addEventListener("pointermove", handleTooltipMove);
    document.addEventListener("pointerout", handleTooltipOut);
    document.addEventListener("mouseover", handleTooltipOver);
    document.addEventListener("mousemove", handleTooltipMove);
    document.addEventListener("mouseout", handleTooltipOut);
    document.addEventListener("focusin", handleTooltipOver);
    document.addEventListener("focusout", hideTooltip);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hideTooltip();
    });
    window.addEventListener("blur", hideTooltip);
  }

  function syncNativeTooltips(root = document) {
    if (!root?.querySelectorAll) return;
    root.querySelectorAll("[data-tip]").forEach((node) => {
      if (!node.dataset?.tip || node.hasAttribute("title")) return;
      node.setAttribute("title", node.dataset.tip);
    });
  }

  function handleTooltipOver(event) {
    const source = event.target instanceof Element ? event.target : event.target?.parentElement;
    const target = source?.closest?.("[data-tip]");
    if (!target || !target.dataset.tip || !document.body.contains(target)) return;
    tooltipTarget = target;
    if (target.hasAttribute("title")) {
      target.dataset.nativeTitle = target.getAttribute("title");
      target.removeAttribute("title");
    }
    showTooltip(target, event);
  }

  function handleTooltipMove(event) {
    if (tooltipTarget) moveTooltip(event);
  }

  function handleTooltipOut(event) {
    if (!tooltipTarget) return;
    const next = event.relatedTarget instanceof Element ? event.relatedTarget : null;
    if (next && tooltipTarget.contains(next)) return;
    const source = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (source && tooltipTarget.contains(source)) hideTooltip();
  }

  function showTooltip(target, event) {
    const tooltip = $("tooltip");
    if (!tooltip) return;
    tooltip.dataset.kind = tooltipKind(target);
    tooltip.innerHTML = tooltipMarkup(target.dataset.tip);
    tooltip.classList.remove("hidden");
    moveTooltip(event);
  }

  function moveTooltip(event) {
    const tooltip = $("tooltip");
    if (!tooltip || tooltip.classList.contains("hidden")) return;
    const pad = 14;
    const gap = 16;
    const anchorRect = tooltipTarget?.getBoundingClientRect?.();
    const baseX = Number.isFinite(event?.clientX) && event.clientX > 0 ? event.clientX : (anchorRect?.right ?? 0);
    const baseY = Number.isFinite(event?.clientY) && event.clientY > 0 ? event.clientY : (anchorRect?.top ?? 0);
    let x = baseX + gap;
    let y = baseY + gap;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    requestAnimationFrame(() => {
      const rect = tooltip.getBoundingClientRect();
      if (x + rect.width + pad > window.innerWidth) x = baseX - rect.width - gap;
      if (y + rect.height + pad > window.innerHeight) y = baseY - rect.height - gap;
      tooltip.style.left = `${clamp(x, pad, Math.max(pad, window.innerWidth - rect.width - pad))}px`;
      tooltip.style.top = `${clamp(y, pad, Math.max(pad, window.innerHeight - rect.height - pad))}px`;
    });
  }

  function hideTooltip() {
    const tooltip = $("tooltip");
    if (tooltip) {
      tooltip.classList.add("hidden");
      tooltip.innerHTML = "";
    }
    if (tooltipTarget?.dataset.nativeTitle) {
      tooltipTarget.setAttribute("title", tooltipTarget.dataset.nativeTitle);
      delete tooltipTarget.dataset.nativeTitle;
    }
    tooltipTarget = null;
  }

  function tooltipKind(target) {
    if (target.classList.contains("card")) return "card";
    if (target.classList.contains("skill-tag") || target.classList.contains("human-skill-trigger")) return "skill";
    if (target.classList.contains("role-note")) return "role";
    if (target.classList.contains("turn-compass")) return "role";
    return "info";
  }

  function tooltipMarkup(text) {
    const lines = String(text || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    const title = lines.shift() || "说明";
    const body = lines.join("\n");
    return `
      <div class="tooltip-title">${escapeHtml(title)}</div>
      ${body ? `<div class="tooltip-body">${escapeHtml(body)}</div>` : ""}
    `;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeAttr(value) {
    return escapeHtml(value)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function responseLabel(kind) {
    if (kind === "slash") return "杀";
    if (kind === "dodge") return "闪";
    if (kind === "nullify") return "无懈可击";
    return "桃";
  }

  function skillCoverageStatus(skill) {
    if (SKILL_COVERAGE.full.has(skill)) return "full";
    if (SKILL_COVERAGE.partial.has(skill)) return "partial";
    return "todo";
  }

  function coverageLabel(status) {
    if (status === "full") return "完整";
    if (status === "partial") return "简化可玩";
    return "关键缺失";
  }

  function coverageNote(status, skill) {
    if (skill === "liuli") return "已支持弃手牌或装备牌，将杀转移给攻击范围内其他角色";
    if (skill === "guzheng") return "已支持弃牌阶段返还一张、获得其余牌";
    if (skill === "qiaobian") return "已支持跳判定/摸牌/出牌/弃牌阶段，并移动判定牌、场上牌或获得手牌";
    if (status === "full") return SKILL_COVERAGE.notes.full;
    if (status === "partial") return SKILL_COVERAGE.notes.partial;
    return SKILL_COVERAGE.notes.todo;
  }

  function skillPrefix(skill) {
    return skill ? `${SKILL_TEXT[skill] || skill}：` : "";
  }

  function natureLabel(nature) {
    if (nature === DAMAGE.FIRE) return "火焰";
    if (nature === DAMAGE.THUNDER) return "雷电";
    return "";
  }

  function rankFromNumber(n) {
    if (n === 1) return "A";
    if (n === 11) return "J";
    if (n === 12) return "Q";
    if (n === 13) return "K";
    return String(n);
  }

  function rankValue(rank) {
    if (rank === "A") return 1;
    if (rank === "J") return 11;
    if (rank === "Q") return 12;
    if (rank === "K") return 13;
    return Number(rank);
  }

  function shuffle(input) {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function randomOf(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function eventTempoProfile() {
    return {
      ultra: {
        scale: 4.25,
        important: { min: 4200, max: 8200 },
        normal: { min: 2600, max: 5600 },
        minor: { min: 1200, max: 2600 }
      },
      slow: {
        scale: 2.65,
        important: { min: 2600, max: 5200 },
        normal: { min: 1600, max: 3400 },
        minor: { min: 850, max: 1700 }
      },
      normal: {
        scale: 0.92,
        important: { min: 900, max: 1500 },
        normal: { min: 460, max: 980 },
        minor: { min: 220, max: 560 }
      },
      fast: {
        scale: 0.44,
        important: { min: 320, max: 720 },
        normal: { min: 140, max: 360 },
        minor: { min: 80, max: 220 }
      }
    }[state.tempo] || {
      scale: 0.92,
      important: { min: 900, max: 1500 },
      normal: { min: 460, max: 980 },
      minor: { min: 220, max: 560 }
    };
  }

  function scaledEventDuration(ms, importance = "normal") {
    const tempo = eventTempoProfile();
    const band = tempo[importance] || tempo.normal;
    return Math.round(clamp(ms * tempo.scale, band.min, band.max));
  }

  function eventHoldDuration(event) {
    if (event?.kind === "wait") return 0;
    const importance = eventImportance(event);
    if (eventResourceCardInfo(event).length) {
      return scaledEventDuration(event.kind === "discard" ? 1320 : 1180, "important");
    }
    const base = {
      card: 1040,
      skill: 980,
      damage: 1180,
      dying: 1220,
      death: 1380,
      judge: 1040,
      draw: 420,
      discard: 440,
      response: 980,
      miss: 900,
      heal: 960,
      equip: 720,
      gain: 440,
      chain: 780,
      reveal: 780,
      skip: 860,
      turn: 720,
      system: 560
    }[event?.kind] || 620;
    return scaledEventDuration(base, importance);
  }

  function eventImportance(event) {
    if (!event) return "normal";
    if (eventResourceCardInfo(event).length) return "important";
    if (["card", "skill", "damage", "dying", "death", "response", "miss", "heal", "judge", "skip", "reveal"].includes(event.kind)) return "important";
    if (["draw", "discard", "gain"].includes(event.kind)) return "minor";
    if (["turn", "equip", "chain"].includes(event.kind)) return "normal";
    return "normal";
  }

  function activeEventImportance(fallback = "normal") {
    const spotlight = state.spotlight;
    if (!spotlight || spotlight.kind === "wait") return fallback;
    return eventImportance(spotlight);
  }

  async function eventPause(ms = 720, importance = null) {
    if (state.testMode) return;
    render();
    if (state.autoplayHuman) {
      await delay(120);
      return;
    }
    const holdLeft = Math.max(0, (state.eventHoldUntil || 0) - Date.now());
    const pauseImportance = importance || activeEventImportance("normal");
    await delay(Math.max(scaledEventDuration(ms, pauseImportance), holdLeft));
    await waitForEventStep();
  }

  function waitForEventStep() {
    if (!state.eventStepMode || state.gameOver || state.autoplayHuman) return Promise.resolve();
    if (!state.started || $("game")?.classList.contains("hidden")) return Promise.resolve();
    if (state.eventStepWaiting && state.eventStepResolver) return Promise.resolve();
    return new Promise((resolve) => {
      state.eventStepWaiting = true;
      state.eventStepResolver = resolve;
      state.eventStepStartedAt = Date.now();
      renderStepControls();
      renderActionBar();
    });
  }

  function releaseEventStepWait() {
    const resolve = state.eventStepResolver;
    state.eventStepWaiting = false;
    state.eventStepResolver = null;
    state.eventStepStartedAt = 0;
    renderStepControls();
    renderActionBar();
    if (resolve) resolve();
  }

  function log(message) {
    clearPendingWaitSpotlight();
    const event = {
      id: state.lastEventId++,
      ...enrichSpotlightEvent(eventFromLog(message))
    };
    state.spotlight = event;
    state.eventHoldUntil = state.autoplayHuman ? Date.now() + 120 : Date.now() + eventHoldDuration(event);
    pushEventTrail(event);
    state.log.push(message);
    if (state.log.length > 300) state.log.shift();
    if (state.started && !state.testMode && !$("game")?.classList.contains("hidden")) render();
  }

  async function runSmokeTest(options = {}) {
    const mode = String(options.mode || "5");
    const maxTurns = Number.isFinite(options.turns) ? options.turns : 60;
    resetState();
    state.testMode = true;
    state.mode = mode === "8" ? "8" : "5";
    state.rosterMode = options.rosterMode || "strict";
    state.aiMode = options.aiMode || "strategist";
    state.debug = false;
    state.tempo = "fast";
    state.autoplayHuman = true;
    setupPlayers("random");
    state.deck = shuffle(createDeck());
    state.players.forEach((player) => drawCards(player, 4, false));
    log(`Smoke test ${state.mode}人局开始。主公是 ${nameOf(playerById(state.masterId))}。`);

    const issues = [];
    let turnsTaken = 0;
    for (; turnsTaken < maxTurns && !state.gameOver; turnsTaken += 1) {
      const current = playerById(state.current);
      if (current?.alive) {
        await takeTurn(current);
      }
      if (state.gameOver) break;
      const wait = activeWaitState();
      const consistency = waitConsistencyIssues(wait);
      if (wait || consistency.length) {
        issues.push({
          turn: turnsTaken + 1,
          current: current ? nameOf(current) : "未知角色",
          wait: wait ? wait.kind : "",
          detail: wait ? wait.detail : "",
          consistency
        });
        break;
      }
      if (state.gameOver) break;
      advanceTurnAfterCompleted(current?.id ?? state.current);
    }

    return {
      mode: state.mode,
      rosterMode: state.rosterMode,
      turnsTaken,
      round: state.round,
      gameOver: state.gameOver,
      winner: state.status?.phase === "对局结束" ? state.status.detail : "",
      issues,
      alive: alivePlayers().map((player) => nameOf(player)),
      logTail: state.log.slice(-12)
    };
  }

  async function stabilityMatrixSummary(options = {}) {
    const modes = Array.isArray(options.modes) && options.modes.length ? options.modes : ["5", "8"];
    const rosterModes = Array.isArray(options.rosterModes) && options.rosterModes.length ? options.rosterModes : ["strict", "all"];
    const runs = Number.isFinite(options.runs) ? Math.max(1, Math.floor(options.runs)) : 2;
    const turns = Number.isFinite(options.turns) ? Math.max(20, Math.floor(options.turns)) : 160;
    const aiMode = options.aiMode || "strategist";
    const results = [];
    for (const mode of modes) {
      for (const rosterMode of rosterModes) {
        for (let run = 1; run <= runs; run += 1) {
          const result = await runSmokeTest({ mode, rosterMode, turns, aiMode });
          results.push({
            mode: result.mode,
            rosterMode: result.rosterMode,
            run,
            ok: result.issues.length === 0,
            turnsTaken: result.turnsTaken,
            round: result.round,
            gameOver: result.gameOver,
            winner: result.winner,
            alive: result.alive.length,
            issues: result.issues,
            logTail: result.logTail.slice(-5)
          });
        }
      }
    }
    const failures = results.filter((result) => !result.ok);
    return {
      ok: failures.length === 0,
      turns,
      runs,
      aiMode,
      scenarioCount: results.length,
      failures,
      results
    };
  }

  function makeScenarioPlayer(id, generalId, role, options = {}) {
    const general = GENERALS.find((item) => item.id === generalId) || GENERALS[0];
    const maxHp = options.maxHp ?? (general.maxHp + (role === "主公" ? 1 : 0));
    return {
      id,
      seat: id,
      isHuman: Boolean(options.isHuman),
      name: options.isHuman ? "你" : general.name,
      role,
      revealed: Boolean(options.revealed ?? (role === "主公" || options.isHuman)),
      general,
      hp: options.hp ?? maxHp,
      maxHp,
      hand: [],
      equip: {},
      judgeArea: [],
      alive: true,
      linked: false,
      drunk: false,
      flags: {},
      extraSkills: [],
      tempSkills: [],
      disabledSkills: [],
      fields: [],
      buquPile: [],
      turn: {},
      personality: createPersonality(Boolean(options.isHuman), role)
    };
  }

  function setupScenarioState(players, options = {}) {
    resetState();
    state.testMode = true;
    state.mode = options.mode || (players.length <= 5 ? "5" : "8");
    state.aiMode = options.aiMode || "strategist";
    state.players = players;
    state.current = options.current ?? players[0]?.id ?? 0;
    state.masterId = players.find((player) => player.role === "主公")?.id ?? 0;
    state.deck = [];
    state.discard = [];
    state.log = [];
    state.reads = {};
    state.readReasons = {};
    state.cardReads = {};
    state.roleNotes = {};
    players.forEach((observer) => {
      state.reads[observer.id] = {};
      state.readReasons[observer.id] = {};
      state.cardReads[observer.id] = { slash: 0, dodge: 0, peach: 0, nullify: 0 };
      state.roleNotes[observer.id] = observer.revealed ? roleToNote(observer.role) : "unknown";
      players.forEach((target) => {
        state.reads[observer.id][target.id] = target.role === "主公" ? -2 : 0;
        state.readReasons[observer.id][target.id] = target.role === "主公" ? ["公开身份：主公"] : [];
      });
    });
  }

  async function ruleRegressionSummary() {
    const resolveCurrentCardPick = (ids) => {
      const pick = state.cardPick;
      if (!pick?.resolve) return false;
      state.cardPick = null;
      clearWait();
      pick.resolve(ids);
      return true;
    };

    const caocao = makeScenarioPlayer(0, "caocao", "主公");
    const xiahoudun = makeScenarioPlayer(1, "xiahoudun", "反贼");
    setupScenarioState([caocao, xiahoudun], { current: 1 });
    const beforeSynthetic = caocao.hand.length;
    await damage(xiahoudun, caocao, 1, DAMAGE.NORMAL, { name: "刚烈" });
    const afterSynthetic = caocao.hand.length;
    const syntheticLog = state.log.slice();
    caocao.hp = caocao.maxHp;
    const realSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    await damage(xiahoudun, caocao, 1, DAMAGE.NORMAL, realSlash);
    const afterPhysical = caocao.hand.length;
    const moveCaocao = makeScenarioPlayer(0, "caocao", "主公");
    const moveXiahoudun = makeScenarioPlayer(1, "xiahoudun", "反贼");
    setupScenarioState([moveCaocao, moveXiahoudun], { current: 1 });
    const moveSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "9");
    moveXiahoudun.hand = [moveSlash];
    moveXiahoudun.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    await executeMove(moveXiahoudun, {
      type: "card",
      card: moveSlash,
      consumeId: moveSlash.id,
      label: "杀",
      needsTarget: true,
      targets: [moveCaocao],
      targetMode: "enemy",
      effect: "slash",
      score: 2
    });
    const movePhysicalCardInHand = moveCaocao.hand.some((card) => card.id === moveSlash.id);
    const movePhysicalCardInDiscard = state.discard.some((card) => card.id === moveSlash.id);
    const movePhysicalDiscardCount = state.discard.length;

    const ganglieHeartOwner = makeScenarioPlayer(0, "xiahoudun", "忠臣");
    const ganglieHeartSource = makeScenarioPlayer(1, "zhangfei", "反贼", { hp: 3 });
    setupScenarioState([ganglieHeartOwner, ganglieHeartSource], { current: ganglieHeartSource.id, aiMode: "oracle" });
    state.deck = [createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "2")];
    await damage(ganglieHeartSource, ganglieHeartOwner, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const ganglieHeartLog = state.log.slice();

    const ganglieDiamondOwner = makeScenarioPlayer(0, "xiahoudun", "忠臣");
    const ganglieDiamondSource = makeScenarioPlayer(1, "zhangfei", "反贼", { hp: 1 });
    setupScenarioState([ganglieDiamondOwner, ganglieDiamondSource], { current: ganglieDiamondSource.id, aiMode: "oracle" });
    const ganglieDiscardA = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "5");
    const ganglieDiscardB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9");
    ganglieDiamondSource.hand = [ganglieDiscardA, ganglieDiscardB];
    state.deck = [createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♦", "2")];
    await damage(ganglieDiamondSource, ganglieDiamondOwner, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const ganglieDiamondLog = state.log.slice();
    const ganglieDiamondDiscardedTwoHand = ganglieDiamondSource.hp === 1 &&
      ganglieDiamondSource.hand.length === 0 &&
      state.discard.some((card) => card.id === ganglieDiscardA.id) &&
      state.discard.some((card) => card.id === ganglieDiscardB.id);

    const ganglieForcedOwner = makeScenarioPlayer(0, "xiahoudun", "忠臣");
    const ganglieForcedSource = makeScenarioPlayer(1, "zhangfei", "反贼", { hp: 3 });
    setupScenarioState([ganglieForcedOwner, ganglieForcedSource], { current: ganglieForcedSource.id, aiMode: "oracle" });
    const ganglieSoloHand = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "7");
    ganglieForcedSource.hand = [ganglieSoloHand];
    state.deck = [createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♣", "2")];
    await damage(ganglieForcedSource, ganglieForcedOwner, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const ganglieForcedLog = state.log.slice();

    const ganglieRewriteOwner = makeScenarioPlayer(0, "xiahoudun", "忠臣");
    const ganglieRewriteSimayi = makeScenarioPlayer(1, "simayi", "忠臣");
    const ganglieRewriteSource = makeScenarioPlayer(2, "zhangfei", "反贼", { hp: 3 });
    setupScenarioState([ganglieRewriteOwner, ganglieRewriteSimayi, ganglieRewriteSource], { current: ganglieRewriteSource.id, aiMode: "oracle" });
    const ganglieHeartJudge = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "3");
    const ganglieClubRewrite = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "9");
    ganglieRewriteSimayi.hand = [ganglieClubRewrite];
    state.deck = [ganglieHeartJudge];
    await damage(ganglieRewriteSource, ganglieRewriteOwner, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const ganglieRewriteLog = state.log.slice();

    const ganglieDeclineOwner = makeScenarioPlayer(0, "xiahoudun", "忠臣", { isHuman: true, hp: 3 });
    const ganglieDeclineSource = makeScenarioPlayer(1, "zhangfei", "反贼", { hp: 3 });
    setupScenarioState([ganglieDeclineOwner, ganglieDeclineSource], { current: ganglieDeclineSource.id, aiMode: "strategist" });
    const ganglieDeclineJudge = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "2");
    state.deck = [ganglieDeclineJudge];
    const ganglieDeclinePromise = damage(ganglieDeclineSource, ganglieDeclineOwner, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    await Promise.resolve();
    const ganglieDeclinePrompt = state.pending?.prompt || "";
    choosePendingOption(1);
    await ganglieDeclinePromise;
    const ganglieDeclineLog = state.log.slice();
    const ganglieDeclineDeckTopStayed = state.deck[0]?.id;

    const yueying = makeScenarioPlayer(0, "huangyueying", "忠臣");
    const source = makeScenarioPlayer(1, "zhangjiao", "反贼");
    setupScenarioState([yueying, source], { current: 1 });
    const nullify = createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "Q");
    const drawCard = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "3");
    const trick = createCard(CARD_POOL.find((spec) => spec.name === "南蛮入侵"), "♠", "7");
    yueying.hand = [nullify];
    state.deck = [drawCard];
    await consumeResponseOption(yueying, { cardId: nullify.id, label: cardName(nullify) }, "无懈可击", "打出", { source, target: yueying, card: trick });
    const yueyingLog = state.log.slice();

    const delayedYueying = makeScenarioPlayer(0, "huangyueying", "忠臣");
    const delayedTarget = makeScenarioPlayer(1, "zhangjiao", "反贼");
    setupScenarioState([delayedYueying, delayedTarget], { current: delayedYueying.id });
    const lebuForJizhi = createCard(CARD_POOL.find((spec) => spec.name === "乐不思蜀"), "♠", "6");
    const delayedJizhiDraw = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4");
    delayedYueying.hand = [lebuForJizhi];
    delayedYueying.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    state.deck = [delayedJizhiDraw];
    await executeMove(delayedYueying, {
      type: "card",
      card: lebuForJizhi,
      consumeId: lebuForJizhi.id,
      label: "乐不思蜀",
      needsTarget: true,
      targets: [delayedTarget],
      targetMode: "delayed",
      effect: "lebu",
      score: 2
    });
    const delayedJizhiLog = state.log.slice();

    const rendeLiubei = makeScenarioPlayer(0, "liubei", "忠臣", { isHuman: true, hp: 3 });
    const rendeFirstTarget = makeScenarioPlayer(1, "zhangfei", "忠臣");
    const rendeSecondTarget = makeScenarioPlayer(2, "caocao", "主公");
    setupScenarioState([rendeLiubei, rendeFirstTarget, rendeSecondTarget], { current: rendeLiubei.id });
    const rendeSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    const rendeDodge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    const rendePeach = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9");
    const rendeWine = createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "10");
    rendeLiubei.hand = [rendeSlash, rendeDodge, rendePeach, rendeWine];
    rendeLiubei.turn = { usedSkills: {}, gaveByRende: 0, slashUsed: 0 };
    const rendeLegalTargets = legalTargets(rendeLiubei, { type: "skill", skill: "rende", label: "仁德", needsTarget: true, targetMode: "any" });
    const rendeFirstPromise = executeSkill(rendeLiubei, { type: "skill", skill: "rende", targets: [rendeFirstTarget], score: 2 });
    await Promise.resolve();
    const rendeFirstPickPrompt = state.cardPick?.prompt || "";
    const rendeFirstPicked = resolveCurrentCardPick([rendeSlash.id]);
    await rendeFirstPromise;
    const hpAfterFirstRende = rendeLiubei.hp;
    const rendeSecondPromise = executeSkill(rendeLiubei, { type: "skill", skill: "rende", targets: [rendeSecondTarget], score: 2 });
    await Promise.resolve();
    const rendeSecondPicked = resolveCurrentCardPick([rendeDodge.id]);
    await rendeSecondPromise;
    const hpAfterSecondRende = rendeLiubei.hp;
    rendeLiubei.hp = 3;
    const rendeThirdPromise = executeSkill(rendeLiubei, { type: "skill", skill: "rende", targets: [rendeFirstTarget], score: 2 });
    await Promise.resolve();
    const rendeThirdPicked = resolveCurrentCardPick([rendeWine.id]);
    await rendeThirdPromise;
    const hpAfterThirdRende = rendeLiubei.hp;
    const rendeLog = state.log.slice();

    const qingnangHuatuo = makeScenarioPlayer(0, "huatuo", "忠臣", { isHuman: true, hp: 2 });
    const qingnangTarget = makeScenarioPlayer(1, "liubei", "主公", { hp: 2 });
    const qingnangFull = makeScenarioPlayer(2, "zhangfei", "忠臣", { hp: 4 });
    setupScenarioState([qingnangHuatuo, qingnangTarget, qingnangFull], { current: qingnangHuatuo.id });
    const qingnangCost = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    const qingnangKeep = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "8");
    qingnangHuatuo.hand = [qingnangCost, qingnangKeep];
    qingnangHuatuo.turn = { usedSkills: {}, slashUsed: 0 };
    const qingnangAction = { type: "skill", skill: "qingnang", label: "青囊", needsTarget: true, targetMode: "damagedAny" };
    const qingnangLegalTargets = legalTargets(qingnangHuatuo, qingnangAction);
    const qingnangPromise = executeSkill(qingnangHuatuo, { ...qingnangAction, targets: [qingnangTarget], score: 2 });
    await Promise.resolve();
    const qingnangPickPrompt = state.cardPick?.prompt || "";
    const qingnangPicked = resolveCurrentCardPick([qingnangCost.id]);
    await qingnangPromise;
    const qingnangLog = state.log.slice();
    const qingnangAvailableAfterUse = buildPlayableActions(qingnangHuatuo).some((action) => action.skill === "qingnang");
    const qingnangCostInDiscard = state.discard.some((card) => card.id === qingnangCost.id);

    const jieyinSun = makeScenarioPlayer(0, "sunshangxiang", "忠臣", { isHuman: true, hp: 2 });
    const jieyinMaleTarget = makeScenarioPlayer(1, "liubei", "主公", { hp: 2 });
    const jieyinFullMale = makeScenarioPlayer(2, "zhangfei", "忠臣", { hp: 4 });
    const jieyinWoundedFemale = makeScenarioPlayer(3, "zhenji", "忠臣", { hp: 2 });
    setupScenarioState([jieyinSun, jieyinMaleTarget, jieyinFullMale, jieyinWoundedFemale], { current: jieyinSun.id });
    const jieyinCostA = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    const jieyinCostB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    const jieyinKeep = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9");
    jieyinSun.hand = [jieyinCostA, jieyinCostB, jieyinKeep];
    jieyinSun.turn = { usedSkills: {}, slashUsed: 0 };
    const jieyinAction = { type: "skill", skill: "jieyin", label: "结姻", needsTarget: true, targetMode: "woundedMale" };
    const jieyinLegalTargets = legalTargets(jieyinSun, jieyinAction);
    const jieyinPromise = executeSkill(jieyinSun, { ...jieyinAction, targets: [jieyinMaleTarget], score: 2 });
    await Promise.resolve();
    const jieyinPickPrompt = state.cardPick?.prompt || "";
    const jieyinPicked = resolveCurrentCardPick([jieyinCostA.id, jieyinCostB.id]);
    await jieyinPromise;
    const jieyinLog = state.log.slice();
    const jieyinAvailableAfterUse = buildPlayableActions(jieyinSun).some((action) => action.skill === "jieyin");
    const jieyinCostsInDiscard = [jieyinCostA.id, jieyinCostB.id].every((id) => state.discard.some((card) => card.id === id));

    const lijianDiaochan = makeScenarioPlayer(0, "diaochan", "反贼", { isHuman: true });
    const lijianSource = makeScenarioPlayer(1, "huangzhong", "忠臣", { hp: 4 });
    const lijianTarget = makeScenarioPlayer(2, "zhangfei", "忠臣", { hp: 4 });
    const lijianFemale = makeScenarioPlayer(3, "zhenji", "忠臣", { hp: 3 });
    setupScenarioState([lijianDiaochan, lijianSource, lijianTarget, lijianFemale], { current: lijianDiaochan.id });
    const lijianArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♣", "2");
    lijianDiaochan.hand = [];
    lijianDiaochan.equip.armor = lijianArmor;
    lijianDiaochan.turn = { usedSkills: {}, slashUsed: 0 };
    lijianSource.hand = [];
    lijianTarget.hand = [];
    const lijianAction = { type: "skill", skill: "lijian", label: "离间", needsTarget: true, targetMode: "twoMaleAny" };
    const lijianLegalTargets = legalTargets(lijianDiaochan, lijianAction);
    const lijianActionExists = buildPlayableActions(lijianDiaochan).some((action) => action.skill === "lijian");
    const lijianPromise = executeSkill(lijianDiaochan, { ...lijianAction, targets: [lijianSource, lijianTarget], score: 2 });
    await Promise.resolve();
    const lijianCostPrompt = state.pending?.prompt || "";
    const lijianCostLabels = state.pending?.options?.map((option) => option.label) || [];
    const lijianEquipChoice = state.pending?.options?.findIndex((option) => option.label.includes("装备") && option.label.includes("八卦阵")) ?? -1;
    if (lijianEquipChoice >= 0) choosePendingOption(lijianEquipChoice);
    await lijianPromise;
    const lijianLog = state.log.slice();
    const lijianAvailableAfterUse = buildPlayableActions(lijianDiaochan).some((action) => action.skill === "lijian");
    const lijianArmorInDiscard = state.discard.some((card) => card.id === lijianArmor.id);

    const guoseDaqiao = makeScenarioPlayer(0, "daqiao", "忠臣");
    const guoseTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([guoseDaqiao, guoseTarget], { current: guoseDaqiao.id, aiMode: "strategist" });
    const guoseDiamond = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♦", "7");
    const guoseNullify = createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "Q");
    guoseDaqiao.hand = [guoseDiamond];
    guoseTarget.hand = [guoseNullify];
    guoseDaqiao.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    await executeMove(guoseDaqiao, {
      type: "card",
      card: virtualCard(guoseDiamond, "乐不思蜀", "trick", "lebu"),
      consumeId: guoseDiamond.id,
      virtualSkill: "guose",
      label: "国色：乐不思蜀",
      needsTarget: true,
      targets: [guoseTarget],
      targetMode: "delayed",
      effect: "lebu",
      score: 2
    });
    const guoseUseLog = state.log.slice();
    const guoseDelayedCard = guoseTarget.judgeArea[0] || null;
    const guoseNoImmediateNullify = guoseTarget.hand.some((card) => card.id === guoseNullify.id)
      && guoseTarget.judgeArea.length === 1
      && !guoseUseLog.some((entry) => entry.includes("使用无懈可击"));
    const guoseMaterializedDiamondAsLebu = guoseDelayedCard?.id === guoseDiamond.id
      && guoseDelayedCard.name === "乐不思蜀"
      && guoseDelayedCard.originalName === "杀"
      && guoseDelayedCard.suit === "♦";
    await judgePhase(guoseTarget);
    const guoseJudgeLog = state.log.slice();

    const humanDelayedOwner = makeScenarioPlayer(0, "caocao", "主公", { isHuman: true, hp: 4 });
    const humanDelayedSource = makeScenarioPlayer(1, "daqiao", "反贼");
    const humanDelayedAlly = makeScenarioPlayer(2, "zhaoyun", "忠臣");
    setupScenarioState([humanDelayedOwner, humanDelayedSource, humanDelayedAlly], { current: humanDelayedOwner.id, aiMode: "strategist" });
    const humanDelayedLebu = materializeDelayedCard(createCard(CARD_POOL.find((spec) => spec.name === "乐不思蜀"), "♠", "6"), null, humanDelayedSource);
    const humanDelayedNullify = createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "Q");
    const allyDelayedNullify = createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "K");
    humanDelayedOwner.judgeArea = [humanDelayedLebu];
    humanDelayedOwner.hand = [humanDelayedNullify];
    humanDelayedAlly.hand = [allyDelayedNullify];
    const humanDelayedPromise = judgePhase(humanDelayedOwner);
    await Promise.resolve();
    await Promise.resolve();
    const humanDelayedNullifyPrompt = state.pending?.prompt || "";
    const humanDelayedNullifyOwner = state.pending?.ownerId ?? null;
    const humanDelayedNullifyLabels = state.pending?.options?.map((option) => option.label) || [];
    choosePendingOption(0);
    await humanDelayedPromise;
    const humanDelayedLog = state.log.slice();

    const harvestResponder = makeScenarioPlayer(0, "zhugeliang", "忠臣", { isHuman: true });
    const harvestSource = makeScenarioPlayer(1, "liubei", "主公");
    const harvestSkipped = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([harvestResponder, harvestSource, harvestSkipped], { current: harvestSource.id, aiMode: "strategist" });
    const harvestNullify = createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "Q");
    const harvestTrick = createCard(CARD_POOL.find((spec) => spec.name === "五谷丰登"), "♥", "3");
    const harvestCards = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9")
    ];
    harvestResponder.hand = [harvestNullify];
    state.deck = harvestCards.slice();
    const harvestPromise = resolveHarvest(harvestSource, harvestTrick);
    await Promise.resolve();
    await Promise.resolve();
    const harvestFirstNullifyPrompt = state.pending?.prompt || "";
    const harvestFirstPassIndex = state.pending?.options?.findIndex((option) => option.value === null) ?? -1;
    choosePendingOption(harvestFirstPassIndex >= 0 ? harvestFirstPassIndex : 0);
    await Promise.resolve();
    await Promise.resolve();
    const harvestSecondNullifyPrompt = state.pending?.prompt || "";
    const harvestSecondNullifyLabels = state.pending?.options?.map((option) => option.label) || [];
    choosePendingOption(0);
    await Promise.resolve();
    await Promise.resolve();
    const harvestHumanChoicePrompt = state.pending?.prompt || "";
    choosePendingOption(0);
    await harvestPromise;
    const harvestNullifyLog = state.log.slice();
    const harvestDiscardAfter = state.discard.slice();

    const arrowsResponder = makeScenarioPlayer(0, "zhugeliang", "忠臣", { isHuman: true, hp: 4 });
    const arrowsSource = makeScenarioPlayer(1, "machao", "反贼", { hp: 4 });
    const arrowsFirstTarget = makeScenarioPlayer(2, "caocao", "主公", { hp: 4 });
    setupScenarioState([arrowsResponder, arrowsSource, arrowsFirstTarget], { current: arrowsSource.id, aiMode: "strategist" });
    const arrowsNullify = createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "K");
    const arrowsTrick = createCard(CARD_POOL.find((spec) => spec.name === "万箭齐发"), "♥", "A");
    arrowsResponder.hand = [arrowsNullify];
    arrowsFirstTarget.hand = [];
    const arrowsPromise = applyCardEffect(arrowsSource, arrowsTrick, [], arrowsTrick);
    await Promise.resolve();
    await Promise.resolve();
    const arrowsFirstNullifyPrompt = state.pending?.prompt || "";
    const arrowsFirstPassIndex = state.pending?.options?.findIndex((option) => option.value === null) ?? -1;
    choosePendingOption(arrowsFirstPassIndex >= 0 ? arrowsFirstPassIndex : 0);
    await Promise.resolve();
    await Promise.resolve();
    const arrowsSecondNullifyPrompt = state.pending?.prompt || "";
    const arrowsSecondNullifyLabels = state.pending?.options?.map((option) => option.label) || [];
    choosePendingOption(0);
    await arrowsPromise;
    const arrowsNullifyLog = state.log.slice();
    const arrowsDiscardAfter = state.discard.slice();

    const taoyuanResponder = makeScenarioPlayer(0, "zhugeliang", "忠臣", { isHuman: true, hp: 2 });
    const taoyuanSource = makeScenarioPlayer(1, "liubei", "主公", { hp: 2 });
    const taoyuanSkipped = makeScenarioPlayer(2, "zhangfei", "反贼", { hp: 2 });
    setupScenarioState([taoyuanResponder, taoyuanSource, taoyuanSkipped], { current: taoyuanSource.id, aiMode: "strategist" });
    const taoyuanNullify = createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "Q");
    const taoyuanTrick = createCard(CARD_POOL.find((spec) => spec.name === "桃园结义"), "♥", "A");
    taoyuanResponder.hand = [taoyuanNullify];
    const taoyuanPromise = applyCardEffect(taoyuanSource, taoyuanTrick, [], taoyuanTrick);
    await Promise.resolve();
    await Promise.resolve();
    const taoyuanFirstNullifyPrompt = state.pending?.prompt || "";
    const taoyuanFirstPassIndex = state.pending?.options?.findIndex((option) => option.value === null) ?? -1;
    choosePendingOption(taoyuanFirstPassIndex >= 0 ? taoyuanFirstPassIndex : 0);
    await Promise.resolve();
    await Promise.resolve();
    const taoyuanSecondNullifyPrompt = state.pending?.prompt || "";
    const taoyuanSecondNullifyLabels = state.pending?.options?.map((option) => option.label) || [];
    choosePendingOption(0);
    await taoyuanPromise;
    const taoyuanNullifyLog = state.log.slice();
    const taoyuanDiscardAfter = state.discard.slice();

    const barbariansResponder = makeScenarioPlayer(0, "zhugeliang", "忠臣", { isHuman: true, hp: 4 });
    const barbariansSource = makeScenarioPlayer(1, "machao", "反贼", { hp: 4 });
    const barbariansFirstTarget = makeScenarioPlayer(2, "caocao", "主公", { hp: 4 });
    setupScenarioState([barbariansResponder, barbariansSource, barbariansFirstTarget], { current: barbariansSource.id, aiMode: "strategist" });
    const barbariansNullify = createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "K");
    const barbariansTrick = createCard(CARD_POOL.find((spec) => spec.name === "南蛮入侵"), "♠", "7");
    barbariansResponder.hand = [barbariansNullify];
    barbariansFirstTarget.hand = [];
    const barbariansPromise = applyCardEffect(barbariansSource, barbariansTrick, [], barbariansTrick);
    await Promise.resolve();
    await Promise.resolve();
    const barbariansFirstNullifyPrompt = state.pending?.prompt || "";
    const barbariansFirstPassIndex = state.pending?.options?.findIndex((option) => option.value === null) ?? -1;
    choosePendingOption(barbariansFirstPassIndex >= 0 ? barbariansFirstPassIndex : 0);
    await Promise.resolve();
    await Promise.resolve();
    const barbariansSecondNullifyPrompt = state.pending?.prompt || "";
    const barbariansSecondNullifyLabels = state.pending?.options?.map((option) => option.label) || [];
    choosePendingOption(0);
    await barbariansPromise;
    const barbariansNullifyLog = state.log.slice();
    const barbariansDiscardAfter = state.discard.slice();

    const fanjianSource = makeScenarioPlayer(0, "zhouyu", "忠臣");
    const fanjianTarget = makeScenarioPlayer(1, "zhangfei", "反贼", { isHuman: true, hp: 4 });
    setupScenarioState([fanjianSource, fanjianTarget], { current: fanjianSource.id, aiMode: "strategist" });
    const fanjianCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    fanjianSource.hand = [fanjianCard];
    fanjianSource.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    const fanjianTargets = legalTargets(fanjianSource, { type: "skill", skill: "fanjian", label: "反间", needsTarget: true, targetMode: "any" });
    const fanjianPromise = executeSkill(fanjianSource, { type: "skill", skill: "fanjian", label: "反间", needsTarget: true, targetMode: "any", targets: [fanjianTarget] });
    await Promise.resolve();
    const fanjianPrompt = state.pending?.prompt || "";
    const fanjianGuessLabels = (state.pending?.options || []).map((option) => option.label);
    const fanjianWrongSuitIndex = Math.max(0, fanjianGuessLabels.findIndex((label) => label === "♥"));
    choosePendingOption(fanjianWrongSuitIndex);
    await fanjianPromise;
    const fanjianLog = state.log.slice();

    const tiejiRedSource = makeScenarioPlayer(0, "machao", "反贼");
    const tiejiRedTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([tiejiRedSource, tiejiRedTarget], { current: tiejiRedSource.id, aiMode: "strategist" });
    const tiejiRedSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    const tiejiRedDodge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    tiejiRedSource.hand = [tiejiRedSlash];
    tiejiRedTarget.hand = [tiejiRedDodge];
    tiejiRedSource.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    state.deck = [createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "2")];
    await executeMove(tiejiRedSource, {
      type: "card",
      card: tiejiRedSlash,
      consumeId: tiejiRedSlash.id,
      label: "杀",
      needsTarget: true,
      targets: [tiejiRedTarget],
      targetMode: "enemy",
      effect: "slash",
      score: 2
    });
    const tiejiRedLog = state.log.slice();

    const tiejiBlackSource = makeScenarioPlayer(0, "machao", "反贼");
    const tiejiBlackTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([tiejiBlackSource, tiejiBlackTarget], { current: tiejiBlackSource.id, aiMode: "strategist" });
    const tiejiBlackSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8");
    const tiejiBlackDodge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9");
    tiejiBlackSource.hand = [tiejiBlackSlash];
    tiejiBlackTarget.hand = [tiejiBlackDodge];
    tiejiBlackSource.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    state.deck = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "2")];
    await executeMove(tiejiBlackSource, {
      type: "card",
      card: tiejiBlackSlash,
      consumeId: tiejiBlackSlash.id,
      label: "杀",
      needsTarget: true,
      targets: [tiejiBlackTarget],
      targetMode: "enemy",
      effect: "slash",
      score: 2
    });
    const tiejiBlackLog = state.log.slice();

    const tiejiHumanSource = makeScenarioPlayer(0, "machao", "反贼", { isHuman: true });
    const tiejiHumanTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([tiejiHumanSource, tiejiHumanTarget], { current: tiejiHumanSource.id, aiMode: "strategist" });
    const tiejiHumanSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9");
    const tiejiHumanDodge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "10");
    const tiejiHumanJudge = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "3");
    tiejiHumanTarget.hand = [tiejiHumanDodge];
    state.deck = [tiejiHumanJudge];
    const tiejiHumanPromise = resolveSlash(tiejiHumanSource, tiejiHumanTarget, tiejiHumanSlash, tiejiHumanSlash);
    await Promise.resolve();
    const tiejiHumanPrompt = state.pending?.prompt || "";
    choosePendingOption(1);
    await tiejiHumanPromise;
    const tiejiHumanLog = state.log.slice();
    const tiejiHumanDeckTopStayed = state.deck[0]?.id;

    const liuliHumanSource = makeScenarioPlayer(0, "caocao", "主公");
    const liuliHumanDaqiao = makeScenarioPlayer(1, "daqiao", "反贼", { isHuman: true, hp: 3 });
    const liuliHumanRedirect = makeScenarioPlayer(2, "zhangfei", "忠臣", { hp: 4 });
    setupScenarioState([liuliHumanSource, liuliHumanDaqiao, liuliHumanRedirect], { current: liuliHumanSource.id, aiMode: "strategist" });
    const liuliHumanSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    const liuliHumanHandCost = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "5");
    const liuliHumanEquipCost = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♠", "2");
    liuliHumanDaqiao.hand = [liuliHumanHandCost];
    liuliHumanDaqiao.equip.armor = liuliHumanEquipCost;
    const liuliHumanPromise = maybeLiuli(liuliHumanSource, liuliHumanDaqiao, liuliHumanSlash, liuliHumanSlash, new Set());
    await Promise.resolve();
    const liuliHumanAskPrompt = state.pending?.prompt || "";
    choosePendingOption(0);
    await Promise.resolve();
    const liuliHumanTargetPrompt = state.targetPick?.prompt || "";
    const liuliHumanValidIds = [...(state.targetPick?.validIds || [])];
    handlePlayerClick(liuliHumanRedirect.id);
    await Promise.resolve();
    await Promise.resolve();
    const liuliHumanCostPrompt = state.pending?.prompt || "";
    const liuliHumanCostLabels = (state.pending?.options || []).map((option) => option.label);
    const liuliEquipCostIndex = state.pending?.options?.findIndex((option) => option.label.includes("装备") && option.label.includes("八卦阵")) ?? -1;
    if (liuliEquipCostIndex >= 0) choosePendingOption(liuliEquipCostIndex);
    const liuliHumanNewTarget = await liuliHumanPromise;
    const liuliHumanLog = state.log.slice();
    const liuliHumanEquipDiscarded = state.discard.some((card) => card.id === liuliHumanEquipCost.id);

    const liegongHighSource = makeScenarioPlayer(0, "huangzhong", "反贼", { hp: 3 });
    const liegongHighTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([liegongHighSource, liegongHighTarget], { current: liegongHighSource.id, aiMode: "strategist" });
    const liegongHighSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    const liegongHighDodge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    liegongHighTarget.hand = [
      liegongHighDodge,
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "10")
    ];
    await resolveSlash(liegongHighSource, liegongHighTarget, liegongHighSlash, liegongHighSlash);
    const liegongHighLog = state.log.slice();

    const liegongLowSource = makeScenarioPlayer(0, "huangzhong", "反贼", { hp: 4 });
    const liegongLowTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([liegongLowSource, liegongLowTarget], { current: liegongLowSource.id, aiMode: "strategist" });
    const liegongLowSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8");
    const liegongLowDodge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9");
    liegongLowTarget.hand = [liegongLowDodge];
    await resolveSlash(liegongLowSource, liegongLowTarget, liegongLowSlash, liegongLowSlash);
    const liegongLowLog = state.log.slice();

    const liegongHumanSource = makeScenarioPlayer(0, "huangzhong", "反贼", { isHuman: true, hp: 4 });
    const liegongHumanTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([liegongHumanSource, liegongHumanTarget], { current: liegongHumanSource.id, aiMode: "strategist" });
    const liegongHumanSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9");
    const liegongHumanDodge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "10");
    liegongHumanTarget.hand = [liegongHumanDodge];
    const liegongHumanPromise = resolveSlash(liegongHumanSource, liegongHumanTarget, liegongHumanSlash, liegongHumanSlash);
    await Promise.resolve();
    const liegongHumanPrompt = state.pending?.prompt || "";
    choosePendingOption(1);
    await liegongHumanPromise;
    const liegongHumanLog = state.log.slice();

    const selfNullifyTarget = makeScenarioPlayer(0, "caocao", "主公", { hp: 4 });
    const selfNullifySource = makeScenarioPlayer(1, "zhangliao", "反贼", { hp: 4 });
    setupScenarioState([selfNullifyTarget, selfNullifySource], { current: selfNullifySource.id, aiMode: "strategist" });
    const selfNullifyCard = createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "Q");
    const selfNullifyProtectedCard = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7");
    const selfNullifyDismantle = createCard(CARD_POOL.find((spec) => spec.name === "过河拆桥"), "♠", "Q");
    selfNullifyTarget.hand = [selfNullifyCard, selfNullifyProtectedCard];
    selfNullifySource.hand = [selfNullifyDismantle];
    selfNullifySource.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    await executeMove(selfNullifySource, {
      type: "card",
      card: selfNullifyDismantle,
      consumeId: selfNullifyDismantle.id,
      label: "过河拆桥",
      needsTarget: true,
      targets: [selfNullifyTarget],
      targetMode: "hasCards",
      effect: "dismantle",
      score: 2
    });
    const selfNullifyLog = state.log.slice();

    const weakNullifyResponder = makeScenarioPlayer(0, "wolongzhugeliang", "忠臣", { hp: 3 });
    const weakNullifyTarget = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false, hp: 3 });
    const weakNullifySource = makeScenarioPlayer(2, "zhangfei", "反贼", { revealed: true, hp: 4 });
    setupScenarioState([weakNullifyResponder, weakNullifyTarget, weakNullifySource], { current: weakNullifySource.id, aiMode: "strategist" });
    const weakNullifyCard = createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "K");
    const weakNullifyTrick = createCard(CARD_POOL.find((spec) => spec.name === "过河拆桥"), "♠", "Q");
    weakNullifyResponder.hand = [weakNullifyCard];
    const weakUnknownNullifyBlocked = !aiShouldNullify(weakNullifyResponder, weakNullifySource, weakNullifyTarget, weakNullifyTrick, false);

    const humanYiji = makeScenarioPlayer(0, "guojia", "忠臣", { isHuman: true, hp: 2 });
    const humanYijiAlly = makeScenarioPlayer(1, "caocao", "主公");
    const humanYijiEnemy = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([humanYiji, humanYijiAlly, humanYijiEnemy], { current: humanYiji.id });
    const humanYijiOldCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "5");
    const humanYijiDrawA = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7");
    const humanYijiDrawB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    humanYiji.hand = [humanYijiOldCard, humanYijiDrawA, humanYijiDrawB];
    const humanYijiPromise = maybeDistributeYijiCards(humanYiji, [humanYijiDrawA, humanYijiDrawB]);
    await Promise.resolve();
    const humanYijiAskPrompt = state.pending?.prompt || "";
    choosePendingOption(0);
    await Promise.resolve();
    const humanYijiPickPrompt = state.cardPick?.prompt || "";
    const humanYijiPickOnlyDrawn = Boolean(state.cardPick?.filter(humanYijiDrawA)) && !state.cardPick?.filter(humanYijiOldCard);
    const humanYijiPicked = resolveCurrentCardPick([humanYijiDrawA.id]);
    await Promise.resolve();
    const humanYijiTargetPrompt = state.targetPick?.prompt || "";
    handlePlayerClick(humanYijiAlly.id);
    await Promise.resolve();
    const humanYijiContinuePrompt = state.pending?.prompt || "";
    choosePendingOption(1);
    await humanYijiPromise;
    const humanYijiLog = state.log.slice();

    const guhuoActor = makeScenarioPlayer(0, "yuji", "反贼", { isHuman: true, hp: 2 });
    const guhuoWeaponTarget = makeScenarioPlayer(1, "caocao", "主公");
    const guhuoVictim = makeScenarioPlayer(2, "liubei", "忠臣");
    setupScenarioState([guhuoActor, guhuoWeaponTarget, guhuoVictim], { current: guhuoActor.id });
    const guhuoRawWuzhong = createCard(CARD_POOL.find((spec) => spec.name === "无中生有"), "♥", "7");
    guhuoActor.hand = [guhuoRawWuzhong];
    guhuoActor.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    guhuoWeaponTarget.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    const guhuoActionLabels = buildPlayableActions(guhuoActor)
      .filter((action) => action.virtualSkill === "guhuo")
      .map((action) => action.label);
    const guhuoDodgeOptions = responseOptions(guhuoActor, "dodge", {}).map((option) => option.label);
    const guhuoNullifyOptions = responseOptions(guhuoActor, "nullify", { source: guhuoWeaponTarget, target: guhuoActor, card: guhuoRawWuzhong }).map((option) => option.label);

    const guhuoTrueHeartSource = makeScenarioPlayer(0, "yuji", "反贼");
    const guhuoTrueHeartDoubter = makeScenarioPlayer(1, "caocao", "主公", { isHuman: true, hp: 4 });
    setupScenarioState([guhuoTrueHeartSource, guhuoTrueHeartDoubter], { current: guhuoTrueHeartSource.id });
    const guhuoTrueHeartRaw = createCard(CARD_POOL.find((spec) => spec.name === "无中生有"), "♥", "7");
    const guhuoTrueHeartDrawA = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "2");
    const guhuoTrueHeartDrawB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "3");
    guhuoTrueHeartSource.hand = [guhuoTrueHeartRaw];
    guhuoTrueHeartSource.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    state.deck = [guhuoTrueHeartDrawA, guhuoTrueHeartDrawB];
    const guhuoTrueHeartPromise = executeMove(guhuoTrueHeartSource, {
      type: "card",
      card: guhuoVirtualCard(guhuoTrueHeartRaw, CARD_POOL.find((spec) => spec.name === "无中生有")),
      consumeId: guhuoTrueHeartRaw.id,
      label: "蛊惑：无中生有",
      needsTarget: false,
      targets: [],
      effect: "draw2",
      virtualSkill: "guhuo",
      score: 2
    });
    await Promise.resolve();
    const guhuoTrueHeartPrompt = state.pending?.prompt || "";
    choosePendingOption(0);
    await guhuoTrueHeartPromise;
    const guhuoTrueHeartLog = state.log.slice();
    const guhuoTrueHeartContinued = guhuoTrueHeartPrompt.includes("是否质疑") &&
      guhuoTrueHeartDoubter.hp === 3 &&
      guhuoTrueHeartSource.hand.some((card) => card.id === guhuoTrueHeartDrawA.id) &&
      guhuoTrueHeartSource.hand.some((card) => card.id === guhuoTrueHeartDrawB.id);

    const guhuoFalseSource = makeScenarioPlayer(0, "yuji", "反贼");
    const guhuoFalseDoubter = makeScenarioPlayer(1, "caocao", "主公", { isHuman: true, hp: 4 });
    setupScenarioState([guhuoFalseSource, guhuoFalseDoubter], { current: guhuoFalseSource.id });
    const guhuoFalseRaw = createCard(CARD_POOL.find((spec) => spec.name === "南蛮入侵"), "♠", "7");
    const guhuoFalseDoubterDraw = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4");
    const guhuoFalseWouldDraw = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "5");
    guhuoFalseSource.hand = [guhuoFalseRaw];
    guhuoFalseSource.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    state.deck = [guhuoFalseDoubterDraw, guhuoFalseWouldDraw];
    const guhuoFalsePromise = executeMove(guhuoFalseSource, {
      type: "card",
      card: guhuoVirtualCard(guhuoFalseRaw, CARD_POOL.find((spec) => spec.name === "无中生有")),
      consumeId: guhuoFalseRaw.id,
      label: "蛊惑：无中生有",
      needsTarget: false,
      targets: [],
      effect: "draw2",
      virtualSkill: "guhuo",
      score: 2
    });
    await Promise.resolve();
    choosePendingOption(0);
    await guhuoFalsePromise;
    const guhuoFalseLog = state.log.slice();
    const guhuoFalseFizzled = guhuoFalseDoubter.hand.some((card) => card.id === guhuoFalseDoubterDraw.id) &&
      !guhuoFalseSource.hand.some((card) => card.id === guhuoFalseWouldDraw.id) &&
      state.discard.some((card) => card.id === guhuoFalseRaw.id);

    const guhuoTrueBlackSource = makeScenarioPlayer(0, "yuji", "反贼");
    const guhuoTrueBlackDoubter = makeScenarioPlayer(1, "caocao", "主公", { isHuman: true, hp: 4 });
    setupScenarioState([guhuoTrueBlackSource, guhuoTrueBlackDoubter], { current: guhuoTrueBlackSource.id });
    const guhuoTrueBlackRaw = createCard(CARD_POOL.find((spec) => spec.name === "无中生有"), "♠", "7");
    const guhuoTrueBlackWouldDraw = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "6");
    guhuoTrueBlackSource.hand = [guhuoTrueBlackRaw];
    guhuoTrueBlackSource.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    state.deck = [guhuoTrueBlackWouldDraw];
    const guhuoTrueBlackPromise = executeMove(guhuoTrueBlackSource, {
      type: "card",
      card: guhuoVirtualCard(guhuoTrueBlackRaw, CARD_POOL.find((spec) => spec.name === "无中生有")),
      consumeId: guhuoTrueBlackRaw.id,
      label: "蛊惑：无中生有",
      needsTarget: false,
      targets: [],
      effect: "draw2",
      virtualSkill: "guhuo",
      score: 2
    });
    await Promise.resolve();
    choosePendingOption(0);
    await guhuoTrueBlackPromise;
    const guhuoTrueBlackLog = state.log.slice();
    const guhuoTrueBlackFizzled = guhuoTrueBlackDoubter.hp === 3 &&
      !guhuoTrueBlackSource.hand.some((card) => card.id === guhuoTrueBlackWouldDraw.id) &&
      state.discard.some((card) => card.id === guhuoTrueBlackRaw.id);

    const guicaiOwner = makeScenarioPlayer(0, "caocao", "主公");
    const simayi = makeScenarioPlayer(1, "simayi", "忠臣");
    setupScenarioState([guicaiOwner, simayi], { current: 0 });
    const badLebuJudge = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    const heartRewrite = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "2");
    const lianyingDraw = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "8");
    state.deck = [badLebuJudge, lianyingDraw];
    simayi.hand = [heartRewrite];
    simayi.extraSkills = ["lianying"];
    const guicaiJudge = await judgeCard(guicaiOwner, "乐不思蜀");
    const guicaiLog = state.log.slice();

    const guidaoOwner = makeScenarioPlayer(0, "caocao", "主公");
    const zhangjiao = makeScenarioPlayer(1, "zhangjiao", "反贼");
    setupScenarioState([guidaoOwner, zhangjiao], { current: 0 });
    const goodLebuJudge = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "3");
    const blackRewrite = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "9");
    state.deck = [goodLebuJudge];
    zhangjiao.hand = [blackRewrite];
    const guidaoJudge = await judgeCard(guidaoOwner, "乐不思蜀");
    const guidaoLog = state.log.slice();

    const luoshenOwner = makeScenarioPlayer(0, "zhenji", "主公");
    const luoshenSimayi = makeScenarioPlayer(1, "simayi", "忠臣");
    setupScenarioState([luoshenOwner, luoshenSimayi], { current: 0 });
    const redLuoshenJudge = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "3");
    const blackLuoshenRewrite = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "7");
    const redLuoshenStop = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "2");
    state.deck = [redLuoshenJudge, redLuoshenStop];
    luoshenSimayi.hand = [blackLuoshenRewrite];
    await performLuoshen(luoshenOwner);
    const luoshenLog = state.log.slice();
    const luoshenStoppedOnRed = state.discard.some((card) => card.id === redLuoshenStop.id);

    const leijiOwner = makeScenarioPlayer(0, "zhangjiao", "反贼");
    const leijiTarget = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([leijiOwner, leijiTarget], { current: 0 });
    const redLeijiJudge = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4");
    const spadeLeijiRewrite = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9");
    state.deck = [redLeijiJudge];
    leijiOwner.hand = [spadeLeijiRewrite];
    await triggerLeiji(leijiOwner, leijiTarget);
    const leijiLog = state.log.slice();
    const leijiRewriteCardDiscarded = state.discard.some((card) => card.id === spadeLeijiRewrite.id);

    const humanLeijiOwner = makeScenarioPlayer(0, "zhangjiao", "反贼", { isHuman: true });
    const humanLeijiSource = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    const humanLeijiChosenTarget = makeScenarioPlayer(2, "liubei", "忠臣", { hp: 4 });
    setupScenarioState([humanLeijiOwner, humanLeijiSource, humanLeijiChosenTarget], { current: humanLeijiOwner.id });
    const humanLeijiTargetDodge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    humanLeijiChosenTarget.hand = [humanLeijiTargetDodge];
    state.deck = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7")];
    const humanLeijiPromise = triggerLeiji(humanLeijiOwner, humanLeijiSource);
    await Promise.resolve();
    const humanLeijiAskPrompt = state.pending?.prompt || "";
    choosePendingOption(0);
    await Promise.resolve();
    const humanLeijiTargetPrompt = state.targetPick?.prompt || "";
    handlePlayerClick(humanLeijiChosenTarget.id);
    await humanLeijiPromise;
    const humanLeijiLog = state.log.slice();

    const leijiClubOwner = makeScenarioPlayer(0, "zhangjiao", "反贼", { hp: 2 });
    const leijiClubTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([leijiClubOwner, leijiClubTarget], { current: leijiClubOwner.id });
    state.deck = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "7")];
    await triggerLeiji(leijiClubOwner, leijiClubTarget);
    const leijiClubLog = state.log.slice();

    const leijiChainOwner = makeScenarioPlayer(0, "zhangjiao", "反贼");
    const leijiChainTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    const leijiChainBystander = makeScenarioPlayer(2, "liubei", "忠臣", { hp: 4 });
    setupScenarioState([leijiChainOwner, leijiChainTarget, leijiChainBystander], { current: leijiChainOwner.id });
    leijiChainTarget.linked = true;
    leijiChainBystander.linked = true;
    state.deck = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7")];
    await triggerLeiji(leijiChainOwner, leijiChainTarget);
    const leijiChainLog = state.log.slice();

    const dismantler = makeScenarioPlayer(0, "ganning", "反贼");
    const farA = makeScenarioPlayer(1, "liubei", "主公");
    const farTarget = makeScenarioPlayer(2, "zhaoyun", "忠臣");
    const farB = makeScenarioPlayer(3, "zhangfei", "忠臣");
    const farC = makeScenarioPlayer(4, "machao", "忠臣");
    setupScenarioState([dismantler, farA, farTarget, farB, farC], { current: 0 });
    farTarget.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "5")
    ];
    const armor = createCard(CARD_POOL.find((spec) => spec.name === "白银狮子"), "♣", "A");
    farTarget.equip.armor = armor;
    farTarget.judgeArea = [createCard(CARD_POOL.find((spec) => spec.name === "乐不思蜀"), "♠", "6")];
    const dismantleCard = createCard(CARD_POOL.find((spec) => spec.name === "过河拆桥"), "♠", "Q");
    const stealCard = createCard(CARD_POOL.find((spec) => spec.name === "顺手牵羊"), "♠", "3");
    const targetOptionsBefore = targetCardOptions(farTarget);
    const targetOptionLabelsBefore = targetOptionsBefore.map((option) => option.label);
    const targetOptionTipsBefore = targetOptionsBefore.map((option) => ({
      label: option.label,
      zone: option.zone,
      dismantleTip: targetCardOptionTip(option, "dismantle"),
      stealTip: targetCardOptionTip(option, "steal")
    }));
    const dismantleTargets = legalTargets(dismantler, { needsTarget: true, targetMode: "hasCards", effect: "dismantle", card: dismantleCard });
    const stealTargets = legalTargets(dismantler, { needsTarget: true, targetMode: "hasCards", effect: "steal", card: stealCard });
    const removedByDismantle = await resolveDismantleCard(dismantler, farTarget, "过河拆桥");
    const handOnlyTarget = makeScenarioPlayer(1, "liubei", "主公");
    setupScenarioState([dismantler, handOnlyTarget], { current: 0 });
    handOnlyTarget.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "8")
    ];
    const stolenHand = await resolveStealCard(dismantler, handOnlyTarget, "顺手牵羊");

    const humanDismantler = makeScenarioPlayer(0, "ganning", "反贼", { isHuman: true });
    const humanDismantleTarget = makeScenarioPlayer(1, "liubei", "主公");
    setupScenarioState([humanDismantler, humanDismantleTarget], { current: 0 });
    const humanDismantleHandA = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7");
    const humanDismantleHandB = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "8");
    const humanDismantleArmor = createCard(CARD_POOL.find((spec) => spec.name === "白银狮子"), "♣", "A");
    humanDismantleTarget.hand = [humanDismantleHandA, humanDismantleHandB];
    humanDismantleTarget.equip.armor = humanDismantleArmor;
    humanDismantleTarget.judgeArea = [createCard(CARD_POOL.find((spec) => spec.name === "乐不思蜀"), "♠", "6")];
    const humanDismantlePromise = resolveDismantleCard(humanDismantler, humanDismantleTarget, "过河拆桥");
    await Promise.resolve();
    const humanDismantlePendingKind = state.status.waitKind;
    const humanDismantlePendingLabels = (state.pending?.options || []).map((option) => option.label);
    const humanDismantleArmorIndex = humanDismantlePendingLabels.findIndex((label) => label.includes("白银狮子"));
    choosePendingOption(humanDismantleArmorIndex);
    const humanDismantled = await humanDismantlePromise;

    const humanStealer = makeScenarioPlayer(0, "ganning", "反贼", { isHuman: true });
    const humanStealTarget = makeScenarioPlayer(1, "liubei", "主公");
    setupScenarioState([humanStealer, humanStealTarget], { current: 0 });
    const humanStealHandA = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9");
    const humanStealHandB = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "9");
    humanStealTarget.hand = [humanStealHandA, humanStealHandB];
    const humanStealPromise = resolveStealCard(humanStealer, humanStealTarget, "顺手牵羊");
    await Promise.resolve();
    const humanStealPendingKind = state.status.waitKind;
    const humanStealPendingLabels = (state.pending?.options || []).map((option) => option.label);
    const humanStealSecondHandIndex = humanStealPendingLabels.findIndex((label) => label === "手牌 2");
    choosePendingOption(humanStealSecondHandIndex);
    const humanStolen = await humanStealPromise;

    const humanFankui = makeScenarioPlayer(0, "simayi", "忠臣", { isHuman: true, hp: 3 });
    const humanFankuiSource = makeScenarioPlayer(1, "caocao", "反贼");
    setupScenarioState([humanFankui, humanFankuiSource], { current: humanFankuiSource.id, aiMode: "oracle" });
    const humanFankuiHandA = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7");
    const humanFankuiHandB = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "8");
    const humanFankuiArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♠", "2");
    humanFankuiSource.hand = [humanFankuiHandA, humanFankuiHandB];
    humanFankuiSource.equip.armor = humanFankuiArmor;
    humanFankuiSource.judgeArea = [createCard(CARD_POOL.find((spec) => spec.name === "乐不思蜀"), "♠", "6")];
    const humanFankuiPromise = damage(humanFankuiSource, humanFankui, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    await Promise.resolve();
    const humanFankuiAskKind = state.status.waitKind;
    const humanFankuiAskLabels = (state.pending?.options || []).map((option) => option.label);
    choosePendingOption(0);
    await Promise.resolve();
    await Promise.resolve();
    const humanFankuiChoiceKind = state.status.waitKind;
    const humanFankuiChoiceLabels = (state.pending?.options || []).map((option) => option.label);
    const humanFankuiArmorIndex = humanFankuiChoiceLabels.findIndex((label) => label.includes("八卦阵"));
    choosePendingOption(humanFankuiArmorIndex);
    await humanFankuiPromise;
    const humanFankuiLog = state.log.slice();

    const aiFankui = makeScenarioPlayer(0, "simayi", "忠臣", { hp: 3 });
    const aiFankuiSource = makeScenarioPlayer(1, "caocao", "反贼");
    setupScenarioState([aiFankui, aiFankuiSource], { current: aiFankuiSource.id, aiMode: "oracle" });
    const aiFankuiHiddenHand = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9");
    const aiFankuiArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♠", "2");
    aiFankuiSource.hand = [aiFankuiHiddenHand];
    aiFankuiSource.equip.armor = aiFankuiArmor;
    await damage(aiFankuiSource, aiFankui, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const aiFankuiLog = state.log.slice();

    const fankuiLianying = makeScenarioPlayer(0, "simayi", "忠臣", { hp: 3 });
    const fankuiLianyingSource = makeScenarioPlayer(1, "luxun", "反贼");
    setupScenarioState([fankuiLianying, fankuiLianyingSource], { current: fankuiLianyingSource.id, aiMode: "oracle" });
    const fankuiLastHand = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "6");
    const fankuiLianyingDraw = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9");
    fankuiLianyingSource.hand = [fankuiLastHand];
    state.deck = [fankuiLianyingDraw];
    await damage(fankuiLianyingSource, fankuiLianying, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const fankuiLianyingLog = state.log.slice();

    const beigeSelf = makeScenarioPlayer(0, "caiwenji", "忠臣", { hp: 1 });
    const beigeSource = makeScenarioPlayer(1, "zhangfei", "反贼");
    setupScenarioState([beigeSelf, beigeSource], { current: beigeSource.id, aiMode: "oracle" });
    const beigeCost = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "5");
    const beigeJudgeHeart = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "2");
    const beigeSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    beigeSelf.hand = [beigeCost];
    state.deck = [beigeJudgeHeart];
    await damage(beigeSource, beigeSelf, 1, DAMAGE.NORMAL, beigeSlash);
    const beigeSelfLog = state.log.slice();

    const beigeDiamondSinger = makeScenarioPlayer(0, "caiwenji", "忠臣");
    const beigeDiamondDamaged = makeScenarioPlayer(1, "liubei", "主公", { hp: 3 });
    const beigeDiamondSource = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([beigeDiamondSinger, beigeDiamondDamaged, beigeDiamondSource], { current: beigeDiamondSource.id, aiMode: "oracle" });
    const beigeDiamondCost = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "6");
    const beigeDiamondJudge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    const beigeDiamondDrawA = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "6");
    const beigeDiamondDrawB = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8");
    beigeDiamondSinger.hand = [beigeDiamondCost];
    state.deck = [beigeDiamondJudge, beigeDiamondDrawA, beigeDiamondDrawB];
    await damage(beigeDiamondSource, beigeDiamondDamaged, 1, DAMAGE.NORMAL, beigeSlash);
    const beigeDiamondLog = state.log.slice();

    const beigeSpadeSinger = makeScenarioPlayer(0, "caiwenji", "忠臣");
    const beigeSpadeDamaged = makeScenarioPlayer(1, "liubei", "主公", { hp: 3 });
    const beigeSpadeSource = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([beigeSpadeSinger, beigeSpadeDamaged, beigeSpadeSource], { current: beigeSpadeSource.id, aiMode: "oracle" });
    const beigeSpadeCost = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "7");
    const beigeSpadeJudge = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9");
    beigeSpadeSinger.hand = [beigeSpadeCost];
    state.deck = [beigeSpadeJudge];
    await damage(beigeSpadeSource, beigeSpadeDamaged, 1, DAMAGE.NORMAL, beigeSlash);
    const beigeSpadeLog = state.log.slice();

    const guzhengHolder = makeScenarioPlayer(0, "zhangzhaozhanghong", "忠臣");
    const guzhengDiscarder = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([guzhengHolder, guzhengDiscarder], { current: guzhengDiscarder.id, aiMode: "oracle" });
    const guzhengReturn = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4");
    const guzhengGain = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "7");
    guzhengDiscarder.hand = [guzhengReturn, guzhengGain];
    const guzhengDiscarded = await discardFromHand(guzhengDiscarder, [guzhengReturn.id, guzhengGain.id], "弃牌阶段");
    await triggerGuzheng(guzhengDiscarder, guzhengDiscarded);
    const guzhengLog = state.log.slice();
    const guzhengRemovedCardsFromDiscard = !state.discard.some((card) => card.id === guzhengReturn.id || card.id === guzhengGain.id);

    const tianxiangOwner = makeScenarioPlayer(0, "xiaoqiao", "忠臣", { hp: 2 });
    const tianxiangSource = makeScenarioPlayer(1, "caocao", "主公");
    const tianxiangTarget = makeScenarioPlayer(2, "zhangfei", "反贼", { hp: 2 });
    setupScenarioState([tianxiangOwner, tianxiangSource, tianxiangTarget], { current: tianxiangSource.id, aiMode: "oracle" });
    const tianxiangCost = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "Q");
    const tianxiangSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    const tianxiangDrawA = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "3");
    const tianxiangDrawB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "4");
    const tianxiangDrawC = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "5");
    tianxiangOwner.hand = [tianxiangCost];
    state.deck = [tianxiangDrawA, tianxiangDrawB, tianxiangDrawC];
    await damage(tianxiangSource, tianxiangOwner, 1, DAMAGE.NORMAL, tianxiangSlash);
    const tianxiangLog = state.log.slice();

    const fankuiHolder = makeScenarioPlayer(0, "simayi", "忠臣");
    const lianyingTarget = makeScenarioPlayer(1, "luxun", "反贼");
    setupScenarioState([fankuiHolder, lianyingTarget], { current: 0 });
    const lastHand = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "6");
    const lianyingTop = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9");
    lianyingTarget.hand = [lastHand];
    state.deck = [lianyingTop];
    const stolenByRandomTool = await stealRandomCard(fankuiHolder, lianyingTarget, "反馈");
    const randomToolLog = state.log.slice();

    const humanLieren = makeScenarioPlayer(0, "zhurong", "反贼", { isHuman: true });
    const humanLierenTarget = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([humanLieren, humanLierenTarget], { current: humanLieren.id });
    const humanLierenSourceCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "K");
    const humanLierenTargetCard = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "2");
    const humanLierenArmor = createCard(CARD_POOL.find((spec) => spec.name === "白银狮子"), "♣", "A");
    humanLieren.hand = [humanLierenSourceCard];
    humanLierenTarget.hand = [humanLierenTargetCard];
    humanLierenTarget.equip.armor = humanLierenArmor;
    const humanLierenPromise = maybeLieren(humanLieren, humanLierenTarget);
    await Promise.resolve();
    const humanLierenAskKind = state.status.waitKind;
    const humanLierenAskPrompt = state.pending?.prompt || "";
    choosePendingOption(0);
    await Promise.resolve();
    const humanLierenPindianPrompt = state.cardPick?.prompt || "";
    const humanLierenPickedPindian = resolveCurrentCardPick([humanLierenSourceCard.id]);
    await Promise.resolve();
    await Promise.resolve();
    const humanLierenChoiceKind = state.status.waitKind;
    const humanLierenChoiceLabels = (state.pending?.options || []).map((option) => option.label);
    const humanLierenArmorIndex = humanLierenChoiceLabels.findIndex((label) => label.includes("白银狮子"));
    choosePendingOption(humanLierenArmorIndex);
    await humanLierenPromise;
    const humanLierenLog = state.log.slice();

    const aiLieren = makeScenarioPlayer(0, "zhurong", "反贼");
    const aiLierenTarget = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([aiLieren, aiLierenTarget], { current: aiLieren.id });
    const aiLierenSourceCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "K");
    const aiLierenTargetCardA = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "2");
    const aiLierenTargetCardB = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "3");
    const aiLierenArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♠", "2");
    aiLieren.hand = [aiLierenSourceCard];
    aiLierenTarget.hand = [aiLierenTargetCardA, aiLierenTargetCardB];
    aiLierenTarget.equip.armor = aiLierenArmor;
    await maybeLieren(aiLieren, aiLierenTarget);
    const aiLierenLog = state.log.slice();

    const discardLianying = makeScenarioPlayer(0, "luxun", "反贼");
    setupScenarioState([discardLianying, makeScenarioPlayer(1, "caocao", "主公")], { current: 0 });
    const discardLastHand = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "5");
    const discardLianyingDraw = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "10");
    discardLianying.hand = [discardLastHand];
    state.deck = [discardLianyingDraw];
    const discardedLastHand = await discardFromHand(discardLianying, [discardLastHand.id], "测试弃牌");
    const discardFromHandLog = state.log.slice();

    const discardTargetHandActor = makeScenarioPlayer(0, "ganning", "反贼");
    const discardTargetHandTarget = makeScenarioPlayer(1, "liubei", "主公");
    setupScenarioState([discardTargetHandActor, discardTargetHandTarget], { current: 0 });
    const discardedTargetHand = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9");
    discardTargetHandTarget.hand = [discardedTargetHand];
    await discardRandomFromTarget(discardTargetHandActor, discardTargetHandTarget, "测试拆牌");
    const discardTargetHandLog = state.log.slice();

    const nonHandLianyingActor = makeScenarioPlayer(0, "ganning", "反贼");
    const nonHandLianyingTarget = makeScenarioPlayer(1, "luxun", "忠臣");
    setupScenarioState([nonHandLianyingActor, nonHandLianyingTarget], { current: 0 });
    const nonHandLianyingArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♠", "2");
    const nonHandLianyingDraw = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "J");
    nonHandLianyingTarget.hand = [];
    nonHandLianyingTarget.equip.armor = nonHandLianyingArmor;
    state.deck = [nonHandLianyingDraw];
    const removedNonHandLianying = await discardRandomFromTarget(nonHandLianyingActor, nonHandLianyingTarget, "过河拆桥");
    const nonHandLianyingLog = state.log.slice();

    const tuntianActor = makeScenarioPlayer(0, "ganning", "反贼");
    const tuntianTarget = makeScenarioPlayer(1, "dengai", "忠臣");
    setupScenarioState([tuntianActor, tuntianTarget], { current: 0 });
    const tuntianArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♠", "2");
    const tuntianJudge = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "7");
    tuntianTarget.hand = [];
    tuntianTarget.equip.armor = tuntianArmor;
    state.deck = [tuntianJudge];
    const removedTuntianEquip = await discardRandomFromTarget(tuntianActor, tuntianTarget, "过河拆桥");
    const tuntianEquipLog = state.log.slice();

    const qiaobianMover = makeScenarioPlayer(0, "zhanghe", "反贼");
    const qiaobianDengai = makeScenarioPlayer(1, "dengai", "忠臣");
    const qiaobianReceiver = makeScenarioPlayer(2, "liubei", "反贼");
    setupScenarioState([qiaobianMover, qiaobianDengai, qiaobianReceiver], { current: qiaobianMover.id });
    const qiaobianArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♠", "2");
    const qiaobianJudge = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "8");
    qiaobianDengai.hand = [];
    qiaobianDengai.equip.armor = qiaobianArmor;
    state.deck = [qiaobianJudge];
    await moveFieldCard(qiaobianDengai, { zone: "equip", slot: "armor", card: qiaobianArmor }, qiaobianReceiver, "巧变");
    const qiaobianMoveLog = state.log.slice();

    const borrowSource = makeScenarioPlayer(0, "ganning", "反贼");
    const borrowDengai = makeScenarioPlayer(1, "dengai", "忠臣");
    const borrowVictim = makeScenarioPlayer(2, "liubei", "反贼");
    setupScenarioState([borrowSource, borrowDengai, borrowVictim], { current: borrowSource.id });
    const borrowWeapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    const borrowCard = createCard(CARD_POOL.find((spec) => spec.name === "借刀杀人"), "♣", "Q");
    const borrowJudge = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "9");
    borrowDengai.hand = [];
    borrowDengai.equip.weapon = borrowWeapon;
    state.deck = [borrowJudge];
    await resolveBorrowSword(borrowSource, borrowDengai, borrowVictim, borrowCard);
    const borrowSwordLog = state.log.slice();

    const qilinSource = makeScenarioPlayer(0, "machao", "反贼");
    const qilinDengai = makeScenarioPlayer(1, "dengai", "忠臣");
    const qilinLord = makeScenarioPlayer(2, "caocao", "主公");
    setupScenarioState([qilinSource, qilinDengai, qilinLord], { current: qilinSource.id });
    const qilinWeapon = createCard(CARD_POOL.find((spec) => spec.name === "麒麟弓"), "♥", "5");
    const qilinHorse = createCard(CARD_POOL.find((spec) => spec.name === "+1马"), "♣", "5");
    const qilinJudge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♣", "2");
    qilinSource.equip.weapon = qilinWeapon;
    qilinDengai.equip.plusHorse = qilinHorse;
    qilinDengai.hand = [];
    state.deck = [qilinJudge];
    await maybeQilin(qilinSource, qilinDengai);
    const qilinLog = state.log.slice();
    const horseDisplayTooltip = cardTooltipText(qilinHorse);

    const qinggangNormalSource = makeScenarioPlayer(0, "machao", "反贼");
    const qinggangNormalTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([qinggangNormalSource, qinggangNormalTarget], { current: qinggangNormalSource.id });
    qinggangNormalSource.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    qinggangNormalTarget.equip.armor = createCard(CARD_POOL.find((spec) => spec.name === "藤甲"), "♣", "2");
    qinggangNormalTarget.hand = [];
    const qinggangNormalSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    await resolveSlash(qinggangNormalSource, qinggangNormalTarget, qinggangNormalSlash, qinggangNormalSlash);
    const qinggangNormalLog = state.log.slice();

    const qinggangFireSource = makeScenarioPlayer(0, "machao", "反贼");
    const qinggangFireTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([qinggangFireSource, qinggangFireTarget], { current: qinggangFireSource.id });
    qinggangFireSource.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    qinggangFireTarget.equip.armor = createCard(CARD_POOL.find((spec) => spec.name === "藤甲"), "♣", "2");
    qinggangFireTarget.hand = [];
    const qinggangFireSlash = createCard(CARD_POOL.find((spec) => spec.name === "火杀"), "♥", "3");
    await resolveSlash(qinggangFireSource, qinggangFireTarget, qinggangFireSlash, qinggangFireSlash);
    const qinggangFireLog = state.log.slice();

    const hanbingSource = makeScenarioPlayer(0, "machao", "反贼");
    const hanbingTarget = makeScenarioPlayer(1, "liubei", "主公", { hp: 4 });
    setupScenarioState([hanbingSource, hanbingTarget], { current: hanbingSource.id });
    const hanbingWeapon = createCard(CARD_POOL.find((spec) => spec.name === "寒冰剑"), "♠", "2");
    const hanbingArmor = createCard(CARD_POOL.find((spec) => spec.name === "白银狮子"), "♣", "A");
    const hanbingHorse = createCard(CARD_POOL.find((spec) => spec.name === "+1马"), "♣", "5");
    hanbingSource.equip.weapon = hanbingWeapon;
    hanbingSource.personality.caution = 0;
    hanbingTarget.equip.armor = hanbingArmor;
    hanbingTarget.equip.plusHorse = hanbingHorse;
    hanbingTarget.hand = [];
    const hanbingSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    const hanbingTooltip = cardTooltipText(hanbingWeapon);
    await resolveSlash(hanbingSource, hanbingTarget, hanbingSlash, hanbingSlash);
    const hanbingLog = state.log.slice();
    const hanbingPreventsDamageAndDiscardsTwo = hanbingTarget.hp === 4
      && !hanbingTarget.equip.armor
      && !hanbingTarget.equip.plusHorse
      && state.discard.some((card) => card.id === hanbingArmor.id)
      && state.discard.some((card) => card.id === hanbingHorse.id);
    const hanbingLogsExactDiscardedCards = hanbingLog.some((entry) => entry.includes("马超 发动寒冰剑") && entry.includes("防止对 刘备 的 1 点伤害"))
      && hanbingLog.some((entry) => entry.includes("马超 因 寒冰剑 弃置 刘备 的装备区的 ♣A 白银狮子"))
      && hanbingLog.some((entry) => entry.includes("马超 因 寒冰剑 弃置 刘备 的装备区的 ♣5 的卢"));

    const hanbingLethalSource = makeScenarioPlayer(0, "machao", "反贼");
    const hanbingLethalTarget = makeScenarioPlayer(1, "zhangfei", "忠臣", { hp: 1 });
    const hanbingLethalLord = makeScenarioPlayer(2, "caocao", "主公");
    setupScenarioState([hanbingLethalSource, hanbingLethalTarget, hanbingLethalLord], { current: hanbingLethalSource.id });
    hanbingLethalSource.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "寒冰剑"), "♠", "2");
    hanbingLethalSource.personality.caution = 0;
    hanbingLethalTarget.equip.armor = createCard(CARD_POOL.find((spec) => spec.name === "白银狮子"), "♣", "A");
    hanbingLethalTarget.equip.plusHorse = createCard(CARD_POOL.find((spec) => spec.name === "+1马"), "♣", "5");
    hanbingLethalTarget.hand = [];
    const hanbingLethalSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8");
    await resolveSlash(hanbingLethalSource, hanbingLethalTarget, hanbingLethalSlash, hanbingLethalSlash);
    const hanbingLethalLog = state.log.slice();
    const hanbingDoesNotReplaceLethalDamage = !hanbingLethalTarget.alive
      && hanbingLethalLog.some((entry) => entry.includes("马超 对 张飞 造成 1 点普通伤害"))
      && !hanbingLethalLog.some((entry) => entry.includes("发动寒冰剑"));

    const wineDodgeSource = makeScenarioPlayer(0, "zhangfei", "反贼");
    const wineDodgeTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4, isHuman: true });
    setupScenarioState([wineDodgeSource, wineDodgeTarget], { current: wineDodgeSource.id });
    wineDodgeSource.drunk = true;
    wineDodgeSource.turn = { usedSkills: {} };
    const wineDodgeCard = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "7");
    wineDodgeTarget.hand = [wineDodgeCard];
    const wineDodgeSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8");
    const wineDodgePromise = resolveSlash(wineDodgeSource, wineDodgeTarget, wineDodgeSlash, wineDodgeSlash);
    await Promise.resolve();
    choosePendingOption(0);
    await wineDodgePromise;
    const wineDodgeLog = state.log.slice();

    const wineArmorSource = makeScenarioPlayer(0, "zhangfei", "反贼");
    const wineArmorTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([wineArmorSource, wineArmorTarget], { current: wineArmorSource.id });
    wineArmorSource.drunk = true;
    wineArmorSource.turn = { usedSkills: {} };
    wineArmorTarget.equip.armor = createCard(CARD_POOL.find((spec) => spec.name === "藤甲"), "♣", "2");
    wineArmorTarget.hand = [];
    const wineArmorSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9");
    await resolveSlash(wineArmorSource, wineArmorTarget, wineArmorSlash, wineArmorSlash);
    const wineArmorLog = state.log.slice();

    const wineHitSource = makeScenarioPlayer(0, "zhangfei", "反贼");
    const wineHitTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([wineHitSource, wineHitTarget], { current: wineHitSource.id });
    wineHitSource.drunk = true;
    wineHitSource.turn = { usedSkills: {} };
    wineHitTarget.hand = [];
    const wineHitSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "10");
    await resolveSlash(wineHitSource, wineHitTarget, wineHitSlash, wineHitSlash);
    const wineHitLog = state.log.slice();

    const jiuchiActiveDongzhuo = makeScenarioPlayer(0, "dongzhuo", "反贼", { hp: 8 });
    const jiuchiActiveLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([jiuchiActiveDongzhuo, jiuchiActiveLord], { current: jiuchiActiveDongzhuo.id });
    const jiuchiSpadeCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    jiuchiActiveDongzhuo.hand = [jiuchiSpadeCard];
    jiuchiActiveDongzhuo.turn = { usedSkills: {}, slashUsed: 0, usedWine: false, usedSlashThisTurn: false };
    const jiuchiActiveAction = buildPlayableActions(jiuchiActiveDongzhuo).find((action) => action.virtualSkill === "jiuchi" && action.effect === "wine") || null;
    if (jiuchiActiveAction) await executeMove(jiuchiActiveDongzhuo, { ...jiuchiActiveAction, targets: [], score: 2 });
    const jiuchiActiveLog = state.log.slice();
    const jiuchiActionsAfterWine = buildPlayableActions(jiuchiActiveDongzhuo).filter((action) => action.virtualSkill === "jiuchi" && action.effect === "wine");

    const jiuchiDyingDongzhuo = makeScenarioPlayer(0, "dongzhuo", "反贼", { hp: 0 });
    const jiuchiDyingLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([jiuchiDyingDongzhuo, jiuchiDyingLord], { current: jiuchiDyingLord.id });
    const jiuchiDyingSpade = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♠", "2");
    jiuchiDyingDongzhuo.hand = [jiuchiDyingSpade];
    const jiuchiDyingRescue = await askForPeach(jiuchiDyingDongzhuo, jiuchiDyingDongzhuo, jiuchiDyingLord);
    if (jiuchiDyingRescue?.amount) heal(jiuchiDyingDongzhuo, jiuchiDyingDongzhuo, jiuchiDyingRescue.amount);
    const jiuchiDyingLog = state.log.slice();

    const roulinAttackDongzhuo = makeScenarioPlayer(0, "dongzhuo", "反贼", { hp: 8 });
    const roulinFemaleTarget = makeScenarioPlayer(1, "diaochan", "主公", { hp: 3 });
    setupScenarioState([roulinAttackDongzhuo, roulinFemaleTarget], { current: roulinAttackDongzhuo.id });
    const roulinDodgeA = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    const roulinDodgeB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "9");
    roulinFemaleTarget.hand = [roulinDodgeA, roulinDodgeB];
    const roulinAttackSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8");
    await resolveSlash(roulinAttackDongzhuo, roulinFemaleTarget, roulinAttackSlash, roulinAttackSlash);
    const roulinAttackLog = state.log.slice();

    const roulinDefenseFemale = makeScenarioPlayer(0, "diaochan", "反贼", { hp: 3 });
    const roulinDefenseDongzhuo = makeScenarioPlayer(1, "dongzhuo", "主公", { hp: 8 });
    setupScenarioState([roulinDefenseFemale, roulinDefenseDongzhuo], { current: roulinDefenseFemale.id });
    const roulinDefenseDodgeA = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "10");
    const roulinDefenseDodgeB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "J");
    roulinDefenseDongzhuo.hand = [roulinDefenseDodgeA, roulinDefenseDodgeB];
    const roulinDefenseSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9");
    await resolveSlash(roulinDefenseFemale, roulinDefenseDongzhuo, roulinDefenseSlash, roulinDefenseSlash);
    const roulinDefenseLog = state.log.slice();

    const kuangguNearSource = makeScenarioPlayer(0, "weiyan", "反贼", { hp: 2 });
    const kuangguNearTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([kuangguNearSource, kuangguNearTarget], { current: kuangguNearSource.id });
    const kuangguNearCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "10");
    await damage(kuangguNearSource, kuangguNearTarget, 2, DAMAGE.NORMAL, kuangguNearCard);
    const kuangguNearLog = state.log.slice();

    const kuangguFarSource = makeScenarioPlayer(0, "weiyan", "反贼", { hp: 2 });
    const kuangguBystanderA = makeScenarioPlayer(1, "liubei", "忠臣", { hp: 4 });
    const kuangguFarTarget = makeScenarioPlayer(2, "caocao", "主公", { hp: 4 });
    const kuangguBystanderB = makeScenarioPlayer(3, "sunquan", "忠臣", { hp: 4 });
    setupScenarioState([kuangguFarSource, kuangguBystanderA, kuangguFarTarget, kuangguBystanderB], { current: kuangguFarSource.id });
    const kuangguFarCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9");
    const kuangguFarDistance = distance(kuangguFarSource, kuangguFarTarget);
    await damage(kuangguFarSource, kuangguFarTarget, 2, DAMAGE.NORMAL, kuangguFarCard);
    const kuangguFarLog = state.log.slice();

    const mengjinSource = makeScenarioPlayer(0, "pangde", "反贼");
    const mengjinTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([mengjinSource, mengjinTarget], { current: mengjinSource.id });
    const mengjinDodge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    const mengjinHiddenPeach = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9");
    const mengjinArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♣", "2");
    mengjinTarget.hand = [mengjinDodge, mengjinHiddenPeach];
    mengjinTarget.equip.armor = mengjinArmor;
    const mengjinSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9");
    await resolveSlash(mengjinSource, mengjinTarget, mengjinSlash, mengjinSlash);
    const mengjinLog = state.log.slice();
    const mengjinUsesConcreteDismantle = !mengjinTarget.equip.armor && state.discard.some((card) => card.id === mengjinArmor.id);
    const mengjinKeepsUnknownHandWhenVisibleEquipBetter = mengjinTarget.hand.some((card) => card.id === mengjinHiddenPeach.id);
    const mengjinLogShowsChosenEquip = mengjinLog.some((entry) => entry.includes("庞德 发动猛进"))
      && mengjinLog.some((entry) => entry.includes("庞德 因 猛进 弃置 曹操 的装备区的 ♣2 八卦阵"));

    const liuliSource = makeScenarioPlayer(0, "caocao", "主公");
    const liuliDengai = makeScenarioPlayer(1, "dengai", "反贼", { hp: 2 });
    const liuliTarget = makeScenarioPlayer(2, "zhaoyun", "忠臣");
    setupScenarioState([liuliSource, liuliDengai, liuliTarget], { current: liuliSource.id });
    const liuliHorse = createCard(CARD_POOL.find((spec) => spec.name === "+1马"), "♠", "5");
    const liuliJudge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♣", "2");
    const liuliSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    liuliDengai.extraSkills = ["liuli"];
    liuliDengai.hand = [];
    liuliDengai.equip.plusHorse = liuliHorse;
    state.deck = [liuliJudge];
    const liuliNewTarget = await maybeLiuli(liuliSource, liuliDengai, liuliSlash, liuliSlash, new Set());
    const liuliLog = state.log.slice();

    const zhijianSource = makeScenarioPlayer(0, "zhangzhaozhanghong", "反贼");
    const zhijianDengai = makeScenarioPlayer(1, "dengai", "忠臣");
    setupScenarioState([zhijianSource, zhijianDengai], { current: zhijianSource.id });
    const zhijianOldArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♠", "2");
    const zhijianNewArmor = createCard(CARD_POOL.find((spec) => spec.name === "白银狮子"), "♣", "A");
    const zhijianJudge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♣", "3");
    const zhijianDraw = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "4");
    zhijianSource.hand = [zhijianNewArmor];
    zhijianSource.turn = { usedSkills: {} };
    zhijianDengai.hand = [];
    zhijianDengai.equip.armor = zhijianOldArmor;
    state.deck = [zhijianJudge, zhijianDraw];
    await executeMove(zhijianSource, {
      type: "skill",
      skill: "zhijian",
      targets: [zhijianDengai],
      score: 2
    });
    const zhijianLog = state.log.slice();

    const lordLianying = makeScenarioPlayer(0, "luxun", "主公");
    const loyalVictim = makeScenarioPlayer(1, "liubei", "忠臣");
    setupScenarioState([lordLianying, loyalVictim, makeScenarioPlayer(2, "zhangfei", "反贼")], { current: lordLianying.id });
    const lordLastHand = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "5");
    const lordLianyingDraw = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "10");
    lordLianying.hand = [lordLastHand];
    state.deck = [lordLianyingDraw];
    await killPlayer(loyalVictim, lordLianying);
    const lordKillLoyalLog = state.log.slice();

    const buquSource = makeScenarioPlayer(0, "zhangfei", "反贼");
    const buquOwner = makeScenarioPlayer(1, "zhoutai", "忠臣", { hp: 1 });
    const buquLord = makeScenarioPlayer(2, "caocao", "主公");
    setupScenarioState([buquSource, buquOwner, buquLord], { current: buquSource.id });
    const buquFirst = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    const buquUnused = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    state.deck = [buquFirst, buquUnused];
    await damage(buquSource, buquOwner, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const buquSuccessLog = state.log.slice();
    const buquSuccessDeckRemaining = state.deck.length;

    const buquFailSource = makeScenarioPlayer(0, "zhangfei", "反贼");
    const buquFailOwner = makeScenarioPlayer(1, "zhoutai", "忠臣", { hp: 1 });
    const buquFailLord = makeScenarioPlayer(2, "caocao", "主公");
    setupScenarioState([buquFailSource, buquFailOwner, buquFailLord], { current: buquFailSource.id });
    const buquOld = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "7");
    const buquDuplicate = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "7");
    buquFailOwner.buquPile = [buquOld];
    state.deck = [buquDuplicate];
    await damage(buquFailSource, buquFailOwner, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const buquFailLog = state.log.slice();

    const shensuEarly = makeScenarioPlayer(0, "xiahouyuan", "反贼");
    const shensuEarlyLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([shensuEarly, shensuEarlyLord], { current: shensuEarly.id });
    const shensuLebu = createCard(CARD_POOL.find((spec) => spec.name === "乐不思蜀"), "♠", "6");
    const shensuDrawCard = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9");
    shensuEarly.judgeArea = [shensuLebu];
    shensuEarly.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    state.deck = [shensuDrawCard];
    const shensuEarlyUsed = await maybeShensuEarly(shensuEarly);
    const shensuEarlyLog = state.log.slice();
    const shensuEarlySkippedJudgeAndDraw = shensuEarly.judgeArea.some((card) => card.id === shensuLebu.id) && state.deck.some((card) => card.id === shensuDrawCard.id);

    const shensuPlay = makeScenarioPlayer(0, "xiahouyuan", "反贼");
    const shensuPlayLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([shensuPlay, shensuPlayLord], { current: shensuPlay.id });
    const shensuHorse = createCard(CARD_POOL.find((spec) => spec.name === "+1马"), "♣", "5");
    shensuPlay.equip.plusHorse = shensuHorse;
    shensuPlay.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    const shensuPlayUsed = await maybeShensuPlay(shensuPlay);
    const shensuPlayLog = state.log.slice();
    const shensuPlayPaidEquip = !shensuPlay.equip.plusHorse && state.discard.some((card) => card.id === shensuHorse.id);

    const shensuNoFree = makeScenarioPlayer(0, "xiahouyuan", "反贼");
    const shensuNoFreeLord = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([shensuNoFree, shensuNoFreeLord], { current: shensuNoFree.id });
    shensuNoFree.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    const shensuFreeActionExists = buildPlayableActions(shensuNoFree).some((action) => action.skill === "shensu");

    const jijiangLord = makeScenarioPlayer(0, "liubei", "主公");
    const jijiangProvider = makeScenarioPlayer(1, "zhangfei", "忠臣");
    const jijiangTarget = makeScenarioPlayer(2, "caocao", "反贼");
    setupScenarioState([jijiangLord, jijiangProvider, jijiangTarget], { current: jijiangLord.id });
    const jijiangSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    jijiangProvider.hand = [jijiangSlash];
    jijiangLord.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    state.reads[jijiangLord.id][jijiangTarget.id] = 1.8;
    state.readReasons[jijiangLord.id][jijiangTarget.id] = ["偏反 +1.8：曾明显进攻主公"];
    state.reads[jijiangProvider.id][jijiangTarget.id] = 1.5;
    state.readReasons[jijiangProvider.id][jijiangTarget.id] = ["偏反 +1.5：队友视角下的公开进攻行为"];
    await executeMove(jijiangLord, {
      type: "card",
      card: virtualCard({ id: "test-jijiang-active", suit: "", rank: "" }, "杀", "basic", "slash", DAMAGE.NORMAL),
      virtualSkill: "jijiang",
      label: "激将：杀",
      needsTarget: true,
      targets: [jijiangTarget],
      targetMode: "enemy",
      effect: "slash",
      score: 2
    });
    const jijiangActiveLog = state.log.slice();
    const jijiangActiveRealSlashLeftProvider = jijiangProvider.hand.length === 0 && (state.discard.some((card) => card.id === jijiangSlash.id) || jijiangTarget.hand.some((card) => card.id === jijiangSlash.id));
    const jijiangActiveJianxiongGotRealSlash = jijiangTarget.hand.some((card) => card.id === jijiangSlash.id);
    const jijiangActiveDamagedTarget = jijiangTarget.hp === jijiangTarget.maxHp - 1;
    const jijiangActiveCountsAsLordSlash = jijiangLord.turn.slashUsed === 1 && jijiangLord.turn.usedSlashThisTurn === true;

    const jijiangResponseLord = makeScenarioPlayer(0, "liubei", "主公");
    const jijiangResponseProvider = makeScenarioPlayer(1, "zhaoyun", "忠臣");
    const jijiangResponseSource = makeScenarioPlayer(2, "zhangliao", "反贼");
    setupScenarioState([jijiangResponseLord, jijiangResponseProvider, jijiangResponseSource], { current: jijiangResponseSource.id });
    const jijiangResponseSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "8");
    const jijiangResponseTrick = createCard(CARD_POOL.find((spec) => spec.name === "南蛮入侵"), "♠", "7");
    jijiangResponseProvider.hand = [jijiangResponseSlash];
    const jijiangResponseOk = await askForResponse(jijiangResponseLord, "slash", { source: jijiangResponseSource, card: jijiangResponseTrick, reason: "南蛮入侵" });
    const jijiangResponseLog = state.log.slice();
    const jijiangResponseUsedProviderSlash = jijiangResponseProvider.hand.length === 0 && state.discard.some((card) => card.id === jijiangResponseSlash.id);

    const hujiaLord = makeScenarioPlayer(0, "caocao", "主公");
    const hujiaProvider = makeScenarioPlayer(1, "xiahoudun", "忠臣");
    const hujiaSource = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([hujiaLord, hujiaProvider, hujiaSource], { current: hujiaSource.id });
    const hujiaDodge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "7");
    hujiaProvider.hand = [hujiaDodge];
    const hujiaResponseOk = await askForResponse(hujiaLord, "dodge", { source: hujiaSource, reason: "杀" });
    const hujiaLog = state.log.slice();

    const jiuyuanLord = makeScenarioPlayer(0, "sunquan", "主公", { hp: 0 });
    const jiuyuanProvider = makeScenarioPlayer(1, "zhouyu", "忠臣");
    const jiuyuanSource = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([jiuyuanLord, jiuyuanProvider, jiuyuanSource], { current: jiuyuanSource.id });
    const jiuyuanPeach = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4");
    jiuyuanLord.hp = 0;
    jiuyuanProvider.hand = [jiuyuanPeach];
    const jiuyuanSaved = await dying(jiuyuanLord, jiuyuanSource);
    const jiuyuanLog = state.log.slice();

    const jiuyuanNonWuLord = makeScenarioPlayer(0, "sunquan", "主公", { hp: 0 });
    const jiuyuanNonWuProvider = makeScenarioPlayer(1, "zhaoyun", "忠臣");
    const jiuyuanNonWuSource = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([jiuyuanNonWuLord, jiuyuanNonWuProvider, jiuyuanNonWuSource], { current: jiuyuanNonWuSource.id });
    const jiuyuanNonWuPeach = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "5");
    jiuyuanNonWuProvider.hand = [jiuyuanNonWuPeach];
    const jiuyuanNonWuSaved = await dying(jiuyuanNonWuLord, jiuyuanNonWuSource);
    const jiuyuanNonWuLog = state.log.slice();

    const jiuyuanSelfLord = makeScenarioPlayer(0, "sunquan", "主公", { hp: 0 });
    const jiuyuanSelfOther = makeScenarioPlayer(1, "zhouyu", "忠臣");
    const jiuyuanSelfSource = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([jiuyuanSelfLord, jiuyuanSelfOther, jiuyuanSelfSource], { current: jiuyuanSelfSource.id });
    const jiuyuanSelfPeach = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "6");
    jiuyuanSelfLord.hand = [jiuyuanSelfPeach];
    const jiuyuanSelfSaved = await dying(jiuyuanSelfLord, jiuyuanSelfSource);
    const jiuyuanSelfLog = state.log.slice();

    const wanshaJiaxu = makeScenarioPlayer(0, "jiaxu", "反贼");
    const wanshaTarget = makeScenarioPlayer(1, "daqiao", "忠臣", { hp: 0 });
    const wanshaBlockedSaver = makeScenarioPlayer(2, "liubei", "忠臣");
    setupScenarioState([wanshaJiaxu, wanshaTarget, wanshaBlockedSaver], { current: wanshaJiaxu.id });
    const wanshaBlockedPeach = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7");
    wanshaBlockedSaver.hand = [wanshaBlockedPeach];
    const wanshaBlockedSaved = await dying(wanshaTarget, wanshaJiaxu);
    const wanshaBlockedLog = state.log.slice();

    const wanshaCaster = makeScenarioPlayer(0, "jiaxu", "反贼");
    const wanshaCasterTarget = makeScenarioPlayer(1, "daqiao", "忠臣", { hp: 0 });
    const wanshaCasterOther = makeScenarioPlayer(2, "liubei", "忠臣");
    setupScenarioState([wanshaCaster, wanshaCasterTarget, wanshaCasterOther], { current: wanshaCaster.id });
    const wanshaCasterPeach = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "8");
    wanshaCaster.hand = [wanshaCasterPeach];
    const wanshaCasterSaved = await dying(wanshaCasterTarget, wanshaCaster);
    const wanshaCasterLog = state.log.slice();

    const wanshaSelfJiaxu = makeScenarioPlayer(0, "jiaxu", "反贼");
    const wanshaSelfTarget = makeScenarioPlayer(1, "daqiao", "忠臣", { hp: 0 });
    const wanshaSelfOther = makeScenarioPlayer(2, "liubei", "忠臣");
    setupScenarioState([wanshaSelfJiaxu, wanshaSelfTarget, wanshaSelfOther], { current: wanshaSelfJiaxu.id });
    const wanshaSelfPeach = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9");
    wanshaSelfTarget.hand = [wanshaSelfPeach];
    const wanshaSelfSaved = await dying(wanshaSelfTarget, wanshaSelfJiaxu);
    const wanshaSelfLog = state.log.slice();

    const ruoyuLord = makeScenarioPlayer(0, "liushan", "主公", { hp: 1 });
    const ruoyuProvider = makeScenarioPlayer(1, "zhaoyun", "忠臣");
    const ruoyuSource = makeScenarioPlayer(2, "zhangliao", "反贼");
    setupScenarioState([ruoyuLord, ruoyuProvider, ruoyuSource], { current: ruoyuLord.id });
    const ruoyuProviderSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "8");
    ruoyuProvider.hand = [ruoyuProviderSlash];
    await startPhase(ruoyuLord);
    const ruoyuAwakenLog = state.log.slice();
    const ruoyuResponseOk = await askForResponse(ruoyuLord, "slash", { source: ruoyuSource, card: createCard(CARD_POOL.find((spec) => spec.name === "南蛮入侵"), "♠", "7"), reason: "南蛮入侵" });
    const ruoyuResponseLog = state.log.slice();
    const ruoyuJijiangUsedProviderSlash = ruoyuProvider.hand.length === 0 && state.discard.some((card) => card.id === ruoyuProviderSlash.id);

    const zhijiWounded = makeScenarioPlayer(0, "jiangwei", "忠臣", { hp: 1 });
    setupScenarioState([zhijiWounded], { current: zhijiWounded.id });
    await startPhase(zhijiWounded);
    const zhijiWoundedLog = state.log.slice();

    const zhijiFull = makeScenarioPlayer(0, "jiangwei", "忠臣", { hp: 4 });
    setupScenarioState([zhijiFull], { current: zhijiFull.id });
    const zhijiDrawA = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9");
    const zhijiDrawB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "J");
    state.deck = [zhijiDrawA, zhijiDrawB];
    await startPhase(zhijiFull);
    const zhijiFullLog = state.log.slice();

    const xueyiLord = makeScenarioPlayer(0, "yuanshao", "主公", { hp: 3 });
    const xueyiQunA = makeScenarioPlayer(1, "lvbu", "忠臣");
    const xueyiQunB = makeScenarioPlayer(2, "diaochan", "反贼");
    const xueyiWei = makeScenarioPlayer(3, "caocao", "反贼");
    setupScenarioState([xueyiLord, xueyiQunA, xueyiQunB, xueyiWei], { current: xueyiLord.id });
    xueyiLord.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "3"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "4"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "5"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "6"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8")
    ];
    const xueyiLimit = handLimit(xueyiLord);
    await discardPhase(xueyiLord);
    const xueyiKeptAtLimit = xueyiLord.hand.length;
    const xueyiKeptAtLimitOk = xueyiKeptAtLimit === 7 && state.discard.length === 0;
    xueyiLord.hand.push(createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9"));
    await discardPhase(xueyiLord);
    const xueyiDiscardLog = state.log.slice();
    const xueyiDiscardedOnlyAboveLimitOk = xueyiLord.hand.length === 7 && state.discard.length === 1 && xueyiDiscardLog.filter((entry) => entry.includes("袁绍 因 弃牌阶段 弃置 1 张牌")).length === 1;

    const repeatLuanjiPlayer = makeScenarioPlayer(0, "yuanshao", "反贼");
    const repeatLuanjiLord = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([repeatLuanjiPlayer, repeatLuanjiLord], { current: repeatLuanjiPlayer.id });
    repeatLuanjiPlayer.turn = { usedSkills: { luanji: true }, slashUsed: 0 };
    repeatLuanjiPlayer.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♠", "3")
    ];
    const repeatLuanjiActionAvailable = buildPlayableActions(repeatLuanjiPlayer).some((move) => move.skill === "luanji");

    const fangquanScheduler = makeScenarioPlayer(0, "liushan", "忠臣");
    const fangquanOriginalNext = makeScenarioPlayer(1, "zhangfei", "反贼");
    const fangquanExtraTarget = makeScenarioPlayer(2, "machao", "忠臣");
    const fangquanTail = makeScenarioPlayer(3, "caocao", "主公");
    setupScenarioState([fangquanScheduler, fangquanOriginalNext, fangquanExtraTarget, fangquanTail], { current: fangquanScheduler.id });
    const fangquanQueued = scheduleExtraTurn(fangquanScheduler, fangquanExtraTarget);
    const fangquanExtraStep = advanceTurnAfterCompleted(fangquanScheduler.id);
    const fangquanExtraCurrent = state.current;
    const fangquanReturnToDuringExtra = state.currentExtraReturn?.returnTo;
    const fangquanReturnStep = advanceTurnAfterCompleted(fangquanExtraTarget.id);
    const fangquanAfterExtraCurrent = state.current;

    const luanwuJiaxu = makeScenarioPlayer(0, "jiaxu", "反贼", { hp: 3 });
    const luanwuResponder = makeScenarioPlayer(1, "zhaoyun", "忠臣", { hp: 4 });
    const luanwuLord = makeScenarioPlayer(2, "caocao", "主公", { hp: 4 });
    setupScenarioState([luanwuJiaxu, luanwuResponder, luanwuLord], { current: luanwuJiaxu.id, aiMode: "strategist" });
    luanwuJiaxu.turn = { usedSkills: {} };
    luanwuResponder.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7")];
    luanwuResponder.turn = { usedSkills: {}, slashUsed: 0 };
    state.reads[luanwuResponder.id][luanwuJiaxu.id] = 1.8;
    state.readReasons[luanwuResponder.id][luanwuJiaxu.id] = ["偏反 +1.8：贾诩此前对主公做出进攻行为"];
    await executeSkill(luanwuJiaxu, { type: "skill", skill: "luanwu", label: "乱武", needsTarget: false, score: 2 });
    const luanwuLog = state.log.slice();

    const qiceUser = makeScenarioPlayer(0, "xunyou", "反贼");
    const qiceLord = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([qiceUser, qiceLord], { current: qiceUser.id });
    const qiceCostA = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8");
    const qiceCostB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "J");
    qiceUser.hand = [qiceCostA, qiceCostB];
    qiceUser.turn = { slashUsed: 0, usedSkills: {} };
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "9")
    ];
    await executeMove(qiceUser, {
      type: "skill",
      skill: "qice",
      qiceEffect: "draw2",
      qiceName: "无中生有",
      card: virtualCard({ id: "qice-test", suit: "♣", rank: "" }, "无中生有", "trick", "draw2"),
      needsTarget: false,
      targets: [],
      score: 2
    });
    const qiceLog = state.log.slice();

    const baonueLord = makeScenarioPlayer(0, "dongzhuo", "主公", { hp: 3 });
    const baonueLoyalSource = makeScenarioPlayer(1, "yuji", "忠臣");
    const baonueVictim = makeScenarioPlayer(2, "zhaoyun", "反贼");
    setupScenarioState([baonueLord, baonueLoyalSource, baonueVictim], { current: baonueLoyalSource.id });
    state.deck = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "5")];
    await damage(baonueLoyalSource, baonueVictim, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const baonueLoyalLog = state.log.slice();

    const baonueEnemyLord = makeScenarioPlayer(0, "dongzhuo", "主公", { hp: 3 });
    const baonueRebelSource = makeScenarioPlayer(1, "yuji", "反贼");
    const baonueEnemyVictim = makeScenarioPlayer(2, "zhaoyun", "忠臣");
    setupScenarioState([baonueEnemyLord, baonueRebelSource, baonueEnemyVictim], { current: baonueRebelSource.id });
    state.deck = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "5")];
    await damage(baonueRebelSource, baonueEnemyVictim, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const baonueRebelLog = state.log.slice();

    const songweiLord = makeScenarioPlayer(0, "caopi", "主公");
    const songweiLoyalJudgeOwner = makeScenarioPlayer(1, "xiahoudun", "忠臣");
    setupScenarioState([songweiLord, songweiLoyalJudgeOwner], { current: songweiLoyalJudgeOwner.id });
    const songweiJudge = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "5");
    const songweiReward = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "7");
    state.deck = [songweiJudge, songweiReward];
    await judgeCard(songweiLoyalJudgeOwner, "测试判定");
    const songweiLoyalJudgeCardDiscarded = state.discard.some((card) => card.id === songweiJudge.id);
    const songweiLoyalLog = state.log.slice();

    const songweiEnemyLord = makeScenarioPlayer(0, "caopi", "主公");
    const songweiRebelJudgeOwner = makeScenarioPlayer(1, "xiahoudun", "反贼");
    setupScenarioState([songweiEnemyLord, songweiRebelJudgeOwner], { current: songweiRebelJudgeOwner.id });
    const songweiEnemyJudge = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "6");
    const songweiEnemyReward = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    state.deck = [songweiEnemyJudge, songweiEnemyReward];
    await judgeCard(songweiRebelJudgeOwner, "测试判定");
    const songweiRebelLog = state.log.slice();

    const zhibaLoseLord = makeScenarioPlayer(0, "sunce", "主公");
    const zhibaLoseSource = makeScenarioPlayer(1, "zhouyu", "忠臣");
    setupScenarioState([zhibaLoseLord, zhibaLoseSource], { current: zhibaLoseSource.id });
    const zhibaLoseLordCard = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "K");
    const zhibaLoseSourceCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "4");
    zhibaLoseLord.hand = [zhibaLoseLordCard];
    zhibaLoseSource.hand = [zhibaLoseSourceCard];
    zhibaLoseSource.turn = { usedSkills: {} };
    await executeMove(zhibaLoseSource, { type: "skill", skill: "zhiba", label: "制霸", needsTarget: false });
    const zhibaLoseLog = state.log.slice();

    const zhibaWinLord = makeScenarioPlayer(0, "sunce", "主公");
    const zhibaWinSource = makeScenarioPlayer(1, "zhouyu", "反贼");
    setupScenarioState([zhibaWinLord, zhibaWinSource], { current: zhibaWinSource.id });
    const zhibaWinLordCard = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "4");
    const zhibaWinSourceCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "K");
    zhibaWinLord.hand = [zhibaWinLordCard];
    zhibaWinSource.hand = [zhibaWinSourceCard];
    zhibaWinSource.turn = { usedSkills: {} };
    await executeMove(zhibaWinSource, { type: "skill", skill: "zhiba", label: "制霸", needsTarget: false });
    const zhibaWinLog = state.log.slice();
    const zhibaWinDiscardedPindianCards = state.discard.some((card) => card.id === zhibaWinLordCard.id) && state.discard.some((card) => card.id === zhibaWinSourceCard.id);

    const benghuaiHigh = makeScenarioPlayer(0, "dongzhuo", "主公", { hp: 5 });
    const benghuaiHighLowest = makeScenarioPlayer(1, "zhaoyun", "反贼", { hp: 1 });
    setupScenarioState([benghuaiHigh, benghuaiHighLowest], { current: benghuaiHigh.id });
    await endPhase(benghuaiHigh);
    const benghuaiHighLog = state.log.slice();

    const benghuaiLow = makeScenarioPlayer(0, "dongzhuo", "主公", { hp: 2 });
    const benghuaiLowLowest = makeScenarioPlayer(1, "zhaoyun", "反贼", { hp: 1 });
    setupScenarioState([benghuaiLow, benghuaiLowLowest], { current: benghuaiLow.id });
    await endPhase(benghuaiLow);
    const benghuaiLowLog = state.log.slice();

    const luoyiNoAttackUser = makeScenarioPlayer(0, "xuchu", "反贼");
    const luoyiNoAttackTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 1 });
    setupScenarioState([luoyiNoAttackUser, luoyiNoAttackTarget], { current: luoyiNoAttackUser.id, aiMode: "strategist" });
    luoyiNoAttackUser.turn = { usedSkills: {}, slashUsed: 0, usedSlashThisTurn: false, usedWine: false };
    luoyiNoAttackUser.hand = [createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8")];
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "5")
    ];
    await drawPhase(luoyiNoAttackUser);
    const luoyiNoAttackLog = state.log.slice();

    const luoyiSlashUser = makeScenarioPlayer(0, "xuchu", "反贼");
    const luoyiSlashTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([luoyiSlashUser, luoyiSlashTarget], { current: luoyiSlashUser.id, aiMode: "strategist" });
    luoyiSlashUser.turn = { usedSkills: {}, slashUsed: 0, usedSlashThisTurn: false, usedWine: false };
    const luoyiSlashCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    luoyiSlashUser.hand = [luoyiSlashCard];
    luoyiSlashTarget.hand = [];
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "6"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "7")
    ];
    await drawPhase(luoyiSlashUser);
    const luoyiSlashDrawLog = state.log.slice();
    await resolveSlash(luoyiSlashUser, luoyiSlashTarget, luoyiSlashCard, luoyiSlashCard);
    const luoyiSlashDamageLog = state.log.slice();

    const luoyiDuelUser = makeScenarioPlayer(0, "xuchu", "反贼");
    const luoyiDuelTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([luoyiDuelUser, luoyiDuelTarget], { current: luoyiDuelUser.id, aiMode: "strategist" });
    luoyiDuelUser.turn = { usedSkills: {}, slashUsed: 0, usedSlashThisTurn: false, usedWine: false };
    const luoyiDuelCard = createCard(CARD_POOL.find((spec) => spec.name === "决斗"), "♠", "A");
    luoyiDuelUser.hand = [luoyiDuelCard];
    luoyiDuelTarget.hand = [];
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "6"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "7")
    ];
    await drawPhase(luoyiDuelUser);
    const luoyiDuelDrawLog = state.log.slice();
    await resolveDuel(luoyiDuelUser, luoyiDuelTarget, luoyiDuelCard);
    const luoyiDuelDamageLog = state.log.slice();

    const jushouCaoren = makeScenarioPlayer(0, "caoren", "忠臣", { hp: 2 });
    const jushouEnemy = makeScenarioPlayer(1, "zhangfei", "反贼");
    setupScenarioState([jushouCaoren, jushouEnemy], { current: jushouCaoren.id });
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "3"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "5"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "6")
    ];
    await endPhase(jushouCaoren);
    const jushouEndLog = state.log.slice();
    const jushouHandAfterEnd = jushouCaoren.hand.length;
    const jushouDeckAfterEnd = state.deck.length;
    const jushouFlagAfterEnd = Boolean(jushouCaoren.flags.skipTurnOnce);
    state.log = [];
    await takeTurn(jushouCaoren);
    const jushouSkipLog = state.log.slice();
    const jushouHandAfterSkip = jushouCaoren.hand.length;
    const jushouDeckAfterSkip = state.deck.length;

    const fangzhuCaopi = makeScenarioPlayer(0, "caopi", "反贼", { hp: 1 });
    const fangzhuLord = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([fangzhuCaopi, fangzhuLord], { current: fangzhuCaopi.id, aiMode: "strategist" });
    fangzhuCaopi.personality.chaos = 0;
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "3"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "5")
    ];
    await maybeFangzhu(fangzhuCaopi);
    const fangzhuLog = state.log.slice();
    const fangzhuHandAfterFlip = fangzhuLord.hand.length;
    const fangzhuDeckAfterFlip = state.deck.length;
    const fangzhuFlagAfterFlip = Boolean(fangzhuLord.flags.skipTurnOnce);
    const fangzhuCardHtml = renderPlayer(fangzhuLord);
    state.log = [];
    await takeTurn(fangzhuLord);
    const fangzhuSkipLog = state.log.slice();
    const fangzhuHandAfterSkip = fangzhuLord.hand.length;
    const fangzhuDeckAfterSkip = state.deck.length;

    const kurouHuangGai = makeScenarioPlayer(0, "huanggai", "反贼", { hp: 4 });
    const kurouLord = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([kurouHuangGai, kurouLord], { current: kurouHuangGai.id });
    kurouHuangGai.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "3"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "5"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "6"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "7")
    ];
    const kurouAvailableBefore = buildPlayableActions(kurouHuangGai).some((action) => action.skill === "kurou");
    await executeSkill(kurouHuangGai, { type: "skill", skill: "kurou", label: "苦肉", needsTarget: false, score: 2 });
    const kurouAvailableAfterFirst = buildPlayableActions(kurouHuangGai).some((action) => action.skill === "kurou");
    await executeSkill(kurouHuangGai, { type: "skill", skill: "kurou", label: "苦肉", needsTarget: false, score: 2 });
    await executeSkill(kurouHuangGai, { type: "skill", skill: "kurou", label: "苦肉", needsTarget: false, score: 2 });
    const kurouAvailableAtOneHp = buildPlayableActions(kurouHuangGai).some((action) => action.skill === "kurou");
    const kurouLowHpScore = scoreMove(kurouHuangGai, { type: "skill", skill: "kurou", label: "苦肉", needsTarget: false, scoreHint: 1.1 });
    const kurouLog = state.log.slice();

    const kurouDyingHuangGai = makeScenarioPlayer(0, "huanggai", "反贼", { hp: 1 });
    const kurouDyingLord = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([kurouDyingHuangGai, kurouDyingLord], { current: kurouDyingHuangGai.id });
    const kurouSelfPeach = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7");
    const kurouDrawA = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8");
    const kurouDrawB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9");
    kurouDyingHuangGai.hand = [kurouSelfPeach];
    kurouDyingHuangGai.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    state.deck = [kurouDrawA, kurouDrawB];
    await executeSkill(kurouDyingHuangGai, { type: "skill", skill: "kurou", label: "苦肉", needsTarget: false, score: 2 });
    const kurouDyingLog = state.log.slice();

    const qiangxiOneHpDianwei = makeScenarioPlayer(0, "dianwei", "反贼", { hp: 1 });
    const qiangxiOneHpLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([qiangxiOneHpDianwei, qiangxiOneHpLord], { current: qiangxiOneHpDianwei.id });
    qiangxiOneHpDianwei.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    const qiangxiOneHpAction = { type: "skill", skill: "qiangxi", label: "强袭", needsTarget: true, targetMode: "inRangeEnemy", targets: [qiangxiOneHpLord], scoreHint: 1.3 };
    const qiangxiOneHpLegal = buildPlayableActions(qiangxiOneHpDianwei).some((action) => action.skill === "qiangxi");
    const qiangxiOneHpScore = scoreMove(qiangxiOneHpDianwei, qiangxiOneHpAction);

    const qiangxiHpDianwei = makeScenarioPlayer(0, "dianwei", "反贼", { isHuman: true, hp: 3 });
    const qiangxiHpLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([qiangxiHpDianwei, qiangxiHpLord], { current: qiangxiHpDianwei.id });
    const qiangxiHpWeapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    qiangxiHpDianwei.equip.weapon = qiangxiHpWeapon;
    qiangxiHpDianwei.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    const qiangxiHpPromise = executeSkill(qiangxiHpDianwei, { type: "skill", skill: "qiangxi", label: "强袭", needsTarget: true, targetMode: "inRangeEnemy", targets: [qiangxiHpLord], score: 2 });
    await Promise.resolve();
    const qiangxiHpPrompt = state.pending?.prompt || "";
    const qiangxiHpLabels = state.pending?.options?.map((option) => option.label) || [];
    const qiangxiHpChoice = state.pending?.options?.findIndex((option) => option.value === "hp") ?? -1;
    if (qiangxiHpChoice >= 0) choosePendingOption(qiangxiHpChoice);
    await qiangxiHpPromise;
    const qiangxiHpLog = state.log.slice();

    const qiangxiWeaponDianwei = makeScenarioPlayer(0, "dianwei", "反贼", { isHuman: true, hp: 3 });
    const qiangxiWeaponLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([qiangxiWeaponDianwei, qiangxiWeaponLord], { current: qiangxiWeaponDianwei.id });
    const qiangxiWeapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "7");
    qiangxiWeaponDianwei.equip.weapon = qiangxiWeapon;
    qiangxiWeaponDianwei.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    const qiangxiWeaponPromise = executeSkill(qiangxiWeaponDianwei, { type: "skill", skill: "qiangxi", label: "强袭", needsTarget: true, targetMode: "inRangeEnemy", targets: [qiangxiWeaponLord], score: 2 });
    await Promise.resolve();
    const qiangxiWeaponLabels = state.pending?.options?.map((option) => option.label) || [];
    const qiangxiWeaponChoice = state.pending?.options?.findIndex((option) => option.value === "weapon") ?? -1;
    if (qiangxiWeaponChoice >= 0) choosePendingOption(qiangxiWeaponChoice);
    await qiangxiWeaponPromise;
    const qiangxiWeaponLog = state.log.slice();
    const qiangxiWeaponDiscarded = state.discard.some((card) => card.id === qiangxiWeapon.id);

    const quhuHuman = makeScenarioPlayer(0, "xunyu", "忠臣", { isHuman: true });
    const quhuTiger = makeScenarioPlayer(1, "lvbu", "反贼", { hp: 4 });
    const quhuChosenVictim = makeScenarioPlayer(2, "zhangfei", "反贼", { hp: 4 });
    setupScenarioState([quhuHuman, quhuTiger, quhuChosenVictim], { current: quhuHuman.id, aiMode: "strategist" });
    const quhuSourceCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "K");
    const quhuTargetCard = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "2");
    quhuHuman.hand = [quhuSourceCard];
    quhuTiger.hand = [quhuTargetCard];
    quhuHuman.turn = { usedSkills: {} };
    const quhuPromise = executeSkill(quhuHuman, { type: "skill", skill: "quhu", label: "驱虎", needsTarget: true, targetMode: "higherHpAny", targets: [quhuTiger], score: 2 });
    for (let i = 0; i < 4 && !state.cardPick; i++) await Promise.resolve();
    const quhuPindianPrompt = state.cardPick?.prompt || "";
    const quhuPindianPicked = resolveCurrentCardPick([quhuSourceCard.id]);
    for (let i = 0; i < 4 && !state.targetPick; i++) await Promise.resolve();
    const quhuVictimPrompt = state.targetPick?.prompt || "";
    const quhuValidVictimNames = (state.targetPick?.validIds || []).map(playerById).filter(Boolean).map(nameOf);
    handlePlayerClick(quhuChosenVictim.id);
    await quhuPromise;
    const quhuLog = state.log.slice();

    const tianyiTaishi = makeScenarioPlayer(0, "taishici", "反贼", { hp: 4 });
    const tianyiNear = makeScenarioPlayer(1, "liubei", "忠臣", { hp: 4 });
    const tianyiFar = makeScenarioPlayer(2, "huanggai", "忠臣", { hp: 4 });
    const tianyiBystander = makeScenarioPlayer(3, "caocao", "主公", { hp: 4 });
    setupScenarioState([tianyiTaishi, tianyiNear, tianyiFar, tianyiBystander], { current: tianyiTaishi.id, mode: "5", aiMode: "strategist" });
    const tianyiSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    tianyiTaishi.hand = [tianyiSlash];
    tianyiTaishi.turn = { usedSkills: { tianyi: true }, tianyi: true, slashUsed: 0, usedSlashThisTurn: false, usedWine: false };
    tianyiNear.hand = [];
    tianyiFar.hand = [];
    const tianyiSlashAction = buildPlayableActions(tianyiTaishi).find((action) => action.effect === "slash") || null;
    const tianyiTargets = tianyiSlashAction ? legalTargets(tianyiTaishi, tianyiSlashAction) : [];
    const tianyiBounds = tianyiSlashAction ? targetBounds(tianyiSlashAction, tianyiTaishi) : { min: 0, max: 0 };
    const tianyiAIMultiTarget = buildAIMoves(tianyiTaishi).find((move) => move.effect === "slash" && move.targets?.length === 2) || null;
    await executeMove(tianyiTaishi, {
      type: "card",
      card: tianyiSlash,
      consumeId: tianyiSlash.id,
      label: "杀",
      needsTarget: true,
      targetMode: "tianyiSlash",
      effect: "slash",
      targets: [tianyiNear, tianyiFar],
      score: 2
    });
    const tianyiLog = state.log.slice();

    const shuangxiongUser = makeScenarioPlayer(0, "yanliangwenchou", "反贼");
    const shuangxiongTarget = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([shuangxiongUser, shuangxiongTarget], { current: shuangxiongUser.id, mode: "5", aiMode: "strategist" });
    const shuangxiongHand = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "9");
    const shuangxiongJudge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "7");
    const shuangxiongSkippedDrawA = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "8");
    const shuangxiongSkippedDrawB = createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♠", "9");
    shuangxiongUser.hand = [shuangxiongHand];
    state.deck = [shuangxiongJudge, shuangxiongSkippedDrawA, shuangxiongSkippedDrawB];
    await drawPhase(shuangxiongUser);
    const shuangxiongActions = buildPlayableActions(shuangxiongUser);
    const shuangxiongDuelAction = shuangxiongActions.find((action) => action.virtualSkill === "shuangxiong" && action.effect === "duel") || null;
    const shuangxiongLog = state.log.slice();

    const noMissSlashSource = makeScenarioPlayer(0, "zhangfei", "反贼");
    const noMissSlashTarget = makeScenarioPlayer(1, "zhaoyun", "忠臣", { hp: 4 });
    setupScenarioState([noMissSlashSource, noMissSlashTarget, makeScenarioPlayer(2, "caocao", "主公")], { current: noMissSlashSource.id });
    const noMissSlashCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    noMissSlashTarget.hand = [];
    await resolveSlash(noMissSlashSource, noMissSlashTarget, noMissSlashCard, noMissSlashCard);
    const noMissSlashLog = state.log.slice();

    const noMissMassSource = makeScenarioPlayer(0, "zhangfei", "反贼");
    const noMissMassLord = makeScenarioPlayer(1, "zhaoyun", "主公", { hp: 4 });
    setupScenarioState([noMissMassSource, noMissMassLord], { current: noMissMassSource.id });
    const noMissMassCard = createCard(CARD_POOL.find((spec) => spec.name === "南蛮入侵"), "♠", "7");
    noMissMassLord.hand = [];
    await applyCardEffect(noMissMassSource, noMissMassCard, [], noMissMassCard);
    const noMissMassLog = state.log.slice();

    const aiMassResponder = makeScenarioPlayer(0, "zhangfei", "反贼", { hp: 4 });
    const aiMassFriendlySource = makeScenarioPlayer(1, "machao", "反贼", { revealed: true, hp: 4 });
    setupScenarioState([aiMassResponder, aiMassFriendlySource], { current: aiMassFriendlySource.id, aiMode: "strategist" });
    const aiMassSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8");
    const aiMassNanman = createCard(CARD_POOL.find((spec) => spec.name === "南蛮入侵"), "♠", "7");
    aiMassResponder.hand = [aiMassSlash];
    const aiMassSlashResponseOk = await askForResponse(aiMassResponder, "slash", { source: aiMassFriendlySource, card: aiMassNanman, reason: "南蛮入侵" });
    const aiMassSlashLog = state.log.slice();
    const aiMassSlashConsumed = aiMassResponder.hand.length === 0 && state.discard.some((card) => card.id === aiMassSlash.id);

    const noMissTiaoxinSource = makeScenarioPlayer(0, "jiangwei", "忠臣", { hp: 3 });
    const noMissTiaoxinTarget = makeScenarioPlayer(1, "zhangfei", "反贼", { hp: 4 });
    setupScenarioState([noMissTiaoxinSource, noMissTiaoxinTarget], { current: noMissTiaoxinSource.id });
    noMissTiaoxinTarget.hand = [];
    await askForResponse(noMissTiaoxinTarget, "slash", { source: noMissTiaoxinSource, reason: "挑衅" });
    const noMissTiaoxinLog = state.log.slice();

    const juxiangSource = makeScenarioPlayer(0, "caocao", "主公", { hp: 4 });
    const juxiangZhurong = makeScenarioPlayer(1, "zhurong", "反贼", { hp: 4 });
    const juxiangOther = makeScenarioPlayer(2, "liubei", "忠臣", { hp: 4 });
    setupScenarioState([juxiangSource, juxiangZhurong, juxiangOther], { current: juxiangSource.id });
    const juxiangNanman = createCard(CARD_POOL.find((spec) => spec.name === "南蛮入侵"), "♠", "7");
    juxiangSource.hand = [juxiangNanman];
    juxiangZhurong.hand = [];
    juxiangOther.hand = [];
    juxiangSource.turn = { usedSkills: {}, slashUsed: 0, usedSlashThisTurn: false, usedWine: false };
    await executeMove(juxiangSource, { type: "card", card: juxiangNanman, consumeId: juxiangNanman.id, label: "南蛮入侵", needsTarget: false, targets: [], effect: "barbarians", score: 2 });
    const juxiangLog = state.log.slice();
    const juxiangNanmanNotDiscardedAfterGain = !state.discard.some((card) => card.id === juxiangNanman.id);

    const juxiangSelf = makeScenarioPlayer(0, "zhurong", "反贼", { hp: 4 });
    const juxiangSelfLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([juxiangSelf, juxiangSelfLord], { current: juxiangSelf.id });
    const juxiangSelfNanman = createCard(CARD_POOL.find((spec) => spec.name === "南蛮入侵"), "♣", "7");
    juxiangSelf.hand = [juxiangSelfNanman];
    juxiangSelfLord.hand = [];
    juxiangSelf.turn = { usedSkills: {}, slashUsed: 0, usedSlashThisTurn: false, usedWine: false };
    await executeMove(juxiangSelf, { type: "card", card: juxiangSelfNanman, consumeId: juxiangSelfNanman.id, label: "南蛮入侵", needsTarget: false, targets: [], effect: "barbarians", score: 2 });
    const juxiangSelfLog = state.log.slice();

    const deathRevealLord = makeScenarioPlayer(0, "caocao", "主公");
    const deathRevealKiller = makeScenarioPlayer(1, "guanyu", "忠臣");
    const deathRevealRebel = makeScenarioPlayer(2, "zhangfei", "反贼", { revealed: false });
    const deathRevealTraitor = makeScenarioPlayer(3, "simayi", "内奸", { revealed: false });
    setupScenarioState([deathRevealLord, deathRevealKiller, deathRevealRebel, deathRevealTraitor], { current: deathRevealKiller.id });
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "3"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8")
    ];
    await killPlayer(deathRevealRebel, deathRevealKiller);
    const deathRevealLog = state.log.slice();
    const deathRevealPublicToAll = deathRevealRebel.revealed && isRolePublicTo(deathRevealLord, deathRevealRebel) && isRolePublicTo(deathRevealTraitor, deathRevealRebel);
    const deathRevealLordRead = state.reads[deathRevealLord.id]?.[deathRevealRebel.id] || 0;
    const deathRevealTraitorRead = state.reads[deathRevealTraitor.id]?.[deathRevealRebel.id] || 0;
    const deathKillRebelRead = state.reads[deathRevealLord.id]?.[deathRevealKiller.id] || 0;

    const aoeReadLord = makeScenarioPlayer(0, "zhaoyun", "主公", { hp: 4 });
    const aoeReadActor = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false });
    const aoeReadObserver = makeScenarioPlayer(2, "liubei", "忠臣", { revealed: false, hp: 4 });
    setupScenarioState([aoeReadLord, aoeReadActor, aoeReadObserver], { current: aoeReadActor.id });
    const aoeCardA = createCard(CARD_POOL.find((spec) => spec.name === "南蛮入侵"), "♠", "7");
    const aoeCardB = createCard(CARD_POOL.find((spec) => spec.name === "万箭齐发"), "♥", "A");
    aoeReadActor.hand = [aoeCardA, aoeCardB];
    aoeReadLord.hand = [];
    aoeReadObserver.hand = [];
    await executeMove(aoeReadActor, { type: "card", card: aoeCardA, consumeId: aoeCardA.id, label: "南蛮入侵", needsTarget: false, targets: [], effect: "barbarians", score: 2 });
    await executeMove(aoeReadActor, { type: "card", card: aoeCardB, consumeId: aoeCardB.id, label: "万箭齐发", needsTarget: false, targets: [], effect: "arrows", score: 2 });
    const aoeRead = state.reads[aoeReadObserver.id]?.[aoeReadActor.id] || 0;
    const aoeReadReasons = state.readReasons[aoeReadObserver.id]?.[aoeReadActor.id] || [];

    const yuanshuLord = makeScenarioPlayer(0, "liubei", "主公");
    const yuanshu = makeScenarioPlayer(1, "yuanshu", "反贼");
    const yuanshuProvider = makeScenarioPlayer(2, "zhangfei", "忠臣");
    setupScenarioState([yuanshuLord, yuanshu, yuanshuProvider], { current: yuanshu.id });
    const yuanshuWeidiHasJijiang = hasSkill(yuanshu, "jijiang") && canUseJijiang(yuanshu);

    const yongsiDrawer = makeScenarioPlayer(0, "yuanshu", "反贼");
    const yongsiWei = makeScenarioPlayer(1, "caocao", "主公");
    const yongsiShu = makeScenarioPlayer(2, "liubei", "忠臣");
    const yongsiWu = makeScenarioPlayer(3, "sunquan", "内奸");
    setupScenarioState([yongsiDrawer, yongsiWei, yongsiShu, yongsiWu], { current: yongsiDrawer.id });
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "3"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "5"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "6"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "7")
    ];
    await drawPhase(yongsiDrawer);
    const yongsiDrawCount = yongsiDrawer.hand.length;
    const yongsiDiscarder = makeScenarioPlayer(0, "yuanshu", "反贼");
    const yongsiDiscardWei = makeScenarioPlayer(1, "caocao", "主公");
    const yongsiDiscardShu = makeScenarioPlayer(2, "liubei", "忠臣");
    const yongsiDiscardWu = makeScenarioPlayer(3, "sunquan", "内奸");
    setupScenarioState([yongsiDiscarder, yongsiDiscardWei, yongsiDiscardShu, yongsiDiscardWu], { current: yongsiDiscarder.id });
    yongsiDiscarder.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "3"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "5"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "6")
    ];
    await discardPhase(yongsiDiscarder);
    const yongsiDiscardLog = state.log.slice();

    const fazheng = makeScenarioPlayer(0, "fazheng", "忠臣", { hp: 3 });
    const enyuanSource = makeScenarioPlayer(1, "caocao", "反贼", { hp: 3 });
    setupScenarioState([fazheng, enyuanSource], { current: enyuanSource.id });
    await damage(enyuanSource, fazheng, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const enyuanPunishLog = state.log.slice();
    fazheng.hp = 2;
    state.deck = [createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9")];
    heal(enyuanSource, fazheng, 1);
    const enyuanHealDraw = enyuanSource.hand.length;

    const xuanhuoFazheng = makeScenarioPlayer(0, "fazheng", "反贼");
    const xuanhuoReceiver = makeScenarioPlayer(1, "caocao", "主公");
    const xuanhuoRecipient = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([xuanhuoFazheng, xuanhuoReceiver, xuanhuoRecipient], { current: xuanhuoFazheng.id });
    const xuanhuoHeart = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "8");
    const xuanhuoArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♣", "2");
    xuanhuoFazheng.hand = [xuanhuoHeart];
    xuanhuoReceiver.equip.armor = xuanhuoArmor;
    xuanhuoFazheng.turn = { usedSkills: {} };
    await executeSkill(xuanhuoFazheng, { type: "skill", skill: "xuanhuo", targets: [xuanhuoReceiver, xuanhuoRecipient], score: 2 });
    const xuanhuoLog = state.log.slice();

    const xushu = makeScenarioPlayer(0, "xushu", "反贼", { hp: 2 });
    const xushuTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([xushu, xushuTarget], { current: xushu.id });
    await applyCardEffect(xushu, virtualCard({ id: "wuyan-duel", suit: "♠", rank: "A" }, "决斗", "trick", "duel"), [xushuTarget], null);
    const wuyanSourceLog = state.log.slice();
    const wuyanSourceBlocked = xushuTarget.hp === 4 && wuyanSourceLog.some((entry) => entry.includes("无言") && entry.includes("无效"));

    const wuyanBorrowSource = makeScenarioPlayer(0, "ganning", "反贼");
    const wuyanBorrowXushu = makeScenarioPlayer(1, "xushu", "忠臣");
    const wuyanBorrowVictim = makeScenarioPlayer(2, "caocao", "主公");
    setupScenarioState([wuyanBorrowSource, wuyanBorrowXushu, wuyanBorrowVictim], { current: wuyanBorrowSource.id });
    const wuyanBorrowWeapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    wuyanBorrowXushu.equip.weapon = wuyanBorrowWeapon;
    await resolveBorrowSword(
      wuyanBorrowSource,
      wuyanBorrowXushu,
      wuyanBorrowVictim,
      virtualCard({ id: "wuyan-borrow", suit: "♣", rank: "Q" }, "借刀杀人", "trick", "borrowSword")
    );
    const wuyanBorrowLog = state.log.slice();

    const wuyanChainSource = makeScenarioPlayer(0, "ganning", "反贼");
    const wuyanChainXushu = makeScenarioPlayer(1, "xushu", "忠臣");
    setupScenarioState([wuyanChainSource, wuyanChainXushu], { current: wuyanChainSource.id });
    await applyCardEffect(wuyanChainSource, virtualCard({ id: "wuyan-chain", suit: "♣", rank: "Q" }, "铁索连环", "trick", "chain"), [wuyanChainXushu], null);
    const wuyanChainLog = state.log.slice();

    const wuyanTaoyuanSource = makeScenarioPlayer(0, "liubei", "主公", { hp: 3 });
    const wuyanTaoyuanXushu = makeScenarioPlayer(1, "xushu", "反贼", { hp: 1 });
    const wuyanTaoyuanOther = makeScenarioPlayer(2, "zhangfei", "忠臣", { hp: 1 });
    setupScenarioState([wuyanTaoyuanSource, wuyanTaoyuanXushu, wuyanTaoyuanOther], { current: wuyanTaoyuanSource.id });
    await applyCardEffect(wuyanTaoyuanSource, virtualCard({ id: "wuyan-taoyuan", suit: "♥", rank: "A" }, "桃园结义", "trick", "taoyuan"), [], null);
    const wuyanTaoyuanLog = state.log.slice();

    const wuyanHarvestSource = makeScenarioPlayer(0, "liubei", "主公");
    const wuyanHarvestXushu = makeScenarioPlayer(1, "xushu", "反贼");
    const wuyanHarvestOther = makeScenarioPlayer(2, "zhangfei", "忠臣");
    setupScenarioState([wuyanHarvestSource, wuyanHarvestXushu, wuyanHarvestOther], { current: wuyanHarvestSource.id });
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "5"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "6"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7")
    ];
    await applyCardEffect(wuyanHarvestSource, virtualCard({ id: "wuyan-harvest", suit: "♥", rank: "3" }, "五谷丰登", "trick", "harvest"), [], null);
    const wuyanHarvestLog = state.log.slice();

    const wuyanSelfTaoyuan = makeScenarioPlayer(0, "xushu", "反贼", { hp: 1 });
    const wuyanSelfOther = makeScenarioPlayer(1, "caocao", "主公", { hp: 1 });
    setupScenarioState([wuyanSelfTaoyuan, wuyanSelfOther], { current: wuyanSelfTaoyuan.id });
    await applyCardEffect(wuyanSelfTaoyuan, virtualCard({ id: "wuyan-self-taoyuan", suit: "♥", rank: "A" }, "桃园结义", "trick", "taoyuan"), [], null);
    const wuyanSelfTaoyuanLog = state.log.slice();

    const jujianTrickA = createCard(CARD_POOL.find((spec) => spec.name === "顺手牵羊"), "♠", "3");
    const jujianTrickB = createCard(CARD_POOL.find((spec) => spec.name === "过河拆桥"), "♣", "4");
    const jujianTrickC = createCard(CARD_POOL.find((spec) => spec.name === "无中生有"), "♥", "7");
    const jujianDrawA = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "5");
    const jujianDrawB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "6");
    const jujianDrawC = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9");
    xushu.hand = [jujianTrickA, jujianTrickB, jujianTrickC];
    xushu.turn = { usedSkills: {} };
    state.deck = [jujianDrawA, jujianDrawB, jujianDrawC];
    await executeSkill(xushu, { type: "skill", skill: "jujian", targets: [xushuTarget], score: 2 });
    const jujianLog = state.log.slice();

    const zhangchunhua = makeScenarioPlayer(0, "zhangchunhua", "反贼", { hp: 1 });
    const jueqingTarget = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([zhangchunhua, jueqingTarget], { current: zhangchunhua.id });
    const jueqingSlash = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    await damage(zhangchunhua, jueqingTarget, 1, DAMAGE.NORMAL, jueqingSlash);
    const jueqingLog = state.log.slice();
    zhangchunhua.hand = [];
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9")
    ];
    await maybeShangshi(zhangchunhua);
    const shangshiLog = state.log.slice();

    const wuguotai = makeScenarioPlayer(0, "wuguotai", "忠臣", { hp: 2 });
    const ganluA = makeScenarioPlayer(1, "sunshangxiang", "主公", { hp: 2 });
    const ganluB = makeScenarioPlayer(2, "liubei", "忠臣");
    setupScenarioState([wuguotai, ganluA, ganluB], { current: wuguotai.id });
    const ganluArmor = createCard(CARD_POOL.find((spec) => spec.name === "白银狮子"), "♣", "A");
    const ganluXiaojiDrawA = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "2");
    const ganluXiaojiDrawB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "3");
    ganluA.equip.armor = ganluArmor;
    state.deck = [ganluXiaojiDrawA, ganluXiaojiDrawB];
    wuguotai.turn = { usedSkills: {} };
    await executeSkill(wuguotai, { type: "skill", skill: "ganlu", targets: [ganluA, ganluB], score: 2 });
    const ganluLog = state.log.slice();

    const buyiWuguotai = makeScenarioPlayer(0, "wuguotai", "忠臣");
    const buyiTarget = makeScenarioPlayer(1, "liubei", "主公", { hp: 0 });
    const buyiSource = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([buyiWuguotai, buyiTarget, buyiSource], { current: buyiSource.id });
    const buyiNonBasic = createCard(CARD_POOL.find((spec) => spec.name === "无中生有"), "♥", "7");
    buyiTarget.hand = [buyiNonBasic];
    const buyiSaved = await dying(buyiTarget, buyiSource);
    const buyiLog = state.log.slice();

    const bulianshi = makeScenarioPlayer(0, "bulianshi", "忠臣");
    const anxuLow = makeScenarioPlayer(1, "liubei", "主公");
    const anxuHigh = makeScenarioPlayer(2, "caocao", "反贼");
    setupScenarioState([bulianshi, anxuLow, anxuHigh], { current: bulianshi.id });
    const anxuMoved = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4");
    const anxuDraw = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8");
    anxuHigh.hand = [anxuMoved, createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9")];
    state.deck = [anxuDraw];
    bulianshi.turn = { usedSkills: {} };
    await executeSkill(bulianshi, { type: "skill", skill: "anxu", targets: [anxuLow, anxuHigh], score: 2 });
    const anxuLog = state.log.slice();

    const zhuiyiDead = makeScenarioPlayer(0, "bulianshi", "忠臣", { hp: 0 });
    const zhuiyiKiller = makeScenarioPlayer(1, "zhangfei", "反贼");
    const zhuiyiBeneficiary = makeScenarioPlayer(2, "sunquan", "主公", { hp: 2 });
    setupScenarioState([zhuiyiDead, zhuiyiKiller, zhuiyiBeneficiary], { current: zhuiyiKiller.id });
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "3"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "4")
    ];
    await killPlayer(zhuiyiDead, zhuiyiKiller);
    const zhuiyiLog = state.log.slice();

    const strictHaoshiLusu = makeScenarioPlayer(0, "lusu", "反贼");
    const strictHaoshiLowest = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false });
    const strictHaoshiOther = makeScenarioPlayer(2, "zhaoyun", "忠臣", { revealed: false });
    const strictHaoshiLord = makeScenarioPlayer(3, "caocao", "主公");
    setupScenarioState([strictHaoshiLusu, strictHaoshiLowest, strictHaoshiOther, strictHaoshiLord], { current: strictHaoshiLusu.id });
    strictHaoshiLusu.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "9")
    ];
    strictHaoshiOther.hand = [createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "Q")];
    state.deck = [
      createCard(CARD_POOL.find((spec) => spec.name === "无中生有"), "♥", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "10")
    ];
    state.reads[strictHaoshiLusu.id][strictHaoshiLowest.id] = 1.8;
    state.reads[strictHaoshiLusu.id][strictHaoshiOther.id] = -1.8;
    await drawPhase(strictHaoshiLusu);
    const strictHaoshiLog = state.log.slice();

    const zhihengEquipOnlySunquan = makeScenarioPlayer(0, "sunquan", "主公");
    const zhihengEquipOnlyEnemy = makeScenarioPlayer(1, "zhangfei", "反贼");
    setupScenarioState([zhihengEquipOnlySunquan, zhihengEquipOnlyEnemy], { current: zhihengEquipOnlySunquan.id });
    const zhihengEquipOnlyArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♠", "2");
    const zhihengEquipOnlyDraw = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    zhihengEquipOnlySunquan.hand = [];
    zhihengEquipOnlySunquan.equip.armor = zhihengEquipOnlyArmor;
    zhihengEquipOnlySunquan.turn = { usedSkills: {} };
    state.deck = [zhihengEquipOnlyDraw];
    const zhihengEquipOnlyActionExists = buildPlayableActions(zhihengEquipOnlySunquan).some((action) => action.skill === "zhiheng");
    await executeSkill(zhihengEquipOnlySunquan, { type: "skill", skill: "zhiheng", score: 2 });
    const zhihengEquipOnlyLog = state.log.slice();
    const zhihengDiscardsEquipmentAndDraws = !zhihengEquipOnlySunquan.equip.armor
      && state.discard.some((card) => card.id === zhihengEquipOnlyArmor.id)
      && zhihengEquipOnlySunquan.hand.some((card) => card.id === zhihengEquipOnlyDraw.id);
    const zhihengEquipLogShowsExactCard = zhihengEquipOnlyLog.some((entry) => entry.includes("孙权 因 制衡 弃置装备区的 ♠2 八卦阵"))
      && zhihengEquipOnlyLog.some((entry) => entry.includes("孙权 发动制衡") && entry.includes("♠2 八卦阵"));

    const zhihengXiaojiOwner = makeScenarioPlayer(0, "sunshangxiang", "忠臣");
    const zhihengXiaojiEnemy = makeScenarioPlayer(1, "zhangfei", "反贼");
    setupScenarioState([zhihengXiaojiOwner, zhihengXiaojiEnemy], { current: zhihengXiaojiOwner.id });
    zhihengXiaojiOwner.extraSkills = ["zhiheng"];
    const zhihengXiaojiArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♣", "2");
    const zhihengXiaojiDrawA = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8");
    const zhihengXiaojiDrawB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9");
    const zhihengXiaojiDrawC = createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "10");
    zhihengXiaojiOwner.hand = [];
    zhihengXiaojiOwner.equip.armor = zhihengXiaojiArmor;
    zhihengXiaojiOwner.turn = { usedSkills: {} };
    state.deck = [zhihengXiaojiDrawA, zhihengXiaojiDrawB, zhihengXiaojiDrawC];
    await executeSkill(zhihengXiaojiOwner, { type: "skill", skill: "zhiheng", score: 2 });
    const zhihengXiaojiLog = state.log.slice();
    const zhihengEquipTriggersLoseEquipSkills = !zhihengXiaojiOwner.equip.armor
      && zhihengXiaojiOwner.hand.some((card) => card.id === zhihengXiaojiDrawA.id)
      && zhihengXiaojiOwner.hand.some((card) => card.id === zhihengXiaojiDrawB.id)
      && zhihengXiaojiOwner.hand.some((card) => card.id === zhihengXiaojiDrawC.id);

    const humanZhiheng = makeScenarioPlayer(0, "sunquan", "主公", { isHuman: true });
    const humanZhihengEnemy = makeScenarioPlayer(1, "zhangfei", "反贼");
    setupScenarioState([humanZhiheng, humanZhihengEnemy], { current: humanZhiheng.id });
    const humanZhihengHand = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7");
    const humanZhihengWeapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    humanZhiheng.hand = [humanZhihengHand];
    humanZhiheng.equip.weapon = humanZhihengWeapon;
    const humanZhihengPromise = askHumanZhihengCards(humanZhiheng);
    await Promise.resolve();
    const humanZhihengFirstLabels = state.pending?.options?.map((option) => option.label) || [];
    const equipChoiceIndex = state.pending?.options?.findIndex((option) => option.label.includes("装备") && option.label.includes("青釭剑")) ?? -1;
    if (equipChoiceIndex >= 0) choosePendingOption(equipChoiceIndex);
    await Promise.resolve();
    const humanZhihengAfterEquipLabels = state.pending?.options?.map((option) => option.label) || [];
    const doneChoiceIndex = state.pending?.options?.findIndex((option) => option.value === "done") ?? -1;
    if (doneChoiceIndex >= 0) choosePendingOption(doneChoiceIndex);
    const humanZhihengChoices = await humanZhihengPromise;
    const humanZhihengCanSelectEquipment = humanZhihengFirstLabels.some((label) => label.includes("装备") && label.includes("青釭剑"))
      && humanZhihengAfterEquipLabels.some((label) => label.includes("确认制衡 1 张"))
      && humanZhihengChoices.some((choice) => choice.zone === "equip" && choice.slot === "weapon");

    const strictDimengLusu = makeScenarioPlayer(0, "lusu", "反贼");
    const strictDimengRich = makeScenarioPlayer(1, "zhaoyun", "忠臣");
    const strictDimengPoor = makeScenarioPlayer(2, "machao", "反贼");
    setupScenarioState([strictDimengLusu, strictDimengRich, strictDimengPoor], { current: strictDimengLusu.id });
    const dimengCostA = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "5");
    const dimengCostB = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "6");
    strictDimengLusu.hand = [dimengCostA, dimengCostB];
    const richCards = [
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9")
    ];
    const poorCards = [createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "10")];
    strictDimengRich.hand = richCards.slice();
    strictDimengPoor.hand = poorCards.slice();
    strictDimengLusu.turn = { usedSkills: {} };
    await executeSkill(strictDimengLusu, { type: "skill", skill: "dimeng", targets: [strictDimengRich, strictDimengPoor], score: 2 });
    const strictDimengLog = state.log.slice();
    const strictDimengDiscard = state.discard.slice();

    const zeroCostDimengLusu = makeScenarioPlayer(0, "lusu", "反贼");
    const zeroCostDimengA = makeScenarioPlayer(1, "liubei", "主公");
    const zeroCostDimengB = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([zeroCostDimengLusu, zeroCostDimengA, zeroCostDimengB], { current: zeroCostDimengLusu.id });
    zeroCostDimengLusu.hand = [];
    zeroCostDimengA.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "3")];
    zeroCostDimengB.hand = [createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "4")];
    const zeroCostDimengLegal = canDimengPair(zeroCostDimengLusu, zeroCostDimengA, zeroCostDimengB);

    const equipCostDimengLusu = makeScenarioPlayer(0, "lusu", "反贼");
    const equipCostDimengRich = makeScenarioPlayer(1, "caocao", "主公");
    const equipCostDimengPoor = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([equipCostDimengLusu, equipCostDimengRich, equipCostDimengPoor], { current: equipCostDimengLusu.id });
    const dimengCostWeapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    const dimengCostArmor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♣", "2");
    const equipRichCards = [
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9")
    ];
    const equipPoorCards = [createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "10")];
    equipCostDimengLusu.hand = [];
    equipCostDimengLusu.equip.weapon = dimengCostWeapon;
    equipCostDimengLusu.equip.armor = dimengCostArmor;
    equipCostDimengLusu.turn = { usedSkills: {} };
    equipCostDimengRich.hand = equipRichCards.slice();
    equipCostDimengPoor.hand = equipPoorCards.slice();
    const equipCostDimengLegal = canDimengPair(equipCostDimengLusu, equipCostDimengRich, equipCostDimengPoor);
    await executeSkill(equipCostDimengLusu, { type: "skill", skill: "dimeng", targets: [equipCostDimengRich, equipCostDimengPoor], score: 2 });
    const equipCostDimengLog = state.log.slice();
    const equipCostDimengDiscard = state.discard.slice();

    const humanDimengLusu = makeScenarioPlayer(0, "lusu", "忠臣", { isHuman: true });
    const humanDimengA = makeScenarioPlayer(1, "caocao", "主公");
    const humanDimengB = makeScenarioPlayer(2, "zhangfei", "反贼");
    setupScenarioState([humanDimengLusu, humanDimengA, humanDimengB], { current: humanDimengLusu.id });
    humanDimengLusu.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7")];
    humanDimengA.hand = [createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "8")];
    humanDimengB.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "9"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "10")
    ];
    const humanDimengAction = { type: "skill", skill: "dimeng", label: "缔盟", needsTarget: true, targetMode: "dimengPair" };
    const humanDimengPromise = pickDimengTargets(humanDimengLusu, humanDimengAction, { autoConfirm: false, previewAction: humanDimengAction });
    await Promise.resolve();
    const humanDimengPickPrompt = state.targetPick?.prompt || "";
    const humanDimengPickBounds = { min: state.targetPick?.min || 0, max: state.targetPick?.max || 0 };
    handlePlayerClick(humanDimengA.id);
    await Promise.resolve();
    const humanDimengAfterFirst = state.targetPick?.selected?.length || 0;
    handlePlayerClick(humanDimengB.id);
    await Promise.resolve();
    const humanDimengAfterSecond = state.targetPick?.selected?.length || 0;
    const humanDimengSelectionValid = targetPickSelectionValid(state.targetPick);
    if (state.targetPick?.resolve) {
      const resolve = state.targetPick.resolve;
      const picked = [...state.targetPick.selected].map(playerById).filter(Boolean);
      state.targetPick = null;
      clearWait();
      resolve(picked);
    }
    const humanDimengPicked = await humanDimengPromise;

    return {
      syntheticGanglieGain: afterSynthetic - beforeSynthetic,
      physicalCardGain: afterPhysical - afterSynthetic,
      physicalCardName: caocao.hand.at(-1)?.name || "",
      syntheticJianxiongLogCount: syntheticLog.filter((entry) => entry.includes("发动奸雄")).length,
      movePhysicalCardInHand,
      movePhysicalCardInDiscard,
      movePhysicalDiscardCount,
      ganglieHeartDidNotTrigger: ganglieHeartSource.hp === 3 && ganglieHeartSource.hand.length === 0,
      ganglieHeartLogCount: ganglieHeartLog.filter((entry) => entry.includes("夏侯惇 的刚烈判定为红桃，未触发")).length,
      ganglieDiamondTriggeredOnNonHeart: ganglieDiamondLog.some((entry) => entry.includes("夏侯惇 的 刚烈 判定：♦2 桃")),
      ganglieDiamondDiscardedTwoHand,
      ganglieDiamondLogShowsHandCards: ganglieDiamondLog.some((entry) => entry.includes("张飞 因 刚烈 弃置 2 张牌") && entry.includes("♣5 杀") && entry.includes("♦9 闪")),
      ganglieForcedDamageWithoutTwoHand: ganglieForcedSource.hp === 2 && ganglieForcedSource.hand.some((card) => card.id === ganglieSoloHand.id),
      ganglieForcedDamageLogCount: ganglieForcedLog.filter((entry) => entry.includes("夏侯惇 对 张飞 造成 1 点伤害")).length,
      ganglieRewriteToNonHeart: ganglieRewriteLog.some((entry) => entry.includes("司马懿 发动鬼才") && entry.includes("刚烈") && entry.includes("♣9 杀")),
      ganglieRewriteDamagedSource: ganglieRewriteSource.hp === 2,
      ganglieRewriteLogCount: ganglieRewriteLog.filter((entry) => entry.includes("司马懿 发动鬼才") && entry.includes("刚烈")).length,
      ganglieHumanCanDecline: ganglieDeclinePrompt.includes("是否发动刚烈")
        && ganglieDeclineOwner.hp === 2
        && ganglieDeclineSource.hp === 3
        && ganglieDeclineDeckTopStayed === ganglieDeclineJudge.id
        && !ganglieDeclineLog.some((entry) => entry.includes("刚烈 判定") || entry.includes("发动刚烈")),
      jizhiNullifyHandCount: yueying.hand.length,
      jizhiNullifyDrewCard: yueying.hand.some((card) => card.id === drawCard.id),
      jizhiNullifyLogCount: yueyingLog.filter((entry) => entry.includes("发动集智")).length,
      jizhiDelayedTrickDidNotDraw: delayedYueying.hand.length === 0 && !delayedYueying.hand.some((card) => card.id === delayedJizhiDraw.id) && delayedTarget.judgeArea.some((card) => card.id === lebuForJizhi.id),
      jizhiDelayedTrickLogCount: delayedJizhiLog.filter((entry) => entry.includes("发动集智")).length,
      rendeTargetsOtherOnly: rendeLegalTargets.every((target) => target.id !== rendeLiubei.id),
      rendeHumanCanPickGivenCards: rendeFirstPickPrompt.includes("选择给出的手牌") && rendeFirstPicked && rendeSecondPicked && rendeThirdPicked,
      rendeCanGiveAcrossMultipleUses: rendeFirstTarget.hand.some((card) => card.id === rendeSlash.id)
        && rendeSecondTarget.hand.some((card) => card.id === rendeDodge.id)
        && rendeFirstTarget.hand.some((card) => card.id === rendeWine.id)
        && !rendeLiubei.hand.some((card) => [rendeSlash.id, rendeDodge.id, rendeWine.id].includes(card.id)),
      rendeHealsOnceWhenCumulativeTwo: hpAfterFirstRende === 3
        && hpAfterSecondRende === 4
        && hpAfterThirdRende === 3
        && rendeLiubei.turn.gaveByRende === 3
        && rendeLiubei.turn.usedSkills.rendeHeal === true,
      rendeLogShowsThreeGiftEvents: rendeLog.filter((entry) => entry.includes("刘备 发动仁德")).length === 3,
      qingnangTargetsOnlyWoundedAndAllowsSelf: qingnangLegalTargets.some((target) => target.id === qingnangHuatuo.id)
        && qingnangLegalTargets.some((target) => target.id === qingnangTarget.id)
        && !qingnangLegalTargets.some((target) => target.id === qingnangFull.id),
      qingnangHumanPaysOneHandAndHeals: qingnangPickPrompt.includes("弃一张手牌发动青囊")
        && qingnangPicked
        && qingnangTarget.hp === 3
        && qingnangHuatuo.hand.some((card) => card.id === qingnangKeep.id)
        && !qingnangHuatuo.hand.some((card) => card.id === qingnangCost.id)
        && qingnangCostInDiscard,
      qingnangOncePerPhase: qingnangHuatuo.turn.usedSkills.qingnang === true && !qingnangAvailableAfterUse,
      qingnangLogShowsCostAndHeal: qingnangLog.some((entry) => entry.includes("华佗 因 青囊 弃置 1 张牌：♠7 杀"))
        && qingnangLog.some((entry) => entry.includes("华佗 发动青囊，令 刘备 回复 1 点体力")),
      jieyinTargetsOnlyWoundedMaleOther: jieyinLegalTargets.length === 1
        && jieyinLegalTargets.some((target) => target.id === jieyinMaleTarget.id)
        && !jieyinLegalTargets.some((target) => target.id === jieyinSun.id)
        && !jieyinLegalTargets.some((target) => target.id === jieyinFullMale.id)
        && !jieyinLegalTargets.some((target) => target.id === jieyinWoundedFemale.id),
      jieyinHumanPaysTwoHandAndHealsBoth: jieyinPickPrompt.includes("弃两张手牌发动结姻")
        && jieyinPicked
        && jieyinSun.hp === 3
        && jieyinMaleTarget.hp === 3
        && jieyinSun.hand.some((card) => card.id === jieyinKeep.id)
        && !jieyinSun.hand.some((card) => [jieyinCostA.id, jieyinCostB.id].includes(card.id))
        && jieyinCostsInDiscard,
      jieyinOncePerPhase: jieyinSun.turn.usedSkills.jieyin === true && !jieyinAvailableAfterUse,
      jieyinLogShowsCostAndHeal: jieyinLog.some((entry) => entry.includes("孙尚香 因 结姻 弃置 2 张牌") && entry.includes("♠7 杀") && entry.includes("♦8 闪"))
        && jieyinLog.some((entry) => entry.includes("孙尚香 发动结姻，孙尚香、刘备 回复 1 点体力")),
      lijianAvailableWithOnlyEquipment: lijianActionExists,
      lijianTargetsOnlyMaleOther: lijianLegalTargets.some((target) => target.id === lijianSource.id)
        && lijianLegalTargets.some((target) => target.id === lijianTarget.id)
        && !lijianLegalTargets.some((target) => target.id === lijianFemale.id)
        && !lijianLegalTargets.some((target) => target.id === lijianDiaochan.id),
      lijianHumanCanPayEquipmentCost: lijianCostPrompt.includes("弃置一张牌")
        && lijianCostLabels.some((label) => label.includes("装备") && label.includes("八卦阵"))
        && !lijianDiaochan.equip.armor
        && lijianArmorInDiscard,
      lijianDuelResolves: lijianTarget.hp === 3
        && lijianLog.some((entry) => entry.includes("貂蝉 发动离间") && entry.includes("黄忠") && entry.includes("张飞"))
        && lijianLog.some((entry) => entry.includes("黄忠 对 张飞 造成 1 点普通伤害")),
      lijianOncePerPhase: lijianDiaochan.turn.usedSkills.lijian === true && !lijianAvailableAfterUse,
      guoseDiamondBecomesDelayedLebu: guoseMaterializedDiamondAsLebu,
      guoseDoesNotAskImmediateNullify: guoseNoImmediateNullify,
      guoseNullifyDuringJudgePhase: guoseTarget.judgeArea.length === 0
        && !guoseTarget.hand.some((card) => card.id === guoseNullify.id)
        && guoseJudgeLog.some((entry) => entry.includes("曹操 判定阶段结算 乐不思蜀，被无懈可击抵消"))
        && guoseJudgeLog.some((entry) => entry.includes("曹操 使用无懈可击，抵消 乐不思蜀")),
      delayedJudgementAsksHumanBeforeAllyAI: humanDelayedNullifyOwner === humanDelayedOwner.id
        && humanDelayedNullifyPrompt.includes("乐不思蜀")
        && humanDelayedNullifyLabels.some((label) => label.includes("无懈可击"))
        && humanDelayedAlly.hand.some((card) => card.id === allyDelayedNullify.id)
        && humanDelayedLog.some((entry) => entry.includes("你(曹操) 使用无懈可击，抵消 乐不思蜀")),
      harvestNullifyPerTargetPrompted: harvestFirstNullifyPrompt.includes("五谷丰登")
        && harvestFirstNullifyPrompt.includes("刘备")
        && harvestSecondNullifyPrompt.includes("五谷丰登")
        && harvestSecondNullifyPrompt.includes("张飞")
        && harvestSecondNullifyLabels.some((label) => label.includes("无懈可击"))
        && harvestHumanChoicePrompt.includes("五谷牌"),
      harvestNullifyOnlySkipsOneTarget: harvestSource.hand.length === 1
        && harvestSkipped.hand.length === 0
        && harvestResponder.hand.length === 1
        && harvestDiscardAfter.some((discarded) => discarded.id === harvestNullify.id)
        && harvestNullifyLog.some((entry) => entry.includes("你(诸葛亮) 使用无懈可击，抵消 五谷丰登，阻止 张飞"))
        && harvestNullifyLog.some((entry) => entry.includes("张飞 的五谷丰登取牌被无懈可击抵消")),
      arrowsNullifyPerTargetPrompted: arrowsFirstNullifyPrompt.includes("万箭齐发")
        && arrowsFirstNullifyPrompt.includes("曹操")
        && arrowsSecondNullifyPrompt.includes("万箭齐发")
        && arrowsSecondNullifyPrompt.includes("诸葛亮")
        && arrowsSecondNullifyLabels.some((label) => label.includes("无懈可击")),
      arrowsNullifyOnlySkipsOneTarget: arrowsFirstTarget.hp === 3
        && arrowsResponder.hp === 4
        && arrowsResponder.hand.length === 0
        && arrowsDiscardAfter.some((discarded) => discarded.id === arrowsNullify.id)
        && arrowsNullifyLog.some((entry) => entry.includes("曹操 失去 1 点体力"))
        && arrowsNullifyLog.some((entry) => entry.includes("你(诸葛亮) 使用无懈可击，抵消 万箭齐发，保护 你(诸葛亮)"))
        && arrowsNullifyLog.some((entry) => entry.includes("你(诸葛亮) 的万箭齐发伤害被无懈可击抵消")),
      taoyuanNullifyPerTargetPrompted: taoyuanFirstNullifyPrompt.includes("桃园结义")
        && taoyuanFirstNullifyPrompt.includes("刘备")
        && taoyuanSecondNullifyPrompt.includes("桃园结义")
        && taoyuanSecondNullifyPrompt.includes("张飞")
        && taoyuanSecondNullifyLabels.some((label) => label.includes("无懈可击")),
      taoyuanNullifyOnlySkipsOneTarget: taoyuanSource.hp === 3
        && taoyuanSkipped.hp === 2
        && taoyuanResponder.hp === 3
        && taoyuanResponder.hand.length === 0
        && taoyuanDiscardAfter.some((discarded) => discarded.id === taoyuanNullify.id)
        && taoyuanNullifyLog.some((entry) => entry.includes("你(诸葛亮) 使用无懈可击，抵消 桃园结义，阻止 张飞"))
        && taoyuanNullifyLog.some((entry) => entry.includes("张飞 的桃园结义回复被无懈可击抵消")),
      barbariansNullifyPerTargetPrompted: barbariansFirstNullifyPrompt.includes("南蛮入侵")
        && barbariansFirstNullifyPrompt.includes("曹操")
        && barbariansSecondNullifyPrompt.includes("南蛮入侵")
        && barbariansSecondNullifyPrompt.includes("诸葛亮")
        && barbariansSecondNullifyLabels.some((label) => label.includes("无懈可击")),
      barbariansNullifyOnlySkipsOneTarget: barbariansFirstTarget.hp === 3
        && barbariansResponder.hp === 4
        && barbariansResponder.hand.length === 0
        && barbariansDiscardAfter.some((discarded) => discarded.id === barbariansNullify.id)
        && barbariansNullifyLog.some((entry) => entry.includes("曹操 失去 1 点体力"))
        && barbariansNullifyLog.some((entry) => entry.includes("你(诸葛亮) 使用无懈可击，抵消 南蛮入侵，保护 你(诸葛亮)"))
        && barbariansNullifyLog.some((entry) => entry.includes("你(诸葛亮) 的南蛮入侵伤害被无懈可击抵消")),
      fanjianTargetsOtherOnly: fanjianTargets.length === 1 && fanjianTargets.every((target) => target.id !== fanjianSource.id),
      fanjianAsksTargetToGuessSuit: fanjianPrompt.includes("反间") && fanjianGuessLabels.length === 4 && ["♠", "♥", "♣", "♦"].every((suit) => fanjianGuessLabels.includes(suit)),
      fanjianGivesExactCardAndDamagesOnWrongGuess: fanjianTarget.hand.some((card) => card.id === fanjianCard.id)
        && fanjianSource.hand.length === 0
        && fanjianTarget.hp === fanjianTarget.maxHp - 1,
      fanjianLogShowsSuitAndCard: fanjianLog.some((entry) => entry.includes("周瑜 发动反间") && entry.includes("张飞 猜 ♥") && entry.includes("♠7 杀")),
      tiejiRedForbidsDodgeAndDealsDamage: tiejiRedTarget.hp === tiejiRedTarget.maxHp - 1
        && tiejiRedTarget.hand.some((card) => card.id === tiejiRedDodge.id)
        && tiejiRedLog.some((entry) => entry.includes("铁骑判定为红色") && entry.includes("不能出闪")),
      tiejiBlackAllowsDodge: tiejiBlackTarget.hp === tiejiBlackTarget.maxHp
        && !tiejiBlackTarget.hand.some((card) => card.id === tiejiBlackDodge.id)
        && tiejiBlackLog.some((entry) => entry.includes("铁骑判定未命中"))
        && tiejiBlackLog.some((entry) => entry.includes("曹操 闪避了 马超 的杀")),
      tiejiHumanCanDecline: tiejiHumanPrompt.includes("是否发动铁骑")
        && tiejiHumanTarget.hp === tiejiHumanTarget.maxHp
        && !tiejiHumanTarget.hand.some((card) => card.id === tiejiHumanDodge.id)
        && tiejiHumanDeckTopStayed === tiejiHumanJudge.id
        && !tiejiHumanLog.some((entry) => entry.includes("发动铁骑")),
      liuliHumanPromptsUseTargetAndCost: liuliHumanAskPrompt.includes("是否发动流离")
        && liuliHumanTargetPrompt.includes("选择流离转移目标")
        && liuliHumanCostPrompt.includes("流离")
        && liuliHumanCostLabels.some((label) => label.includes("手牌") && label.includes("♣5 杀"))
        && liuliHumanCostLabels.some((label) => label.includes("装备") && label.includes("八卦阵")),
      liuliHumanTargetsLegalOtherOnly: liuliHumanValidIds.includes(liuliHumanRedirect.id)
        && !liuliHumanValidIds.includes(liuliHumanSource.id)
        && !liuliHumanValidIds.includes(liuliHumanDaqiao.id),
      liuliHumanCanPayEquipmentAndRedirect: liuliHumanNewTarget?.id === liuliHumanRedirect.id
        && !liuliHumanDaqiao.equip.armor
        && liuliHumanDaqiao.hand.some((card) => card.id === liuliHumanHandCost.id)
        && liuliHumanEquipDiscarded
        && liuliHumanLog.some((entry) => entry.includes("大乔 因 流离 弃置 ♠2 八卦阵"))
        && liuliHumanLog.some((entry) => entry.includes("大乔 发动流离，将杀转移给 张飞")),
      liegongHighHandForbidsDodge: liegongHighTarget.hp === liegongHighTarget.maxHp - 1
        && liegongHighTarget.hand.some((card) => card.id === liegongHighDodge.id)
        && liegongHighLog.some((entry) => entry.includes("黄忠 发动烈弓") && entry.includes("曹操 不能出闪")),
      liegongLowHandForbidsDodge: liegongLowTarget.hp === liegongLowTarget.maxHp - 1
        && liegongLowTarget.hand.some((card) => card.id === liegongLowDodge.id)
        && liegongLowLog.some((entry) => entry.includes("黄忠 发动烈弓") && entry.includes("曹操 不能出闪")),
      liegongHumanCanDecline: liegongHumanPrompt.includes("是否发动烈弓")
        && liegongHumanTarget.hp === liegongHumanTarget.maxHp
        && !liegongHumanTarget.hand.some((card) => card.id === liegongHumanDodge.id)
        && !liegongHumanLog.some((entry) => entry.includes("发动烈弓"))
        && liegongHumanLog.some((entry) => entry.includes("曹操 闪避了 黄忠 的杀")),
      aiSelfNullifiesDismantle: selfNullifyTarget.hand.length === 1 && selfNullifyTarget.hand.some((card) => card.id === selfNullifyProtectedCard.id) && !selfNullifyTarget.hand.some((card) => card.id === selfNullifyCard.id),
      aiSelfNullifyDismantleLogCount: selfNullifyLog.filter((entry) => entry.includes("曹操 使用无懈可击，抵消 过河拆桥")).length,
      aiWeakUnknownNullifyBlocked: weakUnknownNullifyBlocked,
      humanYijiPromptsAndTargets: humanYijiAskPrompt.includes("刚摸到的牌") && humanYijiPickPrompt.includes("刚摸到的牌") && humanYijiTargetPrompt.includes("获得这些牌") && humanYijiContinuePrompt.includes("继续分配"),
      humanYijiOnlyAllowsDrawnCards: humanYijiPickOnlyDrawn,
      humanYijiMovesChosenCard: humanYijiPicked && humanYijiAlly.hand.some((card) => card.id === humanYijiDrawA.id) && !humanYiji.hand.some((card) => card.id === humanYijiDrawA.id),
      humanYijiKeepsUnchosenAndOldCards: humanYiji.hand.some((card) => card.id === humanYijiOldCard.id) && humanYiji.hand.some((card) => card.id === humanYijiDrawB.id) && humanYijiEnemy.hand.length === 0,
      humanYijiLogCount: humanYijiLog.filter((entry) => entry.includes("郭嘉 发动遗计") && entry.includes("曹操")).length,
      guhuoActiveCanDeclareMultipleNames: ["蛊惑：无中生有", "蛊惑：南蛮入侵", "蛊惑：借刀杀人", "蛊惑：桃", "蛊惑：酒"].every((label) => guhuoActionLabels.includes(label)),
      guhuoActiveNoRecastDeclaration: !guhuoActionLabels.some((label) => label.includes("重铸")),
      guhuoResponseCanDeclareBasicAndNullify: guhuoDodgeOptions.includes("蛊惑：闪") && guhuoNullifyOptions.includes("蛊惑：无懈可击"),
      guhuoTrueHeartChallengeContinues: guhuoTrueHeartContinued && guhuoTrueHeartLog.some((entry) => entry.includes("红桃真蛊惑继续生效")),
      guhuoFalseChallengeFizzles: guhuoFalseFizzled && guhuoFalseLog.some((entry) => entry.includes("蛊惑为假") && entry.includes("作废")),
      guhuoTrueNonHeartChallengeFizzles: guhuoTrueBlackFizzled && guhuoTrueBlackLog.some((entry) => entry.includes("非红桃真牌作废")),
      guicaiJudgeSuit: cardSuitFor(guicaiOwner, guicaiJudge),
      guicaiJudgeCardId: guicaiJudge.id,
      guicaiRewriteCardId: heartRewrite.id,
      guicaiLogCount: guicaiLog.filter((entry) => entry.includes("司马懿 发动鬼才")).length,
      guicaiAfterLoseHandTriggered: simayi.hand.some((card) => card.id === lianyingDraw.id),
      guicaiLianyingLogCount: guicaiLog.filter((entry) => entry.includes("司马懿 发动连营")).length,
      guidaoJudgeSuit: cardSuitFor(guidaoOwner, guidaoJudge),
      guidaoJudgeCardId: guidaoJudge.id,
      guidaoRewriteCardId: blackRewrite.id,
      guidaoLogCount: guidaoLog.filter((entry) => entry.includes("张角 发动鬼道")).length,
      luoshenRewriteWorked: luoshenOwner.hand.some((card) => card.id === blackLuoshenRewrite.id),
      luoshenInitialJudgeDiscarded: luoshenLog.some((entry) => entry.includes("司马懿 发动鬼才") && entry.includes("洛神")),
      luoshenStoppedOnRed,
      leijiGuidaoLogCount: leijiLog.filter((entry) => entry.includes("张角 发动鬼道") && entry.includes("雷击")).length,
      leijiGuidaoCausedDamage: leijiTarget.hp === leijiTarget.maxHp - 2,
      leijiRewriteCardDiscarded,
      leijiHumanPromptedUse: humanLeijiAskPrompt.includes("是否发动雷击"),
      leijiHumanPromptedTarget: humanLeijiTargetPrompt.includes("选择一名其他角色"),
      leijiHumanCanChooseNonSource: humanLeijiSource.hp === 4 && humanLeijiChosenTarget.hp === 2,
      leijiThunderDamageCannotBeDodged: humanLeijiChosenTarget.hand.some((card) => card.id === humanLeijiTargetDodge.id),
      leijiTargetPerformsJudge: humanLeijiLog.some((entry) => entry.includes("刘备 的 雷击 判定：♠7 杀")),
      leijiClubHealsOwnerAndDamagesTarget: leijiClubOwner.hp === 3 && leijiClubTarget.hp === 3,
      leijiClubLogShowsHealAndThunderDamage: leijiClubLog.some((entry) => entry.includes("张角 发动雷击") && entry.includes("判定为梅花") && entry.includes("回复 1 点体力") && entry.includes("1 点雷电伤害")),
      leijiThunderChainsLinkedTargets: leijiChainTarget.hp === 2 && leijiChainBystander.hp === 2 && !leijiChainTarget.linked && !leijiChainBystander.linked,
      leijiThunderChainLogged: leijiChainLog.some((entry) => entry.includes("刘备 受到铁索传导")) && leijiChainLog.some((entry) => entry.includes("张角 对 刘备 造成 2 点雷电伤害")),
      targetCardOptionLabels: targetOptionLabelsBefore,
      targetCardOptionTips: targetOptionTipsBefore,
      dismantleRangeIncludesFar: dismantleTargets.some((target) => target.id === farTarget.id),
      stealRangeIncludesFar: stealTargets.some((target) => target.id === farTarget.id),
      dismantleRemovedEquip: removedByDismantle?.id === armor.id,
      dismantleTargetStillHasJudge: farTarget.judgeArea.length === 1,
      stealHandWorked: Boolean(stolenHand) && handOnlyTarget.hand.length === 1 && dismantler.hand.some((card) => card.id === stolenHand.id),
      humanDismantlePendingKind,
      humanDismantlePendingLabels,
      humanDismantleRemovedChosenEquip: humanDismantled?.id === humanDismantleArmor.id,
      humanDismantleDidNotTouchRandomHand: humanDismantleTarget.hand.length === 2 && humanDismantleTarget.hand.every((card) => [humanDismantleHandA.id, humanDismantleHandB.id].includes(card.id)),
      humanStealPendingKind,
      humanStealPendingLabels,
      humanStealTookChosenHandSlot: humanStolen?.id === humanStealHandB.id && humanStealer.hand.some((card) => card.id === humanStealHandB.id) && humanStealTarget.hand.length === 1,
      humanFankuiAskKind,
      humanFankuiAskLabels,
      humanFankuiChoiceKind,
      humanFankuiChoiceLabels,
      humanFankuiTookChosenEquip: humanFankui.hand.some((card) => card.id === humanFankuiArmor.id) && !humanFankuiSource.equip.armor,
      humanFankuiDidNotTouchRandomHand: humanFankuiSource.hand.length === 2 && humanFankuiSource.hand.every((card) => [humanFankuiHandA.id, humanFankuiHandB.id].includes(card.id)),
      humanFankuiLogCount: humanFankuiLog.filter((entry) => entry.includes("司马懿 发动反馈")).length,
      aiFankuiTookVisibleEquip: aiFankui.hand.some((card) => card.id === aiFankuiArmor.id) && !aiFankuiSource.equip.armor && aiFankuiSource.hand.some((card) => card.id === aiFankuiHiddenHand.id),
      aiFankuiLogShowsEquip: aiFankuiLog.some((entry) => entry.includes("司马懿 因 反馈 获得 曹操 的装备区的 ♠2 八卦阵")),
      actualFankuiTriggersLianying: fankuiLianying.hand.some((card) => card.id === fankuiLastHand.id) && fankuiLianyingSource.hand.some((card) => card.id === fankuiLianyingDraw.id),
      actualFankuiLianyingLogCount: fankuiLianyingLog.filter((entry) => entry.includes("陆逊 发动连营")).length,
      beigeSelfTriggered: beigeSelfLog.some((entry) => entry.includes("蔡文姬 发动悲歌")),
      beigeSelfHealedBeforeDying: beigeSelf.alive && beigeSelf.hp === 1,
      beigeSelfCostLogged: beigeSelfLog.some((entry) => entry.includes("蔡文姬 因 悲歌 弃置 1 张牌：♣5 杀")),
      beigeSelfJudgeHeartLogged: beigeSelfLog.some((entry) => entry.includes("蔡文姬 的 悲歌 判定：♥2 桃")),
      beigeHeartEffectLogged: beigeSelfLog.some((entry) => entry.includes("蔡文姬 因悲歌红桃回复 1 点体力")),
      beigeDiamondDrewTwo: beigeDiamondDamaged.hand.some((card) => card.id === beigeDiamondDrawA.id) && beigeDiamondDamaged.hand.some((card) => card.id === beigeDiamondDrawB.id),
      beigeDiamondEffectLogged: beigeDiamondLog.some((entry) => entry.includes("刘备 因悲歌方片摸 2 张牌")) && !beigeDiamondLog.some((entry) => entry === "刘备 摸 2 张牌。"),
      beigeSpadeSkippedSourcePlay: beigeSpadeSource.flags.skipPlayOnce === true,
      beigeSpadeEffectLogged: beigeSpadeLog.some((entry) => entry.includes("张飞 因悲歌黑桃跳过下个出牌阶段")),
      guzhengReturnedExactCard: guzhengDiscarder.hand.some((card) => card.id === guzhengReturn.id),
      guzhengGainedExactCard: guzhengHolder.hand.some((card) => card.id === guzhengGain.id),
      guzhengRemovedCardsFromDiscard,
      guzhengLogShowsExactCards: guzhengLog.some((entry) => entry.includes("张昭张纮 发动固政") && entry.includes("♥4 桃") && entry.includes("♣7 杀")),
      tianxiangPreventedSelfDamage: tianxiangOwner.hp === 2,
      tianxiangRedirectedDamage: tianxiangTarget.hp === 1,
      tianxiangTargetDrewLostHp: [tianxiangDrawA.id, tianxiangDrawB.id, tianxiangDrawC.id].every((id) => tianxiangTarget.hand.some((card) => card.id === id)),
      tianxiangCostLogged: tianxiangLog.some((entry) => entry.includes("小乔 因 天香 弃置 1 张牌：♥Q 闪")),
      tianxiangLogShowsAmount: tianxiangLog.some((entry) => entry.includes("小乔 发动天香，将 1 点伤害转移给 张飞")),
      tianxiangDrawReasonLogged: tianxiangLog.some((entry) => entry.includes("张飞 因天香摸 3 张牌")) && !tianxiangLog.some((entry) => entry === "张飞 摸 3 张牌。"),
      randomStealTriggeredAfterLoseHand: stolenByRandomTool?.id === lastHand.id && lianyingTarget.hand.some((card) => card.id === lianyingTop.id),
      randomStealLianyingLogCount: randomToolLog.filter((entry) => entry.includes("陆逊 发动连营")).length,
      humanLierenAskedThenPindian: humanLierenAskKind === "是否发动" && humanLierenAskPrompt.includes("是否发动烈刃") && humanLierenPickedPindian && humanLierenPindianPrompt.includes("烈刃"),
      humanLierenChoiceShowsTargetCards: humanLierenChoiceKind === "选择" && humanLierenChoiceLabels.some((label) => label.includes("手牌 1")) && humanLierenChoiceLabels.some((label) => label.includes("白银狮子")),
      humanLierenTookChosenEquip: humanLieren.hand.some((card) => card.id === humanLierenArmor.id) && !humanLierenTarget.equip.armor,
      humanLierenLogShowsExactEquip: humanLierenLog.some((entry) => entry.includes("祝融 发动烈刃")) && humanLierenLog.some((entry) => entry.includes("祝融 因 烈刃 获得 曹操 的装备区的 ♣A 白银狮子")),
      aiLierenPrefersVisibleEquip: aiLieren.hand.some((card) => card.id === aiLierenArmor.id) && !aiLierenTarget.equip.armor && aiLierenTarget.hand.length === 1,
      aiLierenLogShowsExactEquip: aiLierenLog.some((entry) => entry.includes("祝融 因 烈刃 获得 曹操 的装备区的 ♠2 八卦阵")),
      discardFromHandTriggeredAfterLoseHand: discardedLastHand.length === 1 && discardLianying.hand.some((card) => card.id === discardLianyingDraw.id),
      discardFromHandLianyingLogCount: discardFromHandLog.filter((entry) => entry.includes("陆逊 发动连营")).length,
      discardFromHandShowsCardNames: discardFromHandLog.some((entry) => entry.includes("陆逊 因 测试弃牌 弃置 1 张牌：♣5 杀")),
      discardTargetHandShowsCardNameAfterDiscard: discardTargetHandLog.some((entry) => entry.includes("甘宁 因 测试拆牌 弃置 刘备 的手牌：♦9 闪")),
      nonHandLossDoesNotTriggerLianying: removedNonHandLianying?.id === nonHandLianyingArmor.id && nonHandLianyingTarget.hand.length === 0 && !nonHandLianyingTarget.hand.some((card) => card.id === nonHandLianyingDraw.id),
      nonHandLossLianyingLogCount: nonHandLianyingLog.filter((entry) => entry.includes("陆逊 发动连营")).length,
      discardTargetEquipShowsCardName: nonHandLianyingLog.some((entry) => entry.includes("甘宁 因 过河拆桥 弃置 陆逊 的装备区的 ♠2 八卦阵")),
      nonHandLossStillTriggersTuntian: removedTuntianEquip?.id === tuntianArmor.id && tuntianTarget.fields.length === 1 && tuntianTarget.fields[0].name === tuntianJudge.name && tuntianTarget.fields[0].suit === tuntianJudge.suit && tuntianTarget.fields[0].rank === tuntianJudge.rank,
      nonHandLossTuntianLogCount: tuntianEquipLog.filter((entry) => entry.includes("邓艾 发动屯田")).length,
      qiaobianMoveTriggersTuntian: qiaobianReceiver.equip.armor?.id === qiaobianArmor.id && qiaobianDengai.fields.length === 1 && qiaobianDengai.fields[0].name === qiaobianJudge.name && qiaobianDengai.fields[0].suit === qiaobianJudge.suit && qiaobianDengai.fields[0].rank === qiaobianJudge.rank,
      qiaobianMoveTuntianLogCount: qiaobianMoveLog.filter((entry) => entry.includes("邓艾 发动屯田")).length,
      borrowSwordTransferTriggersTuntian: borrowSource.hand.some((card) => card.id === borrowWeapon.id) && borrowDengai.fields.length === 1 && borrowDengai.fields[0].name === borrowJudge.name && borrowDengai.fields[0].suit === borrowJudge.suit && borrowDengai.fields[0].rank === borrowJudge.rank,
      borrowSwordTransferTuntianLogCount: borrowSwordLog.filter((entry) => entry.includes("邓艾 发动屯田")).length,
      qilinHorseLossTriggersTuntian: !qilinDengai.equip.plusHorse && qilinDengai.fields.length === 1 && qilinDengai.fields[0].name === qilinJudge.name && qilinDengai.fields[0].suit === qilinJudge.suit && qilinDengai.fields[0].rank === qilinJudge.rank,
      qilinHorseLossTuntianLogCount: qilinLog.filter((entry) => entry.includes("邓艾 发动屯田")).length,
      qilinHorseLossShowsCardName: qilinLog.some((entry) => entry.includes("马超 发动麒麟弓") && entry.includes("♣5 的卢")),
      horseDisplayNameShowsSpecificMount: cardName(qilinHorse) === "♣5 的卢" && horseDisplayTooltip.includes("的卢：其他角色计算与你的距离 +1"),
      qinggangIgnoresTengjiaNormalSlash: qinggangNormalTarget.hp === 3 && qinggangNormalLog.some((entry) => entry.includes("马超 对 曹操 造成 1 点普通伤害")) && !qinggangNormalLog.some((entry) => entry.includes("藤甲抵消")),
      qinggangIgnoresTengjiaFireBoost: qinggangFireTarget.hp === 3 && qinggangFireLog.some((entry) => entry.includes("马超 对 曹操 造成 1 点火焰伤害")) && !qinggangFireLog.some((entry) => entry.includes("造成 2 点火焰伤害")),
      hanbingSwordInPool: CARD_POOL.some((spec) => spec.name === "寒冰剑" && spec.range === 2),
      hanbingSwordInDeck: CARD_DECK_BLUEPRINT.some((entry) => entry.name === "寒冰剑"),
      hanbingPreventsDamageAndDiscardsTwo,
      hanbingLogsExactDiscardedCards,
      hanbingDoesNotReplaceLethalDamage,
      hanbingTooltipExplainsPreventDamage: hanbingTooltip.includes("防止此伤害") && hanbingTooltip.includes("弃置目标两张牌"),
      wineDodgedSlashConsumed: wineDodgeSource.drunk === false && wineDodgeTarget.hp === 4 && wineDodgeLog.some((entry) => entry.includes("曹操 闪避了 张飞 的杀")),
      wineArmorCancelConsumed: wineArmorSource.drunk === false && wineArmorTarget.hp === 4 && wineArmorLog.some((entry) => entry.includes("藤甲抵消")),
      wineHitAddsDamageAndConsumes: wineHitSource.drunk === false && wineHitTarget.hp === 2 && wineHitLog.some((entry) => entry.includes("张飞 对 曹操 造成 2 点普通伤害")),
      jiuchiActiveSpadeAsWine: Boolean(jiuchiActiveAction) && jiuchiActiveDongzhuo.drunk && jiuchiActiveDongzhuo.turn.usedWine && !jiuchiActiveDongzhuo.hand.some((card) => card.id === jiuchiSpadeCard.id),
      jiuchiOncePerTurn: jiuchiActionsAfterWine.length === 0,
      jiuchiActiveLogShowsSkill: jiuchiActiveLog.some((entry) => entry.includes("董卓 使用 酒池：酒")),
      jiuchiDyingSpadeSelfRescue: jiuchiDyingRescue?.amount === 1 && jiuchiDyingDongzhuo.hp === 1 && !jiuchiDyingDongzhuo.hand.some((card) => card.id === jiuchiDyingSpade.id),
      jiuchiDyingLogShowsSelfWine: jiuchiDyingLog.some((entry) => entry.includes("董卓 酒池：使用酒，自救")),
      roulinDongzhuoSlashFemaleRequiresTwoDodges: roulinFemaleTarget.hp === 3 && roulinFemaleTarget.hand.length === 0 && roulinAttackLog.filter((entry) => entry.includes("貂蝉 打出闪")).length === 2,
      roulinFemaleSlashDongzhuoRequiresTwoDodges: roulinDefenseDongzhuo.hp === 8 && roulinDefenseDongzhuo.hand.length === 0 && roulinDefenseLog.filter((entry) => entry.includes("董卓 打出闪")).length === 2,
      roulinLogsBothDirections: roulinAttackLog.some((entry) => entry.includes("肉林触发") && entry.includes("貂蝉")) && roulinDefenseLog.some((entry) => entry.includes("肉林触发") && entry.includes("董卓")),
      kuangguHealsPerDamagePoint: kuangguNearSource.hp === 4 && kuangguNearTarget.hp === 2,
      kuangguLogShowsRecoveredAmount: kuangguNearLog.some((entry) => entry.includes("魏延 发动狂骨，回复 2 点体力")),
      kuangguRequiresDistanceOne: kuangguFarDistance > 1 && kuangguFarSource.hp === 2 && kuangguFarTarget.hp === 2 && !kuangguFarLog.some((entry) => entry.includes("发动狂骨")),
      mengjinUsesConcreteDismantle,
      mengjinKeepsUnknownHandWhenVisibleEquipBetter,
      mengjinLogShowsChosenEquip,
      liuliEquipCostTriggersTuntian: liuliNewTarget?.id === liuliTarget.id && !liuliDengai.equip.plusHorse && liuliDengai.fields.length === 1 && liuliDengai.fields[0].name === liuliJudge.name && liuliDengai.fields[0].suit === liuliJudge.suit && liuliDengai.fields[0].rank === liuliJudge.rank,
      liuliEquipCostTuntianLogCount: liuliLog.filter((entry) => entry.includes("邓艾 发动屯田")).length,
      zhijianReplacementTriggersTuntian: zhijianDengai.equip.armor?.id === zhijianNewArmor.id && zhijianDengai.fields.length === 1 && zhijianDengai.fields[0].name === zhijianJudge.name && zhijianDengai.fields[0].suit === zhijianJudge.suit && zhijianDengai.fields[0].rank === zhijianJudge.rank,
      zhijianReplacementTuntianLogCount: zhijianLog.filter((entry) => entry.includes("邓艾 发动屯田")).length,
      lordKillLoyalTriggersLianying: lordLianying.hand.some((card) => card.id === lordLianyingDraw.id),
      lordKillLoyalLianyingLogCount: lordKillLoyalLog.filter((entry) => entry.includes("陆逊 发动连营")).length,
      lordKillLoyalShowsDiscardedCards: lordKillLoyalLog.some((entry) => entry.includes("陆逊 误杀忠臣，弃置所有牌：♣5 杀")),
      buquSuccessSustainedOnce: buquOwner.alive && buquOwner.hp === 0 && buquOwner.buquPile.length === 1 && buquOwner.buquPile[0].id === buquFirst.id,
      buquSuccessDidNotLoopDraw: buquSuccessDeckRemaining === 1,
      buquSuccessLogCount: buquSuccessLog.filter((entry) => entry.includes("周泰 发动不屈") && entry.includes("点数不重复")).length,
      buquDuplicateFailedAndDied: !buquFailOwner.alive && buquFailOwner.buquPile.length === 2,
      buquDuplicateLogCount: buquFailLog.filter((entry) => entry.includes("周泰 发动不屈") && entry.includes("点数重复")).length,
      shensuEarlyUsed,
      shensuEarlySkippedJudgeAndDraw,
      shensuEarlyDamagedTarget: shensuEarlyLord.hp === 3,
      shensuEarlyLogCount: shensuEarlyLog.filter((entry) => entry.includes("夏侯渊 发动神速") && entry.includes("跳过判定阶段和摸牌阶段")).length,
      shensuPlayUsed,
      shensuPlayPaidEquip,
      shensuPlayDamagedTarget: shensuPlayLord.hp === 3,
      shensuPlayLogCount: shensuPlayLog.filter((entry) => entry.includes("夏侯渊 发动神速") && entry.includes("弃置 ♣5 的卢") && entry.includes("跳过出牌阶段")).length,
      shensuFreeActionRemoved: !shensuFreeActionExists,
      jijiangActiveRealSlashLeftProvider,
      jijiangActiveJianxiongGotRealSlash,
      jijiangActiveDamagedTarget,
      jijiangActiveCountsAsLordSlash,
      jijiangActiveLogCount: jijiangActiveLog.filter((entry) => entry.includes("刘备 发动激将") && entry.includes("张飞")).length,
      jijiangResponseOk,
      jijiangResponseUsedProviderSlash,
      jijiangResponseLogCount: jijiangResponseLog.filter((entry) => entry.includes("刘备 发动激将") && entry.includes("赵云")).length,
      hujiaResponseOk,
      hujiaProviderUsedDodge: hujiaProvider.hand.length === 0 && hujiaLog.some((entry) => entry.includes("夏侯惇 打出闪")),
      hujiaLogCount: hujiaLog.filter((entry) => entry.includes("曹操 发动护驾") && entry.includes("夏侯惇")).length,
      jiuyuanSaved,
      jiuyuanHpAfter: jiuyuanLord.hp,
      jiuyuanProviderUsedPeach: jiuyuanProvider.hand.length === 0 && jiuyuanLog.some((entry) => entry.includes("周瑜 使用桃，救援 孙权")),
      jiuyuanLogCount: jiuyuanLog.filter((entry) => entry.includes("孙权 发动救援")).length,
      jiuyuanNonWuNoExtra: jiuyuanNonWuSaved
        && jiuyuanNonWuLord.hp === 1
        && jiuyuanNonWuProvider.hand.length === 0
        && jiuyuanNonWuLog.some((entry) => entry.includes("赵云 使用桃，救援 孙权"))
        && !jiuyuanNonWuLog.some((entry) => entry.includes("孙权 发动救援")),
      jiuyuanSelfNoExtra: jiuyuanSelfSaved
        && jiuyuanSelfLord.hp === 1
        && jiuyuanSelfLord.hand.length === 0
        && jiuyuanSelfLog.some((entry) => entry.includes("孙权 使用桃，自救"))
        && !jiuyuanSelfLog.some((entry) => entry.includes("孙权 发动救援")),
      wanshaBlocksOtherPeach: !wanshaBlockedSaved
        && wanshaBlockedSaver.hand.some((card) => card.id === wanshaBlockedPeach.id)
        && wanshaBlockedLog.some((entry) => entry.includes("贾诩 的完杀生效"))
        && !wanshaBlockedLog.some((entry) => entry.includes("刘备 使用桃，救援 大乔")),
      wanshaAllowsCasterRescue: wanshaCasterSaved
        && wanshaCasterTarget.hp === 1
        && wanshaCaster.hand.length === 0
        && wanshaCasterLog.some((entry) => entry.includes("贾诩 使用桃，救援 大乔")),
      wanshaAllowsSelfRescue: wanshaSelfSaved
        && wanshaSelfTarget.hp === 1
        && wanshaSelfTarget.hand.length === 0
        && wanshaSelfLog.some((entry) => entry.includes("大乔 使用桃，自救")),
      ruoyuAwakenedWithJijiang: ruoyuLord.flags.ruoyuAwakened && hasSkill(ruoyuLord, "jijiang"),
      ruoyuMaxHpAndHealApplied: ruoyuLord.maxHp === 5 && ruoyuLord.hp === 2,
      ruoyuAwakenLogCount: ruoyuAwakenLog.filter((entry) => entry.includes("刘禅 觉醒若愚") && entry.includes("获得激将")).length,
      ruoyuJijiangResponseOk: ruoyuResponseOk,
      ruoyuJijiangUsedProviderSlash,
      ruoyuJijiangLogCount: ruoyuResponseLog.filter((entry) => entry.includes("刘禅 发动激将") && entry.includes("赵云")).length,
      zhijiWoundedHealed: zhijiWounded.flags.zhijiAwakened && zhijiWounded.hp === 2 && zhijiWounded.maxHp === 3 && hasSkill(zhijiWounded, "guanxing"),
      zhijiWoundedDidNotDraw: zhijiWounded.hand.length === 0,
      zhijiWoundedLogCount: zhijiWoundedLog.filter((entry) => entry.includes("姜维 觉醒志继") && entry.includes("回复 1 点体力") && entry.includes("获得观星")).length,
      zhijiFullDrew: zhijiFull.flags.zhijiAwakened && zhijiFull.hp === 3 && zhijiFull.maxHp === 3 && zhijiFull.hand.some((card) => card.id === zhijiDrawA.id) && zhijiFull.hand.some((card) => card.id === zhijiDrawB.id) && hasSkill(zhijiFull, "guanxing"),
      zhijiFullLogCount: zhijiFullLog.filter((entry) => entry.includes("姜维 觉醒志继") && entry.includes("摸 2 张牌") && entry.includes("获得观星")).length,
      xueyiDoesNotRaiseMaxHp: xueyiLord.maxHp === 5,
      xueyiHandLimit: xueyiLimit,
      xueyiKeptCardsAtLimit: xueyiKeptAtLimitOk,
      xueyiDiscardedOnlyAboveLimit: xueyiDiscardedOnlyAboveLimitOk,
      luanjiRepeatUseAvailable: repeatLuanjiActionAvailable,
      fangquanQueued,
      fangquanExtraTurnStartsTarget: fangquanExtraStep === "extra" && fangquanExtraCurrent === fangquanExtraTarget.id,
      fangquanExtraReturnStored: fangquanReturnToDuringExtra === fangquanOriginalNext.id,
      fangquanReturnsToOriginalNext: fangquanReturnStep === "return" && fangquanAfterExtraCurrent === fangquanOriginalNext.id,
      luanwuCanTargetCasterWhenNearest: luanwuJiaxu.hp === luanwuJiaxu.maxHp - 1 && luanwuLog.some((entry) => entry.includes("赵云 对 贾诩 造成 1 点普通伤害")),
      luanwuDoesNotForceNearestAllyOverCaster: luanwuLord.hp === luanwuLord.maxHp - 1 && !luanwuLog.some((entry) => entry.includes("赵云 对 曹操 造成 1 点普通伤害")),
      luanwuCasterTargetLogCount: luanwuLog.filter((entry) => entry.includes("赵云 对 贾诩 造成 1 点普通伤害")).length,
      jiaxuHasLuanwuSkill: GENERALS.find((general) => general.id === "jiaxu")?.skills.includes("luanwu"),
      yuanshuWeidiHasJijiang,
      yongsiDrawsByKingdomCount: yongsiDrawCount === 6,
      yongsiDiscardsByKingdomCount: yongsiDiscarder.hand.length === 1 && yongsiDiscardLog.some((entry) => entry.includes("袁术 的庸肆弃置 4 张牌")),
      enyuanPunishesDamageSource: enyuanSource.hp === 2 && enyuanPunishLog.some((entry) => entry.includes("法正") && entry.includes("恩怨")),
      enyuanRewardsHealer: enyuanHealDraw === 1,
      xuanhuoMovesConcreteCard: xuanhuoRecipient.hand.some((card) => card.id === xuanhuoArmor.id) && !xuanhuoReceiver.equip.armor,
      xuanhuoLogShowsTransfer: xuanhuoLog.some((entry) => entry.includes("眩惑") && entry.includes("八卦阵") && entry.includes("张飞")),
      wuyanSourceBlocksTrick,
      wuyanTargetBlocksBorrowSword: wuyanBorrowXushu.equip.weapon?.id === wuyanBorrowWeapon.id && !wuyanBorrowSource.hand.some((card) => card.id === wuyanBorrowWeapon.id),
      wuyanTargetBorrowSwordLogCount: wuyanBorrowLog.filter((entry) => entry.includes("徐庶 的无言") && entry.includes("借刀杀人")).length,
      wuyanTargetBlocksChain: !wuyanChainXushu.linked,
      wuyanTargetChainLogCount: wuyanChainLog.filter((entry) => entry.includes("徐庶 的无言") && entry.includes("铁索连环")).length,
      wuyanTargetBlocksTaoyuanOnlyForXushu: wuyanTaoyuanXushu.hp === 1 && wuyanTaoyuanOther.hp === 2,
      wuyanTargetTaoyuanLogCount: wuyanTaoyuanLog.filter((entry) => entry.includes("徐庶 的无言") && entry.includes("桃园结义")).length,
      wuyanTargetBlocksHarvestOnlyForXushu: wuyanHarvestXushu.hand.length === 0 && wuyanHarvestSource.hand.length === 1 && wuyanHarvestOther.hand.length === 1,
      wuyanTargetHarvestLogCount: wuyanHarvestLog.filter((entry) => entry.includes("徐庶 的无言") && entry.includes("五谷丰登")).length,
      wuyanSourceGlobalKeepsSelfEffect: wuyanSelfTaoyuan.hp === 2 && wuyanSelfOther.hp === 1,
      wuyanSourceGlobalLogCount: wuyanSelfTaoyuanLog.filter((entry) => entry.includes("徐庶 的无言") && entry.includes("桃园结义") && entry.includes("曹操")).length,
      jujianDrawsAndHeals: xushuTarget.hand.length === 3 && xushu.hp === 3 && [jujianDrawA.id, jujianDrawB.id, jujianDrawC.id].every((id) => xushuTarget.hand.some((card) => card.id === id)),
      jujianLogShowsSupport: jujianLog.some((entry) => entry.includes("徐庶 发动举荐") && entry.includes("曹操 摸 3 张牌")),
      jueqingTurnsDamageIntoHpLoss: jueqingTarget.hp === 3 && !jueqingTarget.hand.some((card) => card.id === jueqingSlash.id) && jueqingLog.some((entry) => entry.includes("绝情") && entry.includes("失去 1 点体力")),
      shangshiReplenishesToLostHpCap: zhangchunhua.hand.length === 2 && shangshiLog.some((entry) => entry.includes("张春华 发动伤逝")),
      ganluSwapsEquipmentZones: ganluB.equip.armor?.id === ganluArmor.id && !ganluA.equip.armor,
      ganluTriggersLoseEquipEffects: ganluA.hp === 3 && ganluA.hand.some((card) => card.id === ganluXiaojiDrawA.id) && ganluA.hand.some((card) => card.id === ganluXiaojiDrawB.id),
      ganluLogShowsBothPlayers: ganluLog.some((entry) => entry.includes("吴国太 发动甘露") && entry.includes("孙尚香") && entry.includes("刘备")),
      ganluLogShowsLoseEquipTriggers: ganluLog.some((entry) => entry.includes("孙尚香 失去白银狮子")) && ganluLog.some((entry) => entry.includes("孙尚香 发动枭姬")),
      buyiSavesWithNonBasicReveal: buyiSaved && buyiTarget.hp === 1 && buyiLog.some((entry) => entry.includes("吴国太 发动补益") && entry.includes("无中生有")),
      anxuMovesAndRevealsHandCard: anxuLow.hand.some((card) => card.id === anxuMoved.id) && bulianshi.hand.some((card) => card.id === anxuDraw.id),
      anxuLogShowsRevealedCard: anxuLog.some((entry) => entry.includes("步练师 发动安恤") && entry.includes("桃")),
      zhuiyiRewardsNonKiller: zhuiyiBeneficiary.hand.length === 3 && zhuiyiBeneficiary.hp === 3 && zhuiyiKiller.hand.length === 0,
      zhuiyiLogShowsReward: zhuiyiLog.some((entry) => entry.includes("步练师 发动追忆") && entry.includes("孙权")),
      haoshiStrictDrawsExtraAndGivesHalf: strictHaoshiLusu.hand.length === 4 && strictHaoshiLowest.hand.length === 3,
      haoshiStrictTargetIsLowestHand: strictHaoshiLowest.hand.length === 3 && strictHaoshiOther.hand.length === 1,
      haoshiStrictLogShowsHalfGift: strictHaoshiLog.some((entry) => entry.includes("因好施手牌超过 5") && entry.includes("马超") && entry.includes("3 张牌")),
      zhihengAvailableWithOnlyEquipment: zhihengEquipOnlyActionExists,
      zhihengDiscardsEquipmentAndDraws,
      zhihengEquipLogShowsExactCard,
      zhihengEquipTriggersLoseEquipSkills,
      zhihengXiaojiLogCount: zhihengXiaojiLog.filter((entry) => entry.includes("孙尚香 发动枭姬")).length,
      humanZhihengCanSelectEquipment,
      dimengStrictCostAndSwap: strictDimengLusu.hand.length === 0 && strictDimengRich.hand.length === poorCards.length && strictDimengPoor.hand.length === richCards.length,
      dimengStrictDiscardedExactCost: strictDimengDiscard.some((card) => card.id === dimengCostA.id) && strictDimengDiscard.some((card) => card.id === dimengCostB.id),
      dimengStrictLogShowsCost: strictDimengLog.some((entry) => entry.includes("鲁肃 发动缔盟") && entry.includes("弃置 2 张牌") && entry.includes("赵云") && entry.includes("马超")),
      dimengZeroCostLegalWithoutHand: zeroCostDimengLegal,
      dimengAllowsEquipmentCost: equipCostDimengLegal && !equipCostDimengLusu.equip.weapon && !equipCostDimengLusu.equip.armor && equipCostDimengRich.hand.length === equipPoorCards.length && equipCostDimengPoor.hand.length === equipRichCards.length,
      dimengEquipmentCostLogged: equipCostDimengDiscard.some((card) => card.id === dimengCostWeapon.id) && equipCostDimengDiscard.some((card) => card.id === dimengCostArmor.id) && equipCostDimengLog.filter((entry) => entry.includes("鲁肃 因 缔盟 弃置装备区")).length >= 2,
      humanDimengOneStepPick: humanDimengPickPrompt.includes("一次选择两名") && humanDimengPickBounds.min === 2 && humanDimengPickBounds.max === 2 && humanDimengAfterFirst === 1 && humanDimengAfterSecond === 2,
      humanDimengSelectionValid,
      humanDimengPickedBothTargets: humanDimengPicked.length === 2 && humanDimengPicked.some((target) => target.id === humanDimengA.id) && humanDimengPicked.some((target) => target.id === humanDimengB.id),
      qiceShowsAllCostCards: qiceLog.some((entry) => entry.includes("荀攸 发动奇策") && entry.includes("♠8 杀") && entry.includes("♦J 闪") && entry.includes("当作 无中生有")),
      baonueLoyalHealedLord: baonueLord.hp === 4,
      baonueLoyalJudgedOnLord: baonueLoyalLog.some((entry) => entry.includes("董卓 的 暴虐 判定")),
      baonueLoyalLogCount: baonueLoyalLog.filter((entry) => entry.includes("于吉 发动暴虐") && entry.includes("董卓")).length,
      baonueRebelDidNotHealLord: baonueEnemyLord.hp === 3,
      baonueRebelDidNotJudge: !baonueRebelLog.some((entry) => entry.includes("暴虐 判定")),
      baonueRebelLogCount: baonueRebelLog.filter((entry) => entry.includes("发动暴虐")).length,
      songweiLoyalDrewForLord: songweiLord.hand.some((card) => card.id === songweiReward.id),
      songweiLoyalJudgeCardDiscarded,
      songweiLoyalLogCount: songweiLoyalLog.filter((entry) => entry.includes("夏侯惇 发动颂威") && entry.includes("曹丕")).length,
      songweiRebelDidNotDrawForLord: songweiEnemyLord.hand.length === 0,
      songweiRebelLogCount: songweiRebelLog.filter((entry) => entry.includes("发动颂威")).length,
      zhibaLoseGavePindianCardsToLord: zhibaLoseLord.hand.some((card) => card.id === zhibaLoseLordCard.id) && zhibaLoseLord.hand.some((card) => card.id === zhibaLoseSourceCard.id),
      zhibaLoseSourceDidNotDraw: zhibaLoseSource.hand.length === 0,
      zhibaLoseLogCount: zhibaLoseLog.filter((entry) => entry.includes("孙策 因制霸获得两张拼点牌")).length,
      zhibaWinDidNotDraw: zhibaWinSource.hand.length === 0 && zhibaWinLord.hand.length === 0,
      zhibaWinDiscardedPindianCards,
      zhibaWinLogCount: zhibaWinLog.filter((entry) => entry.includes("周瑜 制霸拼点成功，拼点牌进入弃牌堆")).length,
      benghuaiHighChoseLoseHp: benghuaiHigh.hp === 4 && benghuaiHigh.maxHp === 9,
      benghuaiHighLogCount: benghuaiHighLog.filter((entry) => entry.includes("董卓 发动崩坏，失去 1 点体力。")).length,
      benghuaiLowChoseLoseMaxHp: benghuaiLow.hp === 2 && benghuaiLow.maxHp === 8,
      benghuaiLowAvoidedDying: benghuaiLow.alive && benghuaiLow.hp > 0,
      benghuaiLowLogCount: benghuaiLowLog.filter((entry) => entry.includes("董卓 发动崩坏，失去 1 点体力上限。")).length,
      luoyiAiSkipsWithoutAttackCard: !luoyiNoAttackUser.turn.luoyi && luoyiNoAttackUser.hand.length === 3 && !luoyiNoAttackLog.some((entry) => entry.includes("许褚 发动裸衣")),
      luoyiAiUsesWithReadySlash: luoyiSlashUser.turn.luoyi && luoyiSlashUser.hand.length === 2 && luoyiSlashDrawLog.some((entry) => entry.includes("许褚 发动裸衣")) && luoyiSlashDrawLog.some((entry) => entry.includes("许褚 摸 1 张牌")),
      luoyiSlashDamagePlusOne: luoyiSlashTarget.hp === 2 && luoyiSlashDamageLog.some((entry) => entry.includes("许褚 对 曹操 造成 2 点普通伤害")),
      luoyiDuelDamagePlusOne: luoyiDuelUser.turn.luoyi
        && luoyiDuelUser.hand.length === 2
        && luoyiDuelTarget.hp === 2
        && luoyiDuelDrawLog.some((entry) => entry.includes("许褚 发动裸衣"))
        && luoyiDuelDamageLog.some((entry) => entry.includes("许褚 对 曹操 造成 2 点普通伤害")),
      jushouFlipsAfterEnd: jushouHandAfterEnd === 3 && jushouDeckAfterEnd === 2 && jushouFlagAfterEnd && jushouEndLog.some((entry) => entry.includes("曹仁 发动据守，摸三张牌并翻面")),
      jushouSkipsWholeNextTurn: !jushouCaoren.flags.skipTurnOnce && jushouHandAfterSkip === jushouHandAfterEnd && jushouDeckAfterSkip === jushouDeckAfterEnd && jushouSkipLog.some((entry) => entry.includes("曹仁 翻回正面，跳过本回合")) && !jushouSkipLog.some((entry) => entry.includes("摸")),
      fangzhuFlipsTarget: fangzhuHandAfterFlip === 2 && fangzhuDeckAfterFlip === 2 && fangzhuFlagAfterFlip && fangzhuLog.some((entry) => entry.includes("曹丕 发动放逐") && entry.includes("曹操") && entry.includes("翻面")),
      fangzhuSkipsWholeNextTurn: !fangzhuLord.flags.skipTurnOnce && fangzhuHandAfterSkip === fangzhuHandAfterFlip && fangzhuDeckAfterSkip === fangzhuDeckAfterFlip && fangzhuSkipLog.some((entry) => entry.includes("曹操 翻回正面，跳过本回合")) && !fangzhuSkipLog.some((entry) => entry.includes("摸")),
      fangzhuBoardShowsBackSide: fangzhuCardHtml.includes(">背面</span>"),
      kurouAvailableBefore,
      kurouAvailableAfterFirst,
      kurouCanRepeatSameTurn: kurouHuangGai.hp === 1 && kurouHuangGai.hand.length === 6 && kurouLog.filter((entry) => entry.includes("黄盖 发动苦肉")).length === 3,
      kurouAvailableAtOneHp,
      kurouLowHpScoreAvoidsAiSuicide: kurouLowHpScore < -5,
      kurouDyingRescueThenDraws: kurouDyingHuangGai.alive
        && kurouDyingHuangGai.hp === 1
        && kurouDyingHuangGai.hand.length === 2
        && kurouDyingHuangGai.hand.some((card) => card.id === kurouDrawA.id)
        && kurouDyingHuangGai.hand.some((card) => card.id === kurouDrawB.id)
        && !kurouDyingHuangGai.hand.some((card) => card.id === kurouSelfPeach.id),
      kurouDyingLogShowsRescueBeforeDraw: kurouDyingLog.some((entry) => entry.includes("黄盖 濒死"))
        && kurouDyingLog.some((entry) => entry.includes("黄盖 使用桃，自救"))
        && kurouDyingLog.some((entry) => entry.includes("黄盖 摸 2 张牌")),
      qiangxiLegalAtOneHp: qiangxiOneHpLegal,
      qiangxiLowHpScoreAvoidsAiSuicide: qiangxiOneHpScore < -5,
      qiangxiHumanCanChooseHpCost: qiangxiHpPrompt.includes("弃置武器或失去 1 点体力")
        && qiangxiHpLabels.some((label) => label.includes("失去 1 点体力"))
        && qiangxiHpLabels.some((label) => label.includes("弃置武器"))
        && qiangxiHpDianwei.hp === 2
        && qiangxiHpDianwei.equip.weapon?.id === qiangxiHpWeapon.id
        && qiangxiHpLord.hp === 3
        && qiangxiHpDianwei.turn.usedSkills.qiangxi === true,
      qiangxiHumanCanChooseWeaponCost: qiangxiWeaponLabels.some((label) => label.includes("弃置武器"))
        && qiangxiWeaponDianwei.hp === 3
        && !qiangxiWeaponDianwei.equip.weapon
        && qiangxiWeaponDiscarded
        && qiangxiWeaponLord.hp === 3
        && qiangxiWeaponDianwei.turn.usedSkills.qiangxi === true,
      qiangxiLogsChosenCosts: qiangxiHpLog.some((entry) => entry.includes("典韦 失去 1 点体力发动强袭"))
        && qiangxiWeaponLog.some((entry) => entry.includes("典韦 弃置 ♠7 青釭剑 发动强袭")),
      quhuHumanPindianPrompted: quhuPindianPrompt.includes("驱虎") && quhuPindianPicked,
      quhuHumanChoosesDamageTarget: quhuVictimPrompt.includes("驱虎")
        && quhuVictimPrompt.includes("吕布")
        && quhuValidVictimNames.includes("张飞")
        && quhuValidVictimNames.includes("你(荀彧)"),
      quhuHumanChosenVictimDamaged: quhuChosenVictim.hp === 3 && quhuHuman.hp === 3 && quhuTiger.hp === 4,
      quhuHumanLogShowsChosenVictim: quhuLog.some((entry) => entry.includes("你(荀彧) 驱虎成功，令 吕布 对 张飞 造成 1 点伤害")),
      tianyiWinAllowsDistanceFreeSlash: tianyiSlashAction?.targetMode === "tianyiSlash"
        && tianyiTargets.some((target) => target.id === tianyiFar.id)
        && distance(tianyiTaishi, tianyiFar) > attackRange(tianyiTaishi),
      tianyiWinAllowsTwoSlashTargets: tianyiBounds.max === 2
        && tianyiAIMultiTarget?.targets?.length === 2,
      tianyiMultiTargetSlashConsumesOneUse: tianyiNear.hp === 3
        && tianyiFar.hp === 3
        && tianyiTaishi.turn.slashUsed === 1
        && tianyiLog.some((entry) => entry.includes("太史慈 使用 杀，目标 刘备、黄盖")),
      shuangxiongGivesOnlyJudgeCard: shuangxiongUser.hand.some((card) => card.id === shuangxiongJudge.id)
        && !shuangxiongUser.hand.some((card) => card.id === shuangxiongSkippedDrawA.id)
        && !shuangxiongUser.hand.some((card) => card.id === shuangxiongSkippedDrawB.id)
        && state.deck.some((card) => card.id === shuangxiongSkippedDrawA.id)
        && state.deck.some((card) => card.id === shuangxiongSkippedDrawB.id),
      shuangxiongOppositeColorAsDuel: shuangxiongUser.turn.shuangxiongColor === "black"
        && shuangxiongDuelAction?.consumeId === shuangxiongHand.id
        && shuangxiongDuelAction?.card?.name === "决斗",
      shuangxiongLogShowsJudgeOnly: shuangxiongLog.some((entry) => entry.includes("颜良文丑 发动双雄，获得 ♥7 闪"))
        && shuangxiongLog.some((entry) => entry.includes("颜良文丑 摸 0 张牌")),
      noMissSlashSuppressed: !noMissSlashLog.some((entry) => entry.includes("未响应闪")) && noMissSlashLog.some((entry) => entry.includes("张飞 对 赵云 造成 1 点普通伤害")),
      noMissMassSuppressed: !noMissMassLog.some((entry) => entry.includes("未响应杀")) && noMissMassLog.some((entry) => entry.includes("张飞 对 赵云 造成 1 点普通伤害")),
      aiMassSlashResponseOk,
      aiMassSlashConsumed,
      aiMassSlashResponseLogCount: aiMassSlashLog.filter((entry) => entry.includes("张飞 打出杀，响应 马超 的南蛮入侵")).length,
      noMissTiaoxinSuppressed: !noMissTiaoxinLog.some((entry) => entry.includes("未响应杀")),
      juxiangIgnoresNanmanAndGainsIt: juxiangZhurong.hp === 4 && juxiangZhurong.hand.some((card) => card.id === juxiangNanman.id),
      juxiangNanmanNotDiscardedAfterGain,
      juxiangLogShowsResolvedGain: juxiangLog.some((entry) => entry.includes("祝融 发动巨象") && entry.includes("获得结算后的 ♠7 南蛮入侵")),
      juxiangDoesNotRecoverOwnNanman: !juxiangSelf.hand.some((card) => card.id === juxiangSelfNanman.id) && state.discard.some((card) => card.id === juxiangSelfNanman.id),
      juxiangSelfUseNoGainLog: !juxiangSelfLog.some((entry) => entry.includes("祝融 发动巨象") && entry.includes("获得结算后的")),
      deathRevealPublicToAll,
      deathRevealUpdatesReads: deathRevealLordRead === 2.2 && deathRevealTraitorRead === 2.2,
      deathRevealLogShowsRole: deathRevealLog.some((entry) => entry.includes("张飞 被 关羽 击杀，身份为 反贼")),
      deathKillRebelLoyalSignal: deathKillRebelRead < -0.5,
      aoeDamageReadCapped: aoeRead > 0.5 && aoeRead < 1.1,
      aoeDamageReadWeakReason: aoeReadReasons.some((reason) => reason.includes("AOE伤害只作弱证据")),
      logTail: state.log.slice(-8)
    };
  }

  function aiSupportScenarioSummary() {
    const huatuo = makeScenarioPlayer(0, "huatuo", "反贼");
    const suspectedRebel = makeScenarioPlayer(1, "zhangfei", "忠臣", { revealed: false, hp: 2 });
    const suspectedLoyal = makeScenarioPlayer(2, "guanyu", "忠臣", { revealed: false, hp: 2 });
    const lord = makeScenarioPlayer(3, "caocao", "主公");
    setupScenarioState([huatuo, suspectedRebel, suspectedLoyal, lord], { current: 0 });
    huatuo.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♣", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8")
    ];
    huatuo.turn = { usedSkills: {} };
    state.reads[huatuo.id][suspectedRebel.id] = 1.8;
    state.readReasons[huatuo.id][suspectedRebel.id] = ["偏反 +1.8：曾明显进攻主公"];
    state.reads[huatuo.id][suspectedLoyal.id] = -1.8;
    state.readReasons[huatuo.id][suspectedLoyal.id] = ["偏忠 -1.8：持续支援主公"];
    const qingnangAllyScore = scoreMove(huatuo, { type: "skill", skill: "qingnang", targets: [suspectedRebel], scoreHint: 1.2 });
    const qingnangLoyalScore = scoreMove(huatuo, { type: "skill", skill: "qingnang", targets: [suspectedLoyal], scoreHint: 1.2 });
    const qingnangAllyBonus = supportTeamworkScore(huatuo, suspectedRebel, "heal");
    const qingnangLoyalBonus = supportTeamworkScore(huatuo, suspectedLoyal, "heal");
    const qingnangBest = buildAIMoves(huatuo).filter((move) => move.skill === "qingnang")[0] || null;
    const qingnangAllyMove = buildAIMoves(huatuo).find((move) => move.skill === "qingnang" && move.targets?.[0]?.id === suspectedRebel.id) || null;

    const liubei = makeScenarioPlayer(0, "liubei", "反贼", { hp: 3 });
    const giftRebel = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false, hp: 3 });
    const giftLoyal = makeScenarioPlayer(2, "zhaoyun", "忠臣", { revealed: false, hp: 3 });
    const giftLord = makeScenarioPlayer(3, "sunquan", "主公");
    setupScenarioState([liubei, giftRebel, giftLoyal, giftLord], { current: 0 });
    liubei.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♦", "6"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "2")
    ];
    liubei.turn = { usedSkills: {}, gaveByRende: 0 };
    state.reads[liubei.id][giftRebel.id] = 1.75;
    state.reads[liubei.id][giftLoyal.id] = -1.75;
    const rendeAllyCards = chooseRendeCards(liubei, giftRebel, liubei.hand.length).map((card) => card.name);
    const rendeLoyalCards = chooseRendeCards(liubei, giftLoyal, liubei.hand.length).map((card) => card.name);
    const rendeAllyScore = scoreMove(liubei, { type: "skill", skill: "rende", targets: [giftRebel], scoreHint: 1 });
    const rendeLoyalScore = scoreMove(liubei, { type: "skill", skill: "rende", targets: [giftLoyal], scoreHint: 1 });
    const rendeBest = buildAIMoves(liubei).filter((move) => move.skill === "rende")[0] || null;

    const zhangzhao = makeScenarioPlayer(0, "zhangzhaozhanghong", "反贼", { hp: 3 });
    const equipRebel = makeScenarioPlayer(1, "zhangfei", "忠臣", { revealed: false, hp: 3 });
    const equipLoyal = makeScenarioPlayer(2, "guanyu", "忠臣", { revealed: false, hp: 3 });
    const equipLord = makeScenarioPlayer(3, "caocao", "主公");
    setupScenarioState([zhangzhao, equipRebel, equipLoyal, equipLord], { current: 0 });
    zhangzhao.hand = [createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♠", "2")];
    zhangzhao.turn = { usedSkills: {} };
    state.reads[zhangzhao.id][equipRebel.id] = 1.8;
    state.readReasons[zhangzhao.id][equipRebel.id] = ["偏反 +1.8：曾明显进攻主公"];
    state.reads[zhangzhao.id][equipLoyal.id] = -1.8;
    state.readReasons[zhangzhao.id][equipLoyal.id] = ["偏忠 -1.8：持续支援主公"];
    const zhijianAllyScore = scoreMove(zhangzhao, { type: "skill", skill: "zhijian", targets: [equipRebel], scoreHint: 0.95 });
    const zhijianLoyalScore = scoreMove(zhangzhao, { type: "skill", skill: "zhijian", targets: [equipLoyal], scoreHint: 0.95 });
    const zhijianMoves = buildAIMoves(zhangzhao).filter((move) => move.skill === "zhijian");
    const zhijianBest = zhijianMoves[0] || null;
    const zhijianAllyMove = zhijianMoves.find((move) => move.targets?.[0]?.id === equipRebel.id) || null;

    const liushan = makeScenarioPlayer(0, "liushan", "反贼", { hp: 3 });
    const turnRebel = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false, hp: 3 });
    const turnLoyal = makeScenarioPlayer(2, "zhaoyun", "忠臣", { revealed: false, hp: 3 });
    const turnLord = makeScenarioPlayer(3, "sunquan", "主公");
    setupScenarioState([liushan, turnRebel, turnLoyal, turnLord], { current: 0 });
    liushan.hand = [createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "2")];
    liushan.turn = { usedSkills: {} };
    turnRebel.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9")
    ];
    turnLoyal.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♥", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♣", "9"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "Q")
    ];
    state.reads[liushan.id][turnRebel.id] = 1.8;
    state.readReasons[liushan.id][turnRebel.id] = ["偏反 +1.8：曾明显进攻主公"];
    state.reads[liushan.id][turnLoyal.id] = -1.8;
    state.readReasons[liushan.id][turnLoyal.id] = ["偏忠 -1.8：持续支援主公"];
    const fangquanBestTarget = bestExtraTurnTarget(liushan);
    const fangquanMove = buildAIMoves(liushan).find((move) => move.skill === "fangquan") || null;

    const sunshangxiang = makeScenarioPlayer(0, "sunshangxiang", "反贼", { hp: 2 });
    const marriageRebel = makeScenarioPlayer(1, "zhangfei", "忠臣", { revealed: false, hp: 2 });
    const marriageLoyal = makeScenarioPlayer(2, "guanyu", "忠臣", { revealed: false, hp: 2 });
    const marriageLord = makeScenarioPlayer(3, "caocao", "主公");
    setupScenarioState([sunshangxiang, marriageRebel, marriageLoyal, marriageLord], { current: 0 });
    sunshangxiang.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "9")
    ];
    sunshangxiang.turn = { usedSkills: {} };
    state.reads[sunshangxiang.id][marriageRebel.id] = 1.8;
    state.reads[sunshangxiang.id][marriageLoyal.id] = -1.8;
    const jieyinAllyScore = scoreMove(sunshangxiang, { type: "skill", skill: "jieyin", targets: [marriageRebel], scoreHint: 1.1 });
    const jieyinLoyalScore = scoreMove(sunshangxiang, { type: "skill", skill: "jieyin", targets: [marriageLoyal], scoreHint: 1.1 });
    const jieyinMoves = buildAIMoves(sunshangxiang).filter((move) => move.skill === "jieyin");
    const jieyinBest = jieyinMoves[0] || null;
    const jieyinAllyMove = jieyinMoves.find((move) => move.targets?.[0]?.id === marriageRebel.id) || null;

    const xunyu = makeScenarioPlayer(0, "xunyu", "反贼", { hp: 2 });
    const jiemingRebel = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false, hp: 3 });
    const jiemingLoyal = makeScenarioPlayer(2, "zhaoyun", "忠臣", { revealed: false, hp: 3 });
    const jiemingLord = makeScenarioPlayer(3, "sunquan", "主公");
    setupScenarioState([xunyu, jiemingRebel, jiemingLoyal, jiemingLord], { current: 0 });
    xunyu.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "5"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "6"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♦", "9")
    ];
    state.reads[xunyu.id][jiemingRebel.id] = 1.8;
    state.reads[xunyu.id][jiemingLoyal.id] = -1.8;
    const jiemingAllyScore = scoreJieming(xunyu, jiemingRebel);
    const jiemingLoyalScore = scoreJieming(xunyu, jiemingLoyal);
    const jiemingBest = bestJiemingTarget(xunyu);

    const guojia = makeScenarioPlayer(0, "guojia", "反贼", { hp: 2 });
    const yijiRebel = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false, hp: 2 });
    const yijiSecondRebel = makeScenarioPlayer(2, "zhangfei", "忠臣", { revealed: false, hp: 3 });
    const yijiLoyal = makeScenarioPlayer(3, "zhaoyun", "忠臣", { revealed: false, hp: 3 });
    const yijiLord = makeScenarioPlayer(4, "sunquan", "主公");
    setupScenarioState([guojia, yijiRebel, yijiSecondRebel, yijiLoyal, yijiLord], { current: 0 });
    const yijiCards = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "2")
    ];
    guojia.hand = yijiCards.slice();
    state.reads[guojia.id][yijiRebel.id] = 1.8;
    state.reads[guojia.id][yijiSecondRebel.id] = 1.55;
    state.reads[guojia.id][yijiLoyal.id] = -1.8;
    const yijiAllyScore = scoreYijiRecipient(guojia, yijiRebel, yijiCards);
    const yijiSecondAllyScore = scoreYijiRecipient(guojia, yijiSecondRebel, yijiCards);
    const yijiLoyalScore = scoreYijiRecipient(guojia, yijiLoyal, yijiCards);
    const yijiPlan = yijiDistributionPlan(guojia, yijiCards);
    const yijiGifted = yijiPlan ? removeHandCards(guojia, yijiPlan.cards.map((card) => card.id)) : [];
    if (yijiPlan && yijiGifted.length) {
      yijiPlan.allocations.forEach((allocation) => {
        const moved = yijiGifted.filter((card) => allocation.cards.some((gift) => gift.id === card.id));
        allocation.target.hand.push(...moved);
      });
    }
    const yijiAllocationTargets = yijiPlan?.allocations?.map((allocation) => allocation.target.general.name) || [];

    const haoshiLusu = makeScenarioPlayer(0, "lusu", "反贼", { hp: 3 });
    const haoshiRebel = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false, hp: 2 });
    const haoshiLoyal = makeScenarioPlayer(2, "zhaoyun", "忠臣", { revealed: false, hp: 3 });
    const haoshiLord = makeScenarioPlayer(3, "sunquan", "主公");
    setupScenarioState([haoshiLusu, haoshiRebel, haoshiLoyal, haoshiLord], { current: 0 });
    haoshiLusu.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "9")
    ];
    state.reads[haoshiLusu.id][haoshiRebel.id] = 1.8;
    state.reads[haoshiLusu.id][haoshiLoyal.id] = -1.8;
    const haoshiTarget = chooseHaoshiTarget(haoshiLusu);
    const haoshiGiftCards = chooseHaoshiCards(haoshiLusu, haoshiRebel, 2).map((card) => card.name);
    const haoshiShouldUse = aiShouldUseHaoshi(haoshiLusu, 2);
    const haoshiEnemyOnly = makeScenarioPlayer(0, "lusu", "反贼", { hp: 3 });
    const haoshiEnemyOnlyAlly = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false, hp: 3 });
    const haoshiEnemyOnlyLoyal = makeScenarioPlayer(2, "zhaoyun", "忠臣", { revealed: false, hp: 3 });
    const haoshiEnemyOnlyLord = makeScenarioPlayer(3, "sunquan", "主公");
    setupScenarioState([haoshiEnemyOnly, haoshiEnemyOnlyAlly, haoshiEnemyOnlyLoyal, haoshiEnemyOnlyLord], { current: 0 });
    haoshiEnemyOnly.hand = haoshiLusu.hand.slice();
    haoshiEnemyOnlyAlly.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "4")];
    state.reads[haoshiEnemyOnly.id][haoshiEnemyOnlyAlly.id] = 1.8;
    state.reads[haoshiEnemyOnly.id][haoshiEnemyOnlyLoyal.id] = -1.8;
    const haoshiEnemyOnlyTarget = chooseHaoshiTarget(haoshiEnemyOnly);
    const haoshiEnemyOnlyUse = aiShouldUseHaoshi(haoshiEnemyOnly, 2);

    const yinghunSunJian = makeScenarioPlayer(0, "sunjian", "反贼", { hp: 2 });
    const yinghunRebel = makeScenarioPlayer(1, "zhangfei", "忠臣", { revealed: false, hp: 2 });
    const yinghunLoyal = makeScenarioPlayer(2, "guanyu", "忠臣", { revealed: false, hp: 3 });
    const yinghunLord = makeScenarioPlayer(3, "caocao", "主公");
    setupScenarioState([yinghunSunJian, yinghunRebel, yinghunLoyal, yinghunLord], { current: 0 });
    state.reads[yinghunSunJian.id][yinghunRebel.id] = 1.8;
    state.reads[yinghunSunJian.id][yinghunLoyal.id] = -1.8;
    const yinghunLost = yinghunSunJian.maxHp - yinghunSunJian.hp;
    const yinghunBest = bestYinghunMove(yinghunSunJian, yinghunLost);
    const yinghunAllyScore = scoreYinghun(yinghunSunJian, yinghunRebel, yinghunLost, "drawLostDiscardOne");
    const yinghunLoyalScore = scoreYinghun(yinghunSunJian, yinghunLoyal, yinghunLost, "drawLostDiscardOne");

    const caopi = makeScenarioPlayer(0, "caopi", "反贼", { hp: 2 });
    const fangzhuRebel = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false, hp: 1 });
    const fangzhuLoyal = makeScenarioPlayer(2, "zhaoyun", "忠臣", { revealed: false, hp: 3 });
    const fangzhuLord = makeScenarioPlayer(3, "sunquan", "主公");
    setupScenarioState([caopi, fangzhuRebel, fangzhuLoyal, fangzhuLord], { current: 0 });
    fangzhuLoyal.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "6"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8")
    ];
    state.reads[caopi.id][fangzhuRebel.id] = 1.8;
    state.reads[caopi.id][fangzhuLoyal.id] = -1.8;
    const fangzhuCount = Math.max(1, caopi.maxHp - caopi.hp);
    const fangzhuBest = bestFangzhuTarget(caopi, alivePlayers().filter((p) => p.id !== caopi.id), fangzhuCount);
    const fangzhuAllyScore = scoreFangzhu(caopi, fangzhuRebel, fangzhuCount);
    const fangzhuEnemyScore = scoreFangzhu(caopi, fangzhuLoyal, fangzhuCount);

    const dimengLusu = makeScenarioPlayer(0, "lusu", "反贼", { hp: 3 });
    const dimengRebel = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false, hp: 2 });
    const dimengLoyal = makeScenarioPlayer(2, "zhaoyun", "忠臣", { revealed: false, hp: 3 });
    const dimengLord = makeScenarioPlayer(3, "sunquan", "主公");
    setupScenarioState([dimengLusu, dimengRebel, dimengLoyal, dimengLord], { current: 0 });
    dimengLusu.turn = { usedSkills: {} };
    dimengLusu.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "9"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "Q")
    ];
    dimengLoyal.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "10"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "J"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "K")
    ];
    state.reads[dimengLusu.id][dimengRebel.id] = 1.8;
    state.reads[dimengLusu.id][dimengLoyal.id] = -1.8;
    const dimengMoves = buildAIMoves(dimengLusu).filter((move) => move.skill === "dimeng");
    const dimengBest = dimengMoves[0] || null;
    const dimengPairNames = dimengBest?.targets?.map((target) => target.general.name) || [];
    const dimengAllyEnemyScore = scoreDimeng(dimengLusu, [dimengRebel, dimengLoyal]);

    const huangtianLord = makeScenarioPlayer(0, "zhangjiao", "主公", { hp: 2 });
    const huangtianLoyal = makeScenarioPlayer(1, "yuji", "忠臣", { hp: 4 });
    setupScenarioState([huangtianLord, huangtianLoyal], { current: huangtianLoyal.id });
    const huangtianDodge = createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8");
    const huangtianLightning = createCard(CARD_POOL.find((spec) => spec.name === "闪电"), "♠", "A");
    huangtianLoyal.hand = [huangtianDodge, huangtianLightning];
    huangtianLoyal.turn = { usedSkills: {} };
    const huangtianLoyalMove = buildAIMoves(huangtianLoyal).find((move) => move.skill === "huangtian") || null;
    const huangtianLoyalCard = chooseHuangtianCard(huangtianLoyal, huangtianLord);
    const huangtianLoyalAccepted = Boolean(huangtianLoyalMove && huangtianLoyalMove.score > aiMoveAcceptanceThreshold(huangtianLoyal, huangtianLoyalMove));
    const huangtianLoyalTarget = huangtianLoyalMove ? aiMoveTargetLabel(huangtianLoyal, huangtianLoyalMove) : "";

    const huangtianEnemyLord = makeScenarioPlayer(0, "zhangjiao", "主公", { hp: 2 });
    const huangtianRebel = makeScenarioPlayer(1, "yuji", "反贼", { hp: 4 });
    setupScenarioState([huangtianEnemyLord, huangtianRebel], { current: huangtianRebel.id });
    huangtianRebel.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪电"), "♠", "A")
    ];
    huangtianRebel.turn = { usedSkills: {} };
    const huangtianRebelMove = buildAIMoves(huangtianRebel).find((move) => move.skill === "huangtian") || null;
    const huangtianRebelAccepted = Boolean(huangtianRebelMove && huangtianRebelMove.score > aiMoveAcceptanceThreshold(huangtianRebel, huangtianRebelMove));

    const zhibaLord = makeScenarioPlayer(0, "sunce", "主公");
    const zhibaLoyal = makeScenarioPlayer(1, "zhouyu", "忠臣");
    setupScenarioState([zhibaLord, zhibaLoyal], { current: zhibaLoyal.id });
    zhibaLord.hand = [createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "K")];
    zhibaLoyal.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "4")];
    zhibaLoyal.turn = { usedSkills: {} };
    const zhibaLoyalMove = buildAIMoves(zhibaLoyal).find((move) => move.skill === "zhiba") || null;
    const zhibaLoyalAccepted = Boolean(zhibaLoyalMove && zhibaLoyalMove.score > aiMoveAcceptanceThreshold(zhibaLoyal, zhibaLoyalMove));

    const zhibaEnemyLord = makeScenarioPlayer(0, "sunce", "主公");
    const zhibaRebel = makeScenarioPlayer(1, "zhouyu", "反贼");
    setupScenarioState([zhibaEnemyLord, zhibaRebel], { current: zhibaRebel.id });
    zhibaEnemyLord.hand = [createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "4")];
    zhibaRebel.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "K")];
    zhibaRebel.turn = { usedSkills: {} };
    const zhibaRebelMove = buildAIMoves(zhibaRebel).find((move) => move.skill === "zhiba") || null;
    const zhibaRebelAccepted = Boolean(zhibaRebelMove && zhibaRebelMove.score > aiMoveAcceptanceThreshold(zhibaRebel, zhibaRebelMove));

    const moderateHuatuo = makeScenarioPlayer(0, "huatuo", "反贼", { hp: 3 });
    const moderateHumanAlly = makeScenarioPlayer(1, "machao", "忠臣", { isHuman: true, revealed: false, hp: 2 });
    const moderateEnemy = makeScenarioPlayer(2, "guanyu", "忠臣", { revealed: false, hp: 3 });
    const moderateLord = makeScenarioPlayer(3, "caocao", "主公", { hp: 4 });
    setupScenarioState([moderateHuatuo, moderateHumanAlly, moderateEnemy, moderateLord], { current: moderateHuatuo.id, aiMode: "strategist" });
    [moderateHuatuo, moderateHumanAlly, moderateEnemy, moderateLord].forEach((player) => {
      player.personality.trickiness = 0;
      player.personality.chaos = 0;
      player.personality.patience = 1;
      player.personality.loyalty = 1.1;
    });
    moderateHuatuo.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♣", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8")
    ];
    moderateHuatuo.turn = { usedSkills: {}, slashUsed: 0 };
    moderateHumanAlly.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♦", "7")];
    moderateEnemy.hand = [createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "Q")];
    state.reads[moderateHuatuo.id][moderateHumanAlly.id] = 0.95;
    state.readReasons[moderateHuatuo.id][moderateHumanAlly.id] = ["偏反 +1.0：你此前对主公做出进攻行为"];
    state.reads[moderateHuatuo.id][moderateEnemy.id] = -0.65;
    state.readReasons[moderateHuatuo.id][moderateEnemy.id] = ["偏忠 -0.7：持续保护主公"];
    const moderateMoves = buildAIMoves(moderateHuatuo);
    const moderateSupport = moderateMoves.find((move) => move.skill === "qingnang" && move.targets?.[0]?.id === moderateHumanAlly.id) || null;
    const moderateChosen = chooseAIMove(moderateHuatuo, moderateMoves);
    const moderateSupportThreshold = moderateSupport ? aiMoveAcceptanceThreshold(moderateHuatuo, moderateSupport) : 9;

    const selfEquipAI = makeScenarioPlayer(0, "zhangfei", "反贼", { hp: 2 });
    const selfEquipLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([selfEquipAI, selfEquipLord], { current: selfEquipAI.id, mode: "5", aiMode: "strategist" });
    selfEquipAI.personality.trickiness = 0;
    selfEquipAI.personality.caution = 1;
    selfEquipAI.hand = [createCard(CARD_POOL.find((spec) => spec.name === "白银狮子"), "♣", "A")];
    selfEquipAI.turn = { usedSkills: {}, slashUsed: 0 };
    const selfEquipMoves = buildAIMoves(selfEquipAI);
    const selfEquipMove = selfEquipMoves.find((move) => move.effect === "equip" && move.card?.name === "白银狮子") || null;
    const selfEquipThreshold = selfEquipMove ? aiMoveAcceptanceThreshold(selfEquipAI, selfEquipMove) : 9;
    const selfEquipTop = selfEquipMoves[0] || null;

    const drawTrickAI = makeScenarioPlayer(0, "luxun", "反贼", { hp: 3 });
    const drawTrickLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([drawTrickAI, drawTrickLord], { current: drawTrickAI.id, mode: "5", aiMode: "strategist" });
    drawTrickAI.personality.trickiness = 0;
    drawTrickAI.hand = [createCard(CARD_POOL.find((spec) => spec.name === "无中生有"), "♥", "7")];
    drawTrickAI.turn = { usedSkills: {}, slashUsed: 0 };
    const drawTrickMoves = buildAIMoves(drawTrickAI);
    const drawTrickMove = drawTrickMoves.find((move) => move.effect === "draw2") || null;
    const drawTrickThreshold = drawTrickMove ? aiMoveAcceptanceThreshold(drawTrickAI, drawTrickMove) : 9;

    const dismantleAI = makeScenarioPlayer(0, "ganning", "反贼", { hp: 3 });
    const dismantleLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([dismantleAI, dismantleLord], { current: dismantleAI.id, mode: "5", aiMode: "strategist" });
    dismantleAI.personality.trickiness = 0;
    dismantleAI.personality.caution = 1;
    dismantleAI.hand = [createCard(CARD_POOL.find((spec) => spec.name === "过河拆桥"), "♠", "Q")];
    dismantleAI.turn = { usedSkills: {}, slashUsed: 0 };
    dismantleLord.hand = [createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7")];
    dismantleLord.equip.armor = createCard(CARD_POOL.find((spec) => spec.name === "八卦阵"), "♠", "2");
    const dismantleMoves = buildAIMoves(dismantleAI);
    const dismantleMove = dismantleMoves.find((move) => move.effect === "dismantle" && move.targets?.[0]?.id === dismantleLord.id) || null;
    const dismantleThreshold = dismantleMove ? aiMoveAcceptanceThreshold(dismantleAI, dismantleMove) : 9;
    const dismantleChoice = dismantleMove ? chooseAITargetCard(dismantleAI, dismantleLord, "dismantle", targetCardOptions(dismantleLord)) : null;

    const stealAI = makeScenarioPlayer(0, "ganning", "反贼", { hp: 3 });
    const stealLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    setupScenarioState([stealAI, stealLord], { current: stealAI.id, mode: "5", aiMode: "strategist" });
    stealAI.personality.trickiness = 0;
    stealAI.personality.caution = 1;
    stealAI.hand = [createCard(CARD_POOL.find((spec) => spec.name === "顺手牵羊"), "♠", "3")];
    stealAI.turn = { usedSkills: {}, slashUsed: 0 };
    stealLord.hand = [createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "7")];
    stealLord.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    const stealMoves = buildAIMoves(stealAI);
    const stealMove = stealMoves.find((move) => move.effect === "steal" && move.targets?.[0]?.id === stealLord.id) || null;
    const stealThreshold = stealMove ? aiMoveAcceptanceThreshold(stealAI, stealMove) : 9;
    const stealChoice = stealMove ? chooseAITargetCard(stealAI, stealLord, "steal", targetCardOptions(stealLord)) : null;

    const borrowAI = makeScenarioPlayer(0, "ganning", "反贼", { hp: 3 });
    const borrowAllyWielder = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false, hp: 3 });
    const borrowEnemyWielder = makeScenarioPlayer(2, "guanyu", "忠臣", { revealed: false, hp: 3 });
    const borrowLord = makeScenarioPlayer(3, "caocao", "主公", { hp: 4 });
    setupScenarioState([borrowAI, borrowAllyWielder, borrowEnemyWielder, borrowLord], { current: borrowAI.id, mode: "5", aiMode: "strategist" });
    [borrowAI, borrowAllyWielder, borrowEnemyWielder, borrowLord].forEach((player) => {
      player.personality.trickiness = 0;
      player.personality.chaos = 0;
      player.personality.caution = 1;
      player.personality.patience = 1;
    });
    borrowAI.hand = [createCard(CARD_POOL.find((spec) => spec.name === "借刀杀人"), "♣", "Q")];
    borrowAI.turn = { usedSkills: {}, slashUsed: 0 };
    borrowAllyWielder.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7")];
    borrowAllyWielder.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "青龙偃月刀"), "♠", "5");
    borrowEnemyWielder.hand = [];
    borrowEnemyWielder.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    state.reads[borrowAI.id][borrowAllyWielder.id] = 1.45;
    state.readReasons[borrowAI.id][borrowAllyWielder.id] = ["偏反 +1.5：曾明显进攻主公"];
    state.reads[borrowAI.id][borrowEnemyWielder.id] = -1.45;
    state.readReasons[borrowAI.id][borrowEnemyWielder.id] = ["偏忠 -1.5：持续保护主公"];
    const borrowMoves = buildAIMoves(borrowAI).filter((move) => move.effect === "borrowSword");
    const borrowAllyMove = borrowMoves.find((move) => move.targets?.[0]?.id === borrowAllyWielder.id) || null;
    const borrowEnemyMove = borrowMoves.find((move) => move.targets?.[0]?.id === borrowEnemyWielder.id) || null;
    const borrowEnemyThreshold = borrowEnemyMove ? aiMoveAcceptanceThreshold(borrowAI, borrowEnemyMove) : 9;

    const borrowOnlyAI = makeScenarioPlayer(0, "ganning", "反贼", { hp: 3 });
    const borrowOnlyAlly = makeScenarioPlayer(1, "machao", "忠臣", { revealed: false, hp: 3 });
    const borrowOnlyEnemy = makeScenarioPlayer(2, "caocao", "主公", { hp: 4 });
    setupScenarioState([borrowOnlyAI, borrowOnlyAlly, borrowOnlyEnemy], { current: borrowOnlyAI.id, mode: "5", aiMode: "strategist" });
    [borrowOnlyAI, borrowOnlyAlly, borrowOnlyEnemy].forEach((player) => {
      player.personality.trickiness = 0;
      player.personality.chaos = 0;
      player.personality.caution = 1;
      player.personality.patience = 1;
    });
    borrowOnlyAI.hand = [createCard(CARD_POOL.find((spec) => spec.name === "借刀杀人"), "♣", "K")];
    borrowOnlyAI.turn = { usedSkills: {}, slashUsed: 0 };
    borrowOnlyAlly.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7")];
    borrowOnlyAlly.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "青龙偃月刀"), "♠", "5");
    state.reads[borrowOnlyAI.id][borrowOnlyAlly.id] = 1.65;
    state.readReasons[borrowOnlyAI.id][borrowOnlyAlly.id] = ["偏反 +1.6：多次进攻主公"];
    const borrowOnlyMoves = buildAIMoves(borrowOnlyAI).filter((move) => move.effect === "borrowSword");
    const borrowOnlyAllyMove = borrowOnlyMoves.find((move) => move.targets?.[0]?.id === borrowOnlyAlly.id) || null;
    const borrowOnlyAllyThreshold = borrowOnlyAllyMove ? aiMoveAcceptanceThreshold(borrowOnlyAI, borrowOnlyAllyMove) : 9;

    const allyJudgeAI = makeScenarioPlayer(0, "ganning", "忠臣", { hp: 3 });
    const allyJudgeLord = makeScenarioPlayer(1, "caocao", "主公", { hp: 4 });
    const allyJudgeEnemy = makeScenarioPlayer(2, "zhangfei", "反贼", { hp: 4 });
    setupScenarioState([allyJudgeAI, allyJudgeLord, allyJudgeEnemy], { current: allyJudgeAI.id, mode: "5", aiMode: "strategist" });
    allyJudgeAI.personality.trickiness = 0;
    allyJudgeAI.personality.caution = 1;
    allyJudgeAI.hand = [createCard(CARD_POOL.find((spec) => spec.name === "过河拆桥"), "♠", "Q")];
    allyJudgeAI.turn = { usedSkills: {}, slashUsed: 0 };
    allyJudgeLord.judgeArea = [createCard(CARD_POOL.find((spec) => spec.name === "乐不思蜀"), "♠", "6")];
    allyJudgeEnemy.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    const allyJudgeMoves = buildAIMoves(allyJudgeAI);
    const allyJudgeMove = allyJudgeMoves.find((move) => move.effect === "dismantle" && move.targets?.[0]?.id === allyJudgeLord.id) || null;
    const allyJudgeThreshold = allyJudgeMove ? aiMoveAcceptanceThreshold(allyJudgeAI, allyJudgeMove) : 9;
    const allyJudgeChoice = allyJudgeMove ? chooseAITargetCard(allyJudgeAI, allyJudgeLord, "dismantle", targetCardOptions(allyJudgeLord)) : null;

    const urgentDismantleAI = makeScenarioPlayer(0, "ganning", "反贼", { hp: 3 });
    const urgentDismantleAlly = makeScenarioPlayer(1, "machao", "忠臣", { isHuman: true, revealed: false, hp: 3 });
    const urgentDismantleEnemy = makeScenarioPlayer(2, "guanyu", "忠臣", { revealed: false, hp: 3 });
    const urgentDismantleLord = makeScenarioPlayer(3, "caocao", "主公", { hp: 4 });
    setupScenarioState([urgentDismantleAI, urgentDismantleAlly, urgentDismantleEnemy, urgentDismantleLord], { current: urgentDismantleAI.id, mode: "5", aiMode: "strategist" });
    [urgentDismantleAI, urgentDismantleAlly, urgentDismantleEnemy, urgentDismantleLord].forEach((player) => {
      player.personality.trickiness = 0;
      player.personality.chaos = 0;
      player.personality.caution = 1;
      player.personality.patience = 1;
    });
    urgentDismantleAI.hand = [createCard(CARD_POOL.find((spec) => spec.name === "过河拆桥"), "♠", "Q")];
    urgentDismantleAI.turn = { usedSkills: {}, slashUsed: 0 };
    urgentDismantleAlly.judgeArea = [createCard(CARD_POOL.find((spec) => spec.name === "乐不思蜀"), "♠", "6")];
    urgentDismantleEnemy.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    state.reads[urgentDismantleAI.id][urgentDismantleAlly.id] = 0.95;
    state.readReasons[urgentDismantleAI.id][urgentDismantleAlly.id] = ["偏反 +1.0：你此前对主公做出进攻行为"];
    state.reads[urgentDismantleAI.id][urgentDismantleEnemy.id] = -0.85;
    const urgentDismantleMoves = buildAIMoves(urgentDismantleAI);
    const urgentDismantleMove = urgentDismantleMoves.find((move) => move.effect === "dismantle" && move.targets?.[0]?.id === urgentDismantleAlly.id) || null;
    const urgentDismantleEnemyMove = urgentDismantleMoves.find((move) => move.effect === "dismantle" && move.targets?.[0]?.id === urgentDismantleEnemy.id) || null;
    const urgentDismantleThreshold = urgentDismantleMove ? aiMoveAcceptanceThreshold(urgentDismantleAI, urgentDismantleMove) : 9;
    const urgentDismantleChoice = urgentDismantleMove ? chooseAITargetCard(urgentDismantleAI, urgentDismantleAlly, "dismantle", targetCardOptions(urgentDismantleAlly)) : null;

    const urgentStealAI = makeScenarioPlayer(0, "ganning", "反贼", { hp: 3 });
    const urgentStealAlly = makeScenarioPlayer(1, "machao", "忠臣", { isHuman: true, revealed: false, hp: 3 });
    const urgentStealEnemy = makeScenarioPlayer(2, "guanyu", "忠臣", { revealed: false, hp: 3 });
    const urgentStealLord = makeScenarioPlayer(3, "caocao", "主公", { hp: 4 });
    setupScenarioState([urgentStealAI, urgentStealAlly, urgentStealEnemy, urgentStealLord], { current: urgentStealAI.id, mode: "5", aiMode: "strategist" });
    [urgentStealAI, urgentStealAlly, urgentStealEnemy, urgentStealLord].forEach((player) => {
      player.personality.trickiness = 0;
      player.personality.chaos = 0;
      player.personality.caution = 1;
      player.personality.patience = 1;
    });
    urgentStealAI.hand = [createCard(CARD_POOL.find((spec) => spec.name === "顺手牵羊"), "♠", "3")];
    urgentStealAI.turn = { usedSkills: {}, slashUsed: 0 };
    urgentStealAlly.judgeArea = [createCard(CARD_POOL.find((spec) => spec.name === "兵粮寸断"), "♣", "10")];
    urgentStealEnemy.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "青釭剑"), "♠", "6");
    state.reads[urgentStealAI.id][urgentStealAlly.id] = 0.95;
    state.readReasons[urgentStealAI.id][urgentStealAlly.id] = ["偏反 +1.0：你此前对主公做出进攻行为"];
    state.reads[urgentStealAI.id][urgentStealEnemy.id] = -0.85;
    const urgentStealMoves = buildAIMoves(urgentStealAI);
    const urgentStealMove = urgentStealMoves.find((move) => move.effect === "steal" && move.targets?.[0]?.id === urgentStealAlly.id) || null;
    const urgentStealEnemyMove = urgentStealMoves.find((move) => move.effect === "steal" && move.targets?.[0]?.id === urgentStealEnemy.id) || null;
    const urgentStealThreshold = urgentStealMove ? aiMoveAcceptanceThreshold(urgentStealAI, urgentStealMove) : 9;
    const urgentStealChoice = urgentStealMove ? chooseAITargetCard(urgentStealAI, urgentStealAlly, "steal", targetCardOptions(urgentStealAlly)) : null;

    return {
      qingnang: {
        suspectedRebelScore: qingnangAllyScore,
        suspectedLoyalScore: qingnangLoyalScore,
        suspectedRebelBonus: qingnangAllyBonus,
        suspectedLoyalBonus: qingnangLoyalBonus,
        bestTarget: qingnangBest?.targets?.[0]?.general.name || "",
        teammateAccepted: Boolean(qingnangAllyMove && qingnangAllyMove.score > aiMoveAcceptanceThreshold(huatuo, qingnangAllyMove))
      },
      rende: {
        suspectedRebelScore: rendeAllyScore,
        suspectedLoyalScore: rendeLoyalScore,
        suspectedRebelCards: rendeAllyCards,
        suspectedLoyalCards: rendeLoyalCards,
        bestTarget: rendeBest?.targets?.[0]?.general.name || "",
        teammateAccepted: Boolean(rendeBest && rendeBest.targets?.[0]?.id === giftRebel.id && rendeBest.score > aiMoveAcceptanceThreshold(liubei, rendeBest))
      },
      zhijian: {
        suspectedRebelScore: zhijianAllyScore,
        suspectedLoyalScore: zhijianLoyalScore,
        bestTarget: zhijianBest?.targets?.[0]?.general.name || "",
        teammateAccepted: Boolean(zhijianAllyMove && zhijianAllyMove.score > aiMoveAcceptanceThreshold(zhangzhao, zhijianAllyMove))
      },
      fangquan: {
        bestTarget: fangquanBestTarget?.general.name || "",
        moveScore: fangquanMove?.score ?? -1,
        teammateAccepted: Boolean(fangquanMove && fangquanBestTarget?.id === turnRebel.id && fangquanMove.score > aiMoveAcceptanceThreshold(liushan, fangquanMove))
      },
      jieyin: {
        suspectedRebelScore: jieyinAllyScore,
        suspectedLoyalScore: jieyinLoyalScore,
        bestTarget: jieyinBest?.targets?.[0]?.general.name || "",
        teammateAccepted: Boolean(jieyinAllyMove && jieyinAllyMove.score > aiMoveAcceptanceThreshold(sunshangxiang, jieyinAllyMove))
      },
      jieming: {
        suspectedRebelScore: jiemingAllyScore,
        suspectedLoyalScore: jiemingLoyalScore,
        bestTarget: jiemingBest?.target?.general.name || ""
      },
      yiji: {
        suspectedRebelScore: yijiAllyScore,
        suspectedSecondRebelScore: yijiSecondAllyScore,
        suspectedLoyalScore: yijiLoyalScore,
        bestTarget: yijiPlan?.target?.general.name || "",
        allocationTargets: yijiAllocationTargets,
        giftedCards: yijiGifted.map((card) => card.name),
        sourceHandAfterGift: guojia.hand.length,
        teammateHandAfterGift: yijiRebel.hand.length,
        secondTeammateHandAfterGift: yijiSecondRebel.hand.length,
        loyalHandAfterGift: yijiLoyal.hand.length
      },
      haoshi: {
        bestTarget: haoshiTarget?.general.name || "",
        shouldUseWithTeammateLowest: haoshiShouldUse,
        giftCards: haoshiGiftCards,
        enemyOnlyTarget: haoshiEnemyOnlyTarget?.general.name || "",
        shouldAvoidEnemyOnlyLowest: !haoshiEnemyOnlyUse
      },
      yinghun: {
        suspectedRebelScore: yinghunAllyScore,
        suspectedLoyalScore: yinghunLoyalScore,
        bestTarget: yinghunBest?.target?.general.name || "",
        bestMode: yinghunBest?.mode || ""
      },
      fangzhu: {
        bestTarget: fangzhuBest?.target?.general.name || "",
        suspectedRebelScore: fangzhuAllyScore,
        suspectedLoyalEnemyScore: fangzhuEnemyScore
      },
      dimeng: {
        bestTargets: dimengPairNames,
        allyEnemyScore: dimengAllyEnemyScore,
        bestScore: dimengBest?.score ?? -1
      },
      huangtian: {
        loyalScore: huangtianLoyalMove?.score ?? -9,
        loyalThreshold: huangtianLoyalMove ? aiMoveAcceptanceThreshold(huangtianLoyal, huangtianLoyalMove) : 9,
        loyalAccepted: huangtianLoyalAccepted,
        loyalTarget: huangtianLoyalTarget,
        loyalCard: huangtianLoyalCard?.name || "",
        rebelScore: huangtianRebelMove?.score ?? -9,
        rebelThreshold: huangtianRebelMove ? aiMoveAcceptanceThreshold(huangtianRebel, huangtianRebelMove) : 9,
        rebelAccepted: huangtianRebelAccepted
      },
      zhiba: {
        loyalScore: zhibaLoyalMove?.score ?? -9,
        loyalThreshold: zhibaLoyalMove ? aiMoveAcceptanceThreshold(zhibaLoyal, zhibaLoyalMove) : 9,
        loyalAccepted: zhibaLoyalAccepted,
        rebelScore: zhibaRebelMove?.score ?? -9,
        rebelThreshold: zhibaRebelMove ? aiMoveAcceptanceThreshold(zhibaRebel, zhibaRebelMove) : 9,
        rebelAccepted: zhibaRebelAccepted
      },
      moderateDeclaredAlly: {
        supportScore: moderateSupport?.score ?? -9,
        supportThreshold: moderateSupportThreshold,
        supportAccepted: Boolean(moderateSupport && moderateSupport.score > moderateSupportThreshold),
        chosenTitle: moderateChosen ? aiMoveTitle(moderateChosen) : "",
        chosenTarget: moderateChosen ? aiMoveTargetLabel(moderateHuatuo, moderateChosen) : "",
        teamwork: supportTeamworkScore(moderateHuatuo, moderateHumanAlly, "heal"),
        committedBonus: committedSupportBonus(moderateHuatuo, moderateHumanAlly, "heal"),
        topMoves: moderateMoves.slice(0, 4).map((move) => ({
          title: aiMoveTitle(move),
          target: aiMoveTargetLabel(moderateHuatuo, move),
          score: move.score
        }))
      },
      basicCardUse: {
        selfEquipScore: selfEquipMove?.score ?? -9,
        selfEquipThreshold,
        selfEquipAccepted: Boolean(selfEquipMove && selfEquipMove.score > selfEquipThreshold),
        selfEquipTopTitle: selfEquipTop ? aiMoveTitle(selfEquipTop) : "",
        selfEquipTopIsEquip: selfEquipTop?.effect === "equip",
        drawTrickScore: drawTrickMove?.score ?? -9,
        drawTrickThreshold,
        drawTrickAccepted: Boolean(drawTrickMove && drawTrickMove.score > drawTrickThreshold),
        drawTrickTopTitle: drawTrickMoves[0] ? aiMoveTitle(drawTrickMoves[0]) : "",
        utilityJitter: {
          equip: selfEquipMove ? aiMoveAcceptanceJitter(selfEquipAI, selfEquipMove) : 9,
          draw2: drawTrickMove ? aiMoveAcceptanceJitter(drawTrickAI, drawTrickMove) : 9,
          dismantle: dismantleMove ? aiMoveAcceptanceJitter(dismantleAI, dismantleMove) : 9,
          steal: stealMove ? aiMoveAcceptanceJitter(stealAI, stealMove) : 9
        },
        utilityThresholdBelowBase: selfEquipMove ? selfEquipThreshold < aiPlayThreshold(selfEquipAI) : false,
        dismantleVisibleEquipAccepted: Boolean(dismantleMove && dismantleMove.score > dismantleThreshold),
        dismantleVisibleEquipChoice: dismantleChoice?.zone || "",
        dismantleVisibleEquipCard: dismantleChoice?.card?.name || "",
        stealVisibleEquipAccepted: Boolean(stealMove && stealMove.score > stealThreshold),
        stealVisibleEquipChoice: stealChoice?.zone || "",
        stealVisibleEquipCard: stealChoice?.card?.name || "",
        borrowSwordEnemyAccepted: Boolean(borrowEnemyMove && borrowEnemyMove.score > borrowEnemyThreshold),
        borrowSwordTopWielder: borrowMoves[0]?.targets?.[0]?.general.name || "",
        borrowSwordTopVictim: borrowMoves[0]?.targets?.[1]?.general.name || "",
        borrowSwordEnemyScore: borrowEnemyMove?.score ?? -9,
        borrowSwordAllyScore: borrowAllyMove?.score ?? -9,
        borrowSwordAvoidsTeammateWeapon: Boolean(borrowEnemyMove && borrowAllyMove && borrowEnemyMove.score > borrowAllyMove.score + 1.2),
        borrowSwordOnlyTeammateRejected: !borrowOnlyAllyMove || borrowOnlyAllyMove.score < borrowOnlyAllyThreshold,
        borrowSwordOnlyTeammateScore: borrowOnlyAllyMove?.score ?? -9,
        borrowSwordOnlyTeammateThreshold: borrowOnlyAllyThreshold,
        allyJudgeRemovalAccepted: Boolean(allyJudgeMove && allyJudgeMove.score > allyJudgeThreshold),
        allyJudgeRemovalTarget: allyJudgeMove?.targets?.[0]?.general.name || "",
        allyJudgeRemovalChoice: allyJudgeChoice?.zone || "",
        allyJudgeRemovalCard: allyJudgeChoice?.card?.name || "",
        allyJudgeCountsAsSupport: isSupportiveControlMove(allyJudgeAI, allyJudgeMove, allyJudgeLord),
        urgentDismantleAllyJudgeAccepted: Boolean(urgentDismantleMove && urgentDismantleMove.score > urgentDismantleThreshold),
        urgentDismantleAllyJudgeTarget: urgentDismantleMove?.targets?.[0]?.general.name || "",
        urgentDismantleAllyJudgeChoice: urgentDismantleChoice?.zone || "",
        urgentDismantleAllyJudgeCard: urgentDismantleChoice?.card?.name || "",
        urgentDismantleBeatsEnemyEquip: Boolean(urgentDismantleMove && urgentDismantleEnemyMove && urgentDismantleMove.score > urgentDismantleEnemyMove.score),
        urgentDismantleTopTarget: urgentDismantleMoves[0]?.targets?.[0]?.general.name || "",
        urgentDismantleIntentReason: urgentDismantleMove ? aiDecisionReason(urgentDismantleAI, urgentDismantleMove, urgentDismantleMoves) : "",
        urgentStealAllyJudgeAccepted: Boolean(urgentStealMove && urgentStealMove.score > urgentStealThreshold),
        urgentStealAllyJudgeTarget: urgentStealMove?.targets?.[0]?.general.name || "",
        urgentStealAllyJudgeChoice: urgentStealChoice?.zone || "",
        urgentStealAllyJudgeCard: urgentStealChoice?.card?.name || "",
        urgentStealBeatsEnemyEquip: Boolean(urgentStealMove && urgentStealEnemyMove && urgentStealMove.score > urgentStealEnemyMove.score),
        urgentStealTopTarget: urgentStealMoves[0]?.targets?.[0]?.general.name || "",
        urgentStealIntentReason: urgentStealMove ? aiDecisionReason(urgentStealAI, urgentStealMove, urgentStealMoves) : ""
      }
    };
  }

  function generalSelectionContractSummary() {
    const summarizeWeights = (lordId, role, mode = "strict") => {
      const rosterPool = rosterGenerals(mode);
      const lordGeneral = rosterPool.find((general) => general.id === lordId);
      const pool = rosterPool.filter((general) => general.id !== lordId);
      const options = aiGeneralPickOptions(pool, { role, lordGeneral, mode: "8" }, false);
      const totalWeight = options.reduce((sum, item) => sum + item.weight, 0);
      const weightShare = (predicate) => options
        .filter((item) => predicate(item.general))
        .reduce((sum, item) => sum + item.weight, 0) / totalWeight;
      const countShare = (predicate) => pool.filter(predicate).length / pool.length;
      return {
        lord: lordGeneral?.name || "",
        role,
        sameKingdomWeightShare: weightShare((general) => general.kingdom === lordGeneral?.kingdom),
        sameKingdomCountShare: countShare((general) => general.kingdom === lordGeneral?.kingdom),
        supportWeightShare: weightShare((general) => generalTraitScore(general, "support") > 0),
        offenseControlWeightShare: weightShare((general) => generalTraitScore(general, "offense") + generalTraitScore(general, "control") > 0),
        topNames: options.slice(0, 8).map((item) => item.general.name),
        topKingdoms: options.slice(0, 8).map((item) => item.general.kingdom),
        topScores: options.slice(0, 8).map((item) => Number(item.score.toFixed(2)))
      };
    };
    const traitSummaryFor = (ids, trait, mode = "all") => Object.fromEntries(ids.map((id) => {
      const general = rosterGenerals(mode).find((item) => item.id === id);
      return [id, general ? generalTraitScore(general, trait) : 0];
    }));
    const caocaoLoyal = summarizeWeights("caocao", "忠臣");
    const liubeiLoyal = summarizeWeights("liubei", "忠臣");
    const caocaoRebel = summarizeWeights("caocao", "反贼");
    const caocaoTraitor = summarizeWeights("caocao", "内奸");
    const caocaoAllLoyal = summarizeWeights("caocao", "忠臣", "all");
    const extensionSupportTraits = traitSummaryFor(["fazheng", "xushu", "wuguotai", "bulianshi"], "support");
    const extensionControlTraits = traitSummaryFor(["xushu", "wuguotai", "bulianshi"], "control");
    const extensionDefenseTraits = traitSummaryFor(["zhangchunhua", "wuguotai", "bulianshi"], "defense");
    return {
      caocaoLoyal,
      liubeiLoyal,
      caocaoRebel,
      caocaoTraitor,
      caocaoAllLoyal,
      extensionSupportTraits,
      extensionControlTraits,
      extensionDefenseTraits,
      loyalSameKingdomBiasedButNotLocked: caocaoLoyal.sameKingdomWeightShare > caocaoLoyal.sameKingdomCountShare * 1.45 && caocaoLoyal.sameKingdomWeightShare < 0.72,
      liubeiLoyalShuBiasedButNotLocked: liubeiLoyal.sameKingdomWeightShare > liubeiLoyal.sameKingdomCountShare * 1.45 && liubeiLoyal.sameKingdomWeightShare < 0.74,
      rebelNotSameKingdomLocked: caocaoRebel.sameKingdomWeightShare < caocaoLoyal.sameKingdomWeightShare - 0.12,
      rebelPrefersActionKits: caocaoRebel.offenseControlWeightShare > caocaoRebel.supportWeightShare,
      traitorHasControlOrDefenseBias: caocaoTraitor.topNames.length > 0 && caocaoTraitor.offenseControlWeightShare > 0.42,
      extensionSupportSkillsTagged: Object.values(extensionSupportTraits).every((score) => score > 0),
      extensionControlDefenseTagged: Object.values({ ...extensionControlTraits, ...extensionDefenseTraits }).every((score) => score > 0),
      allPoolStillBiasedButNotLocked: caocaoAllLoyal.sameKingdomWeightShare > caocaoAllLoyal.sameKingdomCountShare * 1.25 && caocaoAllLoyal.sameKingdomWeightShare < 0.72
    };
  }

  function aiDecisionTrailContractSummary() {
    const huatuo = makeScenarioPlayer(0, "huatuo", "反贼");
    const suspectedRebel = makeScenarioPlayer(1, "zhangfei", "忠臣", { revealed: false, hp: 2 });
    const suspectedLoyal = makeScenarioPlayer(2, "guanyu", "忠臣", { revealed: false, hp: 2 });
    const lord = makeScenarioPlayer(3, "caocao", "主公");
    setupScenarioState([huatuo, suspectedRebel, suspectedLoyal, lord], { current: huatuo.id, mode: "5", aiMode: "strategist" });
    state.debug = false;
    state.infoTab = "reads";
    state.decisionTrail = [];
    huatuo.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♣", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "8")
    ];
    huatuo.turn = { usedSkills: {} };
    state.reads[huatuo.id][suspectedRebel.id] = 1.8;
    state.readReasons[huatuo.id][suspectedRebel.id] = ["偏反 +1.8：曾明显进攻主公"];
    state.reads[huatuo.id][suspectedLoyal.id] = -1.8;
    state.readReasons[huatuo.id][suspectedLoyal.id] = ["偏忠 -1.8：持续支援主公"];

    const moves = buildAIMoves(huatuo);
    const supportMove = moves.find((move) => move.skill === "qingnang" && move.targets?.[0]?.id === suspectedRebel.id);
    recordAIDecision(huatuo, supportMove, moves);
    renderReads();

    const entry = state.decisionTrail[0] || {};
    const reason = entry.reason || "";
    const summaryHtml = $("readsSummary")?.innerHTML || "";
    const decisionText = `${entry.actor || ""} ${entry.title || ""} ${entry.target || ""} ${reason} ${summaryHtml}`;
    return {
      actor: entry.actor || "",
      title: entry.title || "",
      target: entry.target || "",
      score: entry.score || "",
      reason,
      summaryHtml,
      hasDecisionEntry: state.decisionTrail.length === 1,
      hasSupportSkill: entry.title === "青囊",
      targetsSuspectedTeammate: entry.target === "张飞",
      hasScore: /评分\s-?\d/.test(reason),
      hasCandidateRank: reason.includes("候选#"),
      hasSupportIntent: reason.includes("支援/保护"),
      hasFairRead: reason.includes("公平读数：偏反") || reason.includes("公平读数：很像反"),
      hasPublicEvidence: reason.includes("公开行为") && reason.includes("进攻主公"),
      hasTeamworkScore: /配合分\s-?\d/.test(reason),
      rendersInReadsPanel: summaryHtml.includes("华佗 · 青囊") && summaryHtml.includes("配合分"),
      leaksHiddenRole: /(?:开眼身份|挑战模式身份|公开身份：(?:反贼|忠臣|内奸)|公开：(?:反贼|忠臣|内奸))/.test(decisionText)
    };
  }

  async function careerRegressionSummary() {
    const human = makeScenarioPlayer(0, "liubei", "反贼", { isHuman: true, revealed: true });
    const lord = makeScenarioPlayer(1, "caocao", "主公");
    const loyal = makeScenarioPlayer(2, "zhangfei", "忠臣", { hp: 1 });
    setupScenarioState([human, lord, loyal], { current: 0, mode: "5" });
    state.career = createEmptyCareer();
    state.round = 3;
    noteHumanCardUse(human, 2);
    noteHumanSkillUse(human, 1);
    await damage(human, loyal, 1, DAMAGE.NORMAL, { name: "测试伤害" });
    const runMetricsBeforeRecord = careerRunMetrics();
    recordGameResult("反贼获胜");
    recordGameResult("反贼获胜");
    const stats = normalizeCareerStats(state.career);
    const exported = serializeCareerStats(stats);
    const imported = importCareerStatsFromText(exported);
    renderSetupCareer();
    renderCareer();
    const setupHtml = $("setupCareer")?.innerHTML || "";
    const careerHtml = $("careerPanel")?.innerHTML || "";
    return {
      totalGames: stats.totalGames,
      wins: stats.wins,
      losses: stats.losses,
      survivedGames: stats.survivedGames,
      longestGameRound: stats.longestGameRound,
      roleGames: stats.roleStats["反贼"]?.games || 0,
      roleWins: stats.roleStats["反贼"]?.wins || 0,
      roleSurvived: stats.roleStats["反贼"]?.survived || 0,
      roleDamageDealt: stats.roleStats["反贼"]?.damageDealt || 0,
      roleKills: stats.roleStats["反贼"]?.kills || 0,
      modeGames: stats.modeStats["5"]?.games || 0,
      modeWins: stats.modeStats["5"]?.wins || 0,
      generalGames: stats.generalStats.liubei?.games || 0,
      generalSurvived: stats.generalStats.liubei?.survived || 0,
      generalDamageDealt: stats.generalStats.liubei?.damageDealt || 0,
      generalKills: stats.generalStats.liubei?.kills || 0,
      totalDamageDealt: stats.totalDamageDealt,
      totalDamageTaken: stats.totalDamageTaken,
      totalKills: stats.totalKills,
      totalDeaths: stats.totalDeaths,
      totalCardsUsed: stats.totalCardsUsed,
      totalSkillsUsed: stats.totalSkillsUsed,
      bestDamageDealt: stats.bestDamageDealt,
      bestKills: stats.bestKills,
      runMetricsBeforeRecord,
      lastGameRole: stats.lastGames[0]?.role || "",
      lastGameResult: stats.lastGames[0]?.result || "",
      lastGameDamageDealt: stats.lastGames[0]?.damageDealt || 0,
      lastGameKills: stats.lastGames[0]?.kills || 0,
      lastGameCardsUsed: stats.lastGames[0]?.cardsUsed || 0,
      lastGameSkillsUsed: stats.lastGames[0]?.skillsUsed || 0,
      lastGameDurationSec: stats.lastGames[0]?.durationSec ?? -1,
      exportHasEnvelope: exported.includes("sanguosha-singleplayer-career") && exported.includes("\"career\""),
      importRoundTripGames: imported.totalGames,
      setupCareerRenders: setupHtml.includes("战绩") && !setupHtml.includes("导出存档"),
      careerPanelRenders: careerHtml.includes("生涯档案") && careerHtml.includes("下个目标") && careerHtml.includes("存活率"),
      careerCombatRenders: careerHtml.includes("总伤害") && careerHtml.includes("总击杀") && careerHtml.includes("伤害 1/0") && careerHtml.includes("用牌/技能"),
      milestonesDone: careerMilestones(stats).filter((item) => item.done).map((item) => item.title)
    };
  }

  function victoryStatusSummary() {
    const human = makeScenarioPlayer(0, "liubei", "反贼", { isHuman: true, revealed: true });
    const lord = makeScenarioPlayer(1, "caocao", "主公");
    setupScenarioState([human, lord], { current: 0, mode: "5" });
    state.testMode = false;
    state.started = true;
    state.career = createEmptyCareer();
    $("setup")?.classList.add("hidden");
    $("game")?.classList.remove("hidden");
    finishGame("反贼获胜");
    const modalHtml = $("endGameContent")?.innerHTML || "";
    return {
      gameOver: state.gameOver,
      phase: state.status.phase,
      detail: state.status.detail,
      waitKind: state.status.waitKind,
      waitPrompt: state.status.waitPrompt,
      pendingPrompt: state.pending?.prompt || "",
      infoTab: state.infoTab,
      careerTotalGames: state.career.totalGames,
      endGameModalOpen: state.endGameModalOpen,
      endGameModalText: modalHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      endGameModalHasActions: modalHtml.includes("再来一局") && modalHtml.includes("查看战报") && modalHtml.includes("看战绩"),
      endGameModalHasRevealedRoles: modalHtml.includes("身份揭示") && modalHtml.includes("主公") && modalHtml.includes("反贼")
    };
  }

  function prepareEndGameVisualScenario() {
    const human = makeScenarioPlayer(0, "liubei", "忠臣", { isHuman: true, revealed: true, hp: 3 });
    const lord = makeScenarioPlayer(1, "caocao", "主公", { revealed: true, hp: 2 });
    const rebelOne = makeScenarioPlayer(2, "zhangfei", "反贼", { revealed: true, hp: 0 });
    const rebelTwo = makeScenarioPlayer(3, "huanggai", "反贼", { revealed: true, hp: 0 });
    const traitor = makeScenarioPlayer(4, "simayi", "内奸", { revealed: true, hp: 0 });
    setupScenarioState([human, lord, rebelOne, rebelTwo, traitor], { current: human.id, mode: "5" });
    [rebelOne, rebelTwo, traitor].forEach((player) => {
      player.alive = false;
      player.hp = 0;
    });
    state.testMode = false;
    state.started = true;
    state.round = 6;
    state.infoTab = "career";
    state.sidePanelCollapsed = false;
    state.logCollapsed = false;
    state.logExpanded = false;
    state.gameStartedAt = Date.now() - 1000 * 60 * 9 - 38;
    state.runStats = {
      damageDealt: 4,
      damageTaken: 2,
      kills: 1,
      deaths: 0,
      cardsUsed: 18,
      skillsUsed: 7
    };
    state.log = [
      "身份局开始。主公是 曹操。",
      "进入 你(刘备) 的回合。",
      "你(刘备) 使用 杀，目标 张飞。",
      "你(刘备) 对 张飞 造成 1 点普通伤害，张飞 体力 0/4。",
      "张飞 阵亡，身份公开为 反贼。"
    ];
    $("setup")?.classList.add("hidden");
    $("game")?.classList.remove("hidden");
    document.body?.classList.add("in-game");
    finishGame("主忠方获胜");
    return {
      modalText: $("endGameContent")?.textContent?.replace(/\s+/g, " ").trim() || "",
      roleCount: document.querySelectorAll(".endgame-role-pill").length,
      actionCount: document.querySelectorAll("[data-endgame-action]").length
    };
  }

  function identityReadScenarioSummary() {
    function makeReadScenario(options = {}) {
      const lord = makeScenarioPlayer(0, options.lordGeneral || "caocao", "主公", { hp: options.lordHp ?? 4 });
      const actor = makeScenarioPlayer(1, "machao", "反贼", { revealed: false });
      const neutral = makeScenarioPlayer(2, "zhaoyun", "忠臣", { revealed: false });
      const suspectedRebel = makeScenarioPlayer(3, "zhangfei", "忠臣", { revealed: false });
      const suspectedLoyal = makeScenarioPlayer(4, "guanyu", "忠臣", { revealed: false });
      const observer = makeScenarioPlayer(5, "liubei", "忠臣", { revealed: false });
      setupScenarioState([lord, actor, neutral, suspectedRebel, suspectedLoyal, observer], { current: actor.id, mode: "8" });
      actor.turn = { slashUsed: 0, usedSkills: {} };
      return { lord, actor, neutral, suspectedRebel, suspectedLoyal, observer };
    }

    function readSnapshot(observer, actor) {
      const reasons = state.readReasons[observer.id]?.[actor.id] || [];
      const read = state.reads[observer.id]?.[actor.id] || 0;
      return {
        read,
        label: readLabel(read).text,
        reasons: reasons.slice(0, 3)
      };
    }

    const attackLord = (() => {
      const { lord, actor, observer } = makeReadScenario();
      updateReadsForMove(actor, { effect: "slash", needsTarget: true, targetMode: "enemy", targets: [lord] });
      return readSnapshot(observer, actor);
    })();

    const supportLord = (() => {
      const { lord, actor, observer } = makeReadScenario();
      updateReadsForMove(actor, { effect: "peach", needsTarget: true, targetMode: "any", targets: [lord] });
      return readSnapshot(observer, actor);
    })();

    const avoidLord = (() => {
      const { actor, neutral, observer } = makeReadScenario();
      updateReadsForMove(actor, { effect: "slash", needsTarget: true, targetMode: "enemy", targets: [neutral] });
      return readSnapshot(observer, actor);
    })();

    const avoidLordByCamp = (() => {
      const lord = makeScenarioPlayer(0, "caocao", "主公", { hp: 4 });
      const actor = makeScenarioPlayer(1, "machao", "反贼", { revealed: false });
      const neutral = makeScenarioPlayer(2, "zhaoyun", "忠臣", { revealed: false });
      const rebelObserver = makeScenarioPlayer(3, "zhangfei", "反贼", { revealed: false });
      const traitorObserver = makeScenarioPlayer(4, "simayi", "内奸", { revealed: false });
      setupScenarioState([lord, actor, neutral, rebelObserver, traitorObserver], { current: actor.id, mode: "5" });
      actor.turn = { slashUsed: 0, usedSkills: {} };
      updateReadsForMove(actor, { effect: "slash", needsTarget: true, targetMode: "enemy", targets: [neutral] });
      return {
        lord: readSnapshot(lord, actor),
        rebel: readSnapshot(rebelObserver, actor),
        traitor: readSnapshot(traitorObserver, actor)
      };
    })();

    const attackSuspectedRebel = (() => {
      const { actor, suspectedRebel, observer } = makeReadScenario();
      state.reads[observer.id][suspectedRebel.id] = 1.8;
      state.readReasons[observer.id][suspectedRebel.id] = ["偏反 +1.8：曾明显进攻主公"];
      updateReadsForMove(actor, { effect: "slash", needsTarget: true, targetMode: "enemy", targets: [suspectedRebel] });
      return readSnapshot(observer, actor);
    })();

    const supportSuspectedRebel = (() => {
      const { actor, suspectedRebel, observer } = makeReadScenario();
      state.reads[observer.id][suspectedRebel.id] = 1.8;
      state.readReasons[observer.id][suspectedRebel.id] = ["偏反 +1.8：曾明显进攻主公"];
      updateReadsForMove(actor, { skill: "rende", needsTarget: true, targetMode: "any", targets: [suspectedRebel] });
      return readSnapshot(observer, actor);
    })();

    const attackSuspectedLoyal = (() => {
      const { actor, suspectedLoyal, observer } = makeReadScenario();
      state.reads[observer.id][suspectedLoyal.id] = -1.8;
      state.readReasons[observer.id][suspectedLoyal.id] = ["偏忠 -1.8：持续支援主公"];
      updateReadsForDamage(actor, suspectedLoyal);
      return readSnapshot(observer, actor);
    })();

    const supportSuspectedLoyal = (() => {
      const { actor, suspectedLoyal, observer } = makeReadScenario();
      state.reads[observer.id][suspectedLoyal.id] = -1.8;
      state.readReasons[observer.id][suspectedLoyal.id] = ["偏忠 -1.8：持续支援主公"];
      updateReadsForHeal(actor, suspectedLoyal);
      return readSnapshot(observer, actor);
    })();

    const aoeNormalLord = (() => {
      const { actor, suspectedRebel, observer } = makeReadScenario({ lordHp: 4 });
      state.reads[observer.id][suspectedRebel.id] = 1.8;
      updateReadsForMove(actor, { effect: "arrows", needsTarget: false, targets: [], card: { name: "万箭齐发", subtype: "arrows" } });
      return readSnapshot(observer, actor);
    })();

    const aoeLowLord = (() => {
      const { actor, suspectedRebel, observer } = makeReadScenario({ lordHp: 1 });
      state.reads[observer.id][suspectedRebel.id] = 1.8;
      updateReadsForMove(actor, { effect: "arrows", needsTarget: false, targets: [], card: { name: "万箭齐发", subtype: "arrows" } });
      return readSnapshot(observer, actor);
    })();

    const aoeBarbariansNormalLord = (() => {
      const { actor, suspectedRebel, observer } = makeReadScenario({ lordHp: 4 });
      state.reads[observer.id][suspectedRebel.id] = 1.8;
      updateReadsForMove(actor, { effect: "barbarians", needsTarget: false, targets: [], card: { name: "南蛮入侵", subtype: "barbarians" } });
      return readSnapshot(observer, actor);
    })();

    const aoeBarbariansLowLord = (() => {
      const { actor, suspectedRebel, observer } = makeReadScenario({ lordHp: 1 });
      state.reads[observer.id][suspectedRebel.id] = 1.8;
      updateReadsForMove(actor, { effect: "barbarians", needsTarget: false, targets: [], card: { name: "南蛮入侵", subtype: "barbarians" } });
      return readSnapshot(observer, actor);
    })();

    const aoeKeepsPriorLoyalRead = (() => {
      const { actor, suspectedRebel, observer } = makeReadScenario({ lordHp: 4 });
      state.reads[observer.id][actor.id] = -1.1;
      state.readReasons[observer.id][actor.id] = ["偏忠 -1.1：此前避开主公并压制疑似反贼"];
      state.reads[observer.id][suspectedRebel.id] = 1.8;
      updateReadsForMove(actor, { effect: "arrows", needsTarget: false, targets: [], card: { name: "万箭齐发", subtype: "arrows" } });
      return readSnapshot(observer, actor);
    })();

    const aoeMildPriorLoyalRead = (() => {
      const { lord, actor, suspectedRebel, suspectedLoyal, observer } = makeReadScenario({ lordHp: 1 });
      const aoeCard = { name: "万箭齐发", subtype: "arrows" };
      state.reads[observer.id][actor.id] = -0.52;
      state.readReasons[observer.id][actor.id] = ["偏忠 -0.5：此前可打主公但选择压制他人"];
      state.reads[observer.id][suspectedRebel.id] = 1.8;
      state.reads[observer.id][suspectedLoyal.id] = -1.8;
      updateReadsForDamage(actor, lord, aoeCard);
      updateReadsForDamage(actor, suspectedLoyal, aoeCard);
      updateReadsForMove(actor, { effect: "arrows", needsTarget: false, targets: [], card: aoeCard });
      return readSnapshot(observer, actor);
    })();

    const singleActualAoeFromNeutral = (() => {
      const { lord, actor, observer } = makeReadScenario({ lordHp: 1 });
      const aoeCard = { name: "万箭齐发", subtype: "arrows" };
      updateReadsForDamage(actor, lord, aoeCard);
      updateReadsForDamage(actor, observer, aoeCard);
      updateReadsForMove(actor, { effect: "arrows", needsTarget: false, targets: [], card: aoeCard });
      return readSnapshot(observer, actor);
    })();

    const singleActualAoeFromPriorLoyal = (() => {
      const { lord, actor, observer } = makeReadScenario({ lordHp: 1 });
      const aoeCard = { name: "万箭齐发", subtype: "arrows" };
      state.reads[observer.id][actor.id] = -0.48;
      state.readReasons[observer.id][actor.id] = ["偏忠 -0.5：此前可打主公但选择压制他人"];
      updateReadsForDamage(actor, lord, aoeCard);
      updateReadsForDamage(actor, observer, aoeCard);
      updateReadsForMove(actor, { effect: "arrows", needsTarget: false, targets: [], card: aoeCard });
      return readSnapshot(observer, actor);
    })();

    return {
      attackLord,
      supportLord,
      avoidLord,
      avoidLordByCamp,
      attackSuspectedRebel,
      supportSuspectedRebel,
      attackSuspectedLoyal,
      supportSuspectedLoyal,
      aoe: {
        normalLord: aoeNormalLord,
        lowHpLord: aoeLowLord,
        barbariansNormalLord: aoeBarbariansNormalLord,
        barbariansLowHpLord: aoeBarbariansLowLord,
        keepsPriorLoyalRead: aoeKeepsPriorLoyalRead,
        mildPriorLoyalRead: aoeMildPriorLoyalRead,
        singleActualFromNeutral: singleActualAoeFromNeutral,
        singleActualFromPriorLoyal: singleActualAoeFromPriorLoyal
      }
    };
  }

  function lordTargetingScenarioSummary() {
    const lord = makeScenarioPlayer(0, "caocao", "主公", { hp: 4 });
    const avoider = makeScenarioPlayer(1, "machao", "反贼", { revealed: false });
    const neutralTarget = makeScenarioPlayer(2, "zhaoyun", "忠臣", { revealed: false });
    const suspectedRebel = makeScenarioPlayer(3, "zhangfei", "忠臣", { revealed: false });
    setupScenarioState([lord, avoider, neutralTarget, suspectedRebel], { current: lord.id, mode: "5", aiMode: "strategist" });

    [lord, avoider, neutralTarget, suspectedRebel].forEach((player) => {
      player.hp = Math.min(player.hp, 4);
      player.hand = [
        createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "2"),
        createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "3")
      ];
      player.equip = {};
      player.judgeArea = [];
      player.personality.chaos = 0;
      player.personality.trickiness = 0;
      player.personality.aggression = 1;
      player.personality.caution = 1;
    });
    lord.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7")];
    lord.turn = { slashUsed: 0, usedSkills: {} };
    avoider.turn = { slashUsed: 0, usedSkills: {} };

    updateReadsForMove(avoider, { effect: "slash", needsTarget: true, targetMode: "enemy", targets: [neutralTarget] });
    state.reads[lord.id][suspectedRebel.id] = 1.8;
    state.readReasons[lord.id][suspectedRebel.id] = ["偏反 +1.8：曾明显进攻主公"];

    const slashCard = createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "9");
    const scoreAgainstAvoider = scoreMove(lord, { type: "card", effect: "slash", name: "杀", needsTarget: true, targetMode: "enemy", scoreHint: 1, card: slashCard, targets: [avoider] });
    const scoreAgainstSuspected = scoreMove(lord, { type: "card", effect: "slash", name: "杀", needsTarget: true, targetMode: "enemy", scoreHint: 1, card: slashCard, targets: [suspectedRebel] });
    const slashMoves = buildAIMoves(lord).filter((move) => move.effect === "slash");
    const bestSlash = slashMoves[0] || null;
    return {
      avoiderRead: state.reads[lord.id]?.[avoider.id] || 0,
      avoiderReasons: state.readReasons[lord.id]?.[avoider.id] || [],
      suspectedRead: state.reads[lord.id]?.[suspectedRebel.id] || 0,
      suspectedReasons: state.readReasons[lord.id]?.[suspectedRebel.id] || [],
      scoreAgainstAvoider,
      scoreAgainstSuspected,
      scoreMargin: scoreAgainstSuspected - scoreAgainstAvoider,
      bestSlashTarget: bestSlash?.targets?.[0] ? nameOf(bestSlash.targets[0]) : "",
      bestSlashScore: bestSlash?.score ?? null,
      slashMoveTargets: slashMoves.map((move) => ({
        target: move.targets?.[0] ? nameOf(move.targets[0]) : "",
        score: move.score
      }))
    };
  }

  function traitorControlScenarioSummary() {
    const makeControlBoard = (pressure) => {
      const lord = makeScenarioPlayer(0, "caocao", "主公", { hp: pressure === "rebel" ? 2 : 4 });
      const traitor = makeScenarioPlayer(1, "simayi", "内奸", { revealed: false });
      const suspectedRebel = makeScenarioPlayer(2, "zhangfei", "反贼", { revealed: false, hp: pressure === "rebel" ? 3 : 4 });
      const suspectedLoyal = makeScenarioPlayer(3, "zhaoyun", "忠臣", { revealed: false, hp: pressure === "loyal" ? 2 : 2 });
      const extraA = makeScenarioPlayer(4, pressure === "rebel" ? "lvbu" : "guanyu", pressure === "rebel" ? "反贼" : "忠臣", { revealed: false });
      const extraB = makeScenarioPlayer(5, pressure === "rebel" ? "yuanshao" : "liubei", pressure === "rebel" ? "反贼" : "忠臣", { revealed: false });
      setupScenarioState([lord, traitor, suspectedRebel, suspectedLoyal, extraA, extraB], { current: traitor.id, mode: "8", aiMode: "strategist" });
      [lord, traitor, suspectedRebel, suspectedLoyal, extraA, extraB].forEach((player) => {
        player.personality.aggression = 1;
        player.personality.caution = 1;
        player.personality.trickiness = 0;
        player.personality.patience = 1;
        player.personality.chaos = 0;
        player.hand = [createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "7")];
        player.equip = {};
        player.judgeArea = [];
      });
      traitor.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7")];
      traitor.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
      const reads = state.reads[traitor.id];
      reads[suspectedRebel.id] = pressure === "rebel" ? 2.4 : 1.4;
      reads[suspectedLoyal.id] = pressure === "loyal" ? -2.4 : -0.8;
      reads[extraA.id] = pressure === "rebel" ? 2.2 : -2.2;
      reads[extraB.id] = pressure === "rebel" ? 2.1 : -2.1;
      state.readReasons[traitor.id][suspectedRebel.id] = ["偏反 +2.4：多次进攻主公"];
      state.readReasons[traitor.id][suspectedLoyal.id] = ["偏忠 -2.4：多次支援主公"];
      const slashCard = traitor.hand[0];
      const rebelScore = scoreMove(traitor, { type: "card", effect: "slash", name: "杀", needsTarget: true, targetMode: "enemy", scoreHint: 1, card: slashCard, targets: [suspectedRebel] });
      const loyalScore = scoreMove(traitor, { type: "card", effect: "slash", name: "杀", needsTarget: true, targetMode: "enemy", scoreHint: 1, card: slashCard, targets: [suspectedLoyal] });
      const lordScore = scoreMove(traitor, { type: "card", effect: "slash", name: "杀", needsTarget: true, targetMode: "enemy", scoreHint: 1, card: slashCard, targets: [lord] });
      const balance = estimatedFactionBalance(traitor);
      return {
        pressure,
        balance,
        suspectedRebelAttitude: attitude(traitor, suspectedRebel),
        suspectedLoyalAttitude: attitude(traitor, suspectedLoyal),
        lordAttitude: attitude(traitor, lord),
        rebelScore,
        loyalScore,
        lordScore,
        preferredTarget: rebelScore > loyalScore && rebelScore > lordScore ? "suspectedRebel" : loyalScore > lordScore ? "suspectedLoyal" : "lord"
      };
    };
    return {
      rebelPressure: makeControlBoard("rebel"),
      loyalPressure: makeControlBoard("loyal")
    };
  }

  function aiReadsPanelContractSummary() {
    const lord = makeScenarioPlayer(0, "caocao", "主公", { hp: 4 });
    const actor = makeScenarioPlayer(1, "machao", "反贼", { revealed: false });
    const observer = makeScenarioPlayer(2, "liubei", "忠臣", { revealed: false });
    const bystander = makeScenarioPlayer(3, "zhaoyun", "忠臣", { revealed: false });
    setupScenarioState([lord, actor, observer, bystander], { current: observer.id, mode: "5", aiMode: "strategist" });
    state.debug = false;
    updateReadsForMove(actor, { effect: "slash", needsTarget: true, targetMode: "enemy", targets: [lord] });
    renderReads();
    const summaryHtml = $("readsSummary")?.innerHTML || "";
    const listHtml = $("readsList")?.innerHTML || "";
    return {
      observer: nameOf(observer),
      actor: nameOf(actor),
      actorRead: state.reads[observer.id]?.[actor.id] || 0,
      actorReasons: state.readReasons[observer.id]?.[actor.id] || [],
      summaryHtml,
      listHtml,
      hasFairnessBoundary: summaryHtml.includes("公平边界") && summaryHtml.includes("暗身份未给 AI 直接读取"),
      hasDecisionBoundary: summaryHtml.includes("公开行为") && summaryHtml.includes("手牌只按数量"),
      hasActorRow: listHtml.includes(nameOf(actor)),
      showsHiddenIdentity: listHtml.includes("暗身份"),
      leaksActorRole: listHtml.includes("公开：反贼"),
      showsPublicReason: listHtml.includes("对主公做出进攻行为"),
      showsReadLabel: listHtml.includes("偏反") || listHtml.includes("很像反")
    };
  }

  function eventVisualContractSummary() {
    const caocao = makeScenarioPlayer(0, "caocao", "主公");
    const machao = makeScenarioPlayer(1, "machao", "反贼", { revealed: false });
    const liubei = makeScenarioPlayer(2, "liubei", "忠臣", { revealed: false });
    const zhuge = makeScenarioPlayer(3, "zhugeliang", "忠臣", { revealed: false });
    const zhangfei = makeScenarioPlayer(4, "zhangfei", "反贼", { revealed: false });
    setupScenarioState([caocao, machao, liubei, zhuge, zhangfei], { current: machao.id, mode: "5" });
    state.tempo = "slow";

    const summarize = (message) => {
      const event = enrichSpotlightEvent(eventFromLog(message));
      const visual = eventVisualMeta(event);
      const routeTargets = eventRouteTargets(event);
      const visualHtml = renderEventVisual(event);
      const castHtml = renderEventCast(event);
      const mood = eventMood(event);
      const outcome = eventOutcomeBadge(event);
      const judgeCard = eventJudgeCardInfo(event);
      const resourceCards = eventResourceCardInfo(event);
      return {
        message,
        kind: event.kind,
        actor: event.actor,
        title: event.title,
        target: event.target,
        detail: event.detail,
        targetCount: event.targetIds?.length || 0,
        routeTargets,
        isArea: isAreaSpotlightEvent(event) || routeTargets.length > 2,
        visualTitle: visual.title,
        visualType: visual.type,
        visualFooter: visual.footer,
        mood,
        outcome,
        image: visual.image,
        visualArea: visualHtml.includes("visual-area"),
        visualDirected: visualHtml.includes("visual-directed"),
        visualRelationRescue: visualHtml.includes("visual-relation-rescue"),
        visualRelationNullify: visualHtml.includes("visual-relation-nullify"),
        visualRelationCounterNullify: visualHtml.includes("visual-relation-counter-nullify"),
        visualRelationSelfSave: visualHtml.includes("visual-relation-selfsave"),
        visualRelationCaption: visualHtml.includes("visual-relation-caption"),
        visualRelationCaptionText: visualHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
        visualDeathReveal: visualHtml.includes("visual-death-reveal"),
        visualDeathRevealText: visualHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
        visualPulse: visualHtml.includes("visual-pulse"),
        resourceCardVisual: visualHtml.includes("visual-resource-cards"),
        resourceVisualHasFullCardText: resourceCards.every((card) => visualHtml.includes(card.text) || (visualHtml.includes(`${card.suit}${card.rank}`) && visualHtml.includes(card.name))),
        resourceVisibleCount: (visualHtml.match(/resource-card-face/g) || []).length,
        resourceCards,
        icon: spotlightIcon(event.kind),
        judgeVisualCard: visualHtml.includes("visual-judge-card"),
        judgeSuitVisible: visualHtml.includes("judge-card-suit"),
        judgeCard,
        castHasActor: castHtml.includes("cast-source"),
        castHasDestination: castHtml.includes("cast-destination"),
        castHasSettlementLane: castHtml.includes("cast-settlement-lane") && castHtml.includes("lane-card"),
        castHasTextCardFace: castHtml.includes("cast-action-card") && castHtml.includes("<strong>") && castHtml.includes("<small>"),
        castUsesOfficialImage: /assets\/cards\/official|has-card-image|card-art-image/.test(`${castHtml}${visualHtml}`),
        castHasMoodClass: castHtml.includes(`event-mood-${mood}`),
        castHasOutcome: outcome ? castHtml.includes("event-outcome") && castHtml.includes(outcome) : false,
        importance: eventImportance(event),
        holdDuration: eventHoldDuration(event)
      };
    };

    return {
      singleSlash: summarize("马超 使用 杀，目标 曹操。"),
      arrows: summarize("马超 使用 万箭齐发。"),
      barbarians: summarize("马超 使用 南蛮入侵。"),
      taoyuan: summarize("刘备 使用 桃园结义。"),
      harvest: summarize("刘备 使用 五谷丰登。"),
      dodgeResponse: summarize("曹操 打出闪，响应 马超 的杀。"),
      nullifyResponse: summarize("诸葛亮 使用无懈可击，抵消 南蛮入侵。"),
      nullifyProtect: summarize("诸葛亮 使用无懈可击，抵消 过河拆桥，保护 刘备。"),
      counterNullify: summarize("司马懿 使用无懈可击，反抵消 过河拆桥，继续影响 刘备。"),
      judgeReveal: summarize("曹操 的 八卦阵 判定：♥2 闪。"),
      judgeBlackReveal: summarize("张角 的 雷击 判定：♠7 杀。"),
      judgeRewrite: summarize("司马懿 发动鬼才，将 曹操 的 乐不思蜀 判定改为 ♥2 闪。"),
      delayedNullify: summarize("曹操 判定阶段结算 乐不思蜀，被无懈可击抵消。"),
      discardKnown: summarize("甘宁 因 过河拆桥 弃置 曹操 的手牌：♦9 闪。"),
      discardPhase: summarize("陆逊 因 弃牌阶段 弃置 2 张牌：♣5 杀、♦9 闪。"),
      gainKnown: summarize("司马懿 因 反馈 获得 曹操 的装备区的 ♠2 八卦阵。"),
      huashenGain: summarize("左慈 发动化身，本回合获得 奇才。"),
      xinshengGain: summarize("左慈 发动新生，获得 观星。"),
      dying: summarize("曹操 濒死，来源 马超，需要 1 个桃或可用的自救牌。"),
      rescue: summarize("刘备 使用桃，救援 曹操。"),
      selfWineRescue: summarize("曹操 使用酒，自救。"),
      death: summarize("曹操 被 马超 击杀，身份为 主公。"),
      draw: summarize("刘备 摸 2 张牌。"),
      systemStart: summarize("身份局开始。主公是赵云。"),
      waitClean: (() => {
        const event = enrichSpotlightEvent({
          kind: "wait",
          actor: "张飞",
          title: "等待操作",
          target: "",
          detail: "等待玩家选择。",
          message: "等待玩家选择。"
        });
        return {
          kind: event.kind,
          castHtml: renderEventCast(event),
          visualHtml: renderEventVisual(event),
          classes: centerEventClasses(event)
        };
      })(),
      deferredWaitAfterDiscard: (() => {
        setupScenarioState([caocao, machao, liubei, zhuge, zhangfei], { current: machao.id, mode: "5" });
        state.started = true;
        state.testMode = true;
        state.eventHoldUntil = 0;
        clearPendingWaitSpotlight();
        log("甘宁 因 过河拆桥 弃置 曹操 的手牌：♦9 闪。");
        const discardId = state.spotlight?.id || 0;
        const holdDuration = Math.max(0, (state.eventHoldUntil || 0) - Date.now());
        setWait("出牌操作", "点手牌直接使用，或从操作条选择；也可以结束出牌。", machao.id, "测试等待");
        const retainedDiscard = state.spotlight?.id === discardId && state.spotlight?.kind === "discard";
        const pendingWait = state.pendingWaitSpotlight?.kind === "wait";
        state.eventHoldUntil = Date.now() - 1;
        const promoted = promotePendingWaitSpotlight();
        const promotedWait = state.spotlight?.kind === "wait" && state.spotlight?.title === "出牌操作";
        clearWait();
        return {
          retainedDiscard,
          pendingWait,
          promoted,
          promotedWait,
          holdDuration
        };
      })()
    };
  }

  function tempoContractSummary() {
    const previousTempo = state.tempo;
    const sample = (tempo) => {
      state.tempo = tempo;
      const response = enrichSpotlightEvent(eventFromLog("曹操 打出闪，响应 马超 的杀。"));
      const dying = enrichSpotlightEvent(eventFromLog("曹操 濒死，来源 马超，需要 1 个桃或可用的自救牌。"));
      const draw = enrichSpotlightEvent(eventFromLog("刘备 摸 2 张牌。"));
      const card = enrichSpotlightEvent(eventFromLog("马超 使用 杀，目标 曹操。"));
      return {
        tempo,
        response: eventHoldDuration(response),
        dying: eventHoldDuration(dying),
        draw: eventHoldDuration(draw),
        card: eventHoldDuration(card)
      };
    };
    const summary = {
      ultra: sample("ultra"),
      slow: sample("slow"),
      normal: sample("normal"),
      fast: sample("fast")
    };
    state.tempo = previousTempo;
    return summary;
  }

  function battleLogContractSummary() {
    const entries = [
      "身份局开始。主公是赵云。",
      "进入 赵云 的回合。",
      "赵云 摸 2 张牌。",
      "赵云 使用 杀，目标 曹操。",
      "赵云 对 曹操 造成 1 点普通伤害，曹操 体力 3/4。",
      "曹操 濒死，来源 赵云，需要 1 个桃或可用的自救牌。",
      "刘备 使用桃，救援 曹操。",
      "曹操 脱离濒死。",
      "进入 左慈 的回合。",
      "左慈 发动化身，本回合获得 奇才。",
      "进入 蔡文姬 的回合。",
      "蔡文姬 发动悲歌，弃一张牌。",
      "蔡文姬 因 悲歌 弃置 1 张牌：♣5 杀。",
      "甘宁 因 过河拆桥 弃置 曹操 的手牌：♦9 闪。",
      "进入 你(司马懿) 的回合。",
      "你(司马懿) 发动鬼才，将 赵云 的 乐不思蜀 判定改为 ♥2 闪。",
      "诸葛亮 使用无懈可击，抵消 乐不思蜀。",
      "赵云 判定阶段结算 乐不思蜀，被无懈可击抵消。",
      "你(司马懿) 使用 无中生有。",
      "你(司马懿) 摸 2 张牌。"
    ];
    const sections = groupedLogSections(entries);
    const displaySections = sections.slice(-12).reverse();
    const html = displaySections.map(renderLogSection).join("");
    return {
      firstTitle: displaySections[0]?.title || "",
      firstCurrent: Boolean(displaySections[0]?.current),
      sectionTitles: displaySections.map((section) => section.title),
      html,
      hasLatestFirst: displaySections[0]?.title === "你(司马懿) 的回合",
      hasActionHeader: html.includes("log-line-head"),
      hasCardAction: html.includes("无中生有") && html.includes("摸 2 张牌"),
      hasTargetRoute: html.includes("赵云 → 曹操"),
      hasJudgeRewrite: html.includes("鬼才改判") && html.includes("你(司马懿) → 赵云") && html.includes("乐不思蜀 改为"),
      hasJudgeRewriteKind: html.includes("log-message-judge") && html.includes("<span class=\"log-message-kind\">判</span>"),
      hasNullifyRoute: html.includes("诸葛亮 → 乐不思蜀") && html.includes("无懈可击") && html.includes("抵消"),
      hasNullifyResponseKind: /log-message log-message-response[\s\S]*?<strong>无懈可击<\/strong>[\s\S]*?诸葛亮 → 乐不思蜀/.test(html),
      hasDelayedNullifyJudge: html.includes("乐不思蜀被抵消") && html.includes("判定阶段 · 无懈可击抵消"),
      hasSkillGain: html.includes("化身：奇才") && html.includes("本回合获得 奇才"),
      hasSkillGainRule: html.includes("锦囊距离限制放宽"),
      hasDamageDetail: html.includes("1点普通伤害") || html.includes("造成 1 点普通伤害"),
      suppressesNoResponseNoise: !html.includes("未响应闪") && !html.includes("未响应杀"),
      hasDiscardKind: html.includes("log-message-discard") && html.includes("<span class=\"log-message-kind\">弃</span>"),
      hasDiscardDetail: html.includes("悲歌：1 张牌：♣5 杀") && html.includes("过河拆桥：曹操 的手牌：♦9 闪"),
      hasDyingSection: html.includes("log-message-dying") && html.includes("<span class=\"log-message-kind\">濒</span>") && html.includes("需要 1 个桃"),
      hasRescueRoute: html.includes("log-message-heal") && html.includes("刘备 → 曹操") && html.includes("濒死救援"),
      hasDyingRecovery: html.includes("脱离濒死") && html.includes("救援成功")
    };
  }

  function nameDisplayContractSummary() {
    const human = makeScenarioPlayer(0, "simayi", "内奸", { isHuman: true });
    const zhangliao = makeScenarioPlayer(1, "zhangliao", "忠臣");
    const huangyueying = makeScenarioPlayer(2, "huangyueying", "反贼");
    setupScenarioState([human, zhangliao, huangyueying], { current: 1, mode: "5" });
    state.reads[1] = { 2: 1.2 };
    state.readReasons[1] = { 2: ["黄月英 对主公做出进攻行为"] };
    const aiCardHtml = renderPlayer(huangyueying, {
      kind: "card",
      actor: "张辽",
      title: "杀",
      target: "黄月英",
      detail: "目标：黄月英",
      actorId: 1,
      targetIds: [2],
      damageIds: []
    });
    const humanCardHtml = renderPlayer(human);
    const miniHtml = renderMiniPortrait(huangyueying, "flow-next");
    const sections = groupedLogSections([
      "身份局开始。主公是张辽。",
      "进入 张辽 的回合。",
      "张辽 使用 杀，目标 黄月英。",
      "黄月英 未响应闪，来源 张辽。"
    ]);
    const logHtml = sections.slice(-12).reverse().map(renderLogSection).join("");
    const turnFlow = upcomingTurnPlayers(3).map((player) => nameOf(player));
    const allHtml = `${aiCardHtml}\n${humanCardHtml}\n${miniHtml}\n${logHtml}\n${turnFlow.join(" ")}`;
    return {
      aiName: nameOf(huangyueying),
      humanName: nameOf(human),
      turnFlow,
      aiCardHasGeneralMainName: aiCardHtml.includes('<div class="player-name">黄月英</div>'),
      aiCardHasSeatMetadata: aiCardHtml.includes('data-seat="2"'),
      miniPortraitUsesSeatOnlyAsSmallMarker: miniHtml.includes("<small>座3</small>"),
      battleLogUsesGeneralNames: logHtml.includes("张辽 → 黄月英") && logHtml.includes("黄月英"),
      leakedAINumber: /AI\s+\d/.test(allHtml)
    };
  }

  function layoutPreferenceSummary() {
    resetState();
    state.testMode = true;
    return {
      defaultInfoTab: state.infoTab,
      sidePanelCollapsed: state.sidePanelCollapsed,
      logExpanded: state.logExpanded,
      logCollapsed: state.logCollapsed,
      panelToggleTextWhenDefault: state.sidePanelCollapsed ? "展开战报" : "收起战报",
      keepsCollapseClassAvailable: true
    };
  }

  function fairnessContractSummary() {
    const observer = makeScenarioPlayer(0, "caocao", "忠臣");
    const dodgeHeavy = makeScenarioPlayer(1, "huanggai", "反贼");
    const dodgeLight = makeScenarioPlayer(2, "ganning", "反贼");
    setupScenarioState([observer, dodgeHeavy, dodgeLight], { current: 0, mode: "5", aiMode: "strategist" });
    dodgeHeavy.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♦", "3"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♣", "4")
    ];
    dodgeLight.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♠", "9")
    ];

    const fairDodgeHeavy = estimatedResponseCount(dodgeHeavy, "dodge", observer);
    const fairDodgeLight = estimatedResponseCount(dodgeLight, "dodge", observer);
    const fairHeartHeavy = estimatedSuitPresence(dodgeHeavy, "♥", observer);
    const fairHeartLight = estimatedSuitPresence(dodgeLight, "♥", observer);
    const fairSelfDodge = estimatedResponseCount(dodgeHeavy, "dodge", dodgeHeavy);

    state.aiMode = "oracle";
    const oracleDodgeHeavy = estimatedResponseCount(dodgeHeavy, "dodge", observer);
    const oracleDodgeLight = estimatedResponseCount(dodgeLight, "dodge", observer);
    const oracleHeartHeavy = estimatedSuitPresence(dodgeHeavy, "♥", observer);
    const oracleHeartLight = estimatedSuitPresence(dodgeLight, "♥", observer);

    const pindianSource = makeScenarioPlayer(0, "taishici", "忠臣");
    const highRankTarget = makeScenarioPlayer(1, "huanggai", "反贼");
    const lowRankTarget = makeScenarioPlayer(2, "ganning", "反贼");
    setupScenarioState([pindianSource, highRankTarget, lowRankTarget], { current: 0, mode: "5", aiMode: "strategist" });
    pindianSource.hand = [createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "9")];
    highRankTarget.hand = [createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "K")];
    lowRankTarget.hand = [createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "2")];
    const fairPindianHigh = estimatePindianWinChance(pindianSource, highRankTarget, "天义");
    const fairPindianLow = estimatePindianWinChance(pindianSource, lowRankTarget, "天义");
    state.aiMode = "oracle";
    const oraclePindianHigh = estimatePindianWinChance(pindianSource, highRankTarget, "天义");
    const oraclePindianLow = estimatePindianWinChance(pindianSource, lowRankTarget, "天义");
    state.aiMode = "strategist";

    return {
      fairDodgeHeavy,
      fairDodgeLight,
      fairHeartHeavy,
      fairHeartLight,
      fairSelfDodge,
      oracleDodgeHeavy,
      oracleDodgeLight,
      oracleHeartHeavy,
      oracleHeartLight,
      fairPindianHigh,
      fairPindianLow,
      oraclePindianHigh,
      oraclePindianLow,
      fairnessAuditHtml: renderFairnessAudit(observer)
    };
  }

  function prepareHumanPlayUiScenario() {
    const human = makeScenarioPlayer(0, "zhaoyun", "主公", { isHuman: true, revealed: true });
    const rebel = makeScenarioPlayer(1, "caocao", "反贼", { revealed: false });
    const loyal = makeScenarioPlayer(2, "liubei", "忠臣", { revealed: false });
    setupScenarioState([human, rebel, loyal], { current: 0, mode: "5" });
    state.testMode = false;
    state.started = true;
    state.gameOver = false;
    state.round = 1;
    state.infoTab = "log";
    state.sidePanelCollapsed = false;
    state.logCollapsed = false;
    state.logExpanded = false;
    state.tempo = "slow";
    human.turn = { slashUsed: 0, usedSkills: {}, usedSlashThisTurn: false, usedWine: false };
    rebel.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♠", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "3")
    ];
    loyal.hand = [createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "5")];
    human.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "Q"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♦", "9")
    ];
    human.equip.weapon = createCard(CARD_POOL.find((spec) => spec.name === "青龙偃月刀"), "♠", "5");
    human.judgeArea = [createCard(CARD_POOL.find((spec) => spec.name === "乐不思蜀"), "♠", "6")];
    human.linked = true;
    state.log = ["进入 你(赵云) 的回合。", "你(赵云) 摸 2 张牌。"];
    markStatus("玩家出牌", human, "测试出牌 UI");
    setWait("出牌操作", "点手牌直接使用，或从操作条选择；也可以结束出牌。", human.id, "测试出牌 UI");
    state.playContext = {
      playerId: human.id,
      actions: buildPlayableActions(human),
      resolver: (result) => {
        state.lastHumanPlayUiResult = result;
      }
    };
    state.playCardId = null;
    state.pending = null;
    state.cardPick = null;
    state.targetPick = null;
    $("setup")?.classList.add("hidden");
    $("game")?.classList.remove("hidden");
    render();
    return humanPlayUiSnapshot();
  }

  function prepareActionPromptOverflowScenario() {
    const human = makeScenarioPlayer(0, "zhaoyun", "主公", { isHuman: true, revealed: true });
    const yueyun = makeScenarioPlayer(1, "caocao", "反贼", { revealed: false });
    setupScenarioState([human, yueyun], { current: human.id, mode: "5" });
    state.testMode = false;
    state.started = true;
    state.gameOver = false;
    state.round = 2;
    state.infoTab = "log";
    state.sidePanelCollapsed = true;
    state.logCollapsed = true;
    state.logExpanded = false;
    human.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "顺手牵羊"), "♠", "4"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♥", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♦", "9")
    ];
    yueyun.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♠", "2"),
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♣", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♥", "Q"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♦", "K"),
      createCard(CARD_POOL.find((spec) => spec.name === "酒"), "♣", "5")
    ];
    yueyun.equip.armor = createCard(CARD_POOL.find((spec) => spec.name === "藤甲"), "♣", "2");
    markStatus("玩家出牌", human, "测试多按钮操作提示");
    setWait("选择", "顺手牵羊：选择 越云 的 1 张牌。", human.id, "6 个选项");
    state.pending = {
      prompt: "顺手牵羊：选择 越云 的 1 张牌",
      ownerId: human.id,
      options: [
        { label: "手牌 1", value: "hand-1", onChoose: () => {} },
        { label: "手牌 2", value: "hand-2", onChoose: () => {} },
        { label: "手牌 3", value: "hand-3", onChoose: () => {} },
        { label: "手牌 4", value: "hand-4", onChoose: () => {} },
        { label: "手牌 5", value: "hand-5", onChoose: () => {} },
        { label: "装备 · 藤甲", value: "equip-armor", onChoose: () => {} }
      ]
    };
    state.cardPick = null;
    state.targetPick = null;
    state.playContext = null;
    $("setup")?.classList.add("hidden");
    $("game")?.classList.remove("hidden");
    render();
    return {
      actionBarHtml: $("actionBar")?.innerHTML || "",
      actionBarText: ($("actionBar")?.textContent || "").replace(/\s+/g, " ").trim()
    };
  }

  function prepareSkillGainVisualScenario() {
    const human = makeScenarioPlayer(0, "zhaoyun", "主公", { isHuman: true, revealed: true });
    const zuoci = makeScenarioPlayer(1, "zuoci", "内奸", { revealed: false });
    const rebel = makeScenarioPlayer(2, "caocao", "反贼", { revealed: false });
    const loyal = makeScenarioPlayer(3, "liubei", "忠臣", { revealed: false });
    const rebelTwo = makeScenarioPlayer(4, "machao", "反贼", { revealed: false });
    setupScenarioState([human, zuoci, rebel, loyal, rebelTwo], { current: zuoci.id, mode: "5" });
    state.testMode = false;
    state.started = true;
    state.gameOver = false;
    state.round = 2;
    state.infoTab = "log";
    state.sidePanelCollapsed = false;
    state.logCollapsed = false;
    state.logExpanded = false;
    state.tempo = "slow";
    zuoci.tempSkills = ["qicai"];
    zuoci.turn = { slashUsed: 0, usedSkills: {} };
    human.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9")
    ];
    state.roleNotes[1] = "traitor";
    state.reads[0][1] = 0.1;
    state.readReasons[0][1] = ["左慈 暂无明确敌我行为"];
    const message = `${nameOf(zuoci)} 发动化身，本回合获得 奇才。`;
    state.log = [
      "身份局开始。主公是你(赵云)。",
      "进入 左慈 的回合。",
      message
    ];
    state.spotlight = {
      id: state.lastEventId++,
      ...enrichSpotlightEvent(eventFromLog(message))
    };
    markStatus("技能结算", zuoci, "化身获得新技能");
    $("setup")?.classList.add("hidden");
    $("game")?.classList.remove("hidden");
    render();
    const visual = eventVisualMeta(state.spotlight);
    return {
      boardHtml: $("board")?.innerHTML || "",
      logHtml: $("log")?.innerHTML || "",
      centerText: [visual.label, visual.title, visual.type, visual.footer, state.spotlight.detail].filter(Boolean).join(" ")
    };
  }

  function prepareDelayedNullifyVisualScenario() {
    const human = makeScenarioPlayer(0, "zhaoyun", "主公", { isHuman: true, revealed: true });
    const caocao = makeScenarioPlayer(1, "caocao", "反贼", { revealed: false });
    const zhuge = makeScenarioPlayer(2, "zhugeliang", "忠臣", { revealed: false });
    const simayi = makeScenarioPlayer(3, "simayi", "内奸", { revealed: false });
    const machao = makeScenarioPlayer(4, "machao", "反贼", { revealed: false });
    setupScenarioState([human, caocao, zhuge, simayi, machao], { current: caocao.id, mode: "5" });
    state.testMode = false;
    state.started = true;
    state.gameOver = false;
    state.round = 3;
    state.infoTab = "log";
    state.sidePanelCollapsed = false;
    state.logCollapsed = false;
    state.logExpanded = false;
    state.tempo = "slow";
    human.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9")
    ];
    state.roleNotes[1] = "rebel";
    state.roleNotes[2] = "loyal";
    state.reads[0][1] = 1.2;
    state.readReasons[0][1] = ["曹操 此前对主公做出进攻行为"];
    const message = `${nameOf(caocao)} 判定阶段结算 乐不思蜀，被无懈可击抵消。`;
    state.log = [
      "身份局开始。主公是你(赵云)。",
      `进入 ${nameOf(caocao)} 的回合。`,
      `${nameOf(zhuge)} 使用无懈可击，抵消 乐不思蜀。`,
      message
    ];
    state.spotlight = {
      id: state.lastEventId++,
      ...enrichSpotlightEvent(eventFromLog(message))
    };
    markStatus("判定结算", caocao, "乐不思蜀被无懈抵消");
    $("setup")?.classList.add("hidden");
    $("game")?.classList.remove("hidden");
    render();
    const visual = eventVisualMeta(state.spotlight);
    return {
      boardHtml: $("board")?.innerHTML || "",
      logHtml: $("log")?.innerHTML || "",
      centerText: [visual.label, visual.title, visual.type, visual.footer, state.spotlight.detail].filter(Boolean).join(" ")
    };
  }

  function prepareRelationEventVisualScenario() {
    const human = makeScenarioPlayer(0, "zhaoyun", "主公", { isHuman: true, revealed: true });
    const caocao = makeScenarioPlayer(1, "caocao", "忠臣", { hp: 1, revealed: false });
    const liubei = makeScenarioPlayer(2, "liubei", "忠臣", { revealed: false });
    const machao = makeScenarioPlayer(3, "machao", "反贼", { revealed: false });
    const zhangfei = makeScenarioPlayer(4, "zhangfei", "反贼", { revealed: false });
    setupScenarioState([human, caocao, liubei, machao, zhangfei], { current: machao.id, mode: "5" });
    state.testMode = false;
    state.started = true;
    state.gameOver = false;
    state.round = 4;
    state.infoTab = "log";
    state.sidePanelCollapsed = false;
    state.logCollapsed = false;
    state.logExpanded = false;
    state.tempo = "slow";
    human.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9")
    ];
    caocao.hp = 0;
    state.roleNotes[1] = "loyal";
    state.roleNotes[2] = "loyal";
    state.roleNotes[3] = "rebel";
    const message = `${nameOf(liubei)} 使用桃，救援 ${nameOf(caocao)}。`;
    state.log = [
      "身份局开始。主公是你(赵云)。",
      `进入 ${nameOf(machao)} 的回合。`,
      `${nameOf(caocao)} 濒死，来源 ${nameOf(machao)}，需要 1 个桃或可用的自救牌。`,
      message,
      `${nameOf(caocao)} 脱离濒死。`
    ];
    state.spotlight = {
      id: state.lastEventId++,
      ...enrichSpotlightEvent(eventFromLog(message))
    };
    markStatus("救援结算", liubei, "桃救援曹操");
    $("setup")?.classList.add("hidden");
    $("game")?.classList.remove("hidden");
    render();
    const visual = eventVisualMeta(state.spotlight);
    return {
      boardHtml: $("board")?.innerHTML || "",
      logHtml: $("log")?.innerHTML || "",
      centerText: [visual.label, visual.title, visual.type, visual.footer, state.spotlight.detail].filter(Boolean).join(" ")
    };
  }

  function prepareDeathRevealVisualScenario() {
    const human = makeScenarioPlayer(0, "zhaoyun", "主公", { isHuman: true, revealed: true });
    const caocao = makeScenarioPlayer(1, "caocao", "忠臣", { hp: 0, revealed: true });
    const liubei = makeScenarioPlayer(2, "liubei", "忠臣", { revealed: false });
    const machao = makeScenarioPlayer(3, "machao", "反贼", { revealed: false });
    const zhangfei = makeScenarioPlayer(4, "zhangfei", "反贼", { revealed: false });
    setupScenarioState([human, caocao, liubei, machao, zhangfei], { current: machao.id, mode: "5" });
    state.testMode = false;
    state.started = true;
    state.gameOver = false;
    state.round = 4;
    state.infoTab = "log";
    state.sidePanelCollapsed = false;
    state.logCollapsed = false;
    state.logExpanded = false;
    state.tempo = "slow";
    human.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9")
    ];
    caocao.alive = false;
    caocao.revealed = true;
    state.roleNotes[1] = "loyal";
    state.roleNotes[3] = "rebel";
    const message = `${nameOf(caocao)} 被 ${nameOf(machao)} 击杀，身份为 ${caocao.role}。`;
    state.log = [
      "身份局开始。主公是你(赵云)。",
      `进入 ${nameOf(machao)} 的回合。`,
      `${nameOf(caocao)} 濒死，来源 ${nameOf(machao)}，需要 1 个桃或可用的自救牌。`,
      message
    ];
    state.spotlight = {
      id: state.lastEventId++,
      ...enrichSpotlightEvent(eventFromLog(message))
    };
    markStatus("阵亡结算", caocao, "身份公开");
    $("setup")?.classList.add("hidden");
    $("game")?.classList.remove("hidden");
    render();
    const visual = eventVisualMeta(state.spotlight);
    return {
      boardHtml: $("board")?.innerHTML || "",
      logHtml: $("log")?.innerHTML || "",
      centerText: [visual.label, visual.title, visual.type, visual.footer, state.spotlight.detail].filter(Boolean).join(" ")
    };
  }

  function prepareJudgementRevealVisualScenario() {
    const human = makeScenarioPlayer(0, "zhaoyun", "主公", { isHuman: true, revealed: true });
    const zhangjiao = makeScenarioPlayer(1, "zhangjiao", "反贼", { revealed: false });
    const simayi = makeScenarioPlayer(2, "simayi", "内奸", { revealed: false });
    const liubei = makeScenarioPlayer(3, "liubei", "忠臣", { revealed: false });
    const machao = makeScenarioPlayer(4, "machao", "反贼", { revealed: false });
    setupScenarioState([human, zhangjiao, simayi, liubei, machao], { current: zhangjiao.id, mode: "5" });
    state.testMode = false;
    state.started = true;
    state.gameOver = false;
    state.round = 3;
    state.infoTab = "log";
    state.sidePanelCollapsed = false;
    state.logCollapsed = false;
    state.logExpanded = false;
    state.tempo = "slow";
    human.hand = [
      createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((spec) => spec.name === "闪"), "♥", "8"),
      createCard(CARD_POOL.find((spec) => spec.name === "桃"), "♥", "9")
    ];
    state.roleNotes[1] = "rebel";
    state.roleNotes[2] = "traitor";
    state.reads[0][1] = 1.4;
    state.readReasons[0][1] = ["张角 此前对主公造成威胁"];
    const message = `${nameOf(zhangjiao)} 的 雷击 判定：♠7 杀。`;
    state.log = [
      "身份局开始。主公是你(赵云)。",
      `进入 ${nameOf(zhangjiao)} 的回合。`,
      `${nameOf(zhangjiao)} 使用或打出闪，发动雷击。`,
      message
    ];
    state.spotlight = {
      id: state.lastEventId++,
      ...enrichSpotlightEvent(eventFromLog(message))
    };
    markStatus("判定展示", zhangjiao, "雷击判定牌翻出");
    $("setup")?.classList.add("hidden");
    $("game")?.classList.remove("hidden");
    render();
    const visual = eventVisualMeta(state.spotlight);
    return {
      boardHtml: $("board")?.innerHTML || "",
      logHtml: $("log")?.innerHTML || "",
      centerText: [visual.label, visual.title, visual.type, visual.footer, state.spotlight.detail].filter(Boolean).join(" ")
    };
  }

  function prepareAIDecisionTrailVisualScenario() {
    const summary = aiDecisionTrailContractSummary();
    const huatuo = state.players[0];
    const suspectedRebel = state.players[1];
    state.testMode = false;
    state.started = true;
    state.gameOver = false;
    state.round = 2;
    state.infoTab = "reads";
    state.sidePanelCollapsed = false;
    state.logCollapsed = false;
    state.logExpanded = false;
    state.tempo = "slow";
    state.log = [
      "身份局开始。主公是曹操。",
      "进入 华佗 的回合。",
      "华佗 准备对疑似反贼队友使用青囊。"
    ];
    const message = `${nameOf(huatuo)} 发动青囊，令 ${nameOf(suspectedRebel)} 回复 1 点体力。`;
    state.spotlight = {
      id: state.lastEventId++,
      ...enrichSpotlightEvent(eventFromLog(message))
    };
    markStatus("AI判断", huatuo, "青囊支援疑似队友");
    $("setup")?.classList.add("hidden");
    $("game")?.classList.remove("hidden");
    render();
    const readsHtml = `${$("readsSummary")?.innerHTML || ""}${$("readsList")?.innerHTML || ""}`;
    return {
      ...summary,
      boardHtml: $("board")?.innerHTML || "",
      readsHtml,
      readsText: readsHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    };
  }

  function humanPlayUiSnapshot() {
    const wait = activeWaitState();
    const consistency = waitConsistencyIssues(wait);
    const hardIssues = consistency.filter((issue) => !issue.includes("玩家等待"));
    const human = state.players[0];
    const selectedCard = human?.hand.find((card) => card.id === state.playCardId);
    return {
      current: human ? nameOf(human) : "",
      prompt: $("prompt")?.textContent || "",
      handHtml: $("hand")?.innerHTML || "",
      handPanelClass: document.querySelector(".hand-panel")?.className || "",
      handModeHtml: $("handMode")?.innerHTML || "",
      handModeText: ($("handMode")?.textContent || "").replace(/\s+/g, " ").trim(),
      humanStatsHtml: $("humanStats")?.innerHTML || "",
      humanStatsText: ($("humanStats")?.textContent || "").replace(/\s+/g, " ").trim(),
      tableStatusHtml: $("tableStatusBar")?.innerHTML || "",
      tableStatusText: ($("tableStatusBar")?.textContent || "").replace(/\s+/g, " ").trim(),
      actionBarHtml: $("actionBar")?.innerHTML || "",
      boardHtml: $("board")?.innerHTML || "",
      playContext: Boolean(state.playContext),
      playCardId: state.playCardId,
      selectedCardName: selectedCard?.name || "",
      cardCount: human?.hand.length || 0,
      actionCount: state.playContext?.actions?.length || 0,
      waitKind: wait?.kind || "",
      waitOwner: wait?.waitingForId != null ? nameOf(playerById(wait.waitingForId)) : "",
      targetPick: state.targetPick ? {
        prompt: state.targetPick.prompt,
        min: state.targetPick.min,
        max: state.targetPick.max,
        selected: [...state.targetPick.selected],
        validNames: state.targetPick.validIds.map(playerById).filter(Boolean).map(nameOf)
      } : null,
      consistency,
      hardIssues
    };
  }

  async function humanPlayUiContractSummary() {
    const initial = prepareHumanPlayUiScenario();
    const slash = state.players[0].hand.find((card) => card.subtype === "slash");
    const clickPromise = handleCardClick(slash.id);
    await Promise.resolve();
    await Promise.resolve();
    const afterClick = humanPlayUiSnapshot();
    if (state.targetPick?.resolve) {
      const resolve = state.targetPick.resolve;
      state.targetPick = null;
      clearWait();
      resolve([]);
    }
    await clickPromise;
    const afterCancel = humanPlayUiSnapshot();
    return {
      slashId: slash.id,
      initial,
      afterClick,
      afterCancel
    };
  }

  function boardUiContractSummary() {
    const cardSpec = (name) => CARD_POOL.find((spec) => spec.name === name);
    const countMatches = (text, pattern) => (text.match(pattern) || []).length;
    const makeBoard = (mode) => {
      const ids = mode === "5"
        ? ["zhaoyun", "caocao", "liubei", "simayi", "huangyueying"]
        : ["zhaoyun", "caocao", "liubei", "simayi", "huangyueying", "zhangliao", "guanyu", "luxun"];
      const roles = mode === "5"
        ? ["主公", "反贼", "忠臣", "内奸", "反贼"]
        : ["主公", "反贼", "忠臣", "内奸", "反贼", "忠臣", "反贼", "反贼"];
      const players = ids.map((id, index) => makeScenarioPlayer(index, id, roles[index], { isHuman: index === 0, revealed: index === 0 }));
      setupScenarioState(players, { current: 1, mode });
      state.testMode = false;
      state.started = true;
      state.infoTab = "log";
      state.sidePanelCollapsed = false;
      state.logCollapsed = false;
      state.logExpanded = false;
      players[2].equip.weapon = createCard(cardSpec("青龙偃月刀"), "♠", "5");
      players[2].equip.armor = createCard(cardSpec("白银狮子"), "♣", "A");
      players[3].judgeArea = [createCard(cardSpec("乐不思蜀"), "♠", "6")];
      players[3].linked = true;
      players[4].flags.skipTurnOnce = true;
      players[4].hand = [
        createCard(cardSpec("杀"), "♠", "7"),
        createCard(cardSpec("闪"), "♥", "8"),
        createCard(cardSpec("无懈可击"), "♣", "Q")
      ];
      state.roleNotes[1] = "rebel";
      state.roleNotes[2] = "loyal";
      state.reads[1][3] = 1.2;
      state.readReasons[1][3] = ["司马懿 对主公做出进攻行为"];
      state.spotlight = {
        id: state.lastEventId++,
        ...enrichSpotlightEvent(eventFromLog(`${nameOf(players[1])} 使用 杀，目标 ${nameOf(players[0])}。`))
      };
      render();
      const html = $("board").innerHTML || "";
      const humanPanelText = ($("humanName")?.textContent || "").replace(/\s+/g, " ").trim();
      const logText = ($("log")?.textContent || "").replace(/\s+/g, " ").trim();
      return {
        mode,
        boardClass: $("board").className || "",
        playerCount: countMatches(html, /<article class="player /g),
        allSeatClassesPresent: players.every((player) => html.includes(`player p${player.id}`)),
        hasHumanSeat: html.includes("human") && html.includes("你(赵云)") && html.includes("赵云"),
        hasHumanPanelSeat: humanPanelText.includes("赵云") && humanPanelText.includes("主公") && /\d+\s*\/\s*\d+/.test(humanPanelText),
        hasCurrentBadge: html.includes("badge-active") && /(?:行动中|回合中|待操作)/.test(html),
        hasNextBadge: html.includes("badge-next") && html.includes("下家"),
        hasSeatFocusLayer: countMatches(html, /class="seat-focus"/g) === players.length,
        hasRoleNotes: countMatches(html, /class="role-note/g) === players.length,
        hasManualIdentityColors: html.includes("note-rebel") && html.includes("note-loyal"),
        hidesDebugRoleNoteLabels: !/>标[?忠反内主]</.test(html),
        hasHandCounts: countMatches(html, /class="hand-count[^"]*"[^>]*>手\d/g) === players.length,
        hasPublicEquipChip: html.includes("zone-chip zone-equip") && html.includes("白银狮子"),
        hasPublicJudgeChip: html.includes("zone-chip zone-judge") && html.includes("乐不思蜀"),
        hasPublicStateChip: html.includes("zone-state-chain") && html.includes("铁索") && html.includes("zone-state-flip") && html.includes("翻面"),
        hasSkillTags: html.includes("skill-tag"),
        hidesDefaultReadBadge: !html.includes("read-mini") && !html.includes("AI 偏反"),
        hasDirectedCenter: html.includes("center-event-directed") && html.includes("event-cast") && html.includes("mini-portrait") && html.includes("visual-arrow-line"),
        hasTurnCompass: html.includes("turn-compass") && html.includes(TURN_FLOW.label) && html.includes("下家"),
        hasTableHud: html.includes("table-hud") && html.includes("牌堆") && html.includes("弃牌") && html.includes("下家"),
        hasTablePilesDock: html.includes("table-piles-dock") && html.includes("table-pile-deck") && html.includes("table-pile-discard") && html.includes("table-pile-judge"),
        hasLiveSpotlightLog: logText.includes("曹操") && logText.includes("杀") && logText.includes("赵云") && !logText.includes("暂无战报"),
        leakedAINumber: /AI\s+\d/.test(html)
      };
    };
    return {
      five: makeBoard("5"),
      eight: makeBoard("8")
    };
  }

  function setupLandingContractSummary() {
    const htmlText = (html) => (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if ($("modeSelect")) $("modeSelect").value = "8";
    if ($("rosterSelect")) $("rosterSelect").value = "strict";
    if ($("aiMode")) $("aiMode").value = "strategist";
    if ($("debugMode")) $("debugMode").value = "off";
    refreshGeneralSelect("strict");
    updateModeLabel();
    renderSetupMatchSummary();
    const initialHtml = $("setupMatchSummary")?.innerHTML || "";
    const initialGeneralSummary = $("generalPickerSummary")?.textContent || "";
    const initialStartSubtitle = $("startGame")?.dataset.subtitle || "";
    const initialModeHtml = $("modeSegment")?.innerHTML || "";
    const initialAiHtml = $("aiSegment")?.innerHTML || "";
    const initialRosterHtml = $("rosterSegment")?.innerHTML || "";
    renderContinueGameStatus();
    const initialContinueStatus = $("continueGameStatus")?.textContent || "";
    const initialContinueDisabled = Boolean($("continueGame")?.disabled);

    if ($("modeSelect")) $("modeSelect").value = "5";
    if ($("rosterSelect")) $("rosterSelect").value = "all";
    if ($("aiMode")) $("aiMode").value = "fair";
    handleRosterModeChange();
    if ($("generalSelect")) $("generalSelect").value = "yuanshu";
    updateGeneralPickerSummary();
    updateModeLabel();
    renderSetupMatchSummary();
    const customizedHtml = $("setupMatchSummary")?.innerHTML || "";
    const customizedStartSubtitle = $("startGame")?.dataset.subtitle || "";
    const customizedModeHtml = $("modeSegment")?.innerHTML || "";
    const customizedAiHtml = $("aiSegment")?.innerHTML || "";
    const customizedRosterHtml = $("rosterSegment")?.innerHTML || "";

    return {
      initialHtml,
      initialText: htmlText(initialHtml),
      initialGeneralSummary,
      initialStartSubtitle,
      customizedHtml,
      customizedText: htmlText(customizedHtml),
      customizedStartSubtitle,
      initialModeHtml,
      customizedModeHtml,
      initialAiHtml,
      customizedAiHtml,
      initialRosterHtml,
      customizedRosterHtml,
      modeSelectClass: $("modeSelect")?.className || "",
      aiModeClass: $("aiMode")?.className || "",
      rosterSelectClass: $("rosterSelect")?.className || "",
      startLabel: $("startGame")?.textContent || "",
      continueLabel: $("continueGame")?.dataset?.label || $("continueGame")?.textContent?.replace(/\s+/g, " ").trim() || "",
      continueStatus: initialContinueStatus,
      continueDisabled: initialContinueDisabled,
      generalSummary: $("generalPickerSummary")?.textContent || "",
      generalMeta: $("generalPickerMeta")?.textContent || ""
    };
  }

  function matchSaveContractSummary() {
    const human = makeScenarioPlayer(0, "zhaoyun", "反贼", { isHuman: true, revealed: true });
    const lord = makeScenarioPlayer(1, "caocao", "主公");
    const loyal = makeScenarioPlayer(2, "liubei", "忠臣");
    setupScenarioState([human, lord, loyal], { current: lord.id, mode: "5" });
    state.testMode = false;
    state.started = true;
    state.round = 4;
    state.deck = shuffle(createDeck());
    state.players.forEach((player) => drawCards(player, 3, false));
    state.log = ["身份局开始。主公是 曹操。", "进入 曹操 的回合。"];
    const saved = saveMatchAtSafePoint("contract");
    const savedInfo = loadSavedMatchInfo();
    const settingsSaveText = ($("settingsContent")?.innerHTML || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    renderContinueGameStatus();
    const continueEnabled = $("continueGame") ? $("continueGame").disabled === false : false;
    const continueStatus = $("continueGameStatus")?.textContent || "";
    const savedDeckCount = savedInfo?.deck?.length || 0;
    const savedHumanHand = savedInfo?.players?.[0]?.hand?.length || 0;
    state.players = [];
    state.deck = [];
    state.current = 0;
    state.round = 1;
    const restored = restoreSavedMatch({ autoStart: false, renderDom: false });
    const restoredHuman = state.players[0];
    const restoredCurrent = playerById(state.current);
    const summary = {
      saved,
      savedReason: savedInfo?.reason || "",
      settingsSaveText,
      continueEnabled,
      continueStatus,
      savedDeckCount,
      savedHumanHand,
      restored,
      restoredRound: state.round,
      restoredCurrent: restoredCurrent ? nameOf(restoredCurrent) : "",
      restoredMode: state.mode,
      restoredDeckCount: state.deck.length,
      restoredHumanHand: restoredHuman?.hand?.length || 0,
      transientStateCleared: !state.pending && !state.targetPick && !state.cardPick && !state.playContext,
      canRestartLoop: state.started && !state.gameOver && state.current === lord.id
    };
    clearSavedMatch();
    renderContinueGameStatus();
    return summary;
  }

  function prepareResumeLauncherVisualScenario() {
    const human = makeScenarioPlayer(0, "zhaoyun", "反贼", { isHuman: true, revealed: true });
    const lord = makeScenarioPlayer(1, "caocao", "主公", { revealed: true });
    const loyal = makeScenarioPlayer(2, "liubei", "忠臣");
    const traitor = makeScenarioPlayer(3, "simayi", "内奸");
    const rebel = makeScenarioPlayer(4, "zhangfei", "反贼");
    setupScenarioState([human, lord, loyal, traitor, rebel], { current: lord.id, mode: "5", aiMode: "strategist" });
    state.testMode = false;
    state.started = true;
    state.round = 4;
    state.deck = shuffle(createDeck());
    state.discard = [
      createCard(CARD_POOL.find((card) => card.name === "杀"), "♠", "7"),
      createCard(CARD_POOL.find((card) => card.name === "闪"), "♥", "8")
    ];
    state.players.forEach((player) => drawCards(player, player.isHuman ? 4 : 3, false));
    state.log = [
      "身份局开始。主公是 曹操。",
      "进入 曹操 的回合。",
      "曹操 摸 2 张牌。"
    ];
    saveMatchAtSafePoint("turn-start");
    Object.assign(state, {
      started: false,
      gameOver: false,
      pending: null,
      targetPick: null,
      cardPick: null,
      playContext: null,
      testMode: false
    });
    document.body?.classList?.remove?.("in-game");
    setGameViewportLock(false);
    $("game")?.classList.add("hidden");
    $("setup")?.classList.remove("hidden");
    if ($("modeSelect")) $("modeSelect").value = "5";
    if ($("aiMode")) $("aiMode").value = "strategist";
    if ($("rosterSelect")) $("rosterSelect").value = "strict";
    refreshGeneralSelect("strict");
    renderSetupMatchSummary();
    renderContinueGameStatus();
    return {
      buttonText: $("continueGame")?.textContent?.replace(/\s+/g, " ").trim() || "",
      status: $("continueGameStatus")?.textContent || "",
      ready: $("continueGame")?.classList?.contains("is-ready") || false,
      disabled: Boolean($("continueGame")?.disabled)
    };
  }

  if (typeof window !== "undefined") {
    window.__SGS_TEST_API = {
      runSmokeTest,
      stabilityMatrixSummary,
      ruleRegressionSummary,
      aiSupportScenarioSummary,
      generalSelectionContractSummary,
      aiDecisionTrailContractSummary,
      careerRegressionSummary,
      victoryStatusSummary,
      identityReadScenarioSummary,
      lordTargetingScenarioSummary,
      traitorControlScenarioSummary,
      aiReadsPanelContractSummary,
      eventVisualContractSummary,
      tempoContractSummary,
      battleLogContractSummary,
      nameDisplayContractSummary,
      layoutPreferenceSummary,
      fairnessContractSummary,
      prepareHumanPlayUiScenario,
      prepareActionPromptOverflowScenario,
      prepareSkillGainVisualScenario,
      prepareDelayedNullifyVisualScenario,
      prepareJudgementRevealVisualScenario,
      prepareRelationEventVisualScenario,
      prepareDeathRevealVisualScenario,
      prepareAIDecisionTrailVisualScenario,
      prepareEndGameVisualScenario,
      humanPlayUiContractSummary,
      boardUiContractSummary,
      setupLandingContractSummary,
      matchSaveContractSummary,
      prepareResumeLauncherVisualScenario,
      parseLogEvent(message) {
        return enrichSpotlightEvent(eventFromLog(message));
      },
      cardImageSummary() {
        const mapped = Object.entries(CARD_IMAGE_ASSETS).map(([name, url]) => ({ name, url }));
        return {
          count: mapped.length,
          officialCount: mapped.filter((item) => item.url.startsWith("assets/cards/official/")).length,
          mapped,
          required: ["杀", "闪", "桃", "酒", "无懈可击", "南蛮入侵", "万箭齐发", "乐不思蜀", "兵粮寸断"]
            .map((name) => ({ name, url: cardImageUrl(name) }))
        };
      },
      turnFlowSummary(mode = "8") {
        resetState();
        state.testMode = true;
        state.mode = String(mode) === "5" ? "5" : "8";
        setupPlayers("random");
        state.current = 0;
        const allAliveNext = nextAliveIndex(0);
        state.players[1].alive = false;
        const skipDeadNext = nextAliveIndex(0);
        state.players[1].alive = true;
        return {
          mode: state.mode,
          step: TURN_FLOW.step,
          label: TURN_FLOW.label,
          humanNextHint: TURN_FLOW.humanNextHint,
          humanSeat: state.players[0]?.seat,
          allAliveNext,
          allAliveNextSeat: state.players[allAliveNext]?.seat,
          skipDeadNext,
          skipDeadNextSeat: state.players[skipDeadNext]?.seat,
          path: upcomingTurnPlayers(4).map((player) => ({ id: player.id, seat: player.seat, name: nameOf(player) }))
        };
      },
      rosterSummary() {
        const summarizeMode = (mode) => {
          const generals = rosterGenerals(mode);
          const ids = generals.map((general) => general.id);
          return {
            mode,
            count: generals.length,
            ids,
            names: generals.map((general) => general.name),
            hasHuaxiong: ids.includes("huaxiong"),
            hasXunyou: ids.includes("xunyou")
          };
        };
        return {
          totalGenerals: GENERALS.length,
          modes: ["strict", "standard2013", "all"].map(summarizeMode),
          extras: {
            standard2013: Array.from(ROSTER_EXTRAS.standard2013),
            future: Array.from(ROSTER_EXTRAS.future)
          }
        };
      },
      setupRosterSelectSummary(mode = "all") {
        const rosterSelect = $("rosterSelect");
        const generalSelect = $("generalSelect");
        if (rosterSelect) rosterSelect.value = mode;
        handleRosterModeChange();
        const html = generalSelect?.innerHTML || "";
        return {
          stateRosterMode: state.rosterMode,
          randomLabel: html.match(/<option value="random">([^<]+)<\/option>/)?.[1] || "",
          optionCount: (html.match(/<option /g) || []).length,
          includesYuanshu: html.includes('value="yuanshu"'),
          includesFazheng: html.includes('value="fazheng"'),
          includesXushu: html.includes('value="xushu"'),
          includesZhangchunhua: html.includes('value="zhangchunhua"'),
          includesWuguotai: html.includes('value="wuguotai"'),
          includesBulianshi: html.includes('value="bulianshi"')
        };
      },
      tooltipContractSummary() {
        const sampleCards = ["杀", "闪", "无懈可击", "乐不思蜀", "白银狮子"]
          .map((name) => createCard(CARD_POOL.find((spec) => spec.name === name), "♠", "A"))
          .map((card) => ({ name: card.name, text: cardTooltipText(card) }));
        const harvestChoiceTooltips = harvestChoiceOptions([
          createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "7"),
          createCard(CARD_POOL.find((spec) => spec.name === "无懈可击"), "♣", "Q")
        ]).map((option) => ({ label: option.label, text: option.tip }));
        const skillSamples = ["jizhi", "rende", "qingnang", "jieyin", "ganglie", "lijian", "guhuo", "qiangxi", "kanpo", "haoshi", "dimeng", "leiji", "guidao", "zhiheng", "guose", "fanjian", "tieji", "liuli", "liegong", "kuanggu", "jiuchi", "roulin", "wansha", "jiuyuan", "kurou", "luoyi", "mengjin", "shensu", "xueyi", "jushou", "fangzhu", "songwei", "zhiba"].map((skill) => ({ skill, text: skillTooltipText(skill) }));
        const actionSamples = [
          { label: "杀", type: "card", card: createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "A") },
          { label: "急救", type: "skill", skill: "jijiu" }
        ].map((action) => ({ label: action.label, text: actionRuleText(action) }));
        const tooltipPlayer = makeScenarioPlayer(0, "zuoci", "忠臣", { isHuman: true, revealed: false });
        const other = makeScenarioPlayer(1, "caocao", "主公");
        setupScenarioState([tooltipPlayer, other], { current: 0, mode: "5" });
        tooltipPlayer.extraSkills = ["jixi", "rende"];
        tooltipPlayer.tempSkills = ["wusheng"];
        tooltipPlayer.disabledSkills = ["rende"];
        tooltipPlayer.equip.armor = createCard(CARD_POOL.find((spec) => spec.name === "白银狮子"), "♣", "A");
        tooltipPlayer.judgeArea = [createCard(CARD_POOL.find((spec) => spec.name === "兵粮寸断"), "♣", "4")];
        state.roleNotes[tooltipPlayer.id] = "rebel";
        const limitedPlayer = makeScenarioPlayer(0, "jiaxu", "反贼", { isHuman: true, revealed: false });
        setupScenarioState([limitedPlayer, other], { current: 0, mode: "5" });
        limitedPlayer.flags.luanwuUsed = true;
        const limitedEntries = currentSkillEntries(limitedPlayer);
        const limitedPlayerHtml = renderPlayer(limitedPlayer, {
          kind: "system",
          actor: "系统",
          title: "限定技测试",
          target: "",
          detail: "",
          actorId: null,
          targetIds: [],
          damageIds: []
        });
        const statusSkillTooltips = currentSkillEntries(tooltipPlayer)
          .map((entry) => ({
            skill: entry.skill,
            source: entry.source,
            disabled: entry.disabled,
            text: currentSkillTip(entry)
          }));
        const playerHtml = renderPlayer(tooltipPlayer, {
          kind: "system",
          actor: "系统",
          title: "测试",
          target: "",
          detail: "",
          actorId: null,
          targetIds: [],
          damageIds: []
        });
        return {
          cardTooltips: sampleCards,
          harvestChoiceTooltips,
          skillTooltips: skillSamples,
          actionTooltips: actionSamples,
          equipmentTooltip: equipmentRuleText(tooltipPlayer.equip.armor),
          judgeTooltip: cardTooltipText(tooltipPlayer.judgeArea[0]),
          statusSkillTooltips,
          roleNoteTooltips: ROLE_NOTE_ORDER.map((note) => ({ note, label: ROLE_NOTE_LABEL[note], text: ROLE_NOTE_LONG[note] })),
          playerHtmlContracts: {
            hasAvatarTip: playerHtml.includes("技能："),
            hasEquipTip: playerHtml.includes("白银狮子"),
            hasJudgeTip: playerHtml.includes("兵粮寸断"),
            hasRoleNoteTip: playerHtml.includes("我的标注"),
            hasExtraSkillBadge: playerHtml.includes("skill-extra"),
            hasTempSkillBadge: playerHtml.includes("skill-temp"),
            hasDisabledSkillClass: playerHtml.includes("skill-disabled"),
            hasLimitedSkillClass: limitedPlayerHtml.includes("skill-limited"),
            hasSpentSkillClass: limitedPlayerHtml.includes("skill-spent"),
            hasSpentLimitedBadge: limitedPlayerHtml.includes(">已</small>")
          },
          limitedSkillTooltips: limitedEntries
            .filter((entry) => entry.limited)
            .map((entry) => ({
              skill: entry.skill,
              spent: entry.spent,
              text: currentSkillTip(entry)
            })),
          playTipIdle: playContextTip(null, []),
          playTipSelected: playContextTip(createCard(CARD_POOL.find((spec) => spec.name === "杀"), "♠", "A"), [{ label: "杀" }])
        };
      }
    };
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
