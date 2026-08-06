import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Text from '../models/Text';

dotenv.config();

// ============================================================
// Seed Data — Typing texts for all languages and difficulties
// ============================================================

interface SeedText {
  content: string;
  language: 'english' | 'arabic' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

const texts: SeedText[] = [
  // ---- ENGLISH EASY ----
  { content: 'The quick brown fox jumps over the lazy dog. The sun is shining bright today.', language: 'english', difficulty: 'easy', category: 'general' },
  { content: 'I love to code every day. It makes me happy and helps me learn new things.', language: 'english', difficulty: 'easy', category: 'programming' },
  { content: 'The cat sat on the mat. The dog ran in the park. Birds fly in the blue sky.', language: 'english', difficulty: 'easy', category: 'general' },
  { content: 'Good morning everyone. Today is a great day to learn something new and exciting.', language: 'english', difficulty: 'easy', category: 'general' },
  { content: 'She sells sea shells by the sea shore. The waves crash on the sandy beach.', language: 'english', difficulty: 'easy', category: 'general' },
  { content: 'Write clean code. Use clear names. Add comments. Test your work. Ship it fast.', language: 'english', difficulty: 'easy', category: 'programming' },
  { content: 'The rain in Spain stays mainly in the plain. A red rose grew in the garden.', language: 'english', difficulty: 'easy', category: 'general' },
  { content: 'Open your laptop. Start the server. Write some code. Save your file. Run the app.', language: 'english', difficulty: 'easy', category: 'programming' },
  { content: 'Music fills the room with joy. Dancing makes the heart feel light and free.', language: 'english', difficulty: 'easy', category: 'general' },
  { content: 'React is a library for building user interfaces. It uses components and hooks.', language: 'english', difficulty: 'easy', category: 'programming' },
  { content: 'The moon glows softly in the night sky. Stars twinkle above the quiet town.', language: 'english', difficulty: 'easy', category: 'general' },

  // ---- ENGLISH MEDIUM ----
  { content: 'Programming is the art of telling a computer what to do. Every great developer was once a beginner who refused to give up. Practice makes perfect in the world of code.', language: 'english', difficulty: 'medium', category: 'programming' },
  { content: 'The best way to predict the future is to create it. Innovation distinguishes between a leader and a follower. Stay hungry, stay foolish, and keep building amazing things.', language: 'english', difficulty: 'medium', category: 'quotes' },
  { content: 'TypeScript adds static typing to JavaScript, making code more reliable and easier to maintain. It catches errors at compile time rather than runtime, saving developers hours of debugging.', language: 'english', difficulty: 'medium', category: 'programming' },
  { content: 'The internet has transformed how we communicate, work, and live. Social media connects billions of people across the globe, creating new opportunities and challenges for society.', language: 'english', difficulty: 'medium', category: 'technology' },
  { content: 'Artificial intelligence is rapidly changing every industry. Machine learning algorithms can now recognize images, understand speech, and even write code with remarkable accuracy.', language: 'english', difficulty: 'medium', category: 'technology' },
  { content: 'A well-designed database schema is the foundation of any successful application. Proper indexing, normalization, and query optimization can dramatically improve performance and scalability.', language: 'english', difficulty: 'medium', category: 'programming' },
  { content: 'The mountains stood tall against the horizon, their peaks dusted with fresh snow. Below, a winding river carved its path through the ancient valley, reflecting the golden sunset.', language: 'english', difficulty: 'medium', category: 'literature' },
  { content: 'Version control with Git allows teams to collaborate effectively on software projects. Branching, merging, and pull requests enable parallel development without conflicts or lost work.', language: 'english', difficulty: 'medium', category: 'programming' },
  { content: 'Coffee is the fuel that powers the modern developer. From early morning debugging sessions to late night deployments, a good cup of coffee keeps the code flowing smoothly.', language: 'english', difficulty: 'medium', category: 'general' },
  { content: 'Cloud computing has revolutionized how businesses deploy and scale their applications. Services like AWS, Google Cloud, and Azure provide on-demand computing resources worldwide.', language: 'english', difficulty: 'medium', category: 'technology' },
  { content: 'Clean architecture separates concerns into distinct layers, making applications easier to test and maintain. The dependency rule ensures that inner layers know nothing about outer layers.', language: 'english', difficulty: 'medium', category: 'programming' },

  // ---- ENGLISH HARD ----
  { content: 'Quantum computing leverages the principles of quantum mechanics to process information in fundamentally different ways than classical computers. Qubits can exist in superposition, enabling them to perform many calculations simultaneously, potentially solving complex problems that would take traditional computers millions of years to complete.', language: 'english', difficulty: 'hard', category: 'technology' },
  { content: 'The implementation of microservices architecture requires careful consideration of service boundaries, inter-service communication protocols, data consistency patterns, and deployment strategies. Event-driven architectures with message brokers like Apache Kafka can help manage the complexity of distributed systems while maintaining eventual consistency across services.', language: 'english', difficulty: 'hard', category: 'programming' },
  { content: 'Cryptographic hash functions are mathematical algorithms that transform arbitrary data into fixed-size output, serving as digital fingerprints. SHA-256, widely used in blockchain technology and security protocols, produces a unique 256-bit hash that is computationally infeasible to reverse-engineer, ensuring data integrity and authentication in distributed systems.', language: 'english', difficulty: 'hard', category: 'technology' },
  { content: 'The development of neural networks has been inspired by the biological structure of the human brain. Deep learning architectures, including convolutional neural networks for image recognition and recurrent neural networks for sequential data processing, have achieved unprecedented accuracy in tasks ranging from medical diagnosis to autonomous vehicle navigation.', language: 'english', difficulty: 'hard', category: 'technology' },
  { content: 'Functional programming paradigms emphasize immutability, pure functions, and declarative code over imperative instructions. Higher-order functions, closures, and monads provide powerful abstractions for managing side effects and composing complex transformations. Languages like Haskell, Clojure, and Scala embrace these principles, while JavaScript and TypeScript support functional patterns alongside object-oriented approaches.', language: 'english', difficulty: 'hard', category: 'programming' },
  { content: 'The Byzantine Generals Problem illustrates the challenges of achieving consensus in distributed computing systems where participants may be unreliable or malicious. Practical Byzantine Fault Tolerance algorithms enable distributed networks to function correctly even when up to one-third of participants fail or behave adversarially, forming the theoretical foundation for blockchain consensus mechanisms.', language: 'english', difficulty: 'hard', category: 'programming' },
  { content: 'WebAssembly represents a paradigm shift in web development, enabling near-native performance in browser environments. By compiling languages like C++, Rust, and Go into a binary instruction format, WebAssembly allows computationally intensive applications such as video editing, 3D rendering, and scientific simulations to run efficiently within web browsers without sacrificing security.', language: 'english', difficulty: 'hard', category: 'programming' },
  { content: 'The philosophical foundations of software engineering draw from mathematics, logic, and cognitive science. The halting problem, first proven undecidable by Alan Turing in 1936, establishes fundamental limits on what can be computed. These theoretical boundaries continue to influence practical decisions in compiler design, program verification, and automated testing methodologies.', language: 'english', difficulty: 'hard', category: 'programming' },
  { content: 'Containerization technology, exemplified by Docker and orchestrated by Kubernetes, has transformed software deployment by encapsulating applications and their dependencies into portable, reproducible units. This approach eliminates environment-specific issues, enables horizontal scaling, and facilitates continuous integration and deployment pipelines across heterogeneous infrastructure environments.', language: 'english', difficulty: 'hard', category: 'technology' },
  { content: 'The observer pattern is a behavioral design pattern that establishes a one-to-many dependency between objects, ensuring that when one object changes state, all its dependents are automatically notified and updated. This pattern forms the backbone of reactive programming frameworks and event-driven architectures, enabling loose coupling between components in complex software systems.', language: 'english', difficulty: 'hard', category: 'programming' },

  // ---- ARABIC EASY ----
  { content: 'البرمجة ممتعة ومفيدة. أحب أن أتعلم أشياء جديدة كل يوم.', language: 'arabic', difficulty: 'easy', category: 'programming' },
  { content: 'الشمس تشرق في الصباح. الطيور تغرد فوق الأشجار الخضراء.', language: 'arabic', difficulty: 'easy', category: 'general' },
  { content: 'الكتاب صديق الإنسان. القراءة تفتح آفاق المعرفة والعلم.', language: 'arabic', difficulty: 'easy', category: 'general' },
  { content: 'أكتب الكود كل يوم. أحب لغة جافاسكريبت وأستمتع بالتعلم.', language: 'arabic', difficulty: 'easy', category: 'programming' },
  { content: 'الماء أساس الحياة. نحن نحتاج الماء للشرب والزراعة والصناعة.', language: 'arabic', difficulty: 'easy', category: 'general' },
  { content: 'العلم نور والجهل ظلام. اطلب العلم من المهد إلى اللحد.', language: 'arabic', difficulty: 'easy', category: 'quotes' },

  // ---- ARABIC MEDIUM ----
  { content: 'تعتبر البرمجة من أهم المهارات في العصر الحديث. يمكن للمبرمجين بناء تطبيقات ومواقع إلكترونية تخدم ملايين المستخدمين حول العالم.', language: 'arabic', difficulty: 'medium', category: 'programming' },
  { content: 'الذكاء الاصطناعي يغير وجه العالم بسرعة كبيرة. تستخدم الشركات الكبرى تقنيات التعلم الآلي لتحسين خدماتها ومنتجاتها بشكل مستمر.', language: 'arabic', difficulty: 'medium', category: 'technology' },
  { content: 'القدس مدينة عريقة تحمل في أزقتها عبق التاريخ وأصالة الحضارة. تجمع بين الماضي والحاضر في لوحة فنية رائعة تخطف الأبصار والقلوب.', language: 'arabic', difficulty: 'medium', category: 'general' },
  { content: 'تطوير واجهات المستخدم يتطلب فهماً عميقاً لاحتياجات المستخدمين وتجربتهم. التصميم الجيد يجعل التطبيق سهل الاستخدام وممتعاً في الوقت ذاته.', language: 'arabic', difficulty: 'medium', category: 'programming' },
  { content: 'التعليم عن بعد أصبح جزءاً أساسياً من المنظومة التعليمية الحديثة. يوفر فرصاً متساوية للتعلم بغض النظر عن الموقع الجغرافي أو الظروف الاقتصادية.', language: 'arabic', difficulty: 'medium', category: 'general' },

  // ---- ARABIC HARD ----
  { content: 'تعمل الحوسبة السحابية على تغيير الطريقة التي تنشر بها الشركات تطبيقاتها وتديرها. توفر خدمات مثل أمازون ويب سيرفيسز وجوجل كلاود منصات قابلة للتوسع تمكن المطورين من بناء أنظمة موزعة عالية الأداء والموثوقية.', language: 'arabic', difficulty: 'hard', category: 'technology' },
  { content: 'يعتبر نمط التصميم المعماري للخدمات المصغرة من أحدث الأنماط المستخدمة في تطوير البرمجيات المؤسسية. يقسم التطبيق إلى خدمات صغيرة مستقلة يمكن تطويرها ونشرها وتوسيعها بشكل منفصل مما يزيد من مرونة النظام وقابليته للصيانة.', language: 'arabic', difficulty: 'hard', category: 'programming' },
  { content: 'أحدثت تقنية سلسلة الكتل ثورة في عالم المعاملات الرقمية من خلال توفير نظام لامركزي وآمن لتسجيل المعاملات. تستخدم خوارزميات التشفير المتقدمة لضمان سلامة البيانات ومنع التلاعب بها.', language: 'arabic', difficulty: 'hard', category: 'technology' },
  { content: 'تتطلب هندسة البرمجيات الحديثة فهماً عميقاً لمبادئ التصميم الكائني والبرمجة الوظيفية وأنماط التصميم المعمارية. يساعد اتباع مبادئ سوليد في كتابة كود نظيف وقابل للصيانة والاختبار على المدى الطويل.', language: 'arabic', difficulty: 'hard', category: 'programming' },
  { content: 'يشهد العالم تحولاً رقمياً شاملاً يمس جميع جوانب الحياة البشرية. من الرعاية الصحية إلى التعليم والتجارة والحكومة الإلكترونية أصبحت التقنية عنصراً لا غنى عنه في بناء مستقبل أفضل وأكثر كفاءة واستدامة.', language: 'arabic', difficulty: 'hard', category: 'technology' },
];

/** Seed the database with typing texts */
export async function seedDatabase(): Promise<{ inserted: number; total: number }> {
  // Add word count to each text
  const textsWithCount = texts.map(t => ({
    ...t,
    wordCount: t.content.split(/\s+/).length,
  }));

  // Clear existing texts
  await Text.deleteMany({});

  // Insert all texts
  const result = await Text.insertMany(textsWithCount);

  console.log(`[Seed] Inserted ${result.length} texts`);
  return { inserted: result.length, total: textsWithCount.length };
}

// Run as standalone script if executed directly
if (require.main === module) {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/coded-typers';
  mongoose.connect(uri).then(async () => {
    console.log('[Seed] Connected to MongoDB');
    await seedDatabase();
    console.log('[Seed] Done!');
    process.exit(0);
  }).catch(err => {
    console.error('[Seed] Error:', err);
    process.exit(1);
  });
}
