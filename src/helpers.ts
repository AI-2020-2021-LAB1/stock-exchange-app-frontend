export function formatDate(date: string) {
    return `${date.substring(
        0,
        10,
    )} ${date.substring(11, 19)}`;
}
