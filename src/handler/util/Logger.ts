import { getLoggerIssueMessage, getLoggerErrorMessage, getLoggerLogMessage, getLoggerWarnMessage } from "../../config";

export default class Logger {
    public static log(message: string, data?: any): void {
        console.info(getLoggerLogMessage(message), data || "");
    };

    public static warn(message: string, data?: any): void {
        console.warn(getLoggerWarnMessage(message), data || "");
    };

    public static error(message: string, data?: any): void {
        console.error(getLoggerErrorMessage(message), data || "");
    };
    public static issue(message: string, data?: any): void {
        console.log(getLoggerIssueMessage(message), data || "");
    }
}