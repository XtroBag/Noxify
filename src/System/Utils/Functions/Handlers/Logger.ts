import { getLoggerIssueMessage, getLoggerErrorMessage, getLoggerLogMessage, getLoggerWarnMessage, getDebugIssueMessage } from "../../../../config.js";

export default class Logger {
    public static log(message: string, data?: any): void {
        console.log(getLoggerLogMessage(message), data || "");
    };

    public static warn(message: string, data?: any): void {
        console.log(getLoggerWarnMessage(message), data || "");
    };

    public static error(message: string, data?: any): void {
        console.log(getLoggerErrorMessage(message), data || "");
    };
    public static issue(message: string, data?: any): void {
        console.log(getLoggerIssueMessage(message), data || "");
    }
    public static debug(message: string, data?: any): void {
        console.log(getDebugIssueMessage(message), data || "")
    }
}