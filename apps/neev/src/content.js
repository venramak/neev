/* Neev canon for the app: three circles, five places, thirteen roles.
   Every question is asked through a moment. Every answer is a person, named in the user's own words.
   The descriptions here are references only; the user's word is what goes on the map. */

export const RINGS = [
  { id: "rasoi", n: "4", hi: "Rasoi", en: "The Four", note: { hi: "Teen ho sakte hain, chhe bhi. Jinke bina aap, aap nahi.", en: "It may be three, or six. Without them you are not you." } },
  { id: "aangan", n: "15", hi: "Aangan", en: "The Fifteen", note: { hi: "Das se bees log. Yahan aap badhte hain.", en: "Ten to twenty people. Here you grow." } },
  { id: "mohalla", n: "150", hi: "Mohalla", en: "The Hundred and Fifty", note: { hi: "Sau se do sau log jinka naam aur kahani aap jaante hain.", en: "A hundred to two hundred people you know by name and story." } },
];

export const PLACES = [
  { id: "sukoon", obj: "diya", hi: "Sukoon", en: "Settle",
    q: { hi: "Jab sab bikhar raha ho, kiske paas baith kar aap shaant ho jaate hain?", en: "When everything is coming apart, near whom do you grow calm?" },
    mine: { hi: "Aur kaun aapke paas aakar shaant hota hai?", en: "And who grows calm near you?" },
    chips: { hi: ["Mera sukoon", "Mera diya"], en: ["My calm", "My lamp"] } },
  { id: "sach", obj: "aaina", hi: "Sach", en: "Sharpen",
    q: { hi: "Kaun aapko woh sach bolta hai jo aap sunna nahi chahte?", en: "Who tells you the truth you don't want to hear?" },
    mine: { hi: "Aap kise woh sach bolte hain jo woh sunna nahi chahte?", en: "To whom do you tell the truth they don't want to hear?" },
    chips: { hi: ["Mera aaina", "Mera sach"], en: ["My mirror", "My truth"] } },
  { id: "sahara", obj: "bojh", hi: "Sahara", en: "Carry",
    q: { hi: "Mushkil mein, bina bulaaye kaun aayega?", en: "In trouble, who would come without being called?" },
    mine: { hi: "Aap kiske liye bina bulaaye pahunch jaayenge?", en: "For whom would you turn up without being called?" },
    chips: { hi: ["Mera sahara", "Mera kandha"], en: ["My support", "My shoulder"] } },
  { id: "apnapan", obj: "chaabi", hi: "Apnapan", en: "Belong",
    q: { hi: "Kiske saath aap \"main\" nahi, \"hum\" hain?", en: "With whom are you not \"I\" but \"we\"?" },
    mine: { hi: "Kaun aapke saath \"hum\" ho jaata hai?", en: "Who becomes \"we\" with you?" },
    chips: { hi: ["Mera ghar", "Mere apne"], en: ["My home", "My own"] } },
  { id: "disha", obj: "mashaal", hi: "Disha", en: "Aim",
    q: { hi: "Raasta bhool jaayein, toh kaun dikhata hai?", en: "When you lose the way, who shows it?" },
    mine: { hi: "Aap kise raasta dikhate hain?", en: "To whom do you show the way?" },
    chips: { hi: ["Meri disha", "Meri mashaal"], en: ["My direction", "My torch"] } },
];

export const ROLES = [
  /* Rasoi */
  { id: "darwaza", ring: "rasoi", place: "sahara",
    q: { hi: "Aadhi raat ko sab bikhar jaaye, toh kaun pehle pahunchega aur baad mein poochhega ki hua kya?", en: "If it all fell apart at midnight, who would arrive first and ask what happened later?" },
    ref: { hi: "Woh aapki ghabrahat sambhaal lete hain. Sawaal baad mein.", en: "They can take your panic. Questions come later." },
    chips: { hi: ["Mera khula darwaza", "Meri aadhi raat ki awaaz"], en: ["My open door", "My midnight call"] } },
  { id: "naqab", ring: "rasoi", place: "sukoon",
    q: { hi: "Kiske saamne aapko achha dikhna nahi padta?", en: "With whom do you never have to look good?" },
    ref: { hi: "Unke saamne aap chidchide, darey hue ya chhote ho sakte hain, aur pyaar kam nahi hota.", en: "With them you can be petty, scared or small, and the love does not shrink." },
    chips: { hi: ["Jahan main jaisa hoon", "Mera bina naqab wala ghar"], en: ["My as-I-am place", "Where I wear no mask"] } },
  { id: "thehrav", ring: "rasoi", place: "sukoon",
    q: { hi: "Kiske paas baithne bhar se aapki saans dheemi ho jaati hai?", en: "Near whom does your breathing slow, just by sitting there?" },
    ref: { hi: "Kuch kehna nahi padta. Unka hona kaafi hai.", en: "Nothing needs saying. Their being there is enough." },
    chips: { hi: ["Mera thehrav", "Meri chhaon"], en: ["My stillness", "My shade"] } },
  { id: "gawah", ring: "rasoi", place: "apnapan",
    q: { hi: "Kise yaad hai ki aap pehle kaun the?", en: "Who remembers who you used to be?" },
    ref: { hi: "Aapka bachpan, purane sapne, pehli jeet. Unhe yaad hai, isliye woh sab hua tha.", en: "Your childhood, old dreams, first wins. They remember, so it happened." },
    chips: { hi: ["Mera gawah", "Meri yaaddasht"], en: ["My witness", "My memory-keeper"] } },
  /* Aangan */
  { id: "nazar", ring: "aangan", place: "sach",
    q: { hi: "Kaun aapko woh dikhata hai jo aap khud mein dekhna nahi chahte?", en: "Who shows you what you refuse to see in yourself?" },
    ref: { hi: "Narmi se, par saaf: aapki aadat, aapka darr, aapka chhota khelna.", en: "Gently but plainly: your habit, your fear, your playing small." },
    chips: { hi: ["Meri doosri nazar", "Meri teesri aankh"], en: ["My second sight", "My third eye"] } },
  { id: "tok", ring: "aangan", place: "sach",
    q: { hi: "Jab aap apne hi bahaano par yakeen karne lagte hain, kaun tok deta hai?", en: "When you start believing your own excuses, who stops you?" },
    ref: { hi: "Woh aapki kahani wahin rok dete hain, isse pehle ki nuksaan ho.", en: "They stop the story before it costs you." },
    chips: { hi: ["Mera tokne wala", "Meri zameen"], en: ["My reality check", "My ground"] } },
  { id: "takkar", ring: "aangan", place: "sach",
    q: { hi: "Kiske saath behes karke aap tez hote hain?", en: "Whom do you argue with and come away sharper?" },
    ref: { hi: "Woh haan mein haan nahi milate. Naye sawaal laate hain.", en: "They don't just agree. They bring new questions." },
    chips: { hi: ["Meri dhaar", "Mera akhada"], en: ["My whetstone", "My sparring ring"] } },
  { id: "aage", ring: "aangan", place: "disha",
    q: { hi: "Kaun aapse do kadam aage hai, jise dekh kar lagta hai ki yeh ho sakta hai?", en: "Who is a few steps ahead, and makes it look possible?" },
    ref: { hi: "Unke aas-paas rehne se aap khud se zyada maangne lagte hain.", en: "Being near them, you ask more of yourself." },
    chips: { hi: ["Mera agla kadam", "Meri seedhi"], en: ["My next step", "My ladder"] } },
  { id: "hansi", ring: "aangan", place: "apnapan",
    q: { hi: "Pichhli baar pet dukhne tak hanse the, toh saath kaun tha?", en: "The last time you laughed till it hurt, who was there?" },
    ref: { hi: "Woh yaad dilaate hain ki zindagi sirf nibhaani nahi, jeeni bhi hai.", en: "They remind you life is to be tasted, not only managed." },
    chips: { hi: ["Meri hansi", "Meri chhutti"], en: ["My laughter", "My holiday"] } },
  /* Mohalla */
  { id: "haath", ring: "mohalla", place: "sahara",
    q: { hi: "Aap sheher se bahar hon, toh ghar ki chaabi kiske paas hoti hai?", en: "When you are out of town, who has your house key?" },
    ref: { hi: "Padosi, saathi, woh jo ek achhe doctor ko jaante hain. Roz ki zindagi inhi se chalti hai.", en: "The neighbour, the colleague, the one who knows a good doctor. Daily life runs on them." },
    chips: { hi: ["Mere haath-pair", "Mera mohalla"], en: ["My extra hands", "My village"] } },
  { id: "toli", ring: "mohalla", place: "apnapan",
    q: { hi: "Kin logon ke beech aapko samjhana nahi padta ki aap kaun hain?", en: "Among which people do you not have to explain yourself?" },
    ref: { hi: "Ek team, ek mandali, purane dost, kaam ke log. Yahan aapka ek hissa poora samjha jaata hai. Toli ka naam bhi likh sakte hain.", en: "A team, a circle, old friends, people of your trade. One part of you is fully understood here. A group's name works too." },
    chips: { hi: ["Meri toli", "Mere log"], en: ["My tribe", "My people"] } },
  { id: "peedhi", ring: "mohalla", place: "disha",
    q: { hi: "Kaun aapse seekh raha hai?", en: "Who is learning from you?" },
    ref: { hi: "Chhote bhai-behen, junior, shagird, bachche. Unhe dena aapko maayne deta hai.", en: "Younger family, juniors, students. Giving to them gives you meaning." },
    chips: { hi: ["Meri agli peedhi", "Mera beej"], en: ["My next generation", "My seed"] } },
  { id: "pul", ring: "mohalla", place: "disha",
    q: { hi: "Kisne aapko us duniya se milaya jahan aap khud nahi pahunch paate?", en: "Who introduced you to a world you could not have reached alone?" },
    ref: { hi: "Door ki jaan-pehchaan. Naya kaam, naye mauke, naye log aksar yahin se aate hain.", en: "A loose tie. New work, new chances and new people often come through them." },
    chips: { hi: ["Mera pul", "Meri khidki"], en: ["My bridge", "My window"] } },
];

/* The onion. Each layer ends in one act with a real person. The next layer opens when that act is done, or after 24 hours. */
export const LAYERS = [
  { n: 1, id: "pehla", hi: "Paanch jagah", en: "Five places",
    q: { hi: "Aap kitne logon se bane hain?", en: "How many people are you made of?" },
    lead: { hi: "Yeh koi test nahi hai. Koi score nahi. Paanch sawaal, aur har jawab ek insaan ka naam hai.", en: "This is not a test. There is no score. Five questions, and each answer is a person's name." },
    mirror: { hi: "Aap in logon se bane hain.", en: "You are made of these people." },
    act: { hi: "Us naam ko ek line bhejiye jo raat 2:40 baje sabse pehle yaad aaya.", en: "Send one line to the name that came first at 2:40 a.m." },
    msg: { hi: "Bas yaad aaya. Kaise ho?", en: "I just thought of you. How are you?" } },
  { n: 2, id: "rasoi", hi: "Rasoi", en: "The Four",
    q: { hi: "Aapki rasoi mein kaun baithta hai?", en: "Who sits in your kitchen?" },
    lead: { hi: "Sabse paas ka ghera. Teen ho sakte hain, chhe bhi. Ginti nahi, ghera maayne rakhta hai. Chaar sawaal.", en: "The closest circle. It may be three, or six. The circle matters, not the count. Four questions." },
    mirror: { hi: "Yeh aapki rasoi hai.", en: "This is your kitchen." },
    act: { hi: "Inmein se ek ko bataiye ki aapne unhe kya naam diya hai.", en: "Tell one of them the name you gave them." } },
  { n: 3, id: "dono", hi: "Dono taraf", en: "Both ways",
    q: { hi: "Aur aap kiski jagah hain?", en: "And whose place are you?" },
    lead: { hi: "Thaamna aur thaame jaana, dono. Jo aapke chaar hain, zaroori nahi ki aap unke chaar hon. Wahi paanch jagah, ulti taraf se.", en: "Holding and being held, both. Your four may not count you among their four. The same five places, from the other side." },
    mirror: { hi: "Aap in logon ki jagah hain.", en: "You are a place for these people." },
    act: { hi: "Jinke liye aap jagah hain, unmein se ek ke liye is hafte ek chhota kaam kijiye. Bina bataye.", en: "For one person you hold, do one small thing this week. Without announcing it." } },
  { n: 4, id: "aangan", hi: "Aangan", en: "The Fifteen",
    q: { hi: "Aapke aangan mein kaun aata-jaata hai?", en: "Who comes and goes in your courtyard?" },
    lead: { hi: "Das se bees log. Yahan aap badhte hain: sach, takkar, hansi. Paanch sawaal.", en: "Ten to twenty people. Here you grow: truth, friction, laughter. Five questions." },
    mirror: { hi: "Yeh aapka aangan hai.", en: "This is your courtyard." },
    act: { hi: "Jo aapko sach bolte hain, unse yeh ek sawaal poochhiye. Aur bas suniye.", en: "Ask the one who tells you the truth this one question. Then only listen." },
    msg: { hi: "Mujhmein aisa kya hai jo mujhe nahi dikhta?", en: "What is it about me that I can't see?" } },
  { n: 5, id: "mohalla", hi: "Mohalla", en: "The Hundred and Fifty",
    q: { hi: "Aapka mohalla kitna bada hai?", en: "How big is your neighbourhood?" },
    lead: { hi: "Sau se do sau log jinka naam aur kahani aap jaante hain. Yahin se apnapan aata hai. Chaar sawaal.", en: "A hundred to two hundred people you know by name and story. Belonging comes from here. Four questions." },
    mirror: { hi: "Yeh aapka mohalla hai.", en: "This is your neighbourhood." },
    act: { hi: "Apna Mangalvaar chuniye: ek din, ek waqt, ek insaan ya ek toli. Har hafte wahi.", en: "Choose your Tuesday: one day, one time, one person or one group. The same every week." } },
];

export const NEXT = { hi: "Chhathi parat: door hote log, gaanthein, aur jo ab nahi rahe. Jald aa rahi hai.", en: "The sixth layer: people drifting, knots, and those who are gone. Coming soon." };

export const EPISODES = {
  1: { hi: "Aap kitne logon se bane hain?", en: "How many people are you made of?" },
  2: { hi: "Toh sabse pehle, aapko kisne thaama tha?", en: "So who held you first?" },
  3: { hi: "Jab hum itne ho gaye ki ek doosre ko jaan hi nahi sakte the, tab humein kisne joda?", en: "When there were too many of us to know each other, what held us together?" },
  4: { hi: "Ab ek nayi cheez aa gayi hai, jo sab jaanti hai aur kabhi nahi soti. Kya woh humein jod sakti hai?", en: "Something new has arrived that knows everything and never sleeps. Can it hold us together?" },
  5: { hi: "Toh neev kahan hai? Aur use kaun rakhega?", en: "So where is the foundation? And who will keep it?" },
};

export const HELP = [
  { name: "Tele-MANAS", number: "14416", note: { hi: "Muft, 24 ghante, kai bhashaon mein", en: "Free, 24 hours, many languages" } },
  { name: { hi: "Emergency", en: "Emergency" }, number: "112" },
  { name: { hi: "Mahila helpline", en: "Women's helpline" }, number: "181" },
];
