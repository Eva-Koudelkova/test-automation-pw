export function generateRandomEmail(): string {
    const randomNumber = Math.floor(Math.random() * 10_000);
    const padded = randomNumber.toString().padStart(4, '0');
    return `Jane.Doe${padded}@jd.com`;
}

export function generateRandomName(): string {
    const randomNumber = Math.floor(Math.random() * 10_000);
    const padded = randomNumber.toString().padStart(4, '0');
    return `Doe ${padded}`;
}
