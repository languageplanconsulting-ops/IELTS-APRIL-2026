/** Hand-tuned enrichments: Test 4 full set + targeted fixes for Tests 1–3 */
import { CAMBRIDGE_19_TEST4_ENRICHMENTS } from './cambridge-19-test4-enrichments.mjs'

const EXTRA_HAND = {
  '1-1-6': {
    exact:
      'They will continually change it depending on various factors including the court surface, climatic conditions, and game styles',
    thai: 'บทความบอกว่านักเทนนิสปรับความตึงสายและปัจจัยอื่นตามสภาพ เช่น court surface และ climatic conditions ซึ่งสอดคล้องกับข้อที่ว่าสภาพอากาศมีผล จึงตอบ TRUE',
    para: 'weather affect = climatic conditions|court surface = สภาพอากาศ/สนาม',
    exactHints: 'climatic conditions|court surface|weather'
  },
  '1-2-18': {
    exact:
      'as a long-term solution to the problem, many more were offered land in fertile areas located far from the sea',
    thai: 'ย่อหน้า G บอกว่าโจรสลัดหลายคนได้รับที่ดินแทนการกลับไปเป็นโจรสลัด สอดคล้องกับการชักจูงไม่ให้กลับไปโจมตี จึงตอบ G',
    para: 'encouraged not to return = offered land in fertile areas = ได้ที่ดินแทนการกลับไปเป็นโจรสลัด',
    exactHints: 'offered land|fertile areas|long-term solution'
  }
}

export const CAMBRIDGE_19_HAND_ENRICHMENTS = {
  ...EXTRA_HAND,
  ...CAMBRIDGE_19_TEST4_ENRICHMENTS
}
