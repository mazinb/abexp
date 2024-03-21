const conversationFlow = [
    // Step 1: Ask the initial question
    `async function step1() {
        const question = "Do you want to continue?";
        const options = ["Yes", "No"];
        return { question, options };
    }`,

    // Step 2: Process user's response and determine next step
    `async function step2(response) {
        if (response === "Yes") {
            return 'next'; // Move to the next step
        } else if (response === "No") {
            return 4; // Go to step 4
        } else {
            return 'Invalid response. Please select "Yes" or "No".';
        }
    }`,

    // Step 3: Next step
    `async function step3() {
        // This step could be asking another question or performing some action
        return 'next';
    }`,

    // Step 4: Go to this step if user selected "No"
    `async function step4() {
        return "No selected";
    }`
];
