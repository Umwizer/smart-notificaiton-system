// Administrative divisions of Bugesera District: sector -> cell -> villages.
// 15 sectors, 72 cells, 577 villages. Source: open Rwanda administrative divisions dataset
// (rwanda-geo, MIT licence). Verify against the district's official list before final submission.
export const AREAS: Record<string, Record<string, string[]>> = {
 "Gashora": {
  "Biryogo": [
   "Bidudu",
   "Biryogo",
   "Buhoro",
   "Gihanama",
   "Kagarama",
   "Kanyonyomba",
   "Karutete",
   "Kivugiza",
   "Rugunga"
  ],
  "Kabuye": [
   "Bidudu",
   "Kabuye",
   "Karizinge",
   "Rwagasiga",
   "Rweteto"
  ],
  "Kagomasi": [
   "Akagako",
   "Kagomasi",
   "Kiruhura",
   "Kuruganda",
   "Runzenze",
   "Rushubi"
  ],
  "Mwendo": [
   "Gaharwa",
   "Gisenyi",
   "Kayovu",
   "Ruhanga",
   "Ruhanura",
   "Rutanga"
  ],
  "Ramiro": [
   "Dihiro",
   "Kagasa I",
   "Kagasa Ii",
   "Karusine I",
   "Karusine Ii",
   "Migina",
   "Munyinya",
   "Rweru I",
   "Rweru Ii"
  ]
 },
 "Juru": {
  "Juru": [
   "Ayabakiza",
   "Bisagara",
   "Nyamigende",
   "Rugarama",
   "Rwamakara",
   "Twabagarama"
  ],
  "Kabukuba": [
   "Gikana",
   "Gikurazo",
   "Kabukuba",
   "Kamatongo",
   "Majanja",
   "Mbuye",
   "Rushubi"
  ],
  "Mugorore": [
   "Cyirabo",
   "Gatora",
   "Kajevuba",
   "Mugorore",
   "Murambi",
   "Rebero",
   "Rwamurama",
   "Tabarari"
  ],
  "Musovu": [
   "Bitega",
   "Cyabasonga",
   "Cyingaju",
   "Kabeza",
   "Nyaruhuru"
  ],
  "Rwinume": [
   "Gisororo",
   "Kabeza",
   "Katarara",
   "Kinihira",
   "Rwimpyisi",
   "Uwimpunga"
  ]
 },
 "Kamabuye": {
  "Biharagu": [
   "Akanigo",
   "Biharagu",
   "Kanyonyera",
   "Munazi",
   "Muyigi",
   "Nyarurama",
   "Rubugu"
  ],
  "Burenge": [
   "Akabazeyi",
   "Kagenge",
   "Murambo",
   "Nyabyondo",
   "Nyakariba",
   "Rebero",
   "Senga"
  ],
  "Kampeka": [
   "Byimana",
   "Kampeka",
   "Mabuye",
   "Masangano",
   "Mbuganzeri",
   "Mparo",
   "Ndama",
   "Pamba I",
   "Pamba Ii"
  ],
  "Nyakayaga": [
   "Akaje",
   "Fatinkanda",
   "Murago",
   "Murambi",
   "Ntungamo I",
   "Ntungamo Ii",
   "Nyakayaga"
  ],
  "Tunda": [
   "Cyogamuyaga",
   "Mububa I",
   "Mububaya Ii",
   "Rubirizi",
   "Rusibya",
   "Tunda",
   "Twuruziramire",
   "Uwibiraro I",
   "Uwibiraro Ii",
   "Uwumusave"
  ]
 },
 "Mareba": {
  "Bushenyi": [
   "Bigaga",
   "Bukumba",
   "Cyantwari",
   "Gasagara",
   "Gitega",
   "Kabeza",
   "Kagese",
   "Kagogo",
   "Kamasonga",
   "Mareba",
   "Muyange",
   "Rukoyoyo",
   "Runyonza",
   "Rususa"
  ],
  "Gakomeye": [
   "Gatanga",
   "Gitwa",
   "Kabere",
   "Kajevuba",
   "Kamudeberi",
   "Kamunana",
   "Kanka",
   "Kaziranyenzi",
   "Rwintare"
  ],
  "Nyamigina": [
   "Gafunzo",
   "Kabeza",
   "Kabingo",
   "Kabuye",
   "Karwana",
   "Ngugu",
   "Nyamigisha",
   "Ruhina",
   "Rusenyi",
   "Ruyenzi"
  ],
  "Rango": [
   "Gatare",
   "Gatinza",
   "Gihoko",
   "Kabuga",
   "Kagarama",
   "Matinza",
   "Mbuga",
   "Rango",
   "Rusagara",
   "Rwabikwano"
  ],
  "Rugarama": [
   "Gasagara",
   "Gatare",
   "Kayonza",
   "Keza",
   "Kururama",
   "Muyenzi",
   "Ruduha",
   "Rugarama",
   "Rutaka"
  ]
 },
 "Mayange": {
  "Gakamba": [
   "Gacucu",
   "Gakamba",
   "Gisenyi",
   "Kamugenzi",
   "Karambo",
   "Kavumu",
   "Rukora"
  ],
  "Kagenge": [
   "Biryogo",
   "Gakindo",
   "Gitaramuka",
   "Karama",
   "Kiruhura",
   "Remera",
   "Rukindo",
   "Taba",
   "Tetero"
  ],
  "Kibenga": [
   "Gahwiji A",
   "Gahwiji B",
   "Kindonyi",
   "Murambi",
   "Ruhorobero",
   "Rwakaramira",
   "Rwarusaku"
  ],
  "Kibirizi": [
   "Gacyamo",
   "Gahinga",
   "Gisenyi",
   "Gitera",
   "Kibirizi",
   "Rugazi",
   "Rwakibirizi"
  ],
  "Mbyo": [
   "Cyaruhiririra",
   "Kabyo",
   "Rugarama",
   "Rwimikoni I",
   "Rwimikoni Ii"
  ]
 },
 "Musenyi": {
  "Gicaca": [
   "Bidudu",
   "Cyanika",
   "Cyarubazi",
   "Gatare",
   "Gihari",
   "Kagusa",
   "Kamahango",
   "Kavumu",
   "Kidudu",
   "Migina",
   "Ngarama",
   "Remera",
   "Rusagara"
  ],
  "Musenyi": [
   "Bidudu",
   "Bishinge",
   "Bizenga",
   "Cyeru",
   "Gakomeye",
   "Gakurazo",
   "Kigarama",
   "Kijuri",
   "Kiringa",
   "Muhanga",
   "Nunga",
   "Nyagasagara",
   "Rugando",
   "Rugeyo"
  ],
  "Nyagihunika": [
   "Gatoki",
   "Gitagata",
   "Kigusa",
   "Kiruhura",
   "Mbonwa",
   "Nyakajuri",
   "Rugarama",
   "Rushubi",
   "Rwankeri"
  ],
  "Rulindo": [
   "Kabeza",
   "Kabuye",
   "Kagunga",
   "Kanyamata",
   "Karambo",
   "Karubanzangabo",
   "Kinyovi",
   "Nyamuri",
   "Rulindo",
   "Runyonza"
  ]
 },
 "Mwogo": {
  "Bitaba": [
   "Bitaba",
   "Gatwe",
   "Gisasa",
   "Misatsi",
   "Rebero",
   "Rukoronko"
  ],
  "Kagasa": [
   "Gatare",
   "Gisenyi",
   "Karutabana",
   "Ngando",
   "Rubumba",
   "Rwintenderi"
  ],
  "Rugunga": [
   "Kagerero",
   "Nyamabuye",
   "Nyarukombe",
   "Rugazi",
   "Rukira",
   "Rukore",
   "Rusagara"
  ],
  "Rurenge": [
   "Gatoki",
   "Gitaraga",
   "Kaboshya",
   "Kaziramire",
   "Rurenge",
   "Rwabashenyi"
  ]
 },
 "Ngeruka": {
  "Gihembe": [
   "Buhara",
   "Kabaya",
   "Kabuye",
   "Kadebu",
   "Kagasa",
   "Karambo",
   "Kirasaniro",
   "Kururama",
   "Nyakariba",
   "Nyarubande",
   "Rusagara",
   "Rutare",
   "Ruzinge",
   "Shitwe"
  ],
  "Murama": [
   "Agashyamba",
   "Bishenyi",
   "Fatinkanda",
   "Gakurazo",
   "Gatanga",
   "Ikoni",
   "Kagege",
   "Kankuriyingoma",
   "Kigandu",
   "Kinamba",
   "Murama",
   "Muyange",
   "Nyakagarama",
   "Rusamaza",
   "Rwabisheshe",
   "Shami"
  ],
  "Ngeruka": [
   "Binyonzwe",
   "Kamajeri",
   "Kamasonga",
   "Karugondo",
   "Kivugiza",
   "Muyange",
   "Ngeruka"
  ],
  "Nyakayenzi": [
   "Heru",
   "Kabuye",
   "Karama",
   "Kavumu",
   "Kibaya",
   "Kibungo",
   "Kimiduha",
   "Murambi",
   "Nyakayenzi",
   "Twimpara"
  ],
  "Rutonde": [
   "Akajuri",
   "Kabare",
   "Kabumbwe",
   "Kagano",
   "Kamugera",
   "Kamugore",
   "Kigarama",
   "Rubirizi",
   "Rugazi",
   "Runyonza",
   "Rusibya"
  ]
 },
 "Ntarama": {
  "Cyugaro": [
   "Gatoro",
   "Kayenzi",
   "Kidudu",
   "Kingabo",
   "Rubomborana",
   "Rugarama",
   "Rugunga"
  ],
  "Kanzenze": [
   "Cyeru",
   "Gasagara",
   "Kabaha",
   "Kabeza",
   "Karumuna",
   "Kurugenge",
   "Nyamabuye",
   "Rwangara"
  ],
  "Kibungo": [
   "Kagoma I",
   "Kagoma Ii",
   "Kiganwa",
   "Nganwa",
   "Nyarunazi",
   "Ruhengeri",
   "Rusekera"
  ]
 },
 "Nyamata": {
  "Kanazi": [
   "Bihari",
   "Cyeru",
   "Gitovu",
   "Kagirazina",
   "Musagara",
   "Nyarugati I",
   "Nyarugati Ii",
   "Rugando",
   "Sumbure"
  ],
  "Kayumba": [
   "Gatare",
   "Karambi",
   "Kayenzi",
   "Murambi",
   "Nyagatovu",
   "Nyakwibereka",
   "Nyiramatuntu",
   "Rwanza"
  ],
  "Maranyundo": [
   "Gahembe",
   "Gisunzu",
   "Mukoma",
   "Muyange",
   "Rugarama",
   "Rusagara"
  ],
  "Murama": [
   "Bishweshwe",
   "Gataraga",
   "Gatare",
   "Kasebigege",
   "Kivugiza",
   "Kiyogoma",
   "Mwesa",
   "Rucucu",
   "Ruhanga",
   "Rutobotobo",
   "Rutukura"
  ],
  "Nyamata Y Umujyi": [
   "Gasenga I",
   "Gasenga Ii",
   "Gatare I",
   "Gatare Ii",
   "Gatare Iii",
   "Nyabivumu",
   "Nyamata I",
   "Nyamata Ii",
   "Rugarama I",
   "Rugarama Ii",
   "Rugarama Iii",
   "Rwakibirizi I",
   "Rwakibirizi Ii"
  ]
 },
 "Nyarugenge": {
  "Gihinga": [
   "Mabanga",
   "Mwoshya",
   "Ntungamo",
   "Nyabuhoro",
   "Nyagasozi",
   "Nyarubande",
   "Rwabusoro"
  ],
  "Kabuye": [
   "Cyahafi",
   "Gateko",
   "Gatoki",
   "Karubagazi",
   "Nyakabingo",
   "Nyakabuye",
   "Nyarusambu"
  ],
  "Murambi": [
   "Cundaminega",
   "Cyeru",
   "Kadogori",
   "Kanombe",
   "Kayitanga",
   "Nyagakombe",
   "Rugandara",
   "Rurama",
   "Rushorezo"
  ],
  "Ngenda": [
   "Bushonyi",
   "Kamabare",
   "Kamugera",
   "Kiyovu",
   "Muyange",
   "Nyagisenyi",
   "Rubona",
   "Rugasa",
   "Rwashangwe",
   "Tubumba"
  ],
  "Rugando": [
   "Bushenyi",
   "Gako",
   "Kamahirwe",
   "Nsoro",
   "Rebero",
   "Rugero"
  ]
 },
 "Rilima": {
  "Kabeza": [
   "Bidenge",
   "Biraro",
   "Bwiza",
   "Gako",
   "Gasarwe",
   "Gasave",
   "Gitega",
   "Kabeza",
   "Kagarama",
   "Karambi",
   "Karambo",
   "Karirisi",
   "Marembo",
   "Nyamisagara"
  ],
  "Karera": [
   "Gakurazo",
   "Gatare",
   "Kamahoro",
   "Mutarama",
   "Ruyenzi",
   "Rwankomati",
   "Rwavuningoma",
   "Rwimirama"
  ],
  "Kimaranzara": [
   "Akintwari",
   "Akumunezero",
   "Amizero",
   "Buhoro",
   "Byimana",
   "Gasabo",
   "Gihushi",
   "Kabahaya",
   "Kidogo",
   "Kimaranzara",
   "Kivumu"
  ],
  "Ntarama": [
   "Akabeza",
   "Gasave",
   "Gaseke",
   "Gasenyi",
   "Gitovu",
   "Kagugu",
   "Kamashya",
   "Kavumu",
   "Ntarama",
   "Nyamure",
   "Rurambo",
   "Saruduha"
  ],
  "Nyabagendwa": [
   "Cyoma",
   "Gicaca",
   "Kamabuye",
   "Karama",
   "Mataba",
   "Mubuga",
   "Mukoma",
   "Murambi",
   "Nyabagendwa",
   "Nyamizi",
   "Rwibikara"
  ]
 },
 "Ruhuha": {
  "Bihari": [
   "Bihari",
   "Busasamana",
   "Masenga I",
   "Masenga Ii",
   "Mukoma",
   "Nyagafunzo",
   "Rugarama",
   "Rwanzunga"
  ],
  "Gatanga": [
   "Butereri",
   "Kayigi",
   "Kibaza",
   "Nyaburiba",
   "Nyakagarama",
   "Rwanika"
  ],
  "Gikundamvura": [
   "Gikundamvura",
   "Kanombe",
   "Kazabagarura",
   "Kiyovu",
   "Rukurazo",
   "Rusenyi"
  ],
  "Kindama": [
   "Gatare",
   "Gatovu",
   "Kagasera",
   "Kamweru",
   "Kibaza",
   "Kindama",
   "Rebero",
   "Ruramba",
   "Rutare",
   "Saruduha"
  ],
  "Ruhuha": [
   "Kimikamba",
   "Mubano",
   "Nyabaranga",
   "Ruhuha I",
   "Ruhuha Ii"
  ]
 },
 "Rweru": {
  "Batima": [
   "Agahonnyo",
   "Batima",
   "Gasororo",
   "Gikoma",
   "Ihara",
   "Kamudusi",
   "Mbuganzeri",
   "Rubira",
   "Ruhehe",
   "Twinyange"
  ],
  "Kintambwe": [
   "Gakindo",
   "Gasenyi",
   "Maburane",
   "Mugina",
   "Nyiragiseke",
   "Nyirakanemba",
   "Nyirarubomboza",
   "Nzangwa",
   "Ubukoroco"
  ],
  "Mazane": [
   "Gasasa",
   "Rukira",
   "Rusenyi"
  ],
  "Nemba": [
   "Kigina",
   "Kimpara",
   "Kimvubu",
   "Muyoboro",
   "Nemba",
   "Nyakabingo",
   "Rutete",
   "Rwibinyogote",
   "Rwiminazi"
  ],
  "Nkanga": [
   "Agashoro",
   "Kivusha",
   "Mujwiri",
   "Mushyoroti",
   "Nkanga",
   "Ruzo"
  ],
  "Sharita": [
   "Karizinge",
   "Sharita"
  ]
 },
 "Shyara": {
  "Kabagugu": [
   "Kabagugu",
   "Kinteko",
   "Ngaruye",
   "Rwamanyoni"
  ],
  "Kamabuye": [
   "Gakoni",
   "Nyabaguma",
   "Rubwirwa"
  ],
  "Nziranziza": [
   "Gahosha",
   "Kagarama",
   "Nziranziza",
   "Ruli"
  ],
  "Rebero": [
   "Gateko",
   "Nyamirama",
   "Rebero",
   "Rutebe"
  ],
  "Rutare": [
   "Gaseke"
  ]
 }
};