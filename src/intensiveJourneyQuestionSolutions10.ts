import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'

type StageSolutions = Record<1 | 2, Record<number, IntensiveQuestionSolution>>

const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword,
  questionKeyword,
  thaiMeaning
})

export const INTENSIVE_SOLUTIONS_STAGE_10: Record<number, StageSolutions> = {
  10: {
    1: {
      1: s(
        'Unlike conventional conservation, which typically focuses on protecting and managing existing habitats',
        'conventional conservation reintroduces missing species',
        'อนุรักษ์แบบเดิมเน้นปกป้องและจัดการที่อยู่ — การปล่อยสัตว์กลับเป็น rewilding ไม่ใช่งานอนุรักษ์ทั่วไป'
      ),
      2: s(
        'elk reduced their grazing pressure in areas where predation risk was high',
        'elk changed feeding where attack risk was greater',
        'เอลก์ลดการกินหญ้าในพื้นที่เสี่ยงถูกล่า — ตรงกับ predation risk was high'
      ),
      3: s(
        'Middleton found limited evidence for the specific riparian vegetation changes',
        'Middleton concluded no measurable ecosystem change',
        'Middleton บอกว่าหลักฐานจำกัด ไม่ได้ยืนยันว่าไม่มีการเปลี่ยนแปลงเลย — ข้อความในข้อสอบเกินจริง'
      ),
      4: s(
        'a former intensive farm converted to rewilding over two decades',
        'previously used for intensive agriculture',
        'former intensive farm = เคยเป็นฟาร์มเข้มข้น — ตรงกับข้อความ'
      ),
      5: s(
        'River Tay in Scotland in 2009 and the River Exe in Devon in 2015',
        'reintroduced to England and Scotland simultaneously',
        'ปล่อยคืนปี 2009 และ 2015 คนละปี — ไม่ใช่พร้อมกัน'
      ),
      6: s(
        'beaver-engineered wetlands reduced peak water flow during storms by up to 30 percent',
        'beaver activity reduced peak flooding by nearly a third',
        'ลด peak water flow ได้ถึง 30% — ตรงกับ nearly a third'
      ),
      7: s(
        'sets a target of restoring at least 30% of Europe\'s land and sea areas',
        'financial penalties for failing to meet rewilding targets',
        'บทความพูดถึงเป้าหมาย 30% แต่ไม่ได้กล่าวถึงบทลงโทษทางการเงิน'
      ),
      8: s('reducing human management', 'human management', 'ลด human management = การจัดการโดยมนุษย์'),
      9: s('The concept of trophic cascades', 'trophic cascades', 'trophic cascades = การถ่ายทอดผลกระทบในโซ่อาหาร'),
      10: s(
        'elk reduced their grazing pressure in areas where predation risk was high',
        'elk',
        'หมาป่าเปลี่ยนพฤติกรรมของ elk = กวางเอลก์'
      ),
      11: s(
        'the reintroduction of large herbivores rather than predators',
        'large herbivores',
        'large herbivores = สัตว์กินพืชขนาดใหญ่ เช่น วัว หมู ม้า'
      ),
      12: s(
        'beaver-engineered wetlands reduced peak water flow during storms by up to 30 percent',
        'beaver-engineered wetlands',
        'beaver-engineered wetlands = พื้นที่ชุ่มน้ำที่ beaver สร้าง'
      ),
      13: s(
        'negotiating the interests of farmers, foresters, landowners, and rural communities',
        'farmers',
        'interests of farmers = ผลประโยชน์ของเกษตรกร'
      ),
      14: s('rigorous long-term monitoring', 'long-term monitoring', 'long-term monitoring = การติดตามผลระยะยาว')
    },
    2: {
      1: s(
        'deliberate exposure to a mild form of a disease could protect against its more deadly version predates modern medicine by centuries',
        'Paragraph A',
        'วิธีป้องกันโรคโบราณที่ Lady Montagu นำมาสู่อังกฤษ'
      ),
      2: s(
        'Jenner had observed the popular belief among milkmaids that contracting cowpox provided protection against smallpox',
        'Paragraph B',
        'Jenner สังเกตความเชื่อแล้วทดลองกับ James Phipps อย่างเป็นระบบ'
      ),
      3: s(
        'Jenner\'s work met with fierce opposition. Satirical cartoons depicted people who had received the vaccine sprouting cows from their bodies',
        'Paragraph C',
        'ถูกคัดค้านและล้อเลียนก่อนวัคซีนแพร่หลาย'
      ),
      4: s(
        'Pasteur demonstrated that infectious diseases were caused by specific microorganisms, each of which could be cultured, weakened, and used to produce a protective immune response',
        'Paragraph D',
        'Pasteur พิสูจน์ด้วยจุลชีพและกรอบทฤษฎีโรคอย่างเป็นระบบ'
      ),
      5: s(
        'The twentieth century brought a succession of vaccine triumphs. The eradication of smallpox… represented the first complete elimination of a human infectious disease through vaccination',
        'Paragraph E',
        'วัคซีนหลายชนิดตลอดศตวรรษที่ 20 จบด้วยการกำจัดฝ้าครั้งแรก'
      ),
      6: s(
        'The 1955 Cutter incident, in which batches of improperly inactivated poliovirus vaccine caused 40,000 cases of polio',
        'Paragraph F',
        'เหตุการณ์ Cutter จากวัคซีนโปลิโอผลิตผิดพลาด ส่งผลร้ายแรง'
      ),
      7: s(
        'The COVID-19 pandemic accelerated vaccine development to a degree without historical precedent. low-income countries receiving significantly fewer doses per capita than wealthier nations',
        'Paragraph G',
        'พัฒนาวัคซีนเร็วเป็นประวัติการณ์ และชาติรายได้ต่ำได้โดสน้อยกว่า'
      ),
      8: s(
        'introduced to Britain in the early eighteenth century by Lady Mary Wortley Montagu, who had observed it in Constantinople during her husband\'s diplomatic posting',
        'introduced variolation after observing abroad',
        'Montagu เห็นที่ Constantinople ขณะสามีไปทำงานทูต แล้วนำ variolation มาในอังกฤษ'
      ),
      9: s(
        'he inoculated a healthy eight-year-old boy, James Phipps',
        'Phipps later became a doctor',
        'บทความพูดถึงการทดลองเท่านั้น ไม่ได้กล่าวว่า Phipps ต่ออาชีพแพทย์ภายหลัง'
      ),
      10: s(
        'a fraudulent 1998 paper by Andrew Wakefield, which was subsequently retracted',
        'Wakefield paper fraudulent and removed from publication',
        'งานวิจัยฉ้อโกง (fraudulent) และถูกถอน (retracted) — ตรงกับข้อความ'
      ),
      11: s(
        'induce mild infection and subsequent immunity',
        'immunity',
        'stimulate immunity = กระตุ้นภูมิคุ้มกัน'
      ),
      12: s('vacca, meaning cow', 'cow', 'vacca แปลว่า cow = วัว'),
      13: s(
        'low-income countries receiving significantly fewer doses per capita than wealthier nations',
        'doses per capita',
        'fewer doses per capita = ได้โดสวัคซีนต่อหัวน้อยกว่า'
      )
    }
  }
}
