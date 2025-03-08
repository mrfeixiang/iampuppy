const conversations = {
    intro: {
        text: "Welcome to IAmPuppy! Let’s feed your new friend. What do you choose?",
        choices: [
            { text: "Dry Kibble", next: "kibble" },
            { text: "Wet Food", next: "wetFood" },
            { text: "Treats", next: "treats" }
        ]
    },
    kibble: {
        text: "Good choice! Kibble fills hunger but needs water. Let’s talk walks next...",
        next: "walk"
    },
    wetFood: {
        text: "Wet food is yummy and hydrating, but messy. Let’s talk walks next...",
        next: "walk"
    },
    treats: {
        text: "Treats boost happiness, but don’t overdo it. Let’s talk walks next...",
        next: "walk"
    },
    walk: {
        text: "Walks keep your puppy happy and fit. Want to take one now?",
        choices: [
            { text: "Yes", action: "startWalk" },
            { text: "No", next: "clean" }
        ]
    },
    clean: {
        text: "Puppies make messes! Time to clean pee and poop?",
        choices: [
            { text: "Yes", action: "startClean" },
            { text: "No", next: "travel" }
        ]
    },
    travel: {
        text: "You’re leaving for travel. Who cares for your puppy?",
        choices: [
            { text: "Pet Sitter", next: "sitter" },
            { text: "Boarding", next: "boarding" },
            { text: "Friend", next: "friend" }
        ]
    }
};

let currentConversation = 'intro';

function displayConversation() {
    const convo = conversations[currentConversation];
    document.getElementById('dialogue').textContent = convo.text;
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    if (convo.choices) {
        convo.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.onclick = () => handleChoice(choice);
            choicesDiv.appendChild(button);
        });
    }
}

function handleChoice(choice) {
    if (choice.next) {
        currentConversation = choice.next;
        displayConversation();
    } else if (choice.action === "startWalk") {
        // Start walk mini-game (implement in game.js)
    } else if (choice.action === "startClean") {
        // Start clean mini-game (implement in game.js)
    }
}
