function showTab(tabId) {
    const tabs = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.style.display = "none";
    });

    document.getElementById(tabId).style.display = "block";
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
        if (typeof event === "string") {
            return `<li>${event}</li>`;
        }
        return `<li>${event.title || event.event || JSON.stringify(event)}</li>`;
    }).join("");

showTab("tasks");

    } catch (error) {

        console.error(error);

        alert(
            "Backend error. Check server terminal."
        );
    }
}