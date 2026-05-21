import cam18test01 from '../scripts/part1-scripts/cam18-test01.txt?raw'
import cam18test02 from '../scripts/part1-scripts/cam18-test02.txt?raw'
import cam18test03 from '../scripts/part1-scripts/cam18-test03.txt?raw'
import cam18test04 from '../scripts/part1-scripts/cam18-test04.txt?raw'
import cam19test01 from '../scripts/part1-scripts/cam19-test01.txt?raw'
import cam19test02 from '../scripts/part1-scripts/cam19-test02.txt?raw'
import cam19test03 from '../scripts/part1-scripts/cam19-test03.txt?raw'
import cam19test04 from '../scripts/part1-scripts/cam19-test04.txt?raw'
import cam20test01 from '../scripts/part1-scripts/cam20-test01.txt?raw'
import cam20test02 from '../scripts/part1-scripts/cam20-test02.txt?raw'
import cam20test03 from '../scripts/part1-scripts/cam20-test03.txt?raw'
import cam20test04 from '../scripts/part1-scripts/cam20-test04.txt?raw'

/** Verified pattern for Cambridge 18–20 Part 1 (see listening-set-1.html). */
export const CAMBRIDGE_PART1_AUDIO_BY_TEST: Record<string, string> = {
  '18-1': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam18-test1-part1.m4a',
  '18-2': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam18-test2-part1.m4a',
  '18-3': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam18-test3-part1.m4a',
  '18-4': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam18-test4-part1.m4a',
  '19-1': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam19-test1-part1.m4a',
  '19-2': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam19-test2-part1.m4a',
  '19-3': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam19-test3-part1.m4a',
  '19-4': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam19-test4-part1.m4a',
  '20-1': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam20-test1-part1.m4a',
  '20-2': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam20-test2-part1.m4a',
  '20-3': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam20-test3-part1.m4a',
  '20-4': 'https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam20-test4-part1.m4a'
}

export const CAMBRIDGE_PART1_SCRIPT_BY_TEST: Record<string, string> = {
  '18-1': cam18test01.trim(),
  '18-2': cam18test02.trim(),
  '18-3': cam18test03.trim(),
  '18-4': cam18test04.trim(),
  '19-1': cam19test01.trim(),
  '19-2': cam19test02.trim(),
  '19-3': cam19test03.trim(),
  '19-4': cam19test04.trim(),
  '20-1': cam20test01.trim(),
  '20-2': cam20test02.trim(),
  '20-3': cam20test03.trim(),
  '20-4': cam20test04.trim()
}

/** Official Part 1 answer keys from Cambridge 18–20 audioscript pages. */
export const CAMBRIDGE_PART1_ANSWERS_BY_TEST: Record<string, Record<string, string>> = {
  '18-1': {
    '1': 'DW30 7YZ / DW3Q 7YZ',
    '2': '24 April',
    '3': 'dentist',
    '4': 'parking',
    '5': 'Claxby',
    '6': 'late',
    '7': 'evening',
    '8': 'supermarket',
    '9': 'pollution',
    '10': 'storage'
  },
  '18-2': {
    '1': 'training',
    '2': 'discount',
    '3': 'taxi',
    '4': 'service',
    '5': 'English',
    '6': 'Wivenhoe',
    '7': 'equipment',
    '8': '9.75 / nine point seven five',
    '9': 'deliveries',
    '10': 'Sunday'
  },
  '18-3': {
    '1': 'Marrowfield',
    '2': 'relative',
    '3': 'socialise / socialize',
    '4': 'full',
    '5': 'Domestic Life',
    '6': 'clouds',
    '7': 'timing',
    '8': 'Animal Magic',
    '9': 'movement',
    '10': 'dark'
  },
  '18-4': {
    '1': 'receptionist',
    '2': 'Medical',
    '3': 'Chastons',
    '4': 'appointments',
    '5': 'database',
    '6': 'experience',
    '7': 'confident',
    '8': 'temporary',
    '9': '1.15 / 1:15 / one fifteen',
    '10': 'parking'
  },
  '19-1': {
    '1': '69 / sixty-nine',
    '2': 'stream',
    '3': 'data',
    '4': 'map',
    '5': 'visitors',
    '6': 'sounds',
    '7': 'freedom',
    '8': 'skills',
    '9': '4.95',
    '10': 'leaders'
  },
  '19-2': {
    '1': 'Mathieson',
    '2': 'beginners',
    '3': 'college',
    '4': 'New',
    '5': '11',
    '6': 'instrument',
    '7': 'ear',
    '8': 'clapping',
    '9': 'recording',
    '10': 'alone'
  },
  '19-3': {
    '1': 'harbour / harbor',
    '2': 'bridge',
    '3': '3.30 / 3:30 / three thirty / half past three / half 3 / three',
    '4': 'Rose / rose',
    '5': 'sign',
    '6': 'purple',
    '7': 'samphire',
    '8': 'melon',
    '9': 'coconut',
    '10': 'strawberry'
  },
  '19-4': {
    '1': 'Kaeden',
    '2': 'locker / lockers',
    '3': 'passport',
    '4': 'uniform',
    '5': 'third / 3rd',
    '6': '0412 665 903 / 0412665903 / oh-four-one-two double-six-five nine-oh-three',
    '7': 'yellow',
    '8': 'plastic',
    '9': 'ice',
    '10': 'gloves'
  },
  '20-1': {
    '1': 'fish',
    '2': 'roof',
    '3': 'Spanish',
    '4': 'vegetarian',
    '5': 'Audley',
    '6': 'hotel',
    '7': 'reviews',
    '8': 'local',
    '9': '30 / thirty',
    '10': 'average'
  },
  '20-2': {
    '1': 'break',
    '2': 'time',
    '3': 'shower',
    '4': 'money',
    '5': 'memory',
    '6': 'lifting',
    '7': 'fall',
    '8': 'taxi',
    '9': 'insurance',
    '10': 'stress'
  },
  '20-3': {
    '1': '239 / two hundred thirty-nine / two hundred and thirty-nine',
    '2': 'modern',
    '3': 'lamp',
    '4': 'Aaron',
    '5': 'damage',
    '6': 'electronic',
    '7': 'insurance',
    '8': 'Space / space',
    '9': 'app',
    '10': 'exchanges'
  },
  '20-4': {
    '1': 'Kings / King\'s',
    '2': '125 / one hundred twenty-five / one hundred and twenty-five',
    '3': 'walking',
    '4': 'boat',
    '5': 'Tuesday',
    '6': 'space',
    '7': 'vegetarian / vegerarian',
    '8': '2.30 / 2:30 / two thirty / half past two / half 2',
    '9': '75 / seventy-five',
    '10': 'port'
  }
}
