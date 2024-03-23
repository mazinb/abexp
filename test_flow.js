const conversationFlow = [
    //test first step
    `console.log('test step')
    const question = "Do you want to continue?";
    const options = ["Yes", "No"];
    console.log(question)`,
    // Step 1: Ask the initial question
    `async function step1() {
        console.log('in step 1');
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

const conversationFlow2 = [
    {
      question: "Do you want to continue?",
      options: [
        {
          text: "Yes",
          next: 1 // Index of the next step in the conversation flow array
        },
        {
          text: "No",
          next: 3 // Index of the next step in the conversation flow array
        }
      ]
    },
    {
      question: "What's your favorite color?",
      options: [
        {
          text: "Blue",
          next: 2
        },
        {
          text: "Red",
          next: 2
        }
      ]
    },
    {
      question: "What's your favorite animal?",
      options: [
        {
          text: "Dog",
          next: 4
        },
        {
          text: "Cat",
          next: 4
        }
      ]
    },
    {
      answer: "You chose to continue."
    },
    {
      answer: "You chose to stop."
    },
    {
      answer: "Your favorite color is Blue."
    },
    {
      answer: "Your favorite color is Red."
    },
    {
      answer: "Your favorite animal is Dog."
    },
    {
      answer: "Your favorite animal is Cat."
    }
  ];  

//Needed for jest tests
module.exports = conversationFlow2;
