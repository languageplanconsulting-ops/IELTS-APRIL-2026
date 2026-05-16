/** Hand-tuned hints, Thai explanations, and paraphrase pairs for Cambridge 19 Test 4 */

export const CAMBRIDGE_19_TEST4_ENRICHMENTS = {
  '4-1-1': {
    exact:
      'populations of around two thirds of butterfly species have declined in Britain over the past 40 years',
    thai: 'บทความบอกว่าประชากมผีเสื้อลดลงในช่วง 40 ปีที่ผ่านมา แปลว่าเมื่อ 40 ปีก่อนมีมากกว่าปัจจุบัน ข้อความในบทความขัดแย้งกับข้อความในข้อ จึงตอบ FALSE',
    para: 'fewer forty years ago = declined over the past 40 years = ลดลงตลอด 40 ปี',
    exactHints: 'populations|declined|past 40 years'
  },
  '4-1-2': {
    thai: 'บทความระบุว่าหนอนผีเสื้อเป็นเหยื่อของนก ค้างคาว และสัตว์เลี้ยงลูกด้วยนมขนาดเล็กอื่นๆ ข้อความในบทความสนับสนุนข้อนี้โดยตรง จึงตอบ TRUE',
    para: 'eaten by predators = act as prey for birds|bats|mammals = เป็นเหยื่อหลายชนิด',
    exactHints: 'act as prey for birds|bats|other small mammals'
  },
  '4-1-3': {
    thai: 'บทความนิยาม phenology ว่าเป็นเรื่อง timing ของเหตุการณ์ในวงจรชีวิต ไม่ใช่การเปลี่ยน location ข้อความในบทความขัดแย้งกับข้อความในข้อ จึงตอบ FALSE',
    para: 'alter location = timing of lifecycle events = เวลาไม่ใช่สถานที่',
    exactHints: 'timing of such lifecycle events|phenology'
  },
  '4-1-4': {
    thai: 'บทความพูดถึงการขยับเวลาเกิด (advance phenology) และอุณหภูมิฤดูใบไม้ผลิ แต่ไม่ได้กล่าวว่าอายุขัยสั้นลง บทความไม่ได้ให้ข้อมูลเพียงพอที่จะยืนยันหรือปฏิเสธข้อนี้ จึงตอบ NOT GIVEN',
    para: 'reduced lifespan = NOT GIVEN = ไม่ได้กล่าวถึงอายุขัย',
    exactHints: 'advanced by between three days|spring temperature'
  },
  '4-1-5': {
    thai: 'บทความบอกชัดว่า The answer is still unknown ว่าผีเสื้อปรับตัวได้ดีหรือถูกบังคับ ข้อความในบทความขัดแย้งกับข้อที่บอกว่ามีเหตุผลชัดเจน จึงตอบ FALSE',
    para: 'clear reason = answer is still unknown = ยังไม่ทราบเหตุผล',
    exactHints: 'The answer is still unknown'
  },
  '4-1-6': {
    exact:
      'data from millions of records that had been submitted by butterfly enthusiasts – people who spend their free time observing the activities of different species',
    thai: 'ข้อมูลมาจาก butterfly enthusiasts ที่ใช้เวลาว่างสังเกตผีเสื้อ ซึ่งตรงกับ amateur butterfly watchers ข้อความในบทความสนับสนุนข้อนี้โดยตรง จึงตอบ TRUE',
    para: 'amateur butterfly watchers = butterfly enthusiasts|free time observing = นักดูผีเสื้อสมัครเล่น',
    exactHints: 'butterfly enthusiasts|free time observing'
  },
  '4-1-7': {
    thai: 'บทความระบุว่า Small Blue มี colonies ได้ถึงร้อยตัว คำว่า lives in large ในข้อจึงตอบ colonies',
    para: 'lives in large = colonies are up to a hundred strong = กลุ่มใหญ่',
    exactHints: 'colonies are up to a hundred strong|Small Blue'
  },
  '4-1-8': {
    thai: 'บทความบอกว่าบางตัวกลายเป็นผีเสื้อ early in spring คำว่า first appears at the start of จึงตอบ spring',
    para: 'start of = early in = spring = ต้นฤดูใบไม้ผลิ',
    exactHints: 'early in spring|Small Blue'
  },
  '4-1-9': {
    thai: 'High Brown Fritillary ถูกอธิบายว่าเป็น Britain\'s most endangered butterfly คำว่า more … than other species จึงตอบ endangered',
    para: 'more endangered = most endangered butterfly = ใกล้สูญพันธุ์ที่สุด',
    exactHints: 'most endangered butterfly|High Brown Fritillary'
  },
  '4-1-10': {
    thai: 'บทความบอกว่าสายพันธุ์นี้เชี่ยวชาญ habitat types ที่เฉพาะเจาะจง มักเกี่ยวกับอาหารของหนอน คำว่า limited range of จึงตอบ habitat',
    para: 'limited range of = very specific habitat types = ที่อยู่อาศัยจำกัด',
    exactHints: 'very specific habitat types|caterpillar'
  },
  '4-1-11': {
    thai: 'บทความบอกว่าในทวีปยุโรป (continental Europe) บางชนิดมีสองรุ่นต่อปี คำว่า warm areas of จึงตอบ Europe',
    para: 'warm areas of = continental Europe = ยุโรป',
    exactHints: 'continental Europe|second generation'
  },
  '4-1-12': {
    thai: 'White Admiral พบใน southern England คำว่า is found in … areas of England จึงตอบ southern',
    para: 'areas of England = southern England = ภาคใต้อังกฤษ',
    exactHints: 'White Admiral of southern England'
  },
  '4-1-13': {
    thai: 'การลดลงอาจเพราะหนอนกินเฉพาะ honeysuckle ซึ่งสรุปเป็น diet ของ caterpillar คำว่า the … of the caterpillar จึงตอบ diet',
    para: 'diet of the caterpillar = exists solely on a diet = อาหารของหนอน',
    exactHints: 'exists solely on a diet|honeysuckle'
  },
  '4-2-14': {
    thai: 'ย่อหน้า C กล่าวถึงความต้องการ cobalt สำหรับแบตเตอรี่รถยนต์ไฟฟ้า ซึ่งเชื่อมกับอุตสาหกรรมขนส่ง ข้อความที่เกี่ยวกับ electric car batteries ชี้ไปที่ย่อหน้า C',
    para: 'raw material in transport = cobalt for electric car batteries = โคบอลต์แบต EV',
    exactHints: 'cobalt for electric car batteries|demand for resources'
  },
  '4-2-15': {
    exact: 'The oceans occupy around 70% of the planet and are relatively unexplored',
    thai: 'ย่อหน้า F ระบุว่ามหาสมุทรครอบคลุมประมาณ 70% ของโลก ข้อความที่เกี่ยวกับ 70% of the planet ชี้ไปที่ย่อหน้า F',
    para: 'area covered by oceans = occupy around 70% of the planet = 70% ของโลก',
    exactHints: 'oceans occupy around 70%|planet'
  },
  '4-2-16': {
    exact:
      'hydrothermal vents, which are created when seawater meets volcanic magma, have crucial impacts upon biodiversity and the global climate',
    thai: 'ย่อหน้า E อธิบายว่า hydrothermal vents เกิดเมื่อน้ำทะเลพบแมกมาภูเขาไฟ ข้อความที่เกี่ยวกับ seawater meets volcanic magma ชี้ไปที่ย่อหน้า E',
    para: 'habitat formed = created when seawater meets volcanic magma = ปล่องไฮโดรเทอร์มอล',
    exactHints: 'hydrothermal vents|seawater meets volcanic magma'
  },
  '4-2-17': {
    thai: 'ย่อหน้า D บอกว่า global regulatory framework is not yet drafted ข้อความที่เกี่ยวกับ rules for exploration ชี้ไปที่ย่อหน้า D',
    para: 'yet to agree on rules = regulatory framework is not yet drafted = ยังไม่มีกรอบกฎหมาย',
    exactHints: 'global regulatory framework is not yet drafted'
  },
  '4-2-18': {
    exact:
      "instead of continually looking at the fast depleting land resources of the planet to meet society's rising needs",
    thai: 'Mike Johnston ว่าควรสำรวจทรัพยากรใต้ทะเลแทนการพึ่งทรัพยากรบนบกที่หมดลง สอดคล้องกับการเลิกพึ่งแหล่งบกที่ถูกขุดมากแล้ว ข้อความที่เกี่ยวกับ depleting land resources ชี้ไปที่ D',
    para: 'move away from land reserves = fast depleting land resources = เลิกพึ่งทรัพยากรบก',
    exactHints: 'fast depleting land resources|untapped potential|Johnston'
  },
  '4-2-19': {
    thai: 'Hunter, Aguon และ Singh กล่าวถึงการเพิกเฉยต่อผลกระทบต่อสิ่งแวดล้อมและชุมชน ข้อความที่เกี่ยวกับ disregard for environmental and social impacts ชี้ไปที่ B',
    para: 'negative effects ignored = general disregard for environmental and social impacts = เพิกเฉยผลกระทบ',
    exactHints: 'disregard for environmental and social impacts|marginalisation'
  },
  '4-2-20': {
    thai: 'Upton เน้นหายาราจากทะเลก่อนทำลายถาวร มากกว่าแร่ธาตุ ข้อความที่เกี่ยวกับ medicines or drugs down there ชี้ไปที่ A',
    para: 'more worthwhile than minerals = medicines or drugs down there = ยา/สารประโยชน์',
    exactHints: 'medicines or drugs down there|bioactive potential|Upton'
  },
  '4-2-21': {
    thai: 'Verena Tunnicliffe ว่าการขุดเหมืองจะเป็นการโจมตีระบบนิเวศใต้ทะเลที่รุนแรงที่สุด ข้อความที่เกี่ยวกับ greatest assault ชี้ไปที่ E',
    para: 'most destructive impact = greatest assault on deep-sea ecosystems = ผลทำลายสูงสุด',
    exactHints: 'greatest assault on deep-sea ecosystems|Tunnicliffe'
  },
  '4-2-22': {
    exact:
      'The surface of the Moon, Mars and even Venus have all been mapped and studied in much greater detail',
    thai: 'ผู้เขียนใน D เปรียบเทียบว่าดวงจันทร์ ดาวอังคาร และดาวศุกร์ถูกทำแผนที่ละเอียดกว่าทะเลลึก ข้อความที่เกี่ยวกับ Moon, Mars and Venus ชี้ไปที่ B',
    para: 'more known about outer space = Moon, Mars and Venus mapped in greater detail = รู้จักอวกาศมากกว่า',
    exactHints: 'Moon, Mars and even Venus|mapped and studied in much greater detail'
  },
  '4-2-23': {
    thai: 'Dr Jon Copley บอกชัดว่าไม่ต้องการให้ขุดบน deep sea vents ข้อความที่เกี่ยวกับ don\'t want mining on them ชี้ไปที่ C',
    para: 'habitat where mining should not take place = don\'t want mining on them = ปล่องร้อนใต้ทะเล',
    exactHints: "don't want mining on them|deep sea vents|Copley"
  },
  '4-2-24': {
    thai: 'บริษัทเหมืองบอกว่าขุดใต้ทะเลได้แร่ดีกว่าและมี waste น้อย (little, if any, waste) คำว่า without producing much จึงตอบ waste',
    para: 'without producing much = little, if any, waste = ของเสียน้อย',
    exactHints: 'little, if any, waste|superior ore'
  },
  '4-2-25': {
    thai: 'ใช้ converted machinery ที่เคยใช้ในการขุดบนบก คำว่า adapting the จึงตอบ machinery',
    para: 'adapting = converted machinery = เครื่องจักร',
    exactHints: 'converted machinery|terrestrial mining'
  },
  '4-2-26': {
    thai: 'กลุ่มด้านสิ่งแวดล้อมและกฎหมาย urged caution คำว่า strongly believe that … is necessary จึงตอบ caution',
    para: 'is necessary = urged caution = ความระมัดระวัง',
    exactHints: 'urged caution|environmental and legal groups'
  },
  '4-3-27': {
    thai: 'ย่อหน้าแรกสรุปความเชื่อทั่วไปว่ามนุษย์ selfish โดยไม่ได้แสดงมุมมองตรงข้ามหรือให้เหตุผลของตัวเอง คำตอบ C ตรงกับ describing a commonly held belief',
    para: 'commonly held belief = general assumption that human beings are essentially selfish = ความเชื่อทั่วไป',
    exactHints: 'general assumption that human beings are essentially selfish'
  },
  '4-3-28': {
    thai: 'หนังสือ The Selfish Gene โด่งดังเพราะสอดคล้องกับ competitive and individualistic ethos ปลายศตวรรษที่ 20 คำตอบ C ตรงกับ in line with attitudes of its time',
    para: 'in line with attitudes of its time = fitted so well with competitive and individualistic ethos = สอดคล้องยุคนั้น',
    exactHints: 'fitted so well with|competitive and individualistic ethos|late 20th-century'
  },
  '4-3-29': {
    thai: 'ย่อหน้าที่สี่บอกว่าประชากรน้อยและไม่น่าจะต้องแย่งทรัพยากร สอดคล้องกับทรัพยากรธรรมชาติค่อนข้างมากพอ คำตอบ B',
    para: 'resources relatively plentiful = unlikely that groups had to compete against each other for resources = ทรัพยากรพอ',
    exactHints: 'unlikely that prehistoric hunter-gatherer groups had to compete|sparsely populated'
  },
  '4-3-30': {
    thai: 'Knauft แสดงว่าคนล่า-เก็บมี egalitarianism สูง ผู้เขียนใช้หลักฐานนี้สนับสนุนว่าความเห็นแก่เป็นสิ่งที่เกิดขึ้นทีหลัง ไม่ใช่ลักษณะดั้งเดิม คำตอบ A',
    para: 'selfishness recent development = negative traits developed so recently|egalitarian hunter-gatherers = เห็นแก่เป็นพัฒนาการช่วงหลัง',
    exactHints: 'extreme political and sexual egalitarianism|developed so recently|Knauft'
  },
  '4-3-31': {
    thai: 'Knauft ระบุว่าคนล่า-เก็บมี extreme political and sexual egalitarianism คำว่า high level of จึงตอบ egalitarianism',
    para: 'high level of = extreme political and sexual egalitarianism = ความเท่าเทียม',
    exactHints: 'extreme political and sexual egalitarianism'
  },
  '4-3-32': {
    thai: 'มีวิธีป้องกัน disparities of status คำว่า differences in จึงตอบ status',
    para: 'differences in = disparities of status = สถานะ',
    exactHints: 'disparities of status|preserving egalitarianism'
  },
  '4-3-33': {
    thai: 'ชน !Kung แลกลูกศรก่อน going hunting และให้เกียรติคนเจ้าของลูกศร คำว่า success at จึงตอบ hunting',
    para: 'success at = going hunting|animal is killed = ล่าสัตว์',
    exactHints: 'going hunting|swap arrows|animal is killed'
  },
  '4-3-34': {
    thai: 'ถ้าคน domineering เกินไป จะถูก ostracise คำว่า behave in a … manner จึงตอบ domineering',
    para: 'behave in a domineering manner = becomes too domineering = ชอบคุม',
    exactHints: 'too domineering|ostracise'
  },
  '4-3-35': {
    thai: 'ผู้หญิงมี high level of autonomy ในการเลือกคู่และงาน คำว่า considerable amount of จึงตอบ autonomy',
    para: 'considerable amount of = high level of autonomy = อิสระ',
    exactHints: 'high level of autonomy|marriage partners'
  },
  '4-3-36': {
    thai: 'ผู้เขียนพูดว่านักมานุษยวิทยาเชื่อว่าสังคมแบบ !Kung เป็นปกติจนหลายพันปีก่อน แต่ไม่ได้ว่าใครผิดเรื่องจุดเริ่มลดลง บทความไม่ได้ให้ข้อมูลเพียงพอ จึงตอบ NOT GIVEN',
    para: 'anthropologists mistaken = NOT GIVEN = ไม่ได้วิจารณ์ความผิดพลาด',
    exactHints: 'Many anthropologists believe|!Kung were normal'
  },
  '4-3-37': {
    thai: 'ผู้เขียนบอกว่าไม่มีเหตุผลสมมติว่าคุณสมบัติสงครามจะถูกเลือกโดยวิวัฒนาการ เพราะไม่มีประโยชน์ในยุคก่อนประวัติศาสตร์ มุมมองขัดกับข้อที่บอกว่าคนสงครามได้เปรียบ จึงตอบ NO',
    para: 'warlike traits advantage = little reason to assume racism, warfare should have been selected = ไม่ได้เปรียบ',
    exactHints: 'little reason to assume that traits such as racism, warfare'
  },
  '4-3-38': {
    thai: 'ผู้เขียนเห็นว่า cooperation, egalitarianism, altruism และ peacefulness เป็นลักษณะ innate ของมนุษย์ มุมมองสอดคล้องกับข้อ จึงตอบ YES',
    para: 'peaceful and cooperative natural = innate characteristics|cooperation, egalitarianism = สันติและร่วมมือเป็นธรรมชาติ',
    exactHints: 'innate characteristics of human beings|cooperation, egalitarianism, altruism and peacefulness'
  },
  '4-3-39': {
    thai: 'ผู้เขียนพูดถึงความเห็นแก่ในสังคมสมัยใหม่โดยทั่วไป แต่ไม่ได้เปรียบเทียบว่าวัฒนธรรมใดแสดงลักษณะลบมากกว่า บทความไม่ได้ให้ข้อมูลเพียงพอ จึงตอบ NOT GIVEN',
    para: 'some modern cultures more = NOT GIVEN = ไม่เปรียบเทียบวัฒนธรรม',
    exactHints: 'modern humans behave so selfishly|NOT GIVEN'
  },
  '4-3-40': {
    exact:
      'Research has shown repeatedly that when the natural habitats of primates such as apes and gorillas are disrupted, they tend to become more violent and hierarchical',
    thai: 'บทความบอกว่าการวิจัย primates แสดงซ้ำๆ ว่าเมื่อถิ่นที่อยู่ถูกรบกวน จะกลายรุนแรงและลำดับชั้นมากขึ้น ข้อที่บอกว่า research failed to reveal link ขัดกับผู้เขียน จึงตอบ NO',
    para: 'failed to reveal link = Research has shown repeatedly|habitats disrupted = มีหลักฐานเชื่อมโยง',
    exactHints: 'Research has shown repeatedly|habitats of primates are disrupted|more violent and hierarchical'
  }
}
