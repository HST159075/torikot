const initialCommittees = [
  { parent: 'upo', branchName: 'মাহফিল বাস্তবায়ন', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'প্রশাসনিক অনুমতি', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'কর্মসূচী তৈরিকরণ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'খতমে কোরআন বিতরণ ও সংগ্রহ পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'মুদ্রণ পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'অর্থ পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'প্রচারণা পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'সংবাদপত্র পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'ডেকোরেশন পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'মোবাইল সংরক্ষণ পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'দপ্তর ও মালামাল সংরক্ষণ পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'ক্যান্টিন পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'লাইটিং ও ইলেকট্রিক পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'জেনারেটর পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'মাইক ও সাউন্ড নিশ্চিত', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'টেক্সি ও পিকআপ মাইকিং পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'স্পট পরিচ্ছন্ন পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'অজুখানা ও শৌচাগার পরিষদ', leafName: '', workerCount: 0 },
  { parent: 'upo', branchName: 'পানি পরিষদ', leafName: '', workerCount: 0 },
  
  // আপয়ন পরিষদ Leafs
  { parent: 'upo', branchName: 'আপয়ন পরিষদ', leafName: 'সার্বিক তদারকি (মাহফিলের দিন)', workerCount: 6 },
  { parent: 'upo', branchName: 'আপয়ন পরিষদ', leafName: 'গরু/মহিষ জবেহ, কুটা, মাপা ও ধোয়া', workerCount: 8 },
  { parent: 'upo', branchName: 'আপয়ন পরিষদ', leafName: 'ফাতেহার মাংস সংগ্রহ, রান্না ও প্যাকেট', workerCount: 7 },
  { parent: 'upo', branchName: 'আপয়ন পরিষদ', leafName: 'গরু/মহিষের ভুড়ি পরিস্কার', workerCount: 5 },
  { parent: 'upo', branchName: 'আপয়ন পরিষদ', leafName: 'তরকারী কাটা ও লাইনে ভাতের প্লেট দেওয়া', workerCount: 9 },
  { parent: 'upo', branchName: 'আপয়ন পরিষদ', leafName: 'চাউল মাপা, ধোয়া ও দুপুরের আপ্যায়ন', workerCount: 6 },
  
  // সাংগঠনিক পরিষদ
  { parent: 'mol', branchName: 'কেন্দ্রীয় পরিচালনা', leafName: 'মাহফিল ফিল্ড', workerCount: 20 },
  { parent: 'mol', branchName: 'কেন্দ্রীয় পরিচালনা', leafName: 'রোড পরিষদ', workerCount: 17 },
];

async function seed() {
  const res = await fetch('http://localhost:3001/committees/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(initialCommittees)
  });
  const data = await res.json();
  console.log("Seeded:", data);
}

seed();
