/**
 * Prints "Hello World" to the console
 */
export const sayHello = () => {
    console.log("Hello World2");
}

type CountdownOptions = {
    seconds: number;
    onTick?: (remaining: number) => void;
    onDone?: () => void;
};

export const startCountdown = (options: CountdownOptions) => {
    let remaining = Math.max(0, Math.floor(options.seconds));
    options.onTick?.(remaining);

    const timer = setInterval(() => {
        remaining -= 1;
        options.onTick?.(Math.max(0, remaining));

        if (remaining <= 0) {
            clearInterval(timer);
            options.onDone?.();
        }
    }, 1000);

    return () => clearInterval(timer);
};
