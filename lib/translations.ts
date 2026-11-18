// All user-facing text lives here so the EN/RW switch works on every page.
// Have a native Kinyarwanda speaker review the "rw" text before the final demo.

export type Lang = "en" | "rw";

const en = {
  brand: "Smart Community Notification System",
  district: "Bugesera District",
  nav: {
    about: "About",
    services: "Services",
    how: "How it works",
    benefits: "Benefits",
    contact: "Contact",
    login: "Log in",
    register: "Register as a resident",
    menu: "Menu",
    language: "Language",
  },
  hero: {
    title: "Official notices that reach every cell, and bring residents’ answers back.",
    text: "Officials in Bugesera District prepare, approve and publish notices. Residents read them in their own language and respond.",
    sampleLabel: "Sample notice",
    category: "Health",
    priority: "Urgent",
    noticeTitle: "Child vaccination day",
    target: "Sent to: Nyamata Sector",
    draft: "Draft",
    pending: "Pending approval",
    published: "Published",
  },
  about: {
    title: "About the system",
    text: "The system helps officials in Bugesera District prepare, approve and publish notices for residents, and see whether they were received. Residents get the notices for their own area, in Kinyarwanda or English, and can answer back.",
    points: [
      "Prepared by officials at district, sector and cell level",
      "Approved before anything is published",
      "Delivered only to the area it is meant for",
    ],
  },
  services: {
    title: "What the system offers",
    items: [
      { title: "Prepare notices", text: "Write a notice, choose its category and priority, and set when it expires." },
      { title: "Target by area", text: "Choose a district, sector, cell or village and see how many residents will receive it." },
      { title: "Approve", text: "Approvers review a notice, then approve it, reject it or ask for changes, with comments." },
      { title: "Delivery channels", text: "SMS, mobile app, email and USSD, sent now or scheduled for later." },
      { title: "Monitor", text: "See which notices were delivered, which were read, and which failed." },
      { title: "Feedback and messages", text: "Residents confirm, ask questions or share concerns. Officials reply." },
      { title: "Reports", text: "Notice and feedback summaries that can be exported as PDF or Excel." },
      { title: "Secure access", text: "Access by role, a security code for senior officials, and a record of every action." },
    ],
  },
  how: {
    title: "From draft to resident, in four steps",
    steps: [
      { title: "Prepare", text: "A cell official writes the notice, picks a category and priority, and chooses the area it is for." },
      { title: "Approve", text: "A sector or district official reviews it. They can approve, reject or ask for changes." },
      { title: "Publish", text: "Approved notices reach only the residents of the chosen district, sector, cell or village." },
      { title: "Respond", text: "Residents confirm they have read it, ask a question or raise a concern. Officials reply." },
    ],
  },
  benefits: {
    title: "What changes for the community",
    items: [
      { title: "The right people, the right message", text: "Notices go to the area they concern, not to everyone." },
      { title: "Clear, faster approval", text: "Every notice has a status, and the author is told the decision." },
      { title: "Residents are heard", text: "Questions and concerns reach officials and get a reply." },
      { title: "A record of every step", text: "Who wrote, approved, published and replied is kept for accountability." },
    ],
  },
  contact: {
    title: "Contact us",
    text: "Questions about the system or a notice? Send us a message, or visit your cell or sector office.",
    place: "Bugesera District, Eastern Province, Rwanda",
    name: "Your name",
    reach: "Phone or email",
    message: "Your message",
    send: "Send message",
    sent: "Thank you. Your message has been received.",
  },
  aria: { main: "Main", mobile: "Mobile", footer: "Footer" },
  labels: {
    roles: {
      admin: "System Admin",
      district: "District Official",
      sector: "Sector Official",
      cell: "Cell Official",
      resident: "Community Member",
    },
    categories: {
      health: "Health",
      security: "Security",
      weather: "Weather",
      events: "Community events",
      administrative: "Administrative",
    },
    priorities: { normal: "Normal", urgent: "Urgent", emergency: "Emergency" },
    statuses: {
      draft: "Draft",
      pending: "Pending approval",
      revision: "Changes requested",
      rejected: "Rejected",
      approved: "Approved",
      published: "Published",
      expired: "Expired",
    },
    channels: { sms: "SMS", push: "Mobile app", email: "Email", ussd: "USSD" },
  },
  footer: "Prototype version",
};

export type Dict = typeof en;

const rw: Dict = {
  brand: "Sisitemu y’Amatangazo y’Umuryango",
  district: "Akarere ka Bugesera",
  nav: {
    about: "Ibyerekeye",
    services: "Serivisi",
    how: "Uko bikora",
    benefits: "Inyungu",
    contact: "Twandikire",
    login: "Injira",
    register: "Iyandikishe nk’umuturage",
    menu: "Menu",
    language: "Ururimi",
  },
  hero: {
    title: "Amatangazo y’ubuyobozi agera kuri buri kagari, kandi ibitekerezo by’abaturage bikagaruka.",
    text: "Abayobozi b’Akarere ka Bugesera bategura, bemeza kandi batangaza amatangazo. Abaturage bayasoma mu rurimi rwabo kandi bagatanga ibitekerezo.",
    sampleLabel: "Urugero rw’itangazo",
    category: "Ubuzima",
    priority: "Byihutirwa",
    noticeTitle: "Umunsi wo gukingira abana",
    target: "Rigenewe: Umurenge wa Nyamata",
    draft: "Igihimbano",
    pending: "Rirategereje kwemezwa",
    published: "Ryatangajwe",
  },
  about: {
    title: "Ibyerekeye sisitemu",
    text: "Iyi sisitemu ifasha abayobozi b’Akarere ka Bugesera gutegura, kwemeza no gutangaza amatangazo ku baturage, no kumenya niba yabagezeho. Abaturage babona amatangazo y’aho batuye, mu Kinyarwanda cyangwa mu Cyongereza, kandi bashobora gusubiza.",
    points: [
      "Ategurwa n’abayobozi ku rwego rw’akarere, umurenge n’akagari",
      "Yemezwa mbere yo gutangazwa",
      "Agera gusa aho agenewe",
    ],
  },
  services: {
    title: "Ibyo sisitemu itanga",
    items: [
      { title: "Gutegura amatangazo", text: "Andika itangazo, uhitemo icyiciro n’uko ryihutirwa, ushyireho itariki rizarangiriraho." },
      { title: "Kugenera aho rigomba kugera", text: "Hitamo akarere, umurenge, akagari cyangwa umudugudu, ubone umubare w’abazaryakira." },
      { title: "Kwemeza", text: "Abemeza barasuzuma, bakemeza, bakanga cyangwa bagasaba impinduka, batanga ibisobanuro." },
      { title: "Uburyo bwo kohereza", text: "SMS, porogaramu, imeri na USSD, byoherezwa ako kanya cyangwa mu gihe cyagenwe." },
      { title: "Gukurikirana", text: "Reba amatangazo yatanzwe, ayasomwe n’atagezeho." },
      { title: "Ibitekerezo n’ubutumwa", text: "Abaturage bemeza ko basomye, babaza cyangwa bagatanga ibitekerezo. Abayobozi barabasubiza." },
      { title: "Raporo", text: "Incamake z’amatangazo n’ibitekerezo, zishobora gusohorwa nka PDF cyangwa Excel." },
      { title: "Umutekano", text: "Kwinjira bishingiye ku nshingano, kode y’umutekano ku bayobozi bakuru, n’amateka y’ibikorwa byose." },
    ],
  },
  how: {
    title: "Kuva ku gihimbano kugeza ku muturage, mu ntambwe enye",
    steps: [
      { title: "Gutegura", text: "Umuyobozi w’Akagari yandika itangazo, agahitamo icyiciro n’uko ryihutirwa, n’aho rigenewe." },
      { title: "Kwemeza", text: "Umuyobozi w’Umurenge cyangwa w’Akarere arasuzuma. Ashobora kwemeza, kwanga cyangwa gusaba impinduka." },
      { title: "Gutangaza", text: "Amatangazo yemejwe agera gusa ku baturage b’akarere, umurenge, akagari cyangwa umudugudu byatoranyijwe." },
      { title: "Gusubiza", text: "Abaturage bemeza ko basomye, babaza ikibazo cyangwa bagagaragaza impungenge. Abayobozi barabasubiza." },
    ],
  },
  benefits: {
    title: "Icyo bihindura ku muryango",
    items: [
      { title: "Abakwiye, ubutumwa bukwiye", text: "Amatangazo agera aho abareba, ntagere kuri bose." },
      { title: "Kwemeza byihuse kandi bisobanutse", text: "Buri tangazo rifite uko rihagaze, kandi uwaryanditse amenyeshwa icyemezo." },
      { title: "Abaturage barumvwa", text: "Ibibazo n’impungenge bigera ku bayobozi kandi bigasubizwa." },
      { title: "Amateka y’intambwe zose", text: "Uwanditse, wemeje, watangaje n’wasubije arabikwa kugira ngo hatangwe raporo." },
    ],
  },
  contact: {
    title: "Twandikire",
    text: "Ufite ikibazo kuri sisitemu cyangwa ku itangazo? Twandikire, cyangwa usure ibiro by’akagari cyangwa iby’umurenge.",
    place: "Akarere ka Bugesera, Intara y’Iburasirazuba, u Rwanda",
    name: "Amazina yawe",
    reach: "Telefone cyangwa imeri",
    message: "Ubutumwa bwawe",
    send: "Ohereza ubutumwa",
    sent: "Murakoze. Ubutumwa bwanyu bwakiriwe.",
  },
  aria: { main: "Menu nyamukuru", mobile: "Menu ya telefone", footer: "Hasi ku rupapuro" },
  labels: {
    roles: {
      admin: "Umuyobozi wa Sisitemu",
      district: "Umuyobozi w’Akarere",
      sector: "Umuyobozi w’Umurenge",
      cell: "Umuyobozi w’Akagari",
      resident: "Umuturage",
    },
    categories: {
      health: "Ubuzima",
      security: "Umutekano",
      weather: "Ikirere",
      events: "Ibikorwa by’umuryango",
      administrative: "Ubuyobozi",
    },
    priorities: { normal: "Bisanzwe", urgent: "Byihutirwa", emergency: "Ibyihutirwa cyane" },
    statuses: {
      draft: "Igihimbano",
      pending: "Rirategereje kwemezwa",
      revision: "Rikeneye impinduka",
      rejected: "Ryanzwe",
      approved: "Ryemejwe",
      published: "Ryatangajwe",
      expired: "Ryararangiye",
    },
    channels: { sms: "SMS", push: "Porogaramu", email: "Imeri", ussd: "USSD" },
  },
  footer: "Ikitegererezo",
};

export const translations: Record<Lang, Dict> = { en, rw };