import type { IntensivePassageInput } from './journeyIntensivePassages.ts'

const headingOptions = (items: string[]) => items

export const INTENSIVE_PASSAGES_STAGE_6_10: Record<number, [IntensivePassageInput, IntensivePassageInput]> = {
  6: [
    {
      title: 'The Science of Volcanoes',
      paragraphs: [
        ['A', 'Volcanoes are among the most dramatic geological features on Earth, formed when molten rock, ash, and gases escape from the planet\'s interior. Most active volcanoes occur along tectonic plate boundaries, where colliding or separating plates create weak zones in the crust. In these regions, magma rises from the mantle and collects in underground chambers before erupting through surface vents. The Pacific Ring of Fire contains the majority of the world\'s active volcanoes because numerous plates converge around the ocean basin.'],
        ['B', 'Eruptions vary enormously in intensity and style. Explosive eruptions occur when thick, gas-rich magma cannot escape easily, building pressure until the volcano violently ejects ash columns high into the atmosphere. In contrast, effusive eruptions release fluid lava that flows steadily down the mountainside, often moving slowly enough for nearby communities to evacuate. The viscosity of the magma largely determines which style dominates. High silica content generally produces more explosive behavior.'],
        ['C', 'Volcanic ash poses serious hazards far beyond the immediate crater. Fine particles can collapse roofs, contaminate water supplies, and destroy aircraft engines if flown through ash clouds. Historical records show that major eruptions can lower global temperatures for several years by reflecting sunlight with suspended aerosols. The 1815 eruption of Mount Tambora, for example, contributed to the infamous "year without a summer" in Europe and North America.'],
        ['D', 'Despite their dangers, volcanic landscapes offer extraordinary ecological and economic benefits. Weathered volcanic soils are exceptionally fertile, supporting dense agriculture on the slopes of mountains in Indonesia, Italy, and Central America. Geothermal energy plants harness underground heat near active sites, providing renewable electricity to local grids. Tourists also flock to volcanic parks, generating significant regional income.'],
        ['E', 'Scientists monitor volcanoes using seismographs, gas sensors, and satellite radar to detect ground swelling that may signal an impending eruption. Early warning systems have saved thousands of lives by prompting evacuations before lava reaches populated areas. Nevertheless, predicting the exact timing of large explosions remains difficult because underground magma systems are extraordinarily complex.'],
        ['F', 'As urban populations expand closer to volcanic slopes, disaster planning has become a global priority. Governments invest in hazard maps, emergency shelters, and public education campaigns so residents understand evacuation routes. International agencies also share real-time monitoring data, recognizing that ash clouds and climate effects can cross national borders within days.']
      ],
      fill: [
        { prompt: 'Most active volcanoes form near boundaries between tectonic ________.', answer: 'plates', evidence: 'Most active volcanoes occur along tectonic plate boundaries, where colliding or separating plates create weak zones in the crust' },
        { prompt: 'Thick magma with trapped gas often produces violent ________ eruptions.', answer: 'explosive', evidence: 'Explosive eruptions occur when thick, gas-rich magma cannot escape easily, building pressure until the volcano violently ejects ash columns high into the atmosphere' },
        { prompt: 'Suspended aerosols from major eruptions can reduce global ________.', answer: 'temperatures', evidence: 'Historical records show that major eruptions can lower global temperatures for several years by reflecting sunlight with suspended aerosols' },
        { prompt: 'Weathered volcanic material creates highly fertile ________.', answer: 'soils', evidence: 'Weathered volcanic soils are exceptionally fertile, supporting dense agriculture on the slopes of mountains in Indonesia, Italy, and Central America' },
        { prompt: 'Satellite radar helps experts detect swelling of the ground that may indicate an upcoming ________.', answer: 'eruption', evidence: 'Scientists monitor volcanoes using seismographs, gas sensors, and satellite radar to detect ground swelling that may signal an impending eruption' }
      ],
      judgement: [
        { prompt: 'The Pacific Ring of Fire contains the majority of the world\'s dormant volcanoes.', answer: 'FALSE', evidence: 'The Pacific Ring of Fire contains the majority of the world\'s active volcanoes because numerous plates converge around the ocean basin.' },
        { prompt: 'Effusive eruptions release fluid lava that flows steadily down the mountainside.', answer: 'TRUE', evidence: 'In contrast, effusive eruptions release fluid lava that flows steadily down the mountainside, often moving slowly enough for nearby communities to evacuate.' },
        { prompt: 'The 1815 eruption of Mount Tambora caused permanent cooling of the entire planet.', answer: 'NOT GIVEN', evidence: 'The 1815 eruption of Mount Tambora, for example, contributed to the infamous "year without a summer" in Europe and North America.' },
        { prompt: 'Geothermal energy plants near volcanoes provide renewable electricity to local grids.', answer: 'TRUE', evidence: 'Geothermal energy plants harness underground heat near active sites, providing renewable electricity to local grids.' }
      ],
      headings: {
        options: headingOptions([
          'The formation of volcanoes at plate boundaries',
          'Contrasting eruption styles driven by magma viscosity',
          'Widespread impacts of ash and atmospheric particles',
          'Agricultural and energy benefits of volcanic regions',
          'Instruments used to detect signs of activity',
          'International cooperation in disaster preparedness',
          'Fluid lava flows steadily down the mountainside',
          'Underground heat near active sites'
        ]),
        questions: [
          { prompt: 'Paragraph B', answer: 'ii', evidence: 'Explosive eruptions occur when thick, gas-rich magma cannot escape easily, building pressure until the volcano violently ejects ash columns high into the atmosphere.' },
          { prompt: 'Paragraph C', answer: 'iii', evidence: 'Volcanic ash poses serious hazards far beyond the immediate crater.' },
          { prompt: 'Paragraph D', answer: 'iv', evidence: 'Despite their dangers, volcanic landscapes offer extraordinary ecological and economic benefits.' },
          { prompt: 'Paragraph F', answer: 'vi', evidence: 'International agencies also share real-time monitoring data, recognizing that ash clouds and climate effects can cross national borders within days.' }
        ]
      }
    },
    {
      title: 'The Ancient Olympic Games',
      paragraphs: [
        ['A', 'The ancient Olympic Games originated in Olympia, Greece, as a religious festival honoring Zeus. Beginning in 776 BCE according to tradition, the games were held every four years and attracted competitors from city-states across the Hellenic world. For the duration of the festival, a sacred truce supposedly suspended warfare so athletes and spectators could travel safely. Victories brought enormous prestige to both the individual and his home community.'],
        ['B', 'Early events focused on footraces run in the stadium, but the program gradually expanded to include wrestling, boxing, chariot racing, and the brutal pankration, a nearly rule-free combat sport. Athletes trained for months under private coaches, adhering to strict diets believed to enhance performance. Unlike modern competitions, only freeborn Greek men were permitted to compete, and they performed naked to symbolize equality before the judges.'],
        ['C', 'Winners received no gold medals; instead, they were crowned with olive wreaths cut from a sacred tree in Olympia. The real reward was honor: poets composed victory odes, sculptors erected statues, and families gained political influence. Some champions returned home to lifetime pensions and seats of privilege, illustrating how sport intersected with civic power in the ancient world.'],
        ['D', 'The games also functioned as a pan-Hellenic meeting place where diplomats negotiated alliances and merchants traded goods. Philosophers delivered public lectures, and military commanders displayed their wealth by sponsoring elaborate chariot teams. The festival therefore strengthened a shared Greek identity while allowing rival cities to compete peacefully.'],
        ['E', 'Roman conquest eventually transformed the tradition. Emperor Theodosius I officially abolished the games in 393 CE, viewing them as incompatible with Christianity. Olympia fell into ruin, buried by earthquakes and sediment until archaeologists rediscovered the site in the nineteenth century. Excavations uncovered temples, stadium foundations, and countless inscriptions documenting victors\' names.'],
        ['F', 'The modern Olympics, revived in 1896 by Pierre de Coubertin, deliberately echoed ancient ideals of international fellowship through sport. Today\'s global festival retains the four-year cycle and ceremonial flame, though it now includes athletes of all genders and nations. The ancient emphasis on personal excellence and civic pride continues to shape how societies celebrate athletic achievement.']
      ],
      fill: [
        { prompt: 'The festival in Olympia was originally a religious event dedicated to ________.', answer: 'Zeus', evidence: 'The ancient Olympic Games originated in Olympia, Greece, as a religious festival honoring Zeus' },
        { prompt: 'Competitors in the pankration took part in an almost rule-free form of ________.', answer: 'combat', evidence: 'Early events focused on footraces run in the stadium, but the program gradually expanded to include wrestling, boxing, chariot racing, and the brutal pankration, a nearly rule-free combat sport' },
        { prompt: 'Victors were honored with crowns made from sacred ________ branches.', answer: 'olive', evidence: 'Winners received no gold medals; instead, they were crowned with olive wreaths cut from a sacred tree in Olympia' },
        { prompt: 'Merchants and diplomats used the festival as a major regional meeting ________.', answer: 'place', evidence: 'The games also functioned as a pan-Hellenic meeting place where diplomats negotiated alliances and merchants traded goods' },
        { prompt: 'Archaeologists rediscovered Olympia during the ________ century.', answer: 'nineteenth', evidence: 'Olympia fell into ruin, buried by earthquakes and sediment until archaeologists rediscovered the site in the nineteenth century' }
      ],
      judgement: [
        { prompt: 'According to tradition, the games began in 776 BCE and were held every four years.', answer: 'TRUE', evidence: 'Beginning in 776 BCE according to tradition, the games were held every four years and attracted competitors from city-states across the Hellenic world.' },
        { prompt: 'Female athletes from Sparta regularly competed in the ancient Olympic stadium events.', answer: 'NOT GIVEN', evidence: 'Unlike modern competitions, only freeborn Greek men were permitted to compete, and they performed naked to symbolize equality before the judges.' },
        { prompt: 'Winners received large cash prizes equal to a year\'s wages.', answer: 'FALSE', evidence: 'Winners received no gold medals; instead, they were crowned with olive wreaths cut from a sacred tree in Olympia.' },
        { prompt: 'Archaeologists rediscovered Olympia during the nineteenth century.', answer: 'TRUE', evidence: 'Olympia fell into ruin, buried by earthquakes and sediment until archaeologists rediscovered the site in the nineteenth century.' }
      ],
      headings: {
        options: headingOptions([
          'Religious origins and the four-year cycle',
          'Expansion of athletic contests and training',
          'Honors granted to successful competitors',
          'Political and commercial gatherings at Olympia',
          'Imperial abolition and later rediscovery',
          'Links between ancient ideals and the modern revival',
          'Wrestling, boxing, chariot racing',
          'Olive wreaths cut from a sacred tree'
        ]),
        questions: [
          { prompt: 'Paragraph A', answer: 'i', evidence: 'Beginning in 776 BCE according to tradition, the games were held every four years and attracted competitors from city-states across the Hellenic world.' },
          { prompt: 'Paragraph B', answer: 'ii', evidence: 'Early events focused on footraces run in the stadium, but the program gradually expanded to include wrestling, boxing, chariot racing, and the brutal pankration, a nearly rule-free combat sport.' },
          { prompt: 'Paragraph D', answer: 'iv', evidence: 'The games also functioned as a pan-Hellenic meeting place where diplomats negotiated alliances and merchants traded goods.' },
          { prompt: 'Paragraph F', answer: 'vi', evidence: 'The modern Olympics, revived in 1896 by Pierre de Coubertin, deliberately echoed ancient ideals of international fellowship through sport.' }
        ]
      }
    }
  ],
  7: [
    {
      title: 'The Development of Vaccination',
      paragraphs: [
        ['A', 'For most of human history, infectious diseases killed more soldiers than battlefield weapons and devastated cities without warning. Smallpox was especially feared, leaving survivors scarred and often blind. In the eighteenth century, English physician Edward Jenner observed that milkmaids who contracted cowpox seemed immune to smallpox. He tested whether deliberate exposure to the milder disease could protect others.'],
        ['B', 'In 1796 Jenner inoculated a young boy with material from a cowpox lesion, then later exposed him to smallpox without ill effect. The experiment, though unethical by modern standards, demonstrated the principle of vaccination: stimulating the immune system with a related pathogen to build future resistance. The term vaccine derives from vacca, the Latin word for cow.'],
        ['C', 'News spread slowly at first because many doctors distrusted the procedure, fearing it might spread animal diseases to humans. Nevertheless, governments eventually adopted mass vaccination campaigns that dramatically reduced smallpox deaths across Europe. By the twentieth century, coordinated global efforts targeted the virus for eradication.'],
        ['D', 'Later scientists extended the concept to other illnesses. Louis Pasteur developed vaccines against rabies and anthrax, proving that weakened microbes could train the body\'s defenses. Refrigerated transport and sterile manufacturing allowed laboratories to produce consistent doses for millions of patients. Immunization schedules became standard tools of public health departments worldwide.'],
        ['E', 'Despite remarkable success, vaccine hesitancy has resurfaced in recent decades. Misinformation on social media fuels unfounded fears about side effects, leading some parents to refuse childhood shots. When vaccination rates fall below critical thresholds, communities lose herd immunity, and outbreaks of measles or whooping cough reappear in previously controlled regions.'],
        ['F', 'Researchers continue developing new vaccines using messenger RNA and other advanced platforms that shorten production timelines during pandemics. International organizations fund equitable distribution so low-income nations are not left behind. The history begun with Jenner\'s cowpox experiment thus remains central to modern medicine\'s fight against emerging pathogens.']
      ],
      fill: [
        { prompt: 'Jenner noticed that women who had cowpox appeared resistant to ________.', answer: 'smallpox', evidence: 'In the eighteenth century, English physician Edward Jenner observed that milkmaids who contracted cowpox seemed immune to smallpox' },
        { prompt: 'The word vaccine comes from the Latin term for ________.', answer: 'cow', evidence: 'The term vaccine derives from vacca, the Latin word for cow' },
        { prompt: 'Pasteur created immunizations against rabies and ________.', answer: 'anthrax', evidence: 'Louis Pasteur developed vaccines against rabies and anthrax, proving that weakened microbes could train the body\'s defenses' },
        { prompt: 'Declining immunization rates can destroy community ________ immunity.', answer: 'herd', evidence: 'When vaccination rates fall below critical thresholds, communities lose herd immunity, and outbreaks of measles or whooping cough reappear in previously controlled regions' },
        { prompt: 'Modern labs use messenger ________ technology to speed up vaccine production.', answer: 'RNA', evidence: 'Researchers continue developing new vaccines using messenger RNA and other advanced platforms that shorten production timelines during pandemics', acceptedAnswers: [] }
      ],
      judgement: [
        { prompt: 'Jenner\'s 1796 experiment would meet current ethical guidelines for clinical trials.', answer: 'FALSE', evidence: 'The experiment, though unethical by modern standards, demonstrated the principle of vaccination: stimulating the immune system with a related pathogen to build future resistance.' },
        { prompt: 'Many early physicians were initially skeptical about Jenner\'s procedure.', answer: 'TRUE', evidence: 'News spread slowly at first because many doctors distrusted the procedure, fearing it might spread animal diseases to humans.' },
        { prompt: 'Pasteur developed vaccines against rabies using only synthetic chemicals.', answer: 'NOT GIVEN', evidence: 'Louis Pasteur developed vaccines against rabies and anthrax, proving that weakened microbes could train the body\'s defenses.' },
        { prompt: 'International organizations support fair access to vaccines in poorer countries.', answer: 'TRUE', evidence: 'International organizations fund equitable distribution so low-income nations are not left behind.' }
      ],
      headings: {
        options: headingOptions([
          'Observations that led to the first smallpox trial',
          'Naming and scientific basis of immunization',
          'Government campaigns and global eradication efforts',
          'Expansion to additional diseases and mass production',
          'Modern resistance fueled by false claims',
          'Innovation and equitable access today',
          'Milkmaids who contracted cowpox',
          'Weakened microbes could train the body\'s defenses'
        ]),
        questions: [
          { prompt: 'Paragraph A', answer: 'i', evidence: 'In the eighteenth century, English physician Edward Jenner observed that milkmaids who contracted cowpox seemed immune to smallpox.' },
          { prompt: 'Paragraph D', answer: 'iv', evidence: 'Later scientists extended the concept to other illnesses.' },
          { prompt: 'Paragraph E', answer: 'v', evidence: 'Despite remarkable success, vaccine hesitancy has resurfaced in recent decades.' },
          { prompt: 'Paragraph F', answer: 'vi', evidence: 'Researchers continue developing new vaccines using messenger RNA and other advanced platforms that shorten production timelines during pandemics.' }
        ]
      }
    },
    {
      title: 'The Gutenberg Printing Revolution',
      paragraphs: [
        ['A', 'Before the mid-fifteenth century, books in Europe were copied by hand, usually in monasteries, making each volume expensive and rare. The introduction of movable metal type transformed communication almost overnight. Johannes Gutenberg, a German craftsman from Mainz, combined adjustable letter blocks, oil-based ink, and a modified wine press to print multiple pages quickly.'],
        ['B', 'Gutenberg\'s workshop produced his most famous project, a Latin Bible, around 1455. Because each letter could be rearranged after printing, publishers no longer needed to carve an entirely new wooden block for every page. The efficiency lowered production costs and allowed texts to reach merchants, lawyers, and university students who previously could not afford manuscripts.'],
        ['C', 'The technology spread along trade routes to Venice, Paris, and London within decades. Printers published not only religious works but also scientific treatises, legal codes, and popular pamphlets in local languages. Literacy rates climbed as reading material became cheaper, weakening the monopoly that Latin-speaking clerics had held over learning.'],
        ['D', 'Printing also intensified political and religious conflict. Martin Luther\'s ninety-five theses circulated widely because sympathetic printers reproduced them rapidly, fueling the Protestant Reformation. Governments soon recognized propaganda value and censored presses, yet underground workshops continued distributing controversial ideas.'],
        ['E', 'Standardized typefaces improved readability and helped stabilize spelling, though regional dialects persisted. Maps and illustrations could be duplicated accurately for the first time, aiding explorers and engineers. The cumulative effect was an information explosion that many historians compare to the modern internet.'],
        ['F', 'Digital media have not ended printing\'s legacy; instead, mass production shifted to newspapers, textbooks, and packaging. Gutenberg\'s insight—that reusable components enable scalable copying—underlies today\'s computer fonts and publishing software. The fifteenth-century press therefore remains a landmark in humanity\'s struggle to share knowledge widely.']
      ],
      fill: [
        { prompt: 'Gutenberg adapted a wine ________ to press ink onto paper.', answer: 'press', evidence: 'Johannes Gutenberg, a German craftsman from Mainz, combined adjustable letter blocks, oil-based ink, and a modified wine press to print multiple pages quickly' },
        { prompt: 'Movable metal type meant printers did not have to carve a new wooden ________ for every page.', answer: 'block', evidence: 'Because each letter could be rearranged after printing, publishers no longer needed to carve an entirely new wooden block for every page' },
        { prompt: 'Cheaper books helped raise European ________ rates.', answer: 'literacy', evidence: 'Literacy rates climbed as reading material became cheaper, weakening the monopoly that Latin-speaking clerics had held over learning' },
        { prompt: 'Rapid reproduction of Luther\'s writings helped spark the Protestant ________.', answer: 'Reformation', evidence: 'Martin Luther\'s ninety-five theses circulated widely because sympathetic printers reproduced them rapidly, fueling the Protestant Reformation', acceptedAnswers: ['reformation'] },
        { prompt: 'Historians compare the printing boom to the modern ________.', answer: 'internet', evidence: 'The cumulative effect was an information explosion that many historians compare to the modern internet' }
      ],
      judgement: [
        { prompt: 'Gutenberg printed his famous Bible in Hebrew rather than Latin.', answer: 'FALSE', evidence: 'Gutenberg\'s workshop produced his most famous project, a Latin Bible, around 1455.' },
        { prompt: 'Movable type reduced costs by allowing letters to be reused.', answer: 'TRUE', evidence: 'Because each letter could be rearranged after printing, publishers no longer needed to carve an entirely new wooden block for every page.' },
        { prompt: 'Venice was the first city where Gutenberg built his original workshop.', answer: 'NOT GIVEN', evidence: 'Johannes Gutenberg, a German craftsman from Mainz, combined adjustable letter blocks, oil-based ink, and a modified wine press to print multiple pages quickly.' },
        { prompt: 'Governments sometimes attempted to censor printed material.', answer: 'TRUE', evidence: 'Governments soon recognized propaganda value and censored presses, yet underground workshops continued distributing controversial ideas.' }
      ],
      headings: {
        options: headingOptions([
          'Hand copying before mechanized production',
          'Key technical elements of Gutenberg\'s system',
          'Rapid spread of presses across Europe',
          'Political consequences of cheap pamphlets',
          'Effects on language, images, and knowledge',
          'Lasting influence into the digital age',
          'Oil-based ink',
          'Latin-speaking clerics had held over learning'
        ]),
        questions: [
          { prompt: 'Paragraph A', answer: 'ii', evidence: 'Johannes Gutenberg, a German craftsman from Mainz, combined adjustable letter blocks, oil-based ink, and a modified wine press to print multiple pages quickly.' },
          { prompt: 'Paragraph C', answer: 'iii', evidence: 'The technology spread along trade routes to Venice, Paris, and London within decades.' },
          { prompt: 'Paragraph D', answer: 'iv', evidence: 'Printing also intensified political and religious conflict.' },
          { prompt: 'Paragraph E', answer: 'v', evidence: 'Standardized typefaces improved readability and helped stabilize spelling, though regional dialects persisted.' }
        ]
      }
    }
  ],
  8: [
    {
      title: 'The Great Wall of China',
      paragraphs: [
        ['A', 'The Great Wall of China is not a single continuous structure but a network of walls, towers, and fortifications built over centuries. Early states constructed separate barriers against nomadic raids from the northern steppe. After unifying China, Emperor Qin Shi Huang connected and expanded existing segments during the third century BCE, using forced labor and local stone.'],
        ['B', 'The most famous stone sections tourists photograph today largely date to the Ming dynasty, when renewed threats from Mongol tribes prompted massive reconstruction. Ming engineers reinforced walls with brick, added watchtowers at regular intervals, and garrisoned soldiers who could signal approaching armies with smoke by day or fire by night.'],
        ['C', 'The wall\'s purpose extended beyond pure defense. It regulated trade along the Silk Road, collected tariffs, and controlled migration. Customs officials inspected caravans at fortified gates, ensuring that valuable goods and intelligence did not strengthen hostile neighbors.'],
        ['D', 'Construction imposed enormous human costs. Historical accounts describe conscripted peasants hauling materials up steep ridges, and many died from exhaustion or harsh winters. Popular legend speaks of workers buried within the wall, though archaeologists have found limited evidence supporting the myth.'],
        ['E', 'Over time, natural erosion and village recycling of bricks caused long sections to crumble. Remote stretches in Gansu and Inner Mongolia now appear as low earthen ridges rather than towering battlements. Conservationists warn that tourism, graffiti, and unchecked development threaten surviving Ming-era masonry.'],
        ['F', 'Today the monument symbolizes national unity and attracts millions of visitors annually. UNESCO designated several sites as World Heritage properties, and Chinese authorities fund restoration projects using traditional techniques. Scholars debate how effective the wall truly was militarily, but its cultural impact on Chinese identity is undeniable.']
      ],
      fill: [
        { prompt: 'Emperor Qin Shi Huang linked earlier barriers after unifying ________.', answer: 'China', evidence: 'After unifying China, Emperor Qin Shi Huang connected and expanded existing segments during the third century BCE, using forced labor and local stone' },
        { prompt: 'Ming builders strengthened the wall with ________ and watchtowers.', answer: 'brick', evidence: 'Ming engineers reinforced walls with brick, added watchtowers at regular intervals, and garrisoned soldiers who could signal approaching armies with smoke by day or fire by night' },
        { prompt: 'Fortified gates allowed officials to control trade on the Silk ________.', answer: 'Road', evidence: 'It regulated trade along the Silk Road, collected tariffs, and controlled migration' },
        { prompt: 'Conscripted laborers often died from exhaustion or severe ________.', answer: 'winters', evidence: 'Historical accounts describe conscripted peasants hauling materials up steep ridges, and many died from exhaustion or harsh winters' },
        { prompt: 'UNESCO granted World Heritage status to several wall ________.', answer: 'sites', evidence: 'UNESCO designated several sites as World Heritage properties, and Chinese authorities fund restoration projects using traditional techniques' }
      ],
      judgement: [
        { prompt: 'The Great Wall was built all at once during the Ming dynasty.', answer: 'FALSE', evidence: 'The Great Wall of China is not a single continuous structure but a network of walls, towers, and fortifications built over centuries.' },
        { prompt: 'Ming watchtowers could communicate using smoke or fire signals.', answer: 'TRUE', evidence: 'Ming engineers reinforced walls with brick, added watchtowers at regular intervals, and garrisoned soldiers who could signal approaching armies with smoke by day or fire by night.' },
        { prompt: 'Archaeologists have confirmed that thousands of workers were buried inside the wall.', answer: 'FALSE', evidence: 'Popular legend speaks of workers buried within the wall, though archaeologists have found limited evidence supporting the myth.' },
        { prompt: 'Some remote sections now appear as low earthen ridges.', answer: 'TRUE', evidence: 'Remote stretches in Gansu and Inner Mongolia now appear as low earthen ridges rather than towering battlements.' }
      ],
      headings: {
        options: headingOptions([
          'Early barriers and Qin unification',
          'Ming reconstruction and signaling systems',
          'Economic and administrative functions',
          'Human suffering during construction',
          'Decay and modern conservation challenges',
          'Cultural symbolism and heritage status',
          'Forced labor and local stone',
          'Smoke by day or fire by night'
        ]),
        questions: [
          { prompt: 'Paragraph B', answer: 'ii', evidence: 'Ming engineers reinforced walls with brick, added watchtowers at regular intervals, and garrisoned soldiers who could signal approaching armies with smoke by day or fire by night.' },
          { prompt: 'Paragraph C', answer: 'iii', evidence: 'The wall\'s purpose extended beyond pure defense.' },
          { prompt: 'Paragraph D', answer: 'iv', evidence: 'Construction imposed enormous human costs.' },
          { prompt: 'Paragraph F', answer: 'vi', evidence: 'Today the monument symbolizes national unity and attracts millions of visitors annually.' }
        ]
      }
    },
    {
      title: 'The Origins of Jazz Music',
      paragraphs: [
        ['A', 'Jazz emerged in the late nineteenth and early twentieth centuries from the musical traditions of African American communities in New Orleans. Blending African rhythms, blues scales, European harmonies, and marching band instrumentation, musicians created a new style centered on improvisation. Street parades, riverboat performances, and crowded dance halls provided early venues.'],
        ['B', 'Ragtime piano music, popularized by composers like Scott Joplin, laid rhythmic foundations with its syncopated melodies. Brass bands adapted these patterns for collective improvisation, allowing soloists to embellish tunes while others maintained the beat. The cornet, clarinet, and trombone became signature voices of the style.'],
        ['C', 'The Great Migration carried jazz northward as millions of Black Americans moved to Chicago, Detroit, and New York seeking industrial jobs. Urban clubs hosted legendary performers such as Louis Armstrong, whose trumpet virtuosity and gravelly singing transformed jazz into an international art form. Recordings and radio broadcasts spread the sound worldwide.'],
        ['D', 'The 1920s and 1930s saw the rise of big bands led by Duke Ellington and Count Basie, featuring arranged sections for saxophones, trumpets, and rhythm instruments. Swing dancing attracted huge audiences, though racial segregation often restricted where mixed groups could perform.'],
        ['E', 'After World War II, musicians pursued greater complexity through bebop, emphasizing fast tempos and intricate chord changes. Charlie Parker and Dizzy Gillespie challenged listeners accustomed to danceable swing. Later styles—cool jazz, modal jazz, and fusion—continued pushing boundaries.'],
        ['F', 'Jazz education programs and festivals now preserve the tradition while encouraging experimentation. UNESCO recognizes jazz as part of intangible cultural heritage, and contemporary artists blend hip-hop or electronic elements with classic forms. The genre remains a living dialogue between structure and spontaneous creativity.']
      ],
      fill: [
        { prompt: 'Jazz first developed in the city of New ________.', answer: 'Orleans', evidence: 'Jazz emerged in the late nineteenth and early twentieth centuries from the musical traditions of African American communities in New Orleans' },
        { prompt: 'Ragtime relied on highly syncopated ________ on the piano.', answer: 'melodies', evidence: 'Ragtime piano music, popularized by composers like Scott Joplin, laid rhythmic foundations with its syncopated melodies' },
        { prompt: 'The Great Migration helped spread jazz to northern ________.', answer: 'cities', evidence: 'The Great Migration carried jazz northward as millions of Black Americans moved to Chicago, Detroit, and New York seeking industrial jobs' },
        { prompt: 'Big bands from the swing era featured arranged sections for saxophones and ________.', answer: 'trumpets', evidence: 'The 1920s and 1930s saw the rise of big bands led by Duke Ellington and Count Basie, featuring arranged sections for saxophones, trumpets, and rhythm instruments' },
        { prompt: 'Bebop musicians favored rapid tempos and complex chord ________.', answer: 'changes', evidence: 'After World War II, musicians pursued greater complexity through bebop, emphasizing fast tempos and intricate chord changes' }
      ],
      judgement: [
        { prompt: 'Jazz combined African rhythms with European harmonic ideas.', answer: 'TRUE', evidence: 'Blending African rhythms, blues scales, European harmonies, and marching band instrumentation, musicians created a new style centered on improvisation.' },
        { prompt: 'Scott Joplin was primarily known as a jazz trumpet soloist.', answer: 'FALSE', evidence: 'Ragtime piano music, popularized by composers like Scott Joplin, laid rhythmic foundations with its syncopated melodies.' },
        { prompt: 'Louis Armstrong performed only in New Orleans throughout his career.', answer: 'NOT GIVEN', evidence: 'Urban clubs hosted legendary performers such as Louis Armstrong, whose trumpet virtuosity and gravelly singing transformed jazz into an international art form.' },
        { prompt: 'UNESCO acknowledges jazz as intangible cultural heritage.', answer: 'TRUE', evidence: 'UNESCO recognizes jazz as part of intangible cultural heritage, and contemporary artists blend hip-hop or electronic elements with classic forms.' }
      ],
      headings: {
        options: headingOptions([
          'Musical roots in southern African American life',
          'Ragtime and early ensemble improvisation',
          'Migration and international popularity',
          'Big bands and the swing era',
          'Postwar innovation and new subgenres',
          'Preservation and contemporary fusion',
          'Marching band instrumentation',
          'Fast tempos and intricate chord changes'
        ]),
        questions: [
          { prompt: 'Paragraph A', answer: 'i', evidence: 'Jazz emerged in the late nineteenth and early twentieth centuries from the musical traditions of African American communities in New Orleans.' },
          { prompt: 'Paragraph C', answer: 'iii', evidence: 'The Great Migration carried jazz northward as millions of Black Americans moved to Chicago, Detroit, and New York seeking industrial jobs.' },
          { prompt: 'Paragraph E', answer: 'v', evidence: 'After World War II, musicians pursued greater complexity through bebop, emphasizing fast tempos and intricate chord changes.' },
          { prompt: 'Paragraph F', answer: 'vi', evidence: 'Jazz education programs and festivals now preserve the tradition while encouraging experimentation.' }
        ]
      }
    }
  ],
  9: [
    {
      title: 'Coral Reef Conservation',
      paragraphs: [
        ['A', 'Coral reefs occupy less than one percent of the ocean floor yet support roughly a quarter of all marine species. These underwater structures form when tiny animals called polyps secrete calcium carbonate skeletons that accumulate over centuries. Symbiotic algae living inside polyp tissues provide most of the colony\'s energy through photosynthesis, giving healthy reefs their vivid colors.'],
        ['B', 'Reefs function as natural breakwaters, absorbing wave energy and protecting coastal communities from storm surges. They also sustain fishing industries that feed hundreds of millions of people. Tourist diving and snorkeling generate billions of dollars annually, linking local economies directly to reef health.'],
        ['C', 'Today reefs face multiple stresses. Rising sea temperatures trigger coral bleaching, forcing polyps to expel their algae partners and often starve. Ocean acidification weakens skeletons, while agricultural runoff delivers excess nutrients that encourage harmful algal blooms. Destructive fishing practices such as blast fishing shatter colonies instantly.'],
        ['D', 'Marine protected areas restrict fishing and anchor damage, allowing some reefs to recover when bleaching events are mild. Scientists cultivate coral fragments in underwater nurseries, then transplant survivors onto damaged sites. Selective breeding programs search for heat-tolerant genotypes that might survive warmer oceans.'],
        ['E', 'International agreements, including conventions on biodiversity and climate change, aim to reduce emissions and pollution affecting reefs. However, enforcement remains uneven, and small island nations argue that wealthy countries must provide funding because they contributed most historical greenhouse gases.'],
        ['F', 'Public education campaigns encourage tourists to use reef-safe sunscreen and avoid touching fragile colonies. Citizen science projects train divers to monitor bleaching and report data through smartphone apps. Without rapid global action, biologists warn that most tropical reefs could degrade beyond recognition within decades.']
      ],
      fill: [
        { prompt: 'Reef structures build up from calcium carbonate secreted by ________.', answer: 'polyps', evidence: 'These underwater structures form when tiny animals called polyps secrete calcium carbonate skeletons that accumulate over centuries' },
        { prompt: 'Symbiotic algae supply energy to coral through ________.', answer: 'photosynthesis', evidence: 'Symbiotic algae living inside polyp tissues provide most of the colony\'s energy through photosynthesis, giving healthy reefs their vivid colors' },
        { prompt: 'Reefs protect coastal communities from destructive storm ________.', answer: 'surges', evidence: 'Reefs function as natural breakwaters, absorbing wave energy and protecting coastal communities from storm surges' },
        { prompt: 'Higher water temperatures can cause coral ________.', answer: 'bleaching', evidence: 'Rising sea temperatures trigger coral bleaching, forcing polyps to expel their algae partners and often starve' },
        { prompt: 'Underwater nurseries grow coral pieces for later ________.', answer: 'transplant', evidence: 'Scientists cultivate coral fragments in underwater nurseries, then transplant survivors onto damaged sites', acceptedAnswers: ['transplantation'] }
      ],
      judgement: [
        { prompt: 'Coral reefs cover more than ten percent of the ocean floor.', answer: 'FALSE', evidence: 'Coral reefs occupy less than one percent of the ocean floor yet support roughly a quarter of all marine species.' },
        { prompt: 'Bleaching occurs when polyps lose their symbiotic algae.', answer: 'TRUE', evidence: 'Rising sea temperatures trigger coral bleaching, forcing polyps to expel their algae partners and often starve.' },
        { prompt: 'All marine protected areas have completely eliminated blast fishing worldwide.', answer: 'NOT GIVEN', evidence: 'Marine protected areas restrict fishing and anchor damage, allowing some reefs to recover when bleaching events are mild.' },
        { prompt: 'Citizen science projects use smartphone apps to record reef observations.', answer: 'TRUE', evidence: 'Citizen science projects train divers to monitor bleaching and report data through smartphone apps.' }
      ],
      headings: {
        options: headingOptions([
          'How coral colonies form and gain color',
          'Ecological and economic services of reefs',
          'Threats from climate, chemistry, and fishing',
          'Restoration techniques and protected zones',
          'Global policy debates and funding disputes',
          'Community education and monitoring efforts',
          'Calcium carbonate skeletons',
          'Reef-safe sunscreen'
        ]),
        questions: [
          { prompt: 'Paragraph A', answer: 'i', evidence: 'These underwater structures form when tiny animals called polyps secrete calcium carbonate skeletons that accumulate over centuries.' },
          { prompt: 'Paragraph C', answer: 'iii', evidence: 'Today reefs face multiple stresses.' },
          { prompt: 'Paragraph D', answer: 'iv', evidence: 'Marine protected areas restrict fishing and anchor damage, allowing some reefs to recover when bleaching events are mild.' },
          { prompt: 'Paragraph F', answer: 'vi', evidence: 'Public education campaigns encourage tourists to use reef-safe sunscreen and avoid touching fragile colonies.' }
        ]
      }
    },
    {
      title: 'The Mystery of Stonehenge',
      paragraphs: [
        ['A', 'Stonehenge, a prehistoric monument on Salisbury Plain in southern England, has fascinated visitors for centuries. Its outer ring of massive sarsen stones, capped by horizontal lintels, encircles smaller bluestones transported from Wales nearly 250 kilometers away. Construction occurred in several phases between roughly 3000 and 1500 BCE, long before written records explain its purpose.'],
        ['B', 'Archaeologists once assumed slaves dragged every stone manually, but modern experiments show that teams using wooden sledges, ropes, and lever systems could move multi-ton blocks with organized labor. River routes may have helped transport bluestones closer to the site before overland hauling.'],
        ['C', 'Many researchers believe Stonehenge functioned as a ceremonial calendar. On the summer solstice, the rising sun aligns with the heel stone avenue, suggesting rituals linked to seasons and agriculture. Burials found nearby indicate the area also served as a cemetery for elite individuals over generations.'],
        ['D', 'Alternative theories propose healing sanctuaries or pilgrimage destinations because several bluestones show signs of prehistoric chipping, possibly to collect fragments believed to possess medicinal power. Skeptics counter that such interpretations rely on limited physical evidence.'],
        ['E', 'Nearby settlements such as Durrington Walls reveal feasting debris and temporary housing, implying large gatherings during construction phases. Pig bones suggest communal barbecues, and pottery shards connect the site to wider Neolithic networks across Britain.'],
        ['F', 'Today Stonehenge is managed as a UNESCO World Heritage site with controlled visitor access to reduce erosion. Ground-penetrating radar continues revealing hidden pits and timber circles, proving that the landscape held broader ritual significance than the visible stone ring alone.']
      ],
      fill: [
        { prompt: 'Smaller bluestones were brought from the region of ________.', answer: 'Wales', evidence: 'Its outer ring of massive sarsen stones, capped by horizontal lintels, encircles smaller bluestones transported from Wales nearly 250 kilometers away' },
        { prompt: 'Builders may have moved huge blocks using wooden sledges and ________.', answer: 'ropes', evidence: 'Modern experiments show that teams using wooden sledges, ropes, and lever systems could move multi-ton blocks with organized labor' },
        { prompt: 'On the summer solstice, sunrise lines up with the ________ stone.', answer: 'heel', evidence: 'On the summer solstice, the rising sun aligns with the heel stone avenue, suggesting rituals linked to seasons and agriculture' },
        { prompt: 'Evidence at Durrington Walls includes remains of ________ consumed at feasts.', answer: 'pigs', evidence: 'Pig bones suggest communal barbecues, and pottery shards connect the site to wider Neolithic networks across Britain', acceptedAnswers: ['pig'] },
        { prompt: 'Radar surveys reveal additional pits and timber ________ nearby.', answer: 'circles', evidence: 'Ground-penetrating radar continues revealing hidden pits and timber circles, proving that the landscape held broader ritual significance than the visible stone ring alone' }
      ],
      judgement: [
        { prompt: 'Stonehenge was completed in a single year by Roman engineers.', answer: 'FALSE', evidence: 'Construction occurred in several phases between roughly 3000 and 1500 BCE, long before written records explain its purpose.' },
        { prompt: 'Experiments suggest organized teams could transport very heavy stones.', answer: 'TRUE', evidence: 'Modern experiments show that teams using wooden sledges, ropes, and lever systems could move multi-ton blocks with organized labor.' },
        { prompt: 'The summer solstice alignment supports ideas about seasonal rituals.', answer: 'TRUE', evidence: 'On the summer solstice, the rising sun aligns with the heel stone avenue, suggesting rituals linked to seasons and agriculture.' },
        { prompt: 'UNESCO status requires unlimited public access to touch the stones.', answer: 'FALSE', evidence: 'Today Stonehenge is managed as a UNESCO World Heritage site with controlled visitor access to reduce erosion.' }
      ],
      headings: {
        options: headingOptions([
          'Description and timeline of construction',
          'Methods for transporting massive stones',
          'Astronomical alignment and burial evidence',
          'Debated roles as shrine or hospital',
          'Evidence of large seasonal gatherings',
          'Modern research and heritage protection',
          'Horizontal lintels',
          'Durrington Walls reveal feasting debris'
        ]),
        questions: [
          { prompt: 'Paragraph B', answer: 'ii', evidence: 'Modern experiments show that teams using wooden sledges, ropes, and lever systems could move multi-ton blocks with organized labor.' },
          { prompt: 'Paragraph C', answer: 'iii', evidence: 'On the summer solstice, the rising sun aligns with the heel stone avenue, suggesting rituals linked to seasons and agriculture.' },
          { prompt: 'Paragraph E', answer: 'v', evidence: 'Nearby settlements such as Durrington Walls reveal feasting debris and temporary housing, implying large gatherings during construction phases.' },
          { prompt: 'Paragraph F', answer: 'vi', evidence: 'Ground-penetrating radar continues revealing hidden pits and timber circles, proving that the landscape held broader ritual significance than the visible stone ring alone.' }
        ]
      }
    }
  ],
  10: [
    {
      title: 'Human Space Exploration',
      paragraphs: [
        ['A', 'Humanity\'s venture beyond Earth began during the Cold War, when the United States and Soviet Union competed for technological prestige. The Soviet launch of Sputnik in 1957 shocked American leaders, prompting massive funding for rockets and astronaut training. Yuri Gagarin\'s 1961 orbital flight proved that humans could survive weightlessness, at least for short periods.'],
        ['B', 'The Apollo program culminated in 1969 when Neil Armstrong and Buzz Aldrin walked on the Moon, fulfilling President Kennedy\'s pledge to land astronauts before the decade ended. Six subsequent missions collected rock samples, deployed scientific instruments, and tested lunar roving vehicles. Public interest later waned as budgets tightened and political priorities shifted.'],
        ['C', 'Space stations extended stays in orbit. Mir and the International Space Station host international crews conducting experiments in microgravity, studying plant growth, fluid behavior, and human bone loss. Such research aims to prepare for longer missions to Mars, where radiation and supply challenges are far greater.'],
        ['D', 'Robotic probes have explored every planet in the solar system, sending images and data far more cheaply than crewed flights. Rovers on Mars drill into rocks searching for signs of ancient microbial life, while telescopes like James Webb observe distant galaxies formed shortly after the Big Bang.'],
        ['E', 'Private companies now launch satellites and ferry astronauts to orbit, reducing reliance on government agencies. Reusable boosters lower costs, and commercial firms advertise tourist flights for wealthy civilians. Regulators debate how to manage space traffic and orbital debris as launches multiply.'],
        ['F', 'Future ambitions include lunar bases as staging points and crewed Mars landings within coming decades. International treaties require peaceful use of celestial bodies, yet resource extraction rules remain unclear. Whether humanity becomes a multi-planet species depends on sustained funding, engineering breakthroughs, and global cooperation.']
      ],
      fill: [
        { prompt: 'The Soviet satellite Sputnik was launched in ________.', answer: '1957', evidence: 'The Soviet launch of Sputnik in 1957 shocked American leaders, prompting massive funding for rockets and astronaut training', acceptedAnswers: [] },
        { prompt: 'Neil Armstrong first set foot on the Moon in ________.', answer: '1969', evidence: 'The Apollo program culminated in 1969 when Neil Armstrong and Buzz Aldrin walked on the Moon', acceptedAnswers: [] },
        { prompt: 'Crews on the International Space Station study how microgravity affects human ________ loss.', answer: 'bone', evidence: 'Mir and the International Space Station host international crews conducting experiments in microgravity, studying plant growth, fluid behavior, and human bone loss' },
        { prompt: 'Mars rovers search rocks for evidence of ancient microbial ________.', answer: 'life', evidence: 'Rovers on Mars drill into rocks searching for signs of ancient microbial life, while telescopes like James Webb observe distant galaxies formed shortly after the Big Bang' },
        { prompt: 'Reusable rocket boosters help cut the ________ of reaching orbit.', answer: 'costs', evidence: 'Reusable boosters lower costs, and commercial firms advertise tourist flights for wealthy civilians', acceptedAnswers: ['cost'] }
      ],
      judgement: [
        { prompt: 'Gagarin completed the first human journey into space in 1961.', answer: 'TRUE', evidence: 'Yuri Gagarin\'s 1961 orbital flight proved that humans could survive weightlessness, at least for short periods.' },
        { prompt: 'Apollo astronauts visited the Moon only once.', answer: 'FALSE', evidence: 'Six subsequent missions collected rock samples, deployed scientific instruments, and tested lunar roving vehicles.' },
        { prompt: 'The James Webb telescope orbits Mars to photograph the surface.', answer: 'NOT GIVEN', evidence: 'Rovers on Mars drill into rocks searching for signs of ancient microbial life, while telescopes like James Webb observe distant galaxies formed shortly after the Big Bang.' },
        { prompt: 'Private firms have begun carrying astronauts to orbit.', answer: 'TRUE', evidence: 'Private companies now launch satellites and ferry astronauts to orbit, reducing reliance on government agencies.' }
      ],
      headings: {
        options: headingOptions([
          'Cold War competition and early milestones',
          'The Moon landing and later Apollo missions',
          'Long-duration orbital research',
          'Uncrewed exploration of planets and deep space',
          'Commercial launch industry and tourism',
          'Ambitions for bases and Mars missions',
          'Sputnik in 1957',
          'Human bone loss'
        ]),
        questions: [
          { prompt: 'Paragraph A', answer: 'i', evidence: 'Humanity\'s venture beyond Earth began during the Cold War, when the United States and Soviet Union competed for technological prestige.' },
          { prompt: 'Paragraph B', answer: 'ii', evidence: 'The Apollo program culminated in 1969 when Neil Armstrong and Buzz Aldrin walked on the Moon, fulfilling President Kennedy\'s pledge to land astronauts before the decade ended.' },
          { prompt: 'Paragraph D', answer: 'iv', evidence: 'Robotic probes have explored every planet in the solar system, sending images and data far more cheaply than crewed flights.' },
          { prompt: 'Paragraph E', answer: 'v', evidence: 'Private companies now launch satellites and ferry astronauts to orbit, reducing reliance on government agencies.' }
        ]
      }
    },
    {
      title: 'The History of the Internet',
      paragraphs: [
        ['A', 'The internet evolved from ARPANET, a United States defense research project launched in the late 1960s to connect university computers. Engineers developed packet switching, which breaks messages into small chunks that can travel separate routes and reassemble at the destination. This design kept communication functioning even if parts of the network were damaged.'],
        ['B', 'During the 1970s and 1980s, technical standards such as TCP/IP allowed disparate networks to interconnect, forming a global infrastructure. Email became an essential tool for scientists, while bulletin board systems let hobbyists share files slowly over telephone modems.'],
        ['C', 'Tim Berners-Lee invented the World Wide Web in 1989 at CERN, introducing hypertext links that made navigating documents intuitive. Web browsers and search engines followed in the 1990s, transforming the internet from a specialist tool into a mainstream consumer platform.'],
        ['D', 'Broadband connections, Wi-Fi, and mobile phones accelerated access. Social media companies built vast audiences by offering free services funded through targeted advertising. Cloud computing shifted data storage and software applications from personal hard drives to remote servers.'],
        ['E', 'The internet\'s growth raised serious concerns about privacy, cybercrime, and misinformation. Governments debate how to regulate content without suppressing free speech, while hackers exploit security flaws in hospitals and power grids. Digital divides persist where rural or low-income communities lack affordable connectivity.'],
        ['F', 'Emerging technologies—5G networks, artificial intelligence, and the Internet of Things—promise smarter cities and autonomous vehicles but also increase dependence on fragile digital systems. Historians view the internet as one of the defining inventions of the late twentieth century, reshaping commerce, politics, and daily social interaction worldwide.']
      ],
      fill: [
        { prompt: 'ARPANET originally linked computers at American ________.', answer: 'universities', evidence: 'The internet evolved from ARPANET, a United States defense research project launched in the late 1960s to connect university computers' },
        { prompt: 'Packet switching divides messages into small ________.', answer: 'chunks', evidence: 'Engineers developed packet switching, which breaks messages into small chunks that can travel separate routes and reassemble at the destination' },
        { prompt: 'Tim Berners-Lee created the World Wide Web while working at ________.', answer: 'CERN', evidence: 'Tim Berners-Lee invented the World Wide Web in 1989 at CERN, introducing hypertext links that made navigating documents intuitive', acceptedAnswers: [] },
        { prompt: 'Social media platforms often rely on targeted ________ for revenue.', answer: 'advertising', evidence: 'Social media companies built vast audiences by offering free services funded through targeted advertising' },
        { prompt: 'Many rural areas still suffer from a digital ________.', answer: 'divide', evidence: 'Digital divides persist where rural or low-income communities lack affordable connectivity' }
      ],
      judgement: [
        { prompt: 'ARPANET was designed partly to maintain communication after network damage.', answer: 'TRUE', evidence: 'This design kept communication functioning even if parts of the network were damaged.' },
        { prompt: 'Email appeared only after the World Wide Web became popular.', answer: 'FALSE', evidence: 'Email became an essential tool for scientists, while bulletin board systems let hobbyists share files slowly over telephone modems.' },
        { prompt: 'Tim Berners-Lee developed the web while employed at a European physics laboratory.', answer: 'TRUE', evidence: 'Tim Berners-Lee invented the World Wide Web in 1989 at CERN, introducing hypertext links that made navigating documents intuitive.' },
        { prompt: 'Governments agree on a single global law banning online misinformation.', answer: 'NOT GIVEN', evidence: 'Governments debate how to regulate content without suppressing free speech, while hackers exploit security flaws in hospitals and power grids.' }
      ],
      headings: {
        options: headingOptions([
          'Military origins and packet switching',
          'Early standards and user communities',
          'Creation of the web and public browsers',
          'Broadband, social media, and cloud services',
          'Security, inequality, and policy debates',
          'Next-generation connected technologies',
          'TCP/IP',
          'Hypertext links'
        ]),
        questions: [
          { prompt: 'Paragraph A', answer: 'i', evidence: 'Engineers developed packet switching, which breaks messages into small chunks that can travel separate routes and reassemble at the destination.' },
          { prompt: 'Paragraph C', answer: 'iii', evidence: 'Tim Berners-Lee invented the World Wide Web in 1989 at CERN, introducing hypertext links that made navigating documents intuitive.' },
          { prompt: 'Paragraph D', answer: 'iv', evidence: 'Broadband connections, Wi-Fi, and mobile phones accelerated access.' },
          { prompt: 'Paragraph E', answer: 'v', evidence: 'The internet\'s growth raised serious concerns about privacy, cybercrime, and misinformation.' }
        ]
      }
    }
  ]
}
