class LocalStorageController {
	private parseKey = (id: string) => `client-${id}`;

	public set = (key: string, value: string | number | Object) => {
		let stringValue: string = "";
		if (typeof value === "string") stringValue = value;
		if (typeof value === "number") stringValue = value.toString();
		else if (typeof value === "object") stringValue = JSON.stringify(value);

		if (stringValue) {
			return localStorage.setItem(this.parseKey(key), stringValue);
		}
		throw console.error(
			`localStorage: could not set item with key ${key} to`,
			value
		);
	};

	public get = (key: string) => {
		return localStorage.getItem(this.parseKey(key)) || undefined;
	};
}

export default new LocalStorageController();
