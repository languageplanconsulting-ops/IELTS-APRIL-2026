import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'

type StageSolutions = Record<1 | 2, Record<number, IntensiveQuestionSolution>>

const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword,
  questionKeyword,
  thaiMeaning
})

export const INTENSIVE_SOLUTIONS_STAGE_13: Record<number, StageSolutions> = {
  13: {
    1: {
      1: s('lose their personal identity and rational faculties… regressing to a primitive, instinctual state', 'Le Bon believed crowds became more intelligent', 'Le Bon บอกว่าคนในฝูงสูญเสียเหตุผล ไม่ใช่ฉลาดขึ้น'),
      2: s('shift from a personal identity to a social identity… do not abandon their sense of self', 'replace personal identity with group-based identity', 'เปลี่ยนจากอัตลักษณ์ส่วนตัวเป็นอัตลักษณ์กลุ่ม'),
      3: s('Emergency management professionals have begun to incorporate these findings into evacuation planning', 'adopted as official UK evacuation guidelines', 'เริ่มนำไปใช้ แต่ไม่ได้บอกว่าเป็นแนวทางอย่างเป็นทางการของ UK'),
      4: s('people in crowd emergencies typically show prosocial behaviour', 'people behave cooperatively rather than selfishly', 'ช่วยเหลือและประสานงานกัน ไม่ใช่เห็นแก่ตัว'),
      5: s('Hillsborough… were not caused by panic but by crowd density exceeding safe thresholds', 'Hillsborough caused by spectators pushing forward', 'สาเหตุคือความหนาแน่น ไม่ได้กล่าวว่าแฟนดันกดไปข้างหน้า'),
      6: s('lower the threshold for aggressive and antisocial behaviours… inhibited by face-to-face social norms', 'online reduces social pressure against aggression', 'ออนไลน์ลดแรงกดดันทางสังคมที่ยับยั้งพฤติกรรมก้าวร้าว'),
      7: s('these models depend on assumptions about individual behaviour that are frequently violated in the real world', 'simulation software reliably predicts disasters', 'สมมติฐานมักผิดในความเป็นจริง — ไม่ได้ทำนายได้แม่นยำ'),
      8: s('shift from a personal identity to a social identity defined by membership in the group', 'social identity', 'อัตลักษณ์'),
      9: s('mass panic… is extremely rare', 'widespread panic', 'ความตื่นตระหนก'),
      10: s('emphasise the distinctiveness and superiority of an in-group', 'sense of group superiority', 'ความเหนือกว่าของกลุ่ม'),
      11: s('crowd density exceeding safe thresholds in constrained spaces', 'crowd density', 'ความหนาแน่นของฝูงชน'),
      12: s('targeting individuals with harassment campaigns', 'coordinated harassment', 'การคุกคาม'),
      13: s('better physical design — wider exits, better signage', 'spatial design', 'การออกแบบเชิงพื้นที่'),
      14: s('sophisticated computational models fail to predict specific events reliably', 'computational predictive models', 'แบบจำลองทางคอมพิวเตอร์')
    },
    2: {
      1: s('was considered an indifferent student… enthusiasm for collecting specimens brought him to Henslow', 'Paragraph A', 'เริ่มต้นไม่โดดเด่น แล้วหลงใหลธรรมชาติวิทยา'),
      2: s('Robert FitzRoy… mutual respect and profound intellectual disagreement', 'Paragraph B', 'การเดินทางกับ FitzRoy ที่เคารพแต่ขัดแย้ง'),
      3: s('planted a question that took years of reflection to answer', 'Paragraph C', 'Galapagos ปลูกคำถาม ไม่ได้ให้คำตอบทันที'),
      4: s('Thomas Malthus\'s essay on population… natural selection', 'Paragraph D', 'Malthus ให้ชิ้นส่วนสุดท้ายของทฤษฎี'),
      5: s('delayed publication… anxiety… Wallace\'s letter forced his hand', 'Paragraph E', 'กังวลหลายทศวรรษ จน Wallace บังคับให้เผยแพร่'),
      6: s('The debate… marked a turning point in public perception', 'Paragraph F', 'Huxley–Wilberforce เปลี่ยนภาพลักษณ์สาธารณะ'),
      7: s('continuing to publish prolifically… buried in Westminster Abbey… ranked among the greatest', 'Paragraph G', 'ช่วงท้ายชีวิตผลงานมาก และได้เกียรติยศใน Westminster'),
      8: s('his uncle Josiah Wedgwood who persuaded the elder Darwin to relent', 'family member persuaded father', 'ลุง Wedgwood ช่วยโน้มน้าวพ่อ'),
      9: s('ornithologist John Gould examined his specimens', 'Gould had worked with Darwin on Beagle', 'ไม่ได้บอกว่า Gould เคยร่วมงานกับ Darwin บน Beagle'),
      10: s('The first edition of 1,250 copies sold out on the day of publication', 'sold entire initial print run on publication day', 'พิมพ์ครั้งแรก 1,250 เล่ม หมดในวันเผยแพร่'),
      11: s('Thomas Malthus\'s essay on population in 1838', 'Malthus on population growth', 'ประชากร'),
      12: s('independently arrived at essentially the same theory', 'independently developed theory', 'ทฤษฎีที่พัฒนาโดยอิสระ'),
      13: s('buried in Westminster Abbey', 'Westminster Abbey', 'Westminster Abbey')
    }
  }
}
