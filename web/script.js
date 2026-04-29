// ---- SLIDE NAVIGATION ----

let currentSlide = 0;
const totalSlides = 9;

function changeSlide(direction) {
    // hide current slide
    document.getElementById("slide-" + currentSlide).style.display = "none";

    // update slide number
    currentSlide += direction;

    // boundary check
    if (currentSlide < 0) currentSlide = 0;
    if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;

    // show new slide
    document.getElementById("slide-" + currentSlide).style.display = "flex";

    // update page indicator
    document.getElementById("page-text").textContent = (currentSlide + 1) + " / " + totalSlides;

    // hide/show prev/next buttons at boundaries
    document.getElementById("prev-btn").style.visibility = currentSlide === 0 ? "hidden" : "visible";
    document.getElementById("next-btn").style.visibility = currentSlide === totalSlides - 1 ? "hidden" : "visible";
}

// ---- LOAD DATA.JSON AND FILL EVERYTHING ----

fetch("../data.json")
    .then(response => response.json())
    .then(data => {

        const group = data.group_stats;
        const people = data.per_person;
        const names = Object.keys(people);

        // ---- SLIDE 0: total messages + total words ----
        let totalMsgs = 0;
        let totalWrds = 0;
        for (let name of names) {
            totalMsgs += people[name].total_messages;
            totalWrds += people[name].total_words;
        }
        document.getElementById("total-messages").textContent = totalMsgs.toLocaleString();
        document.getElementById("total-words").textContent = totalWrds.toLocaleString();

        // ---- SLIDE 1: awards ----
        document.getElementById("nightowl").textContent = group.night_owl;
        document.getElementById("ghost").textContent = group.ghost;
        document.getElementById("hype").textContent = group.hype_person;
        document.getElementById("burst").textContent = group.max_burster;

        // ---- SLIDE 2: busiest day ----
        document.getElementById("busiest-day-date").textContent = group.busiest_day;
        document.getElementById("busiest-day-count").textContent = group.busiest_day_count;

        // ---- SLIDE 3: active hours bar chart ----
        // count messages per hour across all people
        // note: we don't have hourly breakdown in json so we use night_owl_messages as proxy
        // instead build a messages per person bar chart
        const activeHoursCtx = document.getElementById("activeHoursChart").getContext("2d");
        new Chart(activeHoursCtx, {
            type: "bar",
            data: {
                labels: names,
                datasets: [{
                    label: "Total Messages",
                    data: names.map(n => people[n].total_messages),
                    backgroundColor: "#1DB954",
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { color: "#fff" }, grid: { color: "#333" } },
                    x: { ticks: { color: "#fff" }, grid: { color: "#333" } }
                }
            }
        });

        // ---- SLIDE 4: conversation starters chart ----
        const startersCtx = document.getElementById("startersChart").getContext("2d");
        new Chart(startersCtx, {
            type: "bar",
            data: {
                labels: names,
                datasets: [{
                    label: "Conversation Starts",
                    data: names.map(n => people[n].conversation_starts),
                    backgroundColor: "#1DB954",
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { color: "#fff" }, grid: { color: "#333" } },
                    x: { ticks: { color: "#fff" }, grid: { color: "#333" } }
                }
            }
        });

        // ---- SLIDE 5: global top emojis ----
        // collect all emojis across all people and count them
        const globalEmojiCount = {};
        for (let name of names) {
            for (let emoji of people[name].top_emojis) {
                if (!globalEmojiCount[emoji]) globalEmojiCount[emoji] = 0;
                globalEmojiCount[emoji]++;
            }
        }

        // sort and take top 6
        const sortedEmojis = Object.keys(globalEmojiCount).sort(
            (a, b) => globalEmojiCount[b] - globalEmojiCount[a]
        ).slice(0, 6);

        const emojiGrid = document.getElementById("global-emojis");
        for (let emoji of sortedEmojis) {
            const box = document.createElement("div");
            box.className = "emoji-box";
            box.textContent = emoji;
            emojiGrid.appendChild(box);
        }

        // ---- SLIDE 6: longest silence ----
        document.getElementById("silence-text").textContent =
            group.longest_silence_hours + " hours  (" + group.longest_silence_from + " → " + group.longest_silence_to + ")";

        // silence bar chart - messages per person as comparison
        const silenceCtx = document.getElementById("silenceChart").getContext("2d");
        new Chart(silenceCtx, {
            type: "bar",
            data: {
                labels: names,
                datasets: [{
                    label: "Night Owl Messages (12am-4am)",
                    data: names.map(n => people[n].night_owl_messages),
                    backgroundColor: "#9b59b6",
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: "#fff" } } },
                scales: {
                    y: { ticks: { color: "#fff" }, grid: { color: "#333" } },
                    x: { ticks: { color: "#fff" }, grid: { color: "#333" } }
                }
            }
        });

        // ---- SLIDE 7: response time chart ----
        const responseCtx = document.getElementById("responseTimeChart").getContext("2d");
        new Chart(responseCtx, {
            type: "bar",
            data: {
                labels: names,
                datasets: [{
                    label: "Avg Response Time (mins)",
                    data: names.map(n => people[n].avg_response_time || 0),
                    backgroundColor: "#e74c3c",
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { ticks: { color: "#fff" }, grid: { color: "#333" } },
                    x: { ticks: { color: "#fff" }, grid: { color: "#333" } }
                }
            }
        });

        // ---- SLIDE 8: profile selector ----
        const nameGrid = document.getElementById("name-grid");

        for (let name of names) {
            const btn = document.createElement("button");
            btn.className = "name-btn";
            btn.textContent = name;
            btn.onclick = () => showProfile(name, people[name]);
            nameGrid.appendChild(btn);
        }

        // back button
        document.getElementById("back-to-grid").onclick = () => {
            document.getElementById("single-profile-view").classList.add("hidden-view");
            document.getElementById("profile-selector-view").classList.remove("hidden-view");
        };

    });

// ---- SHOW INDIVIDUAL PROFILE ----

let profileChartInstance = null;

function showProfile(name, stats) {
    // switch views
    document.getElementById("profile-selector-view").classList.add("hidden-view");
    document.getElementById("single-profile-view").classList.remove("hidden-view");

    // fill in stats
    document.getElementById("ind-name").textContent = name;
    document.getElementById("ind-msg").textContent = stats.total_messages;
    document.getElementById("ind-words").textContent = stats.total_words;
    document.getElementById("ind-resp").textContent =
        stats.avg_response_time ? stats.avg_response_time + " mins" : "N/A";

    // destroy old chart if exists
    if (profileChartInstance) profileChartInstance.destroy();

    // draw personal stats bar chart
    const ctx = document.getElementById("profileTimeChart").getContext("2d");
    profileChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Messages", "Words", "Convo Starts", "Night Owl Msgs", "Max Streak"],
            datasets: [{
                label: name,
                data: [
                    stats.total_messages,
                    stats.total_words,
                    stats.conversation_starts,
                    stats.night_owl_messages,
                    stats.max_consecutive_streak
                ],
                backgroundColor: "#1DB954",
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { ticks: { color: "#fff" }, grid: { color: "#333" } },
                x: { ticks: { color: "#fff" }, grid: { color: "#333" } }
            }
        }
    });
}

// ---- INIT: show only first slide on load ----
window.onload = () => {
    // hide all slides except first
    for (let i = 1; i < totalSlides; i++) {
        document.getElementById("slide-" + i).style.display = "none";
    }
    document.getElementById("prev-btn").style.visibility = "hidden";
};