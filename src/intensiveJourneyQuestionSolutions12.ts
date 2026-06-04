import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'

type StageSolutions = Record<1 | 2, Record<number, IntensiveQuestionSolution>>

const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword,
  questionKeyword,
  thaiMeaning
})

export const INTENSIVE_SOLUTIONS_STAGE_12: Record<number, StageSolutions> = {
  12: {
    1: {
      1: s('Penicillin, he said, could be misused… causing bacteria to develop resistance', 'Fleming predicted resistance if penicillin misused', 'Fleming เตือนว่าถ้าใช้ผิด แบคทีเรียจะดื้อยา'),
      2: s('bacteria share resistance genes… with unrelated bacterial species', 'bacteria transfer genes to unrelated species', 'แบคทีเรียถ่ายโอนยีนให้สายพันธุ์ที่ไม่เกี่ยวข้อง'),
      3: s('The World Health Organization has identified the inappropriate use of antibiotics as the leading cause', 'WHO classified resistance as greater threat than climate change', 'ไม่ได้เปรียบเทียบกับ climate change'),
      4: s('resistance rates for some organisms have declined as a result', 'EU ban followed by some improvement in resistance rates', 'อัตราดื้อยาบางชนิดลดลงหลัง EU ห้าม'),
      5: s('The last major new class of antibiotics — lipopeptides — was approved in 2003', 'no new class since early 2000s', 'ไม่มี class ใหม่ตั้งแต่ปี 2003'),
      6: s('none has yet achieved regulatory approval for routine use', 'phage therapy already approved for routine use', 'ยังไม่มี phage therapy ที่อนุมัติใช้ประจำ'),
      7: s('Resistant bacteria from livestock can transfer to humans through direct contact, through the food supply, or through environmental contamination', 'South America livestock genes found in European patients', 'บอกเส้นทางทั่วไป ไม่ได้ยกตัวอย่าง South America–Europe'),
      8: s('natural selection operating at extraordinary speed', 'evolutionary selection process', 'การคัดเลือกโดยธรรมชาติ'),
      9: s('by producing enzymes that break down the drug', 'drug-dismantling enzymes', 'เอนไซม์'),
      10: s('bacteria share resistance genes not only with their own offspring but with unrelated bacterial species', 'resistance genes', 'ยีนดื้อยา'),
      11: s('antibiotics are prescribed for viral infections — colds, influenza, and most sore throats', 'infections of viral origin', 'การติดเชื้อไวรัส'),
      12: s('antibiotics as growth promoters', 'growth acceleration', 'สารเร่งการเจริญเติบโต'),
      13: s('Antibiotic stewardship programmes', 'formal prescribing programmes', 'โปรแกรมจัดการใช้ยา'),
      14: s('viruses that target specific bacteria are used to treat infections', 'viruses used against bacteria (phage therapy)', 'ไวรัส (phage therapy)')
    },
    2: {
      1: s('They were held every four years in honour of Zeus… sacred truce… suspended armed conflict', 'Paragraph A', 'เกมโบราณที่เกี่ยวกับศาสนาและสันติภาพ'),
      2: s('The ancient games included a range of athletic competitions that evolved over the centuries', 'Paragraph B', 'รายการแข่งขันที่หลากหลายขึ้นตามกาลเวลา'),
      3: s('physical education had been neglected in French schools following France\'s defeat in the Franco-Prussian War', 'Paragraph C', 'วิสัยทัศน์จากการศึกษาและชาตินิยมฝรั่งเศส'),
      4: s('whose victory… generated enormous national celebration / Athens petitioned… de Coubertin resisted', 'Paragraph D', 'ชัยชนะของชาวกรีกและอนาคตที่ถกเถียง'),
      5: s('Women\'s participation… developed slowly and against persistent resistance… marathon until 1984', 'Paragraph E', 'เส้นทางยาวนานสู่การมีส่วนร่วมของผู้หญิง'),
      6: s('boycotted by sixty-five nations… massacre of eleven Israeli athletes and coaches', 'Paragraph F', 'การคว่ำบาตรและความรุนแรง'),
      7: s('revenue from broadcasting rights… corporate sponsors… infrastructure costs', 'Paragraph G', 'รายได้ สปอนเซอร์ และภาระของเมืองเจ้าภาพ'),
      8: s('The prize went to the owner of the winning horse or chariot rather than to the rider or driver', 'horse owner received prize not rider', 'เจ้าของม้าได้รางวัล ไม่ใช่คนขี่'),
      9: s('throughout his tenure as IOC president / it was not until 1928 that women were permitted to compete in athletics events', 'Coubertin still IOC president in 1928', 'ไม่ได้ระบุว่า Coubertin ยังเป็นประธานในปี 1928'),
      10: s('faced a boycott but also became the first Games to generate a substantial surplus', '1984 LA Games surplus despite boycott', 'Los Angeles 1984 ทำกำไรแม้ถูก boycott'),
      11: s('a broader cycle of Panhellenic games', 'Greek athletic games', 'การแข่งขันทั่วกรีก'),
      12: s('The International Olympic Committee was established at that conference', 'administrative committee', 'คณะกรรมการโอลิมปิกสากล'),
      13: s('infrastructure costs that frequently exceed initial estimates', 'infrastructure building costs', 'ค่าใช้จ่ายโครงสร้างพื้นฐาน')
    }
  }
}
