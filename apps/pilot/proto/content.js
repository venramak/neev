/* Neev · content
   Everything a writer edits lives in this file. The app reads it at start-up.
   Marked "CONFIRM" = a value the author still has to supply or check. */

window.NEEV = {
  version: "0.9.0",
  // Where the app will live once hosted. Share cards and deep links use it.
  appUrl: "https://neev.twopointsingularity.com/", // CONFIRM: final address
  seriesUrl: "https://www.youtube.com/@TwoPointSingularity", // CONFIRM: playlist link
  whitePaperUrl: "", // CONFIRM: The Coherence Lens, PsyArXiv link once deposited
  patreonUrl: "https://www.patreon.com/", // CONFIRM
  supportUrl: "", // CONFIRM: one-time support page (Razorpay / UPI)
  // Episode release dates (ISO). Until a date passes, the app treats that episode as "coming".
  releases: { 1: "2027-01-08", 2: "2027-01-15", 3: "2027-01-22", 4: "2027-01-29", 5: "2027-02-05" }, // Fridays 7 pm IST; Parichay releases with Ep 1

  mantra: {
    hi: "Har mann bhatakta hai. Koi akela wapas nahi aata.",
    en: "Every mind drifts. Nobody comes back alone."
  },
  header: ["Be good.", "Be useful.", "Be resourceful.", "Be consistent."],
  oneLine: { hi: "Bas yaad aaya. Kaise ho?", en: "I just thought of you. How are you?" },

  /* Season 1. CONFIRM: titles and questions follow the latest drafts shared in Nov 2026. */
  episodes: [
    {
      n: 1, title: "Chaar Sau Chhe", book: "village",
      q: { hi: "Aap kitne logon se bane hain?", en: "How many people are you made of?" },
      act: {
        hi: "Us naam ko ek line bhejiye jo raat 2:40 baje sabse pehle yaad aaya: \"Bas yaad aaya. Kaise ho?\"",
        en: "Send one line to the name that came first at 2:40 a.m.: \"I just thought of you. How are you?\""
      },
      gone: { hi: "Agar woh ab nahi rahe: unhe ek line likhiye, aur rakh lijiye.", en: "If they are gone: write them one line, and keep it." },
      cant: { hi: "Aaj nahi ho paaye toh: bas naam likh lijiye.", en: "If you can't today: just write the name down." },
      card: "line"
    },
    {
      n: 2, title: "Pehla Haath", book: "lhq",
      q: { hi: "Toh sabse pehle, aapko kisne thaama tha?", en: "So who held you first?" },
      act: {
        hi: "Apne paas walon mein se kisi se ek aisi cheez poochhiye jo sirf woh jaante hain: koi nuskha, koi kahani, koi gaana. Likh lijiye.",
        en: "Ask someone close for one thing only they know: a recipe, a story, a song. Write it down."
      },
      gone: { hi: "Agar woh ab nahi rahe: jo woh chhod gaye, yaad se likh lijiye.", en: "If they are gone: write down, from memory, what they left you." },
      cant: { hi: "Aaj nahi ho paaye toh: likh lijiye ki kisse poochhenge.", en: "If you can't today: write down whom you would ask." },
      card: "ask"
    },
    {
      n: 3, title: "Do Darwaze", book: "tdor",
      q: { hi: "Jab hum itne ho gaye ki ek doosre ko jaan hi nahi sakte the, tab humein kisne joda?", en: "When there were too many of us to know each other, what held us together?" },
      act: {
        hi: "Is hafte kisi ke saath ek chhoti rasm nibhaiye. Wahi din, wahi waqt.",
        en: "Keep one small ritual with someone this week. Same day, same time."
      },
      gone: { hi: "Agar koi nahi hai: akele nibhaiye, ya apne daayre ke bahar kisi ko bulaiye.", en: "If there is no one: keep it alone, or open it to someone outside your circle." },
      cant: { hi: "Aaj nahi ho paaye toh: dekhiye ki aap kise bulaate.", en: "If you can't today: notice whom you would invite." },
      card: "ritual"
    },
    {
      n: 4, title: "Gawah", book: "tps",
      q: { hi: "Ab ek nayi cheez aa gayi hai, jo sab jaanti hai aur kabhi nahi soti. Kya woh humein jod sakti hai?", en: "Something new has arrived that knows everything and never sleeps. Can it hold us together?" },
      act: {
        hi: "Ek ghanta, ek insaan, phone doosre kamre mein.",
        en: "One hour, one person, the phone in another room."
      },
      gone: { hi: "Agar woh ab nahi rahe: woh ghanta unke naam kijiye. Unhe likhiye, ya unki yaad ke saath baithiye.", en: "If they are gone: give the hour to them. Write to them, or sit with their memory." },
      cant: { hi: "Aaj nahi ho paaye toh: likh lijiye ki woh ghanta kiske saath bitaayenge.", en: "If you can't today: write down whom you would spend it with." },
      card: "hour"
    },
    {
      n: 5, title: "Neev", book: "noht",
      q: { hi: "Toh neev kahan hai? Aur use kaun rakhega?", en: "So where is the foundation? And who will keep it?" },
      act: {
        hi: "Apna Mangalvaar chuniye: ek din, ek waqt, ek insaan. Aur ek naam seekhiye, kisi aise ka jo roz aapka din chalaata hai.",
        en: "Choose your Tuesday: one day, one time, one person. And learn one name, of someone who keeps your day running."
      },
      gone: { hi: "Agar koi nahi hai: apne beete kal se ek naam yaad kijiye, jisne aapko thaama tha.", en: "If there is no one: recall a name from your past, someone who held you." },
      cant: { hi: "Aaj nahi ho paaye toh: likh lijiye ki aapka Mangalvaar kaunsa hoga.", en: "If you can't today: write down which Tuesday will be yours." },
      card: "tuesday"
    }
  ],

  /* The five jobs, with the objects from the Intro's table. */
  jobs: [
    { id: "settle", obj: "diya", hi: "Sukoon", en: "Settle", ask: { hi: "Jab sab bikhar raha ho, kiske paas baith kar aap shaant ho jaate hain?", en: "When everything is coming apart, near whom do you grow calm?" } },
    { id: "sharpen", obj: "mirror", hi: "Sach", en: "Sharpen", ask: { hi: "Kaun aapko woh sach bolta hai jo aap sunna nahi chahte?", en: "Who tells you the truth you don't want to hear?" } },
    { id: "carry", obj: "weight", hi: "Sahara", en: "Carry", ask: { hi: "Mushkil mein, bina bulaaye kaun aayega?", en: "In trouble, who would come without being called?" } },
    { id: "belong", obj: "key", hi: "Apnapan", en: "Belong", ask: { hi: "Kahan aap \"main\" nahi, \"hum\" hain?", en: "Where are you not \"I\" but \"we\"?" } },
    { id: "aim", obj: "torch", hi: "Disha", en: "Aim", ask: { hi: "Raasta bhool jaayein, toh kaun dikhata hai?", en: "When you lose the way, who shows it?" } }
  ],
  drift: { id: "drift", hi: "Bhatakne ke khilaaf", en: "Against drift" },

  rings: [
    { id: "4", hi: "Rasoi", en: "The Four", note: { hi: "Lagbhag 3 se 6 log, jo sabse zyada uthaate hain", en: "About 3 to 6 people who carry the most" } },
    { id: "15", hi: "Aangan", en: "The Fifteen", note: { hi: "Lagbhag 10 se 20 log, jinse milna-julna rehta hai", en: "About 10 to 20 people in regular touch" } },
    { id: "150", hi: "Mohalla", en: "The Hundred and Fifty", note: { hi: "Lagbhag 100 se 200 log, jinka naam aur kahani aap jaante hain", en: "About 100 to 200 people you know by name and story" } }
  ],

  /* The Neev List: eight lines. Prompts follow the series drafts. CONFIRM wording. */
  list: [
    { hi: "Woh naam jo raat 2:40 baje sabse pehle yaad aaya", en: "The name that came first at 2:40 a.m." },
    { hi: "Woh jinhone aapko sabse pehle thaama tha", en: "The one who held you first" },
    { hi: "Woh jo aapko woh sach batata hai jo aap sunna nahi chahte", en: "The one who tells you what you don't want to hear" },
    { hi: "Woh anjaan insaan jo roz aapka din chalaata hai", en: "The stranger who keeps your day running" },
    { hi: "Woh jise kabhi andar nahi bulaya gaya", en: "The one who was never asked in" },
    { hi: "Woh jiske saath ek ghanta, bina phone", en: "The one for an hour, without the phone" },
    { hi: "Woh jiski aap neev hain, ya jo aapki neev hai", en: "The one you hold up, or who holds you up" },
    { hi: "Khaali. Uske liye jo abhi aaya nahi.", en: "Empty. For someone who hasn't come yet." }
  ],

  /* Weekly habits from Two Doors, One Room. */
  tuesday: [
    { id: "line", hi: "Ek line", en: "The line", d: { hi: "Har hafte, wahi din, wahi waqt, ek insaan ko ek call.", en: "Every week, the same day and time, a call to one person." } },
    { id: "mirror", hi: "Aaina", en: "The mirror", d: { hi: "Kisi se ek sachchi baat, jo aap rok ke baithe the.", en: "One true sentence to someone, one you have been holding back." } },
    { id: "gathering", hi: "Baithak", en: "The gathering", d: { hi: "Wahi chehre, wahi jagah, phone door.", en: "The same faces, the same place, phones away." } }
  ],

  /* The four moves, for gaps on the Map. */
  moves: {
    mend: { hi: "Jodiye", en: "Mend", d: { hi: "Ek sachcha vaakya. \"Us din maine jo kaha, woh theek nahi tha.\"", en: "One honest sentence. \"What I said that day was not right.\"" } },
    spread: { hi: "Baantiye", en: "Spread", d: { hi: "Kisi naye se ek chhoti cheez maangiye. \"Kya aap 20 minute de sakte hain?\"", en: "Ask someone new for one small thing. \"Could you give me 20 minutes?\"" } },
    reach: { hi: "Yaad kijiye", en: "Reach", d: { hi: "\"Bas yaad aaya. Kaise ho?\"", en: "\"I just thought of you. How are you?\"" } },
    release: { hi: "Chhodiye", en: "Release", d: { hi: "Ek cheez chhodiye jo aapko chhota karti hai. \"Is baar main nahi kar paunga.\"", en: "Let one thing go that makes you smaller. \"I won't be able to do it this time.\"" } }
  },

  /* The test, for any tie (harm-4). Each 0 to 3. The canon's four questions, each phrased so that
     a higher answer means more harm; any 3, or a total of 6 or more, shows the gentle warning. */
  test: [
    { hi: "Is rishte mein kya main chhota mehsoos karta/karti hoon?", en: "In this tie, do I feel smaller?" },
    { hi: "Kya asahmat hone mein darr lagta hai?", en: "Am I afraid to disagree?" },
    { hi: "Kya main apne kuch hisse chhupa raha/rahi hoon?", en: "Am I hiding parts of myself?" },
    { hi: "Kya yahan se jaane ki keemat chukaani padegi?", en: "Would leaving cost me a price?" }
  ],

  /* Books. CONFIRM: summaries are drafts for the author to replace; links are store searches until each book's own link is known. */
  books: [
    {
      id: "village", title: "The Village Came First",
      sub: "Genes Built Us. Stories Scaled Us. A Village Has to Be Kept.",
      line: { hi: "Genes khud ko copy karte hain. Kahaniyan bhi. Gaon nahi. Use nibhaana padta hai.", en: "Genes copy themselves. Stories copy themselves. A village does not. It has to be kept." },
      summary: "Two men die in the same year in Thane. One corridor fills for three days; the other is empty by four. Following Naina through her father's 1984 diary and a lane with a tea stall at its corner, the book shows the five jobs people do for one another, the rings they are done in, how ties drift when nobody carries them, and the one line that starts to keep them.",
      tryThis: { hi: "Ek naam, ek din, ek line. Haashiye mein abhi likhiye.", en: "One name, one day, one line. Write them in the margin now." },
      url: "https://www.amazon.in/s?k=The+Village+Came+First+Venkat+Rao"
    },
    {
      id: "noht", title: "No One Has to Stay",
      sub: "How to Build a World Worth Coming Back To",
      line: { hi: "Log ja sakte hain. Sawaal yeh hai ki laut kar aane ka raasta bacha hai ya nahi.", en: "People can leave. The question is whether the way back stays open." },
      summary: "A Thane chawl is torn down and replaced by a tower. Over seven years its twenty-two families learn what the corridor had been doing for them, and what it cost the people it shut out. The book turns that into a design grammar for buildings, workplaces and cities: places where people can take part without being forced, depend without being diminished, leave without being punished, and return without starting from zero.",
      tryThis: { hi: "Apne building mein kitne padosiyon ka naam jaante hain? Woh number likh lijiye.", en: "How many neighbours can you name? Write the number down." },
      url: "https://www.amazon.in/s?k=No+One+Has+to+Stay+Venkat+Rao"
    },
    {
      id: "coherence", title: "COHERENCE: What Holds Us Together",
      sub: "The first book on the idea",
      line: { hi: "Aap utne akele nahi hain, aur utne self-made bhi nahi, jitna aap sochte hain.", en: "You are not as alone, or as self-made, as you think." },
      summary: "The first full statement of the idea: the person at the centre, the Four, the Fifteen and the Hundred and Fifty, and what happens when those rings thin. It argues that coherence comes before intelligence, and that the structure that holds a life is always buildable, one ordinary practice at a time.",
      tryThis: { hi: "Har hafte ek hi din, ek hi jagah, kuch logon ke saath. Bas itna.", en: "The same evening each week, the same place, a few people. That's all." },
      url: "https://www.amazon.in/s?k=Coherence+What+Holds+Us+Together+Venkat+Rao"
    },
    {
      id: "tps", title: "Two Point Singularity",
      sub: "Coherence before intelligence",
      line: { hi: "Machine jawab de sakti hai. Gawahi nahi.", en: "A machine can answer. It cannot witness." },
      summary: "Two singularities lie ahead. One arrives by default, as people hand more of their attention and judgement to machines. The other has to be chosen: a return to the human structures that let us think well in the first place. The book follows the idea into the mind and the machine.",
      tryThis: { hi: "Aaj jo sawaal aap machine se poochhne wale the, ek insaan se poochhiye.", en: "Ask a person the question you were about to ask a machine." },
      url: "https://www.amazon.in/dp/B0HJWLJ9CB"
    },
    {
      id: "tdor", title: "Two Doors, One Room",
      sub: "Faith and reason, and the practice they share",
      line: { hi: "Kamre mein do darwaze hain. Kaam ek hi hai.", en: "The room has two doors. The work is the same." },
      summary: "Faith and reason come into the same room through different doors. The book sets them side by side and finds the practice they share: the weekly line, the mirror and the gathering that keep people together whatever they believe.",
      tryThis: { hi: "Is hafte ek baithak: wahi chehre, wahi jagah, phone door.", en: "One gathering this week: the same faces, the same place, phones away." },
      url: "https://www.amazon.in/s?k=Two+Doors+One+Room+Venkat+Rao"
    },
    {
      id: "lhq", title: "The Last Human Question",
      sub: "A novel",
      line: { hi: "Aapne unhe aakhri baar kab dekha tha? Dekha matlab, dekha.", en: "When did you last see them? Really see them?" },
      summary: "Arjun's mother, Shanta, is dying, and the success that carried him far from her has no answer to the question her last days ask. A novel about the uncounted hours of care, the architecture of \"later\", and what no machine can witness.",
      tryThis: { hi: "Kisi se ek cheez bachaa lijiye jo sirf woh jaante hain.", en: "Save one thing that only someone you love knows." },
      url: "https://www.amazon.in/s?k=The+Last+Human+Question+Venkat+Rao"
    }
  ],

  /* The Gate. Shown on every screen. */
  gate: {
    line: { hi: "Yeh practice hai, ilaaj nahi.", en: "This is practice, not treatment." },
    numbers: [
      { label: { hi: "Tele-MANAS (India, 24x7, free)", en: "Tele-MANAS (India, 24x7, free)" }, num: "14416" },
      { label: { hi: "Emergency (India)", en: "Emergency (India)" }, num: "112" },
      { label: { hi: "UK: NHS", en: "UK: NHS" }, num: "111" },
      { label: { hi: "UK emergency", en: "UK emergency" }, num: "999" }
    ],
    elsewhere: { hi: "Kahin aur: apni local crisis line, ya findahelpline.com", en: "Elsewhere: your local crisis line, or findahelpline.com" },
    // Phrases that open the Gate when typed. CONFIRM: clinician review before launch.
    phrases: ["kill myself", "end my life", "suicide", "want to die", "better off dead", "hurt myself", "self harm", "self-harm", "no reason to live", "marna chahta", "marna chahti", "mar jaana", "mar jaaun", "khudkushi", "aatmhatya", "jeena nahi", "zindagi khatam", "khud ko nuksaan"]
  }
};

/* A Catalogue of 150 Small Acts, from The Village Came First. Each passes the Tuesday test: ten minutes or less, with what you already have. */
window.NEEV.acts = [{"n": 1, "job": "settle", "t": "Ask \"Did you eat?\" and wait for the true answer."}, {"n": 2, "job": "settle", "t": "Sit with someone in silence for eleven minutes, phone in another room."}, {"n": 3, "job": "settle", "t": "Bring tea without asking how they take it, because you already know."}, {"n": 4, "job": "settle", "t": "Keep a seat for someone at the break."}, {"n": 5, "job": "settle", "t": "Send a voice note, not a text, to someone who is low."}, {"n": 6, "job": "settle", "t": "Walk someone to the gate, the bus stop, the car."}, {"n": 7, "job": "settle", "t": "Turn up at the hospital with biscuits, not advice."}, {"n": 8, "job": "settle", "t": "Say their name when you greet them."}, {"n": 9, "job": "settle", "t": "Hold a hand during the hard part."}, {"n": 10, "job": "settle", "t": "Lower your voice when theirs rises."}, {"n": 11, "job": "settle", "t": "Hum something down a phone line at three in the morning."}, {"n": 12, "job": "settle", "t": "Make the tea at a house of mourning."}, {"n": 13, "job": "settle", "t": "Nod to every person who gets on your bus or into your lift."}, {"n": 14, "job": "settle", "t": "Leave the kitchen light on for someone coming home late."}, {"n": 15, "job": "settle", "t": "Sit beside a child who is playing alone, and read."}, {"n": 16, "job": "settle", "t": "Ask \"Are you sleeping?\" and listen to the answer."}, {"n": 17, "job": "settle", "t": "Text \"Home safe?\" and wait up for the reply."}, {"n": 18, "job": "settle", "t": "Make someone laugh on a bad day."}, {"n": 19, "job": "settle", "t": "Share an umbrella with a stranger at a bus stop."}, {"n": 20, "job": "settle", "t": "Stay on the phone while someone walks home in the dark."}, {"n": 21, "job": "settle", "t": "Hold the door, and the pause after it."}, {"n": 22, "job": "settle", "t": "Visit someone in hospital on the second week, when the visitors stop."}, {"n": 23, "job": "settle", "t": "Send a photograph of something that made you think of them."}, {"n": 24, "job": "settle", "t": "Sit on the step with someone after the prayer."}, {"n": 25, "job": "settle", "t": "Say \"Take your time\" and mean it."}, {"n": 26, "job": "sharpen", "t": "Tell someone the true thing gently, once."}, {"n": 27, "job": "sharpen", "t": "Ask \"What would you do in my place?\""}, {"n": 28, "job": "sharpen", "t": "Read someone's draft and mark one real problem."}, {"n": 29, "job": "sharpen", "t": "Disagree, and stay in the room."}, {"n": 30, "job": "sharpen", "t": "Ask the second question."}, {"n": 31, "job": "sharpen", "t": "Admit you were wrong within a day."}, {"n": 32, "job": "sharpen", "t": "Ask a friend, \"What am I not seeing?\""}, {"n": 33, "job": "sharpen", "t": "Tell someone their work is good, and exactly why."}, {"n": 34, "job": "sharpen", "t": "Play chess, cards or carrom with someone better than you."}, {"n": 35, "job": "sharpen", "t": "Argue about cricket selectors for eleven minutes."}, {"n": 36, "job": "sharpen", "t": "Ask for feedback before you need it."}, {"n": 37, "job": "sharpen", "t": "Tell a colleague privately what you would not say in a meeting."}, {"n": 38, "job": "sharpen", "t": "Return a borrowed book with a note in the margin."}, {"n": 39, "job": "sharpen", "t": "Ask someone where they got an idea, and read it."}, {"n": 40, "job": "sharpen", "t": "Say \"I don't know\", out loud, in front of others."}, {"n": 41, "job": "sharpen", "t": "Correct a child's sums, and tell her she is clever."}, {"n": 42, "job": "sharpen", "t": "Ask someone younger to teach you something."}, {"n": 43, "job": "sharpen", "t": "Tell someone you think they are playing small."}, {"n": 44, "job": "sharpen", "t": "Ask \"Are you sure?\" once, kindly."}, {"n": 45, "job": "sharpen", "t": "Notice when you are being agreed with too easily."}, {"n": 46, "job": "sharpen", "t": "Ask the person who disagrees with you to explain again."}, {"n": 47, "job": "sharpen", "t": "Keep a promise to tell the truth, even about yourself."}, {"n": 48, "job": "sharpen", "t": "Name one of your own prejudices to yourself, and look at it."}, {"n": 49, "job": "sharpen", "t": "Ask an elder what they were wrong about."}, {"n": 50, "job": "sharpen", "t": "Thank someone for a hard truth they told you years ago."}, {"n": 51, "job": "carry", "t": "Make three calls to someone who knows someone."}, {"n": 52, "job": "carry", "t": "Keep a spare key for a neighbour."}, {"n": 53, "job": "carry", "t": "Donate blood, and tell no one."}, {"n": 54, "job": "carry", "t": "Collect a child, a parcel or a prescription for someone."}, {"n": 55, "job": "carry", "t": "Fill in a form for someone who finds forms hard."}, {"n": 56, "job": "carry", "t": "Send food on the third day of a grief, not the first."}, {"n": 57, "job": "carry", "t": "Lend a ladder, and hold the other end."}, {"n": 58, "job": "carry", "t": "Never return a dish empty."}, {"n": 59, "job": "carry", "t": "Drive someone to the hospital at night."}, {"n": 60, "job": "carry", "t": "Take a colleague's shift when their child is ill."}, {"n": 61, "job": "carry", "t": "Pay for a tea and leave a rupee more."}, {"n": 62, "job": "carry", "t": "Carry someone's bag up the stairs."}, {"n": 63, "job": "carry", "t": "Fix a broken stool at a place you visit, without asking."}, {"n": 64, "job": "carry", "t": "Offer a lift, once, and then again."}, {"n": 65, "job": "carry", "t": "Look after a pet while someone travels."}, {"n": 66, "job": "carry", "t": "Bring the milk in for a neighbour who forgot."}, {"n": 67, "job": "carry", "t": "Help with the paperwork for something that matters."}, {"n": 68, "job": "carry", "t": "Put money in the tumbler and say nothing."}, {"n": 69, "job": "carry", "t": "Hold the pole while someone else ties the knots."}, {"n": 70, "job": "carry", "t": "Tell a neighbour about a neighbour who can help them."}, {"n": 71, "job": "carry", "t": "Keep a list of rare blood donors in a plastic folder."}, {"n": 72, "job": "carry", "t": "Take the night watch at a hospital bed."}, {"n": 73, "job": "carry", "t": "Babysit for a tired parent, for one evening."}, {"n": 74, "job": "carry", "t": "Do one household task that someone always does."}, {"n": 75, "job": "carry", "t": "Ask someone, once, for help, so that they can carry you."}, {"n": 76, "job": "belong", "t": "Use a kinship word for someone who isn't kin."}, {"n": 77, "job": "belong", "t": "Remember an order."}, {"n": 78, "job": "belong", "t": "Keep someone's glass, mug or chair."}, {"n": 79, "job": "belong", "t": "Send a festival greeting typed by hand, with their name in it."}, {"n": 80, "job": "belong", "t": "Turn up to the recurring thing, again."}, {"n": 81, "job": "belong", "t": "Tie the rakhi; send the iftar plate; buy the round."}, {"n": 82, "job": "belong", "t": "Ask after someone's mother by name."}, {"n": 83, "job": "belong", "t": "Learn a familiar stranger's name."}, {"n": 84, "job": "belong", "t": "Send a plate of festival sweets to a neighbour who has never sent you one."}, {"n": 85, "job": "belong", "t": "Invite the person who is always left out."}, {"n": 86, "job": "belong", "t": "Save someone a place."}, {"n": 87, "job": "belong", "t": "Sing, badly, with others."}, {"n": 88, "job": "belong", "t": "Play a weekly game, and keep playing it."}, {"n": 89, "job": "belong", "t": "Eat on the floor in a row with strangers."}, {"n": 90, "job": "belong", "t": "Bring something small back from a trip for everyone."}, {"n": 91, "job": "belong", "t": "Welcome a newcomer to the building by name."}, {"n": 92, "job": "belong", "t": "Join the festival committee and do the accounts."}, {"n": 93, "job": "belong", "t": "Have a Thursday dinner, or a Sunday pot, and keep having it."}, {"n": 94, "job": "belong", "t": "Remember someone's milestone and remind them of it on the day."}, {"n": 95, "job": "belong", "t": "Keep the old team's bag."}, {"n": 96, "job": "belong", "t": "Wear the same colours as your street at the match."}, {"n": 97, "job": "belong", "t": "Go to a neighbour's child's wedding, even if it is small."}, {"n": 98, "job": "belong", "t": "Learn one greeting in a neighbour's language."}, {"n": 99, "job": "belong", "t": "Introduce yourself to the person who cleans your office."}, {"n": 100, "job": "belong", "t": "Tell someone, \"You're one of us.\""}, {"n": 101, "job": "aim", "t": "Ask someone where they are heading."}, {"n": 102, "job": "aim", "t": "Introduce two people who should know each other."}, {"n": 103, "job": "aim", "t": "Celebrate a stranger's win in public."}, {"n": 104, "job": "aim", "t": "Ask an elder, \"Who looked after you when you were small?\""}, {"n": 105, "job": "aim", "t": "Pass on one skill nobody taught you."}, {"n": 106, "job": "aim", "t": "Ask a young person what they want to become, and wait."}, {"n": 107, "job": "aim", "t": "Write to the teacher who changed your life."}, {"n": 108, "job": "aim", "t": "Recommend a book, and ask about it later."}, {"n": 109, "job": "aim", "t": "Tell someone, \"I think you could do that.\""}, {"n": 110, "job": "aim", "t": "Help someone write their first application."}, {"n": 111, "job": "aim", "t": "Share a mistake you made at their age."}, {"n": 112, "job": "aim", "t": "Ask \"Where do you want to be standing in five years?\""}, {"n": 113, "job": "aim", "t": "Lend someone a good shirt for an interview."}, {"n": 114, "job": "aim", "t": "Take a younger colleague to a meeting they would never be invited to."}, {"n": 115, "job": "aim", "t": "Ask for the story behind an object someone brings you."}, {"n": 116, "job": "aim", "t": "Leave a note in the margin of a book before you pass it on."}, {"n": 117, "job": "aim", "t": "Tell a child what you see in them."}, {"n": 118, "job": "aim", "t": "Ask someone what they are proud of."}, {"n": 119, "job": "aim", "t": "Read someone's plan and ask what it is for."}, {"n": 120, "job": "aim", "t": "Keep someone's goal in mind and ask about it a month later."}, {"n": 121, "job": "aim", "t": "Introduce an old person to a young one, with a task."}, {"n": 122, "job": "aim", "t": "Tell someone they have a gift, and name it."}, {"n": 123, "job": "aim", "t": "Ask \"What would make this year good for you?\""}, {"n": 124, "job": "aim", "t": "Show someone the road you walked."}, {"n": 125, "job": "aim", "t": "Bless someone, in whatever words you have."}, {"n": 126, "job": "drift", "t": "Bas yaad aaya. Kaise ho?"}, {"n": 127, "job": "drift", "t": "Make a call on the same day every week."}, {"n": 128, "job": "drift", "t": "Write a note beside a name in your phone."}, {"n": 129, "job": "drift", "t": "Go to the funeral of someone's parent, unasked."}, {"n": 130, "job": "drift", "t": "Reply to the good-morning message."}, {"n": 131, "job": "drift", "t": "Put a day on a \"let's meet soon\"."}, {"n": 132, "job": "drift", "t": "Send a birthday message on the right date, every year."}, {"n": 133, "job": "drift", "t": "Keep a diary of addresses and birthdays, by hand."}, {"n": 134, "job": "drift", "t": "Visit the same stall, bench or barber, on the same day."}, {"n": 135, "job": "drift", "t": "Go back to a place you used to go to, and ask after someone."}, {"n": 136, "job": "drift", "t": "Return a call within a day."}, {"n": 137, "job": "drift", "t": "Say \"Kal bhi aaungi\", and come."}, {"n": 138, "job": "drift", "t": "Answer an old friend's message, however late."}, {"n": 139, "job": "drift", "t": "Repair one rupture this month: name it, own your part, offer one act."}, {"n": 140, "job": "drift", "t": "Send the unsent draft."}, {"n": 141, "job": "drift", "t": "Call someone on the anniversary of a death, not only on the day."}, {"n": 142, "job": "drift", "t": "Keep a recurring call even when there is nothing to say."}, {"n": 143, "job": "drift", "t": "Tell someone you have kept something of theirs."}, {"n": 144, "job": "drift", "t": "Tie a habit to the first sip of tea."}, {"n": 145, "job": "drift", "t": "Count who you called, not who answered."}, {"n": 146, "job": "drift", "t": "Let go of one tie, on purpose, with a kind word."}, {"n": 147, "job": "drift", "t": "Rebuild one thing that used to happen every week."}, {"n": 148, "job": "drift", "t": "Book a trip home on an ordinary Tuesday."}, {"n": 149, "job": "drift", "t": "Teach the one line to someone, by doing it in front of them."}, {"n": 150, "job": "drift", "t": "Give this book to someone, and keep in touch with them about it."}];
