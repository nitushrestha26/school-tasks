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
    const email = document.getElementById("email-box").value;

    if (!email.trim()) {
        alert("Please paste an email first.");
        return;
    }

    document.getElementById("task-list").innerHTML =
        "<li>Processing email...</li>";

    showTab("tasks");

    try {
        const response = await fetch(
            "https://school-tasks.onrender.com/extract-tasks",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            }
        );

        const data = await response.json();

        let cleanText = data.result
            .replace("```json", "")
            .replace("```", "")
            .trim();
        
        console.log("AI result:", data.result);
        
        const parsed = JSON.parse(cleanText);

        document.getElementById("task-list").innerHTML =
            parsed.tasks.map(task => `<li>${task}</li>`).join("");

        document.getElementById("calendar-list").innerHTML =
            parsed.calendar.map(event => {
                const link = createGoogleCalendarLink(event);
                return `<li>${event} <a href="${link}" target="_blank">Add to Calendar</a></li>`;
            }).join("");

    } catch (error) {
        console.error(error);

        document.getElementById("task-list").innerHTML =
            `<li>Error: ${error.message}</li>`;
    }
}