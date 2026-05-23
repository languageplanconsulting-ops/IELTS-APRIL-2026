import type { ListeningFoundationQuestion, ListeningFoundationSet } from './listeningFoundationData'

const URBAN_FARMING_PART3_SCRIPT = `MARK: Hi Lily, how are you getting on with the research for our urban farming presentation?
LILY: Good, Mark. I've looked at the seed varieties, which was surprisingly easy to organize.
MARK: I know. I thought getting the building owners to let us onto the roofs would be the nightmare, but they were actually quite accommodating. For me, the real struggle has been tracking down accurate statistics on how much food these rooftop gardens actually produce year over year.
LILY: Absolutely, I've had the exact same issue. The numbers are all over the place.
MARK: Did you read that journal article on hydroponics I sent over?
LILY: I did. I knew it was going to be expensive to set up, so the financial breakdown didn't shock me. What caught me off guard was that the author argued hydroponics actually uses more water than traditional soil in summer months. It completely goes against what we assumed at the start.
MARK: We also need to decide which sources to include in the literature review. I collected some newspaper pieces about rooftop farms, but most of them were just personal success stories.
LILY: Yes, they were interesting, but too anecdotal for an academic presentation. We need peer-reviewed figures, not just enthusiastic interviews.
MARK: Our supervisor also said our first draft was too descriptive. She wanted us to show comparisons more clearly.
LILY: Right, so instead of adding more background, let's put in a comparison chart for the main systems. That will make the argument easier to follow.
MARK: And for the conclusion, should we recommend one best method?
LILY: I don't think so. The evidence doesn't point to a single perfect solution. We should say every method has trade-offs depending on budget, space, and maintenance.
MARK: So, we need to evaluate the different growing methods for the final slide. Let's start with vertical soil walls.
LILY: They look amazing, don't they? Very striking visually.
MARK: True, they definitely make a building look better, but they are incredibly costly to maintain.
LILY: Let's focus on how they look. That's their main selling point for architects.
MARK: Fair enough. What about aeroponics, spraying the roots with mist?
LILY: The crop turnover is incredibly fast. You get maximum output for minimal space.
MARK: I agree. It's definitely the most productive system.
LILY: Aquaponics next, using fish waste to fertilize the plants.
MARK: I think it's fascinating, but honestly, do we know enough about the long-term bacterial risks in a city environment?
LILY: Probably not. We need more studies before recommending it.
MARK: Traditional container gardening is less exciting, but it's simple enough for people who are just starting out.
LILY: Exactly. Beginners can understand it without specialist equipment.
MARK: Finally, smart greenhouses. The sensors and automated lighting are impressive.
LILY: They are, but the price is far beyond what most community projects could afford.
MARK: So we should mark them as too expensive, even if the technology is clever.`

const GINKGO_PART4_SCRIPT = `Today, I want to examine the evolution and biology of the ginkgo tree, a plant often described as a living fossil. Fossil records show that trees almost identical to the modern ginkgo were growing more than two hundred million years ago. One reason the species survived several major extinction events is its remarkable resistance to disease. While many ancient plant groups disappeared, the ginkgo remained unusually robust.

For a long time, botanists believed the tree had vanished from the wild and survived only through cultivation. That view changed when small wild populations were identified in a monastery in China, where the trees had been protected for centuries.

The ginkgo has several distinctive biological adaptations. Its leaves have a unique fan shape, and in autumn they turn a bright yellow colour before falling. The tree is also able to survive in environments with poor soil, which helps explain why it can grow in difficult urban sites. Another defence is chemical. Ginkgo leaves contain a compound that discourages insects from eating them, so the tree suffers relatively little leaf damage.

In modern cities, the ginkgo is frequently planted along streets because it tolerates high levels of pollution. However, there is one major disadvantage. Female trees produce fruit, and when this fruit falls to the ground it releases a foul smell. For that reason, urban planners now plant male trees almost exclusively, especially in areas where cleanliness is important.

Finally, the ginkgo has medical and economic uses. Extracts from its leaves are widely sold in traditional medicine and are commonly claimed to improve memory. The nuts are also edible when prepared correctly, and in East Asian cooking they are often added to a traditional soup served on special occasions.`

const REPAIR_CAFES_PART3_SCRIPT = `MAYA: Hi Leo. Did you manage to read the article on repair cafés that I sent you?
LEO: Yes, I did. I thought it would be quite a narrow topic at first, just people fixing old toasters and lamps, but there's actually a lot more to it.
MAYA: Exactly. I think it could work well for our sustainability presentation.
LEO: One thing that really stood out to me was the amount of electrical equipment that gets thrown away even when only one small part is broken.
MAYA: Yes, and that's probably the strongest argument for repair cafés. They stop so many items ending up as waste.
LEO: I agree. The article also suggested that repair cafés could create employment, but I'm not convinced. Most of the people involved are volunteers.
MAYA: Right. I wouldn't make jobs our main point. What I found more convincing was the way visitors learn what's actually wrong with their things. They don't just hand something over and wait.
LEO: True. People pick up basic repair skills, and that might make them more confident about fixing things next time.
MAYA: Some campaigners say repair cafés could replace recycling centres, but I think that's unrealistic.
LEO: Definitely. Recycling still has a role, especially when something really can't be repaired.
MAYA: And I don't think repair cafés make new products cheaper either. They might reduce demand a little, but that's different.
LEO: Agreed.
MAYA: What about the difficulties these cafés face?
LEO: Well, the article mentioned insurance, but the organiser they interviewed said the community centre's policy already covered most events.
MAYA: So that's not the biggest barrier.
LEO: No. The real issue seems to be finding enough people with the right skills. The same volunteers keep being asked to help, and some of them are getting tired.
MAYA: Yes, and the other problem is spare parts. Sometimes the repair is simple, but the exact part is impossible to get, or it costs more than the item is worth.
LEO: I thought safety would be the main issue, especially with electrical goods.
MAYA: I wondered that too, but the cafés usually check items first and refuse anything dangerous, so it's manageable.
LEO: The article also said older people are actually some of the most regular visitors, so attracting them isn't a problem.
MAYA: That surprised me. I'd assumed younger people would be more interested.
LEO: We need to discuss possible ways to develop repair cafés. What did you think about tool-lending libraries?
MAYA: They're a good idea, but they don't feel new. Lots of towns already have them, where people can borrow drills or sewing machines instead of buying them.
LEO: True. What about mobile repair vans?
MAYA: I like those more. They could visit villages or housing estates where people don't have transport.
LEO: So they'd reach people who are excluded from the normal repair café model.
MAYA: Exactly.
LEO: The article was very enthusiastic about online booking systems, but I'm not sure.
MAYA: Me neither. People may book a slot and then not come, or they might describe the problem badly online.
LEO: So the results could be disappointing.
MAYA: Yes.
LEO: I liked the idea of repair lessons in schools.
MAYA: Me too. If children learnt how to mend simple things, it could change their attitude to waste early on.
LEO: So that belongs in formal education, not just weekend clubs.
MAYA: Definitely.
LEO: What about collecting broken laptops and refurbishing them?
MAYA: That's more complicated. You'd have to deal with personal data left on the machines, and there might be rules about selling or donating them afterwards.
LEO: Yes, that could create legal complications.
MAYA: Finally, the article mentioned holding sessions in neighbourhood cafés instead of community halls.
LEO: I really like that. People might stay afterwards, talk to others, and feel more connected locally.
MAYA: Exactly. It's not just about fixing objects; it could strengthen community relationships.
LEO: That gives us a good final angle for the presentation.`

const BIOCHAR_PART4_SCRIPT = `For my presentation today, I'm going to talk about biochar and its possible role in restoring damaged soils. Biochar has received a lot of attention recently, particularly in areas where farming has reduced the quality of the soil over many years.

Biochar looks rather like ordinary charcoal, and in fact the two materials are closely related. The important difference is that charcoal is usually made as a fuel, while biochar is made specifically to be added to soil.

The idea is not completely new. Researchers became interested in biochar after studying very dark and fertile soils in parts of the Amazon. These soils appear to have been created by ancient farming communities, who added burnt plant material, food waste and other organic matter to the ground.

One reason scientists are interested in biochar is that it may help to store carbon. When plants decay naturally, much of their carbon returns quickly to the atmosphere. But when plant material is converted into biochar, some of that carbon can remain stable in the soil for hundreds, or even thousands, of years.

So how is biochar produced? The process involves heating plant material, such as wood, straw or crop waste, but with very little oxygen. This is important because the material changes chemically instead of simply burning away as ash.

The structure of biochar is also important. If you looked at a piece of biochar under a microscope, you would see that it contains a huge number of tiny pores. These spaces allow the material to hold water and air, and they also create surfaces where chemical reactions can take place.

When biochar is added to soil, one possible benefit is that it helps prevent nutrients from being washed away by heavy rain. In sandy soils especially, valuable minerals can pass through very quickly, but biochar may hold them for longer.

Another benefit is water retention. During dry periods, soils containing biochar may keep more moisture near the roots of plants, which can make crops more resilient.

Biochar can also affect life in the soil. The small spaces inside the material provide shelter for microbes, including bacteria and fungi that help break down organic matter and support plant growth.

However, biochar is not a simple solution for every soil problem. The way it is produced makes a big difference. If the production temperatures are too high, some of the useful chemical properties may be lost.

There is also the question of what material is used to make it. Clean crop waste or untreated wood may be suitable, but some waste materials contain chemicals or heavy metals. If these are not tested carefully, the final product could cause contamination instead of improving the soil.

So, although biochar has real potential, it needs to be matched carefully to the soil type, the crop, and the environmental problem being addressed.`

const TEXTILE_RECYCLING_PART3_SCRIPT = `LEAH: Hi Arun. Did you finish reading the article on textile recycling?
ARUN: Yes, I did. I was surprised, actually. Before I read it, I thought textile recycling might be too broad for our presentation: clothes, curtains, carpets, shoes, all sorts of things.
LEAH: I know what you mean, but the article gives us a clear angle: what happens to clothing after people put it in donation banks.
ARUN: Exactly. It's much more complicated than just old clothes go to charity shops.
LEAH: The section on fast fashion was interesting too. I thought the main problem was that cheap clothes are badly made.
ARUN: Some are, but the article said low prices are the bigger issue because people don't feel guilty about throwing things away.
LEAH: I agree with that. But you said earlier that young people are mostly responsible, and I'm not sure that's fair.
ARUN: Really? Students buy loads of cheap clothes.
LEAH: Maybe, but adults order just as much online. The problem is wider than one age group.
ARUN: Fair point.
LEAH: I have to admit, I sometimes donate clothes that are perfectly wearable.
ARUN: Because they're out of fashion?
LEAH: Not usually. It's more because I buy things online and the size isn't quite right. I mean to return them, but then I miss the deadline.
ARUN: That's common. What confused me was one of the statistics. The number of clothing banks has increased, but the percentage of clothing that actually gets reused has fallen.
LEAH: Yes, because a lot of donated clothing is rejected before it reaches a shop.
ARUN: Let's use those examples from the sorting centre.
LEAH: Good idea. The winter coat first?
ARUN: The manager said it was good quality, and the fabric was clean, but the main zip wouldn't close. That made it impossible to sell.
LEAH: So, broken zip. What about the cotton curtains?
ARUN: Those had paint marks across one side. The fabric itself was strong, but the stains were too obvious.
LEAH: Right. And the wool jumper?
ARUN: That one had been washed badly. It had shrunk so much that the sleeves were far too short.
LEAH: The sports bag was different, wasn't it?
ARUN: Yes. It had probably been stored outside. The manager said it was still wet when it arrived, so they rejected it straight away.
LEAH: There was also a shirt with torn seams, but that wasn't one of the examples we need.
ARUN: What did you think about the project where they tried to make new clothes from old fabric?
LEAH: It sounded clever, but I wasn't surprised it failed.
ARUN: Was it because people didn't like the idea of recycled clothing?
LEAH: No, the article said customers were actually open to that. The problem was that the pieces of fabric they received were too inconsistent: different weights, different colours, different levels of wear.
ARUN: So manufacturers couldn't rely on a steady supply.
LEAH: Exactly.
ARUN: I think that gives us our presentation angle. We shouldn't just talk about people shopping too much.
LEAH: Or just criticise fashion brands.
ARUN: Right. The interesting part is what happens after people donate clothes: sorting, rejection, reuse, export, landfill.
LEAH: Yes, that's the hidden process most people know nothing about.`

const VERTICAL_FARMING_PART4_SCRIPT = `Today I'm going to talk about vertical farming, a method of food production that has attracted increasing interest in urban areas.

In traditional farming, crops are grown across large areas of land. In vertical farming, however, crops are grown indoors in stacked layers. This means that a relatively small building can produce a large amount of food.

Many vertical farms are established in unused warehouses, especially in cities where land is expensive but empty industrial buildings are available.

The production method is very different from ordinary field farming. Since the crops are indoors, they do not receive natural sunlight. Instead, they are given artificial light, usually from LED systems that can be adjusted for different crops.

In many vertical farms, plants are not grown in soil. Their roots grow in nutrient-rich water, which provides the minerals they need.

The growing environment is carefully controlled. Computer systems monitor humidity and temperature, and they can adjust the conditions automatically if the plants need more or less moisture in the air.

One advantage of vertical farming is that pests are easier to control indoors. As a result, farmers often need far fewer pesticides than they would in outdoor agriculture.

Another possible benefit is location. If food is grown close to the people who buy it, there is less need for long-distance transport from rural farms to city supermarkets.

However, vertical farming also has limitations. The first is the amount of electricity needed for lighting, heating, cooling and computer control systems. This can make production expensive.

Another limitation is the type of crop that can be grown. Leafy vegetables such as lettuce work well, but crops such as wheat are much harder to produce profitably because they require more space and have a lower market value.

Finally, vertical farms need reliable contracts with supermarkets, restaurants or other buyers. Without these, it is difficult to cover the high cost of equipment and energy.

So vertical farming is not a replacement for all traditional agriculture, but it may become an important part of food production in large cities.`

const SLEEP_UNIVERSITY_PART3_SCRIPT = `DANA: Shall we go through our notes on sleep and university students?
SAM: Yes. I thought this would be a simple topic, but there's more research than I expected.
DANA: Same here. The first question is why so many students sleep badly.
SAM: I assumed noisy accommodation would be the main cause.
DANA: It can be a problem, but the studies didn't treat it as one of the major causes. It depends too much on where students live.
SAM: True. Screen use seems much more significant. Students work on laptops, message friends, and watch videos late at night.
DANA: Yes, and the light from screens can delay sleep. That's definitely one cause we should include.
SAM: What about caffeine? Energy drinks were mentioned.
DANA: They were, but the evidence was mixed. Some students drink them early in the day, so it doesn't always affect sleep.
SAM: Fair enough. I think part-time employment is important. Students who work evening shifts often get home late and then still have assignments to finish.
DANA: I agree. That creates a routine where sleep gets pushed later and later.
SAM: Early morning lectures are annoying, but not every course has them.
DANA: Exactly. They make bad sleep worse, but they aren't the main cause.
SAM: What effects of poor sleep should we mention?
DANA: Concentration is the obvious one. Several studies showed that students who slept badly found it harder to focus in seminars and lectures.
SAM: Yes. I also saw a claim that poor sleep increases creativity, but that sounded doubtful.
DANA: I wouldn't include that. The stronger evidence is about memory. Sleep seems to help students process and store what they've learned.
SAM: Right. There were also claims about back pain and skin problems.
DANA: But those seemed much weaker. They may be connected indirectly, but the evidence wasn't strong enough for our presentation.
SAM: What did you think about sleep-tracking apps?
DANA: They're interesting, but I'm worried they might make some people anxious. If students keep checking their sleep score every morning, they may become stressed about it.
SAM: I thought the same. Some people might sleep worse because they're trying too hard to get a perfect result.
DANA: Exactly.
SAM: Are they too expensive, though?
DANA: Some are, but lots of students already have basic versions on their phones, so cost isn't the main issue.
SAM: The article said the apps can be useful, but I don't think they can replace proper advice from a doctor or counsellor.
DANA: No, definitely not.
SAM: And we should say more independent research is needed. A lot of the evidence comes from the companies that make the apps.
DANA: Yes, that's a really important point.
SAM: I don't like the idea of universities making students use them.
DANA: Me neither. That would be too intrusive.
DANA: Now, what about the phrase sleep hygiene?
SAM: It sounds strange. Some students may think it means keeping your bed clean.
DANA: True, but it's a common term in the research. We could define it first, then give examples like having a regular bedtime and avoiding screens late at night.
SAM: That makes sense.
DANA: I think we should start the presentation with a personal example. Maybe my first exam period, when I stayed up too late every night and felt awful.
SAM: Good idea. Most students will recognise that situation, even if they don't talk about it.
DANA: What about naps? Should we recommend them?
SAM: Carefully. The studies suggest short naps can help, but long ones can make it harder to sleep at night.
DANA: So the key point is that naps are useful only if they aren't too long.
SAM: Exactly.
DANA: One thing that surprised me was the advice from universities. The health centre says one thing, academic departments say another, and accommodation teams send different information again.
SAM: Yes, it's not coordinated. Students may get advice, but it comes from too many separate places.
DANA: That can be our final recommendation: universities need a clearer approach.`

const SEED_BANKS_PART4_SCRIPT = `For my presentation today, I'm going to discuss seed banks and their role in protecting crop diversity.

A seed bank is a place where seeds are collected, catalogued and stored for future use. One of its main purposes is to protect agricultural diversity. This is important because modern farming often depends on a limited number of commercial crops.

In the past, farmers grew many local varieties that were adapted to particular soils, climates and diseases. But when farmers change to commercial crops, these older varieties may disappear.

The storage process has to be carefully controlled. First, seeds are cleaned and dried to remove moisture. If too much moisture remains inside the seed, it may decay during storage.

After drying, most seeds are kept at a low temperature. This slows down the natural ageing process and allows the seeds to remain usable for many years.

Each seed sample is placed in sealed containers. These protect the seeds from air, water and insects, and they also make it easier to label and organise the collection.

Seed banks are useful in several ways. If a crop is damaged by disease, researchers can search stored collections for older varieties that may have natural protection against it.

Plant breeders also use seed banks to develop crops with greater resistance to drought. This is becoming more important in regions where rainfall is less reliable than it used to be.

Seed banks can also support farmers after extreme events such as floods, when stored seed for the next planting season may have been destroyed.

However, seed banks have limitations. Some seeds are difficult to store because they cannot survive drying. These include the seeds of certain tropical plants, which lose their ability to grow if too much water is removed.

Another problem is that stored seeds do not remain alive forever. Banks must carry out regular testing to check whether samples can still germinate. If too few seeds grow during testing, new samples have to be collected or produced.

So, seed banks are not simply museums for plants. They are active scientific resources that may help agriculture respond to disease, climate change and food insecurity.`

const COMMUNITY_GARDENS_PART3_SCRIPT = `NINA: Hi Oscar. Did you finish reading the report on community gardens?
OSCAR: Yes. I thought it was going to be a simple topic, people growing vegetables together, but there's actually a lot to discuss.
NINA: Exactly. The report shows they're not just about food.
OSCAR: That surprised me. I assumed the main benefit was cheaper fruit and vegetables.
NINA: That can happen, but the report said the amount of food produced is usually quite small. So I wouldn't call that the main advantage.
OSCAR: True. What seemed more important was the way people learn practical skills. Some residents had never grown anything before, and now they know about planting, watering and composting.
NINA: I agree. And the other big benefit is social. People who had lived in the same street for years finally started talking to each other.
OSCAR: Yes, that was convincing. The report mentioned public parks too, but I don't think community gardens reduce pressure on them much.
NINA: No. People still need parks for sport and open space.
OSCAR: And full-time jobs? That sounded unrealistic.
NINA: Definitely. Most of the work is voluntary.
OSCAR: What problems should we include?
NINA: Funding is the obvious one. Some gardens begin with a grant, but after two or three years they struggle to pay for water, insurance and equipment.
OSCAR: Yes, that's a serious issue. Soil quality was mentioned, but most groups solve that by using raised beds.
NINA: Right, so it's not usually the main barrier.
OSCAR: Getting permission to use land seems more difficult. If the land belongs to the council or a private owner, groups may wait months before they can start.
NINA: Agreed. The report also mentioned younger volunteers, but not as a problem. It said gardens wanted more of them.
OSCAR: And complaints about noise were rare. Gardens are usually quiet places.
NINA: Now, the improvement ideas. What did you think about evening gardening sessions?
OSCAR: I liked that. People who work during the day could come after work, so it would attract people who don't usually take part.
NINA: Exactly. Shared tool cupboards?
OSCAR: Useful, but there need to be rules. Tools can go missing, or people may not return them clean.
NINA: So clearer rules are needed.
OSCAR: Cooking events using produce from the garden sounded great.
NINA: Yes. The report gave examples where people cooked together and exchanged recipes. It seems to help people learn from each other.
OSCAR: What about school vegetable plots?
NINA: I think schools should organise those. Teachers can connect them with science lessons and healthy eating.
OSCAR: Selling produce to restaurants worried me.
NINA: Me too. Once money becomes the main focus, the garden may stop being a community space.
OSCAR: So it could damage the original purpose.
NINA: Finally, online advice groups.
OSCAR: The report said several gardens already use them well. People post photos of plant diseases or ask when to harvest things.
NINA: Yes, that already seems to be successful.`

const CORAL_REEF_PART4_SCRIPT = `For my presentation today, I'm going to talk about coral reef restoration and the methods scientists are using to repair damaged reefs.

Coral reefs are sometimes described as the rainforests of the sea because they support such a high level of marine diversity. A huge number of fish, shellfish and other sea creatures depend on reefs for food and shelter.

Reefs also protect coastal areas. When large waves move towards the shore, the structure of the reef reduces the force of the waves before they reach land.

However, reefs are under increasing pressure. One major problem is coral bleaching. This happens when corals lose the tiny organisms that live inside them and provide much of their colour and energy. Bleaching is often linked to warmer water.

One restoration method involves growing small pieces of coral in underwater nurseries. These nurseries allow young corals to develop in a protected place before they are moved back to damaged reefs.

In some areas, reefs have been physically broken by storms or human activity. To repair these areas, scientists may use metal frames. These create a stable structure where coral can begin to grow again.

Another technique is to attach coral fragments directly to rocks or dead reef surfaces. In many projects, divers use a special glue to hold the fragments in position until they become fixed naturally.

There are, however, several challenges. Young corals are delicate, and storms can break or bury them before they are well established.

Pollution is another problem. If too many nutrients enter the water, algae may grow quickly and cover the reef, blocking light from the corals.

Restoration work is also expensive. It requires boats, diving equipment and skilled divers who can work carefully underwater.

For the future, scientists are also studying corals that show greater heat tolerance. The hope is that these corals may survive better as ocean temperatures continue to rise.

So coral restoration is promising, but it is not a complete solution. Protecting reefs also depends on reducing pollution and limiting further damage to the marine environment.`

const DIGITAL_NOTE_TAKING_PART3_SCRIPT = `EMMA: Hi Ravi. Have you read the article on digital note-taking?
RAVI: Yes. I wasn't sure at first. I thought the topic might be too ordinary, everyone already knows students use laptops and tablets.
EMMA: I thought that too, but the research is more complicated than I expected.
RAVI: Especially the section on laptops in lectures.
EMMA: I use my laptop because it helps me organise information. I can move headings around and add links later.
RAVI: I agree it helps organisation. But I think laptops can distract people sitting nearby, especially if someone is checking messages.
EMMA: I'm not sure that's a major problem. Students should just concentrate on their own work.
RAVI: Maybe, but if a bright screen is in front of you, it's hard not to notice it.
EMMA: Fair point.
RAVI: Do you ever take notes by hand now?
EMMA: Yes, especially in biology lectures. If the lecturer draws a process or a diagram, I remember it better when I draw it myself.
RAVI: I'm slower with handwriting.
EMMA: Me too, but sometimes slower is useful.
RAVI: That connects with the finding that surprised me. Students who typed notes often wrote down more words, but that didn't always mean they understood the lecture better.
EMMA: Yes, because they may just copy without thinking.
EMMA: We need to choose a research method for our presentation.
RAVI: What about filming students during lectures and analysing what they do?
EMMA: That would be interesting, but we'd need special permission. Some students wouldn't want to be recorded.
RAVI: True. Comparing exam results might be easier.
EMMA: I'm not sure. Too many other things affect exam results: revision, attendance, background knowledge. The results would be hard to measure properly.
RAVI: Good point. We could just interview five classmates.
EMMA: Five people isn't enough. The sample would be too small to tell us much.
RAVI: What about lending tablets to volunteers and asking them to use them for a week?
EMMA: That would cost too much unless we already had the tablets.
RAVI: So we need something simpler.
EMMA: Maybe we can include a short memory test. We give students the same short talk, ask half to type notes and half to write by hand, then ask a few questions.
RAVI: That won't prove one method is better forever, but it would give us some simple data of our own.
EMMA: Exactly. We can use it as a small classroom demonstration, not a full scientific experiment.
RAVI: What should our final message be?
EMMA: I don't think we should say handwriting is always better or laptops are always better.
RAVI: Agreed. It depends on the task. Typing may be useful for organised lecture notes, but handwriting may help with diagrams or problem-solving.
EMMA: So our presentation should explain when different methods are useful.
RAVI: That's a balanced angle.`

const LIGHT_POLLUTION_PART4_SCRIPT = `Today I'm going to discuss light pollution and why it has become an important environmental issue.

Light pollution is caused by artificial light that is unnecessary, too bright, or directed in the wrong direction. It is different from useful lighting, such as a lamp that helps people walk safely at night.

This problem is especially common in large cities, where streetlights, advertising signs, office buildings and traffic all produce light after dark.

One obvious result is that people can no longer see many stars in the night sky. In some urban areas, only the brightest stars are visible.

Light pollution also affects wildlife. For example, young sea turtles normally move towards the ocean after they hatch. They use natural light reflected from the sea, but artificial lights near beaches can lead them away from the water.

Birds are also affected. Many species travel long distances during migration, and bright lights from buildings can confuse them, especially in cloudy weather.

Insects may also be disturbed. Instead of finding food or mates, they often gather around lamps for long periods, which can affect their survival.

There are human effects as well. Bright light at night can disturb sleep patterns because the body may not receive a clear signal that it is time to rest.

Another issue is road safety. Poorly designed lights can create glare, making it harder for drivers to see clearly.

Fortunately, there are practical solutions. Streetlights should be designed to point downward, so the light falls on roads and pavements instead of escaping into the sky.

Some towns also reduce lighting after midnight, when fewer people are outside. This saves energy and reduces the impact on wildlife and the night sky.

So the aim is not to remove outdoor lighting completely, but to use it more carefully.`

const mcQuestion = (
  id: string,
  number: number,
  question: string,
  evidence: string,
  correctAnswer: string,
  options: Array<{ key: string; text: string }>,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 3,
  question,
  passage: URBAN_FARMING_PART3_SCRIPT,
  evidence,
  correctAnswer,
  options,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: [question, ...options.map((option) => `${option.key} ${option.text}`)].join('\n'),
  layout: 'choice'
})

const matchingQuestionText = `Questions 26-30
What is the students' opinion on the following growing methods?
Choose FIVE answers from the box and write the correct letter, A-G.
A Too expensive
B Highly efficient
C Requires more research
D Unsuitable for urban areas
E Environmentally damaging
F Best for beginners
G Aesthetically pleasing`

const methodOptions = [
  { key: 'A', text: 'Too expensive' },
  { key: 'B', text: 'Highly efficient' },
  { key: 'C', text: 'Requires more research' },
  { key: 'D', text: 'Unsuitable for urban areas' },
  { key: 'E', text: 'Environmentally damaging' },
  { key: 'F', text: 'Best for beginners' },
  { key: 'G', text: 'Aesthetically pleasing' }
]

const matchQuestion = (
  id: string,
  number: number,
  rowLabel: string,
  evidence: string,
  correctAnswer: string,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 3,
  question: rowLabel,
  passage: URBAN_FARMING_PART3_SCRIPT,
  evidence,
  correctAnswer,
  options: methodOptions,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: matchingQuestionText,
  layout: 'matching-row',
  rowLabel
})

const gapOptions = (correct: string, distractors: string[]) =>
  [correct, ...distractors].map((text, index) => ({
    key: String.fromCharCode(65 + index),
    text
  }))

const gapQuestion = (
  id: string,
  number: number,
  question: string,
  evidence: string,
  answer: string,
  distractors: string[],
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 4,
  question,
  passage: GINKGO_PART4_SCRIPT,
  evidence,
  correctAnswer: answer,
  acceptedAnswers: [answer],
  options: gapOptions(answer, distractors),
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: question,
  layout: 'gap-fill'
})

const repairBenefitsQuestionText = `Questions 21 and 22
Choose TWO letters, A-E.
Which TWO benefits of repair cafés do the students agree are most important?
A creating more paid jobs in the local area
B reducing the amount of electrical waste
C helping people learn hands-on fixing skills
D replacing standard recycling services
E making new products less expensive`

const repairProblemsQuestionText = `Questions 23 and 24
Choose TWO letters, A-E.
Which TWO problems do the students agree repair cafés often face?
A too few skilled helpers
B high insurance costs
C people bringing unsafe electrical items
D problems obtaining replacement components
E difficulty attracting older people`

const repairMcOptions = [
  { key: 'A', text: 'creating more paid jobs in the local area' },
  { key: 'B', text: 'reducing the amount of electrical waste' },
  { key: 'C', text: 'helping people learn hands-on fixing skills' },
  { key: 'D', text: 'replacing standard recycling services' },
  { key: 'E', text: 'making new products less expensive' }
]

const repairProblemOptions = [
  { key: 'A', text: 'too few skilled helpers' },
  { key: 'B', text: 'high insurance costs' },
  { key: 'C', text: 'people bringing unsafe electrical items' },
  { key: 'D', text: 'problems obtaining replacement components' },
  { key: 'E', text: 'difficulty attracting older people' }
]

const repairMcQuestion = (
  id: string,
  number: number,
  questionText: string,
  evidence: string,
  correctAnswer: string,
  options: Array<{ key: string; text: string }>,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 3,
  question: questionKeyword,
  passage: REPAIR_CAFES_PART3_SCRIPT,
  evidence,
  correctAnswer,
  options,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText,
  layout: 'choice'
})

const repairIdeaQuestionText = `Questions 25-30
What is the students' opinion about each of the following ideas for developing repair cafés?
Choose SIX answers from the box and write the correct letter, A-H.
A This should be included in formal education.
B This may have disappointing results.
C This could create legal complications.
D This is no longer a new idea.
E Better evidence is needed before this is expanded.
F This could serve people who are usually left out.
G This might be too expensive to operate.
H This would build stronger local ties.`

const repairIdeaOptions = [
  { key: 'A', text: 'This should be included in formal education.' },
  { key: 'B', text: 'This may have disappointing results.' },
  { key: 'C', text: 'This could create legal complications.' },
  { key: 'D', text: 'This is no longer a new idea.' },
  { key: 'E', text: 'Better evidence is needed before this is expanded.' },
  { key: 'F', text: 'This could serve people who are usually left out.' },
  { key: 'G', text: 'This might be too expensive to operate.' },
  { key: 'H', text: 'This would build stronger local ties.' }
]

const repairMatchQuestion = (
  id: string,
  number: number,
  rowLabel: string,
  evidence: string,
  correctAnswer: string,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 3,
  question: rowLabel,
  passage: REPAIR_CAFES_PART3_SCRIPT,
  evidence,
  correctAnswer,
  options: repairIdeaOptions,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: repairIdeaQuestionText,
  layout: 'matching-row',
  rowLabel
})

const biocharGapQuestion = (
  id: string,
  number: number,
  question: string,
  evidence: string,
  answer: string,
  distractors: string[],
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 4,
  question,
  passage: BIOCHAR_PART4_SCRIPT,
  evidence,
  correctAnswer: answer,
  acceptedAnswers: [answer],
  options: gapOptions(answer, distractors),
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: question,
  layout: 'gap-fill'
})

const choiceQuestionFor = (
  script: string,
  id: string,
  number: number,
  question: string,
  evidence: string,
  correctAnswer: string,
  options: Array<{ key: string; text: string }>,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string,
  questionText?: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 3,
  question,
  passage: script,
  evidence,
  correctAnswer,
  options,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: questionText ?? [question, ...options.map((option) => `${option.key} ${option.text}`)].join('\n'),
  layout: 'choice'
})

const matchQuestionFor = (
  script: string,
  options: Array<{ key: string; text: string }>,
  questionText: string,
  id: string,
  number: number,
  rowLabel: string,
  evidence: string,
  correctAnswer: string,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 3,
  question: rowLabel,
  passage: script,
  evidence,
  correctAnswer,
  options,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText,
  layout: 'matching-row',
  rowLabel
})

const gapQuestionFor = (
  script: string,
  id: string,
  number: number,
  question: string,
  evidence: string,
  answer: string,
  distractors: string[],
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id,
  number,
  section: 4,
  question,
  passage: script,
  evidence,
  correctAnswer: answer,
  acceptedAnswers: [answer],
  options: gapOptions(answer, distractors),
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  questionText: question,
  layout: 'gap-fill'
})

const textileSortingQuestionText = `Questions 25-28
What reason did the sorting centre give for rejecting each item?
Choose FOUR answers from the box and write the correct letter, A-F.
A there were very visible marks
B the fibre label was missing
C the garment had become too small
D the fastening would not close
E the item was not dry
F the seams had torn`

const textileSortingOptions = [
  { key: 'A', text: 'there were very visible marks' },
  { key: 'B', text: 'the fibre label was missing' },
  { key: 'C', text: 'the garment had become too small' },
  { key: 'D', text: 'the fastening would not close' },
  { key: 'E', text: 'the item was not dry' },
  { key: 'F', text: 'the seams had torn' }
]

const sleepCauseQuestionText = `Questions 21 and 22
Choose TWO letters, A-E.
Which TWO factors do the students both believe are major causes of poor sleep among university students?
A late-night screen use
B noisy accommodation
C part-time employment
D caffeine in energy drinks
E early morning lectures`

const sleepEffectQuestionText = `Questions 23 and 24
Choose TWO letters, A-E.
Which TWO effects of poor sleep do the students agree are supported by strong evidence?
A reduced concentration
B increased creativity
C poorer memory
D back pain
E skin problems`

const sleepAppQuestionText = `Questions 25 and 26
Choose TWO letters, A-E.
Which TWO opinions do the students both express about sleep-tracking apps?
A They may increase worry about rest.
B They are too expensive for most students.
C They can replace professional advice.
D They should be required by universities.
E More impartial studies are required.`

const sleepCauseOptions = [
  { key: 'A', text: 'late-night screen use' },
  { key: 'B', text: 'noisy accommodation' },
  { key: 'C', text: 'part-time employment' },
  { key: 'D', text: 'caffeine in energy drinks' },
  { key: 'E', text: 'early morning lectures' }
]

const sleepEffectOptions = [
  { key: 'A', text: 'reduced concentration' },
  { key: 'B', text: 'increased creativity' },
  { key: 'C', text: 'poorer memory' },
  { key: 'D', text: 'back pain' },
  { key: 'E', text: 'skin problems' }
]

const sleepAppOptions = [
  { key: 'A', text: 'They may increase worry about rest.' },
  { key: 'B', text: 'They are too expensive for most students.' },
  { key: 'C', text: 'They can replace professional advice.' },
  { key: 'D', text: 'They should be required by universities.' },
  { key: 'E', text: 'More impartial studies are required.' }
]

const communityBenefitsQuestionText = `Questions 21 and 22
Choose TWO letters, A-E.
Which TWO advantages of community gardens do the students agree are most important?
A They make fresh food cheaper for everyone.
B They help locals learn hands-on growing skills.
C They reduce pressure on public parks.
D They build stronger neighbour connections.
E They provide full-time employment for local people.`

const communityProblemsQuestionText = `Questions 23 and 24
Choose TWO letters, A-E.
Which TWO problems do the students agree community gardens often face?
A lack of long-term funding
B poor soil quality
C too many young volunteers
D difficulty obtaining land approval
E complaints about noise`

const communityIdeaQuestionText = `Questions 25-30
What is the students' opinion about each idea for improving community gardens?
Choose SIX answers from the box and write the correct letter, A-H.
A This could attract people who do not usually take part.
B This might create safety problems.
C Schools should be responsible for this.
D This may not be worth the cost.
E This appears to be working already.
F This requires tighter management.
G This would encourage local knowledge-sharing.
H This could undermine the gardens' original aim.`

const communityBenefitOptions = [
  { key: 'A', text: 'They make fresh food cheaper for everyone.' },
  { key: 'B', text: 'They help locals learn hands-on growing skills.' },
  { key: 'C', text: 'They reduce pressure on public parks.' },
  { key: 'D', text: 'They build stronger neighbour connections.' },
  { key: 'E', text: 'They provide full-time employment for local people.' }
]

const communityProblemOptions = [
  { key: 'A', text: 'lack of long-term funding' },
  { key: 'B', text: 'poor soil quality' },
  { key: 'C', text: 'too many young volunteers' },
  { key: 'D', text: 'difficulty obtaining land approval' },
  { key: 'E', text: 'complaints about noise' }
]

const communityIdeaOptions = [
  { key: 'A', text: 'This could attract people who do not usually take part.' },
  { key: 'B', text: 'This might create safety problems.' },
  { key: 'C', text: 'Schools should be responsible for this.' },
  { key: 'D', text: 'This may not be worth the cost.' },
  { key: 'E', text: 'This appears to be working already.' },
  { key: 'F', text: 'This requires tighter management.' },
  { key: 'G', text: 'This would encourage local knowledge-sharing.' },
  { key: 'H', text: "This could undermine the gardens' original aim." }
]

const digitalMethodQuestionText = `Questions 25-28
What reason did the students give for rejecting each research method?
Choose FOUR answers from the box and write the correct letter, A-F.
A The group would be too limited.
B The outcomes would be difficult to assess.
C It would take too much time.
D Students might change their normal behaviour.
E The equipment would be too expensive.
F It would require extra approval.`

const digitalMethodOptions = [
  { key: 'A', text: 'The group would be too limited.' },
  { key: 'B', text: 'The outcomes would be difficult to assess.' },
  { key: 'C', text: 'It would take too much time.' },
  { key: 'D', text: 'Students might change their normal behaviour.' },
  { key: 'E', text: 'The equipment would be too expensive.' },
  { key: 'F', text: 'It would require extra approval.' }
]

export const ADVANCED_PART34_LISTENING_SETS: ListeningFoundationSet[] = [
  {
    id: 'advanced-listening-urban-farming-part-3',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 3 - Urban Farming Project',
    section: 3,
    levelLabel: 'ADVANCED LISTENING · Part 3 dialogue · target Band 7+',
    audioCacheKey: 'advanced-listening-urban-farming-part-3',
    audioscript: URBAN_FARMING_PART3_SCRIPT,
    questions: [
      mcQuestion(
        'advanced-urban-farming-p3-q21',
        21,
        'What do Mark and Lily agree is the hardest part of their urban farming project?',
        'the real struggle has been tracking down accurate statistics on how much food these rooftop gardens actually produce year over year. Absolutely, I\'ve had the exact same issue.',
        'B',
        [
          { key: 'A', text: 'Sourcing the correct seeds.' },
          { key: 'B', text: 'Finding reliable data on crop yields.' },
          { key: 'C', text: 'Securing permission for rooftop access.' }
        ],
        'tracking down accurate statistics on how much food these rooftop gardens actually produce',
        'Finding reliable data on crop yields',
        'ข้อมูลผลผลิตพืชที่เชื่อถือได้',
        'คำถามถาม hardest part ส่วนคำหลอกคือ seed varieties และ rooftop access เพราะทั้งคู่บอกว่าง่าย/เจ้าของตึกยอมให้เข้าถึง แต่คำเชื่อม For me เปลี่ยนเข้าคำตอบจริงคือ tracking down accurate statistics = finding reliable data on crop yields.'
      ),
      mcQuestion(
        'advanced-urban-farming-p3-q22',
        22,
        'Lily was surprised by the article on hydroponics because it...',
        'What caught me off guard was that the author argued hydroponics actually uses more water than traditional soil in summer months. It completely goes against what we assumed at the start.',
        'A',
        [
          { key: 'A', text: 'contradicted their initial hypothesis.' },
          { key: 'B', text: 'was written by a controversial author.' },
          { key: 'C', text: 'ignored the financial costs.' }
        ],
        'goes against what we assumed at the start',
        'contradicted their initial hypothesis',
        'ขัดแย้งกับสมมติฐานแรก',
        'คำถามใช้ surprised และ initial hypothesis ในสคริปต์คือ caught me off guard และ what we assumed at the start. คำหลอกคือ financial costs เพราะ Lily บอกว่าไม่ได้ช็อกเรื่องค่าใช้จ่าย.'
      ),
      mcQuestion(
        'advanced-urban-farming-p3-q23',
        23,
        'Why do the students decide not to rely on newspaper articles?',
        'they were interesting, but too anecdotal for an academic presentation. We need peer-reviewed figures',
        'A',
        [
          { key: 'A', text: 'They are not academically reliable enough.' },
          { key: 'B', text: 'They are mainly about rural farms.' },
          { key: 'C', text: 'They are too old to be useful.' }
        ],
        'too anecdotal for an academic presentation',
        'not academically reliable enough',
        'ไม่น่าเชื่อถือพอในเชิงวิชาการ',
        'คำเชื่อม but สำคัญมาก เพราะหลัง but คือเหตุผลจริง: too anecdotal. คำหลอกคือ interesting เพราะเป็นข้อดีเล็ก ๆ แต่ไม่ใช่เหตุผลที่ตัดออก.'
      ),
      mcQuestion(
        'advanced-urban-farming-p3-q24',
        24,
        'What do Mark and Lily decide to add after receiving feedback?',
        'instead of adding more background, let\'s put in a comparison chart for the main systems',
        'B',
        [
          { key: 'A', text: 'More background information.' },
          { key: 'B', text: 'A comparison chart.' },
          { key: 'C', text: 'Interviews with local residents.' }
        ],
        'put in a comparison chart',
        'decide to add',
        'เพิ่มตารางเปรียบเทียบ',
        'คำหลอกคือ more background เพราะสคริปต์ใช้ instead of เพื่อปฏิเสธสิ่งนี้ แล้วคำตอบจริงมาหลังคำว่า let\'s: comparison chart.'
      ),
      mcQuestion(
        'advanced-urban-farming-p3-q25',
        25,
        'What should the conclusion of the presentation emphasise?',
        'The evidence doesn\'t point to a single perfect solution. We should say every method has trade-offs depending on budget, space, and maintenance.',
        'A',
        [
          { key: 'A', text: 'Each method has both advantages and limitations.' },
          { key: 'B', text: 'Rooftop farms can replace conventional farming.' },
          { key: 'C', text: 'Technology solves most urban farming problems.' }
        ],
        'every method has trade-offs',
        'advantages and limitations',
        'มีทั้งข้อดีและข้อจำกัด',
        'คำถามใช้ emphasise ส่วนสคริปต์ใช้ We should say. คำว่า trade-offs แปลว่ามีทั้งข้อดีและข้อจำกัด จึงตอบ A.'
      ),
      matchQuestion(
        'advanced-urban-farming-p3-q26',
        26,
        'Vertical Soil Walls',
        'They look amazing, don\'t they? Very striking visually.',
        'G',
        'Very striking visually',
        'Aesthetically pleasing',
        'ดูสวยงาม / ดึงดูดทางสายตา',
        'keyword ในโจทย์คือ Vertical Soil Walls ส่วน evidence คือ striking visually = aesthetically pleasing. คำหลอกคือ costly แต่ Lily บอกให้ focus on how they look.'
      ),
      matchQuestion(
        'advanced-urban-farming-p3-q27',
        27,
        'Aeroponics',
        'The crop turnover is incredibly fast. You get maximum output for minimal space.',
        'B',
        'maximum output for minimal space',
        'Highly efficient',
        'มีประสิทธิภาพสูง',
        'maximum output for minimal space = highly efficient. คำว่า agree ในบรรทัดถัดไปช่วยยืนยันว่าทั้งคู่เห็นด้วยกับคำตอบนี้.'
      ),
      matchQuestion(
        'advanced-urban-farming-p3-q28',
        28,
        'Aquaponics',
        'We need more studies before recommending it.',
        'C',
        'need more studies',
        'Requires more research',
        'ต้องการงานวิจัยเพิ่ม',
        'studies = research และ need = requires. คำหลอกคือ fascinating เพราะเป็นความคิดเห็นเชิงบวก แต่คำตอบจริงมาหลัง but/honestly เรื่องความเสี่ยงที่ยังไม่รู้พอ.'
      ),
      matchQuestion(
        'advanced-urban-farming-p3-q29',
        29,
        'Traditional Container Gardening',
        'it\'s simple enough for people who are just starting out. Exactly. Beginners can understand it without specialist equipment.',
        'F',
        'Beginners can understand it',
        'Best for beginners',
        'เหมาะกับผู้เริ่มต้น',
        'people who are just starting out และ Beginners ตรงกับ best for beginners. คำว่า Exactly เป็น consensus marker ว่าอีกคนเห็นด้วย.'
      ),
      matchQuestion(
        'advanced-urban-farming-p3-q30',
        30,
        'Smart Greenhouses',
        'the price is far beyond what most community projects could afford. So we should mark them as too expensive',
        'A',
        'too expensive',
        'Too expensive',
        'แพงเกินไป',
        'คำหลอกคือ sensors and automated lighting are impressive แต่คำเชื่อม but พาไปคำตอบจริง: price far beyond what projects could afford = too expensive.'
      )
    ]
  },
  {
    id: 'advanced-listening-ginkgo-tree-part-4',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 4 - The Ginkgo Tree',
    section: 4,
    levelLabel: 'ADVANCED LISTENING · Part 4 lecture · target Band 7+',
    audioCacheKey: 'advanced-listening-ginkgo-tree-part-4',
    audioscript: GINKGO_PART4_SCRIPT,
    questions: [
      gapQuestion('advanced-ginkgo-p4-q31', 31, 'One reason the species outlived ancient crises is its ability to withstand 31 ____.', 'survived several major extinction events is its remarkable resistance to disease', 'disease', ['pollution', 'insects', 'soil'], 'resistance to disease', 'ability to withstand', 'โรค', 'outlived ancient crises paraphrase survived major extinction events · ability to withstand = resistance to · คำตอบคือ disease'),
      gapQuestion('advanced-ginkgo-p4-q32', 32, 'The tree was long thought extinct in the wild until isolated groups were found at a Chinese 32 ____.', 'small wild populations were identified in a monastery in China', 'monastery', ['forest', 'garden', 'museum'], 'monastery in China', 'long thought extinct found at a Chinese', 'วัด / อาราม', 'long thought extinct = believed vanished from the wild · isolated groups = small wild populations · found = identified · คำตอบคือ monastery'),
      gapQuestion('advanced-ginkgo-p4-q33', 33, 'Fan-shaped leaves turn a vivid 33 ____ shade before falling near the end of the year.', 'in autumn they turn a bright yellow colour', 'yellow', ['green', 'golden', 'orange'], 'bright yellow colour', 'vivid shade', 'สีเหลืองสด', 'vivid shade paraphrase bright colour — คำตอบคือ yellow'),
      gapQuestion('advanced-ginkgo-p4-q34', 34, 'It can thrive even where the ground has poor-quality 34 ____.', 'survive in environments with poor soil', 'soil', ['light', 'water', 'drainage'], 'poor soil', 'poor-quality', 'ดินไม่ดี', 'poor-quality paraphrase poor · thrive = survive in difficult sites · คำตอบคือ soil'),
      gapQuestion('advanced-ginkgo-p4-q35', 35, 'A chemical in the leaves deters 35 ____ from feeding on the foliage.', 'a compound that discourages insects from eating them', 'insects', ['birds', 'fungi', 'humans'], 'discourages insects from eating', 'deters from feeding on foliage', 'แมลง', 'chemical = compound · deters = discourages · feeding on foliage = eating them · คำตอบคือ insects'),
      gapQuestion('advanced-ginkgo-p4-q36', 36, 'The tree is often chosen for city streets because it can cope with heavy 36 ____.', 'tolerates high levels of pollution', 'pollution', ['noise', 'heat', 'traffic'], 'high levels of pollution', 'cope with heavy', 'มลพิษ', 'cope with heavy paraphrase tolerates high levels of · คำตอบคือ pollution'),
      gapQuestion('advanced-ginkgo-p4-q37', 37, 'Female trees bear fruit that gives off an unpleasant 37 ____.', 'it releases a foul smell', 'smell', ['taste', 'liquid', 'colour'], 'foul smell', 'unpleasant', 'กลิ่นเหม็น', 'gives off an unpleasant paraphrase releases a foul'),
      gapQuestion('advanced-ginkgo-p4-q38', 38, 'Because fallen fruit smells bad, urban planners now grow mainly male specimens to preserve 38 ____.', 'plant male trees almost exclusively, especially in areas where cleanliness is important', 'cleanliness', ['shade', 'growth', 'diversity'], 'cleanliness is important', 'preserve', 'ความสะอาด', 'fallen fruit smells bad = foul smell when fruit falls · male specimens = male trees · preserve = areas where cleanliness is important · คำตอบคือ cleanliness'),
      gapQuestion('advanced-ginkgo-p4-q39', 39, 'Extracts from its leaves are sold as herbal remedies said to boost 39 ____.', 'traditional medicine and are commonly claimed to improve memory', 'memory', ['vision', 'sleep', 'energy'], 'improve memory', 'herbal remedies said to boost', 'ความจำ', 'herbal remedies paraphrase traditional medicine · boost = improve · คำตอบคือ memory'),
      gapQuestion('advanced-ginkgo-p4-q40', 40, 'Prepared correctly, the nuts may appear in a festive 40 ____ on ceremonial days.', 'often added to a traditional soup served on special occasions', 'soup', ['tea', 'cake', 'sauce'], 'traditional soup', 'festive on ceremonial days', 'ซุป', 'festive = traditional · ceremonial days = special occasions · appear in = added to · คำตอบคือ soup')
    ]
  },
  {
    id: 'advanced-listening-repair-cafes-part-3',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 3 - Repair Cafés',
    section: 3,
    levelLabel: 'ADVANCED LISTENING · Part 3 dialogue · target Band 7+',
    audioCacheKey: 'advanced-listening-repair-cafes-part-3',
    audioscript: REPAIR_CAFES_PART3_SCRIPT,
    questions: [
      repairMcQuestion(
        'advanced-repair-cafes-p3-q21',
        21,
        repairBenefitsQuestionText,
        'They stop so many items ending up as waste. I agree.',
        'B',
        repairMcOptions,
        'stop so many items ending up as waste',
        'reducing the amount of electrical waste',
        'ลดขยะไฟฟ้า',
        'keyword ในโจทย์คือ electrical waste ส่วนสคริปต์พูดว่า electrical equipment gets thrown away และ stop items ending up as waste. คำหลอกคือ paid jobs เพราะ Leo บอกว่า not convinced และส่วนใหญ่เป็น volunteers.'
      ),
      repairMcQuestion(
        'advanced-repair-cafes-p3-q22',
        22,
        repairBenefitsQuestionText,
        'People pick up basic repair skills, and that might make them more confident about fixing things next time.',
        'C',
        repairMcOptions,
        'pick up basic repair skills',
        'helping people learn hands-on fixing skills',
        'สอนทักษะซ่อมของจริง',
        'pick up basic repair skills = helping people learn hands-on fixing skills. คำหลอกคือ replace recycling เพราะทั้งคู่บอกว่า unrealistic และ recycling still has a role.'
      ),
      repairMcQuestion(
        'advanced-repair-cafes-p3-q23',
        23,
        repairProblemsQuestionText,
        'finding enough people with the right skills. The same volunteers keep being asked to help, and some of them are getting tired.',
        'A',
        repairProblemOptions,
        'finding enough people with the right skills',
        'too few skilled helpers',
        'มีอาสาสมัครไม่พอ',
        'finding enough people with the right skills = too few skilled helpers. คำหลอกคือ insurance เพราะ policy already covered most events.'
      ),
      repairMcQuestion(
        'advanced-repair-cafes-p3-q24',
        24,
        repairProblemsQuestionText,
        'the other problem is spare parts. Sometimes the repair is simple, but the exact part is impossible to get',
        'D',
        repairProblemOptions,
        'the exact part is impossible to get',
        'problems obtaining replacement components',
        'หาอะไหล่ยาก',
        'replacement components = spare parts และ impossible to get = problems obtaining. คำหลอกคือ unsafe electrical items เพราะ cafés check first and refuse dangerous items.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q25',
        25,
        'Tool-lending libraries',
        'They\'re a good idea, but they don\'t feel new. Lots of towns already have them',
        'D',
        'Lots of towns already have them',
        'no longer a new idea',
        'พบได้ทั่วไปแล้ว',
        'คำเชื่อม but สำคัญ เพราะเปลี่ยนจาก good idea ไปคำตอบจริง: don\'t feel new / already have them = no longer a new idea.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q26',
        26,
        'Mobile repair vans',
        'They could visit villages or housing estates where people don\'t have transport. So they\'d reach people who are excluded',
        'F',
        'reach people who are excluded',
        'serve people usually left out',
        'เข้าถึงคนที่ถูกกันออกจากระบบเดิม',
        'where people don\'t have transport อธิบายกลุ่มที่เข้าไม่ถึง service เดิม และ Leo สรุปว่า reach people who are excluded = serve people usually left out.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q27',
        27,
        'Online booking systems',
        'People may book a slot and then not come, or they might describe the problem badly online. So the results could be disappointing.',
        'B',
        'results could be disappointing',
        'disappointing results',
        'ผลลัพธ์อาจน่าผิดหวัง',
        'คำหลอกคือ article was very enthusiastic แต่คำเชื่อม but/I\'m not sure พาไปข้อเสีย: no-show หรือบรรยายปัญหาผิด จึงตอบ disappointing results.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q28',
        28,
        'Repair lessons in schools',
        'that belongs in formal education, not just weekend clubs',
        'A',
        'belongs in formal education',
        'included in formal education',
        'ควรถูกบรรจุในระบบการศึกษา',
        'belongs in formal education = should be included in formal education. คำว่า not just weekend clubs ช่วยตัดกิจกรรมนอกระบบออก.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q29',
        29,
        'Refurbishing donated laptops',
        'deal with personal data left on the machines, and there might be rules about selling or donating them afterwards',
        'C',
        'personal data ... rules about selling or donating',
        'legal complications',
        'ความซับซ้อนทางกฎหมาย',
        'personal data และ rules about selling/donating เป็น clue ด้านกฎหมาย จึงตอบ legal complications.'
      ),
      repairMatchQuestion(
        'advanced-repair-cafes-p3-q30',
        30,
        'Holding sessions in neighbourhood cafés',
        'People might stay afterwards, talk to others, and feel more connected locally. Exactly. It\'s not just about fixing objects; it could strengthen community relationships.',
        'H',
        'build stronger local ties',
        'strengthen community relationships',
        'ทำให้ความสัมพันธ์ในชุมชนแน่นแฟ้นขึ้น',
        'build stronger local ties = strengthen community relationships. คำว่า not just about fixing objects เป็น transition บอกว่าคำตอบอยู่ที่ผลทางสังคม ไม่ใช่การซ่อมของ.'
      )
    ]
  },
  {
    id: 'advanced-listening-biochar-soil-restoration-part-4',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 4 - Biochar and Soil Restoration',
    section: 4,
    levelLabel: 'ADVANCED LISTENING · Part 4 lecture · target Band 7+',
    audioCacheKey: 'advanced-listening-biochar-soil-restoration-part-4',
    audioscript: BIOCHAR_PART4_SCRIPT,
    questions: [
      biocharGapQuestion('advanced-biochar-p4-q31', 31, 'The material resembles common 31 ____, but is produced specifically for adding to soil.', 'Biochar looks rather like ordinary charcoal', 'charcoal', ['soil', 'fuel', 'ash'], 'ordinary charcoal', 'resembles common produced for adding to soil', 'ถ่านไม้', 'common = ordinary · resembles = looks rather like · produced for adding to soil = made specifically to be added to soil · คำตอบคือ charcoal'),
      biocharGapQuestion('advanced-biochar-p4-q32', 32, 'Scientists traced unusually rich black earth in the 32 ____ to early agricultural practices.', 'very dark and fertile soils in parts of the Amazon. These soils appear to have been created by ancient farming communities', 'Amazon', ['desert', 'Andes', 'forest'], 'parts of the Amazon', 'rich black earth in early agricultural practices', 'แอมะซอน', 'rich black earth = very dark and fertile soils · early agricultural practices = ancient farming communities · คำตอบคือ Amazon'),
      biocharGapQuestion('advanced-biochar-p4-q33', 33, 'Biochar may keep 33 ____ locked in the ground for centuries.', 'it may help to store carbon', 'carbon', ['water', 'nutrients', 'oxygen'], 'store carbon', 'keep locked in the ground', 'คาร์บอน', 'keep locked paraphrase store for hundreds/thousands of years'),
      biocharGapQuestion('advanced-biochar-p4-q34', 34, 'Crop residues are processed with almost no 34 ____ present.', 'heating plant material, such as wood, straw or crop waste, but with very little oxygen', 'oxygen', ['water', 'carbon', 'ash'], 'very little oxygen', 'almost no present', 'ออกซิเจน', 'Crop residues = plant material/crop waste · processed = heated · almost no present = with very little · คำตอบคือ oxygen'),
      biocharGapQuestion('advanced-biochar-p4-q35', 35, 'The structure has countless tiny 35 ____ that retain air and moisture.', 'it contains a huge number of tiny pores. These spaces allow the material to hold water and air', 'pores', ['minerals', 'roots', 'microbes'], 'tiny pores', 'countless tiny that retain air and moisture', 'รูพรุน', 'countless tiny = huge number of tiny · retain = allow the material to hold · moisture = water · คำตอบคือ pores'),
      biocharGapQuestion('advanced-biochar-p4-q36', 36, 'It can stop valuable 36 ____ leaking out of sandy soil during downpours.', 'helps prevent nutrients from being washed away by heavy rain', 'nutrients', ['sand', 'carbon', 'roots'], 'nutrients from being washed away', 'stop valuable leaking out during downpours', 'สารอาหาร', 'leaking out = washed away · downpours = heavy rain · valuable = valuable minerals in sandy soils · คำตอบคือ nutrients'),
      biocharGapQuestion('advanced-biochar-p4-q37', 37, 'In dry spells, enriched soil retains more 37 ____ near the root zone.', 'During dry periods, soils containing biochar may keep more moisture near the roots of plants', 'moisture', ['oxygen', 'heat', 'carbon'], 'keep more moisture', 'In dry spells retains more near root zone', 'ความชื้น', 'dry spells = dry periods · retains = keep · near the root zone = near the roots of plants · คำตอบคือ moisture'),
      biocharGapQuestion('advanced-biochar-p4-q38', 38, 'Tiny spaces inside biochar offer a home for helpful 38 ____.', 'provide shelter for microbes, including bacteria and fungi', 'microbes', ['plants', 'insects', 'chemicals'], 'shelter for microbes', 'offer a home for helpful', 'จุลินทรีย์', 'offer a home paraphrase provide shelter'),
      biocharGapQuestion('advanced-biochar-p4-q39', 39, 'If manufacturing 39 ____ climb too high, desired traits may disappear.', 'If the production temperatures are too high, some of the useful chemical properties may be lost', 'temperatures', ['costs', 'methods', 'volumes'], 'production temperatures are too high', 'manufacturing climb too high desired traits disappear', 'อุณหภูมิ', 'manufacturing = production · climb too high = are too high · desired traits disappear = useful chemical properties may be lost · คำตอบคือ temperatures'),
      biocharGapQuestion('advanced-biochar-p4-q40', 40, 'Untested waste inputs may lead to soil 40 ____.', 'If these are not tested carefully, the final product could cause contamination', 'contamination', ['erosion', 'pollution', 'decay'], 'cause contamination', 'Untested waste inputs', 'การปนเปื้อน', 'not tested carefully paraphrase untested waste inputs')
    ]
  },
  {
    id: 'advanced-listening-textile-recycling-part-3',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 3 - Textile Recycling',
    section: 3,
    levelLabel: 'ADVANCED LISTENING · Part 3 dialogue · target Band 7+',
    audioCacheKey: 'advanced-listening-textile-recycling-part-3',
    audioscript: TEXTILE_RECYCLING_PART3_SCRIPT,
    questions: [
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q21',
        21,
        'At first, Arun thought the topic of textile recycling might be too',
        'I thought textile recycling might be too broad for our presentation: clothes, curtains, carpets, shoes, all sorts of things.',
        'B',
        [
          { key: 'A', text: 'technical.' },
          { key: 'B', text: 'too wide-ranging.' },
          { key: 'C', text: 'familiar.' }
        ],
        'too broad for our presentation',
        'too wide-ranging',
        'กว้างเกินไป',
        'too wide-ranging = too broad. Arun พูดรายการ clothes, curtains, carpets, shoes เพื่ออธิบายว่าหัวข้อกว้างเกินไป ไม่ใช่คำตอบอื่น.'
      ),
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q22',
        22,
        'When discussing fast fashion, Leah and Arun disagree about',
        'you said earlier that young people are mostly responsible, and I\'m not sure that\'s fair. Maybe, but adults order just as much online. The problem is wider than one age group.',
        'C',
        [
          { key: 'A', text: 'whether cheap clothes are usually badly made.' },
          { key: 'B', text: 'whether low prices encourage waste.' },
          { key: 'C', text: 'whether younger consumers cause most of it.' }
        ],
        'young people are mostly responsible',
        'younger consumers cause most of it',
        'คนหนุ่มสาวเป็นสาเหตุหลัก',
        'younger consumers cause most of it = young people are mostly responsible. คำหลอกคือ cheap clothes และ low prices เพราะสองคนนั้นเห็นด้วยว่าราคาถูกทำให้ทิ้งง่าย.'
      ),
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q23',
        23,
        'Leah says she sometimes donates clothes because',
        'It\'s more because I buy things online and the size isn\'t quite right. I mean to return them, but then I miss the deadline.',
        'A',
        [
          { key: 'A', text: 'a delivery purchase did not fit.' },
          { key: 'B', text: 'she no longer needs them for sport.' },
          { key: 'C', text: 'her friends have similar clothes.' }
        ],
        'buy things online and the size isn\'t quite right',
        'delivery purchase did not fit',
        'สั่งออนไลน์แล้วไซซ์ไม่พอดี',
        'because ในโจทย์ตรงกับ because ในสคริปต์ และ delivery purchase did not fit = buy things online and the size isn\'t quite right. คำหลอกคือ out of fashion เพราะ Arun ถาม แต่ Leah ปฏิเสธว่า Not usually.'
      ),
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q24',
        24,
        'What statistic in the article confused Arun?',
        'The number of clothing banks has increased, but the percentage of clothing that actually gets reused has fallen.',
        'B',
        [
          { key: 'A', text: 'More clothes are now bought online than in shops.' },
          { key: 'B', text: 'A smaller share gets a second life although more drop-off points exist.' },
          { key: 'C', text: 'Manufacturing costs have fallen in recent years.' }
        ],
        'clothing banks has increased, but the percentage ... reused has fallen',
        'smaller share gets a second life although more drop-off points exist',
        'มีจุดรับบริจาคมากขึ้นแต่เสื้อผ้าถูกใช้ซ้ำน้อยลง',
        'smaller share gets a second life = percentage reused has fallen และ more drop-off points = clothing banks has increased. คำว่า but เป็น transition สำคัญที่ทำให้เห็นความขัดแย้งในสถิติ.'
      ),
      matchQuestionFor(TEXTILE_RECYCLING_PART3_SCRIPT, textileSortingOptions, textileSortingQuestionText, 'advanced-textile-recycling-p3-q25', 25, 'winter coat', 'the main zip wouldn\'t close. That made it impossible to sell.', 'D', 'zip wouldn\'t close', 'fastening would not close', 'ซิปเสีย', 'fastening would not close = zip wouldn\'t close. คำหลอกคือ fabric was clean แปลว่าไม่ใช่ stained.'),
      matchQuestionFor(TEXTILE_RECYCLING_PART3_SCRIPT, textileSortingOptions, textileSortingQuestionText, 'advanced-textile-recycling-p3-q26', 26, 'cotton curtains', 'Those had paint marks across one side. The fabric itself was strong, but the stains were too obvious.', 'A', 'stains were too obvious', 'very visible marks', 'ผ้าเปื้อนมากเกินไป', 'paint marks และ stains were too obvious = very visible marks. คำหลอกคือ fabric itself was strong เพราะไม่ได้ถูกปฏิเสธเพราะวัสดุเสีย.'),
      matchQuestionFor(TEXTILE_RECYCLING_PART3_SCRIPT, textileSortingOptions, textileSortingQuestionText, 'advanced-textile-recycling-p3-q27', 27, 'wool jumper', 'It had shrunk so much that the sleeves were far too short.', 'C', 'shrunk so much', 'garment had become too small', 'วัสดุหด', 'garment had become too small = shrunk so much.'),
      matchQuestionFor(TEXTILE_RECYCLING_PART3_SCRIPT, textileSortingOptions, textileSortingQuestionText, 'advanced-textile-recycling-p3-q28', 28, 'sports bag', 'it was still wet when it arrived, so they rejected it straight away.', 'E', 'still wet when it arrived', 'item was not dry', 'ของชื้น/เปียก', 'not dry = still wet. คำว่า rejected it straight away ยืนยันว่าเป็นเหตุผลที่ถูกปฏิเสธ.'),
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q29',
        29,
        'Why did the project to make new clothes from old fabric fail?',
        'The problem was that the pieces of fabric they received were too inconsistent: different weights, different colours, different levels of wear.',
        'A',
        [
          { key: 'A', text: 'The supplied materials varied too much.' },
          { key: 'B', text: 'Customers disliked the recycled label.' },
          { key: 'C', text: 'Designers found the process too slow.' }
        ],
        'fabric ... too inconsistent',
        'supplied materials varied too much',
        'วัสดุที่ได้มาไม่สม่ำเสมอ',
        'supplied materials varied too much = pieces of fabric were too inconsistent. คำหลอกคือ customers disliked เพราะสคริปต์บอก customers were actually open to that.'
      ),
      choiceQuestionFor(
        TEXTILE_RECYCLING_PART3_SCRIPT,
        'advanced-textile-recycling-p3-q30',
        30,
        'Leah and Arun agree that their presentation should focus on',
        'The interesting part is what happens after people donate clothes: sorting, rejection, reuse, export, landfill. Yes, that\'s the hidden process most people know nothing about.',
        'A',
        [
          { key: 'A', text: 'the hidden journey after donation.' },
          { key: 'B', text: 'the behaviour of individual shoppers.' },
          { key: 'C', text: 'the environmental policies of fashion brands.' }
        ],
        'what happens after people donate clothes',
        'focus on the hidden journey after donation',
        'สิ่งที่เกิดขึ้นหลังบริจาคเสื้อผ้า',
        'hidden journey after donation = what happens after people donate clothes. Agree เห็นจาก Leah ตอบ Yes หลัง Arun สรุป focus. คำหลอกคือ shoppers และ fashion brands เพราะทั้งคู่บอกว่า shouldn\'t just talk about those.'
      )
    ]
  },
  {
    id: 'advanced-listening-vertical-farming-part-4',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 4 - Vertical Farming',
    section: 4,
    levelLabel: 'ADVANCED LISTENING · Part 4 lecture · target Band 7+',
    audioCacheKey: 'advanced-listening-vertical-farming-part-4',
    audioscript: VERTICAL_FARMING_PART4_SCRIPT,
    questions: [
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q31', 31, 'In this method, plants are arranged in multiple 31 ____ inside buildings.', 'crops are grown indoors in stacked layers', 'layers', ['buildings', 'fields', 'trays'], 'stacked layers', 'arranged in multiple inside buildings', 'ชั้น', 'multiple layers = stacked layers · inside buildings = grown indoors · คำตอบคือ layers'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q32', 32, 'Facilities are often set up in disused 32 ____ where city land is costly.', 'Many vertical farms are established in unused warehouses', 'warehouses', ['cities', 'factories', 'markets'], 'unused warehouses', 'disused where city land is costly', 'โกดัง', 'disused = unused · set up = established · costly city land = cities where land is expensive · คำตอบคือ warehouses'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q33', 33, 'Without sunlight, crops rely on synthetic 33 ____ supplied by LED units.', 'they are given artificial light, usually from LED systems', 'light', ['heat', 'water', 'energy'], 'artificial light', 'synthetic supplied by LED units', 'แสง', 'synthetic = artificial · rely on = given · LED units = LED systems · คำตอบคือ light'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q34', 34, 'The plant base develops in mineral-rich 34 ____ rather than soil.', 'Their roots grow in nutrient-rich water', 'water', ['soil', 'air', 'liquid'], 'nutrient-rich water', 'plant base develops in mineral-rich rather than soil', 'น้ำ', 'plant base develops = roots grow · mineral-rich paraphrase nutrient-rich และ not in soil'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q35', 35, 'Automated controls measure air 35 ____ along with heat levels.', 'Computer systems monitor humidity and temperature', 'humidity', ['light', 'growth', 'water'], 'humidity and temperature', 'measure air along with heat levels', 'ความชื้นในอากาศ', 'Automated controls = Computer systems · measure = monitor · heat levels = temperature · คำตอบก่อน temperature คือ humidity'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q36', 36, 'Because pests are easier to control indoors, growers use a smaller amount of 36 ____.', 'farmers often need far fewer pesticides than they would in outdoor agriculture', 'pesticides', ['soil', 'workers', 'machines'], 'far fewer pesticides', 'growers use a smaller amount indoors', 'ยาฆ่าแมลง', 'growers = farmers · use a smaller amount = need far fewer · คำตอบคือ pesticides'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q37', 37, 'Growing food near buyers reduces the need for lengthy food 37 ____.', 'there is less need for long-distance transport from rural farms to city supermarkets', 'transport', ['distance', 'costs', 'waste'], 'long-distance transport', 'lengthy food reduces need for', 'การขนส่ง', 'near buyers = close to people who buy it · lengthy food = long-distance · reduces need = less need for · คำตอบคือ transport'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q38', 38, 'Production requires large amounts of 38 ____.', 'the amount of electricity needed for lighting, heating, cooling and computer control systems', 'electricity', ['lighting', 'energy', 'equipment'], 'electricity needed', 'large amounts of', 'ไฟฟ้า', 'large amounts paraphrase amount needed for lighting/heating/cooling'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q39', 39, 'Leafy produce succeeds indoors, but staples like 39 ____ rarely turn a profit.', 'crops such as wheat are much harder to produce profitably', 'wheat', ['lettuce', 'vegetables', 'rice'], 'wheat harder to produce profitably', 'staples like rarely turn a profit', 'ข้าวสาลี', 'Leafy produce = salad crops · staples = wheat-type crops · rarely turn a profit = harder to produce profitably · คำตอบคือ wheat'),
      gapQuestionFor(VERTICAL_FARMING_PART4_SCRIPT, 'advanced-vertical-farming-p4-q40', 40, 'Without stable 40 ____ with retail partners, covering equipment costs is difficult.', 'vertical farms need reliable contracts with supermarkets, restaurants or other buyers', 'contracts', ['markets', 'customers', 'prices'], 'reliable contracts with buyers', 'Without stable with retail partners', 'สัญญา', 'Without stable = need reliable · retail partners = supermarkets, restaurants or other buyers · คำตอบคือ contracts')
    ]
  },
  {
    id: 'advanced-listening-sleep-university-life-part-3',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 3 - Sleep and University Life',
    section: 3,
    levelLabel: 'ADVANCED LISTENING · Part 3 dialogue · target Band 7+',
    audioCacheKey: 'advanced-listening-sleep-university-life-part-3',
    audioscript: SLEEP_UNIVERSITY_PART3_SCRIPT,
    questions: [
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q21', 21, 'Which TWO factors do the students both believe are major causes of poor sleep among university students?', 'Screen use seems much more significant. Students work on laptops, message friends, and watch videos late at night. Yes, and the light from screens can delay sleep.', 'A', sleepCauseOptions, 'Screen use seems much more significant', 'late-night screen use', 'ใช้หน้าจอตอนดึก', 'both believe เห็นจาก Dana ตอบ Yes หลัง Sam พูด screen use. คำหลอกคือ noisy accommodation เพราะ studies did not treat it as major.', sleepCauseQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q22', 22, 'Which TWO factors do the students both believe are major causes of poor sleep among university students?', 'Students who work evening shifts often get home late and then still have assignments to finish. I agree.', 'C', sleepCauseOptions, 'work evening shifts', 'part-time employment', 'งานพาร์ตไทม์', 'part-time employment ถูก paraphrase เป็น work evening shifts. I agree เป็น consensus marker ว่าทั้งคู่เห็นด้วย.', sleepCauseQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q23', 23, 'Which TWO effects of poor sleep do the students agree are supported by strong evidence?', 'students who slept badly found it harder to focus in seminars and lectures', 'A', sleepEffectOptions, 'harder to focus', 'reduced concentration', 'สมาธิลดลง', 'harder to focus = reduced concentration. คำหลอกคือ creativity เพราะ Sam บอก claim นั้น doubtful.', sleepEffectQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q24', 24, 'Which TWO effects of poor sleep do the students agree are supported by strong evidence?', 'The stronger evidence is about memory. Sleep seems to help students process and store what they\'ve learned.', 'C', sleepEffectOptions, 'stronger evidence is about memory', 'poorer memory', 'ความจำแย่ลง', 'stronger evidence เป็น key phrase ตรงกับ supported by strong evidence และ memory ตรงกับ poorer memory.', sleepEffectQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q25', 25, 'Which TWO opinions do the students both express about sleep-tracking apps?', 'they might make some people anxious. If students keep checking their sleep score every morning, they may become stressed about it. I thought the same.', 'A', sleepAppOptions, 'make some people anxious', 'increase worry about rest', 'ทำให้ผู้ใช้กังวล', 'increase worry = make anxious/stressed. I thought the same แสดงว่าทั้งคู่เห็นด้วย.', sleepAppQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q26', 26, 'Which TWO opinions do the students both express about sleep-tracking apps?', 'more independent research is needed. A lot of the evidence comes from the companies that make the apps. Yes, that\'s a really important point.', 'E', sleepAppOptions, 'more independent research is needed', 'more impartial studies are required', 'ต้องมีงานวิจัยอิสระเพิ่ม', 'impartial studies = independent research และ required = needed. คำหลอกคือ cost เพราะ Dana บอก cost is not the main issue.', sleepAppQuestionText),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q27', 27, 'When discussing the term "sleep hygiene", the students decide to', 'We could define it first, then give examples like having a regular bedtime and avoiding screens late at night. That makes sense.', 'B', [
        { key: 'A', text: 'avoid it because it sounds too technical.' },
        { key: 'B', text: 'define it before giving examples.' },
        { key: 'C', text: 'use it only at the end of the presentation.' }
      ], 'define it first, then give examples', 'define it before giving examples', 'นิยามก่อนแล้วยกตัวอย่าง', 'คำหลอกคือ it sounds strange แต่หลัง True, but พาไปคำตอบจริง: define it first, then give examples.'),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q28', 28, 'Why do the students decide to start with a personal example?', 'Most students will recognise that situation, even if they don\'t talk about it.', 'A', [
        { key: 'A', text: 'to make the topic relatable for students' },
        { key: 'B', text: 'to show that sleep problems affect grades' },
        { key: 'C', text: 'to criticise university accommodation' }
      ], 'Most students will recognise that situation', 'make the topic relatable', 'ทำให้หัวข้อใกล้ตัวนักศึกษา', 'recognise that situation = relatable. คำหลอกคือ grades/accommodation เพราะไม่ได้เป็นเหตุผลในการเริ่มด้วย personal example.'),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q29', 29, 'The students agree that daytime naps are useful only if', 'short naps can help, but long ones can make it harder to sleep at night. So the key point is that naps are useful only if they aren\'t too long.', 'A', [
        { key: 'A', text: 'they are not too long.' },
        { key: 'B', text: 'they happen in the evening.' },
        { key: 'C', text: 'they replace a full night\'s sleep.' }
      ], 'aren\'t too long', 'not too long', 'ไม่ยาวเกินไป', 'คำว่า but หลัง short naps can help ตัด long naps ออก และสรุปตรงว่า only if they aren\'t too long.'),
      choiceQuestionFor(SLEEP_UNIVERSITY_PART3_SCRIPT, 'advanced-sleep-university-p3-q30', 30, 'What surprises the students about university advice on sleep?', 'The health centre says one thing, academic departments say another, and accommodation teams send different information again. Yes, it\'s not coordinated.', 'A', [
        { key: 'A', text: 'It is not coordinated across departments.' },
        { key: 'B', text: 'It focuses too much on diet.' },
        { key: 'C', text: 'It is based on old research.' }
      ], 'not coordinated', 'not coordinated across departments', 'ไม่ประสานกันระหว่างหน่วยงาน', 'ตัวอย่าง health centre / academic departments / accommodation teams ชี้ว่า advice มาจากหลายฝ่าย และ Sam สรุปว่า not coordinated.')
    ]
  },
  {
    id: 'advanced-listening-seed-banks-crop-diversity-part-4',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 4 - Seed Banks and Crop Diversity',
    section: 4,
    levelLabel: 'ADVANCED LISTENING · Part 4 lecture · target Band 7+',
    audioCacheKey: 'advanced-listening-seed-banks-crop-diversity-part-4',
    audioscript: SEED_BANKS_PART4_SCRIPT,
    questions: [
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q31', 31, 'These collections help safeguard crop 31 ____ for the future.', 'One of its main purposes is to protect agricultural diversity', 'diversity', ['seeds', 'crops', 'farming'], 'protect agricultural diversity', 'safeguard crop for the future', 'ความหลากหลาย', 'safeguard = protect · crop diversity = agricultural diversity · คำตอบคือ diversity'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q32', 32, 'Traditional crop 32 ____ may be lost when growers switch to mass-market produce.', 'when farmers change to commercial crops, these older varieties may disappear', 'varieties', ['seeds', 'plants', 'species'], 'older varieties may disappear', 'Traditional crop may be lost when growers switch to mass-market produce', 'สายพันธุ์ท้องถิ่น', 'Traditional crop = older varieties · growers switch = farmers change · mass-market produce = commercial crops · may be lost = may disappear · คำตอบคือ varieties'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q33', 33, 'Before storage, each batch is treated to get rid of 33 ____.', 'seeds are cleaned and dried to remove moisture', 'moisture', ['water', 'dust', 'insects'], 'remove moisture', 'Before storage treated to get rid of', 'ความชื้น', 'each batch = seeds · treated to get rid of = cleaned and dried to remove · คำตอบคือ moisture'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q34', 34, 'Refrigeration slows ageing by keeping samples at a reduced 34 ____.', 'most seeds are kept at a low temperature', 'temperature', ['level', 'humidity', 'pressure'], 'low temperature', 'Refrigeration slows ageing at reduced', 'อุณหภูมิ', 'Refrigeration = kept at low temperature · slows ageing = slows down the natural ageing process · reduced = low · คำตอบคือ temperature'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q35', 35, 'Every batch goes into airtight 35 ____.', 'Each seed sample is placed in sealed containers', 'containers', ['bags', 'rooms', 'boxes'], 'sealed containers', 'airtight', 'ภาชนะบรรจุ', 'Every batch = Each seed sample · airtight paraphrase sealed containers'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q36', 36, 'Archived material can help when harvests are hit by 36 ____.', 'If a crop is damaged by disease, researchers can search stored collections', 'disease', ['drought', 'floods', 'insects'], 'damaged by disease', 'Archived material help when harvests are hit by', 'โรค', 'Archived material = stored collections · harvests are hit by = crop is damaged by · คำตอบคือ disease'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q37', 37, 'Breeding work aims to increase 37 ____ to lack of rainfall in new plants.', 'Plant breeders also use seed banks to develop crops with greater resistance to drought', 'resistance', ['protection', 'tolerance', 'diversity'], 'greater resistance to drought', 'increase to lack of rainfall in new plants', 'ความต้านทาน', 'Breeding work = Plant breeders develop · lack of rainfall paraphrase drought — คำตอบคือ resistance ไม่ใช่ drought'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q38', 38, 'Deposits can help growers rebuild after catastrophes such as 38 ____.', 'support farmers after extreme events such as floods, when stored seed for the next planting season may have been destroyed', 'floods', ['storms', 'disease', 'fires'], 'extreme events such as floods', 'rebuild after catastrophes such as', 'น้ำท่วม', 'Deposits = seed banks · growers = farmers · catastrophes = extreme events · คำตอบคือ floods'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q39', 39, 'Some tropical species perish if the 39 ____ step is applied during preparation.', 'Some seeds are difficult to store because they cannot survive drying', 'drying', ['storage', 'testing', 'freezing'], 'cannot survive drying', 'perish if step is applied', 'การทำให้แห้ง', 'perish = cannot survive · drying step = drying during storage prep · คำหลอกคือ storage เพราะเป็นหัวข้อใหญ่ · คำตอบคือ drying'),
      gapQuestionFor(SEED_BANKS_PART4_SCRIPT, 'advanced-seed-banks-p4-q40', 40, 'Routine 40 ____ checks if archived seeds remain able to sprout.', 'Banks must carry out regular testing to check whether samples can still germinate', 'testing', ['collection', 'drying', 'cataloguing'], 'regular testing', 'Routine checks if remain able to sprout', 'การทดสอบ', 'Routine = regular · archived seeds = stored samples · sprout = germinate · checks = check whether · คำตอบคือ testing')
    ]
  },
  {
    id: 'advanced-listening-community-gardens-part-3',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 3 - Community Gardens',
    section: 3,
    levelLabel: 'ADVANCED LISTENING · Part 3 dialogue · target Band 7+',
    audioCacheKey: 'advanced-listening-community-gardens-part-3',
    audioscript: COMMUNITY_GARDENS_PART3_SCRIPT,
    questions: [
      choiceQuestionFor(COMMUNITY_GARDENS_PART3_SCRIPT, 'advanced-community-gardens-p3-q21', 21, 'Which TWO advantages of community gardens do the students agree are most important?', 'What seemed more important was the way people learn practical skills. Some residents had never grown anything before, and now they know about planting, watering and composting. I agree.', 'B', communityBenefitOptions, 'learn practical skills', 'hands-on growing skills', 'ทักษะการทำสวนจริง', 'hands-on growing skills = practical gardening skills. I agree ยืนยันว่าทั้งคู่เห็นด้วย.', communityBenefitsQuestionText),
      choiceQuestionFor(COMMUNITY_GARDENS_PART3_SCRIPT, 'advanced-community-gardens-p3-q22', 22, 'Which TWO advantages of community gardens do the students agree are most important?', 'the other big benefit is social. People who had lived in the same street for years finally started talking to each other. Yes, that was convincing.', 'D', communityBenefitOptions, 'people ... finally started talking to each other', 'stronger neighbour connections', 'ความสัมพันธ์ระหว่างเพื่อนบ้านดีขึ้น', 'stronger neighbour connections = improve relationships between neighbours. คำว่า Yes เป็น agreement marker.', communityBenefitsQuestionText),
      choiceQuestionFor(COMMUNITY_GARDENS_PART3_SCRIPT, 'advanced-community-gardens-p3-q23', 23, 'Which TWO problems do the students agree community gardens often face?', 'Some gardens begin with a grant, but after two or three years they struggle to pay for water, insurance and equipment. Yes, that\'s a serious issue.', 'A', communityProblemOptions, 'struggle to pay for water, insurance and equipment', 'lack of long-term funding', 'ขาดเงินทุนระยะยาว', 'begin with a grant แต่หลังสองสามปี struggle to pay = lack of long-term funding. คำว่า serious issue ยืนยันว่าเป็นปัญหาหลัก.', communityProblemsQuestionText),
      choiceQuestionFor(COMMUNITY_GARDENS_PART3_SCRIPT, 'advanced-community-gardens-p3-q24', 24, 'Which TWO problems do the students agree community gardens often face?', 'Getting permission to use land seems more difficult. If the land belongs to the council or a private owner, groups may wait months before they can start. Agreed.', 'D', communityProblemOptions, 'Getting permission to use land seems more difficult', 'difficulty obtaining land approval', 'ขออนุญาตใช้ที่ดินยาก', 'obtaining land approval = getting permission to use land. Agreed เป็น consensus marker. คำหลอกคือ soil quality เพราะแก้ด้วย raised beds ได้.', communityProblemsQuestionText),
      matchQuestionFor(COMMUNITY_GARDENS_PART3_SCRIPT, communityIdeaOptions, communityIdeaQuestionText, 'advanced-community-gardens-p3-q25', 25, 'evening gardening sessions', 'People who work during the day could come after work, so it would attract people who don\'t usually take part.', 'A', 'attract people who don\'t usually take part', 'attract people who do not usually take part', 'ดึงดูดคนที่ปกติไม่เข้าร่วม', 'after work อธิบายกลุ่มที่มาไม่ได้ตอนกลางวัน และสรุปตรงว่า attract people who do not usually take part.'),
      matchQuestionFor(COMMUNITY_GARDENS_PART3_SCRIPT, communityIdeaOptions, communityIdeaQuestionText, 'advanced-community-gardens-p3-q26', 26, 'shared tool cupboards', 'there need to be rules. Tools can go missing, or people may not return them clean. So clearer rules are needed.', 'F', 'clearer rules are needed', 'needs clearer rules', 'ต้องมีกฎชัดเจนขึ้น', 'Useful เป็นคำหลอกเชิงบวก แต่หลัง but พาไปคำตอบจริงว่า need clearer rules.'),
      matchQuestionFor(COMMUNITY_GARDENS_PART3_SCRIPT, communityIdeaOptions, communityIdeaQuestionText, 'advanced-community-gardens-p3-q27', 27, 'cooking events using garden produce', 'people cooked together and exchanged recipes. It seems to help people learn from each other.', 'G', 'help people learn from each other', 'help people learn from each other', 'ช่วยให้คนเรียนรู้จากกันและกัน', 'exchanged recipes เป็นตัวอย่าง และคำตอบตรงคือ help people learn from each other.'),
      matchQuestionFor(COMMUNITY_GARDENS_PART3_SCRIPT, communityIdeaOptions, communityIdeaQuestionText, 'advanced-community-gardens-p3-q28', 28, 'school vegetable plots', 'I think schools should organise those. Teachers can connect them with science lessons and healthy eating.', 'C', 'schools should organise those', 'schools responsible for this', 'ควรจัดโดยโรงเรียน', 'Schools should be responsible for this = schools should organise those. Teachers เป็น clue เสริม.'),
      matchQuestionFor(COMMUNITY_GARDENS_PART3_SCRIPT, communityIdeaOptions, communityIdeaQuestionText, 'advanced-community-gardens-p3-q29', 29, 'selling produce to restaurants', 'Once money becomes the main focus, the garden may stop being a community space. So it could damage the original purpose.', 'H', 'damage the original purpose', 'undermine the original aim', 'ทำลายจุดประสงค์เดิมของสวน', 'undermine the original aim = damage the original purpose.'),
      matchQuestionFor(COMMUNITY_GARDENS_PART3_SCRIPT, communityIdeaOptions, communityIdeaQuestionText, 'advanced-community-gardens-p3-q30', 30, 'online advice groups', 'several gardens already use them well. People post photos of plant diseases or ask when to harvest things. Yes, that already seems to be successful.', 'E', 'already seems to be successful', 'appears to be working already', 'ดูเหมือนสำเร็จอยู่แล้ว', 'appears to be working already = already seems to be successful.')
    ]
  },
  {
    id: 'advanced-listening-coral-reef-restoration-part-4',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 4 - Coral Reef Restoration',
    section: 4,
    levelLabel: 'ADVANCED LISTENING · Part 4 lecture · target Band 7+',
    audioCacheKey: 'advanced-listening-coral-reef-restoration-part-4',
    audioscript: CORAL_REEF_PART4_SCRIPT,
    questions: [
      gapQuestionFor(CORAL_REEF_PART4_SCRIPT, 'advanced-coral-reef-p4-q31', 31, 'Reefs are home to a wide range of ocean 31 ____.', 'support such a high level of marine diversity', 'diversity', ['life', 'animals', 'shelter'], 'high level of marine diversity', 'wide range of ocean', 'ความหลากหลายทางทะเล', 'ocean = marine · wide range paraphrase high level of marine diversity'),
      gapQuestionFor(CORAL_REEF_PART4_SCRIPT, 'advanced-coral-reef-p4-q32', 32, 'Shorelines gain protection when reefs weaken incoming 32 ____.', 'the structure of the reef reduces the force of the waves before they reach land', 'waves', ['storms', 'water', 'wind'], 'reduces the force of the waves', 'weaken incoming', 'คลื่น', 'Shorelines gain protection = protect coastal areas · weaken incoming = reduces the force of the waves · คำตอบคือ waves'),
      gapQuestionFor(CORAL_REEF_PART4_SCRIPT, 'advanced-coral-reef-p4-q33', 33, 'Loss of coral colour has been connected with hotter 33 ____ in the sea.', 'Bleaching is often linked to warmer water', 'water', ['weather', 'oceans', 'temperatures'], 'linked to warmer water', 'Loss of colour connected with hotter in the sea', 'น้ำ', 'Loss of coral colour = bleaching · connected with = linked to · hotter = warmer · คำตอบคือ water'),
      gapQuestionFor(CORAL_REEF_PART4_SCRIPT, 'advanced-coral-reef-p4-q34', 34, 'Young corals are grown in submerged 34 ____ before being moved to damaged areas.', 'growing small pieces of coral in underwater nurseries', 'nurseries', ['gardens', 'frames', 'cages'], 'underwater nurseries', 'submerged before being moved to damaged areas', 'แหล่งเพาะเลี้ยง', 'Young corals = small pieces of coral · submerged = underwater · before being moved = before they are moved back to damaged reefs · คำตอบคือ nurseries'),
      gapQuestionFor(CORAL_REEF_PART4_SCRIPT, 'advanced-coral-reef-p4-q35', 35, 'Broken reefs may be rebuilt using steel 35 ____.', 'scientists may use metal frames. These create a stable structure', 'frames', ['cages', 'tools', 'pipes'], 'metal frames', 'rebuilt using steel', 'โครงโลหะ', 'rebuilt using steel paraphrase use metal frames'),
      gapQuestionFor(CORAL_REEF_PART4_SCRIPT, 'advanced-coral-reef-p4-q36', 36, 'Underwater workers use a particular 36 ____ to fix coral pieces in place.', 'divers use a special glue to hold the fragments in position', 'glue', ['ropes', 'cement', 'clips'], 'special glue', 'Underwater workers use particular to fix in place', 'กาว', 'Underwater workers = divers · coral pieces = fragments · fix in place = hold in position · คำตอบคือ glue'),
      gapQuestionFor(CORAL_REEF_PART4_SCRIPT, 'advanced-coral-reef-p4-q37', 37, 'New transplants are fragile and may be wrecked by 37 ____.', 'Young corals are delicate, and storms can break or bury them', 'storms', ['divers', 'boats', 'waves'], 'storms can break or bury them', 'fragile and may be wrecked by', 'พายุ', 'New transplants = Young corals · fragile = delicate · wrecked = break or bury · คำตอบคือ storms'),
      gapQuestionFor(CORAL_REEF_PART4_SCRIPT, 'advanced-coral-reef-p4-q38', 38, 'Runoff pollution can cause 38 ____ to colonise the reef surface.', 'If too many nutrients enter the water, algae may grow quickly and cover the reef', 'algae', ['plants', 'bacteria', 'organisms'], 'algae may grow quickly', 'Runoff pollution cause to colonise reef surface', 'สาหร่าย', 'Runoff pollution = too many nutrients enter the water · colonise the reef surface = grow quickly and cover the reef · คำตอบคือ algae'),
      gapQuestionFor(CORAL_REEF_PART4_SCRIPT, 'advanced-coral-reef-p4-q39', 39, 'Restoration is costly because it depends on trained 39 ____.', 'It requires boats, diving equipment and skilled divers who can work carefully underwater', 'divers', ['scientists', 'workers', 'teams'], 'skilled divers', 'depends on trained', 'นักดำน้ำ', 'trained paraphrase skilled divers'),
      gapQuestionFor(CORAL_REEF_PART4_SCRIPT, 'advanced-coral-reef-p4-q40', 40, 'Research targets strains with stronger 40 ____ to rising ocean heat.', 'studying corals that show greater heat tolerance', 'tolerance', ['resistance', 'protection', 'survival'], 'greater heat tolerance', 'stronger to rising ocean heat', 'ความทนทาน', 'strains = corals · stronger = greater · rising ocean heat = heat tolerance context · คำตอบคือ tolerance')
    ]
  },
  {
    id: 'advanced-listening-digital-note-taking-part-3',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 3 - Digital Note-Taking',
    section: 3,
    levelLabel: 'ADVANCED LISTENING · Part 3 dialogue · target Band 7+',
    audioCacheKey: 'advanced-listening-digital-note-taking-part-3',
    audioscript: DIGITAL_NOTE_TAKING_PART3_SCRIPT,
    questions: [
      choiceQuestionFor(DIGITAL_NOTE_TAKING_PART3_SCRIPT, 'advanced-digital-note-taking-p3-q21', 21, 'At first, Ravi thought digital note-taking would be', 'I thought the topic might be too ordinary, everyone already knows students use laptops and tablets.', 'A', [
        { key: 'A', text: 'not original enough as a research topic.' },
        { key: 'B', text: 'too difficult to test fairly.' },
        { key: 'C', text: 'too technical for their audience.' }
      ], 'too ordinary', 'not original enough as a research topic', 'ธรรมดาเกินไปเป็นหัวข้อวิจัย', 'not original enough = too ordinary. At first เป็น signal และ Ravi พูดว่า might be too ordinary. คำหลอกคือ technical เพราะพูดถึง laptops/tablets แต่ไม่ได้บอกว่ายากเชิงเทคนิค.'),
      choiceQuestionFor(DIGITAL_NOTE_TAKING_PART3_SCRIPT, 'advanced-digital-note-taking-p3-q22', 22, 'When discussing laptops in lectures, Emma and Ravi disagree about', 'I think laptops can distract people sitting nearby ... I\'m not sure that\'s a major problem.', 'B', [
        { key: 'A', text: 'whether they help students organise information.' },
        { key: 'B', text: 'whether they distract other students nearby.' },
        { key: 'C', text: 'whether they are suitable for first-year students.' }
      ], 'distract people sitting nearby', 'distract other students nearby', 'รบกวนนักศึกษาคนข้างๆ', 'disagree ต้องจับจุดที่ Emma บอก I\'m not sure หลัง Ravi พูด distract nearby. ทั้งคู่ไม่ได้เถียงเรื่อง organisation เพราะ Ravi บอก I agree.'),
      choiceQuestionFor(DIGITAL_NOTE_TAKING_PART3_SCRIPT, 'advanced-digital-note-taking-p3-q23', 23, 'Emma says she sometimes takes handwritten notes because', 'If the lecturer draws a process or a diagram, I remember it better when I draw it myself.', 'B', [
        { key: 'A', text: 'her laptop battery runs out.' },
        { key: 'B', text: 'she remembers diagrams better that way.' },
        { key: 'C', text: 'she can write faster than she can type.' }
      ], 'remember it better when I draw it myself', 'remembers diagrams better', 'จำแผนภาพได้ดีกว่า', 'because ในคำถามตรงกับเหตุผลเรื่อง diagram/process. คำหลอกคือ faster เพราะทั้งคู่บอก handwriting ช้ากว่า.'),
      choiceQuestionFor(DIGITAL_NOTE_TAKING_PART3_SCRIPT, 'advanced-digital-note-taking-p3-q24', 24, 'What finding in the article surprised Ravi?', 'Students who typed notes often wrote down more words, but that didn\'t always mean they understood the lecture better.', 'A', [
        { key: 'A', text: 'Students who typed more words did not always understand more.' },
        { key: 'B', text: 'Students using tablets were slower than students using paper.' },
        { key: 'C', text: 'Students preferred printed lecture slides to digital copies.' }
      ], 'typed notes ... more words ... didn\'t always mean they understood better', 'typed more words did not always understand more', 'พิมพ์ได้มากกว่าแต่ไม่ได้เข้าใจมากกว่าเสมอไป', 'finding that surprised me เป็น signal ของคำตอบ และ but แสดงความขัดแย้ง: more words ไม่เท่ากับ more understanding.'),
      matchQuestionFor(DIGITAL_NOTE_TAKING_PART3_SCRIPT, digitalMethodOptions, digitalMethodQuestionText, 'advanced-digital-note-taking-p3-q25', 25, 'filming students during lectures', 'we\'d need special permission. Some students wouldn\'t want to be recorded.', 'F', 'need special permission', 'need special permission', 'ต้องขออนุญาตพิเศษ', 'recorded เป็นเหตุผลว่าทำไมต้อง special permission.'),
      matchQuestionFor(DIGITAL_NOTE_TAKING_PART3_SCRIPT, digitalMethodOptions, digitalMethodQuestionText, 'advanced-digital-note-taking-p3-q26', 26, 'comparing exam results', 'Too many other things affect exam results: revision, attendance, background knowledge. The results would be hard to measure properly.', 'B', 'results would be hard to measure properly', 'results would be hard to measure', 'วัดผลยาก', 'Too many other things affect exam results คือเหตุผลว่าทำไมวัดผลยาก.'),
      matchQuestionFor(DIGITAL_NOTE_TAKING_PART3_SCRIPT, digitalMethodOptions, digitalMethodQuestionText, 'advanced-digital-note-taking-p3-q27', 27, 'interviewing five classmates', 'Five people isn\'t enough. The sample would be too small to tell us much.', 'A', 'sample would be too small', 'sample would be too small', 'กลุ่มตัวอย่างเล็กเกินไป', 'five classmates ตรงกับ Five people และคำตอบชัดคือ sample too small.'),
      matchQuestionFor(DIGITAL_NOTE_TAKING_PART3_SCRIPT, digitalMethodOptions, digitalMethodQuestionText, 'advanced-digital-note-taking-p3-q28', 28, 'lending tablets to volunteers', 'That would cost too much unless we already had the tablets.', 'E', 'cost too much', 'equipment would be too expensive', 'อุปกรณ์แพงเกินไป', 'tablets เป็น equipment และ cost too much = too expensive.'),
      choiceQuestionFor(DIGITAL_NOTE_TAKING_PART3_SCRIPT, 'advanced-digital-note-taking-p3-q29', 29, 'Why do Emma and Ravi decide to include a short memory test?', 'That won\'t prove one method is better forever, but it would give us some simple data of our own.', 'A', [
        { key: 'A', text: 'It will give them some simple data of their own.' },
        { key: 'B', text: 'It will prove that handwriting is better than typing.' },
        { key: 'C', text: 'It will make their presentation more entertaining.' }
      ], 'give us some simple data of our own', 'simple data of their own', 'ข้อมูลของตัวเองแบบง่ายๆ', 'คำหลอกคือ prove handwriting is better เพราะ Ravi พูดชัดว่า won\'t prove one method is better forever.'),
      choiceQuestionFor(DIGITAL_NOTE_TAKING_PART3_SCRIPT, 'advanced-digital-note-taking-p3-q30', 30, 'Emma and Ravi agree that their presentation should focus on', 'It depends on the task. Typing may be useful for organised lecture notes, but handwriting may help with diagrams or problem-solving. So our presentation should explain when different methods are useful.', 'B', [
        { key: 'A', text: 'recommending one best note-taking method.' },
        { key: 'B', text: 'explaining when different methods are useful.' },
        { key: 'C', text: 'criticising students who rely on technology.' }
      ], 'explain when different methods are useful', 'when different methods are useful', 'อธิบายว่าแต่ละวิธีเหมาะเมื่อไร', 'Agreed และ balanced angle ชี้ว่าทั้งคู่ไม่เลือกวิธีเดียวดีที่สุด แต่จะอธิบายว่าแต่ละวิธีใช้เมื่อไร.')
    ]
  },
  {
    id: 'advanced-listening-light-pollution-part-4',
    category: 'advanced-listening',
    title: 'Advanced Listening · Part 4 - Light Pollution',
    section: 4,
    levelLabel: 'ADVANCED LISTENING · Part 4 lecture · target Band 7+',
    audioCacheKey: 'advanced-listening-light-pollution-part-4',
    audioscript: LIGHT_POLLUTION_PART4_SCRIPT,
    questions: [
      gapQuestionFor(LIGHT_POLLUTION_PART4_SCRIPT, 'advanced-light-pollution-p4-q31', 31, 'The problem comes from artificial 31 ____ that is too bright or poorly directed.', 'Light pollution is caused by artificial light that is unnecessary', 'light', ['lighting', 'energy', 'lamps'], 'artificial light that is unnecessary', 'too bright or poorly directed', 'แสง', 'too bright or poorly directed ขยายจาก unnecessary/wrong direction — คำตอบคือ light'),
      gapQuestionFor(LIGHT_POLLUTION_PART4_SCRIPT, 'advanced-light-pollution-p4-q32', 32, 'It is especially widespread in big 32 ____.', 'This problem is especially common in large cities', 'cities', ['towns', 'areas', 'streets'], 'common in large cities', 'especially widespread in big', 'เมือง', 'widespread in big paraphrase common in large cities'),
      gapQuestionFor(LIGHT_POLLUTION_PART4_SCRIPT, 'advanced-light-pollution-p4-q33', 33, 'It makes it harder to observe 33 ____ at night.', 'people can no longer see many stars in the night sky', 'stars', ['clouds', 'planets', 'lights'], 'see many stars in the night sky', 'observe at night', 'ดวงดาว', 'observe paraphrase see many stars in the night sky'),
      gapQuestionFor(LIGHT_POLLUTION_PART4_SCRIPT, 'advanced-light-pollution-p4-q34', 34, 'Coastal lights can divert newborn turtles from reaching the 34 ____.', 'artificial lights near beaches can lead them away from the water', 'water', ['ocean', 'beach', 'sea'], 'lead them away from the water', 'divert newborn turtles from reaching', 'น้ำ', 'divert from reaching = lead away from · newborn turtles = young sea turtles after hatching · คำตอบคือ water ไม่ใช่ ocean'),
      gapQuestionFor(LIGHT_POLLUTION_PART4_SCRIPT, 'advanced-light-pollution-p4-q35', 35, 'Birds travelling long distances may become lost near brightly lit towers during 35 ____.', 'Many species travel long distances during migration, and bright lights from buildings can confuse them', 'migration', ['weather', 'night', 'travel'], 'during migration', 'travelling long distances lost near brightly lit towers during', 'การอพยพย้ายถิ่น', 'travelling long distances = travel long distances · become lost = confuse them · brightly lit towers = bright lights from buildings · คำตอบคือ migration'),
      gapQuestionFor(LIGHT_POLLUTION_PART4_SCRIPT, 'advanced-light-pollution-p4-q36', 36, 'Night lights may trap insects that should be locating 36 ____.', 'Instead of finding food or mates, they often gather around lamps', 'food', ['shelter', 'water', 'light'], 'finding food or mates', 'trap insects that should be locating', 'อาหาร', 'trap around lamps = gather around lamps · should be locating = instead of finding · คำตอบคือ food'),
      gapQuestionFor(LIGHT_POLLUTION_PART4_SCRIPT, 'advanced-light-pollution-p4-q37', 37, 'Strong illumination after dark may interfere with natural 37 ____ cycles.', 'Bright light at night can disturb sleep patterns', 'sleep', ['rest', 'body', 'health'], 'disturb sleep patterns', 'Strong illumination after dark interfere with natural cycles', 'การนอน', 'Strong illumination after dark = Bright light at night · interfere with = disturb · natural cycles = sleep patterns · คำตอบคือ sleep'),
      gapQuestionFor(LIGHT_POLLUTION_PART4_SCRIPT, 'advanced-light-pollution-p4-q38', 38, 'Badly designed street lighting can produce 38 ____ for motorists.', 'Poorly designed lights can create glare, making it harder for drivers to see clearly', 'glare', ['danger', 'reflections', 'brightness'], 'create glare', 'produce for motorists', 'แสงจ้าแยงตา', 'motorists paraphrase drivers และ produce glare = create glare'),
      gapQuestionFor(LIGHT_POLLUTION_PART4_SCRIPT, 'advanced-light-pollution-p4-q39', 39, 'Beams from outdoor fixtures should be angled 39 ____ rather than into the sky.', 'Streetlights should be designed to point downward', 'downward', ['inside', 'lower', 'roads'], 'point downward', 'angled rather than into the sky', 'ลงด้านล่าง', 'Beams from outdoor fixtures = Streetlights · angled downward = point downward · rather than into the sky = instead of escaping into the sky · คำตอบคือ downward'),
      gapQuestionFor(LIGHT_POLLUTION_PART4_SCRIPT, 'advanced-light-pollution-p4-q40', 40, 'Some towns reduce outdoor lighting after 40 ____.', 'Some towns also reduce lighting after midnight', 'midnight', ['dark', 'evening', 'hours'], 'reduce lighting after midnight', 'reduce outdoor lighting after', 'เที่ยงคืน', 'reduce outdoor lighting = reduce lighting · after ตรงกับสคริปต์ · คำตอบคือ midnight')
    ]
  }
]
