// Placeholder for templates in case the fetch fails
const fallbackTemplates = [
    {
        "name": "analysis_memo",
        "label": "Analysis memorandum",
        "fields": {
            "role": "an expert researcher",
            "task": "analyze this text",
            "instructions": "1) set out each step logically and thoroughly\n2) cite your sources using the above text",
            "format": "# Overview\n\n# Issues\n\n# Analysis"
        }
    }
];

// Function to populate the individual input fields based on the selected template
function populateInputFields(templateName, templates) {
    const selectedTemplate = templates.find(template => template.name === templateName);
    if (selectedTemplate) {
        document.getElementById('roleInput').value = selectedTemplate.fields.role;
        document.getElementById('taskInput').value = selectedTemplate.fields.task;
        document.getElementById('instructionsInput').value = selectedTemplate.fields.instructions;
        document.getElementById('formatInput').value = selectedTemplate.fields.format;
    }
}

// Function to update the live preview based on the input values
function updateLivePreview() {
    const roleValue = document.getElementById('roleInput').value;
    const taskValue = document.getElementById('taskInput').value;
    const instructionsValue = document.getElementById('instructionsInput').value;
    const formatValue = document.getElementById('formatInput').value;
    const descriptionOfSourceValue = document.getElementById('descriptionOfSourceInput').value;
    const sourceTextValue = document.getElementById('sourceTextInput').value;
    
    const promptText = "You are " + roleValue + ".\n\n" +
        "Your task is to " + taskValue + ".\n\n" +
        "Here is " + descriptionOfSourceValue + ":\n\n\`\`\`\n" + 
        sourceTextValue + "\n\`\`\`\n\n" +
        "As a reminder, your task is to " + taskValue + 
        ". In completing this task, carefully follow these instructions:\n" + 
        instructionsValue + "\n\n" +
        "Use the following format:\n" + formatValue;
    
    const livePreview = document.getElementById('livePreview');
    livePreview.textContent = promptText;
}

// Logic to handle templates, either from fetched JSON or fallback
function handleTemplates(templates) {
    // Populate the template dropdown
    const templateDropdown = document.getElementById('templateDropdown');
    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.name;
        option.text = template.label;
        templateDropdown.appendChild(option);
    });
    
    // Populate the individual input fields based on the selected template
    populateInputFields(templateDropdown.value, templates);
    
    // Update live preview when any dropdown or input changes
    document.getElementById('templateDropdown').addEventListener('change', function() {
        populateInputFields(this.value, templates);
        updateLivePreview();
    });
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', updateLivePreview);
    });
    
    // Initialize the live preview
    updateLivePreview();
}

// Attach event listeners after the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Fetch the templates from the JSON file
    fetch('assets/json/analysis-template.json')
        .then(response => response.json())
        .then(handleTemplates)
        .catch(error => {
            console.warn('Error loading templates from JSON. Using fallback templates:', error);
            handleTemplates(fallbackTemplates);
        });
});
