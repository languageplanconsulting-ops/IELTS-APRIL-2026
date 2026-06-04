import type { IntensiveQuestionSolution } from './intensiveJourneyQuestionSolutions.ts'

type StageSolutions = Record<1 | 2, Record<number, IntensiveQuestionSolution>>

const s = (passageKeyword: string, questionKeyword: string, thaiMeaning: string): IntensiveQuestionSolution => ({
  passageKeyword,
  questionKeyword,
  thaiMeaning
})

export const INTENSIVE_SOLUTIONS_STAGE_11: Record<number, StageSolutions> = {
  11: {
    1: {
      1: s('accounts for only about 5% of the total mass and energy', 'visible matter makes up less than a tenth', '5% น้อยกว่าหนึ่งในสิบ — ตรงกับข้อความ'),
      2: s('His calculations were largely ignored for several decades', 'Zwicky widely accepted when first published', 'ถูกมองข้ามหลายทศวรรษ ไม่ใช่ได้รับการยอมรับ'),
      3: s('Swiss astronomer Fritz Zwicky / American astronomer Vera Rubin', 'Rubin worked at same institution as Zwicky', 'บอกแค่สัญชาติ ไม่ได้กล่าวสถาบันเดียวกัน'),
      4: s('would not have formed in its observed form without the gravitational scaffolding provided by dark matter during the early universe', 'large-scale structure would not develop without invisible mass', 'โครงสร้างใหญ่ต้องมีสสารมืดค้ำยัน — ตรงกับข้อความ'),
      5: s('so far without confirmed detection', 'WIMP experiments produced confirmed evidence', 'ยังไม่มีการตรวจพบที่ยืนยันแล้ว'),
      6: s('MOND struggles to explain the cosmic microwave background data, the large-scale structure of the universe, and the Bullet Cluster', 'MOND accounts for light bending around clusters', 'ไม่ได้กล่าวว่า MOND อธิบายการโค้งของแสงได้'),
      7: s('increasingly sensitive experiments that find nothing', 'increasingly sophisticated experiments without results', 'ทดลองไวขึ้นแต่ไม่พบผล — ตรงกับข้อความ'),
      8: s('dark matter, which exerts gravitational effects on visible matter', 'hidden type of matter (dark matter)', 'สสารมืด'),
      9: s('galaxies within the Coma cluster', 'galaxy cluster', 'กลุ่มกาแล็กซี Coma'),
      10: s('the rotation curves of spiral galaxies', 'orbital speed curves', 'กราฟความเร็วหมุน'),
      11: s('light from distant galaxies is bent by the gravity of intervening matter', 'gravity bends light', 'แรงโน้มถ่วงโค้งแสง'),
      12: s('a class of hypothetical particles called Weakly Interacting Massive Particles', 'hypothetical particles', 'อนุภาคสมมติ (WIMPs)'),
      13: s('than standard Newtonian physics predicts', 'laws of physics', 'ฟิสิกส์แบบนิวตัน'),
      14: s('the Bullet Cluster, a collision of two galaxy clusters', 'Bullet Cluster', 'กลุ่ม Bullet')
    },
    2: {
      1: s('The shop also gave them a practical insight that would prove decisive: the importance of three-axis control', 'Paragraph A', 'ทักษะจากร้านจักรยานนำไปสู่ insight สำคัญ'),
      2: s('Langley\'s full-scale Aerodrome failed twice in public and expensive fashion in late 1903', 'Paragraph B', 'Langley ล้มเหลวต่อหน้าสาธารณะ — คู่แข่งที่ได้ทุนมากกว่า'),
      3: s('They studied the soaring of birds — particularly buzzards — and observed that birds controlled their roll', 'Paragraph C', 'เรียนรู้การควบคุมจากนก'),
      4: s('The four witnesses beyond the brothers themselves were members of a local lifesaving station. No journalists were present', 'Paragraph D', 'บินสำเร็จแต่แทบไม่มีคนเห็น'),
      5: s('This reticence led many observers to dismiss their claims as exaggerated or fraudulent', 'Paragraph E', 'เก็บงานเป็นความลับ ถูกสงสัยจนได้รับการยอมรับช้า'),
      6: s('The litigation consumed enormous resources on both sides, retarded the development of the American aviation industry', 'Paragraph F', 'ฟ้องร้องเรื่องสิทธิบัตรทำลายอุตสาหกรรมการบิน'),
      7: s('Orville lived until 1948… to reflect publicly on the ambivalence he felt about the invention', 'Paragraph G', 'Orville มีชีวิตยาวและเห็นผลกระทบทั้งบวกและลบ'),
      8: s('a hockey injury left him physically and psychologically incapacitated', 'university plan prevented by sports injury', 'บาดเจ็บจากฮอกกี้ทำให้ไป Yale ไม่ได้'),
      9: s('the flight duration for the longest flight was incorrectly given as 57 seconds', 'telegram contained duration error', 'โทรเลขบอกเวลาบินผิด — ตรงกับข้อความ'),
      10: s('to reflect publicly on the ambivalence he felt about the invention', 'Orville expressed regret about inventing flight', 'ambivalence คือความรู้สึกผสม ไม่ได้บอกว่าเสียใจ'),
      11: s('the importance of three-axis control in managing a moving vehicle', 'three-axis control', 'การควบคุมสามแกน'),
      12: s('dismiss their claims as exaggerated or fraudulent', 'public claims of achievement', 'คำกล่าวอ้าง'),
      13: s('until they had secured patent protection and a commercial contract', 'patent claims', 'สิทธิบัตร')
    }
  }
}
