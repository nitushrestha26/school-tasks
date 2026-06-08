function showTab(tabId) {
    const tabs = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.style.display = "none";
    });

    document.getElementById(tabId).style.display = "block";
}

function createGoogleCalendarLink(title) {
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="
        + encodeURIComponent(title);
}

async function parseEmail() {

    const email =
        document.getElementById("email-box").value;

    try {

        const response = await fetch(
    "https://school-tasks.onrender.com/extract-tasks",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email
        })
    }
);
        const data = await response.json();

        let cleanText = data.result
    .replace("```json", "")
    .replace("```", "")
    .trim();

const parsed = JSON.parse(cleanText);

console.log(parsed);


document.getElementById("task-list").innerHTML =
    parsed.tasks.map(task => {
        if (typeof task === "string") {
            return `<li>${task}</li>`;
        }
        return `<li>${task.title || task.task || JSON.stringify(task)}</li>`;
    }).join("");

document.getElementById("calendar-list").innerHTML =
    parsed.calendar.map(event => {
        const link = createGoogleCalendarLink(event);


        return `
            <li>
            ${event}
            <a href="${link}" target="_blank">
                Add to Calendar
            </a>
        </li>
        ';
    }).join("");

showTab("tasks");

    } catch (error) {

        console.error(error);

        alert(
            "Backend error. Check server terminal."
        );
    }
}