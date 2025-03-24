// app/lib/tarotImages.ts

export type TarotCard = {
  id: number;
  name: string;
  image: string;
};

export const tarotImages: TarotCard[] = [
  { id: 0, name: 'The Fool', image: '/cards/0_fool.jpg' },
  { id: 1, name: 'The Magician', image: '/cards/1_magician.jpg' },
  { id: 2, name: 'The High Priestess', image: '/cards/2_high_priestess.jpg' },
  { id: 3, name: 'The Empress', image: '/cards/3_empress.jpg' },
  { id: 4, name: 'The Emperor', image: '/cards/4_emperor.jpg' },
  { id: 5, name: 'The Hierophant', image: '/cards/5_hierophant.jpg' },
  { id: 6, name: 'The Lovers', image: '/cards/6_lovers.jpg' },
  { id: 7, name: 'The Chariot', image: '/cards/7_chariot.jpg' },
  { id: 8, name: 'Strength', image: '/cards/8_strength.jpg' },
  { id: 9, name: 'The Hermit', image: '/cards/9_hermit.jpg' },
  { id: 10, name: 'Wheel of Fortune', image: '/cards/10_wheel_of_fortune.jpg' },
  { id: 11, name: 'Justice', image: '/cards/11_justice.jpg' },
  { id: 12, name: 'The Hanged Man', image: '/cards/12_hanged_man.jpg' },
  { id: 13, name: 'Death', image: '/cards/13_death.jpg' },
  { id: 14, name: 'Temperance', image: '/cards/14_temperance.jpg' },
  { id: 15, name: 'The Devil', image: '/cards/15_devil.jpg' },
  { id: 16, name: 'The Tower', image: '/cards/16_tower.jpg' },
  { id: 17, name: 'The Star', image: '/cards/17_star.jpg' },
  { id: 18, name: 'The Moon', image: '/cards/18_moon.jpg' },
  { id: 19, name: 'The Sun', image: '/cards/19_sun.jpg' },
  { id: 20, name: 'Judgement', image: '/cards/20_judgement.jpg' },
  { id: 21, name: 'The World', image: '/cards/21_world.jpg' },
];
