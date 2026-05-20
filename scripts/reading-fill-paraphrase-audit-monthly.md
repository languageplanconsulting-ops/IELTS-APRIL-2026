# Monthly upload — fill-in-the-blank paraphrase audit

Generated: 2026-05-20T12:32:51.306Z

## Summary

| Metric | Count |
| --- | ---: |
| Monthly JSON files scanned | 31 |
| Total gap-fill / summary-completion questions | 153 |
| **Questions with paraphrase problems** | **4** |
| Critical (verbatim / answer in prompt / stem leak / ≥75% overlap) | 0 |
| Moderate (55–74% overlap with evidence) | 1 |
| Minor (only weak X=X paraphrase notes) | 3 |

### Problem types

- **verbatim_near_answer** — words before/after the blank in the summary also appear next to the answer in the passage
- **answer_stem_leak** — summary word before blank is the same stem as in passage (e.g. `genetic` → `sampling`)
- **answer_in_prompt** — correct answer already visible in the question line
- **high_overlap** — summary line copies ≥55% of words from Exact Portion before/after the gap
- **weak_paraphrase** — Paraphrased Vocabulary uses identical terms (e.g. `sea ice = sea ice`)

---

## By passage (fill count → issues)

- ⚠ **IELTS Academic Reading April 2026 Passage 1 - The Habsburg Jaw** — 1/7 fill Qs flagged (`ielts-academic-reading-april-2026-passage-1-habsburg-jaw.json`)
- ⚠ **IELTS Academic Reading April 2026 Passage 3 - What Is Restoration?** — 1/3 fill Qs flagged (`ielts-academic-reading-april-2026-passage-3-what-is-restoration.json`)
- ⚠ **IELTS Academic Reading Feb 2026 Passage 3 - The Wood Wide Web: The Myth of the Altruistic Forest** — 1/3 fill Qs flagged (`ielts-academic-reading-feb-2026-passage-3-wood-wide-web.json`)
- ⚠ **IELTS Academic Reading Jan 2026 Passage 2 - Preserving Britain's Medieval Castles** — 1/5 fill Qs flagged (`ielts-academic-reading-jan-2026-passage-2-medieval-castles.json`)
- ✓ **IELTS Academic Reading April 2024 Passage 2 - Trauma Language in Popular Culture** — 0/4 fill Qs flagged (`ielts-academic-reading-april-2024-passage-2-trauma-language-popular-culture.json`)
- ✓ **IELTS Academic Reading April 2026 Passage 1 - The Return of the Bald Eagle** — 0/7 fill Qs flagged (`ielts-academic-reading-april-2026-passage-1-bald-eagle.json`)
- ✓ **IELTS Academic Reading April 2026 Passage 1 - Polar Bears on Thinner Ice** — 0/7 fill Qs flagged (`ielts-academic-reading-april-2026-passage-1-polar-bears.json`)
- ✓ **IELTS Academic Reading April 2026 Passage 1 - Primary Education in the Age of AI** — 0/6 fill Qs flagged (`ielts-academic-reading-april-2026-passage-1-primary-education-ai.json`)
- ✓ **IELTS Academic Reading April 2026 Passage 2 - The History of the House of Windsor** — 0/6 fill Qs flagged (`ielts-academic-reading-april-2026-passage-2-house-of-windsor.json`)
- ✓ **IELTS Academic Reading April 2026 Passage 2 - The Psychology of Cancel Culture** — 0/4 fill Qs flagged (`ielts-academic-reading-april-2026-passage-2-psychology-cancel-culture.json`)
- ✓ **IELTS Academic Reading April 2026 Passage 2 - Social Media Algorithms and Polarization** — 0/4 fill Qs flagged (`ielts-academic-reading-april-2026-passage-2-social-media-algorithms-polarization.json`)
- ✓ **IELTS Academic Reading Feb 2026 Passage 1 - The Disappearance of Movie Theatres** — 0/6 fill Qs flagged (`ielts-academic-reading-feb-2026-passage-1-disappearance-of-movie-theatres.json`)
- ✓ **IELTS Academic Reading Feb 2026 Passage 1 - The Rise of Digital Nomads** — 0/6 fill Qs flagged (`ielts-academic-reading-feb-2026-passage-1-rise-of-digital-nomads.json`)
- ✓ **IELTS Academic Reading Feb 2026 Passage 1 - The Spanish Armada** — 0/7 fill Qs flagged (`ielts-academic-reading-feb-2026-passage-1-spanish-armada.json`)
- ✓ **IELTS Academic Reading Feb 2026 Passage 2 - Is ADHD Innate or Caused by Upbringing?** — 0/3 fill Qs flagged (`ielts-academic-reading-feb-2026-passage-2-adhd-innate-or-upbringing.json`)
- ✓ **IELTS Academic Reading Feb 2026 Passage 2 - Preserving the British Aristocracy** — 0/3 fill Qs flagged (`ielts-academic-reading-feb-2026-passage-2-british-aristocracy.json`)
- ✓ **IELTS Academic Reading Feb 2026 Passage 2 - Saving the Vaquita** — 0/3 fill Qs flagged (`ielts-academic-reading-feb-2026-passage-2-saving-the-vaquita.json`)
- ✓ **IELTS Academic Reading Feb 2026 Passage 3 - The Myth of the Digital Native** — 0/4 fill Qs flagged (`ielts-academic-reading-feb-2026-passage-3-myth-of-digital-native.json`)
- ✓ **IELTS Academic Reading Feb 2026 Passage 3 - The Myth of the Eight-Hour Sleep** — 0/4 fill Qs flagged (`ielts-academic-reading-feb-2026-passage-3-myth-of-eight-hour-sleep.json`)
- ✓ **IELTS Academic Reading Jan 2026 Passage 2 - Diet and Mental Health** — 0/6 fill Qs flagged (`ielts-academic-reading-jan-2026-passage-2-diet-and-mental-health.json`)
- ✓ **IELTS Academic Reading Jan 2026 Passage 2 - Music and the Brain** — 0/5 fill Qs flagged (`ielts-academic-reading-jan-2026-passage-2-music-and-brain.json`)
- ✓ **IELTS Academic Reading Jan 2026 Passage 3 - The Architecture of Forgetting** — 0/5 fill Qs flagged (`ielts-academic-reading-jan-2026-passage-3-architecture-of-forgetting.json`)
- ✓ **IELTS Academic Reading Jan 2026 Passage 3 - The Cognitive Cost of GPS: Are We Losing Our Internal Compass?** — 0/4 fill Qs flagged (`ielts-academic-reading-jan-2026-passage-3-cognitive-cost-of-gps.json`)
- ✓ **IELTS Academic Reading Jan 2026 Passage 3 - The Productive Power of Boredom** — 0/4 fill Qs flagged (`ielts-academic-reading-jan-2026-passage-3-productive-power-of-boredom.json`)
- ✓ **IELTS Academic Reading Jan 2026 Passage 3 - Urban Evolution: When Cities Become the New Galapagos** — 0/4 fill Qs flagged (`ielts-academic-reading-jan-2026-passage-3-urban-evolution.json`)
- ✓ **IELTS Academic Reading March 2026 Passage 1 - The Future of Green Architecture** — 0/6 fill Qs flagged (`ielts-academic-reading-march-2026-passage-1-future-green-architecture.json`)
- ✓ **IELTS Academic Reading March 2026 Passage 2 - Can Artists Still Create Art in the Age of AI?** — 0/6 fill Qs flagged (`ielts-academic-reading-march-2026-passage-2-artists-ai.json`)
- ✓ **IELTS Academic Reading March 2026 Passage 2 - Bringing Back Critical Thinking** — 0/6 fill Qs flagged (`ielts-academic-reading-march-2026-passage-2-critical-thinking.json`)
- ✓ **IELTS Academic Reading March 2026 Passage 2 - History Education in the Age of AI** — 0/6 fill Qs flagged (`ielts-academic-reading-march-2026-passage-2-history-education-ai.json`)
- ✓ **IELTS Academic Reading March 2026 Passage 2 - Natural Ways to Clean Water** — 0/6 fill Qs flagged (`ielts-academic-reading-march-2026-passage-2-natural-water-cleaning.json`)
- ✓ **IELTS Academic Reading March 2026 Passage 3 - What Makes a Good Archive?** — 0/3 fill Qs flagged (`ielts-academic-reading-march-2026-passage-3-good-archive.json`)

---

## MODERATE (1)


### IELTS Academic Reading Jan 2026 Passage 2 - Preserving Britain's Medieval Castles
`ielts-academic-reading-jan-2026-passage-2-medieval-castles.json`

**Q22** — answer: `subsidence` — high_overlap_after_blank_63pct

> Weakened bases may cause ground ...................., a hazard that can eventually undermine walls and towers.


---

## MINOR (3)


### IELTS Academic Reading April 2026 Passage 1 - The Habsburg Jaw
`ielts-academic-reading-april-2026-passage-1-habsburg-jaw.json`

**Q10** — answer: `relatives` — weak_paraphrase_pair:both parents=both parents

> When closely related royals reproduced, recessive traits were more likely to come from both .................... .


### IELTS Academic Reading April 2026 Passage 3 - What Is Restoration?
`ielts-academic-reading-april-2026-passage-3-what-is-restoration.json`

**Q39** — answer: `injury` — weak_paraphrase_pair:careful treatment=care

> Responsible restoration should let viewers witness both .................... and careful treatment.


### IELTS Academic Reading Feb 2026 Passage 3 - The Wood Wide Web: The Myth of the Altruistic Forest
`ielts-academic-reading-feb-2026-passage-3-wood-wide-web.json`

**Q34** — answer: `altruism` — weak_paraphrase_pair:fungal self-interest=fungal self-interest

> governed by fungal self-interest rather than plant .................... .
