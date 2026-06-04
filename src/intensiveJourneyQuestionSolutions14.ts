import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'

type StageSolutions = Record<1 | 2, Record<number, IntensiveQuestionSolution>>

const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword,
  questionKeyword,
  thaiMeaning
})

export const INTENSIVE_SOLUTIONS_STAGE_14: Record<number, StageSolutions> = {
  14: {
    1: {
      1: s('Simon Kuznets… warned the US Congress as early as 1934 that the welfare of a nation can scarcely be inferred from a measurement of national income', 'GDP creator expressed doubts in the 1930s', 'Kuznets เตือนตั้งแต่ 1934 ว่าวัดสวัสดิภาพจาก GDP ไม่ได้'),
      2: s('within a country at any given time, richer people report higher levels of happiness… but over time… average self-reported happiness does not increase', 'wealthier country always happier than poorer country', 'เปรียบในแต่ละประเทศ ไม่ใช่เปรียบข้ามประเทศเสมอไป'),
      3: s('experienced wellbeing continued to rise with income even at very high earnings levels', 'wellbeing stopped improving above 75,000 dollars', 'งานวิจัยใหม่พบว่าความเป็นอยู่ดียังเพิ่มแม้รายได้สูงมาก'),
      4: s('Social connection… is consistently the strongest predictor of happiness across cultures and age groups', 'social connection strongest predictor', 'การเชื่อมโยงทางสังคมเป็นตัวทำนายที่แข็งแกร่งที่สุด'),
      5: s('Bhutan famously introduced the concept of Gross National Happiness in the 1970s', 'UN formally adopted Bhutan measure', 'กล่าวถึงภูฏาน แต่ไม่ได้บอกว่า UN รับเป็นมาตรฐาน'),
      6: s('cultural norms… making cross-cultural comparisons unreliable', 'cultural norms make cross-cultural comparisons unreliable', 'บรรทัดฐานทางวัฒนธรรมทำให้เปรียบเทียบข้ามวัฒนธรรมไม่น่าเชื่อถือ'),
      7: s('Countries with similar levels of GDP per capita can differ substantially in their wellbeing outcomes', 'same GDP per capita identical wellbeing outcomes', 'GDP ใกล้เคียงกันแต่ผลด้านความเป็นอยู่ดีต่างกันได้มาก'),
      8: s('the primary measure of a nation\'s prosperity has been the size of its economy', 'society\'s economic prosperity', 'ความเจริญรุ่งเรือง'),
      9: s('what became known as the Easterlin paradox', 'Easterlin paradox', 'ปริปัติของ Easterlin'),
      10: s('what economists call reference income', 'reference income', 'รายได้อ้างอิง / เปรียบเทียบ'),
      11: s('Social connection — the quality and frequency of meaningful relationships', 'personal connection', 'การเชื่อมโยงส่วนตัว'),
      12: s('incorporating measures of psychological wellbeing, cultural preservation, time use, and environmental sustainability', 'alternative measures', 'มาตรวัดทางเลือก'),
      13: s('return to a baseline level of happiness after both positive and negative life events', 'happiness baseline level', 'ระดับความสุขพื้นฐาน'),
      14: s('alongside conventional economic indicators', 'supplementary economic indicators', 'ตัวชี้วัดเสริม')
    },
    2: {
      1: s('deaf people were considered incapable of being educated… denied legal rights… placed under legal guardianship', 'Paragraph A', 'ถูกตัดสิทธิทางกฎหมายเพราะเข้าใจผิดว่าเรียนไม่ได้'),
      2: s('The first systematic attempt to educate deaf children occurred in sixteenth-century Spain', 'Paragraph B', 'ความพยายามแรกในการศึกษาคนหูหนวกอย่างเป็นระบบ'),
      3: s('home signs… built upon their natural gestures… opened the world\'s first free public school for the deaf', 'Paragraph C', 'ระบบสัญญาณที่บ้านกลายเป็นหลักสูตรอย่างเป็นทางการ'),
      4: s('a fusion of French Sign Language and the home signs already used by the deaf community on Martha\'s Vineyard', 'Paragraph D', 'ผสานภาษามือฝรั่งเศสกับสัญญาณในชุมชน'),
      5: s('sign language was banned in most schools… Milan resolution… most damaging decisions', 'Paragraph E', 'มติมิลานทำให้ภาษามือถูกห้ามหลายทศวรรษ'),
      6: s('an American linguist published research… initially met with hostility… findings were replicated and expanded', 'Paragraph F', 'นักภาษาศาสตร์คนเดียวพลิกความเชื่อของวงการ'),
      7: s('New Zealand… Several European nations… British Sign Language was granted official recognition in 2022', 'Paragraph G', 'หลายประเทศให้การยอมรับภาษามืออย่างเป็นทางการ'),
      8: s('Rather than attempting to replace their existing system… built upon their natural gestures', 'de l\'Épée replaced sisters\' signing system', 'ไม่ได้แทนที่ แต่ต่อยอดจากสัญญาณเดิม'),
      9: s('British oral educators, who refused to share their techniques. He then studied under Laurent Clerc', 'British refused before French-trained teacher', 'อังกฤษปฏิเสธก่อนไปเรียนกับ Clerc'),
      10: s('the Milan resolution is now widely regarded by deaf historians as one of the most damaging decisions', 'resolution formally reversed by later conference', 'ไม่ได้บอกว่ามีการยกเลิกมติอย่างเป็นทางการ'),
      11: s('denied legal rights on the grounds that they could not participate in verbal contracts', 'fundamental rights', 'สิทธิทางกฎหมาย'),
      12: s('the Milan resolution is now widely regarded by deaf historians', '1880 resolution passed in Milan', 'มติมิลาน'),
      13: s('a complete, independent language with its own phonology, morphology, and syntax', 'independent language', 'ภาษาอิสระที่สมบูรณ์')
    }
  }
}
