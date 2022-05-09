// @ts-check
"use strict";
const fs = require("fs");
const path = require("path");
const util = require("util");
const cheerio = require("cheerio");
const { marked } = require("marked");
const simpleGit = require("simple-git");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const bcRoot = path.resolve(__dirname, "../..");
const htmlPath = path.join(bcRoot, "changelog.html");
const markdownPath = path.join(bcRoot, "CHANGELOG.md");

/** @type {Record<string, string>} */
const CONTRIBUTOR_NAMES = {
	"Ben987": "Ben987",
	"ace-1331": "Ace",
	"Ace": "Ace",
	"Ada18980": "Ada",
	"Ayesha-678": "Ayesha",
	"Elda": "Elda",
	"Ellie": "Ellie",
	"EmilyR42": "Emily R",
	"fleisch11": "fleisch11",
	"gatetrek": "gatetrek",
	"jomshir98": "Jomshir",
	"Jomshir98": "Jomshir",
	"Kimei Nishimura": "Kimei",
	"Natsuki": "Natsuki",
	"Nina-1474": "Nina",
	"NoneNoname": "Sekkmer",
	"Verity": "Verity",
	"wildsj": "wildsj",
	"Ruilov3": "Rui",
	"Shiranui-Izayoi": "Aeren",
	"DaddyDaubeny": "Daddy Daubeny",
	"T-Bone Shark": "T-Bone Shark",
	"zorgjbe": "Estsanatlehi",
	"Atasly": "Atasly",
	"diaperand": "diaperand",
	"Tsubasahane": "Tsubasahane",
	"ABalfik": "Alfi",
	"Yuki": "Yuki",
	"Jules Papillon": "Yuki",
	"Manilla32": "Manilla",
	"klorpa": "klorpa",
	"Sidiousious": "Sidious",
	"karame1": "Karamel",
	"dependabot[bot]": "Dependabot",
	"remiliacn": "remiliacn",
	"SepiaOulomenohn": "SepiaOulomenohn",
	"Luna": "Luna",
	"Pjara Yuzu": "Pjara Yuzu",
	"luoxingchen": "luoxingchen",
	"VCode": "VCode",
	"Anonymous-WghrYkBGUjBt": "Anonymous-WghrYkBGUjBt",
	"EliseRoland": "EliseRoland",
	"estuiguang": "estuiguang",
};

async function generateChangelogHtml() {

	const [sourceHtml, sourceMarkdown] = await Promise.all([
		readFileAsync(htmlPath, "utf-8"),
		readFileAsync(markdownPath, "utf-8"),
	]);

	const startIndex = sourceMarkdown.search(/^## \[R[0-9a-zA-Z]+]/m);
	const trimmedMarkdown = sourceMarkdown.substring(startIndex);
	const renderedMarkdown = marked.parse(trimmedMarkdown);

	const $ = cheerio.load(sourceHtml);
	$("body").empty()
		.append("<h1>Bondage Club - Changelog</h1>\n")
		.append("<h2 id=\"table-of-contents\">Table of Contents</h2>\n")
		.append(generateToc(sourceMarkdown) + "\n")
		.append(generateContributorNote())
		.append(renderedMarkdown);

	await writeFileAsync(htmlPath, $.root().html());
}

function generateContributorNote() {
	return `
<blockquote id="note-to-contributors">
	<p>
		<strong>Note to contributors:</strong> If you have not stated a preferred name for inclusion in the changelog or
		 game credits, we will use the username on your Git commits by default. If you would like to use another name,
		 please ask in the programming channel of <a href="https://discordapp.com/invite/dkWsEjf">the game&apos;s
		 official Discord Server</a>, or <a href="https://github.com/Ben987/Bondage-College/issues">raise an issue</a>
		 via the game's Github.
	</p>
</blockquote>
`
}

function generateToc(sourceMarkdown) {
	const $ = cheerio.load("<ul>\n</ul>");
	const matches = sourceMarkdown.match(/^## \[R[0-9A-Z]+]/gim);
	matches.forEach((match, i) => {
		const version = match.match(/\[(R[0-9A-Z]+)]/)[1];
		$("ul").attr("id", "toc-list").append(`\t<li><a href="#${version.toLowerCase()}">${version}${i === 0 ? " (Current)" : ""}</a></li>\n`);
	});
	return $.root().html();
}

async function prepareChangelog(release = "") {
	const originalMarkdown = fs.readFileSync(markdownPath, "utf-8");
	let lines = originalMarkdown.split(/\n/g);

	const lastUpdateRegex = /^\* Changelog last updated: /;
	const lastUpdateLine = lines.findIndex(line => lastUpdateRegex.test(line));

	if (lastUpdateLine < 0) {
		console.error("ERROR: Failed to find last upate date in changelog");
		return;
	}
	console.log(lines[lastUpdateLine].substr(12));

	const lastPRRegex = /^\* Last recorded PR: \[#(\d+)\]/;
	const lastPRLine = lines.findIndex(line => lastPRRegex.test(line));
	const lastPRRegexResult = lastPRLine >= 0 && lastPRRegex.exec(lines[lastPRLine]);

	if (lastPRLine < 0 || !lastPRRegexResult) {
		console.error("ERROR: Failed to find last PR in changelog");
		return;
	}
	const lastPR = lastPRRegexResult[1];
	console.log(`Last recorded PR: #${lastPR}`);

	const lastCommitRegex = /^\* Last recorded commit hash: `([0-f]+)`/;
	const lastCommitLine = lines.findIndex(line => lastCommitRegex.test(line));
	const lastCommitRegexResult = lastCommitLine >= 0 && lastCommitRegex.exec(lines[lastCommitLine]);

	if (lastCommitLine < 0 || !lastCommitRegexResult) {
		console.error("ERROR: Failed to find last commit in changelog");
		return;
	}
	const lastCommit = lastCommitRegexResult[1];
	console.log(`Last recorded commit: ${lastCommit}`);

	/** @type {simpleGit.SimpleGit} */
	// @ts-ignore
	const git = simpleGit(bcRoot);

	const commits = (await git.log(['upstream/master'])).all;

	const lastPos = commits.findIndex(c => c.hash === lastCommit);

	if (lastPos < 0) {
		console.error("ERROR: Last recorded commit not found in history!");
		return;
	}

	console.log("Processing new commits...\n");

	/** @type {string[]} */
	const resAdd = [];

	let newLastPR = lastPR;
	let newLastCommit = lastCommit;

	for (let i = lastPos - 1; i >= 0; i--) {
		const commit = commits[i];

		const PRresult = /^(.*)\(#(\d+)\)$/.exec(commit.message);
		const PR = PRresult && PRresult[2];
		const PRText = PR ? `([#${PR}](https://github.com/Ben987/Bondage-College/pull/${PR}))` : `(PR not found)`;
		const message = (PRresult ? PRresult[1] : commit.message).trim();

		if (PR) {
			newLastPR = PR;
		}
		newLastCommit = commit.hash;

		if (CONTRIBUTOR_NAMES[commit.author_name] === undefined) {
			console.warn(`Unknown commit author "${commit.author_name}"`);
			CONTRIBUTOR_NAMES[commit.author_name] = commit.author_name;
		}

		resAdd.push(`* ${CONTRIBUTOR_NAMES[commit.author_name]} - ${message} ${PRText}`);
	}

	const now = new Date();
	const num = ( /** @type {number} */ n) => `${n}`.padStart(2, '0');

	lines[lastUpdateLine] = `* Changelog last updated: ${now.getFullYear()}-${num(now.getMonth()+1)}-${num(now.getDate())}`;
	lines[lastPRLine] = `* Last recorded PR: [#${newLastPR}](https://github.com/Ben987/Bondage-College/pull/${newLastPR})`;
	lines[lastCommitLine] = `* Last recorded commit hash: \`${newLastCommit}\``;

	const releaseAdd = release ? `
## [${release}]

### [Added]

* Nothing this release

### [Removed]

* Nothing this release

### [Changed]

* Nothing this release

### [Fixed]

* Nothing this release

### [Technical]

* Nothing this release

### [Beta Fixes]

* Nothing... yet
` : "";

	lines = [
		...lines.slice(0, lastCommitLine+1),
		"",
		"## [Generated]",
		...resAdd,
		releaseAdd,
		...lines.slice(lastCommitLine+1)
	];

	fs.writeFileSync(markdownPath, lines.join("\n"), "utf-8");

	console.log(`\nDone! ${resAdd.length} commits processed`);
}

if (process.argv.length < 3) {
	console.log(`Expected usage: node ${process.argv[1]} <generate|prepare> [release]`);
} else if (process.argv[2].toLocaleLowerCase() === "generate") {
	generateChangelogHtml();
} else if (process.argv[2].toLocaleLowerCase() === "prepare") {
	prepareChangelog(process.argv[3]);
}
