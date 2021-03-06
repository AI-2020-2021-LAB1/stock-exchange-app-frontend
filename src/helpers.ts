export function formatDate(date: string): string {
    return new Date(date).toLocaleString();
    // return `${date.substring(
    //     0,
    //     10,
    // )} ${date.substring(11, 19)}`;
}

export function formatNumericDate(date: number): string {
    return new Date(date).toLocaleString();
}

export function formatTime(): string {
    const time = new Date();
    return `${time.getHours() < 10 ? '0' + time.getHours() : time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()} `;
}

export function formatDateBenchmark(): string {
    const time = new Date();
    return `${time.getUTCFullYear()}-${(time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)}-${time.getDate() < 10 ? '0' + time.getDate() : time.getDate()}`;
}

