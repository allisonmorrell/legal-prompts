
// Define the data structure for presets
const templates = [
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
function populateInputFields(templateName) {
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

// Function to implement the copy to clipboard functionality
function copyToClipboard() {
    const livePreview = document.getElementById('livePreview');
    const textArea = document.createElement('textarea');
    textArea.value = livePreview.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Content copied to clipboard!');
}


// Function to check the word count
function checkWordCount() {
    const maxWords = parseInt(document.getElementById('maxWordsInput').value);
    const sourceText = document.getElementById('sourceTextInput').value;
    const wordCount = sourceText.split(/\s+/).filter(Boolean).length; // Count non-empty words
    
    const wordCountWarning = document.getElementById('wordCountWarning');
    if (wordCount > maxWords) {
        wordCountWarning.textContent = `Warning: Word count exceeds maximum (${wordCount}/${maxWords})`;
        wordCountWarning.style.color = 'red';
    } else {
        wordCountWarning.textContent = '';
    }
}

// Attach event listeners
document.getElementById('sourceTextInput').addEventListener('input', checkWordCount);
document.getElementById('maxWordsInput').addEventListener('input', checkWordCount);

// Call the function once to initialize
checkWordCount();



// Attach event listeners after the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Populate the template dropdown
    const templateDropdown = document.getElementById('templateDropdown');
    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.name;
        option.text = template.label;
        templateDropdown.appendChild(option);
    });
    
    // Populate the individual input fields based on the selected template
    populateInputFields(templateDropdown.value);
    
    // Update live preview when any dropdown or input changes
    document.getElementById('templateDropdown').addEventListener('change', function() {
        populateInputFields(this.value);
        updateLivePreview();
    });
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', updateLivePreview);
    });
    
    // Copy content to clipboard when the button is clicked
    document.getElementById('copyButton').addEventListener('click', copyToClipboard);
    
    // Initialize the live preview
    updateLivePreview();
});
