
document.addEventListener("DOMContentLoaded", function() {
    // Function to count characters in a string
    function countCharacters(str) {
        return str.length;
    }

    // Function to count words in a string
    function countWords(str) {
        return str.split(/\s+/).filter(Boolean).length; // Split by whitespace and filter out empty strings
    }

    // Function to estimate tokens using characters
    function estimateTokens(charCount) {
        return Math.ceil(charCount / 4);
    }

    // Function to initialize the widget for a given widget container element
    function initializeWidget(widgetContainer) {
        // Retrieve the associated livePreview element using the data attribute
        const livePreviewID = widgetContainer.getAttribute("data-livepreview");
        const livePreviewElem = document.getElementById(livePreviewID);
        
        if (!livePreviewElem) {
            console.error("No livePreview element found with ID: " + livePreviewID);
            return;
        }
        
        // Populate the widgetContainer with the adjusted widget's content
        const widget_template_adjusted = `
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">Token Estimate</h5>
					<p>Rough estimate of tokens at 4 characters/token. See <a href="https://platform.openai.com/tokenizer">OpenAI tokenizer</a> for a closer estimate. On the ChatGPT app, GPT 3-5 will accept about 10,500 tokens, and GPT-4 about 5,000.</p>
					<div class="row mb-3">
						<div class="col-md-6">
							<strong>Character Count:</strong> <span id="charCount">0</span>
						</div>
						<div class="col-md-6">
							<strong>Word Count:</strong> <span id="wordCount">0</span>
						</div>
					</div>
					<div class="row mb-3">
						<div class="col-md-6">
							<strong>Token Estimate:</strong> <span id="tokenEstimate">0</span>
						</div>
						<div class="col-md-6">
							<div class="form-group form-inline">
								<label for="maxTokenInput"><strong>Maximum Tokens:</strong></label>
								<input id="maxTokenInput" type="number" class="form-control form-control-sm ml-2" value="2000" style="width: 100px;">
							</div>
						</div>
					</div>
					<div class="alert alert-danger" id="tokenWarning" style="display: none;"></div>
					<button id="copyButton" class="btn btn-primary">Copy Prompt</button>
				</div>
			</div>

        `;
        
        widgetContainer.innerHTML = widget_template_adjusted;
        
        const charCountElem = widgetContainer.querySelector("#charCount");
        const wordCountElem = widgetContainer.querySelector("#wordCount");
        const tokenEstimateElem = widgetContainer.querySelector("#tokenEstimate");
        const maxTokenInputElem = widgetContainer.querySelector("#maxTokenInput");
        const warningElem = widgetContainer.querySelector("#tokenWarning");
        const copyButtonElem = widgetContainer.querySelector("#copyButton");

        // Update the widget's display
        function updateDisplay() {
            const content = livePreviewElem.textContent;
            const charCount = countCharacters(content);
            const wordCount = countWords(content);
            const tokenEstimate = estimateTokens(charCount);
            const maxTokens = parseInt(maxTokenInputElem.value, 10);

            charCountElem.textContent = charCount;
            wordCountElem.textContent = wordCount;
            tokenEstimateElem.textContent = tokenEstimate;

            // Display warning if token estimate exceeds the maximum
            if (tokenEstimate > maxTokens) {
                warningElem.style.display = "block";
                warningElem.textContent = "Warning: Token count exceeds maximum by " + (tokenEstimate - maxTokens);
            } else {
                warningElem.style.display = "none";
            }
        }

        // Attach event listener to livePreview element to detect changes in its content
        new MutationObserver(updateDisplay).observe(livePreviewElem, { childList: true, characterData: true, subtree: true });

        // Attach event listener to maxToken input to detect changes
        maxTokenInputElem.addEventListener("input", updateDisplay);

        // Attach event listener to copy button
        copyButtonElem.addEventListener("click", () => {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(livePreviewElem);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("copy");
            selection.removeAllRanges();
            
            // Display browser message indicating the content has been copied
            alert("Content copied to clipboard!");
        });

        // Initial update
        updateDisplay();
    }

    // Automatically search for any <div id="countWidget"></div> on the page and initialize the widget inside it
    const widgetContainers = document.querySelectorAll("#countWidget");
    for (const widgetContainer of widgetContainers) {
        initializeWidget(widgetContainer);
    }
    
    // Attach event listener to the test input field to populate the livePreview and trigger an update
    const testInputElem = document.getElementById("testInput");
    if (testInputElem) {
        testInputElem.addEventListener("input", function() {
            const livePreviewElem = document.getElementById(this.getAttribute("data-livepreview"));
            if (livePreviewElem) {
                livePreviewElem.textContent = this.value;
            }
        });
    }
});
