import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'

type StageSolutions = Record<1 | 2, Record<number, IntensiveQuestionSolution>>

const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword,
  questionKeyword,
  thaiMeaning
})

export const INTENSIVE_SOLUTIONS_STAGE_15: Record<number, StageSolutions> = {
  15: {
    1: {
      1: s('Far from being a passive state of reduced activity, sleep involves a precisely choreographed sequence of neural events', 'sleep is an active process not passive resting', 'การนอนเป็นกระบวนการที่แอคทีฟ ไม่ใช่พักเฉยๆ'),
      2: s('growth hormone is released predominantly during slow-wave sleep', 'growth hormone primarily during REM', 'ฮอร์โมนเติบโตหลั่งในช่วง slow-wave ไม่ใช่ REM'),
      3: s('a full night of sleep after learning… produces significantly better recall… compared with an equivalent period of wakefulness', 'learning after sleep better than after no sleep', 'บทความเปรียบการนอนหลังเรียน ไม่ได้เปรียบการเรียนหลังนอน'),
      4: s('Sleeping fewer than six hours per night on a regular basis is associated with increased risk of… type 2 diabetes', 'fewer than six hours increases diabetes risk', 'นอนน้อยกว่า 6 ชม. เสี่ยงเบาหวานชนิดที่ 2'),
      5: s('The system appears to be largely inactive during wakefulness', 'glymphatic system same rate sleep and wakefulness', 'ระบบ glymphatic ทำงานน้อยมากตอนตื่น'),
      6: s('early school start times that researchers have linked to impaired academic performance', 'delayed start times improve academic results', 'บอกว่าเริ่มเรียนเร็วทำให้ผลการเรียนแย่ลง ไม่ได้บอกว่าเลื่อนเวลาแล้วดีขึ้น'),
      7: s('Cognitive behavioural therapy for insomnia… is recommended as the first-line intervention for chronic insomnia… substantially stronger evidence base than any pharmacological treatment', 'CBT recommended ahead of medication for chronic insomnia', 'CBT เป็นการรักษาแรกสำหรับนอนไม่หลับเรื้อรัง'),
      8: s('Sleep is organised into cycles of approximately 90 minutes', '90-minute sleep cycles', 'รอบการนอน'),
      9: s('the immune system carries out key repair functions', 'physical repair', 'การซ่อมแซม'),
      10: s('the hippocampus — the brain structure primarily responsible for forming new memories', 'brain region (hippocampus)', 'บริเวณสมอง (ฮิปโปแคมปัส)'),
      11: s('Immune function is substantially impaired', 'immune system', 'ระบบภูมิคุ้มกัน'),
      12: s('clearing metabolic waste products from neural tissue during sleep', 'neural waste products', 'ของเสียในเนื้อเยื่อประสาท'),
      13: s('the internal biological clocks that regulate the timing of sleep and wakefulness', 'built-in biological clock', 'นาฬิกาชีวภาพภายใน'),
      14: s('Exposure to artificial light — particularly the blue-wavelength light emitted by screens', 'screen light (artificial light)', 'แสงจากหน้าจอ')
    },
    2: {
      1: s('introduced to Britain… by Lady Mary Wortley Montagu, who had observed it in Constantinople', 'Paragraph A', 'การป้องกันโรคโบราณส่งต่อสู่อังกฤษ'),
      2: s('In 1796, he conducted his landmark experiment… The boy did not develop smallpox. The doctor repeated the experiment', 'Paragraph B', 'หมอชนบททดลองกับเด็กชาย'),
      3: s('Satirical cartoons… Despite this resistance… vaccination spread rapidly', 'Paragraph C', 'ถูกล้อเลียนก่อนได้รับการยอมรับ'),
      4: s('Pasteur demonstrated that infectious diseases were caused by specific microorganisms, each of which could be cultured, weakened, and used to produce a protective immune response', 'Paragraph D', 'Pasteur สร้างกรอบทางวิทยาศาสตร์'),
      5: s('The twentieth century brought a succession of vaccine triumphs… The eradication of smallpox… first complete elimination', 'Paragraph E', 'ความสำเร็จหลายทศวรรษจบด้วยการกำจัดโรค'),
      6: s('The 1955 Cutter incident… fraudulent 1998 paper that was subsequently retracted', 'Paragraph F', 'ความผิดพลาดการผลิตและข้อกล่าวหาที่เป็นเท็จ'),
      7: s('COVID-19 pandemic accelerated vaccine development… low-income countries receiving significantly fewer doses per capita', 'Paragraph G', 'ความเร็วและความไม่เท่าเทียมของวัคซีน COVID'),
      8: s('introduced to Britain… by Lady Mary Wortley Montagu, who had observed it in Constantinople', 'variolation brought by woman who witnessed abroad', 'Montagu นำ variolation มาจากต่างประเทศ'),
      9: s('he inoculated a healthy eight-year-old boy with material from a cowpox pustule', 'boy later became physician', 'ไม่ได้บอกชีวิตภายหลังของเด็กชาย'),
      10: s('originating in a fraudulent 1998 paper that was subsequently retracted', 'fraudulent MMR-autism paper withdrawn', 'งานวิจัยปลอมถูกถอนการตีพิมพ์'),
      11: s('provided protection against smallpox', 'protection against disease', 'การป้องกันโรค'),
      12: s('material from a cowpox pustule on the hand of a milkmaid', 'cowpox material', 'สารจากตุ่ม cowpox'),
      13: s('receiving significantly fewer doses per capita than wealthier nations', 'vaccine doses', 'โดสวัคซีน')
    }
  }
}
