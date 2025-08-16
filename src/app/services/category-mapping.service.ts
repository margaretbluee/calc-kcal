import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryMappingService {
  private reverseMap: { [key: string]: string } = {
    // 🥩 Meat
    'kreopwleio': 'meatfish',
    'Fresko Kreas and Psaria': 'meatfish',
    'fresko moschari': 'meatfish',
    'fresko choirino': 'meatfish',
    'freska poylerika': 'meatfish',
    'freska arnia katsikia': 'meatfish',
    'freska paraskeyasmata kreaton poylerikon': 'meatfish',
    'psaria ichthyokalliergeias': 'meatfish',
    'chtapodia kalamaria soypies': 'meatfish',
    'ostrakoeidi': 'meatfish',

    // 🥦 Fruits & Vegetables
    'manabiko': 'fruit vegetables',
    'Fruits': 'fruit vegetables',
    'Vegetables': 'fruit vegetables',
    'froyta': 'fruit vegetables',
    'lachanika': 'fruit vegetables',
    'kommena lahanika': 'fruit vegetables',

    // 🧀 Dairy
    'eidh psugeiou': 'dairy',
    'Galaktokomika Fytika Rofimata and Eidi Psygeioy': 'dairy',
    'Tyria Fytika Anapliromata and Allantika': 'dairy',
    'galata psygeioy': 'dairy',
    'galata sokolatoycha psygeioy': 'dairy',
    'futika alla rofimata psygeiou': 'dairy',
    'chymoi tsai psygeioy': 'dairy',
    'giaoyrtia': 'dairy',
    'giaoyrtia vrefika paidika': 'dairy',
    'epidorpia giaoyrtioy': 'dairy',
    'fytika epidorpia': 'dairy',
    'ryzogala glykismata psygeioy': 'dairy',
    'feta leuka tyria': 'dairy',
    'malaka tyria': 'dairy',
    'imisklira tyria': 'dairy',
    'sklira tyria': 'dairy',
    'tyria aleifomena mini tyrakia': 'dairy',
    'futika anapliromata': 'dairy',

    // 🥖 Bakery
    'artozaxaroplasteio': 'bakery',
    'Artos Zacharoplasteio': 'bakery',
    'psomi artoskeyasmata': 'bakery',
    'psomi typopoiimeno': 'bakery',
    'pites tortigies': 'bakery',
    'kritsinia paximadia fryganies': 'bakery',
    'koyloyria voytimata': 'bakery',

    // ❄ Frozen
    'eidh katapsukshs': 'frozen',
    'Katepsygmena trofima': 'frozen',
    'katepsygmena psaria thalassina': 'frozen',
    'katepsygmena kreata poylerika': 'frozen',
    'katepsygmena fytika anapliromata': 'frozen',
    'katepsygmena geymata': 'frozen',

    // 🥗 Healthy & Organic
    'ugieinh diatrofh': 'healthy organic',
    'biologika proionta': 'healthy organic',
    'vegan proionta': 'healthy organic',
    'proionta xwris gloutenh': 'healthy organic',
    'Tyria Fytika Anapliromata and Allantika ': 'healthy organic',
 
    // 🍝 Pantry
    'eidh pantopwleiou': 'pantry',
    'zumarika ospria': 'pantry',
    'konserboeidh': 'pantry',
    'Vasika typopoiimena trofima': 'pantry',
    'aleyri simigdali': 'pantry',
    'zymarika': 'pantry',
    'ketsap moystardes magionezes etoimes saltses': 'pantry',
    'mpacharika alatia xidia zomoi': 'pantry',
    'ryzia': 'pantry',
    'ospria': 'pantry',
    'sitari kinoa soigia alla dimitriaka': 'pantry',
    'poyredes soypes noodles': 'pantry',
    'ntomatika': 'pantry',
    'meigmata gia zele glyka': 'pantry',

    // 🥪 Ready Meals
    'Etoima Geymata': 'ready meals',
    'geymata me kreas poylerika': 'ready meals',
    'geymata me psaria thalassina sushi': 'ready meals',
    'geymata osprion lachanikon': 'ready meals',
    'ladera': 'ready meals',
    'geymata zymarikon ryzioy': 'ready meals',
    'soupes': 'ready meals',
    'etoimes salates synodeytika geymaton': 'ready meals',
    'santoyits': 'ready meals',

    // 🍷 Beverages
    'Beverages': 'beverages',
    'Kava anapsyktika nera xiroi karpoi': 'beverages',
    'kafedes rofimata afepsimata': 'beverages',

    // 🍫 Sweets
    'zaxarwdh mpiskota': 'sweets snacks',
    'Proino snacking and rofimata': 'sweets snacks',
    'chalvades': 'sweets snacks',
  };

  mapCategory(category: string): string {
    return this.reverseMap[category] || category;
  }
}
