// Fixed content: example questions, FAQ, and the sample lawyers and articles
// (sample data until the lawyer directory and blog are built).

export const EXAMPLE_QUESTIONS = [
  { en: 'What is the punishment if a cheque bounces?', bn: 'চেক ডিজঅনার হলে শাস্তি কী?' },
  { en: 'Can my landlord ask for 3 months’ advance?', bn: 'বাড়িওয়ালা কি ৩ মাসের অগ্রিম চাইতে পারেন?' },
  { en: 'What is the punishment for theft?', bn: 'চুরির শাস্তি কী?' },
  { en: 'How much notice must I give to resign?', bn: 'চাকরি ছাড়তে কত দিনের নোটিশ দিতে হয়?' },
];

export const SPECIALTIES = {
  family: { en: 'Family law', bn: 'পারিবারিক আইন' },
  criminal: { en: 'Criminal law', bn: 'ফৌজদারি আইন' },
  property: { en: 'Property & land', bn: 'সম্পত্তি ও ভূমি' },
  corporate: { en: 'Corporate', bn: 'কর্পোরেট' },
  labour: { en: 'Labour & employment', bn: 'শ্রম ও চাকরি' },
};
export const DISTRICTS = {
  dhaka: { en: 'Dhaka', bn: 'ঢাকা' },
  chattogram: { en: 'Chattogram', bn: 'চট্টগ্রাম' },
  sylhet: { en: 'Sylhet', bn: 'সিলেট' },
  rajshahi: { en: 'Rajshahi', bn: 'রাজশাহী' },
  khulna: { en: 'Khulna', bn: 'খুলনা' },
};
export const LAWYERS = [
  {
    id: 'l1',
    name: { en: 'Adv. Nusrat Jahan', bn: 'অ্যাড. নুসরাত জাহান' },
    specialty: 'family',
    district: 'dhaka',
    fee: 2000,
    rating: 4.9,
    reviews: 128,
    years: 12,
  },
  {
    id: 'l2',
    name: { en: 'Adv. Tanvir Hasan', bn: 'অ্যাড. তানভীর হাসান' },
    specialty: 'criminal',
    district: 'dhaka',
    fee: 3000,
    rating: 4.8,
    reviews: 96,
    years: 15,
  },
  {
    id: 'l3',
    name: { en: 'Adv. Farzana Akter', bn: 'অ্যাড. ফারজানা আক্তার' },
    specialty: 'property',
    district: 'chattogram',
    fee: 2500,
    rating: 4.7,
    reviews: 74,
    years: 9,
  },
  {
    id: 'l4',
    name: { en: 'Adv. Rafiqul Islam', bn: 'অ্যাড. রফিকুল ইসলাম' },
    specialty: 'labour',
    district: 'khulna',
    fee: 1500,
    rating: 4.6,
    reviews: 51,
    years: 18,
  },
  {
    id: 'l5',
    name: { en: 'Adv. Sabrina Chowdhury', bn: 'অ্যাড. সাবরিনা চৌধুরী' },
    specialty: 'corporate',
    district: 'dhaka',
    fee: 5000,
    rating: 4.9,
    reviews: 63,
    years: 11,
  },
  {
    id: 'l6',
    name: { en: 'Adv. Mahmudul Karim', bn: 'অ্যাড. মাহমুদুল করিম' },
    specialty: 'criminal',
    district: 'sylhet',
    fee: 2000,
    rating: 4.5,
    reviews: 39,
    years: 7,
  },
  {
    id: 'l7',
    name: { en: 'Adv. Ayesha Siddiqua', bn: 'অ্যাড. আয়েশা সিদ্দিকা' },
    specialty: 'family',
    district: 'rajshahi',
    fee: 1500,
    rating: 4.8,
    reviews: 82,
    years: 10,
  },
  {
    id: 'l8',
    name: { en: 'Adv. Imran Hossain', bn: 'অ্যাড. ইমরান হোসেন' },
    specialty: 'property',
    district: 'dhaka',
    fee: 3500,
    rating: 4.6,
    reviews: 57,
    years: 14,
  },
  {
    id: 'l9',
    name: { en: 'Adv. Shirin Sultana', bn: 'অ্যাড. শিরিন সুলতানা' },
    specialty: 'labour',
    district: 'chattogram',
    fee: 2000,
    rating: 4.7,
    reviews: 44,
    years: 8,
  },
];
export const POSTS = [
  {
    slug: 'cheque-dishonour-guide',
    title: { en: 'Your cheque bounced. What now?', bn: 'আপনার চেক ডিজঅনার হয়েছে। এখন কী করবেন?' },
    excerpt: {
      en: 'A plain-language walk through the 30-day notice process under section 138.',
      bn: '১৩৮ ধারার ৩০ দিনের নোটিশ প্রক্রিয়া সহজ ভাষায়।',
    },
    date: '2026-11-02',
    read: 5,
    tag: { en: 'Money', bn: 'অর্থ' },
    body: [
      {
        en: 'A bounced cheque is one of the most common legal problems in Bangladesh. The good news: the law gives you a clear path.',
        bn: 'চেক ডিজঅনার বাংলাদেশের সবচেয়ে সাধারণ আইনি সমস্যাগুলোর একটি। সুখবর হলো, আইন আপনাকে একটি পরিষ্কার পথ দেখায়।',
      },
      {
        en: 'First, keep the bank’s return memo. Within 30 days of receiving it, send a written legal notice to the person who issued the cheque, demanding payment.',
        bn: 'প্রথমে ব্যাংকের ফেরত মেমোটি সংরক্ষণ করুন। এটি পাওয়ার ৩০ দিনের মধ্যে চেকদাতাকে টাকা পরিশোধের দাবি জানিয়ে লিখিত আইনি নোটিশ পাঠান।',
      },
      {
        en: 'If they do not pay within 30 days of receiving your notice, you have one month to file a complaint before a Magistrate’s court.',
        bn: 'নোটিশ পাওয়ার ৩০ দিনের মধ্যে তিনি টাকা না দিলে ম্যাজিস্ট্রেট আদালতে অভিযোগ দায়েরের জন্য আপনার হাতে এক মাস সময় থাকবে।',
      },
      {
        en: 'Keep copies of everything: the cheque, the memo, the notice and the postal receipt. These are your evidence.',
        bn: 'সবকিছুর কপি রাখুন: চেক, মেমো, নোটিশ ও ডাক রসিদ। এগুলোই আপনার প্রমাণ।',
      },
    ],
  },
  {
    slug: 'tenant-rights',
    title: {
      en: '5 rights every tenant in Dhaka should know',
      bn: 'ঢাকার প্রত্যেক ভাড়াটিয়ার জানা উচিত এমন ৫টি অধিকার',
    },
    excerpt: {
      en: 'Advance rent, receipts, eviction — what the Rent Control Act really says.',
      bn: 'অগ্রিম ভাড়া, রসিদ, উচ্ছেদ — বাড়ি ভাড়া নিয়ন্ত্রণ আইন আসলে কী বলে।',
    },
    date: '2026-10-19',
    read: 6,
    tag: { en: 'Housing', bn: 'আবাসন' },
    body: [
      {
        en: 'The Premises Rent Control Act 1991 gives tenants more protection than most people realise.',
        bn: 'বাড়ি ভাড়া নিয়ন্ত্রণ আইন ১৯৯১ বেশিরভাগ মানুষের ধারণার চেয়ে বেশি সুরক্ষা দেয়।',
      },
      {
        en: 'Your landlord cannot ask for more than one month’s rent in advance, and must give you a signed receipt for every payment.',
        bn: 'বাড়িওয়ালা এক মাসের বেশি অগ্রিম ভাড়া চাইতে পারেন না, এবং প্রতিটি পরিশোধের স্বাক্ষরিত রসিদ দিতে বাধ্য।',
      },
    ],
  },
  {
    slug: 'freelancer-contracts',
    title: {
      en: 'Freelancers: three clauses to never sign',
      bn: 'ফ্রিল্যান্সার: তিনটি ধারা যা কখনো স্বাক্ষর করবেন না',
    },
    excerpt: {
      en: 'Unlimited revisions, one-sided penalties and lifetime non-competes.',
      bn: 'সীমাহীন সংশোধন, একতরফা জরিমানা ও আজীবন প্রতিযোগিতা-নিষেধ।',
    },
    date: '2026-09-30',
    read: 4,
    tag: { en: 'Work', bn: 'কাজ' },
    body: [
      {
        en: 'Most freelance disputes start with a vague contract. Before you sign, look closely for these three clauses.',
        bn: 'বেশিরভাগ ফ্রিল্যান্স বিরোধ শুরু হয় অস্পষ্ট চুক্তি থেকে। স্বাক্ষরের আগে এই তিনটি ধারা ভালো করে দেখুন।',
      },
      {
        en: 'Under section 27 of the Contract Act, a clause that stops you from working in your profession is void to that extent.',
        bn: 'চুক্তি আইনের ২৭ ধারা অনুযায়ী, যে ধারা আপনাকে নিজের পেশায় কাজ করতে বাধা দেয়, তা সেই পরিমাণে বাতিল।',
      },
    ],
  },
  {
    slug: 'data-protection-2026',
    title: { en: 'The new data protection law, explained', bn: 'নতুন উপাত্ত সুরক্ষা আইন, সহজ ব্যাখ্যা' },
    excerpt: {
      en: 'What the 2026 ordinance means for small businesses and app makers.',
      bn: '২০২৬ সালের অধ্যাদেশ ছোট ব্যবসা ও অ্যাপ নির্মাতাদের জন্য কী অর্থ বহন করে।',
    },
    date: '2026-10-29',
    read: 7,
    tag: { en: 'Business', bn: 'ব্যবসা' },
    body: [
      {
        en: 'If you collect names, phone numbers or NID details, the new ordinance applies to you.',
        bn: 'আপনি নাম, ফোন নম্বর বা এনআইডি তথ্য সংগ্রহ করলে নতুন অধ্যাদেশ আপনার ক্ষেত্রে প্রযোজ্য।',
      },
      {
        en: 'You need clear consent, a stated purpose, and a way for people to ask for their data to be deleted.',
        bn: 'আপনার প্রয়োজন স্পষ্ট সম্মতি, ঘোষিত উদ্দেশ্য, এবং মানুষ যেন তাদের উপাত্ত মুছে ফেলার অনুরোধ করতে পারে তার ব্যবস্থা।',
      },
    ],
  },
];
export const FAQS = [
  {
    q: { en: 'Is Bidhanshala a law firm?', bn: 'বিধানশালা কি একটি আইন সংস্থা?' },
    a: {
      en: 'No. We provide legal information based on official Bangladeshi laws. For advice on your specific case, please speak to a licensed lawyer.',
      bn: 'না। আমরা বাংলাদেশের সরকারি আইনের ভিত্তিতে আইনি তথ্য দিই। আপনার নির্দিষ্ট বিষয়ে পরামর্শের জন্য লাইসেন্সপ্রাপ্ত আইনজীবীর সঙ্গে কথা বলুন।',
    },
  },
  {
    q: { en: 'Where do the answers come from?', bn: 'উত্তরগুলো কোথা থেকে আসে?' },
    a: {
      en: 'Every answer is grounded in acts published on the official Laws of Bangladesh website (bdlaws.minlaw.gov.bd), and shows the exact sections it used.',
      bn: 'প্রতিটি উত্তর বাংলাদেশের আইনের সরকারি ওয়েবসাইটে (bdlaws.minlaw.gov.bd) প্রকাশিত আইনের ওপর ভিত্তি করে তৈরি এবং ব্যবহৃত ধারাগুলো দেখায়।',
    },
  },
  {
    q: { en: 'Can I ask in Bangla?', bn: 'আমি কি বাংলায় প্রশ্ন করতে পারি?' },
    a: {
      en: 'Yes. Ask in Bangla or English and you will get an answer in the same language.',
      bn: 'হ্যাঁ। বাংলা বা ইংরেজিতে প্রশ্ন করুন, একই ভাষায় উত্তর পাবেন।',
    },
  },
  {
    q: { en: 'Is my data private?', bn: 'আমার তথ্য কি গোপন থাকে?' },
    a: {
      en: 'Your chats and documents are visible only to your account. To write an answer, your question and the matching law text are sent to an AI service. We never sell your data, and you can delete any conversation at any time.',
      bn: 'আপনার চ্যাট ও নথি শুধু আপনার অ্যাকাউন্টেই দেখা যায়। উত্তর লেখার জন্য আপনার প্রশ্ন ও সংশ্লিষ্ট আইনের অংশ একটি এআই সেবায় পাঠানো হয়। আমরা কখনো আপনার তথ্য বিক্রি করি না, এবং যেকোনো সময় কথোপকথন মুছে ফেলতে পারেন।',
    },
  },
];
