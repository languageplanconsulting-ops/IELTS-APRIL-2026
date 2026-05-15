export type ListeningFoundationCategory = 'essential' | 'advanced'

export type ListeningFoundationQuestion = {
  id: string
  number: number
  section: number
  question: string
  passage: string
  evidence: string
  correctAnswer: string
  options: Array<{ key: string; text: string }>
  passageKeyword: string
  questionKeyword: string
  thaiMeaning: string
  explanationThai: string
}

export type ListeningFoundationSet = {
  id: string
  category: ListeningFoundationCategory
  title: string
  section: number
  levelLabel: string
  audioUrl?: string
  questions: ListeningFoundationQuestion[]
}

const q = (
  section: number,
  number: number,
  question: string,
  passage: string,
  evidence: string,
  correctAnswer: string,
  options: Array<{ key: string; text: string }>,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id: `foundation-s${section}-q${number}-${question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 36)}`,
  number,
  section,
  question,
  passage,
  evidence,
  correctAnswer,
  options,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai
})

const CAM10_TEST3_SECTION2_SCRIPT = `INTERVIEWER: Today we’re pleased to have on the show Alice Bussell from the Dolphin Conservation Trust. Tell us about the Trust, Alice.
ALICE: Well, obviously its purpose is to protect dolphins in seas all around the world. It tries to raise people’s awareness of the problems these marine creatures are suffering because of pollution and other threats. It started ten years ago and it’s one of the fastest growing animal charities in the country – although it’s still fairly small compared with the big players in animal protection. We are particularly proud of the work we do in education – last year we visited a huge number of schools in different parts of the country, going round to talk to children and young people aged from five to eighteen. In fact, about thirty-five per cent of our members are children. The charity uses its money to support campaigns – for example, for changes in fishing policy and so forth. It hopes soon to be able to employ its first full-time biologist – with dolphin expertise – to monitor populations. Of course, many people give their services on a voluntary basis and we now have volunteers working in observation, office work and other things.
I should also tell you about the award we won from the Charity Commission last year – for our work in education. Although it’s not meant an enormous amount of money for us, it has made our activities even more widely publicised and understood. In the long term it may not bring in extra members but we’re hoping it’ll have this effect.
INTERVIEWER: Is it possible to see dolphins in UK waters?
ALICE: Yes. In several locations. And we have a big project in the east part of Scotland. This has long been a haven for dolphins because it has very little shipping. However, that may be about to change soon because oil companies want to increase exploration there. We’re campaigning against this because, although there’ll be little pollution from oil, exploration creates a lot of underwater noise. It means the dolphins can’t rest and socialise.
This is how I became interested in dolphin conservation in the first place. I had never seen one and I hadn’t been particularly interested in them at school. Then I came across this story about a family of dolphins who had to leave their home in the Moray Firth because of the oil companies and about a child who campaigned to save them. I couldn’t put the book down – I was hooked.
INTERVIEWER: I’m sure our listeners will want to find out what they can do to help. You mentioned the ‘Adopt a Dolphin’ scheme. Can you tell us about that?
ALICE: Of course! People can choose one of our dolphins to sponsor. They receive a picture of it and news updates. I’d like to tell you about four which are currently being adopted by our members: Moondancer, Echo, Kiwi and Samson. Unfortunately, Echo is being rather elusive this year and hasn’t yet been sighted by our observers but we remain optimistic that he’ll be out there soon. All the others have been out in force – Samson and Moondancer are often photographed together but it is Kiwi who’s our real ‘character’ as she seems to love coming up close for the cameras and we’ve captured her on film hundreds of times. They all have their own personalities – Moondancer is very elegant and curves out and into the water very smoothly, whereas Samson has a lot of energy – he’s always leaping out of the water with great vigour. You’d probably expect him to be the youngest – he’s not quite – that’s Kiwi – but Samson’s the latest of our dolphins to be chosen for the scheme. Kiwi makes a lot of noise so we can often pick her out straightaway. Echo and Moondancer are noisy too, but Moondancer’s easy to find because she has a particularly large fin on her back, which makes her easy to identify. So, yes, they’re all very different …
INTERVIEWER: Well, they sound a fascinating group …`

const CAM10_TEST3_SECTION3_SCRIPT = `MIA: Hi, Rob. How’s the course going?
ROB: Oh, hi, Mia. Yeah, great. I can’t believe the first term’s nearly over.
MIA: I saw your group’s performance last night at the student theatre. It was good.
ROB: Really? Yeah … but now we have to write a report on the whole thing, an in-depth analysis. I don’t know where to start. Like, I have to write about the role I played, the doctor, how I developed the character.
MIA: Well, what was your starting point?
ROB: Er … my grandfather was a doctor before he retired, and I just based it on him.
MIA: OK, but how? Did you talk to him about it?
ROB: He must have all sorts of stories, but he never says much about his work, even now. He has a sort of authority though.
MIA: So how did you manage to capture that?
ROB: I’d … I’d visualise what he must have been like in the past, when he was sitting in his consulting room listening to his patients.
MIA: OK, so that’s what you explain in your report.
ROB: Right.
MIA: Then there’s the issue of atmosphere – so in the first scene we needed to know how boring life was in the doctor’s village in the 1950s, so when the curtain went up on the first scene in the waiting room, there was that long silence before anyone spoke. And then people kept saying the same thing over and over, like ‘Cold, isn’t it?’
ROB: Yes, and everyone wore grey and brown, and just sat in a row.
MIA: Yes, all those details of the production.
ROB: And I have to analyse how I functioned in the group – what I found out about myself. I know I was so frustrated at times, when we couldn’t agree.
MIA: Yes. So did one person emerge as the leader?
ROB: Sophia did. That was OK – she helped us work out exactly what to do, for the production. And that made me feel better, I suppose.
MIA: When you understood what needed doing?
ROB: Yes. And Sophia did some research, too. That was useful in developing our approach.
MIA: Like what?
ROB: Well, she found these articles from the 1950s about how relationships between children and their parents, or between the public and people like bank managers or the police were shifting.
MIA: Interesting. And did you have any practical problems to overcome?
ROB: Well, in the final rehearsal everything was going fine until the last scene – what’s where the doctor’s first patient appears on stage on his own.
MIA: The one in the wheelchair?
ROB: Yes, and he had this really long speech, with the stage all dark except for one spotlight – and then that stuck somehow so it was shining on the wrong side of the stage … but anyway we got that fixed, thank goodness.
MIA: Yes, it was fine on the night.
ROB: But while you’re here, Mia. I wanted to ask you about the year abroad option. Would you recommend doing that?
MIA: Yes, definitely. It’s a fantastic chance to study in another country for a year.
ROB: I think I’d like to do it, but it looks very competitive – there’s only a limited number of places.
MIA: Yes, so next year when you are in the second year of the course, you need to work really hard in all your theatre studies modules. Only students with good marks get places – you have to prove that you know your subject really well.
ROB: Right. So how did you choose where to go?
MIA: Well, I decided I wanted a programme that would fit in with what I wanted to do after I graduate, so I looked for a university with emphasis on acting rather than directing for example. It depends on you. Then about six months before you go, you have to email the scheme coordinator with your top three choices. I had a friend who missed the deadline and didn’t get her first choice, so you do need to get a move on at that stage. You’ll find that certain places are very popular with everyone.
ROB: And don’t you have to write a personal statement at that stage?
MIA: Yes.
ROB: Right. I’ll get some of the final year students to give me some tips … maybe see if I can read what they wrote.
MIA: I think that’s a very good idea. I don’t mind showing you what I did. And while you’re abroad don’t make the mistake I made. I got so involved I forgot all about making arrangements for when I came back here for the final year. Make sure you stay in touch so they know your choices for the optional modules. You don’t want to miss out doing your preferred specialisms.
ROB: Right.`

const CAM10_TEST3_SECTION4_SCRIPT = `Today, I want to talk about self-regulatory focus theory and how the actions of leaders can affect the way followers approach different situations. Self-regulatory focus theory is a theory developed by Tori Higgins. He says that a person’s focus at any given time is to either approach pleasure or avoid pain. These are two basic motivations that each and every one of us has, and they cause us to have different kinds of goals. Promotion goals in different life situations emphasise achievement. Prevention goals are oriented towards the avoidance of punishment.
In a specific situation, our thoughts might focus more on promotion goals or more on prevention goals. The theory suggests that two factors affect which goals we are focusing on. First, there is a chronic factor. This factor is connected to a person’s personality and says that each person has a basic tendency to either focus more on promotion goals or focus more on prevention goals as part of his or her personality. Second, there is a situational factor which means that the context we are in can make us more likely to focus on one set of goals or the other. For example, we are more likely to be thinking about pleasure and to have promotion goals when we are spending time with a friend. In contrast, if we are working on an important project for our boss, we are more likely to try to avoid making mistakes and therefore have more prevention goals in our mind.
Research has shown that the goals we are focusing on at a given time affect the way we think. For example, when focusing on promotion goals, people consider their ideal self, their aspirations and gains. They don’t think about what they can lose, so they think in a happier mode. They feel more inspired to change.
When people are focusing on prevention goals, they think about their “ought” self. What are they supposed to be? What are people expecting from them? They consider their obligations to others. As a result, they experience more anxiety and try to avoid situations where they could lose.
Now that I have talked about the two focuses and how they affect people, I want to look at the idea that the way leaders behave, or their style of leading, can affect the focus that followers adopt in a specific situation. In talking about leadership, we often mention transformational leaders and transactional leaders. Transformational leaders, when interacting with their followers, focus on their development. In their words and actions transformational leaders highlight change. Their speech is passionate and conveys a definitive vision. All of these things can encourage followers to think about what could be. In other words, they inspire a promotion focus in their followers.
In contrast, transactional leaders focus on developing clear structures that tell their followers exactly what is expected of them. While they do explain the rewards people will get for following orders, they emphasise more how a follower will be punished or that a follower won’t get rewarded if his or her behaviour doesn’t change. In short, they emphasise the consequences of making a mistake. This emphasis will clearly lead followers to focus on avoiding punishment and problems. This is clearly a prevention focus.
In conclusion, it is important to understand that one focus is not necessarily better than the other one. For a designer who works in a field where a lot of innovation is needed, a promotion focus is probably better. In contrast, a prevention focus which causes people to work more cautiously and produce higher quality work might be very appropriate for a job like a surgeon, for example. The main point of the research, though, is that the actions of leaders can greatly influence whether people approach a situation with more of a promotion focus or more of a prevention focus.`

export const LISTENING_FOUNDATION_SETS: ListeningFoundationSet[] = [
  {
    id: 'foundation-essential-section-2-leisure-club',
    category: 'essential',
    title: 'Section 2 - Joining the Leisure Club',
    section: 2,
    levelLabel: 'Essential · below Band 6',
    questions: [
      q(2, 11, 'Which facility at the leisure club has recently been improved?', 'Our greatest asset is probably our swimming pool which at 25 metres is not Olympic-sized, but now we have expanded it to eight lanes, it is much wider.', 'we have expanded it to eight lanes', 'C', [{ key: 'A', text: 'the gym' }, { key: 'B', text: 'the tracks' }, { key: 'C', text: 'the indoor pool' }, { key: 'D', text: 'the outdoor pool' }], 'expanded it to eight lanes', 'recently been improved', 'ถูกปรับปรุง / ขยายให้ดีขึ้น', 'The indoor swimming pool was improved because it was expanded to eight lanes.'),
      q(2, 12, 'Which other facility has recently been improved?', 'Our recently refurbished fitness suite has all the latest exercise equipment including ten new running machines, and a wide range of weight-training machines.', 'recently refurbished fitness suite', 'A', [{ key: 'A', text: 'the gym' }, { key: 'B', text: 'the tracks' }, { key: 'C', text: 'the indoor pool' }, { key: 'E', text: 'the sports training for children' }], 'refurbished fitness suite', 'recently been improved', 'ห้องฟิตเนสที่ได้รับการปรับปรุงใหม่', 'Fitness suite is another way to say gym, and refurbished means improved.'),
      q(2, 13, 'New members should describe any _____.', 'You are asked to fill in a questionnaire giving details of any health problems. One of our personal trainers will then go through this with you.', 'details of any health problems', 'B', [{ key: 'A', text: 'sports injuries' }, { key: 'B', text: 'health problems' }, { key: 'C', text: 'training goals' }, { key: 'D', text: 'work commitments' }], 'health problems', 'describe any', 'ปัญหาสุขภาพ', 'Giving details of health problems means describing any health problems.'),
      q(2, 14, 'The _____ will be explained before you use the equipment.', 'The trainer will then take you through the safety rules for using the equipment in the fitness suite.', 'safety rules for using the equipment', 'A', [{ key: 'A', text: 'safety rules' }, { key: 'B', text: 'monthly fees' }, { key: 'C', text: 'exercise plan' }, { key: 'D', text: 'booking system' }], 'take you through', 'will be explained', 'อธิบายให้เข้าใจ', 'Take you through means explain step by step.'),
      q(2, 15, 'You will be given a six-week _____.', 'At the end of the personal assessment, the trainer will draw up a plan, outlining what you should try to achieve within a six-week period.', 'draw up a plan', 'C', [{ key: 'A', text: 'assessment' }, { key: 'B', text: 'questionnaire' }, { key: 'C', text: 'plan' }, { key: 'D', text: 'membership' }], 'draw up a plan', 'given a plan', 'จัดทำแผนให้', 'Draw up a plan means create or prepare a plan.'),
      q(2, 16, 'There is a compulsory 90 pound _____ fee.', 'All members must pay a joining fee of ninety pounds in addition to the rates for the monthly membership fees.', 'joining fee of ninety pounds', 'D', [{ key: 'A', text: 'monthly' }, { key: 'B', text: 'booking' }, { key: 'C', text: 'guest' }, { key: 'D', text: 'joining' }], 'must pay', 'compulsory fee', 'ค่าธรรมเนียมบังคับ', 'Must pay shows the fee is compulsory.'),
      q(2, 17, 'Gold members are given _____ to all LP clubs.', 'Gold membership entitles you to free entry at all LP Clubs.', 'free entry at all LP Clubs', 'A', [{ key: 'A', text: 'free entry' }, { key: 'B', text: 'priority booking' }, { key: 'C', text: 'guest passes' }, { key: 'D', text: 'robes' }], 'entitles you to', 'are given', 'ได้รับสิทธิ์', 'Entitles you to means gives you the right to have something.'),
      q(2, 18, 'Premier members are given priority during _____ hours.', 'LP gives booking preferences to Premier members at peak times.', 'booking preferences to Premier members at peak times', 'C', [{ key: 'A', text: 'adult-only' }, { key: 'B', text: 'weekend' }, { key: 'C', text: 'peak' }, { key: 'D', text: 'monthly' }], 'peak times', 'priority hours', 'ช่วงเวลาที่คนใช้บริการมาก', 'Peak times are the busy hours, and booking preferences means priority.'),
      q(2, 19, 'Premier members can bring some _____ every month.', 'Premier membership is for individuals only, but you will be sent passes for guests every month.', 'passes for guests every month', 'B', [{ key: 'A', text: 'partners' }, { key: 'B', text: 'guests' }, { key: 'C', text: 'children' }, { key: 'D', text: 'trainers' }], 'guests', 'bring some guests', 'แขก / ผู้ติดตาม', 'Passes for guests means members can bring guests.'),
      q(2, 20, 'Members should always take their _____ with them.', 'It is very important to remember your photo card because you will not be able to get in without it.', 'remember your photo card', 'D', [{ key: 'A', text: 'robe' }, { key: 'B', text: 'hairdryer' }, { key: 'C', text: 'questionnaire' }, { key: 'D', text: 'photo card' }], 'remember your photo card', 'always take', 'บัตรที่มีรูปถ่าย', 'Remember your photo card means always take it with you.')
    ]
  },
  {
    id: 'foundation-essential-section-2-dolphin-trust-skill-drill',
    category: 'essential',
    title: 'Section 2 - Dolphin Conservation Trust Skill Drill',
    section: 2,
    levelLabel: 'Essential · Cam 10 Test 3 style',
    audioUrl: 'https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam10-Test3-Section2.mp3',
    questions: [
      q(2, 11, 'Which statement about the Dolphin Conservation Trust is correct?', CAM10_TEST3_SECTION2_SCRIPT, 'Of course, many people give their services on a voluntary basis and we now have volunteers working in observation, office work and other things.', 'E', [{ key: 'A', text: 'children make up most members' }, { key: 'B', text: 'it is the largest conservation group' }, { key: 'C', text: 'it pays for fishing campaigns' }, { key: 'E', text: 'volunteers help in various ways' }], 'give their services on a voluntary basis', 'volunteers help', 'อาสาสมัครช่วยเหลือ', 'Give their services on a voluntary basis means volunteers help.'),
      q(2, 12, 'Which other statement about the Trust is correct?', CAM10_TEST3_SECTION2_SCRIPT, 'The charity uses its money to support campaigns – for example, for changes in fishing policy and so forth.', 'C', [{ key: 'A', text: 'children make up most members' }, { key: 'B', text: 'it is the largest conservation group' }, { key: 'C', text: 'it helps finance campaigns for changes in fishing practices' }, { key: 'D', text: 'it employs several dolphin experts full-time' }], 'uses its money to support campaigns', 'helps finance campaigns', 'สนับสนุนเงินทุนสำหรับการรณรงค์', 'Uses its money to support campaigns means helps finance campaigns.'),
      q(2, 13, 'Why was the award useful for the Trust?', CAM10_TEST3_SECTION2_SCRIPT, 'it has made our activities even more widely publicised and understood', 'B', [{ key: 'A', text: 'it brought in extra money' }, { key: 'B', text: 'it made the work of the trust better known' }, { key: 'C', text: 'it attracted more members' }], 'more widely publicised and understood', 'better known', 'เป็นที่รู้จักอย่างกว้างขวางมากขึ้น', 'More widely publicised and understood means better known.'),
      q(2, 14, 'Why does oil exploration create problems for dolphins?', CAM10_TEST3_SECTION2_SCRIPT, 'exploration creates a lot of underwater noise', 'A', [{ key: 'A', text: 'noise' }, { key: 'B', text: 'oil leaks' }, { key: 'C', text: 'movement of ships' }], 'underwater noise', 'noise', 'เสียงรบกวนใต้น้ำ', 'Underwater noise is the problem caused by exploration.'),
      q(2, 15, 'How did Alice first become interested in dolphins?', CAM10_TEST3_SECTION2_SCRIPT, 'Then I came across this story about a family of dolphins who had to leave their home in the Moray Firth because of the oil companies and about a child who campaigned to save them. I couldn’t put the book down – I was hooked.', 'C', [{ key: 'A', text: 'she saw one near her home' }, { key: 'B', text: 'she heard a speaker at school' }, { key: 'C', text: 'she read a book about them' }], 'came across this story / couldn’t put the book down', 'read a book', 'อ่านหนังสือ', 'Came across this story and could not put the book down means she read a book.'),
      q(2, 16, 'Which dolphin has not been seen this year?', CAM10_TEST3_SECTION2_SCRIPT, 'Echo is being rather elusive this year and hasn’t yet been sighted by our observers', 'B', [{ key: 'A', text: 'Moondancer' }, { key: 'B', text: 'Echo' }, { key: 'C', text: 'Kiwi' }, { key: 'D', text: 'Samson' }], 'hasn’t yet been sighted', 'has not been seen', 'ยังไม่ถูกพบเห็น', 'Has not been sighted means has not been seen.'),
      q(2, 17, 'Which dolphin is photographed more than the others?', CAM10_TEST3_SECTION2_SCRIPT, 'it is Kiwi who’s our real ‘character’ as she seems to love coming up close for the cameras and we’ve captured her on film hundreds of times', 'C', [{ key: 'A', text: 'Moondancer' }, { key: 'B', text: 'Echo' }, { key: 'C', text: 'Kiwi' }, { key: 'D', text: 'Samson' }], 'captured her on film', 'photographed', 'ถูกถ่ายภาพ', 'Captured on film means photographed.'),
      q(2, 18, 'Which dolphin is always very energetic?', CAM10_TEST3_SECTION2_SCRIPT, 'Samson has a lot of energy – he’s always leaping out of the water with great vigour', 'D', [{ key: 'A', text: 'Moondancer' }, { key: 'B', text: 'Echo' }, { key: 'C', text: 'Kiwi' }, { key: 'D', text: 'Samson' }], 'has a lot of energy / great vigour', 'very energetic', 'มีพลังงานมาก / กระตือรือร้น', 'Has a lot of energy and great vigour means very energetic.'),
      q(2, 19, 'Which dolphin is the newest one in the scheme?', CAM10_TEST3_SECTION2_SCRIPT, 'Samson’s the latest of our dolphins to be chosen for the scheme', 'D', [{ key: 'A', text: 'Moondancer' }, { key: 'B', text: 'Echo' }, { key: 'C', text: 'Kiwi' }, { key: 'D', text: 'Samson' }], 'latest ... to be chosen', 'newest', 'ใหม่ล่าสุด', 'Latest to be chosen means newest in the scheme.'),
      q(2, 20, 'Which dolphin has an unusual shape?', CAM10_TEST3_SECTION2_SCRIPT, 'Moondancer’s easy to find because she has a particularly large fin on her back, which makes her easy to identify', 'A', [{ key: 'A', text: 'Moondancer' }, { key: 'B', text: 'Echo' }, { key: 'C', text: 'Kiwi' }, { key: 'D', text: 'Samson' }], 'large fin on her back', 'unusual shape', 'รูปทรงที่ผิดแปลก', 'A particularly large fin gives Moondancer an unusual shape.')
    ]
  },
  {
    id: 'foundation-advanced-section-3-theatre-studies-skill-drill',
    category: 'advanced',
    title: 'Section 3 - Theatre Studies Course Skill Drill',
    section: 3,
    levelLabel: 'Advanced · Cam 10 Test 3 style',
    audioUrl: 'https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam10-Test3-Section3.mp3',
    questions: [
      q(3, 21, 'What helped Rob prepare to play the character of a doctor?', CAM10_TEST3_SECTION3_SCRIPT, 'I’d … I’d visualise what he must have been like in the past, when he was sitting in his consulting room listening to his patients.', 'C', [{ key: 'A', text: 'the stories his grandfather told him' }, { key: 'B', text: 'the times when he watched his grandfather working' }, { key: 'C', text: 'the way he imagined his grandfather at work' }], 'visualise', 'imagined', 'จินตนาการ / นึกภาพ', 'Visualise means imagine.'),
      q(3, 22, 'In the play’s first scene, the boredom of village life was suggested by _____.', CAM10_TEST3_SECTION3_SCRIPT, 'people kept saying the same thing over and over, like ‘Cold, isn’t it?’', 'A', [{ key: 'A', text: 'repetition of words and phrases' }, { key: 'B', text: 'scenery painted in dull colours' }, { key: 'C', text: 'long pauses within conversations' }], 'saying the same thing over and over', 'repetition of words and phrases', 'การพูดคำและวลีซ้ำไปซ้ำมา', 'Saying the same thing over and over means repetition.'),
      q(3, 23, 'What has Rob learned about himself through working in a group?', CAM10_TEST3_SECTION3_SCRIPT, 'she helped us work out exactly what to do, for the production. And that made me feel better, I suppose.', 'A', [{ key: 'A', text: 'He likes to have clear guidelines' }, { key: 'B', text: 'He copes well with stress' }, { key: 'C', text: 'He thinks he is a good leader' }], 'work out exactly what to do', 'clear guidelines', 'มีแนวทางปฏิบัติที่ชัดเจน', 'Knowing exactly what to do gives clear guidelines.'),
      q(3, 24, 'To support the production, the students used research material about _____.', CAM10_TEST3_SECTION3_SCRIPT, 'relationships between children and their parents, or between the public and people like bank managers or the police were shifting', 'B', [{ key: 'A', text: 'political developments' }, { key: 'B', text: 'changing social attitudes' }, { key: 'C', text: 'economic transformations' }], 'relationships ... were shifting', 'changing social attitudes', 'ทัศนคติทางสังคมที่เปลี่ยนแปลงไป', 'Relationships shifting shows changing social attitudes.'),
      q(3, 25, 'What problem did the students overcome in the final rehearsal?', CAM10_TEST3_SECTION3_SCRIPT, 'one spotlight – and then that stuck somehow so it was shining on the wrong side of the stage', 'B', [{ key: 'A', text: 'one person forgetting their words' }, { key: 'B', text: 'an equipment failure' }, { key: 'C', text: 'the injury of one character' }], 'spotlight ... stuck somehow', 'equipment failure', 'อุปกรณ์ขัดข้อง', 'A spotlight getting stuck is an equipment failure.'),
      q(3, 26, 'What action is needed in the second year of the course?', CAM10_TEST3_SECTION3_SCRIPT, 'you have to prove that you know your subject really well', 'E', [{ key: 'A', text: 'be on time' }, { key: 'C', text: 'plan for the final year' }, { key: 'E', text: 'show ability in Theatre Studies' }, { key: 'G', text: 'ask for help' }], 'prove that you know your subject really well', 'show ability', 'แสดงความสามารถ', 'Proving you know your subject well means showing ability.'),
      q(3, 27, 'What action is needed when first choosing where to go?', CAM10_TEST3_SECTION3_SCRIPT, 'I wanted a programme that would fit in with what I wanted to do after I graduate', 'D', [{ key: 'B', text: 'get a letter of recommendation' }, { key: 'D', text: 'make sure the institution’s focus is relevant' }, { key: 'F', text: 'make travel arrangements and bookings' }, { key: 'G', text: 'ask for help' }], 'fit in with what I wanted to do', 'focus is relevant', 'มีความสอดคล้องกับเป้าหมาย', 'Fit in with future plans means the institution focus is relevant.'),
      q(3, 28, 'What action is needed when sending in your choices?', CAM10_TEST3_SECTION3_SCRIPT, 'I had a friend who missed the deadline and didn’t get her first choice, so you do need to get a move on at that stage.', 'A', [{ key: 'A', text: 'be on time' }, { key: 'B', text: 'get a letter of recommendation' }, { key: 'D', text: 'make sure the institution’s focus is relevant' }, { key: 'F', text: 'make travel arrangements and bookings' }], 'missed the deadline / get a move on', 'be on time', 'ตรงต่อเวลา / รีบดำเนินการ', 'Avoiding a missed deadline means being on time.'),
      q(3, 29, 'What action is needed when writing your personal statement?', CAM10_TEST3_SECTION3_SCRIPT, 'I’ll get some of the final year students to give me some tips', 'G', [{ key: 'A', text: 'be on time' }, { key: 'C', text: 'plan for the final year' }, { key: 'E', text: 'show ability in Theatre Studies' }, { key: 'G', text: 'ask for help' }], 'give me some tips', 'ask for help', 'ขอคำแนะนำ / ขอความช่วยเหลือ', 'Getting tips from other students means asking for help.'),
      q(3, 30, 'What action is needed when doing the year abroad?', CAM10_TEST3_SECTION3_SCRIPT, 'forgot all about making arrangements for when I came back here for the final year', 'C', [{ key: 'B', text: 'get a letter of recommendation' }, { key: 'C', text: 'plan for the final year' }, { key: 'D', text: 'make sure the institution’s focus is relevant' }, { key: 'F', text: 'make travel arrangements and bookings' }], 'making arrangements for when I came back here for the final year', 'plan for the final year', 'วางแผนสำหรับปีสุดท้าย', 'Making arrangements for the final year means planning for the final year.')
    ]
  },
  {
    id: 'foundation-advanced-section-4-self-regulatory-focus-skill-drill',
    category: 'advanced',
    title: 'Section 4 - Self-Regulatory Focus Theory Skill Drill',
    section: 4,
    levelLabel: 'Advanced · Cam 10 Test 3 style',
    audioUrl: 'https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam10-Test3-Section4.mp3',
    questions: [
      q(4, 31, 'Promotion goals focus on _____.', CAM10_TEST3_SECTION4_SCRIPT, 'Promotion goals in different life situations emphasise achievement.', 'A', [{ key: 'A', text: 'achievement' }, { key: 'B', text: 'punishment' }, { key: 'C', text: 'obligations' }, { key: 'D', text: 'mistakes' }], 'emphasise', 'focus on', 'เน้นย้ำ', 'Emphasise means focus on.'),
      q(4, 32, 'The chronic factor comes from one’s _____.', CAM10_TEST3_SECTION4_SCRIPT, 'This factor is connected to a person’s personality', 'C', [{ key: 'A', text: 'leader' }, { key: 'B', text: 'friend' }, { key: 'C', text: 'personality' }, { key: 'D', text: 'job' }], 'connected to', 'comes from', 'มาจาก / เชื่อมโยงกับ', 'Connected to a person’s personality shows where the chronic factor comes from.'),
      q(4, 33, 'The _____ factor changes according to the immediate context.', CAM10_TEST3_SECTION4_SCRIPT, 'Second, there is a situational factor', 'B', [{ key: 'A', text: 'chronic' }, { key: 'B', text: 'situational' }, { key: 'C', text: 'leadership' }, { key: 'D', text: 'promotion' }], 'situational factor', 'factor', 'ปัจจัย', 'The missing factor is situational.'),
      q(4, 34, 'We are more likely to focus on promotion goals when with a _____.', CAM10_TEST3_SECTION4_SCRIPT, 'we are more likely to be thinking about pleasure and to have promotion goals when we are spending time with a friend', 'D', [{ key: 'A', text: 'boss' }, { key: 'B', text: 'surgeon' }, { key: 'C', text: 'follower' }, { key: 'D', text: 'friend' }], 'spending time with', 'when with', 'เมื่ออยู่ร่วมกับ', 'Spending time with a friend means being with a friend.'),
      q(4, 35, 'Promotion-focused people think about their ideal self, their _____ and their gains.', CAM10_TEST3_SECTION4_SCRIPT, 'people consider their ideal self, their aspirations and gains', 'B', [{ key: 'A', text: 'duties' }, { key: 'B', text: 'aspirations' }, { key: 'C', text: 'risks' }, { key: 'D', text: 'rules' }], 'ideal self', 'ideal version of themselves', 'ตัวตนในอุดมคติ', 'The phrase lists ideal self, aspirations and gains.'),
      q(4, 36, 'Leadership behaviour and _____ affects people’s focus.', CAM10_TEST3_SECTION4_SCRIPT, 'the way leaders behave, or their style of leading, can affect the focus that followers adopt', 'A', [{ key: 'A', text: 'style' }, { key: 'B', text: 'vision' }, { key: 'C', text: 'structure' }, { key: 'D', text: 'innovation' }], 'way leaders behave / style of leading', 'Leadership behaviour and style', 'สไตล์พฤติกรรมและการเป็นผู้นำ', 'The way leaders behave is leadership behaviour; style of leading is style.'),
      q(4, 37, 'Transformational leaders pay special attention to the _____ of their followers.', CAM10_TEST3_SECTION4_SCRIPT, 'Transformational leaders, when interacting with their followers, focus on their development.', 'C', [{ key: 'A', text: 'mistakes' }, { key: 'B', text: 'rules' }, { key: 'C', text: 'development' }, { key: 'D', text: 'contracts' }], 'focus on', 'pay special attention to', 'ให้ความสนใจเป็นพิเศษกับ', 'Focus on their development means pay special attention to development.'),
      q(4, 38, 'Transformational leaders passionately communicate a clear _____.', CAM10_TEST3_SECTION4_SCRIPT, 'Their speech is passionate and conveys a definitive vision.', 'D', [{ key: 'A', text: 'schedule' }, { key: 'B', text: 'warning' }, { key: 'C', text: 'mistake' }, { key: 'D', text: 'vision' }], 'conveys / definitive', 'communicate / clear', 'สื่อสาร / ชัดเจน', 'Conveys means communicates, and definitive means clear.'),
      q(4, 39, 'Transactional leaders create _____ to make expectations clear.', CAM10_TEST3_SECTION4_SCRIPT, 'transactional leaders focus on developing clear structures that tell their followers exactly what is expected of them', 'C', [{ key: 'A', text: 'friendships' }, { key: 'B', text: 'ambitions' }, { key: 'C', text: 'structures' }, { key: 'D', text: 'personalities' }], 'developing', 'create', 'สร้าง', 'Developing clear structures means creating structures.'),
      q(4, 40, 'Promotion focus is good for jobs requiring _____.', CAM10_TEST3_SECTION4_SCRIPT, 'For a designer who works in a field where a lot of innovation is needed, a promotion focus is probably better.', 'A', [{ key: 'A', text: 'innovation' }, { key: 'B', text: 'obedience' }, { key: 'C', text: 'punishment' }, { key: 'D', text: 'routine' }], 'where a lot of innovation is needed', 'requiring innovation', 'ที่ต้องการ / ที่จำเป็นต้องใช้นวัตกรรม', 'Where innovation is needed means jobs requiring innovation.')
    ]
  },
  {
    id: 'foundation-advanced-section-3-global-design',
    category: 'advanced',
    title: 'Section 3 - Global Design Competition',
    section: 3,
    levelLabel: 'Advanced · Section 3 reasoning',
    questions: [
      q(3, 21, 'Students entering the design competition have to _____.', 'This year is different. We have to adopt an innovative approach to existing technology, using it in a way that has not been thought of before.', 'using it in a way that has not been thought of before', 'C', [{ key: 'A', text: 'produce an energy-efficient design' }, { key: 'B', text: 'adapt an existing energy-saving appliance' }, { key: 'C', text: 'develop a new use for current technology' }], 'existing technology', 'current technology', 'เทคโนโลยีที่มีอยู่แล้ว', 'A new use for current technology is paraphrased as using existing technology in a new way.'),
      q(3, 22, 'John chose a dishwasher because he wanted to make dishwashers _____.', 'They are all pretty boring and almost identical to each other. I think some people will be prepared to pay a little extra for something that looks different.', 'something that looks different', 'A', [{ key: 'A', text: 'more appealing' }, { key: 'B', text: 'more common' }, { key: 'C', text: 'more economical' }], 'looks different', 'more appealing', 'ดูน่าสนใจมากขึ้น', 'Looks different links to making the product more attractive or appealing.'),
      q(3, 23, 'The stone in John’s Rockpool design is used _____.', 'Actually it does have a function. Instead of pushing a button, you turn the stone.', 'you turn the stone', 'B', [{ key: 'A', text: 'for decoration' }, { key: 'B', text: 'to switch it on' }, { key: 'C', text: 'to stop water escaping' }], 'turn the stone', 'switch it on', 'เปิดเครื่อง', 'Turning the stone replaces pushing a button, so it switches the dishwasher on.'),
      q(3, 24, 'In the holding chamber, the carbon dioxide _____.', 'That is where the liquid is depressurised and so it reverts to a gas.', 'reverts to a gas', 'A', [{ key: 'A', text: 'changes back to a gas' }, { key: 'B', text: 'dries the dishes' }, { key: 'C', text: 'is allowed to cool' }], 'reverts to a gas', 'changes back to a gas', 'เปลี่ยนกลับเป็นก๊าซ', 'Revert means change back to a previous state.'),
      q(3, 25, 'At the end of the cleaning process, the carbon dioxide _____.', 'The carbon dioxide is sent back to the cylinder and can be used again and again.', 'can be used again and again', 'C', [{ key: 'A', text: 'is released into the air' }, { key: 'B', text: 'is disposed of with the waste' }, { key: 'C', text: 'is collected ready to be re-used' }], 'used again and again', 're-used', 'นำกลับมาใช้ซ้ำ', 'Used again and again means re-used.'),
      q(3, 26, 'John needs help preparing for his _____.', 'In a few months time, I have to give a presentation, and that is the part I was hoping you could help me with.', 'give a presentation', 'B', [{ key: 'A', text: 'drawings' }, { key: 'B', text: 'presentation' }, { key: 'C', text: 'competition' }, { key: 'D', text: 'paper' }], 'give a presentation', 'preparing for his presentation', 'การนำเสนอ', 'He asks for help with the presentation.'),
      q(3, 27, 'The professor advises John to make a _____.', 'If you want to stand a good chance of winning you really need a model of the machine.', 'need a model of the machine', 'A', [{ key: 'A', text: 'model' }, { key: 'B', text: 'list' }, { key: 'C', text: 'grant' }, { key: 'D', text: 'report' }], 'need a model', 'advises him to make a model', 'แบบจำลอง', 'The professor says John needs a model.'),
      q(3, 28, 'John’s main problem is getting good quality _____.', 'Yes. I want it to look professional but everything that is top quality is also very expensive.', 'everything that is top quality is also very expensive', 'C', [{ key: 'A', text: 'information' }, { key: 'B', text: 'drawings' }, { key: 'C', text: 'materials' }, { key: 'D', text: 'technology' }], 'top quality', 'good quality materials', 'วัสดุคุณภาพดี', 'The professor guesses the problem is materials, and John confirms quality is expensive.'),
      q(3, 29, 'The professor suggests John apply for a _____.', 'Why do you not talk to the university about a grant? I can help you fill out the application forms if you like.', 'talk to the university about a grant', 'D', [{ key: 'A', text: 'job' }, { key: 'B', text: 'course' }, { key: 'C', text: 'patent' }, { key: 'D', text: 'grant' }], 'grant', 'apply for a grant', 'ทุนสนับสนุน', 'Talking to the university about a grant means applying for funding.'),
      q(3, 30, 'The professor will check the _____ information in John’s report.', 'You need to make sure the technical details you have given are accurate and thorough.', 'technical details', 'A', [{ key: 'A', text: 'technical' }, { key: 'B', text: 'financial' }, { key: 'C', text: 'personal' }, { key: 'D', text: 'historical' }], 'technical details', 'technical information', 'ข้อมูลทางเทคนิค', 'Technical details are technical information.')
    ]
  },
  {
    id: 'foundation-advanced-section-4-spirit-bear',
    category: 'advanced',
    title: 'Section 4 - The Spirit Bear',
    section: 4,
    levelLabel: 'Advanced · Section 4 lecture',
    questions: [
      q(4, 31, 'Its colour comes from an uncommon _____.', 'One in ten black bears is actually born with a white coat, which is the result of a special gene that surfaces in a few.', 'the result of a special gene', 'B', [{ key: 'A', text: 'coat' }, { key: 'B', text: 'gene' }, { key: 'C', text: 'legend' }, { key: 'D', text: 'family' }], 'special gene', 'uncommon gene', 'ยีนที่พบได้ไม่บ่อย', 'The white colour is caused by a special gene.'),
      q(4, 32, 'Local people believe that it has unusual _____.', 'According to the legends of these communities, its snowy fur brings with it a special power.', 'a special power', 'C', [{ key: 'A', text: 'colour' }, { key: 'B', text: 'habits' }, { key: 'C', text: 'power' }, { key: 'D', text: 'roots' }], 'special power', 'unusual power', 'พลังพิเศษ', 'Special power is paraphrased as unusual power.'),
      q(4, 33, 'They protect the bear from _____.', 'They do not speak of seeing it to anyone else. It is their way of protecting it when strangers visit the area.', 'protecting it when strangers visit the area', 'A', [{ key: 'A', text: 'strangers' }, { key: 'B', text: 'salmon' }, { key: 'C', text: 'hunters' }, { key: 'D', text: 'insects' }], 'strangers', 'protect from strangers', 'คนแปลกหน้า', 'They protect the bear by not telling strangers about seeing it.'),
      q(4, 34, 'Tree roots stop _____ along salmon streams.', 'The old-growth trees have extremely long roots that help prevent erosion of the soil along the banks of the many fish streams.', 'prevent erosion of the soil', 'D', [{ key: 'A', text: 'fishing' }, { key: 'B', text: 'vegetation' }, { key: 'C', text: 'deforestation' }, { key: 'D', text: 'erosion' }], 'prevent erosion', 'stop erosion', 'ป้องกันการกัดเซาะ', 'Prevent and stop have the same meaning here.'),
      q(4, 35, 'It is currently found on a small number of _____.', 'Today, the spirit bear lives off the coast of the province of British Columbia on a few islands.', 'on a few islands', 'B', [{ key: 'A', text: 'streams' }, { key: 'B', text: 'islands' }, { key: 'C', text: 'forests' }, { key: 'D', text: 'roads' }], 'a few islands', 'small number of islands', 'เกาะจำนวนน้อย', 'A few means a small number of.'),
      q(4, 36, 'Habitat is being lost due to deforestation and construction of _____ by logging companies.', 'In addition, they have built roads which have fractured the areas where the bear usually feeds.', 'they have built roads', 'C', [{ key: 'A', text: 'streams' }, { key: 'B', text: 'banks' }, { key: 'C', text: 'roads' }, { key: 'D', text: 'islands' }], 'built roads', 'construction of roads', 'การสร้างถนน', 'Built roads equals construction of roads.'),
      q(4, 37, 'Unrestricted _____ is affecting the salmon supply.', 'The number of salmon in those streams is declining because there is no legal limit on fishing at the moment.', 'no legal limit on fishing', 'A', [{ key: 'A', text: 'fishing' }, { key: 'B', text: 'logging' }, { key: 'C', text: 'feeding' }, { key: 'D', text: 'tourism' }], 'no legal limit', 'unrestricted', 'ไม่มีข้อจำกัด', 'No legal limit means unrestricted.'),
      q(4, 38, 'The bears’ existence is also threatened by their low rate of _____.', 'The fact that reproduction among these bears has always been disappointingly low makes their existence more fragile.', 'reproduction among these bears has always been disappointingly low', 'D', [{ key: 'A', text: 'survival' }, { key: 'B', text: 'feeding' }, { key: 'C', text: 'migration' }, { key: 'D', text: 'reproduction' }], 'reproduction', 'rate of reproduction', 'การสืบพันธุ์', 'Low reproduction means a low rate of reproduction.'),
      q(4, 39, 'Logging companies must improve their _____ of logging.', 'The government is now requiring logging companies to adopt a better logging method.', 'adopt a better logging method', 'B', [{ key: 'A', text: 'limit' }, { key: 'B', text: 'method' }, { key: 'C', text: 'habitat' }, { key: 'D', text: 'territory' }], 'better logging method', 'improve method', 'วิธีการทำป่าไม้', 'A better method means an improved method.'),
      q(4, 40, 'Maintenance and _____ of the spirit bears’ territory is needed.', 'While it is important to maintain the spirit bear’s habitat, there also needs to be more emphasis on its expansion.', 'more emphasis on its expansion', 'C', [{ key: 'A', text: 'construction' }, { key: 'B', text: 'deforestation' }, { key: 'C', text: 'expansion' }, { key: 'D', text: 'competition' }], 'expansion', 'expansion of territory', 'การขยายพื้นที่', 'The lecture says maintaining the habitat is not enough; expansion is also needed.')
    ]
  }
]
