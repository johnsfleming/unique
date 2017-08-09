export class Country {
	_id?: string;
	name: string;
	population: integer;
	age: {
		at birth: integer;
		0-14 years: integer;
		15-24 years: integer;
		25-54 years: integer;
		55-64 years: integer;
		65 years and over: integer;
	}
	gender: {
		at birth: integer;
		0-14 years: integer;
		15-24 years: integer;
		25-54 years: integer;
		55-64 years: integer;
		65 years and over: integer;
		total: integer;
	}
	religion: {
	  first: integer;
    second: integer;
    third: integer;
    fourth: integer;
    fifth: integer;
    sixth: integer;
    seventh: integer;
    eigth: integer;
    ninth: integer;
    tenth: integer;
	}
  ethnicity: {
    first: integer;
    second: integer;
    third: integer;
    fourth: integer;
    fifth: integer;
    sixth: integer;
    seventh: integer;
    eigth: integer;
    ninth: integer;
    tenth: integer;
  }
}
