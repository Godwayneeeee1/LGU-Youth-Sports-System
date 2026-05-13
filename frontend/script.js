let BARANGAYS = [];
let TRANSFER_BARANGAYS = [];

let isLoggedIn = false;
let allYouths = [];
let currentBarangayId = null;
let CURRENT_USER = null;
let ADMIN_ACTIVITY_REFRESH = null;
let YOUTH_DATA_REFRESH = null;
let LIST_VIEW_REFRESH = null;
let ADMIN_ACCOUNT_BARANGAYS = [];
let ADMIN_ACCOUNT_ROWS = [];
let ADMIN_ACCOUNT_MODAL = null;
let TRANSFER_CONFIRM_MODAL = null;
let TRANSFER_CONFIRM_RESOLVER = null;
let DELETE_CONFIRM_MODAL = null;
let DELETE_CONFIRM_RESOLVER = null;
const YOUTH_MODAL_DRAFT_STORAGE_PREFIX = 'lydo-youth-modal-draft';

// Page boot sequence is driven by DOMContentLoaded in this file.
// Barangays in the same group are allowed transfer destinations for the same youth record.
const YOUTH_BARANGAY_MOVE_GROUPS = [
	['Alae', 'Mantibugao', 'Mambatangan'],
	['Damilag', 'Agusan Canyon', 'San Miguel'],
	['Tankulan', 'Diclum', 'Dicklum', 'Santo Niño', 'Lunocan'],
	['Maluko', 'Dalirig'],
	['Dahilayan', 'Mampayag', 'Guilang-guilang', 'Kalugmanan'],
	['Lingion', 'Sankanan', 'Santiago', 'Lindaban', 'Ticala', 'Minsuro']
];

const SPORT_PREFERENCE_OPTIONS = [
	'Adventure Racing',
	'Aerobics',
	'Archery',
	'Arnis',
	'Arm Wrestling',
	'Athletics',
	'Auto Racing',
	'Badminton',
	'Baseball',
	'Basketball',
	'Billiards',
	'BJJ',
	'Bobsleigh',
	'Bowling',
	'Boxing',
	'Canoeing',
	'Chess',
	'Climbing',
	'Cricket',
	'CrossFit',
	'Curling',
	'Cycling',
	'Darts',
	'Disc Golf',
	'Diving',
	'Dodgeball',
	'Dragon Boat Racing',
	'E-Sports',
	'Endurance Running',
	'Equestrian',
	'Extreme Sports',
	'Fencing',
	'Figure Skating',
	'Floorball',
	'Football',
	'Freestyle Skiing',
	'Gaelic Football',
	'Gliding',
	'Go-Karting',
	'Golf',
	'Gymnastics',
	'Handball',
	'Hang Gliding',
	'Hockey (Field/Ice)',
	'Horse Racing',
	'Hurling',
	'Ice Hockey',
	'Ice Skating',
	'Indoor Volleyball',
	'Jai Alai',
	'Javelin',
	'Jet Skiing',
	'Judo',
	'Jump Rope',
	'Karate',
	'Kayaking',
	'Kickboxing',
	'Kiteboarding',
	'Korfball',
	'Lacrosse',
	'Lawn Bowls',
	'Log Rolling',
	'Long Jump',
	'Luge',
	'Martial Arts',
	'Mixed Martial Arts (MMA)',
	'Modern Pentathlon',
	'Motocross',
	'Mountain Biking',
	'Netball',
	'Ninja Warrior Competitions',
	'Novuss',
	'Octopush (Underwater Hockey)',
	'Olympic Weightlifting',
	'Orienteering',
	'Padel',
	'Paintball',
	'Parkour',
	'Pickleball',
	'Polo',
	'Powerlifting',
	'Qianball',
	'Quad Biking',
	'Quidditch (Muggle Version)',
	'Racquetball',
	'Rock Climbing',
	'Roller Derby',
	'Rowing',
	'Rugby',
	'Sepak Takraw',
	'Skateboarding',
	'Skiing',
	'Soccer',
	'Softball',
	'Squash',
	'Surfing',
	'Swimming',
	'Table Tennis',
	'Taekwondo',
	'Tennis',
	'Track and Field',
	'Track Cycling',
	'Triathlon',
	'Ultimate Frisbee',
	'Ultrarunning',
	'Underwater Hockey',
	'Unicycling',
	'Vaulting',
	'Vertical Running',
	'Voivinam',
	'Volleyball',
	'Wakeboarding',
	'Water Polo',
	'Weightlifting',
	'Windsurfing',
	'Wrestling',
	'X-Country Skiing',
	'Xare (Basque Racket Sport)',
	'Xtreme Sports',
	'Yachting',
	'Yak Polo',
	'Yoga (Competitive)',
	'Youth Athletics',
	'Zen Archery',
	'Zipline Racing',
	'Zorb Football',
	'Zorbing'
].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

const TALENT_PREFERENCE_OPTIONS = [
	'Acting / Drama',
	'Dance',
	'Drawing & Painting',
	'Musical Instruments (Piano, Guitar, Violin, etc.)',
	'Pottery & Sculpting',
	'Vocals / Choir'
];

const ORGANIZATION_JOINED_OPTIONS = [
	'BASBASONON ORGANIZATION',
	'MANOLO FORTICH JUNIOR CHESS CLUB',
	'STO. NINO NATIONAL HIGH SCHOOL - SUPREME SECONDARY LEARNER GOVERNMENT (SSLG)',
	'MANOLO FORTICH BANOG BANOG ARNIS KALI ESKRIMA (MFBAKE Club)',
	'IMMACULATE CONCEPTION PARISH YOUTH APOSTOLATE',
	'ST. JUDE THADDEUS PARISH YOUTH APOSTOLATE',
	'YOUTH FOR ENVIRONMENT IN SCHOOLS ORGANIZATION (YES-O) OF DALIRIG NATIONAL HIGH SCHOOL',
	'SUPREME SECONDARY LEARNER GOVERNMENT - DALIRIG NATIONAL HIGHSCHOOL',
	'MANOLO FORTICH VOLLEYBALL CLUB',
	'MANOLO FORTICH NATIONAL HIGH SCHOOL - SUPREME SECONDARY LEARNER GOVERNMENT',
	'KRISTYANONG KABATAAN PARA SA BAYAN MOVEMENT-MANOLO FORTICH',
	'PROPELLING OUR INHERITED NATION THROUGH OUR YOUTH INCORPORATED (POINTY INC.) MANOLO FORTICH',
	'UPPER CALANAWAN YOUTH MOVEMENT',
	'BUKHAD-MANOLO FORTICH',
	'SANKANAN NHS - SUPREME SECONDARY LEARNER GOVERNMENT',
	'YOUTH FOR ENVIRONMENT IN SCHOOLS ORGANIZATION (YES-O) - MANOLO FORTICH'
];

window.nextTab = window.nextTab || function(target) { console.warn('nextTab called before initialization', target); };
window.prevTab = window.prevTab || function(target) { console.warn('prevTab called before initialization', target); };

const $id = id => document.getElementById(id);
const val = id => ($id(id) && $id(id).value) || '';
const chk = id => !!($id(id) && $id(id).checked);
const setVal = (id, v) => { const e = $id(id); if (e) e.value = v || ''; };
const setChk = (id, v) => { const e = $id(id); if (e) e.checked = !!v; };
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
}[ch]));

function togglePasswordField(inputId, iconId) {
	const input = $id(inputId);
	const icon = $id(iconId);
	if (!input || !icon) return;

	if (input.type === 'password') {
		input.type = 'text';
		icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>';
	} else {
		input.type = 'password';
		icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
	}
}

function hexToRgbArray(hex) {
	if (!hex) return null;
	hex = hex.trim();
	if (hex.startsWith('rgb')) {
		const nums = hex.replace(/[^0-9,]/g,'').split(',').map(n => parseInt(n,10));
		return nums.slice(0,3);
	}
	if (hex.startsWith('#')) {
		const h = hex.substring(1);
		if (h.length === 3) {
			return [parseInt(h[0]+h[0],16), parseInt(h[1]+h[1],16), parseInt(h[2]+h[2],16)];
		}
		if (h.length === 6) {
			return [parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16), parseInt(h.substring(4,6),16)];
		}
	}
	return null;
}

function cssVarRgb(varName, fallback) {
	try {
		const raw = getComputedStyle(document.documentElement).getPropertyValue(varName) || '';
		const rgb = hexToRgbArray(raw.trim()) || fallback;
		return rgb;
	} catch (e) { return fallback; }
}

// Normalize barangay names so transfer checks still work across spelling variants.
function normalizeBarangayName(value) {
	const normalized = String(value || '')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, ' ');
	return normalized === 'dicklum' ? 'diclum' : normalized;
}

function parseBirthdateValue(value) {
	if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
	const [year, month, day] = value.split('-').map(Number);
	const parsed = new Date(year, month - 1, day);
	if (
		parsed.getFullYear() !== year ||
		parsed.getMonth() !== month - 1 ||
		parsed.getDate() !== day
	) {
		return null;
	}
	return parsed;
}

function formatDateForInput(date) {
	if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function yearsAgoFromToday(years) {
	const today = new Date();
	const target = new Date(today.getFullYear() - years, today.getMonth(), today.getDate());
	if (target.getMonth() !== today.getMonth()) {
		target.setDate(0);
	}
	return target;
}

function getAgeFromBirthdateValue(value) {
	const birthdate = parseBirthdateValue(value);
	if (!birthdate) return null;
	const today = new Date();
	let age = today.getFullYear() - birthdate.getFullYear();
	const hasHadBirthday =
		today.getMonth() > birthdate.getMonth() ||
		(today.getMonth() === birthdate.getMonth() && today.getDate() >= birthdate.getDate());
	if (!hasHadBirthday) age -= 1;
	return age;
}

function isBirthdateOverAgeLimit(value) {
	const birthdate = parseBirthdateValue(value);
	if (!birthdate) return false;
	return birthdate <= yearsAgoFromToday(31);
}

function getOldestAllowedBirthdateValue() {
	const oldestAllowed = yearsAgoFromToday(31);
	oldestAllowed.setDate(oldestAllowed.getDate() + 1);
	return formatDateForInput(oldestAllowed);
}

function setBirthdateFeedback(message, tone = 'muted') {
	const feedback = $id('birthdate-age-feedback');
	if (!feedback) return;
	feedback.className = `form-text text-${tone}`;
	feedback.textContent = message;
}

// Keep the age rule visible in the form and block saves once a user is 31+.
function updateBirthdateEligibilityState() {
	const input = $id('birthdate');
	if (!input) return true;

	if (!input.value) {
		input.setCustomValidity('');
		setBirthdateFeedback('Only youth aged 30 and below can be saved in the system.', 'muted');
		return true;
	}

	const age = getAgeFromBirthdateValue(input.value);
	if (isBirthdateOverAgeLimit(input.value)) {
		input.setCustomValidity(`Detected age: ${age ?? 31}. This person is already 31 or older and can no longer be saved as a youth record.`);
		setBirthdateFeedback(
			`Detected age: ${age ?? 31}. This person is already 31 or older, so the record cannot be saved.`,
			'danger'
		);
		return false;
	}

	input.setCustomValidity('');
	setBirthdateFeedback(
		age == null
			? 'Only youth aged 30 and below can be saved in the system.'
			: `Detected age: ${age}. This record is still allowed because the youth is 30 or below.`,
		age == null ? 'muted' : 'success'
	);
	return true;
}

function preferenceOptionId(prefix, option) {
	return `${prefix}-${String(option || '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')}`;
}

function renderPreferenceCheckboxGroup(containerId, prefix, options) {
	const container = $id(containerId);
	if (!container) return;
	container.innerHTML = options.map(option => `
		<div class="col-md-6">
			<div class="form-check m-0">
				<input type="checkbox" class="form-check-input" id="${preferenceOptionId(prefix, option)}">
				<label class="form-check-label" for="${preferenceOptionId(prefix, option)}">${option}</label>
			</div>
		</div>
	`).join('');
}

function renderPreferencePopupGroup(containerId, prefix, options) {
	const container = $id(containerId);
	if (!container) return;
	container.innerHTML = `
		<div class="preference-popup-grid">
			${options.map(option => `
				<label class="preference-popup-item" for="${preferenceOptionId(prefix, option)}">
					<input type="checkbox" class="form-check-input" id="${preferenceOptionId(prefix, option)}">
					<span>${option}</span>
				</label>
			`).join('')}
		</div>
	`;
}

function renderOrganizationJoinedOptions() {
	renderPreferencePopupGroup('organizations-joined-options', 'organization-joined', ORGANIZATION_JOINED_OPTIONS);
}

function collectPreferenceSelections(prefix, options) {
	return options.filter(option => {
		const input = $id(preferenceOptionId(prefix, option));
		return !!(input && input.checked);
	});
}

function applyPreferenceSelections(prefix, options, selectedValues) {
	const selectedSet = new Set((Array.isArray(selectedValues) ? selectedValues : []).map(value => String(value)));
	options.forEach(option => {
		const input = $id(preferenceOptionId(prefix, option));
		if (input) input.checked = selectedSet.has(option);
	});
}

function updatePreferencePopupLabel(prefix, options, labelId, emptyLabel) {
	const label = $id(labelId);
	if (!label) return;
	const selected = collectPreferenceSelections(prefix, options);
	if (!selected.length) {
		label.textContent = emptyLabel;
		return;
	}
	if (selected.length === 1) {
		label.textContent = selected[0];
		return;
	}
	label.textContent = `${selected.length} selected`;
}

function initPreferencePopupDropdown(wrapId, triggerId, panelId, prefix, options, labelId, emptyLabel) {
	const wrap = $id(wrapId);
	const trigger = $id(triggerId);
	const panel = $id(panelId);
	if (!wrap || !trigger || !panel) return;
	if (wrap.dataset.preferenceDropdownReady === 'true' || wrap.dataset.orgDropdownReady === 'true') return;

	const setOpen = (isOpen) => {
		wrap.classList.toggle('open', isOpen);
		trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
	};

	trigger.addEventListener('click', () => {
		setOpen(!wrap.classList.contains('open'));
	});

	panel.addEventListener('change', (event) => {
		const target = event.target;
		if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') return;
		updatePreferencePopupLabel(prefix, options, labelId, emptyLabel);
	});

	document.addEventListener('click', (event) => {
		if (!wrap.contains(event.target)) setOpen(false);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') setOpen(false);
	});

	updatePreferencePopupLabel(prefix, options, labelId, emptyLabel);
	wrap.dataset.preferenceDropdownReady = 'true';
	if (wrapId === 'organizations-joined-wrap') {
		wrap.dataset.orgDropdownReady = 'true';
	}
}

function collectOrganizationJoinedSelections() {
	return collectPreferenceSelections('organization-joined', ORGANIZATION_JOINED_OPTIONS);
}

function applyOrganizationJoinedSelections(selectedValues) {
	applyPreferenceSelections('organization-joined', ORGANIZATION_JOINED_OPTIONS, selectedValues);
	updatePreferencePopupLabel(
		'organization-joined',
		ORGANIZATION_JOINED_OPTIONS,
		'organizations-joined-label',
		'Select organizations'
	);
}

function syncNonVoterCheckbox(changedId) {
	const nonVoter = $id('is_non_voter');
	const skVoter = $id('registered_voter_sk');
	const nationalVoter = $id('registered_voter_national');
	const votedLastSk = $id('voted_last_sk');
	if (!nonVoter || !skVoter || !nationalVoter || !votedLastSk) return;

	if (changedId === 'is_non_voter' && nonVoter.checked) {
		skVoter.checked = false;
		nationalVoter.checked = false;
		votedLastSk.checked = false;
		return;
	}

	if ((changedId === 'registered_voter_sk' || changedId === 'registered_voter_national' || changedId === 'voted_last_sk')
		&& (skVoter.checked || nationalVoter.checked || votedLastSk.checked)) {
		nonVoter.checked = false;
	}
}

const YOUTH_BARANGAY_MOVE_LOOKUP = (() => {
	const lookup = {};
	YOUTH_BARANGAY_MOVE_GROUPS.forEach(group => {
		const normalizedGroup = Array.from(new Set(group.map(normalizeBarangayName)));
		normalizedGroup.forEach(name => {
			lookup[name] = lookup[name] || new Set();
			normalizedGroup.forEach(other => {
				if (other !== name) lookup[name].add(other);
			});
		});
	});
	return lookup;
})();

function getBarangayNameById(id) {
	const match = BARANGAYS.find(barangay => String(barangay.id) === String(id));
	return match ? match.name : '';
}

function getAllowedBarangayMoves(currentBarangayName) {
	const normalizedCurrent = normalizeBarangayName(currentBarangayName);
	const allowedNames = Array.from(YOUTH_BARANGAY_MOVE_LOOKUP[normalizedCurrent] || []);
	return BARANGAYS
		.filter(barangay => allowedNames.includes(normalizeBarangayName(barangay.name)))
		.map(barangay => barangay.name)
		.sort((a, b) => a.localeCompare(b));
}

function isAllowedBarangayMove(currentBarangayName, newBarangayName) {
	if (!currentBarangayName || !newBarangayName) return false;
	if (normalizeBarangayName(currentBarangayName) === normalizeBarangayName(newBarangayName)) return true;
	return getAllowedBarangayMoves(currentBarangayName)
		.some(name => normalizeBarangayName(name) === normalizeBarangayName(newBarangayName));
}

function getSpecialCountEntries(data) {
	return [
		['ISY Male', data.isy_male ?? 0],
		['ISY Female', data.isy_female ?? 0],
		['ISY (Total)', data.isy ?? ((data.isy_male ?? 0) + (data.isy_female ?? 0))],
		['PWD Male', data.pwd_male ?? 0],
		['PWD Female', data.pwd_female ?? 0],
		['PWD (Total)', data.pwd ?? 0],
		['4Ps Male', data.fourps_male ?? 0],
		['4Ps Female', data.fourps_female ?? 0],
		['4Ps Total', data.fourps ?? ((data.fourps_male ?? 0) + (data.fourps_female ?? 0))],
		['Working Male', data.working_male ?? 0],
		['Working Female', data.working_female ?? 0],
		['Working (Total)', data.working ?? ((data.working_male ?? 0) + (data.working_female ?? 0))],
		['Unemployed Male', data.unemployed_male ?? 0],
		['Unemployed Female', data.unemployed_female ?? 0],
		['Unemployed (Total)', data.unemployed ?? ((data.unemployed_male ?? 0) + (data.unemployed_female ?? 0))],
		['IP Male', data.ip_male ?? 0],
		['IP Female', data.ip_female ?? 0],
		['IP (Total)', data.ip ?? ((data.ip_male ?? 0) + (data.ip_female ?? 0))],
		['Muslim Male', data.muslim_male ?? 0],
		['Muslim Female', data.muslim_female ?? 0],
		['Muslim (Total)', data.muslim ?? ((data.muslim_male ?? 0) + (data.muslim_female ?? 0))],
		['OSY Male', data.osy_male ?? 0],
		['OSY Female', data.osy_female ?? 0],
		['OSY (Total)', (data.osy != null) ? data.osy : ((data.osy_male ?? 0) + (data.osy_female ?? 0))],
	];
}

function buildBarangaySummaryFromLoadedYouths(bid) {
	const youths = Array.isArray(allYouths)
		? allYouths.filter(y => String(y.barangay_id) === String(bid))
		: [];
	const barangayName = youths[0]?.barangay_name || getBarangayNameById(bid) || 'Barangay';
	const summary = {
		barangay_id: bid,
		barangay_name: barangayName,
		total: youths.length,
		sex: {},
		ages: {},
		civil_status: {},
		education: {},
		isy: 0,
		isy_male: 0,
		isy_female: 0,
		pwd: 0,
		pwd_male: 0,
		pwd_female: 0,
		fourps: 0,
		fourps_male: 0,
		fourps_female: 0,
		working: 0,
		working_male: 0,
		working_female: 0,
		unemployed: 0,
		unemployed_male: 0,
		unemployed_female: 0,
		ip: 0,
		ip_male: 0,
		ip_female: 0,
		muslim: 0,
		muslim_male: 0,
		muslim_female: 0,
		osy: 0,
		osy_male: 0,
		osy_female: 0
	};

	youths.forEach(youth => {
		const details = youth.full_data || {};
		const sex = String(youth.sex || '').trim() || 'Unknown';
		const age = String(youth.age ?? '0');
		const civilStatus = String(details.civil_status || '').trim() || 'Unknown';
		const educationLevel = String(youth.education_level || '').trim() || 'Unknown';
		const sexKey = sex.toLowerCase();

		summary.sex[sex] = (summary.sex[sex] || 0) + 1;
		summary.ages[age] = (summary.ages[age] || 0) + 1;
		summary.civil_status[civilStatus] = (summary.civil_status[civilStatus] || 0) + 1;
		summary.education[educationLevel] = (summary.education[educationLevel] || 0) + 1;

		if (toBool(details.is_in_school) || toBool(youth.is_in_school)) {
			summary.isy += 1;
			if (sexKey === 'male') summary.isy_male += 1;
			if (sexKey === 'female') summary.isy_female += 1;
		}
		if (toBool(details.is_pwd)) {
			summary.pwd += 1;
			if (sexKey === 'male') summary.pwd_male += 1;
			if (sexKey === 'female') summary.pwd_female += 1;
		}
		if (toBool(details.is_4ps)) {
			summary.fourps += 1;
			if (sexKey === 'male') summary.fourps_male += 1;
			if (sexKey === 'female') summary.fourps_female += 1;
		}
		if (toBool(details.is_working_youth)) {
			summary.working += 1;
			if (sexKey === 'male') summary.working_male += 1;
			if (sexKey === 'female') summary.working_female += 1;
		}
		if (toBool(details.is_unemployed) || toBool(details.is_unemployed_youth)) {
			summary.unemployed += 1;
			if (sexKey === 'male') summary.unemployed_male += 1;
			if (sexKey === 'female') summary.unemployed_female += 1;
		}
		if (toBool(details.is_ip)) {
			summary.ip += 1;
			if (sexKey === 'male') summary.ip_male += 1;
			if (sexKey === 'female') summary.ip_female += 1;
		}
		if (toBool(details.is_muslim)) {
			summary.muslim += 1;
			if (sexKey === 'male') summary.muslim_male += 1;
			if (sexKey === 'female') summary.muslim_female += 1;
		}
		if (toBool(details.is_osy)) {
			summary.osy += 1;
			if (sexKey === 'male') summary.osy_male += 1;
			if (sexKey === 'female') summary.osy_female += 1;
		}
	});

	return summary;
}

function buildSummaryRows(data) {
	const AGE_START = 15, AGE_END = 30;
	const ageCols = [];
	for (let a = AGE_START; a <= AGE_END; a++) ageCols.push(String(a));
	const rows = [];
	rows.push(['DEMOGRAPHICS', ...ageCols, 'TOTAL']);
	rows.push(['Barangay', ...ageCols.map(()=>''), data.barangay_name || '']);
	rows.push(['Total Youth', ...ageCols.map(()=>''), data.total ?? 0]);
	rows.push([]);

	rows.push(['SEX ASSIGNED BY BIRTH', ...ageCols.map(()=>''), '']);
	const sexByAge = data.sex_by_age || {};
	const sexKeys = Object.keys(sexByAge).length ? Object.keys(sexByAge) : ['Male','Female'];
	for (const s of sexKeys) {
		const rowAges = ageCols.map(a => (sexByAge[s] && sexByAge[s][a]) ? sexByAge[s][a] : 0);
		const total = rowAges.reduce((s,v)=>s+Number(v),0) || (data.sex && (data.sex[s] || data.sex[s.toLowerCase()]) ) || 0;
		rows.push([s.toUpperCase(), ...rowAges, total]);
	}
	rows.push([]);

	const ageCounts = ageCols.map(a => (data.ages && data.ages[a]) ? data.ages[a] : 0);
	rows.push(['AGE', ...ageCounts, ageCounts.reduce((s,v)=>s+Number(v),0)]);
	rows.push([]);

	rows.push(['CIVIL STATUS', ...ageCols.map(()=>''), '']);
	const civilByAge = data.civil_by_age || {};
	const csKeys = Object.keys(civilByAge).length ? Object.keys(civilByAge) : Object.keys(data.civil_status || {});
	if (csKeys.length === 0) rows.push(['No civil status data', ...ageCols.map(()=>''), '']);
	for (const k of csKeys) {
		const rowAges = ageCols.map(a => (civilByAge[k] && civilByAge[k][a]) ? civilByAge[k][a] : 0);
		const total = rowAges.reduce((s,v)=>s+Number(v),0) || (data.civil_status && (data.civil_status[k] ?? 0));
		rows.push([k.toUpperCase(), ...rowAges, total]);
	}
	rows.push([]);

	rows.push(['EDUCATION', ...ageCols.map(()=>''), '']);
	const eduByAge = data.education_by_age || {};
	const eduKeys = Object.keys(eduByAge).length ? Object.keys(eduByAge) : Object.keys(data.education || {});
	if (eduKeys.length === 0) rows.push(['No education data', ...ageCols.map(()=>''), '']);
	for (const k of eduKeys) {
		const rowAges = ageCols.map(a => (eduByAge[k] && eduByAge[k][a]) ? eduByAge[k][a] : 0);
		const total = rowAges.reduce((s,v)=>s+Number(v),0) || (data.education && (data.education[k] ?? 0));
		rows.push([k.toUpperCase(), ...rowAges, total]);
	}
	rows.push([]);

	rows.push(['SPECIAL COUNTS', ...ageCols.map(()=>''), '']);
	for (const [label, value] of getSpecialCountEntries(data)) {
		rows.push([label, ...ageCols.map(()=>''), value]);
	}

	return { ageCols, rows };
}

function addCount(target, key, value) {
	const normalizedKey = String(key || 'Unknown');
	target[normalizedKey] = (target[normalizedKey] || 0) + Number(value || 0);
}

function mergeNestedCounts(target, source) {
	if (!source || typeof source !== 'object') return;
	Object.entries(source).forEach(([group, ageCounts]) => {
		if (!target[group]) target[group] = {};
		Object.entries(ageCounts || {}).forEach(([age, value]) => {
			addCount(target[group], age, value);
		});
	});
}

function buildOverallBarangaySummary(summaries) {
	const overall = {
		barangay_id: 'manolo-fortich',
		barangay_name: 'Manolo Fortich',
		total: 0,
		sex: {},
		sex_by_age: {},
		ages: {},
		civil_status: {},
		civil_by_age: {},
		education: {},
		education_by_age: {},
		isy: 0,
		isy_male: 0,
		isy_female: 0,
		pwd: 0,
		pwd_male: 0,
		pwd_female: 0,
		fourps: 0,
		fourps_male: 0,
		fourps_female: 0,
		working: 0,
		working_male: 0,
		working_female: 0,
		unemployed: 0,
		unemployed_male: 0,
		unemployed_female: 0,
		ip: 0,
		ip_male: 0,
		ip_female: 0,
		muslim: 0,
		muslim_male: 0,
		muslim_female: 0,
		osy: 0,
		osy_male: 0,
		osy_female: 0
	};

	const numericFields = [
		'total',
		'isy', 'isy_male', 'isy_female',
		'pwd', 'pwd_male', 'pwd_female',
		'fourps', 'fourps_male', 'fourps_female',
		'working', 'working_male', 'working_female',
		'unemployed', 'unemployed_male', 'unemployed_female',
		'ip', 'ip_male', 'ip_female',
		'muslim', 'muslim_male', 'muslim_female',
		'osy', 'osy_male', 'osy_female'
	];

	(summaries || []).forEach(summary => {
		numericFields.forEach(field => {
			overall[field] += Number(summary?.[field] || 0);
		});

		Object.entries(summary?.sex || {}).forEach(([key, value]) => addCount(overall.sex, key, value));
		Object.entries(summary?.ages || {}).forEach(([key, value]) => addCount(overall.ages, key, value));
		Object.entries(summary?.civil_status || {}).forEach(([key, value]) => addCount(overall.civil_status, key, value));
		Object.entries(summary?.education || {}).forEach(([key, value]) => addCount(overall.education, key, value));
		mergeNestedCounts(overall.sex_by_age, summary?.sex_by_age);
		mergeNestedCounts(overall.civil_by_age, summary?.civil_by_age);
		mergeNestedCounts(overall.education_by_age, summary?.education_by_age);
	});

	return overall;
}

document.addEventListener("DOMContentLoaded", async () => {
	const path = window.location.pathname || '';
	const onLoginPage = path.endsWith('/login/') || path.endsWith('login.html') || path === '/login' || path === '/login/';
	const onRegisterPage = path.endsWith('/register/') || path.endsWith('register.html') || path === '/register' || path === '/register/';
	const onAuthPage = onLoginPage || onRegisterPage;
	const hasAdminActivitySection = !!document.getElementById('admin-account-section');

	initAdminBarangayDropdown();
	initYouthBarangayDropdown();
	initYouthSortDropdown();
	initTransferConfirmModal();
	initDeleteConfirmModal();
	renderPreferencePopupGroup('sports-preference-options', 'sport-pref', SPORT_PREFERENCE_OPTIONS);
	renderPreferencePopupGroup('talent-preference-options', 'talent-pref', TALENT_PREFERENCE_OPTIONS);
	renderOrganizationJoinedOptions();
	initPreferencePopupDropdown(
		'sports-preference-wrap',
		'sports-preference-trigger',
		'sports-preference-options',
		'sport-pref',
		SPORT_PREFERENCE_OPTIONS,
		'sports-preference-label',
		'Select sports'
	);
	initPreferencePopupDropdown(
		'talent-preference-wrap',
		'talent-preference-trigger',
		'talent-preference-options',
		'talent-pref',
		TALENT_PREFERENCE_OPTIONS,
		'talent-preference-label',
		'Select talents'
	);
	initPreferencePopupDropdown(
		'organizations-joined-wrap',
		'organizations-joined-trigger',
		'organizations-joined-options',
		'organization-joined',
		ORGANIZATION_JOINED_OPTIONS,
		'organizations-joined-label',
		'Select organizations'
	);

	if (onAuthPage) {
		return;
	}

	const logged = await checkUserStatus();
	if (!logged) {
		window.location.href = '/login/';
		return;
	}

	if (CURRENT_USER && CURRENT_USER.is_admin && hasAdminActivitySection) {
		loadAdminAccountBarangays().catch(err => console.warn('Could not load admin barangays:', err));
		fetchAdminAccountActivity();
		if (ADMIN_ACTIVITY_REFRESH) clearInterval(ADMIN_ACTIVITY_REFRESH);
		ADMIN_ACTIVITY_REFRESH = setInterval(fetchAdminAccountActivity, 30000);
	} else if (ADMIN_ACTIVITY_REFRESH) {
		clearInterval(ADMIN_ACTIVITY_REFRESH);
		ADMIN_ACTIVITY_REFRESH = null;
	}

	if (document.getElementById('barangay-grid') || document.getElementById('youth-data')) {
		fetchBarangays();
		fetchTransferBarangays().catch(err => console.warn('Could not load transfer barangays:', err));
		fetchYouths();
		startYouthDataAutoRefresh();
	}
	updateTabState();
	attachAutoToggles(); 
	updateBirthdateEligibilityState();
	document.querySelectorAll('.btn-next').forEach(btn => {
		btn.addEventListener('click', (ev) => {
			const tgt = btn.getAttribute('data-target');
			if (tgt) nextTab(tgt);
		});
	});
	document.querySelectorAll('.btn-prev').forEach(btn => {
		btn.addEventListener('click', (ev) => {
			const tgt = btn.getAttribute('data-target');
			if (tgt) prevTab(tgt);
		});
	});
});

document.addEventListener('visibilitychange', () => {
	if (!isLoggedIn || document.hidden) return;
	fetchYouths();
});

window.addEventListener('focus', () => {
	if (!isLoggedIn) return;
	fetchYouths();
});

window.addEventListener('storage', (event) => {
	if (event.key !== 'lydo-youth-transfer' || !isLoggedIn) return;
	fetchYouths();
});

function attachAutoToggles() {
	const ids = ['disability_type','specific_needs_condition','scholarship_program','kk_assembly_times','kk_assembly_no_reason','number_of_children', 'tribe_name', 'muslim_group'];
	ids.forEach(id => {
		const el = document.getElementById(id);
		if (!el) return;
		el.addEventListener('input', updateAutoTogglesState);
		el.addEventListener('change', updateAutoTogglesState);
	});

	const modal = document.getElementById('youthModal');
	if (modal) {
		modal.addEventListener('shown.bs.modal', () => setTimeout(updateAutoTogglesState, 10));
	}

	const form = document.getElementById('youthForm');
	if (form) {
		const persistDraftHandler = () => {
			setTimeout(() => persistYouthModalDraft(), 0);
		};
		form.addEventListener('input', persistDraftHandler);
		form.addEventListener('change', persistDraftHandler);
	}

	const birthdateInput = document.getElementById('birthdate');
	if (birthdateInput) {
		const oldestAllowedValue = getOldestAllowedBirthdateValue();
		if (oldestAllowedValue) birthdateInput.min = oldestAllowedValue;
		birthdateInput.addEventListener('change', updateBirthdateEligibilityState);
		birthdateInput.addEventListener('blur', updateBirthdateEligibilityState);
	}

	['is_non_voter', 'registered_voter_sk', 'registered_voter_national', 'voted_last_sk'].forEach(id => {
		const el = document.getElementById(id);
		if (!el) return;
		el.addEventListener('change', () => syncNonVoterCheckbox(id));
	});
}

function updateAutoTogglesState() {
	const get = id => document.getElementById(id);
	const disability = get('disability_type');
	const specific = get('specific_needs_condition');
	const scholarProg = get('scholarship_program');
	const kkTimes = get('kk_assembly_times');
	const kkReason = get('kk_assembly_no_reason');
	const numChildren = get('number_of_children');

	if (disability) {
	}

	if (specific) {
		const specChk = get('has_specific_needs');
		if (specChk) specChk.checked = String(specific.value || '').trim() !== '';
	}

	if (scholarProg) {
		const schChk = get('is_scholar');
		if (schChk) schChk.checked = String(scholarProg.value || '').trim() !== '';
	}

	if (kkTimes || kkReason) {
		const kkChk = get('attended_kk_assembly');
		if (kkChk) {
			const times = parseInt(kkTimes?.value || 0) || 0;
			if (times > 0) kkChk.checked = true;
			else if (kkReason && String(kkReason.value || '').trim() !== '') kkChk.checked = false;
			else kkChk.checked = false;
		}
	}

	if (numChildren) {
		const fourChk = get('is_4ps');
		const n = parseInt(numChildren.value || 0) || 0;
		if (fourChk) fourChk.checked = n > 0;
	}

	const tribe = get('tribe_name');
	if (tribe) {
		const ipChk = get('is_ip');
		if (ipChk) ipChk.checked = String(tribe.value || '').trim() !== '';
	}

	const mg = get('muslim_group');
	if (mg) {
		const muslimChk = get('is_muslim');
		if (muslimChk) muslimChk.checked = String(mg.value || '').trim() !== '';
	}
}

// Load barangays, then refresh dashboard tiles and dropdowns.
function fetchBarangays() {
	fetch('/api/barangays/', { cache: 'no-store' }).then(res => res.json()).then(data => {
		if (Array.isArray(data) && data.length) {
			BARANGAYS = data;
		}
		renderDashboard();
		populateBarangayDropdown();
	}).catch(err => {
		console.warn('Could not fetch barangays, falling back to empty list', err);
		renderDashboard();
		populateBarangayDropdown();
	});
}

function getYouthById(id) {
	return allYouths.find(y => y.id == id);
}

// Render the dashboard summary grid based on loaded youth data.
function renderDashboard() {
	const grid = document.getElementById('barangay-grid');
	const pageSub = document.getElementById('dashboard-page-sub');
	const counts = {};
	if (Array.isArray(allYouths)) {
		allYouths.forEach(y => {
			const id = String(y.barangay_id);
			counts[id] = (counts[id] || 0) + 1;
		});
	}

	if (pageSub) {
		if (CURRENT_USER && !CURRENT_USER.is_admin && CURRENT_USER.barangay_name) {
			pageSub.textContent = `Youth records for ${CURRENT_USER.barangay_name}, Manolo Fortich, Bukidnon`;
		} else {
			pageSub.textContent = 'Youth records across 22 barangays of Manolo Fortich, Bukidnon';
		}
	}

	const PALETTE = ['#2351a6','#059669','#7c3aed','#d97706','#0284c7','#e11d48','#15803d','#9333ea','#c2410c','#0891b2','#1d4ed8','#b45309'];

	grid.innerHTML = BARANGAYS.map((b, idx) => {
		const cnt        = counts[String(b.id)] || 0;
		const color      = PALETTE[idx % PALETTE.length];
		const countLabel = cnt === 1 ? '1 youth' : cnt + ' youth';
		const num        = String(idx + 1).padStart(2, '0');
		const nameLabel  = escapeHtml(b.name);
		const nameArg    = escapeHtml(JSON.stringify(String(b.name || '')));
		return `
		<div class="barangay-card" onclick="openBarangay(${Number(b.id)}, ${nameArg})">
			<div class="bc-banner" style="background:${color};">
				<div class="bc-orb bc-orb-a"></div>
				<div class="bc-orb bc-orb-b"></div>
				<div class="bc-orb bc-orb-c"></div>
				<span class="bc-num">${num}</span>
			</div>
			<div class="bc-body">
				<div class="bc-name">${nameLabel}</div>
				<div class="bc-loc">
					<svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
					Manolo Fortich, Bukidnon
				</div>
				<div class="bc-footer">
					<span class="bc-count" style="color:${color};background:${color}14;border:1px solid ${color}28;">
						<svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
						${countLabel}
					</span>
					<span class="bc-arrow" style="color:${color};">
						<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
					</span>
				</div>
			</div>
		</div>
		`}).join('');
}

function filterBarangayGrid(term) {
    term = (term || '').toLowerCase();
    const grid = document.getElementById('barangay-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.barangay-card'));
    cards.forEach((card, idx) => {
        const name = (BARANGAYS[idx] && BARANGAYS[idx].name || '').toLowerCase();
        card.style.display = name.includes(term) ? '' : 'none';
    });
}

async function fetchBarangaySummary(bid) {
	const res = await fetch(`/api/barangay_summary/${bid}/?_=${Date.now()}`, { cache: 'no-store' });
	if (!res.ok) throw new Error('Failed to fetch summary: ' + res.status);
	return res.json();
}

function viewBarangaySummary() {
	if (!currentBarangayId) return alert('Open a barangay first');
	fetchBarangaySummary(currentBarangayId).then(data => {
		const loadedSummary = buildBarangaySummaryFromLoadedYouths(currentBarangayId);
		if (loadedSummary && Number(loadedSummary.total || 0) !== Number(data.total || 0)) {
			data = { ...data, ...loadedSummary };
		}
		const content = document.getElementById('summary-content');
		const specialCountItems = getSpecialCountEntries(data)
			.map(([label, value]) => `
				<div style="min-width:170px;flex:1 1 180px;padding:12px 14px;border-radius:14px;border:1px solid var(--border);background:linear-gradient(180deg,#ffffff 0%, #f8fbff 100%);box-shadow:0 10px 20px rgba(15,37,88,.05);">
					<div style="font-size:.72rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--text-muted);line-height:1.35;">${label}</div>
					<div style="margin-top:6px;font-size:1.1rem;font-weight:800;color:var(--navy);">${value}</div>
				</div>
			`)
			.join('');
		const buildMetricRows = (obj, sortNumeric = false) => {
			if (!obj || typeof obj !== 'object' || Object.keys(obj).length === 0) {
				return `
					<div style="padding:12px 14px;border-radius:14px;background:#f8fbff;border:1px dashed var(--border);color:var(--text-muted);font-size:.9rem;">
						No data available
					</div>
				`;
			}
			const keys = Object.keys(obj);
			if (sortNumeric) keys.sort((a,b)=>Number(a)-Number(b)); else keys.sort();
			return keys.map(k => `
				<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 12px;border-radius:12px;background:linear-gradient(180deg,#ffffff 0%, #f8fbff 100%);border:1px solid #d9e4fb;">
					<span style="font-size:.95rem;color:var(--navy);font-weight:600;">${k}</span>
					<span style="display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:34px;padding:0 10px;border-radius:999px;background:#edf4ff;color:#1f4ea3;font-size:.95rem;font-weight:800;">${obj[k]}</span>
				</div>
			`).join('');
		};
		const buildMetricCard = (title, rows, accent) => `
			<div style="padding:16px;border-radius:18px;border:1px solid ${accent}26;background:linear-gradient(180deg,#ffffff 0%, #f8fbff 100%);box-shadow:0 14px 30px rgba(15,37,88,.06);height:100%;">
				<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;">
					<h6 style="margin:0;font-size:1rem;font-weight:800;color:var(--navy);">${title}</h6>
					<span style="width:10px;height:10px;border-radius:999px;background:${accent};box-shadow:0 0 0 6px ${accent}18;"></span>
				</div>
				<div style="display:grid;gap:10px;">
					${rows}
				</div>
			</div>
		`;

		content.innerHTML = `
			<div style="display:grid;gap:18px;">
				<div style="padding:18px 18px 16px;border-radius:20px;background:linear-gradient(135deg,#edf4ff 0%, #ffffff 100%);border:1px solid #d8e5ff;box-shadow:0 16px 34px rgba(15,37,88,.07);">
					<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
						<div>
							<h5 style="margin:0 0 4px;font-size:1.65rem;font-weight:900;color:var(--navy);">${data.barangay_name} Summary</h5>
							<div style="font-size:.9rem;color:var(--text-muted);">Quick demographic overview for this barangay youth list.</div>
						</div>
						<div style="display:inline-flex;flex-direction:column;align-items:flex-end;padding:12px 14px;border-radius:16px;background:#ffffff;border:1px solid #d9e4fb;min-width:130px;">
							<span style="font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);font-weight:800;">Total Youth</span>
							<span style="margin-top:4px;font-size:1.65rem;line-height:1;font-weight:900;color:#1f4ea3;">${data.total}</span>
						</div>
					</div>
				</div>

				<div class="row g-3">
					<div class="col-md-6">
						${buildMetricCard('Sex', buildMetricRows(data.sex), '#1f4ea3')}
					</div>
					<div class="col-md-6">
						${buildMetricCard('Ages', buildMetricRows(data.ages, true), '#0f8a5f')}
					</div>
					<div class="col-md-6">
						${buildMetricCard('Education', buildMetricRows(data.education), '#d97706')}
					</div>
					<div class="col-md-6">
						${buildMetricCard('Civil Status', buildMetricRows(data.civil_status), '#7c3aed')}
					</div>
				</div>

				<div>
					<p style="margin:0 0 12px;font-size:1rem;font-weight:800;color:var(--navy);">Special counts:</p>
					<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:stretch;">
						${specialCountItems}
					</div>
				</div>
			</div>
		`;
		new bootstrap.Modal(document.getElementById('summaryModal')).show();
	}).catch(err => alert(err.message));
}

function downloadBarangaySummaryCSV() {
	if (!currentBarangayId) return alert('Open a barangay first');
	fetchBarangaySummary(currentBarangayId).then(data => {
		const { rows } = buildSummaryRows(data);
		const csv = rows.map(r => r.map(cell => '"' + (cell ?? '') + '"').join(',')).join('\n');
		const blob = new Blob([csv], {type: 'text/csv'});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a'); a.href = url;
		a.download = `${(data.barangay_name||'Barangay').replace(/\s+/g,'_')}_demographics_summary.csv`;
		document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
	}).catch(err => alert(err.message));
}

function getSummaryPdfLibrary() {
	const jsPDF = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);
	if (!jsPDF) {
		alert('PDF library not loaded');
		return null;
	}
	return jsPDF;
}

function drawBarangaySummaryPdfPage(doc, data, options = {}) {
	const { ageCols, rows } = buildSummaryRows(data);
	const head = ['DEMOGRAPHICS', ...ageCols, 'TOTAL'];
	const body = rows.slice(1);
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	let startY = 22;

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(5.8);
	doc.text('Republic of the Philippines', pageWidth / 2, startY, { align: 'center' }); startY += 7;
	doc.text('Province of Bukidnon', pageWidth / 2, startY, { align: 'center' }); startY += 7;
	doc.text('Municipality of Manolo Fortich', pageWidth / 2, startY, { align: 'center' }); startY += 15;
	doc.setFontSize(10.5);
	doc.text((options.reportTitle || data.barangay_name || 'BARANGAY').toUpperCase(), pageWidth / 2, startY, { align: 'center' }); startY += 11;
	doc.setFontSize(7.2);
	doc.text('Office of The LGU Youth & Sports', pageWidth / 2, startY, { align: 'center' }); startY += 8;
	doc.setFontSize(7.8);
	doc.text('Summary of LGU Youth & Sports System', pageWidth / 2, startY, { align: 'center' }); startY += 10;

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(5.8);
	const para = 'Section 5(b) of the Implementing Rules and Regulations (IRR) of RA No. 10742 states that the Katipunan ng Kabataan (KK) shall serve as the highest policymaking body to decide on matters affecting the youth in the barangay.';
	const split = doc.splitTextToSize(para, pageWidth - 48);
	doc.text(split, 24, startY);
	startY += split.length * 6 + 5;

	const headerColor = cssVarRgb('--pdf-header', [15, 37, 88]);
	const rowColor = cssVarRgb('--pdf-row', [238, 242, 255]);
	const firstColColor = cssVarRgb('--pdf-firstcol', [26, 58, 124]);
	const borderColor = cssVarRgb('--pdf-border', [198, 208, 232]);
	const totalColumnIndex = head.length - 1;

	doc.autoTable({
		startY,
		head: [head],
		body,
		theme: 'grid',
		margin: { left: 24, right: 24 },
		tableWidth: 'auto',
		headStyles: {
			fillColor: headerColor,
			textColor: 255,
			halign: 'center',
			fontStyle: 'bold',
			lineColor: borderColor,
			lineWidth: 0.25
		},
		styles: {
			font: 'helvetica',
			fontSize: 5.7,
			cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
			textColor: 38,
			valign: 'middle',
			lineColor: borderColor,
			lineWidth: 0.25,
			minCellHeight: 9
		},
		alternateRowStyles: { fillColor: rowColor },
		columnStyles: {
			0: { cellWidth: 142, halign: 'left' },
			[totalColumnIndex]: { cellWidth: 42, halign: 'center' }
		},
		didParseCell: function (dataArg) {
			const firstCell = String(dataArg.row.raw?.[0] || '').toUpperCase();
			const isSectionRow = [
				'SEX ASSIGNED BY BIRTH',
				'CIVIL STATUS',
				'EDUCATION',
				'SPECIAL COUNTS'
			].includes(firstCell);

			if (dataArg.cell.section === 'body' && dataArg.column.index === 0) {
				dataArg.cell.styles.fontStyle = 'bold';
				dataArg.cell.styles.textColor = firstColColor;
			}
			if (dataArg.cell.section === 'body' && isSectionRow) {
				dataArg.cell.styles.fillColor = [232, 238, 252];
				dataArg.cell.styles.fontStyle = 'bold';
				if (dataArg.column.index > 0) dataArg.cell.text = [''];
			}
		}
	});

	if (options.footerText || options.pageLabel) {
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(6.5);
		doc.setTextColor(95, 113, 153);
		const footerParts = [options.footerText, options.pageLabel].filter(Boolean);
		doc.text(footerParts.join(' | '), pageWidth / 2, pageHeight - 14, { align: 'center' });
		doc.setTextColor(38);
	}
}

function drawManoloFortichReportCoverPage(doc, summaries, overall) {
	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();
	let y = 34;

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(7);
	doc.text('Republic of the Philippines', pageWidth / 2, y, { align: 'center' }); y += 9;
	doc.text('Province of Bukidnon', pageWidth / 2, y, { align: 'center' }); y += 9;
	doc.text('Municipality of Manolo Fortich', pageWidth / 2, y, { align: 'center' }); y += 18;
	doc.setFontSize(15);
	doc.text('MANOLO FORTICH OVERALL YOUTH REPORT', pageWidth / 2, y, { align: 'center' }); y += 13;
	doc.setFontSize(8);
	doc.text('Compiled report from all 22 barangays under the LGU Youth & Sports System', pageWidth / 2, y, { align: 'center' }); y += 22;

	const barangayCount = summaries.length;
	const totalYouth = Number(overall.total || 0);
	const totalMale = Number(overall.sex?.Male || overall.sex?.male || 0);
	const totalFemale = Number(overall.sex?.Female || overall.sex?.female || 0);
	const cards = [
		['Barangays Covered', barangayCount],
		['Total Youth', totalYouth],
		['Male', totalMale],
		['Female', totalFemale],
		['ISY', overall.isy || 0],
		['OSY', overall.osy || 0],
		['IP', overall.ip || 0],
		['PWD', overall.pwd || 0],
		['MU', overall.muslim || 0]
	];
	const cardWidth = (pageWidth - 72) / 3;
	cards.forEach((card, index) => {
		const col = index % 3;
		const row = Math.floor(index / 3);
		const x = 24 + col * cardWidth;
		const cardY = y + row * 48;
		doc.setFillColor(238, 244, 255);
		doc.setDrawColor(198, 208, 232);
		doc.roundedRect(x, cardY, cardWidth - 10, 36, 5, 5, 'FD');
		doc.setFont('helvetica', 'normal');
		doc.setFontSize(7);
		doc.setTextColor(95, 113, 153);
		doc.text(card[0], x + 10, cardY + 13);
		doc.setFont('helvetica', 'bold');
		doc.setFontSize(13);
		doc.setTextColor(15, 37, 88);
		doc.text(String(card[1]), x + 10, cardY + 28);
	});
	y += Math.ceil(cards.length / 3) * 48 + 8;

	doc.setTextColor(38);
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(9);
	doc.text('Barangay Report Index', 24, y);

	const body = summaries.map((summary, index) => [
		String(index + 1).padStart(2, '0'),
		summary.barangay_name || 'Barangay',
		summary.total || 0,
		summary.isy || 0,
		summary.osy || 0,
		summary.ip || 0,
		summary.pwd || 0,
		summary.muslim || 0,
		summary.working || 0,
		summary.unemployed || 0
	]);

	doc.autoTable({
		startY: y + 8,
		head: [['#', 'Barangay', 'Total Youth', 'ISY', 'OSY', 'IP', 'PWD', 'MU', 'Working', 'Unemployed']],
		body,
		theme: 'grid',
		margin: { left: 24, right: 24 },
		headStyles: {
			fillColor: cssVarRgb('--pdf-header', [15, 37, 88]),
			textColor: 255,
			fontStyle: 'bold',
			halign: 'center'
		},
		styles: {
			font: 'helvetica',
			fontSize: 6.5,
			cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
			lineColor: cssVarRgb('--pdf-border', [198, 208, 232]),
			lineWidth: 0.25
		},
		alternateRowStyles: { fillColor: cssVarRgb('--pdf-row', [238, 242, 255]) },
		columnStyles: {
			0: { cellWidth: 34, halign: 'center' },
			1: { cellWidth: 156 },
			2: { halign: 'center' },
			3: { halign: 'center' },
			4: { halign: 'center' },
			5: { halign: 'center' },
			6: { halign: 'center' },
			7: { halign: 'center' },
			8: { halign: 'center' },
			9: { halign: 'center' }
		}
	});

	doc.setFont('helvetica', 'normal');
	doc.setFontSize(6.5);
	doc.setTextColor(95, 113, 153);
	doc.text('Overall report page plus individual barangay report pages are included in this PDF.', pageWidth / 2, pageHeight - 14, { align: 'center' });
	doc.setTextColor(38);
}

function downloadBarangaySummaryPDF() {
	if (!currentBarangayId) return alert('Open a barangay first');
	fetchBarangaySummary(currentBarangayId).then(data => {
		try {
			const jsPDF = getSummaryPdfLibrary();
			if (!jsPDF) return;

			const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
			if (typeof doc.autoTable !== 'function') return alert('jsPDF AutoTable plugin not loaded');
			drawBarangaySummaryPdfPage(doc, data);

			const filename = `${(data.barangay_name || 'Barangay').replace(/\s+/g,'_')}_demographics_summary.pdf`;
			doc.save(filename);
		} catch (err) {
			console.error('PDF generation error:', err);
			alert('Failed to generate PDF: ' + (err.message || err));
		}
	}).catch(err => alert(err.message));
}

async function downloadAllBarangaySummaryPDF() {
	const button = document.querySelector('.btn-report-download');
	const originalText = button ? button.innerHTML : '';
	try {
		if (!CURRENT_USER || !CURRENT_USER.is_admin) {
			alert('Only the system admin can download the merged Manolo Fortich barangay report.');
			return;
		}

		if (button) {
			button.disabled = true;
			button.innerHTML = 'Preparing PDF...';
		}

		const jsPDF = getSummaryPdfLibrary();
		if (!jsPDF) return;

		const barangayResponse = await fetch(`/api/barangays/all/?_=${Date.now()}`, { cache: 'no-store' });
		if (!barangayResponse.ok) throw new Error('Failed to load the 22 barangays.');
		const barangays = await barangayResponse.json();
		if (!Array.isArray(barangays) || !barangays.length) throw new Error('No barangays are available for the report.');

		const summaries = await Promise.all(barangays.map(async barangay => {
			const summary = await fetchBarangaySummary(barangay.id);
			return { ...summary, barangay_name: summary.barangay_name || barangay.name };
		}));
		const overallSummary = buildOverallBarangaySummary(summaries);

		const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
		if (typeof doc.autoTable !== 'function') return alert('jsPDF AutoTable plugin not loaded');

		drawManoloFortichReportCoverPage(doc, summaries, overallSummary);
		doc.addPage('letter', 'landscape');
		drawBarangaySummaryPdfPage(doc, overallSummary, {
			reportTitle: 'Manolo Fortich Overall Report',
			footerText: `Compiled from ${summaries.length} barangay reports`,
			pageLabel: 'Municipal Summary'
		});

		summaries.forEach((summary, index) => {
			doc.addPage('letter', 'landscape');
			drawBarangaySummaryPdfPage(doc, summary, {
				reportTitle: `${summary.barangay_name} Barangay Report`,
				footerText: 'Included in the Manolo Fortich overall report',
				pageLabel: `Barangay Report ${index + 1} of ${summaries.length}`
			});
		});

		doc.save('Manolo_Fortich_22_Barangay_Profiling_Summary.pdf');
	} catch (err) {
		console.error('Merged PDF generation error:', err);
		alert('Failed to generate merged PDF: ' + (err.message || err));
	} finally {
		if (button) {
			button.disabled = false;
			button.innerHTML = originalText;
		}
	}
}

window.downloadBlankYouthForm = function downloadBlankYouthForm() {
	if (!currentBarangayId) return alert('Open a barangay first');
	window.location.href = `/api/forms/youth-profile/${currentBarangayId}/?_=${Date.now()}`;
};

window.downloadBlankYouthFormDoc = function downloadBlankYouthFormDoc() {
	if (!currentBarangayId) return alert('Open a barangay first');
	window.location.href = `/api/forms/youth-profile/${currentBarangayId}/doc/?_=${Date.now()}`;
};

window.downloadAllBlankYouthForms = function downloadAllBlankYouthForms() {
	window.location.href = `/api/forms/youth-profile-pack/?_=${Date.now()}`;
};

window.downloadAllBlankYouthFormsDoc = function downloadAllBlankYouthFormsDoc() {
	window.location.href = `/api/forms/youth-profile-pack/doc/?_=${Date.now()}`;
};

function setYouthBarangaySelection(selectedId = '', selectedLabel = '') {
	const hiddenInput = $id('barangay_id');
	const label = $id('youth-barangay-label');
	const panel = $id('youth-barangay-panel');
	if (!hiddenInput || !label || !panel) return;

	const normalizedSelected = String(selectedId || '');
	const selectedOption = normalizedSelected
		? panel.querySelector(`.register-select-option[data-value="${normalizedSelected}"]`)
		: null;
	hiddenInput.value = normalizedSelected;
	label.textContent = selectedLabel || selectedOption?.dataset.label || 'Select barangay';
	panel.querySelectorAll('.register-select-option').forEach(item => {
		item.classList.toggle('selected', item.dataset.value === normalizedSelected);
	});
}

function populateBarangayDropdown(options = BARANGAYS, selectedId = '') {
	const panel = $id('youth-barangay-panel');
	if (!panel) return;
	panel.innerHTML = options.map(barangay => `
		<button type="button" class="register-select-option" data-value="${barangay.id}" data-label="${barangay.name}" role="option">
			${barangay.name}
		</button>
	`).join('');
	setYouthBarangaySelection(selectedId);
}

function initYouthBarangayDropdown() {
	const wrap = $id('youth-barangay-wrap');
	const trigger = $id('youth-barangay-trigger');
	const panel = $id('youth-barangay-panel');
	if (!wrap || !trigger || !panel) return;

	const setOpen = (isOpen) => {
		if (trigger.disabled && isOpen) return;
		wrap.classList.toggle('open', isOpen);
		trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
	};

	trigger.addEventListener('click', () => {
		if (trigger.disabled) return;
		setOpen(!wrap.classList.contains('open'));
	});

	panel.addEventListener('click', (event) => {
		const option = event.target.closest('.register-select-option');
		if (!option) return;
		setYouthBarangaySelection(option.dataset.value || '', option.dataset.label || '');
		setOpen(false);
	});

	document.addEventListener('click', (event) => {
		if (!wrap.contains(event.target)) setOpen(false);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') setOpen(false);
	});
}

function openBarangay(id, name) {
	currentBarangayId = id;
	startListViewAutoRefresh();
	document.getElementById('current-barangay-title').innerText = `${name} Youth Records`;
	document.getElementById('dashboard-view').style.display = 'none';
	document.getElementById('list-view').style.display = 'block';
	const searchInput = document.getElementById('searchInput');
	const searchFilter = document.getElementById('searchFilter');
	if (searchInput) searchInput.value = '';
	if (searchFilter) searchFilter.value = 'all';
	updateYouthSortDropdown();
	updateYouthSearchPlaceholder();
	filterTable();

	fetchBarangaySummary(currentBarangayId).then(data => {
		const youths = Array.isArray(allYouths) ? allYouths.filter(y => String(y.barangay_id) === String(currentBarangayId)) : [];
		const total = (data && data.total != null) ? data.total : youths.length;
		const inSchool = youths.filter(y => toBool(y.is_in_school) || (y.full_data && toBool(y.full_data.is_in_school))).length;
		const osy = (data && data.osy != null) ? data.osy : youths.filter(y => toBool(y.is_osy) || (y.full_data && toBool(y.full_data.is_osy))).length;
		const registered = youths.filter(y => {
			const sk  = toBool(y.registered_voter_sk)  || (y.full_data && toBool(y.full_data.registered_voter_sk));
			const nat = toBool(y.registered_voter_national) || (y.full_data && toBool(y.full_data.registered_voter_national));
			return sk || nat;
		}).length;

		setStat('stat-total', total);
		setStat('stat-in-school', inSchool);
		setStat('stat-osy', osy);
		setStat('stat-registered', registered);
	}).catch(err => {
		console.warn('Failed fetching barangay summary for top stats:', err);
		renderTopStats();
	});
}

function showDashboard() {
	stopListViewAutoRefresh();
	currentBarangayId = null;
	document.getElementById('dashboard-view').style.display = 'block';
	document.getElementById('list-view').style.display = 'none';
}

function showAdminAccountSection() {
	window.location.href = '/account/';
}

// Verify the current session and hydrate CURRENT_USER.
function checkUserStatus() {
	return fetch('/api/user/').then(res => res.ok ? res.json() : null).then(data => {
		const userDisplay = document.getElementById('user-display');
		const usernameSpan = document.getElementById('username-span');
		const accountLabel = document.getElementById('account-label');
		const loginBtn = document.getElementById('login-btn');
		const logoutBtn = document.getElementById('logout-btn');
		const adminAccountSection = document.getElementById('admin-account-section');

		if (data && data.is_authenticated) {
			isLoggedIn = true;
			CURRENT_USER = data;
			if (userDisplay) userDisplay.style.display = 'block';
			if (usernameSpan) {
				usernameSpan.innerText = data.barangay_name && !data.is_admin
					? `${data.username} (${data.barangay_name})`
					: data.username;
			}
			if (accountLabel) accountLabel.innerText = data.is_admin ? 'Admin' : 'Account';
			if (loginBtn) loginBtn.style.display = 'none';
			if (logoutBtn) logoutBtn.style.display = 'block';
			document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'inline-block');
			document.querySelectorAll('.system-admin-only').forEach(el => el.style.display = data.is_admin ? '' : 'none');
			if (adminAccountSection) adminAccountSection.style.display = data.is_admin ? 'block' : 'none';
			return true;
		} else {
			isLoggedIn = false;
			CURRENT_USER = null;
			if (userDisplay) userDisplay.style.display = 'none';
			if (usernameSpan) usernameSpan.innerText = '';
			if (accountLabel) accountLabel.innerText = 'Account';
			if (loginBtn) loginBtn.style.display = 'inline-block';
			if (logoutBtn) logoutBtn.style.display = 'none';
			document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
			document.querySelectorAll('.system-admin-only').forEach(el => el.style.display = 'none');
			if (adminAccountSection) adminAccountSection.style.display = 'none';
			return false;
		}
	}).catch(err => {
		console.debug('checkUserStatus error:', err);
		isLoggedIn = false;
		CURRENT_USER = null;
		return false;
	});
}

function showLoginModal() { new bootstrap.Modal(document.getElementById('authModal')).show(); }

function showBarangayAccountNotice(options = {}) {
	const noticeEl = $id('barangay-account-notice');
	if (!noticeEl) return;
	const noticeTitle = $id('barangay-account-notice-title-text');
	const noticeLabel = $id('barangay-account-notice-label');
	const noticeName = $id('barangay-account-notice-name');
	const noticeMessage = $id('barangay-account-notice-message');
	if (noticeTitle) {
		noticeTitle.textContent = options.title || 'Account Not Yet Created';
	}
	if (noticeLabel) {
		noticeLabel.textContent = options.label || 'Barangay';
	}
	if (noticeName) {
		noticeName.textContent = options.barangayName || 'Selected barangay';
	}
	if (noticeMessage) {
		noticeMessage.textContent = options.message || "It looks like your barangay doesn't have an account yet. Please request account creation from the LGU Youth & Sports Officer.";
	}
	noticeEl.hidden = false;
	noticeEl.setAttribute('aria-hidden', 'false');
	document.body.style.overflow = 'hidden';
}

function showInvalidCredentialsNotice(username = '') {
	showBarangayAccountNotice({
		title: 'Invalid Credentials',
		label: 'Account',
		barangayName: username || 'Login details',
		message: 'Invalid credentials. Please check your login details or contact the LGU Youth & Sport Officer for a password or username reset.'
	});
}

function closeBarangayAccountNotice() {
	const noticeEl = $id('barangay-account-notice');
	if (!noticeEl) return;
	noticeEl.hidden = true;
	noticeEl.setAttribute('aria-hidden', 'true');
	document.body.style.overflow = '';
}

function handleAuth(e) {
	e.preventDefault();
	const loadingEl = document.getElementById('login-loading');
	const textEl    = document.getElementById('login-text');
	const submitBtn = document.getElementById('login-submit');
	const errorDiv  = document.getElementById('login-error');
	const errorMsg  = document.getElementById('login-error-msg');

	if (loadingEl) loadingEl.style.display = 'flex';
	if (textEl)    textEl.style.display    = 'none';
	if (submitBtn) submitBtn.disabled = true;
	if (errorDiv)  errorDiv.classList.remove('show');

	fetch('/api/login/', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			username: document.getElementById('auth-username').value,
			password: document.getElementById('auth-password').value
		})
	}).then(res => res.json()).then(data => {
		if (data.message) {
			window.location.href = '/';
		} else {
			if (data.error_code === 'barangay_account_missing') {
				closeBarangayAccountNotice();
				showBarangayAccountNotice({
					barangayName: data.barangay_name,
					message: data.error
				});
			} else if (data.error === 'Invalid credentials' || data.error_code === 'invalid_credentials') {
				closeBarangayAccountNotice();
				showInvalidCredentialsNotice((document.getElementById('auth-username')?.value || '').trim());
			} else if (errorDiv && errorMsg) {
				errorMsg.textContent = data.error || 'Invalid credentials. Please check your login details or contact the LGU Youth & Sport Officer for a password or username reset.';
				errorDiv.classList.add('show');
			} else { alert(data.error); }
			if (loadingEl) loadingEl.style.display = 'none';
			if (textEl)    textEl.style.display    = 'flex';
			if (submitBtn) submitBtn.disabled = false;
		}
	}).catch(err => {
		if (errorDiv && errorMsg) {
			errorMsg.textContent = 'Connection error. Please try again.';
			errorDiv.classList.add('show');
		} else { alert('Login failed: ' + (err.message || err)); }
		if (loadingEl) loadingEl.style.display = 'none';
		if (textEl)    textEl.style.display    = 'flex';
		if (submitBtn) submitBtn.disabled = false;
	});
}

function fetchTransferBarangays() {
	return fetch('/api/barangays/all/', { cache: 'no-store' }).then(res => res.json()).then(data => {
		if (Array.isArray(data) && data.length) {
			TRANSFER_BARANGAYS = data;
		}
		return TRANSFER_BARANGAYS;
	}).catch(err => {
		console.warn('Could not fetch full barangay list for transfers, falling back to scoped list', err);
		TRANSFER_BARANGAYS = Array.isArray(BARANGAYS) ? [...BARANGAYS] : [];
		return TRANSFER_BARANGAYS;
	});
}

function getTransferBarangayOptions() {
	return Array.isArray(TRANSFER_BARANGAYS) && TRANSFER_BARANGAYS.length
		? TRANSFER_BARANGAYS
		: BARANGAYS;
}

function handleRegister(e) {
	e.preventDefault();
	const loadingEl = document.getElementById('register-loading');
	const textEl = document.getElementById('register-text');
	const submitBtn = document.getElementById('register-submit');
	const errorDiv = document.getElementById('register-error');
	const errorMsg = document.getElementById('register-error-msg');

	const username = (document.getElementById('register-username')?.value || '').trim();
	const email = (document.getElementById('register-email')?.value || '').trim();
	const barangayId = document.getElementById('register-barangay')?.value || '';
	const password = document.getElementById('register-password')?.value || '';
	const confirmPassword = document.getElementById('register-confirm-password')?.value || '';

	if (errorDiv) errorDiv.classList.remove('show');

	if (!username || !email || !password || !barangayId) {
		if (errorDiv && errorMsg) {
			errorMsg.textContent = 'Username, email, password, and assigned barangay are required.';
			errorDiv.classList.add('show');
		}
		return;
	}

	if (password !== confirmPassword) {
		if (errorDiv && errorMsg) {
			errorMsg.textContent = 'Passwords do not match.';
			errorDiv.classList.add('show');
		}
		return;
	}

	if (loadingEl) loadingEl.style.display = 'flex';
	if (textEl) textEl.style.display = 'none';
	if (submitBtn) submitBtn.disabled = true;

	fetch('/api/register/', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			username: username,
			email: email,
			password: password,
			barangay_id: barangayId
		})
	}).then(res => res.json()).then(data => {
		if (data.message) {
			window.location.href = '/';
			return;
		}

		if (errorDiv && errorMsg) {
			errorMsg.textContent = data.error || 'Registration failed. Please try again.';
			errorDiv.classList.add('show');
		} else {
			alert(data.error || 'Registration failed.');
		}

		if (loadingEl) loadingEl.style.display = 'none';
		if (textEl) textEl.style.display = 'flex';
		if (submitBtn) submitBtn.disabled = false;
	}).catch(err => {
		if (errorDiv && errorMsg) {
			errorMsg.textContent = 'Connection error. Please try again.';
			errorDiv.classList.add('show');
		} else {
			alert('Registration failed: ' + (err.message || err));
		}

		if (loadingEl) loadingEl.style.display = 'none';
		if (textEl) textEl.style.display = 'flex';
		if (submitBtn) submitBtn.disabled = false;
	});
}

function logout() { fetch('/api/logout/').then(() => window.location.reload()); }

// Fetch youth records for the current barangay and refresh the UI.
function fetchYouths() {
	fetch(`/api/youth/?_=${Date.now()}`, { cache: 'no-store' }).then(res => res.json()).then(data => {
		allYouths = data;
		renderTopStats();
		renderDashboard();
		if(currentBarangayId) filterTable();
	});
}

function stopYouthDataAutoRefresh() {
	if (YOUTH_DATA_REFRESH) {
		clearInterval(YOUTH_DATA_REFRESH);
		YOUTH_DATA_REFRESH = null;
	}
}

function startYouthDataAutoRefresh() {
	stopYouthDataAutoRefresh();
	if (!isLoggedIn) return;
	if (!document.getElementById('barangay-grid') && !document.getElementById('youth-data')) return;

	YOUTH_DATA_REFRESH = setInterval(() => {
		if (document.hidden) return;
		fetchYouths();
	}, 3000);
}

function stopListViewAutoRefresh() {
	if (LIST_VIEW_REFRESH) {
		clearInterval(LIST_VIEW_REFRESH);
		LIST_VIEW_REFRESH = null;
	}
}

function startListViewAutoRefresh() {
	stopListViewAutoRefresh();
	if (!isLoggedIn || !currentBarangayId) return;
	LIST_VIEW_REFRESH = setInterval(() => {
		if (document.hidden) return;
		fetchYouths();
	}, 2000);
}

function notifyYouthTransfer(targetBarangayId, targetBarangayName) {
	try {
		localStorage.setItem('lydo-youth-transfer', JSON.stringify({
			target_barangay_id: targetBarangayId,
			target_barangay_name: targetBarangayName,
			ts: Date.now()
		}));
	} catch (error) {
		console.warn('Could not publish youth transfer update:', error);
	}
}

function formatNumber(n) { return (typeof n === 'number') ? n.toLocaleString() : n; }

function formatDateTime(value) {
	if (!value) return 'Not yet';
	const dt = new Date(value);
	if (Number.isNaN(dt.getTime())) return value;
	return dt.toLocaleString();
}

function toBool(v) {
	if (v === true || v === 1 || v === '1' || v === 'true' || v === 'True') return true;
	return false;
}

function renderTopStats() {
	const total = Array.isArray(allYouths) ? allYouths.length : 0;
	const inSchool = Array.isArray(allYouths)
		? allYouths.filter(y => toBool(y.is_in_school) || (y.full_data && toBool(y.full_data.is_in_school))).length : 0;
	const osy = Array.isArray(allYouths)
		? allYouths.filter(y => toBool(y.is_osy) || (y.full_data && toBool(y.full_data.is_osy))).length : 0;
	const registered = Array.isArray(allYouths)
		? allYouths.filter(y => {
			const sk  = toBool(y.registered_voter_sk)  || (y.full_data && toBool(y.full_data.registered_voter_sk));
			const nat = toBool(y.registered_voter_national) || (y.full_data && toBool(y.full_data.registered_voter_national));
			return sk || nat;
		}).length : 0;

	const set = (id, value) => { const el = document.getElementById(id); if (el) el.innerText = formatNumber(value); };
	set('stat-total', total);
	set('stat-in-school', inSchool);
	set('stat-osy', osy);
	set('stat-registered', registered);

	if (total === 0 && Array.isArray(BARANGAYS) && BARANGAYS.length > 0) {
		fetchAggregatedStats();
	}
}

async function fetchAggregatedStats() {
	try {
		let grandTotal = 0, grandOsy = 0;
		const results = await Promise.all(
			BARANGAYS.map(b => fetch(`/api/barangay_summary/${b.id}/`).then(r => r.ok ? r.json() : null).catch(() => null))
		);
		results.forEach(data => {
			if (!data) return;
			grandTotal += Number(data.total || 0);
			grandOsy   += Number(data.osy   || 0);
		});
		if (grandTotal > 0) {
			setStat('stat-total', grandTotal);
			setStat('stat-osy', grandOsy);
		}
	} catch(e) { console.warn('fetchAggregatedStats failed:', e); }
}

function setStat(id, value) { const el = document.getElementById(id); if (el) el.innerText = formatNumber(value); }

function renderAdminAccountActivity(payload) {
	const section = document.getElementById('admin-account-section');
	const tbody = document.getElementById('admin-account-rows');
	const empty = document.getElementById('admin-account-empty');
	const summary = document.getElementById('admin-account-summary');
	if (!section || !tbody || !empty || !summary) return;

	if (!CURRENT_USER || !CURRENT_USER.is_admin) {
		section.style.display = 'none';
		return;
	}

	section.style.display = 'block';
	const rows = Array.isArray(payload?.rows) ? payload.rows : [];
	ADMIN_ACCOUNT_ROWS = rows;
	if ($id('admin-account-barangay-panel')) {
		populateAdminAccountBarangays(val('admin-account-barangay'));
	}
	const activeBarangays = Array.isArray(payload?.active_barangays) ? payload.active_barangays : [];
	summary.textContent = rows.length
		? `${rows.length} account(s) total. ${payload.active_count || 0} active right now. Active barangays: ${activeBarangays.length ? activeBarangays.join(', ') : 'none'}.`
		: 'No assigned barangay accounts available.';

	if (!rows.length) {
		tbody.innerHTML = '';
		empty.style.display = 'block';
		return;
	}

	empty.style.display = 'none';
	tbody.innerHTML = rows.map(row => {
		const statusClass = row.is_logged_in ? 'green' : (row.is_account_active ? 'navy' : 'rose');
		const statusLabel = row.is_logged_in ? 'Active Now' : (row.is_account_active ? 'Offline' : 'Disabled');
		const usernameArg = escapeHtml(JSON.stringify(String(row.username || '')));
		const usernameLabel = escapeHtml(row.username);
		const barangayLabel = escapeHtml(row.barangay_name || 'Unassigned');
		const editButton = `<button class="btn-tbl view" onclick="openAdminAccountModal(${row.user_id})">Edit</button>`;
		const actionButton = row.is_account_active
			? `<button class="btn-tbl delete" onclick="disableBarangayAccount(${row.user_id}, ${usernameArg})">Disable</button>`
			: `<button class="btn-tbl view" onclick="enableBarangayAccount(${row.user_id}, ${usernameArg})">Enable</button>`;
		return `
			<tr>
				<td>${usernameLabel}</td>
				<td>${barangayLabel}</td>
				<td><span class="badge-pill ${statusClass}">${statusLabel}</span></td>
				<td>${formatDateTime(row.login_time)}</td>
				<td>${formatDateTime(row.logout_time)}</td>
				<td>${editButton} ${actionButton}</td>
			</tr>
		`;
	}).join('');
}

function fetchAdminAccountActivity() {
	if (!CURRENT_USER || !CURRENT_USER.is_admin) return;
	if (!document.getElementById('admin-account-section')) return;
	fetch('/api/admin/account-activity/')
		.then(res => res.ok ? res.json() : Promise.reject(new Error('Failed to load account activity')))
		.then(renderAdminAccountActivity)
		.catch(err => {
			console.warn('Failed to load admin account activity:', err);
			const summary = document.getElementById('admin-account-summary');
			if (summary) summary.textContent = 'Unable to load account activity right now.';
		});
}

function disableBarangayAccount(userId, username) {
	if (!CURRENT_USER || !CURRENT_USER.is_admin) return;
	showDeleteConfirmDialog({
		title: 'Disable Barangay Account',
		message: `Disable the account for ${username}?`,
		helper: 'This will block the barangay account from signing in until an administrator enables it again.',
		name: username,
		nameLabel: 'Account To Disable',
		cancelLabel: 'Keep Account Active',
		approveLabel: 'Disable Account'
	}).then(confirmed => {
		if (!confirmed) return;
		fetch('/api/admin/disable-account/', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ user_id: userId })
		}).then(res => res.json()).then(data => {
			if (data.message) {
				fetchAdminAccountActivity();
				return;
			}
			alert(data.error || 'Failed to disable account.');
		}).catch(err => {
			alert('Failed to disable account: ' + (err.message || err));
		});
	});
}

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		closeBarangayAccountNotice();
	}
});

function enableBarangayAccount(userId, username) {
	if (!CURRENT_USER || !CURRENT_USER.is_admin) return;
	if (!confirm(`Enable the account for ${username}?`)) return;
	fetch('/api/admin/enable-account/', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({ user_id: userId })
	}).then(res => res.json()).then(data => {
		if (data.message) {
			fetchAdminAccountActivity();
			return;
		}
		alert(data.error || 'Failed to enable account.');
	}).catch(err => {
		alert('Failed to enable account: ' + (err.message || err));
	});
}

function populateAdminAccountBarangays(selectedId = '') {
	const hiddenInput = $id('admin-account-barangay');
	const label = $id('admin-account-barangay-label');
	const panel = $id('admin-account-barangay-panel');
	const status = $id('admin-account-barangay-status');
	if (!hiddenInput || !label || !panel) return;

	const normalizedSelected = String(selectedId || '');
	const selectedBarangay = ADMIN_ACCOUNT_BARANGAYS.find(barangay => String(barangay.id) === normalizedSelected);
	const selectedRow = ADMIN_ACCOUNT_ROWS.find(row => String(row.barangay_id) === normalizedSelected);
	hiddenInput.value = normalizedSelected;
	label.textContent = selectedBarangay ? selectedBarangay.name : 'Select barangay';
	if (status) {
		if (selectedBarangay && selectedRow) {
			status.textContent = `${selectedBarangay.name} already has an account: ${selectedRow.username}`;
			status.style.color = 'var(--danger)';
		} else if (selectedBarangay) {
			status.textContent = `${selectedBarangay.name} is available for a new account.`;
			status.style.color = 'var(--success)';
		} else {
			status.textContent = 'Select a barangay without an existing account.';
			status.style.color = '';
		}
	}
	panel.innerHTML = ADMIN_ACCOUNT_BARANGAYS.map(barangay => {
		const isSelected = String(barangay.id) === normalizedSelected ? ' selected' : '';
		const existingRow = ADMIN_ACCOUNT_ROWS.find(row => String(row.barangay_id) === String(barangay.id));
		const isOccupied = !!existingRow;
		const occupiedBadge = isOccupied ? ` <span style="font-size:.78rem;color:var(--danger);">(Has account)</span>` : '';
		return `<button type="button" class="register-select-option${isSelected}" data-value="${barangay.id}" data-label="${barangay.name}" data-occupied="${isOccupied ? 'true' : 'false'}" role="option">${barangay.name}${occupiedBadge}</button>`;
	}).join('');
}

async function loadAdminAccountBarangays(force = false) {
	if (ADMIN_ACCOUNT_BARANGAYS.length && !force) {
		populateAdminAccountBarangays();
		return ADMIN_ACCOUNT_BARANGAYS;
	}

	const response = await fetch('/api/barangays/');
	if (!response.ok) throw new Error('Failed to load barangays');
	const data = await response.json();
	ADMIN_ACCOUNT_BARANGAYS = Array.isArray(data) ? data : [];
	populateAdminAccountBarangays();
	return ADMIN_ACCOUNT_BARANGAYS;
}

function showAdminAccountFormError(message = '') {
	const errorBox = $id('admin-account-form-error');
	if (!errorBox) return;
	if (message) {
		errorBox.textContent = message;
		errorBox.style.display = 'block';
	} else {
		errorBox.textContent = '';
		errorBox.style.display = 'none';
	}
}

function setAdminAccountSubmitState(isLoading) {
	const submitBtn = $id('admin-account-submit');
	const submitText = $id('admin-account-submit-text');
	if (submitBtn) submitBtn.disabled = !!isLoading;
	if (submitText) submitText.textContent = isLoading ? 'Saving...' : (submitBtn?.dataset.defaultLabel || 'Save');
}

function getAdminAccountModal() {
	const modalEl = $id('adminAccountModal');
	if (!modalEl) return null;
	if (!ADMIN_ACCOUNT_MODAL) {
		ADMIN_ACCOUNT_MODAL = new bootstrap.Modal(modalEl);
	}
	return ADMIN_ACCOUNT_MODAL;
}

function resetAdminAccountForm() {
	const form = $id('admin-account-form');
	if (form) form.reset();
	setVal('admin-account-user-id', '');
	showAdminAccountFormError('');
	populateAdminAccountBarangays();
	const submitBtn = $id('admin-account-submit');
	if (submitBtn) submitBtn.dataset.defaultLabel = 'Create Account';
	const submitText = $id('admin-account-submit-text');
	if (submitText) submitText.textContent = 'Create Account';
	const title = $id('admin-account-modal-title');
	if (title) title.textContent = 'Create Barangay Account';
	const helper = $id('admin-account-password-help');
	if (helper) helper.textContent = 'Set a password for the new account.';
}

function initAdminBarangayDropdown() {
	const wrap = $id('admin-account-barangay-wrap');
	const trigger = $id('admin-account-barangay-trigger');
	const panel = $id('admin-account-barangay-panel');
	const hiddenInput = $id('admin-account-barangay');
	const label = $id('admin-account-barangay-label');
	if (!wrap || !trigger || !panel || !hiddenInput || !label) return;

	const setOpen = (isOpen) => {
		wrap.classList.toggle('open', isOpen);
		trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
	};

	trigger.addEventListener('click', () => {
		setOpen(!wrap.classList.contains('open'));
	});

	panel.addEventListener('click', (event) => {
		const option = event.target.closest('.register-select-option');
		if (!option) return;
		const isEditMode = !!val('admin-account-user-id').trim();
		if (option.dataset.occupied === 'true' && !option.classList.contains('selected') && !isEditMode) {
			const existingRow = ADMIN_ACCOUNT_ROWS.find(row => String(row.barangay_id) === String(option.dataset.value || ''));
			showAdminAccountFormError(existingRow
				? `${option.dataset.label || 'This barangay'} already has an account: ${existingRow.username}.`
				: `${option.dataset.label || 'This barangay'} already has an account.`);
			return;
		}
		hiddenInput.value = option.dataset.value || '';
		label.textContent = option.dataset.label || 'Select barangay';
		panel.querySelectorAll('.register-select-option').forEach(item => item.classList.remove('selected'));
		option.classList.add('selected');
		showAdminAccountFormError('');
		populateAdminAccountBarangays(hiddenInput.value);
		setOpen(false);
	});

	document.addEventListener('click', (event) => {
		if (!wrap.contains(event.target)) {
			setOpen(false);
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			setOpen(false);
		}
	});
}

async function openAdminAccountModal(userId = null) {
	if (!CURRENT_USER || !CURRENT_USER.is_admin) return;

	try {
		await loadAdminAccountBarangays();
	} catch (err) {
		alert('Could not load barangays: ' + (err.message || err));
		return;
	}

	resetAdminAccountForm();

	const isEdit = userId !== null && userId !== undefined;
	if (isEdit) {
		const row = ADMIN_ACCOUNT_ROWS.find(item => String(item.user_id) === String(userId));
		if (!row) {
			alert('Account details could not be found. Please refresh and try again.');
			return;
		}

		setVal('admin-account-user-id', row.user_id);
		setVal('admin-account-username', row.username);
		populateAdminAccountBarangays(row.barangay_id);

		const title = $id('admin-account-modal-title');
		if (title) title.textContent = 'Update Barangay Account';
		const helper = $id('admin-account-password-help');
		if (helper) helper.textContent = 'Leave the password fields blank if you do not want to change the current password.';
		const submitBtn = $id('admin-account-submit');
		if (submitBtn) submitBtn.dataset.defaultLabel = 'Update Account';
		const submitText = $id('admin-account-submit-text');
		if (submitText) submitText.textContent = 'Update Account';
	}

	const modal = getAdminAccountModal();
	if (modal) modal.show();
}

function submitAdminAccountForm(e) {
	e.preventDefault();
	if (!CURRENT_USER || !CURRENT_USER.is_admin) return;

	const userId = val('admin-account-user-id').trim();
	const username = val('admin-account-username').trim();
	const barangayId = val('admin-account-barangay');
	const password = val('admin-account-password');
	const confirmPassword = val('admin-account-confirm-password');
	const isEdit = !!userId;

	showAdminAccountFormError('');

	if (!username || !barangayId) {
		showAdminAccountFormError('Username and assigned barangay are required.');
		return;
	}

	const occupiedRow = ADMIN_ACCOUNT_ROWS.find(row => String(row.barangay_id) === String(barangayId));
	if (occupiedRow && (!isEdit || String(occupiedRow.user_id) !== String(userId))) {
		showAdminAccountFormError(`${occupiedRow.barangay_name} already has an account: ${occupiedRow.username}.`);
		return;
	}

	if (!isEdit && !password) {
		showAdminAccountFormError('Password is required when creating an account.');
		return;
	}

	if (password !== confirmPassword) {
		showAdminAccountFormError('Passwords do not match.');
		return;
	}

	const payload = {
		username,
		barangay_id: barangayId
	};
	if (password) payload.password = password;
	if (isEdit) payload.user_id = userId;

	const endpoint = isEdit ? '/api/admin/update-account/' : '/api/register/';
	setAdminAccountSubmitState(true);

	fetch(endpoint, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(payload)
	}).then(async res => {
		const data = await res.json().catch(() => ({}));
		if (!res.ok) {
			throw new Error(data.error || 'Failed to save account.');
		}
		return data;
	}).then(() => {
		const modal = getAdminAccountModal();
		if (modal) modal.hide();
		resetAdminAccountForm();
		fetchAdminAccountActivity();
	}).catch(err => {
		showAdminAccountFormError(err.message || 'Failed to save account.');
	}).finally(() => {
		setAdminAccountSubmitState(false);
	});
}

function updateYouthSortDropdown() {
	const select = document.getElementById('searchFilter');
	const label = document.getElementById('searchFilterButtonText');
	const menu = document.querySelector('.search-filter-menu');
	if (!select) return;

	const option = select.options[select.selectedIndex];
	if (label) label.textContent = option ? option.textContent : 'Sort';

	if (!menu) return;
	menu.querySelectorAll('[data-search-filter]').forEach(item => {
		item.classList.toggle('active', item.dataset.searchFilter === select.value);
	});
}

function initYouthSortDropdown() {
	const select = document.getElementById('searchFilter');
	const menu = document.querySelector('.search-filter-menu');
	if (!select || !menu || menu.dataset.sortDropdownReady === 'true') return;

	menu.querySelectorAll('[data-search-filter]').forEach(item => {
		item.addEventListener('click', () => {
			select.value = item.dataset.searchFilter || 'all';
			updateYouthSortDropdown();
			updateYouthSearchPlaceholder();
			filterTable();
		});
	});

	menu.dataset.sortDropdownReady = 'true';
	updateYouthSortDropdown();
}

function updateYouthSearchPlaceholder() {
	const input = document.getElementById('searchInput');
	const filter = document.getElementById('searchFilter');
	if (!input || !filter) return;
	const placeholders = {
		all: 'Search all youth information...',
		name: 'Search by youth name...',
		age: 'Search by age...',
		sex: 'Search by sex...',
		purok: 'Search by purok...',
		education: 'Search by education...'
	};
	input.placeholder = placeholders[filter.value] || placeholders.all;
}

function filterTable() {
	if (!currentBarangayId) return;
	const input = document.getElementById('searchInput');
	const filter = document.getElementById('searchFilter');
	const term = ((input && input.value) || '').trim().toLowerCase();
	const filterType = (filter && filter.value) || 'all';
	const filtered = allYouths.filter(y => 
		String(y.barangay_id) === String(currentBarangayId) && 
		matchesYouthSearch(y, term, filterType)
	);
	renderRows(filtered);
}

function matchesYouthSearch(y, term, filterType) {
	if (!term) return true;
	const details = y.full_data || {};
	const values = {
		name: String(y.name || '').toLowerCase(),
		age: String(y.age ?? '').toLowerCase(),
		sex: String(y.sex || '').toLowerCase(),
		purok: String(details.purok || '').toLowerCase(),
		education: String(y.education_level || '').toLowerCase(),
	};
	if (filterType === 'all') return Object.values(values).some(value => value.includes(term));
	return (values[filterType] || '').includes(term);
}

function renderRows(data) {
	const tbody = document.getElementById('youth-data');
	const emptyMsg = document.getElementById('empty-msg');
	if (data.length === 0) {
		tbody.innerHTML = '';
		emptyMsg.style.display = 'block';
		return;
	}
	emptyMsg.style.display = 'none';
    
	tbody.innerHTML = data.map(y => `
		<tr>
			<td>${escapeHtml(y.name)}</td>
			<td>${escapeHtml(y.age)}</td>
			<td>${escapeHtml(y.sex)}</td>
			<td>${escapeHtml(y.full_data.purok || '-')}</td>
			<td>${escapeHtml(y.education_level)}</td>
			<td class="admin-only">
			<div style="display:flex;gap:6px;">
				<button class="btn-tbl view" onclick="viewFullSummary(${y.id})">
					<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
					View
				</button>
				<button class="btn-tbl edit" onclick="editYouth(${y.id})">
					<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
					Edit
				</button>
				<button class="btn-tbl delete" onclick="deleteYouth(${y.id})">
					<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
					Delete
				</button>
			</div>
			</td>
		</tr>
	`).join('');
    
	if(isLoggedIn) document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'table-cell');
}

function setYouthBarangayEditable(isEditable) {
	const wrap = $id('youth-barangay-wrap');
	const trigger = $id('youth-barangay-trigger');
	const icon = $id('youth-barangay-icon');
	if (!trigger) return;
	trigger.disabled = !isEditable;
	trigger.style.pointerEvents = isEditable ? 'auto' : 'none';
	trigger.style.background = isEditable ? '#ffffff' : '#f4f7ff';
	if (icon) icon.style.display = isEditable ? '' : 'none';
	if (!isEditable && wrap) {
		wrap.classList.remove('open');
		trigger.setAttribute('aria-expanded', 'false');
	}
}

function getYouthModalDraftStorageKey() {
	const username = CURRENT_USER?.username || 'guest';
	const barangayId = String(currentBarangayId || CURRENT_USER?.barangay_id || 'all');
	return `${YOUTH_MODAL_DRAFT_STORAGE_PREFIX}:${username}:${barangayId}`;
}

function clearYouthModalDraft() {
	try {
		window.sessionStorage.removeItem(getYouthModalDraftStorageKey());
	} catch (error) {
		console.warn('Could not clear youth modal draft:', error);
	}
}

function buildYouthModalDraft() {
	if (val('youth-id')) return null;
	return {
		name: val('name'),
		birthdate: val('birthdate'),
		sex: val('sex'),
		civil_status: val('civil_status'),
		religion: val('religion'),
		barangay_id: val('barangay_id') || String(currentBarangayId || ''),
		purok: val('purok'),
		email: val('email'),
		contact_number: val('contact_number'),
		is_in_school: chk('is_in_school'),
		is_osy: chk('is_osy'),
		osy_willing_to_enroll: chk('osy_willing_to_enroll'),
		osy_program_type: val('osy_program_type'),
		osy_reason_no_enroll: val('osy_reason_no_enroll'),
		is_working_youth: chk('is_working_youth'),
		is_unemployed_youth: chk('is_unemployed_youth'),
		is_pwd: chk('is_pwd'),
		disability_type: val('disability_type'),
		has_specific_needs: chk('has_specific_needs'),
		specific_needs_condition: val('specific_needs_condition'),
		is_ip: chk('is_ip'),
		tribe_name: val('tribe_name'),
		is_muslim: chk('is_muslim'),
		muslim_group: val('muslim_group'),
		education_level: val('education_level'),
		course: val('course'),
		school_name: val('school_name'),
		is_scholar: chk('is_scholar'),
		scholarship_program: val('scholarship_program'),
		employment_company_name: val('employment_company_name'),
		employment_company_address: val('employment_company_address'),
		work_status: val('work_status'),
		sports_preferences: collectPreferenceSelections('sport-pref', SPORT_PREFERENCE_OPTIONS),
		talent_preferences: collectPreferenceSelections('talent-pref', TALENT_PREFERENCE_OPTIONS),
		organizations_joined: collectOrganizationJoinedSelections(),
		sports_preference_other: val('sports_preference_other'),
		talent_preference_other: val('talent_preference_other'),
		registered_voter_sk: chk('registered_voter_sk'),
		registered_voter_national: chk('registered_voter_national'),
		is_non_voter: chk('is_non_voter'),
		voted_last_sk: chk('voted_last_sk'),
		attended_kk_assembly: chk('attended_kk_assembly'),
		kk_assembly_times: val('kk_assembly_times'),
		kk_assembly_no_reason: val('kk_assembly_no_reason'),
		is_4ps: chk('is_4ps'),
		number_of_children: val('number_of_children')
	};
}

function persistYouthModalDraft() {
	const draft = buildYouthModalDraft();
	if (!draft) return;
	try {
		window.sessionStorage.setItem(getYouthModalDraftStorageKey(), JSON.stringify(draft));
	} catch (error) {
		console.warn('Could not persist youth modal draft:', error);
	}
}

function restoreYouthModalDraft() {
	let rawDraft = null;
	try {
		rawDraft = window.sessionStorage.getItem(getYouthModalDraftStorageKey());
	} catch (error) {
		console.warn('Could not read youth modal draft:', error);
		return false;
	}
	if (!rawDraft) return false;

	let draft = null;
	try {
		draft = JSON.parse(rawDraft);
	} catch (error) {
		clearYouthModalDraft();
		return false;
	}
	if (!draft || typeof draft !== 'object') {
		clearYouthModalDraft();
		return false;
	}

	const mappings = {
		'name': draft.name,
		'birthdate': draft.birthdate,
		'sex': draft.sex,
		'civil_status': draft.civil_status,
		'religion': draft.religion,
		'purok': draft.purok,
		'email': draft.email,
		'contact_number': draft.contact_number,
		'osy_program_type': draft.osy_program_type,
		'osy_reason_no_enroll': draft.osy_reason_no_enroll,
		'disability_type': draft.disability_type,
		'specific_needs_condition': draft.specific_needs_condition,
		'tribe_name': draft.tribe_name,
		'muslim_group': draft.muslim_group,
		'education_level': draft.education_level,
		'course': draft.course,
		'school_name': draft.school_name,
		'scholarship_program': draft.scholarship_program,
		'employment_company_name': draft.employment_company_name,
		'employment_company_address': draft.employment_company_address,
		'work_status': draft.work_status,
		'sports_preference_other': draft.sports_preference_other,
		'talent_preference_other': draft.talent_preference_other,
		'kk_assembly_times': draft.kk_assembly_times,
		'kk_assembly_no_reason': draft.kk_assembly_no_reason,
		'number_of_children': draft.number_of_children
	};
	Object.entries(mappings).forEach(([id, value]) => setVal(id, value));

	const checks = ['is_in_school','is_osy','osy_willing_to_enroll','is_working_youth','is_unemployed_youth','is_pwd','has_specific_needs','is_ip','is_muslim','is_scholar','registered_voter_sk','registered_voter_national','is_non_voter','voted_last_sk','attended_kk_assembly','is_4ps'];
	checks.forEach(id => setChk(id, !!draft[id]));

	populateBarangayDropdown(BARANGAYS, draft.barangay_id || currentBarangayId || '');
	setYouthBarangayEditable(false);
	applyPreferenceSelections('sport-pref', SPORT_PREFERENCE_OPTIONS, draft.sports_preferences || []);
	applyPreferenceSelections('talent-pref', TALENT_PREFERENCE_OPTIONS, draft.talent_preferences || []);
	updatePreferencePopupLabel('sport-pref', SPORT_PREFERENCE_OPTIONS, 'sports-preference-label', 'Select sports');
	updatePreferencePopupLabel('talent-pref', TALENT_PREFERENCE_OPTIONS, 'talent-preference-label', 'Select talents');
	applyOrganizationJoinedSelections(draft.organizations_joined || []);
	syncNonVoterCheckbox('is_non_voter');
	toggleOSY();
	updateAutoTogglesState();
	updateBirthdateEligibilityState();
	return true;
}

function resetYouthModalState() {
	const form = $id('youthForm');
	if (form) form.reset();

	setVal('youth-id', '');
	populateBarangayDropdown(BARANGAYS, currentBarangayId || '');
	setYouthBarangayEditable(false);
	applyPreferenceSelections('sport-pref', SPORT_PREFERENCE_OPTIONS, []);
	applyPreferenceSelections('talent-pref', TALENT_PREFERENCE_OPTIONS, []);
	updatePreferencePopupLabel('sport-pref', SPORT_PREFERENCE_OPTIONS, 'sports-preference-label', 'Select sports');
	updatePreferencePopupLabel('talent-pref', TALENT_PREFERENCE_OPTIONS, 'talent-preference-label', 'Select talents');
	applyOrganizationJoinedSelections([]);
	syncNonVoterCheckbox('is_non_voter');
	toggleOSY();
	updateAutoTogglesState();
	updateBirthdateEligibilityState();

	document.querySelectorAll('.temp-modal-alert').forEach(el => el.remove());
	document.querySelectorAll('.edit-save-btn').forEach(btn => btn.style.display = 'none');
	document.querySelectorAll('.add-save-btn').forEach(btn => btn.style.display = '');

	if (typeof switchTab === 'function') {
		switchTab(
			'tab-personal',
			document.querySelector('.modal-tab-btn[onclick*="tab-personal"]')
		);
	}
}

// Open the youth profile modal for add/edit flows.
function openModal() {
	resetYouthModalState();
	restoreYouthModalDraft();
	new bootstrap.Modal(document.getElementById('youthModal')).show();
}

function cancelYouthModal() {
	clearYouthModalDraft();
	resetYouthModalState();
	const modalInstance = bootstrap.Modal.getInstance(document.getElementById('youthModal'));
	if (modalInstance) {
		modalInstance.hide();
		return;
	}
	new bootstrap.Modal(document.getElementById('youthModal')).hide();
}

function editYouth(id) {
	const y = getYouthById(id);
	if (!y) return alert("Error: Data not found");
	const d = y.full_data || {};

	const showEditModal = () => {
		populateBarangayDropdown(getTransferBarangayOptions(), d.barangay_id);

		const mappings = {
			'youth-id': y.id,
			'name': y.name,
			'birthdate': d.birthdate,
			'sex': y.sex || d.sex,
			'civil_status': d.civil_status,
			'religion': d.religion,
			'purok': d.purok,
			'email': d.email,
			'contact_number': d.contact_number,
			'osy_program_type': d.osy_program_type,
			'osy_reason_no_enroll': d.osy_reason_no_enroll,
			'disability_type': d.disability_type,
			'specific_needs_condition': d.specific_needs_condition,
			'tribe_name': d.tribe_name,
			'muslim_group': d.muslim_group,
			'education_level': y.education_level,
			'course': d.course,
			'school_name': d.school_name,
			'scholarship_program': d.scholarship_program,
			'employment_company_name': d.employment_company_name,
			'employment_company_address': d.employment_company_address,
			'work_status': d.work_status,
			'sports_preference_other': d.sports_preference_other,
			'talent_preference_other': d.talent_preference_other,
			'kk_assembly_times': d.kk_assembly_times,
			'kk_assembly_no_reason': d.kk_assembly_no_reason,
			'number_of_children': d.number_of_children
		};

		Object.entries(mappings).forEach(([k,v]) => setVal(k, v));

		const checks = ['is_in_school','is_osy','osy_willing_to_enroll','is_working_youth','is_unemployed_youth','is_pwd','has_specific_needs','is_ip','is_muslim','is_scholar','registered_voter_sk','registered_voter_national','is_non_voter','voted_last_sk','attended_kk_assembly','is_4ps'];
		checks.forEach(id => setChk(id, d[id] || y[id] || false));
		applyPreferenceSelections('sport-pref', SPORT_PREFERENCE_OPTIONS, d.sports_preferences || []);
		applyPreferenceSelections('talent-pref', TALENT_PREFERENCE_OPTIONS, d.talent_preferences || []);
		updatePreferencePopupLabel('sport-pref', SPORT_PREFERENCE_OPTIONS, 'sports-preference-label', 'Select sports');
		updatePreferencePopupLabel('talent-pref', TALENT_PREFERENCE_OPTIONS, 'talent-preference-label', 'Select talents');
		applyOrganizationJoinedSelections(d.organizations_joined || []);
		syncNonVoterCheckbox('is_non_voter');

		setYouthBarangayEditable(true);
		toggleOSY();
		updateAutoTogglesState();
		updateBirthdateEligibilityState();
		document.querySelectorAll('.edit-save-btn').forEach(btn => btn.style.display = '');
		document.querySelectorAll('.add-save-btn').forEach(btn => btn.style.display = 'none');
		if (typeof switchTab === 'function') {
			switchTab('tab-personal',
				document.querySelector('.modal-tab-btn[onclick*="tab-personal"]'));
		}
		new bootstrap.Modal($id('youthModal')).show();
	};

	if (getTransferBarangayOptions().length <= 1) {
		fetchTransferBarangays().finally(showEditModal);
		return;
	}

	showEditModal();
}

// Validate and submit the youth form payload to the backend.
function saveYouth(e) {
	e.preventDefault();
	const getVal = (id) => document.getElementById(id).value;
	const getCheck = (id) => document.getElementById(id).checked;

	let kk_times = parseInt(getVal('kk_assembly_times')) || 0;
	let num_children = parseInt(getVal('number_of_children')) || 0;

	const data = {
		name: getVal('name'),
		birthdate: getVal('birthdate'),
		sex: getVal('sex'),
		civil_status: getVal('civil_status'),
		religion: getVal('religion'),
		barangay_id: parseInt(getVal('barangay_id')) || currentBarangayId,
		purok: getVal('purok'),
		email: getVal('email'),
		contact_number: getVal('contact_number'),
		is_in_school: getCheck('is_in_school'),
		is_osy: getCheck('is_osy'),
		osy_willing_to_enroll: getCheck('osy_willing_to_enroll'),
		osy_program_type: getVal('osy_program_type'),
		osy_reason_no_enroll: getVal('osy_reason_no_enroll'),
		is_working_youth: getCheck('is_working_youth'),
		is_unemployed_youth: getCheck('is_unemployed_youth'),
		is_pwd: getCheck('is_pwd'),
		disability_type: getVal('disability_type'),
		has_specific_needs: getCheck('has_specific_needs'),
		specific_needs_condition: getVal('specific_needs_condition'),
		is_ip: getCheck('is_ip'),
		tribe_name: getVal('tribe_name'),
		is_muslim: getCheck('is_muslim'),
		muslim_group: getVal('muslim_group'),
		education_level: getVal('education_level'),
		course: getVal('course'),
		school_name: getVal('school_name'),
		is_scholar: getCheck('is_scholar'),
		scholarship_program: getVal('scholarship_program'),
		employment_company_name: getVal('employment_company_name'),
		employment_company_address: getVal('employment_company_address'),
		work_status: getVal('work_status'),
		sports_preferences: collectPreferenceSelections('sport-pref', SPORT_PREFERENCE_OPTIONS),
		talent_preferences: collectPreferenceSelections('talent-pref', TALENT_PREFERENCE_OPTIONS),
		organizations_joined: collectOrganizationJoinedSelections(),
		sports_preference_other: getVal('sports_preference_other'),
		talent_preference_other: getVal('talent_preference_other'),
		registered_voter_sk: getCheck('registered_voter_sk'),
		registered_voter_national: getCheck('registered_voter_national'),
		is_non_voter: getCheck('is_non_voter'),
		voted_last_sk: getCheck('voted_last_sk'),
		attended_kk_assembly: getCheck('attended_kk_assembly'),
		kk_assembly_times: Math.max(0, kk_times),
		kk_assembly_no_reason: getVal('kk_assembly_no_reason'),
		is_4ps: getCheck('is_4ps'),
		number_of_children: Math.max(0, num_children)
	};

	if (!updateBirthdateEligibilityState()) {
		const age = getAgeFromBirthdateValue(data.birthdate);
		showModalAlert(
			age == null
				? 'This record cannot be saved because the birthdate is outside the allowed youth range.'
				: `This person is already ${age} years old. The system prohibits saving records for age 31 and above.`
		);
		const birthdateInput = $id('birthdate');
		if (birthdateInput) birthdateInput.focus();
		return;
	}

	const existingId = getVal('youth-id');
	let transferTargetBarangayId = null;
	let transferTargetBarangayName = '';
	if (existingId && !(CURRENT_USER && CURRENT_USER.is_admin)) {
		const existingYouth = getYouthById(parseInt(existingId, 10));
		const currentBarangayName = existingYouth?.barangay_name || getBarangayNameById(existingYouth?.barangay_id);
		const targetBarangayName = getBarangayNameById(data.barangay_id);
		const isBarangayChanged = currentBarangayName && targetBarangayName
			&& normalizeBarangayName(currentBarangayName) !== normalizeBarangayName(targetBarangayName);

		if (isBarangayChanged) {
			transferTargetBarangayId = data.barangay_id;
			transferTargetBarangayName = targetBarangayName;
			showTransferConfirmDialog({
				message: `${existingYouth?.name || 'This youth'} is currently registered in ${currentBarangayName}. Move the youth record to ${targetBarangayName}?`,
				helper: 'Only the barangay currently holding this record can do this transfer. Once confirmed, the youth will leave the current barangay list and appear under the new barangay account.',
				currentBarangay: currentBarangayName,
				targetBarangay: targetBarangayName
			}).then(confirmed => {
				if (!confirmed) return;
				data.confirm_barangay_transfer = true;
				if (existingId) data.id = parseInt(existingId);
				const method = data.id ? 'PUT' : 'POST';
				const submitYouthRequest = (payload, allowRetry = true) => {
					fetch('/api/youth/', {
						method: method,
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify(payload)
					}).then(res => {
						return res.text().then(text => {
							try {
								const obj = JSON.parse(text);
								if (res.ok) {
									bootstrap.Modal.getInstance(document.getElementById('youthModal')).hide();
									clearYouthModalDraft();
									resetYouthModalState();
									if (transferTargetBarangayId) {
										notifyYouthTransfer(transferTargetBarangayId, transferTargetBarangayName);
									}
									fetchYouths();
								} else {
									console.error('API error JSON:', obj);
									if (obj && obj.age_blocked) {
										showModalAlert(obj.error || 'This person is over 30 and can no longer be stored in the youth system.');
										const birthdateInput = $id('birthdate');
										if (birthdateInput) birthdateInput.focus();
									} else if (obj && obj.duplicate_youth) {
										showModalAlert(
											obj.error || 'Duplicate youth record detected in another barangay.',
											{ duration: 9000 }
										);
										const nameInput = $id('name');
										if (nameInput) nameInput.focus();
									} else if (obj && obj.requires_confirmation) {
										showTransferConfirmDialog({
											message: obj.error || 'Please confirm the barangay transfer before saving.',
											helper: 'Confirming will continue the transfer and update the youth record to the selected barangay.',
											currentBarangay: obj.current_barangay || currentBarangayName || 'Current barangay',
											targetBarangay: obj.target_barangay || targetBarangayName || 'New barangay'
										}).then(reconfirmed => {
											if (reconfirmed && allowRetry) {
												submitYouthRequest({ ...payload, confirm_barangay_transfer: true }, false);
												return;
											}
											showModalAlert(obj.error || 'Please confirm the barangay transfer before saving.');
										});
									} else {
										alert(obj.error || JSON.stringify(obj));
									}
								}
							} catch (err) {
								console.error('Non-JSON response:', text);
								if (res.ok) {
									bootstrap.Modal.getInstance(document.getElementById('youthModal')).hide();
									clearYouthModalDraft();
									resetYouthModalState();
									fetchYouths();
								} else {
									alert(text);
								}
							}
						});
					}).catch(err => {
						console.error('Network/fetch error:', err);
						alert('Network error: ' + err.message);
					});
				};
				submitYouthRequest(data);
			});
			return;
		}
	}
	if (!existingId && !validateTab('#tab-civic')) {
		showModalAlert('Please complete Civic & Other before saving the profile.');
		return;
	}
	if (existingId) data.id = parseInt(existingId);

	const method = data.id ? 'PUT' : 'POST';
	const submitYouthRequest = (payload, allowRetry = true) => {
		fetch('/api/youth/', {
			method: method,
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload)
		}).then(res => {
			return res.text().then(text => {
				try {
					const obj = JSON.parse(text);
					if (res.ok) {
						bootstrap.Modal.getInstance(document.getElementById('youthModal')).hide();
						clearYouthModalDraft();
						resetYouthModalState();
						if (transferTargetBarangayId) {
							notifyYouthTransfer(transferTargetBarangayId, transferTargetBarangayName);
						}
						fetchYouths();
					} else {
						console.error('API error JSON:', obj);
						if (obj && obj.age_blocked) {
							showModalAlert(obj.error || 'This person is over 30 and can no longer be stored in the youth system.');
							const birthdateInput = $id('birthdate');
							if (birthdateInput) birthdateInput.focus();
						} else if (obj && obj.duplicate_youth) {
							showModalAlert(
								obj.error || 'Duplicate youth record detected in another barangay.',
								{ duration: 9000 }
							);
							const nameInput = $id('name');
							if (nameInput) nameInput.focus();
						} else if (obj && obj.requires_confirmation) {
							showTransferConfirmDialog({
								message: obj.error || 'Please confirm the barangay transfer before saving.',
								helper: 'Confirming will continue the transfer and update the youth record to the selected barangay.',
								currentBarangay: obj.current_barangay || 'Current barangay',
								targetBarangay: obj.target_barangay || transferTargetBarangayName || 'New barangay'
							}).then(confirmed => {
								if (confirmed && allowRetry) {
									submitYouthRequest({ ...payload, confirm_barangay_transfer: true }, false);
									return;
								}
								showModalAlert(obj.error || 'Please confirm the barangay transfer before saving.');
							});
						} else {
							alert(obj.error || JSON.stringify(obj));
						}
					}
				} catch (err) {
					console.error('Non-JSON response:', text);
					if (res.ok) {
						bootstrap.Modal.getInstance(document.getElementById('youthModal')).hide();
						clearYouthModalDraft();
						resetYouthModalState();
						fetchYouths();
					} else {
						alert(text);
					}
				}
			});
		}).catch(err => {
			console.error('Network/fetch error:', err);
			alert('Network error: ' + err.message);
		});
	};
	submitYouthRequest(data);
}

function toggleOSY() {
	const isOsy = document.getElementById('is_osy').checked;
	document.getElementById('osy-section').classList.toggle('d-none', !isOsy);
}

function validatePersonalTab() {
	const container = document.getElementById('tab-personal');
	if (!container) return true;
	const requiredElems = container.querySelectorAll('input[required], select[required], textarea[required]');
	for (const el of requiredElems) {
		if (el.disabled) continue;
		if (!el.checkValidity()) {
			try { el.reportValidity(); } catch (e) {}
			el.focus();
			return false;
		}
	}
	return true;
}

/**
 * Show a temporary warning at the top of the youth modal.
 * `options.duration` lets important alerts stay visible longer.
 */
function showModalAlert(msg, options = {}) {
	const modalBody = document.querySelector('#youthModal .modal-body');
	if (!modalBody) return alert(msg);
	const existing = modalBody.querySelector('.temp-modal-alert');
	if (existing) existing.remove();
	const el = document.createElement('div');
	el.className = 'alert alert-warning temp-modal-alert';
	el.style.marginBottom = '10px';
	el.textContent = msg;
	modalBody.insertBefore(el, modalBody.firstChild);
	const duration = Number.isFinite(options.duration) ? options.duration : 3500;
	if (duration > 0) {
		setTimeout(() => el.remove(), duration);
	}
}

function initTransferConfirmModal() {
	const modalEl = $id('transferConfirmModal');
	if (!modalEl || typeof bootstrap === 'undefined') return;
	TRANSFER_CONFIRM_MODAL = new bootstrap.Modal(modalEl, {
		backdrop: 'static',
		keyboard: false
	});

	const cancelBtn = $id('transfer-confirm-cancel');
	const approveBtn = $id('transfer-confirm-approve');

	if (cancelBtn) {
		cancelBtn.addEventListener('click', () => {
			if (TRANSFER_CONFIRM_RESOLVER) TRANSFER_CONFIRM_RESOLVER(false);
			TRANSFER_CONFIRM_RESOLVER = null;
			TRANSFER_CONFIRM_MODAL.hide();
		});
	}

	if (approveBtn) {
		approveBtn.addEventListener('click', () => {
			if (TRANSFER_CONFIRM_RESOLVER) TRANSFER_CONFIRM_RESOLVER(true);
			TRANSFER_CONFIRM_RESOLVER = null;
			TRANSFER_CONFIRM_MODAL.hide();
		});
	}

	modalEl.addEventListener('hidden.bs.modal', () => {
		if (TRANSFER_CONFIRM_RESOLVER) {
			TRANSFER_CONFIRM_RESOLVER(false);
			TRANSFER_CONFIRM_RESOLVER = null;
		}
	});
}

function showTransferConfirmDialog({
	title = 'Confirm Barangay Transfer',
	message = 'Confirm this youth transfer.',
	helper = 'The youth record will be removed from the current barangay list and transferred to the selected barangay.',
	currentBarangay = 'Current barangay',
	targetBarangay = 'New barangay'
} = {}) {
	if (!TRANSFER_CONFIRM_MODAL) {
		const fallback = confirm(`${message}\n\nPress OK to continue the transfer, or Cancel to keep the current barangay.`);
		return Promise.resolve(fallback);
	}

	const titleEl = $id('transfer-confirm-title');
	const messageEl = $id('transfer-confirm-message');
	const helperEl = $id('transfer-confirm-helper');
	const currentEl = $id('transfer-confirm-current');
	const targetEl = $id('transfer-confirm-target');

	if (titleEl) {
		const iconMarkup = `
			<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:12px;background:rgba(255,255,255,.14);">
				<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/><path d="M5 5v14"/></svg>
			</span>
		`;
		titleEl.innerHTML = `${iconMarkup}${title}`;
	}
	if (messageEl) messageEl.textContent = message;
	if (helperEl) helperEl.textContent = helper;
	if (currentEl) currentEl.textContent = currentBarangay;
	if (targetEl) targetEl.textContent = targetBarangay;

	return new Promise(resolve => {
		TRANSFER_CONFIRM_RESOLVER = resolve;
		TRANSFER_CONFIRM_MODAL.show();
	});
}

function initDeleteConfirmModal() {
	const modalEl = $id('deleteConfirmModal');
	if (!modalEl || typeof bootstrap === 'undefined') return;
	DELETE_CONFIRM_MODAL = new bootstrap.Modal(modalEl, {
		backdrop: 'static',
		keyboard: false
	});

	const cancelBtn = $id('delete-confirm-cancel');
	const approveBtn = $id('delete-confirm-approve');

	if (cancelBtn) {
		cancelBtn.addEventListener('click', () => {
			if (DELETE_CONFIRM_RESOLVER) DELETE_CONFIRM_RESOLVER(false);
			DELETE_CONFIRM_RESOLVER = null;
			DELETE_CONFIRM_MODAL.hide();
		});
	}

	if (approveBtn) {
		approveBtn.addEventListener('click', () => {
			if (DELETE_CONFIRM_RESOLVER) DELETE_CONFIRM_RESOLVER(true);
			DELETE_CONFIRM_RESOLVER = null;
			DELETE_CONFIRM_MODAL.hide();
		});
	}

	modalEl.addEventListener('hidden.bs.modal', () => {
		if (DELETE_CONFIRM_RESOLVER) {
			DELETE_CONFIRM_RESOLVER(false);
			DELETE_CONFIRM_RESOLVER = null;
		}
	});
}

function showDeleteConfirmDialog({
	title = 'Delete Youth Record',
	message = 'Are you sure you want to delete this record?',
	helper = 'This action permanently removes the youth profile from the selected barangay list.',
	name = 'Youth record',
	nameLabel = 'Record To Delete',
	cancelLabel = 'No! Keep it!',
	approveLabel = 'Yes! Delete it'
} = {}) {
	if (!DELETE_CONFIRM_MODAL) {
		return Promise.resolve(confirm(message));
	}

	const titleEl = $id('delete-confirm-title');
	const messageEl = $id('delete-confirm-message');
	const helperEl = $id('delete-confirm-helper');
	const nameEl = $id('delete-confirm-name');
	const nameLabelEl = $id('delete-confirm-name-label');
	const cancelBtn = $id('delete-confirm-cancel');
	const approveBtn = $id('delete-confirm-approve');

	if (titleEl) {
		titleEl.innerHTML = `
			<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:14px;background:rgba(190,24,93,.12);color:#be185d;">
				<svg width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.1" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
			</span>
			${title}
		`;
	}
	if (messageEl) messageEl.textContent = message;
	if (helperEl) helperEl.textContent = helper;
	if (nameLabelEl) nameLabelEl.textContent = nameLabel;
	if (nameEl) nameEl.textContent = name;
	if (cancelBtn) cancelBtn.textContent = cancelLabel;
	if (approveBtn) approveBtn.textContent = approveLabel;

	return new Promise(resolve => {
		DELETE_CONFIRM_RESOLVER = resolve;
		DELETE_CONFIRM_MODAL.show();
	});
}

function updateTabState() {
	const personalValid = validatePersonalTab();
	const groupsValid = personalValid && isTabValid('#tab-groups');
	const eduValid = personalValid && groupsValid && isTabValid('#tab-edu');
	const civicValid = personalValid && groupsValid && eduValid && isTabValid('#tab-civic');

	const tabLinks = document.querySelectorAll('#formTabsBS a[data-bs-toggle="tab"]');
	tabLinks.forEach(link => {
		const href = link.getAttribute('href');
		if (href === '#tab-personal') {
			link.classList.remove('disabled');
			link.removeAttribute('aria-disabled');
			link.removeAttribute('data-disabled');
			return;
		}
		if (href === '#tab-groups') {
			if (!personalValid) {
				link.classList.add('disabled'); link.setAttribute('aria-disabled','true'); link.setAttribute('data-disabled','true');
			} else { link.classList.remove('disabled'); link.removeAttribute('aria-disabled'); link.removeAttribute('data-disabled'); }
			return;
		}
		if (href === '#tab-edu') {
			if (!groupsValid) { link.classList.add('disabled'); link.setAttribute('aria-disabled','true'); link.setAttribute('data-disabled','true'); }
			else { link.classList.remove('disabled'); link.removeAttribute('aria-disabled'); link.removeAttribute('data-disabled'); }
			return;
		}
		if (href === '#tab-civic') {
			if (!eduValid) { link.classList.add('disabled'); link.setAttribute('aria-disabled','true'); link.setAttribute('data-disabled','true'); }
			else { link.classList.remove('disabled'); link.removeAttribute('aria-disabled'); link.removeAttribute('data-disabled'); }
			return;
		}
		link.classList.remove('disabled'); link.removeAttribute('aria-disabled'); link.removeAttribute('data-disabled');
	});
}

function isTabValid(tabSelector) {
	if (!tabSelector) return true;
	const sel = tabSelector.startsWith('#') ? tabSelector : ('#' + tabSelector.replace(/^#/, ''));
	const container = document.querySelector(sel);
	if (!container) return true;
	const requiredElems = container.querySelectorAll('input[required], select[required], textarea[required]');
	for (const el of requiredElems) {
		if (el.disabled) continue;
		if (el.tagName.toLowerCase() === 'select' && !el.value) {
			if (el.id === 'barangay_id' && currentBarangayId) {
				try { el.value = currentBarangayId; } catch (e) {}
			}
		}
		if (!el.checkValidity()) return false;
	}
	return true;
}

function initFormNavigation() {
	const tabLinks = document.querySelectorAll('#formTabsBS a[data-bs-toggle="tab"]');
	tabLinks.forEach(link => {
		link.addEventListener('show.bs.tab', (e) => {
			const targetHref = link.getAttribute('href');
			if (link.getAttribute('data-disabled') === 'true') {
				e.preventDefault();
				if (targetHref === '#tab-groups') showModalAlert('Please complete Personal information before continuing.');
				else if (targetHref === '#tab-edu') showModalAlert('Please complete Groups/Needs before continuing.');
				else if (targetHref === '#tab-civic') showModalAlert('Please complete Edu & Work before continuing.');
				else showModalAlert('Please complete required fields before continuing.');
				return;
			}

			const leaving = e.relatedTarget;
			if (leaving && leaving.getAttribute) {
				const leaveHref = leaving.getAttribute('href');
				if (leaveHref === '#tab-personal' && !validatePersonalTab()) { e.preventDefault(); showModalAlert('Please complete required Personal fields.'); return; }
				if (leaveHref === '#tab-groups' && !validateTab('#tab-groups')) { e.preventDefault(); showModalAlert('Please complete required Groups/Needs fields.'); return; }
				if (leaveHref === '#tab-edu' && !validateTab('#tab-edu')) { e.preventDefault(); showModalAlert('Please complete required Edu & Work fields.'); return; }
			}
		});
		link.addEventListener('click', (ev) => {
			if (link.getAttribute('data-disabled') === 'true') {
				ev.preventDefault();
				ev.stopPropagation();
				showModalAlert('Please complete Personal information before continuing.');
			}
		});
	});

	const personalInputs = document.querySelectorAll('#tab-personal input, #tab-personal select, #tab-personal textarea');
	personalInputs.forEach(inp => {
		inp.addEventListener('input', updateTabState);
		inp.addEventListener('change', updateTabState);
	});

	const groupsInputs = document.querySelectorAll('#tab-groups input, #tab-groups select, #tab-groups textarea');
	groupsInputs.forEach(inp => { inp.addEventListener('input', updateTabState); inp.addEventListener('change', updateTabState); });
	const eduInputs = document.querySelectorAll('#tab-edu input, #tab-edu select, #tab-edu textarea');
	eduInputs.forEach(inp => { inp.addEventListener('input', updateTabState); inp.addEventListener('change', updateTabState); });
	const civicInputs = document.querySelectorAll('#tab-civic input, #tab-civic select, #tab-civic textarea');
	civicInputs.forEach(inp => { inp.addEventListener('input', updateTabState); inp.addEventListener('change', updateTabState); });

	const youthModal = document.getElementById('youthModal');
	if (youthModal) youthModal.addEventListener('shown.bs.modal', () => updateTabState());

	updateTabState();

	document.querySelectorAll('.btn-next').forEach(btn => {
		if (!btn._navAttached) {
			btn.addEventListener('click', (ev) => {
				const tgt = btn.getAttribute('data-target');
				if (tgt) nextTab(tgt);
			});
			btn._navAttached = true;
		}
	});
	document.querySelectorAll('.btn-prev').forEach(btn => {
		if (!btn._navAttached) {
			btn.addEventListener('click', (ev) => {
				const tgt = btn.getAttribute('data-target');
				if (tgt) prevTab(tgt);
			});
			btn._navAttached = true;
		}
	});
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initFormNavigation); else initFormNavigation();

function validateTab(tabSelector) {
	if (!tabSelector) return true;
	const sel = tabSelector.startsWith('#') ? tabSelector : ('#' + tabSelector.replace(/^#/, ''));
	const container = document.querySelector(sel);
	if (!container) return true;
	const requiredElems = container.querySelectorAll('input[required], select[required], textarea[required]');
	for (const el of requiredElems) {
		if (el.disabled) continue;
		if (el.tagName.toLowerCase() === 'select' && !el.value) {
			if (el.id === 'barangay_id' && currentBarangayId) {
				try { el.value = currentBarangayId; } catch (e) {}
			}
		}

		if (!el.checkValidity()) {
			try {
				console.debug('validateTab failed element:', el.id || el.name || el.tagName, el.checkValidity(), el.validationMessage || 'no message');
			} catch (err) {}
			try { el.reportValidity(); } catch (e) {}
			el.focus();
			return false;
		}
	}

	if (sel === '#tab-groups') {
		return validateGroupsTab();
	}
	if (sel === '#tab-edu') {
		return validateEduTab();
	}
	if (sel === '#tab-civic') {
		return validateCivicTab();
	}
	return true;
}

function validateCivicTab() {
	const attended = !!document.getElementById('attended_kk_assembly') && document.getElementById('attended_kk_assembly').checked;
	const timesEl = document.getElementById('kk_assembly_times');
	const reasonEl = document.getElementById('kk_assembly_no_reason');
	const is4ps = !!document.getElementById('is_4ps') && document.getElementById('is_4ps').checked;
	const numChildrenEl = document.getElementById('number_of_children');

	const reasonVal = reasonEl ? String(reasonEl.value || '').trim() : '';
	if (!attended && reasonVal === '') {
		showModalAlert('Please indicate whether the youth attended KK Assembly or provide a reason in Civic & Other.');
		if (reasonEl) reasonEl.focus();
		return false;
	}

	if (attended) {
		const times = timesEl ? parseInt(timesEl.value || 0) : 0;
		if (!(times > 0)) {
			showModalAlert('Please enter how many times the youth attended KK Assembly (must be > 0).');
			if (timesEl) timesEl.focus();
			return false;
		}
	}

	if (is4ps) {
		const n = numChildrenEl ? parseInt(numChildrenEl.value || 0) : 0;
		if (!(n > 0)) {
			showModalAlert('Please provide number of children for 4Ps beneficiary in Civic & Other.');
			if (numChildrenEl) numChildrenEl.focus();
			return false;
		}
	}

	return true;
}

function validateGroupsTab() {
	const isInSchool = !!document.getElementById('is_in_school') && document.getElementById('is_in_school').checked;
	const isOsy = !!document.getElementById('is_osy') && document.getElementById('is_osy').checked;
	const isWorking = !!document.getElementById('is_working_youth') && document.getElementById('is_working_youth').checked;
	const isUnemployed = !!document.getElementById('is_unemployed_youth') && document.getElementById('is_unemployed_youth').checked;
	const isIp = !!document.getElementById('is_ip') && document.getElementById('is_ip').checked;
	const isPwd = !!document.getElementById('is_pwd') && document.getElementById('is_pwd').checked;

	if (!isInSchool && !isOsy && !isWorking && !isUnemployed && !isIp && !isPwd) {
		showModalAlert('Please select at least one Youth Classification in Groups/Needs.');
		const first = document.getElementById('is_in_school') || document.getElementById('is_osy') || document.getElementById('is_working_youth');
		if (first) first.focus();
		return false;
	}

	if (isOsy) {
		const prog = document.getElementById('osy_program_type') && document.getElementById('osy_program_type').value;
		const reason = document.getElementById('osy_reason_no_enroll') && document.getElementById('osy_reason_no_enroll').value;
		if (!prog && !reason) {
			showModalAlert('OSY selected: consider setting Program or Reason fields in Groups/Needs.');
		}
	}
	return true;
}

function validateEduTab() {
	const edu = document.getElementById('education_level');
	const work = document.getElementById('work_status');
	if (edu && String(edu.value || '').trim() === '') {
		showModalAlert('Please select Highest Education in Edu & Work.');
		try { edu.focus(); } catch (e) {}
		return false;
	}
	if (work && String(work.value || '').trim() === '') {
		showModalAlert('Please provide Work Status in Edu & Work.');
		try { work.focus(); } catch (e) {}
		return false;
	}
	return true;
}

function syncModalTabBtn(targetSelector) {
	const tabId = targetSelector.replace(/^#/, '');
	document.querySelectorAll('.modal-tab-btn').forEach(btn => {
		const onclickVal = btn.getAttribute('onclick') || '';
		btn.classList.toggle('active', onclickVal.includes(tabId));
	});
}

function nextTab(targetSelector) {
	updateTabState();
	const activeLink = document.querySelector('#formTabsBS a.active');
	const leaving = activeLink ? (activeLink.getAttribute('href') || '') : '';
	if (leaving && !validateTab(leaving)) {
		if (leaving === '#tab-personal') showModalAlert('Please complete required Personal fields.');
		else if (leaving === '#tab-groups') showModalAlert('Please complete required Groups/Needs fields.');
		else if (leaving === '#tab-edu') showModalAlert('Please complete required Edu & Work fields.');
		else showModalAlert('Please complete required fields before continuing.');
		return;
	}

	const target = document.querySelector(`#formTabsBS a[href="${targetSelector}"]`);
	if (!target) return console.warn('nextTab: target not found', targetSelector);

	if (target.getAttribute('data-disabled') === 'true') {
		const tgt = target.getAttribute('href');
		if (tgt === '#tab-groups') showModalAlert('Please complete Personal information before continuing.');
		else if (tgt === '#tab-edu') showModalAlert('Please complete Groups/Needs before continuing.');
		else if (tgt === '#tab-civic') showModalAlert('Please complete Edu & Work before continuing.');
		else showModalAlert('Please complete required fields before continuing.');
		return;
	}

	try {
		new bootstrap.Tab(target).show();
		syncModalTabBtn(targetSelector);
		updateTabState();
		return;
	} catch (e) {
		try { target.click(); syncModalTabBtn(targetSelector); updateTabState(); return; } catch (e2) {}
	}

	activateTab(targetSelector);
}

function prevTab(targetSelector) {
	const target = document.querySelector(`#formTabsBS a[href="${targetSelector}"]`);
	if (!target) return console.warn('prevTab: target not found', targetSelector);
	try { new bootstrap.Tab(target).show(); syncModalTabBtn(targetSelector); updateTabState(); return; } catch (e) {
		try { target.click(); syncModalTabBtn(targetSelector); updateTabState(); return; } catch (e2) {}
	}
	activateTab(targetSelector);
}

window.nextTab = nextTab;
window.prevTab = prevTab;

function activateTab(targetSelector) {
	const link = document.querySelector(`#formTabsBS a[href="${targetSelector}"]`);
	const pane = document.querySelector(targetSelector);
	if (!link || !pane) return console.warn('activateTab: missing link or pane', targetSelector, link, pane);

	document.querySelectorAll('#formTabsBS a[data-bs-toggle="tab"]').forEach(a => {
		a.classList.remove('active');
		a.setAttribute('aria-selected', 'false');
	});

	document.querySelectorAll('.tab-pane').forEach(p => {
		p.classList.remove('show');
		p.classList.remove('active');
		p.setAttribute('aria-hidden', 'true');
	});

	link.classList.add('active');
	link.setAttribute('aria-selected', 'true');
	pane.classList.add('show');
	pane.classList.add('active');
	pane.setAttribute('aria-hidden', 'false');

	syncModalTabBtn(targetSelector);
	updateTabState();
}

function openSidebar() {
	const menu = document.getElementById('side-menu');
	const overlay = document.getElementById('side-overlay');
	if (menu) {
		const btn = document.getElementById('menu-toggle');
		if (btn) {
			const rect = btn.getBoundingClientRect();
			const leftPos = Math.max(0, Math.round(rect.left));
			menu.style.left = leftPos + 'px';
		} else {
			menu.style.left = '';
		}
		menu.classList.add('open');
		menu.setAttribute('aria-hidden', 'false');
	}
	if (overlay) {
		overlay.classList.add('show');
		overlay.setAttribute('aria-hidden', 'false');
	}
	document.body.classList.add('side-open');
}

function closeSidebar() {
	const menu = document.getElementById('side-menu');
	const overlay = document.getElementById('side-overlay');
	if (menu) {
		menu.classList.remove('open');
		menu.setAttribute('aria-hidden', 'true');
		menu.style.left = '';
	}
	if (overlay) {
		overlay.classList.remove('show');
		overlay.setAttribute('aria-hidden', 'true');
	}
	document.body.classList.remove('side-open');
}

function toggleSidebar() {
	const menu = document.getElementById('side-menu');
	if (!menu) return;
	if (menu.classList.contains('open')) closeSidebar(); else openSidebar();
}

document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		const menu = document.getElementById('side-menu');
		if (menu && menu.classList.contains('open')) closeSidebar();
	}
});

let sidebarHoverTimer = null;
const HOVER_OPEN_DELAY = 120; 
const HOVER_CLOSE_DELAY = 300; 
const SUPPORTS_HOVER = (window.matchMedia && window.matchMedia('(hover: hover)').matches) && !('ontouchstart' in window);

function enableSidebarHover() {
	if (!SUPPORTS_HOVER) return;
	const btn = document.getElementById('menu-toggle');
	const menu = document.getElementById('side-menu');
	if (!btn || !menu) return;

	btn.addEventListener('mouseenter', () => {
		if (sidebarHoverTimer) { clearTimeout(sidebarHoverTimer); sidebarHoverTimer = null; }
		sidebarHoverTimer = setTimeout(() => { openSidebar(); sidebarHoverTimer = null; }, HOVER_OPEN_DELAY);
	});

	btn.addEventListener('mouseleave', () => {
		if (sidebarHoverTimer) { clearTimeout(sidebarHoverTimer); sidebarHoverTimer = null; }
		sidebarHoverTimer = setTimeout(() => { closeSidebar(); sidebarHoverTimer = null; }, HOVER_CLOSE_DELAY);
	});

	menu.addEventListener('mouseenter', () => {
		if (sidebarHoverTimer) { clearTimeout(sidebarHoverTimer); sidebarHoverTimer = null; }
	});

	menu.addEventListener('mouseleave', () => {
		if (sidebarHoverTimer) { clearTimeout(sidebarHoverTimer); }
		sidebarHoverTimer = setTimeout(() => { closeSidebar(); sidebarHoverTimer = null; }, HOVER_CLOSE_DELAY);
	});
}

document.addEventListener('DOMContentLoaded', enableSidebarHover);

function deleteYouth(id) {
	const y = getYouthById(id);
	if (!y) return;

	showDeleteConfirmDialog({
		message: `Are you sure you want to delete the record for ${y.name}?`,
		helper: 'This will permanently remove the youth profile from the system for this barangay.',
		name: y.name
	}).then(confirmed => {
		if (!confirmed) return;

		fetch('/api/youth/', {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ id: id })
		}).then(res => {
			if(res.ok) {
				alert('Deleted successfully');
				fetchYouths();
			} else {
				res.json().then(e => alert(e.error));
			}
		});
	});
}

function viewFullSummary(id) {
	const y = getYouthById(id);
	if (!y) return alert("Error: Data not found");

	const d = y.full_data;
	const content = document.getElementById('summary-content');
    
	const fmt = (val) => val
		? '<span style="display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;background:rgba(15,138,95,.12);color:#0f8a5f;font-weight:800;font-size:.84rem;">Yes</span>'
		: '<span style="display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;background:rgba(220,38,38,.1);color:#dc2626;font-weight:800;font-size:.84rem;">No</span>';
	const fmtList = (values, otherValue, otherLabel) => {
		const parts = Array.isArray(values) ? [...values] : [];
		if (otherValue) parts.push(`${otherLabel}: ${otherValue}`);
		return parts.length ? parts.join(', ') : 'None';
	};
	const chipList = (values) => {
		const parts = Array.isArray(values) ? values.filter(Boolean) : [];
		if (!parts.length) return '<span style="color:var(--text-muted);font-weight:600;">None</span>';
		return parts.map(value => `
			<span style="display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:#ffffff;border:1px solid #d9e4fb;color:#1f4ea3;font-size:.82rem;font-weight:700;">
				${value}
			</span>
		`).join('');
	};
	const detailRow = (label, value) => `
		<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid rgba(217,228,251,.9);">
			<span style="font-size:.8rem;letter-spacing:.04em;text-transform:uppercase;color:var(--text-muted);font-weight:800;min-width:110px;">${label}</span>
			<span style="text-align:right;color:var(--navy);font-weight:600;flex:1;">${value}</span>
		</div>
	`;
	const statusRow = (label, value, extra = '') => `
		<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:12px;background:linear-gradient(180deg,#ffffff 0%, #f8fbff 100%);border:1px solid #d9e4fb;">
			<div>
				<div style="font-size:.82rem;font-weight:800;color:var(--navy);">${label}</div>
				${extra ? `<div style="margin-top:3px;font-size:.82rem;color:var(--text-muted);">${extra}</div>` : ''}
			</div>
			<div>${value}</div>
		</div>
	`;
	const sectionCard = (title, accent, body) => `
		<div style="padding:16px;border-radius:18px;border:1px solid ${accent}26;background:linear-gradient(180deg,#ffffff 0%, #f8fbff 100%);box-shadow:0 14px 30px rgba(15,37,88,.06);height:100%;">
			<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;">
				<h6 style="margin:0;font-size:1rem;font-weight:900;color:var(--navy);">${title}</h6>
				<span style="width:10px;height:10px;border-radius:999px;background:${accent};box-shadow:0 0 0 6px ${accent}18;"></span>
			</div>
			<div style="display:grid;gap:0;">${body}</div>
		</div>
	`;

	content.innerHTML = `
		<div style="display:grid;gap:18px;">
			<div style="padding:18px 18px 16px;border-radius:20px;background:linear-gradient(135deg,#edf4ff 0%, #ffffff 100%);border:1px solid #d8e5ff;box-shadow:0 16px 34px rgba(15,37,88,.07);">
				<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
					<div>
						<h5 style="margin:0 0 6px;font-size:1.55rem;font-weight:900;color:var(--navy);">${y.name}</h5>
						<div style="display:flex;flex-wrap:wrap;gap:8px;">
							<span style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#ffffff;border:1px solid #d9e4fb;color:#1f4ea3;font-weight:800;font-size:.84rem;">${y.sex || 'Unknown'}</span>
							<span style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#ffffff;border:1px solid #d9e4fb;color:#1f4ea3;font-weight:800;font-size:.84rem;">${d.civil_status || 'No civil status'}</span>
							<span style="display:inline-flex;align-items:center;padding:6px 10px;border-radius:999px;background:#ffffff;border:1px solid #d9e4fb;color:#1f4ea3;font-weight:800;font-size:.84rem;">Age ${y.age ?? 'N/A'}</span>
						</div>
					</div>
					<div style="display:inline-flex;flex-direction:column;align-items:flex-end;padding:12px 14px;border-radius:16px;background:#ffffff;border:1px solid #d9e4fb;min-width:165px;">
						<span style="font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted);font-weight:800;">Assigned Barangay</span>
						<span style="margin-top:4px;font-size:1.08rem;line-height:1.2;font-weight:900;color:#1f4ea3;text-align:right;">${d.barangay_name || y.barangay_name || getBarangayNameById(d.barangay_id) || 'N/A'}</span>
					</div>
				</div>
			</div>

			<div class="row g-3">
				<div class="col-md-6">
					${sectionCard('Personal Information', '#1f4ea3', `
						${detailRow('Birthdate', d.birthdate || 'N/A')}
						${detailRow('Purok', d.purok || 'N/A')}
						${detailRow('Municipality', d.municipality || 'Manolo Fortich')}
						${detailRow('Religion', d.religion || 'N/A')}
						${detailRow('Contact', d.contact_number || 'N/A')}
						${detailRow('Email', d.email || 'N/A')}
					`)}
				</div>
				<div class="col-md-6">
					${sectionCard('Education & Work', '#0f8a5f', `
						${detailRow('Level', y.education_level || 'N/A')}
						${detailRow('Course', d.course || 'N/A')}
						${detailRow('School', d.school_name || 'N/A')}
						${detailRow('Scholar', `${fmt(d.is_scholar)} <span style="color:var(--text-muted);font-weight:600;">${d.scholarship_program ? `(${d.scholarship_program})` : '(N/A)'}</span>`)}
						${detailRow('Company', d.employment_company_name || 'N/A')}
						${detailRow('Company Address', d.employment_company_address || 'N/A')}
						${detailRow('Work Status', d.work_status || 'N/A')}
						${detailRow('Sports', fmtList(d.sports_preferences, d.sports_preference_other, 'Other'))}
						${detailRow('Competition Levels', fmtList(d.sports_competition_levels || [], '', ''))}
						${detailRow('Talents', fmtList(d.talent_preferences, d.talent_preference_other, 'Other'))}
					`)}
				</div>
			</div>

			<div class="row g-3">
				<div class="col-md-4">
					${sectionCard('Classifications', '#d97706', `
						${statusRow('In School', fmt(d.is_in_school))}
						${statusRow('OSY', fmt(d.is_osy))}
						${statusRow('Working Youth', fmt(d.is_working_youth))}
						${statusRow('Unemployed Youth', fmt(d.is_unemployed || d.is_unemployed_youth))}
						${statusRow('4Ps Beneficiary', fmt(d.is_4ps), `Children: ${d.number_of_children || 0}`)}
					`)}
				</div>
				<div class="col-md-4">
					${sectionCard('Special Needs / Group', '#7c3aed', `
						${statusRow('PWD', fmt(d.is_pwd), d.disability_type || 'None')}
						${statusRow('Specific Needs', fmt(d.has_specific_needs), d.specific_needs_condition || 'None')}
						${statusRow('IP / 7 Tribes', fmt(d.is_ip), d.tribe_name || 'N/A')}
						${statusRow('Muslim', fmt(d.is_muslim), d.muslim_group || 'N/A')}
					`)}
				</div>
				<div class="col-md-4">
					${sectionCard('Civic / Others', '#e11d48', `
						${statusRow('SK Voter', fmt(d.registered_voter_sk))}
						${statusRow('National Voter', fmt(d.registered_voter_national))}
						${statusRow('Non-Voter', fmt(d.is_non_voter))}
						${statusRow('Voted Last SK', fmt(d.voted_last_sk))}
						${statusRow('Attended KK', fmt(d.attended_kk_assembly), `${d.kk_assembly_times || 0} time(s)`)}
					`)}
				</div>
			</div>

			<div class="row g-3">
				<div class="col-12">
					${sectionCard('Organizations Joined', '#2563eb', `
						<div style="display:flex;flex-wrap:wrap;gap:8px;padding-top:4px;">
							${chipList(d.organizations_joined || [])}
						</div>
					`)}
				</div>
			</div>
		</div>
	`;
    
	new bootstrap.Modal(document.getElementById('summaryModal')).show();
}


window.openBarangay = openBarangay;
window.showDashboard = showDashboard;
window.showAdminAccountSection = showAdminAccountSection;
window.showLoginModal = showLoginModal;
window.handleAuth = handleAuth;
window.showBarangayAccountNotice = showBarangayAccountNotice;
window.closeBarangayAccountNotice = closeBarangayAccountNotice;
window.togglePasswordField = togglePasswordField;
window.logout = logout;
window.openModal = openModal;
window.editYouth = editYouth;
window.deleteYouth = deleteYouth;
window.viewFullSummary = viewFullSummary;
window.saveYouth = saveYouth;
window.toggleOSY = toggleOSY;
window.downloadBarangaySummaryCSV = downloadBarangaySummaryCSV;
window.downloadBarangaySummaryPDF = downloadBarangaySummaryPDF;
window.downloadAllBarangaySummaryPDF = downloadAllBarangaySummaryPDF;
window.disableBarangayAccount = disableBarangayAccount;
window.enableBarangayAccount = enableBarangayAccount;
window.openAdminAccountModal = openAdminAccountModal;
window.submitAdminAccountForm = submitAdminAccountForm;

