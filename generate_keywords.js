import fs from 'fs';
import path from 'path';

const prefixes = [
    "Buy", "Invest in", "Best", "Top", "Premium", "Luxury", "Price of",
    "New launch", "Upcoming", "RERA approved", "Number one", "Find", "Book"
];

const plotTypes = [
    "NA plots", "bungalow plots", "villa plots", "residential plots",
    "gated community plots", "NA bungalow plots", "IGBC Platinum plots",
    "township plots", "customizable plots", "non-agricultural plots"
];

const features = [
    "", "2000 sq ft", "3000 sq ft", "4000 sq ft", "5000 sq ft", "7000 sq ft",
    "large", "spacious", "corner", "east facing", "Vastu compliant"
];

const locations = [
    "in Pune", "in Bavdhan", "in Bavdhan Pune", "near Hinjewadi",
    "near Chandani Chowk", "within PMC limits", "near Kothrud",
    "in West Pune", "near Pune-Mumbai Expressway", "in Bavdhan hills"
];

const keywords = new Set();
// Add core targeted terms first
keywords.add("Kekarav Bavdhan");
keywords.add("Kekarav bungalow plots");
keywords.add("Number one NA Bungalow Plots in Pune");
keywords.add("Bavdhan NA plots");

for (const prefix of prefixes) {
    for (const type of plotTypes) {
        for (const feature of features) {
            for (const location of locations) {
                if (keywords.size >= 1000) break;

                let parts = [];
                if (prefix) parts.push(prefix);
                if (feature) parts.push(feature); // e.g. Buy 2000 sq ft
                if (type) parts.push(type);       // NA plots
                if (location) parts.push(location); // in Pune

                const phrase = parts.join(' ').replace(/\s+/g, ' ').trim();
                keywords.add(phrase);
            }
            if (keywords.size >= 1000) break;
        }
        if (keywords.size >= 1000) break;
    }
    if (keywords.size >= 1000) break;
}

const targetPath = path.join(process.cwd(), 'src/data');
if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
}

fs.writeFileSync(
    path.join(targetPath, 'keywords.json'),
    JSON.stringify(Array.from(keywords).slice(0, 1000), null, 2)
);

console.log(`Generated ${keywords.size} keywords! Saved to src/data/keywords.json`);
