export const chooseRandomIndex = (arrayLength: number): number => {
    return Math.floor(Math.random() * arrayLength);
};

export const getRandomObjects = (numberOfObjectsToChoose: number, array: any[]) => {
    const numberOfObjects = Math.floor(Math.random() * numberOfObjectsToChoose) + 1; // Random number between 1 and array length
    const shuffledArray = array.sort(() => 0.5 - Math.random()); // Shuffle the array
    return shuffledArray.slice(0, numberOfObjects); // Take the first `numberOfObjects` elements
}

export const generateRandomEmail = () => {
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
    const randomString = Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
    const randomDomain = domains[Math.floor(Math.random() * domains.length)]; // Pick a random domain
    return `${randomString}@${randomDomain}`;
}