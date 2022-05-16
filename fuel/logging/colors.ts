const CLEAR = "\033[39m";
const CLEAR_BG = "\u001b[0m";

module.exports = {
    colors: true,
    useColors(onOrOff) {
        this.colors = onOrOff;
    },
    red(msg) {
        if (this.colors) {
            return ["\033[38;2;255;0;0m", msg, CLEAR].join("");
        } else {
            return msg;
        }
    },
    green(msg) {
        if (this.colors) {
            return ["\033[38;2;0;255;0m", msg, CLEAR].join("");
        } else {
            return msg;
        }
    },
    cyan(msg) {
        if (this.colors) {
            return ["\033[38;2;0;190;190m", msg, CLEAR].join("");
        } else {
            return msg;
        }
    },
    grey(msg) {
        if (this.colors) {
            return ["\033[38;2;90;90;90m", msg, CLEAR].join("");
        } else {
            return msg;
        }
    },
    yellow(msg) {
        if (this.colors) {
            return ["\033[38;2;255;255;0m", msg, CLEAR].join("");
        } else {
            return msg;
        }
    },
    magenta(msg) {
        if (this.colors) {
            return ["\033[38;2;255;0;255m", msg, CLEAR].join("");
        } else {
            return msg;
        }
    },
    redBG(msg) {
        if (this.colors) {
            return [
                "\u001b[41;1m",
                // "\033[38;2;50;50;50m",
                msg,
                CLEAR,
                CLEAR_BG
            ].join("");
        } else {
            return msg;
        }
    },
    greenBG(msg) {
        if (this.colors) {
            return [
                "\u001b[42;1m",
                // "\033[38;2;50;50;50m",
                msg,
                CLEAR,
                CLEAR_BG
            ].join("");
        } else {
            return msg;
        }
    },
    greyBg(msg) {
        if (this.colors) {
            return [
                "\u001b[7m",
                // "\033[38;2;50;50;50m",
                msg,
                CLEAR,
                CLEAR_BG
            ].join("");
        } else {
            return msg;
        }
    },
    formatError(msg) {
        if (this.colors) {
            return this.red("ERR!") + " " + msg;
        } else {
            return msg;
        }
    },
    formatWarn(msg) {
        if (this.colors) {
            return this.yellow("warn") + " " + msg;
        } else {
            return msg;
        }
    },
    formatDebug(msg) {
        if (this.colors) {
            return this.magenta("debug") + " " + msg;
        } else {
            return msg;
        }
    }
}