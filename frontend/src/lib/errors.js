// The API answers in English. These are shown instead when the site is in Bangla.
const BANGLA_ERRORS = {
  'Invalid username or password.': 'ইউজারনেম বা পাসওয়ার্ড ভুল।',
  'Username needs 3 characters and password 8 characters.':
    'ইউজারনেম কমপক্ষে ৩ অক্ষর আর পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে।',
  'That username is already registered.': 'এই ইউজারনেম আগেই নেওয়া হয়েছে।',
  'Please sign in first.': 'আগে সাইন ইন করুন।',
  'The assistant is temporarily unavailable.': 'সহকারী এই মুহূর্তে কাজ করছে না, একটু পরে আবার চেষ্টা করুন।',
  'Message cannot be empty.': 'বার্তা খালি রাখা যাবে না।',
  'Please provide some text first.': 'আগে কিছু লেখা দিন।',
  'Request failed.': 'অনুরোধটি সম্পন্ন হয়নি।',
  'Conversation not found.': 'চ্যাটটি পাওয়া যায়নি।',
  'Please enter a title.': 'একটি নাম লিখুন।',
  'The contract could not be analyzed right now.': 'এই মুহূর্তে চুক্তিটি বিশ্লেষণ করা যাচ্ছে না।',
  'The document could not be checked right now.': 'এই মুহূর্তে যাচাই করা যাচ্ছে না।',
  'The document could not be generated right now.': 'এই মুহূর্তে দলিলটি তৈরি করা যাচ্ছে না।',
  'Choose a document type and fill in the form.': 'দলিলের ধরন বেছে নিয়ে ফর্মটি পূরণ করুন।',
  'Please choose a file.': 'একটি ফাইল বেছে নিন।',
  'Only PDF, TXT and image files are supported.': 'শুধু PDF, TXT আর ছবির ফাইল পড়া যায়।',
  'Reading scanned files is not set up on this server.': 'এই সার্ভারে স্ক্যান করা ফাইল পড়ার ব্যবস্থা এখনো চালু হয়নি।',
  'Could not read that file.': 'ফাইলটি পড়া যায়নি।',
  'No text found in that file.': 'ফাইলটিতে কোনো লেখা পাওয়া যায়নি।',
  'File is larger than 16 MB.': 'ফাইলটি ১৬ MB-এর বেশি বড়।',
  'Please enter your name, a valid email and a message.': 'আপনার নাম, সঠিক ইমেইল আর বার্তা লিখুন।',
  'Administrator access required.': 'এই পাতাটি শুধু অ্যাডমিনদের জন্য।',
  'You cannot remove your own admin access.': 'নিজের অ্যাডমিন ক্ষমতা নিজে সরানো যায় না।',
  'User not found.': 'ব্যবহারকারী পাওয়া যায়নি।',
  'Message not found.': 'বার্তাটি পাওয়া যায়নি।',
  'A law check is already running.': 'একটি আইন যাচাই এখন চলছে।',
  'Only PDF and CSV files are supported.': 'শুধু PDF আর CSV ফাইল আপলোড করা যায়।',
  'The document could not be indexed.': 'দলিলটি ইনডেক্স করা যায়নি।',
};

export function translateError(message, lang) {
  if (lang !== 'bn' || !message) return message;
  if (BANGLA_ERRORS[message]) return BANGLA_ERRORS[message];
  // "Too many requests. Please try again in 3 minute(s)." carries a number.
  const match = /^Too many requests\. Please try again in (\d+) minute\(s\)\.$/.exec(message);
  if (match) {
    const minutes = Number(match[1]).toLocaleString('bn-BD');
    return `অনেক বেশি অনুরোধ এসেছে। ${minutes} মিনিট পরে আবার চেষ্টা করুন।`;
  }
  return message;
}
