const speed = 3;
const resolution = 20;
const width = 800;

const sunX = width / 2 + 15;
const sunY = 315;

const marsData = {
    perihelion: 207,
    aperihelion: 249,
    longitude: 336,
    year: 686.98
};

const earthData = {
    perihelion: 147,
    aperihelion: 152,
    longitude: 102,
    year: 365.25
};

let _year = 2002;
let _day = 239.75;

const earthAngle = 336.05;
const marsAngle = 146.25;

const scalingFactor = 0.75;

const cos = angle => Math.cos(angle * (Math.PI / 180));
const sin = angle => Math.sin(angle * (Math.PI / 180));

const Planet = function(data, angle) {
    this.year = data.year;

    const focusDist =
        (scalingFactor * (data.aperihelion - data.perihelion)) / 2;

    const major = scalingFactor * data.aperihelion - focusDist;
    const minor = Math.sqrt(major * major - focusDist * focusDist);

    const phi = data.longitude;
    const cosPhi = cos(phi);
    const sinPhi = sin(phi);

    this.setupAngle = function() {
        this.angle = angle - phi;
    };

    this.setupAngle();

    const cx = sunX - focusDist * cosPhi;
    const cy = sunY + focusDist * sinPhi;

    const eccentricity = focusDist / major;
    const angleConstant = (360 * major * minor) / data.year;

    this.update = function(days) {
        const sign = days < 0 ? -1 / resolution : 1 / resolution;

        for (let d = 0; d < Math.abs(days) * resolution; d++) {
            const r =
                (major * (1 - eccentricity * eccentricity)) /
                (1 + eccentricity * cos(this.angle));

            this.angle += (sign * angleConstant) / (r * r);
        }

        const r =
            (major * (1 - eccentricity * eccentricity)) /
            (1 + eccentricity * cos(this.angle));

        const x = r * cos(this.angle) + focusDist;
        const y = r * sin(this.angle);

        this.x = cx + x * cosPhi - y * sinPhi;
        this.y = cy - x * sinPhi - y * cosPhi;
    };
    this.update(0);
};

const mars = new Planet(marsData, marsAngle);
const earth = new Planet(earthData, earthAngle);
const bodies = [earth, mars];

const months = {
    January: 31,
    February: 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31
};

const isLeapYear = y => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);

const dayToDate = (d, y) => {
    for (const m in months) {
        let days = months[m];
        if (m === 'February' && isLeapYear(y)) {
            days++;
        }
        if (d <= days) {
            return [d, m];
        } else {
            d -= days;
        }
    }
};

const convertDayToYear = days => {
    let y = 0;

    if (days > 365) {
        while (true) {
            const n = 365 + isLeapYear(_year + y);
            if (days > n) {
                days -= n;
                y++;
            } else {
                break;
            }
        }
    } else if (days < 0) {
        while (true) {
            if (days < 0) {
                const n = 365 + isLeapYear(_year - 1 - y);
                days += n;
                y--;
            } else {
                break;
            }
        }
    }

    return [y, days];
};

const updateDate = days => {
    _day += days;
    const y = convertDayToYear(_day);
    _day = y[1];
    _year += y[0];
};

const changeDay = change => {
    for (let i = 0; i < bodies.length; i++) {
        if (change > 0) {
            const years = Math.floor(change / bodies[i].year);
            const days = change - bodies[i].year * years;
            bodies[i].update(days);
        } else {
            const years = Math.floor(-change / bodies[i].year);
            const days = -change - bodies[i].year * years;
            bodies[i].update(bodies[i].year - days);
        }
    }
    updateDate(change);
};

const setYear = newYear => changeDay((newYear - _year) * 365.25);

const setup = () => {
    earth.setupAngle();
    mars.setupAngle();
    _year = 2002;
    _day = 239.75;
    setYear(1876);
};

const getKM = d => Math.round((10 * d) / scalingFactor) / 10;

const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

let d = dist(mars.x, mars.y, earth.x, earth.y);

const recordDistance = () => {
    d = dist(mars.x, mars.y, earth.x, earth.y);
};

const draw = () => {
    for (let i = 0; i < speed; i++) {
        changeDay(1);
        recordDistance();
    }
};

onmessage = ({ data }) => {
    const { numPoints } = data;

    setup();

    const newData = Array.from({ length: numPoints }).map(() => {
        draw();

        const dayMonth = dayToDate(Math.round(_day), _year);
        // d3 date parser, and built in date behave differently, so have to do
        // this. With d3 it is just d3.timeParse('%d %B %Y').
        let date;
        if (dayMonth[0] === 0 && dayMonth[1] === 'January') {
            date = new Date(`31 December ${_year - 1}`);
        } else {
            date = new Date(`${dayMonth[0]} ${dayMonth[1]} ${_year}`);
        }

        return {
            distance: Math.round(getKM(d)),
            date
        };
    });

    postMessage(newData);
};
