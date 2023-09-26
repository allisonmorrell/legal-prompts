function buildHTML(data) {
    const tocDiv = document.getElementById("toc");
    const contentDiv = document.querySelector(".col-md-10");

    for (const category in data.categories) {
        const categoryCard = document.createElement("div");
        categoryCard.className = "card mb-4";

        const categoryCardBody = document.createElement("div");
        categoryCardBody.className = "card-body";

        const categoryTitle = document.createElement("h2");
        categoryTitle.innerText = category.charAt(0).toUpperCase() + category.slice(1);
        categoryCardBody.appendChild(categoryTitle);

        // Add category name to the TOC
        const tocCategory = document.createElement("strong");
        tocCategory.innerText = categoryTitle.innerText;
        tocDiv.appendChild(tocCategory);
        tocDiv.appendChild(document.createElement("br"));

        // Create an unordered list for the prompts in the TOC
        const tocList = document.createElement("ul");

        for (const prompt of data.categories[category]) {
            const promptCard = document.createElement("div");
            promptCard.className = "card mb-3";  // Bootstrap card with margin-bottom

            const promptCardBody = document.createElement("div");
            promptCardBody.className = "card-body";

            const cardTitle = document.createElement("h5");
            cardTitle.className = "card-title";
            cardTitle.innerText = prompt.label;
            cardTitle.id = prompt.name;  // Setting the id for the card title
            promptCardBody.appendChild(cardTitle);

            // Add to the TOC as a list item
            const tocItem = document.createElement("li");
            const tocLink = document.createElement("a");
            tocLink.href = "#" + prompt.name;
            tocLink.innerText = prompt.label;
            tocItem.appendChild(tocLink);
            tocList.appendChild(tocItem);

            if (prompt.transcript_url) {
                const transcriptLink = document.createElement("a");
                transcriptLink.href = prompt.transcript_url;
                transcriptLink.innerText = "View Transcript";
                transcriptLink.target = "_blank";
                promptCardBody.appendChild(transcriptLink);
            }

            if (prompt.note) {
                const note = document.createElement("p");
                note.classList.add("note");
                note.style.fontStyle = "italic";
                note.innerText = "Note: " + prompt.note;
                promptCardBody.appendChild(note);
            }

            // Check if the prompt property is a string and convert it to an array if necessary
            const promptsArray = Array.isArray(prompt.prompt) ? prompt.prompt : [prompt.prompt];

            for (const promptText of promptsArray) {
                const inputGroupDiv = document.createElement("div");
                inputGroupDiv.className = "input-group mb-3";  // Bootstrap input group with margin-bottom

                const textarea = document.createElement("textarea");
                textarea.className = "form-control";
                textarea.value = promptText;
                inputGroupDiv.appendChild(textarea);

                const copyBtnDiv = document.createElement("div");
                copyBtnDiv.className = "input-group-append";  // Bootstrap class for appending button

                const copyBtn = document.createElement("button");
                copyBtn.className = "btn btn-primary";
                copyBtn.innerText = "Copy";
                copyBtn.onclick = function() {
                    textarea.select();
                    document.execCommand("copy");
                };

                copyBtnDiv.appendChild(copyBtn);
                inputGroupDiv.appendChild(copyBtnDiv);
                promptCardBody.appendChild(inputGroupDiv);  // Append to the card body
            }

            promptCard.appendChild(promptCardBody);
            categoryCardBody.appendChild(promptCard);
        }
        categoryCard.appendChild(categoryCardBody);
        contentDiv.appendChild(categoryCard);
        tocDiv.appendChild(tocList);
    }
}

window.onload = function() {
    // Fetch the JSON data from the specified URL
    fetch('assets/json/prompts.json')
        .then(response => response.json())
        .then(data => {
            // Call the buildHTML function with the fetched data
            buildHTML(data);
        })
        .catch(error => {
            console.error("Error fetching the JSON data:", error);
        });
};
