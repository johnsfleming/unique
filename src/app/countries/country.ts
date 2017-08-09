export class Country {
	_id?: string;
	name: string;
	population: number;
	age: {
		"at birth": number;
		"0-14 years": number;
		"15-24 years": number;
		"25-54 years": number;
		"55-64 years": number;
		"65 years and over": number;
	}
	gender: {
		"at birth": number;
		"0-14 years": number;
		"15-24 years": number;
		"25-54 years": number;
		"55-64 years": number;
		"65 years and over": number;
		"total population": number;
	}
}
