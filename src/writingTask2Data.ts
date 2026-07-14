// Model essays for IELTS Writing Task 2, organised by question type. Each essay follows the
// user's own dictated sentence-by-sentence pattern for that type EXACTLY (see memory:
// writing-task2-essay-patterns). 260-300 words, B2 vocabulary, grammar ceiling of one
// subordinating-conjunction / non-defining-which / gerund-participle device per sentence.

export type WritingTask2TypeId =
  | 'to-what-extent'
  | 'double-question'
  | 'discuss-both-views'
  | 'advantages-disadvantages'

export type WritingTask2Role = 'intro' | 'body1' | 'body2' | 'body3' | 'conclusion'

export type WritingTask2Paragraph = {
  role: WritingTask2Role
  text: string
}

export type WritingTask2VocabItem = {
  word: string
  thaiMeaning: string
}

export type WritingTask2Prompt = {
  id: string
  number: number
  typeId: WritingTask2TypeId
  title: string
  questionText: string
  meta: string
  paragraphs: WritingTask2Paragraph[]
  vocab: WritingTask2VocabItem[]
}

export const WRITING_TASK2_PROMPTS: WritingTask2Prompt[] = [
  // ── To What Extent ──────────────────────────────────────────────────
  {
    id: 't2-twe-1',
    number: 1,
    typeId: 'to-what-extent',
    title: 'Preserving Old Buildings',
    questionText:
      'Some people think old buildings should be preserved, while others believe they should be pulled down to make way for modern developments. To what extent do you agree or disagree?',
    meta: 'India · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while some old constructions may appear outdated, maintaining them is essential for preserving a country's history and cultural identity. Others argue that pulling down these structures and replacing them with modern buildings would better meet the practical needs of a growing population. I personally believe that historic buildings should be preserved, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that old buildings should be pulled down to make way for modern infrastructure. To explain it simply, this is possibly because older structures often fail to meet current safety and space requirements; therefore, replacing them allows cities to meet the needs of a growing population more efficiently. For example, many rapidly developing cities have pulled down old buildings to construct high-rise apartments and offices. From this perspective, it is understandable why some would believe that modern buildings serve society's needs more effectively than old ones."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that old buildings should be carefully preserved. To put it simply, this is due to the fact that these structures represent a nation's history and cultural heritage, which cannot be recreated once destroyed. For instance, cities such as Rome and Kyoto attract millions of tourists every year largely because of their well-preserved historic buildings. In this respect, it is evident that maintaining old buildings brings both cultural and economic value to a country."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that building modern structures can help cities meet growing practical needs, I am of the opinion that preserving old buildings is more important, as they protect a nation's history for future generations."
      }
    ],
    vocab: [
      { word: 'cultural identity', thaiMeaning: 'อัตลักษณ์ทางวัฒนธรรม' },
      { word: 'cultural heritage', thaiMeaning: 'มรดกทางวัฒนธรรม' },
      { word: 'safety requirements', thaiMeaning: 'ข้อกำหนดด้านความปลอดภัย' },
      { word: 'economic value', thaiMeaning: 'คุณค่าทางเศรษฐกิจ' }
    ]
  },
  {
    id: 't2-twe-2',
    number: 2,
    typeId: 'to-what-extent',
    title: 'The Value of Studying History',
    questionText:
      'Some people think that studying history is a waste of time, while others believe that learning about the past helps us understand the present. To what extent do you agree or disagree?',
    meta: 'India · Jan 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while the past cannot be changed, understanding it has little practical relevance to people living in the present. Others argue that studying history remains essential for understanding and improving present-day society. I personally believe that learning about the past is highly valuable, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that studying history serves little practical purpose in modern life. To explain it simply, this is possibly because historical events cannot be altered and have no direct bearing on today's technology or economy; therefore, some believe time would be better spent learning practical skills instead. For example, many students today choose to study coding or business rather than history, believing these subjects offer more immediate career benefits. From this perspective, it is understandable why some would believe that focusing on the present is more useful than studying the past."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that learning about the past is essential. To put it simply, this is due to the fact that history allows societies to understand the causes of present problems and avoid repeating past mistakes, which can be extremely costly. For instance, many countries continue to study the causes of the 2008 financial crisis in order to prevent similar economic collapses in the future. In this respect, it is evident that studying history provides valuable lessons that directly benefit the present."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that historical events themselves cannot be changed, I am of the opinion that learning about the past is highly valuable, as it helps societies avoid repeating the same mistakes."
      }
    ],
    vocab: [
      { word: 'financial crisis', thaiMeaning: 'วิกฤตการเงิน' },
      { word: 'economic collapse', thaiMeaning: 'การล่มสลายทางเศรษฐกิจ' },
      { word: 'career benefits', thaiMeaning: 'ผลประโยชน์ด้านอาชีพ' },
      { word: 'historical events', thaiMeaning: 'เหตุการณ์ทางประวัติศาสตร์' }
    ]
  },
  {
    id: 't2-twe-3',
    number: 3,
    typeId: 'to-what-extent',
    title: 'Government vs. Private Science Funding',
    questionText:
      'Some people believe that scientific research should be funded and controlled by the government, while others think private companies should be responsible for it. To what extent do you agree or disagree?',
    meta: 'Spain · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while private companies can drive rapid technological innovation, scientific research should ultimately remain under government control. Others argue that private companies are better positioned to fund and accelerate scientific progress. I personally believe that governments should retain primary control over scientific research, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that private companies are better suited to lead scientific research. To explain it simply, this is possibly because private firms often have greater funding and stronger commercial incentives to innovate quickly; therefore, breakthroughs can reach the public faster than through government-led projects. For example, private pharmaceutical companies developed COVID-19 vaccines within less than a year of the pandemic beginning. From this perspective, it is understandable why some would believe that private companies drive scientific progress more effectively than governments."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that governments should retain control over scientific research. To put it simply, this is due to the fact that government funding ensures research prioritizes public benefit rather than profit, which private companies cannot always guarantee. For instance, publicly funded institutions such as NASA have made major scientific discoveries that were shared freely with the world instead of being sold for profit. In this respect, it is evident that government-controlled research better serves the interests of society as a whole."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that private companies can accelerate certain scientific breakthroughs, I am of the opinion that governments should remain in control of scientific research, as this best protects the public interest."
      }
    ],
    vocab: [
      { word: 'commercial incentives', thaiMeaning: 'แรงจูงใจเชิงพาณิชย์' },
      { word: 'public benefit', thaiMeaning: 'ประโยชน์สาธารณะ' },
      { word: 'scientific breakthroughs', thaiMeaning: 'ความก้าวหน้าทางวิทยาศาสตร์ครั้งสำคัญ' },
      { word: 'public interest', thaiMeaning: 'ผลประโยชน์สาธารณะ' }
    ]
  },
  {
    id: 't2-twe-4',
    number: 4,
    typeId: 'to-what-extent',
    title: 'Should Universities Teach Arts Subjects?',
    questionText:
      'Some people believe universities should stop offering arts subjects such as philosophy and history, and focus only on courses that prepare students for employment. To what extent do you agree or disagree?',
    meta: 'France · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while rising tuition fees make practical courses more appealing, universities should stop teaching arts subjects such as philosophy and history in favor of purely practical courses. Others argue that focusing solely on employment-focused courses would better prepare graduates for the job market. I personally believe that universities should continue offering arts subjects, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that universities should focus only on practical courses. To explain it simply, this is possibly because graduates with technical skills often find employment more quickly after graduation; therefore, replacing arts subjects with practical training could reduce graduate unemployment. For example, engineering and computer science graduates in many countries report considerably higher starting salaries than graduates of arts programs. From this perspective, it is understandable why some would believe that practical courses better prepare students for the job market."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that universities should continue teaching arts subjects. To put it simply, this is due to the fact that subjects such as philosophy and history develop critical thinking and communication skills, which employers in every industry continue to value. For instance, many successful business leaders, including several well-known technology founders, credit their humanities education with shaping their creative and analytical abilities. In this respect, it is evident that arts subjects provide skills that remain valuable regardless of a graduate's chosen career."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that practical courses can improve graduates' short-term job prospects, I am of the opinion that universities should continue offering arts subjects, as they build skills that benefit graduates throughout their careers."
      }
    ],
    vocab: [
      { word: 'critical thinking', thaiMeaning: 'การคิดวิเคราะห์' },
      { word: 'starting salaries', thaiMeaning: 'เงินเดือนเริ่มต้น' },
      { word: 'humanities education', thaiMeaning: 'การศึกษาด้านมนุษยศาสตร์' },
      { word: 'job prospects', thaiMeaning: 'โอกาสในการทำงาน' }
    ]
  },
  {
    id: 't2-twe-5',
    number: 5,
    typeId: 'to-what-extent',
    title: 'Is Responsible Tourism Possible?',
    questionText:
      'Some people believe it is impossible for tourists to be responsible towards the environment and local culture. To what extent do you agree or disagree?',
    meta: 'Vietnam · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while tourism inevitably affects the places visited, it is impossible for any tourist to be truly responsible toward both culture and environment. Others argue that with careful planning, tourists can genuinely reduce their negative impact. I personally believe that being a responsible tourist is possible, and my reasons will be elaborated on in the following paragraphs."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that responsible tourism is impossible to achieve. To explain it simply, this is possibly because even eco-friendly travel requires transportation that produces carbon emissions; therefore, every visit inevitably damages the environment to some degree. For example, flights to popular island destinations such as the Maldives contribute significantly to global carbon emissions regardless of a tourist's intentions. From this perspective, it is understandable why some would believe that no tourist can be entirely responsible."
      },
      {
        role: 'body2',
        text: "However, I would personally argue in favor of the idea that responsible tourism is achievable. To put it simply, this is due to the fact that tourists can make deliberate choices, such as supporting local businesses and respecting local customs, which significantly reduce their overall impact. For instance, many visitors to Bhutan follow strict government guidelines designed to protect both the environment and traditional culture. In this respect, it is evident that responsible tourism, while not perfect, is a realistic and achievable goal."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that all tourism carries some environmental cost, I am of the opinion that being a responsible tourist is possible, as thoughtful choices can greatly reduce this impact."
      }
    ],
    vocab: [
      { word: 'carbon emissions', thaiMeaning: 'การปล่อยก๊าซคาร์บอน' },
      { word: 'local customs', thaiMeaning: 'ขนบธรรมเนียมท้องถิ่น' },
      { word: 'government guidelines', thaiMeaning: 'แนวทางของรัฐบาล' },
      { word: 'environmental impact', thaiMeaning: 'ผลกระทบต่อสิ่งแวดล้อม' }
    ]
  },

  // ── Discuss Both Views ──────────────────────────────────────────────
  {
    id: 't2-dbv-1',
    number: 1,
    typeId: 'discuss-both-views',
    title: 'Subways vs. Wider Roads',
    questionText:
      'Some people believe that governments should invest more in public transport such as subways and trains to reduce traffic congestion. Others think that building more and wider roads is a better solution. Discuss both views and give your own opinion.',
    meta: 'Thailand · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that governments should invest in subway and train networks to ease traffic congestion, others claim that building wider roads is a more effective solution. Both points of view will be elaborated on before elaborating on the reasons why I believe that investing in public transport is the better approach."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that expanding subway and train networks is the most effective way to reduce congestion. To explain this simply, this is because a well-developed rail system can transport many passengers away from private vehicles, cutting the number of cars on the road. For example, Singapore's Mass Rapid Transit network carries more than three million passengers daily, easing congestion across its road network."
      },
      {
        role: 'body2',
        text: "However, some might argue that building more and wider roads is a more practical solution. To put it simply, this is due to the fact that road expansion allows a greater volume of vehicles to travel at once, reducing bottlenecks during peak hours. For instance, a 2018 study by the Texas Transportation Institute found that widening key highways in Houston cut average commute times by nearly 10%."
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that investing in subway and train lines brings more sustainable, long-term benefits. My reasoning is that, unlike roads, rail networks encourage a lasting shift away from private car use, preventing congestion from returning as cities grow. To illustrate, London's Underground has allowed the city to keep up with steady population growth for over a century without expanding its road capacity."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that expanding road networks can offer a quicker, short-term reduction in congestion, I am of the opinion that investing in subway and train lines is the wiser long-term solution."
      }
    ],
    vocab: [
      { word: 'traffic congestion', thaiMeaning: 'ปัญหาการจราจรติดขัด' },
      { word: 'commute times', thaiMeaning: 'เวลาเดินทางไป-กลับ' },
      { word: 'population growth', thaiMeaning: 'การเติบโตของประชากร' },
      { word: 'road capacity', thaiMeaning: 'ความจุของถนน' }
    ]
  },
  {
    id: 't2-dbv-2',
    number: 2,
    typeId: 'discuss-both-views',
    title: 'Who Should Reduce Packaging?',
    questionText:
      'Some people think that supermarkets and manufacturers are responsible for reducing the amount of packaging on the products they sell. Others believe that it is the responsibility of consumers to avoid buying over-packaged products. Discuss both views and give your own opinion.',
    meta: 'India · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that supermarkets and manufacturers have a duty to reduce the packaging of the products they sell, others claim that consumers themselves must take responsibility by avoiding heavily packaged products. Both points of view will be elaborated on before elaborating on the reasons why I believe that manufacturers bear the greater responsibility."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that manufacturers should take primary responsibility for reducing packaging. To explain this simply, this is because companies control product design and could switch to more sustainable materials at the source. For example, several major supermarket chains in the UK have removed plastic packaging from fresh produce, cutting plastic waste by thousands of tonnes annually."
      },
      {
        role: 'body2',
        text: "However, some might argue that consumers hold greater responsibility for this issue. To put it simply, this is due to the fact that consumer demand ultimately drives what products companies choose to package and sell. For instance, a growing number of shoppers now choose loose fruit and vegetables over pre-packaged alternatives, encouraging retailers to offer more unpackaged options."
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that manufacturers should bear the greater share of responsibility. My reasoning is that ordinary consumers often have limited alternatives, since most products are still sold in fixed packaging regardless of individual preference. To illustrate, shoppers in many countries cannot buy household staples such as rice or shampoo without some form of plastic packaging, no matter how environmentally conscious they are."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that consumer choices can influence packaging habits to some extent, I am of the opinion that manufacturers hold the greater responsibility, as they ultimately control how products are packaged."
      }
    ],
    vocab: [
      { word: 'plastic waste', thaiMeaning: 'ขยะพลาสติก' },
      { word: 'consumer demand', thaiMeaning: 'ความต้องการของผู้บริโภค' },
      { word: 'household staples', thaiMeaning: 'ของใช้จำเป็นในครัวเรือน' },
      { word: 'product design', thaiMeaning: 'การออกแบบผลิตภัณฑ์' }
    ]
  },
  {
    id: 't2-dbv-3',
    number: 3,
    typeId: 'discuss-both-views',
    title: 'Genetic Engineering: Benefit or Threat?',
    questionText:
      'Some people believe that genetic engineering will greatly benefit humanity, while others think it poses a serious danger to life on Earth. Discuss both views and give your own opinion.',
    meta: 'Turkey · Jun 2026 (ข้อสอบจริง)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that genetic engineering will greatly improve human lives, others claim that it poses a serious threat to life on earth. Both points of view will be elaborated on before elaborating on the reasons why I believe that genetic engineering brings more benefits than risks."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that genetic engineering offers significant benefits to humanity. To explain this simply, this is because scientists can now modify genes to prevent inherited diseases before they even develop. For example, gene therapy has already been used to successfully treat patients with sickle cell disease in several clinical trials."
      },
      {
        role: 'body2',
        text: "However, some might argue that genetic engineering poses serious dangers to life on earth. To put it simply, this is due to the fact that altering genes could produce unpredictable and irreversible effects on ecosystems and future generations. For instance, genetically modified crops have been linked to reduced biodiversity in some farming regions where they have been widely planted."
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that the benefits of genetic engineering outweigh its risks. My reasoning is that, with strict international regulation, the technology's dangers can be managed while its life-saving potential is preserved. To illustrate, countries such as the UK now require rigorous ethical approval before any gene-editing research can proceed, significantly reducing the likelihood of harmful outcomes."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that genetic engineering carries certain risks, I am of the opinion that its potential to improve human health makes it a worthwhile technology to pursue."
      }
    ],
    vocab: [
      { word: 'inherited diseases', thaiMeaning: 'โรคทางพันธุกรรม' },
      { word: 'gene therapy', thaiMeaning: 'การบำบัดด้วยยีน' },
      { word: 'ethical approval', thaiMeaning: 'การอนุมัติด้านจริยธรรม' },
      { word: 'biodiversity', thaiMeaning: 'ความหลากหลายทางชีวภาพ' }
    ]
  },
  {
    id: 't2-dbv-4',
    number: 4,
    typeId: 'discuss-both-views',
    title: 'Who Should Teach Money Management?',
    questionText:
      'Some people think that money management should be taught in schools as a compulsory subject. Others believe that teaching children about finances is the responsibility of parents. Discuss both views and give your own opinion.',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that money management should be taught as a mandatory school subject, others claim that teaching children about finances is solely the responsibility of parents. Both points of view will be elaborated on before elaborating on the reasons why I believe that schools should take on this responsibility."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that schools are best placed to teach money management. To explain this simply, this is because teachers can deliver consistent, structured financial education to every student regardless of family background. For example, the UK has included compulsory financial literacy classes in its national curriculum since 2014."
      },
      {
        role: 'body2',
        text: "However, some might argue that teaching children about money is a parental responsibility. To put it simply, this is due to the fact that parents are better placed to demonstrate real financial habits, such as budgeting and saving, within the context of daily family life. For instance, many financially successful adults credit lessons learned from watching their parents manage household budgets."
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that money management should be a mandatory school subject. My reasoning is that not every parent possesses the financial knowledge or confidence needed to teach these skills effectively. To illustrate, a 2019 survey by a UK financial charity found that nearly a third of parents felt unqualified to teach their children about money."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that parents play an important role in shaping children's financial habits, I am of the opinion that schools should take primary responsibility, as this ensures every child receives this essential education."
      }
    ],
    vocab: [
      { word: 'financial literacy', thaiMeaning: 'ความรู้ทางการเงิน' },
      { word: 'household budgets', thaiMeaning: 'งบประมาณครัวเรือน' },
      { word: 'national curriculum', thaiMeaning: 'หลักสูตรแห่งชาติ' },
      { word: 'financial habits', thaiMeaning: 'นิสัยทางการเงิน' }
    ]
  },
  {
    id: 't2-dbv-5',
    number: 5,
    typeId: 'discuss-both-views',
    title: 'Who Should Set School Rules?',
    questionText:
      'Some people believe that students should be involved in making the rules of their school. Others think that this responsibility should remain with teachers. Discuss both views and give your own opinion.',
    meta: 'แนวข้อสอบ (Prediction)',
    paragraphs: [
      {
        role: 'intro',
        text: "While it is argued by some that schoolchildren should be allowed to make decisions about school rules, others claim that teachers should remain responsible for setting these rules. Both points of view will be elaborated on before elaborating on the reasons why I believe that teachers should retain this responsibility."
      },
      {
        role: 'body1',
        text: "To begin with, it might seem sensible for some to claim that students should have a say in creating school rules. To explain this simply, this is because pupils who help design the rules may feel more motivated to follow them. For example, some schools in Finland allow student councils to propose changes to rules on matters such as school uniforms."
      },
      {
        role: 'body2',
        text: "However, some might argue that teachers should remain solely responsible for setting school rules. To put it simply, this is due to the fact that teachers have the experience and training needed to judge which rules genuinely support learning and safety. For instance, decisions such as classroom discipline policies require an understanding of child development that most students do not yet have."
      },
      {
        role: 'body3',
        text: "Personally, I would argue in favor of the idea that teachers should retain primary responsibility for school rules. My reasoning is that children often lack the long-term perspective needed to judge the consequences of the rules they might propose. To illustrate, a rule allowing unlimited phone use during lessons might seem appealing to students but could seriously damage their academic performance."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that involving students can improve their sense of ownership over school life, I am of the opinion that teachers should retain responsibility for setting rules, as they are better placed to protect students' long-term interests."
      }
    ],
    vocab: [
      { word: 'student councils', thaiMeaning: 'สภานักเรียน' },
      { word: 'classroom discipline', thaiMeaning: 'ระเบียบวินัยในห้องเรียน' },
      { word: 'academic performance', thaiMeaning: 'ผลการเรียน' },
      { word: 'long-term perspective', thaiMeaning: 'มุมมองระยะยาว' }
    ]
  },

  // ── Advantages & Disadvantages ──────────────────────────────────────
  {
    id: 't2-ad-1',
    number: 1,
    typeId: 'advantages-disadvantages',
    title: 'Hosting a Major Sporting Event',
    questionText:
      'Hosting major international sporting events, such as the Olympic Games, brings both benefits and drawbacks to the host country. Do the benefits outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while hosting a major international sporting event is both beneficial and detrimental for the host country, this essay argues that the benefits are far greater than the drawbacks."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with hosting a major sporting event. The first benefit is that it brings significant economic growth through tourism and infrastructure investment, creating thousands of new jobs in the process. For example, the 2012 London Olympics attracted more than 320,000 additional overseas visitors and generated billions of pounds in tourism revenue. Another advantage is that it raises the host country's international profile and national pride. For instance, South Korea's hosting of the 2018 Winter Olympics in Pyeongchang significantly boosted the nation's global recognition as a modern, capable host."
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the high cost of hosting such events. This is because building new stadiums and facilities often requires enormous public spending. To illustrate, Brazil spent an estimated 13 billion dollars preparing for the 2016 Rio Olympics, much of which came from public funds. However, this argument is simply invalid given that many host cities recover these costs through long-term tourism and improved infrastructure. For example, Barcelona's 1992 Olympic investment transformed the city into one of Europe's most visited tourist destinations for decades afterward."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the financial burden of hosting a major sporting event, I am of the opinion that the benefits, including economic growth and international recognition, are far greater than the drawbacks."
      }
    ],
    vocab: [
      { word: 'tourism revenue', thaiMeaning: 'รายได้จากการท่องเที่ยว' },
      { word: 'infrastructure investment', thaiMeaning: 'การลงทุนโครงสร้างพื้นฐาน' },
      { word: 'global recognition', thaiMeaning: 'การยอมรับระดับโลก' },
      { word: 'public spending', thaiMeaning: 'การใช้จ่ายภาครัฐ' }
    ]
  },
  {
    id: 't2-ad-2',
    number: 2,
    typeId: 'advantages-disadvantages',
    title: 'An Ageing Population',
    questionText:
      'In many countries, the population is ageing. Do the advantages of this trend outweigh the disadvantages?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while an ageing population is both beneficial and detrimental for society, this essay argues that the benefits are far greater than the drawbacks."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with an ageing population. The first benefit is that older citizens bring decades of valuable knowledge and experience to the workforce and community life, helping to train the next generation of workers. For example, many countries now rely on retirees to mentor younger employees, passing on skills that would otherwise be lost. Another advantage is that older generations often provide free childcare, allowing younger family members to remain in full-time employment. For instance, in countries such as Italy, grandparents frequently care for grandchildren while both parents work."
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the financial burden that an ageing population places on public services. This is because pensions and healthcare for elderly citizens require significant government spending. To illustrate, Japan now spends more than a fifth of its national budget on social security for elderly citizens. However, this argument is simply invalid given that many governments can offset these costs by raising retirement ages and encouraging continued employment among older citizens. For example, several European countries have successfully reduced pension costs by gradually raising the retirement age to 67."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the financial cost of an ageing population, I am of the opinion that the benefits of an ageing population, including experience and family support, are far greater than the drawbacks."
      }
    ],
    vocab: [
      { word: 'retirement age', thaiMeaning: 'อายุเกษียณ' },
      { word: 'social security', thaiMeaning: 'ประกันสังคม' },
      { word: 'workforce', thaiMeaning: 'กำลังแรงงาน' },
      { word: 'free childcare', thaiMeaning: 'การเลี้ยงดูเด็กฟรี' }
    ]
  },
  {
    id: 't2-ad-3',
    number: 3,
    typeId: 'advantages-disadvantages',
    title: 'Parents Working Abroad',
    questionText:
      'Some parents choose to work abroad and take their families with them. Do the benefits of this outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while parents relocating abroad for work is both beneficial and detrimental for their families, this essay argues that the benefits are far greater than the drawbacks."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with parents working abroad and bringing their families with them. The first benefit is that children gain exposure to new languages and cultures from an early age. For example, children raised in international schools in cities such as Singapore often become fluent in two or more languages by adulthood. Another advantage is that higher overseas salaries can significantly improve a family's overall standard of living. For instance, many expatriate workers in the Gulf region earn several times what they would earn in their home countries."
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the disruption this move causes to children's education and social lives. This is because children must adapt to new schools and make new friends, often more than once during their childhood. To illustrate, families who relocate frequently for work may see their children change schools three or four times before finishing secondary education. However, this argument is simply invalid given that international schools are specifically designed to help children adapt quickly, offering strong pastoral support and globally recognised curricula. For example, the International Baccalaureate programme, taught in more than 150 countries, allows students to continue the same curriculum wherever their family relocates."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the disruption caused to children's education, I am of the opinion that the benefits of relocating abroad for work, including cultural exposure and financial improvement, are far greater than the drawbacks."
      }
    ],
    vocab: [
      { word: 'standard of living', thaiMeaning: 'มาตรฐานการครองชีพ' },
      { word: 'pastoral support', thaiMeaning: 'การดูแลด้านความเป็นอยู่ของนักเรียน' },
      { word: 'international schools', thaiMeaning: 'โรงเรียนนานาชาติ' },
      { word: 'overseas salaries', thaiMeaning: 'เงินเดือนต่างประเทศ' }
    ]
  },
  {
    id: 't2-ad-4',
    number: 4,
    typeId: 'advantages-disadvantages',
    title: 'International Tourism',
    questionText:
      'International tourism has brought many benefits, but it also has drawbacks for the places tourists visit. Do the benefits of international tourism outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while international tourism is both beneficial and detrimental to the places it affects, this essay argues that the benefits are far greater than the drawbacks."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with international tourism. The first benefit is that tourism generates substantial income and employment for local communities. For example, tourism accounts for more than 20% of Thailand's total employment, supporting millions of local jobs. Another advantage is that tourism encourages the preservation of local culture and historic sites, as governments invest in maintaining the attractions that draw visitors, creating a cycle of sustained cultural investment. For instance, revenue from tourist entry fees has funded major restoration projects at Cambodia's Angkor Wat temple complex."
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the environmental damage caused by large numbers of tourists. This is because popular destinations often experience pollution, overcrowding, and strain on local infrastructure, particularly during peak holiday seasons. To illustrate, some beaches in Thailand have been forced to close temporarily due to coral reef damage from excessive tourist activity. However, this argument is simply invalid given that responsible tourism management, such as visitor limits and eco-certification schemes, can significantly reduce this damage. For example, Bhutan strictly limits tourist numbers and charges a daily fee that directly funds environmental conservation projects."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the environmental impact of tourism, I am of the opinion that the benefits of international tourism, including income and cultural preservation, are far greater than the drawbacks."
      }
    ],
    vocab: [
      { word: 'local communities', thaiMeaning: 'ชุมชนท้องถิ่น' },
      { word: 'overcrowding', thaiMeaning: 'ความแออัด' },
      { word: 'visitor limits', thaiMeaning: 'การจำกัดจำนวนนักท่องเที่ยว' },
      { word: 'historic sites', thaiMeaning: 'สถานที่ทางประวัติศาสตร์' }
    ]
  },
  {
    id: 't2-ad-5',
    number: 5,
    typeId: 'advantages-disadvantages',
    title: 'E-books vs. Paper Books',
    questionText:
      'Nowadays, many people prefer to read e-books rather than paper books. Do the benefits of this outweigh the drawbacks?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while reading e-books instead of paper books is both beneficial and detrimental, this essay argues that the benefits are far greater than the drawbacks."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits associated with reading e-books. The first benefit is that e-readers can store thousands of titles in a single lightweight device, making them extremely convenient for travel. For example, a single e-reader weighing under 200 grams can hold an entire personal library of several thousand books. Another advantage is that e-books are typically cheaper than paper books, as they avoid printing and distribution costs. For instance, digital editions of new releases are often priced around 30% lower than their hardcover equivalents, making reading a much cheaper hobby overall."
      },
      {
        role: 'body2',
        text: "However, some might be concerned regarding the loss of the traditional reading experience that paper books provide. This is because many readers associate physical books with better focus and fewer digital distractions, particularly among younger readers. To illustrate, some studies suggest that readers retain information less effectively when reading from a screen. However, this argument is simply invalid given that modern e-readers now use paper-like display technology specifically designed to reduce eye strain and distraction. For example, devices such as the Kindle Paperwhite lack internet browsers entirely, allowing readers to focus solely on their book."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that some might be concerned in terms of the reading experience offered by paper books, I am of the opinion that the benefits of e-books, including convenience and affordability, are far greater than the drawbacks."
      }
    ],
    vocab: [
      { word: 'reading experience', thaiMeaning: 'ประสบการณ์การอ่าน' },
      { word: 'eye strain', thaiMeaning: 'อาการปวดล้าตา' },
      { word: 'printing costs', thaiMeaning: 'ต้นทุนการพิมพ์' },
      { word: 'digital distractions', thaiMeaning: 'สิ่งรบกวนทางดิจิทัล' }
    ]
  },

  // ── Double Question ──────────────────────────────────────────────────
  {
    id: 't2-dq-1',
    number: 1,
    typeId: 'double-question',
    title: 'Living Longer, Fewer Babies',
    questionText:
      'In many countries, people are living longer and birth rates are falling. What problems does this cause? What measures could be taken to solve them?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that increasing life expectancy, combined with falling birth rates, is placing considerable pressure on governments around the world. This essay will discuss both the challenges this trend brings and the measures that could be taken to address them."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of challenges associated with an ageing population. The first challenge is that healthcare systems face growing pressure as elderly citizens require more frequent medical treatment. For example, Japan, where more than 29% of the population is now over 65, has seen its national healthcare spending rise sharply over the past decade. Another challenge is that a shrinking workforce must support a growing number of retirees. For instance, countries such as Italy now have far fewer working-age taxpayers for every pensioner than they did in 1990."
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that governments could adopt. The first is that raising the retirement age would allow older citizens to remain economically active for longer. For example, Germany has gradually raised its retirement age to 67 in order to ease pressure on its pension system. Another measure is that encouraging higher birth rates through financial incentives could help rebalance the population over time. For instance, France offers generous childcare subsidies, which have helped it maintain one of the highest birth rates in Europe."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that an ageing population creates serious challenges for governments, I am of the opinion that a combination of workforce reform and family support policies can help societies adapt successfully over the coming decades."
      }
    ],
    vocab: [
      { word: 'healthcare spending', thaiMeaning: 'ค่าใช้จ่ายด้านสุขภาพ' },
      { word: 'working-age taxpayers', thaiMeaning: 'ผู้เสียภาษีวัยทำงาน' },
      { word: 'childcare subsidies', thaiMeaning: 'เงินอุดหนุนค่าเลี้ยงดูเด็ก' },
      { word: 'birth rates', thaiMeaning: 'อัตราการเกิด' }
    ]
  },
  {
    id: 't2-dq-2',
    number: 2,
    typeId: 'double-question',
    title: 'Older People and Technology',
    questionText:
      'Some older people find it difficult to use modern technology such as smartphones and the Internet. What benefits could older people gain from using technology more? What could be done to encourage them to use it?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that while advanced technology has brought many beneficial changes to the world, many older people today struggle to make use of devices such as smartphones and the Internet. This essay will discuss both the benefits older people could gain from modern technology and the measures that could encourage them to use it more often."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of benefits older people could gain from advanced technology. The first benefit is that video-calling applications allow elderly people to stay in regular contact with family members who live far away. For example, many grandparents now use video calls to see their grandchildren grow up despite living in different countries. Another benefit is that health-monitoring devices can alert both elderly users and their doctors to medical problems at an early stage. For instance, wearable devices that track heart rate can warn users of irregular patterns before a serious health issue develops."
      },
      {
        role: 'body2',
        text: "Turning to possible measures, there are several ways older people could be encouraged to use consumer electronics more often. The first is that community centres could offer free, beginner-friendly technology classes designed specifically for older residents. For example, local libraries in several UK cities now run weekly digital skills workshops for elderly visitors. Another measure is that manufacturers could design devices with simpler interfaces and larger text specifically for older users. For instance, some smartphone models now include an \"easy mode\" that displays larger icons and fewer menu options."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that many older people currently struggle with modern technology, I am of the opinion that accessible training and better device design can help them enjoy its full benefits."
      }
    ],
    vocab: [
      { word: 'digital skills', thaiMeaning: 'ทักษะดิจิทัล' },
      { word: 'wearable devices', thaiMeaning: 'อุปกรณ์สวมใส่' },
      { word: 'simpler interfaces', thaiMeaning: 'หน้าจอใช้งานง่ายขึ้น' },
      { word: 'video-calling applications', thaiMeaning: 'แอปพลิเคชันวิดีโอคอล' }
    ]
  },
  {
    id: 't2-dq-3',
    number: 3,
    typeId: 'double-question',
    title: 'The Fresh Water Shortage',
    questionText:
      'Access to fresh water has become a problem in many parts of the world. What are the reasons for this? What measures could be taken to solve this problem?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that access to fresh water has become a growing global problem in recent years. This essay will discuss both the reasons behind this issue and the measures that governments and individuals could take to address it."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons why fresh water has become scarce in many regions. The first reason is that rising global temperatures are causing rivers, lakes, and glaciers to shrink at unprecedented rates. For example, the Colorado River in the United States now regularly runs dry before reaching the sea due to prolonged drought. Another reason is that rapid population growth has significantly increased overall water demand for agriculture and industry, particularly in rapidly urbanising regions. For instance, countries such as India now use groundwater faster than natural rainfall can replenish it."
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could invest in modern irrigation systems that use significantly less water than traditional methods. For example, Israel has become a world leader in drip irrigation technology, cutting agricultural water use dramatically. Another measure is that individuals could reduce personal water waste through simple daily habits, such as taking shorter showers and fixing leaking taps. For instance, a single dripping tap can waste more than 20 litres of water every single day."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that fresh water scarcity is a complex global issue, I am of the opinion that a combination of government investment and individual responsibility can significantly ease this problem."
      }
    ],
    vocab: [
      { word: 'drip irrigation', thaiMeaning: 'การให้น้ำแบบหยด' },
      { word: 'groundwater', thaiMeaning: 'น้ำใต้ดิน' },
      { word: 'agricultural water use', thaiMeaning: 'การใช้น้ำเพื่อการเกษตร' },
      { word: 'prolonged drought', thaiMeaning: 'ภัยแล้งที่ยืดเยื้อ' }
    ]
  },
  {
    id: 't2-dq-4',
    number: 4,
    typeId: 'double-question',
    title: 'Why Drivers Break Road Safety Laws',
    questionText:
      'Although laws exist to make roads safer, many drivers still break them by speeding or using mobile phones. Why do drivers continue to break these laws? What measures could be taken to address this problem?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that although driving laws exist in every country to ensure road safety, many drivers continue to break them by speeding or using mobile phones while driving. This essay will discuss both the reasons behind this behaviour and the measures that could help solve the problem."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons why drivers continue to break road safety laws. The first reason is that many drivers underestimate the risks involved, believing that breaking minor rules will not lead to an accident. For example, surveys of drivers who use their phones at the wheel often reveal that most believe they can do so safely just this once. Another reason is that penalties for these offences are often too weak to act as an effective deterrent. For instance, fines for using a mobile phone while driving remain relatively low in several countries compared to the potential harm caused."
      },
      {
        role: 'body2',
        text: "Turning to possible solutions, there are several measures that could help solve this problem. The first is that governments could introduce stricter penalties, such as higher fines and automatic licence suspensions for repeat offenders. For example, some countries have successfully reduced phone-related accidents after introducing points-based licence systems. Another measure is that technology companies could design devices that automatically restrict phone use whenever a vehicle is moving. For instance, several smartphone models now include a driving mode that silences notifications once the car reaches a certain speed."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that changing driver behaviour takes time, I am of the opinion that stricter penalties combined with smarter technology can significantly improve road safety."
      }
    ],
    vocab: [
      { word: 'licence suspensions', thaiMeaning: 'การพักใช้ใบขับขี่' },
      { word: 'repeat offenders', thaiMeaning: 'ผู้กระทำผิดซ้ำ' },
      { word: 'points-based system', thaiMeaning: 'ระบบสะสมแต้ม' },
      { word: 'road safety', thaiMeaning: 'ความปลอดภัยบนท้องถนน' }
    ]
  },
  {
    id: 't2-dq-5',
    number: 5,
    typeId: 'double-question',
    title: 'Giving Children Everything They Want',
    questionText:
      'Some parents give their children everything they want and allow them complete freedom. Does this benefit children? What are the consequences when these children grow up?',
    meta: 'แนวข้อสอบ (Practice)',
    paragraphs: [
      {
        role: 'intro',
        text: "It has been widely argued that some parents give their children everything they ask for or allow them complete freedom to do as they wish. This essay will discuss both whether this parenting style benefits children and the consequences it could have once these children grow up."
      },
      {
        role: 'body1',
        text: "To begin with, there are a number of reasons why this parenting style is not beneficial for children. The first reason is that children who receive everything they want rarely learn the value of patience or hard work. For example, children given expensive gifts without any effort attached often show little appreciation for what they receive. Another reason is that children allowed complete freedom rarely learn to respect boundaries or authority. For instance, teachers frequently report that children raised without firm rules at home struggle to follow classroom guidelines."
      },
      {
        role: 'body2',
        text: "Turning to the possible consequences, there are several ways this upbringing could affect these children later in life. The first is that they may struggle with discipline and responsibility once they enter the workplace. For example, employers often note that young employees who lacked structure as children find it harder to meet deadlines and follow instructions. Another consequence is that they may develop unrealistic expectations about how the wider world treats them. For instance, adults who were rarely told \"no\" as children often struggle to cope with rejection or failure later in life."
      },
      {
        role: 'conclusion',
        text: "In conclusion, although it is undeniable that parents want their children to be happy, I am of the opinion that giving children everything they want ultimately causes more harm than good."
      }
    ],
    vocab: [
      { word: 'firm rules', thaiMeaning: 'กฎเกณฑ์ที่เข้มงวด' },
      { word: 'unrealistic expectations', thaiMeaning: 'ความคาดหวังที่ไม่สมจริง' },
      { word: 'workplace responsibility', thaiMeaning: 'ความรับผิดชอบในที่ทำงาน' },
      { word: 'rejection or failure', thaiMeaning: 'การถูกปฏิเสธหรือความล้มเหลว' }
    ]
  }
]

export const getWritingTask2Prompts = (typeId: WritingTask2TypeId) =>
  WRITING_TASK2_PROMPTS.filter((prompt) => prompt.typeId === typeId)
