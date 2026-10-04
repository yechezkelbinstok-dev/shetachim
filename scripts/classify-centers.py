# Sorts the US & Canada centers into outreach / not outreach / borderline for exports/us-canada-centers-shluchim.xlsx.
import re
NOT_TYPES = {
 'Publishing House':'Publisher', 'Publications':'Publisher', 'Judaica/Gift Shop':'Store',
 'Cheder':'Community school (cheder)', 'Yeshivah Ketanah/Mesivtah':'Community school (mesivta)',
 'Yeshivah Gedolah':'Yeshiva', 'Kollel':'Kollel', "Teachers' Seminary":'Seminary', 'Semichah Program':'Yeshiva',
 'Yeshiva Camp':'Yeshiva', "N'Shei Chabad":'Community organisation', 'Free Loan Fund':'Community organisation',
 'Rabbinic Council':'Community organisation',
}
# Names that mark a Lubavitch community institution rather than outreach.
NOT_NAMES = [
 (r'\bcheder\b', 'Community school (cheder)'), (r'mesivta|mesivtos', 'Community school (mesivta)'),
 (r'tomchei t|ohr temimim|lev tmimim|rabbinical (college|institute)|yeshivas? lubavitch|yeshivas ohr|yeshiva tomchei|yeshivah torah ohr|beis dovid shlomo|ohr elchonon|beis medrash chabad|^yeshiva campus$|^my yeshiva$', 'Yeshiva'),
 (r'beth? rivkah|beis rivk|ba[iy]s chaya mushka|beis chaya mushka|bais chomesh|rohr bais chaya|lubavitch (yeshiva )?girls|chabad girls high|beis chana school|bais chana girls|cheder lubavitch girls', 'Community girls school'),
 (r'oholei yosef yitzchak|wilmos & lillian|torah temimah|yeshiva schools|lubavitch educational center|mercaz yisroel|united lubavitcher|^gan yisroel school', 'Community school'),
 (r'kollel|colel|kolel|yagdil torah', 'Kollel'), (r'seminary', 'Seminary'),
 (r'anash|anshei lubavitch|beth hamedrash lubavitch|congregation lubavitch$|neshei chabad|heichal menachem|camp emunah|pardas chanah|torah fax|non profit loan', 'Community institution'),
]
# Crown Heights: central offices and the local community, decided one by one.
CH_NOT = {
 '770 Visitors Center':'Central office','Agudas Chassidei Chabad':'Central office','Aliya Girls':'Crown Heights community','ALIYA':'Crown Heights community',
 'American Friends of Chabad Venezuelan Jewry':'Central office','Associated Beth Rivkah Schools':'Community girls school','Bais Menachem Mendel':'Crown Heights community',
 'Beth Rivkah Headstart':'Crown Heights community','CTeen Program':'Central office','Central Yeshiva Tomchei Tmimim Lubavitch':'Yeshiva',
 'Chabad Israeli Tourist and Delegations':'Central office','Chabad Lubavitch Headquarters':'Central office','Chabad Lubavitch Media Center':'Central office',
 'Chabad on Campus International':'Central office','Chinuch Office':'Central office','Colel Chabad':'Charity','Colel Menachem':'Kollel','Collel Menachem':'Kollel',
 'Gan Yisroel School':'Community school','Heichal Menachem':'Library','IYYUN / CHABAD':'Central office','Igud Mesivtos V\'Yeshivos Lubavitch':'Central office',
 'Jewish Educational Media':'Central office','Kehot Publication Society':'Publisher','Kehot Publication Society, Showroom':'Store','Kiddie Gan Day Camp':'Crown Heights community',
 'Lahak Hanochos Inc.':'Publisher','Levi Yitzchok Library - LYO':'Library','Library of Agudas Chasidei Chabad':'Library','Living Chassidus':'Central office',
 'Lubavitch Youth Organization Headquarters':'Central office','Lubavitch Youth Organization':'Central office','Mayan Yisroel':'Crown Heights community',
 'Mercaz Yisroel L\'Chinuch':'Community school','Merkos L\'inyonei Chinuch':'Central office','Merkos Suite 302':'Central office','Mifal Hafatza':'Central office',
 'Mitzvah Tank Organization':'Central office','Lubavitch Youth Mitzvah Tank':'Central office','National Committee for Furtherance of Jewish Education':'Central office','Neiros Lehuir':'Central office',
 'Or Hachasidus Publishing':'Publisher','Shabbat Candles Campaign - Mivtza Neshek':'Central office','Sichos in English':'Publisher','TAG Counceling Programs':'Crown Heights community',
 'Taharas Hamishpacha International':'Central office','The Jewish Learning Institute':'Central office','The Shluchim Office':'Central office','Tzivos Hashem':'Central office',
 'United Lubavitcher Yeshivoth':'Community school','United Lubavitcher Yeshivoth Mesivta & High School':'Community school (mesivta)','Vaad Hanochos Hatmimim':'Publisher',
 'Vaad Rabonei Lubavitch':'Community organisation','Vaad Talmidei Hatmimim':'Yeshiva','Womens\' Mikvah':'Crown Heights community','Yad L\'Shliach':'Central office',
 'Yaldei Shluchei Harebbe':'Central office','F.R.E.E. HQ - Friends of Refugees of Eastern Europe':'Central office','Lubavitch Chabad of IL - Government Affairs':'Central office',
 'National Committee for Jewish Education':'Central office',
}
OUT = {'Bader Hillel High':'Day school','F.R.E.E. Educational Center - Ohel Dovid':'Russian Jewry school','Bais Menachem Youth Development Program':'Youth at risk'}
BORDER_TYPES = {'Mikveh':'Mikveh', 'Overnight Camp':'Overnight camp', 'Library':'Library', 'High School - Girls':'Girls high school', 'High School - Boys':'Boys high school', 'Vocational School':'College'}
BORDER_NAMES = [(r'mikva', 'Mikveh'), (r'kosher restaurant|kosh & chai|mazal tov gifts', 'Business'), (r'congregation levi yitzchak|young israel chabad', 'Shul in a Lubavitch community')]
def classify(name, ctype):
    n = name.strip()
    if n in CH_NOT: return 'Not outreach', CH_NOT[n]
    low = n.lower()
    if n in OUT: return 'Outreach', OUT[n]
    if re.search(r'tiferes? z|tiferet zk|zekeinim|zkanim', low): return 'Outreach', 'Seniors'
    if ctype in NOT_TYPES: return 'Not outreach', NOT_TYPES[ctype]
    for pat, why in NOT_NAMES:
        if re.search(pat, low): return 'Not outreach', why
    if ctype in BORDER_TYPES: return 'Borderline', BORDER_TYPES[ctype]
    for pat, why in BORDER_NAMES:
        if re.search(pat, low): return 'Borderline', why
    return 'Outreach', ctype or 'Chabad House'
