export class Country {
	_id?: string;
	name: string;
	population: number;
	age: {
		"0-14 years": number;
		"15-24 years": number;
		"25-54 years": number;
		"55-64 years": number;
		"65 years and over": number;
	};
	gender: {
		"0-14 years": number;
		"15-24 years": number;
		"25-54 years": number;
		"55-64 years": number;
		"65 years and over": number;
		"total population": number;
	};
	religions: any;
	ethnicGroups: any;
}
