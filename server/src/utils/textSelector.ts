import mongoose from 'mongoose';
import Text from '../models/Text';

// ============================================================
// Text Selector — Hilarious, Fun & Random Passages (Monkeytype Style)
// ============================================================

const ENGLISH_EASY = [
  'My cat looks at me like I owe her money every single time I walk past the kitchen. She sits by her bowl with dramatic disappointment, pretending she has never been fed in her entire nine lives despite eating ten minutes ago.',
  'Why does my brain decide to remember embarrassing things I said eight years ago right when I am trying to fall asleep? I could be peacefully drifting off when suddenly my memory reminds me of the time I said you too to the waiter who told me to enjoy my meal.',
  'I told myself I was only going to eat one potato chip, but thirty minutes later I found myself holding an empty bag and staring into the void of regret. Potato chips have a secret magical ability to disappear into thin air the moment you open the package.',
  'Setting an alarm for six in the morning is an act of pure optimism. Snoozing that alarm seven times until six forty-five is an act of pure reality. The bed is always at its warmest and comfiest precisely when you need to get out of it.',
];

const ENGLISH_MEDIUM = [
  'Scientists have proven that searching for the end of a roll of clear tape is one of the most frustrating experiences known to mankind. You scrape your fingernail around the plastic cylinder fifty times in total darkness, questioning all of your life choices until you finally find the seam.',
  'Parallel parking while people are watching in public is a high-stakes psychological thriller. Suddenly your hands forget how a steering wheel works, your mirrors seem to betray you, and you end up parking three feet away from the curb just to escape the pressure of the audience.',
  'If typing fast on a mechanical keyboard actually generated electricity, I would be powering a small residential neighborhood right now. My roommates think I am writing an important bestseller, but in reality I am just aggressively losing a multiplayer typing race to a person named Banana.',
  'The unwritten law of grocery shopping dictates that no matter which checkout line you choose, the other line will always move three times faster. The moment you decide to switch lines, the person in front of you produces a stack of expired coupons and a bag of unpriced avocados.',
];

const ENGLISH_HARD = [
  'According to quantum mechanics and Murphy Law, the exact moment you place your phone face down on a soft pillow, a notification will chime. Conversely, dropping your phone on solid concrete guarantees it will land screen first with maximum dramatic effect while you hold your breath in utter terror.',
  'Attempts to understand why socks disappear inside the washing machine have puzzled domestic scientists for generations. It is widely theorized that single socks transcend our physical dimension through a fabric-based wormhole, emerging in a parallel universe where thousands of unmatched left socks party forever.',
  'Negotiating with a toddler who refuses to wear shoes is more intense than high-level international diplomacy. You offer bribery, reason, and emotional appeals, only for them to look you dead in the eye, throw both shoes into the bushes, and run around like a wild chaotic goblin.',
];

const ARABIC_EASY = [
  'تنظر إلي قطتي وكأنني مدين لها بالمال في كل مرة أمر فيها بجانب المطبخ. تقف بجانب وعائها الفارغ بتمثيل درامي عجيب، متظاهرة بأنها لم تأكل منذ تسع سنوات رغم أنها أنهت وجبتها قبل عشر دقائق فقط.',
  'لماذا يتذكر عقلي التافه كل المواقف المحرجة التي حدثت قبل ثماني سنوات في اللحظة التي أحاول فيها النوم؟ أكون على وشك الغرق في نوم عميق، وفجأة يذكرني عقلي بالمرة التي قلت فيها للنادل وأنت بخير عندما قال لي أتمنى لك وجبة شهية.',
  'قلت لنفسي سآكل قطعة واحدة فقط من الشيبس، ولكن بعد ثلاثين دقيقة وجدت نفسي أحمل كيسًا فارغًا وأحدق في الفراغ بندم شديد. تتمتع بطاطس الشيبس بقدرة سحرية عجيبة على الاختفاء بمجرد فتح الكيس.',
  'ضبط المنبه على الساعة السادسة صباحاً هو قمة التفاؤل والنشاط. ولكن الضغط على زر التأجيل سبع مرات حتى السابعة إلا ربع هو الواقع الحقيقي الملموس. يكون السرير في أقصى درجات الدفء والراحة تماماً في اللحظة التي يجب عليك فيها الاستيقاظ.',
];

const ARABIC_MEDIUM = [
  'أثبت العلماء أن البحث عن بداية شريط اللاصق الشفاف هو أكثر تجربة استفزازية عرفتها البشرية. تمرر أظافرك حول البكرة خمسين مرة في ظلام دامس، متسائلاً عن جميع قرارات حياتك حتى تعثر أخيراً على طرف الشريط.',
  'إن محاولة إيقاف السيارة بالرجوع للخلف بينما يراقبك الناس في الشارع هي فيلم رعب سينمائي متكامل. وفجأة تنسى يداك كيف تعمل عجلة القيادة، وتخونك المرايا، وتنتهي بالموقف بعيداً عن الرصيف بمتريّن فقط للهرب من ضغط الجماهير.',
  'لو كان الكتابة السريعة على لوحة المفاتيح تولد كهرباء حقيقية، لكنت أزود حياً سكنياً كاملاً بالطاقة الآن. يعتقد أصدقائي أنني أكتب رواية عالمية مهمة، بينما في الحقيقة أنا فقط أخسر بحماس في سباق طباعة ضد شخص يسمى موز.',
  'قانون السوبرماركت غير مكتوب يقول: بغض النظر عن طابور الدفع الذي تختاره، فإن الطابور الآخر سيمشي أسرع بثلاث مرات. وفي اللحظة التي قررت فيها الانتقال للطابور الآخر، يخرج الشخص الذي أمامك حزمة قسائم منتهية الصلاحية.',
];

const ARABIC_HARD = [
  'وفقاً لقوانين الفيزياء وقانون مورفي، في اللحظة التي تضع فيها هاتفك على الوسادة النظيفة يأتيك إشعار. وفي المقابل، فإن سقوط هاتفك على الأرض الخرسانية الصلبة يضمن هبوطه على الشاشة مباشرة بأقصى درجات الدراما بينما تحبس أنفاسك في رعب شديد.',
  'محاولات فهم سبب اختفاء فردة الجوارب داخل الغسالة حيرت علماء المنازل لعدة أجيال. وهناك نظرية تصر على أن الجوارب المفردة تعبر إلى أبعاد موازية عبر ثقب ثوبي أسود، لتلتقي جميع الجوارب الضائعة في حفلة أبدية لا تنتهي.',
  'التفاوض مع طفل صغير يرفض ارتداء حذائه أكثر صعوبة من الدبلوماسية الدولية الكبرى. تقدم له الرشاوى والوعود العاطفية، لينظر في عينيك مباشرة ويقذف الحذاء في الهواء ويركض في أرجاء البيت كالغول الصغير.',
];

function getPoolByLang(lang: string, diff: string): string[] {
  if (lang === 'arabic') {
    if (diff === 'easy') return ARABIC_EASY;
    if (diff === 'hard') return ARABIC_HARD;
    return ARABIC_MEDIUM;
  }
  // English
  if (diff === 'easy') return ENGLISH_EASY;
  if (diff === 'hard') return ENGLISH_HARD;
  return ENGLISH_MEDIUM;
}

export interface SelectedPassages {
  content: string; // Default passage
  textEnglish: string; // English passage for English competitors
  textArabic: string; // Arabic passage for Arabic competitors
  textId: string | null;
}

/** Select unique random text passages per round for both English and Arabic players */
export async function selectText(
  language: string,
  difficulty: string,
  usedTexts: Set<string> = new Set()
): Promise<SelectedPassages> {
  const engPool = getPoolByLang('english', difficulty);
  const araPool = getPoolByLang('arabic', difficulty);

  // Filter unused
  const engUnused = engPool.filter(t => !usedTexts.has(t));
  const araUnused = araPool.filter(t => !usedTexts.has(t));

  const chosenEng = (engUnused.length > 0 ? engUnused : engPool)[Math.floor(Math.random() * (engUnused.length || engPool.length))];
  const chosenAra = (araUnused.length > 0 ? araUnused : araPool)[Math.floor(Math.random() * (araUnused.length || araPool.length))];

  const normLang = (language || 'english').toLowerCase();

  let defaultText = chosenEng;
  if (normLang === 'arabic') {
    defaultText = chosenAra;
  }

  return {
    content: defaultText,
    textEnglish: chosenEng,
    textArabic: chosenAra,
    textId: null,
  };
}
