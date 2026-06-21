/**
 * This is the main entry point for the 'lightweight-charts-line-tools-fib-retracement' plugin.
 * It exports the LineToolFibRetracement class and a registration function for the core plugin.
 */
import { LineToolFibRetracement } from './model/LineToolFibRetracement';
import { ILineToolsPlugin } from 'lightweight-charts-line-tools-core';
/**
 * Registers the Fibonacci Retracement tool with the provided Core Plugin instance.
 *
 * @param corePlugin - The instance of the Core Line Tools Plugin.
 * @returns void
 *
 * @example
 * ```ts
 * registerFibRetracementPlugin(corePlugin);
 * ```
 */
export declare function registerFibRetracementPlugin<HorzScaleItem>(corePlugin: ILineToolsPlugin & {
    registerLineTool: <H>(type: string, toolClass: new (...args: any[]) => any) => void;
}): void;
export { LineToolFibRetracement, };
export default registerFibRetracementPlugin;
