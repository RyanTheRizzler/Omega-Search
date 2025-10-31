import React, { useState, useEffect } from 'react';
import { Spinner } from './Spinner';

const loadingMessages = [
  "Verifying sources against academic databases...",
  "Ensuring every link is from a verified authority...",
  "Filtering out blogs and opinion pieces...",
  "Cross-referencing information for factual accuracy...",
  "Consulting with peer-reviewed journals...",
  "Did you know? Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
  "Did you know? A group of flamingos is called a 'flamboyance'.",
  "Did you know? The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion of the iron.",
  "Did you know? Octopuses have three hearts and blue blood.",
  "Did you know? The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after just 38 minutes.",
  "Did you know? A single cloud can weigh more than a million pounds.",
  "Did you know? The national animal of Scotland is the unicorn.",
  "Did you know? There are more trees on Earth than stars in the Milky Way galaxy.",
  "Did you know? A day on Venus is longer than a year on Venus.",
  "Did you know? Bananas are berries, but strawberries aren't.",
  "Did you know? Wombat poop is cube-shaped.",
  "Did you know? The name for the fear of long words is 'hippopotomonstrosesquippedaliophobia'.",
  "Did you know? A shrimp's heart is in its head.",
  "Did you know? It can rain diamonds on Jupiter and Saturn.",
  "Did you know? The quietest room in the world, an anechoic chamber at Microsoft's headquarters, is so silent you can hear your own blood flowing.",
  "Did you know? The first oranges weren't orange.",
  "Did you know? There’s a species of jellyfish that is immortal.",
  "Did you know? A crocodile cannot stick its tongue out.",
  "Did you know? The Roman emperor Caligula once declared war on the sea god Neptune.",
  "Did you know? In Switzerland, it is illegal to own just one guinea pig.",
  "Did you know? The dot over the letter 'i' and 'j' is called a tittle.",
  "Did you know? A bolt of lightning is five times hotter than the surface of the sun.",
  "Did you know? Otters hold hands while they sleep so they don't float away from each other.",
  "Did you know? The King of Hearts is the only king in a deck of cards without a mustache.",
  "Did you know? Crows are smart enough to recognize human faces and hold grudges.",
  "Did you know? The inventor of the Pringles can is now buried in one.",
  "Did you know? The unicorn is the national animal of Scotland.",
  "Did you know? The human brain takes in 11 million bits of information every second but is aware of only 40.",
  "Did you know? The Great Wall of China is not visible from the moon with the naked eye.",
  "Did you know? A cow-bison hybrid is called a 'beefalo'.",
  "Did you know? A baby puffin is called a 'puffling'.",
  "Did you know? It is impossible for most people to lick their own elbow.",
  "Did you know? An ostrich's eye is bigger than its brain.",
  "Did you know? The Hawaiian alphabet has only 12 letters.",
  "Did you know? A 'jiffy' is an actual unit of time: 1/100th of a second.",
  "Did you know? The moon has 'moonquakes'.",
  "Did you know? The sound of a whip cracking is actually a small sonic boom.",
  "Did you know? The fingerprints of a koala are so indistinguishable from humans that they have on occasion been confused at a crime scene.",
  "Did you know? The world's oldest piece of chewing gum is over 9,000 years old.",
  "Did you know? In the 16th century, Turkish women could legally divorce their husbands if they didn't provide enough coffee.",
  "Did you know? A group of owls is called a 'parliament'.",
  "Did you know? The word 'avocado' comes from the Aztec word for 'testicle'.",
  "Did you know? Humans share 50% of their DNA with bananas.",
  "Did you know? Before the invention of erasers, people used breadcrumbs to remove pencil marks.",
  "Did you know? The first-ever VCR was the size of a piano.",
  "Did you know? The state of Wyoming has only two escalators.",
  "Did you know? There are more possible iterations of a game of chess than there are atoms in the known universe.",
  "Did you know? The longest English word is 189,819 letters long and it's the chemical name for titin.",
  "Did you know? Sea lions can dance to a beat.",
  "Did you know? Carrots were originally purple.",
  "Did you know? The word 'nerd' was first coined by Dr. Seuss in 'If I Ran the Zoo'.",
  "Did you know? A group of porcupines is called a 'prickle'.",
  "Did you know? The unicorn is the national animal of Scotland. (It's worth repeating!)",
  "Did you know? A cat has 32 muscles in each ear.",
  "Did you know? Goats have rectangular pupils.",
  "Did you know? The blob of toothpaste that sits on your toothbrush has a name: a 'nurdle'.",
  "Did you know? Your nose can remember 50,000 different scents.",
  "Did you know? Australia is wider than the moon.",
  "Did you know? The original London Bridge is now in Arizona.",
  "Did you know? There's a 'dinosaur' comic that has been running on the internet since 2003, with the same image in every strip.",
  "Did you know? Snails can sleep for three years.",
  "Did you know? The human stomach can dissolve razor blades.",
  "Did you know? The word 'robot' comes from a Czech word 'robota', meaning forced labor.",
  "Did you know? A dentist invented the electric chair.",
  "Did you know? The longest time between two twins being born is 87 days.",
  "Did you know? A flea can jump 350 times its body length.",
  "Did you know? In ancient Rome, it was considered a sign of leadership to have a crooked nose.",
  "Did you know? The hashtag symbol is technically called an octothorpe.",
  "Did you know? Some cats are allergic to humans.",
  "Did you know? Hot water will turn into ice faster than cold water.",
  "Did you know? The state of Ohio is the only U.S. state that does not have a rectangular flag.",
  "Did you know? A group of rhinos is called a 'crash'.",
  "Did you know? The voice actors for Mickey and Minnie Mouse were married in real life.",
  "Did you know? Chewing gum boosts concentration.",
  "Did you know? The fear of being tickled by feathers is called pteronophobia.",
  "Did you know? Russia has a larger surface area than Pluto.",
  "Did you know? You can't hum while holding your nose closed.",
  "Did you know? Dragonflies have six legs but can't walk.",
  "Did you know? The first movie to ever use a toilet flushing was Alfred Hitchcock's 'Psycho'.",
  "Did you know? A snail's mouth is no larger than the head of a pin, but it can have over 25,000 teeth.",
  "Did you know? Astronauts' height can temporarily increase by about 2 inches in space.",
  "Did you know? The world's largest desert is Antarctica.",
  "Did you know? A group of crows is called a 'murder'.",
  "Did you know? The word 'checkmate' in chess comes from the Persian phrase 'Shah Mat,' which means 'the king is dead'.",
  "Did you know? The color 'orange' was named after the fruit, not the other way around.",
  "Did you know? Armadillos have four identical babies at a time.",
  "Did you know? A polar bear's skin is black.",
  "Did you know? If you lift a kangaroo's tail off the ground it can't hop.",
  "Did you know? The term 'cyberspace' was coined by science fiction author William Gibson in 1982.",
  "Did you know? The electric eel is not actually an eel.",
  "Did you know? The world's oldest-known recipe is for beer.",
  "Did you know? Marie Curie's notebooks are still radioactive.",
  "Did you know? The longest hiccuping spree on record lasted 68 years.",
  "Did you know? In Japan, letting a sumo wrestler make your baby cry is considered good luck.",
  "Did you know? The inventor of the frisbee was turned into a frisbee after he died.",
  "Did you know? The pyramids of Giza were built with a workforce of paid laborers, not slaves.",
  "Did you know? A human could swim through the arteries of a blue whale.",
];

export const LoadingIndicator: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set initial message
    let initialMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    setMessage(initialMessage);
    setIsVisible(true);

    const interval = setInterval(() => {
      setIsVisible(false); // Start fade out
      setTimeout(() => {
        // After fade out, change message and fade in
        setMessage(prevMessage => {
          let newMessage;
          do {
            newMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
          } while (newMessage === prevMessage); // Ensure new message is different
          return newMessage;
        });
        setIsVisible(true);
      }, 500); // This duration should match the CSS transition duration
    }, 4000); // Total time per message (3.5s visible + 0.5s transition)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mt-8">
      <Spinner />
      <p 
        className="mt-4 text-gray-500 dark:text-gray-400 transition-opacity duration-500 ease-in-out h-12 flex items-center justify-center"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {message}
      </p>
    </div>
  );
};