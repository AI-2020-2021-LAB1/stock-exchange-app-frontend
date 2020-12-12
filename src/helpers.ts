export function formatDate(date: string) {
    return `${date.substring(
        0,
        10,
    )} ${date.substring(11, 19)}`;
}

export function formatTime() {
    const time = new Date();
    return `${time.getHours()}:${time.getMinutes()}`;
}

export function formatDateBenchmark() {
    const time = new Date();
    return `${time.getUTCFullYear()}-${(time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)}-${time.getDate() < 10 ? '0' + time.getDate() : time.getDate()}`;
}

