function parseArgs(args = process.argv) {
	return args.slice(2).join(' ').split(/ (?=-)/).reduce((obj, arg) => {
		let [, key, value] = arg.match(/(?:-{1,2}([a-zA-Z\-_]+))[= ](.+)/);
		if (/^\d+$/.test(value))
			value = parseInt(value);

		obj[key.replace(/[-_]([a-z])/g, m => m[1].toUpperCase())] = value;
		return obj;
	}, { })
}

const camelCaseCache = { };
function camelCaseEventName(string) {
	return camelCaseCache[string] || (camelCaseCache[string] = string.toLowerCase().replace(/[_]([a-z])/g, m => m[1].toUpperCase()));
}

module.exports = {
	parseArgs,
	camelCaseEventName
};
