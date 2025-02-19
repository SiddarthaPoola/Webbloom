"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binDates = binDates;
const date_fns_1 = require("date-fns");
function binDates(_list) {
    const list = _list.toSorted((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
    const binLookup = {};
    const bins = [];
    list.forEach((item) => {
        const category = dateCategory(new Date(item.timestamp));
        if (!(category in binLookup)) {
            const bin = {
                category,
                items: [item],
            };
            binLookup[category] = bin;
            bins.push(bin);
        }
        else {
            binLookup[category].items.push(item);
        }
    });
    return bins;
}
function dateCategory(date) {
    if ((0, date_fns_1.isToday)(date)) {
        return 'Today';
    }
    if ((0, date_fns_1.isYesterday)(date)) {
        return 'Yesterday';
    }
    if ((0, date_fns_1.isThisWeek)(date)) {
        // e.g., "Monday"
        return (0, date_fns_1.format)(date, 'eeee');
    }
    const thirtyDaysAgo = (0, date_fns_1.subDays)(new Date(), 30);
    if ((0, date_fns_1.isAfter)(date, thirtyDaysAgo)) {
        return 'Last 30 Days';
    }
    if ((0, date_fns_1.isThisYear)(date)) {
        // e.g., "July"
        return (0, date_fns_1.format)(date, 'MMMM');
    }
    // e.g., "July 2023"
    return (0, date_fns_1.format)(date, 'MMMM yyyy');
}
