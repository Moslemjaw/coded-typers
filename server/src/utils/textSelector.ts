import mongoose from 'mongoose';
import Text from '../models/Text';

// ============================================================
// Text Selector — Large Paragraph Pool (No Repeats Per Game)
// ============================================================

const ENGLISH_EASY = [
  'My cat looks at me like I owe her money every single time I walk past the kitchen. She sits by her bowl with dramatic disappointment, pretending she has never been fed in her entire nine lives despite eating ten minutes ago.',
  'Why does my brain decide to remember embarrassing things I said eight years ago right when I am trying to fall asleep? I could be peacefully drifting off when suddenly my memory reminds me of the time I said you too to the waiter who told me to enjoy my meal.',
  'I told myself I was only going to eat one potato chip, but thirty minutes later I found myself holding an empty bag and staring into the void of regret. Potato chips have a secret magical ability to disappear into thin air the moment you open the package.',
  'Setting an alarm for six in the morning is an act of pure optimism. Snoozing that alarm seven times until six forty-five is an act of pure reality. The bed is always at its warmest and comfiest precisely when you need to get out of it.',
  'Every time I open the fridge hoping something new has appeared, I am disappointed again. I stare at the same mustard bottle and leftover rice like a detective solving a cold case that has no answers.',
  'My dog thinks every single person who walks by our house is a direct threat. He goes absolutely ballistic at the mailman like the guy just declared war on our entire family. Meanwhile the mailman just wants to drop off a pizza coupon.',
  'I tried to make my bed this morning and somehow ended up making it worse. The fitted sheet popped off one corner, then another, and suddenly I was wrestling a giant elastic ghost that refused to stay put.',
  'The moment I sit down after standing up all day is the exact moment someone asks me to grab something from upstairs. Every single time. It is like they have a sensor that detects maximum comfort before striking.',
  'You ever walk into a room and completely forget why you went in there? So you stand there looking around like a confused tourist trying to remember your entire life mission in three seconds flat.',
  'I just spent twenty minutes looking for my phone while holding it in my hand the entire time. I even used the flashlight on it to check under the couch cushions. My brain officially needs a software update.',
  'The WiFi always drops at the worst possible moment. Never when I am doing nothing, but right when I am about to win a game or send an important message. The router is my personal nemesis.',
  'Trying to fold a fitted sheet is basically competitive origami with no instructions and zero chance of success. I just roll it into a ball and pretend it is folded. Nobody has ever successfully folded one and that is a hill I will stand on.',
];

const ENGLISH_MEDIUM = [
  'Scientists have proven that searching for the end of a roll of clear tape is one of the most frustrating experiences known to mankind. You scrape your fingernail around the plastic cylinder fifty times in total darkness, questioning all of your life choices until you finally find the seam.',
  'Parallel parking while people are watching in public is a high-stakes psychological thriller. Suddenly your hands forget how a steering wheel works, your mirrors seem to betray you, and you end up parking three feet away from the curb just to escape the pressure of the audience.',
  'If typing fast on a mechanical keyboard actually generated electricity, I would be powering a small residential neighborhood right now. My roommates think I am writing an important bestseller, but in reality I am just aggressively losing a multiplayer typing race to a person named Banana.',
  'The unwritten law of grocery shopping dictates that no matter which checkout line you choose, the other line will always move three times faster. The moment you decide to switch lines, the person in front of you produces a stack of expired coupons and a bag of unpriced avocados.',
  'Every printer on earth has a personal vendetta against its owner. It will work perfectly for months, then the moment you need to print something important in five minutes, it decides to have a paper jam, run out of cyan ink, and question its entire purpose in life.',
  'The five-second rule is the most generous law of physics ever invented by humans. A cookie hits the floor and suddenly everyone becomes a microbiologist who has determined that bacteria need exactly six seconds to colonize baked goods. The cookie is always fine. Always.',
  'Trying to cancel a subscription online requires you to navigate through seventeen pages of guilt-tripping pop-ups asking if you are sure. They show sad puppy faces and claim your life will be incomplete without their service. It takes longer to unsubscribe than it took to sign up.',
  'Group projects in school taught me one important life lesson: some people are carried and some people do the carrying. There is always one person who does ninety percent of the work and four people who show up on presentation day having never opened the shared document.',
  'The recommended amount of sleep is eight hours, but my brain has decided that scrolling through random videos at two in the morning is more important. Every night I tell myself I will sleep early, and every night my phone laughs at that suggestion.',
  'When your phone is at two percent battery, it suddenly gains the ability to die faster than at any other percentage. It goes from two percent to dead in the time it takes you to say where is my charger. The last percent is basically decorative.',
  'Autocorrect has ruined more text conversations than bad signal ever could. I have told people I love duck soup, I am going to the birthday, and my personal favorite, I will be there in a sexond. I have never once meant to type any of those things.',
  'Walking into a spiderweb instantly transforms the calmest person on earth into a flailing ninja warrior. Arms go everywhere, legs kick in every direction, and you suddenly develop martial arts skills you never knew you had, all while screaming at thin air.',
];

const ENGLISH_HARD = [
  'According to quantum mechanics and Murphy Law, the exact moment you place your phone face down on a soft pillow, a notification will chime. Conversely, dropping your phone on solid concrete guarantees it will land screen first with maximum dramatic effect while you hold your breath in utter terror.',
  'Attempts to understand why socks disappear inside the washing machine have puzzled domestic scientists for generations. It is widely theorized that single socks transcend our physical dimension through a fabric-based wormhole, emerging in a parallel universe where thousands of unmatched left socks party forever.',
  'Negotiating with a toddler who refuses to wear shoes is more intense than high-level international diplomacy. You offer bribery, reason, and emotional appeals, only for them to look you dead in the eye, throw both shoes into the bushes, and run around like a wild chaotic goblin.',
  'The human brain can store approximately two point five petabytes of information, yet it consistently fails to remember why you walked into the kitchen thirty seconds ago. Meanwhile, it has no trouble replaying that embarrassing thing you said to your crush in middle school on a continuous loop.',
  'There is a special kind of panic that occurs when you pat your pocket and do not feel your phone. In that fraction of a second, your entire life flashes before your eyes, your heart rate triples, and your brain begins composing your farewell speech to technology and modern civilization.',
  'The art of pretending to understand someone after asking them to repeat themselves three times is a skill that should be listed on professional resumes. You just smile, nod, and pray they did not ask you a question, because you will absolutely answer wrong and both of you will know it.',
  'Every person has experienced the devastating betrayal of a shopping bag handle breaking at the worst possible moment. Cans roll into the street, eggs meet their untimely end on the sidewalk, and you stand there holding two useless plastic ribbons while your groceries declare independence.',
  'The average person spends approximately six months of their lifetime waiting for red lights to turn green. During this existential waiting period, you will question your route choices, consider alternate timelines, and develop a deeply personal rivalry with the traffic light sensor.',
  'Public bathroom hand dryers operate under the scientific principle of blowing lukewarm disappointment onto your wet hands for exactly forty-five seconds before you give up and wipe them on your pants anyway. No one in recorded history has ever achieved fully dry hands using one of these machines.',
  'Trying to take a group photo where everyone looks good simultaneously is a mathematical impossibility according to modern statistics. Someone always blinks, another person looks the wrong way, and there is always that one friend who somehow manages to look directly into the sun.',
];

const ARABIC_EASY = [
  'تنظر إلي قطتي وكأنني مدين لها بالمال في كل مرة أمر فيها بجانب المطبخ. تقف بجانب وعائها الفارغ بتمثيل درامي عجيب، متظاهرة بأنها لم تأكل منذ تسع سنوات رغم أنها أنهت وجبتها قبل عشر دقائق فقط.',
  'لماذا يتذكر عقلي التافه كل المواقف المحرجة التي حدثت قبل ثماني سنوات في اللحظة التي أحاول فيها النوم؟ أكون على وشك الغرق في نوم عميق، وفجأة يذكرني عقلي بالمرة التي قلت فيها للنادل وأنت بخير عندما قال لي أتمنى لك وجبة شهية.',
  'قلت لنفسي سآكل قطعة واحدة فقط من الشيبس، ولكن بعد ثلاثين دقيقة وجدت نفسي أحمل كيسًا فارغًا وأحدق في الفراغ بندم شديد. تتمتع بطاطس الشيبس بقدرة سحرية عجيبة على الاختفاء بمجرد فتح الكيس.',
  'ضبط المنبه على الساعة السادسة صباحاً هو قمة التفاؤل والنشاط. ولكن الضغط على زر التأجيل سبع مرات حتى السابعة إلا ربع هو الواقع الحقيقي الملموس. يكون السرير في أقصى درجات الدفء والراحة تماماً في اللحظة التي يجب عليك فيها الاستيقاظ.',
  'في كل مرة أفتح الثلاجة وأتوقع أن شيئاً جديداً سيظهر بأعجوبة أصاب بخيبة أمل كبيرة. أحدق في نفس علبة المستردة والأرز المتبقي وكأنني محقق يحل لغزاً بارداً لا جواب له.',
  'كلبي يعتقد أن كل شخص يمشي أمام بيتنا يمثل تهديداً مباشراً لأمننا القومي. يهجم على ساعي البريد وكأن الرجل أعلن الحرب علينا. بينما كل ما يريده ساعي البريد هو تسليم إعلان بيتزا.',
  'حاولت ترتيب سريري هذا الصباح وبطريقة ما جعلته أسوأ. انفلت الملاءة من زاوية ثم أخرى وفجأة وجدت نفسي أصارع شبحاً مطاطياً عملاقاً يرفض البقاء في مكانه.',
  'اللحظة التي أجلس فيها بعد يوم طويل من الوقوف هي بالضبط اللحظة التي يطلب مني أحدهم أن أحضر شيئاً من الطابق العلوي. في كل مرة. كأن لديهم مستشعراً يكتشف أقصى درجات الراحة قبل الهجوم.',
  'هل سبق ودخلت غرفة ونسيت تماماً لماذا ذهبت إليها؟ فتقف هناك تنظر حولك كسائح حائر يحاول تذكر مهمة حياته في ثلاث ثوانٍ فقط.',
  'قضيت عشرين دقيقة أبحث عن هاتفي بينما كنت أمسكه في يدي طوال الوقت. حتى أنني استخدمت كشافه للبحث تحت وسائد الكنبة. عقلي يحتاج تحديث رسمياً.',
  'الواي فاي ينقطع دائماً في أسوأ لحظة ممكنة. ليس عندما لا أفعل شيئاً، بل في اللحظة التي أوشك فيها على الفوز في لعبة أو إرسال رسالة مهمة.',
  'محاولة طي ملاءة السرير المطاطية هي فن أوريغامي تنافسي بلا تعليمات. أنا فقط ألفها ككرة وأتظاهر بأنها مطوية. لم ينجح أحد في طيها أبداً وهذا موقفي النهائي.',
];

const ARABIC_MEDIUM = [
  'أثبت العلماء أن البحث عن بداية شريط اللاصق الشفاف هو أكثر تجربة استفزازية عرفتها البشرية. تمرر أظافرك حول البكرة خمسين مرة في ظلام دامس، متسائلاً عن جميع قرارات حياتك حتى تعثر أخيراً على طرف الشريط.',
  'إن محاولة إيقاف السيارة بالرجوع للخلف بينما يراقبك الناس في الشارع هي فيلم رعب سينمائي متكامل. وفجأة تنسى يداك كيف تعمل عجلة القيادة، وتخونك المرايا، وتنتهي بالموقف بعيداً عن الرصيف بمتريّن فقط للهرب من ضغط الجماهير.',
  'لو كان الكتابة السريعة على لوحة المفاتيح تولد كهرباء حقيقية، لكنت أزود حياً سكنياً كاملاً بالطاقة الآن. يعتقد أصدقائي أنني أكتب رواية عالمية مهمة، بينما في الحقيقة أنا فقط أخسر بحماس في سباق طباعة ضد شخص يسمى موز.',
  'قانون السوبرماركت غير مكتوب يقول: بغض النظر عن طابور الدفع الذي تختاره، فإن الطابور الآخر سيمشي أسرع بثلاث مرات. وفي اللحظة التي قررت فيها الانتقال للطابور الآخر، يخرج الشخص الذي أمامك حزمة قسائم منتهية الصلاحية.',
  'كل طابعة على وجه الأرض لديها عداوة شخصية مع صاحبها. تعمل بشكل مثالي لأشهر، ثم في اللحظة التي تحتاج فيها لطباعة شيء مهم في خمس دقائق تقرر أن تعلق الورقة وينفد الحبر الأزرق وتتساءل عن هدفها في الحياة.',
  'قاعدة الخمس ثوانٍ هي أكثر قانون فيزيائي كرماً اخترعه البشر. تسقط البسكويتة على الأرض وفجأة يتحول الجميع لعلماء أحياء دقيقة يؤكدون أن البكتيريا تحتاج ست ثوانٍ بالضبط لاستعمار المخبوزات.',
  'محاولة إلغاء الاشتراك على الإنترنت تتطلب المرور بسبع عشرة صفحة من النوافذ المنبثقة التي تشعرك بالذنب. يعرضون صور جراء حزينة ويزعمون أن حياتك ستكون ناقصة بدون خدمتهم.',
  'المشاريع الجماعية في المدرسة علمتني درساً مهماً: هناك من يحمل وهناك من يُحمل. دائماً هناك شخص واحد يعمل تسعين بالمئة من العمل وأربعة أشخاص يحضرون يوم العرض دون أن يفتحوا الملف المشترك أصلاً.',
  'الكمية الموصى بها من النوم هي ثماني ساعات لكن عقلي قرر أن تصفح الفيديوهات العشوائية في الثانية صباحاً أهم بكثير. كل ليلة أقول لنفسي سأنام مبكراً وكل ليلة يضحك هاتفي على هذا الاقتراح.',
  'عندما تكون بطارية هاتفك عند اثنين بالمئة يكتسب فجأة القدرة على الموت أسرع من أي نسبة أخرى. ينتقل من اثنين بالمئة إلى الصفر في الوقت الذي تقول فيه أين الشاحن.',
  'التصحيح التلقائي دمر محادثات نصية أكثر مما فعلت الإشارة الضعيفة في تاريخ البشرية. أخبرت أصدقائي أنني أحب شوربة البط وأنني ذاهب لعيد الميلاد وسأكون هناك في ثانوية.',
  'المشي في بيت عنكبوت يحول أهدأ شخص على الأرض إلى محارب نينجا يلوح بذراعيه في كل اتجاه ويركل بقدميه ويصرخ في الهواء وكأنه اكتشف فجأة مهارات فنون قتالية لم يكن يعرف بوجودها.',
];

const ARABIC_HARD = [
  'وفقاً لقوانين الفيزياء وقانون مورفي، في اللحظة التي تضع فيها هاتفك على الوسادة النظيفة يأتيك إشعار. وفي المقابل، فإن سقوط هاتفك على الأرض الخرسانية الصلبة يضمن هبوطه على الشاشة مباشرة بأقصى درجات الدراما بينما تحبس أنفاسك في رعب شديد.',
  'محاولات فهم سبب اختفاء فردة الجوارب داخل الغسالة حيرت علماء المنازل لعدة أجيال. وهناك نظرية تصر على أن الجوارب المفردة تعبر إلى أبعاد موازية عبر ثقب ثوبي أسود، لتلتقي جميع الجوارب الضائعة في حفلة أبدية لا تنتهي.',
  'التفاوض مع طفل صغير يرفض ارتداء حذائه أكثر صعوبة من الدبلوماسية الدولية الكبرى. تقدم له الرشاوى والوعود العاطفية، لينظر في عينيك مباشرة ويقذف الحذاء في الهواء ويركض في أرجاء البيت كالغول الصغير.',
  'يستطيع الدماغ البشري تخزين حوالي اثنين ونصف بيتابايت من المعلومات، ومع ذلك يفشل باستمرار في تذكر لماذا دخلت المطبخ قبل ثلاثين ثانية. في المقابل لا يواجه أي مشكلة في إعادة تشغيل ذلك الموقف المحرج الذي قلته لصديقك في المتوسطة.',
  'هناك نوع خاص من الذعر يحدث عندما تربت على جيبك ولا تشعر بهاتفك. في تلك اللحظة الجزئية تمر حياتك أمام عينيك، ويتضاعف نبض قلبك ثلاث مرات، ويبدأ عقلك بتأليف كلمة وداع للتكنولوجيا والحضارة الحديثة بأكملها.',
  'فن التظاهر بفهم شخص بعد أن طلبت منه إعادة كلامه ثلاث مرات هو مهارة يجب إدراجها في السير الذاتية المهنية. تبتسم وتهز رأسك وتدعو الله ألا يكون قد سألك سؤالاً لأنك ستجيب إجابة خاطئة وكلاكما سيعرف ذلك.',
  'مر كل شخص بخيانة مقبض كيس التسوق الذي ينقطع في أسوأ لحظة ممكنة. تتدحرج العلب في الشارع وتلقى البيض حتفه على الرصيف وتقف هناك ممسكاً بشريطين بلاستيكيين عديمي الفائدة بينما تعلن مشترياتك استقلالها.',
  'يقضي الشخص العادي حوالي ستة أشهر من حياته في الانتظار عند الإشارات الحمراء. خلال فترة الانتظار الوجودية هذه ستشكك في خيارات طريقك وتفكر في جداول زمنية بديلة وتطور عداوة شخصية عميقة مع حساس إشارة المرور.',
  'مجففات الأيدي في الحمامات العامة تعمل وفق مبدأ علمي يقضي بنفخ خيبة أمل فاترة على يديك المبللتين لمدة خمس وأربعين ثانية قبل أن تستسلم وتمسحهما بسروالك. لم ينجح أي إنسان في التاريخ في تجفيف يديه بالكامل باستخدام واحدة.',
  'محاولة التقاط صورة جماعية يبدو فيها الجميع بشكل جيد في نفس الوقت هي استحالة رياضية وفقاً للإحصاء الحديث. دائماً أحدهم يغمض عينيه وآخر ينظر في الاتجاه الخاطئ وهناك دائماً صديق ينجح بطريقة ما في النظر مباشرة إلى الشمس.',
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

/** Select unique random text passages per round — ALWAYS ensures no repeats within a game */
export async function selectText(
  language: string,
  difficulty: string,
  usedTexts: Set<string> = new Set()
): Promise<SelectedPassages> {
  const engPool = getPoolByLang('english', difficulty);
  const araPool = getPoolByLang('arabic', difficulty);

  // Filter out already used passages
  let engUnused = engPool.filter(t => !usedTexts.has(t));
  let araUnused = araPool.filter(t => !usedTexts.has(t));

  // If all passages in the pool have been used, reset (allow full pool again)
  if (engUnused.length === 0) engUnused = [...engPool];
  if (araUnused.length === 0) araUnused = [...araPool];

  // Pick a random passage from unused pool
  const chosenEng = engUnused[Math.floor(Math.random() * engUnused.length)];
  const chosenAra = araUnused[Math.floor(Math.random() * araUnused.length)];

  const normLang = (language || 'english').toLowerCase();
  const defaultText = normLang === 'arabic' ? chosenAra : chosenEng;

  return {
    content: defaultText,
    textEnglish: chosenEng,
    textArabic: chosenAra,
    textId: null,
  };
}
