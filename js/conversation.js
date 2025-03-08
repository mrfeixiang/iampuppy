const conversations = {
    intro: {
        text: "Welcome to IAmPuppy! I'm your virtual pet expert. Let's take care of your new puppy friend. What would you like to feed your puppy?",
        choices: [
            { text: "Dry Kibble", next: "kibble", action: "feed", params: { type: "kibble", hunger: -30, thirst: 10, happiness: 5 } },
            { text: "Wet Food", next: "wetFood", action: "feed", params: { type: "wet", hunger: -25, thirst: -15, happiness: 15 } },
            { text: "Treats", next: "treats", action: "feed", params: { type: "treats", hunger: -10, thirst: 5, happiness: 20 } }
        ]
    },
    kibble: {
        text: "Good choice! Kibble is nutritious and helps keep their teeth clean. Your puppy seems satisfied but looks thirsty. Would you like to give some water?",
        choices: [
            { text: "Give Water", action: "giveWater", next: "afterWater" },
            { text: "Skip Water", next: "walkQuestion" }
        ]
    },
    wetFood: {
        text: "Wet food is tasty and helps with hydration! Your puppy loves it. Now, let's talk about exercise.",
        next: "walkQuestion"
    },
    treats: {
        text: "Your puppy is excited about the treats! Remember, treats should make up no more than 10% of their diet. Let's think about some exercise next.",
        next: "walkQuestion"
    },
    afterWater: {
        text: "Great! Staying hydrated is important for your puppy. Now let's think about some exercise.",
        next: "walkQuestion"
    },
    walkQuestion: {
        text: "Regular walks keep your puppy healthy, happy, and help with training. Would you like to take your puppy for a walk?",
        choices: [
            { text: "Yes, Let's Go!", action: "startWalk", next: "afterWalk" },
            { text: "Not Now", next: "cleanQuestion" }
        ]
    },
    afterWalk: {
        text: "What a fun walk! Your puppy burned some energy and is much happier now.",
        next: "cleanQuestion"
    },
    cleanQuestion: {
        text: "Puppies need to be house-trained and cleaning up after them is important. There seems to be a mess. Would you like to clean it up?",
        choices: [
            { text: "Yes, Clean Now", action: "startClean", next: "afterClean" },
            { text: "Leave It", next: "travelQuestion", action: "skipClean" }
        ]
    },
    afterClean: {
        text: "Great job cleaning up! Keeping a clean environment helps with house training and hygiene.",
        next: "travelQuestion"
    },
    travelQuestion: {
        text: "You need to leave for a 3-day trip. What arrangements will you make for your puppy?",
        choices: [
            { text: "Hire Pet Sitter", next: "sitter", action: "travel", params: { type: "sitter" } },
            { text: "Use Boarding Service", next: "boarding", action: "travel", params: { type: "boarding" } },
            { text: "Ask a Friend", next: "friend", action: "travel", params: { type: "friend" } }
        ]
    },
    sitter: {
        text: "The pet sitter took great care of your puppy in familiar surroundings. Your puppy was happy to see you return!",
        next: "endDay"
    },
    boarding: {
        text: "The boarding facility was professional, but your puppy missed home. Still, all needs were well taken care of.",
        next: "endDay"
    },
    friend: {
        text: "Your friend did their best, but wasn't familiar with all your puppy's needs. Your puppy is happy to see you but needs some extra attention now.",
        next: "endDay"
    },
    endDay: {
        text: "You've completed your first day of puppy care! Let's check how you did.",
        action: "showSummary",
        choices: [
            { text: "Start a New Day", next: "intro", action: "resetDay" }
        ]
    }
};

// Global variable to store the current conversation node
let currentConversation = 'intro';

// Initialize conversation display when window loads
window.addEventListener('DOMContentLoaded', function() {
    // Wait a moment to ensure game.js has initialized
    setTimeout(displayConversation, 500);
});

// Function to display the current conversation and choices
function displayConversation() {
    const convo = conversations[currentConversation];
    const dialogueElement = document.getElementById('dialogue');
    const choicesDiv = document.getElementById('choices');
    
    // Ensure elements exist
    if (!dialogueElement || !choicesDiv) {
        console.error('Dialog or choices elements not found');
        return;
    }
    
    // Display the conversation text
    dialogueElement.textContent = convo.text;
    
    // Clear previous choices
    choicesDiv.innerHTML = '';
    
    // If there are choices, create buttons for each one
    if (convo.choices) {
        convo.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.onclick = () => handleChoice(choice);
            choicesDiv.appendChild(button);
        });
    } else if (convo.next) {
        // If there's a next conversation without choices, add a continue button
        const continueButton = document.createElement('button');
        continueButton.textContent = "Continue";
        continueButton.onclick = () => {
            currentConversation = convo.next;
            displayConversation();
        };
        choicesDiv.appendChild(continueButton);
    }
    
    // Perform any actions associated with this conversation node
    if (convo.action && typeof window[convo.action] === 'function') {
        window[convo.action](convo.params);
    }
}

// Function to handle a choice being selected
function handleChoice(choice) {
    // Perform any actions associated with this choice
    if (choice.action && typeof window[choice.action] === 'function') {
        window[choice.action](choice.params);
    }
    
    // Move to the next conversation if specified
    if (choice.next) {
        currentConversation = choice.next;
        displayConversation();
    }
}
